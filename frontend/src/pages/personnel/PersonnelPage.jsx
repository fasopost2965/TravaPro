import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import api from '../../lib/axios';

const ROLE_COLORS = {
  admin:         'bg-purple-100 text-purple-700',
  chef_chantier: 'bg-primary/10 text-primary',
  technicien:    'bg-green-100 text-green-700',
};

const ROLE_LABELS = {
  admin:         'Admin',
  chef_chantier: 'Chef chantier',
  technicien:    'Technicien',
};

const initialForm = { name: '', email: '', role: 'technicien' };

export default function PersonnelPage() {
  const { user } = useAuthStore();

  if (!['admin', 'chef_chantier'].includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const { data, isLoading } = useQuery(
    ['personnel', search],
    () => api.get('/personnel', { params: { search } }).then(r => r.data),
    { staleTime: 30_000 }
  );
  const personnel = data?.data || [];

  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/personnel', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel'] });
      setShowModal(false);
      setForm(initialForm);
      setMessage('Membre créé avec succès.');
    },
    onError: (err) => setMessage(err?.response?.data?.message || 'Erreur lors de la création.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/personnel/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel'] });
      setShowModal(false);
      setEditingUser(null);
      setForm(initialForm);
      setMessage('Membre mis à jour.');
    },
    onError: (err) => setMessage(err?.response?.data?.message || 'Erreur lors de la mise à jour.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/personnel/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel'] });
      setMessage('Membre supprimé.');
    },
  });

  function openCreate() {
    setEditingUser(null);
    setForm(initialForm);
    setMessage('');
    setShowModal(true);
  }

  function openEdit(u) {
    setEditingUser(u);
    setForm({ name: u.name, email: u.email, role: u.role });
    setMessage('');
    setShowModal(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, payload: form });
    } else {
      createMutation.mutate(form);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Équipe</h1>
          <p className="text-sm text-muted">Gestion des membres et des accès.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Nouveau membre
        </button>
      </div>

      {/* Feedback message */}
      {message && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {message}
        </div>
      )}

      {/* Search */}
      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou email…"
          className="w-full rounded-xl border border-border bg-surface-bg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-bg">
            <tr>
              {['Membre','Email','Rôle','Pointages','Actions'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan="5" className="px-5 py-10 text-center text-muted">Chargement…</td></tr>
            ) : personnel.length === 0 ? (
              <tr><td colSpan="5" className="px-5 py-10 text-center text-muted">Aucun membre trouvé.</td></tr>
            ) : personnel.map(u => (
              <tr key={u.id} className="hover:bg-surface-bg transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted">{u.email}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    ROLE_COLORS[u.role] || 'bg-slate-100 text-slate-600'
                  }`}>{ROLE_LABELS[u.role] || u.role}</span>
                </td>
                <td className="px-5 py-4 text-muted">{u.pointages_count ?? 0}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs text-slate-700 hover:bg-surface-bg transition-colors"
                    >Modifier</button>
                    <button
                      onClick={() => { if (confirm('Supprimer ce membre ?')) deleteMutation.mutate(u.id); }}
                      className="px-3 py-1.5 rounded-lg border border-danger text-xs text-danger hover:bg-red-50 transition-colors"
                    >Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="text-center py-10 text-muted">Chargement…</div>
        ) : personnel.map(u => (
          <div key={u.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {u.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{u.name}</p>
                <p className="text-xs text-muted">{u.email}</p>
              </div>
              <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold ${
                ROLE_COLORS[u.role] || 'bg-slate-100 text-slate-600'
              }`}>{ROLE_LABELS[u.role] || u.role}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(u)}
                className="flex-1 py-2 rounded-xl border border-border text-xs text-slate-700 hover:bg-surface-bg"
              >Modifier</button>
              <button onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(u.id); }}
                className="flex-1 py-2 rounded-xl border border-danger text-xs text-danger hover:bg-red-50"
              >Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-5">
              {editingUser ? 'Modifier le membre' : 'Nouveau membre'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Nom complet
                <input
                  type="text" required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Rôle
                <select
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="chef_chantier">Chef chantier</option>
                  <option value="technicien">Technicien</option>
                </select>
              </label>
              {message && <p className="text-sm text-danger">{message}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setMessage(''); }}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-slate-700 hover:bg-surface-bg"
                >Annuler</button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                >{editingUser ? 'Mettre à jour' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
