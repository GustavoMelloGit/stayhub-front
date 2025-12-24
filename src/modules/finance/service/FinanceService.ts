import type { PaginatedResponse, PaginationParams } from '@/types/api';
import { financeMovementSchema, type FinanceMovement } from '../types/Movement';
import api from '@/lib/api';
import {
  recordExpenseDtoSchema,
  recordRevenueDtoSchema,
  type RecordExpenseDto,
  type RecordRevenueDto,
} from './FinanceService.dto';
import { buildUrlWithParams } from '@/lib/utils';

export class FinanceService {
  static async findAllFromProperty(
    propertyId: string,
    filter?: Partial<PaginationParams>
  ): Promise<PaginatedResponse<FinanceMovement>> {
    const url = buildUrlWithParams(
      `/finance/properties/${propertyId}/movements`,
      filter
    );
    const response = await api.get<PaginatedResponse<FinanceMovement>>(url);
    return {
      pagination: response.data.pagination,
      data: financeMovementSchema.array().parse(response.data.data),
    };
  }

  static async recordExpense(dto: RecordExpenseDto): Promise<void> {
    const { property_id, ...data } = recordExpenseDtoSchema.parse(dto);
    await api.post(`/finance/${property_id}/expense`, data);
  }

  static async recordRevenue(dto: RecordRevenueDto): Promise<void> {
    const { property_id, ...data } = recordRevenueDtoSchema.parse(dto);
    await api.post(`/finance/${property_id}/revenue`, data);
  }
}
