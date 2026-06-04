import { type FC, type ElementType } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Building2,
  CalendarCheck,
  Users,
  TrendingUp,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/components/layout/Page';
import { ROUTES } from '@/routes/routes';
import { Currency } from '@/lib/currency';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- MOCK DATA (remover quando integrar com o backend) ---
const MOCK_PROPERTIES = [
  {
    id: '1',
    name: 'Apto Centro SP',
    address: { city: 'São Paulo', state: 'SP' },
  },
  {
    id: '2',
    name: 'Casa Praia Floripa',
    address: { city: 'Florianópolis', state: 'SC' },
  },
  {
    id: '3',
    name: 'Chalé Campos do Jordão',
    address: { city: 'Campos do Jordão', state: 'SP' },
  },
];

const MOCK_UPCOMING_STAYS = [
  {
    id: 's1',
    propertyId: '1',
    propertyName: 'Apto Centro SP',
    tenant: { name: 'Carlos Mendes' },
    check_in: new Date(2026, 5, 7),
  },
  {
    id: 's2',
    propertyId: '2',
    propertyName: 'Casa Praia Floripa',
    tenant: { name: 'Ana Paula Souza' },
    check_in: new Date(2026, 5, 10),
  },
  {
    id: 's3',
    propertyId: '1',
    propertyName: 'Apto Centro SP',
    tenant: { name: 'Roberto Lima' },
    check_in: new Date(2026, 5, 14),
  },
  {
    id: 's4',
    propertyId: '3',
    propertyName: 'Chalé Campos do Jordão',
    tenant: { name: 'Fernanda Costa' },
    check_in: new Date(2026, 5, 18),
  },
];

const MOCK_KPIS = {
  totalProperties: MOCK_PROPERTIES.length,
  activeStays: 1,
  upcomingCheckIns: 3,
  monthlyRevenue: 847500,
};
// --- FIM MOCK DATA ---

const AVATAR_COLORS = [
  'bg-teal-500/20 text-teal-300',
  'bg-sky-500/20 text-sky-300',
  'bg-violet-500/20 text-violet-300',
  'bg-rose-500/20 text-rose-300',
  'bg-amber-500/20 text-amber-300',
];

const PROPERTY_ICON_STYLES = [
  'bg-gradient-to-br from-teal-500/25 to-teal-600/10 text-teal-400',
  'bg-gradient-to-br from-sky-500/25 to-sky-600/10 text-sky-400',
  'bg-gradient-to-br from-violet-500/25 to-violet-600/10 text-violet-400',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return parts[0][0].toUpperCase();
}

function getAvatarColor(name: string): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

type KpiCardProps = {
  title: string;
  value: string;
  icon: ElementType;
  gradientClass: string;
  iconBgClass: string;
  iconColorClass: string;
};

const KpiCard: FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  gradientClass,
  iconBgClass,
  iconColorClass,
}) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl',
      gradientClass
    )}
  >
    <div
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-lg',
        iconBgClass
      )}
    >
      <Icon className={cn('h-5 w-5', iconColorClass)} aria-hidden='true' />
    </div>
    <div className='mt-4'>
      <p className='text-2xl font-bold tracking-tight text-white'>{value}</p>
      <p className='mt-0.5 text-sm text-white/60'>{title}</p>
    </div>
  </div>
);

const DashboardView: FC = () => {
  const properties = MOCK_PROPERTIES;
  const upcomingStays = MOCK_UPCOMING_STAYS;
  const kpis = MOCK_KPIS;
  const today = new Date();

  return (
    <Page.Container>
      <Page.Topbar nav={[{ label: 'Dashboard' }]} />
      <Page.Content>
        {/* Cabeçalho com data */}
        <div className='flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-foreground'>Dashboard</h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Visão geral das suas propriedades
            </p>
          </div>
          <p className='text-sm text-muted-foreground'>
            {format(today, "EEEE, d 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            }).replace(/^\w/, c => c.toUpperCase())}
          </p>
        </div>

        {/* KPIs */}
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
          <KpiCard
            title='Propriedades'
            value={kpis.totalProperties.toString()}
            icon={Building2}
            gradientClass='bg-gradient-to-br from-teal-900/90 to-teal-800/40 border-teal-700/40'
            iconBgClass='bg-teal-500/20'
            iconColorClass='text-teal-400'
          />
          <KpiCard
            title='Ocupadas hoje'
            value={kpis.activeStays.toString()}
            icon={Users}
            gradientClass='bg-gradient-to-br from-sky-900/90 to-sky-800/40 border-sky-700/40'
            iconBgClass='bg-sky-500/20'
            iconColorClass='text-sky-400'
          />
          <KpiCard
            title='Check-ins em 7 dias'
            value={kpis.upcomingCheckIns.toString()}
            icon={CalendarCheck}
            gradientClass='bg-gradient-to-br from-amber-900/90 to-amber-800/40 border-amber-700/40'
            iconBgClass='bg-amber-500/20'
            iconColorClass='text-amber-400'
          />
          <KpiCard
            title='Receita do mês'
            value={Currency.format(kpis.monthlyRevenue)}
            icon={TrendingUp}
            gradientClass='bg-gradient-to-br from-emerald-900/90 to-emerald-800/40 border-emerald-700/40'
            iconBgClass='bg-emerald-500/20'
            iconColorClass='text-emerald-400'
          />
        </div>

        {/* Listas */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <Card className='border-border/50 bg-card/60 backdrop-blur-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold'>
                Próximas estadias
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {upcomingStays.map(stay => (
                <Link
                  key={stay.id}
                  to={ROUTES.property(stay.propertyId)}
                  className='flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-3 text-sm transition-all duration-150 hover:border-border/70 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  aria-label={`Ver estadia em ${stay.propertyName} para ${stay.tenant.name}`}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                      getAvatarColor(stay.tenant.name)
                    )}
                  >
                    {getInitials(stay.tenant.name)}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate font-medium text-foreground'>
                      {stay.tenant.name}
                    </p>
                    <p className='truncate text-xs text-muted-foreground'>
                      {stay.propertyName}
                    </p>
                  </div>
                  <span className='shrink-0 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary'>
                    {format(stay.check_in, "d 'de' MMM", { locale: ptBR })}
                  </span>
                  <ChevronRight
                    className='h-4 w-4 shrink-0 text-muted-foreground/40'
                    aria-hidden='true'
                  />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className='border-border/50 bg-card/60 backdrop-blur-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-3'>
              <CardTitle className='text-base font-semibold'>
                Suas propriedades
              </CardTitle>
              <Link
                to={ROUTES.properties}
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Ver todas
              </Link>
            </CardHeader>
            <CardContent className='space-y-2'>
              {properties.map((p, i) => (
                <Link
                  key={p.id}
                  to={ROUTES.property(p.id)}
                  className='flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-3 text-sm transition-all duration-150 hover:border-border/70 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  aria-label={`Ver detalhes de ${p.name}`}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      PROPERTY_ICON_STYLES[i % PROPERTY_ICON_STYLES.length]
                    )}
                  >
                    <Building2 className='h-4 w-4' aria-hidden='true' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate font-medium text-foreground'>
                      {p.name}
                    </p>
                    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                      <MapPin className='h-3 w-3 shrink-0' aria-hidden='true' />
                      <span className='truncate'>
                        {p.address.city}, {p.address.state}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className='h-4 w-4 shrink-0 text-muted-foreground/40'
                    aria-hidden='true'
                  />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default DashboardView;
