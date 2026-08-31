import api from '@/lib/api';
import {
  waitlistResponseSchema,
  type WaitlistPayload,
  type WaitlistResponse,
} from './waitlist.schema';

export class WaitlistService {
  /**
   * Envia um lead da landing para a lista de espera.
   *
   * Endpoint esperado no backend: `POST /waitlist`, respondendo 2xx com um
   * corpo opcional `{ id?, position? }`. Um corpo vazio também é aceito.
   */
  static async join(payload: WaitlistPayload): Promise<WaitlistResponse> {
    const response = await api.post('/waitlist', {
      name: payload.name,
      whatsapp: payload.whatsapp,
      property_count: payload.propertyCount,
      source: 'landing',
    });

    return waitlistResponseSchema.parse(response.data ?? {});
  }
}
