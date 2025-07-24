import axios from "axios";
import { useState, useEffect } from "react";
import type { Usuario } from "../types/types";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import { TiTrash } from "react-icons/ti";
import { Link } from "react-router-dom";
import HeaderPages from "../components/HeaderPages";
import Layout from "./Layout";

function Users() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("access");
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/admin/usuarios/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsuarios(response.data);
        console.log("Datos crudos:", response.data);
        console.log("Es array:", Array.isArray(response.data));
      } catch (err: any) {
        console.error("Error al obtener usuarios:", err.message);

        if (err.response?.status === 403) {
          setError("No tienes permisos para realizar esta acción.");
        } else {
          setError("No se pudo cargar la lista de usuarios.");
        }
      }
    };

    obtenerUsuarios();
  }, [accessToken]);

  const eliminarUsuario = async (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (!confirmacion) return; // Si el usuario cancela, no hace nada

    try {
      await axios.delete(`${apiUrl}api/admin/usuarios/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Eliminar del estado local
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (err: any) {
      console.error("Error al eliminar usuario:", err.message);
      alert("No se pudo eliminar el usuario.");
    }
  };
  return (
    <Layout>
    

      <div className="px-4 my-10 max-w-5xl mx-auto flex flex-col gap-6 text-center">
        {error && (
          <p className="text-red-500 text-center font-semibold mb-4">{error}</p>
        )}
        <HeaderPages text="Usuarios" />
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white divide-y divide-gray-200 text-left text-gray-800">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-3">Eliminar</th>
                <th className="px-4 py-3">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="hover:bg-gray-100 transition duration-150"
                >
                  <td className="px-4 py-2">
                    <button
                      onClick={() => eliminarUsuario(usuario.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Eliminar usuario"
                    >
                      <TiTrash size={24} />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/usuario/${usuario.id}`}
                      className="text-lg font-semibold text-green-800 hover:underline"
                    >
                      {usuario.nombre}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </Layout>
  );
}

export default Users;
