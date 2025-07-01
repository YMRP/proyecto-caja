import Header from "../components/Header";
import "../assets/styles/Users.css";
import axios from "axios";
import { useState, useEffect } from "react";
import type { Usuario } from "../types/types";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import { TiTrash } from "react-icons/ti";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import HeaderPages from "../components/HeaderPages";

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
    <>
      <Header />
      <HeaderPages text="Usuarios" />
      <div className="contenedorHome">
        {error && <p className="error">{error}</p>}

        <table className="tablaUsuarios">
          <thead>
            <tr>
              <th>Eliminar</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  <Button
                    text={<TiTrash size={30} />}
                    onClick={() => eliminarUsuario(usuario.id)}
                    className="botonEliminar"
                  />
                </td>
                <td style={{ paddingLeft: "1rem" }}>
                  <Link
                    to={`/usuario/${usuario.id}`}
                    className="nombreUsuario"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      fontSize: "1.8rem"
                    }}
                  >
                    {usuario.nombre}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}

export default Users;
