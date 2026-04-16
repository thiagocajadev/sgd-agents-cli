# Flutter (Dart) — Project Conventions

> Universal principles in `../../core/staff-dna.md`. This file: Flutter/Dart-specific decisions only.

<ruleset name="FlutterConventions">

## Error Handling

- Result Pattern (`Result<T>`) in domain; `throw` only for unexpected failures
- Sealed classes via `freezed` for union types; explicit Result between layers
- Never: exception for business rules; swallow errors; expose technical errors in UI

```dart
@freezed
class Result<T> with _$Result<T> {
  const factory Result.success(T data) = Success<T>;
  const factory Result.failure(String message, String code) = Failure<T>;
}

final result = await _useCase.execute(request);
state = result.when(
  success: (data) => state.copyWith(data: data, isLoading: false),
  failure: (msg, code) => state.copyWith(errorMessage: msg, isLoading: false),
);
```

## HTTP & API

- Dio (preferred) or `http`; centralized typed API client
- `json_serializable` or `freezed` for serialization
- Never: call API from widget; mix parsing with UI

## Testing

- `flutter_test` / `mocktail`; naming: `shouldDoXWhenY`
- Mock only external I/O; domain always real

## Types & Contracts

- Immutable by default (`const`, `final`); `freezed` for complex DTOs/states
- Null safety mandatory; avoid `!`; DTOs separated from domain

## Flutter-Specific Delta

- Widget = rendering only; no business logic in `build()`
- Logic in Controller/ViewModel; state via Riverpod or BLoC
- Strong componentization; organization by feature
- `camelCase` vars/functions; `PascalCase` classes; `snake_case` files
- `map` for pure 1-to-1 transforms; `for` loops for accumulation

```dart
final userWidgets = users.where((u) => u.isActive).map((u) => UserCard(user: u)).toList();

double total = 0;
for (final item in order.items) { total += item.qty * item.price; }
```

</ruleset>
