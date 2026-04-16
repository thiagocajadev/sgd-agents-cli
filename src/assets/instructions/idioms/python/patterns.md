# Python — Project Conventions

> Universal principles in `../../core/staff-dna.md`. This file: Python-specific decisions only.

<ruleset name="PythonConventions">

## Error Handling

- Result Pattern in the domain (`Result[T]`); exceptions only for unexpected failures
- Result explicitly returned in business flows; exceptions bubble to framework global handler
- Never: exception for business rules; `except: pass`; bare `except:`; leak internal details

```python
@dataclass
class ApiError:
    message: str
    code: str

@dataclass
class Result(Generic[T]):
    is_success: bool
    is_failure: bool
    value: T | None = None
    error: ApiError | None = None

    @classmethod
    def success(cls, value: T) -> "Result[T]":
        return cls(is_success=True, is_failure=False, value=value)

    @classmethod
    def fail(cls, message: str, code: str) -> "Result[T]":
        return cls(is_success=False, is_failure=True, error=ApiError(message, code))
```

## HTTP & API

- FastAPI — type hints, performance, integrated validation
- Vertical slice per feature; DI via `Depends()`; constructor injection in services

```python
class OrderService:
    def __init__(self, repo: OrderRepository, notifier: Notifier):
        self._repo = repo
        self._notifier = notifier

    async def create_order(self, request: CreateOrderRequest) -> Result[Order]:
        order = await self._repo.save(Order.from_request(request))
        await self._notifier.send(order)
        return Result.success(order)

@router.post("/orders", status_code=201)
async def create_order(
    request: CreateOrderRequest, service: OrderService = Depends(get_order_service),
) -> OrderResponse:
    result = await service.create_order(request)
    if result.is_failure:
        raise HTTPException(status_code=422, detail=result.error.message)
    return OrderResponse.model_validate(result.value)
```

## Testing

- pytest; naming: `test_should_do_x_when_y`
- `pytest-mock` / `unittest.mock.AsyncMock`; mock only external I/O; never mock domain

```python
@pytest.fixture
def order_service(mock_repo, mock_notifier):
    return OrderService(repo=mock_repo, notifier=mock_notifier)

async def test_create_order_returns_success(order_service):
    result = await order_service.create_order(CreateOrderRequest(product_id="abc", quantity=2))
    assert result.is_success
    assert result.value.product_id == "abc"
```

## Types & Contracts

- Type hints mandatory in public functions; `X | None` (3.10+) over `Optional[X]`
- `BaseModel` (Pydantic) for Request/Response; `@dataclass` for internal models
- Validation via Pydantic integrated with FastAPI; never reuse Request as Response

```python
class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class UserResponse(BaseModel):
    id: UUID
    email: str
    model_config = ConfigDict(from_attributes=True)
```

## Python-Specific Delta

- Functions when no coupled state; avoid unnecessary classes
- Async for I/O; `asyncio.gather` for concurrency; `asyncio.to_thread` for bridging sync
- Comprehensions for simple 1-to-1 transforms; `for` loops for complex logic/accumulation
- Avoid excessive "magic" (complex decorators, metaprogramming)
- `snake_case` vars/functions/modules; `PascalCase` classes; `SCREAMING_SNAKE_CASE` constants

```python
# ✅ Comprehension for simple map
active_emails = [u.email for u in users if u.is_active]

# ✅ For loop for complex logic
total = 0
for item in order.items:
    total += item.qty * item.price
```

</ruleset>
