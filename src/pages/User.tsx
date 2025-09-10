import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import type { Usuario } from "../types/types";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import Button from "../components/Button";
import { toast } from "sonner";
import HeaderPages from "../components/HeaderPages";
import { GeneratePassword } from "js-generate-password";
import { GrTools } from "react-icons/gr";
import Layout from "./Layout";

function User() {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("access");
  const [password, setPassword] = useState<string>("");
  const [temporalPass, setTemporalPass] = useState<boolean>(false);

  const FUNCIONARIOS = [
    ["gerente_general", "Gerente General"],
    ["subgerente", "Subgerente"],
    ["jefe_de_proyectos_especiales", "Jefe de Proyectos Especiales"],
    ["controloria", "Controlaría"],
    ["administracion_de_riegos", "Administración de Riesgos"],
    ["auditor_interno", "Auditor Interno"],
    ["auxiliar_de_auditor_interno", "Auxiliar de Auditor Interno"],
    [
      "oficial_de_seguridad_de_la_informacion",
      "Oficial de Seguridad de la Información",
    ],
    ["jefe_de_desarrollo_humano", "Jefe de Desarrollo Humano"],
    ["capacitador", "Capacitador"],
    ["jefe_de_credito", "Jefe de Credito"],
    ["supervisor_de_credito", "Supervisor de Credito"],
    ["controlaria_de_credito", "Controlaria de Credito"],
    ["analista_de_credito", "Analista de Credito"],
    ["supervisor_de_uens", "Supervisor de UENS"],
    ["encargado_de_uens", "Encargado de UENS"],
    ["jefe_de_cobranza", "Jefe de Cobranza"],
    ["supervisor_de_cobranza", "Supervisor de Cobranza"],
    ["asesores_de_cobranza", "Asesores de Cobranza"],
    ["jefe_de_captacion", "Jefe de Captacion"],
    ["auxiliar_de_captacion", "Auxiliar de Captacion"],
    ["jefe_de_sistemas", "Jefe de Sistemas"],
    ["auxiliar_de_sistemas", "Auxiliar de Sistemas"],
    ["jefe_de_tesoreria", "Jefe de Tesoreria"],
    ["jefe_de_contabilidad", "Jefe de Contabilidad"],
    ["auxiliar_de_contabilidad", "Auxiliar de Contabilidad"],
    ["oficial_de_cumplimiento", "Oficial de Cumplimiento"],
    [
      "auxiliar_de_oficial_de_cumplimiento",
      "Auxiliar de Oficial de Cumplimiento",
    ],
    ["jefe_de_mercadotecnia", "Jefe de Mercadotecnia"],
    ["auxiliar_de_mercadotecnia", "Auxiliar de Mercadotecnia"],
    ["asesores_de_servicios_multiples", "Asesores de Servicios Multiples"],
    ["auxiliaresde_servicios_multiples", "Auxiliares de Servicios Multiples"],
    ["cajeros", "Cajeros"],
    ["volantes_generales", "Volantes Generales"],
    ["encargado_de_archivo", "Encargado de Archivo"],
    ["auxiliar_de_archivo", "Auxiliar de Archivo"],
  ];
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
      } catch (err: any) {
        console.error("Error al obtener usuario:", err.message);
        setError("No se pudo cargar la información del usuario.");
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuario();
  }, [id, accessToken]);

  function Generate() {
    let passGenerated = GeneratePassword({
      length: 12,
      symbols: false,
    });
    setTemporalPass(true);
    setPassword(passGenerated);
  }

  if (loading)
    return (
      <Layout>
        <div className="contenedorPerfil">Cargando datos del usuario...</div>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <div className="contenedorPerfil error">{error}</div>
      </Layout>
    );

  if (!usuario)
    return (
      <Layout>
        <div className="contenedorPerfil">Usuario no encontrado.</div>
      </Layout>
    );

  const ultimoLog =
    Array.isArray(usuario.logs_sesion) && usuario.logs_sesion.length > 0
      ? usuario.logs_sesion[usuario.logs_sesion.length - 1]
      : null;

  const handleDeletePhoto = () => {
    setUsuario({ ...usuario, foto_perfil: null });
  };

  const guardarCambios = async () => {
  if (!usuario || usuario.nombre === "") {
    toast.error(<div style={{ color: "red" }}>Existen campos vacíos</div>, {
      position: "top-right",
    });
    return;
  }

  try {
    await axios.put(
      `${apiUrl}api/admin/usuarios/${id}/`,
      {
        nombre: usuario.nombre,
        rol: usuario.rol,
        activo: usuario.activo,
        autenticado_google: usuario.autenticado_google,
        bloqueado: usuario.bloqueado,
        perfil_operativo: usuario.perfil_operativo, // <-- agregado explícitamente
        password: password || undefined,
        temporal_pass: temporalPass,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    toast.success(
      <div style={{ color: "green" }}>Cambios guardados correctamente</div>,
      { position: "top-right" }
    );
  } catch (err: any) {
    toast.error(
      <div style={{ color: "red" }}>Error al guardar los cambios</div>,
      { position: "top-right" }
    );
    console.error("Error en guardarCambios:", err);
  }
};


  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <HeaderPages text={`Detalles del usuario: ${usuario.nombre}`} />

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left text-gray-700">
            <tbody>
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100 w-1/3">Nombre</th>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={usuario.nombre}
                    onChange={(e) =>
                      setUsuario({ ...usuario, nombre: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">Correo</th>
                <td className="px-4 py-3">{usuario.correo}</td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">Rol</th>
                <td className="px-4 py-3">
                  <select
                    value={usuario.rol}
                    onChange={(e) =>
                      setUsuario({ ...usuario, rol: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="operativo">Operativo</option>
                    <option value="corporativo">Corporativo</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </td>
              </tr>

              {/* Nuevo campo Perfil Operativo */}
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">Perfil Operativo</th>
                <td className="px-4 py-3">
                  <select
                    value={usuario.perfil_operativo || ""}
                    onChange={(e) =>
                      setUsuario({
                        ...usuario,
                        perfil_operativo: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Seleccione un perfil</option>
                    {FUNCIONARIOS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>

              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">Activo</th>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={usuario.activo}
                    onChange={(e) =>
                      setUsuario({ ...usuario, activo: e.target.checked })
                    }
                  />
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">Autenticado Google</th>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
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
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">Fecha de creación</th>
                <td className="px-4 py-3">
                  {usuario.fecha_creacion
                    ? new Date(usuario.fecha_creacion).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">
                  Fecha Cambio Contraseña
                </th>
                <td className="px-4 py-3">
                  {usuario.fecha_cambio_password
                    ? new Date(usuario.fecha_cambio_password).toLocaleString()
                    : "No registrada"}
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">Contraseña Temporal</th>
                <td className="px-4 py-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled
                    className="border rounded px-3 py-2 w-full"
                  />
                  <GrTools
                    size={24}
                    className="cursor-pointer text-gray-600 hover:text-black"
                    onClick={Generate}
                  />
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">Foto de Perfil</th>
                <td className="px-4 py-3">
                  {usuario.foto_perfil ? (
                    <img
                      src={usuario.foto_perfil}
                      alt="Foto de perfil"
                      className="w-32 rounded"
                    />
                  ) : (
                    "Sin foto"
                  )}
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">Intentos fallidos</th>
                <td className="px-4 py-3">
                  {usuario.intentos_fallidos ?? "?"}
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">Bloqueado</th>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
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
              <tr className="border-b">
                <th className="px-4 py-3 bg-gray-100">IP de acceso</th>
                <td className="px-4 py-3">
                  {ultimoLog?.ip_acceso ?? "Sin registros"}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-3 bg-gray-100">Última sesión</th>
                <td className="px-4 py-3">
                  {ultimoLog?.fecha_inicio
                    ? new Date(ultimoLog.fecha_inicio).toLocaleString()
                    : "Sin registros"}
                  <br />
                  {ultimoLog?.fecha_fin
                    ? `→ ${new Date(ultimoLog.fecha_fin).toLocaleString()}`
                    : "→ Sesión activa"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button text="Eliminar Foto" onClick={handleDeletePhoto} />
          <Button text="Guardar Cambios" onClick={guardarCambios} />
        </div>

        <HeaderPages text="Últimos registros de sesión" />

        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-[var(--jade)] text-white">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Inicio</th>
                <th className="px-4 py-2">Fin</th>
              </tr>
            </thead>
            <tbody>
              {usuario.logs_sesion && usuario.logs_sesion.length > 0 ? (
                usuario.logs_sesion.map((log, index) => (
                  <tr key={log.id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      {new Date(log.fecha_inicio).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {log.fecha_fin
                        ? new Date(log.fecha_fin).toLocaleString()
                        : "Sesión activa"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center">
                    No hay registros de sesión.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default User;
