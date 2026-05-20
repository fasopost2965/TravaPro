import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export function useClients() {
  return useQuery({
    queryKey: ['clients', 'list'],
    queryFn: async () => {
      const response = await api.get('/clients', { params: { per_page: 100 } });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
