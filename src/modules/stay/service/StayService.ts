import api from '@/lib/api';
import {
  publicStaySchema,
  staySchema,
  type PublicStay,
  type Stay,
  type UpdateStayRequest,
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

  static async getStay(stayId: string): Promise<Stay> {
    const response = await api.get<Stay>(`/booking/stay/${stayId}`);
    return staySchema.parse(response.data);
  }
}
