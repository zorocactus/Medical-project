import { useState, useEffect } from "react";
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

function PatientsView() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;

  const { patients = [] } = useData();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);

  const safe = Array.isArray(patients) ? patients : [];
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

function SettingsView() {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const c = dk ? T.dark : T.light;
  const { userData: user } = useAuth();
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Alger",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [pwdStatus, setPwdStatus] = useState({ type: "", msg: "" });
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email || "",
        phone: user.phone || "",
        city: "Alger",
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

      await api.updateMe({
        first_name,
        last_name,
        phone: form.phone,
      });
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
      const res = await fetch(
        "http://localhost:8000/api/auth/password/change/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pwdForm),
        },
      );
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

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <div className="space-y-5">
          <Card dk={dk}>
            <p className="font-semibold mb-5" style={{ color: c.txt }}>
              Profile Settings
            </p>
            {status.msg && (
              <div
                className="mb-4 p-3 rounded-xl text-xs font-semibold"
                style={{
                  background:
                    status.type === "success" ? "#2D8C6F12" : "#E0555512",
                  color: status.type === "success" ? "#2D8C6F" : "#E05555",
                  border: `1px solid ${status.type === "success" ? "#2D8C6F44" : "#E0555544"}`,
                }}
              >
                {status.msg}
              </div>
            )}
            {[
              { label: "Full Name", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Phone", key: "phone", type: "tel" },
            ].map((field) => (
              <div key={field.key} className="mb-4">
                <label
                  className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                  style={{ color: c.txt2 }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field.key]: e.target.value }))
                  }
                  disabled={field.key === "email"}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all focus:ring-2"
                  style={{
                    background: dk ? "#1A2333" : "#F8FAFC",
                    borderColor: c.border,
                    color: field.key === "email" ? c.txt3 : c.txt,
                  }}
                />
              </div>
            ))}
            <div className="mb-4">
              <label
                className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                style={{ color: c.txt2 }}
              >
                City
              </label>
              <select
                value={form.city}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all focus:ring-2"
                style={{
                  background: dk ? "#1A2333" : "#F8FAFC",
                  borderColor: c.border,
                  color: c.txt,
                }}
              >
                <option value="Alger">Alger</option>
                <option value="Oran">Oran</option>
                <option value="Constantine">Constantine</option>
              </select>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: c.blue, opacity: isSaving ? 0.7 : 1 }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </Card>
          <Card dk={dk}>
            <p className="font-semibold mb-5" style={{ color: c.txt }}>
              Security
            </p>
            {pwdStatus.msg && (
              <div
                className="mb-4 p-3 rounded-xl text-xs font-semibold"
                style={{
                  background:
                    pwdStatus.type === "success" ? "#2D8C6F12" : "#E0555512",
                  color: pwdStatus.type === "success" ? "#2D8C6F" : "#E05555",
                  border: `1px solid ${pwdStatus.type === "success" ? "#2D8C6F44" : "#E0555544"}`,
                }}
              >
                {pwdStatus.msg}
              </div>
            )}
            {[
              { label: "Current Password", key: "currentPassword" },
              { label: "New Password", key: "newPassword" },
            ].map((field) => (
              <div key={field.key} className="mb-4 relative">
                <label
                  className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                  style={{ color: c.txt2 }}
                >
                  {field.label}
                </label>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={pwdForm[field.key]}
                  onChange={(e) =>
                    setPwdForm({ ...pwdForm, [field.key]: e.target.value })
                  }
                  className="w-full px-4 py-2.5 pr-12 rounded-xl text-sm outline-none border transition-all focus:ring-2"
                  style={{
                    background: dk ? "#1A2333" : "#F8FAFC",
                    borderColor: c.border,
                    color: c.txt,
                  }}
                />
                <button
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-8"
                  style={{ color: c.txt3 }}
                >
                  {showPwd ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            ))}
            <button
              onClick={handleSavePwd}
              disabled={isSavingPwd}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80 active:scale-95"
              style={{
                color: c.blue,
                borderColor: c.border,
                opacity: isSavingPwd ? 0.7 : 1,
              }}
            >
              {isSavingPwd ? "Updating..." : "Update Password"}
            </button>
          </Card>
        </div>
        <div className="space-y-5">
          <Card dk={dk}>
            <p className="font-semibold mb-4" style={{ color: c.txt }}>
              Language
            </p>
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
            <p className="font-semibold mb-2" style={{ color: c.txt }}>
              About
            </p>
            <p className="text-sm" style={{ color: c.txt2 }}>
              MedSmart v2.1.0 · Connected Healthcare Platform
            </p>
            <p className="text-xs mt-1" style={{ color: c.txt3 }}>
              CNAS Certified · RGPD Compliant · Hosted in Algeria
            </p>
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

  const { userData: user } = useAuth();
  const { patients = [], appointments = [], patientRequests = [] } = useData();

  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
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
        return <PatientsView />;
      case "prescriptions":
        return <PrescriptionsView />;
      case "statistics":
        return <StatisticsView />;
      case "settings":
        return <SettingsView onLogout={onLogout} />;
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
