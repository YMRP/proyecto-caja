import axios from "axios";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
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
        <div style={{  color: "black" }}>Cargando...</div>,
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
        <div style={{  color: "green" }}>
          {response.data.mensaje}
        </div>,
        { position: "top-right" }
      );
    } catch (e: any) {
      toast.error(
        <div style={{  color: "red" }}>
          {"Error al actualizar perfil"}
        </div>,
        { position: "top-right" }
      );
      console.log(e);
    }
  };

  return (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      modUser();
    }}
    className="w-full flex flex-col gap-6"
  >
    {/* Nombre */}
    <div className="flex flex-col gap-2">
      <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
        Nombre
      </label>
      <input
        id="nombre"
        type="text"
        placeholder="Nuevo nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Contraseña */}
    <div className="flex flex-col gap-2">
      <label
        htmlFor="password"
        className="text-sm font-medium text-gray-700"
      >
        Contraseña
      </label>
      <input
        id="password"
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Subir foto */}
    <div className="flex flex-col gap-2">
      <label
        htmlFor="inputPhoto"
        className="text-sm font-medium text-gray-700"
      >
        Subir una foto
      </label>
      <input
        type="file"
        id="inputPhoto"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
      />
    </div>

    {/* Botón */}
    <button
      type="submit"
      className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-200 font-semibold"
    >
      Actualizar Perfil
    </button>
  </form>
);

}

export default ModProfile;
