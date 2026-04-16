import { useState } from "react";
import { CreditCard, User } from "lucide-react";
import StepBar from "./StepBar";
import { MEDICAL_STEPS } from "./MedicalForm";
import { useTheme } from "../../../context/ThemeContext";

function UploadZone({ id, label, hint, file, error, onChange, c }) {
  return (
    <div className="space-y-1">
      <label className="text-[12px] font-medium block" style={{ color: c.txt2 }}>{label}</label>
      <div className="relative">
        <input type="file" id={`med-${id}`} accept=".jpg,.jpeg,.png,.pdf" onChange={onChange} className="hidden" />
        <label htmlFor={`med-${id}`}
          className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all"
          style={{
            borderColor: error ? "#f87171" : file ? c.blue : c.border,
            background:  error ? "rgba(248,113,113,0.05)" : file ? `${c.blue}18` : "transparent",
          }}
        >
          {id === "profilePhoto"
            ? <User size={24} strokeWidth={1.5} className="mb-2" style={{ color: file ? c.blue : error ? "#f87171" : c.txt3 }} />
            : <CreditCard size={24} strokeWidth={1.5} className="mb-2" style={{ color: file ? c.blue : error ? "#f87171" : c.txt3 }} />
          }
          <span className="font-semibold text-[13px] mb-0.5" style={{ color: file ? c.blue : c.txt2 }}>
            {file ? "✓ Ajouté" : hint}
          </span>
          <span className="text-[11px]" style={{ color: c.txt3 }}>JPG, PNG, PDF — 5MB max</span>
        </label>
      </div>
      {error && <p className="text-[11px] text-red-400 text-center">{error}</p>}
    </div>
  );
}

export default function MedicalIdentityForm({ onComplete, onBack }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = {
    bg:    isDark ? "#0D1117" : "#F0F4F8",
    input: isDark ? "#141B27" : "#ffffff",
    border:isDark ? "#2A4A7F" : "#E4EAF5",
    txt:   isDark ? "#F0F3FA" : "#0D1B2E",
    txt2:  isDark ? "#8AAEE0" : "#5A6E8A",
    txt3:  isDark ? "#4A6080" : "#9AACBE",
    blue:  isDark ? "#638ECB" : "#4A6FA5",
    div:   isDark ? "#2A4A7F" : "#E4EAF5",
  };

  const [files, setFiles] = useState({ cinRecto: null, cinVerso: null, profilePhoto: null });
  const [errors, setErrors] = useState({});

  const handleFile = (e, key) => {
    setFiles((prev) => ({ ...prev, [key]: e.target.files[0] }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!files.cinRecto)     newErrors.cinRecto     = "Ce champ est obligatoire";
    if (!files.cinVerso)     newErrors.cinVerso     = "Ce champ est obligatoire";
    if (!files.profilePhoto) newErrors.profilePhoto = "Ce champ est obligatoire";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onComplete(files);
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ background: c.bg }}
    >
      <div className="w-full max-w-[480px]">

        <StepBar steps={MEDICAL_STEPS} current={2} />

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: c.div }} />
          <span className="text-[12px] font-semibold tracking-wide uppercase" style={{ color: c.txt2 }}>Vérification d'identité</span>
          <div className="flex-1 h-px" style={{ background: c.div }} />
        </div>

        <p className="text-center text-[13px] mb-6" style={{ color: c.txt3 }}>
          Téléchargez vos documents d'identité pour valider votre compte.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <UploadZone id="cinRecto"     label="CIN Recto"       hint="CIN Recto"       file={files.cinRecto}     error={errors.cinRecto}     onChange={(e) => handleFile(e, "cinRecto")}     c={c} />
          <UploadZone id="cinVerso"     label="CIN Verso"       hint="CIN Verso"       file={files.cinVerso}     error={errors.cinVerso}     onChange={(e) => handleFile(e, "cinVerso")}     c={c} />
          <UploadZone id="profilePhoto" label="Photo de profil"  hint="Photo de profil"  file={files.profilePhoto} error={errors.profilePhoto} onChange={(e) => handleFile(e, "profilePhoto")} c={c} />
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="px-5 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer"
            style={{ borderColor: c.border, color: c.txt2 }}>
            ← Retour
          </button>
          <button type="button" onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer"
            style={{ background: c.blue }}>
            Continuer →
          </button>
        </div>

      </div>

      {import.meta.env.DEV && (
        <button onClick={() => onComplete({
          cinRecto: new File([""], "cin_recto.jpg", { type: "image/jpeg" }),
          cinVerso: new File([""], "cin_verso.jpg", { type: "image/jpeg" }),
          profilePhoto: new File([""], "photo.jpg", { type: "image/jpeg" }),
        })}
          className="fixed bottom-4 left-4 z-50 bg-black/80 text-[#8AAEE0] text-[10px] px-3 py-1.5 rounded border border-[#2A4A7F] hover:bg-[#173253] font-mono cursor-pointer">
          ⚡ DEV: Auto-Fill
        </button>
      )}
    </div>
  );
}
