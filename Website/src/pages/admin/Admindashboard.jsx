import { useState, useEffect, useMemo, useCallback } from "react";
import * as api from "../../services/api";
import ErrorBoundary from "../../components/ErrorBoundary";
import { ParticlesHero } from '../../components/backgrounds/MedParticles';
import {
  LayoutDashboard, Users, Stethoscope, Pill, Heart, Shield,
  Bell, Settings, LogOut, ChevronDown, Sun, Moon, Search,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  XCircle, Clock, Activity,
  Trash2, Plus, Download, RefreshCw,
  Lock, Unlock, UserCheck,
  FileText, MapPin,
  Check, X, Menu,
} from "lucide-react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const T = {
  light: {
    bg: "#F0F4F8", card: "#ffffff", nav: "#ffffff", sidebar: "#ffffff",
    border: "#E4EAF5", txt: "#0D1B2E", txt2: "#5A6E8A", txt3: "#9AACBE",
    blue: "#4A6FA5", blueLight: "#EEF3FB", green: "#2D8C6F", greenLight: "#EEF8F4",
    amber: "#E8A838", amberLight: "#FFF8EC", red: "#E05555", redLight: "#FFF0F0",
    purple: "#7B5EA7", purpleLight: "#F3EEFF",
  },
  dark: {
    bg: "#080D14", card: "#0F1824", nav: "#0F1824", sidebar: "#0A1220",
    border: "rgba(99,142,203,0.12)", txt: "#E8F0FA", txt2: "#7A9CC8", txt3: "#3A5070",
    blue: "#5A87C5", blueLight: "#111E30", green: "#3AAA80", greenLight: "#0F2820",
    amber: "#E8A838", amberLight: "#1E1500", red: "#E05555", redLight: "#1E0A0A",
    purple: "#9B7FD4", purpleLight: "#1A1030",
  },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const USERS_DATA = [
  { id: 1,  name: "Alex Johnson",      email: "alex@medsmart.dz",      role: "patient",    wilaya: "Alger",      status: "active",   joined: "2024-03-15", verified: true  },
  { id: 2,  name: "Dr. Sarah Smith",   email: "sarah@medsmart.dz",     role: "médecin",    wilaya: "Oran",       status: "active",   joined: "2024-01-08", verified: true  },
  { id: 3,  name: "Pharmacie El Shifa",email: "elshifa@medsmart.dz",   role: "pharmacien", wilaya: "Alger",      status: "active",   joined: "2024-02-20", verified: true  },
  { id: 4,  name: "Fatima Benali",     email: "fatima@medsmart.dz",    role: "garde-malade",wilaya:"Constantine", status: "pending",  joined: "2024-10-12", verified: false },
  { id: 5,  name: "Dr. Karim Benali",  email: "karim@medsmart.dz",     role: "médecin",    wilaya: "Blida",      status: "active",   joined: "2024-04-05", verified: true  },
  { id: 6,  name: "Samira Meziane",    email: "samira@medsmart.dz",    role: "patient",    wilaya: "Sétif",      status: "suspended",joined: "2024-05-18", verified: true  },
  { id: 7,  name: "Pharmacie Rahma",   email: "rahma@medsmart.dz",     role: "pharmacien", wilaya: "Annaba",     status: "pending",  joined: "2024-10-28", verified: false },
  { id: 8,  name: "Dr. Amira Boudali", email: "amira@medsmart.dz",     role: "médecin",    wilaya: "Alger",      status: "active",   joined: "2024-03-22", verified: true  },
  { id: 9,  name: "Omar Meziani",      email: "omar@medsmart.dz",      role: "patient",    wilaya: "Tlemcen",    status: "active",   joined: "2024-06-10", verified: true  },
  { id: 10, name: "Nadia Boumediene",  email: "nadia@medsmart.dz",     role: "garde-malade",wilaya:"Béjaïa",     status: "active",   joined: "2024-07-03", verified: true  },
];

const AUDIT_LOGS = [
  { id: 1,  action: "Compte médecin approuvé",     user: "Dr. Sarah Smith",   ip: "41.111.192.14",  time: "Il y a 2 min",   type: "success" },
  { id: 2,  action: "Tentative de connexion échouée",user:"Unknown",          ip: "197.200.82.55",  time: "Il y a 8 min",   type: "warning" },
  { id: 3,  action: "Ordonnance CNAS validée",     user: "Pharmacie El Shifa",ip: "41.111.204.88",  time: "Il y a 15 min",  type: "success" },
  { id: 4,  action: "Utilisateur suspendu",        user: "Admin System",      ip: "10.0.0.1",       time: "Il y a 32 min",  type: "danger"  },
  { id: 5,  action: "Mise à jour IA modèle v2.2",  user: "Admin System",      ip: "10.0.0.1",       time: "Il y a 1h",      type: "info"    },
  { id: 6,  action: "Export données CNAS",         user: "Admin System",      ip: "10.0.0.1",       time: "Il y a 2h",      type: "info"    },
  { id: 7,  action: "Nouvelle pharmacie inscrite", user: "Pharmacie Rahma",   ip: "41.111.220.31",  time: "Il y a 3h",      type: "success" },
  { id: 8,  action: "Alerte: CPU > 85%",           user: "System Monitor",    ip: "—",              time: "Il y a 4h",      type: "warning" },
];

const WILAYAS_DATA = [
  { name: "Alger",       users: 1248, growth: 14 },
  { name: "Oran",        users: 842,  growth: 9  },
  { name: "Constantine", users: 631,  growth: 11 },
  { name: "Blida",       users: 412,  growth: 7  },
  { name: "Sétif",       users: 388,  growth: 18 },
  { name: "Annaba",      users: 291,  growth: 5  },
  { name: "Tlemcen",     users: 234,  growth: 12 },
  { name: "Béjaïa",      users: 198,  growth: 16 },
];

const LOG_COLORS = {
  success: { color: "#2D8C6F", bg: "#EEF8F4", bgDk: "#0F2820", icon: CheckCircle },
  warning: { color: "#E8A838", bg: "#FFF8EC", bgDk: "#1E1500", icon: AlertTriangle },
  danger:  { color: "#E05555", bg: "#FFF0F0", bgDk: "#1E0A0A", icon: XCircle },
  info:    { color: "#4A6FA5", bg: "#EEF3FB", bgDk: "#111E30", icon: Activity },
};

const ROLE_META = {
  "patient":     { color: "#4A6FA5", bg: "#EEF3FB",  icon: Users },
  "médecin":     { color: "#2D8C6F", bg: "#EEF8F4",  icon: Stethoscope },
  "pharmacien":  { color: "#E8A838", bg: "#FFF8EC",  icon: Pill },
  "garde-malade":{ color: "#7B5EA7", bg: "#F3EEFF",  icon: Heart },
};

const STATUS_META = {
  active:    { label: "Actif",     color: "#2D8C6F", bg: "#2D8C6F18" },
  pending:   { label: "En attente",color: "#E8A838", bg: "#E8A83818" },
  suspended: { label: "Suspendu",  color: "#E05555", bg: "#E0555518" },
};

// ─── Shared Components ────────────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk }) {
  const c = dk ? T.dark : T.light;
  return (
    <div className={`rounded-2xl border ${className}`}
      style={{ background: c.card, borderColor: c.border, boxShadow: dk ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 4px rgba(74,111,165,0.06)", ...style }}>
      {children}
    </div>
  );
}

function Badge({ color, bg, children, className = "" }) {
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${className}`}
      style={{ color, background: bg }}>
      {children}
    </span>
  );
}

function KpiCard({ label, value, sub, icon: Icon, color, trend, trendLabel, dk }) {
  const c = dk ? T.dark : T.light;
  const up = trend >= 0;
  return (
    <Card dk={dk} style={{ padding: 20 }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: color + "18" }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
            style={{ background: up ? "#2D8C6F18" : "#E0555518", color: up ? "#2D8C6F" : "#E05555" }}>
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-black tracking-tight" style={{ color: c.txt }}>{value}</p>
      <p className="text-sm font-semibold mt-0.5" style={{ color: c.txt2 }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: c.txt3 }}>{sub}</p>}
      {trendLabel && <p className="text-xs mt-1 font-semibold" style={{ color: up ? "#2D8C6F" : "#E05555" }}>{trendLabel}</p>}
    </Card>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimCounter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val.toLocaleString()}{suffix}</>;
}


// ─── PAGE: OVERVIEW ───────────────────────────────────────────────────────────
function OverviewPage({ dk, onNav }) {
  const c = dk ? T.dark : T.light;

  const kpis = [
    { label: "Utilisateurs totaux",  value: <AnimCounter target={6482} />,  icon: Users,       color: c.blue,   trend: 14, trendLabel: "+821 ce mois" },
    { label: "Médecins vérifiés",    value: <AnimCounter target={342} />,   icon: Stethoscope, color: c.green,  trend: 8,  trendLabel: "+28 ce mois" },
    { label: "Pharmacies actives",   value: <AnimCounter target={148} />,   icon: Pill,        color: c.amber,  trend: 5,  trendLabel: "+8 ce mois" },
    { label: "Ordonnances CNAS",     value: <AnimCounter target={8841} />,  icon: Shield,      color: c.green,  trend: 12, trendLabel: "62% de couverture" },
  ];

  return (
    <>
      {/* Hero header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.green }}>Système opérationnel</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: c.txt }}>
            Centre de Contrôle <span style={{ color: c.blue }}>MedSmart</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: c.txt2 }}>
            Vue globale de la plateforme · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: c.border, color: c.txt2 }}>
            <Download size={14} /> Export rapport
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #304B71, #6492C9)", boxShadow: "0 4px 16px rgba(74,111,165,0.35)" }}>
            <RefreshCw size={14} /> Actualiser
          </button>
        </div>
      </div>

      {/* KPIs grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k, i) => <KpiCard key={i} {...k} dk={dk} />)}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">

        {/* Growth chart */}
        <Card dk={dk} style={{ padding: 20, gridColumn: "span 2" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold" style={{ color: c.txt }}>Croissance des inscriptions</h3>
              <p className="text-xs" style={{ color: c.txt2 }}>12 derniers mois · Tous rôles confondus</p>
            </div>
            <div className="flex gap-2">
              {["1S", "1M", "3M", "1A"].map((p, i) => (
                <button key={p} className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: i === 3 ? c.blue : "transparent", color: i === 3 ? "#fff" : c.txt3 }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-2 h-32 mb-2">
            {[38, 52, 45, 61, 58, 74, 69, 82, 77, 91, 86, 96].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t transition-all duration-500"
                  style={{ height: `${h}%`, background: i === 11 ? c.blue : (dk ? "rgba(74,111,165,0.3)" : "#D5E3F5") }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {["Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc","Jan","Fév","Mar"].map(m => (
              <span key={m} className="text-xs flex-1 text-center" style={{ color: c.txt3 }}>{m}</span>
            ))}
          </div>
        </Card>

        {/* Role distribution */}
        <Card dk={dk} style={{ padding: 20 }}>
          <h3 className="font-bold mb-4" style={{ color: c.txt }}>Répartition des rôles</h3>
          <div className="space-y-3">
            {[
              { role: "Patients",     count: 5248, pct: 81, ...ROLE_META["patient"] },
              { role: "Médecins",     count: 342,  pct: 5,  ...ROLE_META["médecin"] },
              { role: "Pharmaciens",  count: 148,  pct: 2,  ...ROLE_META["pharmacien"] },
              { role: "Garde-malades",count: 744,  pct: 12, ...ROLE_META["garde-malade"] },
            ].map(r => (
              <div key={r.role}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: r.bg }}>
                      <r.icon size={11} style={{ color: r.color }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: c.txt }}>{r.role}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: r.color }}>{r.count.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: c.blueLight }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
          {/* Donut visual */}
          <div className="mt-4 p-3 rounded-xl text-center" style={{ background: c.blueLight }}>
            <p className="text-2xl font-black" style={{ color: c.txt }}>6 482</p>
            <p className="text-xs" style={{ color: c.txt2 }}>utilisateurs totaux</p>
          </div>
        </Card>
      </div>

      {/* Wilaya map + recent users + audit */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Wilaya coverage */}
        <Card dk={dk} style={{ padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: c.txt }}>Couverture par wilaya</h3>
            <Badge color={c.blue} bg={c.blueLight}>48 / 58</Badge>
          </div>
          <div className="space-y-2">
            {WILAYAS_DATA.map(w => (
              <div key={w.name} className="flex items-center gap-3">
                <span className="text-xs font-medium w-24 shrink-0" style={{ color: c.txt2 }}>{w.name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: c.blueLight }}>
                  <div className="h-full rounded-full" style={{ width: `${(w.users / 1248) * 100}%`, background: c.blue }} />
                </div>
                <span className="text-xs font-bold w-12 text-right" style={{ color: c.txt }}>{w.users}</span>
                <span className="text-xs font-bold w-8 text-right" style={{ color: c.green }}>+{w.growth}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent signups */}
        <Card dk={dk} style={{ padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: c.txt }}>Inscriptions récentes</h3>
            <button onClick={() => onNav("utilisateurs")} className="text-xs font-semibold hover:underline" style={{ color: c.blue }}>
              Voir tout
            </button>
          </div>
          <div className="space-y-3">
            {USERS_DATA.filter(u => u.status === "pending" || !u.verified).concat(USERS_DATA.slice(0, 3)).slice(0, 5).map(u => {
              const rm = ROLE_META[u.role] || ROLE_META["patient"];
              const sm = STATUS_META[u.status] || STATUS_META["active"];
              return (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: rm.color }}>
                    {u.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: c.txt }}>{u.name}</p>
                    <p className="text-xs" style={{ color: c.txt3 }}>{u.wilaya} · {u.role}</p>
                  </div>
                  <Badge color={sm.color} bg={sm.bg}>{sm.label}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Audit log mini */}
        <Card dk={dk} style={{ padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: c.txt }}>Journal d'activité</h3>
            <button onClick={() => onNav("audit")} className="text-xs font-semibold hover:underline" style={{ color: c.blue }}>
              Voir tout
            </button>
          </div>
          <div className="space-y-3">
            {AUDIT_LOGS.slice(0, 5).map(log => {
              const lm = LOG_COLORS[log.type];
              return (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: lm.bg }}>
                    <lm.icon size={13} style={{ color: lm.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: c.txt }}>{log.action}</p>
                    <p className="text-xs" style={{ color: c.txt3 }}>{log.user} · {log.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}

// ─── PAGE: UTILISATEURS ───────────────────────────────────────────────────────
const PAGE_SIZE = 7;

function UtilisateursPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [users, setUsers] = useState(USERS_DATA);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // { type: "approve"|"suspend"|"delete", user }

  useEffect(() => {
    api.getUsers()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map(u => ({
            id: u.id,
            name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.name || "—",
            email: u.email || "—",
            role: u.role || "patient",
            wilaya: u.wilaya || u.city || "—",
            status: u.status || u.is_active === false ? "suspended" : "active",
            joined: u.date_joined?.slice(0, 10) || u.joined || "—",
            verified: u.is_verified ?? u.verified ?? false,
          }));
          setUsers(normalized);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase()) ||
                        u.wilaya.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = useCallback((setter) => (val) => { setter(val); setPage(1); }, []);

  const approve = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "active", verified: true } : u));
  const suspend = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u));
  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const allSelected = paginated.length > 0 && paginated.every(u => selected.includes(u.id));

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black" style={{ color: c.txt }}>Gestion Utilisateurs</h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>{users.length} utilisateurs · {users.filter(u => u.status === "pending").length} en attente de validation</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: c.border }}>
              <span className="text-xs font-bold" style={{ color: c.txt2 }}>{selected.length} sélectionnés</span>
              <button onClick={() => selected.forEach(id => suspend(id))}
                className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: c.amberLight, color: c.amber }}>
                Suspendre
              </button>
              <button onClick={() => { selected.forEach(id => deleteUser(id)); setSelected([]); }}
                className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: c.redLight, color: c.red }}>
                Supprimer
              </button>
            </div>
          )}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: c.blue }}>
            <Plus size={14} /> Ajouter utilisateur
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card dk={dk} className="mb-5" style={{ padding: "12px 16px" }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-52 rounded-xl px-3 py-2" style={{ background: c.blueLight }}>
            <Search size={14} style={{ color: c.txt3 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email, wilaya…"
              className="outline-none text-sm bg-transparent flex-1" style={{ color: c.txt }} />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {[["all", "Tous"], ["patient", "Patients"], ["médecin", "Médecins"], ["pharmacien", "Pharmaciens"], ["garde-malade", "Gardes"]].map(([val, label]) => (
              <button key={val} onClick={() => handleFilterChange(setRoleFilter)(val)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                style={{ background: roleFilter === val ? c.blue : "transparent", color: roleFilter === val ? "#fff" : c.txt2, borderColor: roleFilter === val ? c.blue : c.border }}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {[["all", "Tous"], ["active", "Actifs"], ["pending", "En attente"], ["suspended", "Suspendus"]].map(([val, label]) => (
              <button key={val} onClick={() => handleFilterChange(setStatusFilter)(val)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                style={{ background: statusFilter === val ? c.blue : "transparent", color: statusFilter === val ? "#fff" : c.txt2, borderColor: statusFilter === val ? c.blue : c.border }}>
                {label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all hover:opacity-80"
            style={{ borderColor: c.border, color: c.txt2 }}>
            <Download size={13} /> Exporter CSV
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card dk={dk} style={{ padding: 0, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.border}`, background: dk ? "rgba(255,255,255,0.02)" : "#FAFBFD" }}>
                <th className="px-4 py-3">
                  <input type="checkbox" checked={allSelected}
                    onChange={() => allSelected ? setSelected([]) : setSelected(paginated.map(u => u.id))}
                    className="w-4 h-4 rounded" />
                </th>
                {["Utilisateur", "Rôle", "Wilaya", "Statut", "Vérifié", "Inscrit le", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-bold uppercase tracking-wide px-4 py-3"
                    style={{ color: c.txt3 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(u => {
                const rm = ROLE_META[u.role] || ROLE_META["patient"];
                const sm = STATUS_META[u.status] || STATUS_META["active"];
                return (
                  <tr key={u.id}
                    style={{ borderBottom: `1px solid ${c.border}`, background: selected.includes(u.id) ? (dk ? "rgba(74,111,165,0.08)" : "#F0F5FF") : "transparent" }}
                    onMouseEnter={e => { if (!selected.includes(u.id)) e.currentTarget.style.background = dk ? "rgba(255,255,255,0.02)" : "#FAFBFD"; }}
                    onMouseLeave={e => { if (!selected.includes(u.id)) e.currentTarget.style.background = selected.includes(u.id) ? (dk ? "rgba(74,111,165,0.08)" : "#F0F5FF") : "transparent"; }}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(u.id)}
                        onChange={() => toggleSelect(u.id)} className="w-4 h-4 rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: rm.color }}>
                          {u.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: c.txt }}>{u.name}</p>
                          <p className="text-xs" style={{ color: c.txt3 }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: rm.bg }}>
                          <rm.icon size={10} style={{ color: rm.color }} />
                        </div>
                        <span className="text-xs font-semibold capitalize" style={{ color: c.txt2 }}>{u.role}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: c.txt2 }}>{u.wilaya}</td>
                    <td className="px-4 py-3"><Badge color={sm.color} bg={sm.bg}>{sm.label}</Badge></td>
                    <td className="px-4 py-3">
                      {u.verified
                        ? <CheckCircle size={16} style={{ color: c.green }} />
                        : <XCircle size={16} style={{ color: c.txt3 }} />}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: c.txt3 }}>
                      {new Date(u.joined).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {u.status === "pending" && (
                          <button onClick={() => approve(u.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
                            title="Approuver" style={{ background: c.greenLight }}>
                            <Check size={13} style={{ color: c.green }} />
                          </button>
                        )}
                        <button onClick={() => suspend(u.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all hover:opacity-70"
                          title={u.status === "suspended" ? "Réactiver" : "Suspendre"}
                          style={{ borderColor: c.border, color: u.status === "suspended" ? c.green : c.amber }}>
                          {u.status === "suspended" ? <Unlock size={12} /> : <Lock size={12} />}
                        </button>
                        <button onClick={() => deleteUser(u.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all hover:opacity-70"
                          title="Supprimer" style={{ borderColor: c.border, color: c.red }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Users size={36} className="mx-auto mb-3" style={{ color: c.txt3 }} />
              <p style={{ color: c.txt3 }}>Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: c.border }}>
          <p className="text-xs" style={{ color: c.txt3 }}>
            {filtered.length === 0 ? "Aucun résultat" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} sur ${filtered.length} utilisateurs`}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 rounded-lg text-xs font-bold transition-all disabled:opacity-30"
              style={{ color: c.txt3 }}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                style={{ background: p === page ? c.blue : "transparent", color: p === page ? "#fff" : c.txt3 }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 rounded-lg text-xs font-bold transition-all disabled:opacity-30"
              style={{ color: c.txt3 }}>›</button>
          </div>
        </div>
      </Card>
    </>
  );
}

// ─── PAGE: VALIDATION DES INSCRIPTIONS ───────────────────────────────────────
const PENDING_PROS = [
  {
    id: 1, name: "Dr. Ramzi Boudiaf", role: "médecin", specialty: "Cardiologie",
    wilaya: "Alger", email: "ramzi.boudiaf@email.dz", phone: "+213 550 12 34 56",
    submittedAt: "2026-04-03", initials: "RB", color: "#2D8C6F",
    docs: [
      { label: "Diplôme de médecine", key: "diplome" },
      { label: "Ordre des médecins", key: "ordre" },
      { label: "Pièce d'identité", key: "cni" },
    ],
  },
  {
    id: 2, name: "Pharmacie Al Amal", role: "pharmacien", specialty: "Pharmacie",
    wilaya: "Oran", email: "alalampharm@email.dz", phone: "+213 561 98 76 54",
    submittedAt: "2026-04-02", initials: "PA", color: "#E8A838",
    docs: [
      { label: "Registre du commerce", key: "registre" },
      { label: "Licence d'exploitation", key: "licence" },
      { label: "Convention CNAS", key: "cnas" },
    ],
  },
  {
    id: 3, name: "Amira Djoudi", role: "garde-malade", specialty: "Soins à domicile",
    wilaya: "Constantine", email: "amira.djoudi@email.dz", phone: "+213 540 55 66 77",
    submittedAt: "2026-04-04", initials: "AD", color: "#7B5EA7",
    docs: [
      { label: "Certificat de formation", key: "certif" },
      { label: "Pièce d'identité", key: "cni" },
    ],
  },
];

function ValidationPage({ dk, onCountChange }) {
  const c = dk ? T.dark : T.light;
  const [pending, setPending] = useState(PENDING_PROS);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]); // { ...pro, decision: "approved"|"rejected" }

  useEffect(() => {
    api.getPendingDoctors()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map(d => ({
            id: d.id,
            name: `${d.first_name || ""} ${d.last_name || ""}`.trim() || d.name || "—",
            role: d.role || "médecin",
            specialty: d.specialty || d.specialite || "—",
            wilaya: d.wilaya || d.city || "—",
            email: d.email || "—",
            phone: d.phone || "—",
            submittedAt: d.created_at?.slice(0, 10) || d.submittedAt || "—",
            initials: ((d.first_name?.[0] || "") + (d.last_name?.[0] || "")).toUpperCase() || "??",
            color: "#4A6FA5",
            docs: d.docs || [],
          }));
          setPending(normalized);
          if (onCountChange) onCountChange(normalized.length);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const [docModal, setDocModal] = useState(null); // { pro, doc }

  const approve = (id) => {
    const pro = pending.find(p => p.id === id);
    const next = pending.filter(p => p.id !== id);
    setPending(next);
    if (onCountChange) onCountChange(next.length);
    setHistory(prev => [{ ...pro, decision: "approved", decidedAt: new Date().toLocaleDateString("fr-FR") }, ...prev]);
  };
  const reject = (id) => {
    const pro = pending.find(p => p.id === id);
    const next = pending.filter(p => p.id !== id);
    setPending(next);
    if (onCountChange) onCountChange(next.length);
    setHistory(prev => [{ ...pro, decision: "rejected", decidedAt: new Date().toLocaleDateString("fr-FR") }, ...prev]);
  };

  const roleMeta = {
    "médecin":     { color: "#2D8C6F", bg: "#2D8C6F18", label: "Médecin" },
    "pharmacien":  { color: "#E8A838", bg: "#E8A83818", label: "Pharmacien" },
    "garde-malade":{ color: "#7B5EA7", bg: "#7B5EA718", label: "Garde-malade" },
  };

  return (
    <>
      {/* Document preview modal */}
      {docModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
          onClick={e => { if (e.target === e.currentTarget) setDocModal(null); }}>
          <div className="rounded-2xl w-full max-w-md p-8 border text-center"
            style={{ background: c.card, borderColor: c.border }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: c.blueLight }}>
              <FileText size={28} style={{ color: c.blue }} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: c.txt }}>{docModal.doc.label}</h2>
            <p className="text-sm mb-6" style={{ color: c.txt3 }}>Soumis par {docModal.pro.name}</p>
            <div className="rounded-xl border p-6 mb-6 flex flex-col items-center gap-2"
              style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border }}>
              <FileText size={40} style={{ color: c.txt3 }} />
              <p className="text-sm font-medium" style={{ color: c.txt2 }}>document_{docModal.doc.key}.pdf</p>
              <p className="text-xs" style={{ color: c.txt3 }}>Aperçu non disponible en mode démo</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDocModal(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border"
                style={{ borderColor: c.border, color: c.txt2 }}>
                Fermer
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: c.blue }}>
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black" style={{ color: c.txt }}>Validation des inscriptions</h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
            {pending.length} professionnel{pending.length !== 1 ? "s" : ""} en attente · {history.length} traité{history.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm"
          style={{ background: c.amberLight, borderColor: c.amber + "40", color: c.amber }}>
          <Clock size={15} /> {pending.length} en attente
        </div>
      </div>

      {/* Pending list */}
      {pending.length === 0 ? (
        <Card dk={dk} style={{ padding: 48, textAlign: "center" }}>
          <CheckCircle size={40} style={{ color: c.green, margin: "0 auto 16px" }} />
          <p className="text-lg font-bold" style={{ color: c.txt }}>Toutes les demandes ont été traitées</p>
          <p className="text-sm mt-1" style={{ color: c.txt3 }}>Aucune inscription en attente pour le moment.</p>
        </Card>
      ) : (
        <div className="space-y-4 mb-8">
          {pending.map(pro => {
            const meta = roleMeta[pro.role] || { color: c.blue, bg: c.blueLight, label: pro.role };
            return (
              <Card key={pro.id} dk={dk} style={{ padding: 24 }}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Identity */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ background: pro.color }}>
                      {pro.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold" style={{ color: c.txt }}>{pro.name}</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                      </div>
                      <p className="text-sm mt-0.5" style={{ color: c.txt3 }}>{pro.specialty} · {pro.wilaya}</p>
                      <p className="text-xs mt-1" style={{ color: c.txt3 }}>{pro.email} · {pro.phone}</p>
                      <p className="text-[10px] mt-1 font-semibold uppercase tracking-wide" style={{ color: c.txt3 }}>
                        Soumis le {pro.submittedAt}
                      </p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt3 }}>Documents soumis</p>
                    <div className="flex flex-wrap gap-2">
                      {pro.docs.map(doc => (
                        <button key={doc.key}
                          onClick={() => setDocModal({ pro, doc })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
                          style={{ background: c.blueLight, borderColor: c.blue + "30", color: c.blue }}>
                          <FileText size={12} /> {doc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button onClick={() => approve(pro.id)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                      style={{ background: c.green }}>
                      <Check size={15} /> Approuver
                    </button>
                    <button onClick={() => reject(pro.id)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                      style={{ background: c.red }}>
                      <X size={15} /> Rejeter
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <>
          <h2 className="text-base font-bold mb-4" style={{ color: c.txt }}>Historique des décisions</h2>
          <div className="space-y-3">
            {history.map((pro, i) => {
              const meta = roleMeta[pro.role] || { color: c.blue, bg: c.blueLight, label: pro.role };
              const approved = pro.decision === "approved";
              return (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border"
                  style={{ background: approved ? c.greenLight : c.redLight, borderColor: (approved ? c.green : c.red) + "30" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: pro.color }}>{pro.initials}</div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: c.txt }}>{pro.name}</p>
                      <p className="text-xs" style={{ color: c.txt3 }}>{meta.label} · {pro.wilaya}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: c.txt3 }}>{pro.decidedAt}</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: approved ? c.green + "18" : c.red + "18", color: approved ? c.green : c.red }}>
                      {approved ? <><Check size={11} /> Approuvé</> : <><X size={11} /> Rejeté</>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

// ─── PAGE: AUDIT LOG ──────────────────────────────────────────────────────────
function AuditPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [logs, setLogs] = useState(AUDIT_LOGS);
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = typeFilter === "all" ? logs : logs.filter(l => l.type === typeFilter);

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black" style={{ color: c.txt }}>Journal d'Audit</h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Toutes les actions administratives et système</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border"
          style={{ borderColor: c.border, color: c.txt2 }}>
          <Download size={14} /> Exporter logs
        </button>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          ["all", "Tous", c.txt2, c.blueLight],
          ["success", "Succès", c.green, c.greenLight],
          ["warning", "Alertes", c.amber, c.amberLight],
          ["danger", "Erreurs", c.red, c.redLight],
          ["info", "Info", c.blue, c.blueLight],
        ].map(([val, label, color, bg]) => (
          <button key={val} onClick={() => setTypeFilter(val)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all"
            style={{ background: typeFilter === val ? bg : "transparent", color: typeFilter === val ? color : c.txt3, borderColor: typeFilter === val ? color + "44" : c.border }}>
            {label}
            <span className="px-1.5 py-0.5 rounded-full text-[10px]"
              style={{ background: color + "22", color }}>
              {val === "all" ? logs.length : logs.filter(l => l.type === val).length}
            </span>
          </button>
        ))}
      </div>

      {/* Log entries */}
      <Card dk={dk} style={{ padding: 0, overflow: "hidden" }}>
        <div className="divide-y" style={{ borderColor: c.border }}>
          {filtered.map(log => {
            const lm = LOG_COLORS[log.type];
            return (
              <div key={log.id} className="flex items-start gap-4 px-5 py-4 transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = dk ? "rgba(255,255,255,0.02)" : "#FAFBFD"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: dk ? lm.bgDk : lm.bg }}>
                  <lm.icon size={16} style={{ color: lm.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: c.txt }}>{log.action}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <p className="text-xs" style={{ color: c.txt2 }}>👤 {log.user}</p>
                    <p className="text-xs" style={{ color: c.txt3 }}>🌐 {log.ip}</p>
                    <p className="text-xs" style={{ color: c.txt3 }}>⏱ {log.time}</p>
                  </div>
                </div>
                <Badge color={lm.color} bg={dk ? lm.bgDk : lm.bg}>
                  {log.type === "success" ? "Succès" : log.type === "warning" ? "Alerte" : log.type === "danger" ? "Erreur" : "Info"}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

// ─── PAGE: PARAMÈTRES ADMIN ───────────────────────────────────────────────────
function AdminSettingsPage({ dk, onToggleDark }) {
  const c = dk ? T.dark : T.light;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: c.txt }}>Paramètres Admin</h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Configuration globale de la plateforme MedSmart</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Plateforme */}
        <Card dk={dk} style={{ padding: 20 }}>
          <p className="font-bold mb-5" style={{ color: c.txt }}>Paramètres plateforme</p>
          <div className="space-y-4">
            {[
              { label: "Inscription ouverte",     on: true  },
              { label: "Vérification obligatoire",on: true  },
              { label: "2FA pour médecins",        on: true  },
              { label: "Mode maintenance",         on: false },
              { label: "Logs détaillés",           on: true  },
              { label: "Mode sombre par défaut",   on: dk, toggle: true },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: c.border }}>
                <span className="text-sm" style={{ color: c.txt }}>{item.label}</span>
                <button onClick={item.toggle ? onToggleDark : undefined}
                  className="relative w-10 h-5 rounded-full transition-all"
                  style={{ background: item.on ? c.blue : c.border }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                    style={{ left: item.on ? "22px" : "2px" }} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Sécurité */}
        <Card dk={dk} style={{ padding: 20 }}>
          <p className="font-bold mb-5" style={{ color: c.txt }}>Sécurité & Accès</p>
          <div className="space-y-4">
            {[
              { label: "Session timeout",    value: "30 minutes",   input: true },
              { label: "Max tentatives login",value: "5 essais",     input: true },
              { label: "IP whitelist admin",  value: "10.0.0.1/24", input: true },
            ].map(item => (
              <div key={item.label} className="mb-3">
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt2 }}>{item.label}</label>
                <input defaultValue={item.value}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                  style={{ background: dk ? "#0A1220" : "#F8FAFC", borderColor: c.border, color: c.txt }} />
              </div>
            ))}
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: c.blue }}>
              Enregistrer
            </button>
          </div>
        </Card>

        {/* CNAS Integration */}
        <Card dk={dk} style={{ padding: 20 }}>
          <p className="font-bold mb-4" style={{ color: c.txt }}>Intégration CNAS</p>
          <div className="flex items-center gap-3 p-3 rounded-xl mb-4"
            style={{ background: c.greenLight, border: `1px solid ${c.green}30` }}>
            <CheckCircle size={18} style={{ color: c.green }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: c.green }}>API CNAS connectée</p>
              <p className="text-xs" style={{ color: c.txt3 }}>Endpoint: api.cnas.dz/v2 · TLS 1.3</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Remboursements traités", value: "8 841" },
              { label: "Montant total",          value: "4.2M DZD" },
              { label: "Taux approbation",       value: "94.2%" },
              { label: "Délai moyen",            value: "2.4 jours" },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl" style={{ background: c.blueLight }}>
                <p className="text-lg font-black" style={{ color: c.txt }}>{s.value}</p>
                <p className="text-xs" style={{ color: c.txt2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* About */}
        <Card dk={dk} style={{ padding: 20 }}>
          <p className="font-bold mb-4" style={{ color: c.txt }}>À propos de la plateforme</p>
          <div className="space-y-3">
            {[
              ["Version",         "MedSmart Admin v2.2.0"],
              ["Build",           "#20260328-stable"],
              ["Environnement",   "Production · Algérie"],
              ["Base de données", "PostgreSQL 16.2"],
              ["IA Engine",       "MedSmart-LM v2.2"],
              ["CNAS",            "Certifié 2024"],
              ["Conformité",      "RGPD · ISO 27001"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: c.border }}>
                <span className="text-xs font-semibold" style={{ color: c.txt3 }}>{k}</span>
                <span className="text-xs font-bold" style={{ color: c.txt2 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

// ─── MAIN ADMIN SHELL ─────────────────────────────────────────────────────────
export default function AdminDashboard({ onLogout }) {
  const [page, setPage] = useState("overview");
  const [dk, setDk] = useState(false); // Admin starts in light mode as requested
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const c = dk ? T.dark : T.light;

  const alertCount = useMemo(
    () => AUDIT_LOGS.filter(l => l.type === "warning" || l.type === "danger").length,
    []
  );

  const NAV = [
    { id: "overview",    label: "Vue globale",  icon: LayoutDashboard },
    { id: "validation",  label: "Validation",   icon: UserCheck,       badge: pendingCount },
    { id: "utilisateurs",label: "Utilisateurs", icon: Users },
    { id: "audit",       label: "Audit",        icon: Shield,          badge: alertCount },
  ];

  const renderPage = () => {
    switch (page) {
      case "overview":     return <OverviewPage dk={dk} onNav={setPage} />;
      case "validation":   return <ValidationPage dk={dk} onCountChange={setPendingCount} />;
      case "utilisateurs": return <UtilisateursPage dk={dk} />;
      case "audit":        return <AuditPage dk={dk} />;
      case "parametres":   return <AdminSettingsPage dk={dk} onToggleDark={() => setDk(!dk)} />;
      default:             return <OverviewPage dk={dk} onNav={setPage} />;
    }
  };

  return (
    <div className="min-h-screen relative" style={{ background: c.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", color: c.txt, transition: "background 0.3s, color 0.2s" }}>
      <ParticlesHero darkMode={dk} />
      <div className="relative z-10">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { transition: background-color 0.2s, border-color 0.2s; }
        button, select, label, a { cursor: pointer !important; }
        input[type=checkbox] { cursor: pointer !important; }
        .nav-link:not(.active-nav):hover {
          background: rgba(90,135,197,0.12) !important;
          color: #5A87C5 !important;
        }
        @keyframes dropdownIn {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .pd-item { color:${c.txt2}; background:transparent; transition:background 0.15s,color 0.15s; }
        .pd-item:hover { background:${dk ? "rgba(255,255,255,0.05)" : "rgba(90,135,197,0.08)"}; color:${dk ? "#E8F0FA" : c.blue}; }
        .pd-item-danger { color:#EF4444; background:transparent; transition:background 0.15s; }
        .pd-item-danger:hover { background:rgba(239,68,68,0.1); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(90,135,197,0.3); border-radius: 4px; }
      `}</style>

      {/* ═══ NAVBAR ═══ */}
      <nav className="sticky top-0 z-30 border-b shadow-sm" style={{ background: c.nav, borderColor: c.border }}>
        <div className="w-full px-6 h-[60px] flex items-center gap-3">

          {/* ── Logo with custom medical cross icon ── */}
          <div className="flex items-center gap-2 shrink-0 mr-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #304B71, #6492C9)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="20" rx="2" fill="white" opacity="0.95"/>
                <rect x="2" y="9" width="20" height="6" rx="2" fill="white" opacity="0.95"/>
                <path d="M4 14 L6 10 L8 13 L10 7 L12 15 L14 11 L16 13 L18 11"
                  stroke="#6492C9" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base" style={{ color: c.txt }}>
                MedSmart
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #E05555, #c93535)", color: "#fff" }}>
                ADMIN
              </span>
            </div>
          </div>

          {/* ── Nav links — centered with spacing ── */}
          <div className="hidden lg:flex items-center justify-center gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                className={`nav-link${page === item.id ? " active-nav" : ""} relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all`}
                style={{ color: page === item.id ? "#fff" : c.txt2, background: page === item.id ? c.blue : "transparent" }}>
                {item.label}
                {item.badge && (
                  <span className="ml-1 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center"
                    style={{ background: c.red }}>{item.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Right section ── */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            {/* Profile button — red dot on border corner for notifications */}
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 z-10 flex items-center justify-center"
                style={{ borderColor: c.nav, fontSize: 7, color: "#fff", fontWeight: 800, pointerEvents: "none" }}>
                {alertCount}
              </div>
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:opacity-80"
                style={{ border: `1px solid ${c.border}`, background: "transparent" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #E05555, #c93535)" }}>
                  AD
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-tight" style={{ color: c.txt }}>Super Admin</p>
                  <p className="text-xs" style={{ color: c.txt3 }}>Accès complet</p>
                </div>
                <ChevronDown size={13} style={{ color: c.txt3 }} />
              </button>

              {/* Profile dropdown — animated slide-down */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-60 rounded-[20px] overflow-hidden z-50"
                  style={{ background: dk ? c.card : "#ffffff", border: `1px solid ${dk ? c.border : "#F1F5F9"}`,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)", animation: "dropdownIn 0.2s ease forwards" }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: dk ? c.border : "#F1F5F9" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg, #E05555, #c93535)" }}>AD</div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: c.txt }}>Super Admin</p>
                        <p className="text-xs" style={{ color: c.txt3 }}>admin@medsmart.dz</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 flex flex-col gap-1 group">
                    <button onClick={() => { setPage("audit"); setProfileOpen(false); }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Bell size={16} className="hover:rotate-45 transition-transform" />
                      Notifications
                      <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "#E05555", color: "#fff" }}>{alertCount}</span>
                    </button>
                    <button onClick={() => { setPage("parametres"); setProfileOpen(false); }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Settings size={16} className="hover:rotate-45 transition-transform" /> 
                      Paramètres
                    </button>
                    <button onClick={() => { setPage("audit"); setProfileOpen(false); }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Shield size={16} className="hover:rotate-45 transition-transform" /> 
                      Journal d'audit
                    </button>
                    
                    {/* Dark mode */}
                    <button className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Sun size={14} style={{ color: dk ? c.txt3 : "#E8A838" }} />
                      <button
                        onClick={() => setDk(!dk)}
                        className="relative rounded-full transition-all duration-300"
                        style={{
                          width: 42,
                          height: 24,
                          background: dk
                            ? "linear-gradient(135deg, #304B71, #4A6FA5)"
                            : "#D5DEEF",
                          border: `1.5px solid ${dk ? c.blue + "80" : "#BBC8DC"}`,
                          padding: 0,
                        }}
                      >
                        <div
                          className="absolute top-0.5 rounded-full bg-white shadow-md transition-all duration-300"
                          style={{ width: 18, height: 18, left: dk ? 20 : 2 }}
                        />
                      </button>
                      <Moon size={13} style={{ color: dk ? c.blue : c.txt3 }} />
                    </button>

                    <div className="h-px my-1 mx-2" style={{ background: dk ? c.border : "#F1F5F9" }} />
                    <button onClick={onLogout}
                      className="pd-item-danger w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl cursor-pointer">
                      <LogOut size={16} className="hover:translate-x-1 transition-transform" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ color: c.txt2 }} onClick={() => setMobileMenu(!mobileMenu)}>
              <Menu size={17} />
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden border-t px-4 py-3 flex flex-wrap gap-2"
            style={{ borderColor: c.border, background: c.nav }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => { setPage(item.id); setMobileMenu(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ color: page === item.id ? "#fff" : c.txt2, background: page === item.id ? c.blue : "transparent" }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="w-full px-6 py-6"><ErrorBoundary>{renderPage()}</ErrorBoundary></main>

      {profileOpen && <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />}
    </div>
    </div>
  );
}