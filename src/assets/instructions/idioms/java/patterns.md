# Java — Project Conventions

> Universal principles in `../../core/staff-dna.md`. This file: Java/Spring-specific decisions only.

<ruleset name="JavaConventions">

## Error Handling

- Result Pattern in the domain (`sealed interface Result<T>`); exceptions only for unexpected failures
- Result explicitly returned in business flows; exceptions bubble to `@ControllerAdvice`
- Domain errors: standard object (`code`, `message`); enum for categorization
- Never: exception for business rules; empty `catch`; leak internal details

```java
public sealed interface Result<T> {
    record Success<T>(T value) implements Result<T> {}
    record Failure<T>(String message, String code) implements Result<T> {}
    static <T> Result<T> success(T value) { return new Success<>(value); }
    static <T> Result<T> failure(String msg, String code) { return new Failure<>(msg, code); }
}

// Controller — pattern matching (Java 21+)
return switch (useCase.execute(request)) {
    case Result.Success<User>(var user) -> ResponseEntity.status(201).body(UserPresenter.present(user));
    case Result.Failure<User>(var msg, var code) -> mapErrorToResponse(msg, code);
};

// Global exception handler
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ConstraintViolationException ex) {
        var message = ex.getConstraintViolations().stream().map(ConstraintViolation::getMessage).collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(new ErrorResponse(message, "VALIDATION_ERROR"));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity.internalServerError().body(new ErrorResponse("Internal error", "INTERNAL"));
    }
}
```

## HTTP & API

- Spring Boot; vertical slice per feature
- Constructor injection mandatory; `@RequiredArgsConstructor` (Lombok); never `@Autowired` on field
- Virtual Threads: `spring.threads.virtual.enabled=true`; standard imperative code; avoid WebFlux unless strictly necessary

```java
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepo;
    private final NotificationService notifier;

    public Result<Order> createOrder(CreateOrderRequest request) {
        var order = orderRepo.save(Order.from(request));
        notifier.send(order);
        return Result.success(order);
    }
}
```

## Testing

- JUnit 5 + AssertJ + Mockito; naming: `shouldDoXWhenY`
- Mockito for external deps; never mock the domain

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock private OrderRepository orderRepo;
    @InjectMocks private OrderService orderService;

    @Test
    void createOrder_shouldReturnSuccess() {
        when(orderRepo.save(any())).thenReturn(new Order(UUID.randomUUID(), "product-1", 2));
        var result = orderService.createOrder(new CreateOrderRequest("product-1", 2));
        assertThat(result).isInstanceOf(Result.Success.class);
    }
}

// Integration — Testcontainers
@SpringBootTest @Testcontainers
class UserRepositoryIT {
    @Container static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");
    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry r) { r.add("spring.datasource.url", postgres::getJdbcUrl); }
    @Autowired private UserRepository repo;

    @Test void save_shouldPersistUser() {
        var user = new User(UUID.randomUUID(), "test@test.com");
        repo.save(user);
        assertThat(repo.findById(user.getId())).isPresent();
    }
}
```

## Types & Contracts

- `record` for Request/Response DTOs; each layer owns its types; never expose JPA entities
- `Optional` only as method return (not field/parameter)
- Bean Validation (`jakarta.validation`) at input; never in domain

```java
public record CreateUserRequest(@NotBlank String email) {}
public record ValidatedCreateUser(String email) {
    public ValidatedCreateUser { email = email.trim().toLowerCase(); }
}
```

## Java-Specific Delta

- `record` for DTOs; Lombok with moderation
- `@Transactional` at service level; never cascaded without necessity
- Imperative loops for complex transforms; streams for pure 1-to-1 filter+map
- PascalCase classes; camelCase methods/vars; `SCREAMING_SNAKE_CASE` constants
- No `I` prefix; descriptive impl names (`JpaOrderRepository`, not `OrderRepositoryImpl`)
- Boolean methods: `is`, `has`, `can` prefix

```java
// ✅ Streams for trivial transform
var activeEmails = users.stream().filter(User::isActive).map(User::getEmail).toList();

// ✅ For-each for complex logic
var results = new ArrayList<Result>();
for (var item : items) {
    var intermediate = compute(item);
    if (intermediate.isValid()) results.add(format(intermediate));
}
```

</ruleset>
