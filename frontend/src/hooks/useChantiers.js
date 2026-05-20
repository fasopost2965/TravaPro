import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export function useChantiers({ search = '', statut = '', page = 1, perPage = 15 } = {}) {
  return useQuery({
    queryKey: ['chantiers', { search, statut, page, perPage }],
    queryFn: async () => {
      const response = await api.get('/chantiers', {
        params: { search, statut, page, per_page: perPage },
      });
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });
}
