import axios from "axios";
import { useState} from "react";
import type { ChangeEvent } from "react";



const apiUrl = import.meta.env.VITE_URL_BACKEND;

export function ModProfile() {


  const [nombre, setNombre] = useState("NuevoNombre");
  const [password, setPassword] = useState("123456");
  const [file, setFile] = useState<File | null>(null);
  const accessToken = localStorage.getItem("access");

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
    <>
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
      <input
        type="file"
        onChange={handleFileChange}
      />
      <button onClick={modUser}>Actualizar Perfil</button>
    </div>
    </>
    
  );
}

export default ModProfile;
