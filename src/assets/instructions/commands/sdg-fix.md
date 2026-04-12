# Incident Correction — Context Preparation

We are correcting a recorded incident: $ARGUMENTS. This command prepares the context for the **Fix Cycle** defined in the **Working Protocol**.

---

## Phase: SPEC (The Contract) — MODE: PLANNING

Follow the **Phase: SPEC** from the **Working Protocol**, ensuring all 5 steps are executed and announced. Fix specialization:

- **1. Intent Classification**: Confirmed as `fix:`.
- **2. Goal Definition**: Writes one sentence describing the incident and the reason for the fix.
- **3. Domain & Contracts**:
  - **Root Cause Analysis (RCA)**: Explicitly identify the layer, file, and line where the contract or logic breaks.
  - **Observed vs Expected**: Contrast the current broken behavior with the desired outcome.
  - **Minimal Surface**: Ensure the proposed fix targets ONLY the bug. No refactors allowed.
- **4. Verification Checklist**: Creates up to 5 yes/no checkpoints, including the **Reproduction Case** as the primary validator.
- **5. Approval Gate**: Stops and waits for your approval before writing any code.

---

## Phase: PLAN (The Strategy) — MODE: PLANNING

Follow the **Phase: PLAN** from the **Working Protocol**, with this mandatory addition:

- **Regression Test**: Include a task specifically for a test that reproduces the bug (Characterization Test). Use the patterns from `testing-principles.md`.

---

> Read `.ai/instructions/core/agent-roles.md` for the multi-agent handoff protocol (Planning + Fast roles).
