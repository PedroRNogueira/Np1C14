import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CinemaPage from "./pages/CinemaPage";

function AppRoutes() {
  const { user } = useAuth();
  const [page, setPage] = useState<"login" | "register">("login");

  if (user) {
    return <CinemaPage />;
  }

  if (page === "register") {
    return <RegisterPage onGoToLogin={() => setPage("login")} />;
  }

  return <LoginPage onGoToRegister={() => setPage("register")} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
