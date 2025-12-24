import type { FC } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Currency } from '@/lib/currency';
import type { Stay } from '@/modules/stay/types/Stay';

type Props = {
  stays: Stay[];
};

export const CoHostChart: FC<Props> = ({ stays }) => {
  const groupedStays = groupStaysByMonth(stays);
  return (
    <ChartContainer
      config={{
        cohost_payment: {
          label: 'Valor coanfitrião',
          color: 'var(--chart-1)',
        },
      }}
    >
      <BarChart accessibilityLayer data={groupedStays}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey='month' tickLine={false} axisLine={false} />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number) => Currency.format(value)}
        />
        <Bar dataKey='cohost_payment' fill='var(--chart-1)' radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

type ChartData = {
  month: number;
  cohost_payment: number;
  stays: number;
};

function groupStaysByMonth(stays: Stay[]): ChartData[] {
  const months = new Array(12).fill(0).map((_, index) => index + 1);
  return months.map(month => {
    const thisMonthStays = stays.filter(
      stay => stay.check_in.getMonth() + 1 === month
    );
    return {
      month,
      cohost_payment: thisMonthStays.reduce(
        (acc, stay) => acc + calculateCohostPayment(stay),
        0
      ),
      stays: thisMonthStays.length,
    };
  });
}

function calculateCohostPayment(stay: Stay): number {
  if (stay.source === 'INTERNAL') {
    return stay.price * 0.1;
  }
  return stay.price * 0.12;
}
