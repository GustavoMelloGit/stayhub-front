import {
  useMutation,
  useQuery,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { PropertyService } from './PropertyService';
import type { BookStayRequest } from '../types/Property';
import type { Stay } from '@/modules/stay/types/Stay';

/**
 * Hook para obter todas as propriedades do usuário
 * Fornece lista de propriedades e estados relacionados
 */
export const useUserProperties = () => {
  const {
    data: properties,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['properties'],
    queryFn: () => PropertyService.getUserProperties(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    properties: properties || [],
    isLoading,
    error,
  };
};

export const useReconcileExternalStays = () => {
  const {
    data: stays,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['reconcileExternalStays'],
    queryFn: () => PropertyService.reconcileExternalStays(),
  });

  return {
    stays,
    isLoading,
    error,
  };
};

export const useBookStay = (
  options?: UseMutationOptions<Stay, Error, BookStayRequest>
) => {
  const {
    data: stay,
    isPending: isLoading,
    error,
  } = useMutation({
    ...options,
    mutationFn: (stayData: BookStayRequest) =>
      PropertyService.bookStay(stayData),
  });
  return {
    stay,
    isLoading,
    error,
  };
};

export const usePropertyStays = (
  ...params: Parameters<typeof PropertyService.getPropertyStays>
) => {
  const {
    data: stays,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['propertyStays', ...params],
    queryFn: () => PropertyService.getPropertyStays(...params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    stays,
    isLoading,
    error,
  };
};

/**
 * Hook para obter uma propriedade específica por ID
 * @param id - ID da propriedade
 */
export const useProperty = (id: string) => {
  const {
    data: property,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['property', id],
    queryFn: () => PropertyService.getPropertyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    property,
    isLoading,
    error,
  };
};
