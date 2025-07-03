import axios from "axios";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import "../assets/styles/ModProfile.css";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import { toast } from "sonner";

export function ModProfile() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const accessToken = localStorage.getItem("access");

  // Obtener datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
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

        const userData = response.data;
        console.log(userData);
        setNombre(userData.nombre || "");
        setPassword("");
      } catch (error: any) {
        console.error("Error al obtener los datos del usuario:", error.message);
      }
    };

    fetchUserData();
  }, [accessToken]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const modUser = async () => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("password", password);
    if (file) formData.append("foto_perfil", file);

    try {
      const response = await axios.put(
        `${apiUrl}api/modificar-perfil/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        <div style={{ fontSize: "1.5rem", color: "green" }}>
          {response.data.mensaje}
        </div>,
        { position: "top-right" }
      );
    } catch (e: any) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          {"Error al actualizar perfil"}
        </div>,
        { position: "top-right" }
      );
      console.log(e);
    }
  };

  return (
    <div className="contenedorPerfil editarPerfil">
      <div className="campo">
        <label htmlFor="">Nombre: </label>
        <input
          type="text"
          placeholder="Nuevo nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="campo">
        <label htmlFor="">Contraseña: </label>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="inputPhoto">Subir una foto</label>
        <input type="file" onChange={handleFileChange} id="inputPhoto" />
      </div>

      <button onClick={modUser} className="modBotonPerfil">
        Actualizar Perfil
      </button>
    </div>
  );
}

export default ModProfile;
