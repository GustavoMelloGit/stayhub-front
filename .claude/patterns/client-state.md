# Client State

Zustand manages filter state. Filters are persisted to the URL hash via `hashStorage` so they survive page refreshes and can be shared via URL.

## Rules

- Use `useFilters()` for any filter that should survive navigation or be shareable via URL
- Never use `useState` for filter values that drive API queries
- Call `addFilter` on every input change — do not debounce the filter write (debounce the query instead, see `debounced-filters.md`)
- Call `removeFilter` when a filter is cleared rather than setting it to an empty string
- Do not create a second Zustand store for filters — extend `useFilters` if new filter keys are needed

## Do

```ts
const { filters, addFilter, removeFilter } = useFilters();

const checkIn = typeof filters.check_in === 'string' ? filters.check_in : undefined;

<Input
  value={checkIn ?? ''}
  onChange={e =>
    e.target.value ? addFilter('check_in', e.target.value) : removeFilter('check_in')
  }
/>
```

## Don't

```ts
// Wrong — local state for a filter that drives an API query
const [checkIn, setCheckIn] = useState('');
useEffect(() => {
  fetchStays({ checkIn });
}, [checkIn]);

// Wrong — setting filter to empty string instead of removing it
addFilter('check_in', '');

// Wrong — creating a parallel store
const useMyFilters = create(() => ({ search: '' }));
```
