import { z } from 'zod';

export const financeMovementSchema = z.object({
  id: z.uuidv4(),
  description: z.string().nullable(),
  amount: z.int(),
  category: z.string(),
  property_id: z.uuidv4(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type FinanceMovement = z.infer<typeof financeMovementSchema>;
