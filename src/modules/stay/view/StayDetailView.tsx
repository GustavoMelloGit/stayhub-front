import { useState, type FC, type ReactNode } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Calendar,
  CircleX,
  CopyIcon,
  KeyRound,
  Link as LinkIcon,
  MoreHorizontal,
  Pencil,
  Phone as PhoneIcon,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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
import { Skeleton } from '@/components/ui/skeleton';

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

const SOURCE_LABELS: Record<Stay['source'], string> = {
  INTERNAL: 'Reserva direta',
  AIRBNB: 'Airbnb',
  BOOKING: 'Booking.com',
};

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  highlighted?: boolean;
};

const MetricCard: FC<MetricCardProps> = ({
  icon,
  label,
  value,
  highlighted,
}) => (
  <Card className={cn(highlighted && 'border-primary/20 bg-primary/5')}>
    <CardContent className='pb-2 pt-2'>
      <div className='mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
        {icon}
        {label}
      </div>
      <p
        className={cn(
          'text-lg font-semibold tabular-nums',
          highlighted && 'text-primary'
        )}
      >
        {value}
      </p>
    </CardContent>
  </Card>
);

export const StayDetailView: FC = () => {
  const { stay_id, property_id } = useParams<{
    stay_id: string;
    property_id: string;
  }>();
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const navigate = useNavigate();
  const { data: stay, isLoading, error } = useGetStay(stay_id || '');
  const { mutate: cancelStay, isPending: isCancelingStay } = useCancelStay({
    onSuccess: () => {
      toast.success('Estadia cancelada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['stayWithTenant'] });
      queryClient.invalidateQueries({ queryKey: ['propertyStays'] });
      queryClient.invalidateQueries({ queryKey: ['finance-movements'] });
      navigate(ROUTES.property(property_id || ''), { replace: true });
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
    return [
      stay.tenant.name,
      Phone.toHumanReadable(stay.tenant.phone),
      `${formatDate(stay.check_in)} - ${formatDate(stay.check_out)}`,
      `${stay.guests} hóspedes`,
    ].join('\n');
  };

  const copyApartmentInstructionsUrl = () => {
    if (!stay) return;
    const url = new URL(ROUTES.stayInstructions(stay.id), location.origin);
    copyText(url.toString());
  };

  const getWhatsAppHref = (): string => {
    if (!stay) return '';
    const url = new URL(ROUTES.stayInstructions(stay.id), location.origin);
    const text = `Olá ${stay.tenant.name}, como você está? Me chamo Gustavo, sou o host da sua estadia em Castelhanos. Por favor, Veja abaixo as instruções de check-in e check-out: ${url.toString()}`;
    return `https://wa.me/${Phone.toAPI(stay.tenant.phone)}?text=${encodeURIComponent(text)}`;
  };

  const handleCancelStay = () => {
    if (!stay) return;
    cancelStay({ stayId: stay.id });
  };

  if (isLoading) {
    return (
      <Page.Container>
        <Page.Topbar
          nav={[
            { label: 'Minhas Propriedades', to: ROUTES.home },
            { label: 'Detalhes da Estadia' },
          ]}
        />
        <Page.Header title='Carregando...' description='Detalhes da estadia' />
        <Page.Content>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-24 w-full' />
            ))}
          </div>
          <div className='grid gap-4 md:grid-cols-3'>
            <Skeleton className='h-48 md:col-span-2' />
            <Skeleton className='h-48' />
          </div>
        </Page.Content>
      </Page.Container>
    );
  }

  if (error || !stay) {
    return (
      <Page.Container>
        <Page.Topbar
          nav={[
            { label: 'Minhas Propriedades', to: ROUTES.home },
            { label: 'Detalhes da Estadia' },
          ]}
        />
        <Page.Content>
          <Alert
            variant='destructive'
            message={
              error ? 'Erro ao carregar estadia' : 'Estadia não encontrada'
            }
          >
            {error
              ? 'Não foi possível carregar os detalhes da estadia. Tente novamente mais tarde.'
              : 'A estadia solicitada não foi encontrada ou você não tem permissão para visualizá-la.'}
          </Alert>
          <div className='mt-4'>
            <Link
              to={ROUTES.home}
              className={buttonVariants({
                variant: 'outline',
                className: 'w-full',
              })}
            >
              <ArrowLeft className='mr-2 size-4' />
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
          { label: stay.tenant.name },
        ]}
      />
      <Page.Header
        title={stay.tenant.name}
        description={`${formatDate(stay.check_in)} → ${formatDate(stay.check_out)}`}
        actions={
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => {
                const { tenant, ...stayWithoutTenant } = stay;
                setSelectedStay(stayWithoutTenant);
              }}
            >
              <Pencil className='mr-2 size-4' />
              Editar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon' aria-label='Mais ações'>
                  <MoreHorizontal className='size-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => copyText(getCohostData())}>
                  <CopyIcon className='mr-2 size-4' />
                  Copiar dados para coanfitrião
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyApartmentInstructionsUrl}>
                  <LinkIcon className='mr-2 size-4' />
                  Copiar link das instruções
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={getWhatsAppHref()}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <WhatsApp className='mr-2 size-4' />
                    Enviar pelo WhatsApp
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleCancelStay}
                  disabled={isCancelingStay}
                  className='text-destructive focus:text-destructive'
                >
                  <CircleX className='mr-2 size-4' />
                  {isCancelingStay ? 'Cancelando...' : 'Cancelar estadia'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <Page.Content>
        {/* Key metrics */}
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
          <MetricCard
            icon={<Calendar className='size-3.5' />}
            label='Check-in'
            value={formatDate(stay.check_in)}
          />
          <MetricCard
            icon={<Calendar className='size-3.5' />}
            label='Check-out'
            value={formatDate(stay.check_out)}
          />
          <MetricCard
            icon={<Users className='size-3.5' />}
            label='Hóspedes'
            value={String(stay.guests)}
          />
          <MetricCard
            icon={null}
            label='Valor total'
            value={Currency.format(stay.price)}
            highlighted
          />
        </div>

        {/* Detail cards */}
        <div className='grid gap-4 md:grid-cols-3'>
          {/* Stay details — 2 cols */}
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle>Detalhes da Estadia</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1.5'>
                <p className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                  <KeyRound className='size-3.5' />
                  Código de entrada
                </p>
                <div className='flex items-center gap-2'>
                  <code className='flex-1 rounded-md bg-muted px-3 py-2 font-mono text-sm'>
                    {stay.entrance_code}
                  </code>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => copyText(stay.entrance_code)}
                    aria-label='Copiar código de entrada'
                  >
                    <CopyIcon className='size-4' />
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <p className='mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                  Origem da reserva
                </p>
                <p className='text-sm font-medium'>
                  {SOURCE_LABELS[stay.source]}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Guest card — 1 col */}
          <Card>
            <CardHeader>
              <CardTitle>Hóspede</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Avatar>
                  <AvatarFallback>
                    {getInitials(stay.tenant.name)}
                  </AvatarFallback>
                </Avatar>
                <p className='min-w-0 truncate font-medium'>
                  {stay.tenant.name}
                </p>
              </div>

              <Separator />

              <div className='flex items-center justify-between gap-2'>
                <div className='flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground'>
                  <PhoneIcon className='size-3.5 shrink-0' />
                  <span className='truncate'>
                    {Phone.toHumanReadable(stay.tenant.phone)}
                  </span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='shrink-0'
                  onClick={() =>
                    copyText(Phone.toHumanReadable(stay.tenant.phone))
                  }
                  aria-label='Copiar telefone'
                >
                  <CopyIcon className='size-3.5' />
                </Button>
              </div>

              <a
                href={getWhatsAppHref()}
                target='_blank'
                rel='noopener noreferrer'
                className={buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                  className: 'w-full',
                })}
              >
                <WhatsApp className='mr-2 size-4' />
                Enviar pelo WhatsApp
              </a>
            </CardContent>
          </Card>
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
