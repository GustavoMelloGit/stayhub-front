import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { StayService } from './StayService';
import type { PublicStay } from '../types/Stay';

export const useGetPublicStay = (
  stayId: string,
  options?: UseQueryOptions<PublicStay>
) => {
  return useQuery({
    ...options,
    queryKey: ['publicStay', stayId],
    queryFn: () => StayService.getPublicStay(stayId),
  });
};
