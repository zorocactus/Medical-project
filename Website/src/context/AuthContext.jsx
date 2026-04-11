import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, getMe, isAuthenticated } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [accountType, setAccountType] = useState(null);
  const [userData, setUserData]       = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (isAuthenticated()) {
        try {
          const me = await getMe();
          if (me) {
            setUserData(me);
            setAccountType(normalizeRole(me.role));
            setIsLoggedIn(true);
          }
        } catch {
          apiLogout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  function normalizeRole(role) {
    const map = {
      patient:             "patient",
      doctor:              "personnel médical",
      pharmacist:          "personnel médical",
      caretaker:           "personnel médical",
      admin:               "admin",
      "personnel médical": "personnel médical",
    };
    return map[role?.toLowerCase()] || role?.toLowerCase() || "patient";
  }

  async function login(email, password) {
    const data = await apiLogin(email, password);
    if (!data?.access) throw new Error("Identifiants incorrects");

    // Après login on récupère le profil complet
    const me = await getMe();
    setUserData({ ...data, ...me });
    setAccountType(normalizeRole(me?.role || data?.role));
    setIsLoggedIn(true);
    return me;
  }

  function loginWithData(type, data = {}) {
    setAccountType(normalizeRole(type));
    setUserData(data);
    setIsLoggedIn(true);
  }

  function logout() {
    apiLogout();
    setIsLoggedIn(false);
    setAccountType(null);
    setUserData(null);
    // Hard redirect to root — prevents back-button return to authenticated pages
    window.location.replace("/");
  }

  // Derived: medical professionals must be approved before accessing dashboard.
  // BUG-17 fix : le backend retourne verification_status (string), pas is_approved (boolean).
  // Valeurs possibles : "pending", "approved", "rejected".
  const isApproved = (() => {
    if (!userData) return true;
    const vs = userData.verification_status;
    if (vs && vs !== 'approved') return false;
    return true;
  })();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D1DFEC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #304B71, #6492C9)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="20" rx="2" fill="white" opacity="0.95"/>
              <rect x="2" y="9" width="20" height="6" rx="2" fill="white" opacity="0.95"/>
            </svg>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#6492C9] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-sm font-semibold text-[#5A6E8A]">Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: isLoggedIn, accountType, userData, login, loginWithData, logout, isApproved }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
}