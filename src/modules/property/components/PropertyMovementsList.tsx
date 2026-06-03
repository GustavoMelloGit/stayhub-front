import { type FC } from 'react';
import { useFindAllFromProperty } from '@/modules/finance/service/FinanceService.hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/Table/DataTable';
import { Currency } from '@/lib/currency';
import type { FinanceMovement } from '@/modules/finance/types/Movement';
import { RecordExpenseModal } from './RecordExpenseModal';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useNamespacedFilters } from '@/hooks/useNamespacedFilters';
import { useDebounce } from '@/hooks/useDebounce';
import { CalendarIcon, Plus, X } from 'lucide-react';

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

type Props = {
  propertyId: string;
};

const PAGE_SIZE = 10;

export const PropertyMovementsList: FC<Props> = ({ propertyId }) => {
  const { filters, addFilter, removeFilter } =
    useNamespacedFilters('movements');
  const currentPage = +filters.page || 1;
  const startDateFilter =
    typeof filters.start_date === 'string' ? filters.start_date : undefined;
  const endDateFilter =
    typeof filters.end_date === 'string' ? filters.end_date : undefined;

  const debouncedStartDate = useDebounce(startDateFilter, 500);
  const debouncedEndDate = useDebounce(endDateFilter, 500);

  const { data, isLoading, error } = useFindAllFromProperty(propertyId, {
    page: currentPage,
    limit: PAGE_SIZE,
    start_date: debouncedStartDate,
    end_date: debouncedEndDate,
  });
  const { isOpen, open, close } = useDisclosure();

  const handleStartDateChange = (value: string) => {
    if (value) addFilter('start_date', value);
    else removeFilter('start_date');
    addFilter('page', 1);
  };

  const handleEndDateChange = (value: string) => {
    if (value) addFilter('end_date', value);
    else removeFilter('end_date');
    addFilter('page', 1);
  };

  const clearDateFilters = () => {
    removeFilter('start_date');
    removeFilter('end_date');
    addFilter('page', 1);
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Movimentações Financeiras</CardTitle>
            <CardDescription>
              Histórico de receitas e despesas da propriedade
            </CardDescription>
          </div>
          <Button onClick={open}>
            <Plus />
            Nova Despesa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-end'>
          <div className='flex flex-1 flex-col gap-3 sm:flex-row'>
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='movements-filter-start'
                className='flex items-center gap-1.5'
              >
                <CalendarIcon className='size-3.5 text-muted-foreground' />
                De
              </Label>
              <Input
                id='movements-filter-start'
                type='date'
                value={startDateFilter ?? ''}
                max={endDateFilter}
                onChange={e => handleStartDateChange(e.target.value)}
                className='w-full sm:w-44'
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='movements-filter-end'>até</Label>
              <Input
                id='movements-filter-end'
                type='date'
                value={endDateFilter ?? ''}
                min={startDateFilter}
                onChange={e => handleEndDateChange(e.target.value)}
                className='w-full sm:w-44'
              />
            </div>
          </div>
          {(startDateFilter || endDateFilter) && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearDateFilters}
              className='self-end'
            >
              <X className='mr-2 size-4' />
              Limpar filtro
            </Button>
          )}
        </div>
        <DataTable
          isLoading={isLoading}
          error={error?.message}
          data={data?.data ?? []}
          pagination={{
            page: currentPage,
            totalPages: data?.pagination.total_pages ?? 1,
            onPageChange: page => addFilter('page', page),
          }}
          columns={[
            {
              header: 'Descrição',
              accessorKey: 'description',
              render: (row: FinanceMovement) => row.description || '-',
              mobile: {
                isHeader: true,
              },
            },
            {
              header: 'Categoria',
              accessorKey: 'category',
              render: (row: FinanceMovement) => row.category,
            },
            {
              header: 'Valor',
              accessorKey: 'amount',
              render: (row: FinanceMovement) => Currency.format(row.amount),
              cell: {
                className: 'text-right tabular-nums',
              },
            },
            {
              header: 'Data',
              accessorKey: 'created_at',
              render: (row: FinanceMovement) => formatDate(row.created_at),
            },
          ]}
        />
      </CardContent>

      <RecordExpenseModal
        propertyId={propertyId}
        isOpen={isOpen}
        onClose={close}
      />
    </Card>
  );
};
