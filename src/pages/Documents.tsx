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
import { toast } from "sonner"; // Asegúrate de importar esto
import Footer from "../components/Footer";
const apiUrl = import.meta.env.VITE_URL_BACKEND;


function Documents() {
  const [documentos, setDocumentos] = useState<any[]>([]);
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
          Documento eliminado correctamente{" "}
        </div>,
        {
          position: "top-right",
        }
      );
      fetchDocuments(); // Refresca la tabla
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
                    {ultimaVersion ? ultimaVersion.numero_version : "—"}
                    <Link to={`/documents/${doc.id}`}>
                      <AiOutlineFileAdd size={30} />
                    </Link>
                  </td>
                  <td className="actions">
                    {/* consulta */}
                    <Link to={`/documents/${doc.id}`}>
                      <MdPreview size={30} />
                    </Link>
                    <span
                      onClick={() => handleDelete(doc.id)}
                      style={{ cursor: "pointer", color: "red" }}
                    >
                      <TiTrash size={30} />
                    </span>
                    <Link to={`/modDocument/${doc.id}`}>
                      <MdMode size={30} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer/>

    </div>
  );
}

export default Documents;
