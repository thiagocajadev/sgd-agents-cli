# Go — Project Conventions

> Universal principles in `../../core/staff-dna.md`. This file: Go-specific decisions only.

<ruleset name="GoConventions">

## Error Handling

- Explicit `(T, error)`; no exceptions, no `panic` for business logic
- Wrap with `fmt.Errorf("ctx: %w", err)` for traceability
- Sentinel `var` for simple errors; custom `type` with `Error()` when needed; `errors.Is`/`errors.As` for comparison
- Never: ignore errors (`_`); `panic` for business rules; swallow errors

```go
type AppError struct {
    Message string
    Code    string
}
func (e *AppError) Error() string { return fmt.Sprintf("[%s] %s", e.Code, e.Message) }

func FindUser(ctx context.Context, id string) (*User, error) {
    if id == "" {
        return nil, &AppError{Message: "id is required", Code: "INVALID_ID"}
    }
    user, err := db.QueryUser(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("FindUser: %w", err)
    }
    return user, nil
}
```

## HTTP & API

- `net/http` (preferred) or Echo/Fiber; vertical slice per feature/package
- DI: manual — explicit dependency passing via structs; constructor functions (`New...`); avoid containers
- Interfaces defined by consumer, not provider; small (1-2 methods); `-er` suffix for single-method
- `context.Context` first param of every I/O or cancelable function

```go
type UserFinder interface {
    FindByID(ctx context.Context, id string) (*User, error)
}

type OrderService struct { users UserFinder }
func NewOrderService(users UserFinder) *OrderService { return &OrderService{users: users} }

func (s *Service) CreateOrder(ctx context.Context, input CreateOrderRequest) (*Order, error) {
    user, err := s.users.FindByID(ctx, input.UserID)
    if err != nil { return nil, fmt.Errorf("CreateOrder: %w", err) }
    return s.orders.Save(ctx, newOrder(user, input))
}
```

## Testing

- Built-in `testing`; table-driven tests preferred; naming: `TestShouldDoXWhenY`
- Small interfaces for mocking; mock only external I/O

```go
func TestParseVersion(t *testing.T) {
    tests := []struct {
        name string; input string; want float64; wantErr bool
    }{
        {"simple", "10", 10, false},
        {"decimal", "3.14", 3.14, false},
        {"empty", "", 0, true},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := ParseVersion(tt.input)
            if (err != nil) != tt.wantErr { t.Errorf("error = %v, wantErr %v", err, tt.wantErr) }
            if got != tt.want { t.Errorf("got %v, want %v", got, tt.want) }
        })
    }
}
```

## Types & Contracts

- `struct` for data; small interfaces defined by consumer
- No nulls — use zero values; pointers only when strictly necessary
- Well-defined JSON tags; never expose internal structs

## Go-Specific Delta

- Idiomatic > "beautiful architecture"; simplicity is the standard
- Short clear names; exported = PascalCase; unexported = camelCase; acronyms caps (`ID`, `HTTP`)
- Early return for errors — no `else` after `return err`
- Focused packages by responsibility; avoid god structs/packages
- Managed goroutines (`errgroup`, `WaitGroup`); never fire-and-forget
- `defer` immediately after resource acquisition
- Structured logging (`slog`); package names: lowercase, single word, no underscores
- `for` loops for all collection operations

```go
// Concurrency with errgroup
func ProcessBatch(ctx context.Context, items []Item) error {
    g, ctx := errgroup.WithContext(ctx)
    for _, item := range items {
        g.Go(func() error { return processItem(ctx, item) })
    }
    return g.Wait()
}
```

</ruleset>
