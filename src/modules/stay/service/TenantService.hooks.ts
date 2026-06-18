import { useQuery } from '@tanstack/react-query';
import { TenantService } from './TenantService';

export const useSearchTenants = (q: string) => {
  const { data, isPending } = useQuery({
    queryKey: ['tenants', 'search', q],
    queryFn: () => TenantService.searchTenants(q),
    enabled: q.trim().length >= 2,
    staleTime: 30 * 1000,
  });
  return { tenants: data ?? [], isLoading: isPending };
};
