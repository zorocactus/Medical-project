import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

// ── Composant Custom Select ──
function CustomSelect({ label, value, options, onSelect, placeholder = "Sélectionner...", error }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative group">
      <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">
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
                  className={`w-full flex items-center px-5 py-3 text-sm font-medium transition-all text-left hover:bg-[#6492C9] hover:bg-opacity-10 ${value === opt ? "text-[#6492C9] bg-[#EEF3FB]" : "text-[#0D2644]"}`}>
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

export default function MedicalInfoForm({ onComplete, onBack }) {
  const [formData, setFormData] = useState({
    specialite: "Cardiologie",
    nInscription: "",
    licence: "",
    autorisationFile: null,
    cnas: "Oui",
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
    setFormData((prev) => ({ ...prev, autorisationFile: e.target.files[0] }));
    if (errors.autorisationFile) setErrors((prev) => ({ ...prev, autorisationFile: "" }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.licence.trim()) newErrors.licence = "Ce champ est obligatoire";
    if (!formData.nInscription.trim()) newErrors.nInscription = "Ce champ est obligatoire";
    if (!formData.autorisationFile) newErrors.autorisationFile = "Ce champ est obligatoire";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-[#D1DFEC] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-[800px] px-[60px] py-[50px] relative">
        <h2 className="text-[28px] font-bold text-[#0D2644] text-center mb-10">
          Créer votre compte
        </h2>

        {/* 5-Step Indicator */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center w-full max-w-[600px] justify-between relative px-2">
            <div className="absolute left-[30px] right-[75%] h-[2px] bg-[#6492C9] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[25%] right-[50%] h-[2px] bg-[#6492C9] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[50%] right-[25%] h-[2px] bg-[#6492C9] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[75%] right-[30px] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
            
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 shadow-sm relative"><Check size={16} strokeWidth={3} /></div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 relative"><Check size={16} strokeWidth={3} /></div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 relative"><Check size={16} strokeWidth={3} /></div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 relative">4</div>
            <div className="w-[32px] h-[32px] rounded-full bg-white border-2 border-[#D1DFEC] text-[#D1DFEC] flex items-center justify-center font-bold text-[13px] z-10 relative">5</div>
          </div>
        </div>

        {/* Informations médicales professionnelles */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
            <div className="mx-4 text-[#365885] text-[15px] font-semibold tracking-wide text-center">
              Informations médicales professionnelles
            </div>
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
            {/* Colonne gauche */}
            <div className="flex flex-col gap-7">
              {/* Remplacement du <select> par CustomSelect */}
              <CustomSelect 
                label="Spécialité médicale" 
                value={formData.specialite} 
                options={["Cardiologie", "Neurologie", "Pédiatrie", "Médecine générale", "Dermatologie"]} 
                onSelect={(v) => handleField("specialite", v)} 
              />

              <div className="relative group">
                <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">
                  Numéro de licence professionnelle
                </span>
                <div className="relative">
                  <input
                    type="text" name="licence" placeholder="Numéro de licence" value={formData.licence} onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.licence ? 'border-red-400' : 'border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]'} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`}
                  />
                </div>
                {errors.licence && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.licence}</p>}
              </div>
            </div>

            {/* Colonne droite */}
            <div className="flex flex-col gap-7">
              <div className="relative group">
                <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">
                  N° d'inscription au Conseil de l'Ordre
                </span>
                <div className="relative">
                  <input
                    type="text" name="nInscription" placeholder="Ex: 16-XXXX-XX" value={formData.nInscription} onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.nInscription ? 'border-red-400' : 'border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]'} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`}
                  />
                </div>
                {errors.nInscription && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.nInscription}</p>}
              </div>

              <div className="relative group flex-1">
                <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">
                  Autorisation d'exercer
                </span>
                <div className="relative h-full">
                  <input type="file" id="autorisationFile" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="autorisationFile" className={`flex flex-col items-center justify-center w-full min-h-[120px] rounded-2xl border-2 border-dashed ${errors.autorisationFile ? 'border-red-400' : formData.autorisationFile ? 'border-[#6492C9] bg-[#F4F8FB]' : 'border-[#D1DFEC] hover:border-[#89AEDB]'} cursor-pointer transition-colors group`}>
                    <div className="w-8 h-8 rounded border border-[#D1DFEC] flex items-center justify-center mb-2 bg-white">
                      <span className="text-[#89AEDB] font-bold text-lg">+</span>
                    </div>
                    <span className="text-[#0D2644] font-semibold text-[14px] mb-1 text-center px-2">
                      {formData.autorisationFile ? "Document Ajouté" : "Télécharger le document"}
                    </span>
                    <span className="text-[#A0B5CD] text-[11px]">PDF, JPG - 5MB max</span>
                  </label>
                  {errors.autorisationFile && <p className="text-red-500 text-[12px] mt-1 text-center">{errors.autorisationFile}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statut Convention CNAS */}
        <div className="flex flex-col items-center justify-center mb-10">
          <span className="text-[#365885] text-[14px] font-bold mb-3">Statut Convention CNAS</span>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.cnas === "Oui" ? 'border-[#6492C9]' : 'border-[#D1DFEC] group-hover:border-[#89AEDB]'}`}>
                {formData.cnas === "Oui" && <div className="w-2.5 h-2.5 bg-[#6492C9] rounded-full"></div>}
              </div>
              <span className={`text-[15px] ${formData.cnas === "Oui" ? 'text-[#0D2644] font-medium' : 'text-[#5C738A]'}`}>Oui</span>
              <input type="radio" name="cnas" value="Oui" checked={formData.cnas === "Oui"} onChange={handleChange} className="hidden" />
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.cnas === "Non" ? 'border-[#6492C9]' : 'border-[#D1DFEC] group-hover:border-[#89AEDB]'}`}>
                {formData.cnas === "Non" && <div className="w-2.5 h-2.5 bg-[#6492C9] rounded-full"></div>}
              </div>
              <span className={`text-[15px] ${formData.cnas === "Non" ? 'text-[#0D2644] font-medium' : 'text-[#5C738A]'}`}>Non</span>
              <input type="radio" name="cnas" value="Non" checked={formData.cnas === "Non"} onChange={handleChange} className="hidden" />
            </label>
          </div>
        </div>
        
        <div className="w-full h-px bg-[#D1DFEC]/50 mb-8"></div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-[120px] bg-white border border-[#D1DFEC] hover:border-[#A0B5CD] hover:bg-gray-50 text-[#365885] py-3 rounded-xl text-[15px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1">
            &larr; Retour
          </button>
          <button onClick={handleSubmit} className="flex-1 bg-[#6492C9] hover:bg-[#304B71] text-white py-3 rounded-xl text-[15px] font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1">
            Soumettre l'inscription &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}