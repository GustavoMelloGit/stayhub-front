import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PropertyService } from './PropertyService';
import type { Property } from '../types/Property';

/**
 * Hook para obter todas as propriedades do usuário
 * Fornece lista de propriedades e estados relacionados
 */
export const useUserProperties = () => {
  const {
    data: properties,
    isLoading,
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

/**
 * Hook para obter uma propriedade específica por ID
 * @param id - ID da propriedade
 */
export const useProperty = (id: string) => {
  const {
    data: property,
    isLoading,
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

/**
 * Hook para criar uma nova propriedade
 * Fornece função de criação e estados relacionados
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (
      propertyData: Omit<
        Property,
        'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'
      >
    ) => PropertyService.createProperty(propertyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  return {
    createProperty: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};

/**
 * Hook para atualizar uma propriedade existente
 * Fornece função de atualização e estados relacionados
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<
        Omit<
          Property,
          'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'
        >
      >;
    }) => PropertyService.updateProperty(id, data),
    onSuccess: (updatedProperty) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.setQueryData(
        ['property', updatedProperty.id],
        updatedProperty
      );
    },
  });

  return {
    updateProperty: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};

/**
 * Hook para excluir uma propriedade
 * Fornece função de exclusão e estados relacionados
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => PropertyService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  return {
    deleteProperty: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
