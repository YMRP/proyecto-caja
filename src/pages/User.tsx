import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import type { Usuario } from "../types/types";
import "../assets/styles/Users.css";
import Footer from "../components/Footer";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import Button from "../components/Button";
import { toast } from "sonner";
import HeaderPages from "../components/HeaderPages";

function User() {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("access");
  //AGREGAR CAMPO DE MODIFICAR: BLOQUEADO, CONTRASEÑA
  const [password, setPassword] = useState<string>();

  useEffect(() => {
    if (!id) return;

    const obtenerUsuario = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}api/admin/usuarios/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsuario(response.data);
        setError(null);
        console.log(response.data);
        console.log("logs_sesion", response.data.logs_sesion);
      } catch (err: any) {
        console.error("Error al obtener usuario:", err.message);
        setError("No se pudo cargar la información del usuario.");
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuario();
  }, [id, accessToken]);

  if (loading)
    return (
      <>
        <Header />
        <div className="contenedorPerfil">Cargando datos del usuario...</div>
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="contenedorPerfil error">{error}</div>
      </>
    );

  if (!usuario)
    return (
      <>
        <Header />
        <div className="contenedorPerfil">Usuario no encontrado.</div>
      </>
    );

  const ultimoLog =
    Array.isArray(usuario.logs_sesion) && usuario.logs_sesion.length > 0
      ? usuario.logs_sesion[usuario.logs_sesion.length - 1]
      : null;

  const handleDeletePhoto = () => {
    setUsuario({ ...usuario, foto_perfil: null });
  };

  const guardarCambios = async () => {
    console.log("Guardando...");
    if (!usuario || usuario.nombre === "") {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Existen campos vacíos
        </div>,
        { position: "top-right" }
      );
      return;
    }

    try {
      await axios.put(
        `${apiUrl}api/admin/usuarios/${id}/`,
        {
          ...usuario,
          password: password || undefined, // solo lo envía si hay valor
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      toast.success(
                <div style={{ fontSize: "1.5rem", color: "green" }}>
                  Cambios guardados correctamente
                </div>,
                { position: "top-right" }
              );
      console.log("Guardado");
    } catch (err: any) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Error al guardar los cambios
        </div>,
        { position: "top-right" }
      );
      console.error("Error en guardarCambios:", err);
    }
  };
  return (
    <>
      <Header />
      <HeaderPages text={`Detalles del usuario: ${usuario.nombre}`} />
      <div className="contenedorHome">
        <table
          className="tablaUsuarios"
          style={{ maxWidth: "600px", marginTop: "1rem" }}
        >
          <tbody>
            <tr>
              <th>Nombre</th>
              <td>
                <input
                  type="text"
                  name="nombre"
                  value={usuario.nombre}
                  onChange={(e) => {
                    setUsuario({ ...usuario, nombre: e.target.value });
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Correo</th>
              <td>{usuario.correo}</td>
            </tr>
            <tr>
              <th>Rol</th>
              <td>
                <select
                  name="rol"
                  value={usuario.rol}
                  onChange={(e) =>
                    setUsuario({ ...usuario, rol: e.target.value })
                  }
                >
                  <option value="operativo">Operativo</option>
                  <option value="corporativo">Corporativo</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="administrador">Administrador</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>Activo</th>
              <td>
                <input
                  type="checkbox"
                  name="activo"
                  checked={usuario.activo}
                  onChange={(e) =>
                    setUsuario({ ...usuario, activo: e.target.checked })
                  }
                />
              </td>
            </tr>
            <tr>
              <th>Autenticado Google</th>
              <td>
                <input
                  type="checkbox"
                  name="autenticado_google"
                  checked={usuario.autenticado_google}
                  onChange={(e) =>
                    setUsuario({
                      ...usuario,
                      autenticado_google: e.target.checked,
                    })
                  }
                />
              </td>
            </tr>
            <tr>
              <th>Fecha Creación</th>
              <td>
                {usuario.fecha_creacion
                  ? new Date(usuario.fecha_creacion).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <th>Fecha Cambio de Contraseña</th>
              <td>
                {usuario.fecha_cambio_password
                  ? new Date(usuario.fecha_cambio_password).toLocaleString()
                  : "No registrada"}
              </td>
            </tr>
            <tr>
              <th>Contraseña sugerida</th>
              <td>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Foto de Perfil</th>
              <td>
                {usuario.foto_perfil ? (
                  <img
                    src={usuario.foto_perfil}
                    alt="Foto de perfil"
                    style={{ maxWidth: "150px", borderRadius: "8px" }}
                  />
                ) : (
                  "Sin foto"
                )}
              </td>
            </tr>
            <tr>
              <th>Intentos fallidos</th>
              <td>
                {usuario.intentos_fallidos !== undefined
                  ? usuario.intentos_fallidos
                  : "Desconocido"}
              </td>
            </tr>
            <tr>
              <th>Bloqueado</th>
              <td>
                <input
                  type="checkbox"
                  name="bloqueado"
                  checked={usuario.bloqueado}
                  onChange={(e) => {
                    const bloqueado = e.target.checked;
                    const nuevosDatos = {
                      ...usuario,
                      bloqueado,
                      intentos_fallidos: bloqueado
                        ? usuario.intentos_fallidos
                        : 0,
                    };
                    setUsuario(nuevosDatos);
                  }}
                />
              </td>
            </tr>

            <tr>
              <th>IP de acceso</th>
              <td>{ultimoLog ? ultimoLog.ip_acceso : "Sin registros"}</td>
            </tr>
            <tr>
              <th>Inicio de última sesión</th>
              <td>
                {ultimoLog && ultimoLog.fecha_inicio
                  ? new Date(ultimoLog.fecha_inicio).toLocaleString()
                  : "Sin registros"}
              </td>
            </tr>
            <tr>
              <th>Fin de última sesión</th>
              <td>
                {ultimoLog
                  ? ultimoLog.fecha_fin
                    ? new Date(ultimoLog.fecha_fin).toLocaleString()
                    : "Sesión activa"
                  : "Sin registros"}
              </td>
            </tr>
          </tbody>
        </table>

        <h1>Ultimos registros de sesion</h1>

        <table
          className="tablaUsuarios"
          style={{ maxWidth: "600px", marginTop: "1rem" }}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Inicio de sesión</th>
              <th>Fin de sesión</th>
            </tr>
          </thead>
          <tbody>
            {usuario.logs_sesion && usuario.logs_sesion.length > 0 ? (
              usuario.logs_sesion.map((log, index) => (
                <tr key={log.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(log.fecha_inicio).toLocaleString()}</td>
                  <td>
                    {log.fecha_fin
                      ? new Date(log.fecha_fin).toLocaleString()
                      : "Sesión activa"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No hay registros de sesión.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="botones">
          <Button text="Eliminar Foto" onClick={handleDeletePhoto} />
          <Button text="Guardar Cambios" onClick={guardarCambios} />
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}

export default User;
