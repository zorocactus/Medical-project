// ─────────────────────────────────────────────────────────────────────────────
// AdminDashboard.jsx  —  Shell principal (Layout only)
// Les vues individuelles sont dans ./views/
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import * as api from "../../services/api";
import ErrorBoundary from "../../components/ErrorBoundary";
import { ParticlesHero } from "../../components/backgrounds/MedParticles";
import { useLanguage } from "../../context/LanguageContext";
import {
  Sun,
  Moon,
  Menu,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  Stethoscope,
  Pill,
  Heart,
  Shield,
  Calendar,
  ShoppingBag,
  UserCheck,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Trash2,
  Plus,
  Lock,
  Unlock,
  FileText,
  MapPin,
  Phone,
  Check,
  X,
  Star,
  Package,
  Building2,
  ClipboardList,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Copy,
  Eye,
  Pencil,
  Pin,
} from "lucide-react";

// ─── Shared theme & primitives ────────────────────────────────────────────────
import {
  T,
  HMS,
  ROLE_META as ROLE_COLORS,
  getAdminTheme,
} from "./adminTheme.js";
import { Card, Badge } from "./AdminPrimitives.jsx";

// ─── New modular views ────────────────────────────────────────────────────────
import AdminSidebar from "./views/AdminSidebar";
import OverviewPage from "./views/Overview";
import PatientsView from "./views/users/PatientsView";
import DoctorsView from "./views/users/DoctorsView";
import CaretakersView from "./views/users/CaretakersView";
import PharmacistsView from "./views/users/PharmacistsView";
import ScheduleView from "./views/ScheduleView";
import VisitQueueView from "./views/VisitQueueView";
import ReportsView from "./views/ReportsView";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
  trendLabel,
  dk,
}) {
  const c = getAdminTheme(dk);
  const up = trend >= 0;
  return (
    <Card dk={dk} style={{ padding: 20 }}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: color + "18" }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div
            className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
            style={{
              background: up ? "#2D8C6F18" : "#E0555518",
              color: up ? "#2D8C6F" : "#E05555",
            }}
          >
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p
        className="text-2xl font-black tracking-tight"
        style={{ color: c.txt }}
      >
        {value}
      </p>
      <p className="text-sm font-semibold mt-0.5" style={{ color: c.txt2 }}>
        {label}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: c.txt3 }}>
          {sub}
        </p>
      )}
      {trendLabel && (
        <p
          className="text-xs mt-1 font-semibold"
          style={{ color: up ? "#2D8C6F" : "#E05555" }}
        >
          {trendLabel}
        </p>
      )}
    </Card>
  );
}

function AnimCounter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else setVal(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <>
      {val.toLocaleString()}
      {suffix}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA  (kept for legacy pages — will be removed as views are migrated)
// ─────────────────────────────────────────────────────────────────────────────

const USERS_DATA = [];

const AUDIT_LOGS = [];

const LOG_COLORS = {
  success: {
    color: "#2D8C6F",
    bg: "#EEF8F4",
    bgDk: "#0F2820",
    icon: CheckCircle,
  },
  warning: {
    color: "#E8A838",
    bg: "#FFF8EC",
    bgDk: "#1E1500",
    icon: AlertTriangle,
  },
  danger: { color: "#E05555", bg: "#FFF0F0", bgDk: "#1E0A0A", icon: XCircle },
  info: { color: "#4A6FA5", bg: "#EEF3FB", bgDk: "#111E30", icon: Activity },
};

// Étend ROLE_COLORS (adminTheme.js) avec les icônes Lucide
const ROLE_META = {
  ...ROLE_COLORS,
  patient: { ...ROLE_COLORS.patient, icon: Users },
  doctor: { ...ROLE_COLORS.doctor, icon: Stethoscope },
  médecin: { ...ROLE_COLORS["médecin"], icon: Stethoscope },
  pharmacist: { ...ROLE_COLORS.pharmacist, icon: Pill },
  pharmacien: { ...ROLE_COLORS["pharmacien"], icon: Pill },
  caretaker: { ...ROLE_COLORS.caretaker, icon: Heart },
  "garde-malade": { ...ROLE_COLORS["garde-malade"], icon: Heart },
  admin: { ...ROLE_COLORS.admin, icon: Shield },
};

// ─── PENDING PROS (validation mock) ─────────────────────────────────────────
const PENDING_PROS = [];

// ─── MOCK APPOINTMENTS ────────────────────────────────────────────────────────
const MOCK_APPOINTMENTS = [];

const APPT_STATUS = {
  pending: { label: "En attente", color: "#E8A838", bg: "#FFF8EC" },
  confirmed: { label: "Confirmé", color: "#4A6FA5", bg: "#EEF3FB" },
  completed: { label: "Terminé", color: "#2D8C6F", bg: "#EEF8F4" },
  cancelled: { label: "Annulé", color: "#9AACBE", bg: "#F0F4F8" },
  refused: { label: "Refusé", color: "#E05555", bg: "#FFF0F0" },
};

// ─── MOCK MEDICATIONS ─────────────────────────────────────────────────────────
const MOCK_MEDICATIONS = [];

const MED_CATEGORY = {
  cardio: { label: "Cardiologie", color: "#E05555", bg: "#FFF0F0" },
  diabetes: { label: "Diabétologie", color: "#E8A838", bg: "#FFF8EC" },
  antibiotic: { label: "Antibiotique", color: "#4A6FA5", bg: "#EEF3FB" },
  analgesic: { label: "Analgésique", color: "#2D8C6F", bg: "#EEF8F4" },
  anti_inflam: { label: "Anti-inflammatoire", color: "#7B5EA7", bg: "#F3EEFF" },
  gastro: { label: "Gastro-entérologie", color: "#E8A838", bg: "#FFF8EC" },
  neuro: { label: "Neurologie", color: "#4A6FA5", bg: "#EEF3FB" },
  other: { label: "Autre", color: "#9AACBE", bg: "#F0F4F8" },
};

// ─── MOCK PHARMACIES & ORDERS ────────────────────────────────────────────────
const MOCK_PHARMACIES = [];

const MOCK_ORDERS = [];

const ORDER_STATUS = {
  pending: { label: "En attente", color: "#E8A838", bg: "#FFF8EC" },
  preparing: { label: "Préparation", color: "#4A6FA5", bg: "#EEF3FB" },
  ready: { label: "Prête", color: "#2D8C6F", bg: "#EEF8F4" },
  delivered: { label: "Livrée", color: "#9AACBE", bg: "#F0F4F8" },
  cancelled: { label: "Annulée", color: "#E05555", bg: "#FFF0F0" },
};

// ─── MOCK CARETAKERS ─────────────────────────────────────────────────────────
const MOCK_CARETAKERS = [];

const MOCK_CARE_REQUESTS = [];

const CARE_STATUS = {
  pending: { label: "En attente", color: "#E8A838", bg: "#FFF8EC" },
  accepted: { label: "Acceptée", color: "#2D8C6F", bg: "#EEF8F4" },
  rejected: { label: "Refusée", color: "#E05555", bg: "#FFF0F0" },
  completed: { label: "Terminée", color: "#9AACBE", bg: "#F0F4F8" },
  cancelled: { label: "Annulée", color: "#E05555", bg: "#FFF0F0" },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: VALIDATION (kept here until migrated to views/)
// ─────────────────────────────────────────────────────────────────────────────
function ValidationPage({ dk, onCountChange }) {
  const c = getAdminTheme(dk);
  const { t } = useLanguage();
  const [pending, setPending] = useState(PENDING_PROS);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [docModal, setDocModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // { pro } | null
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    api
      .getPendingDoctors()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map((d) => ({
            id: d.id,
            name: `${d.first_name || ""} ${d.last_name || ""}`.trim() || "—",
            role: d.role || "médecin",
            specialty: d.specialty || "—",
            wilaya: d.wilaya || d.city || "—",
            email: d.email || "—",
            phone: d.phone || "—",
            submittedAt: d.date_joined?.slice(0, 10) || "—",
            initials:
              (
                (d.first_name?.[0] || "") + (d.last_name?.[0] || "")
              ).toUpperCase() || "??",
            color: "#4A6FA5",
            docs: d.submitted_documents || [],
          }));
          setPending(normalized);
          if (onCountChange) onCountChange(normalized.length);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    try {
      await api.verifyUser(id);
    } catch {}
    const pro = pending.find((p) => p.id === id);
    const next = pending.filter((p) => p.id !== id);
    setPending(next);
    if (onCountChange) onCountChange(next.length);
    setHistory((prev) => [
      {
        ...pro,
        decision: "approved",
        decidedAt: new Date().toLocaleDateString("fr-FR"),
      },
      ...prev,
    ]);
  };

  const openRejectModal = (pro) => {
    setRejectReason("");
    setRejectModal(pro);
  };

  const confirmReject = async () => {
    if (!rejectModal) return;
    const id = rejectModal.id;
    const reason = rejectReason.trim() || "Documents insuffisants";
    setRejecting(true);
    try {
      await api.rejectUser(id, reason);
    } catch {}
    const pro = pending.find((p) => p.id === id);
    const next = pending.filter((p) => p.id !== id);
    setPending(next);
    if (onCountChange) onCountChange(next.length);
    setHistory((prev) => [
      {
        ...pro,
        decision: "rejected",
        reason,
        decidedAt: new Date().toLocaleDateString("fr-FR"),
      },
      ...prev,
    ]);
    setRejectModal(null);
    setRejecting(false);
  };

  const roleMeta = {
    médecin: { color: "#2D8C6F", bg: "#2D8C6F18", label: "Médecin" },
    pharmacien: { color: "#E8A838", bg: "#E8A83818", label: "Pharmacien" },
    "garde-malade": {
      color: "#7B5EA7",
      bg: "#7B5EA718",
      label: "Garde-malade",
    },
    doctor: { color: "#2D8C6F", bg: "#2D8C6F18", label: "Médecin" },
    pharmacist: { color: "#E8A838", bg: "#E8A83818", label: "Pharmacien" },
    caretaker: { color: "#7B5EA7", bg: "#7B5EA718", label: "Garde-malade" },
  };

  return (
    <>
      {/* ── Modal rejet avec motif ── */}
      {rejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !rejecting)
              setRejectModal(null);
          }}
        >
          <div
            className="rounded-2xl w-full max-w-md p-8 border"
            style={{ background: c.card, borderColor: c.border }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: c.red + "18" }}
            >
              <X size={24} style={{ color: c.red }} />
            </div>
            <h2
              className="text-lg font-bold text-center mb-1"
              style={{ color: c.txt }}
            >
              {t('dismiss_demand')}
            </h2>
            <p className="text-sm text-center mb-6" style={{ color: c.txt3 }}>
              {rejectModal.name} · {rejectModal.specialty}
            </p>
            <label
              className="block text-xs font-bold uppercase tracking-wide mb-2"
              style={{ color: c.txt3 }}
            >
              {t('rejection_reason_label')}
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('reason_placeholder')}
              rows={4}
              disabled={rejecting}
              className="w-full rounded-xl border p-3 text-sm resize-none outline-none transition-all"
              style={{
                background: dk ? "#1A2333" : "#F8FAFC",
                borderColor: c.border,
                color: c.txt,
                fontFamily: "inherit",
              }}
            />
            <p className="text-xs mt-1 mb-5" style={{ color: c.txt3 }}>
              {t('default_reason_hint') || "Laissez vide pour utiliser le motif par défaut."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setRejectModal(null)}
                disabled={rejecting}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all hover:opacity-80 disabled:opacity-50"
                style={{ borderColor: c.border, color: c.txt2 }}
              >
                {t('cancel_appointment') || "Annuler"}
              </button>
              <button
                onClick={confirmReject}
                disabled={rejecting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ background: c.red }}
              >
                {rejecting ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <X size={14} />
                )}
                {t('confirm_rejection')}
              </button>
            </div>
          </div>
        </div>
      )}

      {docModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDocModal(null);
          }}
        >
          <div
            className="rounded-2xl w-full max-w-md p-8 border text-center"
            style={{ background: c.card, borderColor: c.border }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: c.blueLight }}
            >
              <FileText size={28} style={{ color: c.blue }} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: c.txt }}>
              {docModal.doc.label || docModal.doc.title}
            </h2>
            <p className="text-sm mb-6" style={{ color: c.txt3 }}>
              {t('submitted_by')} {docModal.pro.name}
            </p>
            <div
              className="rounded-xl border p-6 mb-6 flex flex-col items-center gap-2"
              style={{
                background: dk ? "#1A2333" : "#F8FAFC",
                borderColor: c.border,
              }}
            >
              {docModal.doc.url ? (
                <a
                  href={docModal.doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: c.blue }}
                >
                  {t('open_doc')} ↗
                </a>
              ) : (
                <>
                  <FileText size={40} style={{ color: c.txt3 }} />
                  <p className="text-xs" style={{ color: c.txt3 }}>
                    {t('preview_not_available') || "Aperçu non disponible"}
                  </p>
                </>
              )}
            </div>
            <button
              onClick={() => setDocModal(null)}
              className="w-full py-2.5 rounded-xl text-sm font-bold border"
              style={{ borderColor: c.border, color: c.txt2 }}
            >
              {t('close_btn') || "Fermer"}
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black" style={{ color: c.txt }}>
            {t('pending_validations')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
            {pending.length} {t('pro_in_waiting')} · {history.length} {t('pro_treated')}
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm"
          style={{
            background: c.amberLight,
            borderColor: c.amber + "40",
            color: c.amber,
          }}
        >
          <Clock size={15} /> {pending.length} {t('pending_tab')}
        </div>
      </div>

      {pending.length === 0 ? (
        <Card dk={dk} empty={true} style={{ padding: 48, textAlign: "center" }}>
          <CheckCircle
            size={40}
            style={{ color: c.green, margin: "0 auto 16px" }}
          />
          <p className="text-lg font-bold" style={{ color: c.txt }}>
            {t('all_processed') || "Toutes les demandes ont été traitées"}
          </p>
          <p className="text-sm mt-1" style={{ color: c.txt3 }}>
            {t('no_pending_registrations') || "Aucune inscription en attente pour le moment."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4 mb-8">
          {pending.map((pro) => {
            const meta = roleMeta[pro.role] || {
              color: c.blue,
              bg: c.blueLight,
              label: pro.role,
            };
            return (
              <Card key={pro.id} dk={dk} style={{ padding: 24 }}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-center gap-4 shrink-0">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ background: pro.color }}
                    >
                      {pro.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="text-base font-bold"
                          style={{ color: c.txt }}
                        >
                          {pro.name}
                        </h3>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: meta.bg, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-sm mt-0.5" style={{ color: c.txt3 }}>
                        {pro.specialty} · {pro.wilaya}
                      </p>
                      <p className="text-xs mt-1" style={{ color: c.txt3 }}>
                        {pro.email} · {pro.phone}
                      </p>
                      <p
                        className="text-[10px] mt-1 font-semibold uppercase tracking-wide"
                        style={{ color: c.txt3 }}
                      >
                        {t('submitted_on')} {pro.submittedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-xs font-bold uppercase tracking-wide mb-2"
                      style={{ color: c.txt3 }}
                    >
                      {t('submitted_docs') || "Documents soumis"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(pro.docs || []).map((doc, i) => (
                        <button
                          key={i}
                          onClick={() => setDocModal({ pro, doc })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
                          style={{
                            background: c.blueLight,
                            borderColor: c.blue + "30",
                            color: c.blue,
                          }}
                        >
                          <FileText size={12} />{" "}
                          {doc.label || doc.title || "Document"}
                        </button>
                      ))}
                      {(pro.docs || []).length === 0 && (
                        <span className="text-xs" style={{ color: c.txt3 }}>
                          {t('no_docs_submitted') || "Aucun document soumis"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => approve(pro.id)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                      style={{ background: c.green }}
                    >
                      <Check size={15} /> {t('approve_btn')}
                    </button>
                    <button
                      onClick={() => openRejectModal(pro)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                      style={{ background: c.red }}
                    >
                      <X size={15} /> {t('dismiss_demand')}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {history.length > 0 && (
        <>
          <h2 className="text-base font-bold mb-4" style={{ color: c.txt }}>
            {t('decision_history')}
          </h2>
          <div className="space-y-3">
            {history.map((pro, i) => {
              const meta = roleMeta[pro.role] || {
                color: c.blue,
                bg: c.blueLight,
                label: pro.role,
              };
              const approved = pro.decision === "approved";
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl border"
                  style={{
                    background: approved ? c.greenLight : c.redLight,
                    borderColor: (approved ? c.green : c.red) + "30",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: pro.color }}
                    >
                      {pro.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: c.txt }}>
                        {pro.name}
                      </p>
                      <p className="text-xs" style={{ color: c.txt3 }}>
                        {meta.label} · {pro.wilaya}
                      </p>
                      {!approved && pro.reason && (
                        <p
                          className="text-xs mt-0.5 italic"
                          style={{ color: c.txt3 }}
                        >
                          {t('reason_col')} : {pro.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: c.txt3 }}>
                      {pro.decidedAt}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: approved ? c.green + "18" : c.red + "18",
                        color: approved ? c.green : c.red,
                      }}
                    >
                      {approved ? (
                        <>
                          <Check size={11} /> {t('treated_status')}
                        </>
                      ) : (
                        <>
                          <X size={11} /> {t('ignored_status')}
                        </>
                      )}
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

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: UTILISATEURS  —  HMS Professional Style
// ─────────────────────────────────────────────────────────────────────────────

// Deterministic avatar color from name
function hmsAvatarColor(name = "") {
  const palette = [
    "#5B7FFF",
    "#EF4444",
    "#10B981",
    "#A78BFA",
    "#F59E0B",
    "#06B6D4",
    "#EC4899",
    "#F97316",
    "#8B5CF6",
    "#22C55E",
    "#FF6B6B",
    "#4ECDC4",
    "#E879F9",
    "#34D399",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  return palette[Math.abs(h) % palette.length];
}

// Role pill config
const USER_ROLE_PILLS = [
  { value: "all", label: "All" },
  { value: "admin", label: "Admins" },
  { value: "doctor", label: "Doctors" },
  { value: "patient", label: "Patients" },
  { value: "pharmacist", label: "Pharmacists" },
  { value: "caretaker", label: "Garde-malades" },
];

// Status badge config (HMS dark)
const HMS_USER_STATUS = {
  active: { label: "Active", color: "#22C55E", bg: "rgba(34,197,94,0.14)" },
  pending: { label: "Pending", color: "#F59E0B", bg: "rgba(245,158,11,0.14)" },
  suspended: {
    label: "Suspended",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.14)",
  },
};

// Row action dropdown
function UserRowMenu({ user, onSuspend, dk }) {
  const { t } = useLanguage();
  const c = getAdminTheme(dk);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const isSuspended = user.status === "suspended";

  const actions = [
    {
      label: t('copy_id') || "Copy ID",
      icon: Copy,
      action: () => navigator.clipboard?.writeText(String(user.id)),
    },
    { label: t('view_btn') || "View", icon: Eye, action: () => {} },
    { label: t('edit_btn') || "Edit", icon: Pencil, action: () => {} },
    {
      label: isSuspended ? (t('unban_btn') || "Unban") : (t('ban_btn') || "Ban"),
      icon: Lock,
      danger: true,
      action: () => onSuspend(user.id),
    },
    { label: t('pin_note') || "Pin Note", icon: Pin, action: () => {} },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="w-7 h-7 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
        style={{ color: c.txt3 }}
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-8 z-50 rounded-lg border shadow-2xl py-1 w-44 overflow-hidden"
          style={{
            background: c.surface,
            borderColor: c.border,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {actions.map(({ label, icon: Icon, action, danger }) => (
            <button
              key={label}
              onClick={() => {
                action?.();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs transition-colors hover:bg-white/5"
              style={{ color: danger ? c.red : c.txt2 }}
            >
              <Icon size={13} style={{ opacity: 0.8 }} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const HMS_PAGE_SIZE = 10;

function UtilisateursPage({ dk }) {
  const { t } = useLanguage();
  const c = getAdminTheme(dk);
  const [users, setUsers] = useState(USERS_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .getUsers()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setUsers(
            data.map((u) => ({
              id: u.id,
              name:
                `${u.first_name || ""} ${u.last_name || ""}`.trim() ||
                u.email ||
                "—",
              email: u.email || "—",
              role: u.role || "patient",
              wilaya: u.wilaya || u.city || "—",
              phone: u.phone || u.phone_number || "—",
              status:
                u.is_active === false
                  ? "suspended"
                  : u.verification_status === "pending"
                    ? "pending"
                    : "active",
              joined: u.date_joined?.slice(0, 10) || "—",
              verified: u.verification_status === "verified",
            })),
          );
        }
      })
      .catch((err) =>
        setError(err.message || t('error_loading_users') || "Impossible de charger les utilisateurs."),
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.wilaya.toLowerCase().includes(q)) &&
      (roleFilter === "all" || u.role === roleFilter) &&
      (statusFilter === "all" || u.status === statusFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / HMS_PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * HMS_PAGE_SIZE,
    page * HMS_PAGE_SIZE,
  );
  const allSelected =
    paginated.length > 0 && paginated.every((u) => selected.includes(u.id));

  const suspend = async (id) => {
    try {
      await api.toggleSuspendUser(id);
    } catch {}
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "suspended" ? "active" : "suspended" }
          : u,
      ),
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <RefreshCw
          size={28}
          className="animate-spin"
          style={{ color: c.blue }}
        />
      </div>
    );

  // Pagination range (show max 7 pages, centered on current)
  const paginationPages = (() => {
    const delta = 3;
    const start = Math.max(1, Math.min(page - delta, totalPages - delta * 2));
    const end = Math.min(totalPages, start + delta * 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  return (
    <div style={{ minHeight: "100%" }}>
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: c.txt }}
          >
            {t('utilisateurs')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt3 }}>
            {t('total_users_count', { count: filtered.length })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border"
            style={{ background: c.surface, borderColor: c.border, width: 240 }}
          >
            <Search size={14} style={{ color: c.txt3, flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t('search')}
              className="outline-none text-sm bg-transparent flex-1 min-w-0"
              style={{ color: c.txt }}
            />
          </div>
          {/* Status filter */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border"
            style={{ background: c.surface, borderColor: c.border }}
          >
            <span className="text-xs" style={{ color: c.txt3 }}>
              {t('table_status')}:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="outline-none text-xs bg-transparent"
              style={{ color: c.txt2, cursor: "pointer" }}
            >
              <option value="all" style={{ background: c.surface }}>
                {t('all_tab')}
              </option>
              <option value="active" style={{ background: c.surface }}>
                {t('active_tab')}
              </option>
              <option value="pending" style={{ background: c.surface }}>
                {t('pending_tab')}
              </option>
              <option value="suspended" style={{ background: c.surface }}>
                {t('suspended_tab')}
              </option>
            </select>
          </div>
          {/* + New User */}
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ background: c.blue }}
          >
            <Plus size={15} /> {t('add_btn') || "New User"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg border mb-4 text-sm"
          style={{
            background: c.redBg,
            borderColor: c.red + "30",
            color: c.red,
          }}
        >
          <AlertTriangle size={15} />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto"
            style={{ color: c.red }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── Role filter tabs ── */}
      <div
        className="flex items-end gap-0 border-b overflow-x-auto"
        style={{ borderColor: c.border }}
      >
        {USER_ROLE_PILLS.map((pill) => {
          const count =
            pill.value === "all"
              ? users.length
              : users.filter((u) => u.role === pill.value).length;
          const isActive = roleFilter === pill.value;
          return (
            <button
              key={pill.value}
              onClick={() => {
                setRoleFilter(pill.value);
                setPage(1);
              }}
              className="relative flex items-center gap-1.5 px-4 py-3 text-sm whitespace-nowrap transition-colors shrink-0"
              style={{ color: isActive ? c.blue : c.txt3 }}
            >
              {t(`role_${pill.value}`)}
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: isActive ? c.blueFaint : "rgba(255,255,255,0.05)",
                  color: isActive ? c.blue : c.txt3,
                }}
              >
                {count}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: c.blue }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-b-lg border overflow-hidden"
        style={{ borderColor: c.border, borderTop: "none", background: c.card }}
      >
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: c.header,
                  borderBottom: `1px solid ${c.border}`,
                }}
              >
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() =>
                      allSelected
                        ? setSelected([])
                        : setSelected(paginated.map((u) => u.id))
                    }
                    className="w-4 h-4"
                    style={{ accentColor: c.blue }}
                  />
                </th>
                {[
                  { key: "name", label: t('table_name') },
                  { key: "phone", label: t('table_phone') },
                  { key: "email", label: t('table_email') },
                  { key: "role", label: t('table_role') },
                  { key: "wilaya", label: t('wilaya_label') },
                  { key: "status", label: t('table_status') },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3"
                    style={{ color: c.txt3 }}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => {
                const aColor = hmsAvatarColor(u.name);
                const initials =
                  u.name
                    .split(" ")
                    .map((n) => n[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "??";
                const sm = HMS_USER_STATUS[u.status] ?? HMS_USER_STATUS.active;
                const isSelected = selected.includes(u.id);
                return (
                  <tr
                    key={u.id}
                    className="group transition-colors"
                    style={{
                      borderBottom: `1px solid ${c.border}`,
                      background: isSelected ? c.blueFaint : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = c.row;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isSelected
                        ? c.blueFaint
                        : "transparent";
                    }}
                  >
                    <td className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          setSelected((prev) =>
                            prev.includes(u.id)
                              ? prev.filter((x) => x !== u.id)
                              : [...prev, u.id],
                          )
                        }
                        className="w-4 h-4"
                        style={{ accentColor: c.blue }}
                      />
                    </td>
                    {/* Name + Avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: aColor }}
                        >
                          {initials}
                        </div>
                        <span
                          className="text-sm font-medium whitespace-nowrap"
                          style={{ color: c.txt }}
                        >
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 text-sm whitespace-nowrap"
                      style={{ color: c.txt2 }}
                    >
                      {u.phone || "—"}
                    </td>
                    <td
                      className="px-4 py-3 text-sm max-w-[200px] truncate"
                      style={{ color: c.txt2 }}
                    >
                      {u.email}
                    </td>
                    <td
                      className="px-4 py-3 text-sm capitalize whitespace-nowrap"
                      style={{ color: c.txt2 }}
                    >
                      {t(`role_${u.role}`)}
                    </td>
                    <td
                      className="px-4 py-3 text-sm whitespace-nowrap"
                      style={{ color: c.txt2 }}
                    >
                      {u.wilaya}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                        style={{ background: sm.bg, color: sm.color }}
                      >
                        {t(`status_${u.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <UserRowMenu user={u} onSuspend={suspend} dk={dk} />
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-16 text-center text-sm"
                    style={{ color: c.txt3 }}
                  >
                    {t('no_results') || "Aucun résultat."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: c.border, background: c.header }}
        >
          <p className="text-xs" style={{ color: c.txt3 }}>
            {filtered.length === 0
              ? "No results."
              : `${(page - 1) * HMS_PAGE_SIZE + 1}–${Math.min(page * HMS_PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </p>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-md flex items-center justify-center disabled:opacity-30 hover:bg-white/5 transition-colors"
              style={{ color: c.txt3 }}
            >
              <ChevronLeft size={15} />
            </button>
            {paginationPages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 rounded-md text-xs font-semibold transition-colors"
                style={{
                  background: p === page ? c.blue : "transparent",
                  color: p === page ? "#fff" : c.txt3,
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-md flex items-center justify-center disabled:opacity-30 hover:bg-white/5 transition-colors"
              style={{ color: c.txt3 }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: RENDEZ-VOUS
// ─────────────────────────────────────────────────────────────────────────────
function RendezVousPage({ dk }) {
  const { t } = useLanguage();
  const c = getAdminTheme(dk);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [usingFallback, setUsingFallback] = useState(false);
  const [page, setPage] = useState(1);
  const PG = 7;

  useEffect(() => {
    api
      .getAdminAppointments()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAppointments(data);
          setUsingFallback(false);
        } else {
          setUsingFallback(true);
        }
      })
      .catch(() => {
        setUsingFallback(true);
      });
  }, []);

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    return (
      (a.patient?.toLowerCase().includes(q) ||
        a.doctor?.toLowerCase().includes(q) ||
        a.motif?.toLowerCase().includes(q)) &&
      (statusFilter === "all" || a.status === statusFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PG));
  const paginated = filtered.slice((page - 1) * PG, page * PG);
  const statusCounts = Object.fromEntries(
    ["pending", "confirmed", "completed", "cancelled", "refused"].map((s) => [
      s,
      appointments.filter((a) => a.status === s).length,
    ]),
  );

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black" style={{ color: c.txt }}>
            {t('rendezvous')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
            {appointments.length} {t('rendezvous')} · {statusCounts.pending || 0} {t('in_waiting')}
          </p>
        </div>
        <button
          onClick={() => {
            const headers = [
              "ID",
              "Patient",
              "Médecin",
              "Spécialité",
              "Date",
              "Heure",
              "Motif",
              "Statut",
            ];
            const rows = filtered.map((a) => [
              a.id,
              a.patient,
              a.doctor,
              a.specialty,
              a.date,
              a.time || a.start_time,
              a.motif,
              a.status,
            ]);
            const csv = [headers, ...rows]
              .map((r) =>
                r
                  .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
                  .join(","),
              )
              .join("\n");
            const url = URL.createObjectURL(
              new Blob([csv], { type: "text/csv;charset=utf-8;" }),
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = "rendez-vous.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border"
          style={{ borderColor: c.border, color: c.txt2 }}
        >
          <Download size={14} /> {t('export_csv')}
        </button>
      </div>
      {usingFallback && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 border"
          style={{
            background: dk ? "#1E1500" : "#FFF8EC",
            borderColor: "#E8A83855",
            color: "#E8A838",
          }}
        >
          <AlertTriangle size={15} className="shrink-0" />
          <p className="text-xs font-semibold">
            {t('simulated_data_warning')}
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        {[
          ["pending", t('status_pending'), "#E8A838"],
          ["confirmed", t('status_confirmed'), "#4A6FA5"],
          ["completed", t('status_completed'), "#2D8C6F"],
          ["cancelled", t('status_cancelled'), "#9AACBE"],
          ["refused", t('status_refused'), "#E05555"],
        ].map(([s, label, color]) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(statusFilter === s ? "all" : s);
              setPage(1);
            }}
            className="rounded-2xl border p-4 text-left transition-all hover:opacity-80"
            style={{
              background: statusFilter === s ? color + "18" : c.card,
              borderColor: statusFilter === s ? color + "50" : c.border,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <p className="text-xl font-black" style={{ color }}>
              {statusCounts[s] || 0}
            </p>
            <p
              className="text-xs font-semibold mt-0.5"
              style={{ color: c.txt2 }}
            >
              {label}
            </p>
          </button>
        ))}
      </div>
      <Card dk={dk} className="mb-4" style={{ padding: "10px 14px" }}>
        <div className="flex items-center gap-2">
          <Search size={14} style={{ color: c.txt3 }} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t('search_placeholder_appt') || "Rechercher par patient, médecin, motif…"}
            className="outline-none text-sm bg-transparent flex-1"
            style={{ color: c.txt }}
          />
        </div>
      </Card>
      <Card dk={dk} empty={true} style={{ padding: 0, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${c.border}`,
                  background: dk ? "rgba(255,255,255,0.02)" : "#FAFBFD",
                }}
              >
                {[
                  t('table_patient'),
                  t('table_doctor_spec'),
                  t('table_date_time'),
                  t('table_motif'),
                  t('table_status'),
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-bold uppercase tracking-wide px-4 py-3"
                    style={{ color: c.txt3 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((a) => {
                const sm = APPT_STATUS[a.status] || APPT_STATUS.pending;
                return (
                  <tr
                    key={a.id}
                    style={{ borderBottom: `1px solid ${c.border}` }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = dk
                        ? "rgba(255,255,255,0.02)"
                        : "#FAFBFD")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: "#4A6FA5" }}
                        >
                          {a.patient
                            ?.split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("") || "??"}
                        </div>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: c.txt }}
                        >
                          {a.patient}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: c.txt }}
                      >
                        {a.doctor}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: c.txt3 }}>
                        {a.specialty}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: c.txt }}
                      >
                        {a.date
                          ? new Date(a.date).toLocaleDateString("fr-FR")
                          : "—"}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: c.txt3 }}>
                        {a.time || a.start_time}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="text-sm max-w-[180px] truncate"
                        style={{ color: c.txt2 }}
                      >
                        {a.motif}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={sm.color} bg={dk ? sm.color + "22" : sm.bg}>
                        {sm.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Calendar
                size={36}
                className="mx-auto mb-3"
                style={{ color: c.txt3 }}
              />
              <p style={{ color: c.txt3 }}>Aucun rendez-vous trouvé</p>
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: c.border }}
        >
          <p className="text-xs" style={{ color: c.txt3 }}>
            {filtered.length === 0
              ? "Aucun résultat"
              : `${(page - 1) * PG + 1}–${Math.min(page * PG, filtered.length)} sur ${filtered.length}`}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg text-xs font-bold disabled:opacity-30"
              style={{ color: c.txt3 }}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-xs font-bold"
                style={{
                  background: p === page ? c.blue : "transparent",
                  color: p === page ? "#fff" : c.txt3,
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg text-xs font-bold disabled:opacity-30"
              style={{ color: c.txt3 }}
            >
              ›
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: MÉDICAMENTS
// ─────────────────────────────────────────────────────────────────────────────
function MedicamentsPage({ dk }) {
  const { t } = useLanguage();
  const c = getAdminTheme(dk);
  const [meds, setMeds] = useState(MOCK_MEDICATIONS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    molecule: "",
    category: "analgesic",
    form: "Comprimé",
    price_dzd: "",
    cnas_covered: false,
    requires_prescription: false,
    manufacturer: "",
  });
  const [saving, setSaving] = useState(false);
  const PG = 8;

  const handleAddMed = async () => {
    if (!newMed.name.trim()) return;
    setSaving(true);
    try {
      await api.createMedication(newMed);
    } catch (_) {}
    setMeds((prev) => [
      { ...newMed, id: Date.now(), is_active: true, dosage_forms: [] },
      ...prev,
    ]);
    setShowAddModal(false);
    setNewMed({
      name: "",
      molecule: "",
      category: "analgesic",
      form: "Comprimé",
      price_dzd: "",
      cnas_covered: false,
      requires_prescription: false,
      manufacturer: "",
    });
    setSaving(false);
  };

  useEffect(() => {
    api
      .getMedications()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.results;
        if (list?.length > 0) setMeds(list);
      })
      .catch(() => {});
  }, []);

  const filtered = meds.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.name?.toLowerCase().includes(q) ||
        m.molecule?.toLowerCase().includes(q)) &&
      (catFilter === "all" || m.category === catFilter) &&
      m.is_active !== false
    );
  });
  const paginated = filtered.slice((page - 1) * PG, page * PG);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PG));

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black" style={{ color: c.txt }}>
            {t('medications_catalogue')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
            {meds.filter((m) => m.is_active !== false).length} {t('references_count')} ·{" "}
            {meds.filter((m) => m.cnas_covered).length} {t('cnas_covered_count')}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: c.blue }}
        >
          <Plus size={14} /> {t('add_med_btn')}
        </button>
      </div>
      <Card dk={dk} className="mb-4" style={{ padding: "12px 16px" }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center gap-2 flex-1 min-w-52 rounded-xl px-3 py-2"
            style={{ background: c.blueLight }}
          >
            <Search size={14} style={{ color: c.txt3 }} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t('search_placeholder_med')}
              className="outline-none text-sm bg-transparent flex-1"
              style={{ color: c.txt }}
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => {
                setCatFilter("all");
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border"
              style={{
                background: catFilter === "all" ? c.blue : "transparent",
                color: catFilter === "all" ? "#fff" : c.txt2,
                borderColor: catFilter === "all" ? c.blue : c.border,
              }}
            >
              {t('all_tab')}
            </button>
            {Object.entries(MED_CATEGORY).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => {
                  setCatFilter(key);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border"
                style={{
                  background: catFilter === key ? color + "22" : "transparent",
                  color: catFilter === key ? color : c.txt2,
                  borderColor: catFilter === key ? color + "55" : c.border,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <Card dk={dk} empty={true} style={{ padding: 0, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${c.border}`,
                  background: dk ? "rgba(255,255,255,0.02)" : "#FAFBFD",
                }}
              >
                {[
                  t('table_medication'),
                  t('table_molecule'),
                  t('table_category'),
                  t('table_form_dosages'),
                  t('table_price_dzd'),
                  t('table_cnas'),
                  t('table_prescription'),
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-bold uppercase tracking-wide px-4 py-3"
                    style={{ color: c.txt3 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((m) => {
                const cat = MED_CATEGORY[m.category] || MED_CATEGORY.other;
                return (
                  <tr
                    key={m.id}
                    style={{ borderBottom: `1px solid ${c.border}` }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = dk
                        ? "rgba(255,255,255,0.02)"
                        : "#FAFBFD")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: cat.bg }}
                        >
                          <Pill size={14} style={{ color: cat.color }} />
                        </div>
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: c.txt }}
                          >
                            {m.name}
                          </p>
                          <p className="text-xs" style={{ color: c.txt3 }}>
                            {m.manufacturer}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: c.txt2 }}>
                      {m.molecule || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        color={cat.color}
                        bg={dk ? cat.color + "22" : cat.bg}
                      >
                        {cat.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: c.txt2 }}
                      >
                        {m.form}
                      </p>
                      <p className="text-[10px]" style={{ color: c.txt3 }}>
                        {Array.isArray(m.dosage_forms)
                          ? m.dosage_forms.join(" · ")
                          : "—"}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3 text-sm font-bold"
                      style={{ color: c.txt }}
                    >
                      {m.price_dzd ? `${m.price_dzd} DZD` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {m.cnas_covered ? (
                        <CheckCircle size={16} style={{ color: c.green }} />
                      ) : (
                        <XCircle size={16} style={{ color: c.txt3 }} />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {m.requires_prescription ? (
                        <Badge
                          color={c.amber}
                          bg={dk ? c.amber + "22" : c.amberLight}
                        >
                          Requise
                        </Badge>
                      ) : (
                        <Badge
                          color={c.green}
                          bg={dk ? c.green + "22" : c.greenLight}
                        >
                          Non requise
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Pill
                size={36}
                style={{ color: c.txt3 }}
                className="mx-auto mb-3"
              />
              <p style={{ color: c.txt3 }}>Aucun médicament trouvé</p>
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: c.border }}
        >
          <p className="text-xs" style={{ color: c.txt3 }}>
            {(page - 1) * PG + 1}–{Math.min(page * PG, filtered.length)} sur{" "}
            {filtered.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg text-xs font-bold disabled:opacity-30"
              style={{ color: c.txt3 }}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-xs font-bold"
                style={{
                  background: p === page ? c.blue : "transparent",
                  color: p === page ? "#fff" : c.txt3,
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg text-xs font-bold disabled:opacity-30"
              style={{ color: c.txt3 }}
            >
              ›
            </button>
          </div>
        </div>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card dk={dk} className="w-full max-w-md shadow-2xl overflow-hidden">
            <div
              className="px-6 py-4 border-b flex justify-between items-center"
              style={{ borderColor: c.border }}
            >
              <h3
                className="font-black text-sm uppercase tracking-wide"
                style={{ color: c.txt }}
              >
                Nouveau Médicament
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ color: c.txt3 }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                ["Nom commercial *", "name"],
                ["Molécule / DCI", "molecule"],
                ["Fabricant", "manufacturer"],
                ["Forme", "form"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label
                    className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 block"
                    style={{ color: c.txt }}
                  >
                    {label}
                  </label>
                  <input
                    value={newMed[key]}
                    onChange={(e) =>
                      setNewMed((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border mt-1"
                    style={{
                      background: dk ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                      borderColor: c.border,
                      color: c.txt,
                    }}
                  />
                </div>
              ))}
              <div>
                <label
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 block"
                  style={{ color: c.txt }}
                >
                  Prix (DZD)
                </label>
                <input
                  type="number"
                  value={newMed.price_dzd}
                  onChange={(e) =>
                    setNewMed((p) => ({ ...p, price_dzd: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border mt-1"
                  style={{
                    background: dk ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                    borderColor: c.border,
                    color: c.txt,
                  }}
                />
              </div>
              <div className="flex gap-4 pt-1">
                {[
                  ["cnas_covered", "Couvert CNAS"],
                  ["requires_prescription", "Ordonnance requise"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-xs cursor-pointer"
                    style={{ color: c.txt2 }}
                  >
                    <input
                      type="checkbox"
                      checked={newMed[key]}
                      onChange={(e) =>
                        setNewMed((p) => ({ ...p, [key]: e.target.checked }))
                      }
                      className="rounded"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div
              className="px-6 py-4 border-t flex gap-3"
              style={{ borderColor: c.border }}
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border"
                style={{ borderColor: c.border, color: c.txt2 }}
              >
                Annuler
              </button>
              <button
                onClick={handleAddMed}
                disabled={saving || !newMed.name.trim()}
                className="flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-50"
                style={{ background: c.blue }}
              >
                {saving ? "Enregistrement…" : "Ajouter"}
              </button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: PHARMACIES
// ─────────────────────────────────────────────────────────────────────────────
function PharmaciesPage({ dk }) {
  const { t } = useLanguage();
  const c = getAdminTheme(dk);
  const [tab, setTab] = useState("pharmacies");
  const [pharmacies, setPharmacies] = useState(MOCK_PHARMACIES);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");

  useEffect(() => {
    api
      .getAllPharmacies()
      .then((data) => {
        const l = Array.isArray(data) ? data : data?.results;
        if (l?.length > 0) setPharmacies(l);
      })
      .catch(() => {});
    api
      .getPharmacyOrders()
      .then((data) => {
        const l = Array.isArray(data) ? data : data?.results;
        if (l?.length > 0) setOrders(l);
      })
      .catch(() => {});
  }, []);

  const filteredPharmacies = pharmacies.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q)
    );
  });
  const filteredOrders = orders.filter(
    (o) => orderStatus === "all" || o.status === orderStatus,
  );

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: c.txt }}>
          {t('pharmacies')}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
          {pharmacies.length} {t('pharmacies')} ·{" "}
          {pharmacies.filter((p) => p.is_verified).length} {t('status_verified')}
        </p>
      </div>
      <div className="flex gap-2 mb-5">
        {[
          ["pharmacies", t('pharmacies')],
          ["orders", t('orders')],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border"
            style={{
              background: tab === id ? c.blue : "transparent",
              color: tab === id ? "#fff" : c.txt2,
              borderColor: tab === id ? c.blue : c.border,
            }}
          >
            {id === "pharmacies" ? (
              <Building2 size={15} />
            ) : (
              <Package size={15} />
            )}
            {label}
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                background: tab === id ? "rgba(255,255,255,0.2)" : c.blueLight,
                color: tab === id ? "#fff" : c.blue,
              }}
            >
              {id === "pharmacies" ? pharmacies.length : orders.length}
            </span>
          </button>
        ))}
      </div>

      {tab === "pharmacies" ? (
        <>
          <Card dk={dk} className="mb-4" style={{ padding: "10px 14px" }}>
            <div className="flex items-center gap-2">
              <Search size={14} style={{ color: c.txt3 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search_placeholder_pharmacy')}
                className="outline-none text-sm bg-transparent flex-1"
                style={{ color: c.txt }}
              />
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPharmacies.map((p) => (
              <Card key={p.id} dk={dk} style={{ padding: 20 }}>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: c.amberLight }}
                  >
                    <ShoppingBag size={20} style={{ color: c.amber }} />
                  </div>
                  {p.is_verified ? (
                    <Badge
                      color={c.green}
                      bg={dk ? c.green + "22" : c.greenLight}
                    >
                      {t('status_verified')}
                    </Badge>
                  ) : (
                    <Badge
                      color={c.amber}
                      bg={dk ? c.amber + "22" : c.amberLight}
                    >
                      {t('status_pending')}
                    </Badge>
                  )}
                </div>
                <h3 className="text-base font-bold" style={{ color: c.txt }}>
                  {p.name}
                </h3>
                <div className="mt-3 space-y-1.5">
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: c.txt2 }}
                  >
                    <MapPin size={12} style={{ color: c.txt3 }} /> {p.city},{" "}
                    {p.wilaya}
                  </div>
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: c.txt2 }}
                  >
                    <Phone size={12} style={{ color: c.txt3 }} /> {p.phone}
                  </div>
                </div>
                <div
                  className="mt-3 pt-3 border-t text-xs"
                  style={{ borderColor: c.border, color: c.txt3 }}
                >
                  Pharmacien : {p.pharmacist}
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              ["all", "Tous"],
              ...Object.entries(ORDER_STATUS).map(([k, v]) => [k, v.label]),
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setOrderStatus(v)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border"
                style={{
                  background: orderStatus === v ? c.blue : "transparent",
                  color: orderStatus === v ? "#fff" : c.txt2,
                  borderColor: orderStatus === v ? c.blue : c.border,
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <Card dk={dk} empty={true} style={{ padding: 0, overflow: "hidden" }}>
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${c.border}`,
                    background: dk ? "rgba(255,255,255,0.02)" : "#FAFBFD",
                  }}
                >
                  {[
                    "Référence",
                    "Patient",
                    "Pharmacie",
                    "Type",
                    "Total",
                    "Statut",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-bold uppercase tracking-wide px-4 py-3"
                      style={{ color: c.txt3 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => {
                  const sm = ORDER_STATUS[o.status] || ORDER_STATUS.pending;
                  return (
                    <tr
                      key={o.id}
                      style={{ borderBottom: `1px solid ${c.border}` }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = dk
                          ? "rgba(255,255,255,0.02)"
                          : "#FAFBFD")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td
                        className="px-4 py-3 text-xs font-bold"
                        style={{ color: c.blue }}
                      >
                        {o.id}
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: c.txt }}
                      >
                        {o.patient}
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: c.txt2 }}
                      >
                        {o.pharmacy}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          color={o.type === "prescription" ? c.blue : c.green}
                          bg={
                            dk
                              ? (o.type === "prescription" ? c.blue : c.green) +
                                "22"
                              : o.type === "prescription"
                                ? c.blueLight
                                : c.greenLight
                          }
                        >
                          {o.type === "prescription" ? "Ordonnance" : "Direct"}
                        </Badge>
                      </td>
                      <td
                        className="px-4 py-3 text-sm font-bold"
                        style={{ color: c.txt }}
                      >
                        {o.total} DZD
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          color={sm.color}
                          bg={dk ? sm.color + "22" : sm.bg}
                        >
                          {sm.label}
                        </Badge>
                      </td>
                      <td
                        className="px-4 py-3 text-xs"
                        style={{ color: c.txt3 }}
                      >
                        {o.created
                          ? new Date(o.created).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: GARDE-MALADES
// ─────────────────────────────────────────────────────────────────────────────
function GardeMaladesPage({ dk }) {
  const { t } = useLanguage();
  const c = getAdminTheme(dk);
  const [tab, setTab] = useState("caretakers");
  const [caretakers, setCaretakers] = useState(MOCK_CARETAKERS);
  const [requests, setRequests] = useState(MOCK_CARE_REQUESTS);
  const [search, setSearch] = useState("");
  const [reqStatus, setReqStatus] = useState("all");

  useEffect(() => {
    api
      .getAllCaretakers()
      .then((data) => {
        const l = Array.isArray(data) ? data : data?.results;
        if (l?.length > 0) setCaretakers(l);
      })
      .catch(() => {});
    api
      .getAdminCareRequests()
      .then((data) => {
        const l = Array.isArray(data) ? data : data?.results;
        if (l?.length > 0) setRequests(l);
      })
      .catch(() => {});
  }, []);

  const filteredCaretakers = caretakers.filter(
    (ct) =>
      ct.name?.toLowerCase().includes(search.toLowerCase()) ||
      ct.city?.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredRequests = requests.filter(
    (r) => reqStatus === "all" || r.status === reqStatus,
  );

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: c.txt }}>
          {t('caretakers')}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
          {caretakers.length} {t('caretakers_tab')} ·{" "}
          {caretakers.filter((ct) => ct.is_verified).length} {t('status_verified')}
        </p>
      </div>
      <div className="flex gap-2 mb-5">
        {[
          ["caretakers", t('caretakers_tab')],
          ["requests", t('demandes_tab')],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border"
            style={{
              background: tab === id ? c.blue : "transparent",
              color: tab === id ? "#fff" : c.txt2,
              borderColor: tab === id ? c.blue : c.border,
            }}
          >
            {id === "caretakers" ? (
              <Heart size={15} />
            ) : (
              <ClipboardList size={15} />
            )}
            {label}
          </button>
        ))}
      </div>

      {tab === "caretakers" ? (
        <>
          <Card dk={dk} className="mb-4" style={{ padding: "10px 14px" }}>
            <div className="flex items-center gap-2">
              <Search size={14} style={{ color: c.txt3 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search_placeholder_caretaker') || "Nom ou ville…"}
                className="outline-none text-sm bg-transparent flex-1"
                style={{ color: c.txt }}
              />
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCaretakers.map((ct) => (
              <Card key={ct.id} dk={dk} style={{ padding: 20 }}>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ background: "#7B5EA7" }}
                  >
                    {ct.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("") || "??"}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {ct.is_verified ? (
                      <Badge
                        color={c.green}
                        bg={dk ? c.green + "22" : c.greenLight}
                      >
                        {t('status_verified')}
                      </Badge>
                    ) : (
                      <Badge
                        color={c.amber}
                        bg={dk ? c.amber + "22" : c.amberLight}
                      >
                        {t('status_pending')}
                      </Badge>
                    )}
                    {ct.is_available ? (
                      <Badge color="#4A6FA5" bg={dk ? "#4A6FA522" : "#EEF3FB"}>
                        {t('available')}
                      </Badge>
                    ) : (
                      <Badge color={c.txt3} bg={c.blueLight}>
                        {t('unavailable')}
                      </Badge>
                    )}
                  </div>
                </div>
                <h3 className="text-base font-bold" style={{ color: c.txt }}>
                  {ct.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={12} style={{ color: c.txt3 }} />
                  <span className="text-xs" style={{ color: c.txt2 }}>
                    {ct.city}
                  </span>
                  {ct.rating > 0 && (
                    <>
                      <span style={{ color: c.txt3 }}>·</span>
                      <Star size={11} style={{ color: "#E8A838" }} />
                      <span
                        className="text-xs font-bold"
                        style={{ color: c.txt }}
                      >
                        {ct.rating}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs mt-1" style={{ color: c.txt3 }}>
                  {ct.experience_years} {t('years_exp_suffix') || "ans d'expérience"}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {(ct.services || []).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: dk ? "#7B5EA722" : "#F3EEFF",
                        color: "#7B5EA7",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              ["all", t('all_orders_tab')],
              ...Object.entries(CARE_STATUS).map(([k, v]) => [k, v.label]),
            ]
              .filter((v, i, a) => a.findIndex((x) => x[0] === v[0]) === i)
              .map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setReqStatus(v)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border"
                  style={{
                    background: reqStatus === v ? c.blue : "transparent",
                    color: reqStatus === v ? "#fff" : c.txt2,
                    borderColor: reqStatus === v ? c.blue : c.border,
                  }}
                >
                  {l}
                </button>
              ))}
          </div>
          <Card dk={dk} empty={true} style={{ padding: 0, overflow: "hidden" }}>
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${c.border}`,
                    background: dk ? "rgba(255,255,255,0.02)" : "#FAFBFD",
                  }}
                >
                  {[
                    t('reference_label'),
                    t('patient_label'),
                    t('caretaker_label'),
                    t('period_label'),
                    t('mission_label'),
                    t('status_label'),
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-bold uppercase tracking-wide px-4 py-3"
                      style={{ color: c.txt3 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((r) => {
                  const sm = CARE_STATUS[r.status] || CARE_STATUS.pending;
                  return (
                    <tr
                      key={r.id}
                      style={{ borderBottom: `1px solid ${c.border}` }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = dk
                          ? "rgba(255,255,255,0.02)"
                          : "#FAFBFD")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td
                        className="px-4 py-3 text-xs font-bold"
                        style={{ color: "#7B5EA7" }}
                      >
                        {r.id}
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: c.txt }}
                      >
                        {r.patient}
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: c.txt2 }}
                      >
                        {r.caretaker}
                      </td>
                      <td className="px-4 py-3">
                        <p
                          className="text-xs font-semibold"
                          style={{ color: c.txt }}
                        >
                          {r.start
                            ? new Date(r.start).toLocaleDateString("fr-FR")
                            : "—"}
                        </p>
                        <p className="text-[10px]" style={{ color: c.txt3 }}>
                          {r.end
                            ? `→ ${new Date(r.end).toLocaleDateString("fr-FR")}`
                            : "→ En cours"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p
                          className="text-xs max-w-[200px] truncate"
                          style={{ color: c.txt2 }}
                        >
                          {r.message}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          color={sm.color}
                          bg={dk ? sm.color + "22" : sm.bg}
                        >
                          {sm.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: AUDIT
// ─────────────────────────────────────────────────────────────────────────────
function AuditPage({ dk }) {
  const { t } = useLanguage();
  const c = getAdminTheme(dk);
  const [logs, setLogs] = useState(AUDIT_LOGS);
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    api
      .getAuditLogs()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.results;
        if (list?.length > 0) {
          setLogs(
            list.map((l) => ({
              id: l.id,
              action: l.message,
              user: l.actor_name || "Système",
              ip: l.ip_address || "—",
              time: new Date(l.created_at).toLocaleString("fr-FR"),
              type: l.level === "error" ? "danger" : l.level,
            })),
          );
          setUsingFallback(false);
        } else {
          setUsingFallback(true);
        }
      })
      .catch(() => {
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    typeFilter === "all" ? logs : logs.filter((l) => l.type === typeFilter);

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black" style={{ color: c.txt }}>
            {t('audit_log_title')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
            {t('audit_log_desc')}
          </p>
        </div>
        <button
          onClick={() => {
            const json = JSON.stringify(filtered, null, 2);
            const url = URL.createObjectURL(
              new Blob([json], { type: "application/json" }),
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = "audit-logs.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border"
          style={{ borderColor: c.border, color: c.txt2 }}
        >
          <Download size={14} /> {t('export_logs')}
        </button>
      </div>
      {usingFallback && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 border"
          style={{
            background: dk ? "#1E1500" : "#FFF8EC",
            borderColor: "#E8A83855",
            color: "#E8A838",
          }}
        >
          <AlertTriangle size={15} className="shrink-0" />
          <p className="text-xs font-semibold">
            {t('simulated_data_warning_logs_short') || t('simulated_data_warning')}
          </p>
        </div>
      )}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          ["all", t('all_tab'), c.txt2, c.blueLight],
          ["success", t('success_tab'), c.green, c.greenLight],
          ["warning", t('warning_tab'), c.amber, c.amberLight],
          ["danger", t('danger_tab'), c.red, c.redLight],
          ["info", t('info_tab'), c.blue, c.blueLight],
        ].map(([val, label, color, bg]) => (
          <button
            key={val}
            onClick={() => setTypeFilter(val)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all"
            style={{
              background: typeFilter === val ? bg : "transparent",
              color: typeFilter === val ? color : c.txt3,
              borderColor: typeFilter === val ? color + "44" : c.border,
            }}
          >
            {label}
            <span
              className="px-1.5 py-0.5 rounded-full text-[10px]"
              style={{ background: color + "22", color }}
            >
              {val === "all"
                ? logs.length
                : logs.filter((l) => l.type === val).length}
            </span>
          </button>
        ))}
      </div>
      <Card dk={dk} empty={true} style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div
            className="py-16 flex items-center justify-center gap-3"
            style={{ color: c.txt3 }}
          >
            <RefreshCw size={18} className="animate-spin" />
            <span className="text-sm font-semibold">{t('loading_logs')}</span>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: c.border }}>
            {filtered.map((log) => {
              const lm = LOG_COLORS[log.type] || LOG_COLORS.info;
              const LIcon = lm.icon;
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 px-5 py-4 transition-colors"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = dk
                      ? "rgba(255,255,255,0.02)"
                      : "#FAFBFD")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: dk ? lm.bgDk : lm.bg }}
                  >
                    {LIcon && <LIcon size={16} style={{ color: lm.color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: c.txt }}
                    >
                      {log.action}
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <p className="text-xs" style={{ color: c.txt2 }}>
                        👤 {log.user}
                      </p>
                      <p className="text-xs" style={{ color: c.txt3 }}>
                        🌐 {log.ip}
                      </p>
                      <p className="text-xs" style={{ color: c.txt3 }}>
                        ⏱ {log.time}
                      </p>
                    </div>
                  </div>
                  <Badge color={lm.color} bg={dk ? lm.bgDk : lm.bg}>
                    {log.type === "success"
                      ? t('success_label')
                      : log.type === "warning"
                        ? t('alert_label')
                        : log.type === "danger"
                          ? t('error_label')
                          : t('info_label')}
                  </Badge>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Shield
                  size={36}
                  className="mx-auto mb-3"
                  style={{ color: c.txt3 }}
                />
                <p style={{ color: c.txt3 }}>{t('no_logs_found')}</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: PARAMÈTRES
// ─────────────────────────────────────────────────────────────────────────────
function AdminSettingsPage({ dk, onToggleDark }) {
  const { t, lang, setLang } = useLanguage();
  const c = getAdminTheme(dk);
  const [secFields, setSecFields] = useState(() => ({
    timeout: localStorage.getItem("admin_timeout") || "30 minutes",
    maxLogin: localStorage.getItem("admin_maxLogin") || "5 essais",
    ipWhitelist: localStorage.getItem("admin_ipWhitelist") || "10.0.0.1/24",
  }));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("admin_timeout", secFields.timeout);
    localStorage.setItem("admin_maxLogin", secFields.maxLogin);
    localStorage.setItem("admin_ipWhitelist", secFields.ipWhitelist);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: c.txt }}>
          {t('admin_settings_title')}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
          {t('admin_settings_desc')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card dk={dk} style={{ padding: 20 }}>
          <p className="font-bold mb-5" style={{ color: c.txt }}>
            {t('platform_settings')}
          </p>
          <div className="space-y-4">
            {[
              { label: t('open_registration'), on: true },
              { label: t('mandatory_verification'), on: true },
              { label: t('two_fa_doctors'), on: true },
              { label: t('maintenance_mode'), on: false },
              { label: t('detailed_logs'), on: true },
              { label: t('dark_mode'), on: dk, toggle: true },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: c.border }}
              >
                <span className="text-sm" style={{ color: c.txt }}>
                  {item.label}
                </span>
                <button
                  onClick={item.toggle ? onToggleDark : undefined}
                  className="relative w-10 h-5 rounded-full transition-all"
                  style={{ background: item.on ? c.blue : c.border }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                    style={{ left: item.on ? "22px" : "2px" }}
                  />
                </button>
              </div>
            ))}

            {/* Language Selection */}
            <div className="pt-4 mt-2 border-t" style={{ borderColor: c.border }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: c.txt2 }}>
                {t('language')}
              </p>
              <div className="flex gap-2">
                {[
                  { id: 'fr', label: "Français", flag: "🇫🇷" },
                  { id: 'en', label: "English", flag: "🇬🇧" }
                ].map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border transition-all"
                    style={{
                      background: lang === l.id ? c.blue : 'transparent',
                      color: lang === l.id ? '#fff' : c.txt2,
                      borderColor: lang === l.id ? c.blue : c.border
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card dk={dk} style={{ padding: 20 }}>
          <p className="font-bold mb-5" style={{ color: c.txt }}>
            {t('security_access')}
          </p>
          <div className="space-y-4">
            {[
              { label: t('session_timeout') || "Session timeout", key: "timeout" },
              { label: t('max_login_attempts') || "Max tentatives login", key: "maxLogin" },
              { label: t('ip_whitelist_admin') || "IP whitelist admin", key: "ipWhitelist" },
            ].map((item) => (
              <div key={item.label} className="mb-3">
                <label
                  className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                  style={{ color: c.txt2 }}
                >
                  {item.label}
                </label>
                <input
                  value={secFields[item.key]}
                  onChange={(e) =>
                    setSecFields((p) => ({ ...p, [item.key]: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                  style={{
                    background: dk ? "#0A1220" : "#F8FAFC",
                    borderColor: c.border,
                    color: c.txt,
                  }}
                />
              </div>
            ))}
            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: saved ? c.green : c.blue }}
            >
              {saved ? t('changes_saved') : t('save_changes')}
            </button>
          </div>
        </Card>
        <Card dk={dk} style={{ padding: 20 }}>
          <p className="font-bold mb-4" style={{ color: c.txt }}>
            {t('platform_info')}
          </p>
          <div className="space-y-3">
            {[
              [t('version') || "Version", "MedSmart Admin v2.2.0"],
              [t('build') || "Build", "#20260328-stable"],
              [t('environment') || "Environnement", t('production_alg') || "Production · Algérie"],
              [t('db_label') || "Base de données", "PostgreSQL 16.2"],
              [t('conformity') || "Conformité", "RGPD · ISO 27001"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between py-1.5 border-b last:border-0"
                style={{ borderColor: c.border }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: c.txt3 }}
                >
                  {k}
                </span>
                <span className="text-xs font-bold" style={{ color: c.txt2 }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN SHELL  ──  Layout : Sidebar + Main content
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard({ onLogout }) {
  const { userData } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const dk = theme === "dark";
  const [activePage, setActivePage] = useState("overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const c = getAdminTheme(dk);

  const handleNav = useCallback((page) => {
    setActivePage(page);
    setMobileMenu(false);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <OverviewPage dk={dk} onNav={handleNav} />;
      case "validation":
        return <ValidationPage dk={dk} onCountChange={setPendingCount} />;
      case "utilisateurs":
        return <UtilisateursPage dk={dk} />;
      case "rendezvous":
        return <RendezVousPage dk={dk} />;
      case "medicaments":
        return <MedicamentsPage dk={dk} />;
      case "pharmacies":
        return <PharmaciesPage dk={dk} />;
      case "gardemalades":
        return <GardeMaladesPage dk={dk} />;
      case "audit":
        return <AuditPage dk={dk} />;
      case "parametres":
        return (
          <AdminSettingsPage dk={dk} onToggleDark={toggleTheme} />
        );
      // ── Gestion des Comptes ──
      case "patients":
        return <PatientsView dk={dk} />;
      case "doctors":
        return <DoctorsView dk={dk} />;
      case "caretakers":
        return <CaretakersView dk={dk} />;
      case "pharmacists":
        return <PharmacistsView dk={dk} />;
      case "reports":
        return <ReportsView dk={dk} />;

      // ── Activité (Planning & Queue) ──
      case "rdv":
      case "planning":
        return <ScheduleView dk={dk} />;
      case "queue":
        return <VisitQueueView dk={dk} />;

      default:
        return <OverviewPage dk={dk} onNav={handleNav} />;
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
      {/* ── Subtle background particles ── */}
      <ParticlesHero darkMode={dk} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { transition: background-color 0.2s, border-color 0.2s; }
        button, select, label, a { cursor: pointer !important; }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(90,135,197,0.3); border-radius: 4px; }
      `}</style>

      {/* ── Sidebar ── */}
      <AdminSidebar
        dk={dk}
        activePage={activePage}
        onNav={handleNav}
        onLogout={onLogout}
        userData={userData}
        pendingCount={pendingCount}
        mobileOpen={mobileMenu}
        onCloseMobile={() => setMobileMenu(false)}
      />

      {/* ── Main content (offset by sidebar width on desktop) ── */}
      <div className="lg:ml-64 relative z-10">
        {/* ── Top bar ── */}
        <header
          className="sticky top-0 z-20 border-b px-6 h-14 flex items-center gap-4"
          style={{
            background: c.nav,
            borderColor: c.border,
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Mobile hamburger */}
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg"
            onClick={() => setMobileMenu(true)}
            style={{ color: c.txt2 }}
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 flex-1">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: c.txt3 }}
            >
              Admin
            </span>
            <span style={{ color: c.border }}>/</span>
            <span
              className="text-sm font-semibold capitalize"
              style={{ color: c.txt }}
            >
              {{
                overview: t('overview'),
                validation: t('validation'),
                utilisateurs: t('all_users'),
                rendezvous: t('rendezvous'),
                medicaments: t('medicines'),
                pharmacies: t('pharmacies'),
                gardemalades: t('caretakers'),
                audit: t('audit'),
                parametres: t('settings'),
                patients: t('patients'),
                doctors: t('doctors'),
                caretakers: t('caretakers'),
                pharmacists: t('pharmacists'),
                planning: t('planning'),
                rdv: t('rendezvous'),
                queue: t('queue'),
                reports: t('reports'),
              }[activePage] ?? activePage}
            </span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-xl border transition-all hover:opacity-80"
            title={t('toggle_theme')}
            style={{ borderColor: c.border, color: c.txt2 }}
          >
            {dk ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </header>

        {/* ── Page content ── */}
        <main className="px-6 py-6">
          <ErrorBoundary>{renderPage()}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
