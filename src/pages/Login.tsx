import "../assets/styles/Login.css";
import Button from "../components/Button";
// import FieldGroup from "../components/FieldGroup";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import React, { useState } from "react";

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
  
  const loginValidation = (e?: React.MouseEvent<HTMLButtonElement>)=>{
    e?.preventDefault()
    if (!email || !password ) {
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

    toast.success(
        <div style={{ fontSize: "1.5rem", color: "green" }}>
          Registro exitoso
        </div>,
        { position: "top-right" }
      );

  }

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
           onClick={loginValidation}/>
        </form>

        <p>¿Aun no tienes una cuenta? <Link to="/Register">regístrate aquí</Link></p>
      </div>
    </div>
  );
}

export default Login;
