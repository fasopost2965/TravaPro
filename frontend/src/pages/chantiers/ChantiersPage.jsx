import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import api from '../../lib/axios';
import { useChantiers } from '../../hooks/useChantiers';
import { useClients } from '../../hooks/useClients';

const STATUTS = [
  { value: 'planifie', label: 'Planifié' },
  { value: 'preparation', label: 'Préparation' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'suspendu', label: 'Suspendu' },
  { value: 'termine', label: 'Terminé' },
  { value: 'annule', label: 'Annulé' },
];

const initialForm = {
  client_id: '',
  titre: '',
  description: '',
  adresse: '',
  ville: '',
  statut: 'planifie',
  date_debut: '',
  date_fin_prevue: '',
  budget: '',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value);
}

export default function ChantiersPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [editingChantier, setEditingChantier] = useState(null);
  const [message, setMessage] = useState('');

  const { data, isLoading, isError } = useChantiers({ search, statut, page, perPage: 15 });
  const clientsQuery = useClients();

  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/chantiers', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chantiers'] });
      setFormData(initialForm);
      setEditingChantier(null);
      setMessage('Chantier créé avec succès.');
    },
    onError: () => setMessage('Impossible de créer le chantier.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/chantiers/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chantiers'] });
      setFormData(initialForm);
      setEditingChantier(null);
      setMessage('Chantier mis à jour.');
    },
    onError: () => setMessage('Impossible de mettre à jour le chantier.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/chantiers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chantiers'] });
      setMessage('Chantier supprimé.');
    },
    onError: () => setMessage('Impossible de supprimer le chantier.'),
  });

  useEffect(() => {
    if (!clientsQuery.isLoading && clientsQuery.data?.data?.length) {
      setFormData((current) => ({
        ...current,
        client_id: current.client_id || clientsQuery.data.data[0]?.id || '',
      }));
    }
  }, [clientsQuery.isLoading, clientsQuery.data]);

  const chantierData = data?.data || [];
  const totalPages = data?.meta?.last_page || 1;

  const statusSummary = useMemo(() => {
    return STATUTS.map((option) => ({
      ...option,
      count: chantierData.filter((item) => item.statut === option.value).length,
    }));
  }, [chantierData]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleEdit(chantier) {
    setEditingChantier(chantier);
    setFormData({
      client_id: chantier.client_id,
      titre: chantier.titre,
      description: chantier.description || '',
      adresse: chantier.adresse,
      ville: chantier.ville,
      statut: chantier.statut,
      date_debut: chantier.date_debut || '',
      date_fin_prevue: chantier.date_fin_prevue || '',
      budget: chantier.budget || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingChantier(null);
    setFormData(initialForm);
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    const payload = {
      ...formData,
      chef_id: user?.id,
      budget: formData.budget ? Number(formData.budget) : 0,
    };

    if (editingChantier) {
      updateMutation.mutate({ id: editingChantier.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chantiers</h1>
          <p className="text-sm text-slate-600">Gestion complète des chantiers et suivi opérationnel.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleCancelEdit}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            {editingChantier ? 'Nouveau chantier' : 'Réinitialiser'}
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('chantiers-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            + Ajouter un chantier
          </button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Total chantiers</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{data?.meta?.total ?? '...'}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Chantier responsable</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{user?.name || '...'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {statusSummary.map((item) => (
              <div key={item.value} className="rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <p className="text-slate-500">{item.label}</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{item.count}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Filtrer</h2>
                <p className="text-sm text-slate-500">Recherche et statut.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher par titre, ville ou statut"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
              <select
                value={statut}
                onChange={(event) => setStatut(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
              >
                <option value="">Tous les statuts</option>
                {STATUTS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setPage(1)}
                className="w-full rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>

        <section id="chantiers-form" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{editingChantier ? 'Modifier un chantier' : 'Nouveau chantier'}</h2>
          <p className="mt-1 text-sm text-slate-500">Utilisez ce formulaire pour créer ou mettre à jour un chantier.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Client
                <select
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
                >
                  <option value="">Sélectionnez un client</option>
                  {clientsQuery.data?.data?.map((client) => (
                    <option key={client.id} value={client.id}>{client.nom_entreprise}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Titre
                <input
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Adresse
                <input
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Ville
                <input
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Statut
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
                >
                  {STATUTS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Budget estimé
                <input
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Début prévu
                <input
                  name="date_debut"
                  type="date"
                  value={formData.date_debut}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Fin prévue
                <input
                  name="date_fin_prevue"
                  type="date"
                  value={formData.date_fin_prevue}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </label>

            {message && <p className="text-sm text-primary">{message}</p>}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="inline-flex items-center justify-center rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingChantier ? 'Mettre à jour le chantier' : 'Créer le chantier'}
              </button>
              {editingChantier && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Liste des chantiers</h2>
            <p className="text-sm text-slate-500">{chantierData.length} résultat(s)</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-600">Page {page}</span>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Préc.
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Suiv.
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.15em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Début</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">Chargement des chantiers…</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-danger">Erreur lors du chargement.</td>
                </tr>
              ) : chantierData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">Aucun chantier trouvé.</td>
                </tr>
              ) : (
                chantierData.map((chantier) => (
                  <tr key={chantier.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/chantiers/${chantier.id}`)}>
                    <td className="px-4 py-4 font-medium text-slate-900">{chantier.titre}</td>
                    <td className="px-4 py-4">{chantier.client?.nom_entreprise || '—'}</td>
                    <td className="px-4 py-4">{chantier.ville}</td>
                    <td className="px-4 py-4 capitalize">{chantier.statut.replace('_', ' ')}</td>
                    <td className="px-4 py-4">{chantier.date_debut || '—'}</td>
                    <td className="px-4 py-4">{formatCurrency(chantier.budget || 0)}</td>
                    <td className="px-4 py-4 space-x-2">
                       <button
                         type="button"
                         onClick={(e) => { e.stopPropagation(); handleEdit(chantier); }}
                         className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-50"
                       >
                         Modifier
                       </button>
                       <button
                         type="button"
                         onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(chantier.id); }}
                         className="rounded-full border border-danger bg-red-100 px-3 py-2 text-xs font-semibold text-danger transition hover:bg-danger/80"
                       >
                         Supprimer
                       </button>
                     </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
