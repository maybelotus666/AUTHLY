import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../src/api.js";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const resposta = await api.post("/login", {
        email,
        senha,
      });

      localStorage.setItem("token", resposta.data.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify(resposta.data.usuario)
      );

      navigate("/dashboard");
    } catch (error) {
      setErro(
        error.response?.data?.mensagem ||
          "Não foi possível fazer login."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Welcome back!</h1>

        <p className="auth-intro">
          It's awesome to have you here again!
        </p>

        <form onSubmit={handleLogin}>

          <div className="input-box">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <label htmlFor="senha">Password</label>

            <input
              id="senha"
              type="password"
              placeholder="Your password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="error-message">
              {erro}
            </p>
          )}

          <button
            className="main-button"
            type="submit"
            disabled={carregando}
          >
            {carregando ? "Logging in..." : "Log in"}
          </button>

        </form>

        <p className="switch-page">
          Don't have an account?{" "}
          <Link to="/cadastro">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;