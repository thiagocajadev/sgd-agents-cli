# Rust — Project Conventions

> Universal principles in `../../core/staff-dna.md`. This file: Rust-specific decisions only.

<ruleset name="RustConventions">

## Error Handling

- `Result<T, E>` as absolute standard; `panic!` only for unrecoverable bugs
- `?` for propagation; wrapping with context when necessary
- Typed `enum` with `thiserror`; `anyhow::Result` at app level
- Never: `panic!` for business rules; `.unwrap()`/`.expect()` outside tests; swallow errors

```rust
#[derive(thiserror::Error, Debug)]
pub enum OrderError {
    #[error("User not found: {0}")]
    UserNotFound(String),
    #[error("Insufficient balance: need {needed}, have {available}")]
    InsufficientBalance { needed: f64, available: f64 },
    #[error(transparent)]
    Database(#[from] sqlx::Error),
}

pub async fn create_order(user_id: &str, amount: f64) -> Result<Order, OrderError> {
    let user = find_user(user_id).await?;
    let balance = check_balance(&user).await?;
    if balance < amount {
        return Err(OrderError::InsufficientBalance { needed: amount, available: balance });
    }
    save_order(&user, amount).await
}
```

## HTTP & API

- Axum (preferred) or Actix Web; vertical slice per feature/module
- DI: explicit dependency passing via structs; `Arc` when needed; avoid containers
- One trait per behavior; `impl Trait` over `dyn Trait` unless dynamic dispatch required

```rust
pub trait UserRepository: Send + Sync {
    async fn find_by_id(&self, id: &str) -> Result<Option<User>, DbError>;
    async fn save(&self, user: &User) -> Result<(), DbError>;
}

pub struct OrderService<R: UserRepository> { users: R }
```

## Testing

- Built-in `cargo test` + `#[cfg(test)]`; `#[tokio::test]` for async
- Naming: `should_do_x_when_y`; mock only external I/O

```rust
#[cfg(test)]
mod tests {
    use super::*;
    #[tokio::test]
    async fn create_order_should_fail_on_insufficient_balance() {
        let result = create_order("user-1", 9999.0).await;
        assert!(matches!(result, Err(OrderError::InsufficientBalance { .. })));
    }
}
```

## Types & Contracts

- `struct` for data; `trait` for contracts
- `Option<T>` and `Result<T, E>` replace null/exceptions
- `serde` for DTO serialization; never expose internal structs
- Prefer `&T`, `&mut T`; clone only when strictly necessary

```rust
fn normalize_path(path: &str) -> Cow<'_, str> {
    if path.starts_with('/') { Cow::Borrowed(path) }
    else { Cow::Owned(format!("/{path}")) }
}
```

## Rust-Specific Delta

- Ownership/borrowing respected — no unnecessary clones
- `match` explicit and exhaustive; no catch-all `_` unless intentional
- Modules by feature (`mod orders`, not `mod utils`); zero-cost abstractions
- Async with `tokio`; never block runtime (`spawn_blocking` for CPU-heavy)
- `PascalCase` types/traits/enums; `snake_case` functions/vars/modules; `SCREAMING_SNAKE_CASE` constants
- `map` for pure 1-to-1 transforms; `for` loops for accumulation/complex logic

```rust
// Async concurrency
let (profile, orders) = tokio::join!(fetch_profile(id), fetch_orders(id));
Ok(Dashboard { profile: profile?, orders: orders? })

// ✅ map for transform; for loop for accumulation
let uids: Vec<String> = users.iter().filter(|u| u.is_active).map(|u| u.uid.clone()).collect();
let mut total = 0.0;
for item in &order.items { total += item.qty as f64 * item.price; }
```

</ruleset>
