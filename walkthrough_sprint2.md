# TravaPro — Instructions Agent Sprint 2

> **Donne ce fichier à ton agent en début de session. Il contient tout le contexte nécessaire.**

---

## 📦 Stack & conventions

| Couche | Techno |
|---|---|
| Backend | Laravel 12 + Sanctum (Bearer Token) |
| Frontend | React 18 + Vite + TailwindCSS + Zustand + TanStack Query v4 |
| Auth | `useAuthStore` → `{ user, token, logout }` |
| API | `src/lib/axios.js` — instance avec interceptor Bearer — base `/api/v1/` |
| Routing | `createBrowserRouter` dans `src/router/index.jsx` — AppLayout (Sidebar + BottomNav + TopBar) |
| Couleurs | `primary:#0038af` `surface-bg:#f7f9fb` `muted:#64748B` `border:#E2E8F0` `success:#10B981` `danger:#EF4444` |
| Icons | Material Symbols Outlined (CDN déjà chargé) — ex: `<span className="material-symbols-outlined">construction</span>` |
| Currency | `Intl.NumberFormat('fr-FR', { style:'currency', currency:'MAD' })` |

## ✅ État Sprint 1 (déjà en place)

- Auth : `AuthController` login/logout/me, Sanctum opérationnel
- Backend CRUD : `ChantierController`, `ClientController` + FormRequests + Resources
- Frontend pages : `Login`, `Dashboard`, `ChantiersPage` (liste + CRUD modale), `ClientsPage` (stub)
- Layout : `AppLayout` → `Sidebar` (desktop) + `BottomNav` (mobile) + `TopBar`
- Hooks : `useChantiers`, `useClients`, `useDashboard`
- Zustand : `authStore` avec persist
- Modèles DB existants : `Facture`, `FactureLigne`, `Paiement`, `Pointage`, `User` (role: admin/chef_chantier/technicien), `ChantierEquipe`

---

## 🎯 Sprint 2 — 5 tâches ordonnées par dépendance

---

### TÂCHE 1 — Page Détail Chantier (screen_4)
**Route :** `/chantiers/:id`
**Fichier :** `frontend/src/pages/chantiers/ChantierDetailPage.jsx`

**Ajouter dans `router/index.jsx` :**
```js
import ChantierDetailPage from '../pages/chantiers/ChantierDetailPage';
// dans children de AppLayout :
{ path: 'chantiers/:id', element: <ChantierDetailPage /> }
```

**Sections de la page (layout mobile-first, colonne) :**

1. **Header** — bouton retour `← Chantiers`, titre du chantier, badge statut coloré
2. **Carte info** — client, chef, ville, dates (début / fin prévue), budget formaté MAD
3. **Progression étapes** — `GET /api/v1/chantiers/:id/etapes` — liste avec checkbox + label; progression bar `(étapes terminées / total) * 100%`
4. **Équipe** — `GET /api/v1/chantiers/:id/equipe` — avatars circulaires + nom + rôle
5. **Rapports journaliers** (lecture seule pour chef) — `GET /api/v1/chantiers/:id/rapports` — date + auteur + description courte

**Hook à créer** `src/hooks/useChantierDetail.js` :
```js
// useQuery(['chantier', id], () => api.get(`/chantiers/${id}`).then(r => r.data.data))
// useQuery(['chantier-etapes', id], ...)
// useQuery(['chantier-equipe', id], ...)
```

**Backend — ajouter dans `api.php` :**
```php
Route::get('chantiers/{chantier}/etapes', [ChantierController::class, 'etapes']);
Route::get('chantiers/{chantier}/equipe', [ChantierController::class, 'equipe']);
```
**Ajouter dans `ChantierController.php` :**
```php
public function etapes(Chantier $chantier) {
    return response()->json(['data' => $chantier->etapes()->orderBy('ordre')->get()]);
}
public function equipe(Chantier $chantier) {
    return response()->json(['data' => $chantier->equipe()->with('user')->get()]);
}
```

**Dans `ChantiersPage.jsx` — rendre les cartes cliquables :**
```js
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
// onClick de la carte → navigate(`/chantiers/${chantier.id}`)
```

---

### TÂCHE 2 — Facturation desktop (screen_5)
**Route :** `/factures`
**Fichier :** `frontend/src/pages/factures/FacturesPage.jsx`

**Backend — créer `FactureController.php` :**
```
app/Http/Controllers/Api/V1/FactureController.php
```
```php
// index : Facture::with(['chantier','client'])->withSum('paiements','montant')->paginate(15)
// show  : charge aussi factureLignes + paiements
// store/update/destroy : standard
```

**Ajouter dans `api.php` :**
```php
use App\Http\Controllers\Api\V1\FactureController;
Route::apiResource('factures', FactureController::class);
Route::post('factures/{facture}/paiements', [FactureController::class, 'addPaiement']);
```

**UI desktop — 2 colonnes (md:grid-cols-[1fr_380px]) :**

Colonne gauche — liste factures :
- Filtres : statut (brouillon/envoyée/payée/partiellement_payée/en_retard), search
- Tableau : N° facture | Client | Chantier | Montant TTC | Payé | Reste | Statut badge | Actions

Colonne droite — panneau détail (slide-in) :
- Lignes facture (description, qté, PU, total)
- Historique paiements
- Bouton "+ Ajouter paiement" (modal simple : montant + date + mode)
- Statut calculé automatiquement : `reste = montant_ttc - sum(paiements)`

**Hook :** `src/hooks/useFactures.js` — même pattern que `useChantiers.js`

**Ajouter dans `Sidebar.jsx` :** l'item `/factures` est déjà présent → juste s'assurer que la route existe.

---

### TÂCHE 3 — Vue terrain technicien (screen_6)
**Route :** `/terrain`
**Fichier :** `frontend/src/pages/terrain/TerrainPage.jsx`
**Accès :** visible uniquement si `user.role === 'technicien'`

**Concept :** vue mobile simplifiée pour le technicien sur le chantier.

**Sections :**

1. **Mes chantiers du jour** — `GET /api/v1/chantiers?assignee=me` — cards compactes
2. **Pointage rapide** — bouton "Pointer arrivée / départ" → `POST /api/v1/pointages`
   - Payload : `{ chantier_id, type: 'arrivee'|'depart', latitude?, longitude? }`
3. **Rapport journalier** — formulaire compact :
   - Chantier (select), description (textarea), photos (input file, optionnel)
   - `POST /api/v1/rapports`
4. **Stock / matériaux utilisés** — liste simple + bouton "+Déclarer consommation"

**Backend — `PointageController.php` :**
```php
// store : Pointage::create([user_id => auth()->id(), ...validated])
// index : Pointage::where('user_id', auth()->id())->today()->get()
```

**Backend — `RapportController.php` :**
```php
// store : RapportJournalier::create([...validated, user_id => auth()->id()])
```

**Ajouter dans `api.php` :**
```php
Route::apiResource('pointages', PointageController::class)->only(['index','store']);
Route::apiResource('rapports', RapportController::class)->only(['index','store','show']);
```

**Dans `BottomNav.jsx` — ajouter conditionnel :**
```js
import useAuthStore from '../../store/authStore';
const { user } = useAuthStore();
// Afficher l'item terrain seulement si user.role === 'technicien'
{ to: '/terrain', icon: 'location_on', label: 'Terrain' }
```

---

### TÂCHE 4 — Gestion du personnel (screen_7)
**Route :** `/personnel`
**Fichier :** `frontend/src/pages/personnel/PersonnelPage.jsx`
**Accès :** `admin` + `chef_chantier` uniquement

**Backend — `PersonnelController.php` :**
```php
// index : User::where('role','!=','admin')->withCount('pointages')->paginate(20)
// store : User::create([...validated, password => Hash::make('TravaPro2024!')])
// update : mise à jour nom/email/role/actif
// destroy : SoftDelete
```

**Ajouter dans `api.php` :**
```php
use App\Http\Controllers\Api\V1\PersonnelController;
Route::apiResource('personnel', PersonnelController::class);
```

**UI — layout tableau desktop / cards mobile :**

Header : titre "Équipe" + bouton "+ Nouveau membre" (ouvre modale)

Tableau colonnes : Avatar | Nom | Email | Rôle badge | Chantiers actifs | Dernière activité | Actions

Modale création/édition :
```
Nom complet (text)
Email (email)
Rôle (select: chef_chantier / technicien)
[Créer] → POST /api/v1/personnel
```

Badges rôle :
- `admin` → bg-purple-100 text-purple-700
- `chef_chantier` → bg-primary/10 text-primary
- `technicien` → bg-green-100 text-green-700

**Guard frontend :**
```js
// Dans PersonnelPage.jsx
const { user } = useAuthStore();
if (!['admin','chef_chantier'].includes(user?.role)) return <Navigate to="/dashboard" />;
```

---

### TÂCHE 5 — Fil rouge : navigation & guards (nettoyage)

**`router/index.jsx` — état final attendu :**
```js
children: [
  { index: true, element: <Navigate to="/dashboard" replace /> },
  { path: 'dashboard',       element: <Dashboard /> },
  { path: 'clients',         element: <ClientsPage /> },
  { path: 'chantiers',       element: <ChantiersPage /> },
  { path: 'chantiers/:id',   element: <ChantierDetailPage /> },
  { path: 'factures',        element: <FacturesPage /> },
  { path: 'terrain',         element: <TerrainPage /> },
  { path: 'personnel',       element: <PersonnelPage /> },
]
```

**`App.jsx` — remplacer par le router :**
> App.jsx utilise encore `<Routes>` inline. Le router `createBrowserRouter` est dans `router/index.jsx` mais `main.jsx` doit utiliser `<RouterProvider router={router} />`. Vérifier que `main.jsx` ressemble à :
```js
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
ReactDOM.createRoot(...).render(<QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider>);
```

**`Sidebar.jsx` — corriger les classes manquantes :**
- `bg-primary-light` → remplacer par `bg-primary/10`
- `hover:bg-background` → remplacer par `hover:bg-surface-bg`
- `bg-background` → remplacer par `bg-surface-bg`
- `hover:bg-danger-light` → remplacer par `hover:bg-danger/10`

---

## 🔄 Pattern à respecter pour tout nouveau hook

```js
// src/hooks/useXxx.js
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export function useXxx(params = {}) {
  return useQuery(
    ['xxx', params],
    () => api.get('/xxx', { params }).then(r => r.data),
    { staleTime: 30_000 }
  );
}
```

## 🔄 Pattern modale CRUD (déjà utilisé dans ChantiersPage)

```jsx
const [isOpen, setIsOpen] = useState(false);
// Modale : fixed inset-0 bg-black/50 z-50 flex items-center justify-center
// Panel  : bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl
// Boutons: [Annuler (outline)] [Enregistrer (bg-primary text-white)]
```

---

## 📋 Checklist de fin de Sprint 2

- [ ] `/chantiers/:id` — détail avec étapes + équipe
- [ ] `/factures` — liste + détail + paiement
- [ ] `/terrain` — pointage + rapport (role technicien)
- [ ] `/personnel` — CRUD membres (role admin/chef)
- [ ] App.jsx / main.jsx alignés sur RouterProvider
- [ ] Sidebar classes Tailwind corrigées
- [ ] Toutes les nouvelles routes ajoutées dans `api.php`
- [ ] `walkthrough_sprint2_done.md` généré en fin de session

---

## 🚀 Prochain sprint (Sprint 3 — aperçu)

- Devis (création, PDF, envoi client)
- Stock & mouvements
- Notifications temps réel (Pusher ou polling)
- Dark mode (toggle déjà prévu dans TopBar)
