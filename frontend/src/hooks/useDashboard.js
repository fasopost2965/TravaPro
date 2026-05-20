import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard');
      return response.data.data;
    },
    staleTime: 1000 * 60,
    retry: false,
  });
}
