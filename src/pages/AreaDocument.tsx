import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import type { DocumentoFiltrado } from "../types/types";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

function AreaDocument() {
  const { area, categoria } = useParams();
  const [documentos, setDocumentos] = useState<DocumentoFiltrado[]>([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("access");

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}api/versiones/${area}/${categoria}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Documentos recibidos:", response.data);
        setDocumentos(response.data);
      } catch (error: any) {
        console.error("Error al obtener documentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentos();
  }, [area, categoria]);

  // Filtramos los documentos que sean la última versión
  const documentosFiltrados = documentos.filter((doc)=> doc.liberada === true); // sin filtro, muestra todos

  return (
    <Layout>
      <div className="my-10 flex flex-col gap-6 mx-10">
        <h1 className="text-3xl text-center">
          Documentos de {categoria?.replace(/_/g, " ")} en el área{" "}
          {area?.replace(/_/g, " ")}
        </h1>

        {loading ? (
          <p className="text-center">Cargando documentos...</p>
        ) : documentosFiltrados.length === 0 ? (
          <p className="text-center">No se encontraron documentos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {documentosFiltrados.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border rounded-xl shadow-md p-4 hover:shadow-lg transition text-sm"
              >
                <h2 className="text-lg font-semibold mb-2">
                  {doc.nombre_archivo}
                </h2>
                <p>
                  <strong>Versión:</strong> {doc.numero_version}
                </p>

                <p>
                  <strong>Firmado por:</strong> {doc.firmado_por}
                </p>
                <p>
                  <strong>Autorizado por:</strong> {doc.autorizado_por}
                </p>
                <p>
                  <strong>Fecha de carga:</strong>{" "}
                  {new Date(doc.fecha_carga).toLocaleString()}
                </p>
                <p>
                  <strong>¿Es última versión?</strong>{" "}
                  {doc.es_ultima ? "Sí" : "No"}
                </p>
                <a
                  href={doc.archivo_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-blue-600 hover:underline"
                >
                  Ver documento
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AreaDocument;
