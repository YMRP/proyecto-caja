import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "sonner";
import HeaderPages from "../components/HeaderPages";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

function Document() {
  const { id } = useParams();
  const [documento, setDocumento] = useState<any | null>(null);
  const [usuarioActualId, setUsuarioActualId] = useState<number | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");
  const accessToken = localStorage.getItem("access");

  // Opciones con valor interno y etiqueta legible
  const opcionesCategorias = [
    { value: "", label: "Todas" },
    { value: "anexo", label: "Anexo" },
    { value: "manual", label: "Manual" },
    { value: "proceso", label: "Proceso" },
    { value: "ficha_tecnica", label: "Ficha Técnica" },
    { value: "capacitacion", label: "Capacitación" },
    { value: "comunicado", label: "Comunicado" },
    { value: "procedimiento", label: "Procedimiento" },
    { value: "formato", label: "Formato" },
    { value: "flujograma", label: "Flujograma" },
    { value: "otro", label: "Otro" },
  ];

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      const tokenPayload = JSON.parse(atob(access.split(".")[1]));
      setUsuarioActualId(tokenPayload.user_id);
    }
  }, []);

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

  const liberarVersion = async (versionId: number) => {
    try {
      await axios.post(`${apiUrl}api/liberar-version/${versionId}/`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Versión liberada correctamente");
      window.location.reload();
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
      <div className="max-w-7xl mx-auto p-4 flex flex-col items-center my-10 gap-6">
        <HeaderPages text={documento.titulo} />

        {/* Filtro de categoría */}
        {documento.versiones.length > 0 && (
          <div className="w-full flex justify-end items-center gap-2 mb-4">
            <label htmlFor="filtroCategoria" className="text-sm font-medium">
              Filtrar por categoría:
            </label>
            <select
              id="filtroCategoria"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              {opcionesCategorias.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tabla de versiones */}
        <table className="w-full table-auto border border-gray-300 shadow-md">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="py-2 px-4 border border-gray-300 text-left">#</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Nombre Archivo</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Tipo Categoría</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Versión</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Fecha de Carga</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Firmado / Autorizado</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Archivo</th>
              <th className="py-2 px-4 border border-gray-300 text-left">Liberado</th>
            </tr>
          </thead>
          <tbody>
            {documento.versiones
              .filter(
                (v: any) =>
                  !filtroCategoria || v.tipo_categoria === filtroCategoria
              )
              .map((v: any, idx: number) => (
                <tr
                  key={v.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-2 px-4 border border-gray-300">{idx + 1}</td>
                  <td className="py-2 px-4 border border-gray-300">{v.nombre_archivo || "Sin nombre"}</td>
                  <td className="py-2 px-4 border border-gray-300">{v.tipo_categoria_display || "No especificado"}</td>
                  <td className="py-2 px-4 border border-gray-300">{v.numero_version}</td>
                  <td className="py-2 px-4 border border-gray-300">{v.fecha_carga?.slice(0, 10)}</td>
                  <td className="py-2 px-4 border border-gray-300">{v.firmado_por} / {v.autorizado_por}</td>
                  <td className="py-2 px-4 border border-gray-300">
                    <a
                      href={v.archivo_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver archivo ({v.tipo_archivo})
                    </a>
                  </td>
                  <td className="py-2 px-4 border border-gray-300 text-center">
                    {v.liberada ? (
                      "Sí"
                    ) : v.usuario_asignado === usuarioActualId ? (
                      <button
                        onClick={() => liberarVersion(v.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                      >
                        Liberar
                      </button>
                    ) : (
                      "No"
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Tabla de metadatos del documento */}
        <table className="w-full table-auto border border-gray-300 shadow-md mb-8">
          <tbody>
            {[
              ["Referencia", documento.referencia],
              ["Proceso Operativo", documento.proceso_operativo],
              ["Categoría", documento.categoria],
              [
                "Área Operativa",
                documento.area_operativa == null
                  ? documento.area_operativa_otro
                  : documento.area_operativa || "No especificado",
              ],
              [
                "Funcionarios que aplican",
                documento.funcionarios_aplican_display == null
                  ? documento.funcionarios_aplican_otro
                  : documento.funcionarios_aplican_display || "No especificado",
              ],
              ["Autorizado por", documento.autorizado_por],
              ["Firmado por", documento.firmado_por],
              ["Órgano Aprobador", documento.organo_ejecutivo_aprobador],
              ["Versión actual", documento.version_actual],
              ["Fecha Aprobación", documento.fecha_aprobacion_ca],
              [
                "Fecha Revocación",
                documento.fecha_revocacion === null
                  ? "Sin fecha de revocación"
                  : documento.fecha_revocacion,
              ],
              ["Última Revisión", documento.fecha_ultima_revision],
              ["Última Actualización", documento.fecha_ultima_actualizacion],
              ["Descripción", documento.descripcion],
              ["Número de Acuerdo", documento.numero_acuerdo],
              [
                "Número de Sesión Aprobación",
                documento.numero_sesion_aprobacion,
              ],
              [
                "Número de Sesión Ultima Acta",
                documento.numero_sesion_ultima_act,
              ],
              ["Usuario Creador", documento.nombre_usuario_creador],
            ].map(([label, value], idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-2 px-4 font-semibold border border-gray-300 w-1/3">
                  {label}
                </td>
                <td className="py-2 px-4 border border-gray-300">{value}</td>
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
