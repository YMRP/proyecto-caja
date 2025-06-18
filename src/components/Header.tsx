import "../assets/styles/Header.css";
import Button from "./Button";
import NavElement from "./NavElement";
const apiUrl = import.meta.env.VITE_URL_BACKEND;

import api from "../api/axios";

function Header() {
  const cerrarSesion = async () => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
     try {
      
      await api.post("api/cerrar-sesion/"); // headers se añaden automáticamente
      console.log("Access token:", localStorage.getItem("access"));

      localStorage.clear();
      console.log("salio por exito");
      window.location.href = "/";
    } catch (error) {
      console.log("salio por error", error);
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <>
      <header>
        <img
          className="logo__header"
          alt="Logo"
          src="../src/assets/images/logo.jpg"
        />
        <nav>
          <NavElement href="#" value="OPCION 1" />
          <NavElement href="#" value="OPCION 2" />
          <NavElement href="#" value="OPCION 3" />
          <Button text="Cerrar Sesión" onClick={cerrarSesion} />
        </nav>
      </header>
    </>
  );
}

export default Header;
