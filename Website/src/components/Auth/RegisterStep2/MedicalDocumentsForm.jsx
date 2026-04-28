import { useState } from "react";
import { Stethoscope, Pill, Users } from "lucide-react";
import StepBar from "./StepBar";
import { MEDICAL_STEPS } from "./MedicalForm";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";

function UploadZone({ id, label, value, onChange, error, c }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-1">
      <label className="text-[12px] font-medium block" style={{ color: c.label }}>{label}</label>
      <div className="relative">
        <input type="file" id={id} accept=".jpg,.jpeg,.png,.pdf" onChange={onChange} className="hidden" />
        <label htmlFor={id}
          className="flex flex-col items-center justify-center w-full min-h-[90px] rounded-xl border-2 border-dashed cursor-pointer transition-all"
          style={{
            borderColor: error ? "#f87171" : value ? c.blue : c.border,
            background:  error ? "rgba(248,113,113,0.05)" : value ? `${c.blue}18` : c.uploadBg,
          }}
        >
          <div className="w-7 h-7 rounded border flex items-center justify-center mb-1.5"
            style={{ borderColor: value ? c.blue : c.border, background: c.inputBg }}>
            <span className="font-bold text-base" style={{ color: value ? c.blue : c.iconMuted }}>+</span>
          </div>
          <span className="font-semibold text-[13px] mb-0.5" style={{ color: value ? c.blue : c.txt2 }}>
            {value ? t('auth.register.activity.documentAdded') : t('auth.register.activity.uploadDoc')}
          </span>
          <span className="text-[11px]" style={{ color: c.txt3 }}>{t('auth.register.activity.filesHint')}</span>
        </label>
      </div>
      {error && <p className="text-[11px] text-red-400 text-center">{error}</p>}
    </div>
  );
}

function TextField({ name, label, placeholder, value, onChange, error, c }) {
  return (
    <div className="space-y-1">
      <label className="text-[12px] font-medium block" style={{ color: c.label }}>{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3.5 py-[10px] rounded-xl border-2 text-sm outline-none transition-all ${c.ph} ${error ? "border-red-400" : c.inputBorder}`}
        style={{ background: c.inputBg, color: c.txt }}
      />
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

const ROLE_CONFIG = {
  "Médecin":      { icon: <Stethoscope size={16} />, color: "#638ECB", title: "Médecin" },
  "Pharmacien":   { icon: <Pill size={16} />,        color: "#4CAF82", title: "Pharmacien" },
  "Garde-malade": { icon: <Users size={16} />,       color: "#9B7FD4", title: "Garde-Malade" },
};

// Mapping clé backend → label lisible pour le bloc récapitulatif
const FIELD_LABELS = {
  id_card_recto:            "CIN Recto",
  id_card_verso:            "CIN Verso",
  photo:                    "Photo de profil",
  wilaya:                   "Wilaya",
  practice_authorization:   "Autorisation d'exercer",
  registre_commerce:        "Registre de commerce",
  specialty:                "Spécialité",
  order_number:             "N° d'inscription Ordre",
  clinic_name:              "Nom du cabinet",
  experience_years:         "Années d'expérience",
  cnas_coverage:            "Conventionné CNAS",
  email:                    "Email",
  phone:                    "Téléphone",
  address:                  "Adresse",
  postal_code:              "Code postal",
  city:                     "Ville",
  non_field_errors:         "Erreur générale",
};

// Clés gérées inline selon le rôle (pas dans le récapitulatif)
const INLINE_KEYS = {
  "Médecin":      [],
  "Pharmacien":   ["agreement_scan", "order_registration_number"],
  "Garde-malade": ["criminal_record_scan"],
};

export default function MedicalDocumentsForm({ onComplete, onBack, medicalRole = "Médecin", serverErrors = {} }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  const c = isDark ? {
    bg:          "#0D1117",
    inputBg:     "rgba(255,255,255,0.08)",
    inputBorder: "border-white/15 focus:border-[#638ECB]",
    border:      "rgba(255,255,255,0.15)",
    uploadBg:    "rgba(255,255,255,0.04)",
    txt:         "#FFFFFF",
    txt2:        "rgba(255,255,255,0.7)",
    txt3:        "rgba(255,255,255,0.35)",
    label:       "rgba(255,255,255,0.7)",
    iconMuted:   "rgba(255,255,255,0.3)",
    blue:        "#638ECB",
    div:         "rgba(255,255,255,0.12)",
    divTxt:      "rgba(255,255,255,0.45)",
    ph:          "placeholder-white/40",
  } : {
    bg:          "#F0F4F8",
    inputBg:     "#ffffff",
    inputBorder: "border-[#E4EAF5] focus:border-[#4A6FA5]",
    border:      "#E4EAF5",
    uploadBg:    "transparent",
    txt:         "#0D1B2E",
    txt2:        "#5A6E8A",
    txt3:        "#9AACBE",
    label:       "#5A6E8A",
    iconMuted:   "#9AACBE",
    blue:        "#4A6FA5",
    div:         "#E4EAF5",
    divTxt:      "#9AACBE",
    ph:          "placeholder-gray-400",
  };

  const config = ROLE_CONFIG[medicalRole] || ROLE_CONFIG["Médecin"];

  const [formData, setFormData] = useState({
    diplomaFile: null,
    criminalRecordFile: null,
    agreementFile: null,
    orderNumber: "",
  });
  const [errors, setErrors] = useState({});

  const handleFile = (key) => (e) => {
    setFormData((p) => ({ ...p, [key]: e.target.files[0] }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const handleText = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (medicalRole === "Médecin") {
      if (!formData.diplomaFile) newErrors.diplomaFile = t('auth.register.fieldRequired');
    } else if (medicalRole === "Garde-malade") {
      if (!formData.criminalRecordFile) newErrors.criminalRecordFile = t('auth.register.fieldRequired');
      if (!formData.diplomaFile)        newErrors.diplomaFile        = t('auth.register.fieldRequired');
    } else if (medicalRole === "Pharmacien") {
      if (!formData.agreementFile)      newErrors.agreementFile      = t('auth.register.fieldRequired');
      if (!formData.orderNumber.trim()) newErrors.orderNumber        = t('auth.register.fieldRequired');
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onComplete({ ...formData, medicalRole });
  };

  const handleDevFill = () => {
    const f = new File([""], "dev.pdf", { type: "application/pdf" });
    const d = medicalRole === "Médecin"
      ? { diplomaFile: f }
      : medicalRole === "Pharmacien"
      ? { agreementFile: f, orderNumber: "161234" }
      : { criminalRecordFile: f, diplomaFile: f };
    onComplete({ ...d, medicalRole });
  };

  const sectionTitle = medicalRole === "Pharmacien"
    ? t('auth.register.documents.agreementTitle')
    : t('auth.register.documents.title');

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ background: c.bg }}
    >
      <div className="w-full max-w-[480px]">

        <StepBar steps={MEDICAL_STEPS} current={5} />

        {/* Badge rôle */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: c.div }} />
          <div className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wide uppercase" style={{ color: config.color }}>
            {config.icon} {config.title}
          </div>
          <div className="flex-1 h-px" style={{ background: c.div }} />
        </div>

        <p className="text-center text-[13px] mb-6" style={{ color: c.txt2 }}>
          {sectionTitle}
        </p>

        {/* ── Récapitulatif des erreurs serveur non gérées inline ────────────── */}
        {(() => {
          const inlineKeys = new Set(INLINE_KEYS[medicalRole] || []);
          const summaryEntries = Object.entries(serverErrors).filter(([k]) => !inlineKeys.has(k));
          if (!summaryEntries.length) return null;
          return (
            <div className="mb-5 rounded-xl border px-4 py-3 space-y-1"
              style={{ borderColor: "#f87171", background: "rgba(248,113,113,0.07)" }}>
              {summaryEntries.map(([key, msgs]) => (
                <p key={key} className="text-[12px] text-red-400">
                  <span className="font-semibold">{FIELD_LABELS[key] || key} :</span>{" "}
                  {Array.isArray(msgs) ? msgs[0] : msgs}
                </p>
              ))}
            </div>
          );
        })()}

        {medicalRole === "Médecin" && (
          <div className="space-y-3 mb-6">
            <UploadZone id="doc-diploma" label={t('auth.register.activity.diplomaCopy')}
              value={formData.diplomaFile} onChange={handleFile("diplomaFile")} error={errors.diplomaFile} c={c} />
          </div>
        )}

        {medicalRole === "Garde-malade" && (
          <div className="space-y-3 mb-6">
            <UploadZone id="doc-criminal" label={t('auth.register.documents.criminalRecord')}
              value={formData.criminalRecordFile} onChange={handleFile("criminalRecordFile")}
              error={errors.criminalRecordFile || serverErrors?.criminal_record_scan?.[0]} c={c} />
            <UploadZone id="doc-diploma" label={t('auth.register.activity.diplomaCopy')}
              value={formData.diplomaFile} onChange={handleFile("diplomaFile")} error={errors.diplomaFile} c={c} />
          </div>
        )}

        {medicalRole === "Pharmacien" && (
          <div className="space-y-3 mb-6">
            <UploadZone id="doc-agreement" label={t('auth.register.documents.agreementScan')}
              value={formData.agreementFile} onChange={handleFile("agreementFile")}
              error={errors.agreementFile || serverErrors?.agreement_scan?.[0]} c={c} />
            <TextField name="orderNumber" label={t('auth.register.activity.orderRegistration')}
              placeholder={t('auth.register.activity.registrationHint')} value={formData.orderNumber}
              onChange={handleText} error={errors.orderNumber || serverErrors?.order_registration_number?.[0]} c={c} />
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="px-5 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer"
            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "transparent", borderColor: c.border, color: c.txt2 }}>
            {t('auth.register.back')}
          </button>
          <button type="button" onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer hover:brightness-110"
            style={{ background: c.blue }}>
            {t('auth.register.activity.submit')}
          </button>
        </div>

      </div>

      {import.meta.env.DEV && (
        <button onClick={handleDevFill}
          className="fixed bottom-4 left-4 z-50 bg-black/80 text-[#8AAEE0] text-[10px] px-3 py-1.5 rounded border border-[#2A4A7F] hover:bg-[#173253] font-mono cursor-pointer">
          ⚡ DEV: Auto-Fill ({medicalRole})
        </button>
      )}
    </div>
  );
}
