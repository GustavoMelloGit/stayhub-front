import api from '@/lib/api';
import z from 'zod';

const getPublicStaySchema = z.object({
  check_in: z.coerce.date(),
  check_out: z.coerce.date(),
  entrance_code: z.string(),
  tenant: z.object({
    name: z.string(),
  }),
});

export type GetPublicStayResponse = z.infer<typeof getPublicStaySchema>;

export const StayService = {
  getPublicStay: async (stayId: string) => {
    const response = await api.get(`/public/stay/${stayId}`);
    return getPublicStaySchema.parse(response.data);
  },
};
