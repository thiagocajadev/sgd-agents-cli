# Swift — Project Conventions

> Universal principles in `../../core/staff-dna.md`. This file: Swift-specific decisions only.

<ruleset name="SwiftConventions">

## Error Handling

- `Result<T, Error>` in domain; `throw` only for unexpected failures
- Typed `enum` with context; avoid `NSError` in domain
- Never: `throw` for business rules; `try!`; ignore errors

```swift
enum AppError: Error {
    case userNotFound(id: String)
    case insufficientBalance(needed: Double, available: Double)
    case databaseError(underlying: Error)
}

func fetchUser(id: String) async -> Result<User, AppError> {
    do { return .success(try await db.queryUser(id: id)) }
    catch { return .failure(.databaseError(underlying: error)) }
}
```

## HTTP & API

- `URLSession` or abstracted layer; centralized typed client; `Codable` standard
- Never: call API from View; spread request logic

## Testing

- XCTest; naming: `test_shouldDoX_whenY`
- Protocols for abstraction; mock only external I/O

## Types & Contracts

- `struct` for data; `protocol` for contracts
- `Optional` conscious; immutability default (`let`); `Codable` DTOs separated from domain

## Swift-Specific Delta

- Prefer `struct` (value types) over classes when identity not required
- `async/await` for async I/O; avoid excessive Combine
- View renders only; ViewModel/Coordinator orchestrates; organize by feature
- `camelCase` vars/functions; `PascalCase` types
- `map` for pure 1-to-1 transforms; `for` loops for accumulation

```swift
let userIds = users.filter { $0.isActive }.map { $0.id }

var total: Double = 0
for item in order.items { total += Double(item.qty) * item.price }
```

</ruleset>
