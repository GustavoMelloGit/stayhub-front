# Linting

Run `npm run lint -- --fix` after every code change before considering the task done. Only commit when lint passes with no errors.

## Rules

- **ALWAYS** run `npm run lint -- --fix` after adding or updating code
- **NEVER** use `// eslint-disable` comments — if a rule is firing unexpectedly, ask the user first
- Fix all lint errors before committing; do not leave them for later
