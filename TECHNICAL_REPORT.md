# Rapport technique TravaPro

## Contexte
Ce rapport résume l'état actuel du projet TravaPro après les travaux réalisés pour les Sprints 1 et 2. Il explique les composants ajoutés, les flux principaux et les éléments à reprendre pour continuer le développement.

---

## Sprint 1 : Backend auth + Clients + frontend React

### Backend
- Réalisé avec Laravel 11 et Sanctum.
- Ajout de l'authentification API :
  - `backend/app/Http/Controllers/Api/V1/Auth/AuthController.php`
  - `backend/app/Http/Requests/Auth/LoginRequest.php`
  - `backend/app/Http/Resources/UserResource.php`
- CRUD Clients :
  - `backend/app/Http/Controllers/Api/V1/ClientController.php`
  - `backend/app/Http/Requests/Client/StoreClientRequest.php`
  - `backend/app/Http/Requests/Client/UpdateClientRequest.php`
  - `backend/app/Http/Resources/ClientResource.php`
- Routes API :
  - `backend/routes/api.php`
  - routes protégées `auth:sanctum`
- Seeders et données de test :
  - `backend/database/seeders/UserSeeder.php`
  - `backend/database/seeders/ClientSeeder.php`
  - `backend/database/seeders/StockCategorieSeeder.php`
  - `backend/database/seeders/StockSeeder.php`
  - `backend/database/seeders/ChantierSeeder.php`
- Migrations corrigées selon les besoins du modèle de données.

### Frontend
- Configuration React + Vite + React Router + React Query.
- Auth flow et stockage du token :
  - `frontend/src/store/authStore.js`
  - `frontend/src/lib/axios.js`
- Routes et protection :
  - `frontend/src/router/index.jsx`
- Layout de l'application :
  - `frontend/src/components/layout/AppLayout.jsx`
  - `frontend/src/components/layout/Sidebar.jsx`
  - `frontend/src/components/layout/TopBar.jsx`
  - `frontend/src/components/layout/BottomNav.jsx`
- Pages :
  - `frontend/src/pages/Login.jsx`
  - `frontend/src/pages/Dashboard.jsx`
  - `frontend/src/pages/clients/ClientsPage.jsx`
  - `frontend/src/pages/NotFound.jsx`
- Mise en place d'une page `Dashboard` en style final et d'une page `Login` opérationnelle.
- Build Vite validée avec succès.

---

## Sprint 2 : CRUD Chantiers

### Backend
- Ajout du CRUD chantiers :
  - `backend/app/Http/Controllers/Api/V1/ChantierController.php`
  - `backend/app/Http/Resources/ChantierResource.php`
  - `backend/app/Http/Requests/Chantier/StoreChantierRequest.php`
  - `backend/app/Http/Requests/Chantier/UpdateChantierRequest.php`
- Route API :
  - `backend/routes/api.php`
  - ajout de `Route::apiResource('chantiers', ChantierController::class);`
- Gestion des relations :
  - `backend/app/Models/Chantier.php`
  - `backend/app/Models/ChantierEquipe.php`
  - `backend/app/Models/ChantierEtape.php`
- Seeders existants contiennent déjà des chantiers de test.

### Frontend
- Ajout du module Chantiers :
  - `frontend/src/pages/chantiers/ChantiersPage.jsx`
  - `frontend/src/hooks/useChantiers.js`
  - `frontend/src/hooks/useClients.js`
- Ajout de la route React :
  - `frontend/src/router/index.jsx`
  - lien `'/chantiers'`
- Intégration dans la navigation existante :
  - `frontend/src/components/layout/Sidebar.jsx`
  - `frontend/src/components/layout/BottomNav.jsx`
- Fonctionnalités mises en place :
  - liste paginée des chantiers
  - filtrage par recherche et statut
  - création / modification / suppression de chantier
  - sélection du client depuis le formulaire
  - tableau récapitulatif des chantiers
- Build Vite validée avec succès.

---

## Structure actuelle utile

### Backend
- `backend/routes/api.php` : point d'entrée des APIs.
- `backend/app/Http/Controllers/Api/V1/` : contrôleurs API.
- `backend/app/Http/Requests/` : validation des requêtes.
- `backend/app/Http/Resources/` : transformation des réponses JSON.
- `backend/app/Models/` : modèles Eloquent.

### Frontend
- `frontend/src/router/` : configuration des routes.
- `frontend/src/pages/` : pages de l'application.
- `frontend/src/components/layout/` : composants de layout réutilisables.
- `frontend/src/hooks/` : hooks React Query.
- `frontend/src/lib/axios.js` : client API Axios.
- `frontend/src/store/authStore.js` : état d'authentification.

---

## Points d’attention pour la suite

1. **Backend PHP / environnement :**
   - Le projet nécessite PHP >= 8.2.
   - Le serveur local actuel utilisé pour tester ne disposait que de PHP 7.4.
2. **API chantiers :**
   - Vérifier la pagination, le tri et le filtre sur backend si besoin.
   - Ajouter éventuellement `show` plus détaillé / relations d'étapes et équipe.
3. **Frontend clients/chantier :**
   - Compléter la page `ClientsPage.jsx` pour un vrai CRUD client.
   - Ajouter un formulaire d’édition de chantier avec plus de champs (géolocalisation, état, budget consommé, dates réelles).
4. **Tests :**
   - Ajouter des tests PHPUnit backend pour les contrôleurs et validations.
   - Ajouter des tests unitaires / composants React si possible.
5. **Sécurité :**
   - Valider les permissions si tous les utilisateurs peuvent modifier tous les chantiers.
   - Prévoir des rôles et contrôles d’accès plus fins.

---

## Comment continuer

1. Lancer `composer install` puis `php artisan migrate:fresh --seed` avec PHP 8.2.
2. Lancer `npm install` puis `npm run dev` dans `frontend/`.
3. Se connecter via la page `/login` avec un utilisateur seedé.
4. Aller sur `/chantiers` et tester la création, modification et suppression.
5. Compléter le module clients et lier les chantiers aux clients correctement.

---

## Remarques

- Le frontend est déjà opérationnel en mode développement.
- Le serveur backend n'a pas pu être exécuté dans l'environnement de test actuel à cause de la version PHP.
- Le code a été poussé sur GitHub dans `main`.
