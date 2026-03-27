import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthTransition from "../components/Auth/AuthTransition";
import PatientDashboard from "../pages/patient/Dashboard";
import DoctorDashboard from "../pages/medical/DoctorDashboard";
import PharmacistDashboard from "../pages/pharmacist/PharmacistDashboard";
import LandingPage from "../pages/LandingPage";

// ─── Role → Dashboard map ─────────────────────────────────────────────────────
//
//  accountType (après normalisation lowercase) :
//    "patient"           → PatientDashboard
//    "personnel médical" → selon userData.role :
//                           "Pharmacien"   → PharmacistDashboard
//                           "Médecin"      → DoctorDashboard
//                           "Garde-malade" → DoctorDashboard (à créer)
// ─────────────────────────────────────────────────────────────────────────────

function RoleRouter() {
  const { accountType, userData, logout } = useAuth();

  const type = accountType?.toLowerCase()?.trim();
  const role = userData?.role; // "Médecin" | "Pharmacien" | "Garde-malade"

  if (type === "patient") {
    return <PatientDashboard onLogout={logout} />;
  }

  if (type === "personnel médical") {
    if (role === "Pharmacien") {
      return <PharmacistDashboard onLogout={logout} />;
    }
    // Médecin ou Garde-malade
    return <DoctorDashboard role={role} onLogout={logout} />;
  }

  // Fallback — type inconnu
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#D1DFEC]">
      <div className="bg-white rounded-2xl shadow-xl px-10 py-8 text-center">
        <p className="text-xl font-bold text-[#0D2644] mb-2">Rôle non reconnu</p>
        <p className="text-[#5C738A] mb-6">Type de compte : <strong>{accountType}</strong></p>
        <button
          onClick={logout}
          className="px-6 py-3 bg-[#6492C9] hover:bg-[#304B71] text-white rounded-xl font-semibold transition-all"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

// ─── Main Router ──────────────────────────────────────────────────────────────
export default function AppRouter() {
  // 🔽 LIGNE DE DÉVELOPPEMENT : décommentez pour revenir au mode normal
  return <PharmacistDashboard onLogout={() => {}} />;

  const { isAuthenticated, login } = useAuth();

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"

  // Pas encore authentifié
  if (!isAuthenticated) {
    if (!showAuth) {
      return (
        <LandingPage 
          onLogin={() => {
            setAuthMode("login");
            setShowAuth(true);
          }} 
          onRegister={() => {
            setAuthMode("register");
            setShowAuth(true);
          }} 
        />
      );
    }

    return (
      <AuthTransition
        initialMode={authMode}
        onLogin={(type, data) => {
          console.log("✅ Login called — type:", type, "data:", data);
          login(type, data || {});
        }}
        onBackToLanding={() => setShowAuth(false)}
      />
    );
  }

  // Authentifié → dashboard selon le rôle
  return <RoleRouter />;
}