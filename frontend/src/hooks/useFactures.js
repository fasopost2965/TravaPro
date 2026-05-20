import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export function useFactures(params = {}) {
  return useQuery(
    ['factures', params],
    () => api.get('/factures', { params }).then(r => r.data),
    { staleTime: 30_000 }
  );
}

export function useFacture(id) {
  return useQuery(
    ['facture', id],
    () => api.get(`/factures/${id}`).then(r => r.data.data),
    { enabled: !!id, staleTime: 30_000 }
  );
}
