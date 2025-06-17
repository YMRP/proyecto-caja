import "../assets/styles/Login.css";
import Button from "../components/Button";
// import FieldGroup from "../components/FieldGroup";
import {Link } from "react-router-dom";
import { toast } from "sonner";
import React, { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_URL_BACKEND;



function Login() {

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  //GUARDANDO LO QUE TENGAN EN LOS CAMPOS
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  

  const loginValidation = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (!email || !password) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Existen campos vacios
        </div>,
        { position: "top-right" }
      );
      return;
    }

    //validacion del correo
    if (
      !email.endsWith("@cajatlajomulco.com.mx") &&
      !email.endsWith("@cajatlajomulco.com") &&
      !email.endsWith("@gmail.com")
    ) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Dirección de correo no valida
        </div>,
        { position: "top-right" }
      );
      return;
    }
    //MANDANDO AL BACK LOS DATOS DEL USUARIO
    const loadingToast = toast.loading(
      <div style={{ fontSize: "1.5rem", color: "black" }}>Cargando...</div>,
      {
        position: "top-right",
      }
    );

    try {
      const response = await axios.post(`${apiUrl}api/validar-login/`, {
        correo: email,
        contraseña: password,
      });

      
      if (response.data.login) {
              toast.dismiss(loadingToast);
        // Login exitoso
        // Redirige o guarda token, etc.
        toast.success(<div style={{ fontSize: "1.5rem", color: "green" }}>
          {response.data.mensaje}
        </div>,
        { position: "top-right" });
      } else {

              toast.dismiss(loadingToast);

        // Login fallido, muestra el mensaje del backend
        toast.error(<div style={{ fontSize: "1.5rem", color: "red" }}>
          {response.data.mensaje}
        </div>,
        { position: "top-right" });
      }
    } catch (error) {
            toast.dismiss(loadingToast);

      // Solo se ejecuta si hay un error de red o el servidor está caído
      toast.error("No se pudo conectar con el servidor.");
    }
  };

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
              className="campo"
              onChange={handleEmailChange}
            />
          </div>

          <div className="campoGrupo">
            <label htmlFor="campoPassword">Contraseña: </label>
            <input
              type="password"
              placeholder="Tu Contraseña"
              id="campoPassword"
              className="campo"
              onChange={handlePasswordChange}
            />
          </div>

          <Button
            type="submit"
            text="Ingresar"
            id="buttonLogin"
            onClick={loginValidation}
          />
        </form>

        <p>
          ¿Aun no tienes una cuenta? <Link to="/Register">regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
