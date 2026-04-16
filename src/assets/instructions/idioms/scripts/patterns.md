# Scripts (Shell / Bash / PowerShell) — Project Conventions

> Universal principles in `../../core/staff-dna.md`. This file: scripting-specific decisions only.

<ruleset name="ScriptsConventions">

## Error Handling

- Bash: `set -euo pipefail` mandatory at top; PowerShell: `$ErrorActionPreference = "Stop"`
- Error halts execution; consistent exit code (`0` = success, `!= 0` = error)
- Never: ignore errors; continue after critical failure; hide relevant output

## Structure

- Single purpose per script; functions for reusable blocks
- Standard order: 1) Config/constants → 2) Input validation → 3) Execution
- Files: `kebab-case.sh` / `kebab-case.ps1`

## Input & Parameters

- Always validate input before execution
- Explicit parameters (`--flag`, `-f`); avoid ambiguous positionals
- Never: assume implicit context; depend on hidden external state

## Logging & Output

- `stdout` → valid output; `stderr` → errors/diagnostics
- Prefix: `[INFO]`, `[ERROR]`

## Idempotency

- Scripts safe for re-execution; check existence before creating

## Security

- Never expose secrets in code/logs; env vars for credentials
- Sanitize inputs; double-quote bash vars: `"${VAR}"`

## Portability

- Declare requirements at top; avoid unnecessary deps
- Cross-env compatibility when possible

## Delta

- Short, predictable, easy to read; if script grows too much → refactor to app
- Prefer native OS tools before external deps

</ruleset>
