# Data Fetching

TanStack React Query for all server state. The service layer and hook layer are always separate files.

## Rules

- Service files (`*Service.ts`) export a class with **static async methods** — no React, no hooks
- Hook files (`*Service.hooks.ts`) wrap each service method with `useQuery` or `useMutation`
- Mutations use `queryClient.setQueryData()` for optimistic updates, then `queryClient.invalidateQueries()` after the server confirms
- Never call `fetch` or `axios` directly inside a component
- Never put query logic (`useQuery`) inside a service file
- `staleTime` defaults to 5 minutes for read queries

## Structure

```
modules/property/service/
  PropertyService.ts        ← static async methods, Zod validation
  PropertyService.hooks.ts  ← useQuery / useMutation wrappers
```

## Do

```ts
// PropertyService.ts
export class PropertyService {
  static async getPropertyById(id: string): Promise<Property> {
    const response = await api.get(`/property/${id}`);
    return propertySchema.parse(response.data);
  }
}

// PropertyService.hooks.ts
export const useProperty = (id: string) => {
  const {
    data: property,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['property', id],
    queryFn: () => PropertyService.getPropertyById(id),
    staleTime: 5 * 60 * 1000,
  });
  return { property, isLoading, error };
};
```

## Don't

```ts
// Wrong — fetching inside the component
const PropertyPage = ({ id }: { id: string }) => {
  const [property, setProperty] = useState(null);
  useEffect(() => {
    api.get(`/property/${id}`).then(res => setProperty(res.data));
  }, [id]);
};

// Wrong — mixing React Query into the service layer
export class PropertyService {
  static useGetProperty(id: string) {
    return useQuery({ queryKey: ['property', id], queryFn: ... });
  }
}
```

## Mutations

```ts
// PropertyService.hooks.ts
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyData }) =>
      PropertyService.updateProperty(id, data),
    onSuccess: updated => {
      // optimistic update
      queryClient.setQueryData(['property', updated.id], updated);
      // invalidate list
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
  return { mutate, isPending };
};
```
