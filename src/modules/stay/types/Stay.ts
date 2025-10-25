import { ENTRANCE_CODE_LENGTH } from '@/config/constants';
import z from 'zod';

export const staySchema = z.object({
  id: z.string(),
  check_in: z.coerce.date(),
  check_out: z.coerce.date(),
  entrance_code: z.string().length(ENTRANCE_CODE_LENGTH),
  guests: z.number(),
  price: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Stay = z.infer<typeof staySchema>;

export const tenantSexSchema = z.enum(['MALE', 'FEMALE', 'OTHER']);
export type TenantSex = z.infer<typeof tenantSexSchema>;

export const tenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  sex: tenantSexSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Tenant = z.infer<typeof tenantSchema>;
export type WithTenant<T> = T & {
  tenant: Tenant;
};

export const sourcePlatformSchema = z.enum(['BOOKING', 'AIRBNB']);
export type SourcePlatform = z.infer<typeof sourcePlatformSchema>;

export const externalStaySchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
  sourcePlatform: sourcePlatformSchema,
  property: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type ExternalStay = z.infer<typeof externalStaySchema>;

export const publicStaySchema = z.object({
  check_in: z.coerce.date(),
  check_out: z.coerce.date(),
  entrance_code: z.string().length(ENTRANCE_CODE_LENGTH),
  tenant: z.object({
    name: z.string(),
  }),
});

export type PublicStay = z.infer<typeof publicStaySchema>;

export const updateStayRequestSchema = z.object({
  check_in: z.iso.datetime().optional(),
  check_out: z.iso.datetime().optional(),
  guests: z.int().positive().optional(),
  price: z.int().positive().optional(),
});

export type UpdateStayRequest = z.infer<typeof updateStayRequestSchema>;
