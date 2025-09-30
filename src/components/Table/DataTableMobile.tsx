import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { DataTableProps, JsonDataTableRow } from './types';

export function DataTableMobile<T extends JsonDataTableRow>({
  columns,
  data,
  error,
  isLoading,
}: DataTableProps<T>) {
  const headerColumn = columns.find((column) => column.mobile?.isHeader);
  const restColumns = columns.filter((column) => !column.mobile?.isHeader);

  if (error) {
    return <div>{error}</div>;
  }
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='space-y-4'>
      {data.map((row) => (
        <Card key={row.id} className='gap-2'>
          <CardHeader>
            <CardTitle>{headerColumn?.render(row)}</CardTitle>
          </CardHeader>
          <CardContent>
            {restColumns.map((column) => (
              <div
                key={column.accessorKey}
                {...column.cell}
                className={cn(
                  'flex items-center justify-between',
                  column.cell?.className
                )}
              >
                <span className='font-medium'>{column.header}:</span>
                {column.render(row)}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
