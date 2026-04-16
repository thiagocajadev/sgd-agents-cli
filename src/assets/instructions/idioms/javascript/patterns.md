# JavaScript — Project Conventions

> Universal principles in `staff-dna.md`. This file: language-specific decisions only.

<ruleset name="JavaScriptConventions">

## Error Handling

- **Default**: Result Pattern in domain (`Result<T>`); `throw` only for unexpected failures
- **Domain errors**: Standardized `Error` object (`code`, `message`); enum-like const objects when needed
- **Never**: `throw` for business rules; empty `catch`; leak internal details
- **Global**: Backend → middleware; Frontend → error boundaries + interceptors

> <rule name="ResultPatternJS">

JSDoc provides type hints; runtime shape identical to TypeScript version.

```javascript
/** @template T @typedef {{ ok: true, data: T, error: null } | { ok: false, data: null, error: string }} Result */

function ok(data) {
  return { ok: true, data, error: null, isSuccess: true, isFailure: false };
}
function fail(error) {
  return { ok: false, data: null, error, isSuccess: false, isFailure: true };
}
```

`fail` receives error **code** string (e.g. `fail('ORDER_EMPTY')`). HTTP adapter translates at boundary.

> </rule>

---

## HTTP & API

- **Framework**: Fastify (preferred) or Express
- **Style**: API First + BFF — shaped for frontend consumer
- **Routes**: Vertical slice per feature; auth in hooks/middleware; validation at boundary
- **DI**: Manual via factory functions; explicit dependencies; no heavy containers

---

## Testing

- **Framework**: Vitest (preferred) or Jest; `node:test` for scripts without build
- **Style**: Flat, behavior-focused; naming `shouldDoXWhenY`
- **Mocks**: External I/O only; never mock business rules

> <rule name="NodeTest">

```javascript
import test from 'node:test';
import assert from 'node:assert';
import { sum } from './math.js';

test('sum adds two numbers', () => {
  assert.strictEqual(sum(1, 2), 3);
});
```

> </rule>

---

## Types & Contracts

- **Strictness**: Prefer TypeScript; `strict: true`; avoid `any`
- **DTOs**: Types for DTOs; interfaces for public contracts; never expose internals
- **Validation**: Zod (preferred) or Yup; always validate at boundary

> <rule name="JSDocTypes">

```javascript
/** @typedef {Object} UserProfile @property {string} id @property {string} email @property {boolean} [isAdmin] */
/** @param {UserProfile} profile */
function syncProfile(profile) { ... }
```

> </rule>

---

## JavaScript-Specific Delta

- `async/await` standard — avoid `.then()` chains
- Never mix sync/async without clear necessity
- Structure code by feature, not by technical type
- Pure functions and functional composition; avoid classes when composition works
- `map` for pure 1-to-1 transforms; avoid `reduce` — use `for...of` with named variables

> <rule name="FunctionalCollections">

```javascript
// map — 1-to-1 transformation
const activeUsers = users.filter((u) => u.isActive).map((u) => ({ id: u.id, name: u.fullName }));

// for...of — accumulation
let total = 0;
for (const item of order.items) {
  total += item.qty * item.price;
}
```

> </rule>

## Module Pattern

> <rule name="RevealingModule">
> All logic first, then single named export object. **Never `export default`.**

```javascript
const saveUser = (user) => { ... };
const deleteUser = (id) => { ... };
const _buildAuditLog = (action) => { ... }; // private

export const UserService = { saveUser, deleteUser };
```

**Why named export:** IDE resolves correct name; bundlers tree-shake by symbol; `import { x }` is a contract.

> <rule name="ESMExtensionMandate">
> Always use explicit `.js`/`.mjs` extensions in local imports. Node.js ESM requires full specifiers.
> </rule>

> </rule>

## Operational Resilience

> <rule name="NodeDiscovery">
> Shell hooks: discover `node`/`npm` if missing from `$PATH`. Prevents failures in restricted environments.

```bash
if ! command -v node >/dev/null 2>&1; then
  export PATH="$PATH:/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin"
  [ -f "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" && nvm use --silent >/dev/null 2>&1
  [ -f "$HOME/.asdf/asdf.sh" ] && . "$HOME/.asdf/asdf.sh" >/dev/null 2>&1
fi
if ! command -v node >/dev/null 2>&1; then echo "Error: node not found"; exit 1; fi
```

> </rule>

</ruleset>
