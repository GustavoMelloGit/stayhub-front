# Commit Rule

After finishing a set of related changes, commit them immediately — do not wait to be asked.

## When to commit

Commit as soon as a logical unit of work is complete:

- A feature is implemented and linting passes
- A bug is fixed
- A refactor is done
- A config or tooling change is made

Run `npm run lint -- --fix` before committing. Only commit when lint passes.

## Conventional Commits format

```
<type>(<optional-scope>): <description>
```

- **type** — one of the values below (lowercase)
- **scope** — optional, the module or area affected (e.g. `property`, `stay`, `auth`)
- **description** — imperative mood, lowercase, no trailing period

### Types

| Type       | When to use                                         |
| ---------- | --------------------------------------------------- |
| `feat`     | New feature or visible behaviour change             |
| `fix`      | Bug fix                                             |
| `refactor` | Code change that is neither a feature nor a bug fix |
| `chore`    | Tooling, config, dependencies, non-src maintenance  |
| `docs`     | Documentation only                                  |
| `style`    | Formatting, whitespace — no logic change            |
| `perf`     | Performance improvement                             |

### Examples

```
feat(property): add year selector to dashboard
fix(stay): correct default check-in date calculation
refactor(filters): remove client-side year filtering from chart components
chore: update dependencies
chore(persona): add shadcn/ui install rule for missing components
```

## Rules

- One commit per logical change — do not batch unrelated work into a single commit
- Never use `--no-verify` or skip hooks
- Never amend a commit that has already been pushed
- Stage specific files by name; avoid `git add -A` or `git add .`
