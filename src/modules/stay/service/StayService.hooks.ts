import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { StayService } from './StayService';
import type { PublicStay, Stay, UpdateStayRequest } from '../types/Stay';
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

export const useUpdateStay = (
  options?: UseMutationOptions<
    Stay,
    AxiosError,
    { stayId: string; data: UpdateStayRequest }
  >
) => {
  return useMutation({
    ...options,
    mutationFn: ({ stayId, data }) => StayService.updateStay(stayId, data),
  });
};

export const useGetStay = (
  stayId: string,
  options?: UseQueryOptions<Stay, AxiosError>
) => {
  return useQuery({
    ...options,
    queryKey: ['stay', stayId],
    queryFn: () => StayService.getStay(stayId),
  });
};
