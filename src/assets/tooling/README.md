# Tooling (optional, inert)

Pre-made scripts and hooks. **Nothing is wired by default** — `sdg-agents init` copies
these files into `.ai/tooling/`, but no `package.json`, no `.husky/`, no devDep is
modified by the CLI. Activate on demand with agent assistance or manually.

## Inventory

### `scripts/prune-backlog.mjs`

Trims `.ai/backlog/tasks.md` `## Done` section to the N most recent entries.

```
node .ai/tooling/scripts/prune-backlog.mjs [--keep N]
```

- Default `N = 3`.
- Idempotent: running twice with the same `--keep` is a no-op.
- Intended for Phase END of each cycle.

### `scripts/bump-version.mjs`

Minimal semver bump. Only rewrites `package.json.version`.

```
node .ai/tooling/scripts/bump-version.mjs <patch|minor|major>
```

- Does NOT touch `CHANGELOG.md`.
- Does NOT run `git add`, `git commit`, `git tag`, or `git push`.
- Use case: dev experimentation, pre-release bumps, or agent-driven version-only changes.
- For full release bump (version + CHANGELOG promote + stage), use the project's own
  `scripts/bump.mjs` if installed.

### `husky/pre-commit`

Runs the SDG gate against staged changes, blocking commit on rule violations.

### `husky/commit-msg`

Validates conventional-commit prefix:
`feat|fix|docs|audit|land|chore|refactor|test|perf`.

## Activation recipes

### Activate husky hooks

```
npm install --save-dev husky
npx husky init
cp .ai/tooling/husky/pre-commit .husky/pre-commit
cp .ai/tooling/husky/commit-msg .husky/commit-msg
chmod +x .husky/pre-commit .husky/commit-msg
```

### Wire scripts as npm commands

Edit `package.json`:

```json
{
  "scripts": {
    "prune:backlog": "node .ai/tooling/scripts/prune-backlog.mjs",
    "bump:version": "node .ai/tooling/scripts/bump-version.mjs"
  }
}
```

Or ask your agent: "wire the tooling scripts into package.json."
