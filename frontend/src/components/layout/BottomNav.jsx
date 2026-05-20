import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const baseItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Accueil' },
  { to: '/chantiers', icon: 'construction', label: 'Chantiers' },
  { to: '/clients',   icon: 'groups',       label: 'Clients' },
  { to: '/factures',  icon: 'receipt_long', label: 'Factures' },
  { to: '/personnel', icon: 'badge',        label: 'Équipe' },
];

const terrainItem = { to: '/terrain', icon: 'location_on', label: 'Terrain' };

export default function BottomNav() {
  const { user } = useAuthStore();
  const items = user?.role === 'technicien'
    ? [baseItems[0], terrainItem, baseItems[1], baseItems[2]]
    : baseItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex z-50">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
              isActive ? 'text-primary' : 'text-muted'
            }`
          }
        >
          <span className="material-symbols-outlined text-2xl">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
