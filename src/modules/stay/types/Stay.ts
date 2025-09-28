import z from 'zod';

export const staySchema = z.object({
  id: z.string(),
  check_in: z.coerce.date(),
  check_out: z.coerce.date(),
  entrance_code: z.string(),
  guests: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Stay = z.infer<typeof staySchema>;

export const tenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  sex: z.enum(['MALE', 'FEMALE']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Tenant = z.infer<typeof tenantSchema>;
export type WithTenant<T> = T & {
  tenant: Tenant;
};
