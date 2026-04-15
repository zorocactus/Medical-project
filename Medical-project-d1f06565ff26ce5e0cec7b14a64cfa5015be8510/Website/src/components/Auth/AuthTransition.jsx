import { useState } from "react";
import * as api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
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
  const [isActive, setIsActive] = useState(initialActive);
  const [step, setStep] = useState(1);
  const [tempUser, setTempUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = (userData) => {
    setTempUser(userData);
    setStep(2);
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
        // BUG-12 fix : champs alignés sur RegisterPatientSerializer du backend.
        // password_confirm ajouté, role ajouté, gender→sex, birth_date→date_of_birth.
        await api.registerPatient({
          email:          data.email,
          password:       data.password,
          password_confirm: data.password,
          role:           "patient",
          first_name:     data.firstName,
          last_name:      data.lastName,
          phone:          data.phone || "",
          date_of_birth:  data.birthDate || null,
          sex:            data.sex === "Masculin" ? "M" : data.sex === "Féminin" ? "F" : "",
          address:        data.address || "",
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

        // BUG-13/18 fix : routage vers l'endpoint d'inscription correct selon le rôle.
        // password_confirm ajouté, gender→sex.
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
          // BUG-18 fix : endpoint dédié /auth/register/pharmacist/
          await api.registerPharmacist(basePayload);
        } else if (backendRole === "caretaker") {
          // BUG-18 fix : endpoint dédié /auth/register/caretaker/
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

  if (step === 2) {
    if (tempUser?.accountType === "patient") {
      return <PatientForm onComplete={handleCompletedStep2} onBack={() => setStep(1)} />;
    }
    if (tempUser?.accountType === "personnel médical") {
      return <MedicalForm onComplete={handleCompletedStep2} onBack={() => setStep(1)} />;
    }
    // For other account types, we log them in immediately since no step 2 is provided yet
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
      return <PatientSuccess onComplete={() => {
        login(tempUser.email, tempUser.password)
          .then((me) => onLogin(me?.role || "patient"))
          .catch(() => onLogin("patient"));
      }} />;
    }
    if (tempUser?.accountType === "personnel médical") {
      return <MedicalRoleForm onComplete={handleCompletedStep4} onBack={() => setStep(3)} />;
    }
  }

  if (step === 5) {
    if (tempUser?.accountType === "personnel médical") {
      return <MedicalInfoForm onComplete={handleCompletedStep5} onBack={() => setStep(4)} medicalRole={tempUser?.medicalRole || tempUser?.role || "Médecin"} />;
    }
  }

  if (step === 6) {
    if (tempUser?.accountType === "personnel médical") {
      return <MedicalSuccess onComplete={() => {
        login(tempUser.email, tempUser.password)
          .then((me) => onLogin(me?.role || "doctor", { ...me, is_approved: false }))
          .catch(() => onLogin("doctor", { is_approved: false }));
      }} />
    }
  }

  // Loading overlay wrapper if submitting
  return (
    <div className="relative">
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#6492C9]/30 border-t-[#6492C9] rounded-full animate-spin"></div>
          <p className="mt-4 font-bold text-[#365885]">Création de votre compte...</p>
        </div>
      )}
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#D1DFEC] font-sans relative">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-xl text-[#304B71] font-semibold shadow-sm transition-all z-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Retour à l'accueil
          </button>
        )}
      <div className="bg-white w-[1200px] h-[650px] shadow-2xl relative rounded-xl border border-[#D1DFEC] overflow-hidden">  
      <style>{`
        .auth-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .form-box {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          z-index: 1;
          transition: left 0.6s ease-in-out 1.2s;
        }

        .form-box.login {
          left: 0;
          visibility: visible;
          transition: left 0.6s ease-in-out 1.2s, visibility 0s 0s;
        }
        .auth-container.active .form-box.login {
          left: 50%;
          visibility: hidden;
          transition: left 0.6s ease-in-out 1.2s, visibility 0s 1s;
        }

        .form-box.register {
          left: 100%;
          visibility: hidden;
          transition: left 0.6s ease-in-out 1.2s, visibility 0s 1s;
        }
        .auth-container.active .form-box.register {
          left: 50%;
          visibility: visible;
          transition: left 0.6s ease-in-out 1.2s, visibility 0s 0s;
        }

        .toggle-box {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 2;
        }
        .toggle-box::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          width: 300%;
          height: 100%;
          background: linear-gradient(135deg, #304B71, #6492C9);
          border-radius: 150px;
          z-index: 2;
          transition: left 1.8s ease-in-out;
        }
        .auth-container.active .toggle-box::before {
          left: -250%;
        }

        .toggle-panel {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 3;
          pointer-events: auto;
          transition: 0.6s ease-in-out;
        }

        .toggle-panel.toggle-right {
          right: 0;
          transition-delay: 1.2s;
        }
        .auth-container.active .toggle-panel.toggle-right {
          right: -50%;
          transition-delay: 0.6s;
        }

        .toggle-panel.toggle-left {
          left: -50%;
          transition-delay: 0.6s;
        }
        .auth-container.active .toggle-panel.toggle-left {
          left: 0;
          transition-delay: 1.2s;
        }
      `}</style>

      <div className={`auth-container${isActive ? " active" : ""}`}>

        <div className="form-box login">
  <LoginForm key="login" onLogin={onLogin} isVisible={isActive} />
</div>

<div className="form-box register">
  <RegisterForm key="register" onLogin={onLogin} onNextStep={handleNextStep} isVisible={!isActive} />
</div>

        <div className="toggle-box">

          <div className="toggle-panel toggle-left">
            <div className="text-center flex flex-col items-center px-12 -space-y-16">
              <div className="max-w-[380px] xl:max-w-[450px]">
                <img src="/Doctor_new.png" alt="Doctor" className="w-full h-auto object-contain" />
              </div>
              <div className="mt-8 space-y-4">
                <p className="text-white text-base font-medium opacity-80">Already have an account?</p>
                <button
                  onClick={() => setIsActive(false)}
                  className="px-16 py-3 border-[1.5px] border-white/60 rounded-2xl text-white text-lg font-semibold hover:bg-white/10 transition-all cursor-pointer uppercase tracking-wide"
                >
                  LOGIN
                </button>
              </div>
            </div>
          </div>

          <div className="toggle-panel toggle-right">
            <div className="text-center flex flex-col items-center px-12 -space-y-10  ">
              <div className="max-w-[480px]">
                <img src="/Doctor_new.png" alt="Doctor" className="w-full h-auto object-contain" />
              </div>
              <div className="space-y-4">
                <p className="text-white text-base font-medium opacity-80">Don't have an account?</p>
                <button
                  onClick={() => setIsActive(true)}
                  className="px-16 py-3 border-[1.5px] border-white/60 rounded-2xl text-white text-lg font-semibold hover:bg-white/10 transition-all cursor-pointer uppercase tracking-wide"
                >
                  REGISTER
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div> 
   </div>
  </div>
  );
}
