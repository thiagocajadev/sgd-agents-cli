# Migrating from sdg-agents v2 → v3

`sdg-agents` v3.0 is a structural reformulation. The **generated `.ai/` layout, the skill model, and the engine internals** all changed. The public CLI surface (wizard, `init`, `audit`, `review`, `sync`, `clear`) stays compatible — the breaking changes are in the files written into your project.

This guide covers what changed, why, and how to migrate an existing v2 installation to v3.

## TL;DR

1. `npx sdg-agents clear` — remove the old `.ai/` tree.
2. Upgrade: `npm i -g sdg-agents@3` (or use `npx sdg-agents@3`).
3. `npx sdg-agents init` — re-run the wizard. New layout is written.
4. Re-commit `.ai/` and `CLAUDE.md` (all other agent stubs now live under `.ai/<agent>/` and are committed as part of `.ai/`).
5. Audit: `npx sdg-agents audit`.

If you have local edits in `.ai/instructions/core/`, save them elsewhere first — that directory no longer exists in v3.

---

## Breaking Changes

| Area                | v2                                                         | v3                                                                                                                                                                                                                                                                                       |
| :------------------ | :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skill directory     | `.ai/skill/` (singular)                                    | `.ai/skills/` (plural) — contains all engineering skills as skill units                                                                                                                                                                                                                  |
| Core ruleset        | `.ai/instructions/core/` (staff-dna + code-style + UI...)  | **Removed**. Content dissolved into `.ai/skills/*`                                                                                                                                                                                                                                       |
| Creative toolkit    | `.ai/instructions/creative/`                               | **Removed**. Out of scope                                                                                                                                                                                                                                                                |
| Dev guides          | `.ai/dev-guides/` + `prompt-tracks/`                       | **Removed** from `.ai/`. Reference versions live in `docs/` of this repo                                                                                                                                                                                                                 |
| Workflows directory | `.ai/workflows/governance.md`                              | **Removed**. Working Protocol now lives in `.ai/instructions/templates/workflow.md`                                                                                                                                                                                                      |
| Engineering Laws    | 7 laws (Hardening → Reflection) + Law 0 (Protocol)         | **8 laws, renumbered**. Protocol is now Law 1. Contextual Efficiency is now Law 8                                                                                                                                                                                                        |
| Multi-agent         | Single-select during wizard                                | **Multi-select** checkbox in wizard + `--all-agents` flag + `--agents <csv>`                                                                                                                                                                                                             |
| Idiom injection     | Single file from catalog                                   | **Multi-idiom** via comma-separated `--idiom ts,py,go` + wizard multi-select                                                                                                                                                                                                             |
| UI/UX rules         | Four files in `core/ui/`                                   | One consolidated skill: `.ai/skills/ui-ux.md`                                                                                                                                                                                                                                            |
| Agent entry files   | `CLAUDE.md`, `.cursorrules`, `.windsurfrules` at repo root | **All agent stubs relocated to `.ai/<agent>/`** (`.ai/cursor/rules/sdg-agents.mdc`, `.ai/copilot/copilot-instructions.md`, `.ai/gemini/GEMINI.md`, `.ai/codex/AGENTS.md`, `.ai/windsurf/.windsurfrules`, `.ai/roocode/.clinerules`). **`CLAUDE.md` at repo root is the sole exception.** |

---

## Why the Reformulation

v2 was a knowledge dump. Every session loaded the full ruleset into context, regardless of what the current task needed. The 7 Laws, code style, UI rules, SQL rules, and security pipeline were all read on every turn — even when the task was a typo fix in a single file.

v3 is a **router**. `AGENTS.md` is a minimal registry of skills, not the rules themselves. Skills load on demand per cycle phase: `staff-dna.md` activates in Phase CODE; `testing.md` activates in Phase TEST; `api-design.md` activates only when the task touches an endpoint. The auto-loaded context is now ~4–6K tokens instead of ~25K, and the skill machinery is the same SSOT — just lazy.

The Engineering Laws renumber (0–7 → 1–8) is cosmetic: Law 0 was always the meta-Law that precedes code. In v3 it joins the peer set as Law 1, keeping the natural 1–N reading order.

---

## Step-by-Step

### 1. Back up local edits

If you modified anything under `.ai/instructions/core/` — project-specific standards, custom UI rules, internal security addenda — copy those edits to a temporary location. The `core/` directory is gone in v3; you will reinject those edits as skill-level additions after migration.

```bash
cp -r .ai/instructions/core ~/sdg-v2-backup-core
```

### 2. Remove the v2 installation

```bash
npx sdg-agents clear
```

This removes `.ai/` and any legacy agent entry files that are no longer part of v3 (`.windsurfrules` stays; `core/` goes).

### 3. Install v3

```bash
# Ephemeral
npx sdg-agents@3

# Or install globally
npm i -g sdg-agents@3
```

### 4. Re-run init

```bash
npx sdg-agents init
```

The wizard now multi-selects IDE agents and idioms. Pick every agent you actually use — the cost of enabling all is zero (each agent entry file is 3–5 lines pointing to `.ai/skills/AGENTS.md`).

For non-interactive projects:

```bash
npx sdg-agents init --quick                            # lite + JS/TS defaults
npx sdg-agents init --flavor vertical-slice --idiom typescript,python --all-agents
```

### 5. Reinject local edits (if any)

If step 1 produced a backup, migrate those edits into the corresponding v3 skill file:

| v2 file                                                         | v3 destination                                             |
| :-------------------------------------------------------------- | :--------------------------------------------------------- |
| `core/staff-dna.md`                                             | `.ai/skills/staff-dna.md`                                  |
| `core/code-style.md` + `naming.md` + `engineering-standards.md` | `.ai/skills/code-style.md`                                 |
| `core/testing-principles.md`                                    | `.ai/skills/testing.md`                                    |
| `core/security-pipeline.md` + `security.md`                     | `.ai/skills/security.md`                                   |
| `core/sql-style.md`                                             | `.ai/skills/sql-style.md`                                  |
| `core/ui/*.md` (4 files)                                        | `.ai/skills/ui-ux.md`                                      |
| `core/writing-soul.md`                                          | Dissolved into Law 4 (Narrative Cascade) of `staff-dna.md` |

### 6. Audit

```bash
npx sdg-agents audit
```

All checks should pass. Common first-run warnings:

- **Unreleased changelog entry** — add a `## [Unreleased]` block to `CHANGELOG.md` before your next cycle.
- **Drift detected** — run `npx sdg-agents sync` to pull the latest skill versions.

### 7. Commit

```bash
git add .ai CLAUDE.md
git commit -m "chore: migrate to sdg-agents v3"
```

> **Native auto-discovery**: v3 keeps agent stubs inside `.ai/<agent>/` for reference and organization. If you want Cursor / Copilot / Gemini / Codex / Windsurf / Roo Code to auto-load their stub from the native root path, symlink after each `init` run:
>
> ```bash
> ln -sf .ai/cursor/rules/sdg-agents.mdc   .cursor/rules/sdg-agents.mdc
> ln -sf .ai/copilot/copilot-instructions.md .github/copilot-instructions.md
> ln -sf .ai/gemini/GEMINI.md               GEMINI.md
> ln -sf .ai/codex/AGENTS.md                AGENTS.md
> ln -sf .ai/windsurf/.windsurfrules        .windsurfrules
> ln -sf .ai/roocode/.clinerules            .clinerules
> ```
>
> Only `CLAUDE.md` is generated at the repo root by default because Claude Code's native auto-load is the canonical entry point.

---

## New in v3

- **Skills on-demand** — staff-dna, code-style, testing, security, api-design, data-access, observability, ci-cd, cloud, sql-style, ui-ux. Each is a self-contained skill unit with an explicit load convention.
- **8 Engineering Laws** — Law 1 (Protocol) through Law 8 (Contextual Efficiency). The Protocol Law formalizes the DNA-GATE and Mental Reset before any code modification.
- **Multi-agent generation** — one init run writes entry files for every selected agent.
- **Multi-idiom support** — polyglot projects install `typescript,python,go` in a single command.
- **Token discipline by default** — Terse Mode is the default output mode. Pedagogical Mode is opt-in via explicit "explain" or "why" in the prompt.

---

## Questions?

- Open an issue at [github.com/thiagocajadev/sgd-agents-cli](https://github.com/thiagocajadev/sgd-agents-cli).
- Read the manifesto at [specdrivenguide.org](https://specdrivenguide.org).
- For the philosophical foundation, see [CONSTITUTION.md](CONSTITUTION.md).
