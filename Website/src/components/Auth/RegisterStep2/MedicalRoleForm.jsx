import { useState } from "react";
import { Check, Stethoscope, Users, Pill } from "lucide-react";
import StepBar from "./StepBar";
import { MEDICAL_STEPS } from "./MedicalForm";
import { useTheme } from "../../../context/ThemeContext";

const ROLES = [
  { id: "Médecin",      icon: <Stethoscope size={26} />, desc: "Généraliste ou Spécialiste" },
  { id: "Garde-malade", icon: <Users size={26} />,       desc: "Soins à domicile" },
  { id: "Pharmacien",   icon: <Pill size={26} />,        desc: "Officine ou Conseil" },
];

export default function MedicalRoleForm({ onComplete, onBack }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = {
    bg:       isDark ? "#0D1117" : "#F0F4F8",
    card:     isDark ? "#141B27" : "#ffffff",
    cardSel:  isDark ? "#1A2840" : "#EEF3FB",
    border:   isDark ? "#2A4A7F" : "#E4EAF5",
    txt:      isDark ? "#F0F3FA" : "#0D1B2E",
    txt2:     isDark ? "#8AAEE0" : "#5A6E8A",
    txt3:     isDark ? "#4A6080" : "#9AACBE",
    blue:     isDark ? "#638ECB" : "#4A6FA5",
    div:      isDark ? "#2A4A7F" : "#E4EAF5",
  };

  const [medicalRole, setMedicalRole] = useState("Médecin");

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ background: c.bg }}
    >
      <div className="w-full max-w-[480px]">

        <StepBar steps={MEDICAL_STEPS} current={3} />

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: c.div }} />
          <span className="text-[12px] font-semibold tracking-wide uppercase" style={{ color: c.txt2 }}>Votre métier</span>
          <div className="flex-1 h-px" style={{ background: c.div }} />
        </div>

        {/* Cartes de rôle */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {ROLES.map(({ id, icon, desc }) => {
            const isSelected = medicalRole === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMedicalRole(id)}
                className="flex flex-col items-center justify-center py-5 px-3 rounded-xl border-2 cursor-pointer transition-all"
                style={{
                  borderColor: isSelected ? c.blue : c.border,
                  background:  isSelected ? c.cardSel : c.card,
                  boxShadow:   isSelected ? `0 0 16px ${c.blue}40` : "none",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all"
                  style={{ background: isSelected ? c.blue : c.border, color: isSelected ? "#ffffff" : c.txt3 }}
                >
                  {icon}
                </div>
                <span className="font-bold text-[13px] mb-1" style={{ color: isSelected ? c.txt : c.txt2 }}>{id}</span>
                <span className="text-[11px] text-center leading-tight" style={{ color: isSelected ? c.txt2 : c.txt3 }}>{desc}</span>
                {isSelected && (
                  <div className="mt-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: c.blue }}>
                    <Check size={11} strokeWidth={3} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="px-5 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer"
            style={{ borderColor: c.border, color: c.txt2 }}>
            ← Retour
          </button>
          <button type="button" onClick={() => onComplete({ medicalRole })}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer"
            style={{ background: c.blue }}>
            Continuer →
          </button>
        </div>

      </div>

      {import.meta.env.DEV && (
        <button onClick={() => onComplete({ medicalRole })}
          className="fixed bottom-4 left-4 z-50 bg-black/80 text-[#8AAEE0] text-[10px] px-3 py-1.5 rounded border border-[#2A4A7F] hover:bg-[#173253] font-mono cursor-pointer">
          ⚡ DEV: Auto-Fill ({medicalRole})
        </button>
      )}
    </div>
  );
}
