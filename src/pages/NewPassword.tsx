import Button from "../components/Button";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

function NewPassword() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        if (usuario && usuario.correo) {
          setCorreo(usuario.correo);
        }
      } catch (error) {
        console.error("Error al leer usuario de localStorage:", error);
      }
    }
  }, []);

  const handleChangePassword = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    if (!correo || !tempPassword || !newPassword) {
      toast.error("Todos los campos son obligatorios", { position: "top-right" });
      return;
    }

   const loadingToast = toast.loading(
         <div style={{ fontSize: "1.5rem", color: "black" }}>Cargando...</div>,
         {
           position: "top-right",
         }
       );

    try {
      await axios.post(`${apiUrl}api/cambiar-contrasena-temporal/`, {
        correo,
        contrasena_actual: tempPassword,
        nueva_contrasena: newPassword,
      });

      toast.dismiss(loadingToast);
       toast.success(
                  <div style={{ fontSize: "1.5rem", color: "green" }}>
                    {'Contraseña actualizada correctamente'}
                  </div>,
                  { position: "top-right" }
                );

      localStorage.removeItem("usuario");
      navigate("/");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const msg =
        error?.response?.data?.mensaje || "Error al actualizar contraseña";
      toast.error(msg, {
        position: "top-right",
      });
      console.error("Error en cambio de contraseña:", error);
    }
  };

  return (
    <div className="contenedor">
      <div className="loginContenedor">
        <img src="images/logo.jpg" alt="Logo Caja" />
        <h1>Ingresa una nueva contraseña</h1>
        <form>

          <div className="campoGrupo">
            <label htmlFor="correo">Correo:</label>
            <input
              type="email"
              placeholder="Tu correo"
              id="correo"
              className="campo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled
            />
          </div>

          <div className="campoGrupo">
            <label htmlFor="tempPassword">Contraseña temporal:</label>
            <input
              type="password"
              placeholder="Tu contraseña temporal"
              id="tempPassword"
              className="campo"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
            />
          </div>

          <div className="campoGrupo">
            <label htmlFor="newPassword">Nueva contraseña:</label>
            <input
              type="password"
              placeholder="Tu nueva contraseña"
              id="newPassword"
              className="campo"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            text="Actualizar"
            id="buttonLogin"
            onClick={handleChangePassword}
          />
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
