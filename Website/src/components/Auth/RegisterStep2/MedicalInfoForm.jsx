import { useState } from "react";
import { Check, ChevronDown, Stethoscope, Pill, Users, Link as LinkIcon } from "lucide-react";
import StepBar from "./StepBar";
import { MEDICAL_STEPS } from "./MedicalForm";
import { useTheme } from "../../../context/ThemeContext";

function CustomSelect({ label, value, options, onSelect, placeholder = "Sélectionner...", error, c }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="space-y-1">
      <label className="text-[12px] font-medium block" style={{ color: c.txt2 }}>{label}</label>
      <div className="relative">
        <button type="button" onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3.5 py-[10px] rounded-xl border-2 text-sm transition-all outline-none"
          style={{ background: c.input, borderColor: error ? "#f87171" : c.border }}
        >
          <span style={{ color: value ? c.txt : c.txt3 }}>{value || placeholder}</span>
          <ChevronDown size={16} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} style={{ color: c.blue }} />
        </button>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-2xl z-50 py-1 max-h-52 overflow-y-auto"
              style={{ background: c.dropdown, borderColor: c.border }}>
              {options.map((opt) => (
                <button key={opt} type="button"
                  onClick={() => { onSelect(opt); setIsOpen(false); }}
                  className="w-full px-4 py-2.5 text-sm text-left transition-all"
                  style={{ color: value === opt ? c.blue : c.txt2, background: value === opt ? c.input : "transparent" }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

function TextField({ name, label, placeholder, value, onChange, onFieldChange, error, numeric, maxLen, suffix, c }) {
  return (
    <div className="space-y-1">
      <label className="text-[12px] font-medium block" style={{ color: c.txt2 }}>{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode={numeric ? "numeric" : "text"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={numeric
            ? (e) => { const v = e.target.value.replace(/\D/g, ""); if (!maxLen || v.length <= maxLen) onFieldChange(name, v); }
            : onChange}
          className={`w-full px-3.5 ${suffix ? "pr-12" : "pr-3.5"} py-[10px] rounded-xl border-2 text-sm outline-none transition-all placeholder-[#4A6080] ${error ? "border-red-400" : "focus:border-[#638ECB]"}`}
          style={{ background: c.input, borderColor: error ? undefined : c.border, color: c.txt }}
        />
        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-bold pointer-events-none" style={{ color: c.blue }}>
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

function UploadZone({ id, label, value, onChange, error, c }) {
  return (
    <div className="space-y-1">
      <label className="text-[12px] font-medium block" style={{ color: c.txt2 }}>{label}</label>
      <div className="relative">
        <input type="file" id={id} accept=".jpg,.jpeg,.png,.pdf" onChange={onChange} className="hidden" />
        <label htmlFor={id}
          className="flex flex-col items-center justify-center w-full min-h-[90px] rounded-xl border-2 border-dashed cursor-pointer transition-all"
          style={{
            borderColor: error ? "#f87171" : value ? c.blue : c.border,
            background:  error ? "rgba(248,113,113,0.05)" : value ? `${c.blue}18` : "transparent",
          }}
        >
          <div className="w-7 h-7 rounded border flex items-center justify-center mb-1.5"
            style={{ borderColor: value ? c.blue : c.border, background: c.input }}>
            <span className="font-bold text-base" style={{ color: value ? c.blue : c.txt3 }}>+</span>
          </div>
          <span className="font-semibold text-[13px] mb-0.5" style={{ color: value ? c.blue : c.txt2 }}>
            {value ? "✓ Document Ajouté" : "Télécharger le document"}
          </span>
          <span className="text-[11px]" style={{ color: c.txt3 }}>PDF, JPG — 5MB max</span>
        </label>
      </div>
      {error && <p className="text-[11px] text-red-400 text-center">{error}</p>}
    </div>
  );
}

function MapsInput({ label, value, onChange, placeholder, c }) {
  return (
    <div className="space-y-1">
      <label className="text-[12px] font-medium block" style={{ color: c.txt2 }}>{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.blue }}>
          <LinkIcon size={14} />
        </div>
        <input type="url" placeholder={placeholder || "https://maps.google.com/..."}
          value={value} onChange={onChange}
          className="w-full pl-9 pr-3.5 py-[10px] rounded-xl border-2 outline-none text-sm transition-all focus:border-[#638ECB] placeholder-[#4A6080]"
          style={{ background: c.input, borderColor: c.border, color: c.txt }}
        />
      </div>
    </div>
  );
}

const SPECIALITES = [
  "Généraliste", "Cardiologue", "Dermatologue", "Gynécologue", "Neurologue",
  "Ophtalmologue", "Orthopédiste", "Pédiatre", "Psychiatre", "Radiologue",
  "Rhumatologue", "Urologue", "Endocrinologue", "Gastro-entérologue",
];

const QUALIFICATIONS_GM = [
  "Infirmier(ère) diplômé(e) d'État", "Aide-soignant(e)", "Garde-malade certifié(e)",
  "Auxiliaire de vie", "Infirmier(ère) spécialisé(e)", "Assistant(e) médical(e)",
];

const WILAYAS = [
  "Alger", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Sétif", "Tlemcen",
  "Tizi Ouzou", "Béjaïa", "Jijel", "Médéa", "Mostaganem", "Bouira",
  "Bordj Bou Arréridj", "Boumerdès", "Tipaza", "Aïn Defla", "Tissemsilt",
  "Relizane", "Chlef", "Skikda", "Guelma", "Souk Ahras", "El Tarf", "Mila",
  "Khenchela", "Oum El Bouaghi", "Tébessa", "Biskra", "Djelfa", "Laghouat",
  "El Bayadh", "Naâma", "Saïda", "Mascara", "Tiaret", "Adrar", "Béchar",
  "Tamanrasset", "Illizi", "Tindouf", "El Oued", "Ouargla", "Ghardaïa",
  "Aïn Témouchent", "Sidi Bel Abbès", "Autres",
];

const ROLE_CONFIG = {
  "Médecin":      { icon: <Stethoscope size={16} />, color: "#638ECB", title: "Médecin" },
  "Pharmacien":   { icon: <Pill size={16} />,        color: "#2D8C6F", title: "Pharmacien" },
  "Garde-malade": { icon: <Users size={16} />,       color: "#9B7FD4", title: "Garde-Malade" },
};

export default function MedicalInfoForm({ onComplete, onBack, medicalRole = "Médecin" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = {
    bg:       isDark ? "#0D1117" : "#F0F4F8",
    input:    isDark ? "#141B27" : "#ffffff",
    dropdown: isDark ? "#0A1220" : "#ffffff",
    border:   isDark ? "#2A4A7F" : "#E4EAF5",
    txt:      isDark ? "#F0F3FA" : "#0D1B2E",
    txt2:     isDark ? "#8AAEE0" : "#5A6E8A",
    txt3:     isDark ? "#4A6080" : "#9AACBE",
    blue:     isDark ? "#638ECB" : "#4A6FA5",
    div:      isDark ? "#2A4A7F" : "#E4EAF5",
  };

  const config = ROLE_CONFIG[medicalRole] || ROLE_CONFIG["Médecin"];

  const [formData, setFormData] = useState({
    specialite: "", nInscription: "", cabinetName: "", mapsUrl: "",
    pharmacyName: "", agrement: "", pharmacyMapsUrl: "",
    qualification: "", experienceYears: "", tarifSoin: "", wilaya: "",
    cnas: "Oui", docFile: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (medicalRole === "Médecin") {
      if (!formData.specialite)            newErrors.specialite    = "Ce champ est obligatoire";
      if (!formData.nInscription.trim())   newErrors.nInscription  = "Ce champ est obligatoire";
      if (!formData.cabinetName.trim())    newErrors.cabinetName   = "Ce champ est obligatoire";
    } else if (medicalRole === "Pharmacien") {
      if (!formData.pharmacyName.trim())   newErrors.pharmacyName  = "Ce champ est obligatoire";
      if (!formData.agrement.trim())       newErrors.agrement      = "Ce champ est obligatoire";
    } else if (medicalRole === "Garde-malade") {
      if (!formData.qualification)          newErrors.qualification   = "Ce champ est obligatoire";
      if (!formData.experienceYears.trim()) newErrors.experienceYears = "Ce champ est obligatoire";
      if (!formData.tarifSoin.trim())       newErrors.tarifSoin      = "Ce champ est obligatoire";
      if (!formData.wilaya)                 newErrors.wilaya          = "Ce champ est obligatoire";
    }
    if (!formData.docFile) newErrors.docFile = "Ce document est obligatoire";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onComplete({ ...formData, medicalRole });
  };

  const handleDevFill = () => {
    const f = new File([""], "dev.pdf", { type: "application/pdf" });
    const d = medicalRole === "Médecin"
      ? { specialite: "Cardiologue", nInscription: "161234", cabinetName: "Cabinet Dr. Dev", mapsUrl: "", cnas: "Oui", docFile: f }
      : medicalRole === "Pharmacien"
      ? { pharmacyName: "Pharmacie Dev", agrement: "20241001", pharmacyMapsUrl: "", cnas: "Oui", docFile: f }
      : { qualification: "Infirmier(ère) diplômé(e) d'État", experienceYears: "5", tarifSoin: "2000", wilaya: "Alger", cnas: "Oui", docFile: f };
    onComplete({ ...d, medicalRole });
  };

  const docChangeHandler = (e) => {
    setFormData(p => ({ ...p, docFile: e.target.files[0] }));
    if (errors.docFile) setErrors(p => ({ ...p, docFile: "" }));
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ background: c.bg }}
    >
      <div className="w-full max-w-[480px]">

        <StepBar steps={MEDICAL_STEPS} current={4} />

        {/* Badge rôle */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: c.div }} />
          <div className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wide uppercase" style={{ color: config.color }}>
            {config.icon} {config.title}
          </div>
          <div className="flex-1 h-px" style={{ background: c.div }} />
        </div>

        {/* ══ MÉDECIN ══════════════════════════════════════════════════════════ */}
        {medicalRole === "Médecin" && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="col-span-2">
              <CustomSelect label="Spécialité médicale" value={formData.specialite} options={SPECIALITES}
                onSelect={(v) => handleField("specialite", v)} error={errors.specialite} c={c} />
            </div>
            <TextField name="nInscription" label="N° inscription à l'Ordre"
              placeholder="Ex: 161234" value={formData.nInscription}
              onChange={handleChange} onFieldChange={handleField} numeric maxLen={10} error={errors.nInscription} c={c} />
            <TextField name="cabinetName" label="Nom du Cabinet"
              placeholder="Cabinet Dr. Benali" value={formData.cabinetName}
              onChange={handleChange} onFieldChange={handleField} error={errors.cabinetName} c={c} />
            <TextField name="experienceYears" label="Années d'expérience"
              placeholder="Ex: 5" value={formData.experienceYears}
              onChange={handleChange} onFieldChange={handleField} numeric maxLen={2} c={c} />
            <MapsInput label="Google Maps (optionnel)" value={formData.mapsUrl}
              onChange={(e) => handleField("mapsUrl", e.target.value)} c={c} />
            <div className="col-span-2">
              <UploadZone id="autorisationFile" label="Autorisation d'exercer"
                value={formData.docFile} onChange={docChangeHandler} error={errors.docFile} c={c} />
            </div>
          </div>
        )}

        {/* ══ PHARMACIEN ═══════════════════════════════════════════════════════ */}
        {medicalRole === "Pharmacien" && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <TextField name="pharmacyName" label="Nom de la Pharmacie"
              placeholder="Pharmacie du Centre" value={formData.pharmacyName}
              onChange={handleChange} onFieldChange={handleField} error={errors.pharmacyName} c={c} />
            <TextField name="agrement" label="N° d'Agrément National"
              placeholder="Ex: 20241001" value={formData.agrement}
              onChange={handleChange} onFieldChange={handleField} numeric maxLen={12} error={errors.agrement} c={c} />
            <div className="col-span-2">
              <MapsInput label="Google Maps (optionnel)" value={formData.pharmacyMapsUrl}
                onChange={(e) => handleField("pharmacyMapsUrl", e.target.value)} c={c} />
            </div>
            <div className="col-span-2">
              <UploadZone id="registreFile" label="Registre de Commerce"
                value={formData.docFile} onChange={docChangeHandler} error={errors.docFile} c={c} />
            </div>
          </div>
        )}

        {/* ══ GARDE-MALADE ═════════════════════════════════════════════════════ */}
        {medicalRole === "Garde-malade" && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="col-span-2">
              <CustomSelect label="Qualification / Diplôme" value={formData.qualification}
                options={QUALIFICATIONS_GM} onSelect={(v) => handleField("qualification", v)} error={errors.qualification} c={c} />
            </div>
            <TextField name="experienceYears" label="Années d'expérience"
              placeholder="Ex: 5" value={formData.experienceYears}
              onChange={handleChange} onFieldChange={handleField} numeric maxLen={2} suffix="ans" error={errors.experienceYears} c={c} />
            <TextField name="tarifSoin" label="Tarif de base (DZD)"
              placeholder="Ex: 2000" value={formData.tarifSoin}
              onChange={handleChange} onFieldChange={handleField} numeric maxLen={6} suffix="DZD" error={errors.tarifSoin} c={c} />
            <div className="col-span-2">
              <CustomSelect label="Zone d'intervention (Wilaya)" value={formData.wilaya}
                options={WILAYAS} onSelect={(v) => handleField("wilaya", v)}
                placeholder="Sélectionner votre wilaya" error={errors.wilaya} c={c} />
            </div>
            <div className="col-span-2">
              <UploadZone id="diplomeFile" label="Copie du Diplôme"
                value={formData.docFile} onChange={docChangeHandler} error={errors.docFile} c={c} />
            </div>
          </div>
        )}

        {/* CNAS */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-[12px] font-semibold mb-3 uppercase tracking-wide" style={{ color: c.txt2 }}>Convention CNAS</span>
          <div className="flex items-center gap-6">
            {["Oui", "Non"].map((val) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer group" onClick={() => handleField("cnas", val)}>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{ borderColor: formData.cnas === val ? c.blue : c.border }}>
                  {formData.cnas === val && <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.blue }} />}
                </div>
                <span className="text-sm" style={{ color: formData.cnas === val ? c.txt : c.txt2, fontWeight: formData.cnas === val ? 500 : 400 }}>
                  {val}
                </span>
                <input type="radio" name="cnas" value={val} checked={formData.cnas === val} onChange={handleChange} className="hidden" />
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="px-5 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer"
            style={{ borderColor: c.border, color: c.txt2 }}>
            ← Retour
          </button>
          <button type="button" onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer"
            style={{ background: c.blue }}>
            Soumettre l'inscription →
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
