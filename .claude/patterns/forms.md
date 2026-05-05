# Forms

React Hook Form with Zod resolvers. The Zod schema is the single source of truth for validation — it lives co-located with the service layer, not inside the component.

## Rules

- Define the Zod schema in the module's `service/` directory alongside the API methods
- Use `zodResolver` — never write manual `validate` functions
- Use `FormField` + `FormControl` + `FormMessage` from `@/components/ui/form` for consistent error display
- Never access `errors` directly from `formState` — `FormMessage` reads them automatically via the form context
- `onSubmit` receives already-validated, type-safe data — no need to re-validate inside the handler

## Schema location

```
modules/stay/service/
  StayService.ts         ← API methods
  StayService.hooks.ts   ← React Query hooks
  stay.schema.ts         ← Zod schema (or co-located in StayService.ts)
```

## Do

```ts
// Schema co-located with the service
const stayFormSchema = z.object({
  check_in: z.string().min(1),
  check_out: z.string().min(1),
  guests: z.number().int().positive(),
  price: z.number().positive(),
});

type StayFormData = z.infer<typeof stayFormSchema>;

// Component
const form = useForm<StayFormData>({
  resolver: zodResolver(stayFormSchema),
  defaultValues: { check_in: '', check_out: '', guests: 1, price: 0 },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name='check_in'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Check-in</FormLabel>
          <FormControl>
            <Input type='datetime-local' {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

## Don't

```ts
// Wrong — schema defined inside the component
const MyForm = () => {
  const schema = z.object({ name: z.string() }); // recreated on every render
};

// Wrong — manual validation instead of zodResolver
const form = useForm({
  validate: values => {
    const errors = {};
    if (!values.name) errors.name = 'Required';
    return errors;
  },
});

// Wrong — reading errors manually instead of using FormMessage
const { formState: { errors } } = form;
<p>{errors.check_in?.message}</p>
```
