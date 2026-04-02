import { useState, useEffect, useRef, useMemo } from "react";
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
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
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

// ─── Theme tokens (identique au patient/pharmacist dashboard) ────────────────────────────
const T = {
  light: {
    bg: "#F0F4F8",
    card: "#ffffff",
    nav: "#ffffff",
    border: "#E4EAF5",
    txt: "#0D1B2E",
    txt2: "#5A6E8A",
    txt3: "#9AACBE",
    blue: "#4A6FA5",
    blueLight: "#EEF3FB",
    green: "#2D8C6F",
    amber: "#E8A838",
    red: "#E05555",
    purple: "#7B5EA7",
  },
  dark: {
    bg: "#0D1117",
    card: "#141B27",
    nav: "#141B27",
    border: "rgba(99,142,203,0.15)",
    txt: "#F0F3FA",
    txt2: "#8AAEE0",
    txt3: "#4A6080",
    blue: "#638ECB",
    blueLight: "#1A2333",
    green: "#4CAF82",
    amber: "#F0A500",
    red: "#E05555",
    purple: "#9B7FD4",
  },
};

// ─── Reusable components ──────────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk }) {
  const c = dk ? T.dark : T.light;
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border ${className}`}
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
function TodaysSchedule({ appointments = [] }) {
  const { theme } = useTheme();
  const dk = theme === "dark";

  const defaultData = [
    { time: "08:00", name: "Ahmed Meziane", type: "In-Person" },
    { time: "09:00", type: "empty" },
    { time: "10:00", name: "Nadia Khelifa", type: "Teleconsultation" },
    { time: "10:30", name: "Alex Johnson", type: "In-Person" },
    { time: "11:30", type: "empty" },
    { time: "14:00", name: "Youcef Belaid", type: "Home Visit" },
    { time: "15:30", name: "Sara Ait", type: "In-Person" },
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
          Today's Schedule
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            dk
              ? "bg-[#638ECB]/10 text-[#8AAEE0] border-[#4A6FA5]/20"
              : "bg-[#EEF2FB] text-[#4A6FA5] border-[#4A6FA5]/20"
          }`}
        >
          {count} appointments
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4">
            {/* Time Column */}
            <div className="w-12 shrink-0 py-2">
              <span
                className={`text-sm font-bold ${dk ? "text-[#8AAEE0]" : "text-[#5A6E8A]"}`}
              >
                {item.time}
              </span>
            </div>

            {/* Entry Column */}
            <div className="flex-1">
              {item.type === "empty" ? (
                <div className="h-full flex items-center min-h-[40px]">
                  <div
                    className={`w-full border-b border-dashed ${dk ? "border-[#638ECB]/20" : "border-[#E4EAF5]"}`}
                  />
                </div>
              ) : (
                <div
                  className={`py-3 px-4 border-l-[3px] rounded-r-lg shadow-sm transition-all hover:translate-x-1 ${getTypeStyles(item.type)}`}
                >
                  <p className="text-sm font-bold truncate">
                    {item.name || item.patient}{" "}
                    <span className="mx-1 opacity-40">·</span> {item.type}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NEW COMPONENT : PATIENT REQUESTS ─────────────────────────────────────────

const MOCK_REQUESTS = [
  {
    initials: "MK",
    name: "Meriem Kaci",
    detail: "First visit",
    date: "Oct 26",
    time: "09:45",
    color: "bg-[#6492C9]",
  },
  {
    initials: "RB",
    name: "Riad Bensalem",
    detail: "Follow-up",
    date: "Oct 27",
    time: "14:30",
    color: "bg-[#3DAA73]",
  },
  {
    initials: "LB",
    name: "Lynda Boudaoud",
    detail: "First visit",
    date: "Oct 28",
    time: "11:00",
    color: "bg-[#F0A500]",
  },
];

function PatientRequests({ requests = MOCK_REQUESTS }) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;
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
          Patient Requests
        </h2>
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
            dk
              ? "bg-amber-900/20 text-amber-500 border-amber-800/30"
              : "bg-amber-50 text-amber-600 border-amber-200"
          }`}
        >
          {safeRequests.length} pending
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
  doctorName,
}) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;

  const kpis = [
    {
      label: "Today's Consultations",
      value: Array.isArray(appointments) ? appointments.length : 0,
      icon: Users,
      color: c.green,
    },
    {
      label: "Total Patients",
      value: Array.isArray(patients) ? patients.length : 0,
      icon: User,
      color: c.blue,
    },
    {
      label: "Pending Requests",
      value: Array.isArray(patientRequests) ? patientRequests.length : 0,
      icon: Clock,
      color: c.amber,
    },
    { label: "Avg. Rating", value: "4.8", icon: Star, color: c.purple },
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
            time: "08:30",
            patient: "Mounir Benali",
            type: "in-person",
            status: "Completed",
            detail: "Monthly Checkup",
          },
          {
            time: "10:15",
            patient: "Sonia Ghomari",
            type: "tele",
            status: "Confirmed",
            detail: "Follow-up",
          },
          {
            time: "11:00",
            patient: "Karim Brahimi",
            type: "in-person",
            status: "In Progress",
            detail: "New Consultation",
          },
          {
            time: "14:30",
            patient: "Amel Ziani",
            type: "tele",
            status: "Confirmed",
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
          <TodaysSchedule appointments={appointments} />
        </div>
        <div className="lg:col-span-1">
          {/* Les requêtes en attente ici */}
          <PatientRequests requests={patientRequests} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-VIEW : SCHEDULE
// ============================================================================

function ScheduleView() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("week"); // "week" | "month"
  const { appointments = [], patientRequests = [] } = useData();

  // MOCK DATA if needed
  const SAMPLE = [
    {
      time: "08:00",
      name: "Ahmed Meziane",
      type: "in-person",
      date: format(new Date(), "yyyy-MM-dd"),
    },
    {
      time: "08:45",
      name: "Meriem Kaci",
      type: "in-person",
      date: format(new Date(), "yyyy-MM-dd"),
    },
    {
      time: "10:00",
      name: "Nadia Khelifa",
      type: "tele",
      date: format(new Date(), "yyyy-MM-dd"),
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

  const handleSlotCreated = (slot) => {
    console.log("New slot created:", slot);
    // Potential integration: api.createSlot(slot).then(...)
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
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
          <TodaysSchedule appointments={filteredAppointments} />
        </div>
        <div className="lg:col-span-1">
          {/* Les requêtes en attente ici */}
          <PatientRequests requests={pending} />
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

  const { patients = [] } = useData();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);

  // ── Add Patient Modal state ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
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
                  <h3 className="font-bold text-base" style={{ color: c.txt }}>Nouveau Patient</h3>
                  <p className="text-xs" style={{ color: c.txt3 }}>Remplissez les informations du patient</p>
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
                  <span className="absolute -top-2.5 left-3 px-1 text-[11px] font-medium" style={{ color: c.txt3, background: dk ? "#141B27" : "#fff" }}>Prénom</span>
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
                  <span className="absolute -top-2.5 left-3 px-1 text-[11px] font-medium" style={{ color: c.txt3, background: dk ? "#141B27" : "#fff" }}>Nom</span>
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

              {/* Âge — chiffres UNIQUEMENT, max 3 digits */}
              <div className="relative">
                <span className="absolute -top-2.5 left-3 px-1 text-[11px] font-medium" style={{ color: c.txt3, background: dk ? "#141B27" : "#fff" }}>Âge</span>
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



              {/* Condition — RÈGLE 1 : dropdown exact template */}
              <div className="relative">
                <span className="absolute -top-2.5 left-3 px-1 text-[11px] font-medium z-10" style={{ color: c.txt3, background: dk ? "#141B27" : "#fff" }}>Condition</span>
                <button
                  type="button"
                  onClick={() => { setConditionOpen(!conditionOpen); setStatusOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl border text-sm text-left outline-none transition-all"
                  style={{ borderColor: conditionOpen ? c.blue : c.border, background: dk ? "#0D1117" : "#fff", color: newPatient.condition ? c.txt : c.txt3 }}
                >
                  <span>{newPatient.condition || "Sélectionner..."}</span>
                  <ChevronDown size={18} className={`transition-transform shrink-0 ${conditionOpen ? "rotate-180" : ""}`} style={{ color: c.txt3 }} />
                </button>
                {conditionOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setConditionOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-xl z-50 py-2 max-h-60 overflow-y-auto" style={{ background: dk ? "#141B27" : "#fff", borderColor: c.border }}>
                      {CONDITION_OPTIONS.map((opt) => (
                        <button
                          key={opt} type="button"
                          onClick={() => { setNewPatient((p) => ({ ...p, condition: opt })); setConditionOpen(false); }}
                          className="w-full flex items-center px-5 py-3 text-sm font-medium transition-all text-left"
                          style={{
                            color: newPatient.condition === opt ? c.blue : c.txt,
                            background: newPatient.condition === opt ? c.blue + "15" : "transparent",
                          }}
                          onMouseEnter={(e) => { if (newPatient.condition !== opt) e.currentTarget.style.background = c.blue + "10"; }}
                          onMouseLeave={(e) => { if (newPatient.condition !== opt) e.currentTarget.style.background = "transparent"; }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Statut — RÈGLE 1 : dropdown exact template */}
              <div className="relative">
                <span className="absolute -top-2.5 left-3 px-1 text-[11px] font-medium z-10" style={{ color: c.txt3, background: dk ? "#141B27" : "#fff" }}>Statut</span>
                <button
                  type="button"
                  onClick={() => { setStatusOpen(!statusOpen); setConditionOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl border text-sm text-left outline-none transition-all"
                  style={{ borderColor: statusOpen ? c.blue : c.border, background: dk ? "#0D1117" : "#fff", color: newPatient.status ? c.txt : c.txt3 }}
                >
                  <span>{newPatient.status || "Sélectionner..."}</span>
                  <ChevronDown size={18} className={`transition-transform shrink-0 ${statusOpen ? "rotate-180" : ""}`} style={{ color: c.txt3 }} />
                </button>
                {statusOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-xl z-50 py-2 max-h-60 overflow-y-auto" style={{ background: dk ? "#141B27" : "#fff", borderColor: c.border }}>
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt} type="button"
                          onClick={() => { setNewPatient((p) => ({ ...p, status: opt })); setStatusOpen(false); }}
                          className="w-full flex items-center px-5 py-3 text-sm font-medium transition-all text-left"
                          style={{
                            color: newPatient.status === opt ? c.blue : c.txt,
                            background: newPatient.status === opt ? c.blue + "15" : "transparent",
                          }}
                          onMouseEnter={(e) => { if (newPatient.status !== opt) e.currentTarget.style.background = c.blue + "10"; }}
                          onMouseLeave={(e) => { if (newPatient.status !== opt) e.currentTarget.style.background = "transparent"; }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={handleSavePatient}
                disabled={!newPatient.firstName.trim() || !newPatient.lastName.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${c.blue}, #304B71)` }}
              >
                <Check size={16} /> Enregistrer
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: c.border, color: c.txt2 }}
              >
                Annuler
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
            placeholder="Search by name, ID, status or condition..."
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
          <Plus size={18} /> Add Patient
        </button>
      </div>

      <Card dk={dk} className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: c.bg }}
            >
              <Search size={24} style={{ color: c.txt3 }} />
            </div>
            <p className="font-bold mb-1" style={{ color: c.txt }}>
              {search ? `No results for "${search}"` : "No patients yet"}
            </p>
            <p className="text-sm" style={{ color: c.txt3 }}>
              Try refining your search
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
                "PATIENT",
                "AGE",
                "CONDITION",
                "LAST VISIT",
                "NEXT APPT",
                "STATUS",
                "ACTION",
              ].map((c) => (
                <span key={c}>{c}</span>
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
                    className="grid grid-cols-[2.5fr_0.8fr_1.5fr_1fr_1.3fr_1.2fr_1fr] px-6 py-4 items-center transition-colors hover:bg-opacity-5"
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
                      Consult
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
                  Page {page} / {totalPages}
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
                    Previous
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
                    Next
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
  const [freqOpen, setFreqOpen] = useState(false);
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
    if (!form.patientName?.trim()) err.patientName = "Required";
    if (!form.medication.trim()) err.medication = "Required";
    if (!form.dosage.trim()) err.dosage = "Required";
    if (!form.duration.trim()) err.duration = "Required";
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
    setSuccess("Prescription created successfully.");
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
            Write New Prescription
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldWrapper
              name="patientName"
              label="Patient Name"
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
                  placeholder="Type patient full name..."
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
                <label
                  className="text-[13px] font-bold uppercase tracking-wider ml-1"
                  style={{ color: c.txt3 }}
                >
                  Frequency
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFreqOpen(!freqOpen)}
                    className="w-full flex items-center justify-between px-5 py-3 rounded-2xl border transition-all duration-300 min-h-[56px]"
                    style={{
                      background: dk ? c.bg + "22" : "#F8FAFC",
                      borderColor: freqOpen ? "#6492C9" : c.border,
                      boxShadow: freqOpen
                        ? "0 0 0 4px rgba(100,146,201,0.1)"
                        : "none",
                      color: c.txt,
                    }}
                  >
                    <span className="text-sm font-semibold">
                      {form.frequency}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${freqOpen ? "rotate-180" : ""}`}
                      style={{ color: c.txt3 }}
                    />
                  </button>

                  {freqOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setFreqOpen(false)}
                      />
                      <div
                        className="absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden"
                        style={{ background: c.card, borderColor: c.border }}
                      >
                        {FREQUENCY_OPTIONS.map((f) => {
                          const isS = form.frequency === f;
                          return (
                            <button
                              key={f}
                              type="button"
                              onClick={() => {
                                setForm((p) => ({ ...p, frequency: f }));
                                setFreqOpen(false);
                              }}
                              className="w-full flex items-center px-5 py-3 text-sm font-bold transition-all text-left hover:bg-opacity-5"
                              style={{
                                background: isS ? c.blue + "15" : "transparent",
                                color: isS ? c.blue : c.txt,
                              }}
                            >
                              {f}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
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
                Notes (optional)
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
              Generate QR Prescription
            </button>
          </form>
        </Card>

        <Card dk={dk} className="p-6 h-fit">
          <h2 className="text-[17px] font-bold mb-5" style={{ color: c.txt }}>
            Recent Prescriptions
          </h2>
          {rxList.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <FileText
                size={40}
                className="mx-auto mb-3"
                style={{ color: c.txt3 }}
              />
              <p className="text-sm font-bold" style={{ color: c.txt3 }}>
                No prescriptions yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rxList.slice(0, 6).map((rx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl border"
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

function PatientDetailView({ patient, onBack }) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;

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
              <Badge color="#EF4444" bg="#EF444415">
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
          <Card dk={dk} className="p-0 overflow-hidden shadow-2xl border-0">
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
                    {tab === "history" && "Medical History"}
                    {tab === "lab" && "Lab Results"}
                    {tab === "prescriptions" && "Past Prescriptions"}
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
                  <Plus size={14} /> ADD ANTECEDENT
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
                  <Plus size={14} /> REQUEST LAB TEST
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
                          Nouveau Dossier Médical
                        </p>
                        <button onClick={() => setShowAddHistory(false)} className="opacity-40 hover:opacity-100 transition-all hover:bg-red-500/10 p-1 rounded-lg">
                          <X size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">Pathologie</label>
                          <input
                            placeholder="ex: Hypertension"
                            value={newHist.title}
                            onChange={e => setNewHist({...newHist, title: e.target.value})}
                            className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500"
                            style={{ background: dk ? "#111827" : "#fff", borderColor: c.border, color: c.txt }}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">Date diagnostic</label>
                          <input
                            type="date"
                            value={newHist.date}
                            onChange={e => setNewHist({...newHist, date: e.target.value})}
                            className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500 font-sans"
                            style={{ 
                              background: dk ? "#111827" : "#fff", 
                              borderColor: c.border, 
                              color: c.txt,
                              fontFamily: 'inherit'
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">Type d'Antécédent</label>
                        <select
                          value={newHist.type}
                          onChange={e => setNewHist({...newHist, type: e.target.value})}
                          className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500"
                          style={{ background: dk ? "#111827" : "#fff", borderColor: c.border, color: c.txt }}
                        >
                          <option value="Chronic">Chronique</option>
                          <option value="Acute">Aigu</option>
                          <option value="Surgical">Chirurgical</option>
                          <option value="Allergy">Allergie</option>
                        </select>
                      </div>

                      <div className="flex gap-4 pt-3">
                        <button 
                          onClick={() => setShowAddHistory(false)} 
                          className="flex-1 py-4 rounded-xl text-xs font-black transition-all hover:bg-opacity-5" 
                          style={{ color: c.txt2 }}
                        >
                          ANNULER
                        </button>
                        <button 
                          onClick={handleAddHistory} 
                          className="flex-[2] py-4 rounded-xl text-white text-xs font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95" 
                          style={{ background: c.blue, boxShadow: `0 8px 25px ${c.blue}44` }}
                        >
                          METTRE À JOUR LE DOSSIER
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
                              background: h.type === "Chronic" ? "#EF444415" : c.blue + "15", 
                              color: h.type === "Chronic" ? "#EF4444" : c.blue 
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
                          Nouvelle Prescription d'Analyse
                        </p>
                        <button onClick={() => setShowAddLab(false)} className="opacity-40 hover:opacity-100 transition-all hover:bg-red-500/10 p-1 rounded-lg">
                          <X size={18} />
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">Analyse demandée</label>
                        <input
                          placeholder="ex: Bilan Lipidique Complet"
                          value={newLab.test}
                          onChange={e => setNewLab({...newLab, test: e.target.value})}
                          className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500"
                          style={{ background: dk ? "#111827" : "#fff", borderColor: c.border, color: c.txt }}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider opacity-40 ml-1">Notes / Urgence</label>
                        <textarea
                          placeholder="Indications cliniques..."
                          value={newLab.note}
                          onChange={e => setNewLab({...newLab, note: e.target.value})}
                          className="w-full px-4 py-4 rounded-2xl border-2 text-sm font-bold outline-none transition-all focus:border-blue-500 resize-none h-24"
                          style={{ background: dk ? "#111827" : "#fff", borderColor: c.border, color: c.txt }}
                        />
                      </div>

                      <div className="flex gap-4 pt-3">
                        <button 
                          onClick={() => setShowAddLab(false)} 
                          className="flex-1 py-4 rounded-xl text-xs font-black transition-all hover:bg-opacity-5" 
                          style={{ color: c.txt2 }}
                        >
                          ANNULER
                        </button>
                        <button 
                          onClick={handleAddLab} 
                          className="flex-[2] py-4 rounded-xl text-white text-xs font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95" 
                          style={{ background: c.blue, boxShadow: `0 8px 25px ${c.blue}44` }}
                        >
                          CONFIRMER LA DEMANDE
                        </button>
                      </div>
                    </div>
                  )}

                  {labs.map((l, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:shadow-md group relative overflow-hidden"
                      style={{
                        borderColor: c.border,
                        background: dk ? "#ffffff03" : "#00000002",
                      }}
                    >
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDeleteLab(i)}
                        className="absolute -right-12 group-hover:right-2 top-2 p-2 rounded-lg transition-all hover:bg-red-500/10 text-red-500"
                        title="Supprimer la demande"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-opacity-10" style={{ background: l.status === "Requested" ? "#E8A83822" : c.blue + "15" }}>
                          <Activity size={20} style={{ color: l.status === "Requested" ? "#E8A838" : c.blue }} />
                        </div>
                        <div>
                          <p
                            className="text-base font-black"
                            style={{ color: c.txt }}
                          >
                            {l.test}
                          </p>
                          <p
                            className="text-xs opacity-50 font-bold mt-1"
                            style={{ color: c.txt }}
                          >
                            Valeur de réf: {l.ref}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-base font-black"
                          style={{
                            color: l.status === "Requested" ? "#E8A838" : (l.status === "Normal" ? c.green : "#EF4444"),
                          }}
                        >
                          {l.result}
                        </p>
                        <span
                          className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                          style={{
                            background: l.status === "Requested" ? "#E8A83815" : (l.status === "Normal" ? c.green + "15" : "#EF444415"),
                            color: l.status === "Requested" ? "#E8A838" : (l.status === "Normal" ? c.green : "#EF4444"),
                          }}
                        >
                          {l.status}
                        </span>
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
              Compte-rendu
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-40"
                  style={{ color: c.txt }}
                >
                  Symptômes actuels
                </label>
                <textarea
                  className="w-full rounded-[20px] p-5 text-sm font-bold border-2 outline-none transition-all focus:border-blue-500 min-h-[120px] resize-none"
                  style={{
                    background: dk ? "#111827" : "#F8FAFC",
                    borderColor: c.border,
                    color: c.txt,
                  }}
                  placeholder="Notes cliniques..."
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-40"
                  style={{ color: c.txt }}
                >
                  Diagnostic préliminaire
                </label>
                <input
                  className="w-full rounded-2xl px-5 py-4 text-sm font-bold border-2 outline-none focus:border-blue-500"
                  style={{
                    background: dk ? "#111827" : "#F8FAFC",
                    borderColor: c.border,
                    color: c.txt,
                  }}
                  placeholder="Recherche de diagnostic..."
                />
              </div>
              <button
                className="w-full py-4.5 rounded-2xl text-white font-black text-[15px] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 mt-4"
                style={{
                  background: `linear-gradient(135deg, ${c.blue}, #304B71)`,
                  boxShadow: `0 12px 30px ${c.blue}44`,
                }}
              >
                <Send size={20} /> TERMINER LA CONSULTATION
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

  let data = { appointments: [], prescriptions: [], patients: [] };
  try {
    data = useData();
  } catch (e) {
    console.error("StatisticsView: Context error", e);
  }

  const appointments = Array.isArray(data?.appointments) ? data.appointments : [];
  const prescriptions = Array.isArray(data?.prescriptions) ? data.prescriptions : [];
  const patients = Array.isArray(data?.patients) ? data.patients : [];

  const stats = [
    {
      label: "Consultations",
      value: appointments.length || 312,
      icon: Users,
      color: c.green,
    },
    {
      label: "Prescriptions",
      value: prescriptions.length || 94,
      icon: FileText,
      color: c.blue,
    },
    {
      label: "Patients",
      value: patients.length || 847,
      icon: Users,
      color: c.purple,
    },
    {
      label: "Avg. Rating",
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
          Weekly Activity
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
                    {h} appointments
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
  const [showPwd, setShowPwd] = useState(false);
  const [wilayaOpen, setWilayaOpen] = useState(false);
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
      setStatus({ type: "success", msg: "Profil mis à jour avec succès ✅" });
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    } catch (err) {
      setStatus({ type: "error", msg: "Erreur lors de la mise à jour ❌" });
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePwd = async () => {
    try {
      setIsSavingPwd(true);
      setPwdStatus({ type: "", msg: "" });
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:8000/api/auth/password/change/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(pwdForm),
      });
      if (!res.ok) throw new Error("Erreur");
      setPwdStatus({ type: "success", msg: "Mot de passe modifié ✅" });
      setPwdForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => setPwdStatus({ type: "", msg: "" }), 4000);
    } catch (err) {
      setPwdStatus({ type: "error", msg: "Erreur lors du changement ❌" });
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
          <p className="font-semibold mb-5" style={{ color: c.txt }}>Profile</p>
          {status.msg && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{
              background: status.type === "success" ? "#2D8C6F12" : "#E0555512",
              color: status.type === "success" ? "#2D8C6F" : "#E05555",
              border: `1px solid ${status.type === "success" ? "#2D8C6F44" : "#E0555544"}`,
            }}>{status.msg}</div>
          )}
          {[
            { label: "Full Name", key: "name" },
            { label: "Email", key: "email" },
            { label: "Phone", key: "phone" },
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
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </Card>

        {/* Security card */}
        <Card dk={dk}>
          <p className="font-semibold mb-5" style={{ color: c.txt }}>Security</p>
          {pwdStatus.msg && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{
              background: pwdStatus.type === "success" ? "#2D8C6F12" : "#E0555512",
              color: pwdStatus.type === "success" ? "#2D8C6F" : "#E05555",
              border: `1px solid ${pwdStatus.type === "success" ? "#2D8C6F44" : "#E0555544"}`,
            }}>{pwdStatus.msg}</div>
          )}
          {[
            { label: "Current Password", key: "currentPassword" },
            { label: "New Password", key: "newPassword" },
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
            {isSavingPwd ? "Updating..." : "Update Password"}
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
            <p className="font-bold text-base" style={{ color: c.txt }}>Clinic Location & Maps</p>
            <p className="text-xs" style={{ color: c.txt3 }}>Gérez l'adresse visible par les patients</p>
          </div>
        </div>

        {/* Success banner */}
        {locSaved && (
          <div className="mb-5 p-3 rounded-xl text-xs font-semibold flex items-center gap-2" style={{
            background: "#2D8C6F12", color: "#2D8C6F", border: "1px solid #2D8C6F44",
          }}>
            <Check size={14} /> Localisation mise à jour avec succès ✅
          </div>
        )}

        {/* Responsive 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: form fields */}
          <div className="space-y-5">

            {/* Adresse de l'établissement */}
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>Adresse de l'établissement</label>
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
              <label className={labelCls} style={{ color: c.txt2 }}>Commune</label>
              <input
                type="text"
                placeholder="Ex: Alger-Centre"
                value={locForm.commune}
                onChange={(e) => setLocForm((f) => ({ ...f, commune: e.target.value }))}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            {/* Wilaya — Custom dropdown */}
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>Wilaya</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setWilayaOpen(!wilayaOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={{ ...inputStyle, borderColor: wilayaOpen ? c.blue : c.border }}
                >
                  <span style={{ color: locForm.wilaya ? c.txt : c.txt3 }}>{locForm.wilaya || "Sélectionner..."}</span>
                  <ChevronDown size={16} className={`shrink-0 transition-transform ${wilayaOpen ? "rotate-180" : ""}`} style={{ color: c.txt3 }} />
                </button>
                {wilayaOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setWilayaOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-xl z-50 py-2 max-h-56 overflow-y-auto"
                      style={{ background: dk ? "#141B27" : "#fff", borderColor: c.border }}>
                      {WILAYAS_LIST.map((w) => (
                        <button
                          key={w} type="button"
                          onClick={() => { setLocForm((f) => ({ ...f, wilaya: w })); setWilayaOpen(false); }}
                          className="w-full flex items-center px-5 py-2.5 text-sm font-medium transition-all text-left"
                          style={{
                            color: locForm.wilaya === w ? c.blue : c.txt,
                            background: locForm.wilaya === w ? c.blue + "15" : "transparent",
                          }}
                          onMouseEnter={(e) => { if (locForm.wilaya !== w) e.currentTarget.style.background = c.blue + "10"; }}
                          onMouseLeave={(e) => { if (locForm.wilaya !== w) e.currentTarget.style.background = "transparent"; }}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Google Maps URL */}
            <div>
              <label className={labelCls} style={{ color: c.txt2 }}>Lien Google Maps (Optionnel)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Collez l'URL Google Maps ici..."
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
              <MapPin size={15} /> Mettre à jour la carte
            </button>
          </div>

          {/* Right: map preview with Smart Parser */}
          <div className="flex flex-col gap-3">
            <label className={labelCls} style={{ color: c.txt2 }}>Map Preview</label>
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
                      <MapPin size={12} /> Ouvrir dans Maps
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
                    <p className="text-sm font-bold" style={{ color: c.txt }}>Map Preview</p>
                    <p className="text-xs mt-1" style={{ color: c.txt3 }}>
                      Collez une URL Maps ou entrez votre adresse
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
          <p className="font-semibold mb-4" style={{ color: c.txt }}>Language</p>
          <div className="flex gap-2 flex-wrap">
            {["🇫🇷 Français", "🇩🇿 العربية", "🇬🇧 English"].map((lang, i) => (
              <button
                key={lang}
                className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                style={{
                  background: i === 0 ? c.blue : "transparent",
                  color: i === 0 ? "#fff" : c.txt2,
                  borderColor: i === 0 ? c.blue : c.border,
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </Card>
        <Card dk={dk}>
          <p className="font-semibold mb-2" style={{ color: c.txt }}>About</p>
          <p className="text-sm" style={{ color: c.txt2 }}>MedSmart v2.1.0 · Connected Healthcare Platform</p>
          <p className="text-xs mt-1" style={{ color: c.txt3 }}>CNAS Certified · RGPD Compliant · Hosted in Algeria</p>
        </Card>
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

  const { userData: user } = useAuth();
  const { patients = [], appointments = [], patientRequests = [] } = useData();

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const firstName = user?.first_name || user?.firstName || "";
  const lastName = user?.last_name || user?.lastName || "";
  const doctorName =
    firstName && lastName ? `Dr. ${firstName} ${lastName}` : "Dr. Benali Karim";
  const doctorRole = user?.specialty || user?.role || "Médecin Specialist";
  const initials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : "DR";

  const safePatients = Array.isArray(patients) ? patients : [];
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safeRequests = Array.isArray(patientRequests) ? patientRequests : [];

  const NAV = [
    { id: "dashboard", label: "Dashboard" },
    { id: "schedule", label: "Schedule" },
    { id: "patients", label: "Patients" },
    { id: "prescriptions", label: "Prescriptions" },
    { id: "statistics", label: "Statistics" },
  ];

  const renderContent = () => {
    switch (currentPage.toLowerCase()) {
      case "schedule":
        return <ScheduleView />;
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
            doctorName={doctorName}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${dk ? "dark" : ""}`}
      style={{
        background: c.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
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
                      Settings
                    </button>

                    {/* Dark mode */}
                    <div className="pd-item w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl">
                      <Sun
                        size={14}
                        style={{ color: dk ? c.txt3 : "#E8A838" }}
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
                      <LogOut size={16} /> Logout
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

      <main className="max-w-7xl mx-auto px-6 py-8 pb-24">
        {renderContent()}
      </main>

      {profileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
}
