# Cycle Terminator — Phase: END (The Delivery) — MODE: PLANNING

This command has no arguments. Type `end:` to close the active cycle.

Executing the **Phase: END** checklist in strict order. Each step must be completed and announced before advancing.

---

## Step 1 — Task Summary

Writes one sentence per completed task. Professional, direct, and technical.

## Step 2 — Changelog

Adds an entry under `## [Unreleased]`: `### Added` for feat · `### Fixed` for fix.

- **Hard Rule**: Do NOT run the bump script until the narrative is written.

## Step 3 — Backlog Sync

Moves all finished tasks to `## Done` in `tasks.md`.

- **Knowledge/Insights**: Update `.ai-backlog/learned.md` or `troubleshoot.md` with findings.
- **Zero Context Leak (Curation)**: Final scan for slop. Run `git status` — confirm:
  - No uncommitted files (like `package-lock.json` or modified instructions).
  - No unfinished comments (`TODO`, `FIXME`, `...`).
  - No "AI-isms" or promotional language.
  - Confirm only intended files are staged.

## Step 4 — Context Update

Updates `## Now` in `context.md` with the next objective or clears it.

## Step 5 — Lint

Runs the project's linting script (e.g., `npm run lint`).

- **Auto-fix**: Resolve what is possible.
- **Blocker**: If non-auto-fixable errors remain, you **MUST** report them and stop. Do not propose a commit with lint errors.

## Step 6 — Commit

Proposes a commit message following the project's naming discipline and waits for your approval.

- **Autonomous Action**: You are **FORBIDDEN** from running `git commit` or any automated bump script that performs a commit until the Developer says "go".

## Step 7 — Next Step

Suggests what comes next: push · deploy · or a new task.

---

> [!WARNING]
> The cycle is **INCOMPLETE** until all 7 steps are checked.
> Do NOT accept new work or start a new cycle until this phase is finalized.

---

> [!WARNING]
> The cycle is **INCOMPLETE** until all 7 steps are checked.
> Do NOT accept new work or start a new cycle until this phase is finalized.
