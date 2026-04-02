import { useState } from "react";
import { Check, Phone, ChevronDown, Stethoscope, Users, Pill, Eye, Plus } from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────────────────────
const SPECIALTIES = [
  "Généraliste", "Cardiologue", "Dermatologue", "Gynécologue", "Neurologue",
  "Ophtalmologue", "Orthopédiste", "Pédiatre", "Psychiatre", "Radiologue",
  "Rhumatologue", "Urologue", "Endocrinologue", "Gastro-entérologue",
];
const EXPERIENCE_OPTIONS = ["Moins d'un an", "1 - 3 ans", "3 - 5 ans", "5 - 10 ans", "+ 10 ans"];
const ALLOWED_KEYS = ["Backspace","Delete","Tab","ArrowLeft","ArrowRight","Home","End"];

// ────────────────────────────────────────────────────────────────────────────────
// Reusable Custom Dropdown — design exact demandé
// ────────────────────────────────────────────────────────────────────────────────
function CustomSelect({ label, value, options, onSelect, placeholder = "Sélectionner...", error, bgLabel = "#ffffff" }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative group">
      <span
        className="absolute -top-3 left-4 px-1.5 text-[13px] font-medium text-[#365885] z-10"
        style={{ background: bgLabel }}
      >
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
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onSelect(opt); setIsOpen(false); }}
                  className={`w-full flex items-center px-5 py-3 text-sm font-medium transition-all text-left hover:bg-[#6492C9] hover:bg-opacity-10 ${
                    value === opt ? "text-[#6492C9] bg-[#EEF3FB]" : "text-[#0D2644]"
                  }`}
                >
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

// ────────────────────────────────────────────────────────────────────────────────
// MedicalRoleForm
// ────────────────────────────────────────────────────────────────────────────────
export default function MedicalRoleForm({ onComplete, onBack }) {
  const [formData, setFormData] = useState({
    qualifications: "",
    proPhone: "",
    establishmentName: "",
    establishmentAddress: "",
    experience: "",
    role: "Médecin",
    specialty: "",
    consultationFee: "",
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

  const handleRoleSelect = (role) => setFormData((prev) => ({ ...prev, role }));

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.qualifications.trim()) newErrors.qualifications = "Ce champ est obligatoire";
    if (!formData.establishmentName.trim()) newErrors.establishmentName = "Ce champ est obligatoire";
    if (!formData.establishmentAddress.trim()) newErrors.establishmentAddress = "Ce champ est obligatoire";
    if (!formData.experience) newErrors.experience = "Ce champ est obligatoire";
    if (formData.role === "Médecin" && !formData.specialty) newErrors.specialty = "Ce champ est obligatoire";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-[#D1DFEC] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-[800px] px-[60px] py-[50px] relative">
        <h2 className="text-[28px] font-bold text-[#0D2644] text-center mb-10">Créer votre compte</h2>

        {/* ── Step Indicator ── */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center w-full max-w-[600px] justify-between relative px-2">
            <div className="absolute left-[30px] right-[75%] h-[2px] bg-[#6492C9] z-0 top-1/2 -translate-y-1/2" />
            <div className="absolute left-[25%] right-[50%] h-[2px] bg-[#6492C9] z-0 top-1/2 -translate-y-1/2" />
            <div className="absolute left-[50%] right-[25%] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2" />
            <div className="absolute left-[75%] right-[30px] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2" />
            {[true, true, "3", "4", "5"].map((s, i) => (
              <div key={i} className={`w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[13px] z-10 relative ${i < 3 ? "bg-[#6492C9] text-white shadow-sm" : "bg-white border-2 border-[#D1DFEC] text-[#D1DFEC]"}`}>
                {i < 2 ? <Check size={16} strokeWidth={3} /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* ── Informations professionnelles ── */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-[#D1DFEC]" />
            <span className="mx-4 text-[#365885] text-[15px] font-semibold tracking-wide">Informations professionnelles</span>
            <div className="flex-1 h-px bg-[#D1DFEC]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">

            {/* Qualifications */}
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Qualifications</span>
              <div className="relative">
                <input
                  type="text" name="qualifications" placeholder="Ajouter vos qualifications"
                  value={formData.qualifications} onChange={handleChange}
                  className={`w-full pl-4 pr-16 py-3 rounded-xl border ${errors.qualifications ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]"} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Eye size={18} className="text-[#89AEDB] cursor-pointer hover:text-[#6492C9] transition-colors" />
                  <div className="w-6 h-6 border border-[#D1DFEC] rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Plus size={14} className="text-[#89AEDB]" />
                  </div>
                </div>
              </div>
              {errors.qualifications && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.qualifications}</p>}
            </div>

            {/* Tél. pro — RÈGLE 2 : chiffres uniquement, max 10 */}
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Tél. professionnel (optionnel)</span>
              <div className="relative">
                <input
                  type="text" inputMode="numeric" name="proPhone" placeholder="Ex: 0555123456"
                  value={formData.proPhone}
                  onKeyDown={(e) => { if (!ALLOWED_KEYS.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault(); }}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    if (onlyNumbers.length <= 10) setFormData((prev) => ({ ...prev, proPhone: onlyNumbers }));
                  }}
                  onPaste={(e) => { e.preventDefault(); const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 10); setFormData((prev) => ({ ...prev, proPhone: p })); }}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9] focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none"><Phone size={18} strokeWidth={1.5} /></div>
              </div>
              {formData.proPhone.length > 0 && formData.proPhone.length < 10 && <p className="text-amber-500 text-[11px] mt-1 ml-1">{formData.proPhone.length}/10 chiffres</p>}
              {formData.proPhone.length === 10 && <p className="text-green-600 text-[11px] mt-1 ml-1">✓ Numéro complet</p>}
            </div>

            {/* Nom de l'établissement */}
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Nom de l'établissement</span>
              <input
                type="text" name="establishmentName" placeholder="Clinique, Hôpital..."
                value={formData.establishmentName} onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.establishmentName ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]"} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`}
              />
              {errors.establishmentName && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.establishmentName}</p>}
            </div>

            {/* Adresse */}
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Adresse de l'établissement</span>
              <input
                type="text" name="establishmentAddress" placeholder="Adresse complète"
                value={formData.establishmentAddress} onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.establishmentAddress ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]"} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`}
              />
              {errors.establishmentAddress && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.establishmentAddress}</p>}
            </div>

            {/* Années d'expérience — RÈGLE 1 */}
            <div className="md:col-span-2">
              <CustomSelect
                label="Années d'expérience"
                value={formData.experience}
                options={EXPERIENCE_OPTIONS}
                onSelect={(v) => handleField("experience", v)}
                placeholder="Sélectionner..."
                error={errors.experience}
              />
            </div>
          </div>
        </div>

        {/* ── Choisir votre rôle ── */}
        <div className="mb-8 mt-10">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-[#D1DFEC]" />
            <span className="mx-4 text-[#365885] text-[15px] font-semibold tracking-wide">Choisir votre rôle</span>
            <div className="flex-1 h-px bg-[#D1DFEC]" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { id: "Médecin", icon: <Stethoscope size={28} />, bg: "bg-[#EBF1F6]" },
              { id: "Garde-malade", icon: <Users size={28} />, bg: "bg-transparent border-2 border-[#D1DFEC]" },
              { id: "Pharmacien", icon: <Pill size={28} />, bg: "bg-transparent border-2 border-[#D1DFEC]" },
            ].map(({ id, icon, bg }) => (
              <div
                key={id}
                onClick={() => handleRoleSelect(id)}
                className={`flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 cursor-pointer transition-all ${formData.role === id ? "border-[#6492C9] bg-[#F4F8FB]" : "border-[#D1DFEC] hover:border-[#89AEDB]"}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${formData.role === id ? "bg-[#6492C9]" : bg}`}>
                  <span className={formData.role === id ? "text-white" : "text-[#89AEDB]"}>{icon}</span>
                </div>
                <span className={`font-semibold text-[15px] ${formData.role === id ? "text-[#0D2644]" : "text-[#365885]"}`}>{id}</span>
              </div>
            ))}
          </div>

          {/* ── Champs conditionnels Médecin ── */}
          {formData.role === "Médecin" && (
            <div className="mt-8 p-6 rounded-2xl border-2 border-[#6492C9]/30 bg-[#F4F8FB] animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-[13px] font-semibold text-[#6492C9] mb-6 flex items-center gap-2">
                <Stethoscope size={15} /> Informations supplémentaires — Médecin
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">

                {/* Spécialité — RÈGLE 1 */}
                <CustomSelect
                  label="Spécialité"
                  value={formData.specialty}
                  options={SPECIALTIES}
                  onSelect={(v) => handleField("specialty", v)}
                  placeholder="Choisir votre spécialité"
                  error={errors.specialty}
                  bgLabel="#F4F8FB"
                />

                {/* Tarif — RÈGLE 2 : chiffres uniquement, max 6 */}
                <div className="relative group">
                  <span className="absolute -top-3 left-4 px-1.5 bg-[#F4F8FB] text-[13px] font-medium text-[#365885] z-10">Tarif de consultation (DZD)</span>
                  <div className="relative">
                    <input
                      type="text" inputMode="numeric" name="consultationFee" placeholder="Ex: 1500"
                      value={formData.consultationFee}
                      onKeyDown={(e) => { if (!ALLOWED_KEYS.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault(); }}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, "");
                        if (onlyNumbers.length <= 6) setFormData((prev) => ({ ...prev, consultationFee: onlyNumbers }));
                      }}
                      onPaste={(e) => { e.preventDefault(); const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); setFormData((prev) => ({ ...prev, consultationFee: p })); }}
                      className="w-full pl-4 pr-16 py-3 rounded-xl border border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9] focus:ring-0 outline-none text-gray-700 text-sm bg-white transition-colors placeholder:text-[#A0B5CD]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#89AEDB] pointer-events-none">DZD</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="w-full h-px bg-[#D1DFEC]/50 mt-10 mb-8" />
        </div>

        {/* ── Buttons ── */}
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-[120px] bg-white border border-[#D1DFEC] hover:border-[#A0B5CD] hover:bg-gray-50 text-[#365885] py-3 rounded-xl text-[15px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1">
            ← Retour
          </button>
          <button onClick={handleSubmit} className="flex-1 bg-[#6492C9] hover:bg-[#304B71] text-white py-3 rounded-xl text-[15px] font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1">
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}