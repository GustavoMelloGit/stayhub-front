import api from '@/lib/api';
import { buildUrlWithParams } from '@/lib/utils';
import {
  propertySchema,
  type BookStayRequest,
  type Property,
  type ExternalBookingRequest,
} from '../types/Property';
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
   * Reserva uma estadia
   * @param stayData - Dados da estadia a ser reservada
   * @returns Promise com dados da estadia cadastrada
   */
  static async bookStay(stayData: BookStayRequest): Promise<Stay> {
    const { property, ...rest } = stayData;
    const response = await api.post<{ message: string; data: Stay }>(
      `/property/${property}/book`,
      rest
    );
    return response.data.data;
  }

  /**
   * Cadastra um link de plataforma externa para sincronização
   * @param propertyId - ID da propriedade
   * @param externalBookingData - Dados do link de plataforma externa
   * @returns Promise com resposta da API
   */
  static async createExternalBooking(
    propertyId: string,
    externalBookingData: ExternalBookingRequest
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/property/${propertyId}/external-booking`,
      externalBookingData
    );
    return response.data;
  }
}
