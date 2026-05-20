import { createBrowserRouter, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ClientsPage from '../pages/clients/ClientsPage';
import ChantiersPage from '../pages/chantiers/ChantiersPage';
import ChantierDetailPage from '../pages/chantiers/ChantierDetailPage';
import FacturesPage from '../pages/factures/FacturesPage';
import TerrainPage from '../pages/terrain/TerrainPage';
import PersonnelPage from '../pages/personnel/PersonnelPage';
import NotFound from '../pages/NotFound';

function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return !token ? children : <Navigate to="/dashboard" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <GuestRoute><Login /></GuestRoute>,
  },
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard',     element: <Dashboard /> },
      { path: 'clients',       element: <ClientsPage /> },
      { path: 'chantiers',     element: <ChantiersPage /> },
      { path: 'chantiers/:id', element: <ChantierDetailPage /> },
      { path: 'factures',      element: <FacturesPage /> },
      { path: 'terrain',       element: <TerrainPage /> },
      { path: 'personnel',     element: <PersonnelPage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
