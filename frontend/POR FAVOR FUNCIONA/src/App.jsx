import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Dashboard from "../pages/Dashboard";

import { GoogleOAuthProvider } from "@react-oauth/google";

import RotaProtegida from "../components/rotaProtegida";

function App() {

  console.log(
    "CLIENT ID:",
    import.meta.env.VITE_GOOGLE_CLIENT_ID
  );

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >

      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />

      </Routes>

    </GoogleOAuthProvider>
  );
}

export default App;