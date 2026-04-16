import { useState } from "react";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import * as api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import PatientForm from "./RegisterStep2/PatientForm";
import PatientIdentityForm from "./RegisterStep2/PatientIdentityForm";
import PatientSuccess from "./RegisterStep2/PatientSuccess";
import MedicalForm from "./RegisterStep2/MedicalForm";
import MedicalIdentityForm from "./RegisterStep2/MedicalIdentityForm";
import MedicalRoleForm from "./RegisterStep2/MedicalRoleForm";
import MedicalInfoForm from "./RegisterStep2/MedicalInfoForm";
import MedicalSuccess from "./RegisterStep2/MedicalSuccess";

export default function AuthTransition({ onLogin, initialActive = false, onBack }) {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [isActive, setIsActive]       = useState(initialActive);
  const [isExpanded, setIsExpanded]   = useState(false);
  const [step, setStep]               = useState(1);
  const [tempUser, setTempUser]       = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        await api.registerPatient({
          email:            data.email,
          password:         data.password,
          password_confirm: data.password,
          role:             "patient",
          first_name:       data.firstName,
          last_name:        data.lastName,
          phone:            data.phone || "",
          date_of_birth:    data.birthDate || null,
          sex:              data.sex === "Masculin" ? "M" : data.sex === "Féminin" ? "F" : "",
          address:          data.address || "",
        });
        setStep(4);
      } catch (err) {
        alert("Erreur lors de l'inscription : " + err.message);
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

  const handleCompletedStep5 = async (additionalData) => {
    const data = { ...tempUser, ...additionalData };
    setTempUser(data);

    if (data.accountType === "personnel médical") {
      try {
        setIsSubmitting(true);
        const roleMap = { "Médecin": "doctor", "Pharmacien": "pharmacist", "Garde-malade": "caretaker" };
        const backendRole = roleMap[data.medicalRole] || "doctor";
        const sexValue = data.sex === "Masculin" ? "M" : data.sex === "Féminin" ? "F" : "";

        const basePayload = {
          email:            data.email,
          password:         data.password,
          password_confirm: data.password,
          role:             backendRole,
          first_name:       data.firstName,
          last_name:        data.lastName,
          phone:            data.phone || "",
          sex:              sexValue,
        };

        if (backendRole === "doctor") {
          await api.registerDoctor({
            ...basePayload,
            specialty:        data.specialite || "Généraliste",
            license_number:   data.licenseNumber || "",
            experience_years: parseInt(data.experienceYears || data.experience) || 0,
          });
        } else if (backendRole === "pharmacist") {
          await api.registerPharmacist(basePayload);
        } else if (backendRole === "caretaker") {
          await api.registerCaretaker(basePayload);
        }

        setStep(6);
      } catch (err) {
        alert("Erreur lors de l'inscription médicale : " + err.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStep(6);
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
          <p className="mt-4 font-bold" style={{ color: isDark ? "#F0F3FA" : "#0D1B2E" }}>Création de votre compte...</p>
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
            Accueil
          </button>

          {/* Toggle dark / light */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
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

      {/* ── PANNEAU DROIT ──────────────────────────────────────────────────
          - Reste à w-1/2 fixe (flex-shrink-0)
          - opacity + pointer-events contrôlés par isExpanded
          - Se fait pousser hors écran quand le panneau gauche atteint 100%
      ─────────────────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:block lg:w-1/2 flex-shrink-0 relative min-h-screen border-l"
        style={{
          background:   isDark
            ? "linear-gradient(to bottom right, #0D1117, #141B27)"
            : "linear-gradient(to bottom right, #E8EFF8, #D4E0F0)",
          borderColor:  isDark ? "#1E3252" : "#D4E0F0",
          opacity:      isExpanded ? 0 : 1,
          pointerEvents:isExpanded ? "none" : "auto",
          transition:   "opacity 300ms ease-in-out",
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-12">
          <div className="relative w-full h-[250px]">

            {/* Panneau visible quand Login est actif → invite à s'inscrire */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 delay-100 ${isActive ? "opacity-0 translate-y-12 pointer-events-none" : "opacity-100 translate-y-0 pointer-events-auto"}`}>
              <div
                className="p-8 rounded-2xl backdrop-blur-md border"
                style={{
                  background:  isDark ? "rgba(13,17,23,0.5)" : "rgba(255,255,255,0.7)",
                  borderColor: isDark ? "#1E3252" : "#D4E0F0",
                }}
              >
                <h3 className="text-3xl font-bold mb-4" style={{ color: isDark ? "#F0F3FA" : "#0D1B2E" }}>
                  Nouveau sur MedSmart ?
                </h3>
                <p className="mb-8 max-w-sm mx-auto" style={{ color: isDark ? "#8AAEE0" : "#5A6E8A" }}>
                  Une plateforme unifiée pour simplifier la gestion de votre parcours de soins au quotidien.
                </p>
                <button
                  onClick={() => setIsActive(true)}
                  className="px-8 py-3.5 bg-transparent border-2 rounded-xl font-semibold transition-all tracking-wide cursor-pointer"
                  style={{ borderColor: isDark ? "#638ECB" : "#4A6FA5", color: isDark ? "#F0F3FA" : "#0D1B2E" }}
                >
                  CRÉER UN COMPTE
                </button>
              </div>
            </div>

            {/* Panneau visible quand Register est actif → invite à se connecter */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 delay-100 ${!isActive ? "opacity-0 -translate-y-12 pointer-events-none" : "opacity-100 translate-y-0 pointer-events-auto"}`}>
              <div
                className="p-8 rounded-2xl backdrop-blur-md border"
                style={{
                  background:  isDark ? "rgba(13,17,23,0.5)" : "rgba(255,255,255,0.7)",
                  borderColor: isDark ? "#1E3252" : "#D4E0F0",
                }}
              >
                <h3 className="text-3xl font-bold mb-4" style={{ color: isDark ? "#F0F3FA" : "#0D1B2E" }}>
                  Déjà parmi nous ?
                </h3>
                <p className="mb-8 max-w-sm mx-auto" style={{ color: isDark ? "#8AAEE0" : "#5A6E8A" }}>
                  Accédez à votre espace personnel pour retrouver vos consultations et documents médicaux.
                </p>
                <button
                  onClick={() => setIsActive(false)}
                  className="px-8 py-3.5 bg-transparent border-2 rounded-xl font-semibold transition-all tracking-wide cursor-pointer"
                  style={{ borderColor: isDark ? "#638ECB" : "#4A6FA5", color: isDark ? "#F0F3FA" : "#0D1B2E" }}
                >
                  SE CONNECTER
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
