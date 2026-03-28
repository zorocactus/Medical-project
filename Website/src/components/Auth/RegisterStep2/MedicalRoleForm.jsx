import { useState } from "react";
import { Check, Phone, ChevronDown, Stethoscope, Users, Pill, Eye, Plus } from "lucide-react";

export default function MedicalRoleForm({ onComplete, onBack }) {
  const [formData, setFormData] = useState({
    qualifications: "",
    proPhone: "",
    establishmentName: "",
    establishmentAddress: "",
    experience: "",
    role: "Médecin",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.qualifications.trim()) newErrors.qualifications = "Ce champ est obligatoire";
    if (!formData.establishmentName.trim()) newErrors.establishmentName = "Ce champ est obligatoire";
    if (!formData.establishmentAddress.trim()) newErrors.establishmentAddress = "Ce champ est obligatoire";
    if (!formData.experience) newErrors.experience = "Ce champ est obligatoire";
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
            {/* Connecting Lines */}
            <div className="absolute left-[30px] right-[75%] h-[2px] bg-[#6492C9] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[25%] right-[50%] h-[2px] bg-[#6492C9] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[50%] right-[25%] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[75%] right-[30px] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
            
            {/* Steps */}
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 shadow-sm relative">
              <Check size={16} strokeWidth={3} />
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 relative">
              <Check size={16} strokeWidth={3} />
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 relative">
              3
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-white border-2 border-[#D1DFEC] text-[#D1DFEC] flex items-center justify-center font-bold text-[13px] z-10 relative">
              4
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-white border-2 border-[#D1DFEC] text-[#D1DFEC] flex items-center justify-center font-bold text-[13px] z-10 relative">
              5
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
            <div className="mx-4 text-[#365885] text-[15px] font-semibold tracking-wide">
              Informations professionnelles
            </div>
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">
                Qualifications
              </span>
              <div className="relative">
                <input
                  type="text"
                  name="qualifications"
                  placeholder="Ajouter vos qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  className={`w-full pl-4 pr-16 py-3 rounded-xl border ${errors.qualifications ? 'border-red-400' : 'border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]'} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Eye size={18} className="text-[#89AEDB] cursor-pointer hover:text-[#6492C9] transition-colors" />
                  <div className="w-6 h-6 border border-[#D1DFEC] rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Plus size={14} className="text-[#89AEDB]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">
                Tél. professionnel (optionnel)
              </span>
              <div className="relative">
                <input
                  type="tel"
                  name="proPhone"
                  placeholder="Optionnel"
                  value={formData.proPhone}
                  onChange={handleChange}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9] focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none">
                  <Phone size={18} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="relative group md:col-span-1">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">
                Nom de l'établissement
              </span>
              <div className="relative">
                <input
                  type="text"
                  name="establishmentName"
                  placeholder="Clinique, Hôpital..."
                  value={formData.establishmentName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.establishmentName ? 'border-red-400' : 'border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]'} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`}
                />
              </div>
              {errors.establishmentName && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.establishmentName}</p>}
            </div>

            <div className="relative group md:col-span-1">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">
                Adresse de l'établissement
              </span>
              <div className="relative">
                <input
                  type="text"
                  name="establishmentAddress"
                  placeholder="Adresse complète"
                  value={formData.establishmentAddress}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.establishmentAddress ? 'border-red-400' : 'border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]'} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`}
                />
              </div>
              {errors.establishmentAddress && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.establishmentAddress}</p>}
            </div>

            <div className="relative group md:col-span-1">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">
                Années d'expérience
              </span>
              <div className="relative">
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`w-full pl-4 pr-10 py-3 rounded-xl border ${errors.experience ? 'border-red-400' : 'border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]'} focus:ring-0 outline-none ${formData.experience ? 'text-gray-700' : 'text-[#A0B5CD]'} text-sm appearance-none transition-colors`}
                >
                  <option value="" disabled hidden>Sélectionner</option>
                  <option value="< 1 an">Moins d'un an</option>
                  <option value="1-3 ans">1 - 3 ans</option>
                  <option value="3-5 ans">3 - 5 ans</option>
                  <option value="5-10 ans">5 - 10 ans</option>
                  <option value="+10 ans">+ 10 ans</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none">
                  <ChevronDown size={18} strokeWidth={1.5} />
                </div>
              </div>
              {errors.experience && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.experience}</p>}
            </div>
          </div>
        </div>

        {/* Choisir votre rôle */}
        <div className="mb-10 mt-10">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
            <div className="mx-4 text-[#365885] text-[15px] font-semibold tracking-wide">
              Choisir votre rôle
            </div>
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Médecin */}
            <div 
              onClick={() => handleRoleSelect("Médecin")}
              className={`flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 cursor-pointer transition-all ${
                formData.role === "Médecin" 
                  ? 'border-[#6492C9] bg-[#F4F8FB]' 
                  : 'border-[#D1DFEC] hover:border-[#89AEDB]'
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                formData.role === "Médecin" ? 'bg-[#6492C9]' : 'bg-[#EBF1F6]'
              }`}>
                <Stethoscope size={28} className={formData.role === "Médecin" ? 'text-white' : 'text-[#89AEDB]'} />
              </div>
              <span className={`font-semibold text-[15px] ${
                formData.role === "Médecin" ? 'text-[#0D2644]' : 'text-[#365885]'
              }`}>
                Médecin
              </span>
            </div>

            {/* Garde-malade */}
            <div 
              onClick={() => handleRoleSelect("Garde-malade")}
              className={`flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 cursor-pointer transition-all ${
                formData.role === "Garde-malade" 
                  ? 'border-[#6492C9] bg-[#F4F8FB]' 
                  : 'border-[#D1DFEC] hover:border-[#89AEDB]'
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                formData.role === "Garde-malade" ? 'bg-[#6492C9]' : 'bg-transparent border-2 border-[#D1DFEC]'
              }`}>
                <Users size={28} className={formData.role === "Garde-malade" ? 'text-white' : 'text-[#89AEDB]'} />
              </div>
              <span className={`font-semibold text-[15px] ${
                formData.role === "Garde-malade" ? 'text-[#0D2644]' : 'text-[#0D2644]'
              }`}>
                Garde-malade
              </span>
            </div>

            {/* Pharmacien */}
            <div 
              onClick={() => handleRoleSelect("Pharmacien")}
              className={`flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 cursor-pointer transition-all ${
                formData.role === "Pharmacien" 
                  ? 'border-[#6492C9] bg-[#F4F8FB]' 
                  : 'border-[#D1DFEC] hover:border-[#89AEDB]'
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                formData.role === "Pharmacien" ? 'bg-[#6492C9]' : 'bg-transparent border-2 border-[#D1DFEC]'
              }`}>
                <Pill size={28} className={formData.role === "Pharmacien" ? 'text-white' : 'text-[#89AEDB]'} />
              </div>
              <span className={`font-semibold text-[15px] ${
                formData.role === "Pharmacien" ? 'text-[#0D2644]' : 'text-[#0D2644]'
              }`}>
                Pharmacien
              </span>
            </div>
          </div>
          
          <div className="w-full h-px bg-[#D1DFEC]/50 mt-10 mb-8"></div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-[120px] bg-white border border-[#D1DFEC] hover:border-[#A0B5CD] hover:bg-gray-50 text-[#365885] py-3 rounded-xl text-[15px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            &larr; Retour
          </button>
          
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#6492C9] hover:bg-[#304B71] text-white py-3 rounded-xl text-[15px] font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1"
          >
            Suivant &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
