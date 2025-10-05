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
import { CopyIcon, Link } from 'lucide-react';
import { toast } from 'sonner';
import type { Stay, WithTenant } from '@/modules/stay/types/Stay';
import { Currency } from '@/lib/currency';
import { Phone } from '@/lib/phone';
import { DataTable } from '@/components/Table/DataTable';
import { ROUTES } from '@/routes/routes';

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

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado com sucesso');
  };

  const copyCohostData = (stay: WithTenant<Stay>) => {
    const data = [
      stay.tenant.name,
      Phone.toHumanReadable(stay.tenant.phone),
      `${formatDate(stay.check_in)} - ${formatDate(stay.check_out)}`,
      `${stay.guests} hóspedes`,
    ];
    copyText(data.join('\n'));
  };

  const copyStayData = (stay: WithTenant<Stay>) => {
    const stayUrl = ROUTES.stayInstructions(stay.id);
    const url = new URL(stayUrl, location.origin);
    copyText(url.toString());
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
              render: row => row.tenant.name,
              mobile: {
                isHeader: true,
              },
            },
            {
              header: 'Hóspedes',
              accessorKey: 'guests',
              render: row => row.guests,
              cell: {
                className: 'text-right tabular-nums',
              },
            },
            {
              header: 'Check-in',
              accessorKey: 'check_in',
              render: row => formatDate(row.check_in),
            },
            {
              header: 'Check-out',
              accessorKey: 'check_out',
              render: row => formatDate(row.check_out),
            },
            {
              header: 'Código',
              accessorKey: 'entrance_code',
              render: row => row.entrance_code,
            },
            {
              header: 'Valor',
              accessorKey: 'price',
              render: row => Currency.format(row.price),
              cell: {
                className: 'text-right tabular-nums',
              },
            },
            {
              header: 'Ações',
              accessorKey: 'actions',
              render: row => (
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => copyCohostData(row)}
                    aria-label='Copiar informações da estadia'
                  >
                    <CopyIcon className='size-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => copyStayData(row)}
                    aria-label='Copiar informações da estadia'
                  >
                    <Link className='size-4' />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
