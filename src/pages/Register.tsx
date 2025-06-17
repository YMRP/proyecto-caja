import Button from "../components/Button";
import "../assets/styles/Login.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handlePasswordConfirmationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setPasswordConfirmation(e.target.value);

  const validation = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    if (!name || !email || !password || !passwordConfirmation) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Existen campos vacíos
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

    if (
      !email.endsWith("@cajatlajomulco.com.mx") &&
      !email.endsWith("@cajatlajomulco.com") &&
      !email.endsWith("@gmail.com")
    ) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Dirección de correo no válida
        </div>,
        { position: "top-right" }
      );
      return;
    }

    // Validar si el correo ya existe usando response.data.existe
    try {
      const response = await axios.get(`${apiUrl}api/validar-usuario/`, {
        params: { correo: email },
      });

      if (response.data?.existe) {
        toast.error(
          <div style={{ fontSize: "1.5rem", color: "red" }}>
            El correo ya está registrado
          </div>,
          { position: "top-right" }
        );
        return;
      }
    } catch (error) {
      console.error("Error al validar correo:", error);
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Error al validar el correo
        </div>,
        { position: "top-right" }
      );
      return;
    }

    // Si pasó la validación, registrar al usuario
    const rol = "operativo";
    const fechaActual: Date = new Date();
    console.log("ENVIADO EL: ", fechaActual);
    const loadingToast = toast.loading(
      <div style={{ fontSize: "1.5rem", color: "black" }}>Cargando...</div>,
      {
        position: "top-right",
      }
    );
    try {
      const response = await axios.post(`${apiUrl}api/usuarios/`, {
        nombre: name,
        correo: email,
        contraseña_hash: password,
        rol,
        fechaActual,
      });
      toast.dismiss(loadingToast);

      console.log("Registro exitoso:", response.data);

      toast.success(
        <div style={{ fontSize: "1.5rem", color: "green" }}>
          Verificación enviada a tu dirección de correo
        </div>,
        {
          position: "top-right",
        }
      );

      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (error: unknown) {
      toast.dismiss(loadingToast);

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data;

        toast.error(
          <div style={{ fontSize: "1.5rem", color: "red" }}>
            Error {status}: {message || "Error del servidor"}
          </div>,
          { position: "top-right" }
        );
      } else {
        console.error("Error inesperado al registrar:", error);
        toast.error(
          <div style={{ fontSize: "1.5rem", color: "red" }}>
            Error inesperado al enviar datos
          </div>,
          {
            position: "top-right",
          }
        );
      }
    }
  };

  return (
    <div className="contenedor">
      <div className="loginContenedor">
        <img src="../src/assets/images/logo.jpg" alt="Logo Caja" />
        <h1>Regístrate</h1>
        <form>
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

          <div className="campoGrupo">
            <label htmlFor="campoPasswordConfirm">
              Reescribe tu contraseña:
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

          <Button
            type="submit"
            text="Registrar"
            onClick={validation}
            id="buttonRegister"
          />
        </form>

        <p>
          ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
