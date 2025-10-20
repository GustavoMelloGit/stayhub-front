import { useQuery } from '@tanstack/react-query';
import { FinanceService } from './FinanceService';

export const useFindAllFromProperty = (propertyId: string) => {
  return useQuery({
    queryKey: ['finance-movements', propertyId],
    queryFn: () => FinanceService.findAllFromProperty(propertyId),
  });
};
