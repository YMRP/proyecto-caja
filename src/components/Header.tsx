import "../assets/styles/Header.css";
import NavElement from "./NavElement";
import api from "../api/axios";
import { accessWithoutToken } from "../utils/noToken";

function Header() {
  accessWithoutToken();
  function openClose() {
    const menuDropDown = document.getElementsByClassName("dropDown")[0];
    menuDropDown.classList.toggle('showMenu')
  }
  const cerrarSesion = async () => {
    accessWithoutToken();
    try {
      await api.post("api/cerrar-sesion/");
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
          <NavElement href="" value="OPCION 3" />

          <img
            src="https://robohash.org/201.166.173.114.png"
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
