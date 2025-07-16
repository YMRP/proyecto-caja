import { useEffect, useState } from "react";
import Header from "../components/Header";
import ModProfile from "../components/ModProfile";
import GetProfile from "../components/GetProfile";
import Footer from "../components/Footer";
import HeaderPages from "../components/HeaderPages";
import "../assets/styles/Users.css";
import { useNavigate } from "react-router-dom";
function Profile() {
  const [menuSeleccionado, setMenuSeleccionado] = useState("perfil");
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario") as string);
    if (!usuario) {
      navigate("/");
    }
  }, []);

  const renderContenido = () => {
    switch (menuSeleccionado) {
      case "editar":
        return <ModProfile />;

      case "consultar":
        return (
          <div className="contenedorPerfil">
            <GetProfile />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <HeaderPages text="Ajustes de perfil" />
      <div className="contenedorHome">
        <select
          value={menuSeleccionado}
          onChange={(e) => setMenuSeleccionado(e.target.value)}
        >
          <option value="default">--Selecciona una opción--</option>
          <option value="editar">Editar Perfil</option>
          <option value="consultar">Consultar</option>
        </select>
        {renderContenido()}
        <Footer />
      </div>
    </>
  );
}

export default Profile;
