import z from 'zod';

export const recordExpenseDtoSchema = z.object({
  amount: z.int(),
  description: z
    .string()
    .optional()
    .transform(val => val ?? null),
  category: z.string().min(1, 'É necessário informar a categoria'),
  property_id: z.uuidv4('É necessário informar o ID da propriedade'),
});

export type RecordExpenseDto = z.infer<typeof recordExpenseDtoSchema>;

export const recordRevenueDtoSchema = z.object({
  amount: z.int(),
  description: z
    .string()
    .optional()
    .transform(val => val ?? null),
  category: z.string().min(1, 'É necessário informar a categoria'),
  property_id: z.uuidv4('É necessário informar o ID da propriedade'),
});

export type RecordRevenueDto = z.infer<typeof recordRevenueDtoSchema>;
