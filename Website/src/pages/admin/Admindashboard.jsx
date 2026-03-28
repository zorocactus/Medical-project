import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, Stethoscope, Pill, Heart, Shield,
  Bell, Settings, LogOut, ChevronDown, Sun, Moon, Search,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  XCircle, Clock, Activity, Server, Database, Cpu, Wifi,
  Eye, EyeOff, Edit, Trash2, Plus, Download, Upload,
  RefreshCw, Filter, MoreHorizontal, ChevronRight,
  Globe, Lock, Unlock, UserCheck, UserX, BarChart2,
  PieChart, FileText, Zap, Star, Phone, MapPin,
  ArrowUpRight, ArrowDownRight, Check, X, Menu,
  AlertCircle, Package, DollarSign, Calendar,
  Brain, Flag, Radio, Layers
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

// ─── Mini Sparkline ───────────────────────────────────────────────────────────
function Sparkline({ data, color, height = 40 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / (max - min + 1)) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" style={{ height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── System Health Gauge ──────────────────────────────────────────────────────
function Gauge({ value, label, color, dk }) {
  const c = dk ? T.dark : T.light;
  const r = 32, cx = 40, cy = 40, circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={c.border} strokeWidth="6" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>{value}%</text>
      </svg>
      <span className="text-xs font-semibold" style={{ color: c.txt2 }}>{label}</span>
    </div>
  );
}

// ─── PAGE: OVERVIEW ───────────────────────────────────────────────────────────
function OverviewPage({ dk, onNav }) {
  const c = dk ? T.dark : T.light;
  const [users, setUsers] = useState(USERS_DATA);
  const sparkData = [42, 58, 51, 67, 72, 61, 78, 84, 79, 91, 88, 96];

  const kpis = [
    { label: "Utilisateurs totaux",   value: <AnimCounter target={6482} />,   icon: Users,       color: c.blue,   trend: 14, trendLabel: "+821 ce mois" },
    { label: "Médecins vérifiés",     value: <AnimCounter target={342} />,    icon: Stethoscope, color: c.green,  trend: 8,  trendLabel: "+28 ce mois" },
    { label: "Pharmacies actives",    value: <AnimCounter target={148} />,    icon: Pill,        color: c.amber,  trend: 5,  trendLabel: "+8 ce mois" },
    { label: "Revenus plateforme",    value: <><AnimCounter target={2841} />K DZD</>, icon: DollarSign, color: c.purple, trend: 22, trendLabel: "+624K ce mois" },
    { label: "Sessions IA aujourd'hui",value: <AnimCounter target={1284} />,  icon: Brain,       color: "#E05555",trend: 31, trendLabel: "+307 vs hier" },
    { label: "Ordonnances CNAS",      value: <AnimCounter target={8841} />,   icon: Shield,      color: c.green,  trend: 12, trendLabel: "62% de couverture" },
    { label: "Wilaya couvertes",      value: <AnimCounter target={48} />,     icon: MapPin,      color: c.blue,   trend: 4,  trendLabel: "Sur 58 wilayas" },
    { label: "Uptime système",        value: <><AnimCounter target={99} suffix="." />9%</>, icon: Activity, color: c.green, trend: 0, trendLabel: "30 jours continus" },
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
            Vue globale de la plateforme · Samedi 28 Mars 2026 · 14:32
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
function UtilisateursPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [users, setUsers] = useState(USERS_DATA);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null); // { type: "approve"|"suspend"|"delete", user }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase()) ||
                        u.wilaya.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const approve = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "active", verified: true } : u));
  const suspend = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u));
  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const allSelected = filtered.length > 0 && filtered.every(u => selected.includes(u.id));

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
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm outline-none border" style={{ background: c.card, color: c.txt, borderColor: c.border }}>
            <option value="all">Tous les rôles</option>
            <option value="patient">Patients</option>
            <option value="médecin">Médecins</option>
            <option value="pharmacien">Pharmaciens</option>
            <option value="garde-malade">Garde-malades</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm outline-none border" style={{ background: c.card, color: c.txt, borderColor: c.border }}>
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendus</option>
          </select>
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
                    onChange={() => allSelected ? setSelected([]) : setSelected(filtered.map(u => u.id))}
                    className="w-4 h-4 rounded" />
                </th>
                {["Utilisateur", "Rôle", "Wilaya", "Statut", "Vérifié", "Inscrit le", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-bold uppercase tracking-wide px-4 py-3"
                    style={{ color: c.txt3 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const rm = ROLE_META[u.role] || ROLE_META["patient"];
                const sm = STATUS_META[u.status] || STATUS_META["active"];
                return (
                  <tr key={u.id}
                    style={{ borderBottom: `1px solid ${c.border}`, background: selected.includes(u.id) ? (dk ? "rgba(74,111,165,0.08)" : "#F0F5FF") : "transparent" }}
                    onMouseEnter={e => { if (!selected.includes(u.id)) e.currentTarget.style.background = dk ? "rgba(255,255,255,0.02)" : "#FAFBFD"; }}
                    onMouseLeave={e => { if (!selected.includes(u.id)) e.currentTarget.style.background = "transparent"; }}>
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
          <p className="text-xs" style={{ color: c.txt3 }}>Affichage de {filtered.length} sur {users.length} utilisateurs</p>
          <div className="flex gap-1">
            {[1,2,3].map(p => (
              <button key={p} className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                style={{ background: p === 1 ? c.blue : "transparent", color: p === 1 ? "#fff" : c.txt3 }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}

// ─── PAGE: IA MONITORING ──────────────────────────────────────────────────────
function IAMonitoringPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [modelActive, setModelActive] = useState(true);

  const aiStats = [
    { label: "Sessions aujourd'hui",  value: "1 284",  icon: Brain,    color: c.blue,   spark: [40,55,48,62,58,71,65,78,72,84,79,91] },
    { label: "Précision diagnostique",value: "94.2%",  icon: Activity, color: c.green,  spark: [88,89,91,90,92,91,93,92,94,93,94,94] },
    { label: "Temps de réponse moy.", value: "1.3s",   icon: Zap,      color: c.amber,  spark: [2.1,1.9,1.8,1.7,1.6,1.5,1.4,1.4,1.3,1.3,1.3,1.3] },
    { label: "Taux de satisfaction",  value: "91%",    icon: Star,     color: c.purple, spark: [82,84,85,86,87,88,89,89,90,90,91,91] },
  ];

  const topSymptoms = [
    { symptom: "Douleurs thoraciques",  count: 284, pct: 87, urgency: "high"   },
    { symptom: "Maux de tête",          count: 412, pct: 100, urgency: "low"   },
    { symptom: "Fatigue chronique",     count: 321, pct: 78, urgency: "medium" },
    { symptom: "Fièvre",               count: 298, pct: 72, urgency: "medium" },
    { symptom: "Douleurs abdominales",  count: 187, pct: 45, urgency: "medium" },
    { symptom: "Nausées",              count: 156, pct: 38, urgency: "low"    },
  ];

  const urgencyColors = { high: c.red, medium: c.amber, low: c.green };

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black" style={{ color: c.txt }}>Monitoring IA</h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>MedSmart IA v2.2 · Modèle médical Algérien</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border" style={{ borderColor: c.border }}>
            <div className={`w-2 h-2 rounded-full ${modelActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <span className="text-sm font-semibold" style={{ color: c.txt }}>
              Modèle {modelActive ? "actif" : "arrêté"}
            </span>
            <button onClick={() => setModelActive(!modelActive)}
              className="relative w-9 h-5 rounded-full transition-all"
              style={{ background: modelActive ? c.green : c.border }}>
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                style={{ left: modelActive ? "17px" : "2px" }} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: c.blue }}>
            <Upload size={14} /> Déployer v2.3
          </button>
        </div>
      </div>

      {/* AI KPIs with sparklines */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {aiStats.map(s => (
          <Card key={s.label} dk={dk} style={{ padding: 18 }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.color + "18" }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: c.txt3 }}>{s.label}</span>
            </div>
            <p className="text-2xl font-black mb-2" style={{ color: c.txt }}>{s.value}</p>
            <Sparkline data={s.spark} color={s.color} height={36} />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Top symptoms */}
        <Card dk={dk} style={{ padding: 20 }}>
          <h3 className="font-bold mb-4" style={{ color: c.txt }}>Symptômes les plus fréquents</h3>
          <div className="space-y-4">
            {topSymptoms.map(s => (
              <div key={s.symptom}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: urgencyColors[s.urgency] }} />
                    <span className="text-sm font-semibold" style={{ color: c.txt }}>{s.symptom}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: c.txt2 }}>{s.count} cas</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: c.blueLight }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${s.pct}%`, background: urgencyColors[s.urgency] }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Model versions */}
        <Card dk={dk} style={{ padding: 20 }}>
          <h3 className="font-bold mb-4" style={{ color: c.txt }}>Versions du modèle</h3>
          <div className="space-y-3 mb-5">
            {[
              { v: "v2.2", status: "active",   date: "15 Mar 2026", acc: "94.2%", sessions: "41 284" },
              { v: "v2.1", status: "archived", date: "02 Jan 2026", acc: "91.8%", sessions: "128 441" },
              { v: "v2.0", status: "archived", date: "10 Oct 2025", acc: "88.4%", sessions: "84 221" },
              { v: "v2.3", status: "pending",  date: "Bientôt",     acc: "~96%",  sessions: "—" },
            ].map(v => (
              <div key={v.v} className="flex items-center gap-4 p-3 rounded-xl border"
                style={{ borderColor: v.status === "active" ? c.green + "44" : c.border,
                  background: v.status === "active" ? c.greenLight : "transparent" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                  style={{ background: v.status === "active" ? c.green : c.blueLight,
                    color: v.status === "active" ? "#fff" : c.txt2 }}>
                  {v.v}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: c.txt }}>Modèle {v.v}</p>
                  <p className="text-xs" style={{ color: c.txt3 }}>{v.date} · Précision: {v.acc}</p>
                </div>
                <Badge
                  color={v.status === "active" ? c.green : v.status === "pending" ? c.amber : c.txt3}
                  bg={v.status === "active" ? c.greenLight : v.status === "pending" ? c.amberLight : c.blueLight}>
                  {v.status === "active" ? "Actif" : v.status === "pending" ? "En test" : "Archivé"}
                </Badge>
              </div>
            ))}
          </div>

          {/* Accuracy over time mini chart */}
          <div className="p-3 rounded-xl" style={{ background: c.blueLight }}>
            <p className="text-xs font-bold mb-2" style={{ color: c.txt2 }}>Précision — 12 derniers mois</p>
            <Sparkline data={[85, 87, 88, 88, 89, 90, 91, 91, 92, 93, 94, 94]} color={c.green} height={48} />
          </div>
        </Card>
      </div>
    </>
  );
}

// ─── PAGE: SYSTÈME ────────────────────────────────────────────────────────────
function SystemePage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [cpu, setCpu] = useState(42);
  const [ram, setRam] = useState(67);
  const [disk, setDisk] = useState(54);

  // Simulate live updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCpu(v => Math.min(95, Math.max(20, v + (Math.random() - 0.5) * 8)));
      setRam(v => Math.min(90, Math.max(50, v + (Math.random() - 0.5) * 4)));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const servers = [
    { name: "API Server 01",     region: "Alger DC",   status: "healthy", cpu: Math.round(cpu), ram: Math.round(ram), uptime: "99.99%" },
    { name: "API Server 02",     region: "Alger DC",   status: "healthy", cpu: Math.round(cpu * 0.7), ram: Math.round(ram * 0.8), uptime: "99.97%" },
    { name: "IA Model Server",   region: "Oran DC",    status: "healthy", cpu: Math.round(cpu * 1.2), ram: Math.round(ram * 1.1), uptime: "99.95%" },
    { name: "Database Primary",  region: "Alger DC",   status: "healthy", cpu: 28, ram: 71, uptime: "100%" },
    { name: "Database Replica",  region: "Oran DC",    status: "warning", cpu: 91, ram: 88, uptime: "98.2%"  },
    { name: "Storage Server",    region: "Alger DC",   status: "healthy", cpu: 15, ram: 42, uptime: "100%"  },
  ];

  const services = [
    { name: "API REST",          status: "operational", ping: "12ms",  rps: "2.4K"  },
    { name: "IA Diagnostic",     status: "operational", ping: "84ms",  rps: "340"   },
    { name: "Auth Service",      status: "operational", ping: "8ms",   rps: "1.1K"  },
    { name: "CNAS Gateway",      status: "degraded",    ping: "320ms", rps: "82"    },
    { name: "Notification Svc",  status: "operational", ping: "22ms",  rps: "890"   },
    { name: "File Storage",      status: "operational", ping: "45ms",  rps: "210"   },
  ];

  const statusColor = { operational: c.green, degraded: c.amber, down: c.red };
  const serverStatusColor = { healthy: c.green, warning: c.amber, critical: c.red };

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black" style={{ color: c.txt }}>Système & Infrastructure</h1>
          <p className="text-sm mt-0.5 flex items-center gap-2" style={{ color: c.txt2 }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            Tous les systèmes opérationnels · Dernière vérification il y a 30s
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
          style={{ borderColor: c.border, color: c.txt2 }}>
          <RefreshCw size={14} /> Rafraîchir
        </button>
      </div>

      {/* Health gauges */}
      <Card dk={dk} className="mb-5" style={{ padding: 24 }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold" style={{ color: c.txt }}>Ressources système — Live</h3>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: c.greenLight, color: c.green }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Monitoring actif
          </div>
        </div>
        <div className="flex justify-around flex-wrap gap-8">
          <Gauge value={Math.round(cpu)} label="CPU" color={cpu > 80 ? c.red : cpu > 60 ? c.amber : c.green} dk={dk} />
          <Gauge value={Math.round(ram)} label="RAM" color={ram > 85 ? c.red : ram > 70 ? c.amber : c.blue} dk={dk} />
          <Gauge value={disk} label="Stockage" color={disk > 85 ? c.red : disk > 65 ? c.amber : c.purple} dk={dk} />
          <Gauge value={99} label="Réseau" color={c.green} dk={dk} />
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Servers */}
        <Card dk={dk} style={{ padding: 0, overflow: "hidden" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: c.border }}>
            <h3 className="font-bold" style={{ color: c.txt }}>Serveurs</h3>
            <Badge color={c.green} bg={c.greenLight}>{servers.filter(s => s.status === "healthy").length}/{servers.length} sains</Badge>
          </div>
          <div className="divide-y" style={{ borderColor: c.border }}>
            {servers.map(sv => {
              const sc = serverStatusColor[sv.status] || c.green;
              return (
                <div key={sv.name} className="flex items-center gap-4 px-5 py-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${sv.status === "healthy" ? "animate-pulse" : ""}`}
                    style={{ background: sc }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: c.txt }}>{sv.name}</p>
                    <p className="text-xs" style={{ color: c.txt3 }}>{sv.region} · Uptime {sv.uptime}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <div className="text-right">
                      <p style={{ color: sv.cpu > 80 ? c.red : c.txt2 }}>CPU {sv.cpu}%</p>
                      <p style={{ color: sv.ram > 85 ? c.red : c.txt2 }}>RAM {sv.ram}%</p>
                    </div>
                    <div className="w-2 h-8 rounded-full overflow-hidden" style={{ background: c.blueLight }}>
                      <div className="w-full rounded-full transition-all" style={{ height: `${sv.cpu}%`, background: sv.cpu > 80 ? c.red : c.blue, marginTop: `${100 - sv.cpu}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Services status */}
        <Card dk={dk} style={{ padding: 0, overflow: "hidden" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: c.border }}>
            <h3 className="font-bold" style={{ color: c.txt }}>Services</h3>
            <Badge color={c.amber} bg={c.amberLight}>1 dégradé</Badge>
          </div>
          <div className="divide-y" style={{ borderColor: c.border }}>
            {services.map(svc => {
              const sc = statusColor[svc.status] || c.green;
              return (
                <div key={svc.name} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: sc + "18" }}>
                    <Server size={14} style={{ color: sc }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: c.txt }}>{svc.name}</p>
                    <p className="text-xs" style={{ color: c.txt3 }}>Ping: {svc.ping} · {svc.rps} req/s</p>
                  </div>
                  <Badge color={sc} bg={sc + "18"}>
                    {svc.status === "operational" ? "Opérationnel" : svc.status === "degraded" ? "Dégradé" : "En panne"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
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
  const [dk, setDk] = useState(true); // Admin starts in dark mode
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [alertCount] = useState(4);
  const c = dk ? T.dark : T.light;

  const NAV = [
    { id: "overview",    label: "Vue globale",   icon: LayoutDashboard },
    { id: "utilisateurs",label: "Utilisateurs",  icon: Users,           badge: 2 },
    { id: "ia",          label: "IA Monitoring", icon: Brain },
    { id: "systeme",     label: "Système",       icon: Server },
    { id: "audit",       label: "Audit",         icon: Shield,          badge: alertCount },
  ];

  const renderPage = () => {
    switch (page) {
      case "overview":     return <OverviewPage dk={dk} onNav={setPage} />;
      case "utilisateurs": return <UtilisateursPage dk={dk} />;
      case "ia":           return <IAMonitoringPage dk={dk} />;
      case "systeme":      return <SystemePage dk={dk} />;
      case "audit":        return <AuditPage dk={dk} />;
      case "parametres":   return <AdminSettingsPage dk={dk} onToggleDark={() => setDk(!dk)} />;
      default:             return <OverviewPage dk={dk} onNav={setPage} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: c.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", color: c.txt, transition: "background 0.3s, color 0.2s" }}>
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
        .pd-item { color:#64748B; background:transparent; transition:background 0.15s,color 0.15s; }
        .pd-item:hover { background:rgba(255,255,255,0.05); color:#E8F0FA; }
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
      <main className="w-full px-6 py-6">{renderPage()}</main>

      {profileOpen && <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />}
    </div>
  );
}