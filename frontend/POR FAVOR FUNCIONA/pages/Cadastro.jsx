import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../src/api.js";

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      await api.post("/cadastro", {
        nome,
        email,
        senha,
      });

      navigate("/login");
    } catch (error) {
      setErro(
        error.response?.data?.mensagem ||
          "Não foi possível criar sua conta."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Create account</h1>

        <p className="auth-intro">
          Start your journey with Authly.
        </p>

        <form onSubmit={handleCadastro}>

          <div className="input-box">
            <label htmlFor="nome">Name</label>

            <input
              id="nome"
              type="text"
              placeholder="Your name"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
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
            {carregando ? "Creating..." : "Create account"}
          </button>

        </form>

        <p className="switch-page">
          Already have an account?{" "}
          <Link to="/login">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Cadastro;