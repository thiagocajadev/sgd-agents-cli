# Agent Roles & Execution Protocol

> [!NOTE]
> This protocol defines how AI Agents execute tasks. The universal baseline is **Single-Agent Mode**, but platforms with native Multi-Agent orchestration (e.g., Claude Code, autonomous Agentic frameworks) can utilize specialized sub-agent routing.

## Execution Mindsets (Phases)

Regardless of the environment, execution must respect these distinct mindsets:

| Role / Mindset | Phases (Cycles)         | Responsibilities                 |
| :------------- | :---------------------- | :------------------------------- |
| **Planning**   | SPEC, PLAN, Review, END | Analytical — strategy and design |
| **Fast**       | CODE, TEST              | Operational — execute and verify |

---

## Baseline: Single-Agent Mode

**This is the standard execution path for all environments (Cursor, Windsurf, Cline, Gemini, Copilot).**

- Execute all phases as a single agent.
- Apply the **Planning** mindset during SPEC and PLAN (MODE: PLANNING, stop for approval). Focus on analysis and constraints.
- Apply the **Fast** mindset during CODE and TEST (MODE: FAST, no strategic detours). Focus purely on implementing the contract.
- The mode annotations in the workflow (`MODE: PLANNING`, `MODE: FAST`) serve as behavioral discipline markers, not execution boundaries. Do not deviate from the approved PLAN during CODE.
- Proceed through the END phase normally.

---

## Extension: Multi-Agent Mode (Native Orchestration)

If your platform supports spawning sub-agents (e.g., using an `Agent()` tool), use this protocol to delegate execution, reducing primary context load.

### Execution Flow

```text
Dev → Planning: SPEC + PLAN → [Dev approval]
               ↓
    Planning spawns Fast via Agent tool
               ↓
          Fast: CODE + TEST
               ↓
    Fast returns output to Planning
               ↓
    Planning: Review + Report → [Dev approval] → END
```

### Delegation Rules

1. **[M] and [L] tasks**: Always spawn Fast after PLAN approval.
2. **[S] tasks**: Planning executes CODE + TEST directly (Single-Agent Mode workflow). The overhead of agent transition exceeds the context benefit.

### Handoff Prompt Structure

When Planning invokes Fast, the payload MUST include:

1. The approved SPEC (goal, inputs/outputs, verification checklist).
2. The approved PLAN (task list with file paths).
3. Relevant context references (`engineering-standards.md`, `code-style.md`, idiom patterns).
4. **Deliverable**: Request tasks completed, Narrative Gate results per function, test pass/fail logs, and lint status.

### Review Gate

Before reporting back to the Developer, Planning must verify Fast's output:

- [ ] Every PLAN task is marked complete in Fast's report
- [ ] Narrative Gate (Stepdown rule, SLA) passed for all modified code
- [ ] Tests pass (no regressions)
- [ ] Linter is clean

If Fast fails any metric, Planning fixes it inline or sends it back to Fast for a single, targeted correction (max 1 loop).
