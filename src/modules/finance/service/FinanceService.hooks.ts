import {
  useMutation,
  useQuery,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { FinanceService } from './FinanceService';
import type { RecordExpenseDto, RecordRevenueDto } from './FinanceService.dto';
import type { FindMovementsParams } from './FinanceService';

export const useFindAllFromProperty = (
  propertyId: string,
  params?: FindMovementsParams
) => {
  return useQuery({
    queryKey: ['finance-movements', propertyId, params],
    queryFn: () => FinanceService.findAllFromProperty(propertyId, params),
    staleTime: 5 * 60 * 1000,
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
