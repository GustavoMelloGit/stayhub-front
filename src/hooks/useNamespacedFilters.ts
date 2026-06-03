import { useFilters } from './useFilters';

type FilterValue = string | number | boolean;

export const useNamespacedFilters = (namespace: string) => {
  const {
    filters: all,
    addFilter: rawAdd,
    removeFilter: rawRemove,
  } = useFilters();

  const prefix = `${namespace}.`;

  const filters = Object.fromEntries(
    Object.entries(all)
      .filter(([k]) => k.startsWith(prefix))
      .map(([k, v]) => [k.slice(prefix.length), v])
  );

  const addFilter = (key: string, value: FilterValue) =>
    rawAdd(`${prefix}${key}`, value);

  const removeFilter = (key: string) => rawRemove(`${prefix}${key}`);

  const clearFilters = () =>
    Object.keys(all)
      .filter(k => k.startsWith(prefix))
      .forEach(k => rawRemove(k));

  return { filters, addFilter, removeFilter, clearFilters };
};
