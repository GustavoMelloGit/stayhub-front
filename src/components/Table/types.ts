import type { ComponentPropsWithoutRef } from 'react';

export type BaseDataTableRow = {
  id: string;
};

export type JsonDataTableRow = Record<string, unknown>;

export type DataTableRow<T extends JsonDataTableRow> = T & BaseDataTableRow;

export type DataTableProps<T extends JsonDataTableRow> = {
  isLoading?: boolean;
  error?: string;
  data: Array<DataTableRow<T>>;
  columns: {
    header: string;
    accessorKey: string;
    render: (row: DataTableRow<T>) => React.ReactNode;
    cell?: ComponentPropsWithoutRef<'div'>;
    mobile?: {
      isHeader?: boolean;
    };
  }[];
};
