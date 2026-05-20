# TravaPro — État du projet fin Sprint 2

## ✅ Sprint 1 (acquis)
- Auth Sanctum : login / logout / me — Bearer Token opérationnel
- User.php : HasApiTokens, SoftDeletes, roles (admin / chef_chantier / technicien)
- tailwind.config.js : palette brand complète
- Axios instance + interceptor Bearer
- Zustand authStore avec persist
- Page Login + Dashboard (route privée)
- AppLayout : Sidebar desktop + BottomNav mobile + TopBar
- Backend CRUD : ChantierController, ClientController + FormRequests + Resources

## ✅ Sprint 2 (accompli)

### Backend
- `ChantierController` — méthodes `etapes()` et `equipe()` ajoutées
- `FactureController` — index, show, store, update, destroy, addPaiement
- `PointageController` — index, store (avec user_id auto)
- `RapportController` — index, store, show
- `PersonnelController` — index, store, update, destroy (SoftDelete)
- `api.php` — toutes les routes Sprint 2 enregistrées sous `auth:sanctum`

### Frontend — pages
- `/chantiers/:id` → `ChantierDetailPage.jsx` (header + infos + étapes + équipe + rapports)
- `/factures` → `FacturesPage.jsx` (2 colonnes : liste filtrée + panneau détail + paiements)
- `/terrain` → `TerrainPage.jsx` (pointage arrivée/départ + rapport journalier — role technicien)
- `/personnel` → `PersonnelPage.jsx` (tableau/cards + modale CRUD — role admin/chef_chantier)

### Frontend — hooks
- `useChantierDetail.js` — chantier, étapes, équipe
- `useFactures.js` — liste paginée + filtres
- Hook inline pour pointages et rapports (dans TerrainPage)
- Hook inline pour personnel (dans PersonnelPage)

### Frontend — routing & layout
- `router/index.jsx` — toutes les routes Sprint 2 déclarées dans AppLayout children
- `ChantiersPage.jsx` — cartes cliquables → `navigate(/chantiers/:id)`
- `Sidebar.jsx` — classes Tailwind invalides corrigées (`bg-primary/10`, `bg-surface-bg`, `hover:bg-danger/10`)
- `BottomNav.jsx` — item `/terrain` conditionnel (visible si `user.role === 'technicien'`)
- `main.jsx` — RouterProvider déjà en place ✅

---

## 🔜 Sprint 3 — À faire

### Devis
- `DevisController` — index, show, store, update, destroy
- `DevisPage.jsx` (`/devis`) — liste + modale création avec lignes dynamiques
- Génération PDF côté backend (Laravel DomPDF) — `GET /api/v1/devis/:id/pdf`
- Conversion devis → facture — `POST /api/v1/devis/:id/convertir`

### Stock
- `StockController` — index, show + `StockMouvementController` — store (entrée/sortie)
- `StockPage.jsx` (`/stock`) — tableau articles + solde + historique mouvements
- Alerte stock bas (seuil configurable par article)

### Notifications
- `NotificationsController` — index (non lues), markAsRead
- Cloche dans TopBar avec badge compteur
- `NotificationsPanel.jsx` — panneau slide-in (polling 30s ou Pusher si dispo)

### Améliorations transverses
- `ClientsPage.jsx` — actuellement stub vide, à implémenter (liste + CRUD)
- Dark mode — toggle déjà prévu dans TopBar, brancher sur classe `dark` Tailwind
- Gestion erreurs globale — interceptor axios → toast sur 401/403/422/500
- Empty states — illustrations pour listes vides (chantiers, factures, stock)
- Responsive polish — vérifier TerrainPage et FacturesPage sur mobile 375px

---

## 🗂 Architecture fichiers fin Sprint 2

```
frontend/src/
├── components/layout/
│   ├── AppLayout.jsx
│   ├── Sidebar.jsx          ✅ classes corrigées
│   ├── BottomNav.jsx        ✅ terrain conditionnel
│   └── TopBar.jsx
├── hooks/
│   ├── useChantiers.js
│   ├── useChantierDetail.js ✅ nouveau
│   ├── useClients.js
│   ├── useDashboard.js
│   └── useFactures.js       ✅ nouveau
├── pages/
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   ├── chantiers/
│   │   ├── ChantiersPage.jsx      ✅ cartes cliquables
│   │   └── ChantierDetailPage.jsx ✅ nouveau
│   ├── clients/
│   │   └── ClientsPage.jsx        ⚠️  stub — Sprint 3
│   ├── factures/
│   │   └── FacturesPage.jsx       ✅ nouveau
│   ├── terrain/
│   │   └── TerrainPage.jsx        ✅ nouveau
│   └── personnel/
│       └── PersonnelPage.jsx      ✅ nouveau
├── router/index.jsx               ✅ routes complètes
├── store/authStore.js
└── lib/axios.js

backend/app/Http/Controllers/Api/V1/
├── Auth/AuthController.php
├── ChantierController.php   ✅ +etapes() +equipe()
├── ClientController.php
├── FactureController.php    ✅ nouveau
├── PersonnelController.php  ✅ nouveau
├── PointageController.php   ✅ nouveau
└── RapportController.php    ✅ nouveau
```

---

## 💡 Rappel conventions (pour le prochain agent)

| Sujet | Convention |
|---|---|
| Hook query | `useQuery(['key', params], () => api.get(...).then(r => r.data), { staleTime: 30_000 })` |
| Mutation | `useMutation(payload => api.post/put/delete(...), { onSuccess: () => queryClient.invalidateQueries([...]) })` |
| Modale | `fixed inset-0 bg-black/50 z-50` → panel `bg-white rounded-2xl p-6 max-w-lg mx-4` |
| Guard rôle | `if (!['admin'].includes(user?.role)) return <Navigate to="/dashboard" />` |
| Currency | `Intl.NumberFormat('fr-FR', { style:'currency', currency:'MAD', maximumFractionDigits:0 })` |
| Date FR | `new Date(val).toLocaleDateString('fr-FR')` |
| Statut badge | classe selon map : `{ planifie:'bg-slate-100 text-slate-600', en_cours:'bg-blue-100 text-blue-700', termine:'bg-green-100 text-green-700', suspendu:'bg-orange-100 text-orange-700' }` |
