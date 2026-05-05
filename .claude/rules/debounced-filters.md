# Debounced Filters Pattern

When a filter needs debounce, apply it between the filter state and the API query — never between the input and the filter state.

## Rules

- Input `onChange` updates `useFilters` immediately (URL stays in sync)
- `useDebounce` is applied to the filter value **before** passing to the query hook
- No `useState` or `useEffect` to bridge input ↔ filter ↔ query
- Debounce delay: **500ms** as default

## Pattern

```tsx
const { filters, addFilter, removeFilter } = useFilters();

const valueFilter =
  typeof filters.field === 'string' ? filters.field : undefined;
const effectiveValue = valueFilter ?? defaultValue;

const debouncedValue = useDebounce(effectiveValue, 500);

// Input reflects filter state immediately
<Input
  value={effectiveValue}
  onChange={e => addFilter('field', e.target.value)}
/>;

// Query receives debounced value
useQueryHook({ field: debouncedValue });
```

## Flow

```
input onChange → addFilter (URL updated immediately)
                     ↓
             useDebounce(effectiveValue, 500)
                     ↓
               API query (fires after 500ms)
```

## What NOT to do

```tsx
// Wrong — debounce between input and filter creates out-of-sync UI
const [inputValue, setInputValue] = useState('');
const debouncedValue = useDebounce(inputValue, 500);
useEffect(() => {
  addFilter('field', debouncedValue);
}, [debouncedValue]);
```
