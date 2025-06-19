import "../assets/styles/Header.css";
import Button from "./Button";
import NavElement from "./NavElement";
import api from "../api/axios";
import { accessWithoutToken } from "../utils/NoToken";

function Header() {
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
          <img
            src="https://robohash.org/1"
            alt="Foto usuario"
            className="fotoUsuario"
          />
        </nav>
      </header>
    </>
  );
}

export default Header;
