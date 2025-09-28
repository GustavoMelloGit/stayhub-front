import api from '@/lib/api';
import { publicStaySchema, type PublicStay } from '../types/Stay';

export class StayService {
  static async getPublicStay(stayId: string): Promise<PublicStay> {
    const response = await api.get(`/public/stay/${stayId}`);
    return publicStaySchema.parse(response.data);
  }
}
