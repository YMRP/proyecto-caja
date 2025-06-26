import axios from "axios";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

export function ModProfile() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const accessToken = localStorage.getItem("access");

  // Obtener datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/obtener-perfil/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userData = response.data;
        console.log(userData)
        setNombre(userData.nombre || "");
        setPassword(""); // No se recomienda mostrar el password
        // El archivo de imagen no se carga aquí, solo se muestra si tú lo haces aparte
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
      const response = await axios.put(`${apiUrl}api/modificar-perfil/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Perfil actualizado:", response.data);
    } catch (e: any) {
      console.error("Error al actualizar perfil:", e.message);
    }
  };

  return (
    <div className="contenedorPerfil">
      <h2>Editar Perfil</h2>
      <input
        type="text"
        placeholder="Nuevo nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={modUser}>Actualizar Perfil</button>
    </div>
  );
}

export default ModProfile;
