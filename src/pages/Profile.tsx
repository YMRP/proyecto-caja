import axios from "axios";
import { useState } from "react";
import Header from "../components/Header";
import type { ChangeEvent } from "react";
import ModProfile from "../components/ModProfile";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

function Profile() {
  const [menuSeleccionado, setMenuSeleccionado] = useState("perfil");

  const [nombre, setNombre] = useState("NuevoNombre");
  const [password, setPassword] = useState("123456");
  const [file, setFile] = useState<File | null>(null);
  const accessToken = localStorage.getItem("access");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) setFile(files[0]);
  };


  const renderContenido = () => {
    switch (menuSeleccionado) {
      case "editar":
        return (
          <ModProfile/>
        );

      case "consultar":
        return (
          <div className="contenedorPerfil">
            <h2>Consultar Usuario</h2>
            <p>Aquí puedes mostrar la información del usuario actual.</p>
          </div>
        );
      case "eliminar":
        return (
          <div className="contenedorPerfil">
            <h2>Eliminar Usuario</h2>
            <button style={{ backgroundColor: "red", color: "white" }}>
              Eliminar mi cuenta
            </button>
          </div>
        );
      case "ajustes":
        return (
          <div className="contenedorPerfil">
            <h2>Ajustes</h2>
            <p>Aquí irían tus ajustes generales.</p>
          </div>
        );
      case "notificaciones":
        return (
          <div className="contenedorPerfil">
            <h2>Notificaciones</h2>
            <p>Aquí podrías configurar las notificaciones.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="contenedorMenu">
        <select value={menuSeleccionado} onChange={(e) => setMenuSeleccionado(e.target.value)}>
          <option value="editar">Editar Perfil</option>
          <option value="consultar">Consultar</option>
          <option value="eliminar">Eliminar</option>
          <option value="ajustes">Ajustes</option>
          <option value="notificaciones">Notificaciones</option>
        </select>
        {renderContenido()}
      </div>
    </>
  );
}

export default Profile;
