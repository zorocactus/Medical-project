import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import {
  LayoutDashboard, Calendar, Users, FileText, Bell,
  Settings, LogOut, Menu, ChevronDown, Sun, Moon,
  Clock, CheckCircle, AlertCircle, Search, Plus,
  Activity, Stethoscope, Pill, Heart, X, ChevronRight,
  User, Shield, Clipboard, Check, Trash
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

// ─── UI Components ────────────────────────────────────────────────────────────
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

// ─── PAGE COMPONENTS ──────────────────────────────────────────────────────────

function DoctorHomePage({ dk, role, userData, stats, schedule, requests }) {
  const c = dk ? T.dark : T.light;
  const meta = ROLE_META[role] || ROLE_META["Médecin"];
  const RoleIcon = meta.icon;
  const fullName = userData ? `Dr. ${userData.last_name || ""}` : "Dr. Utilisateur";

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: c.txt }}>
            Bonjour, <span style={{ color: c.blue }}>{fullName}</span> 👋
          </h1>
          <p className="text-sm mt-0.5 flex items-center gap-2" style={{ color: c.txt2 }}>
            <RoleIcon size={14} style={{ color: meta.color }} />
            {meta.label} · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(stats || []).map(s => (
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <Card dk={dk}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold" style={{ color: c.txt }}>Rendez-vous à venir</h3>
            </div>
            <div className="space-y-3">
              {(schedule || []).length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: c.txt2 }}>Aucun rendez-vous prévu pour aujourd'hui.</p>
              ) : schedule.map(a => (
                <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:opacity-80"
                  style={{ borderColor: c.border }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: "#4A6FA5" }}>{a.patient_name?.[0] || "P"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: c.txt }}>{a.patient_name}</p>
                    <p className="text-xs truncate" style={{ color: c.txt2 }}>{a.motif}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: c.blue }}>{a.slot_start_time?.substring(0, 5) || "--:--"}</p>
                    <Badge color={c.green} bg={c.green + "18"}>Confirmé</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card dk={dk}>
            <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: c.txt3 }}>Action Requise</p>
            <div className="space-y-3">
              <p className="text-sm" style={{ color: c.txt2 }}>Vous avez <strong>{(requests || []).length}</strong> demandes en attente.</p>
              <button className="w-full py-2.5 rounded-xl text-xs font-bold text-white px-4" style={{ background: c.blue }}>Voir les demandes</button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function AgendaPage({ dk, schedule, onAction }) {
  const c = dk ? T.dark : T.light;
  const safeData = Array.isArray(schedule) ? [...schedule] : [];
  return (
    <Card dk={dk}>
      <h2 className="text-xl font-bold mb-6" style={{ color: c.txt }}>Planning du Jour</h2>
      <div className="space-y-4">
        {safeData.length === 0 ? (
          <p className="text-center py-10" style={{ color: c.txt2 }}>Votre agenda est vide.</p>
        ) : safeData.sort((a,b) => (a.slot_start_time || "").localeCompare(b.slot_start_time || "")).map(a => (
          <div key={a.id} className="flex gap-4 p-4 rounded-2xl border" style={{ borderColor: c.border }}>
            <div className="w-16 text-center shrink-0">
              <p className="text-sm font-bold" style={{ color: c.blue }}>{a.slot_start_time?.substring(0,5) || "--:--"}</p>
              <div className="h-full w-px bg-slate-200 mx-auto my-1" />
            </div>
            <div className="flex-1 flex items-start justify-between">
              <div>
                <p className="font-bold" style={{ color: c.txt }}>{a.patient_name}</p>
                <p className="text-xs" style={{ color: c.txt2 }}>Motif: {a.motif}</p>
                <div className="mt-2"><Badge color={c.blue} bg={c.blue + "11"}>RDV Médical</Badge></div>
              </div>
              <button 
                onClick={() => onAction && onAction(a.id, 'complete')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-80"
                style={{ background: c.green }}>
                Terminer le RDV
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PatientsPage({ dk, appointments }) {
  const c = dk ? T.dark : T.light;
  const safeAppts = Array.isArray(appointments) ? appointments : [];
  const uniquePatients = Array.from(new Set(safeAppts.map(a => a.patient))).map(id => {
    return safeAppts.find(a => a.patient === id);
  }).filter(Boolean);

  return (
    <Card dk={dk}>
      <h2 className="text-xl font-bold mb-6" style={{ color: c.txt }}>Mes Patients</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uniquePatients.length === 0 ? (
          <p className="col-span-full text-center py-10" style={{ color: c.txt2 }}>Aucun patient trouvé.</p>
        ) : uniquePatients.map(p => (
          <div key={p.id} className="p-4 rounded-2xl border flex flex-col items-center text-center" style={{ borderColor: c.border }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3"
              style={{ background: "#4A6FA5" }}>{p.patient_name?.[0] || "P"}</div>
            <p className="font-bold" style={{ color: c.txt }}>{p.patient_name}</p>
            <p className="text-xs mb-4" style={{ color: c.txt2 }}>Patient MedSmart</p>
            <button className="w-full py-2 rounded-xl text-xs font-bold" style={{ background: c.blueLight, color: c.blue }}>Voir Dossier</button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RequestsPage({ dk, requests, onAction }) {
  const c = dk ? T.dark : T.light;
  const safeReqs = Array.isArray(requests) ? requests : [];
  return (
    <Card dk={dk}>
      <h2 className="text-xl font-bold mb-6" style={{ color: c.txt }}>Demandes de Rendez-vous</h2>
      <div className="space-y-4">
        {safeReqs.length === 0 ? (
          <p className="text-center py-10" style={{ color: c.txt2 }}>Aucune demande en attente.</p>
        ) : safeReqs.map(r => (
          <div key={r.id} className="flex items-center gap-4 p-5 rounded-2xl border transition-all" style={{ borderColor: c.border }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 shrink-0">
               <User size={20} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold" style={{ color: c.txt }}>{r.patient_name}</p>
              <p className="text-xs" style={{ color: c.txt2 }}>{r.slot_date || "Date inconnue"} à {r.slot_start_time?.substring(0,5) || "--:--"}</p>
              <p className="text-xs mt-1" style={{ color: c.txt3 }}>Motif: {r.motif}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onAction(r.id, 'confirm')} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all">Confirmer</button>
              <button onClick={() => onAction(r.id, 'refuse')} className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all">Refuser</button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── MAIN DOCTOR DASHBOARD ────────────────────────────────────────────────────
export default function DoctorDashboard({ role = "Médecin", onLogout }) {
  const { userData } = useAuth();
  const [dk, setDk] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [page, setPage] = useState("dashboard");
  
  const [schedule, setSchedule] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const c = dk ? T.dark : T.light;
  
  // Normalisation du rôle pour l'affichage (interne)
  const displayRole = (role?.toLowerCase() === "doctor" || role === "Médecin") ? "Médecin" : 
                      (role?.toLowerCase() === "pharmacist" || role === "Pharmacien") ? "Pharmacien" :
                      (role?.toLowerCase() === "caretaker" || role === "Garde-malade") ? "Garde-malade" : "Médecin";

  const meta = ROLE_META[displayRole] || ROLE_META["Médecin"];

  const userInitials = userData ? `${userData.first_name?.[0] || ""}${userData.last_name?.[0] || ""}`.toUpperCase() : "DOC";
  const fullName = userData ? `Dr. ${userData.first_name || ""} ${userData.last_name || ""}` : "Dr. Utilisateur";

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [today, pending, all] = await Promise.all([
          api.getTodaySchedule().catch(err => { console.warn("Schedule fetch failed", err); return []; }),
          api.getPendingAppointments().catch(err => { console.warn("Pending fetch failed", err); return []; }),
          api.getDoctorAppointments().catch(err => { console.warn("All appointments fetch failed", err); return [] })
        ]);
        setSchedule(Array.isArray(today) ? today : []);
        setPendingRequests(Array.isArray(pending) ? pending : []);
        setAppointments(Array.isArray(all) ? all : []);
      } catch (err) {
        console.error("Critical error in fetchData:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleRequestAction = async (id, action) => {
    try {
      if (action === 'confirm') await api.confirmAppointment(id);
      else if (action === 'refuse') await api.refuseAppointment(id);
      else if (action === 'complete') await api.completeAppointment(id);

      const [pending, today] = await Promise.all([
        api.getPendingAppointments().catch(() => []),
        api.getTodaySchedule().catch(() => [])
      ]);
      setPendingRequests(Array.isArray(pending) ? pending : []);
      setSchedule(Array.isArray(today) ? today : []);
    } catch (err) {
      alert("Action échouée: " + err.message);
    }
  };

  const NAV = [
    { id: "dashboard",    label: "Dashboard"   },
    { id: "patients",     label: "Patients"    },
    { id: "agenda",       label: "Agenda"      },
    { id: "requests",     label: "Requests"    },
  ];

  const stats = [
    { label: "Aujourd'hui", value: (schedule || []).length, icon: Calendar, color: "#4A6FA5" },
    { label: "En attente", value: (pendingRequests || []).length, icon: Bell, color: "#E8A838" },
    { label: "Total Patients", value: new Set((appointments || []).map(a => a.patient)).size, icon: Users, color: "#2D8C6F" },
    { label: "Alertes", value: 0, icon: AlertCircle, color: "#E05555" },
  ];

  const renderPage = () => {
    const props = { 
      dk, 
      role: displayRole, 
      userData, 
      stats, 
      schedule: Array.isArray(schedule) ? schedule : [], 
      appointments: Array.isArray(appointments) ? appointments : [], 
      requests: Array.isArray(pendingRequests) ? pendingRequests : [], 
      onAction: handleRequestAction 
    };

    switch (page) {
      case "dashboard": return <DoctorHomePage {...props} />;
      case "agenda":    return <AgendaPage {...props} />;
      case "patients":  return <PatientsPage {...props} />;
      case "requests":  return <RequestsPage {...props} />;
      default: return <DoctorHomePage {...props} />;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: c.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", color: c.txt }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { transition: background-color 0.2s, border-color 0.2s; }
        button { cursor: pointer !important; }
        .dnav-link:not(.active-nav):hover { background: rgba(100,146,201,0.15) !important; color: #6492C9 !important; }
        @keyframes dropdownIn { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:none} }
        .pd-item { color:#64748B; background:transparent; transition:background 0.15s,color 0.15s; }
        .pd-item:hover { background:${dk ? "rgba(255,255,255,0.05)" : "rgba(100,146,201,0.08)"}; color:${dk ? "#F0F3FA" : "#1E293B"}; }
        .pd-item-danger { color:#EF4444; background:transparent; transition:background 0.15s; }
        .pd-item-danger:hover { background:rgba(239,68,68,0.08); }
      `}</style>

      <nav className="sticky top-0 z-30 border-b shadow-sm" style={{ background: c.nav, borderColor: c.border }}>
        <div className="w-full px-6 h-[60px] flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0 mr-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #304B71, #6492C9)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="20" rx="2" fill="white" opacity="0.95"/>
                <rect x="2" y="9" width="20" height="6" rx="2" fill="white" opacity="0.95"/>
                <path d="M4 14 L6 10 L8 13 L10 7 L12 15 L14 11 L16 13 L18 11"
                  stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
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

          <div className="hidden lg:flex items-center justify-center gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                className={`dnav-link${page === item.id ? " active-nav" : ""} relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all`}
                style={{ color: page === item.id ? "#fff" : c.txt2, background: page === item.id ? c.blue : "transparent" }}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 ml-auto shrink-0">
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

            <div className="relative">
              <button className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:opacity-80"
                style={{ borderColor: c.border, background: "transparent" }}>
                <Bell size={16} style={{ color: c.txt2 }} />
              </button>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 flex items-center justify-center"
                style={{ borderColor: c.nav, fontSize: 7, color: "#fff", fontWeight: 800 }}>{pendingRequests.length}</div>
            </div>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:opacity-80"
                style={{ border: `1px solid ${c.border}`, background: "transparent" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}bb)` }}>{userInitials}</div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-tight" style={{ color: c.txt }}>{fullName}</p>
                  <p className="text-xs" style={{ color: c.txt3 }}>{meta.label}</p>
                </div>
                <ChevronDown size={13} style={{ color: c.txt3 }} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-60 rounded-[20px] overflow-hidden z-50 transition-all"
                  style={{ background: dk ? c.card : "#ffffff", border: `1px solid ${dk ? c.border : "#F1F5F9"}`,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)", animation: "dropdownIn 0.2s ease forwards" }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: dk ? c.border : "#F1F5F9" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}bb)` }}>{userInitials}</div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: c.txt }}>{fullName}</p>
                        <p className="text-xs" style={{ color: c.txt3 }}>{meta.label}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <button className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer shadow-none">
                      <User size={16} /> Mon profil
                    </button>
                    <button className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer shadow-none">
                      <Settings size={16} /> Paramètres
                    </button>
                    <div className="h-px my-1 mx-2" style={{ background: dk ? c.border : "#F1F5F9" }} />
                    <button onClick={onLogout}
                      className="pd-item-danger w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl cursor-pointer shadow-none">
                      <LogOut size={16} /> Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full px-6 py-6">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-32">
             <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
             <p className="text-sm font-medium" style={{ color: c.txt2 }}>Chargement des données...</p>
           </div>
        ) : renderPage()}
      </main>

      {profileOpen && <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />}
    </div>
  );
}