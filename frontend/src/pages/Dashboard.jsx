import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import useAuthStore from "../store/authStore";

const navItems = [
  { icon: "home", label: "Accueil", active: true },
  { icon: "foundation", label: "Chantiers" },
  { icon: "payments", label: "Finance" },
  { icon: "groups", label: "Équipe" },
  { icon: "more_horiz", label: "Plus" },
];

function getStatutColor(statut) {
  switch (statut) {
    case 'en_cours':
      return 'bg-success/95';
    case 'preparation':
      return 'bg-[#fea619]';
    case 'planifie':
      return 'bg-[#0038af]';
    case 'suspendu':
      return 'bg-secondary-container text-on-secondary-container';
    case 'termine':
      return 'bg-success';
    default:
      return 'bg-slate-500/90';
  }
}

function formatStatutLabel(statut) {
  return statut.replace('_', ' ').toUpperCase();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { data, isLoading, isError } = useDashboard();

  const chantiersActifs = data?.kpis?.chantiers_actifs ?? 0;
  const clientsActifs = data?.kpis?.clients_actifs ?? 0;
  const devisEnAttente = data?.kpis?.devis_en_attente ?? 0;
  const devisAttenteMontant = data?.kpis?.devis_attente_montant ?? 0;
  const caEstime = data?.kpis?.ca_estime ?? 0;

  const dashboardKpis = [
    { 
      icon: "foundation", 
      label: "Chantiers actifs", 
      value: isLoading ? "..." : chantiersActifs, 
      sub: "+2 ce mois", 
      subColor: "text-success", 
      bg: "bg-primary-fixed", 
      iconColor: "text-on-primary-fixed" 
    },
    { 
      icon: "groups", 
      label: "Clients actifs", 
      value: isLoading ? "..." : clientsActifs, 
      sub: "Gestion CRM", 
      subColor: "text-primary", 
      bg: "bg-secondary-fixed", 
      iconColor: "text-on-secondary-fixed" 
    },
    { 
      icon: "description", 
      label: "Devis en attente", 
      value: isLoading ? "..." : devisEnAttente, 
      sub: isLoading ? "..." : `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(devisAttenteMontant / 1000)}k MAD`, 
      subColor: "text-[#1B4FD8]", 
      bg: "bg-[#eef2ff]", 
      iconColor: "text-primary" 
    },
    { 
      icon: "payments", 
      label: "CA estimé", 
      value: isLoading ? "..." : `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(caEstime / 1000)}k MAD`, 
      sub: "Prévisionnelle", 
      subColor: "text-primary-fixed opacity-80", 
      bg: "bg-primary-container", 
      iconColor: "text-white", 
      dark: true 
    },
  ];

  const chantiersList = data?.chantiers_recents ?? [];
  const activitesList = data?.activites_recentes ?? [];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#f7f9fb]">

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 bg-[#f2f4f6] border-r border-outline-variant p-4 space-y-2 sticky top-0">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white">foundation</span>
          </div>
          <div>
            <h1 className="font-black text-primary text-lg leading-tight">TravaPro</h1>
            <p className="text-xs text-on-surface-variant opacity-70">Construction Management</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            { icon: "home", label: "Accueil", active: true },
            { icon: "foundation", label: "Chantiers" },
            { icon: "payments", label: "Finance" },
            { icon: "groups", label: "Équipe" },
            { icon: "settings", label: "Paramètres" },
          ].map((item) => (
            <a key={item.label} href="#"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                item.active ? "bg-primary-container text-white" : "text-on-surface-variant hover:bg-[#e0e3e5]"
              }`}>
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <button className="w-full py-2 bg-primary text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-base">add</span>
            Nouveau Projet
          </button>
          <div className="pt-2 border-t border-outline-variant">
            <button onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 w-full text-on-surface-variant hover:bg-[#e0e3e5] rounded-lg text-sm transition-all">
              <span className="material-symbols-outlined text-xl">logout</span>
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">

        {/* Topbar */}
        <header className="sticky top-0 z-40 flex justify-between items-center px-4 md:px-6 h-16 bg-white shadow-sm">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input className="pl-10 pr-4 py-2 bg-[#f2f4f6] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64" placeholder="Rechercher..." />
          </div>
          <h2 className="font-bold text-primary text-lg lg:hidden">TravaPro</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-[#e6e8ea] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0] ?? "A"}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 space-y-6 max-w-[1440px] mx-auto w-full pb-24 md:pb-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Tableau de bord</h1>
              <p className="text-sm text-muted">Bonjour {user?.name}, voici un résumé de vos chantiers aujourd'hui.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold hover:bg-[#f2f4f6] transition-colors">Exporter Rapport</button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-shadow">Actualiser</button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardKpis.map((k) => (
              <div key={k.label} className={`p-6 rounded-xl shadow-sm border transition-all hover:shadow-md ${k.dark ? "bg-primary border-primary text-white" : "bg-white border-outline-variant hover:border-primary text-on-surface"}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`p-2 rounded-lg material-symbols-outlined ${k.bg} ${k.iconColor}`}>{k.icon}</span>
                  <span className={`text-xs font-semibold ${k.subColor}`}>{k.sub}</span>
                </div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${k.dark ? "text-primary-fixed/80" : "text-muted"}`}>{k.label}</p>
                <p className={`text-2xl font-bold mt-1 ${k.dark ? "text-white" : "text-[#0F172A]"}`}>{k.value}</p>
              </div>
            ))}
          </div>

          {/* Chantiers en cours & Activités récentes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Chantiers */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0F172A]">Chantiers en cours</h3>
                <a href="#" className="text-primary text-xs font-semibold hover:underline">Tout voir</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                  <div className="col-span-2 text-center py-8 text-sm text-muted">Chargement des chantiers récents...</div>
                ) : chantiersList.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-sm text-muted">Aucun chantier récent.</div>
                ) : (
                  chantiersList.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="h-32 bg-[#eceef0] relative">
                        <img src={c.img} className="w-full h-full object-cover" alt={c.nom} />
                        <div className={`absolute top-2 right-2 px-2 py-0.5 text-white rounded-full text-[10px] font-semibold ${getStatutColor(c.statut)}`}>
                          {formatStatutLabel(c.statut)}
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-sm text-[#0F172A]">{c.nom}</h4>
                          <p className="text-xs text-muted">{c.lieu}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold">
                            <span>Progression</span>
                            <span className="text-primary">{c.progression}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden">
                            <div style={{ width: `${c.progression}%` }} className="h-full bg-primary rounded-full" />
                          </div>
                        </div>
                        <div className="pt-2 flex items-center justify-between border-t border-outline-variant text-[10px] text-muted">
                          <span>Client: {c.client}</span>
                          <span>Échéance: {c.echeance}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activités */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#0F172A]">Activités récentes</h3>
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-4 flex flex-col gap-4">
                {isLoading ? (
                  <div className="text-center py-8 text-sm text-muted">Chargement des activités...</div>
                ) : activitesList.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted">Aucune activité récente.</div>
                ) : (
                  activitesList.map((a, idx) => (
                    <div key={idx} className="flex gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full ${a.iconBg} ${a.iconColor} flex items-center justify-center z-10`}>
                          <span className="material-symbols-outlined text-sm">{a.icon}</span>
                        </div>
                        {idx < activitesList.length - 1 && <div className="w-0.5 h-full bg-[#E2E8F0] absolute top-8" />}
                      </div>
                      <div>
                        <p className={`text-[10px] font-semibold ${a.dateColor}`}>{a.date}</p>
                        <p className="text-xs font-bold text-[#0F172A]">{a.titre}</p>
                        <p className="text-xs text-muted">{a.detail}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <footer className="mt-auto p-4 text-center border-t border-outline-variant bg-white text-xs text-muted">
          <p>© 2024 TravaPro Construction Management. Tous droits réservés.</p>
        </footer>

      </main>

      {/* Bottom navbar mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-2 md:hidden bg-white border-t border-outline-variant shadow-lg rounded-t-xl">
        {navItems.map((item) => (
          <a key={item.label} href="#" className={`flex flex-col items-center justify-center text-xs transition-all ${item.active ? "text-primary font-bold" : "text-on-surface-variant"}`}>
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

    </div>
  );
}
