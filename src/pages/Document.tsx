import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

function Document() {
  const { id } = useParams();
  const [documento, setDocumento] = useState<any | null>(null);
  const [usuarioActualId, setUsuarioActualId] = useState<number | null>(null);
  const accessToken = localStorage.getItem("access");

  // Obtener usuario actual desde el JWT
  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      const tokenPayload = JSON.parse(atob(access.split(".")[1]));
      setUsuarioActualId(tokenPayload.user_id); // ajusta según tu payload
    }
  }, []);

  // Obtener datos del documento
  useEffect(() => {
    async function fetchDocument() {
      try {
        const response = await axios.get(`${apiUrl}documentos-visibles/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const docFiltrado = response.data.find(
          (doc: any) => doc.id === Number(id)
        );
        setDocumento(docFiltrado);
      } catch (error) {
        console.error("Error al obtener documento:", error);
      }
    }

    fetchDocument();
  }, [id]);

  // Función para liberar una versión
  const liberarVersion = async (versionId: number) => {
    try {
      await axios.post(`${apiUrl}api/liberar-version/${versionId}/`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Versión liberada correctamente");
      window.location.reload(); // Recargar para reflejar el cambio
    } catch (err) {
      toast.error("Error al liberar versión");
      console.error(err);
    }
  };

  if (!documento) {
    return <p style={{ padding: "1rem" }}>Cargando documento...</p>;
  }

  return (
    <div>
      <Header />
      <div className="document-table-container">
        <h2 style={{ padding: "1rem" }}>{documento.titulo}</h2>

        <table className="tabla-documento">
          <tbody>
            <tr>
              <td><strong>Referencia</strong></td>
              <td>{documento.referencia}</td>
            </tr>
            <tr>
              <td><strong>Proceso Operativo</strong></td>
              <td>{documento.proceso_operativo}</td>
            </tr>
            <tr>
              <td><strong>Categoría</strong></td>
              <td>{documento.categoria}</td>
            </tr>
            <tr>
              <td><strong>Área Operativa</strong></td>
              <td>
                {documento.area_operativa == null
                  ? documento.area_operativa_otro
                  : documento.area_operativa || "no especificado"}
              </td>
            </tr>
            <tr>
              <td><strong>Funcionarios que aplican</strong></td>
              <td>
                {documento.funcionarios_aplican_display == null
                  ? documento.funcionarios_aplican_otro
                  : documento.funcionarios_aplican_display || "no especificado"}
              </td>
            </tr>
            <tr>
              <td><strong>Autorizado por</strong></td>
              <td>{documento.autorizado_por}</td>
            </tr>
            <tr>
              <td><strong>Firmado por</strong></td>
              <td>{documento.firmado_por}</td>
            </tr>
            <tr>
              <td><strong>Órgano Aprobador</strong></td>
              <td>{documento.organo_ejecutivo_aprobador}</td>
            </tr>
            <tr>
              <td><strong>Versión actual</strong></td>
              <td>{documento.version_actual}</td>
            </tr>
            <tr>
              <td><strong>Fecha Aprobación</strong></td>
              <td>{documento.fecha_aprobacion_ca}</td>
            </tr>
            <tr>
              <td><strong>Fecha Revocación</strong></td>
              <td>
                {documento.fecha_revocacion === null ? (
                  <p>Sin fecha de revocación</p>
                ) : (
                  <p>{documento.fecha_revocacion}</p>
                )}
              </td>
            </tr>
            <tr>
              <td><strong>Última Revisión</strong></td>
              <td>{documento.fecha_ultima_revision}</td>
            </tr>
            <tr>
              <td><strong>Última Actualización</strong></td>
              <td>{documento.fecha_ultima_actualizacion}</td>
            </tr>
            <tr>
              <td><strong>Descripción</strong></td>
              <td>{documento.descripcion}</td>
            </tr>
            <tr>
              <td><strong>Número de Acuerdo</strong></td>
              <td>{documento.numero_acuerdo}</td>
            </tr>
            <tr>
              <td><strong>Número de Sesión Aprobación</strong></td>
              <td>{documento.numero_sesion_aprobacion}</td>
            </tr>
            <tr>
              <td><strong>Número de Sesión Ultima Acta</strong></td>
              <td>{documento.numero_sesion_ultima_act}</td>
            </tr>
            <tr>
              <td><strong>Usuario Creador</strong></td>
              <td>{documento.nombre_usuario_creador}</td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ marginTop: "1rem", paddingLeft: "1rem" }}>Versiones:</h3>
        <table className="tabla-versiones">
          <thead>
            <tr>
              <th>#</th>
              <th>Versión</th>
              <th>Fecha de Carga</th>
              <th>Firmado / Autorizado</th>
              <th>Archivo</th>
              <th>Liberado</th>
            </tr>
          </thead>
          <tbody>
            {documento.versiones.map((v: any, idx: number) => (
              <tr key={v.id}>
                <td>{idx + 1}</td>
                <td>{v.numero_version}</td>
                <td>{v.fecha_carga?.slice(0, 10)}</td>
                <td>{v.firmado_por} / {v.autorizado_por}</td>
                <td>
                  <a
                    href={v.archivo_path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver archivo ({v.tipo_archivo})
                  </a>
                </td>
                <td>
                  {v.liberada ? (
                    "Sí"
                  ) : (
                    v.usuario_asignado === usuarioActualId ? (
                      <button onClick={() => liberarVersion(v.id)}>Liberar</button>
                    ) : "No"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

export default Document;
