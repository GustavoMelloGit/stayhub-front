import type { PaginatedResponse } from '@/types/api';
import type { FinanceMovement } from '../types/Movement';
import api from '@/lib/api';

export class FinanceService {
  static async findAllFromProperty(
    propertyId: string
  ): Promise<PaginatedResponse<FinanceMovement>> {
    const response = await api.get<PaginatedResponse<FinanceMovement>>(
      `/finance/properties/${propertyId}/movements`
    );
    return response.data;
  }
}
