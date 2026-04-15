# Working Protocol (Spec Driven Design + Token Discipline)

<ruleset name="WorkingProtocol">

> [!NOTE]
> Standard operational workflow for AI agents. This is the **Single Source of Truth** for the context-driven lifecycle.

## 5 Steps

A practical workflow for every development cycle:

- **SPEC (THE CONTRACT)**: Write down what you're building and why. No code until there's a clear agreement.
- **PLAN (THE STRATEGY)**: Break the work into ordered steps. Small and clear enough that anyone can follow.
- **CODE (THE EXECUTION)**: Follow the plan. Write what was agreed, nothing more.
- **TEST (THE VERIFICATION)**: Check that what was built matches what was agreed. Catch problems before they ship.
- **END (THE DELIVERY)**: Close the cycle: update the changelog, sync the backlog, and move on.

## Intent Routing

On every request, classify intent before acting:

| Signal                    | Cycle                                                                                  |
| :------------------------ | :------------------------------------------------------------------------------------- |
| `land: ...`               | Read `.ai/commands/sdg-land.md` → Follow **Land Cycle** (inception only)               |
| `feat: ...`               | Read `.ai/commands/sdg-feat.md` (Context Charge) → Follow **Feature Cycle**            |
| `fix: ...`                | Read `.ai/commands/sdg-fix.md` (Context Charge) → Follow **Fix Cycle**                 |
| `docs: ...`               | Read `.ai/commands/sdg-docs.md` (Context Charge) → Follow **Docs Cycle**               |
| `end:`                    | Read `.ai/commands/sdg-end.md` → Execute **END Phase** checklist (no argument)         |
| `audit:`                  | Read `.ai/commands/sdg-audit.md` → Run `npx sdg-agents audit` → Follow **Audit Cycle** |
| No prefix, intent unclear | Ask once: "land, feat, fix, docs, or audit?" — then proceed                            |

---

## Phase: SPEC (The Contract) — MODE: PLANNING

> <rule name="PhaseSPEC">
> [!IMPORTANT]
> Structure the intent before any implementation. **Stop and wait for approval.**
>
> 1. **Intent Classification**: Reads the request and identifies the intent: `land:`, `feat:`, `fix:`, `docs:` or `end:`.
> 2. **Goal Definition**: Writes one sentence describing what will be built and why.
> 3. **Domain & Contracts**: Defines the domain (Backend / Frontend / Fullstack) and the inputs and outputs.
> 4. **Verification Checklist**: Creates up to 5 yes/no checkpoints to confirm the work is done right.
> 5. **Context Report**: Run `wc -c` on the command file and backlog files read (`context.md`, `tasks.md`). Sum bytes ÷ 4, add 4K for base instructions. Show inline: `📊 ~N tokens loaded`.
> 6. **Approval Gate**: Stops and waits for your approval before writing any code.
>    </rule>

## Phase: PLAN (The Strategy) — MODE: PLANNING

> <rule name="PhasePLAN">
> [!NOTE]
> After spec is approved, produce a numbered task list ordered by logical execution sequence. **Stop and wait for approval.**
>
> 1. **Task Breakdown**: Breaks the spec into concrete tasks. Each one starts with an action verb.
> 2. **Logical Sequencing**: Orders tasks by dependency: what needs to exist first, goes first.
> 3. **Effort Tagging**: Tags each task by size: `[S]` small · `[M]` medium · `[L]` large (must be split).
> 4. **Sub-task Split**: Breaks every `[L]` task into numbered steps: 1.1, 1.2...
> 5. **Backlog Sync**: Saves all tasks to `.ai-backlog/tasks.md` and marks the first one as in progress.
> 6. **Impact Map**: Write `.ai-backlog/impact-map.md`. Run `git diff --name-only HEAD` (fallback: `git status --short`) to list changed files. For each, trace imports to find dependents (Blast Radius) and test files at risk. Sections: `## Changed`, `## Blast Radius`, `## Tests at Risk`, `## Safe`. This map is the agent's read-list for Phase CODE — skip everything outside it.
> 7. **Cost Estimate**: Run `wc -c` on all files in `## Changed` + `## Blast Radius`. Sum bytes ÷ 4, add context already loaded + 8K for conversation overhead. Show before approval:
>    > 📊 Task estimate: ~N tokens
> 8. **Approval Gate**: Stops and waits for your approval before writing any code.
>    </rule>

## Phase: CODE (The Execution) — MODE: FAST

> <rule name="PhaseCODE">
> [!IMPORTANT]
> Follow the approved plan strictly.
>
> 1. **DNA-GATE & MENTAL RESET [LOCKED]**: Before starting, explicitly list which **Engineering Laws (staff-dna.md)** apply to the current task and why. Confirm mental alignment.
> 2. **Context Load**: Reads the project's standards and style guide before writing anything (read `engineering-standards.md`, `code-style.md`, and competencies).
> 3. **Quality Gate**: Reviews every function against the guide's readability rules before moving on.
>
> _Narrative Gate Checklist:_
>
> - [ ] **Stepdown Rule** — entry point is topmost; callers above callees in the file
> - [ ] **SLA** — this function orchestrates OR implements, never both in same body
> - [ ] **Guard Clauses** — all nested conditionals replaced with early returns
> - [ ] **Narrative Siblings** — one-off helpers defined as local siblings immediately following their caller
> - [ ] **Explaining Returns** — return value assigned to a named `const`; no bare returns
> - [ ] **Boolean Prefix** — `isLoading`, `hasError`, `isActive`; never bare `loading`, `error`
> - [ ] **Named Expectations** (Tests) — `input`/`actual`/`expected` triad; no magic values in `assert`
> - [ ] **Boundary Resilience** — error handling (_try/catch_ or _Early Return_) at critical I/O or data points
> - [ ] **Code as Documentation** — no "what" comments; only `// why:` for non-obvious constraints
>
> 4. **Plan Adherence**: Follows the agreed plan. No extra features or refactors outside what was approved.
> 5. **Blocker Surface**: Raises blockers immediately. Never quietly works around them.
>    </rule>

## Phase: TEST (The Verification) — MODE: FAST

> <rule name="PhaseTEST">
> [!IMPORTANT]
> Check that what was built matches what was agreed.
>
> 1. **Checklist Verification**: Goes through every item on the Spec's Verification Checklist.
> 2. **Regression Check**: For `fix:` cycles: confirms the bug is gone and nothing else broke.
> 3. **Audit Gate (Confirmation)**: Analyzes the modified files against the Engineering Laws. The audit is the final confirmation that the **Phase: CODE** quality was maintained.
> 4. **Lint Fix**: Runs the linter and fixes what it can before wrapping up.
> 5. **Fix Loop (Circuit Breaker)**: If anything fails (Tests, Lint, or Audit): fall back to Phase CODE to fix, then re-run TEST. Max 3 attempts total. Upon the 3rd failure, STOP the cycle immediately and generate an explicit Failure Report for the developer so you can jointly explore alternatives.
> 6. **Report**: Reports the result of each checklist item, linting, and audit status before moving on.
>    </rule>

## Phase: END (The Delivery) — MODE: PLANNING

> <rule name="PhaseEND">
> [!NOTE]
> Close the cycle: update the changelog, sync the backlog, and move on.
>
> 1. **Task Summary**: Writes one sentence per completed task.
> 2. **Changelog**: Adds ONE entry for EVERY completed task. Every cycle that produces artifacts must be recorded — no commit is valid without a CHANGELOG entry.
>
>    | Cycle   | Section     | Use for                                   |
>    | :------ | :---------- | :---------------------------------------- |
>    | `feat:` | `### Added` | New feature or capability                 |
>    | `fix:`  | `### Fixed` | Bug resolved or behavior corrected        |
>    | `docs:` | `### Fixed` | Documentation corrected or aligned        |
>    | `land:` | `### Added` | New project backlog and inception context |
>
> 3. **Backlog Sync**: Moves all finished tasks to `## Done` in `tasks.md`.
> 4. **Context Update**: Updates `## Now` in `context.md` with the next objective or clears it.
> 5. **Map Reset**: Overwrite `.ai-backlog/impact-map.md` with the idle state below. If the file does not exist, skip (idempotent).
>
>    ```md
>    # Impact Map — No active cycle
>
>    > Volatile file. Created at Phase PLAN. Cleared at Phase END.
>    ```
>
> 6. **Lint**: Runs the linter, fixes what's possible, and blocks the commit if errors remain.
> 7. **Commit [LOCKED: COMMIT-GATE]**: If `package.json` has a `bump` script, execute `npm run bump <feat|fix|docs|land>` matching the active cycle type. Then audit workspace with `git add .` and propose the release commit (Pattern: `<intent>: release v<version> - <description>`).
>
>    [!CAUTION]
>    **STOP IMMEDIATELY.** You are forbidden from running `git commit` autonomously. You must present the proposed commit message to the user and await explicit verbal approval before proceeding.
>
> 8. **Next step**: Suggests what comes next: push · deploy · or a new task.
>
> [!CAUTION]
> **SOVEREIGN GATE**: Never bypass human verification for commits. Autonomous commits are a violation of Law 0.
> </rule>

## Rule: Task Handoff (Cross-Session & Cross-Agent Continuity)

> <rule name="TaskHandoff">
> [!IMPORTANT]
> `.ai-backlog/tasks.md` is the single source of truth for work state. Any agent, any session, any model can continue from it.

### Session Start

1. **Terminal Sanity Check**: Run `node -v` and `npm -v` (or the project's primary toolchain) to "wake up" the terminal and confirm execution capabilities in the current shell.
2. Read `.ai-backlog/context.md` — understand the project brief. If missing, analyze `package.json`, `README.md`, entry points and generate it (fields: name, stack, pattern, entry, Decisions, Now, Partner). Never overwrite existing.
3. Read `.ai-backlog/tasks.md` — check for `[IN_PROGRESS]` tasks before accepting new work.
4. **Impact Map Check**: Read `.ai-backlog/impact-map.md`. If active (not idle): load only files under `## Changed` and `## Blast Radius`. If missing or idle: proceed normally. If backlog deleted: recreate idle map, then rebuild from `git diff --name-only HEAD` if a cycle is in progress.
5. If an `[IN_PROGRESS]` task exists: resume it. Announce what was in progress and continue from the checkpoint.

### Checkpoint (after each atomic task)

- Mark the completed task as `[DONE]` and move it to `## Done`.
- Move the next task to `## Active` as `[IN_PROGRESS]` with a one-line context note: what was done and what comes next.

### Proactive Handoff (approaching token/context limit)

- When the response is growing long or the next task is complex, **stop proactively**.
- Write a checkpoint to `.ai-backlog/tasks.md`: current task stays `[IN_PROGRESS]` with a note of exactly where it stopped and what the next step is.
- Announce: _"Approaching context limit. Saved checkpoint to `.ai-backlog/tasks.md`. Start a new session and the agent will continue from here."_

### Recovery (if tasks.md is lost or missing)

- Read the last 10–20 git commits (`git log --oneline -20`) to reconstruct completed work.
- Rebuild `tasks.md` from commit history and any remaining in-progress files.
  > </rule>

## Rule: Cycle Continuity (Conversation During Active Cycles)

> <rule name="CycleContinuity">
> [!NOTE]
> An active cycle (feat/fix/docs) stays open until END is reached. Mid-cycle messages do not close or restart the cycle.

When a message arrives during an active cycle, classify it before acting:

| Message type                 | Example                                   | Action                                                                        |
| :--------------------------- | :---------------------------------------- | :---------------------------------------------------------------------------- |
| **Question / clarification** | "why did you choose this approach?"       | Answer directly, then resume the cycle                                        |
| **Plan adjustment**          | "skip step 3" / "add a step for X"        | Update the plan, confirm if the change is significant, continue               |
| **Pivot**                    | "change the approach entirely"            | Return to SPEC, revise, wait for re-approval                                  |
| **Unrelated request**        | "fix this other thing while you're at it" | Flag it as out-of-scope. Finish the current cycle first, then start a new one |

**State Recovery**: After any conversational interruption, explicitly state your current position before continuing.
_Example: "Resuming Cycle Feat — Phase: SPEC — Step 3 (Domain & Contracts)."_

**Hard Rule**: Never interpret a conversational message as a new `land:`, `feat:`, or `fix:` while a cycle is active. The cycle closes only at END.

> </rule>

## Rule: Token Discipline

> <rule name="TokenDiscipline">
> [!IMPORTANT]
> Maximize technical density. No filler. Start with conclusions.

- After `END`, suggest new chat session to clear context rot.
- No "Certainly!", "Great question", or re-summarizing unchanged code.
- Use `file:line` references instead of repeating code.
- Circuit Breaker: stop if same error repeats 3 times or no progress in 3 turns.
  > </rule>

</ruleset>
