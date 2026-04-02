import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthTransition from "../components/Auth/AuthTransition";
import PatientDashboard from "../pages/patient/Dashboard";
import DoctorDashboard from "../pages/medical/DoctorDashboard";
import PharmacistDashboard from "../pages/pharmacist/PharmacistDashboard";
import AdminDashboard from "../pages/admin/Admindashboard";
import LandingPage from "../pages/LandingPage";

// ─── Mapping rôles backend → dashboard ───────────────────────────────────────
//
//  accountType (normalisé dans AuthContext) :
//    "patient"           → PatientDashboard
//    "personnel médical" → selon userData.role :
//                           "pharmacist" / "Pharmacien"  → PharmacistDashboard
//                           "doctor"    / "Médecin"      → DoctorDashboard
//                           "caretaker" / "Garde-malade" → DoctorDashboard
//    "admin"             → AdminDashboard
//
// ─────────────────────────────────────────────────────────────────────────────

function RoleRouter() {
  const { accountType, userData, logout } = useAuth();

  const type = accountType?.toLowerCase()?.trim();

  // userData.role peut venir du backend en anglais (doctor, pharmacist, caretaker)
  // ou en français depuis le Register flow (Médecin, Pharmacien, Garde-malade)
  const role = userData?.role?.toLowerCase();

  if (type === "patient") {
    return <PatientDashboard onLogout={logout} />;
  }

  if (type === "personnel médical") {
    const isPharmacist = role === "pharmacist" || role === "pharmacien";
    const isDoctor = role === "doctor" || role === "médecin";
    const isCaretaker = role === "caretaker" || role === "garde-malade";

    if (isPharmacist) return <PharmacistDashboard onLogout={logout} />;
    if (isDoctor || isCaretaker)
      return <DoctorDashboard role={userData?.role} onLogout={logout} />;

    // Rôle médical non précisé → DoctorDashboard par défaut
    return <DoctorDashboard role="Médecin" onLogout={logout} />;
  }

  if (type === "admin") {
    return <AdminDashboard onLogout={logout} />;
  }

  // Fallback — rôle non reconnu
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#D1DFEC]">
      <div className="bg-white rounded-2xl shadow-xl px-10 py-8 text-center max-w-sm">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg, #304B71, #6492C9)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect
              x="9"
              y="2"
              width="6"
              height="20"
              rx="2"
              fill="white"
              opacity="0.95"
            />
            <rect
              x="2"
              y="9"
              width="20"
              height="6"
              rx="2"
              fill="white"
              opacity="0.95"
            />
          </svg>
        </div>
        <p className="text-xl font-bold text-[#0D2644] mb-2">
          Rôle non reconnu
        </p>
        <p className="text-sm text-[#5C738A] mb-1">Type reçu du backend :</p>
        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
          {accountType} / {userData?.role}
        </code>
        <p className="text-xs text-[#9AACBE] mt-3 mb-6">
          Contactez l'administrateur ou reconnectez-vous.
        </p>
        <button
          onClick={logout}
          className="w-full px-6 py-3 bg-[#6492C9] hover:bg-[#304B71] text-white rounded-xl font-semibold transition-all cursor-pointer"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

// ─── Main Router ──────────────────────────────────────────────────────────────
export default function AppRouter() {
  const { isAuthenticated, loginWithData, logout } = useAuth();
  const [authMode, setAuthMode] = useState(null); // null = landing, "login" | "register"

  // =========================================================================
  // ⚡ BYPASS RAPIDE POUR TESTS (Décommenter pour utiliser) ⚡
  // =========================================================================

  const FORCE_TEST = true; // Mettre à true pour activer le bypass
  const FORCE_ROLE = ""; // Choix: "patient", "doctor", "pharmacist", "admin"

  if (FORCE_TEST) {
    if (FORCE_ROLE === "patient")
      return <PatientDashboard onLogout={() => console.log("Logout!")} />;
    if (FORCE_ROLE === "doctor")
      return <DoctorDashboard onLogout={() => console.log("Logout!")} />;
    if (FORCE_ROLE === "pharmacist")
      return <PharmacistDashboard onLogout={() => console.log("Logout!")} />;
    if (FORCE_ROLE === "admin")
      return <AdminDashboard onLogout={() => console.log("Logout!")} />;
  }

  // =========================================================================

  // Non connecté → Landing Page (par défaut) ou Auth flow
  if (!isAuthenticated) {
    if (authMode) {
      return (
        <AuthTransition
          initialActive={authMode === "register"}
          onLogin={(type, data) => {
            loginWithData(type, data || {});
          }}
          onBack={() => setAuthMode(null)}
        />
      );
    }
    return (
      <LandingPage
        onLogin={() => setAuthMode("login")}
        onRegister={() => setAuthMode("register")}
      />
    );
  }

  // Connecté → dashboard selon le rôle
  return <RoleRouter />;
}
