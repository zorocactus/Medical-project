import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import {
  LayoutDashboard,
  User,
  Brain,
  Calendar,
  FileText,
  ShoppingBag,
  Heart,
  Bell,
  Settings,
  ChevronRight,
  Search,
  AlertTriangle,
  CheckCircle,
  Circle,
  Shield,
  LogOut,
  Menu,
  ChevronDown,
  Star,
  Activity,
  Phone,
  FileSearch,
  X,
  Sun,
  Moon,
  MapPin,
  Clock,
  Pill,
  TrendingUp,
  Filter,
  QrCode,
  Download,
  Send,
  Plus,
  Check,
  AlertCircle,
  Package,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Theme tokens ─────────────────────────────────────────────────────────────
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
    navHover: "#EEF3FB",
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
    navHover: "#1A2333",
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const APPOINTMENTS = [
  {
    id: 1,
    name: "Dr. Sarah Smith",
    role: "Cardiologist",
    date: "Oct 24, 10:30 AM",
    initials: "SS",
    color: "#4A6FA5",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    role: "Dermatologist",
    date: "Nov 02, 2:15 PM",
    initials: "MC",
    color: "#2D8C6F",
  },
];
const MEDICATIONS = [
  { id: 1, name: "Lisinopril (10mg)", time: "8:00 AM · 1 Tablet", taken: true },
  {
    id: 2,
    name: "Vitamin D3 (2000 IU)",
    time: "1:00 PM · 1 Capsule",
    taken: false,
  },
  {
    id: 3,
    name: "Metformin (500mg)",
    time: "8:00 PM · 1 Tablet",
    taken: false,
  },
];
const NOTIFICATIONS_DATA = [
  {
    id: 1,
    icon: Calendar,
    color: "#4A6FA5",
    bg: "#EEF3FB",
    bgDark: "#1A2333",
    title: "Appointment Confirmed",
    sub: "Dr. Benali — 5 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: Heart,
    color: "#2D8C6F",
    bg: "#EEF8F4",
    bgDark: "#1A2D28",
    title: "Medication Reminder",
    sub: "Take Metformin — 1 hour ago",
    unread: true,
  },
  {
    id: 3,
    icon: FileSearch,
    color: "#888",
    bg: "#F5F5F5",
    bgDark: "#1A1A1A",
    title: "Analysis Ready",
    sub: "Lipid Profile — Yesterday",
    unread: false,
  },
  {
    id: 4,
    icon: AlertCircle,
    color: "#E8A838",
    bg: "#FFF8EC",
    bgDark: "#1A1508",
    title: "Prescription Expiring",
    sub: "Metformin expires in 5 days",
    unread: true,
  },
  {
    id: 5,
    icon: Check,
    color: "#2D8C6F",
    bg: "#EEF8F4",
    bgDark: "#1A2D28",
    title: "Caregiver Update",
    sub: "Fatima B. completed medication",
    unread: false,
  },
];
const PRESCRIPTIONS = [
  {
    id: 1,
    name: "Lisinopril Refill",
    status: "READY",
    color: "#2D8C6F",
    pct: 100,
    note: "Pick up at: CVS Pharmacy, 5th Ave",
  },
  {
    id: 2,
    name: "New Antibiotic",
    status: "PROCESSING",
    color: "#E8A838",
    pct: 55,
    note: "Est. Time: Tomorrow, 2 PM",
  },
];
const DOCUMENTS = [
  { id: 1, name: "Complete Blood Count", date: "Oct 18" },
  { id: 2, name: "Chest X-Ray Report", date: "Oct 10" },
  { id: 3, name: "ECG Analysis", date: "Sep 28" },
];
const PHARMACY_ITEMS = [
  {
    id: 1,
    name: "Lisinopril 10mg",
    molecule: "Lisinopril Dihydrate",
    price: "320 DZD",
    stock: "In Stock",
    cnas: true,
    qty: 1,
  },
  {
    id: 2,
    name: "Metformin 500mg",
    molecule: "Metformin HCl",
    price: "180 DZD",
    stock: "In Stock",
    cnas: true,
    qty: 2,
  },
  {
    id: 3,
    name: "Vitamin D3 2000IU",
    molecule: "Cholecalciferol",
    price: "450 DZD",
    stock: "In Stock",
    cnas: false,
    qty: 0,
  },
  {
    id: 4,
    name: "Aspirin 100mg",
    molecule: "Acetylsalicylic Acid",
    price: "90 DZD",
    stock: "In Stock",
    cnas: false,
    qty: 0,
  },
  {
    id: 5,
    name: "Amoxicillin 500mg",
    molecule: "Amoxicillin Trihydrate",
    price: "240 DZD",
    stock: "Out of Stock",
    cnas: true,
    qty: 0,
  },
  {
    id: 6,
    name: "Omeprazole 20mg",
    molecule: "Omeprazole",
    price: "280 DZD",
    stock: "In Stock",
    cnas: true,
    qty: 0,
  },
];
const CARETAKERS = [
  {
    id: 1,
    name: "Ahmed Meziane",
    role: "Professional Caregiver",
    exp: "5 yrs",
    rating: 4.6,
    price: "1200 DZD/day",
    tags: ["Diabetes", "Hypertension"],
    initials: "AM",
    color: "#2D8C6F",
  },
  {
    id: 2,
    name: "Nadia Boumediene",
    role: "Nursing Assistant",
    exp: "8 yrs",
    rating: 5.0,
    price: "1500 DZD/day",
    tags: ["Elderly Care", "Post-surgery"],
    initials: "NB",
    color: "#7B5EA7",
  },
];

// ─── Card component ───────────────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk }) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border ${className}`}
      style={{
        background: dk ? T.dark.card : T.light.card,
        borderColor: dk ? T.dark.border : T.light.border,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ color, bg, children }) {
  return (
    <span
      className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
      style={{ color, background: bg, borderColor: color + "44" }}
    >
      {children}
    </span>
  );
}

// ─── Empty State component ───────────────────────────────────────────────────
function EmptyState({ dk, icon: Icon = FileText, title, message, compact = false }) {
  const c = dk ? T.dark : T.light;
  return (
    <Card
      dk={dk}
      className={`text-center w-full ${compact ? "py-6 px-4" : "py-10 px-6"}`}
    >
      <div
        className={`${
          compact ? "w-12 h-12 mb-3" : "w-16 h-16 mb-5"
        } rounded-[20px] flex items-center justify-center mx-auto shadow-sm`}
        style={{ background: c.blueLight }}
      >
        <Icon size={compact ? 24 : 30} style={{ color: c.blue }} />
      </div>
      <h3
        className={`${compact ? "font-semibold text-base mb-1" : "font-bold text-lg mb-2"}`}
        style={{ color: c.txt }}
      >
        {title}
      </h3>
      <p
        className={`${compact ? "text-xs" : "text-sm"} max-w-[280px] mx-auto leading-relaxed`}
        style={{ color: c.txt2 }}
      >
        {message}
      </p>
    </Card>
  );
}

// ─── Emergency Modal ──────────────────────────────────────────────────────────
function EmergencyModal({ onClose, dk }) {
  const c = dk ? T.dark : T.light;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="rounded-2xl p-8 w-full max-w-md shadow-2xl border-2"
        style={{ background: c.card, borderColor: "#E05555" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(224,85,85,0.15)" }}
            >
              <AlertTriangle size={22} style={{ color: "#E05555" }} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: c.txt }}>
                Emergency Alert
              </h3>
              <p className="text-xs" style={{ color: c.txt2 }}>
                Contacts will be notified immediately
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <X size={18} style={{ color: c.txt3 }} />
          </button>
        </div>
        <div
          className="rounded-xl p-4 mb-5"
          style={{
            background: "rgba(224,85,85,0.08)",
            border: "1px solid rgba(224,85,85,0.2)",
          }}
        >
          <p className="text-sm" style={{ color: c.txt2 }}>
            This will alert{" "}
            <strong style={{ color: c.txt }}>your emergency contacts</strong>{" "}
            and share your GPS location with nearby medical services.
          </p>
        </div>
        <div className="space-y-3 mb-4">
          <button
            className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{
              background: "#E05555",
              boxShadow: "0 4px 20px rgba(224,85,85,0.4)",
            }}
          >
            <Phone size={16} /> Call 15 (SAMU) Now
          </button>
          <button
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            style={{
              background: "rgba(224,85,85,0.1)",
              color: "#E05555",
              border: "1px solid rgba(224,85,85,0.2)",
            }}
          >
            <MapPin size={15} /> Share My Location
          </button>
          <button
            className="w-full py-3 rounded-xl font-semibold transition-colors"
            style={{
              background: "rgba(224,85,85,0.06)",
              color: "#E05555",
              border: "1px solid rgba(224,85,85,0.15)",
            }}
          >
            Notify Emergency Contact
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 text-sm font-medium rounded-xl transition-colors"
          style={{
            color: c.txt3,
            background: "transparent",
            border: `1px solid ${c.border}`,
          }}
        >
          Cancel — I'm fine
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({
  onNav,
  dk,
  userData,
  appointments,
  notifications,
  setNotifications,
}) {
  const [meds, setMeds] = useState(MEDICATIONS);
  const [symptom, setSymptom] = useState("");
  const [emergency, setEmergency] = useState(false);
  const c = dk ? T.dark : T.light;

  const firstName = userData?.first_name || "Guest";
  const safeAppts = Array.isArray(appointments) ? appointments : [];
  const upcomingAppts =
    safeAppts.filter(
      (a) => a.status === "confirmed" || a.status === "pending",
    ) || [];

  return (
    <>
      {emergency && (
        <EmergencyModal onClose={() => setEmergency(false)} dk={dk} />
      )}

      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: c.txt }}>
            Bonjour, <span style={{ color: c.blue }}>{firstName}</span> 👋
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setEmergency(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #E05555, #c93535)",
              color: "#fff",
            }}
          >
            <AlertTriangle size={15} />
            URGENCE
          </button>
        </div>
      </div>

      {/* AI Checker */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden shadow-sm"
        style={{
          background: "linear-gradient(135deg, #304B71 0%, #6492C9 100%)",
        }}
      >
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full opacity-10 bg-white pointer-events-none" />
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-8 bg-white pointer-events-none" />
        <div className="flex items-center gap-2 mb-1 relative z-10">
          <Activity size={18} className="text-white" />
          <h2 className="text-white font-semibold text-base">
            Analyse de symptômes IA
          </h2>
        </div>
        <p className="text-white/75 text-sm mb-4 relative z-10 max-w-md">
          Décrivez vos symptômes pour obtenir un avis orienter par notre
          intelligence médicale.
        </p>
        <div className="flex gap-3 relative z-10 flex-wrap sm:flex-nowrap">
          <input
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="Ex: Maux de tête légers et fatigue..."
            className="flex-1 px-4 py-3 rounded-xl outline-none text-sm min-w-[200px]"
            style={{ background: "rgba(255,255,255,0.92)", color: "#0D1B2E" }}
          />
          <button
            onClick={() => onNav("ai-diagnosis")}
            className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg whitespace-nowrap"
            style={{ background: "#ffffff", color: "#304B71" }}
          >
            Analyser
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Prochains RDV */}
            <Card dk={dk}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base" style={{ color: c.txt }}>
                    Prochains RDV
                  </h3>
                  {upcomingAppts.length > 0 && (
                    <Badge color={c.blue} bg={`${c.blue}11`}>
                      {upcomingAppts.length} actifs
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => onNav("appointments")}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: c.blue }}
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {upcomingAppts.length === 0 ? (
                  <EmptyState
                    dk={dk}
                    icon={Calendar}
                    title="Aucun rendez-vous"
                    message="Vous n'avez pas de consultations prévues pour le moment."
                  />
                ) : (
                  upcomingAppts.slice(0, 2).map((a) => (
                    <div
                      key={a.id}
                      onClick={() => onNav("appointments")}
                      className="group flex items-center gap-4 p-3 rounded-2xl border transition-all hover:shadow-md cursor-pointer"
                      style={{
                        borderColor: c.border,
                        background: dk ? `${c.blue}05` : "#fff",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm"
                        style={{ background: c.blueLight }}
                      >
                        <Calendar size={20} style={{ color: c.blue }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-bold truncate"
                          style={{ color: c.txt }}
                        >
                          {a.doctor_name || "Médecin Inconnu"}
                        </p>
                        <p
                          className="text-xs font-medium opacity-70"
                          style={{ color: c.txt2 }}
                        >
                          {a.doctor_specialty || "Généraliste"}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div
                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-dashed"
                            style={{
                              borderColor: c.blue + "33",
                              background: c.blue + "08",
                            }}
                          >
                            <Clock size={10} style={{ color: c.blue }} />
                            <span
                              className="text-[10px] font-bold"
                              style={{ color: c.blue }}
                            >
                              {a.slot_date} ·{" "}
                              {a.slot_start_time?.substring(0, 5)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} style={{ color: c.txt3 }} />
                    </div>
                  ))
                )}
              </div>
            </Card>
            {/* Medications */}
            <Card dk={dk}>
              <h3 className="font-semibold mb-4" style={{ color: c.txt }}>
                Medication Reminders
              </h3>
              <div className="space-y-4">
                {meds.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setMeds((ms) =>
                          ms.map((x) =>
                            x.id === m.id ? { ...x, taken: !x.taken } : x,
                          ),
                        )
                      }
                      className="shrink-0"
                    >
                      {m.taken ? (
                        <CheckCircle size={22} style={{ color: c.green }} />
                      ) : (
                        <Circle size={22} style={{ color: c.txt3 }} />
                      )}
                    </button>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: m.taken ? c.txt3 : c.txt,
                          textDecoration: m.taken ? "line-through" : "none",
                        }}
                      >
                        {m.name}
                      </p>
                      <p className="text-xs" style={{ color: c.txt3 }}>
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Documents */}
            <Card dk={dk}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: c.txt }}>
                  Recent Medical Documents
                </h3>
                <button
                  onClick={() => onNav("medical-profile")}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: c.blue }}
                >
                  View All
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                    <th
                      className="text-left text-xs font-bold uppercase pb-2 tracking-wide"
                      style={{ color: c.txt3 }}
                    >
                      Document Name
                    </th>
                    <th
                      className="text-right text-xs font-bold uppercase pb-2 tracking-wide"
                      style={{ color: c.txt3 }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DOCUMENTS.map((d) => (
                    <tr
                      key={d.id}
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                      style={{ borderBottom: `1px solid ${c.border}` }}
                    >
                      <td className="py-3 text-sm" style={{ color: c.txt }}>
                        {d.name}
                      </td>
                      <td
                        className="py-3 text-sm text-right"
                        style={{ color: c.txt2 }}
                      >
                        {d.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            {/* Caregiver + AI */}
            <div className="flex flex-col gap-4">
              <div
                onClick={() => onNav("care-taker")}
                className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity flex-1"
                style={{
                  background: "linear-gradient(135deg, #2D8C6F, #3aaa88)",
                }}
              >
                <Heart size={26} className="text-white shrink-0" />
                <div>
                  <p className="text-white font-semibold">Caregiver</p>
                  <p className="text-white/80 text-sm">
                    Fatima B. is assigned to you
                  </p>
                </div>
              </div>
              <div
                onClick={() => onNav("ai-diagnosis")}
                className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity flex-1"
                style={{
                  background: "linear-gradient(135deg, #304B71, #4A6FA5)",
                }}
              >
                <Star size={26} className="text-white shrink-0" />
                <div>
                  <p className="text-white font-semibold">AI Suggestion</p>
                  <p className="text-white/80 text-sm">
                    New health tip available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-5">
          <Card dk={dk}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: c.txt }}>
                Notifications
              </h3>
              {notifications?.filter((n) => !n.is_read && n.unread !== false)
                .length > 0 && (
                <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {
                    notifications.filter(
                      (n) => !n.is_read && n.unread !== false,
                    ).length
                  }
                </span>
              )}
            </div>
            <div className="space-y-3">
              {(notifications || []).slice(0, 3).map((n) => {
                const isUnread = !n.is_read && n.unread !== false;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (isUnread) {
                        api.markNotificationRead(n.id).catch(() => null);
                        if (setNotifications) {
                          setNotifications((prev) =>
                            prev.map((x) =>
                              x.id === n.id
                                ? { ...x, is_read: true, unread: false }
                                : x,
                            ),
                          );
                        }
                      }
                    }}
                    className="flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      background: isUnread ? c.blueLight : "transparent",
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    <div
                      className="w-1 self-stretch rounded-full shrink-0"
                      style={{ background: isUnread ? c.blue : "transparent" }}
                    />
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: c.blueLight }}
                    >
                      <Bell size={14} style={{ color: c.blue }} />
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: c.txt }}
                      >
                        {n.title || n.message || "Notification"}
                      </p>
                      <p className="text-xs" style={{ color: c.txt3 }}>
                        {n.created_at || n.sub || "Récemment"}
                      </p>
                    </div>
                  </div>
                );
              })}
              {(!notifications || notifications.length === 0) && (
                <p
                  className="text-xs text-center py-4"
                  style={{ color: c.txt3 }}
                >
                  Aucune notification
                </p>
              )}
            </div>

            {notifications && notifications.length > 3 && (
              <button
                onClick={() => onNav("notifications")}
                className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold transition-colors hover:opacity-80"
                style={{
                  background: c.blueLight,
                  color: c.blue,
                }}
              >
                View All
              </button>
            )}
            {notifications &&
              notifications.length > 0 &&
              notifications.length <= 3 && (
                <button
                  onClick={() => onNav("notifications")}
                  className="w-full mt-4 py-2 text-xs font-semibold rounded-xl transition-colors hover:opacity-80 border"
                  style={{ borderColor: c.border, color: c.txt2 }}
                >
                  Gérer les notifications
                </button>
              )}
          </Card>
          <Card dk={dk}>
            <h3 className="font-semibold mb-5" style={{ color: c.txt }}>
              Prescription Status
            </h3>
            <div className="space-y-5">
              {PRESCRIPTIONS.map((p) => (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: c.txt }}
                    >
                      {p.name}
                    </p>
                    <Badge color={p.color} bg={p.color + "18"}>
                      {p.status}
                    </Badge>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: c.blueLight }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${p.pct}%`, background: p.color }}
                    />
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: c.txt3 }}>
                    {p.note}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── MEDICAL PROFILE PAGE ─────────────────────────────────────────────────────
function MedicalProfilePage({ dk, profile, userId }) {
  const c = dk ? T.dark : T.light;
  const [tab, setTab] = useState("antecedents");
  const [data, setData] = useState({
    antecedents: [],
    treatments: [],
    diagnostics: [],
    prescriptions: [],
    analyses: [],
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" }); // { type: "success"|"error", msg: "" }

  useEffect(() => {
    async function fetchTabData() {
      setLoading(true);
      try {
        if (tab === "antecedents") {
          const res = await api.getAntecedents().catch(() => []);
          setData((d) => ({
            ...d,
            antecedents: Array.isArray(res) ? res : [],
          }));
        } else if (tab === "treatments") {
          const res = await api.getTreatments().catch(() => []);
          setData((d) => ({ ...d, treatments: Array.isArray(res) ? res : [] }));
        } else if (tab === "analyses") {
          const res = await api.getLabResults().catch(() => []);
          setData((d) => ({ ...d, analyses: Array.isArray(res) ? res : [] }));
        }
      } catch (err) {}
      setLoading(false);
    }
    fetchTabData();
  }, [tab]);

  const tabs = [
    "antecedents",
    "diagnostics",
    "prescriptions",
    "analyses",
    "treatments",
  ];
  const safeProfile = profile || {};

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await api.updateMedicalProfile(editForm);
      setStatus({ type: "success", msg: "Profil mis à jour avec succès ✅" });
      setEditMode(false);
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    } catch (err) {
      setStatus({ type: "error", msg: "Erreur lors de la mise à jour ❌" });
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Status Banner */}
      {status.msg && (
        <div
          className="mb-4 p-3 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{
            background:
              status.type === "success"
                ? "rgba(45, 140, 111, 0.15)"
                : "rgba(224, 85, 85, 0.15)",
            color: status.type === "success" ? "#2D8C6F" : "#E05555",
            border: `1px solid ${status.type === "success" ? "rgba(45, 140, 111, 0.3)" : "rgba(224, 85, 85, 0.3)"}`,
          }}
        >
          {status.msg}
        </div>
      )}

      {/* Profile header */}
      <div
        className="rounded-2xl p-6 mb-6 border"
        style={{ background: c.blueLight, borderColor: c.border }}
      >
        <div className="flex items-start gap-5 flex-wrap">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ background: "linear-gradient(135deg, #4A6FA5, #304B71)" }}
          >
            {profile?.user_initials || "PJ"}
          </div>
          <div className="flex-1 min-w-[250px]">
            {editMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={editForm.name || safeProfile.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg text-sm bg-transparent w-full"
                  style={{ borderColor: c.border, color: c.txt }}
                />
                <input
                  type="date"
                  placeholder="Date de naissance (DOB)"
                  value={editForm.dob || safeProfile.dob || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dob: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg text-sm bg-transparent w-full"
                  style={{ borderColor: c.border, color: c.txt }}
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={editForm.phone || safeProfile.phone || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg text-sm bg-transparent w-full"
                  style={{ borderColor: c.border, color: c.txt }}
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ville"
                    value={editForm.city || safeProfile.city || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, city: e.target.value })
                    }
                    className="px-3 py-2 border rounded-lg text-sm bg-transparent w-full"
                    style={{ borderColor: c.border, color: c.txt }}
                  />
                  <input
                    type="text"
                    placeholder="Wilaya"
                    value={editForm.wilaya || safeProfile.wilaya || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, wilaya: e.target.value })
                    }
                    className="px-3 py-2 border rounded-lg text-sm bg-transparent w-full"
                    style={{ borderColor: c.border, color: c.txt }}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold" style={{ color: c.txt }}>
                  {safeProfile.name || "Mon Profil Médical"}
                </h2>
                <p className="text-sm mt-1 mb-3" style={{ color: c.txt2 }}>
                  ID Patient: #{userId || "---"}
                  {safeProfile.dob && ` · Né(e) le: ${safeProfile.dob}`}
                  {safeProfile.city &&
                    ` · ${safeProfile.city}, ${safeProfile.wilaya || ""}`}
                  {safeProfile.phone && ` · 📞 ${safeProfile.phone}`}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(224,85,85,0.12)",
                      color: "#E05555",
                      border: "1px solid rgba(224,85,85,0.25)",
                    }}
                  >
                    Groupe Sanguin: {safeProfile.blood_type || "Non spécifié"}
                  </span>
                  {(safeProfile.allergies
                    ? safeProfile.allergies.split(",")
                    : []
                  )
                    .filter((v) => v.trim())
                    .map((a, i) => (
                      <span
                        key={i}
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          background: "rgba(224,85,85,0.1)",
                          color: "#E05555",
                          border: "1px solid rgba(224,85,85,0.2)",
                        }}
                      >
                        ⚠ {a.trim()}
                      </span>
                    ))}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0 flex-wrap">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:opacity-80"
                  style={{
                    color: c.txt2,
                    borderColor: c.border,
                    background: "transparent",
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors hover:opacity-80 text-white"
                  style={{ background: c.blue, opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "En cours..." : "Sauvegarder"}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setEditForm({ ...safeProfile });
                  setEditMode(true);
                }}
                className="text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:opacity-80"
                style={{
                  color: c.blue,
                  borderColor: c.blue,
                  background: c.blueLight,
                }}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div
        className="flex gap-1 border-b mb-6"
        style={{ borderColor: c.border }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2.5 text-sm font-semibold capitalize transition-all"
            style={{
              color: tab === t ? c.blue : c.txt2,
              borderBottom:
                tab === t ? `2px solid ${c.blue}` : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {t}
          </button>
        ))}
      </div>
      {/* Tab content */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div
            className="w-8 h-8 rounded-full border-4 animate-spin"
            style={{ borderColor: `${c.blue}40`, borderTopColor: c.blue }}
          />
        </div>
      ) : (
        <>
          {tab === "antecedents" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.antecedents.length === 0 ? (
                <div className="col-span-full">
                  <EmptyState
                    dk={dk}
                    icon={Activity}
                    title="Aucun antécédent enregistré"
                    message="Votre historique médical apparaîtra ici une fois complété par votre médecin."
                  />
                </div>
              ) : (
                data.antecedents.map((item, i) => (
                  <Card key={item.id || i} dk={dk}>
                    <div className="text-3xl mb-3">🩺</div>
                    <p
                      className="font-bold text-sm mb-1"
                      style={{ color: c.txt }}
                    >
                      {item.name || item.description}
                    </p>
                    <p className="text-xs mb-3" style={{ color: c.txt2 }}>
                      Diagnostiqué: {item.diagnosis_date || "Inconnu"}
                    </p>
                    <Badge color="#4A6FA5" bg="#4A6FA518">
                      {item.type || "Général"}
                    </Badge>
                  </Card>
                ))
              )}
            </div>
          )}
          {tab === "analyses" && (
            <div className="space-y-4">
              {data.analyses.length === 0 ? (
                <EmptyState
                  dk={dk}
                  icon={FileSearch}
                  title="Aucune analyse trouvée"
                  message="Vos rapports de laboratoire et résultats d'examens seront listés ici."
                />
              ) : (
                data.analyses.map((item, i) => (
                  <Card key={item.id || i} dk={dk}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold" style={{ color: c.txt }}>
                          {item.test_name || "Analyse médicale"}
                        </p>
                        <p className="text-xs mt-1" style={{ color: c.txt2 }}>
                          Labo: {item.lab_name || "Non spécifié"} · Date:{" "}
                          {item.test_date}
                        </p>
                      </div>
                      {item.document_url && (
                        <button
                          onClick={() =>
                            window.open(item.document_url, "_blank")
                          }
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
                          style={{ color: c.blue, borderColor: c.border }}
                        >
                          Voir le document
                        </button>
                      )}
                    </div>
                    {item.notes && (
                      <div
                        className="flex items-start gap-2 p-3 rounded-xl"
                        style={{
                          background: c.blueLight,
                          borderLeft: `3px solid ${c.blue}`,
                        }}
                      >
                        <Activity
                          size={14}
                          style={{ color: c.blue, marginTop: 2, flexShrink: 0 }}
                        />
                        <p className="text-xs" style={{ color: c.txt2 }}>
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}

          {tab === "treatments" && (
            <div className="space-y-4">
              {data.treatments.length === 0 ? (
                <EmptyState
                  dk={dk}
                  icon={Pill}
                  title="Aucun traitement actif"
                  message="Vous n'avez pas de prescriptions ou de traitements en cours enregistrés."
                />
              ) : (
                data.treatments.map((item, i) => (
                  <Card key={item.id || i} dk={dk}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold" style={{ color: c.txt }}>
                          {item.medication_name || "Médicament"}
                        </p>
                        <p className="text-xs mt-1" style={{ color: c.txt2 }}>
                          {item.dosage} · {item.frequency}
                        </p>
                      </div>
                      <Badge color="#2D8C6F" bg="#2D8C6F18">
                        Actif
                      </Badge>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
          {["diagnostics", "prescriptions"].includes(tab) && (
            <EmptyState
              dk={dk}
              icon={FileText}
              title={`Aucun ${tab === "diagnostics" ? "diagnostic" : "prescription"} enregistré`}
              message="Les dossiers apparaîtront ici suite à vos consultations avec un spécialiste."
            />
          )}
        </>
      )}
    </>
  );
}

// ─── AI DIAGNOSIS PAGE ────────────────────────────────────────────────────────
const HISTORY_SESSIONS = [
  {
    id: 1,
    title: "Douleurs thoraciques",
    date: "Aujourd'hui · 2h",
    badge: "med",
    badgeLabel: "Modérée",
  },
  {
    id: 2,
    title: "Maux de tête persistants",
    date: "Hier · 5 échanges",
    badge: "low",
    badgeLabel: "Faible",
  },
  {
    id: 3,
    title: "Fatigue intense & vertiges",
    date: "Hier · 4 échanges",
    badge: "low",
    badgeLabel: "Faible",
  },
  {
    id: 4,
    title: "Douleur poitrine + bras",
    date: "18 Mar · 2 échanges",
    badge: "high",
    badgeLabel: "Élevée",
  },
  {
    id: 5,
    title: "Toux sèche + fièvre 38.2°",
    date: "16 Mar · 6 échanges",
    badge: "low",
    badgeLabel: "Faible",
  },
  {
    id: 6,
    title: "Douleur lombaire chronique",
    date: "14 Mar · 4 échanges",
    badge: "med",
    badgeLabel: "Modérée",
  },
];
const BADGE_COLORS = { low: "#2D8C6F", med: "#E8A838", high: "#E05555" };

function AIDiagnosisPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Bonjour Alex 👋 Décrivez vos symptômes en détail — localisation, intensité, durée — et je vous fournirai une analyse immédiate avec des recommandations adaptées.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const quickSymptoms = [
    "Maux de tête",
    "Fièvre",
    "Fatigue",
    "Douleur thoracique",
    "Nausées",
    "Toux",
  ];

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg && attachedFiles.length === 0) return;
    const displayText = msg || `📎 ${attachedFiles.length} fichier(s) joint(s)`;
    setMessages((m) => [
      ...m,
      { role: "user", text: displayText, files: attachedFiles },
    ]);
    setInput("");
    setAttachedFiles([]);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "J'analyse vos symptômes…",
          result: {
            urgency: "Urgence modérée",
            color: "#E8A838",
            diagnosis: "Possible Angine de Poitrine",
            confidence: 87,
            body: "La combinaison douleurs thoraciques + fatigue à l'effort peut indiquer une réduction du flux sanguin cardiaque. Une consultation médicale dans les 24–48h est fortement recommandée.",
            tags: [
              "Consultation sous 24h",
              "Éviter les efforts",
              "ECG recommandé",
            ],
          },
        },
      ]);
    }, 1500);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
    e.target.value = "";
  };

  const toggleRecording = () => {
    setIsRecording((r) => !r);
    if (!isRecording) {
      // Simulate voice input after 2s
      setTimeout(() => {
        setIsRecording(false);
        setInput(
          "J'ai des douleurs thoraciques et de la fatigue depuis 2 jours",
        );
      }, 2000);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-end justify-end w-full gap-2">
          {/* History button */}
          <div className="relative">
            <button
              onClick={() => setShowFullHistory(true)}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all hover:opacity-80"
              style={{
                color: showFullHistory ? "#fff" : c.blue,
                borderColor: c.blue,
                background: showFullHistory ? c.blue : c.card,
                cursor: "pointer",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Voir tout l'historique
            </button>
          </div>
          {/* New chat button */}
          <button
            onClick={() => {
              setMessages([
                {
                  role: "ai",
                  text: "Nouvelle session. Décrivez vos symptômes.",
                },
              ]);
            }}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all hover:opacity-80"
            style={{
              color: c.blue,
              borderColor: c.border,
              background: c.card,
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> New Chat
          </button>
        </div>
      </div>

      {/* Full History Sidebar (Slide-in from left) */}
      {showFullHistory && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 transition-opacity"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowFullHistory(false)}
            aria-hidden="true"
          />
          {/* Sidebar Panel */}
          <div
            className="fixed top-0 left-0 w-[280px] h-full z-50 flex flex-col shadow-2xl"
            style={{
              background: c.card,
              borderRight: `1px solid ${c.border}`,
              animation: "slideInLeft 0.3s ease forwards",
            }}
          >
            <style>{`
              @keyframes slideInLeft {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
              }
            `}</style>

            <div
              className="px-4 py-4 flex items-center justify-between border-b"
              style={{ borderColor: c.border }}
            >
              <p
                className="font-bold whitespace-nowrap"
                style={{ color: c.txt }}
              >
                Historique COMPLET
              </p>
              <button
                onClick={() => setShowFullHistory(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:opacity-70 transition-all font-bold"
                style={{ color: c.txt3, background: c.bg }}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full">
              {HISTORY_SESSIONS.length === 0 ? (
                <div className="p-8 text-center" style={{ color: c.txt3 }}>
                  <Brain size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Aucun historique disponible.</p>
                </div>
              ) : (
                HISTORY_SESSIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setShowFullHistory(false);
                      setMessages([
                        {
                          role: "ai",
                          text: `Session chargée : "${s.title}"`,
                        },
                      ]);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 border-b text-left transition-colors hover:opacity-80"
                    style={{
                      borderColor: c.border,
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: BADGE_COLORS[s.badge] + "18" }}
                    >
                      <Brain
                        size={16}
                        style={{ color: BADGE_COLORS[s.badge] }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <p
                        className="text-sm font-semibold truncate leading-tight mb-1"
                        style={{ color: c.txt }}
                      >
                        {s.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs" style={{ color: c.txt3 }}>
                          {s.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        color: BADGE_COLORS[s.badge],
                        background: BADGE_COLORS[s.badge] + "18",
                      }}
                    >
                      {s.badgeLabel}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chat */}
        <div
          className="lg:col-span-2 flex flex-col gap-4"
          style={{ marginTop: "-60px" }}
        >
          <Card dk={dk} style={{ padding: 0, overflow: "hidden" }}>
            {/* Messages */}
            <div
              className="p-4 space-y-4 overflow-y-auto"
              style={{ minHeight: 450, maxHeight: 600 }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{
                      background:
                        m.role === "ai"
                          ? "linear-gradient(135deg, #4A6FA5, #304B71)"
                          : "linear-gradient(135deg, #2D8C6F, #3aaa88)",
                    }}
                  >
                    {m.role === "ai" ? "AI" : "AJ"}
                  </div>
                  <div className="max-w-[80%]">
                    <div
                      className="rounded-2xl p-3.5 text-sm"
                      style={{
                        background: m.role === "ai" ? c.card : c.blue,
                        color: m.role === "ai" ? c.txt : "#fff",
                        border:
                          m.role === "ai" ? `1px solid ${c.border}` : "none",
                        borderRadius:
                          m.role === "ai"
                            ? "4px 16px 16px 16px"
                            : "16px 4px 16px 16px",
                      }}
                    >
                      {m.text}
                      {m.result && (
                        <div
                          className="mt-3 rounded-xl p-3 border"
                          style={{
                            background: dk
                              ? "rgba(255,255,255,0.05)"
                              : "#F8FAFC",
                            borderColor: c.border,
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className="text-xs font-bold uppercase tracking-wide"
                              style={{ color: c.txt3 }}
                            >
                              Analyse IA
                            </span>
                            <Badge
                              color={m.result.color}
                              bg={m.result.color + "18"}
                            >
                              {m.result.urgency}
                            </Badge>
                          </div>
                          <p
                            className="font-bold text-sm mb-1"
                            style={{ color: c.txt }}
                          >
                            {m.result.diagnosis}
                          </p>
                          <p className="text-xs mb-2" style={{ color: c.txt2 }}>
                            {m.result.body}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {m.result.tags.map((t) => (
                              <span
                                key={t}
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  background: c.blueLight,
                                  color: c.blue,
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #4A6FA5, #304B71)",
                    }}
                  >
                    AI
                  </div>
                  <div
                    className="rounded-2xl p-3.5 flex items-center gap-1.5"
                    style={{
                      background: c.card,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{
                          background: c.txt3,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t" style={{ borderColor: c.border }}>
              {/* Quick symptoms */}
              <div className="flex gap-2 flex-wrap mb-3">
                {quickSymptoms.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:opacity-80"
                    style={{
                      background: c.blueLight,
                      color: c.blue,
                      borderColor: c.blue + "40",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Attached files preview */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {attachedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border"
                      style={{
                        background: c.blueLight,
                        borderColor: c.border,
                        color: c.txt,
                      }}
                    >
                      <FileText size={11} style={{ color: c.blue }} />
                      {f.length > 20 ? f.slice(0, 18) + "…" : f}
                      <button
                        onClick={() =>
                          setAttachedFiles((fs) => fs.filter((_, j) => j !== i))
                        }
                        className="ml-1 hover:opacity-70"
                        style={{ color: c.txt3, cursor: "pointer" }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Recording indicator */}
              {isRecording && (
                <div
                  className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl border"
                  style={{
                    background: "rgba(224,85,85,0.08)",
                    borderColor: "rgba(224,85,85,0.3)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#E05555" }}
                  >
                    Enregistrement en cours… parlez maintenant
                  </span>
                </div>
              )}

              {/* Input row */}
              <div
                className="flex items-center gap-2 rounded-xl border px-3 py-2"
                style={{ background: c.blueLight, borderColor: c.border }}
              >
                {/* Add files button */}
                <label
                  title="Ajouter fichiers ou photos"
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors hover:opacity-70 shrink-0"
                  style={{
                    borderColor: c.border,
                    background: c.card,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ color: c.txt2 }}
                  >
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </label>

                {/* Text input */}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={
                    isRecording
                      ? "Enregistrement…"
                      : "Décrivez vos symptômes en détail…"
                  }
                  disabled={isRecording}
                  className="flex-1 text-sm outline-none bg-transparent"
                  style={{ color: c.txt }}
                />

                {/* Voice button */}
                <button
                  onClick={toggleRecording}
                  title={
                    isRecording ? "Arrêter l'enregistrement" : "Message vocal"
                  }
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:opacity-80 shrink-0"
                  style={{
                    borderColor: isRecording ? "rgba(224,85,85,0.5)" : c.border,
                    background: isRecording ? "rgba(224,85,85,0.12)" : c.card,
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ color: isRecording ? "#E05555" : c.txt2 }}
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>

                {/* Send button */}
                <button
                  onClick={() => send()}
                  title="Envoyer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:opacity-80 shrink-0"
                  style={{ background: c.blue, cursor: "pointer" }}
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>

              <p className="text-xs mt-2 text-center" style={{ color: c.txt3 }}>
                ⏎ Entrée pour envoyer · 🎤 Vocal disponible · 📎 Fichiers
                acceptés
              </p>
            </div>
          </Card>
        </div>
        {/* Panel */}
        <div className="space-y-4">
          <Card dk={dk}>
            <p
              className="text-xs font-bold uppercase tracking-wide mb-3"
              style={{ color: c.txt3 }}
            >
              Niveau d'urgence
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold" style={{ color: "#E8A838" }}>
                Modérée
              </span>
              <Badge color="#E8A838" bg="#E8A83818">
                65 / 100
              </Badge>
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: c.blueLight }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: "65%", background: "#E8A838" }}
              />
            </div>
          </Card>
          <Card dk={dk}>
            <p
              className="text-xs font-bold uppercase tracking-wide mb-3"
              style={{ color: c.txt3 }}
            >
              Spécialiste recommandé
            </p>
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-3"
              style={{ background: c.blueLight }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: c.blueLight,
                  border: `1px solid ${c.border}`,
                }}
              >
                <User size={16} style={{ color: c.blue }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: c.txt }}>
                  Cardiologue
                </p>
                <p className="text-xs" style={{ color: c.txt2 }}>
                  Sous 24–48 heures
                </p>
              </div>
            </div>
            <button
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ background: c.blue }}
            >
              Prendre rendez-vous
            </button>
          </Card>
          <Card dk={dk}>
            <p
              className="text-xs font-bold uppercase tracking-wide mb-3"
              style={{ color: c.txt3 }}
            >
              Conseils immédiats
            </p>
            <div className="space-y-2.5">
              {[
                ["💊", "Paracétamol 1g max toutes 6h"],
                ["🛌", "Repos strict"],
                ["💧", "Hydratation 1.5L/jour"],
                ["🧂", "Réduire sel et caféine"],
              ].map(([e, t]) => (
                <div
                  key={t}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: c.txt2 }}
                >
                  <span>{e}</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── APPOINTMENTS PAGE ────────────────────────────────────────────────────────
function AppointmentsPage({
  dk,
  appointments: rawAppointments,
  loading: shellLoading,
  refreshAppointments,
}) {
  const c = dk ? T.dark : T.light;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("book"); // "book" | "history"
  const [selectedDoctor, setSelectedDoctor] = useState(null); // for calendar panel
  const [profileDoctor, setProfileDoctor] = useState(null); // for profile modal

  const [calMonth, setCalMonth] = useState(new Date(2026, 2, 1)); // March 2026
  const [calDay, setCalDay] = useState(null);
  const [calSlot, setCalSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [confirmed, setConfirmed] = useState(false);
  const [specFilter, setSpecFilter] = useState("All");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchAppt, setSearchAppt] = useState(""); // BUG 6
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Alger");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGender, setSelectedGender] = useState("Any Gender");
  const [starFilter, setStarFilter] = useState(1);
  const [specOpen, setSpecOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const dateInputRef = useRef(null);
  const docListRef = useRef(null);
  const isFirstRender = useRef(true);

  // Removed auto-scroll downward block as requested.

  const CITIES = [
    "Alger",
    "Oran",
    "Constantine",
    "Annaba",
    "Blida",
    "Sétif",
    "Tlemcen",
    "Batna",
  ];
  const SPECIALTIES = [
    "All",
    "Généraliste",
    "Cardiologie",
    "Gynécologie",
    "Neurologie",
    "Dermatologie",
    "Pédiatrie",
    "Dentiste",
    "Ophtalmologie",
    "Orthopédie",
    "Psychiatrie",
    "Urologie",
    "Gastrologie",
  ];

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch doctors on mount and when filters change
  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        const filters = {};
        if (specFilter !== "All") filters.specialty = specFilter;
        if (selectedCity && selectedCity !== "Toutes")
          filters.city = selectedCity;
        if (debouncedSearch) filters.q = debouncedSearch;

        const data = await api.getDoctors(filters).catch(() => []);
        // Normalize backend Doctor data to UI expectations
        const normalized = (Array.isArray(data) ? data : []).map((d) => ({
          id: d.id,
          name: d.user
            ? `Dr. ${d.user.first_name} ${d.user.last_name}`
            : "Dr. Inconnu",
          spec: d.specialty_display || d.specialty || "Généraliste",
          loc:
            d.clinic_name || (d.user && d.user.city) || selectedCity || "Alger",
          rating: parseFloat(d.rating) || 4.5,
          exp: d.experience_years || 5,
          initials: d.user
            ? `${d.user.first_name?.[0] || ""}${d.user.last_name?.[0] || ""}`.toUpperCase()
            : "DR",
          color: (d.specialty || "").toLowerCase().includes("cardio")
            ? "#4A6FA5"
            : "#2D8C6F",
          phone: (d.user && d.user.phone) || "+213 -- -- --",
          lang: d.languages ? d.languages.split(",") : ["Français", "Arabe"],
          bio: d.bio || "Le docteur n'a pas rédigé de biographie.",
          edu: "Faculté de Médecine.",
          reviews: d.total_reviews || 0,
        }));
        setDoctors(normalized);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [specFilter, selectedCity, debouncedSearch]);

  // Fetch slots when a doctor and day are selected
  useEffect(() => {
    if (selectedDoctor && calDay) {
      async function fetchSlots() {
        try {
          setSlotsLoading(true);
          const dateStr = formatDate(
            calMonth.getFullYear(),
            calMonth.getMonth(),
            calDay,
          );
          const rawSlots = await api.getDoctorSlots(selectedDoctor.id, dateStr);
          const slots = (rawSlots || [])
            .filter((s) => !s.is_booked)
            .map((s) => ({
              id: s.id,
              time: s.start_time ? s.start_time.substring(0, 5) : s.time,
            }));
          setAvailableSlots(slots);
        } catch (err) {
          console.error("Error fetching slots:", err);
        } finally {
          setSlotsLoading(false);
        }
      }
      fetchSlots();
    }
  }, [selectedDoctor, calDay, calMonth]);

  const upcomingAppts =
    rawAppointments?.filter((a) => a.status === "confirmed") || [];
  const historyAppts =
    rawAppointments?.filter((a) =>
      ["completed", "cancelled", "refused"].includes(a.status),
    ) || [];
  const filteredUpcoming = upcomingAppts.filter(
    (a) =>
      (a.doctor_name || "").toLowerCase().includes(searchAppt.toLowerCase()) ||
      (a.specialty || "").toLowerCase().includes(searchAppt.toLowerCase()),
  );

  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const dayNames = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];

  const formatDate = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const handleBook = async () => {
    if (!calSlot) return;

    const slotObj = availableSlots.find(
      (s) => s.time === calSlot || s.id === calSlot,
    );
    if (!slotObj) return;

    setIsSubmitting(true);
    setErr("");
    setSuccess("");
    try {
      await api.bookAppointment({
        doctor_id: selectedDoctor.id,
        slot_id: slotObj.id,
        motif: "Consultation",
      });
      setSuccess("Rendez-vous réservé avec succès !");
      setTimeout(() => setSuccess(""), 4000);
      setCalSlot(null);
      setCalDay(null);
      setSelectedDoctor(null);
      if (refreshAppointments) refreshAppointments();
    } catch (e) {
      setErr(e.message || "Erreur lors de la réservation.");
      setTimeout(() => setErr(""), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCalendar = (doc) => {
    setSelectedDoctor(doc);
    setCalDay(null);
    setCalSlot(null);
    setAvailableSlots([]);
  };

  const filteredDoctors = doctors.filter((d) => {
    const matchesSpec =
      specFilter === "All" ||
      d.spec.toLowerCase().includes(specFilter.toLowerCase());
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.loc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender =
      selectedGender === "Any Gender" ||
      (selectedGender === "Masculin" && d.gender === "M") ||
      (selectedGender === "Féminin" && d.gender === "F");
    const matchesRating = d.rating >= starFilter;

    return matchesSpec && matchesSearch && matchesGender && matchesRating;
  });

  const slotsForDay = (day) => {
    if (!day) return [];
    // Map objects to time strings for the UI grid
    return availableSlots.map((s) => s.time);
  };

  const hasSlots = (day) => {
    // This is more complex since we fetch slots ONLY for the selected day.
    // For now, we'll mark all days as potentially having slots, or we'd need a separate 'has_slots' API check.
    return true;
  };

  return (
    <>
      {/* ─ Profile Modal ─ */}
      {profileDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border"
            style={{ background: c.card, borderColor: c.border }}
          >
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: c.border }}>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ background: profileDoctor.color }}
                >
                  {profileDoctor.initials}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold" style={{ color: c.txt }}>
                    {profileDoctor.name}
                  </h2>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: c.blue }}
                  >
                    {profileDoctor.spec}
                  </p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#E8A838" }}
                    >
                      ⭐ {profileDoctor.rating}
                    </span>
                    <span className="text-xs" style={{ color: c.txt3 }}>
                      {profileDoctor.reviews} avis
                    </span>
                    <span className="text-xs" style={{ color: c.txt3 }}>
                      {profileDoctor.exp} ans exp.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setProfileDoctor(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70"
                  style={{ background: c.blueLight }}
                >
                  <X size={15} style={{ color: c.txt3 }} />
                </button>
              </div>
            </div>
            {/* Body */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wide mb-1.5"
                  style={{ color: c.txt3 }}
                >
                  À propos
                </p>
                <p className="text-sm" style={{ color: c.txt2 }}>
                  {profileDoctor.bio}
                </p>
              </div>
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wide mb-1.5"
                  style={{ color: c.txt3 }}
                >
                  Formation
                </p>
                <p className="text-sm" style={{ color: c.txt2 }}>
                  {profileDoctor.edu}
                </p>
              </div>
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wide mb-1.5"
                  style={{ color: c.txt3 }}
                >
                  Langues parlées
                </p>
                <div className="flex gap-2 flex-wrap">
                  {profileDoctor.lang.map((l) => (
                    <span
                      key={l}
                      className="text-xs px-3 py-1 rounded-full font-semibold border"
                      style={{
                        background: c.blueLight,
                        borderColor: c.blue + "33",
                        color: c.blue,
                      }}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wide mb-1.5"
                  style={{ color: c.txt3 }}
                >
                  Contact
                </p>
                <p
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: c.txt }}
                >
                  <Phone size={13} style={{ color: c.blue }} />{" "}
                  {profileDoctor.phone}
                </p>
                <p
                  className="text-xs mt-1 flex items-center gap-2"
                  style={{ color: c.txt2 }}
                >
                  <MapPin size={12} style={{ color: c.txt3 }} />{" "}
                  {profileDoctor.loc}
                </p>
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => {
                  setProfileDoctor(null);
                  openCalendar(profileDoctor);
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: c.blue }}
              >
                Voir disponibilités
              </button>
              <button
                onClick={() => setProfileDoctor(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: c.border, color: c.txt2 }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─ Tabs ─ */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold" style={{ color: c.txt }}>
          Prochains rendez-vous
        </h1>
        <div
          className="flex gap-1 p-1.5 rounded-2xl border transition-all"
          style={{
            borderColor: c.border,
            background: c.card,
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          {/* Prendre RDV Tab */}
          <button
            onClick={() => setTab("book")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all"
            style={{
              background: tab === "book" ? c.blue : "transparent",
              color: tab === "book" ? "#fff" : c.txt2,
              boxShadow: tab === "book" ? `0 8px 16px ${c.blue}33` : "none",
            }}
          >
            Prendre RDV
          </button>

          {/* Historique Tab (with AI Diagnosis style icon) */}
          <button
            onClick={() => setTab("history")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all"
            style={{
              background: tab === "history" ? c.blue : "transparent",
              color: tab === "history" ? "#fff" : c.txt2,
              boxShadow: tab === "history" ? `0 8px 16px ${c.blue}33` : "none",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Historique
          </button>
        </div>
      </div>

      {/* ──── TAB: BOOK ──── */}
      {tab === "book" && (
        <>
          {/* Success Banner */}
          {success && (
            <div
              className="mb-6 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in duration-300"
              style={{ background: "#2D8C6F12", borderColor: "#2D8C6F44" }}
            >
              <CheckCircle size={20} style={{ color: "#2D8C6F" }} />
              <p className="font-semibold text-sm" style={{ color: "#2D8C6F" }}>
                {success}
              </p>
            </div>
          )}

          {/* Error Banner */}
          {err && (
            <div
              className="mb-6 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in duration-300"
              style={{ background: "#E0555512", borderColor: "#E0555544" }}
            >
              <X size={20} style={{ color: "#E05555" }} />
              <p className="font-semibold text-sm" style={{ color: "#E05555" }}>
                {err}
              </p>
            </div>
          )}

          {/* ────── Upcoming Appointments Section ────── */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="font-bold text-lg" style={{ color: c.txt }}>
                Vos rendez-vous à venir
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: c.txt3 }}
                  />
                  <input
                    type="text"
                    placeholder="Chercher un RDV..."
                    value={searchAppt}
                    onChange={(e) => setSearchAppt(e.target.value)}
                    className="pl-9 pr-4 py-1.5 rounded-full text-xs font-medium border focus:outline-none transition-all"
                    style={{
                      background: c.card,
                      borderColor: c.border,
                      color: c.txt,
                      width: "180px",
                    }}
                  />
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: c.blue + "11", color: c.blue }}
                >
                  {upcomingAppts.length} actif
                  {upcomingAppts.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUpcoming.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState
                      dk={dk}
                      icon={Calendar}
                      compact={true}
                      title={
                        upcomingAppts.length === 0
                          ? "Aucun rendez-vous à venir"
                          : "Aucun résultat"
                      }
                      message={
                        upcomingAppts.length === 0
                          ? "Vous n'avez pas encore de réservations confirmées."
                          : "Aucun RDV ne correspond à votre recherche."
                      }
                    />
                  </div>
                ) : (
                  filteredUpcoming.map((a, i) => (
                    <Card
                      key={a.id || i}
                      dk={dk}
                      style={{
                        padding: "16px",
                        border: `1px solid ${c.border}`,
                        borderRadius: "20px",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                          style={{ background: c.blueLight }}
                        >
                          <Calendar size={20} style={{ color: c.blue }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-bold text-sm truncate"
                            style={{ color: c.txt }}
                          >
                            {a.doctor_name || "Médecin"}
                          </p>
                          <p
                            className="text-xs font-medium opacity-70"
                            style={{ color: c.txt2 }}
                          >
                            {a.specialty || "Spécialité"}
                          </p>
                          <div
                            className="mt-3 flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-dashed"
                            style={{
                              borderColor: c.blue + "33",
                              background: c.blue + "08",
                            }}
                          >
                            <Clock size={12} style={{ color: c.blue }} />
                            <p
                              className="text-[11px] font-bold"
                              style={{ color: c.blue }}
                            >
                              {a.date_display || a.date} ·{" "}
                              {a.time_display ||
                                (a.time ? a.time.substring(0, 5) : "")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="flex gap-2 mt-4 pt-4 border-t"
                        style={{ borderColor: c.border }}
                      >
                        <button
                          className="flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:bg-opacity-80"
                          style={{ background: c.blueLight, color: c.blue }}
                        >
                          Modifier
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:bg-red-50"
                          style={{ color: "#E05555" }}
                        >
                          Annuler
                        </button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          <div
            className="h-px w-full mb-8"
            style={{ background: c.border, opacity: 0.6 }}
          />
          <h2 className="font-bold text-lg mb-4" style={{ color: c.txt }}>
            Trouver un nouveau médecin
          </h2>

          {/* ── Search bar (Restored) ── */}
          <div
            className="relative z-20 flex items-center px-4 py-2 rounded-2xl border transition-all mb-4"
            style={{
              borderColor: searchFocused ? "#4A6FA5" : c.border,
              background: c.card,
              boxShadow: searchFocused
                ? "0 0 0 4px rgba(74,111,165,0.1)"
                : "none",
              minHeight: 52,
            }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0 pr-10 md:pr-40">
              <Search
                size={18}
                style={{ color: searchFocused ? "#4A6FA5" : c.txt3 }}
              />
              <input
                type="text"
                placeholder="Rechercher un médecin, une spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full bg-transparent border-none outline-none text-[.87rem] font-medium placeholder:text-[#9AACBE]"
                style={{ color: c.txt }}
              />
            </div>

            {/* Center: location dropdown */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
              <div className="w-px h-5 mr-3" style={{ background: c.border }} />
              <div className="relative">
                <button
                  onClick={() => setLocationOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all hover:bg-opacity-80"
                  style={{ background: "transparent" }}
                >
                  <MapPin
                    size={16}
                    style={{ color: locationOpen ? "#4A6FA5" : c.txt3 }}
                  />
                  <span
                    className="text-[.87rem] whitespace-nowrap font-medium"
                    style={{ color: c.txt2 }}
                  >
                    {selectedCity}, Algérie
                  </span>
                  <ChevronDown
                    size={13}
                    className="transition-transform duration-200"
                    style={{
                      color: c.txt3,
                      transform: locationOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>
                {locationOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setLocationOpen(false)}
                    />
                    <div
                      className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 rounded-2xl shadow-xl border overflow-x-hidden min-w-[160px]"
                      style={{
                        background: c.card,
                        borderColor: c.border,
                        maxHeight: "260px",
                        overflowY: "auto",
                        scrollbarWidth: "none",
                      }}
                    >
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider px-4 pt-3 pb-1"
                        style={{ color: c.txt3 }}
                      >
                        Wilaya
                      </p>
                      {CITIES.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setLocationOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-left transition-all hover:opacity-80"
                          style={{
                            background:
                              selectedCity === city
                                ? "#4A6FA518"
                                : "transparent",
                            color: selectedCity === city ? "#4A6FA5" : c.txt,
                            fontWeight: selectedCity === city ? 700 : 400,
                          }}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              className="hidden md:block shrink-0 px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 z-10"
              style={{ background: "#4A6FA5" }}
            >
              Rechercher
            </button>
          </div>

          {/* ── Secondary filters row (Restored) ── */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {/* Date Filter */}
            <div
              onClick={() => dateInputRef.current?.showPicker?.()}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all hover:border-[#4A6FA5]"
              style={{ borderColor: c.border, background: c.card }}
            >
              <Calendar size={14} style={{ color: "#4A6FA5" }} />
              <span
                className="text-xs font-medium select-none"
                style={{
                  color: selectedDate ? c.txt : c.txt3,
                  letterSpacing: selectedDate ? 0 : "0.5px",
                }}
              >
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString("fr-FR")
                  : "JJ / MM / AAAA"}
              </span>
              {selectedDate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate("");
                  }}
                  className="text-[10px] ml-1 leading-none hover:opacity-70"
                  style={{ color: c.txt3, position: "relative", zIndex: 2 }}
                >
                  ✕
                </button>
              )}
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute inset-0 opacity-0 w-full cursor-pointer"
                style={{ zIndex: 1 }}
              />
            </div>

            {/* Specialty Dropdown (Syncs with the buttons below) */}
            <div className="relative">
              <button
                onClick={() => setSpecOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium transition-all hover:border-[#4A6FA5]"
                style={{
                  borderColor: specOpen ? "#4A6FA5" : c.border,
                  background: c.card,
                  color: specFilter === "All" ? c.txt3 : c.txt,
                }}
              >
                <Zap size={14} style={{ color: "#4A6FA5" }} />
                <span>{specFilter !== "All" ? specFilter : "Spécialité"}</span>
                <ChevronDown
                  size={13}
                  className="transition-transform duration-200"
                  style={{
                    transform: specOpen ? "rotate(180deg)" : "rotate(0deg)",
                    color: c.txt3,
                  }}
                />
              </button>
              {specOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSpecOpen(false)}
                  />
                  <div
                    className="absolute top-[calc(100%+6px)] left-0 z-50 rounded-2xl shadow-xl border overflow-x-hidden min-w-[160px]"
                    style={{
                      background: c.card,
                      borderColor: c.border,
                      maxHeight: "260px",
                      overflowY: "auto",
                      scrollbarWidth: "thin",
                    }}
                  >
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider px-4 pt-3 pb-1"
                      style={{ color: c.txt3 }}
                    >
                      Spécialité
                    </p>
                    {SPECIALTIES.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSpecFilter(s);
                          setSpecOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-left transition-all hover:opacity-80"
                        style={{
                          background:
                            specFilter === s ? "#4A6FA518" : "transparent",
                          color: specFilter === s ? "#4A6FA5" : c.txt,
                          fontWeight: specFilter === s ? 700 : 400,
                        }}
                      >
                        <span className="flex-1">{s}</span>
                        {specFilter === s && (
                          <span className="text-[#4A6FA5]">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Gender Dropdown */}
            <div className="relative">
              <button
                onClick={() => setGenderOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium transition-all hover:border-[#4A6FA5]"
                style={{
                  borderColor: genderOpen ? "#4A6FA5" : c.border,
                  background: c.card,
                  color: selectedGender === "Any Gender" ? c.txt3 : c.txt,
                }}
              >
                <User size={14} style={{ color: "#4A6FA5" }} />
                <span>{selectedGender}</span>
                <ChevronDown
                  size={13}
                  className="transition-transform duration-200"
                  style={{
                    transform: genderOpen ? "rotate(180deg)" : "rotate(0deg)",
                    color: c.txt3,
                  }}
                />
              </button>
              {genderOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setGenderOpen(false)}
                  />
                  <div
                    className="absolute top-[calc(100%+6px)] left-0 z-50 rounded-2xl shadow-xl border overflow-x-hidden min-w-[140px]"
                    style={{
                      background: c.card,
                      borderColor: c.border,
                      maxHeight: "260px",
                      overflowY: "auto",
                      scrollbarWidth: "thin",
                    }}
                  >
                    {["Any Gender", "Masculin", "Féminin"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedGender(opt);
                          setGenderOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-left transition-all hover:opacity-80"
                        style={{
                          background:
                            selectedGender === opt
                              ? "#4A6FA518"
                              : "transparent",
                          color: selectedGender === opt ? "#4A6FA5" : c.txt,
                          fontWeight: selectedGender === opt ? 700 : 400,
                        }}
                      >
                        {selectedGender === opt && (
                          <span className="text-[#4A6FA5]">✓</span>
                        )}
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Rating Filter */}
            <div
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border"
              style={{ borderColor: c.border, background: c.card }}
            >
              <span
                className="text-xs font-medium mr-1"
                style={{ color: c.txt3 }}
              >
                Note min:
              </span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setStarFilter(star)}
                  className="text-base leading-none transition-colors"
                  style={{ color: star <= starFilter ? "#E8A838" : c.border }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Subtle separator instead of specialty buttons */}
          <div
            className="h-px w-full mb-8"
            style={{ background: c.border, opacity: 0.6 }}
          />

          {/* Calendar panel — Enhanced two-column layout */}
          {selectedDoctor && (
            <div
              className="mb-6 rounded-3xl border overflow-hidden shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-top-4"
              style={{ background: c.card, borderColor: c.border }}
            >
              {/* Doctor header (Premium) */}
              <div
                className="p-6 border-b flex items-center justify-between gap-4 bg-opacity-50 backdrop-blur-md"
                style={{
                  borderColor: c.border,
                  background: `linear-gradient(to right, ${c.card}, ${c.blue}08)`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${selectedDoctor.color}, ${selectedDoctor.color}dd)`,
                    }}
                  >
                    {selectedDoctor.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: c.txt }}>
                      {selectedDoctor.name}
                    </h3>
                    <p
                      className="text-sm font-medium flex items-center gap-1.5"
                      style={{ color: c.blue }}
                    >
                      <Zap size={13} /> {selectedDoctor.spec} •{" "}
                      <MapPin size={13} className="opacity-70" />{" "}
                      {selectedDoctor.loc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProfileDoctor(selectedDoctor)}
                    className="text-xs font-bold px-4 py-2 rounded-xl border transition-all hover:bg-opacity-80 hidden sm:block shadow-sm"
                    style={{
                      borderColor: c.border,
                      color: c.txt2,
                      background: c.card,
                    }}
                  >
                    Voir profil
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDoctor(null);
                      setCalDay(null);
                      setCalSlot(null);
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:rotate-90 hover:bg-opacity-80 shadow-sm"
                    style={{ background: c.blueLight }}
                  >
                    <X size={18} style={{ color: c.txt3 }} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Column: Calendar (7 cols) */}
                <div
                  className="lg:col-span-7 p-6 border-r"
                  style={{ borderColor: c.border }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h4
                      className="font-bold text-base"
                      style={{ color: c.txt }}
                    >
                      Sélectionnez une date
                    </h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setCalMonth(new Date(year, month - 1, 1))
                        }
                        className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:bg-opacity-80"
                        style={{ borderColor: c.border, background: c.card }}
                      >
                        <ChevronRight
                          size={16}
                          style={{ color: c.txt2, transform: "rotate(180deg)" }}
                        />
                      </button>
                      <div
                        className="px-4 py-1.5 rounded-xl border font-bold text-sm min-w-[140px] text-center"
                        style={{
                          borderColor: c.border,
                          background: c.card,
                          color: c.txt,
                        }}
                      >
                        {monthNames[month]} {year}
                      </div>
                      <button
                        onClick={() =>
                          setCalMonth(new Date(year, month + 1, 1))
                        }
                        className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:bg-opacity-80"
                        style={{ borderColor: c.border, background: c.card }}
                      >
                        <ChevronRight size={16} style={{ color: c.txt2 }} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 mb-3">
                    {dayNames.map((d) => (
                      <div
                        key={d}
                        className="text-center text-xs font-black py-1 uppercase tracking-widest"
                        style={{ color: c.txt3 }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({
                      length: firstDay === 0 ? 6 : firstDay - 1,
                    }).map((_, i) => (
                      <div key={`e${i}`} className="h-11" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const avail = hasSlots(selectedDoctor, day);
                      const isToday =
                        day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();
                      const isSelected = calDay === day;
                      const isPast = new Date(year, month, day) < today;

                      return (
                        <button
                          key={day}
                          disabled={!avail || isPast}
                          onClick={() => {
                            setCalDay(day);
                            setCalSlot(null);
                          }}
                          className="relative h-11 rounded-2xl flex items-center justify-center text-sm font-bold transition-all group"
                          style={{
                            background: isSelected
                              ? c.blue
                              : isToday
                                ? `${c.blue}11`
                                : "transparent",
                            color: isSelected
                              ? "#fff"
                              : isPast
                                ? c.txt3
                                : avail
                                  ? c.txt
                                  : c.txt3,
                            border:
                              isToday && !isSelected
                                ? `2px solid ${c.blue}44`
                                : "2px solid transparent",
                            opacity: !avail && !isPast ? 0.3 : 1,
                            cursor: avail && !isPast ? "pointer" : "default",
                            boxShadow: isSelected
                              ? `0 8px 15px ${c.blue}44`
                              : "none",
                          }}
                        >
                          {day}
                          {avail && !isPast && !isSelected && (
                            <span
                              className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all group-hover:scale-150"
                              style={{ background: c.blue }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className="mt-8 flex items-center gap-6 p-4 rounded-2xl bg-opacity-30"
                    style={{ background: c.blueLight }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: c.blue }}
                      />
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: c.txt3 }}
                      >
                        Disponible
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border-2"
                        style={{ borderColor: c.blue + "44" }}
                      />
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: c.txt3 }}
                      >
                        Aujourd'hui
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Slots & Summary (5 cols) */}
                <div
                  className="lg:col-span-5 p-6 bg-opacity-10"
                  style={{ background: `${c.blue}05` }}
                >
                  {!calDay ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: c.blueLight }}
                      >
                        <Calendar
                          size={28}
                          className="animate-bounce"
                          style={{ color: c.blue }}
                        />
                      </div>
                      <p
                        className="font-bold text-sm"
                        style={{ color: c.txt2 }}
                      >
                        Veuillez choisir une date dans le calendrier pour voir
                        les créneaux.
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <h4
                          className="font-bold text-base"
                          style={{ color: c.txt }}
                        >
                          Créneaux disponibles
                        </h4>
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ background: c.blue + "11", color: c.blue }}
                        >
                          {calDay} {monthNames[month]}
                        </span>
                      </div>

                      <div className="flex-1 space-y-6 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                        {/* Morning Slots */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Sun size={14} style={{ color: "#E8A838" }} />
                            <span
                              className="text-[10px] font-black uppercase tracking-widest"
                              style={{ color: c.txt3 }}
                            >
                              Matin
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {(() => {
                              const morningHours = [
                                "08:00",
                                "08:30",
                                "09:00",
                                "09:30",
                                "10:00",
                                "10:30",
                                "11:00",
                                "11:30",
                              ];
                              const available = slotsForDay(
                                selectedDoctor,
                                calDay,
                              );
                              return morningHours.map((slot) => {
                                const isAvail = available.includes(slot);
                                const isSel = calSlot === slot;
                                return (
                                  <button
                                    key={slot}
                                    disabled={!isAvail}
                                    onClick={() => setCalSlot(slot)}
                                    className="py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95"
                                    style={{
                                      background: isSel
                                        ? c.blue
                                        : isAvail
                                          ? c.card
                                          : "transparent",
                                      color: isSel
                                        ? "#fff"
                                        : isAvail
                                          ? c.txt
                                          : c.txt3,
                                      borderColor: isSel
                                        ? c.blue
                                        : isAvail
                                          ? c.border
                                          : c.border + "33",
                                      opacity: isAvail ? 1 : 0.4,
                                    }}
                                  >
                                    {slot}
                                  </button>
                                );
                              });
                            })()}
                          </div>
                        </div>

                        {/* Afternoon Slots */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Moon size={14} style={{ color: c.blue }} />
                            <span
                              className="text-[10px] font-black uppercase tracking-widest"
                              style={{ color: c.txt3 }}
                            >
                              Après-midi
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {(() => {
                              const afternoonHours = [
                                "14:00",
                                "14:30",
                                "15:00",
                                "15:30",
                                "16:00",
                                "16:30",
                                "17:00",
                              ];
                              const available = slotsForDay(
                                selectedDoctor,
                                calDay,
                              );
                              return afternoonHours.map((slot) => {
                                const isAvail = available.includes(slot);
                                const isSel = calSlot === slot;
                                return (
                                  <button
                                    key={slot}
                                    disabled={!isAvail}
                                    onClick={() => setCalSlot(slot)}
                                    className="py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95"
                                    style={{
                                      background: isSel
                                        ? c.blue
                                        : isAvail
                                          ? c.card
                                          : "transparent",
                                      color: isSel
                                        ? "#fff"
                                        : isAvail
                                          ? c.txt
                                          : c.txt3,
                                      borderColor: isSel
                                        ? c.blue
                                        : isAvail
                                          ? c.border
                                          : c.border + "33",
                                      opacity: isAvail ? 1 : 0.4,
                                    }}
                                  >
                                    {slot}
                                  </button>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Booking Summary & Action */}
                      <div
                        className="mt-6 pt-6 border-t space-y-4"
                        style={{ borderColor: c.border }}
                      >
                        {calSlot && (
                          <div
                            className="p-4 rounded-2xl border border-dashed animate-in zoom-in-95 duration-300"
                            style={{
                              background: `${c.blue}08`,
                              borderColor: `${c.blue}44`,
                            }}
                          >
                            <p
                              className="text-[10px] font-black uppercase tracking-widest mb-2"
                              style={{ color: c.blue }}
                            >
                              Résumé du RDV
                            </p>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: c.blue }}
                              >
                                <Clock size={20} className="text-white" />
                              </div>
                              <div>
                                <p
                                  className="text-xs font-bold"
                                  style={{ color: c.txt }}
                                >
                                  {calDay} {monthNames[month]} {year}
                                </p>
                                <p
                                  className="text-sm font-black"
                                  style={{ color: c.blue }}
                                >
                                  à {calSlot}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={handleBook}
                          disabled={!calSlot || isSubmitting}
                          className="w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                          style={{
                            background: calSlot
                              ? `linear-gradient(135deg, ${selectedDoctor.color}, ${c.blue})`
                              : c.border,
                            boxShadow: calSlot
                              ? `0 10px 20px -5px ${c.blue}66`
                              : "none",
                            cursor:
                              calSlot && !isSubmitting ? "pointer" : "default",
                          }}
                        >
                          {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : calSlot ? (
                            "Confirmer la réservation"
                          ) : (
                            "Choisissez un horaire"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Doctor list */}
          <div className="space-y-4 mb-10 pt-4" ref={docListRef}>
            {filteredDoctors.map((doc) => (
              <Card key={doc.id} dk={dk} style={{ padding: "18px" }}>
                <div className="flex gap-4 flex-wrap">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base shrink-0"
                    style={{ background: doc.color }}
                  >
                    {doc.initials}
                  </div>
                  <div className="flex-1 min-w-48">
                    <h3 className="font-bold" style={{ color: c.txt }}>
                      {doc.name}
                    </h3>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: c.blue }}
                    >
                      {doc.spec}
                    </p>
                    <p
                      className="text-xs flex items-center gap-1 mt-1"
                      style={{ color: c.txt2 }}
                    >
                      <MapPin size={12} /> {doc.loc}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className="text-xs font-bold"
                        style={{ color: "#E8A838" }}
                      >
                        ⭐ {doc.rating}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: c.txt3 }}
                      >
                        {doc.exp} ans exp.
                      </span>
                      <span className="text-xs" style={{ color: c.txt3 }}>
                        {doc.reviews} avis
                      </span>
                    </div>
                    {/* Languages */}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {doc.lang.map((l) => (
                        <span
                          key={l}
                          className="text-[10px] px-2 py-0.5 rounded-full border"
                          style={{ borderColor: c.border, color: c.txt3 }}
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: c.txt3 }}
                    >
                      Prochains créneaux
                    </p>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {/* For now we leave placeholders or empty if slots are not loaded individually for all doctors */}
                      <span
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border"
                        style={{
                          borderColor: c.blue + "33",
                          color: c.blue,
                          background: c.blueLight,
                        }}
                      >
                        Sur RDV
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => setProfileDoctor(doc)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
                        style={{ borderColor: c.border, color: c.txt2 }}
                      >
                        Profil
                      </button>
                      <button
                        onClick={() => openCalendar(doc)}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: c.blue }}
                      >
                        Prendre RDV
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {/* Spacer to prevent absolute dropdowns from cutting into the page background bottom */}
          <div className="h-[260px] w-full pointer-events-none" />
        </>
      )}

      {/* ──── TAB: HISTORY ──── */}
      {tab === "history" && (
        <>
          <h2 className="font-bold text-lg mb-4" style={{ color: c.txt }}>
            Historique des rendez-vous
          </h2>
          <div className="space-y-3">
            {historyAppts.length === 0 ? (
              <EmptyState
                dk={dk}
                icon={Clock}
                title="Aucun historique"
                message="Vous n'avez pas encore de rendez-vous passés ou annulés à afficher."
              />
            ) : (
              historyAppts.map((h, i) => (
                <Card key={h.id || i} dk={dk} style={{ padding: "14px 18px" }}>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background:
                          (h.status === "completed" ? "#2D8C6F" : "#E05555") +
                          "18",
                      }}
                    >
                      {h.status === "completed" ? (
                        <CheckCircle size={18} style={{ color: "#2D8C6F" }} />
                      ) : (
                        <X size={18} style={{ color: "#E05555" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-48">
                      <p className="font-bold text-sm" style={{ color: c.txt }}>
                        {h.doctor_name || "Médecin"}
                      </p>
                      <p className="text-xs" style={{ color: c.txt2 }}>
                        {h.specialty || "Spécialité"} ·{" "}
                        {h.date_display || h.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full uppercase"
                        style={{
                          background:
                            (h.status === "completed" ? "#2D8C6F" : "#E05555") +
                            "18",
                          color:
                            h.status === "completed" ? "#2D8C6F" : "#E05555",
                        }}
                      >
                        {h.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </>
  );
}

// ─── PRESCRIPTIONS PAGE ───────────────────────────────────────────────────────
function PrescriptionsPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [filter, setFilter] = useState("All");
  const [selectedQr, setSelectedQr] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const rxList = [
    {
      id: "RX-2023-0847",
      doctor: "Dr. Sarah Smith",
      date: "Oct 20, 2023",
      status: "ACTIVE",
      statusColor: "#2D8C6F",
      meds: [
        "Lisinopril 10mg — 1 tablet daily",
        "Metformin 500mg — 1 tablet twice daily",
      ],
    },
    {
      id: "RX-2023-0791",
      doctor: "Dr. Benali Karim",
      date: "Sep 05, 2023",
      status: "EXPIRED",
      statusColor: "#E05555",
      meds: [
        "Amoxicillin 500mg — 3x daily for 7 days",
        "Vitamin D3 2000 IU — 1 capsule daily",
      ],
    },
  ];

  const filteredRxList = rxList.filter(
    (rx) => filter === "All" || rx.status === filter.toUpperCase(),
  );

  const handleDownload = (id) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
    }, 2500);
  };

  return (
    <>
      <div className="flex gap-2 mb-5 flex-wrap">
        {["All", "Active", "Expired", "Pending"].map((label, i) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
            style={{
              background: filter === label ? c.blue : "transparent",
              color: filter === label ? "#fff" : c.txt2,
              borderColor: filter === label ? c.blue : c.border,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filteredRxList.length === 0 ? (
          <EmptyState
            dk={dk}
            icon={FileText}
            title="Aucune prescription"
            message={`Aucune ordonnance trouvée pour le filtre "${filter}".`}
          />
        ) : (
          filteredRxList.map((rx) => (
            <Card key={rx.id} dk={dk}>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setSelectedQr(rx)}
                  className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 transition-transform hover:scale-105 shadow-md active:scale-95"
                  style={{ background: "#000" }}
                >
                  <QrCode size={36} className="text-white" />
                </button>
                <div className="flex-1 min-w-48">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div>
                      <p className="font-bold" style={{ color: c.txt }}>
                        Prescription #{rx.id}
                      </p>
                      <p className="text-xs" style={{ color: c.txt2 }}>
                        Issued by {rx.doctor} · {rx.date}
                      </p>
                    </div>
                    <Badge color={rx.statusColor} bg={rx.statusColor + "18"}>
                      {rx.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {rx.meds.map((m) => (
                      <p key={m} className="text-sm" style={{ color: c.txt }}>
                        • {m}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleDownload(rx.id)}
                    disabled={downloading === rx.id}
                    className="text-xs font-semibold px-3 py-2 rounded-lg border transition-colors hover:opacity-80 disabled:opacity-50 flex items-center gap-2 justify-center"
                    style={{ color: c.txt2, borderColor: c.border }}
                  >
                    {downloading === rx.id ? (
                      <span
                        className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: c.txt2 }}
                      ></span>
                    ) : (
                      "⬇ PDF"
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedQr(rx)}
                    className="flex items-center gap-2 justify-center text-xs font-semibold px-3 py-2 rounded-lg text-white transition-colors hover:opacity-80 active:scale-95"
                    style={{ background: c.blue }}
                  >
                    <QrCode size={14} /> Show QR
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* QR Modal Overlay */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl relative flex flex-col items-center animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setSelectedQr(null)}
              className="absolute top-5 right-5 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <h3 className="font-black text-xl mb-1 text-gray-900">
              Prescription {selectedQr.id}
            </h3>
            <p className="text-xs font-bold text-gray-500 mb-8 uppercase tracking-widest">
              {selectedQr.doctor} • {selectedQr.date}
            </p>
            <div className="p-4 rounded-[32px] mb-8 bg-gray-50 border border-gray-100 shadow-inner">
              <QrCode size={200} className="text-gray-900" />
            </div>
            <p className="text-[13px] text-center font-bold text-gray-600 mb-2 px-4 leading-relaxed">
              Présentez ce QR Code à votre pharmacien pour récupérer vos
              médicaments.
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {downloading && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5"
          style={{ background: c.blue, color: "#fff" }}
        >
          <span className="w-5 h-5 border-2 border-white border-t-transparent flex-shrink-0 rounded-full animate-spin"></span>
          <span className="font-bold text-sm">
            Téléchargement du PDF en cours...
          </span>
        </div>
      )}
    </>
  );
}

// ─── PHARMACY PAGE ────────────────────────────────────────────────────────────
function PharmacyPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [cart, setCart] = useState({ 1: 1, 2: 2 });

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const cartItems = PHARMACY_ITEMS.filter((item) => (cart[item.id] || 0) > 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseInt(item.price) * (cart[item.id] || 0),
    0,
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start mt-4">
        {/* Medications grid */}
        <div className="lg:col-span-2">
          <Card dk={dk} className="mb-4" style={{ padding: "15px 18px" }}>
            <div className="flex items-center gap-2">
              <Search size={15} style={{ color: c.txt3 }} />
              <input
                placeholder="Search medication name…"
                className="outline-none text-sm bg-transparent flex-1"
                style={{ color: c.txt }}
              />
              <div className="flex gap-2">
                {["In Stock", "Generic", "CNAS"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full cursor-pointer border transition-colors"
                    style={{
                      color: c.blue,
                      borderColor: c.border,
                      background: c.blueLight,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {PHARMACY_ITEMS.map((item) => (
              <Card
                key={item.id}
                dk={dk}
                style={{ padding: 16, marginTop: "15px" }}
              >
                <p
                  className="font-bold text-sm mb-0.5"
                  style={{ color: c.txt }}
                >
                  {item.name}
                </p>
                <p className="text-xs mb-3" style={{ color: c.txt2 }}>
                  {item.molecule}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold" style={{ color: c.blue }}>
                    {item.price}
                  </span>
                  <div className="flex gap-1">
                    <Badge
                      color={item.stock === "In Stock" ? c.green : c.red}
                      bg={(item.stock === "In Stock" ? c.green : c.red) + "18"}
                    >
                      {item.stock}
                    </Badge>
                    {item.cnas && (
                      <Badge color={c.blue} bg={c.blueLight}>
                        CNAS
                      </Badge>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    item.stock === "In Stock" && addToCart(item.id)
                  }
                  disabled={item.stock !== "In Stock"}
                  className="w-full py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: item.stock === "In Stock" ? c.blue : c.border,
                    color: item.stock === "In Stock" ? "#fff" : c.txt3,
                    cursor:
                      item.stock === "In Stock" ? "pointer" : "not-allowed",
                  }}
                >
                  {item.stock === "In Stock" ? "Add to Cart" : "Unavailable"}
                </button>
              </Card>
            ))}
          </div>
        </div>
        {/* Cart */}
        <div className="sticky top-20">
          <Card dk={dk}>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={18} style={{ color: c.blue }} />
              <span className="font-bold" style={{ color: c.txt }}>
                My Cart
              </span>
              <Badge color={c.blue} bg={c.blueLight}>
                {cartItems.length} items
              </Badge>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: c.txt3 }}>
                Cart is empty
              </p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-3 border-b"
                    style={{ borderColor: c.border }}
                  >
                    <div className="flex-1">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: c.txt }}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs" style={{ color: c.txt2 }}>
                        {item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCart((c) => ({
                            ...c,
                            [item.id]: Math.max(0, (c[item.id] || 0) - 1),
                          }))
                        }
                        className="w-6 h-6 rounded-lg border flex items-center justify-center text-sm font-bold"
                        style={{ borderColor: c.border, color: c.blue }}
                      >
                        −
                      </button>
                      <span
                        className="text-sm font-semibold w-4 text-center"
                        style={{ color: c.txt }}
                      >
                        {cart[item.id]}
                      </span>
                      <button
                        onClick={() => addToCart(item.id)}
                        className="w-6 h-6 rounded-lg border flex items-center justify-center text-sm font-bold"
                        style={{ borderColor: c.border, color: c.blue }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 space-y-2">
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: c.txt2 }}
                  >
                    <span>Subtotal</span>
                    <span>{subtotal} DZD</span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: c.green }}
                  >
                    <span>SHIFA Coverage</span>
                    <span>− {Math.round(subtotal * 0.6)} DZD</span>
                  </div>
                  <div
                    className="flex justify-between font-bold border-t pt-2"
                    style={{ borderColor: c.border, color: c.txt }}
                  >
                    <span>Total</span>
                    <span>{Math.round(subtotal * 0.4)} DZD</span>
                  </div>
                </div>
                <button
                  className="w-full py-3 rounded-xl text-sm font-bold text-white mt-4 transition-all hover:opacity-90"
                  style={{ background: c.blue }}
                >
                  Confirm & Pay
                </button>
                <p
                  className="text-center text-xs mt-2"
                  style={{ color: c.txt3 }}
                >
                  🔒 Secured · CNAS integrated
                </p>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── CARE TAKER PAGE ──────────────────────────────────────────────────────────
function CareTakerPage({ dk }) {
  const c = dk ? T.dark : T.light;
  const [tab, setTab] = useState("assigned");
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: c.txt }}>
          Care Taker
        </h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
          Manage your assigned caregiver
        </p>
      </div>
      {/* Assigned caregiver */}
      <div
        className="rounded-2xl p-6 mb-6 flex items-center gap-5 flex-wrap"
        style={{ background: "linear-gradient(135deg, #2D8C6F, #3aaa88)" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          FB
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-lg">Fatima Benali</p>
          <p className="text-white/80 text-sm">
            Professional Caregiver · ⭐ 4.8 (48 reviews) · 5 years experience
          </p>
          <div className="flex gap-2 mt-3">
            {["💬 Message", "📞 Call", "🔄 Reassign"].map((btn) => (
              <button
                key={btn}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-white/20"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff",
                }}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
        <Badge color="#fff" bg="rgba(255,255,255,0.2)">
          Currently Assigned
        </Badge>
      </div>
      <div
        className="flex gap-1 border-b mb-6"
        style={{ borderColor: c.border }}
      >
        {["assigned", "find"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2.5 text-sm font-semibold capitalize transition-all"
            style={{
              color: tab === t ? c.blue : c.txt2,
              borderBottom:
                tab === t ? `2px solid ${c.blue}` : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {t === "assigned" ? "My Caregiver" : "Find a Caregiver"}
          </button>
        ))}
      </div>
      {tab === "assigned" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card dk={dk}>
            <p className="font-semibold mb-4" style={{ color: c.txt }}>
              Today's Tasks
            </p>
            {[
              {
                text: "Morning medication administered",
                time: "8:00 AM",
                done: true,
              },
              {
                text: "Picked up Lisinopril from pharmacy",
                time: "10:30 AM",
                done: true,
              },
              {
                text: "Evening medication — Metformin",
                time: "8:00 PM (pending)",
                done: false,
              },
            ].map((task) => (
              <div
                key={task.text}
                className="flex items-center gap-3 py-3 border-b last:border-0"
                style={{ borderColor: c.border }}
              >
                {task.done ? (
                  <CheckCircle size={20} style={{ color: c.green }} />
                ) : (
                  <Circle size={20} style={{ color: c.txt3 }} />
                )}
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: task.done ? c.txt3 : c.txt,
                      textDecoration: task.done ? "line-through" : "none",
                    }}
                  >
                    {task.text}
                  </p>
                  <p className="text-xs" style={{ color: c.txt3 }}>
                    {task.time}
                  </p>
                </div>
              </div>
            ))}
          </Card>
          <Card dk={dk}>
            <p className="font-semibold mb-4" style={{ color: c.txt }}>
              Compatibility
            </p>
            <p className="text-sm mb-3" style={{ color: c.txt2 }}>
              Fatima is matched to your medical profile:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                "Hypertension care",
                "Diabetes management",
                "Medication adherence",
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: c.blueLight, color: c.blue }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs font-semibold mb-2" style={{ color: c.txt2 }}>
              Treatment adherence this week
            </p>
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: c.blueLight }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: "86%", background: c.green }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: c.txt2 }}>
              86% — Excellent
            </p>
          </Card>
        </div>
      )}
      {tab === "find" && (
        <div className="space-y-4">
          {CARETAKERS.map((ct) => (
            <Card key={ct.name} dk={dk}>
              <div className="flex gap-4 flex-wrap">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shrink-0"
                  style={{ background: ct.color }}
                >
                  {ct.initials}
                </div>
                <div className="flex-1">
                  <p className="font-bold" style={{ color: c.txt }}>
                    {ct.name}
                  </p>
                  <p className="text-sm" style={{ color: c.txt2 }}>
                    {ct.role} · {ct.exp}
                  </p>
                  <p className="text-xs mt-0.5 mb-2" style={{ color: c.txt2 }}>
                    ⭐ {ct.rating} · {ct.price}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {ct.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: c.blueLight, color: c.blue }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    className="text-xs font-semibold px-4 py-2 rounded-xl border"
                    style={{ color: c.txt2, borderColor: c.border }}
                  >
                    View Profile
                  </button>
                  <button
                    className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                    style={{ background: c.blue }}
                  >
                    Assign
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage({ dk, notifications, setNotifications }) {
  const c = dk ? T.dark : T.light;

  const dismiss = async (id) => {
    try {
      await api.markNotificationRead(id).catch(() => {});
    } catch (e) {}
    setNotifications((n) => n.filter((x) => x.id !== id));
  };

  const markAllRead = async () => {
    try {
      // Loop or bulk API if available, locally we just mark them read
      setNotifications((n) =>
        n.map((x) => ({ ...x, is_read: true, unread: false })),
      );
    } catch (e) {}
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: c.txt }}>
            Notifications
          </h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
            Stay updated with your health alerts
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="text-sm font-semibold px-4 py-2 rounded-xl border"
          style={{ color: c.blue, borderColor: c.border }}
        >
          Mark all as read
        </button>
      </div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {["All", "Medications", "Appointments", "Emergencies"].map(
          (label, i) => (
            <button
              key={label}
              className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: i === 0 ? c.blue : "transparent",
                color: i === 0 ? "#fff" : c.txt2,
                borderColor: i === 0 ? c.blue : c.border,
              }}
            >
              {label}
            </button>
          ),
        )}
      </div>
      <div className="space-y-3">
        {(notifications || []).map((n) => {
          const isUnread = !n.is_read && n.unread !== false;
          const typeColor =
            n.type === "emergency"
              ? "#E05555"
              : n.type === "appointment"
                ? "#4A6FA5"
                : n.type === "medication"
                  ? "#2D8C6F"
                  : "#4A6FA5";

          return (
            <div
              key={n.id}
              className="flex items-start gap-3 p-4 rounded-2xl border transition-all"
              style={{
                background: c.card,
                borderColor: isUnread ? typeColor + "44" : c.border,
                borderLeft: isUnread ? `3px solid ${typeColor}` : undefined,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: typeColor + "22" }}
              >
                <Bell size={18} style={{ color: typeColor }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: c.txt }}>
                  {n.title || n.message || "Notification"}
                </p>
                <p className="text-xs mt-0.5" style={{ color: c.txt2 }}>
                  {n.sub || n.created_at || "Récemment"}
                </p>
              </div>
              {isUnread && (
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ background: typeColor }}
                />
              )}
              <button
                onClick={() => dismiss(n.id)}
                className="shrink-0 text-xs hover:opacity-70 transition-opacity"
                style={{ color: c.txt3 }}
              >
                ✕
              </button>
            </div>
          );
        })}
        {(!notifications || notifications.length === 0) && (
          <Card dk={dk} className="text-center" style={{ padding: 48 }}>
            <Bell
              size={36}
              className="mx-auto mb-3"
              style={{ color: c.txt3 }}
            />
            <p style={{ color: c.txt3 }}>No notifications</p>
          </Card>
        )}
      </div>
    </>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ dk, onToggleDark, userData }) {
  const c = dk ? T.dark : T.light;
  const [showPwd, setShowPwd] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Alger",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwdStatus, setPwdStatus] = useState({ type: "", msg: "" });
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  // Load preferences from localStorage or default
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem("medsmart_prefs");
    if (saved) return JSON.parse(saved);
    return {
      medicationReminders: true,
      appointmentConfirmations: true,
      analysisResults: true,
      emergencyAlerts: true,
      emailNotifications: false,
    };
  });

  useEffect(() => {
    if (userData) {
      setForm({
        name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
        email: userData.email || "",
        phone: userData.phone || "",
        city: "Alger", // Or userData.city if backend had it
      });
    }
  }, [userData]);

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
      const res = await fetch("http://localhost:8000/api/auth/password/change/", {
        method: "POST", // usually POST or PUT
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
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

  const togglePref = (key) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    localStorage.setItem("medsmart_prefs", JSON.stringify(newPrefs));
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: c.txt }}>
          Settings
        </h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
          Manage your account and preferences
        </p>
      </div>
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
                  background: status.type === "success" ? "#2D8C6F12" : "#E0555512",
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
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
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
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
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
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
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
                  background: pwdStatus.type === "success" ? "#2D8C6F12" : "#E0555512",
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
                  onChange={(e) => setPwdForm({ ...pwdForm, [field.key]: e.target.value })}
                  className="w-full px-4 py-2.5 pr-12 rounded-xl text-sm outline-none border"
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
              className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:opacity-80"
              style={{ color: c.blue, borderColor: c.border, opacity: isSavingPwd ? 0.7 : 1 }}
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
    </>
  );
}

// ─── MAIN SHELL ───────────────────────────────────────────────────────────────
export default function PatientDashboard({ onLogout }) {
  const { userData } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [dk, setDk] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [emergency, setEmergency] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [medicalProfile, setMedicalProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const c = dk ? T.dark : T.light;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // On récupère les deux, mais si le profil médical n'existe pas encore (404),
        // on ne bloque pas tout le dashboard.
        const [appts, profile, notifs] = await Promise.all([
          api.getMyAppointments().catch((err) => {
            console.warn("Appointments fetch failed:", err);
            return [];
          }),
          api.getMedicalProfile().catch((err) => {
            console.warn("Medical Profile not found or error:", err);
            return null;
          }),
          api.getNotifications().catch((err) => {
            console.warn("Notifications fetch failed:", err);
            return [];
          }),
        ]);
        setAppointments(Array.isArray(appts) ? appts : []);
        setMedicalProfile(profile);
        setNotifications(Array.isArray(notifs) ? notifs : []);
      } catch (err) {
        console.error("Critical error in PatientDashboard fetchData:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Ensure scroll is at the top when navigating between dashboard tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  const refreshAppointments = async () => {
    try {
      const fresh = await api.getMyAppointments().catch(() => []);
      setAppointments(Array.isArray(fresh) ? fresh : []);
    } catch (err) {}
  };

  const userInitials =
    userData && (userData.first_name || userData.last_name)
      ? `${userData.first_name?.[0] || ""}${userData.last_name?.[0] || ""}`.toUpperCase()
      : "MC";
  const fullName =
    userData && (userData.first_name || userData.last_name)
      ? `${userData.first_name || ""} ${userData.last_name || ""}`.trim()
      : "Mon Compte";

  const NAV = [
    { id: "dashboard", label: "Dashboard" },
    { id: "medical-profile", label: "Medical Profile" },
    { id: "ai-diagnosis", label: "AI Diagnosis" },
    { id: "appointments", label: "Appointments" },
    { id: "prescriptions", label: "Prescriptions" },
    { id: "pharmacy", label: "Pharmacy" },
    { id: "care-taker", label: "Care Taker" },
  ];

  const renderPage = () => {
    const props = {
      onNav: setPage,
      dk,
      appointments,
      medicalProfile,
      loading,
      userData,
      refreshAppointments,
      notifications,
      setNotifications,
    };
    switch (page) {
      case "dashboard":
        return <DashboardPage {...props} />;
      case "medical-profile":
        return (
          <MedicalProfilePage
            dk={dk}
            profile={medicalProfile}
            userId={userData?.id}
          />
        );
      case "ai-diagnosis":
        return <AIDiagnosisPage dk={dk} />;
      case "appointments":
        return <AppointmentsPage {...props} />;
      case "prescriptions":
        return <PrescriptionsPage dk={dk} />;
      case "pharmacy":
        return <PharmacyPage dk={dk} />;
      case "care-taker":
        return <CareTakerPage dk={dk} />;
      case "notifications":
        return (
          <NotificationsPage
            dk={dk}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        );
      case "settings":
        return <SettingsPage dk={dk} onToggleDark={() => setDk(!dk)} userData={userData} />;
      default:
        return <DashboardPage {...props} />;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: c.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: c.txt,
        transition: "background 0.3s, color 0.2s",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { transition: background-color 0.2s, border-color 0.2s; }
        button { cursor: pointer !important; }
        select { cursor: pointer !important; }
        label { cursor: pointer !important; }
        a { cursor: pointer !important; }
        .nav-link:not(.active-nav):hover { background: rgba(100,146,201,0.15) !important; color: #6492C9 !important; }
      `}</style>

      {emergency && (
        <EmergencyModal onClose={() => setEmergency(false)} dk={dk} />
      )}

      {/* ═══ NAVBAR ═══ */}
      <nav
        className="sticky top-0 z-30 border-b shadow-sm"
        style={{ background: c.nav, borderColor: c.border }}
      >
        <div className="w-full px-6 h-[60px] flex items-center gap-3">
          {/* ── Logo with custom medical cross icon ── */}
          <div className="flex items-center gap-2 shrink-0 mr-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #304B71, #6492C9)",
              }}
            >
              {/* Medical cross + pulse line SVG */}
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
            <span className="font-bold text-base" style={{ color: c.txt }}>
              MedSmart
            </span>
          </div>

          {/* ── Nav links — centered with spacing ── */}
          <div
            className="hidden lg:flex items-center justify-center gap-1 flex-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`nav-link${page === item.id ? " active-nav" : ""} relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all`}
                style={{
                  color: page === item.id ? "#fff" : c.txt2,
                  background: page === item.id ? c.blue : "transparent",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* ── Right section ── */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            {/* Profile button — red dot on border corner for notifications */}
            <div className="relative">
              {/* Red dot on the outer corner of the whole button container */}
              {notifications.filter((n) => !n.is_read && n.unread !== false)
                .length > 0 && (
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
                  {
                    notifications.filter(
                      (n) => !n.is_read && n.unread !== false,
                    ).length
                  }
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
                  {userInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{ color: c.txt }}
                  >
                    {fullName}
                  </p>
                  <p className="text-xs" style={{ color: c.txt3 }}>
                    ID: #{userData?.id || "----"}
                  </p>
                </div>
                <ChevronDown size={13} style={{ color: c.txt3 }} />
              </button>

              {/* Profile dropdown — animated slide-down */}
              {profileOpen && (
                <div
                  className="absolute right-0 top-12 w-60 rounded-[20px] overflow-hidden z-50"
                  style={{
                    background: dk ? c.card : "#ffffff",
                    border: `1px solid ${dk ? c.border : "#F1F5F9"}`,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                    animation: "dropdownIn 0.2s ease forwards",
                  }}
                >
                  <style>{`
                    @keyframes dropdownIn {
                      from { opacity:0; transform:translateY(-8px) scale(0.97); }
                      to   { opacity:1; transform:translateY(0) scale(1); }
                    }
                    .pd-item { color: #64748B; background: transparent; transition: background 0.15s, color 0.15s; }
                    .pd-item:hover { background: #F8FAFC; color: #1E293B; }
                    .pd-item-danger { color: #EF4444; background: transparent; transition: background 0.15s; }
                    .pd-item-danger:hover { background: rgba(239,68,68,0.08); }
                  `}</style>

                  {/* User header */}
                  <div
                    className="px-4 py-3 border-b"
                    style={{ borderColor: dk ? c.border : "#F1F5F9" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #304B71, #6492C9)",
                        }}
                      >
                        {userInitials}
                      </div>
                      <div>
                        <p
                          className="text-sm font-bold"
                          style={{ color: c.txt }}
                        >
                          {fullName}
                        </p>
                        <p className="text-xs" style={{ color: c.txt3 }}>
                          Patient · ID #{userData?.id || "----"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-1 group">
                    {/* Notifications */}
                    <button
                      onClick={() => {
                        setPage("notifications");
                        setProfileOpen(false);
                      }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer"
                    >
                      <Bell
                        size={16}
                        className="hover:rotate-45 transition-transform"
                      />
                      Notifications
                      {notifications.filter(
                        (n) => !n.is_read && n.unread !== false,
                      ).length > 0 && (
                        <span
                          className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: "#E05555", color: "#fff" }}
                        >
                          {
                            notifications.filter(
                              (n) => !n.is_read && n.unread !== false,
                            ).length
                          }
                        </span>
                      )}
                    </button>

                    {/* Settings */}
                    <button
                      onClick={() => {
                        setPage("settings");
                        setProfileOpen(false);
                      }}
                      className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer"
                    >
                      <Settings
                        size={16}
                        className="hover:rotate-45 transition-transform"
                      />
                      Settings
                    </button>
                    {/* Dark mode */}
                    <button className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Sun
                        size={14}
                        style={{ color: dk ? c.txt3 : "#E8A838" }}
                      />
                      <button
                        onClick={() => setDk(!dk)}
                        className="relative rounded-full transition-all duration-300  "
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
                    {/* Divider */}
                    <div
                      className="h-px my-1 mx-2"
                      style={{ background: dk ? c.border : "#F1F5F9" }}
                    />

                    {/* Logout */}
                    <button
                      onClick={onLogout}
                      className="pd-item-danger w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl cursor-pointer"
                    >
                      <LogOut
                        size={16}
                        className="hover:translate-x-1 transition-transform"
                      />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ color: c.txt2 }}
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <Menu size={17} />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenu && (
          <div
            className="lg:hidden border-t px-4 py-3 flex flex-wrap gap-2"
            style={{ borderColor: c.border, background: c.nav }}
          >
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  setMobileMenu(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: page === item.id ? "#fff" : c.txt2,
                  background: page === item.id ? c.blue : "transparent",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="w-full px-6 py-6">{renderPage()}</main>

      {/* Close dropdown on outside click */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
}
