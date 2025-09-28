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
