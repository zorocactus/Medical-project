import { Check } from "lucide-react";
import StepBar from "./StepBar";
import { PATIENT_STEPS } from "./PatientForm";
import { useTheme } from "../../../context/ThemeContext";

export default function PatientSuccess({ onComplete }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = {
    bg:    isDark ? "#0D1117" : "#F0F4F8",
    card:  isDark ? "#141B27" : "#ffffff",
    border:isDark ? "#2A4A7F" : "#E4EAF5",
    txt:   isDark ? "#F0F3FA" : "#0D1B2E",
    txt2:  isDark ? "#8AAEE0" : "#5A6E8A",
    txt3:  isDark ? "#4A6080" : "#9AACBE",
    blue:  isDark ? "#638ECB" : "#4A6FA5",
    green: "#2D8C6F",
    div:   isDark ? "#2A4A7F" : "#E4EAF5",
  };

  const timeline = [
    { done: true,  title: "Inscription complétée",   sub: "À l'instant" },
    { done: true,  title: "Compte activé",            sub: "Accès immédiat" },
    { done: false, title: "Première consultation",    sub: "Trouvez un médecin" },
    { done: false, title: "Dossier médical complet",  sub: "Ajoutez vos antécédents" },
  ];

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ background: c.bg }}
    >
      <div className="w-full max-w-[480px]">

        <StepBar steps={PATIENT_STEPS} current={PATIENT_STEPS.length + 1} />

        {/* Icône succès */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2"
            style={{ background: `${c.green}20`, borderColor: c.green }}>
            <Check size={32} strokeWidth={3} style={{ color: c.green }} />
          </div>
          <h3 className="text-xl font-bold text-center mb-2" style={{ color: c.txt }}>
            Compte créé avec succès !
          </h3>
          <p className="text-center text-[13px] max-w-[360px]" style={{ color: c.txt2 }}>
            Votre compte patient est prêt. Vous pouvez dès maintenant accéder à votre espace personnel.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-8 mb-8">
          <div className="absolute left-[7px] top-3 bottom-3 w-px" style={{ background: c.div }} />
          {timeline.map((item, i) => (
            <div key={i} className="relative mb-5 last:mb-0">
              <div className="absolute -left-8 top-1 w-[14px] h-[14px] rounded-full flex items-center justify-center z-10"
                style={{ background: item.done ? c.green : "transparent", borderWidth: item.done ? 0 : 2, borderStyle: "solid", borderColor: c.border }}>
                {item.done && <Check size={8} className="text-white" strokeWidth={3} />}
              </div>
              <h4 className="text-[13px] font-semibold leading-tight mb-0.5" style={{ color: item.done ? c.txt : c.txt3 }}>
                {item.title}
              </h4>
              <p className="text-[12px]" style={{ color: c.txt3 }}>{item.sub}</p>
            </div>
          ))}
        </div>

        <button onClick={onComplete}
          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer"
          style={{ background: c.blue, boxShadow: `0 0 16px ${c.blue}50` }}>
          Accéder à mon espace →
        </button>

      </div>
    </div>
  );
}
