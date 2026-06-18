import api from '@/lib/api';
import z from 'zod';
import { tenantSexSchema } from '@/modules/stay/types/Stay';

export const tenantSearchResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  sex: tenantSexSchema,
});

export type TenantSearchResult = z.infer<typeof tenantSearchResultSchema>;

export class TenantService {
  static async searchTenants(q: string): Promise<TenantSearchResult[]> {
    const response = await api.get<TenantSearchResult[]>('/tenants', {
      params: { q },
    });
    return z.array(tenantSearchResultSchema).parse(response.data);
  }
}
