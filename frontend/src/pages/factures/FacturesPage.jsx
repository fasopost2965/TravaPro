import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useFactures, useFacture } from '../../hooks/useFactures';
import { useClients } from '../../hooks/useClients';
import { useChantiers } from '../../hooks/useChantiers';
import api from '../../lib/axios';

const STATUTS = [
  { value: '', label: 'Tous' },
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'envoyee', label: 'Envoyée' },
  { value: 'payee', label: 'Payée' },
  { value: 'partiellement_payee', label: 'Partiel.' },
  { value: 'en_retard', label: 'En retard' },
];

const STATUT_COLORS = {
  brouillon:           'bg-slate-100 text-slate-600',
  envoyee:             'bg-blue-100 text-blue-700',
  payee:               'bg-green-100 text-green-700',
  partiellement_payee: 'bg-yellow-100 text-yellow-700',
  en_retard:           'bg-red-100 text-red-700',
};

const MODES_PAIEMENT = [
  { value: 'especes',  label: 'Espèces' },
  { value: 'virement', label: 'Virement' },
  { value: 'cheque',   label: 'Chèque' },
  { value: 'carte',    label: 'Carte' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function FacturesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showPaiementModal, setShowPaiementModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [paiementForm, setPaiementForm] = useState({
    montant: '',
    date: '',
    mode: 'virement',
    notes: '',
  });
  const [createForm, setCreateForm] = useState({
    chantier_id: '',
    client_id: '',
    date_emission: '',
    date_echeance: '',
    montant_ht: '',
    tva: 20,
    notes: '',
  });

  const { data, isLoading } = useFactures({ search, statut });
  const { data: detail } = useFacture(selectedId);
  const clientsQuery = useClients();
  const chantiersQuery = useChantiers();

  const factures = data?.data || [];

  const addPaiementMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      api.post(`/factures/${id}/paiements`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      queryClient.invalidateQueries({ queryKey: ['facture', selectedId] });
      setShowPaiementModal(false);
      setPaiementForm({ montant: '', date: '', mode: 'virement', notes: '' });
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/factures', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      setShowCreateModal(false);
      setCreateForm({
        chantier_id: '',
        client_id: '',
        date_emission: '',
        date_echeance: '',
        montant_ht: '',
        tva: 20,
        notes: '',
      });
    },
  });

  const totalPaye =
    detail?.paiements?.reduce((sum, p) => sum + Number(p.montant), 0) ?? 0;
  const reste = (detail?.montant_ttc ?? 0) - totalPaye;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Factures</h1>
          <p className="text-sm text-muted">
            Gestion de la facturation et des paiements.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nouvelle facture
        </button>
      </div>

      {/* 2-column layout */}
      <div className="grid gap-6 md:grid-cols-[1fr_380px]">
        {/* Left — list */}
        <div className="space-y-4">
          {/* Filters */}
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher facture ou client…"
                className="flex-1 rounded-xl border border-border bg-surface-bg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              />
              <div className="flex gap-2 flex-wrap">
                {STATUTS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStatut(s.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      statut === s.value
                        ? 'bg-primary text-white'
                        : 'bg-surface-bg text-muted hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-surface-bg">
                  <tr>
                    {[
                      'N° Facture',
                      'Client',
                      'Chantier',
                      'Montant TTC',
                      'Payé',
                      'Reste',
                      'Statut',
                      '',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-10 text-center text-muted"
                      >
                        Chargement…
                      </td>
                    </tr>
                  ) : factures.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-10 text-center text-muted"
                      >
                        Aucune facture.
                      </td>
                    </tr>
                  ) : (
                    factures.map((f) => {
                      const paye = Number(f.paiements_sum_montant ?? 0);
                      const r = (f.montant_ttc ?? 0) - paye;
                      return (
                        <tr
                          key={f.id}
                          onClick={() => setSelectedId(f.id)}
                          className={`cursor-pointer transition-colors hover:bg-surface-bg ${
                            selectedId === f.id
                              ? 'bg-primary/5 border-l-2 border-primary'
                              : ''
                          }`}
                        >
                          <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-800">
                            {f.numero}
                          </td>
                          <td className="px-4 py-3.5 text-slate-700">
                            {f.client?.nom_entreprise || '—'}
                          </td>
                          <td className="px-4 py-3.5 text-slate-600 max-w-[120px] truncate">
                            {f.chantier?.titre || '—'}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-900">
                            {formatCurrency(f.montant_ttc)}
                          </td>
                          <td className="px-4 py-3.5 text-success font-medium">
                            {formatCurrency(paye)}
                          </td>
                          <td
                            className={`px-4 py-3.5 font-medium ${
                              r > 0 ? 'text-danger' : 'text-success'
                            }`}
                          >
                            {formatCurrency(r)}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                STATUT_COLORS[f.statut] ||
                                'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {f.statut?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="material-symbols-outlined text-lg text-muted">
                              chevron_right
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right — Detail panel */}
        <div>
          {!selectedId ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-200">
                receipt_long
              </span>
              <p className="mt-3 text-sm text-muted">
                Sélectionnez une facture pour voir le détail
              </p>
            </div>
          ) : !detail ? (
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-3 text-sm text-muted">Chargement…</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
              {/* Detail Header */}
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-bold text-slate-800">
                    {detail.numero}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {detail.client?.nom_entreprise}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    STATUT_COLORS[detail.statut] || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {detail.statut?.replace('_', ' ')}
                </span>
              </div>

              <div className="p-5 space-y-5">
                {/* Amounts */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-surface-bg p-3">
                    <p className="text-xs text-muted">TTC</p>
                    <p className="font-bold text-slate-900 mt-1">
                      {formatCurrency(detail.montant_ttc)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-3">
                    <p className="text-xs text-muted">Payé</p>
                    <p className="font-bold text-success mt-1">
                      {formatCurrency(totalPaye)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-xs text-muted">Reste</p>
                    <p
                      className={`font-bold mt-1 ${
                        reste > 0 ? 'text-danger' : 'text-success'
                      }`}
                    >
                      {formatCurrency(reste)}
                    </p>
                  </div>
                </div>

                {/* Lignes */}
                {detail.lignes?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                      Lignes
                    </p>
                    <div className="space-y-2">
                      {detail.lignes.map((l, i) => (
                        <div
                          key={l.id ?? i}
                          className="flex items-start justify-between gap-3 text-sm"
                        >
                          <div className="flex-1">
                            <p className="text-slate-800">{l.description}</p>
                            <p className="text-xs text-muted">
                              {l.quantite} × {formatCurrency(l.prix_unitaire)}
                            </p>
                          </div>
                          <p className="font-semibold text-slate-900 shrink-0">
                            {formatCurrency(l.total)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paiements */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                      Paiements
                    </p>
                    <button
                      onClick={() => setShowPaiementModal(true)}
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Ajouter
                    </button>
                  </div>
                  {!detail.paiements?.length ? (
                    <p className="text-xs text-muted">
                      Aucun paiement enregistré.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {detail.paiements.map((p, i) => (
                        <li
                          key={p.id ?? i}
                          className="flex items-center justify-between text-sm"
                        >
                          <div>
                            <span className="font-medium text-slate-800">
                              {formatCurrency(p.montant)}
                            </span>
                            <span className="ml-2 text-xs text-muted capitalize">
                              {p.mode}
                            </span>
                          </div>
                          <span className="text-xs text-muted">
                            {formatDate(p.date)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Dates */}
                <div className="flex justify-between text-xs text-muted border-t border-border pt-3">
                  <span>Émission : {formatDate(detail.date_emission)}</span>
                  <span>Échéance : {formatDate(detail.date_echeance)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Paiement */}
      {showPaiementModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-5">
              Ajouter un paiement
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addPaiementMutation.mutate({
                  id: selectedId,
                  payload: paiementForm,
                });
              }}
              className="space-y-4"
            >
              <label className="block text-sm font-medium text-slate-700">
                Montant (MAD)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={paiementForm.montant}
                  onChange={(e) =>
                    setPaiementForm((f) => ({ ...f, montant: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Date
                <input
                  type="date"
                  required
                  value={paiementForm.date}
                  onChange={(e) =>
                    setPaiementForm((f) => ({ ...f, date: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Mode
                <select
                  value={paiementForm.mode}
                  onChange={(e) =>
                    setPaiementForm((f) => ({ ...f, mode: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  {MODES_PAIEMENT.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaiementModal(false)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-slate-700 hover:bg-surface-bg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={addPaiementMutation.isLoading}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Créer Facture */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-5">
              Nouvelle facture
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate({
                  ...createForm,
                  montant_ht: Number(createForm.montant_ht),
                  tva: Number(createForm.tva),
                });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-slate-700">
                  Client
                  <select
                    required
                    value={createForm.client_id}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        client_id: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Sélectionner…</option>
                    {clientsQuery.data?.data?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom_entreprise}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Chantier
                  <select
                    required
                    value={createForm.chantier_id}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        chantier_id: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Sélectionner…</option>
                    {chantiersQuery.data?.data?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.titre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-slate-700">
                  Date émission
                  <input
                    type="date"
                    required
                    value={createForm.date_emission}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        date_emission: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Date échéance
                  <input
                    type="date"
                    required
                    value={createForm.date_echeance}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        date_echeance: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-slate-700">
                  Montant HT (MAD)
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={createForm.montant_ht}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        montant_ht: e.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  TVA (%)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={createForm.tva}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, tva: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
              </div>
              <label className="block text-sm font-medium text-slate-700">
                Notes
                <textarea
                  rows={3}
                  value={createForm.notes}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-slate-700 hover:bg-surface-bg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
