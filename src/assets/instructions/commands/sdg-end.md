# Phase: END (The Delivery) — MODE: PLANNING

This command triggers the **Phase: END** defined in the Working Protocol.

> [!IMPORTANT]
> Follow the canonical **Phase: END** checklist from `.ai/skill/AGENTS.md` (or `workflow.md`).
> All 7 steps — Task Summary, Changelog, Backlog Sync, Context Update, Lint, Commit, Next Step — are defined there as the Single Source of Truth.

---

## Explicit `end:` — Additional Context

When this command is invoked explicitly (the user types `end:`), it serves two purposes:

1. **Cycle Closure**: Closes an active `feat:`, `fix:`, `docs:`, or `land:` cycle through the standard END checklist.
2. **Mid-Conversation Recovery**: If the agent lost track of cycle state, `end:` forces a reset — the agent must re-read `.ai-backlog/tasks.md` and reconstruct what was completed before running the checklist.

> [!CAUTION]
> **NEVER BYPASS THE BUMP**. You are absolutely forbidden from proposing a `git commit` that leaves versioning stuck in `[Unreleased]`. The semantic pipeline (`npm run bump`) is **MANDATORY** across all cycle types — `feat`, `fix`, `docs`, and `land`. Run it before every release commit.

> [!WARNING]
> The cycle is **INCOMPLETE** until all 7 steps are checked.
> You are **FORBIDDEN** from accepting new work until this phase is finalized and the workspace is clean.

---

> Read `.ai/instructions/core/agent-roles.md` for the multi-agent handoff protocol (Planning + Fast roles).
