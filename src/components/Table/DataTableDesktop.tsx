import type { DataTableProps, JsonDataTableRow } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '../ui/checkbox';
import { useDataTableSelection } from './useDataTableSelection';

export function DataTableDesktop<T extends JsonDataTableRow>({
  columns,
  data,
  error,
  isLoading,
  enableRowSelection = false,
  selectedRows = [],
  onSelectionChange,
}: DataTableProps<T>) {
  const { allSelected, isRowSelected, handleSelectAll, handleSelectRow } =
    useDataTableSelection({
      data,
      selectedRows,
      onSelectionChange,
    });

  const colSpan = enableRowSelection ? columns.length + 1 : columns.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {enableRowSelection && (
            <TableHead className='w-12'>
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                aria-label='Selecionar todas as linhas'
              />
            </TableHead>
          )}
          {columns.map(column => (
            <TableHead key={column.accessorKey}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={colSpan} className='h-24 text-center'>
              Carregando...
            </TableCell>
          </TableRow>
        )}
        {error && (
          <TableRow>
            <TableCell colSpan={colSpan} className='h-24 text-center'>
              {error}
            </TableCell>
          </TableRow>
        )}
        {!isLoading &&
          !error &&
          data.map(row => {
            const isSelected = isRowSelected(row.id);
            return (
              <TableRow
                key={row.id}
                data-state={isSelected ? 'selected' : undefined}
              >
                {enableRowSelection && (
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelectRow(row.id)}
                      aria-label={`Selecionar linha ${row.id}`}
                    />
                  </TableCell>
                )}
                {columns.map(column => (
                  <TableCell key={column.accessorKey} {...column.cell}>
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
