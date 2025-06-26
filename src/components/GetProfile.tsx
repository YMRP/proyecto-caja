import axios from "axios";
import { useEffect, useState } from "react";
import type { Usuario } from "../types/types";
const apiUrl = import.meta.env.VITE_URL_BACKEND;


export function GetProfile() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("access");

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/obtener-perfil/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsuario(response.data);
        console.log(response.data)
      } catch (err: any) {
        console.error("Error al obtener perfil:", err.message);
        setError("No se pudo cargar el perfil del usuario.");
      }
    };

    obtenerPerfil();
  }, [accessToken]);

  return (
    <div className="contenedorPerfil">
      <h2>Perfil del Usuario</h2>
      {error && <p className="error">{error}</p>}
      {usuario ? (
        <div>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Rol:</strong> {usuario.rol}</p>
          {usuario.foto_perfil ? (
            <>
              <p><strong>Foto de perfil:</strong></p>
              <img src={usuario.foto_perfil} alt="Foto de perfil" style={{ width: "20rem", borderRadius: "8px" }} />
            </>
          ) : (
            <p>Sin foto de perfil</p>
          )}
        <p><strong>Fecha de creación:</strong>  
  {usuario.fecha_creacion 
    ? new Date(usuario.fecha_creacion).toLocaleDateString() 
    : 'Sin fecha'}
</p>

        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default GetProfile;
