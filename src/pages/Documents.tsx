import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Documents.css";
import Header from "../components/Header";
import HeaderPages from "../components/HeaderPages";
import Button from "../components/Button";
import { AiOutlineFileAdd } from "react-icons/ai";
import { MdPreview } from "react-icons/md";
import { MdMode } from "react-icons/md";
import { TiTrash } from "react-icons/ti";
import { toast } from "sonner";
import Footer from "../components/Footer";
const apiUrl = import.meta.env.VITE_URL_BACKEND;

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
        <div style={{ fontSize: "1.5rem", color: "green" }}>
          Documento eliminado correctamente
        </div>,
        {
          position: "top-right",
        }
      );
      fetchDocuments();
    } catch (error) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
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
    <div>
      <Header />
      <HeaderPages text={"Documentos disponibles"} />

      <div className="contenedorHome">
        <Button
          text="Crear Documento"
          onClick={() => {
            navigate("/createDocument");
          }}
          className="botonCrearDoc"
        />

        <table className="tablaDocumentos">
          <thead>
            <tr>
              <th>Título</th>
              <th>Última Versión</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {documentos.map((doc) => {
              const ultimaVersion = doc.versiones.find(
                (v: any) => v.es_ultima === true
              );

              return (
                <tr key={doc.id}>
                  <td>{doc.titulo}</td>
                  <td className="lastVersion">
                    <div className="versionContainer">
                      <span>
                        {ultimaVersion ? ultimaVersion.numero_version : "—"}
                      </span>
                      <Link
                        to={`/UploadDocument/${doc.id}`}
                        onMouseEnter={(e) =>
                          mostrarMensaje("Subir nueva versión", e)
                        }
                        onMouseLeave={ocultarMensaje}
                      >
                        <AiOutlineFileAdd size={30} />
                      </Link>
                    </div>
                  </td>
                  <td className="actions">
                    <Link
                      to={`/documents/${doc.id}`}
                      onMouseEnter={(e) =>
                        mostrarMensaje("Ver detalles del documento", e)
                      }
                      onMouseLeave={ocultarMensaje}
                    >
                      <MdPreview size={30} />
                    </Link>

                    <span
                      onClick={() => handleDelete(doc.id)}
                      onMouseEnter={(e) =>
                        mostrarMensaje("Eliminar documento", e)
                      }
                      onMouseLeave={ocultarMensaje}
                      style={{ cursor: "pointer", color: "red" }}
                    >
                      <TiTrash size={30} color="black" />
                    </span>

                    <Link
                      to={`/modDocument/${doc.id}`}
                      onMouseEnter={(e) =>
                        mostrarMensaje("Modificar documento", e)
                      }
                      onMouseLeave={ocultarMensaje}
                    >
                      <MdMode size={30} />
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

      <Footer />
    </div>
  );
}

export default Documents;
