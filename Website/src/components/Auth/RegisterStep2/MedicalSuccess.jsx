import { Check } from "lucide-react";
import StepBar from "./StepBar";
import { MEDICAL_STEPS } from "./MedicalForm";
import { useTheme } from "../../../context/ThemeContext";

export default function MedicalSuccess({ onComplete }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = {
    bg:    isDark ? "#0D1117" : "#F0F4F8",
    border:isDark ? "#2A4A7F" : "#E4EAF5",
    txt:   isDark ? "#F0F3FA" : "#0D1B2E",
    txt2:  isDark ? "#8AAEE0" : "#5A6E8A",
    txt3:  isDark ? "#4A6080" : "#9AACBE",
    blue:  isDark ? "#638ECB" : "#4A6FA5",
    green: "#2D8C6F",
    div:   isDark ? "#2A4A7F" : "#E4EAF5",
  };

  const timeline = [
    { done: true,  active: false, title: "Documents soumis",         sub: "À l'instant" },
    { done: false, active: true,  title: "En cours de vérification",  sub: "Notre équipe examine votre dossier" },
    { done: false, active: false, title: "Compte approuvé",           sub: "Notification par email" },
    { done: false, active: false, title: "Accès complet",             sub: "Bienvenue sur MedSmart" },
  ];

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ background: c.bg }}
    >
      <div className="w-full max-w-[480px]">

        <StepBar steps={MEDICAL_STEPS} current={MEDICAL_STEPS.length + 1} />

        {/* Icône succès */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2"
            style={{ background: `${c.blue}20`, borderColor: c.blue }}>
            <Check size={32} strokeWidth={3} style={{ color: c.blue }} />
          </div>
          <h3 className="text-xl font-bold text-center mb-2" style={{ color: c.txt }}>
            Dossier soumis avec succès !
          </h3>
          <p className="text-center text-[13px] max-w-[380px]" style={{ color: c.txt2 }}>
            Votre dossier est en cours de vérification. Vous recevrez une notification dans les{" "}
            <span className="font-semibold" style={{ color: c.txt }}>24 à 48 heures</span>{" "}
            une fois votre compte approuvé.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-8 mb-8">
          <div className="absolute left-[7px] top-3 bottom-3 w-px" style={{ background: c.div }} />
          {timeline.map((item, i) => (
            <div key={i} className="relative mb-5 last:mb-0">
              <div
                className="absolute -left-8 top-1 w-[14px] h-[14px] rounded-full flex items-center justify-center z-10 ring-2"
                style={{
                  background:  item.done ? c.green : item.active ? c.blue : "transparent",
                  ringColor:   "transparent",
                  borderWidth: item.done || item.active ? 0 : 2,
                  borderStyle: "solid",
                  borderColor: c.border,
                  outline:     "2px solid transparent",
                  boxShadow:   "none",
                }}
              >
                {item.done && <Check size={8} className="text-white" strokeWidth={3} />}
              </div>
              <h4 className="text-[13px] font-semibold leading-tight mb-0.5"
                style={{ color: item.done || item.active ? c.txt : c.txt3 }}>
                {item.title}
              </h4>
              <p className="text-[12px]" style={{ color: c.txt3 }}>{item.sub}</p>
            </div>
          ))}
        </div>

        <button onClick={onComplete}
          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer"
          style={{ background: c.blue, boxShadow: `0 0 16px ${c.blue}50` }}>
          Accéder à l'application →
        </button>

      </div>
    </div>
  );
}
