import { useMemo, type FC } from 'react';
import { format, startOfYear, endOfYear } from 'date-fns';
import { usePropertyStays } from '../../service/PropertyService.hooks';
import { CoHostChart } from './CoHostChart';
import { IncomePerMonth } from './IncomePerMonth';
import { PropertyNumbers } from './PropertyNumbers';

type Props = {
  propertyId: string;
};

export const PropertyDashboard: FC<Props> = ({ propertyId }) => {
  const dateRange = useMemo(() => {
    const today = new Date();
    return {
      from: format(startOfYear(today), 'yyyy-MM-dd'),
      to: format(endOfYear(today), 'yyyy-MM-dd'),
    };
  }, []);

  const { stays } = usePropertyStays(propertyId, {
    ...dateRange,
    limit: 100,
    page: 1,
  });

  return (
    <div className='grid gap-4 xl:grid-cols-3'>
      <CoHostChart stays={stays?.data ?? []} />
      <PropertyNumbers stays={stays?.data ?? []} />
      <IncomePerMonth stays={stays?.data ?? []} />
    </div>
  );
};
