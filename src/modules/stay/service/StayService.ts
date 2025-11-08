import api from '@/lib/api';
import {
  publicStaySchema,
  staySchema,
  tenantSchema,
  type PublicStay,
  type Stay,
  type UpdateStayRequest,
  type WithTenant,
} from '../types/Stay';

export class StayService {
  static async getPublicStay(stayId: string): Promise<PublicStay> {
    const response = await api.get(`/public/booking/stay/${stayId}`);
    return publicStaySchema.parse(response.data);
  }

  static async cancelStay(stayId: string): Promise<void> {
    await api.delete(`/booking/stay/${stayId}`);
  }

  static async updateStay(
    stayId: string,
    data: UpdateStayRequest
  ): Promise<Stay> {
    const response = await api.patch<Stay>(`/booking/stay/${stayId}`, data);
    return response.data;
  }

  static async getStay(stayId: string): Promise<WithTenant<Stay>> {
    const response = await api.get<WithTenant<Stay>>(`/booking/stay/${stayId}`);
    const parsedData = staySchema.extend({
      tenant: tenantSchema,
    });

    return parsedData.parse(response.data);
  }
}
