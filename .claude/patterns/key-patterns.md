# Key Patterns

## Data fetching

TanStack React Query for server state. Service files export static async methods; `.hooks.ts` files wrap them with `useQuery`/`useMutation`. Mutations use `queryClient.setQueryData()` for optimistic updates and `queryClient.invalidateQueries()` after changes.

## HTTP client

Axios in `lib/api.ts` with interceptors — request interceptor adds Bearer token from `localStorage`, response interceptor handles 401 (clears auth and redirects to `/login`).

## Authentication

Token stored in `localStorage` as `auth_token`. `useAuthData()` calls `/auth/me` on app load to validate session.

## Client state

Zustand for filters; filter state persists in URL hash via custom `hashStorage`.

## Forms

React Hook Form + Zod resolvers. Schemas are co-located in the module's service layer.

## Styling

Tailwind CSS utility classes with `cn()` (clsx + tailwind-merge) for conditional class merging. Radix UI for unstyled accessible primitives styled with Tailwind.

## Path alias

`@/` maps to `src/`.
