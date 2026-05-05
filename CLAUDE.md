# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (Vite)
npm run build        # Type-check then build for production
npm run lint         # ESLint + TypeScript type checking
npm run lint:fix     # ESLint with auto-fix
npm run format       # Format with Prettier
npm run preview      # Preview production build locally
```

No test framework is configured in this project.

## Architecture

**Feature-based modular structure** under `src/`:

- `modules/` — Domain modules (auth, property, stay, finance, error). Each module contains:
  - `service/` — API methods (`*Service.ts`) and React Query hooks (`*Service.hooks.ts`)
  - `view/` — Page components
  - `components/` — Module-specific UI components
  - `types/` — TypeScript types and Zod schemas
- `components/` — Shared UI: `ui/` (Radix UI primitives), `layout/`, `ProtectedRoute`, `PublicRoute`
- `routes/` — Router setup with lazy-loaded components; route constants in `routes.ts`
- `hooks/` — Shared custom hooks (`useAuth`, `useFilters`, `useDisclosure`)
- `lib/` — Axios instance (`api.ts`), React Query config (`query-client.ts`), env validation (`env.ts`), utilities

## Environment

Requires `VITE_API_URL` in `.env` (default: `http://localhost:3030`). Validated at startup via Zod in `lib/env.ts`.

## Personas

| When                                                        | Persona                                 |
| ----------------------------------------------------------- | --------------------------------------- |
| Clarifying scope, business rules, or domain logic           | `.claude/personas/architect.md`         |
| Defining layout, visual hierarchy, or component choices     | `.claude/personas/designer.md`          |
| Implementing UI screens or components                       | `.claude/personas/frontend-engineer.md` |
| Auditing or implementing keyboard, ARIA, or contrast issues | `.claude/personas/accessibility.md`     |

## Patterns

Patterns are **task-specific references** — read the relevant pattern file when you are about to implement something it covers. You do not need to load all patterns at once; load the one(s) that apply to the task at hand.

Pattern files live in `.claude/patterns/`. Examples of when to load them:

| Task                                     | Pattern to read                           |
| ---------------------------------------- | ----------------------------------------- |
| Adding an API endpoint or HTTP call      | `http-client.md`                          |
| Adding a query or mutation               | `data-fetching.md`                        |
| Adding a form                            | `forms.md`                                |
| Adding a filter that drives an API query | `debounced-filters.md`, `client-state.md` |
| Styling a component                      | `styling.md`                              |
| Accessing the current user               | `authentication.md`                       |
| Writing an import path                   | `path-alias.md`                           |

## Rules

Rules are **always active** — internalize them and apply them to every task without being reminded. Rule files live in `.claude/rules/`; read them all at the start of each session.

Current rules: `commit.md`, `linting.md`, `mobile-first.md`.
