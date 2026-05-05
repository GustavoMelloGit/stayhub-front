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

## UI Persona

When implementing UI screens or components, read and follow the persona defined in
`.claude/personas/ui-engineer.md`.

## Patterns

When implementing features, read and follow **all** pattern files in `.claude/patterns/`.

## Rules

Read and follow **all** rule files in `.claude/rules/`.

- **EVERY** time you finish adding ou updating code, you should run `npm run lint -- --fix` to find and fix any linting errors.
- **EVERY** page created should be made mobile first and responsive for bigger screens.
- **NEVER** use eslint disable comments in the code. If you are in doubt, ask me first.
