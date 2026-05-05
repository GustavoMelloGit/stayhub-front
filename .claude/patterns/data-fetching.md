# Data Fetching

TanStack React Query for server state. Service files export static async methods; `.hooks.ts` files wrap them with `useQuery`/`useMutation`. Mutations use `queryClient.setQueryData()` for optimistic updates and `queryClient.invalidateQueries()` after changes.
