import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import HeaderPages from "../components/HeaderPages";
import Button from "../components/Button";
import { AiOutlineFileAdd } from "react-icons/ai";
import { MdPreview } from "react-icons/md";
import { MdMode } from "react-icons/md";
import { TiTrash } from "react-icons/ti";
import { toast } from "sonner";
import Layout from "./Layout";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
// NOTA: ultima version se cambio por "subir documento"
function Documents() {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [mensajeHover, setMensajeHover] = useState<string | null>(null);
  const [posicionHover, setPosicionHover] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const accessToken = localStorage.getItem("access");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${apiUrl}documentos-visibles/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const docsConUltimaVersion = response.data.map((doc: any) => {
        const ultimaVersion = doc.versiones.find((v: any) => v.es_ultima);
        return {
          ...doc,
          ultimaVersionNumero: ultimaVersion
            ? ultimaVersion.numero_version
            : doc.version_actual,
          ultimaVersionArchivo: ultimaVersion
            ? ultimaVersion.archivo_path
            : null,
        };
      });

      setDocumentos(docsConUltimaVersion);
    } catch (error: any) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const handleDelete = async (documentoId: number) => {
    const confirmacion = confirm("¿Seguro que deseas eliminar este documento?");
    if (!confirmacion) return;

    try {
      await axios.delete(`${apiUrl}api/documento/${documentoId}/eliminar/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success(
        <div style={{  color: "green" }}>
          Documento eliminado correctamente
        </div>,
        {
          position: "top-right",
        }
      );
      fetchDocuments();
    } catch (error) {
      toast.error(
        <div style={{  color: "red" }}>
          Error al eliminar el documento
        </div>,
        { position: "top-right" }
      );
      console.error("Error eliminando documento:", error);
    }
  };

  const mostrarMensaje = (mensaje: string, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPosicionHover({ top: rect.top - 30, left: rect.left });
    setMensajeHover(mensaje);
  };

  const ocultarMensaje = () => {
    setMensajeHover(null);
    setPosicionHover(null);
  };

  return (
  <Layout>
    

    <div className="w-full max-w-7xl mx-auto overflow-x-auto px-4 flex flex-col items-center my-10 gap-6">
      <HeaderPages text={"Documentos disponibles"} />
      <Button
        text="Crear carpeta"
        onClick={() => {
          navigate("/createDocument");
        }}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
      />

      <table className="min-w-full table-auto border border-gray-300 shadow-md">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="text-left py-3 px-4 border-b border-gray-300">Título</th>
            <th className="text-left py-3 px-4 border-b border-gray-300">Subir Documento</th>
            <th className="text-left py-3 px-4 border-b border-gray-300">Acción</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((doc) => {
            const ultimaVersion = doc.versiones.find(
              (v: any) => v.es_ultima === true
            );

            return (
              <tr key={doc.id} className="hover:bg-gray-50 border-t border-gray-200">
                <td className="py-2 px-4 whitespace-nowrap">{doc.titulo}</td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>{ultimaVersion ? ultimaVersion.numero_version : "—"}</span>
                    <Link
                      to={`/UploadDocument/${doc.id}`}
                      onMouseEnter={(e) => mostrarMensaje("Subir nuevo archivo", e)}
                      onMouseLeave={ocultarMensaje}
                      className="text-green-600 hover:text-green-800"
                    >
                      <AiOutlineFileAdd size={24} />
                    </Link>
                  </div>
                </td>
                <td className="py-2 px-4 whitespace-nowrap flex items-center gap-4">
                  <Link
                    to={`/documents/${doc.id}`}
                    onMouseEnter={(e) => mostrarMensaje("Ver detalles del documento", e)}
                    onMouseLeave={ocultarMensaje}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <MdPreview size={24} />
                  </Link>

                  <span
                    onClick={() => handleDelete(doc.id)}
                    onMouseEnter={(e) => mostrarMensaje("Eliminar documento", e)}
                    onMouseLeave={ocultarMensaje}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                  >
                    <TiTrash size={24} />
                  </span>

                  <Link
                    to={`/modDocument/${doc.id}`}
                    onMouseEnter={(e) => mostrarMensaje("Modificar documento", e)}
                    onMouseLeave={ocultarMensaje}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <MdMode size={24} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Tooltip en hover */}
    {mensajeHover && posicionHover && (
      <div
        style={{
          position: "fixed",
          top: posicionHover.top,
          left: posicionHover.left,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "0.85rem",
          zIndex: 10000,
          pointerEvents: "none",
        }}
      >
        {mensajeHover}
      </div>
    )}

  </Layout>
);

}

export default Documents;
