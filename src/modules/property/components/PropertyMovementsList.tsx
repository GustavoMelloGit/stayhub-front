import type { FC } from 'react';
import { useFindAllFromProperty } from '@/modules/finance/service/FinanceService.hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/Table/DataTable';
import { Currency } from '@/lib/currency';
import type { FinanceMovement } from '@/modules/finance/types/Movement';
import { RecordExpenseModal } from './RecordExpenseModal';
import { useDisclosure } from '@/hooks/useDisclosure';
import { Plus } from 'lucide-react';

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

export const PropertyMovementsList: FC<Props> = ({ propertyId }) => {
  const { data, isLoading, error } = useFindAllFromProperty(propertyId);
  const { isOpen, open, close } = useDisclosure();

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
        <DataTable
          isLoading={isLoading}
          error={error?.message}
          data={data?.data ?? []}
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
