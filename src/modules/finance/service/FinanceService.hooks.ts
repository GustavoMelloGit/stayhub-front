import {
  useMutation,
  useQuery,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { FinanceService } from './FinanceService';
import type { RecordExpenseDto, RecordRevenueDto } from './FinanceService.dto';

export const useFindAllFromProperty = (propertyId: string) => {
  return useQuery({
    queryKey: ['finance-movements', propertyId],
    queryFn: () => FinanceService.findAllFromProperty(propertyId),
  });
};

export const useRecordExpense = (
  options?: UseMutationOptions<void, Error, RecordExpenseDto>
) => {
  return useMutation({
    ...options,
    mutationFn: (dto: RecordExpenseDto) => FinanceService.recordExpense(dto),
  });
};

export const useRecordRevenue = (
  options?: UseMutationOptions<void, Error, RecordRevenueDto>
) => {
  return useMutation({
    ...options,
    mutationFn: (dto: RecordRevenueDto) => FinanceService.recordRevenue(dto),
  });
};
