import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { StayService, type GetPublicStayResponse } from './StayService';

export const useGetPublicStay = (
  stayId: string,
  options?: UseQueryOptions<GetPublicStayResponse>
) => {
  return useQuery({
    ...options,
    queryKey: ['publicStay', stayId],
    queryFn: () => StayService.getPublicStay(stayId),
  });
};
