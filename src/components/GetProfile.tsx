import axios from "axios";
import { useEffect, useState } from "react";
import type { Usuario } from "../types/types";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import "../assets/styles/GetProfile.css";
import { toast } from "sonner";
import defaultImage from '../assets/images/default.jpg'
export function GetProfile() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("access");

  useEffect(() => {
    const obtenerPerfil = async () => {
      const loadingToast = toast.loading(
        <div style={{ fontSize: "1.5rem", color: "black" }}>Cargando...</div>,
        {
          position: "top-right",
        }
      );
      try {
        const response = await axios.get(`${apiUrl}api/obtener-perfil/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        toast.dismiss(loadingToast);

        setUsuario(response.data);
        console.log(response.data);
      } catch (err: any) {
        console.error("Error al obtener perfil:", err.message);
        setError("No se pudo cargar el perfil del usuario.");
      }
    };

    obtenerPerfil();
  }, [accessToken]);

  return (
    <div className="consultarUsuario">
      {error && <p className="error">{error}</p>}
      {usuario ? (
        <div className="perfil-contenido">
          {usuario.foto_perfil ? (
            <div className="foto-perfil">
              <img
                src={usuario.foto_perfil || defaultImage}
                alt="Foto de perfil"
                className="imagen-perfil"
              />
            </div>
          ) : (
             <img
                src={defaultImage}
                alt="Foto de perfil"
                className="imagen-perfil"
              />
          )}
          <div className="usuarioFields">
            <p>
              <strong>Nombre:</strong> {usuario.nombre}
            </p>
            <p>
              <strong>Correo:</strong> {usuario.correo}
            </p>
            <p>
              <strong>Rol:</strong> {usuario.rol}
            </p>
            <p>
              <strong>Fecha de creación:</strong>
              {usuario.fecha_creacion
                ? new Date(usuario.fecha_creacion).toLocaleDateString()
                : "Sin fecha"}
            </p>
          </div>
        </div>
      ) : (
        <p className="cargandoTexto">Cargando datos...</p>
      )}
    </div>
  );
}

export default GetProfile;
