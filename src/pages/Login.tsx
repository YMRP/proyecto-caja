import "../assets/styles/Login.css";
import Button from "../components/Button";
// import FieldGroup from "../components/FieldGroup";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="contenedor">
      <div className="loginContenedor">
        <img src="../src/assets/images/logo.jpg" alt="Logo Caja" />
        <h1>Iniciar Sesión</h1>
        <form action="">
          <div className="campoGrupo">
            <label htmlFor="campoEmail">Correo: </label>
            <input
              type="email"
              placeholder="correo@correo.com"
              id="campoEmail"
              className="campo" required
            />
          </div>
          


          <div className="campoGrupo">
            <label htmlFor="campoPassword">Contraseña: </label>
            <input
              type="password"
              placeholder="Tu Contraseña"
              id="campoPassword"
              className="campo"
              required
            />
          </div>

          
          <Button type="submit" text="Ingresar" id="buttonLogin"/>
        </form>

        <p>¿Aun no tienes una cuenta? <Link to="/Register">regístrate aquí</Link></p>
      </div>
    </div>
  );
}

export default Login;
