import { useEffect, useState } from "react";
import ModProfile from "../components/ModProfile";
import GetProfile from "../components/GetProfile";
import HeaderPages from "../components/HeaderPages";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

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
        return (
          <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl">
            <ModProfile />
          </div>
        );

      case "consultar":
        return (
          <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl">
            <GetProfile />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>

      <div className="my-10 px-4 flex flex-col items-center gap-6">
        <HeaderPages text="Ajustes de perfil" />

        {/* Selector de vista */}
        <select
          value={menuSeleccionado}
          onChange={(e) => setMenuSeleccionado(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="default" >--Selecciona una opción--</option>
          <option value="editar">Editar Perfil</option>
          <option value="consultar">Consultar</option>
        </select>

        {/* Contenido dinámico */}
        {renderContenido()}
      </div>

    </Layout>
  );
}

export default Profile;
