import { type FC } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Currency } from '@/lib/currency';
import type { Stay } from '@/modules/stay/types/Stay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  stays: Stay[];
};

export const IncomePerMonth: FC<Props> = ({ stays }) => {
  const groupedStays = groupStaysByMonth(stays);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita por mês</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            income: {
              label: 'Receita',
              color: 'var(--chart-2)',
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
            <Bar dataKey='income' fill='var(--chart-2)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

type ChartData = {
  month: string;
  income: number;
  stays: number;
};

function groupStaysByMonth(stays: Stay[]): ChartData[] {
  const months = new Array(12).fill(0).map((_, index) => index + 1);
  return months.map(month => {
    const thisMonthStays = stays.filter(
      stay => stay.check_in.getMonth() + 1 === month
    );
    const monthName = new Date(0, month - 1).toLocaleString('pt-BR', {
      month: 'short',
    });
    return {
      month: monthName,
      income: thisMonthStays.reduce((acc, stay) => acc + stay.price, 0),
      stays: thisMonthStays.length,
    };
  });
}
