import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Tableau de bord' },
  { to: '/clients', icon: 'groups', label: 'Clients' },
  { to: '/chantiers', icon: 'construction', label: 'Chantiers' },
  { to: '/devis', icon: 'description', label: 'Devis' },
  { to: '/factures', icon: 'receipt_long', label: 'Factures' },
  { to: '/personnel', icon: 'badge', label: 'Personnel' },
  { to: '/stock', icon: 'inventory_2', label: 'Stock' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-border shrink-0">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-xl">foundation</span>
        </div>
        <span className="text-xl font-black text-primary tracking-tight">TravaPro</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted hover:bg-surface-bg hover:text-primary'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-bg mb-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-muted capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/10 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
