import { useState } from "react";
import { register } from "../api/client";

interface RegisterPageProps {
  onGoToLogin: () => void;
}

export default function RegisterPage({ onGoToLogin }: RegisterPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register(username, password);
      onGoToLogin();
    } catch {
      setError("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  }

  return (
    <div>
      <h1>Criar Conta</h1>
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
            Cadastrar
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
        <p className="auth-link">
          Já tem conta?{" "}
          <button type="button" onClick={onGoToLogin}>
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
