import { useMemo, useCallback } from 'react';
import type { DataTableRow, JsonDataTableRow } from './types';

type UseDataTableSelectionProps<T extends JsonDataTableRow> = {
  data: Array<DataTableRow<T>>;
  selectedRows: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
};

type UseDataTableSelectionReturn = {
  allSelected: boolean;
  someSelected: boolean;
  isRowSelected: (rowId: string) => boolean;
  handleSelectAll: () => void;
  handleSelectRow: (rowId: string) => void;
};

export function useDataTableSelection<T extends JsonDataTableRow>({
  data,
  selectedRows,
  onSelectionChange,
}: UseDataTableSelectionProps<T>): UseDataTableSelectionReturn {
  const allSelected = useMemo(
    () => data.length > 0 && selectedRows.length === data.length,
    [data.length, selectedRows.length]
  );

  const someSelected = useMemo(
    () => selectedRows.length > 0 && selectedRows.length < data.length,
    [selectedRows.length, data.length]
  );

  const isRowSelected = useCallback(
    (rowId: string): boolean => {
      return selectedRows.includes(rowId);
    },
    [selectedRows]
  );

  const handleSelectAll = useCallback((): void => {
    if (!onSelectionChange) return;
    const allIds = data.map(row => row.id);
    if (selectedRows.length === allIds.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allIds);
    }
  }, [data, selectedRows.length, onSelectionChange]);

  const handleSelectRow = useCallback(
    (rowId: string): void => {
      if (!onSelectionChange) return;
      if (selectedRows.includes(rowId)) {
        onSelectionChange(selectedRows.filter(id => id !== rowId));
      } else {
        onSelectionChange([...selectedRows, rowId]);
      }
    },
    [selectedRows, onSelectionChange]
  );

  return {
    allSelected,
    someSelected,
    isRowSelected,
    handleSelectAll,
    handleSelectRow,
  };
}
