import { createContext, useContext, useState, ReactNode } from "react";

interface AuthUser {
  id: string;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = localStorage.getItem("cinema_user");
  const [user, setUser] = useState<AuthUser | null>(stored ? JSON.parse(stored) : null);

  function login(newUser: AuthUser) {
    setUser(newUser);
    localStorage.setItem("cinema_user", JSON.stringify(newUser));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("cinema_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
