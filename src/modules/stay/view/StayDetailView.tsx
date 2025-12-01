import { useState, type FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  CircleX,
  CopyIcon,
  Link as LinkIcon,
  Pencil,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { Currency } from '@/lib/currency';
import { Phone } from '@/lib/phone';
import { ROUTES } from '@/routes/routes';
import { useCancelStay, useGetStay } from '../service/StayService.hooks';
import { queryClient } from '@/lib/query-client';
import { UpdateStay } from '../components/UpdateStay';
import { Page } from '@/components/layout/Page';
import { Alert } from '@/components/Alert';
import { toClipboard } from '@/lib/utils';
import type { Stay } from '../types/Stay';
import { WhatsApp } from '@/components/icons/WhatsApp';

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const StayDetailView: FC = () => {
  const { stay_id } = useParams<{ stay_id: string }>();
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const { data: stay, isLoading, error } = useGetStay(stay_id || '');
  const { mutate: cancelStay, isPending: isCancelingStay } = useCancelStay({
    onSuccess: () => {
      toast.success('Estadia cancelada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['stayWithTenant'] });
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

  const getCohostData = (): string => {
    if (!stay) return '';
    const data = [
      stay.tenant.name,
      Phone.toHumanReadable(stay.tenant.phone),
      `${formatDate(stay.check_in)} - ${formatDate(stay.check_out)}`,
      `${stay.guests} hóspedes`,
    ];
    return data.join('\n');
  };

  const copyCohostData = () => {
    const text = getCohostData();
    copyText(text);
  };

  const copyApartmentInstructionsUrl = () => {
    if (!stay) return;
    const stayUrl = ROUTES.stayInstructions(stay.id);
    const url = new URL(stayUrl, location.origin);
    copyText(url.toString());
  };

  const getWhatsAppHref = (): string => {
    if (!stay) return '';
    const stayUrl = ROUTES.stayInstructions(stay.id);
    const url = new URL(stayUrl, location.origin);
    const text = `Olá ${stay.tenant.name}, como você está? Me chamo Gustavo, sou o host da sua estadia em Castelhanos. Por favor, Veja abaixo as instruções de check-in e check-out: ${url.toString()}`;
    const whatsappHref = `https://wa.me/${Phone.toAPI(stay.tenant.phone)}?text=${encodeURIComponent(text)}`;
    return whatsappHref;
  };

  const handleCancelStay = () => {
    if (!stay) return;
    cancelStay({ stayId: stay.id });
  };

  if (isLoading) {
    return (
      <Page.Container>
        <Page.Content>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
          </div>
        </Page.Content>
      </Page.Container>
    );
  }

  if (error) {
    return (
      <Page.Container>
        <Page.Content>
          <Alert variant='destructive' message='Erro ao carregar estadia'>
            Não foi possível carregar os detalhes da estadia. Tente novamente
            mais tarde.
          </Alert>
          <div className='mt-4'>
            <Link
              to={ROUTES.home}
              className={buttonVariants({
                variant: 'outline',
                className: 'w-full',
              })}
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Voltar para início
            </Link>
          </div>
        </Page.Content>
      </Page.Container>
    );
  }

  if (!stay) {
    return (
      <Page.Container>
        <Page.Content>
          <Alert variant='destructive' message='Estadia não encontrada'>
            A estadia solicitada não foi encontrada ou você não tem permissão
            para visualizá-la.
          </Alert>
          <div className='mt-4'>
            <Link
              to={ROUTES.home}
              className={buttonVariants({
                variant: 'outline',
                className: 'w-full',
              })}
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Voltar para início
            </Link>
          </div>
        </Page.Content>
      </Page.Container>
    );
  }

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: 'Minhas Propriedades', to: ROUTES.home },
          { label: 'Detalhes da Estadia' },
        ]}
      />
      <Page.Header
        title='Detalhes da Estadia'
        description='Informações completas sobre a estadia'
        actions={
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={copyCohostData}
              aria-label='Copiar dados para coanfitrião'
            >
              <CopyIcon className='size-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={copyApartmentInstructionsUrl}
              aria-label='Copiar link das instruções'
            >
              <LinkIcon className='size-4' />
            </Button>
            <a
              className={buttonVariants({
                variant: 'outline',
                size: 'icon',
              })}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Enviar para whatsapp'
              href={getWhatsAppHref()}
            >
              <WhatsApp className='size-4' />
            </a>
            <Button
              variant='outline'
              size='icon'
              isLoading={isCancelingStay}
              onClick={handleCancelStay}
              aria-label='Cancelar estadia'
            >
              <CircleX className='size-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => {
                const { tenant, ...stayWithoutTenant } = stay;
                setSelectedStay(stayWithoutTenant);
              }}
              aria-label='Editar estadia'
            >
              <Pencil className='size-4' />
            </Button>
          </div>
        }
      />
      <Page.Content>
        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Informações da Estadia</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Check-in
                </p>
                <p className='text-base'>{formatDate(stay.check_in)}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Check-out
                </p>
                <p className='text-base'>{formatDate(stay.check_out)}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Hóspedes
                </p>
                <p className='text-base'>{stay.guests}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Código de Entrada
                </p>
                <p className='text-base font-mono'>{stay.entrance_code}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Valor
                </p>
                <p className='text-base tabular-nums'>
                  {Currency.format(stay.price)}
                </p>
              </div>
            </CardContent>
          </Card>
          <div className='grid gap-4 '>
            <Card>
              <CardHeader>
                <CardTitle>Informações do Hóspede</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Nome
                  </p>
                  <p className='text-base'>{stay.tenant.name}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Telefone
                  </p>
                  <button
                    type='button'
                    onClick={() => {
                      copyText(Phone.toHumanReadable(stay.tenant.phone));
                    }}
                    className='text-base underline'
                  >
                    {Phone.toHumanReadable(stay.tenant.phone)}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Page.Content>
      {selectedStay && (
        <UpdateStay
          stay={selectedStay}
          isOpen={!!selectedStay}
          onClose={() => setSelectedStay(null)}
        />
      )}
    </Page.Container>
  );
};
