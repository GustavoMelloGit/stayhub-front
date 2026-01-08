import { create } from 'zustand';
import {
  persist,
  type StateStorage,
  createJSONStorage,
} from 'zustand/middleware';

const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    const storedValue = searchParams.get(key) ?? '';
    return JSON.parse(storedValue);
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.set(key, JSON.stringify(newValue));
    location.hash = searchParams.toString();
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.delete(key);
    location.hash = searchParams.toString();
  },
};

type FilterValue = string | number | boolean;
type Filters = Record<string, FilterValue>;
type FilterStoreState = {
  filters: Filters;
  addFilter: (key: string, value: FilterValue) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
};

export const useFilters = create<FilterStoreState>()(
  persist(
    (set, get) => ({
      filters: {},
      addFilter: (key: string, value: FilterValue) => {
        set({ filters: { ...get().filters, [key]: value } });
      },
      clearFilters: () => {
        set({ filters: {} });
      },
      removeFilter: (key: string) => {
        const filtersCopy = { ...get().filters };
        delete filtersCopy[key];
        set({ filters: filtersCopy });
      },
    }),
    {
      name: 'filters',
      storage: createJSONStorage(() => hashStorage),
    }
  )
);
