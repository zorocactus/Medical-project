import { useState } from "react";
import { Phone, User, Home, Calendar, ChevronDown } from "lucide-react";

export default function PatientForm({ onComplete, onBack }) {
  const [formData, setFormData] = useState({
    birthDate: "",
    sex: "Masculin",
    phone: "",
    idCardNumber: "",
    address: "",
    postalCode: "",
    city: "",
    wilaya: "Alger",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const requiredFields = ["birthDate", "phone", "idCardNumber", "address", "postalCode", "city"];

  const handleSubmit = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "Ce champ est obligatoire";
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onComplete(formData);
  };

  const fieldClass = (name) =>
    `w-full pl-4 pr-10 py-3 rounded-xl border ${errors[name] ? "border-red-400 focus:border-red-500" : "border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]"} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`;

  return (
    <div className="min-h-screen bg-[#D1DFEC] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-[800px] px-[60px] py-[50px] relative">
        <h2 className="text-[28px] font-bold text-[#0D2644] text-center mb-10">
          Créer votre compte
        </h2>

        {/* Step Indicator */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center w-full max-w-[480px] justify-between relative px-2">
            <div className="absolute left-[30px] right-[50%] h-px bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[50%] right-[30px] h-px bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-sm z-10 shadow-sm relative">1</div>
            <div className="w-[32px] h-[32px] rounded-full bg-white border border-[#D1DFEC] text-[#89AEDB] flex items-center justify-center font-bold text-sm z-10 relative">2</div>
            <div className="w-[32px] h-[32px] rounded-full bg-white border border-[#D1DFEC] text-[#89AEDB] flex items-center justify-center font-bold text-sm z-10 relative">3</div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
            <div className="mx-4 text-[#365885] text-[15px] font-semibold tracking-wide">Informations personnelles</div>
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            {/* Date de naissance */}
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Date de naissance</span>
              <div className="relative">
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                  className={fieldClass("birthDate")} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none"><Calendar size={18} strokeWidth={1.5} /></div>
              </div>
              {errors.birthDate && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.birthDate}</p>}
            </div>

            {/* Sexe */}
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Sexe</span>
              <div className="relative">
                <select name="sex" value={formData.sex} onChange={handleChange}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9] focus:ring-0 outline-none text-gray-700 text-sm appearance-none transition-colors">
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none"><ChevronDown size={18} strokeWidth={1.5} /></div>
              </div>
            </div>

            {/* Téléphone */}
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Numéro de téléphone</span>
              <div className="relative">
                <input type="tel" name="phone" placeholder="+213 XXX XX XX XX" value={formData.phone} onChange={handleChange}
                  className={fieldClass("phone")} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none"><Phone size={18} strokeWidth={1.5} /></div>
              </div>
              {errors.phone && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.phone}</p>}
            </div>

            {/* Carte d'identité */}
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Numéro carte d'identité</span>
              <div className="relative">
                <input type="text" name="idCardNumber" placeholder="000000000000000000" value={formData.idCardNumber} onChange={handleChange}
                  className={fieldClass("idCardNumber")} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none"><User size={18} strokeWidth={1.5} /></div>
              </div>
              {errors.idCardNumber && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.idCardNumber}</p>}
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
            {/* Adresse */}
            <div className="relative group md:col-span-1">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Adresse</span>
              <div className="relative">
                <input type="text" name="address" placeholder="Rue, numéro..." value={formData.address} onChange={handleChange}
                  className={fieldClass("address")} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none"><Home size={18} strokeWidth={1.5} /></div>
              </div>
              {errors.address && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.address}</p>}
            </div>

            {/* Code postal */}
            <div className="relative group md:col-span-1">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Code postal</span>
              <div className="relative">
                <input type="text" name="postalCode" placeholder="16000" value={formData.postalCode} onChange={handleChange}
                  className={`w-full pl-4 pr-4 py-3 rounded-xl border ${errors.postalCode ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]"} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`} />
              </div>
              {errors.postalCode && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.postalCode}</p>}
            </div>

            {/* Commune */}
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Commune</span>
              <div className="relative">
                <input type="text" name="city" placeholder="Rouiba" value={formData.city} onChange={handleChange}
                  className={`w-full pl-4 pr-4 py-3 rounded-xl border ${errors.city ? "border-red-400" : "border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9]"} focus:ring-0 outline-none text-gray-700 text-sm transition-colors placeholder:text-[#A0B5CD]`} />
              </div>
              {errors.city && <p className="text-red-500 text-[12px] mt-1 ml-1">{errors.city}</p>}
            </div>

            {/* Wilaya */}
            <div className="relative group">
              <span className="absolute -top-3 left-4 px-1.5 bg-white text-[13px] font-medium text-[#365885] z-10">Wilaya</span>
              <div className="relative">
                <select name="wilaya" value={formData.wilaya} onChange={handleChange}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-[#D1DFEC] hover:border-[#89AEDB] focus:border-[#6492C9] focus:ring-0 outline-none text-gray-700 text-sm appearance-none transition-colors">
                  <option value="Alger">Alger</option>
                  <option value="Oran">Oran</option>
                  <option value="Constantine">Constantine</option>
                  <option value="Annaba">Annaba</option>
                  <option value="Blida">Blida</option>
                  <option value="Batna">Batna</option>
                  <option value="Sétif">Sétif</option>
                  <option value="Tlemcen">Tlemcen</option>
                  <option value="Tizi Ouzou">Tizi Ouzou</option>
                  <option value="Béjaïa">Béjaïa</option>
                  <option value="Jijel">Jijel</option>
                  <option value="Autre">Autre</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89AEDB] pointer-events-none"><ChevronDown size={18} strokeWidth={1.5} /></div>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-[#D1DFEC]/50 mt-10 mb-8"></div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <button onClick={onBack}
            className="w-[120px] bg-white border border-[#D1DFEC] hover:border-[#A0B5CD] hover:bg-gray-50 text-[#365885] py-3 rounded-xl text-[15px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1">
            &larr; Retour
          </button>
          <button onClick={handleSubmit}
            className="flex-1 bg-[#6492C9] hover:bg-[#304B71] text-white py-3 rounded-xl text-[15px] font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1">
            Continuer &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
