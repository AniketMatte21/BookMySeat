import React, { createContext, useContext, useState, useEffect } from "react";
import { Auth } from "../api/Auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on page refresh / initial app load
  useEffect(() => {
    Auth.getCurrentUser()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so any component can use `const { user } = useAuth();`
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}