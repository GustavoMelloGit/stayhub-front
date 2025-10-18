import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { StayService } from './StayService';
import type { PublicStay } from '../types/Stay';
import type { AxiosError } from 'axios';

export const useGetPublicStay = (
  stayId: string,
  options?: UseQueryOptions<PublicStay, AxiosError>
) => {
  return useQuery({
    ...options,
    queryKey: ['publicStay', stayId],
    queryFn: () => StayService.getPublicStay(stayId),
  });
};

export const useCancelStay = (
  options?: UseMutationOptions<void, AxiosError, { stayId: string }>
) => {
  return useMutation({
    ...options,
    mutationFn: ({ stayId }) => StayService.cancelStay(stayId),
  });
};
