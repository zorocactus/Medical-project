import { useState, useEffect } from "react";
import { Mail, Lock, EyeOff, Eye, ArrowRight, Facebook, Activity } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import ForgotPassword from "./ForgotPassword";

export default function LoginForm({ onLogin, onSwitchToRegister }) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }
  return <LoginInner onLogin={onLogin} onSwitchToRegister={onSwitchToRegister} onForgotPassword={() => setShowForgotPassword(true)} />;
}

function LoginInner({ onLogin, onSwitchToRegister, onForgotPassword }) {
  const { login } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
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
    blueHover:   "#7AABEE",
    divLine:     "rgba(255,255,255,0.12)",
    divTxt:      "rgba(255,255,255,0.4)",
    oauthCls:    "bg-white/8 hover:bg-white/[.12] border-white/20",
    oauthIcon:   "rgba(255,255,255,0.85)",
    switchTxt:   "rgba(255,255,255,0.6)",
    msgBorder:   "rgba(255,255,255,0.15)",
    msgBg:       "rgba(59,130,246,0.08)",
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
    blueHover:   "#3D5E8F",
    divLine:     "#E4EAF5",
    divTxt:      "#9AACBE",
    oauthCls:    "bg-white hover:bg-[#F8FAFC] border-[#E4EAF5]",
    oauthIcon:   "#5A6E8A",
    switchTxt:   "#5A6E8A",
    msgBorder:   "#D0DBF0",
    msgBg:       "#EEF3FB",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [oauthMessage, setOauthMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("expired") === "1") {
      setApiError(t('auth.login.sessionExpired'));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  async function handleSubmit() {
    const newErrors = {};
    if (!email.trim()) newErrors.email = true;
    if (!password.trim()) newErrors.password = true;
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      const me = await login(email, password);
      onLogin(me?.role || "patient", me);
    } catch (err) {
      setApiError(err.message || t('auth.login.incorrectCredentials'));
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    if (isGoogleLoading || isFacebookLoading) return;
    setIsGoogleLoading(true);
    setTimeout(() => { setIsGoogleLoading(false); setOauthMessage(t('auth.login.googleUnavailable')); }, 1000);
  };

  const handleFacebookLogin = async () => {
    if (isGoogleLoading || isFacebookLoading) return;
    setIsFacebookLoading(true);
    setTimeout(() => { setIsFacebookLoading(false); setOauthMessage(t('auth.login.facebookUnavailable')); }, 1000);
  };

  // classe commune pour les inputs (sans fond ni border, ajoutés via style + c.inputBorder)
  const inputBase = (padRight, hasError) =>
    `w-full pl-10 ${padRight} py-3 rounded-xl text-sm transition-all outline-none border-2 ${c.placeholder} ${hasError ? "border-red-400" : c.inputBorder}`;

  return (
    <div
      className="w-full h-full flex flex-col justify-center px-8 xl:px-14 py-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ background: c.bg }}
    >
      <div className="max-w-sm w-full mx-auto">

        {/* ── Logo ─────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 mb-9">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.blue }}>
            <Activity size={18} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: c.title }}>MedSmart</span>
        </div>

        {/* ── Titre ────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold leading-tight mb-1.5" style={{ color: c.title }}>
            {t('auth.login.title')}
          </h1>
          <p className="text-sm" style={{ color: c.subtitle }}>{t('auth.login.subtitle')}</p>
        </div>

        {/* ── Messages d'erreur ────────────────────────── */}
        {apiError && (
          <div className="mb-5 p-3.5 rounded-xl text-sm font-medium border bg-red-500/10 text-red-400 border-red-500/20">
            {apiError}
          </div>
        )}
        {oauthMessage && (
          <div className="mb-5 p-3.5 rounded-xl text-sm font-medium border"
            style={{ color: c.subtitle, borderColor: c.msgBorder, background: c.msgBg }}>
            {oauthMessage}
          </div>
        )}

        <div className="space-y-5">

          {/* ── Email ────────────────────────────────── */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium block" style={{ color: c.label }}>{t('auth.login.email')}</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.icon }}>
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.login.emailPlaceholder')}
                className={inputBase("pr-4", errors.email)}
                style={{ background: c.inputBg, color: c.inputTxt }}
              />
            </div>
            {errors.email && <p className="text-xs text-red-400">{t('auth.login.required')}</p>}
          </div>

          {/* ── Mot de passe ─────────────────────────── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" style={{ color: c.label }}>{t('auth.login.password')}</label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs transition-colors hover:underline cursor-pointer bg-transparent border-0 p-0"
                style={{ color: c.blue }}
              >
                {t('auth.login.forgotPassword')}
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.icon }}>
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                className={inputBase("pr-12", errors.password)}
                style={{ background: c.inputBg, color: c.inputTxt }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                style={{ color: c.icon }}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400">{t('auth.login.required')}</p>}
          </div>

          {/* ── Bouton connexion ─────────────────────── */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-white shadow-lg group cursor-pointer hover:brightness-110 disabled:opacity-70"
            style={{ background: c.blue }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 rounded-full animate-spin border-white/30 border-t-white" />
                {t('auth.login.signingIn')}
              </>
            ) : (
              <>
                {t('auth.login.signIn')}
                <ArrowRight size={18} className="transform transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* ── Séparateur ──────────────────────────── */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: c.divLine }} />
            <span className="text-xs" style={{ color: c.divTxt }}>{t('auth.login.orWith')}</span>
            <div className="flex-1 h-px" style={{ background: c.divLine }} />
          </div>

          {/* ── OAuth ────────────────────────────────── */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isFacebookLoading || loading}
              className={`flex-1 h-12 flex items-center justify-center rounded-xl transition-all disabled:opacity-50 border-2 cursor-pointer group ${c.oauthCls}`}
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 rounded-full animate-spin border-white/20 border-t-white/60" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" className="transition-transform group-hover:scale-110">
                  <path fill={c.oauthIcon} d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={isGoogleLoading || isFacebookLoading || loading}
              className={`flex-1 h-12 flex items-center justify-center rounded-xl transition-all disabled:opacity-50 border-2 cursor-pointer group ${c.oauthCls}`}
            >
              {isFacebookLoading ? (
                <div className="w-4 h-4 border-2 rounded-full animate-spin border-white/20 border-t-white/60" />
              ) : (
                <Facebook size={20} fill={c.oauthIcon} strokeWidth={0} className="transition-transform group-hover:scale-110" />
              )}
            </button>
          </div>

          {/* ── Switch vers Register ─────────────────── */}
          {onSwitchToRegister && (
            <p className="text-center text-sm pt-1" style={{ color: c.switchTxt }}>
              {t('auth.login.noAccount')}{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-semibold transition-colors hover:underline cursor-pointer"
                style={{ color: c.blue }}
              >
                {t('auth.login.signUp')}
              </button>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
