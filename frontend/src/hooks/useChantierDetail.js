import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export function useChantierDetail(id) {
  return useQuery(
    ['chantier', id],
    () => api.get(`/chantiers/${id}`).then(r => r.data.data),
    { enabled: !!id, staleTime: 30_000 }
  );
}

export function useChantierEtapes(id) {
  return useQuery(
    ['chantier-etapes', id],
    () => api.get(`/chantiers/${id}/etapes`).then(r => r.data.data),
    { enabled: !!id, staleTime: 30_000 }
  );
}

export function useChantierEquipe(id) {
  return useQuery(
    ['chantier-equipe', id],
    () => api.get(`/chantiers/${id}/equipe`).then(r => r.data.data),
    { enabled: !!id, staleTime: 30_000 }
  );
}

export function useChantierRapports(id) {
  return useQuery(
    ['chantier-rapports', id],
    () => api.get(`/chantiers/${id}/rapports`).then(r => r.data.data),
    { enabled: !!id, staleTime: 30_000 }
  );
}
