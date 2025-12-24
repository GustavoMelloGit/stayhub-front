import { Card, CardContent } from '@/components/ui/card';
import { Currency } from '@/lib/currency';
import type { Stay } from '@/modules/stay/types/Stay';
import { type FC } from 'react';

type Props = {
  stays: Stay[];
};

export const PropertyNumbers: FC<Props> = ({ stays }) => {
  const totalPriceInCents = stays.reduce((acc, stay) => acc + stay.price, 0);
  const medianPriceInCents = calculateMedianPrice(stays);

  return (
    <div className='flex flex-col justify-between gap-2'>
      <Card>
        <CardContent>
          <p>Número de estadias</p>
          <p className='text-4xl font-bold'>{stays.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p>Valor total das estadias</p>
          <p className='text-4xl font-bold'>
            {Currency.format(totalPriceInCents)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p>Valor médio das estadias (mediana)</p>
          <p className='text-4xl font-bold'>
            {Currency.format(medianPriceInCents)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

function calculateMedianPrice(stays: Stay[]): number {
  const priceArray = stays.map(stay => stay.price);
  priceArray.sort((a, b) => a - b);
  const middleIndex = Math.floor(priceArray.length / 2);
  return priceArray[middleIndex];
}
