import { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import ErrorBoundary from "../../components/ErrorBoundary";
import DashSelect from "../../components/ui/DashSelect";
import { ParticlesHero } from "../../components/backgrounds/MedParticles";
import { T } from "../_shared/theme";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import * as api from "../../services/api";
import ChatButton from "../../components/chat/ChatButton";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";
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
  ArrowRight,
  Maximize2,
  MessageSquare,
  ExternalLink,
  Mic,
  Paperclip,
} from "lucide-react";


// ─── Card component ───────────────────────────────────────────────────────────
function Card({ children, className = "", style = {}, dk, empty = false }) {
  const hoverClasses = empty ? "" : "card-hover";
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border ${hoverClasses} ${className}`}
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


// ─── Modal : Transmettre ordonnance à une pharmacie ───────────────────────────

function SendToPharmacyModal({ rx, onClose, onConfirm, dk }) {
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [notes, setNotes] = useState("");
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    api.getAllPharmacies().then(data => {
      if (Array.isArray(data)) setPharmacies(data.map(p => p.name || p.pharm_name));
    }).catch(() => {});
  }, []);

  const handleConfirm = () => {
    if (!selectedPharmacy) return;
    onConfirm({ pharmacy: selectedPharmacy, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}>
      <div className="rounded-2xl p-6 w-full max-w-md shadow-2xl border"
        style={{ background: c.card, borderColor: c.border, paddingBottom: "128px" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: c.blue + "18" }}>
              <Send size={18} style={{ color: c.blue }} />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: c.txt }}>{t('send_to_pharmacy_title') || "Transmettre l'ordonnance"}</h3>
              <p className="text-xs" style={{ color: c.txt3 }}>{rx.id}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors hover:opacity-70"
            style={{ borderColor: c.border, color: c.txt3 }}>
            <X size={15} />
          </button>
        </div>

        {/* Résumé ordonnance */}
        <div className="p-3 rounded-xl mb-4 border"
          style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>
            {t('prescribed_by_prefix') || "Prescrit par"} {rx.doctor}
          </p>
          <div className="space-y-0.5 mt-1">
            {rx.meds.map((m, i) => (
              <p key={i} className="text-xs" style={{ color: c.txt2 }}>• {m}</p>
            ))}
          </div>
        </div>

        {/* Choix pharmacie */}
        <div className="mb-4">
          <DashSelect
            label={t('choose_pharmacy_label') || "Choisir une pharmacie"}
            value={selectedPharmacy}
            options={pharmacies.length > 0 ? pharmacies : ["Chargement..."]}
            onSelect={setSelectedPharmacy}
            dk={dk} c={c}
            placeholder={t('select_pharmacy_placeholder') || "Sélectionner une pharmacie..."}
          />
        </div>

        {/* Notes */}
        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt2 }}>
            {t('pharmacist_notes_label') || "Notes pour le pharmacien"}{" "}
            <span className="font-normal normal-case" style={{ color: c.txt3 }}>({t('optional_label') || "Optionnel"})</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder={t('pharmacist_notes_placeholder') || "Ex: allergie connue à la pénicilline, prendre avec de la nourriture..."}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none border resize-none"
            style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: c.border, color: c.txt }}
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: c.border, color: c.txt2 }}>
            {t('cancel_btn') || "Annuler"}
          </button>
          <button onClick={handleConfirm} disabled={!selectedPharmacy}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: selectedPharmacy ? c.blue : c.txt3 }}>
            <Send size={14} /> {t('confirm_send_btn') || "Confirmer l'envoi"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tracker Click & Collect ──────────────────────────────────────────────────
function ClickCollectTracker({ ccStatus, pharmacy, dk }) {
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const steps = [
    { key: "sent",      label: t('sent_step')      || "Envoyé",           icon: Send          },
    { key: "preparing", label: t('preparing_step') || "En préparation",    icon: Clock         },
    { key: "ready",     label: t('ready_step')     || "Prêt pour retrait", icon: CheckCircle   },
  ];
  const currentIdx = steps.findIndex(s => s.key === ccStatus);

  return (
    <div className="mt-4 pt-4 border-t" style={{ borderColor: c.border }}>
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag size={13} style={{ color: c.blue }} />
        <p className="text-xs font-bold" style={{ color: c.txt }}>{pharmacy}</p>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-auto"
          style={{ background: c.blue + "18", color: c.blue }}>
          Click & Collect
        </span>
      </div>

      {/* Steps */}
      <div className="flex items-start">
        {steps.map((step, i) => {
          const done   = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 min-w-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: done ? c.blue : dk ? "#1E2A3A" : "#E4EAF5",
                    boxShadow: active ? `0 0 0 3px ${c.blue}33` : "none",
                  }}>
                  <step.icon size={14} style={{ color: done ? "#fff" : c.txt3 }} />
                </div>
                <p className="text-[10px] font-semibold text-center leading-tight px-0.5"
                  style={{ color: done ? c.blue : c.txt3 }}>
                  {step.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all"
                  style={{ background: i < currentIdx ? c.blue : dk ? "#1E2A3A" : "#E4EAF5" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Empty State component ───────────────────────────────────────────────────
function EmptyState({
  dk,
  icon: Icon = FileText,
  title,
  message,
  compact = false,
}) {
  const c = dk ? T.dark : T.light;
  return (
    <Card
      dk={dk}
      empty={true}
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
  const { t } = useLanguage();
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
                {t('emergency_title') || "Emergency Alert"}
              </h3>
              <p className="text-xs" style={{ color: c.txt2 }}>
                {t('emergency_desc') || "Contacts will be notified immediately"}
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
            {t('emergency_warning') || "This will alert your emergency contacts and share your GPS location with nearby medical services."}
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
            <Phone size={16} /> {t('call_samu_btn') || "Call 15 (SAMU) Now"}
          </button>
          <button
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            style={{
              background: "rgba(224,85,85,0.1)",
              color: "#E05555",
              border: "1px solid rgba(224,85,85,0.2)",
            }}
          >
            <MapPin size={15} /> {t('share_location_btn') || "Share My Location"}
          </button>
          <button
            className="w-full py-3 rounded-xl font-semibold transition-colors"
            style={{
              background: "rgba(224,85,85,0.06)",
              color: "#E05555",
              border: "1px solid rgba(224,85,85,0.15)",
            }}
          >
            {t('notify_contacts_btn') || "Notify Emergency Contact"}
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
          {t('im_fine_btn') || "Cancel — I'm fine"}
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
  const { t } = useLanguage();
  const [meds, setMeds] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [docs, setDocs] = useState([]);
  const [symptom, setSymptom] = useState("");
  const [emergency, setEmergency] = useState(false);
  const c = dk ? T.dark : T.light;

  useEffect(() => {
    const handleList = (res) => Array.isArray(res) ? res : (res?.results || []);

    // Fetch medications/treatments
    api.getTreatments().then(res => {
      const list = handleList(res);
      setMeds(list.map(t => ({
        id: t.id,
        name: t.drug_name || t.medication_name || "Médicament",
        time: t.dosage || t.frequency || "1 fois par jour",
        taken: false
      })));
    }).catch(() => {});

    // Fetch recent prescriptions
    api.getMyPrescriptions().then(res => {
      const list = handleList(res);
      setPrescriptions(list.slice(0, 2));
    }).catch(() => {});

    // Fetch recent documents
    api.getLabResults().then(res => {
      const list = handleList(res);
      setDocs(list.slice(0, 3));
    }).catch(() => {});
  }, []);

  const firstName = userData?.first_name || userData?.email?.split('@')[0] || "Guest";
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
            {t('welcome_back_prefix') || "Bonjour"}, <span style={{ color: c.blue }}>{firstName}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setEmergency(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5 shadow-lg cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #E05555, #c93535)",
              color: "#fff",
            }}
          >
            <AlertTriangle size={15} />
            {t('emergency_label') || "URGENCE"}
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
            {t('ai_symptom_title') || "Analyse de symptômes IA"}
          </h2>
        </div>
        <p className="text-white/75 text-sm mb-4 relative z-10 max-w-md">
          {t('ai_symptom_desc') || "Décrivez vos symptômes pour obtenir un avis orienter par notre intelligence médicale."}
        </p>
        <div className="flex gap-3 relative z-10 flex-wrap sm:flex-nowrap">
          <input
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder={t('symptom_placeholder') || "Ex: Maux de tête légers et fatigue..."}
            className="flex-1 px-4 py-3 rounded-xl outline-none text-sm min-w-[200px]"
            style={{ background: "rgba(255,255,255,0.92)", color: "#0D1B2E" }}
          />
          <button
            onClick={() => onNav("ai-diagnosis")}
            className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:shadow-lg hover:brightness-110 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
            style={{ background: "#ffffff", color: "#304B71" }}
          >
            {t('analyze_btn') || "Analyser"}
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Prochains RDV */}
            <Card dk={dk} empty={true}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base" style={{ color: c.txt }}>
                    {t('upcoming_appointments') || "Prochains RDV"}
                  </h3>
                  {upcomingAppts.length > 0 && (
                    <Badge color={c.blue} bg={`${c.blue}11`}>
                      {upcomingAppts.length} {t('active_label') || "actifs"}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => onNav("appointments")}
                  className="text-sm font-semibold hover:underline hover:opacity-80 transition-all duration-200 cursor-pointer"
                  style={{ color: c.blue }}
                >
                  {t('view_all_btn') || "View All"}
                </button>
              </div>
              <div className="space-y-4">
                {upcomingAppts.length === 0 ? (
                  <EmptyState
                    dk={dk}
                    icon={Calendar}
                    title={t('no_appointments_title') || "Aucun rendez-vous"}
                    message={t('no_appointments_desc') || "Vous n'avez pas de consultations prévues pour le moment."}
                  />
                ) : (
                  upcomingAppts.slice(0, 2).map((a) => (
                    <div
                      key={a.id}
                      onClick={() => onNav("appointments")}
                      className="group flex items-center gap-4 p-3 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:bg-blue-50/40 dark:hover:bg-white/5 active:scale-[0.99] active:shadow-sm cursor-pointer"
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
            <Card dk={dk} empty={true}>
              <h3 className="font-semibold mb-4" style={{ color: c.txt }}>
                {t('medication_reminders_title') || "Medication Reminders"}
              </h3>
              <div className="space-y-4">
                {meds.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 cursor-pointer card-hover"
                  >
                    <button
                      onClick={() =>
                        setMeds((ms) =>
                          ms.map((x) =>
                            x.id === m.id ? { ...x, taken: !x.taken } : x,
                          ),
                        )
                      }
                      className="shrink-0 transition-transform duration-200 hover:scale-110 cursor-pointer"
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
            <Card dk={dk} empty={true}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: c.txt }}>
                  Recent Medical Documents
                </h3>
                <button
                  onClick={() => onNav("medical-profile")}
                  className="text-sm font-semibold hover:underline hover:opacity-80 transition-all duration-200 cursor-pointer"
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
                  {docs.map((d) => (
                    <tr
                      key={d.id}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-white/5 active:scale-[0.99] transition-all duration-200"
                      style={{ borderBottom: `1px solid ${c.border}` }}
                    >
                      <td className="py-3 text-sm" style={{ color: c.txt }}>
                        {d.test_name || d.name}
                      </td>
                      <td
                        className="py-3 text-sm text-right"
                        style={{ color: c.txt2 }}
                      >
                        {d.date || d.created_at?.split('T')[0]}
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
                className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer card-hover flex-1"
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
                className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer card-hover flex-1"
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
          <Card dk={dk} empty={true}>
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
                    className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] active:shadow-sm"
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
                className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:brightness-110 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
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
                  className="w-full mt-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 hover:shadow-sm border cursor-pointer"
                  style={{ borderColor: c.border, color: c.txt2 }}
                >
                  Gérer les notifications
                </button>
              )}
          </Card>
          <Card dk={dk} empty={true}>
            <h3 className="font-semibold mb-5" style={{ color: c.txt }}>
              Prescription Status
            </h3>
            <div className="space-y-5">
              {prescriptions.map((p) => (
                <div
                  key={p.id}
                  className="cursor-pointer card-hover"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: c.txt }}
                    >
                      Prescription #{p.id.substring(0, 8)}
                    </p>
                    <Badge color={p.status === 'ACTIVE' ? c.green : c.red} bg={(p.status === 'ACTIVE' ? c.green : c.red) + "18"}>
                      {p.status}
                    </Badge>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: c.blueLight }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `100%`, background: p.status === 'ACTIVE' ? c.green : c.red }}
                    />
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: c.txt3 }}>
                    Issued by {p.doctor_name || "Doctor"} · {p.date || p.created_at?.split('T')[0]}
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
function MedicalProfilePage({ dk, profile, userId, userData }) {
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;

  const handleDownloadPDF = async (rxId) => {
    if (!rxId) return;
    const idStr = String(rxId);
    try {
      const blob = await api.apiFetchBlob(`/prescriptions/${idStr}/pdf-download/`);
      if (blob.type === "application/json") {
        const text = await blob.text();
        const errData = JSON.parse(text);
        throw new Error(errData.detail || "Erreur serveur");
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `ordonnance-${idStr.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Erreur PDF:", err);
      setStatus({ type: "error", msg: `Erreur de téléchargement : ${err.message}` });
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    }
  };

  const handleViewQR = async (rxId) => {
    if (!rxId) return;
    const idStr = String(rxId);
    try {
      const blob = await api.apiFetchBlob(`/prescriptions/${idStr}/qr-image/`);
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Erreur QR:", err);
      setStatus({ type: "error", msg: "Impossible d'afficher le QR Code." });
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    }
  };

  const [tab, setTab] = useState("antecedents");
  const [data, setData] = useState({
    antecedents: [],
    treatments: [],
    diagnostics: [],
    prescriptions: [],
    analyses: [],
    "symptom-history": [],
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" });
  const loadedTabs = useRef(new Set());

  const FETCH_TABS = {
    antecedents: true,
    treatments: true,
    analyses: true,
    diagnostics: true,
    prescriptions: true,
    "symptom-history": true,
  };

  const TAB_LABELS = {
    antecedents: "Antécédents",
    diagnostics: "Diagnostics",
    prescriptions: "Prescriptions",
    analyses: "Analyses",
    treatments: "Traitements",
    "symptom-history": "Symptômes IA",
  };

  useEffect(() => {
    if (!FETCH_TABS[tab]) return;
    if (loadedTabs.current.has(tab)) return;
    async function fetchTabData() {
      setLoading(true);
      try {
        if (tab === "antecedents") {
          const res = await api.getAntecedents().catch(() => []);
          const list = Array.isArray(res) ? res : (res?.results || []);
          setData((d) => ({ ...d, antecedents: list }));
        } else if (tab === "treatments") {
          const res = await api.getTreatments().catch(() => []);
          const list = Array.isArray(res) ? res : (res?.results || []);
          setData((d) => ({ ...d, treatments: list }));
        } else if (tab === "analyses") {
          const res = await api.getLabResults().catch(() => []);
          const list = Array.isArray(res) ? res : (res?.results || []);
          setData((d) => ({ ...d, analyses: list }));
        } else if (tab === "diagnostics") {
          const res = await api.getMyConsultations().catch(() => []);
          const list = Array.isArray(res) ? res : (res?.results || []);
          const diags = list.filter((c) => c.status === "completed" && c.diagnosis);
          setData((d) => ({ ...d, diagnostics: diags }));
        } else if (tab === "prescriptions") {
          const res = await api.getMyPrescriptions().catch(() => []);
          const list = Array.isArray(res) ? res : (res?.results || []);
          setData((d) => ({ ...d, prescriptions: list }));
        } else if (tab === "symptom-history") {
          const res = await api.getSymptomHistory().catch(() => []);
          const list = Array.isArray(res) ? res : (res?.results || []);
          setData((d) => ({ ...d, "symptom-history": list }));
        }
      } catch (_) {}
      loadedTabs.current.add(tab);
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
    "symptom-history",
  ];
  const safeProfile = profile || {};

  // Liste d'options alignée avec la spec (Inconnu = absence côté UI)
  const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Inconnu"];

  // Convertit une ISO (YYYY-MM-DD) → affichage JJ/MM/AAAA dans l'input.
  const isoToFr = (iso) => {
    if (!iso) return "";
    const s = String(iso);
    if (s.includes("/")) return s.length > 10 ? s.slice(0, 10) : s;
    const parts = s.split("-");
    if (parts.length !== 3) return "";
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };
  // Convertit JJ/MM/AAAA → ISO YYYY-MM-DD (ou "" si invalide).
  const frToIso = (fr) => {
    if (!fr) return "";
    const parts = String(fr).split("/");
    if (parts.length !== 3 || parts[2].length !== 4) return "";
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  };
  // Masque JJ/MM/AAAA pour l'input texte.
  const maskDob = (raw) => {
    let v = String(raw || "").replace(/\D/g, "").slice(0, 8);
    if (v.length > 4) return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    if (v.length > 2) return `${v.slice(0, 2)}/${v.slice(2)}`;
    return v;
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // Normalise : "Inconnu" = pas de groupe sanguin côté backend (choices stricts).
      const payload = { ...editForm };
      if (payload.blood_type === "Inconnu") payload.blood_type = "";
      // Convertit la DOB si saisie en JJ/MM/AAAA
      if (payload.dob && String(payload.dob).includes("/")) {
        const iso = frToIso(payload.dob);
        if (iso) payload.dob = iso;
      }
      // Allergies : string → array si backend attend une liste
      if (typeof payload.allergies === "string") {
        payload.allergies = payload.allergies
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);
      }
      await api.updateMedicalProfile(payload);
      setStatus({ type: "success", msg: "Profil mis à jour" });
      setEditMode(false);
      setTimeout(() => setStatus({ type: "", msg: "" }), 4000);
    } catch (err) {
      setStatus({ type: "error", msg: err?.message || "Erreur lors de la mise à jour" });
      setTimeout(() => setStatus({ type: "", msg: "" }), 5000);
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
                {/* Prénom */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>Prénom</label>
                  <input type="text"
                    value={editForm.first_name ?? userData?.first_name ?? safeProfile.first_name ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all"
                    style={{ background: c.card, borderColor: c.border, color: c.txt }}
                  />
                </div>
                {/* Nom */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>Nom</label>
                  <input type="text"
                    value={editForm.last_name ?? userData?.last_name ?? safeProfile.last_name ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all"
                    style={{ background: c.card, borderColor: c.border, color: c.txt }}
                  />
                </div>

                {/* Date de naissance — JJ/MM/AAAA */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>Date de naissance</label>
                  <input type="text" inputMode="numeric" placeholder="JJ/MM/AAAA" maxLength={10}
                    value={maskDob(editForm.dob ?? isoToFr(safeProfile.dob) ?? "")}
                    onChange={(e) => setEditForm({ ...editForm, dob: maskDob(e.target.value) })}
                    className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all"
                    style={{ background: c.card, borderColor: c.border, color: c.txt }}
                  />
                </div>

                {/* Sexe */}
                <div>
                  <DashSelect
                    label="Sexe"
                    value={editForm.sex ?? safeProfile.sex ?? userData?.sex ?? ""}
                    options={[
                      { value: "", label: "Non spécifié" },
                      { value: "M", label: "Masculin" },
                      { value: "F", label: "Féminin" },
                    ]}
                    onSelect={(v) => setEditForm({ ...editForm, sex: v })}
                    dk={dk}
                    c={c}
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>Téléphone</label>
                  <input type="tel" inputMode="tel" maxLength={15}
                    value={editForm.phone ?? userData?.phone ?? safeProfile.phone ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value.replace(/[^\d+ ]/g, "") })}
                    className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all"
                    style={{ background: c.card, borderColor: c.border, color: c.txt }}
                  />
                </div>

                {/* Groupe sanguin — select conforme à la spec */}
                <div>
                  <DashSelect
                    label="Groupe sanguin"
                    value={editForm.blood_type ?? safeProfile.blood_type ?? ""}
                    options={[
                      { value: "", label: "Non spécifié" },
                      ...BLOOD_GROUPS.map((g) => ({ value: g, label: g })),
                    ]}
                    onSelect={(v) => setEditForm({ ...editForm, blood_type: v })}
                    dk={dk}
                    c={c}
                  />
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>Ville</label>
                  <input type="text"
                    value={editForm.city ?? safeProfile.city ?? userData?.city ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all"
                    style={{ background: c.card, borderColor: c.border, color: c.txt }}
                  />
                </div>

                {/* Wilaya */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>Wilaya</label>
                  <input type="text"
                    value={editForm.wilaya ?? safeProfile.wilaya ?? userData?.wilaya ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, wilaya: e.target.value })}
                    className="px-3 py-2 border rounded-xl text-sm w-full outline-none transition-all"
                    style={{ background: c.card, borderColor: c.border, color: c.txt }}
                  />
                </div>

                {/* Allergies */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.txt3 }}>Allergies (séparées par des virgules)</label>
                  <input type="text" placeholder="Ex: Pénicilline, Aspirine"
                    value={editForm.allergies ?? (Array.isArray(safeProfile.allergies) ? safeProfile.allergies.join(", ") : (safeProfile.allergies || ""))}
                    onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                    className="px-3 py-2 border rounded-xl text-sm w-full outline-none"
                    style={{ background: c.card, borderColor: c.border, color: c.txt }} />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold" style={{ color: c.txt }}>
                  {userData?.first_name || userData?.email?.split('@')[0] || safeProfile.first_name || ""}{" "}
                  {userData?.last_name || safeProfile.last_name || safeProfile.name || "Mon Profil Médical"}
                </h2>
                <p className="text-sm mt-1 mb-3" style={{ color: c.txt2 }}>
                  ID Patient: #{userId || "---"}
                  {safeProfile.dob && ` · Né(e) le : ${safeProfile.dob}`}
                  {(safeProfile.sex || userData?.sex) && ` · ${(safeProfile.sex || userData?.sex) === "M" ? "Homme" : "Femme"}`}
                  {safeProfile.city && ` · ${safeProfile.city}${safeProfile.wilaya ? `, ${safeProfile.wilaya}` : ""}`}
                  {(userData?.phone || safeProfile.phone) && ` · 📞 ${userData?.phone || safeProfile.phone}`}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: c.red + "18",
                      color: c.red,
                      border: `1px solid ${c.red}40`,
                    }}
                  >
                    Groupe Sanguin: {safeProfile.blood_type || "Non spécifié"}
                  </span>
                  {(Array.isArray(safeProfile.allergies) ? safeProfile.allergies : (typeof safeProfile.allergies === 'string' ? safeProfile.allergies.split(",") : []))
                    .filter((v) => v.trim())
                    .map((a, i) => (
                      <span
                        key={i}
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          background: c.red + "15",
                          color: c.red,
                          border: `1px solid ${c.red}30`,
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
                Modifier le profil
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
            className="px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all"
            style={{
              color: tab === t ? c.blue : c.txt2,
              borderBottom:
                tab === t ? `2px solid ${c.blue}` : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {TAB_LABELS[t] || t}
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
          {tab === "diagnostics" && (
            <div className="space-y-4">
              {data.diagnostics.length === 0 ? (
                <EmptyState
                  dk={dk}
                  icon={FileText}
                  title="Aucun diagnostic enregistré"
                  message="Vos diagnostics apparaîtront ici suite à vos consultations avec un spécialiste."
                />
              ) : (
                data.diagnostics.map((item, i) => (
                  <Card key={item.id || i} dk={dk}>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold" style={{ color: c.txt }}>{item.diagnosis}</p>
                        <p className="text-xs mt-1" style={{ color: c.txt2 }}>
                          Dr. {item.doctor_name || "—"} · {item.consulted_at ? new Date(item.consulted_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </p>
                        {item.chief_complaint && (
                          <p className="text-xs mt-2 italic" style={{ color: c.txt3 }}>Motif : {item.chief_complaint}</p>
                        )}
                      </div>
                      <Badge color={c.blue} bg={c.blue + "18"}>Terminée</Badge>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {tab === "prescriptions" && (
            <div className="space-y-4">
              {data.prescriptions.length === 0 ? (
                <EmptyState
                  dk={dk}
                  icon={FileText}
                  title="Aucune prescription enregistrée"
                  message="Vos ordonnances apparaîtront ici suite à vos consultations."
                />
              ) : (
                data.prescriptions.map((rx, i) => {
                  const API_ORIGIN = "http://127.0.0.1:8000";
                  const qrUrl = rx.id ? `${API_ORIGIN}/api/prescriptions/${rx.id}/qr-image/` : null;
                  const pdfUrl = rx.id ? `${API_ORIGIN}/api/prescriptions/${rx.id}/pdf-download/` : null;
                  const rxDate = rx.created_at
                    ? new Date(rx.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
                    : "—";
                  return (
                    <Card key={rx.id || i} dk={dk}>
                      {/* Header */}
                      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                        <div>
                          <p className="font-bold text-sm" style={{ color: c.txt }}>
                            Ordonnance du {rxDate}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: c.txt2 }}>
                            Dr. {rx.doctor_name || "—"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge color={rx.status === "active" ? c.green : c.txt3} bg={(rx.status === "active" ? c.green : c.txt3) + "18"}>
                            {rx.status === "active" ? "Active" : rx.status || "—"}
                          </Badge>
                        </div>
                      </div>
                      {/* Items */}
                      {Array.isArray(rx.items) && rx.items.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {rx.items.map((it, j) => (
                            <div key={j} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: c.blueLight }}>
                              <Pill size={14} style={{ color: c.blue, flexShrink: 0 }} />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-semibold" style={{ color: c.txt }}>{it.drug_name}</span>
                                {(it.dosage || it.frequency || it.duration) && (
                                  <span className="text-xs ml-1" style={{ color: c.txt3 }}>
                                    {[it.dosage, it.frequency, it.duration].filter(Boolean).join(" · ")}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* QR + PDF actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {qrUrl && rx.qr_token && (
                          <button
                            onClick={() => handleViewQR(rx.id)}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-opacity hover:opacity-75"
                            style={{ color: c.blue, borderColor: c.border, background: "transparent" }}
                          >
                            <QrCode size={13} />
                            QR Code
                          </button>
                        )}
                        {pdfUrl && (
                          <button
                            onClick={() => handleDownloadPDF(rx.id)}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-opacity hover:opacity-75"
                            style={{ color: c.txt2, borderColor: c.border, background: "transparent" }}
                          >
                            <Download size={13} />
                            PDF
                          </button>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {tab === "symptom-history" && (
            <div className="space-y-4">
              {data["symptom-history"].length === 0 ? (
                <EmptyState
                  dk={dk}
                  icon={Activity}
                  title="Aucun historique de symptômes"
                  message="Vos analyses de symptômes IA apparaîtront ici après utilisation du module de diagnostic."
                />
              ) : (
                data["symptom-history"].map((item, i) => (
                  <Card key={item.id || i} dk={dk}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold" style={{ color: c.txt }}>
                          {item.title || item.symptoms || "Analyse de symptômes"}
                        </p>
                        <p className="text-xs mt-1" style={{ color: c.txt2 }}>
                          {item.date || item.created_at || "—"}
                        </p>
                        {item.result && (
                          <p className="text-xs mt-2" style={{ color: c.txt3 }}>{item.result}</p>
                        )}
                      </div>
                      <Badge color={c.purple} bg={c.purple + "18"}>IA</Badge>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

// ─── AI DIAGNOSIS PAGE ────────────────────────────────────────────────────────
const HISTORY_SESSIONS = [
  { id: 1, title: "Douleurs thoraciques", date: "Aujourd'hui · 2h" },
  { id: 2, title: "Maux de tête persistants", date: "Hier · 5 échanges" },
  { id: 3, title: "Fatigue intense & vertiges", date: "Hier · 4 échanges" },
  { id: 4, title: "Douleur poitrine + bras", date: "18 Mar · 2 échanges" },
];

function AIDiagnosisPage({ dk, firstName, setPage }) {
  const { t } = useLanguage();
  
  const theme = useMemo(() => ({
    bg: dk ? "#0d1117" : "#f6f8fa",
    chatBg: dk ? "#161b22" : "#ffffff",
    accent: dk ? "#3b82f6" : "#2563eb",
    text: dk ? "#e6edf3" : "#0d1117",
    aiMsgBg: dk ? "#161b22" : "#f8fafc",
    border: dk ? "#30363d" : "#d0d7de",
    cardUrgency: dk ? "rgba(239, 68, 68, 0.15)" : "#FEF2F2",
    textUrgency: dk ? "#F87171" : "#B91C1C",
    cardSpec: dk ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF",
    textSpec: dk ? "#60A5FA" : "#1D4ED8",
    cardRDV: dk ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5",
    textRDV: dk ? "#34D399" : "#059669",
  }), [dk]);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Nouvelle session. Décrivez vos symptômes en détail — localisation, intensité, durée — et je vous fournirai une analyse immédiate.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const quickSymptoms = ["Maux de tête", "Fièvre", "Fatigue", "Douleur thoracique", "Nausées", "Toux"];

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg && attachedFiles.length === 0) return;
    
    const userMsg = { 
      role: "user", 
      text: msg || `📎 ${attachedFiles.length} fichier(s)`, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setAttachedFiles([]);
    setLoading(true);

    try {
      // Préparation de l'historique pour le backend
      const history = messages
        .filter(m => m.role !== "ai" || !m.text.includes("Nouvelle session"))
        .map(m => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text
        }));

      let aiResponseText = "";
      let metaData = null;

      // Ajoute un message IA vide qui sera rempli par le stream
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true
        }
      ]);

      await api.analyzeSymptomsStream(
        { symptoms: msg, lang: "fr", history },
        (chunk) => {
          aiResponseText += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            const updated = { ...last, text: aiResponseText };
            return [...prev.slice(0, -1), updated];
          });
        },
        (meta) => {
          metaData = meta;
        }
      );

      // Une fois le stream terminé, on applique les métadonnées (urgence, diagnostic, etc.)
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        
        // Conversion des données du backend vers le format attendu par le frontend
        const result = metaData ? {
          urgency: metaData.urgency === "urgent" ? "Urgence Élevée" : 
                   metaData.urgency === "modéré" ? "Urgence modérée" : "Faible priorité",
          color: metaData.urgency === "urgent" ? "#ef4444" : 
                 metaData.urgency === "modéré" ? "#2563eb" : "#10b981",
          diagnosis: metaData.diseases?.[0]?.name_fr || "Analyse terminée",
          confidence: Math.round((metaData.diseases?.[0]?.confidence || 0.8) * 100),
          body: aiResponseText,
          tags: metaData.diseases?.[0]?.key_symptoms?.split(",").map(s => s.trim()) || [],
          advice: [
            { 
              icon: metaData.urgency === "urgent" ? "⚠️" : "🚨", 
              text: `Urgence : ${metaData.urgency === "urgent" ? "Haute" : metaData.urgency === "modéré" ? "Modérée" : "Faible"}`, 
              type: "urgency" 
            },
            { 
              icon: "👨‍⚕️", 
              text: `Spécialiste : ${metaData.specialist?.specialty_fr || "Généraliste"}`, 
              type: "spec" 
            },
            { icon: "📅", text: "Prendre RDV", type: "rdv" }
          ]
        } : null;

        return [...prev.slice(0, -1), { ...last, result, isStreaming: false }];
      });

    } catch (err) {
      console.error("AI Error:", err);
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Désolé, une erreur est survenue lors de l'analyse. Veuillez réessayer." }
      ]);
    } finally {
      setLoading(false);
    }
  };


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInput("J'ai des douleurs thoraciques et de la fatigue");
      }, 2000);
    }
  };

  const TypewriterText = useMemo(() => ({ text, isLast }) => {
    const [displayedText, setDisplayedText] = useState(isLast ? "" : text);
    useEffect(() => {
      if (isLast) {
        let i = 0;
        const interval = setInterval(() => {
          setDisplayedText(text.substring(0, i));
          i++;
          if (i > text.length) clearInterval(interval);
        }, 10);
        return () => clearInterval(interval);
      } else {
        setDisplayedText(text);
      }
    }, [text, isLast]);
    return <span>{displayedText}</span>;
  }, []);

  return (
    <div className="relative flex flex-col h-[calc(100vh-60px)]" style={{ color: theme.text, fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .ai-border-left { border-left: 3px solid #2563eb; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        .card-hover { transition: transform 280ms ease, box-shadow 280ms ease, border-color 280ms ease; }
        .card-hover:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 16px 44px rgba(57,88,134,0.15); 
          border-color: #B1C9EF !important;
          background: #ffffff !important;
          color: #2563eb !important;
        }
      `}</style>

      {/* TOP RIGHT FIXED BUTTONS */}
      <div className="absolute top-2 right-4 z-20 flex items-center gap-2">
        <button 
          onClick={() => setShowFullHistory(true)}
          className="card-hover px-3 py-1.5 text-[11px] font-bold rounded-lg border bg-transparent backdrop-blur-md shadow-sm"
          style={{ borderColor: theme.border, color: theme.text }}>
          Historique
        </button>
        <button 
          onClick={() => setMessages([{ role: "ai", text: "Nouvelle session. Décrivez vos symptômes en détail — localisation, intensité, durée — et je vous fournirai une analyse immédiate." }])}
          className="card-hover px-3 py-1.5 text-[11px] font-bold rounded-lg border bg-transparent backdrop-blur-md shadow-sm"
          style={{ borderColor: theme.border, color: theme.text }}>
          New Chat
        </button>
      </div>



      <div className="flex-1 overflow-y-auto px-4 pt-10 pb-4">
        <div className="max-w-[800px] mx-auto space-y-12">
          {messages.map((m, i) => {
            const isLast = i === messages.length - 1 && m.role === "ai" && !loading;
            return (
              <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`flex gap-4 w-full ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {m.role === "ai" && (
                    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-1" 
                         style={{ background: "linear-gradient(135deg, #2563eb, #10b981)" }}>
                      <Brain size={14} className="text-white" />
                    </div>
                  )}
                  
                  <div className={`flex flex-col gap-1 ${m.role === "user" ? "max-w-[85%]" : "flex-1"}`}>
                    <div className={`${m.role === "user" 
                      ? "bg-[#2563eb] text-white rounded-[18px] px-5 py-3 shadow-sm" 
                      : `bg-transparent px-4 py-3 w-full ${m.isStreaming ? "" : "ai-border-left"}`}`}
                      style={m.role === "ai" ? { background: theme.aiMsgBg } : {}}>
                      
                      {m.role === "ai" ? (
                        <div className="text-[15px] leading-relaxed relative">
                          {m.result && <h3 className="text-lg font-bold mb-2">{m.result.diagnosis}</h3>}
                          {m.result && (
                            <div className="mb-3">
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" 
                                    style={{ background: `${m.result.color}20`, color: m.result.color }}>
                                {m.result.urgency}
                              </span>
                            </div>
                          )}
                          <TypewriterText text={m.text} isLast={isLast} />
                          {m.result && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {m.result.tags.map(tag => (
                                <span key={tag} className="text-[11px] px-2.5 py-1 rounded-md" 
                                      style={{ background: `${theme.accent}15`, color: theme.accent }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-[15px] leading-relaxed">{m.text}</p>
                      )}
                    </div>
                    {m.timestamp && <span className="text-[10px] opacity-40 mt-1 px-1">{m.timestamp}</span>}
                  </div>
                </div>

                {m.result && (
                  <div className="mt-4 w-full animate-slide-up flex flex-wrap gap-3 ml-11">
                    {m.result.advice.map((ad, idx) => {
                      const colors = ad.type === "urgency" ? { bg: theme.cardUrgency, text: theme.textUrgency } 
                                   : ad.type === "spec" ? { bg: theme.cardSpec, text: theme.textSpec }
                                   : { bg: theme.cardRDV, text: theme.textRDV };
                      return (
                        <div key={idx} 
                             className="border rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                             style={{ background: colors.bg, borderColor: colors.text + "40", color: colors.text }}
                             onClick={() => (ad.type === "rdv" || ad.type === "spec") && setPage("appointments")}>
                          <span className="text-base">{ad.icon}</span>
                          <span className="text-[13px] font-bold">{ad.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center gap-1 ml-11">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
          <div ref={messagesEndRef} className="h-8" />
        </div>
      </div>

      {/* INPUT ZONE - BOTTOM STICKY */}
      <div className="w-full px-4 pb-1 pt-1">
        <div className="max-w-[800px] mx-auto flex flex-col gap-2">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-1 py-1">
            {quickSymptoms.map(s => (
              <button key={s} onClick={() => send(s)} className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-all hover:bg-blue-500 hover:text-white" style={{ background: theme.chatBg, borderColor: theme.border, color: theme.text }}>{s}</button>
            ))}
          </div>
          <div className="relative group rounded-[24px] border shadow-md transition-all focus-within:shadow-lg" style={{ background: theme.chatBg, borderColor: theme.border }}>
            <div className="flex flex-col p-2">
              <textarea 
                ref={textareaRef} 
                rows={1} 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())} 
                placeholder="Décrivez vos symptômes..." 
                className="w-full px-4 py-3 bg-transparent outline-none resize-none text-[15px] leading-relaxed diagnosis-textarea" 
                style={{ color: theme.text, maxHeight: '180px' }} 
              />
              <style>{`
                .diagnosis-textarea::placeholder {
                  color: ${dk ? 'rgba(230, 237, 243, 0.4)' : 'rgba(13, 17, 23, 0.4)'} !important;
                  opacity: 1;
                }
              `}</style>
              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex items-center gap-1">
                  <button onClick={toggleRecording} className={`p-2 rounded-full transition-colors ${isRecording ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><Mic size={20} /></button>
                  <label className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"><input type="file" multiple className="hidden" onChange={handleFileChange} /><Paperclip size={20} /></label>
                </div>
                <button onClick={() => send()} disabled={!input.trim() && attachedFiles.length === 0} className={`p-2.5 rounded-full transition-all ${input.trim() || attachedFiles.length > 0 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}><Send size={18} /></button>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-center opacity-50" style={{ color: theme.text }}>
            MedSmart AI est une intelligence artificielle et peut faire des erreurs. Veuillez vérifier les réponses importantes avec un professionnel de santé.
          </p>
        </div>
      </div>

      {showFullHistory && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowFullHistory(false)} />
          <div className="fixed top-0 left-0 w-[320px] h-full z-50 flex flex-col shadow-2xl border-r" style={{ background: theme.chatBg, borderColor: theme.border, animation: "slideInLeft 0.3s ease forwards" }}>
            <div className="p-6 flex items-center justify-between border-b" style={{ borderColor: theme.border }}><h2 className="font-bold text-lg">Historique</h2><button onClick={() => setShowFullHistory(false)} className="text-gray-400 hover:text-black dark:hover:text-white"><X size={20} /></button></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {HISTORY_SESSIONS.map(s => (
                <button key={s.id} onClick={() => setShowFullHistory(false)} className="w-full text-left p-4 rounded-xl border transition-all hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: theme.border }}><p className="font-semibold text-sm mb-1">{s.title}</p><p className="text-[11px] opacity-60">{s.date}</p></button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}




// ─── APPOINTMENTS PAGE ────────────────────────────────────────────────────────
function AppointmentsPage({
  dk,
  appointments: rawAppointments,
  loading: shellLoading,
  refreshAppointments,
}) {
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("mesrdv"); // "mesrdv" | "finddoctor"
  const { globalSearch, setGlobalSearch } = useData();
  const searchTerm = globalSearch;
  const setSearchTerm = setGlobalSearch;
  const [selectedDoctor, setSelectedDoctor] = useState(null); // for calendar panel
  const [profileDoctor, setProfileDoctor] = useState(null); // for profile modal

  // Review system state
  const [doctorReviews, setDoctorReviews] = useState({}); // { docId: [{stars, comment, date}] }
  const [reviewModal, setReviewModal] = useState(null); // doc being reviewed
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const [calMonth, setCalMonth] = useState(new Date()); // Current month
  const [calDay, setCalDay] = useState(null);
  const [calSlot, setCalSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [specFilter, setSpecFilter] = useState("All");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchAppt, setSearchAppt] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGender, setSelectedGender] = useState("Any Gender");
  const [starFilter, setStarFilter] = useState(1);
  const [specOpen, setSpecOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [activeMapDoc, setActiveMapDoc] = useState(null);
  const [isMapLocked, setIsMapLocked] = useState(false);
  const [showMapMobile, setShowMapMobile] = useState(false);
  const dateInputRef = useRef(null);
  const docListRef = useRef(null);

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
    t('all_specialties'),
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
        if (selectedCity)
          filters.city = selectedCity;
        if (debouncedSearch) filters.search = debouncedSearch;

        const data = await api.getDoctors(filters).catch(() => []);
        const results = Array.isArray(data) ? data : (data?.results || []);
        // Normalize backend Doctor data to UI expectations
        const normalized = results.map((d) => ({
          id: d.id,
          name: d.full_name ? `Dr. ${d.full_name}` : "Dr. Inconnu",
          spec: d.specialty_display || d.specialty || "Généraliste",
          loc: d.clinic_name || d.est_city || "Alger",
          rating: parseFloat(d.rating) || 4.5,
          exp: d.experience_years || 5,
          initials: (d.full_name || "DR").split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2),
          color: (d.specialty || "").toLowerCase().includes("cardio")
            ? "#4A6FA5"
            : "#2D8C6F",
          phone: d.pro_phone || "+213 -- -- --",
          lang: d.languages 
            ? (Array.isArray(d.languages) ? d.languages : String(d.languages).split(",")) 
            : ["Français", "Arabe"],
          bio: d.bio || "Le docteur n'a pas rédigé de biographie.",
          edu: "Faculté de Médecine.",
          reviews: d.total_reviews || 0,
          gender: d.gender || "M",
        }));
        if (normalized.length === 0) {
          setDoctors([{
            id: 'mock-1',
            name: "Dr. Sarah Smith",
            spec: "Cardiologue",
            loc: "Clinique Al-Azhar, Alger",
            rating: 4.9,
            exp: 12,
            reviews: 124,
            initials: "SS",
            color: "#4A6FA5",
            phone: "+213 555 12 34 56",
            lang: ["Français", "Arabe", "Anglais"],
            bio: "Spécialiste en cardiologie interventionnelle avec plus de 12 ans d'expérience.",
            edu: "Faculté de Médecine d'Alger.",
            gender: "F"
          }]);
        } else {
          setDoctors(normalized);
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error("Error fetching doctors:", err);
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
          const res = await api.getDoctorSlots(selectedDoctor.id, dateStr);
          const rawSlots = Array.isArray(res) ? res : (res?.slots || []);
          const slots = rawSlots.map((s, idx) => ({
            id: s.id || `${dateStr}-${s.start_time}-${idx}`,
            time: s.start_time ? s.start_time.substring(0, 5) : s.time,
            start_time: s.start_time,
            end_time: s.end_time,
            date: dateStr,
          }));
          setAvailableSlots(slots);
        } catch (err) {
          if (import.meta.env.DEV) console.error("Error fetching slots:", err);
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
  const filteredUpcoming = upcomingAppts
    .filter((a) => !localHidden.includes(a.id))
    .filter(
      (a) =>
        (a.doctor_name || "").toLowerCase().includes(searchAppt.toLowerCase()) ||
        (a.specialty || "").toLowerCase().includes(searchAppt.toLowerCase()),
    );

  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const emptyDays = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const today = new Date();

  const monthNames = {
    fr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };
  const dayNames = {
    fr: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
    en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  };

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
      // Backend attend { doctor_id, date, start_time, end_time, motif }
      const normalizeTime = (t) => {
        if (!t) return undefined;
        const s = String(t);
        return s.length > 5 ? s.substring(0, 5) : s;
      };
      const bookingDate = slotObj.date || formatDate(year, month, calDay);
      await api.bookAppointment({
        doctor_id: selectedDoctor.id,
        date: bookingDate,
        start_time: normalizeTime(slotObj.start_time || slotObj.time),
        end_time: normalizeTime(slotObj.end_time),
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

  const openGoogleMaps = (doc) => {
    const query = encodeURIComponent(`${doc.name} ${doc.clinic_address || doc.loc}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
  };

  // Get combined reviews (initial from doc + user submitted)
  const getDocReviews = (docId) => doctorReviews[docId] || [];

  // Compute live rating for a doc
  const getLiveRating = (doc) => {
    const reviews = getDocReviews(doc.id);
    if (reviews.length === 0) return { rating: doc.rating, reviews: doc.reviews };
    const total = reviews.reduce((s, r) => s + r.stars, 0);
    const avg = (total / reviews.length).toFixed(1);
    return { rating: avg, reviews: doc.reviews + reviews.length };
  };

  const submitReview = () => {
    if (!reviewModal || reviewStars === 0) return;
    const newReview = {
      stars: reviewStars,
      comment: reviewComment.trim() || null,
      date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setDoctorReviews(prev => ({
      ...prev,
      [reviewModal.id]: [newReview, ...(prev[reviewModal.id] || [])]
    }));
    setReviewModal(null);
    setReviewStars(0);
    setReviewHover(0);
    setReviewComment("");
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
    return availableSlots.map((s) => s.time);
  };

  const hasSlots = (day) => {
    return true;
  };

  const morningSlots = useMemo(
    () => availableSlots.filter((s) => s.time < "12:00"),
    [availableSlots],
  );
  const afternoonSlots = useMemo(
    () => availableSlots.filter((s) => s.time >= "12:00"),
    [availableSlots],
  );

  // ─── Cancel / Reschedule state ─────────────────────────────────────────────
  const [localHidden, setLocalHidden] = useState([]); // IDs retirés localement
  const [cancellingId, setCancellingId] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null); // appointment
  const [rescheduleDate, setRescheduleDate] = useState(""); // YYYY-MM-DD
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleSlotsLoading, setRescheduleSlotsLoading] = useState(false);
  const [rescheduleSlotId, setRescheduleSlotId] = useState(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleErr, setRescheduleErr] = useState("");

  const handleCancelAppointment = async (appt) => {
    if (!appt?.id) return;
    setErr("");
    setSuccess("");
    setCancellingId(appt.id);
    try {
      await api.cancelAppointment(appt.id);
      // Retrait optimiste local
      setLocalHidden((prev) => [...prev, appt.id]);
      setSuccess("Rendez-vous annulé");
      setTimeout(() => setSuccess(""), 4000);
      if (refreshAppointments) refreshAppointments();
    } catch (e) {
      setErr(e?.message || "Erreur lors de l'annulation.");
      setTimeout(() => setErr(""), 5000);
    } finally {
      setCancellingId(null);
    }
  };

  const openReschedule = (appt) => {
    setRescheduleTarget(appt);
    setRescheduleDate("");
    setRescheduleSlots([]);
    setRescheduleSlotId(null);
    setRescheduleErr("");
  };

  const closeReschedule = () => {
    if (rescheduling) return;
    setRescheduleTarget(null);
    setRescheduleDate("");
    setRescheduleSlots([]);
    setRescheduleSlotId(null);
    setRescheduleErr("");
  };

  // Charge les créneaux du même médecin quand la date change
  useEffect(() => {
    if (!rescheduleTarget || !rescheduleDate) {
      setRescheduleSlots([]);
      return;
    }
    const doctorId = rescheduleTarget.doctor_id || rescheduleTarget.doctor?.id;
    if (!doctorId) {
      setRescheduleErr("Identifiant médecin introuvable — reprogrammation impossible.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setRescheduleSlotsLoading(true);
        setRescheduleErr("");
        const res = await api.getDoctorSlots(doctorId, rescheduleDate);
        // Le backend renvoie { slots: [...] } ou un tableau
        const raw = Array.isArray(res) ? res : (res?.slots || []);
        const slots = raw.map((s, i) => ({
          id: s.id || `${rescheduleDate}-${s.start_time || i}`,
          start_time: (s.start_time || "").toString().substring(0, 5),
          end_time:   (s.end_time   || "").toString().substring(0, 5),
        })).filter((s) => s.start_time && s.end_time);
        if (!cancelled) setRescheduleSlots(slots);
      } catch (e) {
        if (!cancelled) setRescheduleErr(e?.message || "Impossible de charger les créneaux.");
      } finally {
        if (!cancelled) setRescheduleSlotsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [rescheduleTarget, rescheduleDate]);

  const confirmReschedule = async () => {
    if (!rescheduleTarget || !rescheduleSlotId) return;
    const slot = rescheduleSlots.find((s) => s.id === rescheduleSlotId);
    if (!slot) return;
    const doctorId = rescheduleTarget.doctor_id || rescheduleTarget.doctor?.id;
    setRescheduling(true);
    setRescheduleErr("");
    try {
      await api.rescheduleAppointment(rescheduleTarget.id, {
        doctor_id: doctorId,
        date: rescheduleDate,
        start_time: slot.start_time,
        end_time:   slot.end_time,
        motif: rescheduleTarget.motif || "Consultation",
      });
      setSuccess("Rendez-vous reprogrammé");
      setTimeout(() => setSuccess(""), 4000);
      // L'ancien RDV est annulé côté backend → on le masque localement.
      setLocalHidden((prev) => [...prev, rescheduleTarget.id]);
      closeReschedule();
      if (refreshAppointments) refreshAppointments();
    } catch (e) {
      setRescheduleErr(e?.message || "Erreur lors de la reprogrammation.");
    } finally {
      setRescheduling(false);
    }
  };

  // Format JJ/MM/AAAA pour affichage
  const fmtFr = (iso) => {
    if (!iso) return "";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <>
      {/* ─ Review Modal ─ */}
      {reviewModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setReviewModal(null); setReviewStars(0); setReviewHover(0); setReviewComment(""); } }}
        >
          <div
            className="rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border"
            style={{ background: c.card, borderColor: c.border }}
          >
            {/* Review Modal Header */}
            <div className="p-6 border-b" style={{ borderColor: c.border }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.blue + "15" }}>
                    <Star size={18} style={{ color: c.blue }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: c.txt }}>Laisser un avis</h3>
                    <p className="text-xs" style={{ color: c.txt3 }}>{reviewModal.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setReviewModal(null); setReviewStars(0); setReviewHover(0); setReviewComment(""); }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70"
                  style={{ background: c.blueLight }}
                >
                  <X size={15} style={{ color: c.txt3 }} />
                </button>
              </div>
            </div>

            {/* Review Modal Body */}
            <div className="p-6 space-y-5">
              {/* Star Picker */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: c.txt3 }}>Votre note</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setReviewStars(n)}
                      onMouseEnter={() => setReviewHover(n)}
                      onMouseLeave={() => setReviewHover(0)}
                      className="text-3xl transition-transform hover:scale-110 active:scale-95"
                      title={n + " étoile" + (n > 1 ? "s" : "")}
                    >
                      <span style={{ color: n <= (reviewHover || reviewStars) ? "#E8A838" : (dk ? "#ffffff22" : "#e2e8f0") }}>★</span>
                    </button>
                  ))}
                  {reviewStars > 0 && (
                    <span className="ml-2 text-sm font-black" style={{ color: "#E8A838" }}>
                      {["Très mauvais", "Mauvais", "Correct", "Bien", "Excellent"][reviewStars - 1]}
                    </span>
                  )}
                </div>
              </div>

              {/* Comment Area */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt3 }}>Commentaire (optionnel)</p>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce médecin..."
                  rows={3}
                  className="w-full rounded-xl border px-4 py-3 text-sm resize-none focus:outline-none transition-all"
                  style={{
                    background: c.bg,
                    borderColor: c.border,
                    color: c.txt,
                  }}
                />
              </div>
            </div>

            {/* Review Modal Footer */}
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={submitReview}
                disabled={reviewStars === 0}
                className="flex-1 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${c.blue}, #304B71)` }}
              >
                <Check size={16} /> Publier l'avis
              </button>
              <button
                onClick={() => { setReviewModal(null); setReviewStars(0); setReviewHover(0); setReviewComment(""); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: c.border, color: c.txt2 }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─ Profile Modal ─ */}
      {profileDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setProfileDoctor(null); }}
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
                  <p className="text-sm font-semibold" style={{ color: c.blue }}>
                    {profileDoctor.spec}
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {/* Clickable rating to open review */}
                    <button
                      onClick={() => { setReviewModal(profileDoctor); setProfileDoctor(null); }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all hover:scale-105 active:scale-95"
                      style={{ background: "#E8A83818" }}
                      title="Cliquez pour laisser un avis"
                    >
                      <span className="text-sm font-black" style={{ color: "#E8A838" }}>★ {getLiveRating(profileDoctor).rating}</span>
                      <MessageSquare size={12} style={{ color: "#E8A838", opacity: 0.8 }} />
                    </button>
                    <span className="text-xs" style={{ color: c.txt3 }}>
                      {getLiveRating(profileDoctor).reviews} avis
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
            <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
              {/* À propos */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>À propos</p>
                <p className="text-sm" style={{ color: c.txt2 }}>{profileDoctor.bio}</p>
              </div>

              {/* Formation */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>Formation</p>
                <p className="text-sm" style={{ color: c.txt2 }}>{profileDoctor.edu}</p>
              </div>

              {/* Contact */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>Contact</p>
                <a href={"tel:" + (profileDoctor.phone || "").replace(/\s/g, "")}
                  className="text-sm font-medium flex items-center gap-2 transition-all hover:opacity-75 transition-opacity w-fit"
                  style={{ color: c.green }}>
                  <Phone size={13} /> {profileDoctor.phone}
                </a>
                <a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(profileDoctor.name + " " + (profileDoctor.loc || ""))}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs mt-1 flex items-center gap-2 transition-all hover:opacity-75 transition-opacity w-fit"
                  style={{ color: c.blue }}>
                  <MapPin size={12} /> {profileDoctor.loc}
                </a>
              </div>

              {/* Avis des patients */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: c.txt3 }}>Avis des patients</p>
                  <button
                    onClick={() => { setReviewModal(profileDoctor); setProfileDoctor(null); }}
                    className="text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                    style={{ background: c.blue + "15", color: c.blue }}
                  >
                    <Plus size={11} /> Laisser un avis
                  </button>
                </div>
                {getDocReviews(profileDoctor.id).length === 0 ? (
                  <p className="text-xs italic" style={{ color: c.txt3 }}>Aucun avis pour l'instant. Soyez le premier !</p>
                ) : (
                  <div className="space-y-2.5">
                    {getDocReviews(profileDoctor.id).map((r, idx) => (
                      <div key={idx} className="rounded-xl p-3 border" style={{ borderColor: c.border, background: c.bg }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-black" style={{ color: "#E8A838" }}>
                            {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
                          </span>
                          <span className="text-[10px] font-medium" style={{ color: c.txt3 }}>{r.date}</span>
                        </div>
                        {r.comment && <p className="text-xs" style={{ color: c.txt2 }}>{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
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
          Rendez-vous
        </h1>
        <div
          className="flex gap-1 p-1.5 rounded-2xl border transition-all"
          style={{
            borderColor: c.border,
            background: c.card,
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          {/* Mes RDV Tab */}
          <button
            onClick={() => setTab("mesrdv")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all"
            style={{
              background: tab === "mesrdv" ? c.blue : "transparent",
              color: tab === "mesrdv" ? "#fff" : c.txt2,
              boxShadow: tab === "mesrdv" ? `0 8px 16px ${c.blue}33` : "none",
            }}
          >
            <Calendar size={15} />
            Mes RDV
          </button>

          {/* Trouver un médecin Tab */}
          <button
            onClick={() => setTab("finddoctor")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all"
            style={{
              background: tab === "finddoctor" ? c.blue : "transparent",
              color: tab === "finddoctor" ? "#fff" : c.txt2,
              boxShadow: tab === "finddoctor" ? `0 8px 16px ${c.blue}33` : "none",
            }}
          >
            <Search size={15} />
            Trouver un médecin
          </button>
        </div>
      </div>

      {/* ──── Reschedule Modal ──── */}
      {rescheduleTarget && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeReschedule(); }}
        >
          <div
            className="rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border"
            style={{ background: c.card, borderColor: c.border }}
          >
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: c.border }}>
              <div>
                <h3 className="font-bold text-base" style={{ color: c.txt }}>Reprogrammer</h3>
                <p className="text-xs mt-0.5" style={{ color: c.txt3 }}>
                  {rescheduleTarget.doctor_name || "Médecin"} · {rescheduleTarget.specialty || rescheduleTarget.doctor_specialty || ""}
                </p>
              </div>
              <button
                type="button"
                onClick={closeReschedule}
                disabled={rescheduling}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 disabled:opacity-50"
                style={{ background: c.blueLight }}
              >
                <X size={15} style={{ color: c.txt3 }} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: c.txt3 }}>
                  Nouvelle date (JJ/MM/AAAA)
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.blue }} />
                  <input
                    type="date"
                    value={rescheduleDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => { setRescheduleDate(e.target.value); setRescheduleSlotId(null); }}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
                    style={{ background: c.bg, borderColor: c.border, color: c.txt }}
                  />
                  {rescheduleDate && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold pointer-events-none" style={{ color: c.txt3 }}>
                      {fmtFr(rescheduleDate)}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: c.txt3 }}>
                  Créneaux disponibles
                </label>
                {!rescheduleDate ? (
                  <p className="text-xs italic py-3" style={{ color: c.txt3 }}>Sélectionnez d'abord une date.</p>
                ) : rescheduleSlotsLoading ? (
                  <div className="py-4 flex justify-center">
                    <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: `${c.blue}40`, borderTopColor: c.blue }} />
                  </div>
                ) : rescheduleSlots.length === 0 ? (
                  <p className="text-xs italic py-3" style={{ color: c.txt3 }}>
                    Aucun créneau libre ce jour-là.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {rescheduleSlots.map((s) => {
                      const active = rescheduleSlotId === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setRescheduleSlotId(s.id)}
                          className="py-2 rounded-lg text-xs font-bold border transition-all"
                          style={{
                            background: active ? c.blue : c.card,
                            color: active ? "#fff" : c.txt,
                            borderColor: active ? c.blue : c.border,
                          }}
                        >
                          {s.start_time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {rescheduleErr && (
                <div
                  className="px-3 py-2 rounded-lg text-xs font-semibold border"
                  style={{ background: "#E0555518", borderColor: "#E0555544", color: "#E05555" }}
                >
                  {rescheduleErr}
                </div>
              )}
            </div>

            <div className="px-5 pb-5 flex gap-2">
              <button
                type="button"
                onClick={closeReschedule}
                disabled={rescheduling}
                className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                style={{ borderColor: c.border, color: c.txt2 }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmReschedule}
                disabled={rescheduling || !rescheduleSlotId}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                style={{ background: c.blue }}
              >
                {rescheduling && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {rescheduling ? "…" : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──── TAB: MES RDV ──── */}
      {tab === "mesrdv" && (
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
                          type="button"
                          onClick={() => openReschedule(a)}
                          disabled={cancellingId === a.id}
                          className="flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ background: c.blueLight, color: c.blue }}
                        >
                          {t('modify')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelAppointment(a)}
                          disabled={cancellingId === a.id}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                          style={{ color: "#E05555" }}
                        >
                          {cancellingId === a.id && (
                            <span className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: "#E0555540", borderTopColor: "#E05555" }} />
                          )}
                          {cancellingId === a.id ? "…" : t('cancel_appointment')}
                        </button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Historique Section ── */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="font-bold text-lg" style={{ color: c.txt }}>
                Historique
              </h2>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: c.blue + "11", color: c.blue }}
              >
                {historyAppts.length} {historyAppts.length > 1 ? "entrées" : "entrée"}
              </span>
            </div>
            <div className="space-y-3">
              {historyAppts.length === 0 ? (
                <EmptyState
                  dk={dk}
                  icon={Clock}
                  compact={true}
                  title="Aucun historique"
                  message="Vous n'avez pas encore de rendez-vous passés ou annulés."
                />
              ) : (
                historyAppts.map((h, i) => (
                  <Card key={h.id || i} dk={dk} style={{ padding: "14px 18px" }}>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background:
                            (h.status === "completed" ? "#2D8C6F" : "#E05555") + "18",
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
                          {h.specialty || "Spécialité"} · {h.date_display || h.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full uppercase"
                          style={{
                            background:
                              (h.status === "completed" ? "#2D8C6F" : "#E05555") + "18",
                            color: h.status === "completed" ? "#2D8C6F" : "#E05555",
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
          </div>
        </>
      )}

      {/* ──── TAB: TROUVER UN MÉDECIN ──── */}
      {tab === "finddoctor" && (
        <>
          {/* ── Mobile toggle list/map ── */}
          <div className="flex md:hidden mb-4 justify-center">
            <div className="flex p-1 rounded-full border shadow-sm" style={{ background: c.card, borderColor: c.border }}>
              <button
                onClick={() => setShowMapMobile(false)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{ background: !showMapMobile ? c.blue : 'transparent', color: !showMapMobile ? '#fff' : c.txt2 }}
              >
                Liste
              </button>
              <button
                onClick={() => setShowMapMobile(true)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{ background: showMapMobile ? c.blue : 'transparent', color: showMapMobile ? '#fff' : c.txt2 }}
              >
                Carte
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

            {/* Colonne gauche — scrollable */}
            <div className={showMapMobile ? 'hidden md:block' : ''} style={{ flex: "0 0 65%", minWidth: 0 }}>
              {/* Searchbar principale */}
              <div className="mb-4">
                <div
                  className="rounded-2xl border flex items-center gap-3 px-4 py-3 transition-all"
                  style={{
                    background: dk ? '#1a2235' : c.card,
                    borderColor: searchFocused ? c.blue : c.border,
                    boxShadow: searchFocused ? `0 0 0 3px ${c.blue}22` : '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  <Search size={18} style={{ color: searchFocused ? c.blue : c.txt3, flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Rechercher un médecin, une spécialité..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:opacity-50"
                    style={{ color: c.txt }}
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="shrink-0 hover:opacity-70 transition-opacity" style={{ color: c.txt3 }}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filtres avancés */}
              <div
                className="rounded-2xl border mb-6 p-4"
                style={{ background: dk ? '#141B27' : c.card, borderColor: c.border }}
              >
                {/* Header filtres */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: c.txt3 }}>
                    Filtres avancés
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCity("");
                      setSpecFilter("All");
                      setSelectedDate("");
                      setStarFilter(1);
                      setSelectedGender("Any Gender");
                    }}
                    className="text-[11px] font-bold uppercase tracking-wide hover:opacity-70 transition-opacity"
                    style={{ color: c.blue }}
                  >
                    Réinitialiser
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Wilaya */}
                  <div className="relative">
                    <label className="block text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>Wilaya</label>
                    <button
                      onClick={() => setLocationOpen((o) => !o)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all"
                      style={{ borderColor: locationOpen ? c.blue : c.border, background: dk ? 'rgba(255,255,255,0.05)' : c.bg, color: selectedCity ? c.txt : c.txt3 }}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={13} style={{ color: c.blue }} />
                        <span>{selectedCity || "Toutes les wilayas"}</span>
                      </div>
                      <ChevronDown size={13} className="transition-transform" style={{ transform: locationOpen ? 'rotate(180deg)' : 'none', color: c.txt3 }} />
                    </button>
                    {locationOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setLocationOpen(false)} />
                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 rounded-xl shadow-xl border py-1 max-h-52 overflow-y-auto"
                          style={{ background: c.card, borderColor: c.border, scrollbarWidth: 'none' }}>
                          <button onClick={() => { setSelectedCity(""); setLocationOpen(false); }}
                            className="w-full px-4 py-2 text-xs text-left transition-all hover:opacity-80"
                            style={{ color: !selectedCity ? c.blue : c.txt, fontWeight: !selectedCity ? 700 : 400 }}>
                            Toutes les wilayas
                          </button>
                          {CITIES.map((city) => (
                            <button key={city} onClick={() => { setSelectedCity(city); setLocationOpen(false); }}
                              className="w-full px-4 py-2 text-xs text-left transition-all hover:opacity-80"
                              style={{ background: selectedCity === city ? c.blue + "18" : "transparent", color: selectedCity === city ? c.blue : c.txt, fontWeight: selectedCity === city ? 700 : 400 }}>
                              {city}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Spécialité */}
                  <div className="relative">
                    <label className="block text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>Spécialité</label>
                    <button
                      onClick={() => setSpecOpen((o) => !o)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all"
                      style={{ borderColor: specOpen ? c.blue : c.border, background: dk ? 'rgba(255,255,255,0.05)' : c.bg, color: specFilter === "All" ? c.txt3 : c.txt }}
                    >
                      <div className="flex items-center gap-2">
                        <Zap size={13} style={{ color: c.blue }} />
                        <span>{specFilter !== "All" ? specFilter : "Toutes les spécialités"}</span>
                      </div>
                      <ChevronDown size={13} className="transition-transform" style={{ transform: specOpen ? 'rotate(180deg)' : 'none', color: c.txt3 }} />
                    </button>
                    {specOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setSpecOpen(false)} />
                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 rounded-xl shadow-xl border py-1 max-h-52 overflow-y-auto"
                          style={{ background: c.card, borderColor: c.border, scrollbarWidth: 'thin' }}>
                          {SPECIALTIES.map((s) => (
                            <button key={s} onClick={() => { setSpecFilter(s); setSpecOpen(false); }}
                              className="w-full px-4 py-2 text-xs text-left transition-all hover:opacity-80 flex items-center justify-between"
                              style={{ background: specFilter === s ? c.blue + "18" : "transparent", color: specFilter === s ? c.blue : c.txt, fontWeight: specFilter === s ? 700 : 400 }}>
                              {s}
                              {specFilter === s && <span>✓</span>}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Calendrier */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>Date de disponibilité</label>
                    <div
                      className="relative flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all"
                      style={{ borderColor: selectedDate ? c.blue : c.border, background: dk ? 'rgba(255,255,255,0.05)' : c.bg }}
                      onClick={() => dateInputRef.current?.showPicker?.()}
                    >
                      <Calendar size={13} style={{ color: c.blue }} />
                      <span className="text-xs font-medium flex-1 select-none" style={{ color: selectedDate ? c.txt : c.txt3 }}>
                        {selectedDate ? new Date(selectedDate).toLocaleDateString("fr-FR") : "JJ/MM/AAAA"}
                      </span>
                      {selectedDate && (
                        <button onClick={(e) => { e.stopPropagation(); setSelectedDate(""); }}
                          className="text-[10px] hover:opacity-70 relative z-10" style={{ color: c.txt3 }}>✕</button>
                      )}
                      <input ref={dateInputRef} type="date" value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full cursor-pointer" style={{ zIndex: 1 }} />
                    </div>
                  </div>

                  {/* Note minimale */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>Note minimale</label>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border"
                      style={{ borderColor: c.border, background: dk ? 'rgba(255,255,255,0.05)' : c.bg }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setStarFilter(star)}
                          className="text-xl leading-none transition-transform hover:scale-110"
                          style={{ color: star <= starFilter ? "#E8A838" : (dk ? "rgba(255,255,255,0.15)" : "#e2e8f0") }}>
                          ★
                        </button>
                      ))}
                      <span className="text-[11px] ml-1 font-semibold" style={{ color: c.txt3 }}>
                        {starFilter}★ et +
                      </span>
                    </div>
                  </div>

                  {/* Genre */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>Genre du médecin</label>
                    <div className="flex gap-2">
                      {[
                        { id: "Any Gender", label: "Tous" },
                        { id: "Masculin", label: "Masculin" },
                        { id: "Féminin", label: "Féminin" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedGender(opt.id)}
                          className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
                          style={{
                            background: selectedGender === opt.id ? c.blue : 'transparent',
                            color: selectedGender === opt.id ? '#fff' : c.txt2,
                            borderColor: selectedGender === opt.id ? c.blue : c.border,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

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
                  background: dk ? `linear-gradient(to right, ${c.card}, ${c.blue}15)` : `linear-gradient(to right, ${c.card}, ${c.blue}08)`,
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

                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                      (d) => (
                        <div
                          key={d}
                          className="text-center text-[10px] font-black uppercase tracking-widest opacity-40 mb-2"
                        >
                          {d}
                        </div>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {emptyDays.map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {days.map((d) => {
                      const isToday =
                        d === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();
                      const isSel = d === calDay;
                      const hasSlt = true;

                      return (
                        <button
                          key={d}
                          onClick={() => {
                            setCalDay(d);
                            setCalSlot(null);
                          }}
                          className="aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all group border-0"
                          style={{
                            background: isSel
                              ? c.blue
                              : isToday
                                ? c.blueLight
                                : "transparent",
                            color: isSel
                              ? "#fff"
                              : isToday
                                ? c.blue
                                : c.txt,
                          }}
                        >
                          <span className="text-sm font-black z-10">{d}</span>
                          {hasSlt && !isSel && (
                            <div
                              className="w-1 h-1 rounded-full absolute bottom-2"
                              style={{ background: c.blue }}
                            />
                          )}
                          {isSel && (
                            <div className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-white/30" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Time Slots (5 cols) */}
                <div
                  className="lg:col-span-5 p-6 bg-opacity-10"
                  style={{ background: dk ? "#ffffff03" : "#00000002" }}
                >
                  {!calDay ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 opacity-40">
                      <Calendar size={32} className="mb-3 opacity-20" />
                      <p className="text-sm font-medium text-center">
                        Choisissez un jour pour voir les créneaux disponibles
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <h4
                          className="font-bold text-base"
                          style={{ color: c.txt }}
                        >
                          Heures disponibles
                        </h4>
                        <div
                          className="px-3 py-1 rounded-lg text-[10px] font-black tracking-widest text-white uppercase"
                          style={{ background: c.green }}
                        >
                          {calDay} {monthNames[month]}
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-2 space-y-6 max-h-[350px] custom-scrollbar">
                        {slotsLoading ? (
                          <div className="flex items-center justify-center py-12 opacity-50">
                            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: c.blue, borderTopColor: "transparent" }} />
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 opacity-40">
                            <Clock size={28} className="mb-2 opacity-30" />
                            <p className="text-sm font-medium text-center">Aucun créneau disponible pour ce jour</p>
                          </div>
                        ) : (
                          <>
                            {/* Morning Section */}
                            {morningSlots.length > 0 && (
                              <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40 flex items-center gap-2">
                                  <Sun size={12} /> Matin
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                  {morningSlots.map((slotObj) => {
                                    const isSel = calSlot === slotObj.time;
                                    return (
                                      <button
                                        key={slotObj.id ?? slotObj.time}
                                        onClick={() => setCalSlot(slotObj.time)}
                                        className="py-3 rounded-xl text-[13px] font-black border transition-all"
                                        style={{
                                          background: isSel ? c.blue : c.card,
                                          color: isSel ? "#fff" : c.txt,
                                          borderColor: isSel ? c.blue : c.border,
                                          boxShadow: isSel ? `0 4px 12px ${c.blue}44` : "none"
                                        }}
                                      >
                                        {slotObj.time}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Afternoon Section */}
                            {afternoonSlots.length > 0 && (
                              <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40 flex items-center gap-2">
                                  <Moon size={12} /> Après-midi
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                  {afternoonSlots.map((slotObj) => {
                                    const isSel = calSlot === slotObj.time;
                                    return (
                                      <button
                                        key={slotObj.id ?? slotObj.time}
                                        onClick={() => setCalSlot(slotObj.time)}
                                        className="py-3 rounded-xl text-[13px] font-black border transition-all"
                                        style={{
                                          background: isSel ? c.blue : c.card,
                                          color: isSel ? "#fff" : c.txt,
                                          borderColor: isSel ? c.blue : c.border,
                                          boxShadow: isSel ? `0 4px 12px ${c.blue}44` : "none"
                                        }}
                                      >
                                        {slotObj.time}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </>
                        )}
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
                          disabled={!calSlot}
                          onClick={() => handleBook(selectedDoctor)}
                          className="w-full py-4 rounded-2xl text-[15px] font-black text-white transition-all shadow-xl disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3 active:scale-[0.98]"
                          style={{
                            background: `linear-gradient(135deg, ${c.blue}, #304B71)`,
                            boxShadow: `0 12px 24px -10px ${c.blue}66`,
                          }}
                        >
                          CONFIRMER ET RÉSERVER
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

              {/* ── Grille médecins ── */}
              <div
                className="grid gap-5 mb-10 grid-cols-1 md:grid-cols-2"
                ref={docListRef}
              >
                {filteredDoctors.map((doc) => {
                  const live = getLiveRating(doc);
                  const isSelected = activeMapDoc?.id === doc.id;
                  const isLocked = isMapLocked && isSelected;
                  return (
                  <div
                    key={doc.id}
                    onMouseEnter={() => {
                      if (!isMapLocked) setActiveMapDoc(doc);
                    }}
                    onClick={() => {
                      if (isMapLocked && isSelected) {
                        setIsMapLocked(false);
                      } else {
                        setActiveMapDoc(doc);
                        setIsMapLocked(true);
                      }
                    }}
                    className="group flex flex-col rounded-xl border shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer"
                    style={{
                      background: c.card,
                      borderColor: isLocked ? c.blue : (isSelected ? `${c.blue}88` : c.border),
                      boxShadow: isLocked ? `0 0 0 2px ${c.blue}` : (isSelected ? `0 0 0 2px ${c.blue}33` : 'none')
                    }}
                  >
                    {/* ── Top info ── */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md"
                          style={{ background: `linear-gradient(135deg, ${doc.color}, ${doc.color}bb)` }}
                        >
                          {doc.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold truncate group-hover:text-blue-500 transition-colors" style={{ color: c.txt }}>
                            {doc.name}
                          </p>
                          <p className="text-xs mt-0.5 truncate" style={{ color: c.txt2 }}>
                            {doc.spec} · {doc.exp} ans
                          </p>
                          <button
                            onClick={(e) => { e.stopPropagation(); setReviewModal(doc); }}
                            className="flex items-center gap-1 text-xs font-bold mt-1 hover:scale-105 transition-transform"
                            style={{ color: "#E8A838" }}
                            title="Laisser un avis"
                          >
                            ★ {live.rating}
                            <span className="font-normal" style={{ color: c.txt3 }}>({live.reviews})</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs mt-3 truncate" style={{ color: c.txt3 }}>
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{doc.clinic_address || doc.loc}</span>
                      </div>

                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        <span
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                          style={{ background: c.blueLight, color: c.blue }}
                        >
                          {doc.spec}
                        </span>
                        {doc.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                            style={{ background: c.blueLight, color: c.blue }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="p-3 mt-auto flex gap-2 border-t" style={{ borderColor: c.border }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setProfileDoctor(doc); }}
                        className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors hover:opacity-80"
                        style={{ color: c.txt2, borderColor: c.border, background: "transparent" }}
                      >
                        {t('view_profile') || "Voir profil"}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); openCalendar(doc); }}
                        className="flex-1 text-xs font-bold px-3 py-2 rounded-lg text-white shadow-sm active:scale-95 hover:opacity-90 flex items-center justify-center gap-1"
                        style={{ background: c.blue }}
                      >
                        Prendre RDV
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                );})}
              </div>

            </div>

            {/* ── Carte ── */}
            <div
              className={showMapMobile ? 'fixed inset-4 z-[60] shadow-2xl' : ''}
              style={{
                flex: "0 0 35%",
                position: "sticky",
                top: "72px",
                height: "calc(100vh - 90px)",
                borderRadius: "16px",
                background: dk ? "#0f1b2d" : "#dce6f0",
                padding: "12px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ borderRadius: "12px", overflow: "hidden", height: "100%", position: "relative" }}>
              {activeMapDoc ? (
                <>
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 p-3 rounded-xl shadow-lg border animate-in fade-in slide-in-from-top-2" style={{ background: c.card, borderColor: isMapLocked ? c.blue : c.border }}>
                    {isMapLocked && (
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: c.blue }} title="Sélection verrouillée" />
                    )}
                    <div>
                      <p className="font-bold text-xs" style={{ color: c.txt }}>{activeMapDoc.name}</p>
                      <p className="text-[10px] opacity-70" style={{ color: c.txt2 }}>{activeMapDoc.clinic_address || activeMapDoc.loc}</p>
                    </div>
                    {isMapLocked && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsMapLocked(false); }}
                        className="ml-2 p-1.5 rounded-lg hover:bg-opacity-10 transition-colors"
                        style={{ background: c.blue + "15", color: c.blue }}
                        title="Déverrouiller"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent((activeMapDoc.clinic_address || activeMapDoc.loc || "") + ", Algérie")}&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    className="grayscale-[0.2] contrast-[1.1]"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Map Explorer"
                  />
                  <div className="absolute bottom-4 right-4 z-10">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeMapDoc.name + ' ' + (activeMapDoc.clinic_address || activeMapDoc.loc))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
                      style={{ background: c.blue }}
                    >
                      <MapPin size={14} />
                      Ouvrir dans Google Maps
                    </a>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: c.blueLight }}>
                    <MapPin size={32} style={{ color: c.blue }} />
                  </div>
                  <p className="font-bold text-sm" style={{ color: c.txt }}>Sélectionnez un médecin</p>
                  <p className="text-xs opacity-70 mt-1" style={{ color: c.txt2 }}>Passez votre souris sur un médecin pour voir sa localisation.</p>
                </div>
              )}
              {showMapMobile && (
                <button
                  onClick={() => setShowMapMobile(false)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl"
                  style={{ background: '#E05555' }}
                >
                  <X size={20} />
                </button>
              )}
              </div>
            </div>

          </div>{/* end flex */}

          <div className="h-[260px] w-full pointer-events-none" />
        </>
      )}
    </>
  );
}

// ─── PRESCRIPTIONS PAGE ───────────────────────────────────────────────────────
function PrescriptionsPage({ dk }) {
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const [filter, setFilter] = useState("All");
  const [selectedQr, setSelectedQr] = useState(null);
  const [downloading, setDownloading] = useState(null);
  // Click & Collect state
  const [rxList, setRxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingRx, setSendingRx] = useState(null);
  const [ccStatuses, setCcStatuses] = useState({});

  const handleSendConfirm = async (rxId, data) => {
    // Optimistic UI
    setCcStatuses(prev => ({
      ...prev,
      [rxId]: {
        ccStatus: "sent",
        pharmacy: data.pharmacy,
        notes: data.notes
      }
    }));
    setSendingRx(null);
    // Crée la commande côté backend (non bloquant pour l'UI)
    try {
      await api.apiFetch("/pharmacy/orders/", {
        method: "POST",
        body: JSON.stringify({
          prescription: rxId,
          patient_message: data.notes || "",
          order_type: "prescription",
          withdrawal_method: "pickup",
        }),
      });
    } catch (err) {
      console.error("Erreur envoi ordonnance à la pharmacie:", err);
      // Revert optimistic state
      setCcStatuses(prev => {
        const next = { ...prev };
        delete next[rxId];
        return next;
      });
    }
  };

  useEffect(() => {
    api.getMyPrescriptions().then(data => {
      const results = Array.isArray(data) ? data : (data?.results || []);
      setRxList(results.map(rx => ({
        id: rx.id,
        doctor: rx.doctor_name || (rx.doctor ? "Dr. " + rx.doctor.last_name : "Inconnu"),
        date: rx.created_at?.split('T')[0] || "Date inconnue",
        status: rx.status || "ACTIVE",
        statusColor: (rx.status || "ACTIVE").toUpperCase() === "ACTIVE" ? "#2D8C6F" : "#E05555",
        meds: (rx.items || []).map(item => item.drug_name) || rx.medication_list || [],
      })));
    }).catch(err => {
      console.error("Erreur chargement prescriptions:", err);
      setRxList([]);
    }).finally(() => setLoading(false));
  }, []);

  const filteredRxList = rxList.filter(
    (rx) => filter === "All" || rx.status === filter.toUpperCase(),
  );

  const handleDownload = async (id) => {
    if (!id) return;
    const idStr = String(id);
    setDownloading(id);
    try {
      const blob = await api.apiFetchBlob(`/prescriptions/${idStr}/pdf-download/`);
      if (blob.type === "application/json") {
        const text = await blob.text();
        const errData = JSON.parse(text);
        throw new Error(errData.detail || "Erreur serveur");
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `ordonnance-${idStr.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Erreur PDF:", err);
    } finally {
      setDownloading(null);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRxList.length === 0 ? (
          <EmptyState
            dk={dk}
            icon={FileText}
            title="Aucune prescription"
            message={`Aucune ordonnance trouvée pour le filtre "${filter}".`}
          />
        ) : (
          filteredRxList.map((rx) => {
            const cc = ccStatuses[rx.id];
            return (
              <Card key={rx.id} dk={dk}>
                <div className="flex gap-4 flex-wrap">
                  {/* QR button */}
                  <button
                    onClick={() => setSelectedQr(rx)}
                    className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 transition-transform hover:scale-105 shadow-md active:scale-95"
                    style={{ background: "#000" }}
                  >
                    <QrCode size={36} className="text-white" />
                  </button>

                  {/* Info */}
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

                  {/* Actions */}
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
                        />
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

                    {/* Bouton envoi — visible si ACTIVE et pas encore envoyé */}
                    {rx.status === "ACTIVE" && !cc && (
                      <button
                        onClick={() => setSendingRx(rx)}
                        className="flex items-center gap-1.5 justify-center text-xs font-bold px-3 py-2 rounded-lg text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "linear-gradient(135deg, #304B71, #6492C9)" }}
                      >
                        <Send size={12} /> Envoyer
                      </button>
                    )}

                    {/* Badge "Envoyé" si déjà transmis */}
                    {cc && (
                      <div className="flex items-center gap-1.5 justify-center text-[10px] font-bold px-3 py-1.5 rounded-lg"
                        style={{ background: c.blue + "15", color: c.blue }}>
                        <CheckCircle size={11} />
                        {cc.ccStatus === "ready" ? "Prêt !" : "Transmis"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tracker Click & Collect */}
                {cc && (
                  <ClickCollectTracker
                    ccStatus={cc.ccStatus}
                    pharmacy={cc.pharmacy}
                    dk={dk}
                  />
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Modal Transmettre à une pharmacie */}
      {sendingRx && (
        <SendToPharmacyModal
          rx={sendingRx}
          dk={dk}
          onClose={() => setSendingRx(null)}
          onConfirm={(data) => handleSendConfirm(sendingRx.id, data)}
        />
      )}

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
            <div className="p-4 rounded-[32px] mb-8 bg-white border border-gray-100 shadow-xl">
              <img
                src={`${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/prescriptions/${selectedQr.id}/qr-image/`}
                alt="Prescription QR Code"
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + selectedQr.id;
                }}
              />
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
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const [cart, setCart] = useState({});
  const [pharmacyItems, setPharmacyItems] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const { globalSearch, setGlobalSearch } = useData();
  const searchTerm = globalSearch;
  const setSearchTerm = setGlobalSearch;
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    const filters = { search: debouncedSearch };
    if (activeTags.includes("CNAS")) filters.cnas_covered = "true";
    
    api.getMedications(filters).then(data => {
      const results = Array.isArray(data) ? data : (data?.results || []);
      setPharmacyItems(results.map(m => ({
        id: m.id,
        name: m.name,
        molecule: m.molecule,
        price: m.price_dzd ? `${m.price_dzd} DZD` : "—",
        stock: m.is_active ? "In Stock" : "Out of Stock",
        cnas: m.cnas_covered,
        qty: 0,
      })));
    }).catch(err => {
      console.error("Erreur chargement médicaments:", err);
      setPharmacyItems([]);
    }).finally(() => setLoading(false));
  }, [debouncedSearch, activeTags]);

  const toggleTag = (tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const cartItems = pharmacyItems.filter((item) => (cart[item.id] || 0) > 0);
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search_medication_placeholder')}
                className="outline-none text-sm bg-transparent flex-1"
                style={{ color: c.txt }}
              />
              <div className="flex gap-2">
                {["In Stock", "Generic", "CNAS"].map((tag) => {
                  const isActive = activeTags.includes(tag);
                  return (
                    <span
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="text-xs px-2.5 py-1 rounded-full cursor-pointer border transition-all"
                      style={{
                        color: isActive ? "#fff" : c.blue,
                        borderColor: isActive ? c.blue : c.border,
                        background: isActive ? c.blue : c.blueLight,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {pharmacyItems.map((item) => (
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
                      {item.stock === "In Stock" ? t('in_stock') : t('out_of_stock')}
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
                  {item.stock === "In Stock" ? t('add_to_cart') : t('unavailable')}
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
                {t('my_cart')}
              </span>
              <Badge color={c.blue} bg={c.blueLight}>
                {t('items_count', { count: cartItems.length })}
              </Badge>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: c.txt3 }}>
                {t('empty_cart')}
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
                    <span>{t('subtotal')}</span>
                    <span>{subtotal} DZD</span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: c.green }}
                  >
                    <span>{t('shifa_coverage')}</span>
                    <span>− {Math.round(subtotal * 0.6)} DZD</span>
                  </div>
                  <div
                    className="flex justify-between font-bold border-t pt-2"
                    style={{ borderColor: c.border, color: c.txt }}
                  >
                    <span>{t('total')}</span>
                    <span>{Math.round(subtotal * 0.4)} DZD</span>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

// ─── CARE TAKER PAGE ──────────────────────────────────────────────────────────
const WILAYAS_CT = ["Toutes", "Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif", "Tlemcen", "Batna", "Autres"];

const WILAYAS_LIST = [
  "Alger","Oran","Constantine","Annaba","Blida","Batna","Sétif","Tlemcen",
  "Tizi Ouzou","Béjaïa","Jijel","Médéa","Mostaganem","Bouira","Bordj Bou Arréridj",
  "Boumerdès","Tipaza","Aïn Defla","Tissemsilt","Relizane","Chlef","Skikda",
  "Guelma","Souk Ahras","El Tarf","Mila","Khenchela","Oum El Bouaghi","Tébessa",
  "Biskra","Djelfa","Laghouat","El Bayadh","Naâma","Saïda","Mascara","Tiaret",
  "Adrar","Béchar","Tamanrasset","Illizi","Tindouf","El Oued","Ouargla",
  "Ghardaïa","Aïn Témouchent","Sidi Bel Abbès","Autres",
];

function CareTakerPage({ dk }) {
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const { addNotification, globalSearch, setGlobalSearch } = useData();

  // ── Navigation ──
  const [tab, setTab] = useState("find");

  // ── Workflow d'embauche ──
  const [pendingRequest, setPendingRequest]       = useState(null);   // ct object
  const [isAccepted, setIsAccepted]               = useState(false);
  const [emergencyContactFilled, setEmergencyContactFilled] = useState(false);
  const [emergencyPhone, setEmergencyPhone]       = useState("");
  const [homeAddress, setHomeAddress]             = useState("");

  // ── Recherche & filtres ──
  const searchTerm = globalSearch;
  const setSearchTerm = setGlobalSearch;
  const [wilayaFilter, setWilayaFilter] = useState("Toutes");
  const [starFilter, setStarFilter]   = useState(1);
  const [profileModal, setProfileModal] = useState(null); // ct object

  // ── Système d'avis ──
  const [ctReviews, setCtReviews]   = useState({});
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // ── Caretakers API ──
  const [caretakers, setCaretakers] = useState([]);
  const [ctLoading, setCtLoading] = useState(true);
  const [ctError, setCtError] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { userData } = useData();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setCtLoading(true);
    const filters = {};
    if (debouncedSearch) filters.search = debouncedSearch;
    if (wilayaFilter !== "Toutes") filters.availability_area = wilayaFilter;

    api.getCaretakers(filters)
      .then(data => {
        const results = Array.isArray(data) ? data : (data?.results || []);
        const normalized = results.map(ct => ({
          id: ct.id,
          name: ct.full_name || "—",
          role: ct.certification || "Garde-malade",
          exp: ct.experience_years != null ? `${ct.experience_years} ans` : "—",
          rating: 5.0,
          reviews: 0,
          tarifSoin: ct.tarif_de_base ? `${ct.tarif_de_base} DZD` : "—",
          tarifNuit: "—",
          tarifMensuel: "—",
          zone: ct.availability_area || "—",
          wilaya: ct.availability_area || "—",
          tags: ct.services?.map(s => s.service_name) || [],
          initials: (ct.full_name?.[0] || "?").toUpperCase(),
          color: "#4A6FA5",
          bio: ct.bio || "",
          phone: "—",
        }));
        setCaretakers(normalized);
      })
      .catch(() => setCtError("Impossible de charger les gardes-malades."))
      .finally(() => setCtLoading(false));
  }, [debouncedSearch, wilayaFilter]);

  useEffect(() => {
    // 2. Fetch existing request
    api.getAdminCareRequests().then(data => {
      const results = Array.isArray(data) ? data : (data?.results || []);
      if (results.length > 0) {
        const req = results[0];
        setPendingRequest({
          id: req.caretaker,
          name: req.caretaker_name,
          initials: (req.caretaker_name?.[0] || "C").toUpperCase(),
          color: "#4A6FA5",
          role: "Garde-malade",
          exp: "—",
          rating: 5.0,
          reviews: 0,
          phone: "—",
          zone: "—",
          tags: [],
          bio: ""
        });
        setIsAccepted(req.status === 'accepted');
        if (req.status === 'accepted') {
          setTab("assigned");
        }
      }
    }).catch(err => {
      console.error("Erreur chargement demandes de soins:", err);
    });
  }, []);

  // ── Filtre des gardes-malades ──
  const filteredCT = caretakers.filter((ct) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || ct.name.toLowerCase().includes(q) || ct.role.toLowerCase().includes(q) || ct.zone.toLowerCase().includes(q);
    const matchWilaya = wilayaFilter === "Toutes" || ct.wilaya === wilayaFilter;
    const matchStars = ct.rating >= starFilter;
    return matchSearch && matchWilaya && matchStars;
  });

  const getCtReviews = (id) => ctReviews[id] || [];
  const getLiveRating = (ct) => {
    const reviews = getCtReviews(ct.id);
    if (reviews.length === 0) return { rating: ct.rating, count: ct.reviews };
    const avg = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);
    return { rating: avg, count: ct.reviews + reviews.length };
  };

  const submitReview = () => {
    if (!reviewModal || reviewStars === 0) return;
    setCtReviews(prev => ({
      ...prev,
      [reviewModal.id]: [{ stars: reviewStars, comment: reviewComment.trim() || null, date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) }, ...(prev[reviewModal.id] || [])],
    }));
    setReviewModal(null); setReviewStars(0); setReviewHover(0); setReviewComment("");
  };

  const handleAssign = (ct) => {
    setPendingRequest(ct);
    setIsAccepted(false);
    setEmergencyContactFilled(false);
    setEmergencyPhone("");
    setTab("assigned");
  };

  const handleReassign = () => {
    setPendingRequest(null); setIsAccepted(false); setEmergencyContactFilled(false); setEmergencyPhone(""); setHomeAddress("");
    setTab("find");
  };

  const handleFinalize = () => {
    const phoneOk = emergencyPhone.replace(/\D/g, "").length >= 9;
    const addrOk  = homeAddress.trim().length >= 5;
    if (phoneOk && addrOk) setEmergencyContactFilled(true);
  };

  return (
    <>
      {/* ── Modal Avis Garde-Malade ── */}
      {reviewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setReviewModal(null); setReviewStars(0); setReviewHover(0); setReviewComment(""); } }}>
          <div className="rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border"
            style={{ background: c.card, borderColor: c.border }}>
            <div className="p-6 border-b" style={{ borderColor: c.border }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.blue + "15" }}>
                    <Star size={18} style={{ color: c.blue }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: c.txt }}>Laisser un avis</h3>
                    <p className="text-xs" style={{ color: c.txt3 }}>{reviewModal.name}</p>
                  </div>
                </div>
                <button onClick={() => { setReviewModal(null); setReviewStars(0); setReviewHover(0); setReviewComment(""); }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70"
                  style={{ background: c.blueLight }}>
                  <X size={15} style={{ color: c.txt3 }} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: c.txt3 }}>Votre note</p>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setReviewStars(n)}
                      onMouseEnter={() => setReviewHover(n)} onMouseLeave={() => setReviewHover(0)}
                      className="text-3xl transition-transform hover:scale-110 active:scale-95">
                      <span style={{ color: n <= (reviewHover || reviewStars) ? "#E8A838" : (dk ? "#ffffff22" : "#e2e8f0") }}>★</span>
                    </button>
                  ))}
                  {reviewStars > 0 && (
                    <span className="ml-2 text-sm font-black" style={{ color: "#E8A838" }}>
                      {["Très mauvais","Mauvais","Correct","Bien","Excellent"][reviewStars - 1]}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt3 }}>Commentaire (optionnel)</p>
                <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce garde-malade..."
                  rows={3} className="w-full rounded-xl border px-4 py-3 text-sm resize-none focus:outline-none"
                  style={{ background: c.bg, borderColor: c.border, color: c.txt }} />
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={submitReview} disabled={reviewStars === 0}
                className="flex-1 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${c.blue}, #304B71)` }}>
                <Check size={16} /> Publier l'avis
              </button>
              <button onClick={() => { setReviewModal(null); setReviewStars(0); setReviewHover(0); setReviewComment(""); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: c.border, color: c.txt2 }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Profil Garde-Malade ── */}
      {profileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setProfileModal(null); }}>
          <div className="rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border"
            style={{ background: c.card, borderColor: c.border }}>
            <div className="p-6 border-b" style={{ borderColor: c.border }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ background: profileModal.color }}>
                  {profileModal.initials}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold" style={{ color: c.txt }}>{profileModal.name}</h2>
                  <p className="text-sm font-semibold" style={{ color: c.blue }}>{profileModal.role} · {profileModal.exp}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <button onClick={() => { setReviewModal(profileModal); setProfileModal(null); }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:scale-105 transition-all"
                      style={{ background: "#E8A83818" }} title="Laisser un avis">
                      <span className="text-sm font-black" style={{ color: "#E8A838" }}>★ {getLiveRating(profileModal).rating}</span>
                    </button>
                    <span className="text-xs" style={{ color: c.txt3 }}>{getLiveRating(profileModal).count} avis</span>
                  </div>
                </div>
                <button onClick={() => setProfileModal(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70"
                  style={{ background: c.blueLight }}>
                  <X size={15} style={{ color: c.txt3 }} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>À propos</p>
                <p className="text-sm" style={{ color: c.txt2 }}>{profileModal.bio}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>Spécialités</p>
                <div className="flex flex-wrap gap-2">
                  {profileModal.tags.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ background: c.blueLight, color: c.blue }}>{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>Tarifs</p>
                <div className="flex flex-wrap gap-4">
                  <span className="text-sm font-semibold" style={{ color: c.green }}>Soin : {profileModal.tarifSoin}</span>
                  <span className="text-sm font-semibold" style={{ color: c.amber }}>Nuit : {profileModal.tarifNuit}</span>
                  {profileModal.tarifMensuel && (
                    <span className="text-sm font-semibold" style={{ color: c.blue }}>Mensuel : {profileModal.tarifMensuel}</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt3 }}>Contact</p>
                <a href={`tel:${profileModal.phone}`}
                  className="text-sm font-medium flex items-center gap-2 hover:opacity-75 transition-opacity w-fit"
                  style={{ color: c.green }}>
                  <Phone size={13} /> {profileModal.phone}
                </a>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profileModal.zone)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs mt-1 flex items-center gap-2 hover:opacity-75 transition-opacity w-fit"
                  style={{ color: c.blue }}>
                  <MapPin size={12} /> {profileModal.zone}
                </a>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: c.txt3 }}>Avis des patients</p>
                  <button onClick={() => { setReviewModal(profileModal); setProfileModal(null); }}
                    className="text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:opacity-80"
                    style={{ background: c.blue + "15", color: c.blue }}>
                    <Plus size={11} /> Laisser un avis
                  </button>
                </div>
                {getCtReviews(profileModal.id).length === 0 ? (
                  <p className="text-xs italic" style={{ color: c.txt3 }}>Aucun avis pour l'instant.</p>
                ) : (
                  <div className="space-y-2.5">
                    {getCtReviews(profileModal.id).map((r, idx) => (
                      <div key={idx} className="rounded-xl p-3 border" style={{ borderColor: c.border, background: c.bg }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-black" style={{ color: "#E8A838" }}>{"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}</span>
                          <span className="text-[10px] font-medium" style={{ color: c.txt3 }}>{r.date}</span>
                        </div>
                        {r.comment && <p className="text-xs" style={{ color: c.txt2 }}>{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => { handleAssign(profileModal); setProfileModal(null); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90"
                style={{ background: c.blue }}>
                Envoyer une demande
              </button>
              <button onClick={() => setProfileModal(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border hover:opacity-80"
                style={{ borderColor: c.border, color: c.txt2 }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── En-tête ── */}
      <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: c.txt }}>Garde-Malade</h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>Gérez votre garde-malade assigné</p>
        </div>
        {pendingRequest && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border"
            style={isAccepted
              ? { background: c.green + "15", borderColor: c.green + "40", color: c.green }
              : { background: c.amber + "15", borderColor: c.amber + "40", color: c.amber }}>
            {isAccepted ? <><CheckCircle size={13} /> Offre acceptée</> : <><Clock size={13} /> En attente de réponse</>}
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b mb-6" style={{ borderColor: c.border }}>
        {["assigned", "find"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2.5 text-sm font-semibold transition-all"
            style={{ color: tab === t ? c.blue : c.txt2, borderBottom: tab === t ? `2px solid ${c.blue}` : "2px solid transparent", marginBottom: -1 }}>
            {t === "assigned" ? "Mon Garde-Malade" : "Trouver un Garde-Malade"}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          ONGLET : MON GARDE-MALADE
      ══════════════════════════════════════════════════════════ */}
      {tab === "assigned" && (
        <>
          {!pendingRequest ? (
            /* État vide */
            <Card dk={dk} className="flex flex-col items-center justify-center min-h-[340px] text-center py-16">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: c.blueLight }}>
                <User size={36} style={{ color: c.blue, opacity: 0.6 }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: c.txt }}>Aucun garde-malade assigné</h2>
              <p className="text-sm max-w-sm mb-7" style={{ color: c.txt2 }}>
                Parcourez la liste et cliquez sur "Assigner" pour envoyer une demande à un garde-malade.
              </p>
              <button onClick={() => setTab("find")}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md active:scale-95"
                style={{ background: c.blue }}>
                Trouver un Garde-Malade →
              </button>
            </Card>

          ) : !isAccepted ? (
            /* ── ÉTAPE 1 : En attente de réponse du garde-malade ── */
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Carte "En attente" */}
              <div className="rounded-2xl p-6 border-2 flex flex-col md:flex-row items-start md:items-center gap-5"
                style={{ background: c.amber + "08", borderColor: c.amber + "40" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ background: pendingRequest.color + "80" }}>
                  {pendingRequest.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h2 className="text-lg font-bold" style={{ color: c.txt }}>{pendingRequest.name}</h2>
                    <span className="text-xs font-bold px-3 py-1 rounded-full border animate-pulse"
                      style={{ background: c.amber + "18", borderColor: c.amber + "40", color: c.amber }}>
                      ⏳ En attente de réponse du garde-malade
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: c.txt2 }}>{pendingRequest.role} · {pendingRequest.exp} · ⭐ {pendingRequest.rating}</p>
                  <p className="text-xs mt-0.5" style={{ color: c.txt3 }}>📍 {pendingRequest.zone} · {pendingRequest.tarifSoin}</p>
                  <p className="text-xs mt-3 italic" style={{ color: c.txt3 }}>
                    Votre demande a bien été envoyée. Le garde-malade examinera votre profil médical avant d'accepter ou de refuser.
                  </p>
                </div>
                <button onClick={handleReassign}
                  className="text-xs font-semibold px-4 py-2 rounded-xl border transition-colors hover:opacity-80 shrink-0"
                  style={{ borderColor: c.border, color: c.txt2 }}>
                  Annuler la demande
                </button>
              </div>

              {/* Bouton pour simuler l'acceptation (mock UI) */}
              <Card dk={dk} className="border-dashed">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-sm font-bold" style={{ color: c.txt }}>Simulation pour test UI</p>
                    <p className="text-xs mt-0.5" style={{ color: c.txt3 }}>Cliquez pour simuler que le garde-malade a accepté votre demande.</p>
                  </div>
                  <button onClick={() => {
                    setIsAccepted(true);
                    addNotification(
                      "Nouvelle mission assignée",
                      `${pendingRequest?.name || "Un garde-malade"} a accepté votre demande de soins.`,
                      "success"
                    );
                  }}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md active:scale-95"
                    style={{ background: c.green }}>
                    ✓ Simuler l'acceptation
                  </button>
                </div>
              </Card>
            </div>

          ) : !emergencyContactFilled ? (
            /* ── ÉTAPE 2 : Offre acceptée — saisir numéro d'urgence ── */
            <div className="animate-in fade-in duration-300 space-y-5">
              {/* Bannière acceptée */}
              <div className="rounded-2xl p-6 flex items-center gap-5 flex-wrap"
                style={{ background: `linear-gradient(135deg, ${pendingRequest.color}, ${pendingRequest.color}cc)` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)" }}>
                  {pendingRequest.initials}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg">{pendingRequest.name}</p>
                  <p className="text-white/80 text-sm">{pendingRequest.role} · ⭐ {pendingRequest.rating}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>
                  ✓ Offre Acceptée
                </span>
              </div>

              {/* Carte bloquante : numéro d'urgence + adresse */}
              <Card dk={dk} className="border-2" style={{ borderColor: c.blue + "40" }}>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: c.blue + "15" }}>
                    <Phone size={22} style={{ color: c.blue }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: c.txt }}>
                      🎉 Offre acceptée ! Dernière étape…
                    </h3>
                    <p className="text-sm" style={{ color: c.txt2 }}>
                      Renseignez votre <strong style={{ color: c.txt }}>adresse domicile</strong> et un <strong style={{ color: c.txt }}>numéro d'urgence</strong> pour finaliser l'assignation.
                    </p>
                  </div>
                </div>

                {/* Adresse domicile */}
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt2 }}>
                    Adresse complète du domicile *
                  </label>
                  <input
                    type="text"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    placeholder="Ex: 12 Rue Didouche Mourad, Alger-Centre"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all focus:ring-2"
                    style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: homeAddress.trim().length >= 5 ? c.green : homeAddress.length > 0 ? c.amber : c.border, color: c.txt }}
                  />
                  {homeAddress.length > 0 && homeAddress.trim().length < 5 && (
                    <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: c.amber }}>
                      <AlertCircle size={11} /> Adresse trop courte
                    </p>
                  )}
                </div>

                {/* Numéro d'urgence */}
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.txt2 }}>
                    Numéro d'urgence (Famille / Proche) *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.txt3 }} />
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value.replace(/[^\d\s+]/g, ""))}
                      placeholder="+213 555 123 456"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-all focus:ring-2"
                      style={{ background: dk ? "#1A2333" : "#F8FAFC", borderColor: emergencyPhone.replace(/\D/g, "").length >= 9 ? c.green : emergencyPhone.length > 0 ? c.amber : c.border, color: c.txt }}
                    />
                  </div>
                  {emergencyPhone.length > 0 && emergencyPhone.replace(/\D/g, "").length < 9 && (
                    <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: c.amber }}>
                      <AlertCircle size={11} /> Numéro incomplet (minimum 9 chiffres)
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleFinalize}
                    disabled={emergencyPhone.replace(/\D/g, "").length < 9 || homeAddress.trim().length < 5}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: c.blue }}>
                    <CheckCircle size={16} /> Finaliser l'assignation
                  </button>
                  <button onClick={handleReassign}
                    className="px-5 py-3 rounded-xl text-sm font-semibold border hover:opacity-80"
                    style={{ borderColor: c.border, color: c.txt2 }}>
                    Annuler
                  </button>
                </div>
              </Card>
            </div>

          ) : (
            /* ── ÉTAPE 3 : Vue complète Mon Garde-Malade ── */
            <div className="animate-in fade-in duration-300 space-y-5">
              {/* Bannière principale */}
              <div className="rounded-2xl p-6 flex items-center gap-5 flex-wrap"
                style={{ background: `linear-gradient(135deg, ${pendingRequest.color}, ${pendingRequest.color}cc)` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)" }}>
                  {pendingRequest.initials}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg">{pendingRequest.name}</p>
                  <p className="text-white/80 text-sm">{pendingRequest.role} · ⭐ {pendingRequest.rating} · {pendingRequest.exp} d'expérience</p>
                  <p className="text-white/70 text-xs mt-0.5">📍 {pendingRequest.zone} · {pendingRequest.tarifSoin} · Nuit : {pendingRequest.tarifNuit}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button onClick={() => setReviewModal(pendingRequest)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
                      style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}>
                      ⭐ Laisser un avis
                    </button>
                    <a
                      href={`tel:${pendingRequest.phone}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1"
                      style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}>
                      📞 {pendingRequest.phone}
                    </a>
                    <button onClick={handleReassign}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
                      🔄 Réassigner
                    </button>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>✓ Assigné</span>
              </div>

              {/* Info urgence + adresse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                  style={{ background: c.green + "08", borderColor: c.green + "30" }}>
                  <Phone size={15} style={{ color: c.green }} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: c.green }}>Urgence</p>
                    <a href={`tel:${emergencyPhone.replace(/\s/g, "")}`}
                      className="text-sm font-bold hover:underline"
                      style={{ color: c.txt }}>{emergencyPhone}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                  style={{ background: c.blue + "08", borderColor: c.blue + "30" }}>
                  <MapPin size={15} style={{ color: c.blue }} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: c.blue }}>Domicile</p>
                    <p className="text-sm font-medium" style={{ color: c.txt }}>{homeAddress}</p>
                  </div>
                </div>
              </div>

              {/* Carte info du garde-malade assigné (minimaliste) */}
              <Card dk={dk}>
                <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: c.txt3 }}>Informations de contact</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: c.txt2 }}>Zone d'intervention</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pendingRequest.zone)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold flex items-center gap-1 hover:underline"
                      style={{ color: c.blue }}>
                      <MapPin size={12} /> {pendingRequest.zone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: c.border }}>
                    <span className="text-sm" style={{ color: c.txt2 }}>Téléphone direct</span>
                    <a
                      href={`tel:${pendingRequest.phone}`}
                      className="flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-xl transition-colors hover:opacity-90"
                      style={{ background: c.green + "15", color: c.green }}>
                      <Phone size={13} /> {pendingRequest.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: c.border }}>
                    <span className="text-sm" style={{ color: c.txt2 }}>Tarifs</span>
                    <div className="flex flex-wrap gap-3 justify-end">
                      <span className="text-xs font-semibold" style={{ color: c.green }}>Soin : {pendingRequest.tarifSoin}</span>
                      <span className="text-xs font-semibold" style={{ color: c.amber }}>Nuit : {pendingRequest.tarifNuit}</span>
                      {pendingRequest.tarifMensuel && (
                        <span className="text-xs font-semibold" style={{ color: c.blue }}>Mensuel : {pendingRequest.tarifMensuel}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: c.border }}>
                    <span className="text-sm" style={{ color: c.txt2 }}>Avis</span>
                    <button onClick={() => setReviewModal(pendingRequest)}
                      className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl"
                      style={{ background: "#E8A83818", color: "#E8A838" }}>
                      ⭐ Laisser un avis
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          ONGLET : TROUVER UN GARDE-MALADE
      ══════════════════════════════════════════════════════════ */}
      {tab === "find" && (
        <div className="space-y-6">

          {/* ── Grande barre de recherche ── */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: c.txt3 }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, spécialité ou zone..."
              className="w-full pl-12 pr-5 py-3.5 rounded-2xl text-sm outline-none border transition-all"
              style={{ background: c.card, borderColor: searchTerm ? c.blue : c.border, color: c.txt, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            />
          </div>

          {/* ── Filtres ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wilaya */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt2 }}>Wilaya</label>
              <DashSelect
                value={wilayaFilter === "Toutes" ? "" : wilayaFilter}
                options={WILAYAS_CT}
                onSelect={(v) => setWilayaFilter(v)}
                dk={dk} c={c}
                placeholder="Toutes les wilayas"
              />
            </div>

            {/* Note minimale */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.txt2 }}>Note minimum</label>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border w-fit"
                style={{ background: c.card, borderColor: c.border }}>
                <span className="text-xs font-medium" style={{ color: c.txt3 }}>Note min :</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setStarFilter(star)}
                      className="text-lg leading-none transition-colors"
                      style={{ color: star <= starFilter ? "#E8A838" : c.border }}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Error banner ── */}
          {ctError && (
            <div className="px-4 py-3 rounded-xl text-sm font-medium border"
              style={{ background: c.amberLight, color: c.amber, borderColor: c.amber + "44" }}>
              {ctError}
            </div>
          )}

          {/* ── Résultats ── */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: c.txt3 }}>
              {ctLoading ? "Chargement…" : `${filteredCT.length} garde-malade${filteredCT.length !== 1 ? "s" : ""} trouvé${filteredCT.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="space-y-4">
            {ctLoading ? (
              <div className="flex items-center justify-center py-16 opacity-50">
                <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: c.blue, borderTopColor: "transparent" }} />
              </div>
            ) : filteredCT.length === 0 ? (
              <Card dk={dk} className="text-center py-12">
                <Search size={32} style={{ color: c.txt3, opacity: 0.4 }} className="mx-auto mb-3" />
                <p className="font-semibold" style={{ color: c.txt }}>Aucun résultat</p>
                <p className="text-sm mt-1" style={{ color: c.txt3 }}>Essayez d'autres filtres ou une recherche différente.</p>
              </Card>
            ) : filteredCT.map((ct) => {
              const isPending = pendingRequest?.id === ct.id;
              const live = getLiveRating(ct);
              return (
                <Card key={ct.id} dk={dk} className="hover:shadow-md transition-shadow group">
                  <div className="flex gap-4 flex-wrap">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ background: ct.color }}>
                      {ct.initials}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold group-hover:text-blue-500 transition-colors" style={{ color: c.txt }}>{ct.name}</p>
                      <p className="text-sm" style={{ color: c.txt2 }}>{ct.role} · {ct.exp}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <button onClick={() => setReviewModal(ct)}
                          className="flex items-center gap-1 text-xs font-bold hover:scale-105 transition-transform"
                          style={{ color: "#E8A838" }} title="Laisser un avis">
                          ★ {live.rating}
                          <span className="font-normal" style={{ color: c.txt3 }}>({live.count} avis)</span>
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ct.zone)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs hover:underline"
                          style={{ color: c.txt3 }}
                          title="Ouvrir dans Google Maps">
                          <MapPin size={11} /> {ct.zone}
                        </a>
                      </div>
                      <div className="flex gap-3 mt-1 flex-wrap">
                        <span className="text-xs font-semibold" style={{ color: c.green }}>Soin : {ct.tarifSoin}</span>
                        <span className="text-xs font-semibold" style={{ color: c.amber }}>Nuit : {ct.tarifNuit}</span>
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {ct.tags.map((t) => (
                          <span key={t} className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: c.blueLight, color: c.blue }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 justify-center">
                      <button onClick={() => setProfileModal(ct)}
                        className="text-xs font-semibold px-4 py-2 rounded-xl border transition-colors hover:opacity-80"
                        style={{ color: c.txt2, borderColor: c.border }}>
                        {t('view_profile')}
                      </button>
                      <button onClick={() => handleAssign(ct)}
                        className="text-xs font-bold px-4 py-2 rounded-xl text-white shadow-md active:scale-95 hover:opacity-90"
                        style={{ background: isPending ? c.amber : c.blue }}>
                        {isPending ? `⏳ ${t('pending')}` : t('assign')}
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage({ dk, notifications, setNotifications }) {
  const { t } = useLanguage();
  const c = dk ? T.dark : T.light;
  const { globalNotifications = [] } = useData();

  const mergedNotifications = useMemo(() => {
    const adapted = globalNotifications.map((n) => ({
      id: "g_" + n.id,
      title: n.title,
      message: n.message,
      is_read: n.read,
      created_at: n.createdAt instanceof Date ? n.createdAt.toISOString() : new Date().toISOString(),
      type: n.type,
    }));
    const combined = [...(notifications || []), ...adapted];
    return combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [notifications, globalNotifications]);

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
            {t('notifications')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
            {t('stay_updated')}
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="text-sm font-semibold px-4 py-2 rounded-xl border"
          style={{ color: c.blue, borderColor: c.border }}
        >
          {t('mark_all_read')}
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
        {mergedNotifications.map((n) => {
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
  const { t, lang, setLang } = useLanguage();
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

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
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
      await api.changePassword(pwdForm);
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
          {t('settings')}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: c.txt2 }}>
          {t('admin_settings_desc')}
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
              <DashSelect
                label="Wilaya"
                value={form.city}
                options={WILAYAS_LIST}
                onSelect={(v) => setForm((f) => ({ ...f, city: v }))}
                dk={dk}
                c={c}
                placeholder="Sélectionner une wilaya..."
              />
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: c.blue, opacity: isSaving ? 0.7 : 1 }}
            >
              {isSaving ? "..." : t('save_changes')}
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
              {t('language')}
            </p>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "fr", label: "Français", flag: "🇫🇷" },
                { id: "en", label: "English", flag: "🇬🇧" }
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                  style={{
                    background: lang === l.id ? c.blue : "transparent",
                    color: lang === l.id ? "#fff" : c.txt2,
                    borderColor: lang === l.id ? c.blue : c.border,
                  }}
                >
                  {l.flag} {l.label}
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
  const { t } = useLanguage();
  const { userData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dk = theme === "dark";
  const { globalNotifications = [], markAllNotificationsRead, addNotification, unreadChatCount, setUnreadChatCount } = useData();
  const [page, setPage] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // ── Chat state ──
  const [activeConv, setActiveConv] = useState(null);

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
            if (import.meta.env.DEV) console.warn("Appointments fetch failed:", err);
            return [];
          }),
          api.getMedicalProfile().catch((err) => {
            if (import.meta.env.DEV) console.warn("Medical Profile not found or error:", err);
            return null;
          }),
          api.getNotifications().catch((err) => {
            if (import.meta.env.DEV) console.warn("Notifications fetch failed:", err);
            return [];
          }),
        ]);
        setAppointments(Array.isArray(appts) ? appts : []);
        setMedicalProfile(profile);
        setNotifications(Array.isArray(notifs) ? notifs : []);
      } catch (err) {
        if (import.meta.env.DEV) console.error("Critical error in PatientDashboard fetchData:", err);
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
      : (t('my_account') || "Mon Compte");

  const NAV = [
    { id: "dashboard",       label: t('dashboard')       },
    { id: "medical-profile", label: t('medical_profile') },
    { id: "ai-diagnosis",    label: t('ai_diagnosis')    },
    { id: "appointments",    label: t('appointments')    },
    { id: "prescriptions",   label: t('prescriptions')   },
    { id: "pharmacy",        label: t('pharmacy')        },
    { id: "care-taker",      label: t('care_taker')      },
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
            userData={userData}
          />
        );
      case "ai-diagnosis":
        return <AIDiagnosisPage dk={dk} firstName={userData?.first_name || "Guest"} setPage={setPage} />;

      case "appointments":
        return <AppointmentsPage {...props} />;
      case "prescriptions":
        return <PrescriptionsPage dk={dk} />;
      case "pharmacy":
        return <PharmacyPage dk={dk} />;
      case "care-taker":
        return <CareTakerPage dk={dk} />;
      case "messages":
        return (
          <div className="flex gap-5" style={{ height: "calc(100vh - 120px)", minHeight: 500 }}>
            {/* ConversationList — 30% */}
            <div
              className="rounded-2xl border overflow-hidden shrink-0 flex flex-col"
              style={{ width: "30%", minWidth: 260, background: c.card, borderColor: c.border }}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0" style={{ borderColor: c.border }}>
                <MessageSquare size={15} style={{ color: c.blue }} />
                <h2 className="font-bold text-sm" style={{ color: c.txt }}>{t('nav_messages') || "Messages"}</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <ConversationList
                  open={true}
                  onClose={() => {}}
                  onSelectConv={(conv) => setActiveConv(conv)}
                  isPatient={true}
                  onUnreadChange={(n) => setUnreadChatCount(n)}
                  c={c}
                  dk={dk}
                  inline={true}
                />
              </div>
            </div>
            {/* ChatWindow — 70% */}
            <div className="flex-1 min-w-0">
              {activeConv ? (
                <ChatWindow
                  conv={activeConv}
                  onClose={() => setActiveConv(null)}
                  onBack={null}
                  c={c}
                  dk={dk}
                  embedded={true}
                />
              ) : (
                <div
                  className="h-full rounded-2xl border flex flex-col items-center justify-center gap-4"
                  style={{ background: c.card, borderColor: c.border }}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: c.blueLight }}>
                    <MessageSquare size={28} style={{ color: c.blue }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: c.txt3 }}>
                    {t('select_conversation_desc') || "Sélectionnez une conversation"}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "notifications":
        return (
          <NotificationsPage
            dk={dk}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        );
      case "settings":
        return (
          <SettingsPage
            dk={dk}
            onToggleDark={toggleTheme}
            userData={userData}
          />
        );
      default:
        return <DashboardPage {...props} />;
    }
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: c.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: c.txt,
        transition: "background 0.3s, color 0.2s",
      }}
    >
      <ParticlesHero darkMode={dk} />
      <div className="relative z-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { transition: background-color 0.2s, border-color 0.2s; }
        button { cursor: pointer !important; }
        select { cursor: pointer !important; }
        label { cursor: pointer !important; }
        a { cursor: pointer !important; }
        .nav-link:not(.active-nav):hover { background: rgba(100,146,201,0.15) !important; color: #6492C9 !important; }
      `}</style>

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
            {/* Messages Icon Button */}
            <button
              onClick={() => setPage("messages")}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-blue-50 dark:hover:bg-white/5 border"
              style={{ 
                borderColor: page === "messages" ? c.blue + "44" : c.border, 
                background: page === "messages" ? c.blue + "11" : "transparent" 
              }}
              title={t('messages') || "Messages"}
            >
              <MessageSquare size={18} style={{ color: page === "messages" ? c.blue : c.txt2 }} />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: c.red, fontSize: 9 }}>
                  {unreadChatCount > 9 ? "9+" : unreadChatCount}
                </span>
              )}
            </button>
            {/* Profile button — red dot on border corner for notifications */}
            <div className="relative">
              {/* Red dot — API notifications + global notifications */}
              {(notifications.filter(n => !n.is_read && n.unread !== false).length +
                globalNotifications.filter(n => !n.read).length) > 0 && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 z-10 flex items-center justify-center"
                  style={{
                    background: c.red,
                    borderColor: c.nav,
                    fontSize: 7,
                    color: "#fff",
                    fontWeight: 800,
                    pointerEvents: "none",
                  }}
                >
                  {notifications.filter(n => !n.is_read && n.unread !== false).length +
                   globalNotifications.filter(n => !n.read).length}
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
                      {t('nav_settings') || "Settings"}
                    </button>
                    {/* Dark mode */}
                    <button className="pd-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl cursor-pointer">
                      <Sun
                        size={14}
                        style={{ color: dk ? c.txt3 : "#E8A838" }}
                      />
                      <button
                        onClick={toggleTheme}
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
                      {t('logout_btn') || "Logout"}
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
      <main className={`w-full ${page === "ai-diagnosis" ? "px-0 py-0" : "px-6 py-6"}`}>
        <ErrorBoundary>{renderPage()}</ErrorBoundary>
      </main>

      {/* Close dropdown on outside click */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setProfileOpen(false)}
        />
      )}

      {/* Chat géré dans renderPage() — case "messages" */}
    </div>
    </div>
  );
}
