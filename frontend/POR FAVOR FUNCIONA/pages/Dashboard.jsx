import { useNavigate } from "react-router-dom";

import PainelUsuario from "../components/PainelUsuario";
// import PainelAdmin from "../components/painelAdmin";

function Dashboard() {
  const navigate = useNavigate();

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/login");
  }

  if (usuario?.role === "admin") {
    return <PainelAdmin onLogout={handleLogout} />;
  }

  return <PainelUsuario />;
}

export default Dashboard;