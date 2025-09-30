import type { DataTableProps, JsonDataTableRow } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function DataTableDesktop<T extends JsonDataTableRow>({
  columns,
  data,
  error,
  isLoading,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.accessorKey}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={columns.length} className='h-24 text-center'>
              Carregando...
            </TableCell>
          </TableRow>
        )}
        {error && (
          <TableRow>
            <TableCell colSpan={columns.length} className='h-24 text-center'>
              {error}
            </TableCell>
          </TableRow>
        )}
        {!isLoading &&
          !error &&
          data.map((row) => {
            return (
              <TableRow key={row.id}>
                {columns.map((column) => (
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
