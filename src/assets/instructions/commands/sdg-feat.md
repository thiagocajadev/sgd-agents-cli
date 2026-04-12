# Feature Execution — Context Preparation

We are initializing a new feature: $ARGUMENTS. This command prepares the context for the development lifecycle following the **Working Protocol**.

---

## Phase: SPEC (The Contract) — MODE: PLANNING

Follow the **Phase: SPEC** from the **Working Protocol**, ensuring all 5 steps are executed and announced. Mandatory technical density:

- **1. Intent Classification**: Confirmed as `feat:`.
- **2. Goal Definition**: Writes one sentence describing what will be built and why.
- **3. Domain & Contracts**:
  - **Domain Modeling**: Defines the domain (Backend / Frontend / Fullstack) and primary entities.
  - **Configuration Contract**: Define environment variables (abstract keys).
  - **Contract-First**: Defines the inputs and outputs (API or Props) before implementation.
  - **Backend SPEC**: Define response contract template (method, path, input/output types, error codes). Load `competencies/backend.md`.
  - **Frontend SPEC**: Define section structure, layout skeleton (grid/columns), and states (Loading/Empty/Error). Load `competencies/frontend.md`.
- **4. Verification Checklist**: Creates up to 5 yes/no checkpoints to confirm the work is done right (min 3: Happy Path, Edge Case, Expected Failure).
- **5. Approval Gate**: Stops and waits for your approval before writing any code.

---

> Read `.ai/instructions/core/agent-roles.md` for the multi-agent handoff protocol (Planning + Fast roles).
