# Phase: END (The Delivery) — MODE: PLANNING

This command closes the current development cycle and is the **Ultimate Guarantor of Zero Context Leak**. Follow all 7 steps with total rigor.

---

## Step 1 — Task Summary

**Writes one sentence per completed task.**

- Read `.ai-backlog/tasks.md` and summarize the work performed.
- Focus on technical outcomes.

## Step 2 — Changelog

**Adds an entry under `## [Unreleased]`: `### Added` for feat · `### Fixed` for fix.**

- Update `CHANGELOG.md` to maintain the project's technical history.
- Ensure the narrative allows for a professional semantic release.

## Step 3 — Backlog Sync

**Moves all finished tasks to `## Done` in `tasks.md`.**

- Clean up `.ai-backlog/tasks.md` so the active queue is reset for the next cycle.
- **Audit**: Perform a **Zero Context Leak** check: no `TODO` remnants or internal-only files.

## Step 4 — Context Update

**Updates `## Now` in `context.md` with the next objective or clears it.**

- If `.ai-backlog/context.md` is missing, you must bootstrap it using the template from `workflow.md`.
- Ensure the current objective is marked complete and clear out obsolete state.

## Step 5 — Lint

**Runs the linter, fixes what's possible, and blocks the commit if errors remain.**

- Run the project's linting script with auto-fix (e.g., `npm run lint -- --fix`).
- If non-auto-fixable errors remain, you **MUST** report them and stop.

## Step 6 — Commit

**Proposes a commit message and waits for your approval.**

- Execute the semantic pipeline: run `npm run bump <feat|fix>`.
- Audit the workspace and run `git add .` to capture metadata and uncommitted side-effects.
- Propose exactly: `git commit -m "<feat|fix>: release v<version>"`.
- **PROPOSE** and **WAIT** for explicit Developer authorization.

## Step 7 — Next step

**Suggests what comes next: push · deploy · or a new task.**

- Propose `git push` to synchronize remote.
- Suggest starting a new cycle (`feat:`, `fix:`) or purging the agent session to restore token efficiency.

---

> [!WARNING]
> The cycle is **INCOMPLETE** until all 7 steps are checked.
> You are **FORBIDDEN** from accepting new work until this phase is finalized and the workspace is clean.

---

> Read `.ai/instructions/core/agent-roles.md` for the multi-agent handoff protocol (Planning + Fast roles).
