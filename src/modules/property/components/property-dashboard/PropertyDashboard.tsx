import type { FC } from 'react';
import { usePropertyStays } from '../../service/PropertyService.hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card>
        <CardHeader>
          <CardTitle>Valor a pagar do coanfitrião</CardTitle>
        </CardHeader>
        <CardContent>
          <CoHostChart stays={stays?.data ?? []} />
        </CardContent>
      </Card>
    </div>
  );
};
