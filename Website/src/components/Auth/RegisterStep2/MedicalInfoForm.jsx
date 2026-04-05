import { useState } from "react";
import { Check, ChevronDown, Stethoscope, Pill, Users, Link as LinkIcon } from "lucide-react";

// ── CustomSelect ──────────────────────────────────────────────────────────────
function CustomSelect({ label, value, options, onSelect, placeholder = "Sélectionner...", error, bgLabel = "#ffffff" }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative group">
      <span className="absolute -top-3 left-4 px-1.5 text-[13px] font-medium text-[#365885] z-10" style={{ background: bgLabel }}>
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border ${
            error ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]"
          } bg-white text-sm text-gray-700 transition-colors text-left outline-none`}
        >
          <span className={value ? "text-gray-700" : "text-[#A0B5CD]"}>{value || placeholder}</span>
          <ChevronDown size={18} className={`text-[#89AEDB] shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[#D1DFEC] shadow-xl z-50 py-2 bg-white max-h-60 overflow-y-auto">
              {options.map((opt) => (
                <button key={opt} type="button" onClick={() => { onSelect(opt); setIsOpen(false); }}
                  className={`w-full flex items-center px-5 py-3 text-sm font-medium transition-all text-left hover:bg-[#6492C9] hover:bg-opacity-10 ${
                    value === opt ? "text-[#6492C9] bg-[#EEF3FB]" : "text-[#0D2644]"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-[12px] mt-1 ml-1">{error}</p>}
    </div>
  );
}

// ── Upload Zone ───────────────────────────────────────────────────────────────
function UploadZone({ id, label, value, onChange, error }) {
  return (
    <div className="relative group">
      <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">{label}</span>
      <input type="file" id={id} accept=".jpg,.jpeg,.png,.pdf" onChange={onChange} className="hidden" />
      <label
        htmlFor={id}
        className={`flex flex-col items-center justify-center w-full min-h-[110px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
          error ? "border-red-400" : value ? "border-[#6492C9] bg-[#F4F8FB]" : "border-[#D1DFEC] hover:border-[#89AEDB]"
        }`}
      >
        <div className="w-8 h-8 rounded border border-[#D1DFEC] flex items-center justify-center mb-2 bg-white">
          <span className="text-[#89AEDB] font-bold text-lg">+</span>
        </div>
        <span className="text-[#0D2644] font-semibold text-[14px] mb-1 text-center px-2">
          {value ? "✓ Document Ajouté" : "Télécharger le document"}
        </span>
        <span className="text-[#A0B5CD] text-[11px]">PDF, JPG — 5MB max</span>
      </label>
      {error && <p className="text-red-500 text-[12px] mt-1 text-center">{error}</p>}
    </div>
  );
}

// ── Champ URL Maps ─────────────────────────────────────────────────────────────
function MapsInput({ label, value, onChange, placeholder }) {
  return (
    <div className="relative group">
      <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">{label}</span>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none">
          <LinkIcon size={15} />
        </div>
        <input
          type="url"
          placeholder={placeholder || "https://maps.google.com/..."}
          value={value}
          onChange={onChange}
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9] focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]"
        />
      </div>
    </div>
  );
}

// ── Constantes ────────────────────────────────────────────────────────────────
const SPECIALITES = [
  "Généraliste", "Cardiologue", "Dermatologue", "Gynécologue", "Neurologue",
  "Ophtalmologue", "Orthopédiste", "Pédiatre", "Psychiatre", "Radiologue",
  "Rhumatologue", "Urologue", "Endocrinologue", "Gastro-entérologue",
];

const QUALIFICATIONS_GM = [
  "Infirmier(ère) diplômé(e) d'État",
  "Aide-soignant(e)",
  "Garde-malade certifié(e)",
  "Auxiliaire de vie",
  "Infirmier(ère) spécialisé(e)",
  "Assistant(e) médical(e)",
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

// ── Config badge par rôle ─────────────────────────────────────────────────────
const ROLE_CONFIG = {
  "Médecin":      { icon: <Stethoscope size={18} />, color: "#6492C9", title: "Informations — Médecin",      upload: "autorisationFile", uploadLabel: "Autorisation d'exercer" },
  "Pharmacien":   { icon: <Pill size={18} />,        color: "#2D8C6F", title: "Informations — Pharmacien",   upload: "registreFile",     uploadLabel: "Registre de Commerce"   },
  "Garde-malade": { icon: <Users size={18} />,       color: "#9B7FD4", title: "Informations — Garde-Malade", upload: "diplomeFile",      uploadLabel: "Copie du Diplôme"       },
};

// ─ Champ texte stylisé générique (module-level pour éviter la recréation) ────
function TextField({ name, label, placeholder, value, onChange, onFieldChange, error, numeric, maxLen, suffix }) {
  return (
    <div className="relative group">
      <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">{label}</span>
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
          className={`w-full px-4 ${suffix ? "pr-14" : "pr-4"} py-3 rounded-xl border ${error ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]"} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#89AEDB] pointer-events-none">{suffix}</span>}
      </div>
      {error && <p className="text-red-500 text-[12px] mt-1 ml-1">{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function MedicalInfoForm({ onComplete, onBack, medicalRole = "Médecin" }) {
  const config = ROLE_CONFIG[medicalRole] || ROLE_CONFIG["Médecin"];

  const [formData, setFormData] = useState({
    // Médecin
    specialite: "",
    nInscription: "",
    cabinetName: "",
    mapsUrl: "",
    // Pharmacien
    pharmacyName: "",
    agrement: "",
    pharmacyMapsUrl: "",
    // Garde-malade
    qualification: "",
    experienceYears: "",
    tarifSoin: "",
    wilaya: "",
    // Partagé
    cnas: "Oui",
    docFile: null,
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

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, docFile: e.target.files[0] }));
    if (errors.docFile) setErrors((prev) => ({ ...prev, docFile: "" }));
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
      if (!formData.qualification)         newErrors.qualification = "Ce champ est obligatoire";
      if (!formData.experienceYears.trim())newErrors.experienceYears = "Ce champ est obligatoire";
      if (!formData.tarifSoin.trim())      newErrors.tarifSoin     = "Ce champ est obligatoire";
      if (!formData.wilaya)                newErrors.wilaya        = "Ce champ est obligatoire";
    }
    if (!formData.docFile) newErrors.docFile = "Ce document est obligatoire";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onComplete({ ...formData, medicalRole });
  };

  // ── ⚡ DEV BYPASS ──────────────────────────────────────────────────────────
  const handleDevFill = () => {
    const devFile = new File([""], "dev_doc.pdf", { type: "application/pdf" });
    const devData =
      medicalRole === "Médecin"
        ? { specialite: "Cardiologue", nInscription: "161234", cabinetName: "Cabinet Dr. Dev", mapsUrl: "https://maps.google.com/?q=Alger", cnas: "Oui", docFile: devFile }
        : medicalRole === "Pharmacien"
        ? { pharmacyName: "Pharmacie Dev Central", agrement: "20241001", pharmacyMapsUrl: "https://maps.google.com/?q=Oran", cnas: "Oui", docFile: devFile }
        : { qualification: "Infirmier(ère) diplômé(e) d'État", experienceYears: "5", tarifSoin: "2000", wilaya: "Alger", cnas: "Oui", docFile: devFile };
    onComplete({ ...devData, medicalRole });
  };

  return (
    <div className="min-h-screen bg-[#D1DFEC] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-[800px] px-[60px] py-[50px] relative">
        <h2 className="text-[28px] font-bold text-[#0D2644] text-center mb-10">Créer votre compte</h2>

        {/* Step indicator */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center w-full max-w-[600px] justify-between relative px-2">
            {["left-[30px] right-[75%]", "left-[25%] right-[50%]", "left-[50%] right-[25%]", "left-[75%] right-[30px]"].map((pos, i) => (
              <div key={i} className={`absolute ${pos} h-[2px] ${i < 3 ? "bg-[#6492C9]" : "bg-[#D1DFEC]"} z-0 top-1/2 -translate-y-1/2`} />
            ))}
            {[true, true, true, true, "5"].map((s, i) => (
              <div key={i} className={`w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[13px] z-10 relative ${i < 4 ? "bg-[#6492C9] text-white shadow-sm" : "bg-white border-2 border-[#D1DFEC] text-[#D1DFEC]"}`}>
                {i < 4 ? <Check size={16} strokeWidth={3} /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* Rôle badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex-1 h-px bg-[#D1DFEC]" />
          <div className="mx-4 flex items-center gap-2 text-[15px] font-semibold tracking-wide" style={{ color: config.color }}>
            {config.icon} {config.title}
          </div>
          <div className="flex-1 h-px bg-[#D1DFEC]" />
        </div>

        {/* ══ MÉDECIN ══════════════════════════════════════════════════════════ */}
        {medicalRole === "Médecin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 mb-8">
            <CustomSelect
              label="Spécialité médicale"
              value={formData.specialite}
              options={SPECIALITES}
              onSelect={(v) => handleField("specialite", v)}
              error={errors.specialite}
            />
            <TextField
              name="nInscription" label="N° d'inscription à l'Ordre"
              placeholder="Ex: 161234" value={formData.nInscription}
              onChange={handleChange} onFieldChange={handleField}
              numeric maxLen={10} error={errors.nInscription}
            />
            <TextField
              name="cabinetName" label="Nom du Cabinet Médical"
              placeholder="Ex: Cabinet Dr. Benali" value={formData.cabinetName}
              onChange={handleChange} onFieldChange={handleField}
              error={errors.cabinetName}
            />
            <TextField
              name="experienceYears" label="Années d'expérience"
              placeholder="Ex: 5" value={formData.experienceYears}
              onChange={handleChange} onFieldChange={handleField}
              numeric maxLen={2} error={errors.experienceYears}
            />
            <MapsInput
              label="Adresse Google Maps (optionnel)"
              value={formData.mapsUrl}
              onChange={(e) => handleField("mapsUrl", e.target.value)}
              placeholder="https://maps.google.com/..."
            />
            <div className="md:col-span-2">
              <UploadZone id="autorisationFile" label="Autorisation d'exercer" value={formData.docFile} onChange={handleFileChange} error={errors.docFile} />
            </div>
          </div>
        )}

        {/* ══ PHARMACIEN ═══════════════════════════════════════════════════════ */}
        {medicalRole === "Pharmacien" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 mb-8">
            <TextField
              name="pharmacyName" label="Nom de la Pharmacie"
              placeholder="Ex: Pharmacie du Centre" value={formData.pharmacyName}
              onChange={handleChange} onFieldChange={handleField}
              error={errors.pharmacyName}
            />
            <TextField
              name="agrement" label="N° d'Agrément National"
              placeholder="Ex: 20241001" value={formData.agrement}
              onChange={handleChange} onFieldChange={handleField}
              numeric maxLen={12} error={errors.agrement}
            />
            <MapsInput
              label="Adresse Google Maps (optionnel)"
              value={formData.pharmacyMapsUrl}
              onChange={(e) => handleField("pharmacyMapsUrl", e.target.value)}
              placeholder="https://maps.google.com/..."
            />
            <div className="md:col-span-2">
              <UploadZone id="registreFile" label="Registre de Commerce" value={formData.docFile} onChange={handleFileChange} error={errors.docFile} />
            </div>
          </div>
        )}

        {/* ══ GARDE-MALADE ═════════════════════════════════════════════════════ */}
        {medicalRole === "Garde-malade" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 mb-8">
            <CustomSelect
              label="Qualification / Diplôme"
              value={formData.qualification}
              options={QUALIFICATIONS_GM}
              onSelect={(v) => handleField("qualification", v)}
              error={errors.qualification}
            />
            <TextField
              name="experienceYears" label="Années d'expérience"
              placeholder="Ex: 5" value={formData.experienceYears}
              onChange={handleChange} onFieldChange={handleField}
              numeric maxLen={2} suffix="ans" error={errors.experienceYears}
            />
            <TextField
              name="tarifSoin" label="Tarif de base par soin (DZD)"
              placeholder="Ex: 2000" value={formData.tarifSoin}
              onChange={handleChange} onFieldChange={handleField}
              numeric maxLen={6} suffix="DZD" error={errors.tarifSoin}
            />
            <CustomSelect
              label="Zone d'intervention (Wilaya)"
              value={formData.wilaya}
              options={WILAYAS}
              onSelect={(v) => handleField("wilaya", v)}
              placeholder="Sélectionner votre wilaya"
              error={errors.wilaya}
            />
            <div className="md:col-span-2">
              <UploadZone id="diplomeFile" label="Copie du Diplôme" value={formData.docFile} onChange={handleFileChange} error={errors.docFile} />
            </div>
          </div>
        )}

        {/* CNAS */}
        <div className="flex flex-col items-center justify-center mb-10">
          <span className="text-[#365885] text-[14px] font-bold mb-3">Statut Convention CNAS</span>
          <div className="flex items-center gap-6">
            {["Oui", "Non"].map((val) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.cnas === val ? "border-[#6492C9]" : "border-[#D1DFEC] group-hover:border-[#89AEDB]"}`}>
                  {formData.cnas === val && <div className="w-2.5 h-2.5 bg-[#6492C9] rounded-full" />}
                </div>
                <span className={`text-[15px] ${formData.cnas === val ? "text-[#0D2644] font-medium" : "text-[#5C738A]"}`}>{val}</span>
                <input type="radio" name="cnas" value={val} checked={formData.cnas === val} onChange={handleChange} className="hidden" />
              </label>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-[#D1DFEC]/50 mb-8" />

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-[120px] bg-white border border-[#D1DFEC] hover:border-[#A0B5CD] hover:bg-gray-50 text-[#365885] py-3 rounded-xl text-[15px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1">
            ← Retour
          </button>
          <button onClick={handleSubmit} className="flex-1 bg-[#6492C9] hover:bg-[#304B71] text-white py-3 rounded-xl text-[15px] font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1">
            Soumettre l'inscription →
          </button>
        </div>
      </div>

      {/* ⚡ DEV BYPASS */}
      {import.meta.env.DEV && (
        <button
          onClick={handleDevFill}
          className="fixed bottom-4 left-4 z-50 bg-black/80 text-yellow-400 text-[10px] px-3 py-1.5 rounded border border-yellow-400/50 hover:bg-black font-mono cursor-pointer"
        >
          ⚡ DEV: Auto-Fill ({medicalRole})
        </button>
      )}
    </div>
  );
}