# C# — Project Conventions

> Universal principles in `../../core/staff-dna.md`. This file: C#/.NET-specific decisions only.

<ruleset name="CSharpConventions">

## Error Handling

- Result Pattern in the domain (`Result<T>` via sealed record); exceptions only for unexpected failures
- Result explicitly returned in business flows; exceptions bubble to global middleware
- Domain errors: `sealed record ApiError(string Message, string Code)`; pattern match for mapping
- Never: `throw` for business rules; `.Result`/`.Wait()` in async; leak internal details

```csharp
public sealed record ApiError(string Message, string Code);

public record Result<T>(bool IsSuccess, bool IsFailure, T? Value, ApiError? Error)
{
    public static Result<T> Success(T value) => new(true, false, value, null);
    public static Result<T> Fail(string msg, string code) => new(false, true, default, new ApiError(msg, code));
}

// Pattern matching
public IActionResult GetOrder(Result<Order> result) => result switch
{
    { IsSuccess: true, Value: var o } => Ok(o),
    { IsFailure: true, Error: var e } => MapError(e),
    _ => Problem()
};
```

## HTTP & API

- ASP.NET Core — Minimal APIs (preferred) or Controllers
- Vertical slice per feature (`Features/Orders/OrderEndpoints.cs`)
- DI: Constructor injection via primary constructors; registration in `Program.cs`; never service locator

```csharp
public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/orders").WithTags("Orders");
        group.MapPost("/", CreateOrder);
        group.MapGet("/{id:guid}", GetOrder);
    }

    private static async Task<IResult> CreateOrder(
        CreateOrderRequest request, OrderService service, CancellationToken ct)
    {
        var result = await service.CreateOrderAsync(request, ct);
        return result switch
        {
            { IsSuccess: true, Value: var v } => Results.Ok(new { success = true, error = (object?)null, data = v }),
            { IsFailure: true, Error: var e } => Results.Json(
                new { success = false, error = new { e!.Code, e.Message }, data = (object?)null },
                statusCode: e.Code switch { "NOT_FOUND" => 404, "UNAUTHORIZED" => 401, "FORBIDDEN" => 403, "CONFLICT" => 409, "INVALID_INPUT" => 400, _ => 422 }),
            _ => Results.Problem()
        };
    }
}

// DI — primary constructor
public class OrderService(IOrderRepository repo, INotifier notifier)
{
    public async Task<Result<Order>> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct = default)
    {
        var order = await repo.SaveAsync(Order.From(request), ct);
        await notifier.SendAsync(order, ct);
        return Result<Order>.Success(order);
    }
}
```

## Testing

- xUnit + FluentAssertions + NSubstitute
- Naming: `MethodName_ShouldDoX_WhenY`
- Mocks: NSubstitute for external deps; never mock the domain

```csharp
public class OrderServiceTests
{
    private readonly IOrderRepository _repo = Substitute.For<IOrderRepository>();
    private readonly INotifier _notifier = Substitute.For<INotifier>();
    private readonly OrderService _sut;

    public OrderServiceTests() => _sut = new OrderService(_repo, _notifier);

    [Fact]
    public async Task CreateOrder_ShouldReturnSuccess()
    {
        _repo.SaveAsync(Arg.Any<Order>(), Arg.Any<CancellationToken>())
             .Returns(new Order(Guid.NewGuid(), "prod-1", 2));
        var result = await _sut.CreateOrderAsync(new CreateOrderRequest("prod-1", 2));
        result.IsSuccess.Should().BeTrue();
        result.Value!.ProductId.Should().Be("prod-1");
    }
}

// Integration
public class OrdersApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task CreateOrder_ReturnsCreated()
    {
        var response = await factory.CreateClient().PostAsJsonAsync("/api/orders", new { ProductId = "abc", Quantity = 2 });
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
```

## Types & Contracts

- `record` for Request/Response DTOs; each layer owns its types; never expose EF entities
- Validation at boundary — factory method with Result, or FluentValidation for complex rules
- All I/O `async Task<T>`; `Async` suffix; `CancellationToken` in public APIs
- PascalCase public; `_camelCase` private; `I` prefix interfaces

```csharp
public record CreateOrderRequest(string ProductId, int Quantity)
{
    public static Result<CreateOrderRequest> Create(string productId, int quantity)
    {
        if (string.IsNullOrWhiteSpace(productId)) return Result<CreateOrderRequest>.Fail("Product ID required.", "INVALID_PRODUCT_ID");
        if (quantity < 1) return Result<CreateOrderRequest>.Fail("Quantity ≥ 1.", "INVALID_QUANTITY");
        return Result<CreateOrderRequest>.Success(new(productId, quantity));
    }
}
```

### Async Concurrency

```csharp
public async Task<Result<Dashboard>> GetDashboardAsync(string userId, CancellationToken ct = default)
{
    var profileTask = _users.FindByIdAsync(userId, ct);
    var ordersTask = _orders.GetRecentAsync(userId, ct);
    await Task.WhenAll(profileTask, ordersTask);
    return Result<Dashboard>.Success(new(await profileTask, await ordersTask));
}
```

## LINQ & Collections

- Readability over chaining; LINQ for data transform, not business logic
- `foreach` for complex logic or accumulation
- Materialize (`.ToList()`) only at boundaries; default `IEnumerable<T>`
- LINQ must be pure — no side effects inside queries

```csharp
// ✅ LINQ for transform; foreach for accumulation
var recentOrders = orders.Where(o => o.Status == "CONFIRMED" && o.CreatedAt > DateTime.UtcNow.AddDays(-30)).ToList();
var summaries = recentOrders.GroupBy(o => o.CustomerId).Select(g => BuildCustomerSummary(g)).OrderByDescending(s => s.Total).ToList();

static CustomerSummary BuildCustomerSummary(IGrouping<Guid, Order> group)
{
    decimal total = 0;
    foreach (var order in group)
    foreach (var item in order.Items)
        total += item.Price * item.Qty;
    return new CustomerSummary(group.Key, total);
}
```

## Data Access — EF Core

> Data access rules in [Universal Data Access Principles](../../core/data-access.md).

- `DbContext` Scoped (one per request); `AsNoTracking()` for read-only; never Singleton
- Always project to DTOs via `.Select()`; never expose EF entities to API
- Lazy loading disabled; `.Include()` for known graphs; `AsSplitQuery()` for multiple collections

```csharp
// Projection
public async Task<ProductDetail?> GetProductDetailAsync(Guid id, CancellationToken ct) =>
    await _context.Products.Where(p => p.Id == id)
        .Select(p => new ProductDetail(p.Id, p.Name, p.Price, p.Category.Name, p.Reviews.Count))
        .FirstOrDefaultAsync(ct);

// N+1 prevention
var orders = await _context.Orders
    .Include(o => o.Items).Include(o => o.Payments).AsSplitQuery()
    .Where(o => o.CustomerId == customerId).ToListAsync(ct);
```

</ruleset>
