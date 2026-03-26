import { useState } from "react";
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

export default function AuthTransition({ onLogin }) {
  console.log("onLogin reçu :", onLogin) // ← ajoute cette ligne
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(1);
  const [tempUser, setTempUser] = useState(null);

  const handleNextStep = (userData) => {
    setTempUser(userData);
    setStep(2);
  };

  const handleCompletedStep2 = (additionalData) => {
    setTempUser((prev) => ({ ...prev, ...additionalData }));
    setStep(3);
  };

  const handleCompletedStep3 = (additionalData) => {
    setTempUser((prev) => ({ ...prev, ...additionalData }));
    setStep(4);
  };

  const handleCompletedStep4 = (additionalData) => {
    setTempUser((prev) => ({ ...prev, ...additionalData }));
    setStep(5);
  };

  const handleCompletedStep5 = (additionalData) => {
    setTempUser((prev) => ({ ...prev, ...additionalData }));
    setStep(6);
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
      return <PatientSuccess onComplete={() => onLogin("patient")} />;
    }
    if (tempUser?.accountType === "personnel médical") {
      return <MedicalRoleForm onComplete={handleCompletedStep4} onBack={() => setStep(3)} />;
    }
  }

  if (step === 5) {
    if (tempUser?.accountType === "personnel médical") {
      return <MedicalInfoForm onComplete={handleCompletedStep5} onBack={() => setStep(4)} />;
    }
  }

  if (step === 6) {
    if (tempUser?.accountType === "personnel médical") {
      return <MedicalSuccess onComplete={() => onLogin("personnel médical")} />
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D1DFEC] font-sans">
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
  <LoginForm key="login" onLogin={onLogin} />
</div>

<div className="form-box register">
  <RegisterForm key="register" onLogin={onLogin} onNextStep={handleNextStep} />
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
  );
}
