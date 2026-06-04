import { type FC, type ElementType } from 'react';
// import { useMemo } from 'react';
// import { useQueries } from '@tanstack/react-query';
// import {
//   format,
//   addDays,
//   startOfDay,
//   startOfMonth,
//   endOfMonth,
//   isAfter,
//   isBefore,
// } from 'date-fns';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Building2,
  CalendarCheck,
  Users,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
// import { PropertyService } from '../service/PropertyService';
// import { useUserProperties } from '../service/PropertyService.hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/components/layout/Page';
import { ROUTES } from '@/routes/routes';
import { Currency } from '@/lib/currency';
// import { Skeleton } from '@/components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button';

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
  monthlyRevenue: 847500, // centavos → R$ 8.475,00
};
// --- FIM MOCK DATA ---

type KpiCardProps = {
  title: string;
  value: string;
  icon: ElementType;
};

const KpiCard: FC<KpiCardProps> = ({ title, value, icon: Icon }) => (
  <Card>
    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
      <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      <Icon className='h-4 w-4 text-muted-foreground' aria-hidden='true' />
    </CardHeader>
    <CardContent>
      <p className='text-2xl font-bold'>{value}</p>
    </CardContent>
  </Card>
);

const DashboardView: FC = () => {
  // TODO: substituir por dados reais
  // const { properties, isLoading: propertiesLoading } = useUserProperties();
  // const today = useMemo(() => startOfDay(new Date()), []);
  // const dateRange = useMemo(() => ({
  //   from: format(startOfMonth(today), 'yyyy-MM-dd'),
  //   to: format(addDays(today, 30), 'yyyy-MM-dd'),
  // }), [today]);
  // const stayQueries = useQueries({
  //   queries: properties.map(p => ({
  //     queryKey: ['propertyStays', p.id, dateRange],
  //     queryFn: () => PropertyService.getPropertyStays(p.id, { ...dateRange, limit: 100, page: 1 }),
  //     staleTime: 5 * 60 * 1000,
  //   })),
  // });
  // const allStays = stayQueries.flatMap((q, i) =>
  //   (q.data?.data ?? []).map(stay => ({ ...stay, propertyId: properties[i]?.id ?? '', propertyName: properties[i]?.name ?? '' }))
  // );
  // const activeStays = allStays.filter(s => !isAfter(s.check_in, today) && !isBefore(s.check_out, today));
  // const upcomingCheckIns = allStays.filter(s => isAfter(s.check_in, today) && !isAfter(s.check_in, addDays(today, 7)));
  // const monthlyRevenue = allStays.filter(s => !isBefore(s.check_in, startOfMonth(today)) && !isAfter(s.check_in, endOfMonth(today))).reduce((sum, s) => sum + s.price, 0);
  // const upcomingStays = allStays.filter(s => isAfter(s.check_in, today)).sort((a, b) => a.check_in.getTime() - b.check_in.getTime()).slice(0, 5);

  const properties = MOCK_PROPERTIES;
  const upcomingStays = MOCK_UPCOMING_STAYS;
  const kpis = MOCK_KPIS;

  return (
    <Page.Container>
      <Page.Topbar nav={[{ label: 'Dashboard' }]} />
      <Page.Header
        title='Dashboard'
        description='Visão geral das suas propriedades'
      />
      <Page.Content>
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
          <KpiCard
            title='Propriedades'
            value={kpis.totalProperties.toString()}
            icon={Building2}
          />
          <KpiCard
            title='Ocupadas hoje'
            value={kpis.activeStays.toString()}
            icon={Users}
          />
          <KpiCard
            title='Check-ins (7 dias)'
            value={kpis.upcomingCheckIns.toString()}
            icon={CalendarCheck}
          />
          <KpiCard
            title='Receita do mês'
            value={Currency.format(kpis.monthlyRevenue)}
            icon={TrendingUp}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Próximas estadias</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {upcomingStays.map(stay => (
                <Link
                  key={stay.id}
                  to={ROUTES.property(stay.propertyId)}
                  className='flex items-center justify-between rounded-md border p-3 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  aria-label={`Ver estadia em ${stay.propertyName} para ${stay.tenant.name}`}
                >
                  <div>
                    <p className='font-medium'>{stay.propertyName}</p>
                    <p className='text-muted-foreground'>
                      {stay.tenant.name} &middot;{' '}
                      {format(stay.check_in, "dd 'de' MMM", { locale: ptBR })}
                    </p>
                  </div>
                  <ChevronRight
                    className='h-4 w-4 shrink-0 text-muted-foreground'
                    aria-hidden='true'
                  />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-base'>Suas propriedades</CardTitle>
              <Link
                to={ROUTES.properties}
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Ver todas
              </Link>
            </CardHeader>
            <CardContent className='space-y-2'>
              {properties.map(p => (
                <Link
                  key={p.id}
                  to={ROUTES.property(p.id)}
                  className='flex items-center justify-between rounded-md border p-3 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  aria-label={`Ver detalhes de ${p.name}`}
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10'>
                      <Building2
                        className='h-4 w-4 text-primary'
                        aria-hidden='true'
                      />
                    </div>
                    <div>
                      <p className='font-medium'>{p.name}</p>
                      <p className='text-muted-foreground'>
                        {p.address.city}, {p.address.state}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className='h-4 w-4 shrink-0 text-muted-foreground'
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
