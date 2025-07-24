import axios from "axios";
import { useEffect, useState } from "react";
import type { Usuario } from "../types/types";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import { toast } from "sonner";

export function GetProfile() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("access");

  useEffect(() => {
    const obtenerPerfil = async () => {
      const loadingToast = toast.loading(
        <div style={{ color: "black" }}>Cargando...</div>,
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
  <div className="w-full flex justify-center">
    {error && (
      <p className="text-red-500 text-center font-semibold">{error}</p>
    )}

    {usuario ? (
      <div className="w-full flex flex-col md:flex-row items-center gap-6">
        {/* Imagen de perfil */}
        <img
          src={usuario.foto_perfil || "img/default.jpg"}
          alt="Foto de perfil"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-2 ring-green-500 shadow"
        />

        {/* Datos del usuario */}
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold text-green-800">
            {usuario.nombre}
          </p>
          <p className="text-gray-700">
            <strong>Correo:</strong> {usuario.correo}
          </p>
          <p className="text-gray-700">
            <strong>Rol:</strong> {usuario.rol}
          </p>
          <p className="text-gray-700">
            <strong>Fecha de creación:</strong>{" "}
            {usuario.fecha_creacion
              ? new Date(usuario.fecha_creacion).toLocaleDateString()
              : "Sin fecha"}
          </p>
        </div>
      </div>
    ) : (
      <p className="text-gray-600 text-center">Cargando datos...</p>
    )}
  </div>
);
}

export default GetProfile;
