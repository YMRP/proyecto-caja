import Button from "../components/Button";
import "../assets/styles/Login.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { hashPassword } from "../utils/auth";
import axios from "axios";

const apiUrl = import.meta.env.VITE_URL_BACKEND;
function Register() {
  //INICIALIZANDO USESTATES

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  //GUARDANDO LO QUE TENGAN EN LOS CAMPOS
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirmation(e.target.value);
  };

  //FUNCION DE VALIDACION DE LOS CAMPOS
  const validation = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    if (!name || !email || !password || !passwordConfirmation) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Existen campos vacios
        </div>,
        { position: "top-right" }
      );
      return;
    }

    if (password.length < 8) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          La contraseña debe tener al menos 8 caracteres
        </div>,
        { position: "top-right" }
      );
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Las contraseñas no coinciden
        </div>,
        { position: "top-right" }
      );
      return;
    }

    //validacion del correo
    if (
      !email.endsWith("@cajatlajomulco.com.mx") &&
      !email.endsWith("@cajatlajomulco.com")
    ) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Dirección de correo no valida
        </div>,
        { position: "top-right" }
      );
      return;
    }

    //Aquí imprimimos los valores
    console.log("Nombre:", name);
    console.log("Correo:", email);

    //SI HAY BRONCAS, PONES EL AWAIT Y VES COMO LO ARREGLAS
    const hash = await hashPassword(password);

    console.log("Contraseña hasheada:", hash);
    // console.log("Contraseña hasheada: ", hashPassword(password))
    // console.log("Confirmación de contraseña:", passwordConfirmation);

    //limpiando campos
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");

    //SIMULANDO EL ENVIO A JSONPLACEHOLDER PARA ENVIAR AL SERVIDOR
    try {
      const response = await axios.post(`${apiUrl}api/registro/`, {
        name,
        email,
        password: hash,
      });

      console.log("Respuesta simulada con Axios:", response.data);

      console.log("DATOS ENVIADOS CON AXIOS EXITOSAMENTE");
      toast.success(
        <div style={{ fontSize: "1.5rem", color: "green" }}>
          Registro exitoso
        </div>,
        { position: "top-right" }
      );
    } catch (error) {
      console.error("Error al enviar datos con Axios:", error);
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Error al conectar con el servidor
        </div>,
        { position: "top-right" }
      );
    }
  };

  return (
    <div className="contenedor">
      <div className="loginContenedor">
        <img src="../src/assets/images/logo.jpg" alt="Logo Caja" />
        <h1>Registrate</h1>
        <form action="">
          {/* nombre */}
          <div className="campoGrupo">
            <label htmlFor="campoNombre">Nombre: </label>
            <input
              type="text"
              placeholder="Tu nombre"
              id="campoNombre"
              className="campo"
              value={name}
              onChange={handleNameChange}
            />
          </div>

          {/* correo */}
          <div className="campoGrupo">
            <label htmlFor="campoEmail">Correo: </label>
            <input
              type="email"
              placeholder="correo@correo.com"
              id="campoEmail"
              className="campo"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          {/* Contraseña */}
          <div className="campoGrupo">
            <label htmlFor="campoPassword">Contraseña: </label>
            <input
              type="password"
              placeholder="Tu Contraseña"
              id="campoPassword"
              className="campo"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          {/* Repetir contraseña */}
          <div className="campoGrupo">
            <label htmlFor="campoPasswordConfirm">
              Reescribe tu contraseña:{" "}
            </label>
            <input
              type="password"
              placeholder="Tu Contraseña"
              id="campoPasswordConfirm"
              className="campo"
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
            />
          </div>

          {/* boton Registrar */}
          <Button
            type="submit"
            text="Registrar"
            onClick={validation}
            id="buttonRegister"
          />
        </form>

        <p>
          ¿Ya tienes una cuenta? <Link to="/">inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
