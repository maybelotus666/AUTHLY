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

  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  const buscarCep = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
        return;
    }

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cepLimpo}/json/`
        );

        const dados = await resposta.json();

        if (dados.erro) {
            alert("CEP não encontrado.");
            return;
        }

        setLogradouro(dados.logradouro);
        setBairro(dados.bairro);
        setCidade(dados.localidade);
        setUf(dados.uf);

    } catch (erro) {
        console.error("Erro ao buscar CEP:", erro);
        alert("Não foi possível consultar o CEP.");
    }
};

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

  {/* NOME + EMAIL */}
  <div className="form-row">
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
  </div>


  {/* SENHA */}
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


  {/* ENDEREÇO */}
  <div className="endereco-title">
    Address
  </div>


  {/* CEP + NÚMERO */}
  <div className="form-row">
    <div className="input-box">
      <label htmlFor="cep">CEP</label>
      <input
        id="cep"
        type="text"
        value={cep}
        onChange={(e) => {
          const valor = e.target.value;

          setCep(valor);

          const cepLimpo = valor.replace(/\D/g, "");

          if (cepLimpo.length === 8) {
            buscarCep(cepLimpo);
          }
        }}
        placeholder="00000-000"
        maxLength="9"
        required
      />
    </div>

    <div className="input-box">
      <label htmlFor="numero">Number</label>
      <input
        id="numero"
        type="text"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        placeholder="Number"
        required
      />
    </div>
  </div>


  {/* RUA */}
  <div className="input-box">
    <label htmlFor="logradouro">Street</label>
    <input
      id="logradouro"
      type="text"
      value={logradouro}
      readOnly
    />
  </div>


  {/* BAIRRO + CIDADE + ESTADO */}
  <div className="form-row address-row">

    <div className="input-box">
      <label htmlFor="bairro">Neighborhood</label>
      <input
        id="bairro"
        type="text"
        value={bairro}
        readOnly
      />
    </div>

    <div className="input-box">
      <label htmlFor="cidade">City</label>
      <input
        id="cidade"
        type="text"
        value={cidade}
        readOnly
      />
    </div>

    <div className="input-box state-box">
      <label htmlFor="uf">State</label>
      <input
        id="uf"
        type="text"
        value={uf}
        readOnly
      />
    </div>

  </div>


  {/* COMPLEMENTO */}
  <div className="input-box">
    <label htmlFor="complemento">Complement</label>
    <input
      id="complemento"
      type="text"
      value={complemento}
      onChange={(e) => setComplemento(e.target.value)}
      placeholder="Apartment, block..."
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