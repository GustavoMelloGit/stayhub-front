import { ENTRANCE_CODE_LENGTH } from '@/config/constants';
import { tenantSexSchema } from '@/modules/stay/types/Stay';
import z from 'zod';

export const propertySchema = z.object({
  id: z.string(),
  name: z.string(),
  user_id: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Property = z.infer<typeof propertySchema>;

export const bookStayRequestSchema = z.object({
  check_in: z.iso.datetime(),
  check_out: z.iso.datetime(),
  entrance_code: z.string().length(ENTRANCE_CODE_LENGTH),
  tenant: z.object({
    name: z.string(),
    phone: z.string(),
    sex: tenantSexSchema,
  }),
  guests: z.number(),
  property: z.uuidv4(),
});

export type BookStayRequest = z.infer<typeof bookStayRequestSchema>;

export const platformNameSchema = z.enum(['AIRBNB', 'BOOKING'], {
  message: 'Plataforma deve ser AIRBNB ou BOOKING',
});

export const externalBookingRequestSchema = z.object({
  platform_name: platformNameSchema,
  sync_url: z.url('URL deve ser válida'),
});

export type ExternalBookingRequest = z.infer<
  typeof externalBookingRequestSchema
>;

export const updatePropertyRequestSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
});

export type UpdatePropertyRequest = z.infer<typeof updatePropertyRequestSchema>;

export const CHECK_IN_HOUR = 15;
export const CHECK_OUT_HOUR = 9;
