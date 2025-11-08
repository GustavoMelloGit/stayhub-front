import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { DataTableProps, JsonDataTableRow } from './types';
import { Checkbox } from '../ui/checkbox';
import { useDataTableSelection } from './useDataTableSelection';

export function DataTableMobile<T extends JsonDataTableRow>({
  columns,
  data,
  error,
  isLoading,
  enableRowSelection = false,
  selectedRows = [],
  onSelectionChange,
}: DataTableProps<T>) {
  const headerColumn = columns.find(column => column.mobile?.isHeader);
  const restColumns = columns.filter(column => !column.mobile?.isHeader);

  const { isRowSelected, handleSelectRow } = useDataTableSelection({
    data,
    selectedRows,
    onSelectionChange,
  });

  if (error) {
    return <div>{error}</div>;
  }
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='space-y-4'>
      {data.map(row => {
        const isSelected = isRowSelected(row.id);
        return (
          <Card
            key={row.id}
            className={cn('gap-2', isSelected && 'ring-2 ring-primary')}
          >
            <CardHeader className='flex flex-row items-center justify-between gap-2'>
              <CardTitle>{headerColumn?.render(row)}</CardTitle>
              {enableRowSelection && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleSelectRow(row.id)}
                  aria-label={`Selecionar linha ${row.id}`}
                />
              )}
            </CardHeader>
            <CardContent className='space-y-1'>
              {restColumns.map(column => (
                <div
                  key={column.accessorKey}
                  {...column.cell}
                  className={cn(
                    'flex items-center justify-between gap-1 flex-wrap',
                    column.cell?.className
                  )}
                >
                  <span className='font-medium'>{column.header}:</span>
                  {column.render(row)}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
