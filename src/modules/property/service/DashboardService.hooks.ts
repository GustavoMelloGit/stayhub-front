import { useQuery } from '@tanstack/react-query';
import { DashboardService } from './DashboardService';

export const useDashboardOverview = (date: string) => {
  const {
    data: overview,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-overview', date],
    queryFn: () => DashboardService.getOverview(date),
    staleTime: 5 * 60 * 1000,
  });

  return { overview, isLoading, error };
};
