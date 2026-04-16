# Project Structure

This document describes every directory and file installed by `sdg-agents init`.

## Installed Tree

```text
your-project/
├── .ai/                         ← Instruction set (committed)
│   ├── skills/                  ← Engineering skills (loaded on-demand per cycle phase)
│   │   ├── AGENTS.md            ← Main entry point + skill registry
│   │   ├── staff-dna.md         ← 8 Engineering Laws (loaded in Phase CODE)
│   │   ├── code-style.md        ← Narrative Cascade, naming, engineering standards
│   │   ├── testing.md           ← Test principles (loaded in Phase CODE/TEST)
│   │   ├── security.md          ← Security boundaries + pipeline rules
│   │   ├── api-design.md        ← API contracts and envelopes
│   │   ├── data-access.md       ← Repository layer and persistence boundaries
│   │   ├── observability.md     ← Logging, metrics, tracing
│   │   ├── ci-cd.md             ← Pipelines and deployment
│   │   ├── cloud.md             ← Cloud & containers
│   │   ├── sql-style.md         ← SQL query rules
│   │   └── ui-ux.md             ← Design thinking, presets, standards, architecture
│   ├── instructions/
│   │   ├── templates/           ← Working protocol (workflow.md), agent roles, context templates
│   │   ├── flavors/             ← Architectural patterns (vertical-slice, mvc, lite, legacy)
│   │   ├── idioms/              ← Language conventions (typescript, python, go, etc.)
│   │   └── competencies/        ← Layer rules (frontend, backend)
│   └── commands/                ← Cycle command files (feat/fix/docs/audit/land/end)
└── .ai-backlog/                 ← Harness Engineering (Memory) — gitignored
    ├── context.md               ← Project brief: stack, tech decisions, current state
    ├── tasks.md                 ← Task list (TODO / IN_PROGRESS / DONE)
    ├── learned.md               ← Lessons learned: success patterns and research findings
    ├── troubleshoot.md          ← Troubleshooting: RCA logs and critical failure records
    └── impact-map.md            ← Blast-radius map: volatile, created at PLAN, cleared at END
```

Agent-specific root files are also written based on which agents are selected during init: `CLAUDE.md` (Claude Code), `.cursor/rules/` (Cursor), `.windsurfrules` (Windsurf), `.github/copilot-instructions.md` (GitHub Copilot), `AGENTS.md` (Codex), `GEMINI.md` (Gemini), `.roo/rules/` (Roo Code).

---

## .ai/skills/ — Engineering Skills (on-demand)

The skill directory is the **canonical Single Source of Truth** for engineering rules. Each file is a self-contained skill unit with a defined load convention (most load in Phase CODE; `testing.md` also loads in Phase TEST).

### skills/AGENTS.md

The main entry point. Referenced by `CLAUDE.md` (and equivalent files for other agents) so it loads automatically at session start. It is a **minimal router**: manifesto + DNA-GATE + session start checklist + skill registry + cycle commands. It does not contain knowledge — it tells the agent which skill to load for the current task.

### skills/staff-dna.md

The 8 Engineering Laws: Protocol, Hardening, Resilience, Narrative Cascade, Visual Excellence, Boundaries, Reflection, Contextual Efficiency. Loaded only in Phase CODE, when the agent crosses the DNA-GATE before writing any code.

### skills/code-style.md

Consolidated naming, style, and engineering standards — Narrative Cascade, Stepdown Rule, SLA, Revealing Module Pattern, banned abbreviations, definition of done.

### skills/testing.md

Test principles: structure, regression requirements, red-green-refactor, integration vs. unit boundaries.

### skills/security.md

Security rules: configuration isolation, PII handling, secret management, and the security pipeline (pre-commit hooks, dependency scanning, static analysis).

### skills/api-design.md · data-access.md · observability.md · ci-cd.md · cloud.md · sql-style.md · ui-ux.md

Domain skills. Each covers its concern end-to-end — for example, `api-design.md` defines the response envelope, error code table, REST hierarchy, and standardization protocols. Loaded only when the current task touches the relevant domain.

---

## .ai/instructions/ — Non-skill rulesets

### instructions/templates/

- `workflow.md` — The 5-phase Working Protocol (SPEC → PLAN → CODE → TEST → END), Task Handoff rule, Token Discipline rule. This is the **only** file that is always in context beyond `AGENTS.md`.
- `agent-roles.md` — Multi-agent handoff protocol (Planning + Fast roles).
- `context.md`, `tasks.md`, `learned.md`, `troubleshoot.md` — Templates for the `.ai-backlog/` files.

### instructions/flavors/

Rules for the project's architectural pattern. Defines where logic belongs — for example, whether business logic lives in UseCases, Services, or Controllers. One flavor per project: `vertical-slice`, `mvc`, `lite`, `legacy`.

### instructions/idioms/

Language-specific conventions. Each idiom file covers patterns, anti-patterns, and idiomatic usage for that stack: `typescript`, `javascript`, `python`, `csharp`, `java`, `kotlin`, `go`, `rust`, `swift`, `flutter`, `sql`, `vbnet`. Multi-idiom projects install more than one.

### instructions/competencies/

Layer-specific rules for frontend and backend work — data flow, component boundaries, API contract rules. Loaded on demand by the SPEC phase of a `feat:` cycle when the cycle command requests it.

---

## .ai/commands/ — Cycle Command Files

Context files loaded on demand when a specific cycle is triggered:

- `sdg-feat.md` — loaded when the agent enters a `feat:` cycle
- `sdg-fix.md` — loaded when the agent enters a `fix:` cycle
- `sdg-docs.md` — loaded when the agent enters a `docs:` cycle
- `sdg-audit.md` — loaded when the agent enters an `audit:` cycle
- `sdg-land.md` — loaded when the agent enters a `land:` cycle
- `sdg-end.md` — loaded when the agent enters the `end:` phase

These files are not loaded on session start — only when the relevant cycle begins.

---

## .ai-backlog/

Gitignored. Persists project state across sessions so any agent — in any session — can pick up where the last one stopped.

**context.md** — written on first run, maintained by the agent at the END of each cycle. Captures:

- Stack and frameworks used
- Architectural decisions and their rationale
- Current objective (`## Now`)
- Developer metadata (`## Partner`)

**tasks.md** — the task list. Tracks atomic units of work across sessions:

- `[TODO]` — pending
- `[IN_PROGRESS]` — the active task (only one at a time)
- `[DONE]` — completed (kept for reference)

The agent reads this at session start before accepting new work.

**learned.md** — the "Brain" of successful patterns. Captures:

- Research findings and validated hypotheses
- Reusable architecture patterns that worked well for this project
- Specialized terminology and "Staff" level engineering insights

**troubleshoot.md** — the "Immune System" of the project. Captures:

- **Root Cause Analysis (RCA)** for every fix executed
- Failure logs and "gotchas" discovered during development
- Technical debt and fragile areas to be avoided in future cycles

**impact-map.md** — the "Blast-Radius Filter" of the active cycle. Volatile by design:

- **Created** at Phase PLAN via `git diff --name-only HEAD` + import scanning
- **Read** at Phase CODE — the agent loads only the files listed here, ignoring the rest of the codebase
- **Cleared** at Phase END — reset to an idle state so the next cycle starts clean
- **Regenerated** at Session Start if missing — the agent rebuilds it from `git diff` if an `[IN_PROGRESS]` task is detected in `tasks.md`

The map contains three sections: `## Changed` (files directly modified), `## Blast Radius` (files that import or call a changed file), and `## Tests at Risk` (test files covering blast-radius files). A `## Safe` section optionally marks directories that can be skipped entirely.

This design is inspired by the structural philosophy of [code-review-graph](https://github.com/tirth8205/code-review-graph) — a knowledge graph tool that uses Tree-sitter ASTs and MCP to give AI agents precise context. Instead of parsing ASTs or running a Python server, the Impact Map achieves the same goal through a lightweight protocol: the agent uses `git diff` and import scanning to build a minimal read-list at the start of every cycle. No external tools, no extra dependencies — just a markdown file and a disciplined workflow.

---

## How the Files Are Used Per Phase

| Phase | Files read                                                                                               |
| :---- | :------------------------------------------------------------------------------------------------------- |
| SPEC  | `commands/sdg-<cycle>.md`, `.ai-backlog/context.md`, `.ai-backlog/tasks.md`                              |
| PLAN  | `.ai-backlog/tasks.md`, `.ai-backlog/impact-map.md` (written here via `git diff`)                        |
| CODE  | `skills/staff-dna.md`, `skills/code-style.md` + domain skills on demand, `.ai-backlog/impact-map.md`     |
| TEST  | `skills/testing.md` — Includes **Audit Gate** (drift detection) and **Circuit Breaker** (3-strike rule)  |
| END   | `.ai-backlog/context.md`, `.ai-backlog/tasks.md`, `learned.md`, `troubleshoot.md`, `commands/sdg-end.md` |
