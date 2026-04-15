import { useState } from "react";
import { Check, ChevronDown, Stethoscope, Users, Pill } from "lucide-react";

// ────────────────────────────────────────────────────────────────
// MedicalRoleForm — Step 3 : Choisir son métier médical
// ────────────────────────────────────────────────────────────────
export default function MedicalRoleForm({ onComplete, onBack }) {
  const [medicalRole, setMedicalRole] = useState("Médecin");

  const handleSubmit = () => {
    onComplete({ medicalRole });
  };

  // ⚡ DEV BYPASS
  const handleDevFill = () => {
    onComplete({ medicalRole });
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
              <div key={i} className={`w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[13px] z-10 relative ${i < 2 ? "bg-[#6492C9] text-white shadow-sm" : i === 2 ? "bg-[#6492C9] text-white shadow-sm" : "bg-white border-2 border-[#D1DFEC] text-[#D1DFEC]"}`}>
                {i < 2 ? <Check size={16} strokeWidth={3} /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* ── Choisir votre métier ── */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-[#D1DFEC]" />
            <span className="mx-4 text-[#365885] text-[15px] font-semibold tracking-wide">Choisir votre métier</span>
            <div className="flex-1 h-px bg-[#D1DFEC]" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { id: "Médecin",      icon: <Stethoscope size={28} />, desc: "Généraliste ou Spécialiste" },
              { id: "Garde-malade", icon: <Users size={28} />,       desc: "Soins à domicile" },
              { id: "Pharmacien",   icon: <Pill size={28} />,        desc: "Officine ou Conseil" },
            ].map(({ id, icon, desc }) => (
              <div
                key={id}
                onClick={() => setMedicalRole(id)}
                className={`flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 cursor-pointer transition-all ${
                  medicalRole === id
                    ? "border-[#6492C9] bg-[#F4F8FB] shadow-md shadow-[#6492C9]/15"
                    : "border-[#D1DFEC] hover:border-[#89AEDB] hover:bg-[#FAFCFF]"
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all ${
                  medicalRole === id ? "bg-[#6492C9]" : "bg-[#EBF1F6]"
                }`}>
                  <span className={medicalRole === id ? "text-white" : "text-[#89AEDB]"}>{icon}</span>
                </div>
                <span className={`font-bold text-[16px] ${medicalRole === id ? "text-[#0D2644]" : "text-[#365885]"}`}>{id}</span>
                <span className={`text-[12px] mt-1 ${medicalRole === id ? "text-[#6492C9]" : "text-[#A0B5CD]"}`}>{desc}</span>
                {medicalRole === id && (
                  <div className="mt-2 w-5 h-5 rounded-full bg-[#6492C9] flex items-center justify-center">
                    <Check size={11} strokeWidth={3} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-[#D1DFEC]/50 mt-10 mb-8" />
        </div>

        {/* ── Buttons ── */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-[120px] bg-white border border-[#D1DFEC] hover:border-[#A0B5CD] hover:bg-gray-50 text-[#365885] py-3 rounded-xl text-[15px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            ← Retour
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#6492C9] hover:bg-[#304B71] text-white py-3 rounded-xl text-[15px] font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1"
          >
            Suivant →
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
