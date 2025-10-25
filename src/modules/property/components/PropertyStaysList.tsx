import type { FC } from 'react';
import { usePropertyStays } from '../service/PropertyService.hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { CircleX, CopyIcon, Link, MessageCirclePlus } from 'lucide-react';
import { toast } from 'sonner';
import type { Stay, WithTenant } from '@/modules/stay/types/Stay';
import { Currency } from '@/lib/currency';
import { Phone } from '@/lib/phone';
import { DataTable } from '@/components/Table/DataTable';
import { ROUTES } from '@/routes/routes';
import { useCancelStay } from '@/modules/stay/service/StayService.hooks';
import { queryClient } from '@/lib/query-client';

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
  const { mutate: cancelStay, isPending: isCancelingStay } = useCancelStay({
    onSuccess: () => {
      toast.success('Estadia cancelada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['propertyStays'] });
    },
    onError: () => {
      toast.error('Erro ao cancelar estadia');
    },
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

  const getWhatsAppHref = (stay: WithTenant<Stay>): string => {
    const stayUrl = ROUTES.stayInstructions(stay.id);
    const url = new URL(stayUrl, location.origin);
    const text = `Olá ${stay.tenant.name}, como você está? Me chamo Gustavo, sou o host da sua estadia em Castelhanos. Por favor, Veja abaixo as instruções de check-in e check-out: ${url.toString()}`;
    const whatsappHref = `https://wa.me/${Phone.toAPI(stay.tenant.phone)}?text=${encodeURIComponent(text)}`;
    return whatsappHref;
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
                  <a
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'icon',
                    })}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Enviar para whatsapp'
                    href={getWhatsAppHref(row)}
                  >
                    <MessageCirclePlus className='size-4' />
                  </a>
                  <Button
                    variant='outline'
                    size='icon'
                    isLoading={isCancelingStay}
                    onClick={() => cancelStay({ stayId: row.id })}
                    aria-label='Cancelar estadia'
                  >
                    <CircleX className='size-4' />
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
