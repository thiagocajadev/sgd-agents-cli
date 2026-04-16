# TypeScript — Project Conventions

> Universal principles in `staff-dna.md`. This file: language-specific decisions only.

<ruleset name="TypeScriptConventions">

## Error Handling

- **Default**: Result Pattern (`Result<T>`); `throw` only for unexpected runtime/infra failures
- **Domain errors**: Typed object (`code`, `message`); discriminated unions for complex scenarios
- **Never**: `throw` for business rules; empty `catch`; leak internal details
- **Global**: Backend → central middleware; Frontend → error boundaries + interceptors

> <rule name="ResultPatternTS">

Discriminated union on `ok` enables full type narrowing — after `if (result.ok)`, `result.data` is `T`.

```typescript
type Result<T> =
  | { ok: true; data: T; error: null; isSuccess: true; isFailure: false }
  | { ok: false; data: null; error: string; isSuccess: false; isFailure: true };

export const ok = <T>(data: T): Result<T> => ({
  ok: true,
  data,
  error: null,
  isSuccess: true,
  isFailure: false,
});

export const fail = <T>(error: string): Result<T> => ({
  ok: false,
  data: null,
  error,
  isSuccess: false,
  isFailure: true,
});
```

`fail` receives the error **code** string (e.g. `fail('ORDER_EMPTY')`). HTTP adapter translates at the boundary.

> </rule>

---

## HTTP & API

- **Framework**: Fastify (preferred) or Express; NestJS when project requires structured DI
- **Style**: API First + BFF — shaped for the frontend consumer
- **Routes**: Vertical slice per feature; auth via `preHandler`; validation at boundary
- **DI**: Manual via factory functions; NestJS only when project already uses it

---

## Testing

- **Framework**: Vitest (preferred)
- **Style**: Flat, behavior-oriented; naming `shouldDoXWhenY`
- **Mocks**: External I/O only; never mock the domain
- **What to test**: Business rules, error flows (Result), typed contracts

> <rule name="VitestSupertest">

```typescript
it('should create user', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/users',
    payload: { email: 'test@test.com' },
  });
  expect(response.statusCode).toBe(201);
});
```

> </rule>

> <rule name="ReactTestingLibrary">
> Test behavior, not implementation. Use `screen.getByRole` and `userEvent`. Mock hooks that call APIs.
> </rule>

---

## Types & Contracts

- **Type vs interface**: `type` as default; `interface` for public extension/open contracts
- **Strictness**: `strict: true`, `noImplicitAny`, `strictNullChecks`; avoid `any` (use `unknown`)
- **DTOs**: Explicit types for input/output; separated from domain
- **Validation**: Zod (preferred); `safeParse` only (never `parse`); `z.infer` as SSOT

> <rule name="ZodValidation">

```typescript
const parsed = schema.safeParse(input);
if (!parsed.success) return fail('VALIDATION_ERROR');
return ok(parsed.data);
```

> </rule>

---

## Module Pattern

> <rule name="RevealingModule">
> All implementation first, then a single named export object. **Never `export default`.**

```typescript
async function create(data: CreateUserInput): Promise<CreateUserResult> { ... }
async function findOneById(id: string): Promise<User | null> { ... }
function _hashPassword(raw: string): string { ... } // private

export const userRepository = { create, findOneById };
```

When implementing an interface, type the object explicitly for compile-time contract enforcement:

```typescript
export const userRepository: UserRepository = { create, findOneById };
```

**Why named export:** IDE resolves correct name; bundlers tree-shake by symbol; `import { x }` is a contract.

> <rule name="ESMExtensionMandate">
> Always use explicit `.js` extensions in local imports. For TypeScript targeting Node.js ESM, use `.js` in source even for `.ts` files.
> </rule>

> </rule>

---

## TypeScript-Specific Delta

- Discriminated unions for states/errors (not enums)
- Explicit narrowing via type guards; `readonly` by default in DTOs
- Avoid complex overloads — prefer union types
- Explicitly type return values of critical functions
- `map` for pure 1-to-1 transforms; avoid `reduce` — use `for...of` with named variables

---

## Framework Patterns

> <rule name="ReactHooks">
> Components return only JSX. ViewModel from custom hook. Mapper separates raw → ViewModel.

```typescript
export function mapUser(raw: RawUser): UserViewModel {
  return { id: raw.id, displayName: raw.name ?? raw.email };
}

export function useUserProfile(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => axios.get(`/api/users/${id}`),
    select: (r) => mapUser(r.data),
  });
}
```

> </rule>

> <rule name="VerticalDensity">
> One blank line between logical blocks (State/Hooks → Styles → JSX). No blank lines within a block. Comments on the line immediately preceding code.
> </rule>

> <rule name="ReactStyling">
> No horizontal scrolling for Tailwind. Group classes by responsibility in `cn()`. **Rule of 10**: 10+ classes → named `cn` constant mandatory. Break lines per responsibility group.

```tsx
const headerClassName = cn(
  'w-full h-12 flex items-center',
  'p-4 bg-card shadow-xl',
  'text-primary font-bold uppercase',
  'hover:bg-muted transition-all'
);
```

> </rule>

> <rule name="AngularRxJS">
> Logic in Services. `AsyncPipe` for Observables. API results with business logic → Result pattern.
> </rule>

> <rule name="AstroServerSide">
> Fetch and validation in server block (`---`). Only data passed to client islands.
> </rule>

## Operational Resilience

> <rule name="NodeDiscovery">
> Shell hooks (Husky, CI, git hooks): discover `node`/`npm` if missing from `$PATH`. Prevents failures in restricted environments.

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
