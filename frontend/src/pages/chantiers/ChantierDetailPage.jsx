import { useParams, useNavigate } from 'react-router-dom';
import {
  useChantierDetail,
  useChantierEtapes,
  useChantierEquipe,
  useChantierRapports,
} from '../../hooks/useChantierDetail';

const STATUT_COLORS = {
  planifie:    'bg-blue-100 text-blue-700',
  preparation: 'bg-yellow-100 text-yellow-700',
  en_cours:    'bg-green-100 text-green-700',
  suspendu:    'bg-orange-100 text-orange-700',
  termine:     'bg-slate-100 text-slate-700',
  annule:      'bg-red-100 text-red-700',
};

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

export default function ChantierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: chantier, isLoading, isError } = useChantierDetail(id);
  const { data: etapes = [] } = useChantierEtapes(id);
  const { data: equipe = [] } = useChantierEquipe(id);
  const { data: rapports = [] } = useChantierRapports(id);

  const etapesTerminees = etapes.filter(
    (e) => e.termine || e.statut === 'termine'
  ).length;
  const progression =
    etapes.length > 0
      ? Math.round((etapesTerminees / etapes.length) * 100)
      : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted">Chargement du chantier…</p>
        </div>
      </div>
    );
  }

  if (isError || !chantier) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-8 text-center">
        <span className="material-symbols-outlined text-4xl text-danger">error</span>
        <p className="mt-2 text-danger font-medium">
          Impossible de charger ce chantier.
        </p>
        <button
          onClick={() => navigate('/chantiers')}
          className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm"
        >
          Retour aux chantiers
        </button>
      </div>
    );
  }

  const statutColor =
    STATUT_COLORS[chantier.statut] || 'bg-slate-100 text-slate-700';

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/chantiers')}
          className="mt-1 flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Chantiers
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 truncate">
              {chantier.titre}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statutColor}`}
            >
              {chantier.statut?.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-muted mt-1">{chantier.ville}</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Informations
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-muted mb-1">Client</p>
            <p className="font-semibold text-slate-900">
              {chantier.client?.nom_entreprise || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Chef de chantier</p>
            <p className="font-semibold text-slate-900">
              {chantier.chef?.name || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Ville</p>
            <p className="font-semibold text-slate-900">{chantier.ville}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Début</p>
            <p className="font-semibold text-slate-900">
              {formatDate(chantier.date_debut)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Fin prévue</p>
            <p className="font-semibold text-slate-900">
              {formatDate(chantier.date_fin_prevue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Budget</p>
            <p className="font-semibold text-primary">
              {formatCurrency(chantier.budget)}
            </p>
          </div>
        </div>
        {chantier.description && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted mb-1">Description</p>
            <p className="text-sm text-slate-700">{chantier.description}</p>
          </div>
        )}
      </div>

      {/* Progression Étapes */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Étapes
          </h2>
          <span className="text-sm font-bold text-primary">{progression}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progression}%` }}
          />
        </div>
        {etapes.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">
            Aucune étape définie.
          </p>
        ) : (
          <ul className="space-y-2">
            {etapes.map((etape, i) => {
              const done = etape.termine || etape.statut === 'termine';
              return (
                <li
                  key={etape.id ?? i}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-bg transition-colors"
                >
                  <span
                    className={`material-symbols-outlined text-xl ${
                      done ? 'text-success' : 'text-slate-300'
                    }`}
                  >
                    {done ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span
                    className={`text-sm ${
                      done ? 'line-through text-muted' : 'text-slate-800'
                    }`}
                  >
                    {etape.titre || etape.label || etape.nom || `Étape ${i + 1}`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Équipe */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Équipe ({equipe.length})
        </h2>
        {equipe.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">
            Aucun membre assigné.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {equipe.map((membre, i) => {
              const u = membre.user || membre;
              const name = u.name || u.nom || 'Inconnu';
              const role = u.role || membre.role || '';
              return (
                <div
                  key={membre.id ?? i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-bg border border-border"
                >
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{name}</p>
                    <p className="text-xs text-muted capitalize">
                      {role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rapports journaliers */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Rapports journaliers ({rapports.length})
        </h2>
        {rapports.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">
            Aucun rapport pour ce chantier.
          </p>
        ) : (
          <ul className="space-y-3">
            {rapports.map((r, i) => (
              <li
                key={r.id ?? i}
                className="flex gap-4 p-4 rounded-xl border border-border hover:bg-surface-bg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">
                    assignment
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800">
                      {r.user?.name || 'Anonyme'}
                    </p>
                    <span className="text-xs text-muted">
                      {formatDate(r.date || r.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                    {r.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
