import { useEffect, useState, useMemo } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

const initialForm = {
  nom_entreprise: '',
  contact_nom: '',
  email: '',
  telephone: '',
  adresse: '',
  ice: '',
};

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [editingClient, setEditingClient] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'info', 'success', 'error'

  // Paginated client query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['clients', { search, page }],
    queryFn: async () => {
      const response = await api.get('/clients', {
        params: { search, page, per_page: 10 }
      });
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 30,
  });

  const clientData = data?.data || [];
  const totalPages = data?.meta?.last_page || 1;
  const totalClients = data?.meta?.total ?? 0;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/clients', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setFormData(initialForm);
      setEditingClient(null);
      setMessageType('success');
      setMessage('Client créé avec succès.');
    },
    onError: (err) => {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Impossible de créer le client.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/clients/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setFormData(initialForm);
      setEditingClient(null);
      setMessageType('success');
      setMessage('Client mis à jour avec succès.');
    },
    onError: (err) => {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Impossible de mettre à jour le client.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setMessageType('success');
      setMessage('Client supprimé avec succès.');
    },
    onError: (err) => {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Impossible de supprimer le client.');
    },
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleEdit(client) {
    setEditingClient(client);
    setFormData({
      nom_entreprise: client.nom_entreprise,
      contact_nom: client.contact_nom || '',
      email: client.email || '',
      telephone: client.telephone || '',
      adresse: client.adresse || '',
      ice: client.ice || '',
    });
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingClient(null);
    setFormData(initialForm);
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Clients CRM</h1>
          <p className="text-sm text-slate-600">Gérez le portefeuille clients, les informations légales (ICE) et suivez les projets associés.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleCancelEdit}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            {editingClient ? 'Nouveau client' : 'Réinitialiser'}
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('clients-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 shadow-sm"
          >
            + Ajouter un client
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Side: Stats and Filter and List */}
        <div className="space-y-6">
          {/* Stats Bento */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-secondary-fixed text-on-secondary-fixed material-symbols-outlined rounded-xl">groups</span>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total clients</p>
                  <p className="mt-1 text-2xl font-bold text-[#0F172A]">{isLoading ? '...' : totalClients}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-[#eef2ff] text-primary material-symbols-outlined rounded-xl">business</span>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Type d'activité</p>
                  <p className="mt-1 text-base font-bold text-[#0F172A]">SaaS Professionnel BTP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Rechercher par nom d'entreprise, contact ou ICE..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition focus:border-primary focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* List Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Liste des clients</h2>
                <p className="text-sm text-slate-500">{totalClients} client(s) trouvé(s)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider text-slate-600">Page {page} / {totalPages}</span>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Préc.
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Suiv.
                </button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm text-slate-700">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-l-xl">Entreprise</th>
                    <th className="px-4 py-3 font-semibold">Contact principal</th>
                    <th className="px-4 py-3 font-semibold">Email & Tél.</th>
                    <th className="px-4 py-3 font-semibold">ICE (Maroc)</th>
                    <th className="px-4 py-3 font-semibold">Chantiers</th>
                    <th className="px-4 py-3 font-semibold rounded-r-xl text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-slate-500">Chargement des clients…</td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-red-500 font-semibold">Une erreur s'est produite lors du chargement.</td>
                    </tr>
                  ) : clientData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-slate-400">Aucun client enregistré.</td>
                    </tr>
                  ) : (
                    clientData.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 font-bold text-[#0F172A]">{client.nom_entreprise}</td>
                        <td className="px-4 py-4 text-slate-700">{client.contact_nom || '—'}</td>
                        <td className="px-4 py-4 space-y-0.5">
                          <div className="text-slate-800 font-medium">{client.email || '—'}</div>
                          <div className="text-xs text-slate-500">{client.telephone || '—'}</div>
                        </td>
                        <td className="px-4 py-4 font-mono text-xs text-primary font-bold">{client.ice || '—'}</td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 bg-[#eef2ff] text-primary text-xs font-extrabold rounded-lg">
                            {client.chantiers_count ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-4 space-x-2 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleEdit(client)}
                            className="inline-flex items-center px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Voulez-vous vraiment supprimer le client "${client.nom_entreprise}" ?`)) {
                                deleteMutation.mutate(client.id);
                              }
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
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
          </div>
        </div>

        {/* Right Side: Add/Edit Form */}
        <section id="clients-form" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit sticky top-20">
          <h2 className="text-lg font-bold text-[#0F172A]">
            {editingClient ? 'Modifier le client' : 'Nouveau client'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Saisissez les informations administratives et de contact de l'entreprise.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nom de l'entreprise *
              <input
                name="nom_entreprise"
                value={formData.nom_entreprise}
                onChange={handleChange}
                required
                placeholder="Ex: Stitch Maroc SARL"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
              />
            </label>

            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nom du contact principal
              <input
                name="contact_nom"
                value={formData.contact_nom}
                onChange={handleChange}
                placeholder="Ex: Youssef Alami"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@entreprise.ma"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                />
              </label>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Téléphone
                <input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+212 600-000000"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
                />
              </label>
            </div>

            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              ICE (Identifiant Commun de l'Entreprise)
              <input
                name="ice"
                value={formData.ice}
                onChange={handleChange}
                maxLength={15}
                placeholder="15 chiffres réglementaires"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-mono outline-none transition focus:border-primary focus:bg-white"
              />
            </label>

            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Adresse
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                rows={3}
                placeholder="Siège social, Ville..."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-white"
              />
            </label>

            {message && (
              <div className={`p-3 rounded-lg text-xs font-semibold ${
                messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {message}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {editingClient ? 'Enregistrer les modifications' : 'Créer le client'}
              </button>
              {editingClient && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
