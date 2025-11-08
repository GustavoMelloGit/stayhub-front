import { useState, type FC } from 'react';
import { usePropertyStays } from '../service/PropertyService.hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  CircleX,
  CopyIcon,
  Link,
  MessageCirclePlus,
  Pencil,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Stay, WithTenant } from '@/modules/stay/types/Stay';
import { Currency } from '@/lib/currency';
import { Phone } from '@/lib/phone';
import { DataTable } from '@/components/Table/DataTable';
import { ROUTES } from '@/routes/routes';
import { useCancelStay } from '@/modules/stay/service/StayService.hooks';
import { queryClient } from '@/lib/query-client';
import { UpdateStay } from '@/modules/stay/components/UpdateStay';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { pluralize, toClipboard } from '@/lib/utils';

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
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [selectedStayIds, setSelectedStayIds] = useState<string[]>([]);
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
    toClipboard(text);
    toast.success('Copiado com sucesso');
  };

  const getCohostData = (stay: WithTenant<Stay>): string => {
    const data = [
      stay.tenant.name,
      Phone.toHumanReadable(stay.tenant.phone),
      `${formatDate(stay.check_in)} - ${formatDate(stay.check_out)}`,
      `${stay.guests} hóspedes`,
    ];
    return data.join('\n');
  };

  const copyApartmentInstructionsUrl = (stay: WithTenant<Stay>) => {
    const stayUrl = ROUTES.stayInstructions(stay.id);
    const url = new URL(stayUrl, location.origin);
    copyText(url.toString());
  };

  const copySelectedCohostData = () => {
    if (selectedStayIds.length === 0) return;

    const selectedStays = (stays?.data ?? []).filter(stay =>
      selectedStayIds.includes(stay.id)
    );

    const allData = selectedStays.map(getCohostData);

    copyText(allData.join('\n\n'));
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
        {selectedStayIds.length > 0 && (
          <div className='mb-4 flex items-center flex-wrap gap-2 justify-between rounded-lg border bg-muted/50 p-3'>
            <div className='flex items-center flex-wrap gap-2'>
              <span className='text-sm font-medium'>
                {selectedStayIds.length}{' '}
                {pluralize(selectedStayIds.length, 'estadia', 'estadias')}{' '}
                {pluralize(
                  selectedStayIds.length,
                  'selecionada',
                  'selecionadas'
                )}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm'>
                    <MoreHorizontal className='mr-2 size-4' />
                    Ações
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={copySelectedCohostData}>
                    <CopyIcon className='mr-2 size-4' />
                    Copiar dados para coanfitrião
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSelectedStayIds([])}
              >
                <X className='mr-2 size-4' />
                Limpar seleção
              </Button>
            </div>
          </div>
        )}
        <DataTable
          isLoading={isLoading}
          error={error?.message}
          data={stays?.data ?? []}
          enableRowSelection
          selectedRows={selectedStayIds}
          onSelectionChange={setSelectedStayIds}
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
                    onClick={() => {
                      const text = getCohostData(row);
                      copyText(text);
                    }}
                    aria-label='Copiar informações da estadia'
                  >
                    <CopyIcon className='size-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => copyApartmentInstructionsUrl(row)}
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
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setSelectedStay(row)}
                    aria-label='Editar estadia'
                  >
                    <Pencil className='size-4' />
                  </Button>
                </div>
              ),
            },
          ]}
        />
        {selectedStay && (
          <UpdateStay
            stay={selectedStay}
            isOpen={!!selectedStay}
            onClose={() => setSelectedStay(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};
