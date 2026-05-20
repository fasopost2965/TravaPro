import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import api from '../../lib/axios';
import { useChantiers } from '../../hooks/useChantiers';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function TerrainPage() {
  const { user } = useAuthStore();

  // Role guard — redirect non-techniciens
  if (user && user.role !== 'technicien') {
    return <Navigate to="/dashboard" replace />;
  }

  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [rapportForm, setRapportForm] = useState({ chantier_id: '', date: today, description: '', observations: '' });
  const [rapportMsg, setRapportMsg] = useState('');

  const chantiersQuery = useChantiers();
  const chantiers = chantiersQuery.data?.data || [];

  const { data: pointagesData, refetch: refetchPointages } = useQuery(
    ['pointages-today'],
    () => api.get('/pointages').then(r => r.data.data),
    { staleTime: 10_000 }
  );
  const pointages = pointagesData || [];

  const hasArrivee = pointages.some(p => p.type === 'arrivee');
  const hasDepart  = pointages.some(p => p.type === 'depart');

  const pointageMutation = useMutation({
    mutationFn: (payload) => api.post('/pointages', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pointages-today'] });
    },
  });

  const rapportMutation = useMutation({
    mutationFn: (payload) => api.post('/rapports', payload),
    onSuccess: () => {
      setRapportForm({ chantier_id: '', date: today, description: '', observations: '' });
      setRapportMsg('Rapport envoyé avec succès !');
      setTimeout(() => setRapportMsg(''), 3000);
    },
    onError: () => setRapportMsg('Erreur lors de l\'envoi du rapport.'),
  });

  function handlePointer(type) {
    const chantier_id = chantiers[0]?.id;
    if (!chantier_id) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => pointageMutation.mutate({ chantier_id, type, latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => pointageMutation.mutate({ chantier_id, type })
      );
    } else {
      pointageMutation.mutate({ chantier_id, type });
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vue Terrain</h1>
        <p className="text-sm text-muted">{formatDate(new Date())}</p>
      </div>

      {/* Mes chantiers du jour */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Mes chantiers</h2>
        {chantiers.length === 0 ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-4xl text-slate-200">construction</span>
            <p className="text-sm text-muted mt-2">Aucun chantier assigné.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chantiers.slice(0, 3).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-surface-bg transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">construction</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{c.titre}</p>
                  <p className="text-xs text-muted">{c.ville}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                  c.statut === 'en_cours' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>{c.statut?.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pointage rapide */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Pointage du jour</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handlePointer('arrivee')}
            disabled={hasArrivee || pointageMutation.isLoading || chantiers.length === 0}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
              hasArrivee
                ? 'border-success bg-green-50 text-success cursor-default'
                : 'border-border hover:border-success hover:bg-green-50 hover:text-success text-slate-700'
            } disabled:opacity-60`}
          >
            <span className="material-symbols-outlined text-3xl">
              {hasArrivee ? 'check_circle' : 'login'}
            </span>
            <span className="text-sm font-semibold">{hasArrivee ? 'Arrivée pointée' : 'Pointer arrivée'}</span>
          </button>
          <button
            onClick={() => handlePointer('depart')}
            disabled={hasDepart || !hasArrivee || pointageMutation.isLoading || chantiers.length === 0}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
              hasDepart
                ? 'border-danger bg-red-50 text-danger cursor-default'
                : 'border-border hover:border-danger hover:bg-red-50 hover:text-danger text-slate-700'
            } disabled:opacity-60`}
          >
            <span className="material-symbols-outlined text-3xl">
              {hasDepart ? 'check_circle' : 'logout'}
            </span>
            <span className="text-sm font-semibold">{hasDepart ? 'Départ pointé' : 'Pointer départ'}</span>
          </button>
        </div>
        {pointages.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted mb-2">Historique du jour :</p>
            <ul className="space-y-1">
              {pointages.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <span className={`material-symbols-outlined text-sm ${
                    p.type === 'arrivee' ? 'text-success' : 'text-danger'
                  }`}>{p.type === 'arrivee' ? 'arrow_downward' : 'arrow_upward'}</span>
                  <span className="capitalize font-medium">{p.type}</span>
                  <span className="text-muted">{new Date(p.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Rapport journalier */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Rapport journalier</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            rapportMutation.mutate(rapportForm);
          }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-slate-700">
            Chantier
            <select
              required
              value={rapportForm.chantier_id}
              onChange={e => setRapportForm(f => ({ ...f, chantier_id: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="">Sélectionner un chantier…</option>
              {chantiers.map(c => <option key={c.id} value={c.id}>{c.titre}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Date
            <input
              type="date" required
              value={rapportForm.date}
              onChange={e => setRapportForm(f => ({ ...f, date: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Description des travaux
            <textarea
              required rows={4}
              value={rapportForm.description}
              onChange={e => setRapportForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Décrivez les travaux effectués aujourd'hui…"
              className="mt-1.5 w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary resize-none"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Observations (optionnel)
            <textarea
              rows={2}
              value={rapportForm.observations}
              onChange={e => setRapportForm(f => ({ ...f, observations: e.target.value }))}
              placeholder="Problèmes rencontrés, remarques…"
              className="mt-1.5 w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary resize-none"
            />
          </label>
          {rapportMsg && (
            <p className={`text-sm font-medium ${
              rapportMsg.includes('succès') ? 'text-success' : 'text-danger'
            }`}>{rapportMsg}</p>
          )}
          <button
            type="submit"
            disabled={rapportMutation.isLoading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {rapportMutation.isLoading ? 'Envoi…' : 'Envoyer le rapport'}
          </button>
        </form>
      </section>
    </div>
  );
}
