import type { FC } from 'react';
import { usePropertyStays } from '../service/PropertyService.hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Stay, WithTenant } from '@/modules/stay/types/Stay';
import { Currency } from '@/lib/currency';
import { Phone } from '@/lib/phone';
import { DataTable } from '@/components/Table/DataTable';

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

export const PropertyStaysList: FC<Props> = ({ propertyId }) => {
  const { stays, isLoading, error } = usePropertyStays(propertyId, {
    onlyIncomingStays: true,
  });

  const handleCopy = (stay: WithTenant<Stay>) => {
    const data = [
      stay.tenant.name,
      Phone.toHumanReadable(stay.tenant.phone),
      `${formatDate(stay.check_in)} - ${formatDate(stay.check_out)}`,
      `${stay.guests} hóspedes`,
    ];
    navigator.clipboard.writeText(data.join('\n'));
    toast.success('Copiado com sucesso');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de estadias</CardTitle>
        <CardDescription>
          Essa lista contém somente as estadias que ainda não foram finalizadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          isLoading={isLoading}
          error={error?.message}
          data={stays ?? []}
          columns={[
            {
              header: 'Hóspede',
              accessorKey: 'tenant.name',
              render: (row) => row.tenant.name,
              mobile: {
                isHeader: true,
              },
            },
            {
              header: 'Hóspedes',
              accessorKey: 'guests',
              render: (row) => row.guests,
              cell: {
                className: 'text-right tabular-nums',
              },
            },
            {
              header: 'Check-in',
              accessorKey: 'check_in',
              render: (row) => formatDate(row.check_in),
            },
            {
              header: 'Check-out',
              accessorKey: 'check_out',
              render: (row) => formatDate(row.check_out),
            },
            {
              header: 'Código',
              accessorKey: 'entrance_code',
              render: (row) => row.entrance_code,
            },
            {
              header: 'Valor',
              accessorKey: 'price',
              render: (row) => Currency.format(row.price),
              cell: {
                className: 'text-right tabular-nums',
              },
            },
            {
              header: 'Ações',
              accessorKey: 'actions',
              render: (row) => (
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleCopy(row)}
                  aria-label='Copiar informações da estadia'
                >
                  <CopyIcon className='size-4' />
                </Button>
              ),
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
