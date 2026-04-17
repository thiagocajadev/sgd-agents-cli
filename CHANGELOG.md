# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Fixed

## [3.0.1] - 2026-04-17

### Fixed

- **Backlog folder relocated**: `.ai-backlog/` → `.ai/backlog/`. Removes a top-level directory from project root; backlog now lives inside the governance tree as local working state. All SSOT references updated (`templates/workflow.md`, `commands/sdg-end.md`, `commands/sdg-land.md`), engine paths repointed (`instruction-assembler.mjs` `writeBacklogFiles` + `writeGitignore` BLOCKS, `audit-bundle.mjs:checkBacklogHealth`, `ui-utils.mjs` success log), docs aligned (README, README.pt-BR, PROJECT-STRUCTURE, REFERENCES). Consumer `.gitignore` generator now writes `.ai/backlog/` (was `.ai-backlog/`). CHANGELOG history left untouched (historical accuracy).
- **Clear-bundle backlog-loss guard**: `clear-bundle.mjs` now performs a second confirmation when `.ai/backlog/` contains files (tasks/learned/troubleshoot are not in git and have no remote recovery). Pure predicate `Cleaner.findBacklogsAtRisk(items)` extracted for testability; covers root projects and monorepo `packages/*` layouts. New regression suite: 5 tests in `clear-bundle.test.mjs`. Test glob widened to `src/engine/**/*.test.mjs` to discover bin-level tests.

## [3.1.0] - 2026-04-15

### Added

- **Part 0 — Visual Architecture Principles**: new foundational section in `ui-ux.md` covering solution-first stance, interface structure, themes/depth philosophy, styling/implementation, interaction/experience, accessibility as default, and anti-patterns. Frames the WHY before the tactical Parts 1–5.
- **"Using with other IDEs" section**: both READMEs now include a pointer-line table for Cursor, Windsurf, Copilot, Codex, Gemini, and Cline/Roo — replacing the old multi-agent wizard section.
- **`docs/UI-UX.md` rewrite**: now a reader overview with narrated map of the skill file and external research references (Shadcn/UI, Tailwind v4, Radix, OKLCH, Refactoring UI, WCAG 2.2, Bento Grid patterns, and more).

### Changed

- **Single canonical output**: `writeAgentConfig` now produces only `.ai/skills/AGENTS.md` + root `CLAUDE.md` pointer. Removed IDE selection step, `getActiveAgents`, `buildAgentStub`, `--agents`/`--ide` CLI flags, and all multi-agent stub generation (Cursor `.mdc`, Gemini `GEMINI.md`, Codex root `AGENTS.md`, Windsurf `.windsurfrules`, Roo `.clinerules`, Copilot `.github/copilot-instructions.md`).
- **Design preset removed from wizard**: `DESIGN` step and `designPreset` field purged from wizard, assembler, CLI parser, UI utils, and tests. Presets remain in the `ui-ux.md` skill — agents apply them at runtime, not at install time.
- **Docs filenames uppercased**: `agent-deep-flow.md` → `AGENT-DEEP-FLOW.md`, `software-development-lifecycle-sdlc.md` → `SOFTWARE-DEVELOPMENT-LIFECYCLE-SDLC.md`, `spec-driven-dev-guide.md` → `SPEC-DRIVEN-DEV-GUIDE.md`. All internal cross-references updated.
- **Images moved**: `src/assets/img/` → `docs/img/`. README image paths updated.

### Fixed

## [3.0.0] - 2026-04-15

> **Major release: Reformulation & Multi-Agent Support.** `sdg-agents` shifts from a knowledge-dump model to a router model — `AGENTS.md` is now a minimal registry and skills load on demand per cycle phase. Multi-agent and multi-idiom generation are first-class. The 8 Engineering Laws are renumbered 1–8 (was 0–7). See [docs/MIGRATION-v3.md](docs/MIGRATION-v3.md) for the v2→v3 migration guide.

### Added

- **Router identity (`.ai/skills/` + on-demand load)**: `.ai/skill/` → `.ai/skills/` (plural); canonical Single Source of Truth for all engineering rules. 11 skill units: `staff-dna`, `code-style`, `testing`, `security`, `api-design`, `data-access`, `observability`, `ci-cd`, `cloud`, `sql-style`, `ui-ux`. Each loads only when the current cycle phase needs it (`staff-dna.md` always activates in Phase CODE; `testing.md` in Phase CODE and TEST; domain skills when the task touches the relevant domain).
- **Multi-agent support**: single `init` run writes entry files for every selected agent. `cli-parser.mjs` gained `--all-agents` and `--idioms` (alias for `--idiom`, back-compat preserved). Wizard's single-select IDE step became a multi-select covering Claude Code, Cursor, GitHub Copilot, Gemini, Codex, Windsurf, and Roo Code. `writeAgentConfig` now targets `GEMINI.md` (Gemini), root `AGENTS.md` stub (Codex), and adds `alwaysApply: true` to Cursor frontmatter. New `buildAgentStub()` renders thin 5-line pointer files for Codex and Gemini. `getActiveAgents` dedupes and excludes the `none` sentinel.
- **Multi-idiom support**: `--idiom typescript,python,go` in a single command; wizard multi-select for polyglot projects.
- **8 Engineering Laws (renumbered 1–8)**: Law 1 Protocol · Law 2 Hardening · Law 3 Resilience · Law 4 Narrative Cascade · Law 5 Visual Excellence · Law 6 Boundaries · Law 7 Reflection · Law 8 Contextual Efficiency. Law 1 (Protocol) formalizes the DNA-GATE and Mental Reset that must be crossed before any code modification. Law 8 (Contextual Efficiency) formalizes Token Discipline (Smart Truncation, Programmatic Analysis, Reference-Based Snapshots, Self-Purge).
- **Minimal `AGENTS.md` template**: `buildMasterInstructions()` in `instruction-assembler.mjs` rewritten to emit a ~83-line minimal output (manifesto + DNA-GATE + Session Start + Cycle Protocol + Agent Roles + dynamic Skill Registry + Cycle Commands). Removed 7 routing functions (UI/UX, creative toolkit, core governance table, architectural, technical, working cycles, project context) that previously inlined knowledge.
- **Terse Mode as default output**: 6 rules from the legacy `core/caveman.md` migrated into `templates/workflow.md` `TokenDiscipline` rule as the new "Terse Mode (Default)" sub-section. Pedagogical Mode is now opt-in (previously default). Tonal tables in `skills/ui-ux.md` and `writing-soul` updated to reflect the flip.
- **Assembler single source of truth**: `instruction-assembler.mjs` refactored to a single `SKILL_CATALOG` constant (13 entries) as the source for the dynamic Skill Registry; `buildSkillRegistry` filters by category and renders grouped output.
- **`docs/MIGRATION-v3.md`**: v2→v3 migration guide with breaking changes table, step-by-step instructions, and v2→v3 file mapping.
- **`README.md` v3 updates**: new "Multi-Agent Support" section, new "Multi-Idiom" examples, v3 feature block replacing the Creative Design Toolkit bullet, fixed broken links to `src/assets/dev-guides/*` (moved to `docs/`), and updated "What Gets Installed" tree to show `.ai/skills/` layout. `docs/README.pt-BR.md` mirrors all changes.
- **`docs/CONSTITUTION.md` rewrite**: now presents all 8 Laws (was 7), includes Protocol (Law 1) and Contextual Efficiency (Law 8), fixes broken `staff-dna.md` pointer.
- **`docs/PROJECT-STRUCTURE.md` rewrite**: reflects the v3 tree (`.ai/skills/` on-demand, no `core/`, no `creative/`, no `workflows/`, no `dev-guides/`), documents load conventions per phase, and lists every skill file with its purpose.
- **`docs/UI-UX.md` update**: the four UI concerns (design thinking, standards, presets, architecture) are now top-down sections within the single consolidated `.ai/skills/ui-ux.md` skill, not four separate files.

### Changed

- **BREAKING — Engineering Laws renumbered 0–7 → 1–8**: `src/assets/skills/staff-dna.md`, `api-design.md`, `cloud.md`, `instructions/templates/workflow.md`, `src/engine/config/governance.mjs` (`GOVERNANCE_RULES` label shift), `src/engine/lib/core/display-utils.mjs`, `src/engine/bin/audit/check-narrative.mjs`, and `src/engine/bin/audit/audit-bundle.mjs` (sovereign check pattern strings shift from "Law 0"/"Law 7" to "Law 1"/"Law 8"). `src/engine/lib/domain/instruction-assembler.mjs` now emits "8 Engineering Laws" (was "6+ Engineering Laws") in the DNA-GATE Law Activation step.
- **BREAKING — `.ai/skill/` → `.ai/skills/`** (plural): all cross-references updated across the engine, the 11 skill files, templates, and command files. `ruleset-injector.mjs` now copies `src/assets/skills/` → `.ai/skills/` (this copy was missing in v2.x — generated AGENTS.md referenced skill files that were never populated in consumer projects).
- **BREAKING — `src/assets/instructions/core/` deleted** (16 files, ~90KB). Content dissolved into `.ai/skills/*`: `staff-dna` → `skills/staff-dna.md`; `code-style` + `naming` + `engineering-standards` → `skills/code-style.md`; `testing-principles` → `skills/testing.md`; `security` + `security-pipeline` → `skills/security.md`; `sql-style` → `skills/sql-style.md`; `api-design` → `skills/api-design.md`; `data-access` → `skills/data-access.md`; `observability` → `skills/observability.md`; `ci-cd` → `skills/ci-cd.md`; `cloud` + `containers` → `skills/cloud.md`; `ui/*` (4 files) + `writing-soul` → `skills/ui-ux.md` + Law 4 of `staff-dna.md`. `governance.mjs` `STANDARDS_PATH` repointed from `core/code-style.md` to `skills/code-style.md`. `audit-bundle.mjs` sovereign check repointed to `.ai/skills/staff-dna.md`.
- **BREAKING — `agent-roles.md` moved**: from deprecated `core/` to `src/assets/instructions/templates/agent-roles.md`. All 6 cycle command files (`sdg-feat.md`, `sdg-fix.md`, `sdg-docs.md`, `sdg-audit.md`, `sdg-land.md`, `sdg-end.md`) repointed.
- **BREAKING — multi-agent entry files**: `GEMINI.md` replaces the legacy `AI_INSTRUCTIONS.md` Gemini target. Codex adds an `AGENTS.md` stub. Cursor entry files now carry `alwaysApply: true` in the frontmatter.
- **BREAKING — agent stubs live under `.ai/<agent>/`**: all multi-agent entry files are now written inside namespaced subfolders of `.ai/` for reference and organization (`.ai/cursor/rules/sdg-agents.mdc`, `.ai/copilot/copilot-instructions.md`, `.ai/gemini/GEMINI.md`, `.ai/codex/AGENTS.md`, `.ai/windsurf/.windsurfrules`, `.ai/roocode/.clinerules`). `CLAUDE.md` at repo root is the **sole exception** — Claude Code auto-loads it natively and its single `@`-import points back at `.ai/skills/AGENTS.md`. Downstream projects using Cursor/Copilot/Gemini/Codex/Windsurf/Roo must either symlink the file to the native root location or reference the `.ai/<agent>/` path manually; native auto-discovery at the repo root no longer applies. Affected: `instruction-assembler.writeAgentConfig()` `ideTargets` map and `ui-utils.renderPreviewIdeTargets()` dry-run preview.
- **package.json description** rewritten for v3: "AI-Native Governance Framework: router-model instruction set with on-demand skills, 8 Engineering Laws, and multi-agent support for Claude, Cursor, Copilot, Gemini, Codex, Windsurf, and Roo Code."

### Removed

- **BREAKING — Creative Design Toolkit**: `src/assets/dev-guides/prompt-tracks/` and `src/assets/creative/*` deleted. Out of scope for v3. The `src/engine/bin/init/creatives-bundle.mjs` binary, the `injectCreativeToolkit` and `injectPrompts` engine functions, the `--dev-guides`/`--no-dev-guides` flags, and the `prompts`/`creatives` wizard modes are all gone.
- **BREAKING — `.ai/workflows/governance.md`**: the 01–08 roadmap was unused operationally and the 7 Laws it restated live canonically in `skills/staff-dna.md`. Working Protocol now lives exclusively in `.ai/instructions/templates/workflow.md`.
- **BREAKING — `core/caveman.md`**: 6 rules migrated to `templates/workflow.md` TokenDiscipline as "Terse Mode (Default)".
- **BREAKING — `.ai/dev-guides/`**: removed from the generated `.ai/` tree. Reference versions (`spec-driven-dev-guide.md`, `agent-deep-flow.md`, `software-development-lifecycle-sdlc.md`) now live in `docs/` of this repository only.
- **`add-idiom` subcommand**: removed (scope cut — idioms are now selected via the wizard checkbox or `--idiom` flag).
- **`.ai/last-prompt.md`** feature removed.

### BREAKING CHANGES

1. **`.ai/` layout changed.** Run `npx sdg-agents clear` before upgrading, then re-run `npx sdg-agents init` to write the new layout.
2. **`core/` directory is gone.** Local edits under `.ai/instructions/core/` must be migrated to the corresponding `.ai/skills/*` file. See [docs/MIGRATION-v3.md](docs/MIGRATION-v3.md) §5 for the mapping table.
3. **Engineering Laws renumbered.** Any project documentation that references "Law 0", "Law 1", …, "Law 7" by number (not by name) must shift by +1. Referencing by name (Protocol, Hardening, Resilience, Narrative Cascade, Visual Excellence, Boundaries, Reflection, Contextual Efficiency) remains stable.
4. **Creative Toolkit removed.** Projects that used `injectCreativeToolkit` or `--dev-guides` will fail on upgrade. Remove those references.
5. **`.ai/skill/` → `.ai/skills/`.** Any custom tooling that hardcoded the singular path must be updated.
6. **Gemini entry file renamed.** `AI_INSTRUCTIONS.md` → `GEMINI.md`. Delete the old file manually if your project retained it.
7. **Agent stubs relocated under `.ai/<agent>/`.** Only `CLAUDE.md` remains at repo root. If you rely on native auto-discovery for Cursor/Copilot/Gemini/Codex/Windsurf/Roo Code, you must symlink the generated file to the native path (`.cursor/rules/sdg-agents.mdc`, `.github/copilot-instructions.md`, `GEMINI.md`, `AGENTS.md`, `.windsurfrules`, `.clinerules`) after running `init`, or configure your agent to read from `.ai/<agent>/` directly.

### Fixed

- **`ruleset-injector` skills copy gap**: skills are now copied to `.ai/skills/` during init. In v2.x the `.ai/skill/AGENTS.md` referenced skill files that were never populated in generated projects — this silent gap is now closed.
- **`manifest-utils.computeHashes`** swapped its `core/` scan for a `skills/` scan — hashes now reflect canonical SSOT.

## [2.16.0] - 2026-04-15

### Added

- **v3.0 M1 completion (M1.4 + M1.5 SSOT audit)**: Closed Milestone M1 by eliminating all remaining redundancy under `src/assets/instructions/**`. Deleted `workflows/governance.md` (01–08 roadmap unused operationally; the 7 Laws it restated already live canonically in `skills/staff-dna.md`); the empty `workflows/` directory was removed. Deleted `core/caveman.md` after migrating its 6 rules into `templates/workflow.md` under the `TokenDiscipline` rule as a new **"Terse Mode (Default)"** sub-section — and flipped the tonal default: **Terse Mode is now the default output mode**, Pedagogical Mode is opt-in (previously Pedagogical was the default chat mode). Updated the Mouth-vs-Soul tonal tables in `skills/ui-ux.md` and `core/writing-soul.md` to reflect the new default, rename "Caveman" → "Terse", and point callers to `workflow.md` TokenDiscipline for the 6 rules. Ran a full SSOT audit across `commands/`, `competencies/`, `flavors/`, `idioms/`, `templates/`, `workflows/`, and `core/`: all non-skill rulesets (cycle commands, phase-SPEC competencies, architectural flavors, per-language idioms, templates) confirmed as legitimate KEEP; all legacy `core/*` files remain PENDING-M3.6 (untouched until round-trip validation); `agent-roles.md` deferred to M3.6 as a meta-protocol rather than a domain skill. Zero broken references (grep-verified). 107/107 tests green. Unblocks M2.1 (multi-agent stub refactor).

### Fixed

## [2.15.0] - 2026-04-15

### Added

- **v3.0 M1.3 — Skills directory + SSOT clarification**: Renamed `src/assets/skill/` → `src/assets/skills/` (plural) via `git mv` to preserve history. Propagated the new path across the engine (`instruction-assembler.mjs`, `instruction-assembler.test.mjs`, `ui-utils.mjs`, `wizard.mjs`, `audit-bundle.mjs`), the skill cross-references (`.ai/skill/*` → `.ai/skills/*` across all 11 skill files), and `README.md`. Explicit SSOT rule added to M1.3 backlog entry: `src/assets/skills/*` is canonical; `src/assets/instructions/core/*` is deprecated-pending-M3.6 and preserved only for round-trip validation. Aligns the project with its router-oriented identity — a minimal `AGENTS.md` registry + on-demand skill loading per cycle phase. 107/107 tests green.

### Fixed

## [2.14.0] - 2026-04-15

### Added

- **v3.0 M1.2 — Testing Skill Unit**: Converted `src/assets/instructions/core/testing-principles.md` into `src/assets/skill/testing.md` with the skill-unit header and a Phase-CODE/TEST load convention note. All 10 rules preserved 1:1 (`TestingStrategy`, `TestNamingConvention`, `TestStructure`, `NamedExpectations`, `WhatNotToTest`, `TestDoubles`, `FlakyTestManagement`, `CoverageStrategy`, `TestDataEnvironments`, `LegacyApproach`) with their examples, admonitions, and AI Agent Self-Audit intact. Fixed the broken `security-pipeline.md` cross-reference with an inline `<!-- TBD: .ai/skill/security.md -->` marker (mirrors the pattern used in `code-style.md`). Legacy source preserved for M3.6 round-trip.

### Fixed

## [2.13.0] - 2026-04-15

### Added

- **v3.0 M1.2 — Skill Units (staff-dna + code-style)**: Relocated `staff-dna.md` to `src/assets/skill/staff-dna.md` with updated `.ai/skill/*` cross-references and a Phase-CODE-only load convention note. Merged `code-style.md` + `naming.md` + `engineering-standards.md` into `src/assets/skill/code-style.md` — a unified, top-down skill (Naming → Scansion → Narrative → Tactical) with 15 rules. Deduped `AbstractConfig`, `StaffGradeVCS`, `DefinitionOfDone` (each previously defined twice) and rebuilt the broken `NarrativeSLA` carousel fence from the legacy source. Source files in `src/assets/instructions/core/` preserved (deletion deferred to M3.6 cleanup).

### Fixed

## [2.12.3] - 2026-04-15

### Added

### Fixed

- **Governance Audit Compliance — Laws & Sovereign Protocol**: Extracted file-scanning utilities (`getMaintainerFiles`, `getMaintainerTestFiles`, `getFilesRecursive`) from `audit-bundle.mjs` into a dedicated `audit-file-scanner.mjs` lib, reducing top-level function density from 15 to 12 (Laws Compliance pass). Added `DNA-GATE & MENTAL RESET [LOCKED]` section to `AGENTS.md` to satisfy the Sovereign Protocol check (audit now at 100%).
- **Workflow Protocol Enforcement in Source**: Added `buildDnaGateBlock()` to `instruction-assembler.mjs` so all generated `AGENTS.md` files include the DNA-GATE section. Rewrote `buildWorkflowPointer()` to make phase execution mandatory — explicit steps with approval gates, token estimate requirements (`📊`), and a protocol violation warning for skipping phases.

## [2.12.2] - 2026-04-15

### Added

### Fixed

- **JavaScript isFrontend Classification**: Corrected `isFrontend` flag for the `javascript` (Vanilla / ESM) idiom from `true` to `false`. ESM/Node stacks no longer trigger the Frontend framework prompt, Design Preset step, or `frontend.md` competency injection — those remain exclusive to `typescript` and other UI-oriented idioms.

## [2.12.1] - 2026-04-15

### Added

### Fixed

- **Token Efficiency & Context Loading Hardening**: Fixed duplicate `javascript/patterns.md` entry in Technical Execution table (assembler deduplicates idioms array). Moved `ci-cd.md` and `cloud.md` from always-visible Technical Execution to On Demand backend section. Replaced `agent-roles.md` On Demand entry with `observability.md` (agent-roles is already loaded via command file footers). Split Project Context into session-start essentials (`context.md`, `tasks.md`) and On Demand (`learned.md`, `troubleshoot.md` with explicit load conditions). Added Task Recovery directive to Session Start step 5 — agents now load `workflow.md` immediately when an `[IN_PROGRESS]` task is found, without waiting for a cycle command. Added `Load now: workflow.md` directive to `sdg-audit.md` (parity with all other command files). Added Core Rules always-exempt clause to Phase CODE step 2 to resolve implicit conflict with Impact Map skip rule.

## [2.12.0] - 2026-04-15

### Added

- **Aggressive Context Lazy Loading**: `workflow.md` is no longer inlined in the generated `AGENTS.md`. Session start now loads ~1.000 tokens (manifesto + session-start + pointer + tables) instead of ~4.000. Workflow is deferred until a cycle starts (`feat:`, `fix:`, `docs:`, `end:`), when each command file explicitly instructs loading it.
- **Self-Contained Command Files**: `sdg-feat.md`, `sdg-fix.md`, `sdg-docs.md`, and `sdg-end.md` each received an explicit `Load now: workflow.md` directive, making every cycle entry point self-sufficient without relying on auto-loaded context.
- **Session Gate (Hard Stop at END)**: Phase END step 8 replaced "suggest next step" with a mandatory hard stop: write one-line next objective to `context.md ## Now`, then halt the session. Next task starts fresh in a new session.
- **Creative Toolkit Opt-In**: Creative toolkit injection is now off by default (`noCreative = true`). Consumer projects that don't use creative assets no longer pay ~300 token overhead in AGENTS.md or receive unused creative files.
- **Backend Domain Files On Demand**: `data-access.md`, `sql-style.md`, and `api-design.md` moved from the always-visible Technical Execution table to an "On Demand" sub-table — load only when the task touches DB layer, queries, or endpoint design.

### Fixed

## [2.11.0] - 2026-04-15

### Added

- **Context Load Optimization — Lean Default Install**: Dev-guides are now off by default (opt-in via `--dev-guides`), removing ~32K tokens from the standard install. Deprecated `--no-dev-guides` flag with a warning. Removed unused `workflows/` directory from consumer project install. Slimmed the Core Governance reference table in the assembled AGENTS.md from 10 files to 4 essentials (`staff-dna`, `engineering-standards`, `code-style`, `naming`) plus an explicit "On Demand" section for context-specific files.
- **Token Visibility in Working Protocol**: Added Context Report step to Phase SPEC (shows tokens loaded at session start) and Cost Estimate step to Phase PLAN (shows estimated task token count before approval gate). Calculated via `wc -c ÷ 4` on read files plus conversation overhead.
- **workflow.md Condensed**: Impact Map instructions, Session Start protocol, and Token Discipline rule condensed without loss of behavior. 3789 → 3303 tokens.

## [2.10.1] - 2026-04-15

### Fixed

- **UI/UX Tonal Scale Integration & Single Source of Truth**: Integrated the tonal hierarchy rule (S0–S3 nesting, +1 level per container, 4–8% OKLCH Lightness delta per level) into `design-thinking.md` Phase 0.2, including composition anti-patterns and a standard reference model. Eliminated documentation duplication: Spacing L1–L4 removed from `architecture.md` (owner: `standards.md`), States section collapsed in `presets.md` to a reference link (owner: `standards.md`). Declared single source of truth per domain across all four UI files. Created `docs/UI-UX.md` with the design hierarchy, tonal scale explanation, preset table, and ownership map. Updated `README.md` and `docs/README.pt-BR.md` with links to `UI-UX.md` and corrected Quick Start: added `--quick` flag, removed obsolete `--toolkit creative`.

## [2.10.0] - 2026-04-15

### Added

- **CLI Streamlining — Menus, Quick Flag & Smart Defaults**: Simplified the interactive wizard by removing the explicit scope question (scope now inferred from selected idioms), replacing N per-idiom version prompts with a single "Code Style" choice (Latest / Conservative), reducing design presets from 8 to 4, auto-detecting bump from JS/TS idioms, and merging the two partner prompts into one. Added `--quick` CLI flag for zero-prompt installs. Restructured the main menu to 3 items (Build Project · Settings · Exit) with Governance Audit moved inside Settings. Updated `package.json` description for better SEO and value clarity.

### Fixed

## [2.9.2] - 2026-04-15

### Added

### Fixed

- **Consumer Mode Audit Isolation**: Implemented `isMaintainerMode()` in `fs-utils.mjs` to distinguish between the core `sdg-agents` repo and consumer projects. The Instruction Sync check is now automatically skipped in consumer projects, Laws Compliance scans `src/**/*.mjs` instead of hardcoded internal paths, and Writing Soul only requires `README.md` (making `docs/` files optional). Eliminates false-positive "Drift detected" and "Instruction Sync" errors when running `npx sdg-agents audit` in any downstream project.

## [2.9.1] - 2026-04-14

### Added

- **Hardened Changelog Gate**: Updated the audit engine to detect and block commits when staged changes exist but the `[Unreleased]` section of the changelog is empty, ensuring all code changes are documented.

### Fixed

- **Auditor Naming Compliance**: Fixed Law 2 (No Abbreviations) violations in the audit engine's internal scansion logic.

## [2.9.0] - 2026-04-14

### Added

- **Stricter Commit Approval Gate**: Implemented a mandatory `[LOCKED: COMMIT-GATE]` in `workflow.md` and `agent-roles.md` that explicitly forbids autonomous `git commit` actions and requires verbal human approval.

### Fixed

- **Creative Toolkit Zero-Project Support**: Hardened the creative injection flow to provide core governance rules and backlog files even in empty project states.
- **Resilient Instruction Assembly**: Fixed malformed tables and broken links in `AGENTS.md` for projects without a tech stack.

## [2.8.1] - 2026-04-14

### Added

- _Internal release synchronization._

### Fixed

- **Creative Bundle Pure Entry Point**: Fixed a missing `return` in `Creatives.run` and refactored it to a one-line delegator to satisfy SLA governance.

## [2.8.0] - 2026-04-14

### Added

- **Engineering Laws Semantic Refactor**: Decoupled law numbering project-wide to ensure future scalability and resilience.
- **Project References & Credits**: Created `docs/REFERENCES.md` to acknowledge external philosophies (Caveman, Context-mode, Writing Soul) and UI research (UI/UX Pro Max, TypeUI, Tweak/Shadcn).
- **DNA-GATE & MENTAL RESET [LOCKED]**: Formalized mandatory mental reset step in `workflow.md` and `AGENTS.md` to satisfy Sovereign Protocol (Law 0) requirements.

- **Test Suite Governance Hardening**: Total refactor of `fs-utils.test.mjs` to satisfy Testing Principles (Atomic Actions, Triad Pattern, Vertical Scansion).

### Fixed

- **Test Suite Alignment**: Refactored `package.json` and unit tests (`fs-utils`, `cli-parser`) to achieve 100% compliance with recursive basin architecture and naming standards.
- **Audit Consistency**: Resolved sync drift between `.ai/` instructions and source assets.

## [2.7.0] - 2026-04-14

### Added

- **Sovereign Protocol (Law 0)**: Hardened governance by introducing Law 0, establishing project instructions as the ultimate authority over general AI training bias.
- **DNA-GATE [LOCKED]**: Implemented a mandatory 'Mental Reset' gateway at the start of Phase: CODE to ensure strict adherence to engineering laws.
- **Contextual Efficiency (Law 7)**: Integrated project philosophies for token reduction, including Smart Truncation (60/40 Split) and Reference-Based Snapshots.
- **Backlog Health Audit**: Added automated detection for context bloat in `.ai-backlog/` directories.

### Fixed

- **Explaining Returns (Law 3)**: Refactored engine utilities and audit runner to eliminate literal/bare returns and satisfy scansion laws.
- **Named Expectations**: Hardened unit tests to eliminate magic values and enforce the `actual`/`expected` triad.

## [2.6.0] - 2026-04-13

### Added

- **Laws Compliance Protocol**: Renamed "Law 3 compliance" to "Laws Compliance" and hardened the auditor's symbol scansion to 100% strictness.
- **Smart-Strict Scansion**: New auditor logic that enforces Explaining Returns even for literal objects and multi-line assignments.
- **High-Visibility Auditing**: Updated the audit runner to report all violations in a single pass, eliminating "blind spots" in governance.

### Fixed

- **Narrative Cascade (Law 3)**: Eliminated 15+ bare and literal returns across `fs-utils.mjs`, `ui-utils.mjs`, `wizard.mjs`, and all engine binaries.
- **SLA Drift**: Standardized all CLI entry points to a strict One-Line Pure Entry Point pattern.
- **Governance Engine Hardening (`init/`)** — refactored the project initialization and injection binaries (`add-idiom`, `build-bundle`, `creatives-bundle`) to satisfy the One-Line Entry Point mandate (v2.4.3).
- **Core Binary Resilience** — extracted logic from `runIfDirect` entry points into local sibling helpers, achieving 100% SLA compliance in the init domain basin.
- **Narrative scansion alignment** — standardized return patterns across the `init/` basin for improved vertical scansion.

## [2.5.2] - 2026-04-13

### Added

### Fixed

- **Governance Engine Hardening (`audit/`)** — refactored the audit bundle and checkers to achieve 100% compliance with the One-Line Entry Point mandate (v2.4.3).
- **Audit Tool Scansion** — hardened internal scansion logic and return narratives in `audit-bundle.mjs`, ensuring the governance engine satisfies its own strict scansion laws.

## [2.5.1] - 2026-04-13

### Added

- **Hardened Naming Governance** — updated the `audit` engine with programmatically enforced heuristics to block single-letter variables (`a, b, i, v`) and abbreviations across all engine basins.
- **Improved Heuristic Depth** — increased the Explaining Returns scansion depth and refined regex to ignore template interpolations (`${`), eliminating false positives in heavy template orchestrations.
- **Narrative Siblings Refactor** — refactored the central `NARRATIVE_VALIDATION_STRATEGIES` engine to adopt a delegator pattern with local sibling helpers, achieving 100% SLA and Law 3 compliance within the governance config itself.

### Fixed

- **Naming Discipline Debt** — resolved residual single-letter variable violations in `wizard.mjs`, `cli-parser.mjs`, and `version-utils.mjs`.
- **Governance Drift Prevention** — synchronized all core instruction assets (`code-style.md`) to ensure perfect alignment between the generator and the auditor.

## [2.5.0] - 2026-04-13

### Added

- **0-Drift Governance Achievement** — hardened all engine basins (`src/engine/lib/`) and binaries (`src/engine/bin/`) to reach 100% compliance with Law 3 (Narrative Cascade) and Explaining Returns.
- **Audit Tool Self-Hardening** — refactored the governance engine and audit runner (`governance.mjs`, `audit-bundle.mjs`) to satisfy the same strict engineering standards they enforce on the project.
- **Unified Lifecycle Hardening** — standardized `auto-bump`, `clear-bundle`, `review-bundle`, and `sync-rulesets` to follow the Pure Entry Point pattern and Narrative Siblings architecture.

### Fixed

- **Engine Structural Debt** — resolved residual bare returns and entry point violations across the maintenance and lifecycle basins, achieving a total 0-drift status.

## [2.4.3] - 2026-04-13

### Added

- **One-Line Entry Point Mandate** — formalized the rule that `run()`, `start()`, and `init()` must be limited to a single line of delegation.
- **Automated SLA Heuristics** — updated the governance auditor to programmatically detect Pure Entry Point violations and enforce Explaining Returns Project-wide.

### Fixed

- **Narrative Cascade (Law 3) in index.mjs** — refactored the main CLI entry point to 100% compliance, implementing a pure one-line `run()` delegator and narrative sibling patterns.
- **Audit Tool Blind Spots** — expanded scansion scope to include the project root bin and hardened regex-based heuristics for complex multi-line orchestrations.

## [2.4.2] - 2026-04-13

### Added

### Fixed

## [2.4.1] - 2026-04-13

### Added

- **Narrative Siblings Pattern (Law 3 Evolution)** — redefined the Lexical Scoping rule to favor local module-level functions (siblings) over nested functions. This transition standardizes function placement immediately following their caller (Stepdown Rule) to eliminate nesting debt and simplify maintenance of growing logic.

### Fixed

## [2.4.0] - 2026-04-13

### Added

- **Domain-Driven Basin Architecture (src/engine/)** — refactored the entire engine into logical basins: `bin/` (orchestrators for init, audit, maintenance, lifecycle) and `lib/` (core, infra, and domain layers), improving scannability and modularity.
- **Narrative Cascade (Law 3) Hardening** — achieved 100% compliance by enforcing the **Pure Entry Point** pattern across all binaries and systematically eliminating shorthand variables (`targetDir`, `pkg`, etc.) in favor of narrative identifiers.
- **Improved Governance Observability** — updated the `audit` suite to support the new basin structure and implemented self-detection resilience for engineering law enforcement.

### Fixed

- **Engine Structural Debt** — resolved fragmented logic and naming inconsistencies across 40+ files, achieving 100% compliance in the Governance Audit.
- **Audit Runner Stability** — fixed a critical syntax error and variable scope issue in the narrative scansion loop.

## [2.3.1] - 2026-04-13

### Added

### Fixed

- **Audit Runner Stability** — resolved `DeprecationWarning: [DEP0190]` in `audit-bundle.mjs` by refactoring `spawnSync` calls to avoid `shell: true` with argument arrays.

## [2.3.0] - 2026-04-13

### Added

- **Markdown-Driven Governance SSOT** — refactored the governance engine to dynamically parse rules and checklists directly from `engineering-standards.md`, establishing the documentation as the single source of truth for automated audits.
- **Narrative Cascade (Law 3) Hardening** — implemented automated heuristics for "Revealing Module Pattern" enforcement and "Prefix-based Boolean Naming" within the audit suite.

### Fixed

- **Engine Refactoring (Law 3 Compliance)** — refactored 10+ core library files to adopt the `export const Module = { ... }` pattern, achieving 100% narrative compliance.
- **Audit Runner Stability** — fixed a `TypeError` in the `runIfDirect` utility and resolved linting regressions in the configuration manifest.

## [2.2.0] - 2026-04-13

### Added

- **Hardened Governance Audit** — implemented narrative slop detection in `audit-bundle.mjs` to flag structural meta-comments (`// Arrange/Act/Assert`) and non-descriptive numbered variables (`input1`, `actual2`).
- **Transformation Scansion Protocol** — formalized the `actualRaw` vs. `actual` pattern in `testing-principles.md` to separate computation from presentation check.

### Fixed

- **Narrative Debt Removal** — refactored the entire unit test suite (9 files) to eliminate structural meta-comments in favor of vertical scansion.
- **Expressive Test Naming** — refactored `auto-bump.test.mjs` and `fs-utils.test.mjs` to replace numbered input variables with intent-based identifiers.

## [2.1.0] - 2026-04-13

### Added

- **Governance Audit Command** — implemented a dedicated `audit` subcommand in the CLI that performs comprehensive project health checks, including drift detection, narrative health, and Law 3 compliance analysis.
- **Audit Runner** — created `src/engine/bin/audit-bundle.mjs` to consolidate all governance checks into a single reportable audit summary.

### Fixed

- **Law 3 Compliance (Lexical Scoping)** — refactored `FsUtils` to encapsulate internal versioning helpers inside `filterContentByVersion`, aligning with the project's Narrative Cascade standards.
- **FsUtils Test Regression** — refactored unit tests to cover internal logic via the public API after the Lexical Scoping refactor.

## [2.0.0] - 2026-04-13

### 🏆 Milestone: Governance Observability

This major release marks the transition from static instruction sets to active **Governance Observability**. With the introduction of the Audit Gate and Circuit Breaker, the SDG ecosystem now provides a feedback loop that proactively detects architectural drift and prevents infinite refactoring cycles, establishing a new industrial standard for AI-driven engineering.

### Added

- **Audit Instruction & QA Gate** — introduced `.ai/commands/sdg-audit.md` to trigger full governance audits, and integrated the "Audit Gate" directly into the TEST phase of the Working Protocol to act as a governance drift detector during `feat` and `fix` cycles.
- **Circuit Breaker Rule** — hardened the Working Protocol's Fix Loop by enforcing a 3-strike mechanism; agents must now explicitly STOP and deliver a Failure Report after 3 failures (test, lint, or audit) instead of looping endlessly.
- **Improved Project Structure** — Inverted the documentation hierarchy to prioritize instructions (`.ai/`) over backlog (`.ai-backlog/`) and simplified the root-level tree for enhanced readability.

## [1.24.0] - 2026-04-13

### Added

- **Writing Soul v2** — upgraded `writing-soul.md` with an explicit pedagogical tone as the default: technical terms are kept in English (when field-standard) and followed by a contextual explanation in parentheses describing what the term **does**, not just what the acronym expands to (e.g., `CI/CD (pipeline that automates build, test, and deploy on every commit)`). Added a 5-row context table under `## Mouth vs Soul` covering chat, Caveman, source code, code comments, and perennial artifacts. Integrated a curated `## Anti-Patterns Reference (Stop-Slop)` section with banned phrases, structural anti-patterns (false agency, narrator-from-a-distance, binary contrasts, passive voice, dramatic fragmentation), and an 11-point quick-checks checklist for pre-delivery self-review. Credits [stop-slop](https://github.com/hardikpandya/stop-slop) by Hardik Pandya.

### Fixed

## [1.23.0] - 2026-04-13

### Added

- **Impact Map Protocol** — introduced `.ai-backlog/impact-map.md`, a volatile blast-radius file created at Phase PLAN (via `git diff` + import scanning) and cleared at Phase END. The map restricts the agent's read-list to only the files affected by the current cycle — changed files, their dependents, and tests at risk — keeping context lean and focused. Includes regeneration logic at Session Start for backlog recovery scenarios. Inspired by the structural philosophy of [code-review-graph](https://github.com/tirth8205/code-review-graph).

## [1.22.0] - 2026-04-13

### Added

- **Standardized Release Commits** — updated workflow instructions to explicitly require the `<intent>: release v<version> - <description>` pattern for all automated bumps.

### Fixed

## [1.21.3] - 2026-04-13

### Added

### Fixed

- **Documentation Sync** — updated `README.md`, `docs/README.pt-BR.md`, and `docs/PROJECT-STRUCTURE.md` to reflect the new Creative Design Toolkit features, Item 4 menu logic, and centralized architecture.

## [1.21.2] - 2026-04-13

### Added

### Fixed

- **Shared Engine Logic** — Centralized `getActiveAgents` in `InstructionAssembler` to eliminate code duplication across injection bundles.
- **Toolkit Manifest Traceability** — Integrated `writeManifest` into the `creatives` flow to ensure CLI version and selections are recorded in `.sdg-manifest.json` after standalone injections.
- **Enriched Agent Routing** — Expanded the `AGENTS.md` Creative Toolkit table to include direct links to Templates and Tactic Guides, improving AI discoverability of specialized assets.
- **Local Asset Context** — Updated skill assets with explicit local path references for better multi-agent coordination.
- **Governance Resilience** — Removed `CLAUDE.md` from git tracking and enforced it via `.gitignore` to prevent IDE-specific meta-contamination in the repository.

## [1.21.1] - 2026-04-13

### Added

- **Creative Dev-Guides Hub** — added specialized guides for Instagram, TikTok, LinkedIn, and YouTube (including safe zones and prompt logic).
- **Hardened Ruleset Injection** — restored recursion for dev-guides subfolders in the injection engine.

### Fixed

- **Creative Toolkit Menu Navigation** — Moved the "Creative Design Toolkit" option from the main menu into the `Setup` submenu (Option 1) to align with standard project initialization workflows; removed the 🎨 emoji to maintain visual consistency.
- **Centralized Creative Assets** — Refactored the injection engine to centralize all toolkit assets under `.ai/instructions/creative/` (Skills, Templates, and Guides), eliminating fragmented directories in `prompts/` and `dev-guides/`.
- **Governance Path Synchronization** — Updated `AGENTS.md` and the internal assembler to reflect the new centralized paths; implemented automatic cleanup of legacy creative folders during new injections.

### Added

- **Creative Design Toolkit (Option 4)** — Implemented a specialized "Injection" flow for brand identity, logos, social media (IG, TikTok, LinkedIn, YouTube), and landing page blueprints; added `core/creative`, `prompts/creatives`, and specialized `dev-guides/creatives/` assets to the instruction ecosystem.

### Fixed

## [1.20.1] - 2026-04-13

### Added

- **Roadmap Revision (Vision 2.x)** — Updated `ROADMAP.md` to reflect `v1.20.0` resilience achievements and projected the next maturity stages: Governance Observability (`sdg audit`), Global Instruction Registry (`sdg use`), MCP Semantic Indexing, and Visual Governance.

### Fixed

## [1.20.0] - 2026-04-13

### Added

- **Partner Metadata Step** — Added Step 9 to the interactive wizard to capture developer name and role; implemented `## Partner` section in `context.md` with localized greetings (PT-BR/EN).
- **Hardened Input Sanitization** — Implemented `safeInput` with Unicode normalization, HTML/Script stripping, and Markdown escaping; enforced 2-50 character limits for developer names.
- **Wizard Architectural Refactor** — Replaced magic numbers with semantic `WIZARD_STEPS` identifiers and implemented an index-based `STEP_ORDER` for resilient navigation.
- **Intelligent Context Injection** — Upgraded the instruction assembler to safely inject the `## Partner` section into existing `context.md` files without overwriting user changes.
- **Backend-Only UI Optimization** — Modernized the wizard flow to automatically skip design-related presets when the project scope is set to Backend single-idiom.

### Fixed

## [1.19.2] - 2026-04-12

### Added

### Fixed

- **Harness Engineering (Memory) Label** — refined the terminology label from "Harness Engineering" to "Harness Engineering (Memory)" across all documentation for conceptual clarity.

## [1.19.1] - 2026-04-12

### Added

### Fixed

- **Harness Engineering Terminology** — updated `README.md`, `README.pt-BR.md`, and `PROJECT-STRUCTURE.md` to replace "Session memory & Expertise" with the official term "Harness Engineering" across all documentation.

## [1.19.0] - 2026-04-12

### Added

- **Universal Cycle Coverage** — extended `Phase: END` governance (`sdg-end.md`, `workflow.md`, `AGENTS.md`) to enforce CHANGELOG entries for all cycle types (`docs:` and `land:` now have explicit section mappings); bumped `scripts/bump.mjs` and template to accept `docs` and `land` as valid intents mapping to `patch`.
- **SSOT Consolidation** — refactored `sdg-end.md` from a full 7-step redefinition into a thin pointer to the canonical `Phase: END` in `workflow.md`/`AGENTS.md`, eliminating protocol duplication across governance files.

### Fixed

## [1.18.2] - 2026-04-12

### Added

### Fixed

- **Phase END: Dynamic Bump Protocol** — `workflow.md` and `AGENTS.md` updated to auto-detect the `bump` script and execute it before every release commit, eliminating pre-push narrative blockers across all cycle types.

## [1.18.1] - 2026-04-12

### Added

### Fixed

- **Dynamic Semantic Delivery** — hardened `Phase: END` instructions in `workflow.md` to autonomously verify the existence of a `bump` script in `package.json` and execute `npm run bump` before proposing commits, preventing `pre-push` narrative blockers.
- **Documentation Alignment** — updated `README.md`, `README.pt-BR.md`, and `PROJECT-STRUCTURE.md` to accurately reflect the `.ai/` tree structure, including the decoupled `.ai/instructions/templates/` and centralized `.ai/workflows/` directories.

## [1.18.0] - 2026-04-12

### Added

- **Micro-Governance Resilience** — Refactored FsUtils to use pure error bounds (`safeReadJson`); decoupled context templates into `src/assets/instructions/templates/backlog/` resolving script entanglement; optimized rule injection with substring fast-paths.

### Fixed

- **Wizard State Tracking** — Replaced fragile loops with an immutable `historyStack` in the CLI wizard to fix progression errors and state bleeding on back navigation.

## [1.17.1] - 2026-04-12

### Added

### Fixed

- **Single Source of Truth** — Centralized all Claude Code and multi-agent governance logic directly into `AGENTS.md` and `workflow.md`; migrated the "Terminal Sanity Check" to the universal Session Start protocol to enforce execution checks across all IDEs; replaced bloated `CLAUDE.md` generation with a minimal reference pointer.

## [1.17.0] - 2026-04-12

### Added

- **Agent Governance Refactor** — Hardened the SDG Agents CLI workflow instructions. Redefined the 6 core Staff DNA laws as the undisputed Single Source of Truth (SSOT), removing duplication from the Assembler.
- **Environment-Agnostic Roles** — Refactored `.ai/instructions/core/agent-roles.md` to define Single-Agent as the universal standard execution trace across IDEs, treating sub-agent orchestration (`claude`) strictly as an enhanced extension.
- **Token Discipline Consolidation** — Streamlined `CAVEMAN.md` generation to eliminate redundant path allocations within the workspace.

### Fixed

## [1.16.0] - 2026-04-12

### Added

- **Zero-Leak END Resilience** — hardened the delivery cycle with mandatory workspace audits and catch-all staging (`git add .`) to prevent uncommitted side-effects.
- **Self-Healing Technical Quality** — integrated automatic lint-repair (`lint --fix`) into the END phase to resolve formatting blockers without interrupting the delivery.
- **Automated Context Bootstrapping** — added fallback logic to the END cycle to automatically recreate `.ai-backlog/context.md` if it is missing or lost.
- **Contextual Narrative Guard** — refactored the engine to allow semantic release commits by validating against specifically promoted version headers.

### Fixed

## [1.15.0] - 2026-04-12

### Added

- **Hardened Action Workflow** — refactored the Working Protocol to a strict 5-phase execution flow (SPEC, PLAN, CODE, TEST, END) with mandatory manual approval gates for delivery.
- **Token Discipline 2.0** — retired upfront "Step 0" context loading in favor of just-in-time loading during SPEC and CODE phases based on specific demand.
- **Narrative Gate Restoration** — reintegrated the full function-level quality checklist into the CODE phase.
- **Official English Standardization** — synchronized all instruction assets with official English terminology and "MODE: PLANNING/FAST" mindset labels.

### Fixed

## [1.14.2] - 2026-04-11

### Fixed

- **Hardening Agent Governance** — decoupled versioning from committing in `bump.mjs` and `auto-bump.mjs`. All manual and automated bumps now require an explicit, approved commit after files are updated.
- **Protocol instructions update** — hardened `sdg-end.md` to reflect the decoupling of the release cycle.

## [1.14.1] - 2026-04-11

### Added

### Fixed

- **CHANGELOG Date Timezone Drift** — switched from UTC-based `toISOString()` to local `en-CA` formatting in all bump scripts and templates; ensures dates in promoted headers match the developer's machine clock instead of jumping +1 day ahead in late-night releases.

## [1.14.0] - 2026-04-11

### Added

- **UI/UX Governance Evolution** — formalized the "Elevation Stack" (S0-S3) to replace the basic theme inversion law; introduced dedicated logic for dark mode elevation where surfaces become lighter as they "ascend" towards the user.
- **Component Nesting (Anilhamento)** — codified the "Concentric Radius Rule" (Outer - Padding = Inner) and border hierarchy standards for complex structural interfaces.
- **OKLCH Adaptive Chroma** — refined the perceptual color progression scale with "Vibe Control" (Vibrant vs Muted) modifiers to prevent visual weight issues in dark themes.
- **Visual Density Standards** — quantified spacing levels L1 through L4 with specific pixel/Tailwind targets to ensure information density consistency.

### Fixed

## [1.13.0] - 2026-04-11

### Added

- **CLI Update Suggestion** — implemented a non-blocking check for new versions of `sdg-agents` on the npm registry; displays a professional "Update Available" notification when a newer version is detected during interactive sessions.

### Fixed

## [1.11.3] - 2026-04-11

### Added

### Fixed

- **Missing Skill Recovery** — Fixed a bug where `.ai/skill/CAVEMAN.md` was not generated during project initialization.

## [1.11.2] - 2026-04-11

### Added

- **Zero Context Leak Protocol** — Hardened `end:` cycle and bump scripts to enforce 100% workspace synchronization; switched to `git add .` in release commits to catch `package-lock.json` and mirrored assets automatically.

### Fixed

## [1.11.1] - 2026-04-11

### Added

### Fixed

- **Release Sync Recovery** — synchronized missing source assets in `src/assets/` and updated backlog context after metadata-only bump.

## [1.11.0] - 2026-04-11

### Added

- **Token Discipline 2.0** — Integrated **CAVEMAN Full** linguistic compression for chat interactions; hardened **GSD (Get Shit Done)** protocol with mandatory session purges in `sdg-end.md` to prevent "context rot".
- **Technical Density Poda** — Aggressively pruned instruction set to minimize token usage during cold-starts; reduced `engineering-standards.md`, `backend.md`, and `frontend.md` by approximately 70% in line count while maintaining core engineering constraints.
- **Mouth vs Soul Duality** — Formalized interaction style in `writing-soul.md`: high-density technical fragments for chat (The Mouth) and inviting engineering prose for project documentation (The Soul).

### Fixed

### Changed

- **AGENTS.md Context Core** — Consolidated Token Discipline into the working protocol template (v2.0).

## [1.10.4] - 2026-04-11

### Added

- **Gatekeeper Delivery Workflow** — Hardened the `pre-push` hook to block pushes when unversioned narratives exist in `CHANGELOG.md`; eliminated the automatic `post-commit` versioning loop to prevent history noise and race conditions.
- **Atomic Release Cycle** — Upgraded `scripts/bump.mjs` to perform an all-in-one release delivery (changelog promotion + version bump + release commit); formalized the use of `npm run bump` as the standard cycle termination tool.
- **Narrative Guard Refinement** — Updated `check-narrative.mjs` to support dual-mode validation (staged `commit-msg` and full-repo `pre-push` checks).

### Fixed

## [1.10.2] - 2026-04-11

### Added

### Fixed

## [1.10.1] - 2026-04-11

### Fixed

- **Indentation-Awareness & Idempotency** — hardened `package.json` and `.ai/.sdg-manifest.json` updates to detect and preserve project-specific indentation; implemented `writeJsonAtomic` to prevent redundant file rewrites when content is already in sync.
- **Husky Resilience** — fixed a bug in `.husky/pre-push` synchronization that caused redundant command appends; added explicit idempotency guards to agent configuration files (`CLAUDE.md`, etc.).

## [1.10.0] - 2026-04-11

### Added

- **Narrative Guard** — implemented a Husky `commit-msg` hook to prevent version-bumping commits when the `CHANGELOG.md` is empty.

### Fixed

## [1.9.0] - 2026-04-11

### Added

- **Maintainer Mode Sync** — integrated automatic drift detection and synchronization for the CLI project itself; when running in its own repository, the CLI now automatically ensures that core instructions in `src/assets/instructions` are reflected in the live `.ai/` directory and `AGENTS.md`.

### Fixed

## [1.8.0] - 2026-04-11

### Added

### Fixed

## [1.7.4] - 2026-04-11

### Added

- Narrative Discipline — hardened `sdg-end.md` to mandate populating the `[Unreleased]` section before every commit when automation is active.

### Fixed

- Changelog Narrative Restoration — retroactively added descriptions for versions 1.7.1 through 1.7.3.

## [1.7.3] - 2026-04-11

### Added

- Governance Hardening (Zero Mutation Push) — removed the `npm run bump` command from pre-push hooks to prevent workspace drift during the delivery cycle; enforced "Validate at Commit, Zero Mutation at Push" strategy.

## [1.7.2] - 2026-04-11

### Fixed

- Husky Shell Syntax — resolved shell compatibility issues in `.husky/pre-push` hooks caused by incorrect NVM shims and deprecated Husky boilerplate.

## [1.7.1] - 2026-04-11

### Fixed

- Automated Changelog Promotion — corrected the `auto-bump.mjs` script to properly read and migrate `[Unreleased]` content to the active version header.

## [1.7.0] - 2026-04-11

### Added

- Smart Auto-Bump — integrated `CHANGELOG.md` promotion into the automated versioning pipeline; the `post-commit` hook now automatically moves entries from `## [Unreleased]` to the new version header.

### Fixed

## [1.6.0] - 2026-04-11

### Added

- Pedagogical Writing Soul — refined `writing-soul.md` instruction set with inviting, prose-centric guidance; eliminated em dashes and negation-affirmation patterns in favor of direct engineering wisdom.
- Internal Governance Sync — automated the synchronization of project assets to the local `.ai/` directory via CLI `init` protocol.

## [1.4.0] - 2026-04-11

### Fixed

- Governance terminology synchronization in Portuguese and English documentation.

## [1.3.0] - 2026-04-11

### Added

- Automated Bump & Changelog Governance — integrated a standard semantic versioning strategy into the SDG ecosystem; added `scripts/bump.mjs` template and unconditional Husky `pre-push` integration for JS/TS projects.
- Interactive Bump Opt-out — added Step 8 to the `sdg init` wizard to allow users to toggle automated versioning.
- CLI `--no-bump` flag — support for bypassing automation in CI/CD or specialized environments.

## [1.2.3] - 2026-04-11

### Fixed

- Internal Terminal Resilience — hardened Husky hooks with a Path Discovery block to ensure `node`/`npm` availability in non-interactive agent shells; codified abstract "Toolchain Discoverability" principle in global engineering standards; added generic "Terminal Sanity Check" to agent session start protocol.
- Version-Aware CHANGELOG — hardened `Phase: END` instructions to include finding the next package version (patch/minor) instead of defaulting to generic `[Unreleased]` headers.
- npm publish `bin` validation — removed invalid relative `./` prefix from `package.json` bin path that was causing npm to remove the CLI executable.

## [1.2.0] - 2026-04-10

### Added

- AI Backlog Knowledge Triad — separated project state from technical expertise by introducing dedicated `.ai-backlog/learned.md` (success patterns and research) and `.ai-backlog/troubleshoot.md` (RCA and failure logs); implemented Selective Lazy Loading to inject knowledge into the agent's context only when relevant (`feat:` for learned, `fix:` for troubleshoot)
- `end:` intent prefix — universal cycle terminator that forces sequential execution of the END Phase checklist (SUMMARIZE → CHANGELOG → BACKLOG → CURATE → LINT → COMMIT → PUSH); adapts CHANGELOG category by active cycle type; accepts no argument
- `land:` intent prefix — inception cycle that turns a raw vision into a grounded backlog of sequenced `feat:` tasks before any code is written
- Multi-agent execution protocol — Planning (SPEC/PLAN/Review) and Fast (CODE/TEST) roles for Claude Code; auto-enabled when `ide: claude` or `ide: all`; graceful single-agent fallback for all other environments
- Scope rule for multi-agent handoff in `agent-roles.md` — `[S]` tasks run single-agent; `[M]`/`[L]` tasks always spawn Fast after PLAN approval

### Changed

- Governance consolidation — eliminated structural redundancies to reduce cold-context overhead per session: removed duplicate Session Start block, Governance Oath, and bootstrap template from `AGENTS.md`; converted verbose XML `<context_routing>` to markdown tables; removed redundant Phase: END sections from command files; trimmed multi-agent TIP blocks from all command files (now a single reference to `agent-roles.md`)
- Context Load in Phase: CODE is now domain-scoped — loads `backend.md`/`frontend.md` only when the task domain requires it, rather than always loading all competency files
- Bootstrap process now reads `CHANGELOG.md` in addition to `package.json`, `README.md`, and entry points

### Fixed

- `post-commit` hook path corrected from monorepo layout (`packages/cli/src/engine/bin/auto-bump.mjs`) to standalone repo path (`src/engine/bin/auto-bump.mjs`) — version bump was silently failing after every commit
- `auto-bump.mjs` `ROOT_DIR` traversal fixed (5 levels → 3) and `PACKAGE_PATHS` pruned to single root `package.json`; removed dead workspace-detection logic in `resolveRootPackagePath`

## [1.0.0] - 2026-04-08

### Added

- Interactive CLI (`sdg init`) to scaffold AI governance context into any project
- Governance instruction assembler — generates `.ai/skill/AGENTS.md` at runtime
- Asset bundle system — packages governance templates into a distributable bundle
- Support for backend, frontend, and fullstack competency profiles
- TypeScript and JavaScript idiom layers
- Multi-language support (EN/PT-BR) for governance assets
- Working Protocol: SPEC → PLAN → CODE → TEST → END lifecycle
- Feature, Fix, and Docs cycle commands (`sdg-feat.md`, `sdg-fix.md`, `sdg-docs.md`)
- Session backlog system (`.ai-backlog/context.md` + `tasks.md`) for cross-session continuity
- CLAUDE.md governance integration for Claude Code
