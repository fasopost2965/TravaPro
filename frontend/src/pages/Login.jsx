import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import useAuthStore from "../store/authStore";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "chef_chantier", label: "Chef de chantier" },
  { value: "technicien", label: "Technicien" },
];

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [role, setRole] = useState("chef_chantier");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password, role });
      setAuth(data.data.user, data.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4"
      style={{ backgroundImage: "radial-gradient(#E2E8F0 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md rounded-5xl shadow-2xl border border-white/50 p-8 flex flex-col gap-6">

        {/* Lang switcher */}
        <div className="flex justify-end">
          <div className="flex rounded-full border border-outline-variant text-xs overflow-hidden">
            <button className="px-3 py-1 bg-primary text-on-primary font-semibold">🇫🇷 FR</button>
            <button className="px-3 py-1 text-on-surface-variant">🇲🇦 AR</button>
          </div>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center rotate-3 shadow-lg">
            <span className="material-symbols-outlined text-on-primary text-3xl">foundation</span>
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">TravaPro</h1>
          <p className="text-sm text-muted">Gerez vos chantiers, ou que vous soyez.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Role selector */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Role</label>
            <div className="flex gap-2">
              {ROLES.map((r) => (
                <button type="button" key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`flex-1 py-2 rounded-full text-xs font-semibold border-2 transition-all ${
                    role === r.value
                      ? "border-primary bg-primary-fixed text-on-primary-fixed"
                      : "border-outline-variant bg-surface text-on-surface-variant"
                  }`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Email professionnel</label>
            <div className="flex items-center border border-outline-variant rounded-xl px-3 gap-2 bg-surface focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-muted text-lg">mail</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.ma" required
                className="flex-1 py-3 text-sm bg-transparent outline-none text-on-surface placeholder:text-muted" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-on-surface">Mot de passe</label>
              <button type="button" className="text-xs text-primary">Oublie ?</button>
            </div>
            <div className="flex items-center border border-outline-variant rounded-xl px-3 gap-2 bg-surface focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-muted text-lg">lock</span>
              <input type={showPassword ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="flex-1 py-3 text-sm bg-transparent outline-none text-on-surface placeholder:text-muted" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                <span className="material-symbols-outlined text-muted text-lg">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-xs text-danger text-center">{error}</p>}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60">
            {loading ? "Connexion..." : "Se connecter"}
            {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
          </button>
        </form>

        {/* Footer */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-muted text-center">Pas encore de compte ? <span className="text-primary">Contacter l'administrateur</span></p>
          <div className="flex gap-2">
            <span className="text-[10px] border border-outline-variant rounded px-2 py-0.5 text-muted">ICE COMPLIANT</span>
            <span className="text-[10px] border border-outline-variant rounded px-2 py-0.5 text-muted">MAROC PME</span>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-6 h-1.5 rounded-full ${i % 2 === 0 ? "bg-primary" : "bg-yellow-400"}`} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
