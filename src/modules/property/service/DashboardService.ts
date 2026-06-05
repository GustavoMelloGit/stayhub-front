import z from 'zod';
import api from '@/lib/api';

const dashboardKpisSchema = z.object({
  active_stays: z.number(),
  upcoming_check_ins: z.number(),
  monthly_revenue: z.number(),
});

const dashboardUpcomingStaySchema = z.object({
  id: z.string(),
  property_id: z.string(),
  property_name: z.string(),
  check_in: z.coerce.date(),
  tenant: z.object({
    name: z.string(),
  }),
});

const dashboardOverviewSchema = z.object({
  kpis: dashboardKpisSchema,
  upcoming_stays: z.array(dashboardUpcomingStaySchema),
});

export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;
export type DashboardUpcomingStay = z.infer<typeof dashboardUpcomingStaySchema>;

export class DashboardService {
  static async getOverview(date: string): Promise<DashboardOverview> {
    const response = await api.get('/dashboard/overview', { params: { date } });
    return dashboardOverviewSchema.parse(response.data);
  }
}
