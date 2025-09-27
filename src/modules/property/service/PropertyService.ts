import api from '@/lib/api';
import type { Property } from '../types/Property';

/**
 * Serviço responsável por operações relacionadas a propriedades
 * Gerencia listagem, criação, atualização e exclusão de propriedades
 */
export class PropertyService {
  /**
   * Lista todas as propriedades do usuário autenticado
   * @returns Promise com array de propriedades
   */
  static async getUserProperties(): Promise<Property[]> {
    const response = await api.get<{ properties: Property[] }>(
      '/property/user/all'
    );
    return response.data.properties;
  }

  /**
   * Obtém uma propriedade específica por ID
   * @param id - ID da propriedade
   * @returns Promise com dados da propriedade
   */
  static async getPropertyById(id: string): Promise<Property> {
    const response = await api.get<Property>(`/property/${id}`);
    return response.data;
  }

  /**
   * Cria uma nova propriedade
   * @param propertyData - Dados da propriedade a ser criada
   * @returns Promise com dados da propriedade criada
   */
  static async createProperty(
    propertyData: Omit<
      Property,
      'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'
    >
  ): Promise<Property> {
    const response = await api.post<Property>('/property/user', propertyData);
    return response.data;
  }

  /**
   * Atualiza uma propriedade existente
   * @param id - ID da propriedade
   * @param propertyData - Dados atualizados da propriedade
   * @returns Promise com dados da propriedade atualizada
   */
  static async updateProperty(
    id: string,
    propertyData: Partial<
      Omit<
        Property,
        'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'
      >
    >
  ): Promise<Property> {
    const response = await api.put<Property>(`/properties/${id}`, propertyData);
    return response.data;
  }

  /**
   * Exclui uma propriedade (soft delete)
   * @param id - ID da propriedade
   * @returns Promise vazia
   */
  static async deleteProperty(id: string): Promise<void> {
    await api.delete(`/properties/${id}`);
  }
}
