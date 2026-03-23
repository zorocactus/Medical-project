import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/LandingPage";
import AuthTransition from "../components/Auth/AuthTransition";

export default function AppRouter() {
  const { isAuthenticated, accountType, login } = useAuth();
  const [view, setView] = useState("landing");

  if (view === "landing") {
    return (
      <LandingPage
        onLogin={() => setView("auth")}
        onRegister={() => setView("auth")}
      />
    );
  }

  if (!isAuthenticated) {
    return <AuthTransition onLogin={(type) => login(type, {})} />;
  }

  // Dashboard — navbar + pages selon accountType
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Navbar dashboard ici plus tard */}
      <main className="pt-[60px] p-8">
        {/* pages selon accountType */}
      </main>
    </div>
  );
}