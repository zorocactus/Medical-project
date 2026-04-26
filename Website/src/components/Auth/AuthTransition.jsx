import { useState, useEffect } from "react";
import { ArrowLeft, Sun, Moon } from "lucide-react";

const AUTH_IMAGES = [
  {
    src: "/images/auth/akram-huseyn-brbF5FSnSgI-unsplash.jpg",
    title: "Expertise & Précision",
    subtitle: "Des professionnels de santé qualifiés à votre service, 24h/24.",
  },
  {
    src: "/images/auth/mihira-kl-91mg5YWxHvk-unsplash.jpg",
    title: "Collaboration Médicale",
    subtitle: "Une équipe soudée pour des soins coordonnés et efficaces.",
  },
  {
    src: "/images/auth/pexels-roman-muntean-369190311-14513015.jpg",
    title: "Soins de Haute Qualité",
    subtitle: "La technologie au service de la médecine moderne en Algérie.",
  },
  {
    src: "https://cdn.sanity.io/images/0vv8moc6/medec/26bac8f694276aa9486099abf6a9c640a76515b0-1200x800.jpg",
    title: "Intelligence Artificielle & Santé",
    subtitle: "La puissance de l'IA au service de diagnostics plus rapides et de soins prédictifs.",
  }
];
import * as api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import PatientForm from "./RegisterStep2/PatientForm";
import PatientIdentityForm from "./RegisterStep2/PatientIdentityForm";
import PatientSuccess from "./RegisterStep2/PatientSuccess";
import MedicalForm from "./RegisterStep2/MedicalForm";
import MedicalIdentityForm from "./RegisterStep2/MedicalIdentityForm";
import MedicalRoleForm from "./RegisterStep2/MedicalRoleForm";
import MedicalInfoForm from "./RegisterStep2/MedicalInfoForm";
import MedicalDocumentsForm from "./RegisterStep2/MedicalDocumentsForm";
import MedicalSuccess from "./RegisterStep2/MedicalSuccess";

export default function AuthTransition({ onLogin, initialActive = false, onBack }) {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";
  const [isActive, setIsActive]       = useState(initialActive);
  const [isExpanded, setIsExpanded]   = useState(false);
  const [step, setStep]               = useState(1);
  const [tempUser, setTempUser]       = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regError, setRegError]         = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveImg((i) => (i + 1) % AUTH_IMAGES.length), 5000);
    return () => clearInterval(id);
  }, []);

  // ── Step handlers ─────────────────────────────────────────────────────────

  // Étape 1 → 2 : expand le panneau gauche
  const handleNextStep = (userData) => {
    setTempUser(userData);
    setIsExpanded(true);
    setStep(2);
  };

  // Retour étape 2 → 1 : collapse le panneau (animation inverse)
  const handleBackFromStep2 = () => {
    setIsExpanded(false);
    setStep(1);
  };

  const handleCompletedStep2 = (additionalData) => {
    setTempUser((prev) => ({ ...prev, ...additionalData }));
    setStep(3);
  };

  const handleCompletedStep3 = async (additionalData) => {
    const data = { ...tempUser, ...additionalData };
    setTempUser(data);

    if (data.accountType === "patient") {
      try {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("password_confirm", data.password);
        formData.append("role", "patient");
        formData.append("first_name", data.firstName || "");
        formData.append("last_name", data.lastName || "");
        if (data.phone) formData.append("phone", data.phone);
        
        if (data.birthDate) {
          // Conversion DD/MM/YYYY -> YYYY-MM-DD
          const parts = data.birthDate.split("/");
          if (parts.length === 3) {
            const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            formData.append("date_of_birth", isoDate);
          }
        }
        
        const sexValue = data.sex === "Masculin" ? "male" : data.sex === "Féminin" ? "female" : "male";
        formData.append("sex", sexValue);
        
        if (data.address) formData.append("address", data.address);
        if (data.idCardNumber) formData.append("id_card_number", data.idCardNumber);
        if (data.postalCode) formData.append("postal_code", data.postalCode);
        if (data.city) formData.append("city", data.city);
        if (data.wilaya) formData.append("wilaya", data.wilaya);
        // "Inconnu" = absence de donnée → on ne l'envoie pas au backend (choices stricts)
        if (data.bloodGroup && data.bloodGroup !== "Inconnu") {
          formData.append("blood_group", data.bloodGroup);
        }
        
        // Fichiers
        if (data.cinRecto) formData.append("id_card_recto", data.cinRecto);
        if (data.cinVerso) formData.append("id_card_verso", data.cinVerso);
        if (data.profilePhoto) formData.append("photo", data.profilePhoto);

        await api.registerPatient(formData);
        setStep(4);
      } catch (err) {
        setRegError("Erreur lors de l'inscription : " + err.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStep(4);
    }
  };

  const handleCompletedStep4 = (additionalData) => {
    setTempUser((prev) => ({ ...prev, ...additionalData }));
    setStep(5);
  };

  const handleCompletedStep5 = (additionalData) => {
    setTempUser((prev) => ({ ...prev, ...additionalData }));
    setStep(6);
  };

  const handleCompletedStep6 = async (additionalData) => {
    const data = { ...tempUser, ...additionalData };
    setTempUser(data);

    if (data.accountType === "personnel médical") {
      try {
        setIsSubmitting(true);
        const roleMap = { "Médecin": "doctor", "Pharmacien": "pharmacist", "Garde-malade": "caretaker" };
        const backendRole = roleMap[data.medicalRole] || "doctor";
        const sexValue = data.sex === "Masculin" ? "M" : data.sex === "Féminin" ? "F" : "";

        // Conversion JJ/MM/AAAA → ISO (YYYY-MM-DD) avant envoi backend.
        let isoDob = "";
        if (data.birthDate && data.birthDate.includes("/")) {
          const parts = data.birthDate.split("/");
          if (parts.length === 3) isoDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }

        const basePayload = {
          email:            data.email,
          password:         data.password,
          password_confirm: data.password,
          role:             backendRole,
          first_name:       data.firstName,
          last_name:        data.lastName,
          phone:            data.phone || "",
          sex:              sexValue,
          ...(isoDob ? { date_of_birth: isoDob } : {}),
        };

        if (backendRole === "doctor") {
          await api.registerDoctor({
            ...basePayload,
            specialty:        data.specialite || "Généraliste",
            license_number:   data.nInscription || data.licenseNumber || "",
            experience_years: parseInt(data.experienceYears || data.experience) || 0,
          });
        } else if (backendRole === "pharmacist") {
          await api.registerPharmacist({
            ...basePayload,
            license_number: data.orderNumber || "",
          });
        } else if (backendRole === "caretaker") {
          await api.registerCaretaker(basePayload);
        }

        setStep(7);
      } catch (err) {
        setRegError("Erreur lors de l'inscription médicale : " + err.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStep(7);
    }
  };

  // ── Rendu des étapes 2+ à l'intérieur du panneau étendu ───────────────────

  const renderCurrentStep = () => {
    if (step === 2) {
      if (tempUser?.accountType === "patient") {
        return <PatientForm onComplete={handleCompletedStep2} onBack={handleBackFromStep2} />;
      }
      if (tempUser?.accountType === "personnel médical") {
        return <MedicalForm onComplete={handleCompletedStep2} onBack={handleBackFromStep2} />;
      }
      // Fallback : type inconnu → connexion directe
      onLogin(tempUser?.accountType || "patient");
      return null;
    }

    if (step === 3) {
      if (tempUser?.accountType === "patient") {
        return <PatientIdentityForm onComplete={handleCompletedStep3} onBack={() => setStep(2)} />;
      }
      if (tempUser?.accountType === "personnel médical") {
        return <MedicalIdentityForm onComplete={handleCompletedStep3} onBack={() => setStep(2)} />;
      }
    }

    if (step === 4) {
      if (tempUser?.accountType === "patient") {
        return (
          <PatientSuccess onComplete={() => {
            login(tempUser.email, tempUser.password)
              .then((me) => onLogin(me?.role || "patient"))
              .catch(() => onLogin("patient"));
          }} />
        );
      }
      if (tempUser?.accountType === "personnel médical") {
        return <MedicalRoleForm onComplete={handleCompletedStep4} onBack={() => setStep(3)} />;
      }
    }

    if (step === 5) {
      if (tempUser?.accountType === "personnel médical") {
        return (
          <MedicalInfoForm
            onComplete={handleCompletedStep5}
            onBack={() => setStep(4)}
            medicalRole={tempUser?.medicalRole || tempUser?.role || "Médecin"}
          />
        );
      }
    }

    if (step === 6) {
      if (tempUser?.accountType === "personnel médical") {
        return (
          <MedicalDocumentsForm
            onComplete={handleCompletedStep6}
            onBack={() => setStep(5)}
            medicalRole={tempUser?.medicalRole || tempUser?.role || "Médecin"}
          />
        );
      }
    }

    if (step === 7) {
      if (tempUser?.accountType === "personnel médical") {
        return (
          <MedicalSuccess onComplete={() => {
            login(tempUser.email, tempUser.password)
              .then((me) => onLogin(me?.role || "doctor", { ...me, is_approved: false }))
              .catch(() => onLogin("doctor", { is_approved: false }));
          }} />
        );
      }
    }

    return null;
  };

  // ── Rendu principal ────────────────────────────────────────────────────────

  return (
    <div
      className="relative w-full min-h-screen font-sans flex flex-col lg:flex-row overflow-x-hidden transition-colors duration-300"
      style={{ background: isDark ? "#0D1117" : "#F0F4F8" }}
    >

      {/* ── Overlay de chargement (inscription en cours) ───────────────── */}
      {isSubmitting && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center"
          style={{ background: isDark ? "rgba(13,17,23,0.85)" : "rgba(240,244,248,0.85)" }}
        >
          <div className="w-12 h-12 border-4 border-[#638ECB]/30 border-t-[#638ECB] rounded-full animate-spin" />
          <p className="mt-4 font-bold" style={{ color: isDark ? "#F0F3FA" : "#0D1B2E" }}>{t('auth.transition.creating')}</p>
        </div>
      )}

      {/* ── Inline registration error banner ── */}
      {regError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-lg w-[90%] px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl flex items-center justify-between animate-in slide-in-from-top-3 duration-300"
          style={{ background: isDark ? '#2A1215' : '#FFF0F0', color: '#E05555', border: '1px solid #E0555530' }}>
          <span>{regError}</span>
          <button onClick={() => setRegError(null)} className="ml-3 opacity-60 hover:opacity-100 transition-opacity">✕</button>
        </div>
      )}

      {/* ── PANNEAU GAUCHE ─────────────────────────────────────────────────
          - width: lg:50% par défaut (Tailwind)
          - Quand isExpanded: override inline width: 100% → animation 400ms
          - flex-shrink-0 empêche le panneau de se comprimer
      ─────────────────────────────────────────────────────────────────── */}
      <div
        className="relative min-h-screen flex-shrink-0 w-full lg:w-1/2"
        style={{
          background: isDark ? "#0D1117" : "#F0F4F8",
          width: isExpanded ? "100%" : undefined,
          transition: "width 400ms ease-in-out",
        }}
      >
        {/* ── Boutons flottants — visibles sur toutes les étapes ──────────── */}
        <div className="absolute top-3 left-0 right-0 z-50 flex items-center justify-between px-4 pointer-events-none">

          {/* Retour à l'accueil */}
          <button
            type="button"
            onClick={onBack}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer backdrop-blur-sm"
            style={{
              background:  isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              border:      `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              color:       isDark ? "#8AAEE0" : "#5A6E8A",
            }}
          >
            <ArrowLeft size={13} />
            {t('auth.transition.home')}
          </button>

          {/* Toggle dark / light */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? t('auth.transition.lightModeTitle') : t('auth.transition.darkModeTitle')}
            className="pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            style={{
              background:  isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              border:      `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              color:       isDark ? "#8AAEE0" : "#5A6E8A",
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* CSS pour la transition login ↔ register (étape 1 uniquement) */}
        <style>{`
          .form-transition {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .form-login {
            opacity: 1;
            transform: translateX(0);
            z-index: 2;
            pointer-events: auto;
          }
          .form-login.hidden-form {
            opacity: 0;
            transform: translateX(-30px);
            z-index: 1;
            pointer-events: none;
          }
          .form-register {
            opacity: 1;
            transform: translateX(0);
            z-index: 2;
            pointer-events: auto;
          }
          .form-register.hidden-form {
            opacity: 0;
            transform: translateX(30px);
            z-index: 1;
            pointer-events: none;
          }
        `}</style>

        {/* Étape 1 : formulaires Login / Register avec transition entre eux */}
        {step === 1 && (
          <>
            <div className={`form-transition form-login ${isActive ? "hidden-form" : ""}`}>
              <LoginForm
                key="login"
                onLogin={onLogin}
                isVisible={!isActive}
                onSwitchToRegister={() => setIsActive(true)}
              />
            </div>
            <div className={`form-transition form-register ${!isActive ? "hidden-form" : ""}`}>
              <RegisterForm
                key="register"
                onLogin={onLogin}
                onNextStep={handleNextStep}
                isVisible={isActive}
                onSwitchToLogin={() => setIsActive(false)}
              />
            </div>
          </>
        )}

        {/* Étapes 2+ : rendu à l'intérieur du panneau étendu */}
        {step > 1 && renderCurrentStep()}
      </div>

      {/* ── PANNEAU DROIT — images rotatives (slide) ─────────────────────── */}
      <div
        className="hidden lg:block lg:w-1/2 flex-shrink-0 relative min-h-screen overflow-hidden"
        style={{
          opacity:       isExpanded ? 0 : 1,
          pointerEvents: isExpanded ? "none" : "auto",
          transition:    "opacity 300ms ease-in-out",
        }}
      >
        {/* Rail horizontal — glisse selon activeImg */}
        <div
          className="absolute inset-0 flex"
          style={{
            width:     `${AUTH_IMAGES.length * 100}%`,
            transform: `translateX(-${(activeImg * 100) / AUTH_IMAGES.length}%)`,
            transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {AUTH_IMAGES.map((img) => (
            <div
              key={img.src}
              className="h-full bg-cover bg-center flex-shrink-0"
              style={{
                width:           `${100 / AUTH_IMAGES.length}%`,
                backgroundImage: `url(${img.src})`,
              }}
            />
          ))}
        </div>

        {/* Overlay dégradé : transparent en haut → noir 60% en bas */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65) 100%)" }}
        />

        {/* Texte marketing en bas à gauche */}
        <div className="absolute bottom-0 left-0 right-0">
          {AUTH_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="absolute bottom-10 left-10 right-24"
              style={{
                opacity:    i === activeImg ? 1 : 0,
                transform:  i === activeImg ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 500ms ease, transform 500ms ease",
                transitionDelay: i === activeImg ? "300ms" : "0ms",
              }}
            >
              <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{img.title}</h2>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.75)" }}>{img.subtitle}</p>
            </div>
          ))}

          {/* Dots indicateurs */}
          <div className="absolute bottom-12 right-10 flex gap-2 items-center">
            {AUTH_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className="rounded-full cursor-pointer"
                style={{
                  width:      i === activeImg ? 20 : 8,
                  height:     8,
                  background: i === activeImg ? "#ffffff" : "rgba(255,255,255,0.45)",
                  transition: "width 300ms ease, background 300ms ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
