import { useLocation } from 'react-router-dom';

const titles = {
  '/dashboard': 'Tableau de bord',
  '/clients': 'Clients',
  '/chantiers': 'Chantiers',
  '/devis': 'Devis',
  '/factures': 'Factures',
  '/personnel': 'Personnel',
  '/stock': 'Stock',
};

export default function TopBar() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? 'TravaPro';

  return (
    <header className="h-14 bg-white border-b border-border flex items-center px-4 md:px-6 shrink-0">
      <h1 className="text-base font-semibold text-gray-800">{title}</h1>
    </header>
  );
}
