import { useState } from "react";
import { loginReq } from "../api/client";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {
  onGoToRegister: () => void;
}

export default function LoginPage({ onGoToRegister }: LoginPageProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const result = await loginReq(username, password);
      login(result);
    } catch {
      setError("Credenciais inválidas. Verifique e tente novamente.");
    }
  }

  return (
    <div>
      <h1>Cinema</h1>
      <div className="auth-card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
        <p className="auth-link">
          Não tem conta?{" "}
          <button type="button" onClick={onGoToRegister}>
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}
