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
  const {
    isPending: isLoading,
    error,
    mutate,
  } = useMutation({
    ...options,
    mutationFn: (dto: RecordExpenseDto) => FinanceService.recordExpense(dto),
  });

  return {
    isLoading,
    error,
    mutate,
  };
};

export const useRecordRevenue = (
  options?: UseMutationOptions<void, Error, RecordRevenueDto>
) => {
  const {
    isPending: isLoading,
    error,
    mutate,
  } = useMutation({
    ...options,
    mutationFn: (dto: RecordRevenueDto) => FinanceService.recordRevenue(dto),
  });

  return {
    isLoading,
    error,
    mutate,
  };
};
