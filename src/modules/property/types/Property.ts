import z from 'zod';

export const propertySchema = z.object({
  id: z.string(),
  name: z.string(),
  user_id: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  deleted_at: z.coerce.date().nullable(),
});

export type Property = z.infer<typeof propertySchema>;

export const bookStayRequestSchema = z.object({
  check_in: z.iso.datetime(),
  check_out: z.iso.datetime(),
  entrance_code: z.string(),
  tenant: z.uuidv4(),
  guests: z.number(),
  property: z.uuidv4(),
});

export type BookStayRequest = z.infer<typeof bookStayRequestSchema>;
