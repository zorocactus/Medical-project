import { Check } from "lucide-react";

export default function MedicalSuccess({ onComplete }) {
  return (
    <div className="min-h-screen bg-[#D1DFEC] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-[650px] px-[60px] py-[50px] relative">
        <h2 className="text-[28px] font-bold text-[#0D2644] text-center mb-10">
          Créer votre compte
        </h2>

        {/* 5-Step Indicator */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center w-full max-w-[480px] justify-between relative px-2">
            {/* Connecting Lines */}
            <div className="absolute left-[30px] right-[75%] h-[2px] bg-[#6492C9] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[25%] right-[50%] h-[2px] bg-[#6492C9] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[50%] right-[25%] h-[2px] bg-[#6492C9] z-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute left-[75%] right-[30px] h-[2px] bg-[#6492C9] z-0 top-1/2 -translate-y-1/2"></div>
            
            {/* Steps */}
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 shadow-sm relative">
              <Check size={16} strokeWidth={3} />
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 relative">
              <Check size={16} strokeWidth={3} />
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 relative">
              <Check size={16} strokeWidth={3} />
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 relative">
              <Check size={16} strokeWidth={3} />
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#6492C9] text-white flex items-center justify-center font-bold text-[13px] z-10 relative">
              <Check size={16} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Success Content */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#F3F7FA] flex items-center justify-center mb-6">
            <Check size={40} className="text-[#6492C9]" strokeWidth={3} />
          </div>

          <h3 className="text-[24px] font-bold text-[#0D2644] text-center mb-4">
            Dossier soumis avec succès !
          </h3>
          
          <p className="text-center text-[#5C738A] text-[15px] mb-10 max-w-[450px]">
            Votre dossier est en cours de vérification. Vous recevrez une notification dans les <span className="font-semibold text-[#0D2644]">24 à 48 heures</span> une fois votre compte approuvé.
          </p>

          {/* Timeline */}
          <div className="w-full max-w-[350px] relative pl-10 mb-10">
            {/* Vertical Line */}
            <div className="absolute left-[8px] top-[14px] bottom-[28px] w-px bg-[#D1DFEC]"></div>

            {/* Event 1 */}
            <div className="relative mb-6">
              <div className="absolute -left-10 top-1.5 w-4 h-4 rounded-full bg-[#6492C9] flex items-center justify-center z-10 ring-4 ring-white">
                <Check size={10} className="text-white" strokeWidth={3} />
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#0D2644] leading-tight mb-1">Documents soumis</h4>
                <p className="text-[13px] text-[#A0B5CD]">À l'instant</p>
              </div>
            </div>

            {/* Event 2 */}
            <div className="relative mb-6">
              <div className="absolute -left-10 top-1.5 w-4 h-4 rounded-full bg-[#6492C9] z-10 ring-4 ring-white"></div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#0D2644] leading-tight mb-1">En cours de vérification</h4>
                <p className="text-[13px] text-[#A0B5CD]">Notre équipe vérifie votre identité</p>
              </div>
            </div>

            {/* Event 3 */}
            <div className="relative mb-6">
              <div className="absolute -left-10 top-1.5 w-4 h-4 rounded-full border-2 border-[#D1DFEC] bg-white z-10 ring-4 ring-white"></div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#5C738A] leading-tight mb-1">Compte approuvé</h4>
                <p className="text-[13px] text-[#A0B5CD]">Notification par email</p>
              </div>
            </div>

            {/* Event 4 */}
            <div className="relative">
              <div className="absolute -left-10 top-1.5 w-4 h-4 rounded-full border-2 border-[#D1DFEC] bg-white z-10 ring-4 ring-white"></div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#5C738A] leading-tight mb-1">Accès complet</h4>
                <p className="text-[13px] text-[#A0B5CD]">Bienvenue sur MedSmart</p>
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={onComplete}
            className="w-full max-w-[350px] bg-[#6492C9] hover:bg-[#304B71] text-white py-3.5 rounded-xl text-[15px] font-medium transition-all shadow-sm cursor-pointer"
          >
            Accéder à l'application &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}