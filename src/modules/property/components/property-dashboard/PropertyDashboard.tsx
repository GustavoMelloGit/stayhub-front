import type { FC } from 'react';
import { usePropertyStays } from '../../service/PropertyService.hooks';
import { CoHostChart } from './CoHostChart';
import { IncomePerMonth } from './IncomePerMonth';
import { PropertyNumbers } from './PropertyNumbers';

type Props = {
  propertyId: string;
};

export const PropertyDashboard: FC<Props> = ({ propertyId }) => {
  const { stays } = usePropertyStays(propertyId, {
    onlyIncomingStays: false,
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
