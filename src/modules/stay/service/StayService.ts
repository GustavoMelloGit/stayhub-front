import api from '@/lib/api';
import { publicStaySchema, type PublicStay } from '../types/Stay';

export class StayService {
  static async getPublicStay(stayId: string): Promise<PublicStay> {
    const response = await api.get(`/public/booking/stay/${stayId}`);
    return publicStaySchema.parse(response.data);
  }

  static async cancelStay(stayId: string): Promise<void> {
    await api.delete(`/booking/stay/${stayId}`);
  }
}
