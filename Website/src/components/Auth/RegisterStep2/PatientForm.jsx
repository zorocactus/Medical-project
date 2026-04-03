import { useState } from "react";
import { Phone, User, Home, Calendar, ChevronDown } from "lucide-react";

const SEXE_OPTIONS = ["Masculin", "Féminin"];
const WILAYAS = ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Sétif", "Tlemcen", "Tizi Ouzou", "Béjaïa", "Jijel", "Autre"];

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

export default function PatientForm({ onComplete, onBack }) {
  const [formData, setFormData] = useState({
    birthDate: "", sex: "Masculin", phone: "", idCardNumber: "", address: "", postalCode: "", city: "", wilaya: "Alger",
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

  const handleNumberChange = (e, field, maxLength) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    if (onlyNumbers.length <= maxLength) {
      setFormData((prev) => ({ ...prev, [field]: onlyNumbers }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = () => {
    const requiredFields = ["birthDate", "phone", "idCardNumber", "address", "postalCode", "city"];
    const newErrors = {};
    requiredFields.forEach((f) => { if (!formData[f] || formData[f].trim() === "") newErrors[f] = "Ce champ est obligatoire"; });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onComplete(formData);
  };

  const handleDevFill = () => {
    onComplete({
      birthDate: "1990-05-15",
      sex: "Masculin",
      phone: "0555000000",
      idCardNumber: "10344567890",
      address: "12 Rue Didouche Mourad",
      postalCode: "16000",
      city: "Alger-Centre",
      wilaya: "Alger",
    });
  };

  return (
    <div className="min-h-screen bg-[#D1DFEC] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-[800px] px-[60px] py-[50px] relative">
        <h2 className="text-[28px] font-bold text-[#0D2644] text-center mb-10">Créer votre compte</h2>

        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center w-full max-w-[480px] justify-between relative px-2">
            <div className="absolute left-[30px] right-[50%] h-px bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[50%] right-[30px] h-px bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-sm z-10 shadow-sm relative">1</div>
            <div className="w-[32px] h-[32px] rounded-full bg-white border border-[#D1DFEC] text-[#89AEDB] flex items-center justify-center font-bold text-sm z-10 relative">2</div>
            <div className="w-[32px] h-[32px] rounded-full bg-white border border-[#D1DFEC] text-[#89AEDB] flex items-center justify-center font-bold text-sm z-10 relative">3</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
            <div className="mx-4 text-[#365885] text-[15px] font-semibold tracking-wide">Informations personnelles</div>
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Date de naissance</span>
              <div className="relative">
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={`w-full pl-4 pr-10 py-3 rounded-xl border ${errors.birthDate ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB]"} outline-none text-gray-700 text-sm`} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none"><Calendar size={18} strokeWidth={1.5} /></div>
              </div>
            </div>

            <CustomSelect label="Sexe" value={formData.sex} options={SEXE_OPTIONS} onSelect={(v) => handleField("sex", v)} />

            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Numéro de téléphone</span>
              <div className="relative">
                <input type="text" name="phone" placeholder="Ex: 0555123456" value={formData.phone} onChange={(e) => handleNumberChange(e, "phone", 10)} className={`w-full pl-4 pr-10 py-3 rounded-xl border ${errors.phone ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB]"} outline-none text-gray-700 text-sm`} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none"><Phone size={18} strokeWidth={1.5} /></div>
              </div>
            </div>

            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Numéro carte d'identité</span>
              <div className="relative">
                <input type="text" name="idCardNumber" placeholder="Ex: 10123456789" value={formData.idCardNumber} onChange={(e) => handleNumberChange(e, "idCardNumber", 18)} className={`w-full pl-4 pr-10 py-3 rounded-xl border ${errors.idCardNumber ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB]"} outline-none text-gray-700 text-sm`} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none"><User size={18} strokeWidth={1.5} /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 mt-10">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
            <div className="mx-4 text-[#365885] text-[15px] font-semibold tracking-wide">Adresse résidentielle</div>
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <div className="relative group md:col-span-1">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Adresse</span>
              <div className="relative">
                <input type="text" name="address" placeholder="Rue, numéro..." value={formData.address} onChange={handleChange} className={`w-full pl-4 pr-10 py-3 rounded-xl border ${errors.address ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB]"} outline-none text-gray-700 text-sm`} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none"><Home size={18} strokeWidth={1.5} /></div>
              </div>
            </div>

            <div className="relative group md:col-span-1">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Code postal</span>
              <input type="text" name="postalCode" placeholder="16000" value={formData.postalCode} onChange={(e) => handleNumberChange(e, "postalCode", 5)} className={`w-full pl-4 pr-4 py-3 rounded-xl border ${errors.postalCode ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB]"} outline-none text-gray-700 text-sm`} />
            </div>

            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Commune</span>
              <input type="text" name="city" placeholder="Rouiba" value={formData.city} onChange={handleChange} className={`w-full pl-4 pr-4 py-3 rounded-xl border ${errors.city ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB]"} outline-none text-gray-700 text-sm`} />
            </div>

            <CustomSelect label="Wilaya" value={formData.wilaya} options={WILAYAS} onSelect={(v) => handleField("wilaya", v)} />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <button onClick={onBack} className="w-[120px] bg-white border border-[#D1DFEC] hover:bg-gray-50 text-[#365885] py-3 rounded-xl text-[15px] font-medium transition-all">
            &larr; Retour
          </button>
          <button onClick={handleSubmit} className="flex-1 bg-[#6492C9] hover:bg-[#304B71] text-white py-3 rounded-xl text-[15px] font-medium transition-all shadow-sm">
            Continuer &rarr;
          </button>
        </div>
      </div>

      {import.meta.env.DEV && (
        <button
          onClick={handleDevFill}
          className="fixed bottom-4 left-4 z-50 bg-black/80 text-yellow-400 text-[10px] px-3 py-1.5 rounded border border-yellow-400/50 hover:bg-black font-mono cursor-pointer"
        >
          ⚡ DEV: Auto-Fill
        </button>
      )}
    </div>
  );
}