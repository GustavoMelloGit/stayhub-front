import z from 'zod';

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  total_pages: z.number(),
  has_next: z.boolean(),
  has_previous: z.boolean(),
});

export type PaginatedResponse<T> = {
  data: T[];
  pagination: z.infer<typeof paginationSchema>;
};

export type PaginationParams = {
  limit: number;
  page: number;
};
