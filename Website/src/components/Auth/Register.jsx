import { useState, useEffect } from "react";
import { User, EyeOff, Eye, Facebook, Mail, Lock, ArrowRight, UserCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function RegisterForm({ onLogin, onNextStep, isVisible, onSwitchToLogin }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ── Tokens séparés dark / light pour un contraste optimal ─────────────────
  const c = isDark ? {
    bg:          "#0D1117",
    inputBg:     "rgba(255,255,255,0.08)",
    inputBorder: "border-white/15 focus:border-[#638ECB]",
    inputTxt:    "#FFFFFF",
    icon:        "rgba(255,255,255,0.4)",
    placeholder: "placeholder-white/40",
    label:       "rgba(255,255,255,0.7)",
    title:       "#FFFFFF",
    subtitle:    "rgba(255,255,255,0.6)",
    blue:        "#638ECB",
    divLine:     "rgba(255,255,255,0.12)",
    divTxt:      "rgba(255,255,255,0.4)",
    oauthCls:    "bg-white/8 hover:bg-white/[.12] border-white/20",
    oauthIcon:   "rgba(255,255,255,0.85)",
    switchTxt:   "rgba(255,255,255,0.6)",
    msgBorder:   "rgba(255,255,255,0.15)",
    msgBg:       "rgba(59,130,246,0.08)",
    // Type de compte — non sélectionné
    typeIdleBg:  "rgba(255,255,255,0.06)",
    typeIdleBorder: "border-white/15",
    typeIdleTxt: "rgba(255,255,255,0.55)",
  } : {
    bg:          "#F0F4F8",
    inputBg:     "#ffffff",
    inputBorder: "border-[#E4EAF5] focus:border-[#4A6FA5]",
    inputTxt:    "#0D1B2E",
    icon:        "#4A6FA5",
    placeholder: "placeholder-[#9AACBE]",
    label:       "#5A6E8A",
    title:       "#0D1B2E",
    subtitle:    "#5A6E8A",
    blue:        "#4A6FA5",
    divLine:     "#E4EAF5",
    divTxt:      "#9AACBE",
    oauthCls:    "bg-white hover:bg-[#F8FAFC] border-[#E4EAF5]",
    oauthIcon:   "#5A6E8A",
    switchTxt:   "#5A6E8A",
    msgBorder:   "#D0DBF0",
    msgBg:       "#EEF3FB",
    typeIdleBg:  "#ffffff",
    typeIdleBorder: "border-[#E4EAF5]",
    typeIdleTxt: "#5A6E8A",
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("patient");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [oauthMessage, setOauthMessage] = useState("");

  useEffect(() => {
    if (!isVisible) {
      setFirstName(""); setLastName(""); setEmail(""); setPassword("");
      setConfirmPassword(""); setErrors({}); setShowPassword(false);
      setShowConfirmPassword(false); setAccountType("patient");
    }
  }, [isVisible]);

  function handleSubmit() {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = true;
    if (!lastName.trim()) newErrors.lastName = true;
    if (!email.trim()) newErrors.email = true;
    if (!password.trim()) newErrors.password = true;
    if (!confirmPassword.trim()) newErrors.confirmPassword = true;
    if (password.trim() && confirmPassword.trim() && password !== confirmPassword) {
      newErrors.confirmPassword = "mismatch";
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    if (onNextStep) {
      onNextStep({ firstName, lastName, email, accountType, password, confirmPassword });
    } else {
      onLogin(accountType);
    }
  }

  function handleDevFill() {
    const ts = Date.now();
    if (onNextStep) {
      onNextStep({ firstName: "Dev", lastName: "Test", email: `dev${ts}@test.com`, password: "DevTest@123", confirmPassword: "DevTest@123", accountType });
    } else {
      onLogin(accountType);
    }
  }

  const handleGoogleLogin = async () => {
    if (isGoogleLoading || isFacebookLoading) return;
    setIsGoogleLoading(true);
    setTimeout(() => { setIsGoogleLoading(false); setOauthMessage("L'authentification Google n'est pas encore disponible. (À lier au Backend)"); }, 1000);
  };

  const handleFacebookLogin = async () => {
    if (isGoogleLoading || isFacebookLoading) return;
    setIsFacebookLoading(true);
    setTimeout(() => { setIsFacebookLoading(false); setOauthMessage("L'authentification Facebook n'est pas encore disponible. (À lier au Backend)"); }, 1000);
  };

  // Classe input sans borderColor inline → focus: Tailwind fonctionne correctement
  const inputCls = (err, extraPad = "pr-4") =>
    `w-full pl-9 ${extraPad} py-[10px] rounded-xl text-sm transition-all outline-none border-2 ${c.placeholder} ${err ? "border-red-400" : c.inputBorder}`;

  return (
    <div
      className="w-full h-full flex flex-col justify-center px-8 xl:px-14 py-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ background: c.bg }}
    >
      <div className="max-w-md w-full mx-auto">

        {/* ── Logo ─────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.blue }}>
            <UserCircle size={18} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: c.title }}>MedSmart</span>
        </div>

        <div className="mb-3">
          <h1 className="text-[22px] font-bold leading-tight mb-1" style={{ color: c.title }}>Créez votre compte</h1>
          <p className="text-[12px]" style={{ color: c.subtitle }}>Rejoignez MedSmart aujourd'hui.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="space-y-3">

            {/* Prénom / Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[12px] font-medium block" style={{ color: c.label }}>Prénom</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.icon }}>
                    <User size={14} />
                  </span>
                  <input
                    type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    className={inputCls(errors.firstName)} placeholder="Votre prénom"
                    style={{ background: c.inputBg, color: c.inputTxt }}
                  />
                </div>
                {errors.firstName && <p className="text-[11px] text-red-400">Ce champ est requis</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-medium block" style={{ color: c.label }}>Nom</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.icon }}>
                    <User size={14} />
                  </span>
                  <input
                    type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                    className={inputCls(errors.lastName)} placeholder="Votre nom"
                    style={{ background: c.inputBg, color: c.inputTxt }}
                  />
                </div>
                {errors.lastName && <p className="text-[11px] text-red-400">Ce champ est requis</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[12px] font-medium block" style={{ color: c.label }}>Adresse Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.icon }}>
                  <Mail size={14} />
                </span>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={inputCls(errors.email)} placeholder="votre@email.com"
                  style={{ background: c.inputBg, color: c.inputTxt }}
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-400">Ce champ est requis</p>}
            </div>

            {/* Mot de passe */}
            <div className="space-y-1">
              <label className="text-[12px] font-medium block" style={{ color: c.label }}>Mot de passe</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.icon }}>
                  <Lock size={14} />
                </span>
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  className={inputCls(errors.password, "pr-12")} placeholder="••••••••"
                  style={{ background: c.inputBg, color: c.inputTxt }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                  style={{ color: c.icon }}>
                  {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-400">Ce champ est requis</p>}
            </div>

            {/* Confirmer mot de passe */}
            <div className="space-y-1">
              <label className="text-[12px] font-medium block" style={{ color: c.label }}>Confirmer le mot de passe</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.icon }}>
                  <Lock size={14} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputCls(errors.confirmPassword, "pr-12")} placeholder="••••••••"
                  style={{ background: c.inputBg, color: c.inputTxt }}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                  style={{ color: c.icon }}>
                  {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </div>
              {errors.confirmPassword === true && <p className="text-[11px] text-red-400">Ce champ est requis</p>}
              {errors.confirmPassword === "mismatch" && <p className="text-[11px] text-red-400">Les mots de passe ne correspondent pas</p>}
            </div>

            {/* Type de compte */}
            <div className="space-y-1">
              <label className="text-[12px] font-medium block" style={{ color: c.label }}>Type de compte</label>
              <div className="grid grid-cols-2 gap-3">
                {["patient", "personnel médical"].map((type) => {
                  const isSelected = accountType === type;
                  return (
                    <button
                      key={type} type="button" onClick={() => setAccountType(type)}
                      className={`w-full py-2 rounded-xl border-2 transition-all text-[12px] font-medium cursor-pointer capitalize flex items-center justify-center ${
                        isSelected ? "border-transparent" : c.typeIdleBorder
                      }`}
                      style={isSelected
                        ? { background: c.blue, color: "#ffffff" }
                        : { background: c.typeIdleBg, color: c.typeIdleTxt }
                      }
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Continuer */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-white shadow-lg group cursor-pointer hover:brightness-110"
                style={{ background: c.blue }}
              >
                Continuer <ArrowRight size={17} className="transform transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>
        </form>

        {/* ── Séparateur ──────────────────────────── */}
        <div className="flex items-center gap-3 mt-3 mb-2">
          <div className="flex-1 h-px" style={{ background: c.divLine }} />
          <span className="text-[11px]" style={{ color: c.divTxt }}>ou s'inscrire avec</span>
          <div className="flex-1 h-px" style={{ background: c.divLine }} />
        </div>

        {/* Socials */}
        <div className="flex flex-col items-center gap-3">
          {oauthMessage && (
            <div className="w-full p-3 rounded-xl text-xs font-medium border"
              style={{ color: c.subtitle, borderColor: c.msgBorder, background: c.msgBg }}>
              {oauthMessage}
            </div>
          )}
          <div className="flex gap-3 w-full">
            <button
              type="button" onClick={handleGoogleLogin} disabled={isGoogleLoading || isFacebookLoading}
              className={`flex-1 h-10 flex items-center justify-center rounded-xl transition-all disabled:opacity-50 border-2 cursor-pointer group ${c.oauthCls}`}
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 rounded-full animate-spin border-white/20 border-t-white/60" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18" className="transition-transform group-hover:scale-110">
                  <path fill={c.oauthIcon} d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
              )}
            </button>
            <button
              type="button" onClick={handleFacebookLogin} disabled={isGoogleLoading || isFacebookLoading}
              className={`flex-1 h-10 flex items-center justify-center rounded-xl transition-all disabled:opacity-50 border-2 cursor-pointer group ${c.oauthCls}`}
            >
              {isFacebookLoading ? (
                <div className="w-4 h-4 border-2 rounded-full animate-spin border-white/20 border-t-white/60" />
              ) : (
                <Facebook size={18} fill={c.oauthIcon} strokeWidth={0} className="transition-transform group-hover:scale-110" />
              )}
            </button>
          </div>

          {/* Switch vers Login */}
          {onSwitchToLogin && (
            <p className="text-center text-[12px] pt-1" style={{ color: c.switchTxt }}>
              Déjà un compte ?{" "}
              <button type="button" onClick={onSwitchToLogin}
                className="font-semibold transition-colors hover:underline cursor-pointer" style={{ color: c.blue }}>
                Se connecter
              </button>
            </p>
          )}
        </div>

      </div>

      {import.meta.env.DEV && (
        <button type="button" onClick={handleDevFill}
          className="fixed bottom-4 left-4 z-50 bg-black/80 text-[#8AAEE0] text-[10px] px-3 py-1.5 rounded border border-[#2A4A7F] hover:bg-[#173253] font-mono cursor-pointer transition-colors">
          ⚡ DEV: Auto-Fill
        </button>
      )}
    </div>
  );
}
