
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../src/api.js";
import { useGoogleLogin } from "@react-oauth/google";

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

      localStorage.setItem(
        "token",
        resposta.data.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(resposta.data.usuarios)
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


  // function loginComGoogle() {
  //   console.log("Login com Google");
  // }


  // =========================
  // LOGIN COM GOOGLE
  // =========================

  const googleLogin = useGoogleLogin({

    // Estamos usando o fluxo de código de autorização.
    // O Google vai devolver um "code" para o frontend.
    flow: "auth-code",


    // Executado quando o Google autorizar o login.
    onSuccess: async (codeResponse) => {

      try {

        setErro("");

        setCarregando(true);


        console.log(
          "Código recebido do Google:",
          codeResponse.code
        );


        // Enviamos o código para o nosso backend.
        // O backend é quem conversa com o Google
        // e valida a conta.
        const resposta = await api.post("/google", {
          code: codeResponse.code,
        });


        console.log(
          "Resposta do login Google:",
          resposta.data
        );


        // Guardamos o JWT que o NOSSO backend criou.
        localStorage.setItem(
          "token",
          resposta.data.token
        );


        // Guardamos os dados do usuário.
        localStorage.setItem(
          "usuario",
          JSON.stringify(resposta.data.usuario)
        );


        // Depois do login, vai para o dashboard.
        navigate("/dashboard");


      } catch (error) {

        console.error(
          "Erro no login Google:",
          error
        );


        setErro(
          error.response?.data?.mensagem ||
          "Não foi possível entrar com o Google."
        );


      } finally {

        setCarregando(false);

      }
    },


    // Executado se o Google não conseguir
    // realizar o processo de login.
    onError: () => {

      console.error(
        "Erro ao abrir o login do Google."
      );

      setErro(
        "Não foi possível entrar com o Google."
      );
    },

  });


  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>Welcome back!</h1>

        <p className="auth-intro">
          It's awesome to have you here again!
        </p>


        <form onSubmit={handleLogin}>

          <div className="input-box">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

          </div>


          <div className="input-box">

            <label htmlFor="senha">
              Password
            </label>

            <input
              id="senha"
              type="password"
              placeholder="Your password"
              value={senha}
              onChange={(event) =>
                setSenha(event.target.value)
              }
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

            {carregando
              ? "Logging in..."
              : "Log in"}

          </button>

        </form>


        <div className="login-divider">

          <span>or</span>

        </div>


        <button
          className="login-with-google"
          type="button"

          // Aqui está a mudança importante:
          // antes era:
          // onClick={loginComGoogle}
          //
          // Agora usamos o login do Google.
          onClick={() => googleLogin()}

          disabled={carregando}
        >

          <span className="google-icon">

            <i className="bi bi-google"></i>

          </span>

          Continue with Google

        </button>


        {/*
        <GoogleLogin
          onSuccess={loginComGoogle}
          onError={() => {
            setErro("Não foi possível entrar com o Google.");
          }}
        />
        */}


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
