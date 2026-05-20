import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <span className="material-symbols-outlined text-6xl text-muted">search_off</span>
      <h1 className="text-2xl font-bold text-gray-800">Page introuvable</h1>
      <Link to="/dashboard" className="text-primary text-sm underline">
        Retour au tableau de bord
      </Link>
    </div>
  );
}
