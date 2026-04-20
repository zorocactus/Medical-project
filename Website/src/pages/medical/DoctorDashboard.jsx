import { useState, useEffect, useRef, useMemo } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
import DashSelect from "../../components/ui/DashSelect";
import { ParticlesHero } from '../../components/backgrounds/MedParticles';
import { T } from "../_shared/theme";
import {
  Users,
  User,
  FileText,
  Star,
  Bell,
  Moon,
  Sun,
  Check,
  X,
  ChevronDown,
  Search,
  Plus,
  Activity,
  LogOut,
  Settings,
  Menu,
  Calendar,
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
  ArrowLeft,
  Send,
  Trash2,
  MapPin,
  Link as LinkIcon,
  Download,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import * as api from "../../services/api";
import WeekCalendar from "../../components/medical/WeekCalendar";
import { format, isSameDay } from "date-fns";

// ============================================================================
// CONSTANTES & UTILITAIRES MUTUALISÉS
// ============================================================================

const AVATAR_COLORS = [
  "#6492C9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#3B82F6",
  "#6366F1",
];
const PAGE_SIZE = 6;
const FREQUENCY_OPTIONS = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "As needed",
];

const DAYS = [
  { day: "Lun" },
  { day: "Mar" },
  { day: "Mer" },
  { day: "Jeu" },
  { day: "Ven" },
  { day: "Sam" },
  { day: "Dim" },
];

function getInitials(a = "", b = "") {
  return `${a[0] || ""}${b[0] || ""}`.toUpperCase();
}

// ─── Reusable components ──────────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk, empty = false }) {
  const c = dk ? T.dark : T.light;
  const hoverClasses = empty
    ? ""
    : "transition-transform duration-200 hover:scale-[1.02]";
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border ${hoverClasses} ${className}`}
      style={{ background: c.card, borderColor: c.border, ...style }}
    >
      {children}
    </div>
  );
}

function Badge({ color, bg, children, className = "" }) {
  return (
    <span
      className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full border ${className}`}
      style={{ color, background: bg, borderColor: color + "44" }}
    >
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, trend, dk }) {
  const c = dk ? T.dark : T.light;
  return (
    <Card dk={dk} style={{ padding: 18 }}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: color + "18" }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div
            className="flex items-center gap-1 text-xs font-bold"
            style={{
              color:
                trend.startsWith("+") || !trend.includes("-")
                  ? "#2D8C6F"
                  : "#E05555",
            }}
          >
            {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold" style={{ color: c.txt }}>
        {value}
      </p>
      <p className="text-sm font-semibold mt-0.5" style={{ color: c.txt2 }}>
        {label}
      </p>
      {sub && (
        <p className="text-xs mt-0.5" style={{ color: c.txt3 }}>
          {sub}
        </p>
      )}
    </Card>
  );
}

// ─── NEW COMPONENT : TODAYS SCHEDULE ──────────────────────────────────────────
function TodaysSchedule({ appointments = [], onStartConsultation }) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;
  const { t } = useLanguage();
  const [startingId, setStartingId] = useState(null);
  const [startErrors, setStartErrors] = useState({});

  const defaultData = [
    { id: 1, time: "08:00", name: "Ahmed Meziane", type: "In-Person", status: "confirmed" },
    { time: "09:00", type: "empty" },
    { id: 2, time: "10:00", name: "Nadia Khelifa", type: "Teleconsultation", status: "confirmed" },
    { id: 3, time: "10:30", name: "Alex Johnson", type: "In-Person", status: "scheduled" },
    { time: "11:30", type: "empty" },
    { id: 4, time: "14:00", name: "Youcef Belaid", type: "Home Visit", status: "confirmed" },
    { id: 5, time: "15:30", name: "Sara Ait", type: "In-Person", status: "scheduled" },
    { time: "17:00", type: "empty" },
  ];

  // Defensive array handling
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const data = safeAppointments.length > 0 ? safeAppointments : defaultData;
  const count = data.filter((a) => a.type !== "empty").length;

  const getTypeStyles = (type) => {
    const t = type?.toLowerCase() || "";
    if (
      t.includes("in-person") ||
      t.includes("person") ||
      t.includes("clinic")
    ) {
      return dk
        ? "bg-[#7F77DD]/10 border-[#7F77DD] text-[#A59FEC]"
        : "bg-[#EEF2FB] border-[#7F77DD] text-[#3C3489]";
    }
    if (t.includes("tele")) {
      return dk
        ? "bg-[#1D9E75]/10 border-[#1D9E75] text-[#5ECEA3]"
        : "bg-[#EAF5EE] border-[#1D9E75] text-[#085041]";
    }
    if (t.includes("home") || t.includes("visite")) {
      return dk
        ? "bg-[#EF9F27]/10 border-[#EF9F27] text-[#F4BC6B]"
        : "bg-[#FEF6E4] border-[#EF9F27] text-[#633806]";
    }
    return "";
  };

  return (
    <div
      className={`border rounded-xl p-5 shadow-sm transition-all duration-300 ${
        dk ? "bg-[#141B27] border-[#638ECB]/20" : "bg-white border-[#E4EAF5]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-lg font-bold ${dk ? "text-[#F0F3FA]" : "text-[#0D1B2E]"}`}
        >
          {t('dashboard.doctor.schedule.title')}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            dk
              ? "bg-[#638ECB]/10 text-[#8AAEE0] border-[#4A6FA5]/20"
              : "bg-[#EEF2FB] text-[#4A6FA5] border-[#4A6FA5]/20"
          }`}
        >
          {t('dashboard.doctor.schedule.appointmentsCount', { count })}
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {data.map((item, idx) => {
          // Normalize field names: API returns patient_name + start_time; mock uses name/patient + time
          const displayName = item.patient_name || item.name || item.patient || "—";
          const displayTime = item.time || (item.start_time ? item.start_time.slice(0, 5) : "");
          const displayType = item.type || item.motif || "Consultation";
          const itemStatus  = item.status?.toLowerCase() || "";
          return (
          <div key={idx} className="flex items-start gap-4">
            {/* Time Column */}
            <div className="w-12 shrink-0 py-2">
              <span
                className={`text-sm font-bold ${dk ? "text-[#8AAEE0]" : "text-[#5A6E8A]"}`}
              >
                {displayTime}
              </span>
            </div>

            {/* Entry Column */}
            <div className="flex-1">
              {displayType === "empty" ? (
                <div className="h-full flex items-center min-h-[40px]">
                  <div
                    className={`w-full border-b border-dashed ${dk ? "border-[#638ECB]/20" : "border-[#E4EAF5]"}`}
                  />
                </div>
              ) : (
                <div
                  className={`py-3 px-4 border-l-[3px] rounded-r-lg shadow-sm transition-all hover:translate-x-1 ${getTypeStyles(displayType)}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold truncate">
                      {displayName}{" "}
                      <span className="mx-1 opacity-40">·</span> {displayType}
                    </p>
                    {onStartConsultation && (itemStatus === "confirmed" || itemStatus === "scheduled") && (
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <button
                          disabled={startingId === item.id}
                          onClick={async () => {
                            setStartingId(item.id);
                            setStartErrors((p) => ({ ...p, [item.id]: null }));
                            try {
                              const updated = await api.startConsultation(item.id);
                              onStartConsultation(updated || { ...item, status: "in_progress" });
                            } catch (err) {
                              setStartErrors((p) => ({ ...p, [item.id]: err.message || "Erreur" }));
                              setStartingId(null);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                          style={{ background: c.blue }}
                        >
                          {startingId === item.id ? (
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                          ) : "▶"} {t('dashboard.doctor.consultation.start')}
                        </button>
                        {startErrors[item.id] && (
                          <p className="text-xs font-semibold mt-1 px-2 py-1 rounded-lg" style={{ color: c.red, background: c.red + "15" }}>{startErrors[item.id]}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── NEW COMPONENT : PATIENT REQUESTS ─────────────────────────────────────────

const MOCK_REQUESTS = [
  {
    id: 101,
    initials: "MK",
    name: "Meriem Kaci",
    detail: "First visit",
    date: "Oct 26",
    time: "09:45",
    color: "bg-[#6492C9]",
    status: "confirmed",
  },
  {
    id: 102,
    initials: "RB",
    name: "Riad Bensalem",
    detail: "Follow-up",
    date: "Oct 27",
    time: "14:30",
    color: "bg-[#3DAA73]",
    status: "scheduled",
  },
  {
    id: 103,
    initials: "LB",
    name: "Lynda Boudaoud",
    detail: "First visit",
    date: "Oct 28",
    time: "11:00",
    color: "bg-[#F0A500]",
    status: "confirmed",
  },
];

function PatientRequests({ requests = MOCK_REQUESTS, onStartConsultation }) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;
  const { t } = useLanguage();
  const [startingId, setStartingId] = useState(null);
  const [startErrors, setStartErrors] = useState({});
  const safeRequests =
    Array.isArray(requests) && requests.length > 0 ? requests : MOCK_REQUESTS;

  return (
    <div
      className={`border rounded-xl p-5 shadow-sm h-full transition-all duration-300 ${
        dk ? "bg-[#141B27] border-[#638ECB]/20" : "bg-white border-[#E4EAF5]"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[16px] font-bold" style={{ color: c.txt }}>
          {t('dashboard.doctor.patients.requests')}
        </h2>
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
            dk
              ? "bg-amber-900/20 text-amber-500 border-amber-800/30"
              : "bg-amber-50 text-amber-600 border-amber-200"
          }`}
        >
          {safeRequests.length} {t('dashboard.doctor.patients.pending')}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {safeRequests.map((req, idx) => (
          <div key={idx} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold ${req.color || "bg-[#6492C9]"}`}
              >
                {req.initials}
              </div>
              <div>
                <div
                  className="text-[13px] font-bold leading-tight"
                  style={{ color: c.txt }}
                >
                  {req.name}
                </div>
                <div
                  className="text-[11.5px] font-medium mt-0.5"
                  style={{ color: c.txt3 }}
                >
                  {req.detail}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-3">
                {/* Requested Slot Badge */}
                <div
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                    dk
                      ? "bg-[#1A2333]/50 border-[#638ECB]/15 text-[#8AAEE0]"
                      : "bg-[#EEF3FB] border-[#E4EAF5] text-[#4A6FA5]"
                  }`}
                >
                  <Clock size={12} strokeWidth={2.5} />
                  <span className="text-[11px] font-bold whitespace-nowrap">
                    {req.date} · {req.time}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all hover:bg-emerald-500 hover:text-white ${
                      dk
                        ? "bg-emerald-900/20 text-emerald-400 border-emerald-800/30"
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}
                    title="Accept"
                  >
                    <Check size={16} strokeWidth={2.5} />
                  </button>
                  <button
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all hover:bg-red-500 hover:text-white ${
                      dk
                        ? "bg-red-900/20 text-red-400 border-red-800/30"
                        : "bg-red-50 text-red-500 border-red-100"
                    }`}
                    title="Decline"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SUB-VIEW : DASHBOARD HOME
// ============================================================================

function DashboardHome({
  onNavigate,
  patients,
  appointments,
  patientRequests,
  onStartConsultation,
}) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;
  const { t } = useLanguage();

  const kpis = [
    {
      label: t('dashboard.doctor.kpis.todaysConsultations'),
      value: Array.isArray(appointments) ? appointments.length : 0,
      icon: Users,
      color: c.green,
    },
    {
      label: t('dashboard.doctor.kpis.totalPatients'),
      value: Array.isArray(patients) ? patients.length : 0,
      icon: User,
      color: c.blue,
    },
    {
      label: t('dashboard.doctor.kpis.pendingRequests'),
      value: Array.isArray(patientRequests) ? patientRequests.length : 0,
      icon: Clock,
      color: c.amber,
    },
    { label: t('dashboard.doctor.kpis.avgRating'), value: "4.8", icon: Star, color: c.purple },
  ];

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMin = currentTime.getMinutes();

  const isPast = (timeStr) => {
    if (!timeStr) return false;
    const [h, m] = timeStr.split(":").map(Number);
    if (h < currentHour) return true;
    if (h === currentHour && m < currentMin) return true;
    return false;
  };

  const scheduleItems =
    Array.isArray(appointments) && appointments.length > 0
      ? appointments
      : [
          {
            id: 1,
            time: "08:30",
            patient: "Mounir Benali",
            type: "in-person",
            status: "Completed",
            detail: "Monthly Checkup",
          },
          {
            id: 2,
            time: "10:15",
            patient: "Sonia Ghomari",
            type: "tele",
            status: "confirmed",
            detail: "Follow-up",
          },
          {
            id: 3,
            time: "11:00",
            patient: "Karim Brahimi",
            type: "in-person",
            status: "scheduled",
            detail: "New Consultation",
          },
          {
            id: 4,
            time: "14:30",
            patient: "Amel Ziani",
            type: "tele",
            status: "confirmed",
            detail: "Results Analysis",
          },
        ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpis.map((k, i) => (
          <StatCard
            key={i}
            dk={dk}
            label={k.label}
            value={k.value}
            icon={k.icon}
            color={k.color}
            trend={k.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {/* Le planning du jour ici */}
          <TodaysSchedule appointments={scheduleItems} onStartConsultation={onStartConsultation} />
        </div>
        <div className="lg:col-span-1">
          {/* Les requêtes en attente ici */}
          <PatientRequests requests={patientRequests} onStartConsultation={onStartConsultation} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-VIEW : SCHEDULE
// ============================================================================

function ScheduleView({ dk, onStartConsultation }) {
  const c = dk ? T.dark : T.light;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("week"); // "week" | "month"
  const [successBanner, setSuccessBanner] = useState(false);
  const { appointments = [], patientRequests = [] } = useData();

  const handleStartConsultation = (appointment) => {
    setSuccessBanner(true);
    setTimeout(() => setSuccessBanner(false), 4000);
    setTimeout(() => {
      if (onStartConsultation) onStartConsultation(appointment);
    }, 800);
  };

  // MOCK DATA if needed
  const SAMPLE = [
    {
      id: 1,
      time: "08:00",
      name: "Ahmed Meziane",
      type: "in-person",
      date: format(new Date(), "yyyy-MM-dd"),
      status: "confirmed",
    },
    {
      id: 2,
      time: "08:45",
      name: "Meriem Kaci",
      type: "in-person",
      date: format(new Date(), "yyyy-MM-dd"),
      status: "scheduled",
    },
    {
      id: 3,
      time: "10:00",
      name: "Nadia Khelifa",
      type: "tele",
      date: format(new Date(), "yyyy-MM-dd"),
      status: "confirmed",
    },
    { time: "12:00", type: "break" },
  ];

  const allAppointments =
    Array.isArray(appointments) && appointments.length > 0
      ? appointments
      : SAMPLE;
  const pending = Array.isArray(patientRequests) ? patientRequests : [];

  // Filter appointments for the selected date
  const filteredAppointments = allAppointments.filter((app) => {
    if (app.type === "break") return true; // Keep breaks for daily view logic if needed
    if (!app.date) return false;
    try {
      return isSameDay(new Date(app.date), selectedDate);
    } catch (e) {
      return false;
    }
  });

  // Calculate appointment counts for the WeekCalendar
  const appointmentCounts = useMemo(() => {
    const counts = {};
    allAppointments.forEach((app) => {
      if (app.date) {
        const d = format(new Date(app.date), "yyyy-MM-dd");
        counts[d] = (counts[d] || 0) + 1;
      }
    });
    return counts;
  }, [allAppointments]);

  const handleSlotCreated = (_slot) => {
    // Potential integration: api.createSlot(_slot).then(...)
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Success banner */}
      {successBanner && (
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-xl border font-semibold text-sm animate-in fade-in duration-300"
          style={{ background: c.green + "18", borderColor: c.green + "44", color: c.green }}
        >
          <Check size={16} />
          {t('consultation_started_msg')}
        </div>
      )}

      {/* Dynamic Week Calendar */}
      <WeekCalendar
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
        appointmentCounts={appointmentCounts}
        view={view}
        onViewChange={(v) => setView(v)}
        onSlotCreated={handleSlotCreated}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {/* Le planning du jour filtré */}
          <TodaysSchedule
            appointments={filteredAppointments}
            onStartConsultation={onStartConsultation ? handleStartConsultation : undefined}
          />
        </div>
        <div className="lg:col-span-1">
          {/* Les requêtes en attente ici */}
          <PatientRequests
            requests={pending}
            onStartConsultation={onStartConsultation ? handleStartConsultation : undefined}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-VIEW : PATIENTS
// ============================================================================

function PatientsView({ onSelectPatient }) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;
  const { t } = useLanguage();

  const { patients = [] } = useData();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);

  // ── Add Patient Modal state ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: "", lastName: "", age: "", condition: "", status: "",
  });
  const [addedPatients, setAddedPatients] = useState([]);

  const CONDITION_OPTIONS = ["Diabetes", "Hypertension", "Stable", "Recovering", "Critical", "Checkup"];
  const STATUS_OPTIONS = ["Active", "Pending", "Critical"];


  const handleSavePatient = () => {
    if (!newPatient.firstName.trim() || !newPatient.lastName.trim()) return;
    const p = {
      ...newPatient,
      age: parseInt(newPatient.age) || 0,
      lastVisit: new Date().toISOString().slice(0, 10),
      nextAppt: "—",
      status: newPatient.status || "Active",
    };
    setAddedPatients((prev) => [p, ...prev]);
    setNewPatient({ firstName: "", lastName: "", age: "", condition: "", status: "" });
    setShowAddModal(false);
    setPage(1);
  };

  const defaultFallback = [
    { firstName: "Ahmed", lastName: "Meziane", age: 45, condition: "Diabetes Type 2", lastVisit: "2023-11-12", nextAppt: "Today at 10:00" },
    { firstName: "Nadia", lastName: "Khelifa", age: 32, condition: "Hypertension", lastVisit: "2023-10-05", nextAppt: "Tomorrow at 14:30" },
    { firstName: "Alex", lastName: "Johnson", age: 58, condition: "Stable", lastVisit: "2023-12-01", nextAppt: "In 2 days" },
    { firstName: "Youcef", lastName: "Belaid", age: 29, condition: "Recovering", lastVisit: "2023-11-20", nextAppt: "Next Monday" },
    { firstName: "Sara", lastName: "Ait", age: 39, condition: "Checkup", lastVisit: "2023-11-15", nextAppt: "Today at 11:30" },
    { firstName: "Meriem", lastName: "Kaci", age: 50, condition: "Critical", lastVisit: "2023-12-05", nextAppt: "Immediate" }
  ];

  const base = (Array.isArray(patients) && patients.length > 0) ? patients : defaultFallback;
  const safe = [...addedPatients, ...base];
  const filtered = safe.filter((p) =>
    `${p.firstName || ""} ${p.lastName || ""} ${p.condition || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getBadgeProps = (label) => {
    const l = label.toLowerCase();
    if (l.includes("diabetes") || l.includes("hypertension"))
      return { color: c.red, bg: c.red + "15" };
    if (l.includes("active") || l.includes("stable"))
      return { color: c.green, bg: c.green + "15" };
    if (l.includes("critical")) return { color: c.red, bg: c.red + "25" };
    if (l.includes("pending")) return { color: c.amber, bg: c.amber + "15" };
    return { color: c.blue, bg: c.blue + "15" };
  };

  return (
    <div className="animate-in fade-in duration-500">

      {/* ── Add Patient Modal ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.50)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div
            className="w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden"
            style={{ background: dk ? "#141B27" : "#fff", borderColor: c.border }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: c.border }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.blue + "18" }}>
                  <Plus size={18} style={{ color: c.blue }} />
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{ color: c.txt }}>{t('dashboard.doctor.consultation.newPatient')}</h3>
                  <p className="text-xs" style={{ color: c.txt3 }}>{t('dashboard.doctor.consultation.fillPatientInfo')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
                style={{ background: c.bg }}
              >
                <X size={16} style={{ color: c.txt3 }} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {/* Prénom */}
                <div className="relative">
                  <span className="absolute -top-2.5 left-3 px-1 text-[11px] font-medium" style={{ color: c.txt3, background: dk ? "#141B27" : "#fff" }}>{t('dashboard.doctor.patients.firstName')}</span>
                  <input
                    type="text"
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="Ahmed"
                    className="w-full px-3 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={{ borderColor: c.border, background: dk ? "#0D1117" : "#fff", color: c.txt }}
                  />
                </div>
                {/* Nom */}
                <div className="relative">
                  <span className="absolute -top-2.5 left-3 px-1 text-[11px] font-medium" style={{ color: c.txt3, background: dk ? "#141B27" : "#fff" }}>{t('dashboard.doctor.patients.lastName')}</span>
                  <input
                    type="text"
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="Meziane"
                    className="w-full px-3 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={{ borderColor: c.border, background: dk ? "#0D1117" : "#fff", color: c.txt }}
                  />
                </div>
              </div>

              {/* Age field */}
              <div className="relative">
                <span className="absolute -top-2.5 left-3 px-1 text-[11px] font-medium" style={{ color: c.txt3, background: dk ? "#141B27" : "#fff" }}>{t('dashboard.doctor.patients.colAge')}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={newPatient.age}
                  onKeyDown={(e) => {
                    const allowed = ["Backspace","Delete","Tab","ArrowLeft","ArrowRight","Home","End"];
                    if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault();
                  }}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    if (onlyNumbers.length <= 3) {
                      setNewPatient((p) => ({ ...p, age: onlyNumbers }));
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 3);
                    setNewPatient((p) => ({ ...p, age: pasted }));
                  }}
                  placeholder="35"
                  className="w-full px-3 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: c.border, background: dk ? "#0D1117" : "#fff", color: c.txt }}
                />
              </div>



              <DashSelect
                label={t('dashboard.doctor.patients.colCondition')}
                value={newPatient.condition}
                options={CONDITION_OPTIONS}
                onSelect={v => setNewPatient(p => ({ ...p, condition: v }))}
                dk={dk}
                c={c}
              />

              <DashSelect
                label={t('dashboard.doctor.patients.colStatus')}
                value={newPatient.status}
                options={STATUS_OPTIONS}
                onSelect={v => setNewPatient(p => ({ ...p, status: v }))}
                dk={dk}
                c={c}
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={handleSavePatient}
                disabled={!newPatient.firstName.trim() || !newPatient.lastName.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${c.blue}, #304B71)` }}
              >
                <Check size={16} /> {t('dashboard.doctor.patients.save')}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: c.border, color: c.txt2 }}
              >
                {t('dashboard.doctor.patients.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-10">
        <div
          className="relative flex-1 flex items-center px-5 py-2 rounded-2xl border transition-all duration-300"
          style={{
            borderColor: searchFocused ? "#6492C9" : c.border,
            background: c.card,
            boxShadow: searchFocused
              ? "0 0 0 4px rgba(100,146,201,0.15)"
              : "none",
            minHeight: 56,
          }}
        >
          <Search
            size={20}
            className="mr-3 transition-colors"
            style={{ color: searchFocused ? "#6492C9" : c.txt3 }}
          />
          <input
            type="text"
            placeholder={t('dashboard.doctor.patients.searchPh')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-full bg-transparent border-none outline-none text-[.9rem] font-medium placeholder:text-[#9AACBE]"
            style={{ color: c.txt }}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2.5 rounded-2xl text-white text-[15px] font-bold flex items-center gap-2 transition-transform hover:scale-105 shrink-0"
          style={{ background: c.blue, boxShadow: `0 4px 12px ${c.blue}44`, minHeight: 56 }}
        >
          <Plus size={18} /> {t('dashboard.doctor.patients.addPatient')}
        </button>
      </div>

      <Card dk={dk} empty={true} className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: c.bg }}
            >
              <Search size={24} style={{ color: c.txt3 }} />
            </div>
            <p className="font-bold mb-1" style={{ color: c.txt }}>
              {search ? t('dashboard.doctor.patients.noResults', { search }) : t('dashboard.doctor.patients.noPatientsYet')}
            </p>
            <p className="text-sm" style={{ color: c.txt3 }}>
              {t('dashboard.doctor.patients.refineSearch')}
            </p>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-[2.5fr_0.8fr_1.5fr_1fr_1.3fr_1.2fr_1fr] px-6 py-4 border-b font-bold text-[11px] uppercase tracking-wider"
              style={{
                background: c.bg + "66",
                borderColor: c.border,
                color: c.txt3,
              }}
            >
              {[
                t('dashboard.doctor.patients.colPatient'),
                t('dashboard.doctor.patients.colAge'),
                t('dashboard.doctor.patients.colCondition'),
                t('dashboard.doctor.patients.colLastVisit'),
                t('dashboard.doctor.patients.colNextAppt'),
                t('dashboard.doctor.patients.colStatus'),
                t('dashboard.doctor.patients.colAction'),
              ].map((col) => (
                <span key={col}>{col}</span>
              ))}
            </div>
            <div className="divide-y" style={{ borderColor: c.border }}>
              {paginated.map((p, idx) => {
                const fi = (page - 1) * PAGE_SIZE + idx;
                const age =
                  p.age ||
                  (p.birthDate
                    ? new Date().getFullYear() -
                      new Date(p.birthDate).getFullYear()
                    : "—");
                const condB = getBadgeProps(p.condition || "Stable");
                const statB = getBadgeProps(p.status || "Active");
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-[2.5fr_0.8fr_1.5fr_1fr_1.3fr_1.2fr_1fr] px-6 py-4 items-center cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                    style={{ background: "transparent" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
                        style={{
                          backgroundColor:
                            AVATAR_COLORS[fi % AVATAR_COLORS.length],
                        }}
                      >
                        {getInitials(p.firstName, p.lastName)}
                      </div>
                      <div>
                        <p
                          className="font-bold text-[14px]"
                          style={{ color: c.txt }}
                        >
                          {`${p.firstName || ""} ${p.lastName || ""}`.trim() ||
                            "Patient"}
                        </p>
                        <p
                          className="text-[11px] font-medium"
                          style={{ color: c.txt3 }}
                        >
                          {p.id || `#${String(fi + 1000)}`}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-[14px] font-medium"
                      style={{ color: c.txt2 }}
                    >
                      {age}
                    </span>
                    <div>
                      <Badge color={condB.color} bg={condB.bg}>
                        {p.condition || "—"}
                      </Badge>
                    </div>
                    <span
                      className="text-[14px] font-medium"
                      style={{ color: c.txt2 }}
                    >
                      {p.lastVisit || "—"}
                    </span>
                    <span
                      className="text-[14px] font-bold"
                      style={{
                        color: (p.nextAppt || "")
                          .toLowerCase()
                          .startsWith("today")
                          ? c.blue
                          : c.txt2,
                      }}
                    >
                      {p.nextAppt || "—"}
                    </span>
                    <div>
                      <Badge color={statB.color} bg={statB.bg}>
                        {p.status || "Active"}
                      </Badge>
                    </div>
                    <button
                      onClick={() => onSelectPatient?.(p)}
                      className="px-4 py-1.5 rounded-xl border text-[13px] font-bold transition-all hover:bg-opacity-10"
                      style={{ color: c.blue, borderColor: c.blue }}
                    >
                      {t('dashboard.doctor.patients.consult')}
                    </button>
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div
                className="flex items-center justify-between px-6 py-4 border-t"
                style={{ borderColor: c.border }}
              >
                <p className="text-xs font-medium" style={{ color: c.txt3 }}>
                  {t('dashboard.doctor.patients.page', { page, total: totalPages })}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg text-xs font-bold border transition-all disabled:opacity-30 hover:bg-opacity-5"
                    style={{
                      color: c.txt2,
                      borderColor: c.border,
                      background: c.card,
                    }}
                  >
                    {t('dashboard.doctor.patients.previous')}
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg text-xs font-bold border transition-all disabled:opacity-30 hover:bg-opacity-5"
                    style={{
                      color: c.txt2,
                      borderColor: c.border,
                      background: c.card,
                    }}
                  >
                    {t('dashboard.doctor.patients.next')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

// ============================================================================
// SUB-VIEW : PRESCRIPTIONS
// ============================================================================

function PrescriptionsView() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;
  const { t } = useLanguage();

  const { patients = [], prescriptions = [], addPrescription } = useData();
  const [form, setForm] = useState({
    patientName: "",
    medication: "",
    strength: "",
    dosage: "",
    frequency: "Once daily",
    duration: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (name === "patientName") {
      setShowPatientSuggestions(true);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const err = {};
    if (!form.patientName?.trim()) err.patientName = t('dashboard.doctor.prescription.required');
    if (!form.medication.trim()) err.medication = t('dashboard.doctor.prescription.required');
    if (!form.dosage.trim()) err.dosage = t('dashboard.doctor.prescription.required');
    if (!form.duration.trim()) err.duration = t('dashboard.doctor.prescription.required');
    if (Object.keys(err).length > 0) return setErrors(err);
    if (typeof addPrescription === "function") {
      addPrescription({
        id: `#RX${String((Array.isArray(prescriptions) ? prescriptions.length : 0) + 1001).padStart(4, "0")}`,
        patientName: form.patientName,
        ...form,
        date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        status: "Active",
      });
    }
    setForm({
      patientName: "",
      medication: "",
      strength: "",
      dosage: "",
      frequency: "Once daily",
      duration: "",
      notes: "",
    });
    setSuccess(t('dashboard.doctor.prescription.created'));
    setTimeout(() => setSuccess(""), 3000);
  };

  const rxList = Array.isArray(prescriptions) ? prescriptions : [];

  const fallbackPatients = [
    { name: "Ahmed Meziane" },
    { name: "Nadia Khelifa" },
    { name: "Alex Johnson" },
    { name: "Youcef Belaid" },
    { name: "Sara Ait" },
    { name: "Meriem Kaci" },
    { name: "Riad Bensalem" },
    { name: "Lynda Boudaoud" }
  ];
  const safePatients = Array.isArray(patients) && patients.length > 0 ? patients : fallbackPatients;
  const filteredPatients = form.patientName
    ? safePatients.filter((p) =>
        (p.name || p.patient || "").toLowerCase().startsWith(form.patientName.toLowerCase())
      )
    : safePatients;

  const inputStyle = {
    background: "transparent",
    border: "none",
    outline: "none",
    color: c.txt,
  };

  const FieldWrapper = ({ name, label, children, error }) => {
    const isFocused = focusedField === name;
    return (
      <div className="space-y-2">
        <label
          className="text-[13px] font-bold uppercase tracking-wider ml-1"
          style={{ color: c.txt3 }}
        >
          {label || name.charAt(0).toUpperCase() + name.slice(1)}
        </label>
        <label
          className="relative flex items-center px-5 rounded-2xl border transition-all duration-300 cursor-text"
          style={{
            borderColor: error ? c.red : isFocused ? "#6492C9" : c.border,
            background: dk ? c.bg + "22" : "#F8FAFC",
            boxShadow: isFocused ? "0 0 0 4px rgba(100,146,201,0.1)" : "none",
            minHeight: 56,
          }}
        >
          {children}
        </label>
        {error && (
          <p className="text-xs font-bold ml-1" style={{ color: c.red }}>
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      {success && (
        <div
          className="mb-5 px-4 py-3 rounded-xl border flex items-center gap-2"
          style={{ background: c.green + "15", borderColor: c.green + "44" }}
        >
          <Check size={16} style={{ color: c.green }} />
          <p className="text-sm font-bold" style={{ color: c.green }}>
            {success}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card dk={dk} className="lg:col-span-2 p-8">
          <h2 className="text-[17px] font-bold mb-8" style={{ color: c.txt }}>
            {t('dashboard.doctor.prescription.writeNew')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldWrapper
              name="patientName"
              label={t('dashboard.doctor.prescription.patientNameLabel')}
              error={errors.patientName}
            >
              <div className="relative w-full">
                <input
                  type="text"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  onFocus={() => {
                    setFocusedField("patientName");
                    setShowPatientSuggestions(true);
                  }}
                  onBlur={() => {
                    setFocusedField(null);
                    setTimeout(() => setShowPatientSuggestions(false), 200);
                  }}
                  placeholder={t('dashboard.doctor.prescription.patientNamePh')}
                  className="w-full h-full py-4 bg-transparent border-none outline-none text-sm font-semibold"
                  style={{ color: c.txt }}
                  autoComplete="off"
                />
                
                {showPatientSuggestions && form.patientName.length > 0 && filteredPatients.length > 0 && (
                  <div
                    className="absolute top-1/2 translate-y-6 left-0 right-0 mt-3 rounded-2xl border shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden max-h-60 overflow-y-auto"
                    style={{ background: c.card, borderColor: c.border }}
                  >
                    {filteredPatients.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setForm((prev) => ({ ...prev, patientName: p.name || p.patient || "" }));
                          setShowPatientSuggestions(false);
                        }}
                        className="w-full flex items-center px-5 py-3 text-sm font-bold transition-all text-left hover:bg-opacity-5"
                        style={{ color: c.txt }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = c.blue + "15")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {p.name || p.patient}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </FieldWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FieldWrapper name="medication" error={errors.medication}>
                <input
                  type="text"
                  name="medication"
                  value={form.medication}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("medication")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g. Amoxicillin"
                  className="w-full h-full py-4 bg-transparent border-none outline-none text-sm font-semibold"
                  style={{ color: c.txt }}
                />
              </FieldWrapper>

              <FieldWrapper name="strength" error={errors.strength}>
                <input
                  type="text"
                  name="strength"
                  value={form.strength}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("strength")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g. 500mg"
                  className="w-full h-full py-4 bg-transparent border-none outline-none text-sm font-semibold"
                  style={{ color: c.txt }}
                />
              </FieldWrapper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FieldWrapper name="dosage" error={errors.dosage}>
                <input
                  type="text"
                  name="dosage"
                  value={form.dosage}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("dosage")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g. 1 tablet"
                  className="w-full h-full py-4 bg-transparent border-none outline-none text-sm font-semibold"
                  style={{ color: c.txt }}
                />
              </FieldWrapper>

              <div className="space-y-2">
                <DashSelect
                  label="Frequency"
                  value={form.frequency}
                  options={FREQUENCY_OPTIONS}
                  onSelect={f => setForm(p => ({ ...p, frequency: f }))}
                  dk={dk}
                  c={c}
                />
              </div>
            </div>

            <FieldWrapper name="duration" error={errors.duration}>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                onFocus={() => setFocusedField("duration")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. 7 days"
                className="w-full h-full py-4 bg-transparent border-none outline-none text-sm font-semibold"
                style={{ color: c.txt }}
              />
            </FieldWrapper>

            <div className="space-y-2">
              <label
                className="text-[13px] font-bold uppercase tracking-wider ml-1"
                style={{ color: c.txt3 }}
              >
                {t('dashboard.doctor.prescription.notes')}
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                onFocus={() => setFocusedField("notes")}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 rounded-2xl border outline-none transition-all duration-300 resize-none font-medium text-sm"
                style={{
                  background: dk ? c.bg + "22" : "#F8FAFC",
                  borderColor: focusedField === "notes" ? "#6492C9" : c.border,
                  boxShadow:
                    focusedField === "notes"
                      ? "0 0 0 4px rgba(100,146,201,0.1)"
                      : "none",
                  color: c.txt,
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full text-white font-black py-4 rounded-xl transition-all shadow-md hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: c.blue,
                boxShadow: `0 4px 15px ${c.blue}44`,
              }}
            >
              {t('dashboard.doctor.prescription.generate')}
            </button>
          </form>
        </Card>

        <Card dk={dk} empty={true} className="p-6 h-fit">
          <h2 className="text-[17px] font-bold mb-5" style={{ color: c.txt }}>
            {t('dashboard.doctor.prescription.recent')}
          </h2>
          {rxList.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <FileText
                size={40}
                className="mx-auto mb-3"
                style={{ color: c.txt3 }}
              />
              <p className="text-sm font-bold" style={{ color: c.txt3 }}>
                {t('dashboard.doctor.prescription.none')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rxList.slice(0, 6).map((rx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                  style={{ background: c.bg + "22", borderColor: c.border }}
                >
                  <div>
                    <p className="text-sm font-bold" style={{ color: c.txt }}>
                      {rx.medication || "—"}
                    </p>
                    <p
                      className="text-[11px] font-medium"
                      style={{ color: c.txt3 }}
                    >
                      {rx.patientName || "—"} · {rx.date || ""}
                    </p>
                  </div>
                  <Badge color={c.green} bg={c.green + "15"}>
                    {rx.status || "Active"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-VIEW : PATIENT DETAIL (DOSSIER MÉDICAL)
// ============================================================================

function PatientDetailView({ patient, onBack, dk }) {
  const c = dk ? T.dark : T.light;
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState("history");

  // --- STATE FOR MEDICAL HISTORY ---
  const [history, setHistory] = useState([
    {
      date: "Oct 12, 2023",
      title: "Type 2 Diabetes Checkup",
      doc: "Dr. Benali",
      note: "Patient reports stable glucose levels. Reduced Metformin dosage.",
      type: "Chronic",
    },
    {
      date: "Aug 05, 2023",
      title: "Annual Physical Exam",
      doc: "Dr. Kaci",
      note: "All vitals normal. Recommended increased physical activity.",
      type: "Normal",
    },
  ]);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [newHist, setNewHist] = useState({ title: "", date: "", type: "Chronic" });

  // --- STATE FOR LAB RESULTS ---
  const [labs, setLabs] = useState([
    {
      test: "Blood Glucose (HbA1c)",
      result: "6.4%",
      ref: "4.0 - 5.6%",
      status: "High",
    },
    {
      test: "Total Cholesterol",
      result: "185 mg/dL",
      ref: "< 200 mg/dL",
      status: "Normal",
    },
    {
      test: "LDL Cholesterol",
      result: "110 mg/dL",
      ref: "< 100 mg/dL",
      status: "Borderline",
    },
  ]);
  const [showAddLab, setShowAddLab] = useState(false);
  const [newLab, setNewLab] = useState({ test: "", note: "" });

  if (!patient) return null;

  const name = patient.name || patient.patient || 
    (patient.firstName && patient.lastName ? `${patient.firstName} ${patient.lastName}` : null) || 
    patient.firstName || 
    patient.lastName || 
    "Unknown Patient";
  const age = patient.age || "—";

  const handleAddHistory = (e) => {
    e.preventDefault();
    if (!newHist.title) return;
    const item = {
      ...newHist,
      doc: "Dr. Current",
      note: "Added during current consultation.",
    };
    setHistory([item, ...history]);
    setNewHist({ title: "", date: "", type: "Chronic" });
    setShowAddHistory(false);
  };

  const handleAddLab = (e) => {
    e.preventDefault();
    if (!newLab.test) return;
    const item = {
      test: newLab.test,
      result: "Pending",
      ref: "—",
      status: "Requested",
    };
    setLabs([item, ...labs]);
    setNewLab({ test: "", note: "" });
    setShowAddLab(false);
  };

  const handleDeleteHistory = (index) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const handleDeleteLab = (index) => {
    setLabs(labs.filter((_, i) => i !== index));
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-10">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-opacity-10"
            style={{ background: c.blue + "22", color: c.blue }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black" style={{ color: c.txt }}>
              {name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge color={c.txt3} bg={c.bg + "44"}>
                {age} years old
              </Badge>
              <Badge color={c.red} bg={c.red + "15"}>
                O+ Positive
              </Badge>
              <Badge color="#8B5CF6" bg="#8B5CF615">
                Penicillin Allergy
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: History & Labs */}
        <div className="lg:col-span-2 space-y-6">
          <Card dk={dk} empty={true} className="p-0 overflow-hidden shadow-2xl border-0">
            <div className="flex items-center justify-between border-b pr-4" style={{ borderColor: c.border }}>
              <div className="flex">
                {["history", "lab", "prescriptions"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-bold transition-all relative ${
                      activeTab === tab ? "" : "opacity-30"
                    }`}
                    style={{ color: activeTab === tab ? c.blue : c.txt }}
                  >
                    {tab === "history" && t('dashboard.doctor.medicalRecord.medicalHistoryTab')}
                    {tab === "lab" && t('dashboard.doctor.medicalRecord.labResultsTab')}
                    {tab === "prescriptions" && t('dashboard.doctor.medicalRecord.pastPrescriptionsTab')}
                    {activeTab === tab && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1.5 rounded-t-full"
                        style={{ background: c.blue }}
                      />
                    )}
                  </button>
                ))}
              </div>
              
              {activeTab === "history" && (
                <button
                  onClick={() => setShowAddHistory(!showAddHistory)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[11px] font-black tracking-wider transition-all hover:bg-opacity-10 active:scale-95"
                  style={{ 
                    borderColor: c.blue, 
                    color: c.blue, 
                    background: c.blue + "08"
                  }}
                >
                  <Plus size={14} /> {t('dashboard.doctor.medicalRecord.addAntecedent')}
                </button>
              )}
              {activeTab === "lab" && (
                <button
                  onClick={() => setShowAddLab(!showAddLab)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[11px] font-black tracking-wider transition-all hover:bg-opacity-10 active:scale-95"
                  style={{ 
                    borderColor: c.blue, 
                    color: c.blue, 
                    background: c.blue + "08"
                  }}
                >
                  <Plus size={14} /> {t('dashboard.doctor.medicalRecord.requestLabTest')}
                </button>
              )}
            </div>

            <div className="p-8">
              {activeTab === "history" && (
                <div className="space-y-8">
                  {/* Premium Form Add History */}
                  {showAddHistory && (
                    <div 
                      className="p-6 rounded-[28px] border-2 mb-10 space-y-5 animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden" 
                      style={{ borderColor: c.blue + "33", background: dk ? "#1A2333" : "#F8FAFC" }}
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: c.blue }} />
                      
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: c.blue }}>
                          {t('dashboard.doctor.medicalRecord.newRecord')}
                        </p>
                        <button onClick={() => setShowAddHistory(false)} className="opacity-40 hover:opacity-100 transition-all hover:bg-red-500/10 p-1 rounded-lg">
                          <X size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">{t('dashboard.doctor.medicalRecord.pathology')}</label>
                          <input
                            placeholder="ex: Hypertension"
                            value={newHist.title}
                            onChange={e => setNewHist({...newHist, title: e.target.value})}
                            className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500"
                            style={{ background: dk ? c.blueLight : "#fff", borderColor: c.border, color: c.txt }}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">{t('dashboard.doctor.medicalRecord.diagDate')}</label>
                          <input
                            type="date"
                            value={newHist.date}
                            onChange={e => setNewHist({...newHist, date: e.target.value})}
                            className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500 font-sans"
                            style={{ 
                              background: dk ? c.blueLight : "#fff", 
                              borderColor: c.border, 
                              color: c.txt,
                              fontFamily: 'inherit'
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <DashSelect
                          label={t('dashboard.doctor.medicalRecord.antecedentType')}
                          value={newHist.type}
                          options={[
                            { value: "Chronic", label: "Chronique" },
                            { value: "Acute", label: "Aigu" },
                            { value: "Surgical", label: "Chirurgical" },
                            { value: "Allergy", label: "Allergie" },
                          ]}
                          onSelect={v => setNewHist({ ...newHist, type: v })}
                          dk={dk}
                          c={c}
                        />
                      </div>

                      <div className="flex gap-4 pt-3">
                        <button
                          onClick={() => setShowAddHistory(false)}
                          className="flex-1 py-4 rounded-xl text-xs font-black transition-all hover:bg-opacity-5"
                          style={{ color: c.txt2 }}
                        >
                          {t('dashboard.doctor.medicalRecord.cancel')}
                        </button>
                        <button
                          onClick={handleAddHistory}
                          className="flex-[2] py-4 rounded-xl text-white text-xs font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                          style={{ background: c.blue, boxShadow: `0 8px 25px ${c.blue}44` }}
                        >
                          {t('dashboard.doctor.medicalRecord.updateRecord')}
                        </button>
                      </div>
                    </div>
                  )}

                  {history.map((h, i) => (
                    <div
                      key={i}
                      className="relative pl-8 border-l-2 last:border-l-0 pb-8 last:pb-0 group"
                      style={{ borderColor: c.border }}
                    >
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDeleteHistory(i)}
                        className="absolute right-0 top-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 text-red-500"
                        title="Supprimer l'antécédent"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div
                        className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white"
                        style={{ borderColor: c.blue }}
                      />
                      <div className="flex items-center gap-2">
                        <p
                          className="text-[11px] font-black uppercase tracking-widest opacity-40"
                          style={{ color: c.txt }}
                        >
                          {h.date}
                        </p>
                        {h.type && (
                          <span 
                            className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md" 
                            style={{
                              background: h.type === "Chronic" ? c.red + "15" : c.blue + "15",
                              color: h.type === "Chronic" ? c.red : c.blue
                            }}
                          >
                            {h.type}
                          </span>
                        )}
                      </div>
                      <h3
                        className="text-lg font-black mt-1"
                        style={{ color: c.txt }}
                      >
                        {h.title}
                      </h3>
                      <p
                        className="text-[13px] font-bold mt-1"
                        style={{ color: c.blue }}
                      >
                        {h.doc}
                      </p>
                      <p
                        className="text-sm mt-3 leading-relaxed opacity-60 font-medium"
                        style={{ color: c.txt }}
                      >
                        {h.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "lab" && (
                <div className="space-y-6">
                  {/* Premium Form Add Lab Request */}
                  {showAddLab && (
                    <div 
                      className="p-6 rounded-[28px] border-2 mb-10 space-y-5 animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden" 
                      style={{ borderColor: c.blue + "33", background: dk ? "#1A2333" : "#F8FAFC" }}
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: c.blue }} />
                      
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: c.blue }}>
                          {t('dashboard.doctor.medicalRecord.newLabAnalysis')}
                        </p>
                        <button onClick={() => setShowAddLab(false)} className="opacity-40 hover:opacity-100 transition-all hover:bg-red-500/10 p-1 rounded-lg">
                          <X size={18} />
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">{t('dashboard.doctor.medicalRecord.requestedAnalysis')}</label>
                        <input
                          placeholder="ex: Bilan Lipidique Complet"
                          value={newLab.test}
                          onChange={e => setNewLab({...newLab, test: e.target.value})}
                          className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500"
                          style={{ background: dk ? c.blueLight : "#fff", borderColor: c.border, color: c.txt }}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">{t('dashboard.doctor.medicalRecord.notesUrgency')}</label>
                        <textarea
                          placeholder="Indications cliniques..."
                          value={newLab.note}
                          onChange={e => setNewLab({...newLab, note: e.target.value})}
                          className="w-full px-4 py-4 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500 resize-none h-24"
                          style={{ background: dk ? c.blueLight : "#fff", borderColor: c.border, color: c.txt }}
                        />
                      </div>

                      <div className="flex gap-4 pt-3">
                        <button 
                          onClick={() => setShowAddLab(false)}
                          className="flex-1 py-4 rounded-xl text-xs font-black transition-all hover:bg-opacity-5"
                          style={{ color: c.txt2 }}
                        >
                          {t('dashboard.doctor.medicalRecord.cancel')}
                        </button>
                        <button
                          onClick={handleAddLab}
                          className="flex-[2] py-4 rounded-xl text-white text-xs font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                          style={{ background: c.blue, boxShadow: `0 8px 25px ${c.blue}44` }}
                        >
                          {t('dashboard.doctor.medicalRecord.confirmRequest')}
                        </button>
                      </div>
                    </div>
                  )}

                  {labs.map((l, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "16px", borderRadius: "16px",
                      border: `2px solid ${c.border}`,
                      marginBottom: "10px",
                    }}>
                      {/* Icône */}
                      <div style={{ padding: "10px", borderRadius: "12px", background: l.status === "Requested" ? c.amber + "22" : c.blue + "15", flexShrink: 0 }}>
                        <Activity size={20} style={{ color: l.status === "Requested" ? c.amber : c.blue }} />
                      </div>
                      {/* Nom + réf */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: c.txt, margin: 0, lineHeight: 1.3 }}>{l.test}</p>
                        <p style={{ fontSize: 12, opacity: 0.5, fontStyle: "italic", color: c.txt, margin: 0, marginTop: 3 }}>{t('dashboard.doctor.medicalRecord.ref')} : {l.ref}</p>
                      </div>
                      {/* Résultat + badge + trash dans un seul bloc */}
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 16, fontWeight: 700, color: l.status === "Requested" ? c.amber : l.status === "Normal" ? c.green : l.status === "Borderline" ? c.amber : c.red, margin: 0 }}>{l.result}</p>
                          <span style={{ fontSize: 10, letterSpacing: "0.5px", fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 6, display: "inline-block", marginTop: 4, background: (l.status === "Requested" ? c.amber : l.status === "Normal" ? c.green : l.status === "Borderline" ? c.amber : c.red) + "18", color: l.status === "Requested" ? c.amber : l.status === "Normal" ? c.green : l.status === "Borderline" ? c.amber : c.red }}>{l.status}</span>
                        </div>
                        <button onClick={() => handleDeleteLab(i)}
                          style={{ padding: "8px", borderRadius: "8px", background: c.red + "15", border: "none", cursor: "pointer", flexShrink: 0 }}>
                          <Trash2 size={15} color={c.red} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "prescriptions" && (
                <div className="space-y-4">
                  {[
                    {
                      med: "Metformin 500mg",
                      freq: "Twice daily",
                      dur: "3 months",
                      date: "Sep 2023",
                    },
                    {
                      med: "Lisinopril 10mg",
                      freq: "Once daily",
                      dur: "6 months",
                      date: "Jun 2023",
                    },
                  ].map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-5 rounded-2xl border-2 hover:shadow-md transition-all"
                      style={{ borderColor: c.border }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ background: c.blue + "15", color: c.blue }}
                      >
                        <FileText size={22} />
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-base font-black"
                          style={{ color: c.txt }}
                        >
                          {p.med}
                        </p>
                        <p
                          className="text-xs opacity-50 font-bold mt-0.5"
                          style={{ color: c.txt }}
                        >
                          {p.freq} · {p.dur}
                        </p>
                      </div>
                      <p
                        className="text-xs font-black opacity-30"
                        style={{ color: c.txt }}
                      >
                        {p.date}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Quick Notes & Action */}
        <div className="space-y-6">
          <Card dk={dk} className="p-8 shadow-xl border-0">
            <h2 className="text-xl font-black mb-8" style={{ color: c.txt }}>
              {t('dashboard.doctor.consultation.accountReport')}
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-40"
                  style={{ color: c.txt }}
                >
                  {t('dashboard.doctor.consultation.currentSymptoms')}
                </label>
                <textarea
                  className="w-full rounded-[20px] p-5 text-sm font-bold border-2 outline-none transition-all focus:border-blue-500 min-h-[120px] resize-none"
                  style={{
                    background: dk ? c.blueLight : "#F8FAFC",
                    borderColor: c.border,
                    color: c.txt,
                  }}
                  placeholder={t('dashboard.doctor.consultation.clinicalNotesPh')}
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-40"
                  style={{ color: c.txt }}
                >
                  {t('dashboard.doctor.consultation.prelimDiagnosis')}
                </label>
                <input
                  className="w-full rounded-2xl px-5 py-4 text-sm font-bold border-2 outline-none focus:border-blue-500"
                  style={{
                    background: dk ? c.blueLight : "#F8FAFC",
                    borderColor: c.border,
                    color: c.txt,
                  }}
                  placeholder={t('dashboard.doctor.consultation.diagnosisSearch')}
                />
              </div>
              <button
                className="w-full py-4.5 rounded-2xl text-white font-black text-[15px] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 mt-4"
                style={{
                  background: `linear-gradient(135deg, ${c.blue}, #304B71)`,
                  boxShadow: `0 12px 30px ${c.blue}44`,
                }}
              >
                <Send size={20} /> {t('dashboard.doctor.consultation.terminate')}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-VIEW : STATISTICS
// ============================================================================

function StatisticsView() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;
  const { t } = useLanguage();

  const data = useData();
  const appointments = Array.isArray(data?.appointments) ? data.appointments : [];
  const prescriptions = Array.isArray(data?.prescriptions) ? data.prescriptions : [];
  const patients = Array.isArray(data?.patients) ? data.patients : [];

  const stats = [
    {
      label: t('dashboard.doctor.nav.schedule'),
      value: appointments.length || 312,
      icon: Users,
      color: c.green,
    },
    {
      label: t('dashboard.doctor.nav.prescriptions'),
      value: prescriptions.length || 94,
      icon: FileText,
      color: c.blue,
    },
    {
      label: t('dashboard.doctor.nav.patients'),
      value: patients.length || 847,
      icon: Users,
      color: c.purple,
    },
    {
      label: t('dashboard.doctor.kpis.avgRating'),
      value: "4.8",
      icon: Star,
      color: c.amber,
    },
  ];

  const weekly = [38, 52, 45, 61, 58, 74, 69];
  const maxW = Math.max(...weekly) || 100;

  return (
    <div className="animate-in slide-in-from-bottom duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <StatCard
            key={i}
            dk={dk}
            label={s.label}
            value={s.value}
            icon={s.icon}
            color={s.color}
            trend={s.trend}
          />
        ))}
      </div>

      <Card dk={dk} className="p-6">
        <h2 className="text-[17px] font-bold mb-8" style={{ color: c.txt }}>
          {t('dashboard.doctor.statistics.weeklyActivity')}
        </h2>
        <div className="flex items-end gap-3 h-48 mb-4 px-2">
          {weekly.map((h, i) => {
            const isLast = i === weekly.length - 1;
            const barHeight = maxW > 0 ? (h / maxW) * 100 : 0;
            // Assurer une largeur minimale et une couleur visible
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end h-full group"
              >
                <div
                  className="relative w-full max-w-[32px] rounded-t-lg transition-all duration-300 group-hover:scale-x-110 shadow-sm"
                  style={{
                    height: `${Math.max(barHeight, 2)}%`,
                    background: isLast ? c.blue : c.blue + "44",
                    opacity: isLast ? 1 : 0.7,
                  }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg bg-[#0D1B2E] text-white text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-all shadow-xl pointer-events-none z-10 whitespace-nowrap">
                    {t('dashboard.doctor.statistics.appointmentsTooltip', { count: h })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between px-2">
          {(DAYS || []).map((d, i) => (
            <span
              key={d?.day || i}
              className="text-[10px] font-black flex-1 text-center uppercase tracking-widest"
              style={{ color: c.txt3 }}
            >
              {d?.day || "---"}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// SUB-VIEW : SETTINGS
// ============================================================================

const WILAYAS_LIST = [
  "Alger","Oran","Constantine","Annaba","Blida","Batna","Sétif","Tlemcen",
  "Tizi Ouzou","Béjaïa","Jijel","Médéa","Mostaganem","Bouira","Bordj Bou Arréridj",
  "Boumerdès","Tipaza","Aïn Defla","Tissemsilt","Relizane","Chlef","Skikda",
  "Guelma","Souk Ahras","El Tarf","Mila","Khenchela","Oum El Bouaghi","Tébessa",
  "Biskra","Djelfa","Laghouat","El Bayadh","Naâma","Saïda","Mascara","Tiaret",
  "Adrar","Béchar","Tamanrasset","Illizi","Tindouf","El Oued","Ouargla",
  "Ghardaïa","Aïn Témouchent","Sidi Bel Abbès","Mascara","Autres",
];

function SettingsView() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;
  const { userData: user } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const [showPwd, setShowPwd] = useState(false);
  const [locSaved, setLocSaved] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [pwdStatus, setPwdStatus] = useState({ type: "", msg: "" });
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  // ── Location state ──
  const [locForm, setLocForm] = useState({
    address: "",
    commune: "",
    wilaya: "Alger",
    mapsUrl: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setStatus({ type: "", msg: "" });
      const names = form.name.split(" ");
      const first_name = names[0] || "";
      const last_name = names.slice(1).join(" ") || "";
      await api.updateMe({ first_name, last_name, phone: form.phone });
      setStatus({ type: "success", msg: t('dashboard.doctor.settings.profileUpdated') });
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    } catch (err) {
      setStatus({ type: "error", msg: t('dashboard.doctor.settings.profileError') });
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePwd = async () => {
    try {
      setIsSavingPwd(true);
      setPwdStatus({ type: "", msg: "" });
      await api.changePassword(pwdForm);
      setPwdStatus({ type: "success", msg: t('dashboard.doctor.settings.passwordUpdated') });
      setPwdForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => setPwdStatus({ type: "", msg: "" }), 4000);
    } catch (err) {
      setPwdStatus({ type: "error", msg: t('dashboard.doctor.settings.passwordError') });
      setTimeout(() => setPwdStatus({ type: "", msg: "" }), 4000);
    } finally {
      setIsSavingPwd(false);
    }
  };

  const handleSaveLocation = () => {
    setLocSaved(true);
    setTimeout(() => setLocSaved(false), 3000);
  };

  // Helper: input style
  const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all focus:ring-2";
  const inputStyle = { background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt };
  const labelCls = "block text-xs font-bold uppercase tracking-wide mb-1.5";

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* ── Top 2-col grid: Profile + Security ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

        {/* Profile card */}
        <Card dk={dk}>
          <p className="font-semibold mb-5" style={{ color: c.txt }}>{t('dashboard.doctor.settings.profile')}</p>
          {status.msg && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{
              background: status.type === "success" ? "#2D8C6F12" : "#E0555512",
              color: status.type === "success" ? "#2D8C6F" : "#E05555",
              border: `1px solid ${status.type === "success" ? "#2D8C6F44" : "#E0555544"}`,
            }}>{status.msg}</div>
          )}
          {[
            { label: t('dashboard.doctor.settings.fullName'), key: "name" },
            { label: t('dashboard.doctor.settings.email'),    key: "email" },
            { label: t('dashboard.doctor.settings.phone'),    key: "phone" },
          ].map((field) => (
            <div key={field.key} className="mb-4">
              <label className={labelCls} style={{ color: c.txt2 }}>{field.label}</label>
              <input
                type="text"
                value={form[field.key]}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                readOnly={field.key === "email"}
                className={inputCls}
                style={{ ...inputStyle, color: field.key === "email" ? c.txt3 : c.txt }}
              />
            </div>
          ))}
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: c.blue, opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? t('dashboard.doctor.settings.saving') : t('dashboard.doctor.settings.saveChanges')}
          </button>
        </Card>

        {/* Security card */}
        <Card dk={dk}>
          <p className="font-semibold mb-5" style={{ color: c.txt }}>{t('dashboard.doctor.settings.security')}</p>
          {pwdStatus.msg && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{
              background: pwdStatus.type === "success" ? "#2D8C6F12" : "#E0555512",
              color: pwdStatus.type === "success" ? "#2D8C6F" : "#E05555",
              border: `1px solid ${pwdStatus.type === "success" ? "#2D8C6F44" : "#E0555544"}`,
            }}>{pwdStatus.msg}</div>
          )}
          {[
            { label: t('dashboard.doctor.settings.currentPwd'), key: "currentPassword" },
            { label: t('dashboard.doctor.settings.newPwd'),     key: "newPassword" },
          ].map((field) => (
            <div key={field.key} className="mb-4 relative">
              <label className={labelCls} style={{ color: c.txt2 }}>{field.label}</label>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={pwdForm[field.key]}
                onChange={(e) => setPwdForm({ ...pwdForm, [field.key]: e.target.value })}
                className={`${inputCls} pr-12`}
                style={inputStyle}
              />
              <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-8" style={{ color: c.txt3 }}>
                {showPwd ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          ))}
          <button
            onClick={handleSavePwd}
            disabled={isSavingPwd}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80 active:scale-95"
            style={{ color: c.blue, borderColor: c.border, opacity: isSavingPwd ? 0.7 : 1 }}
          >
            {isSavingPwd ? t('dashboard.doctor.settings.updating') : t('dashboard.doctor.settings.updatePwd')}
          </button>
        </Card>
      </div>

      {/* ── Clinic Location & Maps ── */}
      <Card dk={dk}>
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.blue + "18" }}>
            <MapPin size={18} style={{ color: c.blue }} />
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: c.txt }}>{t('dashboard.doctor.settings.clinicLocation')}</p>
            <p className="text-xs" style={{ color: c.txt3 }}>{t('dashboard.doctor.settings.manageAddress')}</p>
          </div>
        </div>

        {/* Success banner */}
        {locSaved && (
          <div className="mb-5 p-3 rounded-xl text-xs font-semibold flex items-center gap-2" style={{
            background: "#2D8C6F12", color: "#2D8C6F", border: "1px solid #2D8C6F44",
          }}>
            <Check size={14} /> {t('dashboard.doctor.settings.mapSaved')}
          </div>
        )}

        {/* Responsive 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: form fields */}
          <div className="space-y-5">

            {/* Adresse de l'établissement */}
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>{t('dashboard.doctor.settings.clinicAddress')}</label>
              <input
                type="text"
                placeholder="Ex: 12 Rue Didouche Mourad"
                value={locForm.address}
                onChange={(e) => setLocForm((f) => ({ ...f, address: e.target.value }))}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            {/* Commune */}
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>{t('dashboard.doctor.settings.commune')}</label>
              <input
                type="text"
                placeholder="Ex: Alger-Centre"
                value={locForm.commune}
                onChange={(e) => setLocForm((f) => ({ ...f, commune: e.target.value }))}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            {/* Wilaya */}
            <div>
              <DashSelect
                label="Wilaya"
                value={locForm.wilaya}
                options={WILAYAS_LIST}
                onSelect={w => setLocForm(f => ({ ...f, wilaya: w }))}
                dk={dk}
                c={c}
              />
            </div>

            {/* Google Maps URL */}
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>{t('dashboard.doctor.settings.mapsLink')}</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('dashboard.doctor.settings.pasteMaps')}
                  value={locForm.mapsUrl}
                  onChange={(e) => setLocForm((f) => ({ ...f, mapsUrl: e.target.value }))}
                  className={`${inputCls} pl-10`}
                  style={inputStyle}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.txt3 }}>
                  <LinkIcon size={15} />
                </div>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSaveLocation}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, #304B71, ${c.blue})` }}
            >
              <MapPin size={15} /> {t('dashboard.doctor.settings.updateMap')}
            </button>
          </div>

          {/* Right: map preview with Smart Parser */}
          <div className="flex flex-col gap-3">
            <label className={labelCls} style={{ color: c.txt2 }}>{t('dashboard.doctor.settings.mapPreview')}</label>
            {(() => {
              const addressQuery = [locForm.address, locForm.commune, locForm.wilaya]
                .filter(Boolean)
                .join(", ");
              
              let embedSrc = null;
              let openUrl = locForm.mapsUrl || null;

              if (locForm.mapsUrl) {
                // If it's already an embed output link
                if (locForm.mapsUrl.includes("output=embed") || locForm.mapsUrl.includes("/embed")) {
                  embedSrc = locForm.mapsUrl;
                } else {
                  // Regex to find Coordinates (@lat,lng) or Place Names (/place/Nom)
                  const coordMatch = locForm.mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                  const placeMatch = locForm.mapsUrl.match(/\/place\/([^\/]+)/);
                  const rawCoord = locForm.mapsUrl.match(/^(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)$/); // If user typed exact coordinates

                  if (rawCoord) {
                    embedSrc = `https://maps.google.com/maps?q=${rawCoord[1]},${rawCoord[2]}&hl=fr&z=15&output=embed`;
                  } else if (coordMatch) {
                    embedSrc = `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&hl=fr&z=15&output=embed`;
                  } else if (placeMatch) {
                    embedSrc = `https://maps.google.com/maps?q=${placeMatch[1]}&hl=fr&z=15&output=embed`;
                  } else {
                    // Fallback to query mapping if it's a short link or weird format
                    embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(locForm.mapsUrl)}&hl=fr&z=15&output=embed`;
                  }
                }
              } else if (addressQuery) {
                // Fallback to text query based on the typed address
                embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&hl=fr&z=15&output=embed`;
                openUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}`;
              }

              return embedSrc ? (
                /* ── Real map ── */
                <div className="relative flex-1 min-h-[280px] rounded-2xl overflow-hidden border-2 transition-all"
                  style={{ borderColor: c.blue + "55", background: c.card }}>
                  <iframe
                    key={embedSrc}
                    title="Map Preview"
                    src={embedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: 280, display: "block" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {/* Floating open button */}
                  {openUrl && (
                    <a
                      href={openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:opacity-90"
                      style={{ background: c.blue }}
                    >
                      <MapPin size={12} /> {t('dashboard.doctor.settings.openInMaps')}
                    </a>
                  )}
                </div>
              ) : (
                /* ── Empty state ── */
                <div
                  className="flex-1 min-h-[280px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all"
                  style={{ background: dk ? "#0D1117" : "#F4F8FB", borderColor: c.border }}
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: c.blue + "18" }}>
                      <MapPin size={28} style={{ color: c.blue }} />
                    </div>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{ background: c.blue }} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-bold" style={{ color: c.txt }}>{t('dashboard.doctor.settings.mapPreview')}</p>
                    <p className="text-xs mt-1" style={{ color: c.txt3 }}>
                      {t('dashboard.doctor.settings.noAddressHint')}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>
      </Card>

      {/* ── Language + About ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card dk={dk}>
          <p className="font-semibold mb-4" style={{ color: c.txt }}>{t('dashboard.doctor.settings.language')}</p>
          <div className="flex gap-2 flex-wrap">
            {["🇫🇷 Français", "🇬🇧 English"].map((langName, i) => {
              const targetLang = i === 0 ? 'fr' : 'en';
              const active = lang === targetLang;
              return (
                <button
                  key={langName}
                  onClick={() => setLang(targetLang)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                  style={{
                    background: active ? c.blue : "transparent",
                    color: active ? "#fff" : c.txt2,
                    borderColor: active ? c.blue : c.border,
                  }}
                >
                  {langName}
                </button>
              );
            })}
          </div>
        </Card>
        <Card dk={dk}>
          <p className="font-semibold mb-2" style={{ color: c.txt }}>{t('dashboard.doctor.settings.about')}</p>
          <p className="text-sm" style={{ color: c.txt2 }}>{t('dashboard.doctor.settings.aboutDesc')}</p>
          <p className="text-xs mt-1" style={{ color: c.txt3 }}>{t('dashboard.doctor.settings.certified')}</p>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-VIEW : PATIENT CONSULTATION VIEW
// ============================================================================

const FALLBACK_PATIENT = {
  history: [
    { date: "Oct 12, 2023", title: "Type 2 Diabetes Checkup", doc: "Dr. Benali", note: "Patient reports stable glucose levels. Reduced Metformin dosage.", type: "Chronic" },
    { date: "Aug 05, 2023", title: "Annual Physical Exam", doc: "Dr. Kaci", note: "All vitals normal. Recommended increased physical activity.", type: "Normal" },
  ],
  labs: [
    { test: "Blood Glucose (HbA1c)", result: "6.4%", ref: "4.0 - 5.6%", status: "High" },
    { test: "Total Cholesterol", result: "185 mg/dL", ref: "< 200 mg/dL", status: "Normal" },
    { test: "LDL Cholesterol", result: "110 mg/dL", ref: "< 100 mg/dL", status: "Borderline" },
  ],
  prescriptions: [
    { med: "Metformin 500mg", freq: "Twice daily", dur: "3 months", date: "Sep 2023" },
    { med: "Lisinopril 10mg", freq: "Once daily", dur: "6 months", date: "Jun 2023" },
  ],
};

function PatientConsultationView({ appointment, onComplete, dk, c, setCurrentPage, doctorName }) {
  const { t } = useLanguage();
  // ── Tabs ──
  const [activeTab, setActiveTab] = useState("history");

  // ── Patient record (API or fallback) ──
  const [patientData, setPatientData] = useState(FALLBACK_PATIENT);
  const [history, setHistory] = useState(FALLBACK_PATIENT.history);
  const [labs, setLabs] = useState(FALLBACK_PATIENT.labs);
  const [prescriptions, setPrescriptions] = useState(FALLBACK_PATIENT.prescriptions);
  const [isDataFallback, setIsDataFallback] = useState(false);

  useEffect(() => {
    const pid = appointment?.patient_id ?? appointment?.id ?? null;
    if (!pid) {
      setPatientData(FALLBACK_PATIENT);
      setIsDataFallback(true);
      return;
    }
    api.getPatientRecord(pid)
      .then(data => {
        if (data) {
          setPatientData(data);
          setIsDataFallback(false);
        } else {
          setPatientData(FALLBACK_PATIENT);
          setIsDataFallback(true);
        }
      })
      .catch(() => {
        setPatientData(FALLBACK_PATIENT);
        setIsDataFallback(true);
      });
  }, [appointment]);

  useEffect(() => {
    const normalizeHistory = (h) => ({
      ...h,
      date:  h.date  || h.diagnosis_date || "",
      note:  h.note  || h.description   || "",
      doc:   h.doc   || h.doctor_name   || "",
      title: h.title || h.condition     || "",
      type:  h.type  || "Chronic",
    });
    const normalizeLab = (l) => ({
      ...l,
      test:   l.test   || l.test_name || "",
      ref:    l.ref    || l.lab_name  || "—",
      result: l.result != null ? l.result : "—",
      status: l.status || "Requested",
    });
    const normalizeRx = (p) => ({
      ...p,
      med:  p.med  || p.medication        || "",
      freq: p.freq || p.frequency         || "",
      dur:  p.dur  || p.duration          || "",
      date: p.date || p.prescription_date || "",
    });
    setHistory(prev => {
      const localOnly = prev.filter(h => h._local);
      return [...localOnly, ...(patientData.history || []).map(normalizeHistory)];
    });
    setLabs(prev => {
      const localOnly = prev.filter(l => l._local);
      return [...localOnly, ...(patientData.lab_results || patientData.labs || []).map(normalizeLab)];
    });
    setPrescriptions(prev => {
      const localOnly = prev.filter(p => p._local);
      return [...localOnly, ...(patientData.prescriptions || []).map(normalizeRx)];
    });
  }, [patientData]);

  const [showAddHistory, setShowAddHistory] = useState(false);
  const [newHist, setNewHist] = useState({ title: "", date: "", type: "Chronic" });
  const [showAddLab, setShowAddLab] = useState(false);
  const [newLab, setNewLab] = useState({ test: "", note: "" });
  const [showAddPrescription, setShowAddPrescription] = useState(false);
  const [newRx, setNewRx] = useState({ medication: "", dosage: "", frequency: "Once daily", duration: "7" });
  const [isRxSaving, setIsRxSaving] = useState(false);
  const [rxError, setRxError] = useState(null);

  // ── Right column ──
  const [vitals, setVitals] = useState({ bp: "", hr: "", temp: "", spo2: "" });
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [diagnosisError, setDiagnosisError] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);
  const [terminateError, setTerminateError] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const diagnosisRef = useRef(null);

  // ── Patient info (from appointment or API) ──
  const patientName = appointment?.patient_name || appointment?.patient || appointment?.name || "Patient";
  const patientAge = (() => {
    if (appointment?.age) return appointment.age;
    const bd = patientData?.profile?.birth_date || appointment?.birth_date;
    if (!bd) return "—";
    const birth = new Date(bd);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  })();
  const bloodType = patientData?.medical_profile?.blood_type;
  const patientAllergies = patientData?.medical_profile?.allergies;

  // ── Handlers ──
  const handleAddHistory = (e) => {
    e.preventDefault();
    if (!newHist.title) return;
    setHistory(prev => [{ ...newHist, doc: doctorName || "Dr. Current", note: "Ajouté pendant la consultation.", _local: true }, ...prev]);
    setNewHist({ title: "", date: "", type: "Chronic" });
    setShowAddHistory(false);
  };
  const handleDeleteHistory = (i) => setHistory(prev => prev.filter((_, idx) => idx !== i));

  const handleAddLab = (e) => {
    e.preventDefault();
    if (!newLab.test) return;
    setLabs(prev => [{ test: newLab.test, result: "Pending", ref: "—", status: "Requested", _local: true }, ...prev]);
    setNewLab({ test: "", note: "" });
    setShowAddLab(false);
  };
  const handleDeleteLab = (i) => setLabs(prev => prev.filter((_, idx) => idx !== i));

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    if (!newRx.medication) return;
    setRxError(null);
    setIsRxSaving(true);
    const payload = {
      med: newRx.medication + (newRx.dosage ? ` ${newRx.dosage}` : ""),
      freq: newRx.frequency,
      dur: `${newRx.duration} jours`,
      date: new Date().toLocaleDateString("fr-FR"),
      patient_id: appointment?.patient_id,
      appointment_id: appointment?.id,
    };
    try {
      const saved = await api.addPrescription(payload);
      setPrescriptions(prev => [saved || payload, ...prev]);
      setNewRx({ medication: "", dosage: "", frequency: "Once daily", duration: "7" });
      setShowAddPrescription(false);
    } catch (err) {
      setRxError(err.message || "Impossible d'enregistrer l'ordonnance. Vérifiez votre connexion.");
    } finally {
      setIsRxSaving(false);
    }
  };

  const handleTerminate = async () => {
    if (!diagnosis.trim()) {
      setDiagnosisError(true);
      diagnosisRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      diagnosisRef.current?.focus();
      return;
    }
    setDiagnosisError(false);
    setTerminateError(null);
    setIsTerminating(true);

    try {
      const payload = {
        appointment_id: appointment?.id,
        symptoms,
        diagnosis,
        vitals: {
          blood_pressure:    vitals.bp   || null,
          heart_rate:        vitals.hr   ? Number(vitals.hr)   : null,
          temperature:       vitals.temp ? Number(vitals.temp) : null,
          oxygen_saturation: vitals.spo2 ? Number(vitals.spo2) : null,
        },
        prescriptions: prescriptions
          .filter(p => p._local)
          .map(p => ({
            medication: p.med,
            frequency:  p.freq,
            duration:   p.dur,
          })),
        lab_requests: labs
          .filter(l => l._local)
          .map(l => ({
            test:  l.test,
            notes: l.note || "",
          })),
      };
      const result = await api.completeSession(payload);

      const entry = {
        date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
        title: diagnosis,
        doc: doctorName || "Dr. Current",
        note: symptoms || "Consultation terminée.",
        type: "Normal",
        _local: true,
      };
      setHistory(prev => [entry, ...prev]);
      setSessionResult(result || {});
      setShowSummaryModal(true);
    } catch (err) {
      setTerminateError(err.message || "Erreur lors de la clôture de la session.");
    } finally {
      setIsTerminating(false);
    }
  };

  // ── Base URL pour les ressources relatives du backend ──
  const API_ORIGIN = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    : "http://127.0.0.1:8000";

  const localPrescriptions = prescriptions.filter(p => p._local);
  const qrUrl = sessionResult?.prescription_qr_url
    ? (sessionResult.prescription_qr_url.startsWith("http")
        ? sessionResult.prescription_qr_url
        : `${API_ORIGIN}${sessionResult.prescription_qr_url}`)
    : null;

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-10">

      {/* ── Modal résumé post-consultation ── */}
      {showSummaryModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
        }}>
          <div style={{
            background: dk ? "#141B27" : "#fff",
            borderRadius: 28, padding: 36, maxWidth: 520, width: "100%",
            boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
            border: `1px solid ${c.border}`,
            maxHeight: "90vh", overflowY: "auto",
          }}>
            {/* En-tête */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: c.green + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={26} style={{ color: c.green }} />
              </div>
              <div>
                <p style={{ fontSize: 18, fontWeight: 800, color: c.txt, margin: 0 }}>{t('dashboard.doctor.consultation.recorded')}</p>
                <p style={{ fontSize: 13, color: c.txt3, margin: 0, marginTop: 2 }}>
                  {sessionResult?.consultation_id ? `#${sessionResult.consultation_id}` : ""}
                </p>
              </div>
            </div>

            {/* Patient */}
            <div style={{ padding: "14px 18px", borderRadius: 14, background: c.blue + "10", marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: c.txt3, margin: 0, marginBottom: 4 }}>Patient</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: c.txt, margin: 0 }}>{patientName}</p>
            </div>

            {/* Diagnostic */}
            <div style={{ padding: "14px 18px", borderRadius: 14, background: c.blueLight, marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: c.txt3, margin: 0, marginBottom: 6 }}>{t('dashboard.doctor.consultation.diagnosis')}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: c.txt, margin: 0, lineHeight: 1.5 }}>{diagnosis}</p>
            </div>

            {/* Symptômes */}
            {symptoms.trim() && (
              <div style={{ padding: "14px 18px", borderRadius: 14, background: c.blueLight, marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: c.txt3, margin: 0, marginBottom: 6 }}>{t('dashboard.doctor.consultation.symptomsLabel')}</p>
                <p style={{ fontSize: 13, color: c.txt2, margin: 0, lineHeight: 1.6 }}>{symptoms}</p>
              </div>
            )}

            {/* Prescriptions ajoutées */}
            {localPrescriptions.length > 0 && (
              <div style={{ padding: "14px 18px", borderRadius: 14, background: c.blueLight, marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: c.txt3, margin: 0, marginBottom: 10 }}>
                  {t('dashboard.doctor.consultation.prescriptions')} ({localPrescriptions.length})
                </p>
                {localPrescriptions.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < localPrescriptions.length - 1 ? 8 : 0 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.blue, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, fontWeight: 600, color: c.txt, margin: 0 }}>
                      {p.med} <span style={{ color: c.txt3, fontWeight: 400 }}>— {p.freq} · {p.dur}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* QR Code */}
            {qrUrl && (
              <div style={{ padding: "14px 18px", borderRadius: 14, border: `2px solid ${c.border}`, marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
                <img src={qrUrl} alt="QR ordonnance" style={{ width: 80, height: 80, borderRadius: 10, background: "#fff", padding: 4, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: c.txt, margin: 0 }}>{t('dashboard.doctor.consultation.qrCode')}</p>
                  <p style={{ fontSize: 11, color: c.txt3, margin: 0, marginTop: 3 }}>
                    Token : {sessionResult?.prescription_token || "—"}
                  </p>
                  <a href={qrUrl} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, padding: "6px 14px", borderRadius: 8, background: c.blue + "15", color: c.blue, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                    <Download size={13} /> {t('dashboard.doctor.consultation.downloadRx')}
                  </a>
                </div>
              </div>
            )}

            {/* Bouton fermer → redirection */}
            <button
              onClick={() => { setShowSummaryModal(false); onComplete(); }}
              style={{ width: "100%", padding: "14px", borderRadius: 16, background: `linear-gradient(135deg, ${c.blue}, #304B71)`, color: "#fff", fontSize: 14, fontWeight: 800, border: "none", cursor: "pointer", letterSpacing: "0.5px" }}
            >
              {t('dashboard.doctor.consultation.returnToSchedule')}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.blue + "22", color: c.blue }}>
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: c.txt }}>{patientName}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge color={c.txt3} bg={c.bg + "44"}>{patientAge} ans</Badge>
              <Badge color={c.blue} bg={c.blue + "15"}>RDV #{appointment?.id}</Badge>
              {bloodType && (
                <Badge color={c.red} bg={c.red + "15"}>{bloodType}</Badge>
              )}
              {patientAllergies && (
                <Badge color={c.amber} bg={c.amber + "15"}>⚠ {patientAllergies}</Badge>
              )}
              {isDataFallback && (
                <Badge color={c.amber} bg={c.amber + "18"}>{t('dashboard.doctor.consultation.dataUnavailable')}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column: tabs ── */}
        <div className="lg:col-span-2 space-y-6">
          <Card dk={dk} empty={true} className="p-0 overflow-hidden shadow-2xl border-0">
            {/* Tab bar */}
            <div className="flex items-center justify-between border-b pr-4" style={{ borderColor: c.border }}>
              <div className="flex">
                {["history", "lab", "prescriptions"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-bold transition-all relative ${activeTab === tab ? "" : "opacity-30"}`}
                    style={{ color: activeTab === tab ? c.blue : c.txt }}
                  >
                    {tab === "history" && t('dashboard.doctor.medicalRecord.medicalHistoryTab')}
                    {tab === "lab" && t('dashboard.doctor.medicalRecord.labResultsTab')}
                    {tab === "prescriptions" && t('dashboard.doctor.medicalRecord.pastPrescriptionsTab')}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 rounded-t-full" style={{ background: c.blue }} />
                    )}
                  </button>
                ))}
              </div>
              {activeTab === "history" && (
                <button onClick={() => setShowAddHistory(!showAddHistory)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[11px] font-black tracking-wider transition-all hover:bg-opacity-10 active:scale-95"
                  style={{ borderColor: c.blue, color: c.blue, background: c.blue + "08" }}>
                  <Plus size={14} /> {t('dashboard.doctor.medicalRecord.addAntecedent')}
                </button>
              )}
              {activeTab === "lab" && (
                <button onClick={() => setShowAddLab(!showAddLab)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[11px] font-black tracking-wider transition-all hover:bg-opacity-10 active:scale-95"
                  style={{ borderColor: c.blue, color: c.blue, background: c.blue + "08" }}>
                  <Plus size={14} /> {t('dashboard.doctor.medicalRecord.requestLabTest')}
                </button>
              )}
              {activeTab === "prescriptions" && (
                <button onClick={() => setShowAddPrescription(!showAddPrescription)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-[11px] font-black tracking-wider transition-all hover:bg-opacity-10 active:scale-95"
                  style={{ borderColor: c.blue, color: c.blue, background: c.blue + "08" }}>
                  <Plus size={14} /> {t('dashboard.doctor.medicalRecord.addPrescription')}
                </button>
              )}
            </div>

            <div className="p-8">
              {/* ── History tab ── */}
              {activeTab === "history" && (
                <div className="space-y-8">
                  {showAddHistory && (
                    <div className="p-6 rounded-[28px] border-2 mb-10 space-y-5 animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden"
                      style={{ borderColor: c.blue + "33", background: dk ? "#1A2333" : "#F8FAFC" }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: c.blue }} />
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: c.blue }}>{t('dashboard.doctor.medicalRecord.newRecord')}</p>
                        <button onClick={() => setShowAddHistory(false)} className="opacity-40 hover:opacity-100 transition-all hover:bg-red-500/10 p-1 rounded-lg"><X size={18} /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">{t('dashboard.doctor.medicalRecord.pathology')}</label>
                          <input placeholder="ex: Hypertension" value={newHist.title}
                            onChange={e => setNewHist({ ...newHist, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500"
                            style={{ background: dk ? c.blueLight : "#fff", borderColor: c.border, color: c.txt }} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">{t('dashboard.doctor.medicalRecord.diagDate')}</label>
                          <input type="date" value={newHist.date} onChange={e => setNewHist({ ...newHist, date: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500"
                            style={{ background: dk ? c.blueLight : "#fff", borderColor: c.border, color: c.txt, fontFamily: "inherit" }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <DashSelect
                          label={t('dashboard.doctor.medicalRecord.antecedentType')}
                          value={newHist.type}
                          options={[
                            { value: "Chronic", label: "Chronique" },
                            { value: "Acute", label: "Aigu" },
                            { value: "Surgical", label: "Chirurgical" },
                            { value: "Allergy", label: "Allergie" },
                          ]}
                          onSelect={v => setNewHist({ ...newHist, type: v })}
                          dk={dk}
                          c={c}
                        />
                      </div>
                      <div className="flex gap-4 pt-3">
                        <button onClick={() => setShowAddHistory(false)} className="flex-1 py-4 rounded-xl text-xs font-black" style={{ color: c.txt2 }}>{t('dashboard.doctor.medicalRecord.cancel')}</button>
                        <button onClick={handleAddHistory} className="flex-[2] py-4 rounded-xl text-white text-xs font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                          style={{ background: c.blue, boxShadow: `0 8px 25px ${c.blue}44` }}>{t('dashboard.doctor.medicalRecord.updateRecord')}</button>
                      </div>
                    </div>
                  )}
                  {history.map((h, i) => (
                    <div key={i} className="relative pl-8 border-l-2 last:border-l-0 pb-8 last:pb-0 group" style={{ borderColor: c.border }}>
                      <button onClick={() => handleDeleteHistory(i)}
                        className="absolute right-0 top-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 text-red-500">
                        <Trash2 size={16} />
                      </button>
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: c.blue }} />
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] font-black uppercase tracking-widest opacity-40" style={{ color: c.txt }}>{h.date}</p>
                        {h.type && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md"
                            style={{ background: h.type === "Chronic" ? c.red + "15" : c.blue + "15", color: h.type === "Chronic" ? c.red : c.blue }}>
                            {h.type}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black mt-1" style={{ color: c.txt }}>{h.title}</h3>
                      <p className="text-[13px] font-bold mt-1" style={{ color: c.blue }}>{h.doc}</p>
                      <p className="text-sm mt-3 leading-relaxed opacity-60 font-medium" style={{ color: c.txt }}>{h.note}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Lab tab ── */}
              {activeTab === "lab" && (
                <div className="space-y-2.5">
                  {showAddLab && (
                    <div className="p-6 rounded-[28px] border-2 mb-10 space-y-5 animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden"
                      style={{ borderColor: c.blue + "33", background: dk ? "#1A2333" : "#F8FAFC" }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: c.blue }} />
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: c.blue }}>{t('dashboard.doctor.medicalRecord.newLabAnalysis')}</p>
                        <button onClick={() => setShowAddLab(false)} className="opacity-40 hover:opacity-100 transition-all hover:bg-red-500/10 p-1 rounded-lg"><X size={18} /></button>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">{t('dashboard.doctor.medicalRecord.requestedAnalysis')}</label>
                        <input placeholder="ex: Bilan Lipidique Complet" value={newLab.test}
                          onChange={e => setNewLab({ ...newLab, test: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500"
                          style={{ background: dk ? c.blueLight : "#fff", borderColor: c.border, color: c.txt }} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">{t('dashboard.doctor.medicalRecord.notesUrgency')}</label>
                        <textarea placeholder="Indications cliniques..." value={newLab.note}
                          onChange={e => setNewLab({ ...newLab, note: e.target.value })}
                          className="w-full px-4 py-4 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500 resize-none h-24"
                          style={{ background: dk ? c.blueLight : "#fff", borderColor: c.border, color: c.txt }} />
                      </div>
                      <div className="flex gap-4 pt-3">
                        <button onClick={() => setShowAddLab(false)} className="flex-1 py-4 rounded-xl text-xs font-black" style={{ color: c.txt2 }}>{t('dashboard.doctor.medicalRecord.cancel')}</button>
                        <button onClick={handleAddLab} className="flex-[2] py-4 rounded-xl text-white text-xs font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                          style={{ background: c.blue, boxShadow: `0 8px 25px ${c.blue}44` }}>{t('dashboard.doctor.medicalRecord.confirmRequest')}</button>
                      </div>
                    </div>
                  )}
                  {labs.map((l, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "16px", borderRadius: "16px",
                      border: `2px solid ${c.border}`,
                      marginBottom: "10px",
                    }}>
                      {/* Icône */}
                      <div style={{ padding: "10px", borderRadius: "12px", background: l.status === "Requested" ? c.amber + "22" : c.blue + "15", flexShrink: 0 }}>
                        <Activity size={20} style={{ color: l.status === "Requested" ? c.amber : c.blue }} />
                      </div>
                      {/* Nom + réf */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: c.txt, margin: 0, lineHeight: 1.3 }}>{l.test}</p>
                        <p style={{ fontSize: 12, opacity: 0.5, fontStyle: "italic", color: c.txt, margin: 0, marginTop: 3 }}>{t('dashboard.doctor.medicalRecord.ref')} : {l.ref}</p>
                      </div>
                      {/* Résultat + badge + trash dans un seul bloc */}
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 16, fontWeight: 700, color: l.status === "Requested" ? c.amber : l.status === "Normal" ? c.green : l.status === "Borderline" ? c.amber : c.red, margin: 0 }}>{l.result}</p>
                          <span style={{ fontSize: 10, letterSpacing: "0.5px", fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 6, display: "inline-block", marginTop: 4, background: (l.status === "Requested" ? c.amber : l.status === "Normal" ? c.green : l.status === "Borderline" ? c.amber : c.red) + "18", color: l.status === "Requested" ? c.amber : l.status === "Normal" ? c.green : l.status === "Borderline" ? c.amber : c.red }}>{l.status}</span>
                        </div>
                        <button onClick={() => setLabs(prev => prev.filter((_, j) => j !== i))}
                          style={{ padding: "8px", borderRadius: "8px", background: c.red + "15", border: "none", cursor: "pointer", flexShrink: 0 }}>
                          <Trash2 size={15} color={c.red} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Prescriptions tab ── */}
              {activeTab === "prescriptions" && (
                <div className="space-y-4">
                  {showAddPrescription && (
                    <div className="p-6 rounded-[28px] border-2 mb-6 space-y-5 animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden"
                      style={{ borderColor: c.blue + "33", background: dk ? "#1A2333" : "#F8FAFC" }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: c.blue }} />
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: c.blue }}>{t('dashboard.doctor.medicalRecord.newPrescriptionForm')}</p>
                        <button onClick={() => setShowAddPrescription(false)} className="opacity-40 hover:opacity-100 transition-all hover:bg-red-500/10 p-1 rounded-lg"><X size={18} /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">{t('dashboard.doctor.medicalRecord.medicationLabel')}</label>
                          <input placeholder="ex: Paracétamol" value={newRx.medication}
                            onChange={e => setNewRx({ ...newRx, medication: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500"
                            style={{ background: dk ? c.blueLight : "#fff", borderColor: c.border, color: c.txt }} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">{t('dashboard.doctor.prescription.dosage')}</label>
                          <input placeholder="ex: 500mg" value={newRx.dosage}
                            onChange={e => setNewRx({ ...newRx, dosage: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500"
                            style={{ background: dk ? c.blueLight : "#fff", borderColor: c.border, color: c.txt }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <DashSelect
                          label={t('dashboard.doctor.prescription.frequency.label')}
                          value={newRx.frequency}
                          options={FREQUENCY_OPTIONS}
                          onSelect={f => setNewRx(r => ({ ...r, frequency: f }))}
                          dk={dk}
                          c={c}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">{t('dashboard.doctor.medicalRecord.durationDays')}</label>
                        <input type="text" inputMode="numeric" placeholder="7" value={newRx.duration}
                          onKeyDown={(e) => { const ok = ["Backspace","Delete","Tab","ArrowLeft","ArrowRight"]; if (!ok.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault(); }}
                          onChange={e => setNewRx({ ...newRx, duration: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                          className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500"
                          style={{ background: dk ? c.blueLight : "#fff", borderColor: c.border, color: c.txt }} />
                      </div>
                      {rxError && (
                        <div
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold animate-in fade-in duration-200"
                          style={{ background: c.red + "15", borderColor: c.red + "40", color: c.red }}
                        >
                          <X size={13} /> {rxError}
                        </div>
                      )}
                      <div className="flex gap-4 pt-3">
                        <button
                          onClick={() => { setShowAddPrescription(false); setRxError(null); }}
                          disabled={isRxSaving}
                          className="flex-1 py-4 rounded-xl text-xs font-black disabled:opacity-40"
                          style={{ color: c.txt2 }}
                        >{t('dashboard.doctor.medicalRecord.cancel')}</button>
                        <button
                          onClick={handleAddPrescription}
                          disabled={isRxSaving}
                          className="flex-[2] py-4 rounded-xl text-white text-xs font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
                          style={{ background: c.blue, boxShadow: `0 8px 25px ${c.blue}44` }}
                        >
                          {isRxSaving ? (
                            <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> {t('dashboard.doctor.medicalRecord.saving')}</>
                          ) : t('dashboard.doctor.medicalRecord.saveRx')}
                        </button>
                      </div>
                    </div>
                  )}
                  {prescriptions.map((p, i) => (
                    <div key={i} className="p-5 rounded-2xl border-2 hover:shadow-md transition-all space-y-3"
                      style={{ borderColor: c.border }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                          style={{ background: c.blue + "15", color: c.blue }}>
                          <FileText size={22} />
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-black" style={{ color: c.txt }}>{p.med}</p>
                          <p className="text-xs opacity-50 font-bold mt-0.5" style={{ color: c.txt }}>{p.freq} · {p.dur}</p>
                        </div>
                        <p className="text-xs font-black opacity-30" style={{ color: c.txt }}>{p.date}</p>
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: c.border }}>
                        {p.prescription_qr_url ? (
                          <img
                            src={p.prescription_qr_url}
                            alt="QR ordonnance"
                            className="w-14 h-14 rounded-lg object-contain shrink-0"
                            style={{ background: "#fff", padding: 2 }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg shrink-0 flex items-center justify-center border-2 border-dashed"
                            style={{ borderColor: c.border, color: c.txt3 }}>
                            <span className="text-[9px] font-bold text-center leading-tight">QR<br/>EN ATTENTE</span>
                          </div>
                        )}
                        <div className="flex flex-col gap-1.5">
                          <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: c.txt3 }}>
                            {p.prescription_qr_url ? t('dashboard.doctor.medicalRecord.qrAvailable') : t('dashboard.doctor.medicalRecord.qrAfterValidation')}
                          </p>
                          {p.prescription_qr_url ? (
                            <a
                              href={p.prescription_qr_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:opacity-80 active:scale-95 w-fit"
                              style={{ background: c.blue + "15", color: c.blue }}
                            >
                              <Download size={12} /> {t('dashboard.doctor.medicalRecord.download')}
                            </a>
                          ) : (
                            <span className="text-[10px] font-medium" style={{ color: c.txt3 }}>
                              #{p.prescription_token || "—"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ── Right column: Compte-rendu ── */}
        <div className="space-y-6">
          <Card dk={dk} className="p-8 shadow-xl border-0">
            <h2 className="text-xl font-black mb-8" style={{ color: c.txt }}>{t('dashboard.doctor.consultation.accountReport')}</h2>
            <div className="space-y-6">
              {/* ── Constantes vitales ── */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-40" style={{ color: c.txt }}>
                  {t('dashboard.doctor.consultation.vitals')}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { key: "bp",   label: "Tension",  placeholder: "120/80", unit: "mmHg" },
                    { key: "hr",   label: "FC",        placeholder: "72",     unit: "bpm"  },
                    { key: "temp", label: "Temp.",     placeholder: "37.2",   unit: "°C"   },
                    { key: "spo2", label: "SpO2",      placeholder: "98",     unit: "%"    },
                  ].map(({ key, label, placeholder, unit }) => (
                    <div key={key} className="rounded-2xl border-2 px-3 py-2.5 flex items-center gap-2 transition-all focus-within:border-blue-400"
                      style={{ borderColor: c.border, background: dk ? c.blueLight : "#F8FAFC" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-wider mb-0.5" style={{ color: c.txt3 }}>{label}</p>
                        <input
                          type="text"
                          placeholder={placeholder}
                          value={vitals[key]}
                          onChange={e => setVitals(v => ({ ...v, [key]: e.target.value }))}
                          className="w-full bg-transparent outline-none text-sm font-bold"
                          style={{ color: c.txt }}
                        />
                      </div>
                      <span className="text-[10px] font-bold shrink-0" style={{ color: c.txt3 }}>{unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-40" style={{ color: c.txt }}>
                  {t('dashboard.doctor.consultation.currentSymptoms')}
                </label>
                <textarea
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  className="w-full rounded-[20px] p-5 text-sm font-bold border-2 outline-none transition-all focus:border-blue-500 min-h-[120px] resize-none"
                  style={{ background: dk ? c.blueLight : "#F8FAFC", borderColor: c.border, color: c.txt }}
                  placeholder={t('dashboard.doctor.consultation.clinicalNotesPh')}
                />
              </div>
              <div className="space-y-2" ref={diagnosisRef}>
                <label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-40" style={{ color: diagnosisError ? c.red : c.txt }}>
                  {t('dashboard.doctor.consultation.prelimDiagnosis')} <span style={{ color: c.red }}>*</span>
                </label>
                <input
                  value={diagnosis}
                  onChange={e => { setDiagnosis(e.target.value); if (e.target.value.trim()) setDiagnosisError(false); }}
                  className="w-full rounded-2xl px-5 py-4 text-sm font-bold border-2 outline-none focus:border-blue-500"
                  style={{ background: dk ? c.blueLight : "#F8FAFC", borderColor: diagnosisError ? c.red : c.border, color: c.txt }}
                  placeholder={t('dashboard.doctor.consultation.diagnosisSearch')}
                />
                {diagnosisError && (
                  <p className="text-xs font-semibold ml-1" style={{ color: c.red }}>{t('dashboard.doctor.consultation.diagnosisRequired')}</p>
                )}
              </div>
              {terminateError && (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold animate-in fade-in duration-200"
                  style={{ background: c.red + "15", borderColor: c.red + "40", color: c.red }}
                >
                  <X size={14} /> {terminateError}
                </div>
              )}
              <button
                onClick={handleTerminate}
                disabled={isTerminating || !symptoms.trim() || !diagnosis.trim()}
                className="w-full py-4 rounded-2xl text-white font-black text-[15px] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-3 mt-4"
                style={{ background: `linear-gradient(135deg, ${c.blue}, #304B71)`, boxShadow: `0 12px 30px ${c.blue}44` }}
              >
                {isTerminating ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('dashboard.doctor.consultation.saving')}
                  </>
                ) : (
                  <><Send size={20} /> {t('dashboard.doctor.consultation.terminate')}</>
                )}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================


export default function DoctorDashboard({ onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;
  const { t } = useLanguage();

  const { userData: user } = useAuth();
  const { patients = [], appointments = [], patientRequests = [], globalNotifications = [], markAllNotificationsRead } = useData();

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeConsultation, setActiveConsultation] = useState(null);

  const firstName = user?.first_name || user?.firstName || "";
  const lastName = user?.last_name || user?.lastName || "";
  const doctorName =
    firstName && lastName ? `Dr. ${firstName} ${lastName}` : "Dr. Benali Karim";
  const doctorRole = user?.specialty || user?.role || t('doctor_role_label');
  const initials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : "DR";

  const safePatients = Array.isArray(patients) ? patients : [];
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safeRequests = Array.isArray(patientRequests) ? patientRequests : [];

  const NAV = [
    { id: "dashboard",     label: t('dashboard.doctor.nav.dashboard') },
    { id: "schedule",      label: t('dashboard.doctor.nav.schedule') },
    { id: "patients",      label: t('dashboard.doctor.nav.patients') },
    { id: "prescriptions", label: t('dashboard.doctor.nav.prescriptions') },
    { id: "statistics",    label: t('dashboard.doctor.nav.statistics') },
  ];

  const isInConsultation = currentPage === "consultation-session";

  const renderContent = () => {
    switch (currentPage.toLowerCase()) {
      case "consultation-session":
        return (
          <PatientConsultationView
            appointment={activeConsultation}
            onComplete={() => {
              setActiveConsultation(null);
              setCurrentPage("schedule");
            }}
            dk={dk}
            c={c}
            setCurrentPage={setCurrentPage}
            doctorName={doctorName}
          />
        );
      case "schedule":
        return (
          <ScheduleView
            dk={dk}
            onStartConsultation={(appointment) => {
              setActiveConsultation(appointment);
              setCurrentPage("consultation-session");
            }}
          />
        );
      case "patients":
        return (
          <PatientsView
            onSelectPatient={(p) => {
              setSelectedPatient(p);
              setCurrentPage("patient-detail");
            }}
          />
        );
      case "prescriptions":
        return <PrescriptionsView />;
      case "statistics":
        return <StatisticsView />;
      case "settings":
        return <SettingsView onLogout={onLogout} />;
      case "patient-detail":
        return (
          <PatientDetailView
            patient={selectedPatient}
            dk={dk}
            onBack={() => {
              setSelectedPatient(null);
              setCurrentPage("patients");
            }}
          />
        );
      default:
        return (
          <DashboardHome
            onNavigate={setCurrentPage}
            patients={safePatients}
            appointments={safeAppointments}
            patientRequests={safeRequests}
            onStartConsultation={(appointment) => {
              setActiveConsultation(appointment);
              setCurrentPage("consultation-session");
            }}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen relative transition-all duration-500 ${dk ? "dark" : ""}`}
      style={{
        background: c.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <ParticlesHero darkMode={dk} />
      <div className="relative z-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { transition: background-color 0.2s, border-color 0.2s, color 0.15s; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 10px; }
        button, select, label, a { cursor: pointer !important; }
        .nav-link:not(.active-nav):hover { background: rgba(100,146,201,0.15) !important; color: #6492C9 !important; }
        .nav-link:active { transform: translateY(0); }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pd-item { color: #64748B; background: transparent; transition: background 0.15s, color 0.15s; }
        .pd-item:hover { background: #F8FAFC; color: #1E293B; }
        .dark .pd-item:hover { background: #1A2333; color: #F0F3FA; }
        .pd-item-danger { color: #EF4444; background: transparent; transition: background 0.15s; }
        .pd-item-danger:hover { background: rgba(239,68,68,0.08); }
      `}</style>

      <nav
        className="sticky top-0 z-40 transition-all border-b"
        style={{
          background: c.nav,
          borderColor: c.border,
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="w-full px-6 h-[65px] flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2 shrink-0 mr-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #304B71, #6492C9)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="9"
                  y="2"
                  width="6"
                  height="20"
                  rx="2"
                  fill="white"
                  opacity="0.95"
                />
                <rect
                  x="2"
                  y="9"
                  width="20"
                  height="6"
                  rx="2"
                  fill="white"
                  opacity="0.95"
                />
                <path
                  d="M4 14 L6 10 L8 13 L10 7 L12 15 L14 11 L16 13 L18 11"
                  stroke="#6492C9"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-base" style={{ color: c.txt }}>
                MedSmart
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div
            className="hidden lg:flex items-center justify-center gap-1 flex-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {NAV.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`nav-link${isActive ? " active-nav" : ""} relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all`}
                  style={{
                    color: isActive ? "#fff" : c.txt2,
                    background: isActive ? c.blue : "transparent",
                    opacity: isInConsultation ? 0.4 : 1,
                    pointerEvents: isInConsultation ? "none" : "auto",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 ml-auto shrink-0">

            {/* Profile Dropdown */}
            <div className="relative">
              {safeRequests.length > 0 && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 z-10 flex items-center justify-center"
                  style={{
                    borderColor: c.nav,
                    fontSize: 7,
                    color: "#fff",
                    fontWeight: 800,
                    pointerEvents: "none",
                  }}
                >
                  {safeRequests.length}
                </div>
              )}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:opacity-80"
                style={{
                  border: `1px solid ${c.border}`,
                  background: "transparent",
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #304B71, #6492C9)",
                  }}
                >
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{ color: c.txt }}
                  >
                    {doctorName}
                  </p>
                  <p className="text-[10px]" style={{ color: c.txt3 }}>
                    ID: #{user?.id || "----"}
                  </p>
                </div>
                <ChevronDown size={13} style={{ color: c.txt3 }} />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-12 w-60 rounded-[20px] overflow-hidden z-50 shadow-xl border animate-in slide-in-from-top-2 duration-200"
                  style={{
                    background: dk ? c.card : "#ffffff",
                    borderColor: c.border,
                  }}
                >
                  {/* User header */}
                  <div
                    className="px-4 py-3 border-b"
                    style={{ borderColor: c.border }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #304B71, #6492C9)",
                        }}
                      >
                        {initials}
                      </div>
                      <div className="overflow-hidden">
                        <p
                          className="text-sm font-bold truncate"
                          style={{ color: c.txt }}
                        >
                          {doctorName}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: c.txt3 }}
                        >
                          {doctorRole} · #{user?.id || "---"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-1">
                    {/* Settings */}
                    <button
                      onClick={() => {
                        setCurrentPage("settings");
                        setProfileOpen(false);
                      }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl"
                    >
                      <Settings size={16} />
                      {t('dashboard.doctor.nav.settings')}
                    </button>

                    {/* Dark mode */}
                    <div className="pd-item w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl">
                      <Sun
                        size={14}
                        style={{ color: dk ? c.txt3 : c.amber }}
                      />
                      <button
                        onClick={toggleTheme}
                        className="relative w-10 h-5 rounded-full transition-all duration-300"
                        style={{
                          background: dk
                            ? "linear-gradient(135deg, #304B71, #4A6FA5)"
                            : "#D5DEEF",
                          border: `1px solid ${dk ? c.blue + "80" : "#BBC8DC"}`,
                        }}
                      >
                        <div
                          className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-md transition-all duration-300"
                          style={{ left: dk ? "20px" : "2px" }}
                        />
                      </button>
                      <Moon size={13} style={{ color: dk ? c.blue : c.txt3 }} />
                    </div>

                    <div
                      className="h-px my-1 mx-2"
                      style={{ background: c.border }}
                    />

                    {/* Logout */}
                    <button
                      onClick={onLogout}
                      className="pd-item-danger w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-xl"
                    >
                      <LogOut size={16} /> {t('dashboard.doctor.nav.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border"
              style={{
                background: c.card,
                borderColor: c.border,
                color: c.txt2,
              }}
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenu && (
          <div
            className="lg:hidden px-4 py-4 border-t animate-in slide-in-from-top duration-300"
            style={{ background: c.nav, borderColor: c.border }}
          >
            <div className="grid grid-cols-2 gap-2">
              {NAV.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all"
                    style={{
                      color: isActive ? "#fff" : c.txt2,
                      background: isActive ? c.blue : c.bg + "44",
                      opacity: isInConsultation ? 0.4 : 1,
                      pointerEvents: isInConsultation ? "none" : "auto",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {isInConsultation && (
        <div
          className="w-full px-6 py-2 flex items-center gap-3 border-b"
          style={{ background: c.amber + "18", borderColor: c.amber + "44" }}
        >
          <span style={{ color: c.amber }}>⚠</span>
          <p className="text-xs font-semibold" style={{ color: c.amber }}>
            {t('dashboard.doctor.consultation.ongoingWarning')}
          </p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 pb-24">
        <ErrorBoundary>{renderContent()}</ErrorBoundary>
      </main>

      {profileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </div>
    </div>
  );
}
