import { useState, type FC } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Currency } from '@/lib/currency';
import type { Stay } from '@/modules/stay/types/Stay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  stays: Stay[];
};

export const IncomePerMonth: FC<Props> = ({ stays }) => {
  const availableYears = getAvailableYears(stays);
  const currentYear = new Date().getFullYear();
  const defaultYear =
    availableYears.length > 0 ? Math.max(...availableYears) : currentYear;
  const [selectedYear, setSelectedYear] = useState<string>(
    defaultYear.toString()
  );

  const filteredStays = stays.filter(
    stay => stay.check_in.getFullYear() === Number(selectedYear)
  );
  const groupedStays = groupStaysByMonth(filteredStays);

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between gap-2'>
          <CardTitle>Receita por mês</CardTitle>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Ano' />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

function getAvailableYears(stays: Stay[]): number[] {
  const years = new Set<number>();
  stays.forEach(stay => {
    years.add(stay.check_in.getFullYear());
  });
  return Array.from(years).sort((a, b) => b - a);
}
