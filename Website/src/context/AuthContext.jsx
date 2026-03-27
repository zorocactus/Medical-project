import { createContext, useContext, useState } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState(null); // "patient" | "personnel médical" | ...
  const [userData, setUserData] = useState(null);

  /**
   * Appelé après login ou après la fin du flow register
   * @param {string} type  - "patient" | "personnel médical"
   * @param {object} data  - données utilisateur (optionnel)
   */
  const login = (type, data = {}) => {
    // Normalise le type pour être cohérent
    const normalized = type?.toLowerCase()?.trim();
    setAccountType(normalized);
    setUserData(data);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccountType(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accountType, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}