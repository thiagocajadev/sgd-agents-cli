# Kotlin — Project Conventions

> Universal principles in `../../core/staff-dna.md`. This file: Kotlin-specific decisions only.

<ruleset name="KotlinConventions">

## Error Handling

- `Result<T>` / `sealed class` in domain; exceptions only for unexpected failures
- Explicit Result between layers; never exception for business rules

```kotlin
sealed class Result<out T> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Failure(val message: String, val code: String) : Result<Nothing>()
}

return when (val result = useCase.execute(request)) {
    is Result.Success -> ResponseEntity.ok(result.data)
    is Result.Failure -> mapError(result)
}
```

## HTTP & API

- Ktor (preferred) or Spring Boot; vertical slice per feature
- DI: manual or Koin; avoid heavy containers

## Testing

- JUnit 5 + Kotlin Test / MockK; naming: `shouldDoXWhenY`
- Mock only external I/O; never mock domain

## Types & Contracts

- `data class` for DTOs; `interface` for contracts
- Default null safety; avoid `!!`; DTOs separated from domain

## Kotlin-Specific Delta

- `data class` default for immutable data; `sealed class` for states/errors
- `val` default; `var` only when mutation strictly necessary
- Coroutines (`suspend`) for async I/O; `Flow` for streams
- No logic in Android View/Composable — ViewModel orchestrates
- `camelCase` vars/functions; `PascalCase` classes; `SCREAMING_SNAKE_CASE` constants
- `map` for pure 1-to-1 transforms; `for` loops for accumulation

```kotlin
val userNames = users.filter { it.isActive }.map { it.fullName }

var total = 0
for (item in order.items) { total += item.qty * item.price }
```

</ruleset>
