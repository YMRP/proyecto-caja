import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Documents.css";
import Header from "../components/Header";
import HeaderPages from "../components/HeaderPages";
import Button from "../components/Button";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

function Documents() {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const accessToken = localStorage.getItem("access");
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await axios.get(`${apiUrl}documentos-visibles/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Para cada documento obtenemos la última versión según es_ultima === true
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
        console.log(response.data);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
          });
        } else {
          console.error("Error inesperado:", error);
        }
      }
    }

    fetchDocuments();
  }, []);

  return (
    <div>
      <Header />
      <HeaderPages text={"Documentos disponibles"} />

     

      <div className="contenedorHome">
         <Button text="Crear Documento" onClick={()=>{
        navigate('/createDocument')
      }} className="botonCrearDoc"></Button>
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
                  <td>{ultimaVersion ? ultimaVersion.numero_version : "—"}</td>
                  <td>
                    <Link to={`/documents/${doc.id}`}>Ver detalle</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Documents;
