import { useState } from "react";
import {
  LayoutDashboard, Calendar, Users, FileText, Bell,
  Settings, LogOut, Menu, ChevronDown, Sun, Moon,
  Clock, CheckCircle, AlertCircle, Search, Plus,
  Activity, Stethoscope, Pill, Heart, X, ChevronRight,
  User, Shield
} from "lucide-react";

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  light: {
    bg: "#F0F4F8", card: "#ffffff", nav: "#ffffff",
    border: "#E4EAF5", txt: "#0D1B2E", txt2: "#5A6E8A", txt3: "#9AACBE",
    blue: "#4A6FA5", blueLight: "#EEF3FB", green: "#2D8C6F",
    amber: "#E8A838", red: "#E05555",
  },
  dark: {
    bg: "#0D1117", card: "#141B27", nav: "#141B27",
    border: "rgba(99,142,203,0.15)", txt: "#F0F3FA", txt2: "#8AAEE0", txt3: "#4A6080",
    blue: "#638ECB", blueLight: "#1A2333", green: "#4CAF82",
    amber: "#F0A500", red: "#E05555",
  },
};

// ─── Label selon le rôle ──────────────────────────────────────────────────────
const ROLE_META = {
  "Médecin":       { label: "Médecin",      icon: Stethoscope, color: "#4A6FA5" },
  "Pharmacien":    { label: "Pharmacien",   icon: Pill,         color: "#2D8C6F" },
  "Garde-malade":  { label: "Garde-malade", icon: Heart,        color: "#7B5EA7" },
};

// ─── Fake patients ────────────────────────────────────────────────────────────
const PATIENTS = [
  { id: 1, name: "Alex Johnson",    age: 35, condition: "Hypertension · Diabète T2",  time: "10:30", status: "confirmed", initials: "AJ", color: "#4A6FA5" },
  { id: 2, name: "Samira Meziane",  age: 28, condition: "Consultation générale",       time: "11:00", status: "waiting",   initials: "SM", color: "#2D8C6F" },
  { id: 3, name: "Karim Boudali",   age: 52, condition: "Suivi cardiologique",         time: "11:30", status: "confirmed", initials: "KB", color: "#E8A838" },
  { id: 4, name: "Fatima Benali",   age: 44, condition: "Renouvellement ordonnance",   time: "14:00", status: "confirmed", initials: "FB", color: "#7B5EA7" },
];

// ─── Small Card ───────────────────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk }) {
  const c = dk ? T.dark : T.light;
  return (
    <div className={`rounded-2xl p-5 shadow-sm border ${className}`}
      style={{ background: c.card, borderColor: c.border, ...style }}>
      {children}
    </div>
  );
}

function Badge({ color, bg, children }) {
  return (
    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
      style={{ color, background: bg, borderColor: color + "44" }}>
      {children}
    </span>
  );
}

// ─── DASHBOARD PAGE (médecin) ─────────────────────────────────────────────────
function DoctorHomePage({ dk, role }) {
  const c = dk ? T.dark : T.light;
  const meta = ROLE_META[role] || ROLE_META["Médecin"];
  const RoleIcon = meta.icon;

  const stats = [
    { label: "Patients today",    value: "12",  icon: Users,         color: "#4A6FA5" },
    { label: "Appointments",      value: "8",   icon: Calendar,      color: "#2D8C6F" },
    { label: "Pending reports",   value: "3",   icon: FileText,      color: "#E8A838" },
    { label: "Urgent alerts",     value: "1",   icon: AlertCircle,   color: "#E05555" },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: c.txt }}>
            Bonjour, <span style={{ color: c.blue }}>Dr. Benali</span> 👋
          </h1>
          <p className="text-sm mt-0.5 flex items-center gap-2" style={{ color: c.txt2 }}>
            <RoleIcon size={14} style={{ color: meta.color }} />
            {meta.label} · Mercredi 26 Mars 2026
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)` }}>
          <Plus size={15} /> Nouveau patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <Card key={s.label} dk={dk} style={{ padding: 16 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: s.color + "18" }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: c.txt }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: c.txt2 }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Patients du jour */}
        <div className="xl:col-span-2">
          <Card dk={dk}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold" style={{ color: c.txt }}>Patients du jour</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm"
                style={{ borderColor: c.border, background: c.blueLight }}>
                <Search size={13} style={{ color: c.txt3 }} />
                <input placeholder="Rechercher…" className="outline-none bg-transparent text-sm w-32"
                  style={{ color: c.txt }} />
              </div>
            </div>
            <div className="space-y-3">
              {PATIENTS.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:opacity-80"
                  style={{ borderColor: c.border }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: p.color }}>{p.initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: c.txt }}>{p.name}</p>
                    <p className="text-xs truncate" style={{ color: c.txt2 }}>{p.condition}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: c.blue }}>{p.time}</p>
                    <Badge
                      color={p.status === "confirmed" ? c.green : c.amber}
                      bg={(p.status === "confirmed" ? c.green : c.amber) + "18"}>
                      {p.status === "confirmed" ? "Confirmé" : "En attente"}
                    </Badge>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white shrink-0 hover:opacity-80"
                    style={{ background: c.blue }}>
                    Voir
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* Quick stats */}
          <Card dk={dk}>
            <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: c.txt3 }}>
              Agenda — Aujourd'hui
            </p>
            <div className="space-y-3">
              {[
                { time: "10:30", name: "Alex Johnson",   type: "Suivi" },
                { time: "11:00", name: "Samira Meziane", type: "Consultation" },
                { time: "11:30", name: "Karim Boudali",  type: "Cardiologie" },
                { time: "14:00", name: "Fatima Benali",  type: "Ordonnance" },
              ].map(a => (
                <div key={a.time} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-12 shrink-0" style={{ color: c.blue }}>{a.time}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: c.txt }}>{a.name}</p>
                    <p className="text-xs" style={{ color: c.txt2 }}>{a.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notifications */}
          <Card dk={dk}>
            <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: c.txt3 }}>
              Alertes
            </p>
            <div className="space-y-3">
              {[
                { txt: "Résultat d'analyse — Alex Johnson",  color: "#E8A838", icon: FileText  },
                { txt: "Urgence signalée par Karim Boudali", color: "#E05555", icon: AlertCircle },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: n.color + "12" }}>
                  <n.icon size={14} style={{ color: n.color, marginTop: 2 }} />
                  <p className="text-xs font-medium" style={{ color: c.txt }}>{n.txt}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── MAIN DOCTOR DASHBOARD ────────────────────────────────────────────────────
export default function DoctorDashboard({ role = "Médecin", onLogout }) {
  const [dk, setDk] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [page, setPage] = useState("dashboard");
  const c = dk ? T.dark : T.light;
  const meta = ROLE_META[role] || ROLE_META["Médecin"];

  const NAV = [
    { id: "dashboard",    label: "Dashboard"   },
    { id: "patients",     label: "Patients"    },
    { id: "agenda",       label: "Agenda"      },
    { id: "ordonnances",  label: "Ordonnances" },
    { id: "messages",     label: "Messages"    },
  ];

  return (
    <div className="min-h-screen" style={{ background: c.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", color: c.txt }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { transition: background-color 0.2s, border-color 0.2s; }
        button { cursor: pointer !important; }
        .dnav-link:not(.active-nav):hover { background: rgba(100,146,201,0.15) !important; color: #6492C9 !important; }
        @keyframes dropdownIn { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:none} }
        .pd-item { color:#64748B; background:transparent; transition:background 0.15s,color 0.15s; }
        .pd-item:hover { background:#F8FAFC; color:#1E293B; }
        .pd-item-danger { color:#EF4444; background:transparent; transition:background 0.15s; }
        .pd-item-danger:hover { background:rgba(239,68,68,0.08); }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-30 border-b shadow-sm" style={{ background: c.nav, borderColor: c.border }}>
        <div className="w-full px-6 h-[60px] flex items-center gap-3">

          {/* Logo */}
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
            <div>
              <span className="font-bold text-sm" style={{ color: c.txt }}>MedSmart</span>
              <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: meta.color + "18", color: meta.color }}>
                {meta.label}
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden lg:flex items-center justify-center gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                className={`dnav-link${page === item.id ? " active-nav" : ""} relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all`}
                style={{ color: page === item.id ? "#fff" : c.txt2, background: page === item.id ? c.blue : "transparent" }}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            {/* Dark mode */}
            <div className="flex items-center gap-1.5">
              <Sun size={14} style={{ color: dk ? c.txt3 : "#E8A838" }} />
              <button onClick={() => setDk(!dk)} className="relative rounded-full transition-all duration-300"
                style={{ width: 42, height: 24, background: dk ? "linear-gradient(135deg, #304B71, #4A6FA5)" : "#D5DEEF",
                  border: `1.5px solid ${dk ? c.blue + "80" : "#BBC8DC"}`, padding: 0 }}>
                <div className="absolute top-0.5 rounded-full bg-white shadow-md transition-all duration-300"
                  style={{ width: 18, height: 18, left: dk ? 20 : 2 }} />
              </button>
              <Moon size={13} style={{ color: dk ? c.blue : c.txt3 }} />
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:opacity-80"
                style={{ borderColor: c.border, background: "transparent" }}>
                <Bell size={16} style={{ color: c.txt2 }} />
              </button>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 flex items-center justify-center"
                style={{ borderColor: c.nav, fontSize: 7, color: "#fff", fontWeight: 800 }}>2</div>
            </div>

            {/* Profile */}
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 z-10 flex items-center justify-center"
                style={{ borderColor: c.nav, fontSize: 7, color: "#fff", fontWeight: 800, pointerEvents: "none" }}>2</div>
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:opacity-80"
                style={{ border: `1px solid ${c.border}`, background: "transparent" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}bb)` }}>KB</div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-tight" style={{ color: c.txt }}>Dr. Karim Benali</p>
                  <p className="text-xs" style={{ color: c.txt3 }}>{meta.label}</p>
                </div>
                <ChevronDown size={13} style={{ color: c.txt3 }} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-60 rounded-[20px] overflow-hidden z-50"
                  style={{ background: dk ? c.card : "#ffffff", border: `1px solid ${dk ? c.border : "#F1F5F9"}`,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)", animation: "dropdownIn 0.2s ease forwards" }}>

                  <div className="px-4 py-3 border-b" style={{ borderColor: dk ? c.border : "#F1F5F9" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}bb)` }}>KB</div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: c.txt }}>Dr. Karim Benali</p>
                        <p className="text-xs" style={{ color: c.txt3 }}>{meta.label}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-1">
                    <button className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <User size={16} /> Mon profil
                    </button>
                    <button className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Settings size={16} /> Paramètres
                    </button>
                    <div className="h-px my-1 mx-2" style={{ background: dk ? c.border : "#F1F5F9" }} />
                    <button onClick={onLogout}
                      className="pd-item-danger w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl cursor-pointer">
                      <LogOut size={16} /> Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="w-full px-6 py-6">
        {page === "dashboard" && <DoctorHomePage dk={dk} role={role} />}
        {page !== "dashboard" && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: c.blueLight }}>
              <Activity size={28} style={{ color: c.blue }} />
            </div>
            <p className="text-xl font-bold mb-2" style={{ color: c.txt }}>
              Page "{page}" — En construction
            </p>
            <p className="text-sm" style={{ color: c.txt2 }}>
              Cette section sera disponible prochainement.
            </p>
          </div>
        )}
      </main>

      {profileOpen && <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />}
    </div>
  );
}