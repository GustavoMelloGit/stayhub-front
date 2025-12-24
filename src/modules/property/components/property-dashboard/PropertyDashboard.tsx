import type { FC } from 'react';
import { usePropertyStays } from '../../service/PropertyService.hooks';
import { CoHostChart } from './CoHostChart';

type Props = {
  propertyId: string;
};

export const PropertyDashboard: FC<Props> = ({ propertyId }) => {
  const { stays } = usePropertyStays(propertyId, {
    onlyIncomingStays: false,
  });

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <CoHostChart stays={stays?.data ?? []} />
    </div>
  );
};
