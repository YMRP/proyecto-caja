import "../assets/styles/Login.css";
import Button from "../components/Button";
// import FieldGroup from "../components/FieldGroup";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import React, { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import.meta.env.JWT_SECRET_KEY;
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

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

      toast.dismiss(loadingToast);
      console.log(response.data)
      if (response.data.login) {
        // Si el usuario tiene que cambiar su contraseña, no guardar los tokens aún
        if (response.data.requerir_cambio_password) {
          toast(
            <div style={{ fontSize: "1.5rem", color: "orange" }}>
              {response.data.mensaje}
            </div>,
            { position: "top-right" }
          );

          // Guarda solo el usuario para saber a quién pertenece el cambio
          localStorage.setItem(
            "usuario",
            JSON.stringify(response.data.usuario)
          );
          navigate("/newPassword");
        } else {
          localStorage.setItem("access", response.data.access);
          localStorage.setItem("refresh", response.data.refresh);
          localStorage.setItem(
            "usuario",
            JSON.stringify(response.data.usuario)
          );

          toast.success(
            <div style={{ fontSize: "1.5rem", color: "green" }}>
              {response.data.mensaje}
            </div>,
            { position: "top-right" }
          );

          navigate("/home");
        }
      } else {
        toast.dismiss(loadingToast);
        toast.error(
          <div style={{ fontSize: "1.5rem", color: "red" }}>
            {response.data.mensaje}
          </div>,
          { position: "top-right" }
        );
      }
    } catch (error) {
      toast.dismiss(loadingToast);


      toast.error(
            <div style={{ fontSize: "1.5rem", color: "green" }}>
              {'no se pudo conectar con el servidor'}
            </div>,
            { position: "top-right" }
          );

    }
  };

  return (
    <div className="contenedor">
      <div className="loginContenedor">
        <img src="images/logo.jpg" alt="Logo Caja" />
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
