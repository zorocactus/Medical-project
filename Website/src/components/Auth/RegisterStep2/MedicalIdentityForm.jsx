import { useState } from "react";
import { CreditCard, User, Check } from "lucide-react";

export default function MedicalIdentityForm({ onComplete, onBack }) {
  const [files, setFiles] = useState({
    cinRecto: null,
    cinVerso: null,
    profilePhoto: null,
  });

  const [errors, setErrors] = useState({});

  const handleFileChange = (e, fileType) => {
    setFiles((prev) => ({ ...prev, [fileType]: e.target.files[0] }));
    if (errors[fileType]) setErrors((prev) => ({ ...prev, [fileType]: "" }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!files.cinRecto) newErrors.cinRecto = "Ce champ est obligatoire";
    if (!files.cinVerso) newErrors.cinVerso = "Ce champ est obligatoire";
    if (!files.profilePhoto) newErrors.profilePhoto = "Ce champ est obligatoire";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onComplete(files);
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
            <div className="absolute left-[25%] right-[50%] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[50%] right-[25%] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[75%] right-[30px] h-[2px] bg-[#D1DFEC] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 shadow-sm relative"><Check size={16} strokeWidth={3} /></div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 relative">2</div>
            <div className="w-[32px] h-[32px] rounded-full bg-white border-2 border-[#D1DFEC] text-[#D1DFEC] flex items-center justify-center font-bold text-[13px] z-10 relative">3</div>
            <div className="w-[32px] h-[32px] rounded-full bg-white border-2 border-[#D1DFEC] text-[#D1DFEC] flex items-center justify-center font-bold text-[13px] z-10 relative">4</div>
            <div className="w-[32px] h-[32px] rounded-full bg-white border-2 border-[#D1DFEC] text-[#D1DFEC] flex items-center justify-center font-bold text-[13px] z-10 relative">5</div>
          </div>
        </div>

        {/* Identity Verification */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
            <div className="mx-4 text-[#365885] text-[15px] font-semibold tracking-wide">Vérification d'identité</div>
            <div className="flex-1 h-px bg-[#D1DFEC]"></div>
          </div>

          <p className="text-center text-[#5C738A] text-[15px] mb-8">
            Veuillez télécharger vos documents d'identité pour valider votre compte.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CIN Recto */}
            <div className="relative">
              <input type="file" id="cinRecto" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange(e, "cinRecto")} className="hidden" />
              <label htmlFor="cinRecto"
                className={`flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed ${errors.cinRecto ? 'border-red-400' : files.cinRecto ? 'border-[#6492C9] bg-[#F4F8FB]' : 'border-[#D1DFEC] hover:border-[#89AEDB]'} cursor-pointer transition-colors group`}>
                <CreditCard size={32} strokeWidth={1.5} className={`mb-3 ${files.cinRecto ? 'text-[#6492C9]' : errors.cinRecto ? 'text-red-400' : 'text-[#89AEDB] group-hover:text-[#6492C9]'}`} />
                <span className="text-[#0D2644] font-semibold text-[15px] mb-1">{files.cinRecto ? 'Recto Ajouté' : 'CIN Recto'}</span>
                <span className="text-[#A0B5CD] text-[12px]">JPG, PNG, PDF - 5MB max</span>
              </label>
              {errors.cinRecto && <p className="text-red-500 text-[12px] mt-1 text-center">{errors.cinRecto}</p>}
            </div>

            {/* CIN Verso */}
            <div className="relative">
              <input type="file" id="cinVerso" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileChange(e, "cinVerso")} className="hidden" />
              <label htmlFor="cinVerso"
                className={`flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed ${errors.cinVerso ? 'border-red-400' : files.cinVerso ? 'border-[#6492C9] bg-[#F4F8FB]' : 'border-[#D1DFEC] hover:border-[#89AEDB]'} cursor-pointer transition-colors group`}>
                <CreditCard size={32} strokeWidth={1.5} className={`mb-3 ${files.cinVerso ? 'text-[#6492C9]' : errors.cinVerso ? 'text-red-400' : 'text-[#89AEDB] group-hover:text-[#6492C9]'}`} />
                <span className="text-[#0D2644] font-semibold text-[15px] mb-1">{files.cinVerso ? 'Verso Ajouté' : 'CIN Verso'}</span>
                <span className="text-[#A0B5CD] text-[12px]">JPG, PNG, PDF - 5MB max</span>
              </label>
              {errors.cinVerso && <p className="text-red-500 text-[12px] mt-1 text-center">{errors.cinVerso}</p>}
            </div>

            {/* Photo de profil */}
            <div className="relative">
              <input type="file" id="profilePhoto" accept=".jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, "profilePhoto")} className="hidden" />
              <label htmlFor="profilePhoto"
                className={`flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed ${errors.profilePhoto ? 'border-red-400' : files.profilePhoto ? 'border-[#6492C9] bg-[#F4F8FB]' : 'border-[#D1DFEC] hover:border-[#89AEDB]'} cursor-pointer transition-colors group`}>
                <User size={32} strokeWidth={1.5} className={`mb-3 ${files.profilePhoto ? 'text-[#6492C9]' : errors.profilePhoto ? 'text-red-400' : 'text-[#89AEDB] group-hover:text-[#6492C9]'}`} />
                <span className="text-[#0D2644] font-semibold text-[15px] mb-1">{files.profilePhoto ? 'Photo Ajoutée' : 'Photo de profil'}</span>
                <span className="text-[#A0B5CD] text-[12px]">Photo claire - 5MB max</span>
              </label>
              {errors.profilePhoto && <p className="text-red-500 text-[12px] mt-1 text-center">{errors.profilePhoto}</p>}
            </div>
          </div>
          <div className="w-full h-px bg-[#D1DFEC]/50 mt-10 mb-8"></div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
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