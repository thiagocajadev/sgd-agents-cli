# Incident Correction — Context Preparation

We are correcting a recorded incident: $ARGUMENTS. This command prepares the context for the **Fix Cycle** defined in the **Working Protocol**.

---

## Phase: SPEC (The Contract) — MODE: PLANNING

Follow the **Phase: SPEC** from the **Working Protocol**. Apply these specific Context Charges:

- **Step 1 (Intent)**: Confirmed as `fix:`.
- **Step 2 (Goal)**: Highlight the incident and the core reason for the fix.
- **Step 3 (Domain & Contracts)**:
  - **Root Cause Analysis (RCA)**: Explicitly identify the layer, file, and line where the contract or logic breaks.
  - **Observed vs Expected**: Contrast the current broken behavior with the desired outcome.
  - **Minimal Surface**: Ensure the proposed fix targets ONLY the bug. No refactors allowed.
- **Step 4 (Verification)**: Ensure the **Reproduction Case** is the primary validator checkpoint.

---

## Phase: PLAN (The Strategy) — MODE: PLANNING

Follow the **Phase: PLAN** from the **Working Protocol**, with this mandatory addition:

- **Regression Test**: Include a task specifically for a test that reproduces the bug (Characterization Test). Use the patterns from `testing-principles.md`.

---

> Read `.ai/instructions/core/agent-roles.md` for the multi-agent handoff protocol (Planning + Fast roles).
