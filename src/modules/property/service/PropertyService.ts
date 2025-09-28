import api from '@/lib/api';
import { buildUrlWithParams } from '@/lib/utils';
import { propertySchema, type Property } from '../types/Property';
import {
  externalStaySchema,
  staySchema,
  tenantSchema,
  type ExternalStay,
  type Stay,
  type WithTenant,
} from '../../stay/types/Stay';
import z from 'zod';

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
    return propertySchema.parse(response.data);
  }

  /**
   * Resgata as estadias de uma propriedade
   * @param id - ID da propriedade
   * @param filter - Filtros opcionais para as estadias
   * @returns Promise com array de estadias
   */
  static async getPropertyStays(
    id: string,
    filter?: Partial<{
      onlyIncomingStays: boolean;
    }>
  ): Promise<WithTenant<Stay>[]> {
    const url = buildUrlWithParams(`/property/${id}/stays`, filter);

    const response = await api.get<{ stays: WithTenant<Stay>[] }>(url);
    const stays = z
      .array(
        staySchema.extend({
          tenant: tenantSchema,
        })
      )
      .parse(response.data.stays);

    return stays;
  }

  /**
   * Busca por estadias nos sites de hospedagem que ainda não foram cadastradas
   */
  static async reconcileExternalStays(): Promise<ExternalStay[]> {
    const response = await api.get<ExternalStay[]>(
      '/property/reconcile-external-booking'
    );
    return z.array(externalStaySchema).parse(response.data);
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
