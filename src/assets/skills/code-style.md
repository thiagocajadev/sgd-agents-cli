# Code Style — SDG Essentials

<ruleset name="CodeStyle">

> Load in **Phase CODE**. SQL aesthetics in `sql-style.md`; UI copy voice in `writing-soul.md`.

## Security first

- Default deny at every boundary. Fail fast if environment is incomplete.
- Never concatenate user input into queries, commands, paths, or logs — validate at edges, reject what isn't expected.

---

## Code style

- **Functions** 4–20 lines. Name needs "and" → split.
- **Files** under 500 lines. One concern per module (SRP).
- **Names by domain intent**, not storage or implementation detail. Name requires a comment → naming failure.
  - Banned verbs: `handle`, `do`, `run`, `execute`, `perform`; `get` for computations (use `compute` / `calculate` / `derive`).
  - Banned nouns: `data`, `info`, `obj`, `item`, `thing`, `helpers`, `utils`, `common`, `shared`, `misc`.
  - Banned abbreviations: `req` → `request`, `res` → `response`, `ctx` → `context`, plus `idx`, `prev`, `arr`, `val`, `tmp`, `cb`, `fn`, `mgr`, `ctrl`, `svc`.
- **Booleans** carry semantic prefix: `is` / `has` / `can` / `should` / `did` / `needs` / `supports` / `allows`. Never bare `loading`, `error`, `active`.
- **Explaining Returns**: assign to named `const` before every meaningful `return`; no logic / ternary / anonymous object on the return line. Void-terminator form is exempt — a side-effect call (`console.log(msg);`) ends the function with an implicit return. Never ceremonialize into `const X = sideEffect(); return X;`.
- **Narrative Cascade**: entry point first (Stepdown); one-use helpers as siblings below their caller; each function orchestrates OR implements (SLA) — never both.
- **Early returns** over nested conditionals. Max 2 levels of indentation.
- **Immutability default**: `const` / readonly; mutation crosses boundaries explicitly.
- **CQS**: function mutates (command) OR reads (query, pure) — never both.
- **File naming**: `domain.operation.ext` (`order.compute.js`, `user.validate.ts`). Never `helpers.js`, `utils.js`, `common.js`.
- **Types explicit** where the language supports them — no `any`, no untyped public function.
- **No duplication** — extract shared logic when the pattern repeats three times (Rule of Three), not sooner.
- **Exception messages** include the offending value and the expected shape.

---

## Comments

- **WHY, not WHAT** — skip `// increment counter` above `i++`. `// why:` permitted only for hidden constraints (invariants, workarounds, bug references).
- **Keep your own comments on refactor** — they carry intent and provenance.
- **Docstrings on public functions**: intent + one usage example.
- **Reference issue numbers / commit SHAs** when a line exists because of a specific bug or upstream constraint.
- **No section banners** (`// --- Section ---`). No explanatory headers inside a file.

---

## Tests

- **Every new function gets a test.** Bug fixes get a regression test.
- **F.I.R.S.T**: Fast, Independent, Repeatable, Self-validating, Timely.
- **Mock external I/O** (API, DB, filesystem) with named fake classes — not inline stubs.
- Each suite covers **happy path + edge case + expected failure**.

---

## Dependencies

- **Inject** via constructor / parameter — no hidden globals, no module-level singletons for mutable state.
- **Wrap third-party libs** behind a thin interface owned by this project. Swap cost stays bounded.

---

## Structure

- Follow framework convention (Rails, Django, Next.js, Astro, etc.) — don't reinvent the tree.
- Small focused modules over god files.
- Predictable paths: `controller` / `model` / `view`, `src` / `lib` / `test`.

---

## Formatting

- Language default formatter: `prettier`, `gofmt`, `black`, `cargo fmt`, `rubocop -A`. No style debates beyond that.
- No alignment padding for `=` or `:`.
- **Paragraphs of Intent**: 1 blank line between logical groups, 0 within a group, never 2+ consecutive. Wall of tight code and double-blank noise are equal violations.

---

## Logging

- **Structured JSON** for debugging / observability — one event per line, stable keys.
- **Plain text** only for user-facing CLI output.

---

<rule name="PreCodeChecklist">

## Pre-Code Checklist

> Recite before the first `Edit` / `Write` / `NotebookEdit` in Phase CODE. Binary — no partial credit. If any item is uncertain, re-read the relevant section above before writing.

- [ ] **Mental Reset** — named which training default is being suspended for this task (verbose prose, dense walls, auto-summarize, taboo verbs).
- [ ] **Target Files** — explicit path list from approved Plan; no drift.
- [ ] **Naming** — no banned verbs / nouns / abbreviations; booleans carry semantic prefix; files follow `domain.operation.ext`.
- [ ] **Narrative** — Stepdown, SLA, Explaining Returns, guard clauses, ≤2 indent levels.
- [ ] **Comments** — WHY only; no what-comments; docstring on public surfaces.
- [ ] **Tests planned** — new function → test; bug fix → regression test; external I/O mocked.
- [ ] **Security** — boundary inputs validated; no string-concat into queries / commands / paths.
- [ ] **Blockers** — `none` or enumerated.

</rule>

<rule name="PreFinishGate">

## Pre-Finish Gate

> Recite at Phase TEST. Binary pass / fail — no partial credit. Each item is wired to a narrative heuristic validator in `governance.mjs`.

- [ ] **Narrative Siblings**: one-use helpers as siblings below callers.
- [ ] **Explaining Returns**: named `const` above every meaningful `return` (void-terminator exempt).
- [ ] **No framework abbreviations**: `req` / `res` / `ctx` forbidden; plus SDG taboos (banned verbs / nouns / abbrs).
- [ ] **Vertical Density**: 1 blank between groups, 0 within, never 2+.
- [ ] **Revealing Module Pattern**: named export at footer.
- [ ] **Boolean prefix**: `is` / `has` / `can` / `should` / `did` / `needs` / `supports` / `allows`.
- [ ] **No section banners**: no `// --- Section ---` dividers.
- [ ] **Pure entry point**: `run()` as headline caller only (single-statement or canonical 2-statement form).

</rule>

</ruleset>
