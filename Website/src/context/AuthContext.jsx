import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accountType, setAccountType]         = useState("")
  const [user, setUser]                       = useState(null)

  function login(type, userData) {
    setAccountType(type)
    setUser(userData)
    setIsAuthenticated(true)
  }

  function logout() {
    setIsAuthenticated(false)
    setAccountType("")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      accountType,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
