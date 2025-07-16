import "../assets/styles/Header.css";
import NavElement from "./NavElement";
import api from "../api/axios";
import { accessWithoutToken } from "../utils/noToken";
import axios from "axios";
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

function Header() {
  accessWithoutToken();

  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  useEffect(() => {
    const obtenerImagen = async () => {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) return;

      try {
        const response = await axios.get(`${apiUrl}api/obtener-perfil/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setFotoPerfil(response.data.foto_perfil || null);
      } catch (err: any) {
        console.error("Error al obtener la imagen:", err.message);
      }
    };

    obtenerImagen();
  }, []);
  useEffect(() => {
    const handleBeforeUnload = () => {
      const token = localStorage.getItem("access");
      if (!token) return;

      const body = JSON.stringify({ token });
      const blob = new Blob([body], { type: "application/json" });

      const endpoint = apiUrl.endsWith("/")
        ? `${apiUrl}cerrar-sesion-beacon/`
        : `${apiUrl}/cerrar-sesion-beacon/`;

      navigator.sendBeacon(endpoint, blob);

      // ❌ No limpies localStorage aquí, porque puede ser navegación interna
      // localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  function openClose() {
    const menuDropDown = document.getElementsByClassName("dropDown")[0];
    menuDropDown.classList.toggle("showMenu");
  }

  const cerrarSesion = async () => {
    accessWithoutToken();
    try {
      await api.post("api/cerrar-sesion/");
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión", error);
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="contenedorHeader">
      <header>
        <a href="/home">
          <img
            className="logo__header"
            alt="Logo"
            src="../src/assets/images/logo.jpg"
          />
        </a>

        <nav>
          <NavElement href={"/home"} value="INICIO" />
          <NavElement href={"/users"} value="USUARIOS" />
          <NavElement href={"/asignations/:id"} value="ASIGNACIONES" />

          <NavElement href={"/documents"} value="DOCUMENTOS" />

          <img
            src={fotoPerfil || "src/assets/images/default.jpg"}
            alt="FotoPerfil"
            className="fotoUsuario"
            onClick={openClose}
          />
        </nav>
      </header>

      <div className="dropDown">
        <a href="/profile">Ajustes de perfil</a>
        <a href="#" onClick={cerrarSesion}>
          Cerrar sesión
        </a>
      </div>
    </div>
  );
}

export default Header;
