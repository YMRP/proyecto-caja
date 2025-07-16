import Header from "../components/Header";
import Footer from "../components/Footer";
import HeaderPages from "../components/HeaderPages";
import "../assets/styles/CreateDocument.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import Button from "../components/Button";
import { toast } from "sonner";
import type { Usuario } from "../types/types";

function UploadDocument() {
  const { id } = useParams();
  const accessToken = localStorage.getItem("access");

  const [nombreDocumento, setNombreDocumento] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [formDataValues, setFormDataValues] = useState({
    nombre_documento: "",
    numero_version: "",
    archivo: null as File | null,
    tipo_archivo: "PDF",
    usuario_editor: "",
    firmado_por: "",
    autorizado_por: "",
    es_ultima: false,
  });

  // Obtener nombre del documento por ID
  useEffect(() => {
    const fetchNombreDocumento = async () => {
      try {
        const response = await axios.get(`${apiUrl}documentos-visibles/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const doc = response.data.find((d: any) => d.id === Number(id));
        if (doc && doc.titulo) {
          setNombreDocumento(doc.titulo);
          setFormDataValues((prev) => ({
            ...prev,
            nombre_documento: doc.titulo,
          }));
        } else {
          console.warn("Documento no encontrado o sin título");
        }
      } catch (err: any) {
        console.error("Error al obtener el nombre del documento:", err.message);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/admin/usuarios/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsuarios(response.data);
      } catch (err: any) {
        console.error("Error al obtener usuarios:", err.message);
      }
    };

    fetchNombreDocumento();
    fetchUsuarios();
  }, [id]);

  // Cambios en los campos
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      setFormDataValues((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setFormDataValues((prev) => ({
        ...prev,
        archivo: files ? files[0] : null,
      }));
    } else {
      setFormDataValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Enviar nueva versión
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("documento", String(Number(id)));
  formData.append("nombre_documento", formDataValues.nombre_documento);
  formData.append("numero_version", formDataValues.numero_version);
  formData.append("tipo_archivo", formDataValues.tipo_archivo);
  formData.append("usuario_editor", formDataValues.usuario_editor);
  formData.append("firmado_por", formDataValues.firmado_por);
  formData.append("autorizado_por", formDataValues.autorizado_por);
  formData.append("es_ultima", formDataValues.es_ultima.toString());

  if (formDataValues.archivo) {
    formData.append("archivo_path", formDataValues.archivo);
  }

  const loadingToast = toast.loading("Cargando...", { position: "top-right" });

  try {
    // Subir la versión
    const response = await axios.post(`${apiUrl}api/crear-version/`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const versionId = response.data.version_id;
    const usuarioId = formDataValues.usuario_editor;

    // Asignar la versión al usuario editor
    await axios.post(`${apiUrl}api/asignar-version/`, {
      version_id: versionId,
      usuario_id: usuarioId,
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    toast.success("Versión subida y asignada correctamente", {
      position: "top-right",
    });

    // Limpiar formulario
    setFormDataValues({
      nombre_documento: nombreDocumento,
      numero_version: "",
      archivo: null,
      tipo_archivo: "PDF",
      usuario_editor: "",
      firmado_por: "",
      autorizado_por: "",
      es_ultima: false,
    });
  } catch (error: any) {
    console.error("Error:", error);
    toast.error("Error al subir o asignar la versión", {
      position: "top-right",
    });
  } finally {
    toast.dismiss(loadingToast);
  }
};

  return (
    <div>
      <Header />
      <HeaderPages text="Subir nueva versión de documento" />
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="document-table-container">
          <table className="tabla-documento">
            <tbody>
              <tr>
                <td>
                  <strong>Nombre documento</strong>
                </td>
                <td>{nombreDocumento}</td>
              </tr>
              <tr>
                <td>
                  <strong>Número de versión</strong>
                </td>
                <td>
                  <input
                    type="number"
                    name="numero_version"
                    value={formDataValues.numero_version}
                    onChange={handleInputChange}
                    min={1}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Archivo</strong>
                </td>
                <td>
                  <input
                    type="file"
                    name="archivo_path"
                    accept=".pdf,.xlsx,.pptx,.docx"
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Tipo de archivo</strong>
                </td>
                <td>
                  <select
                    name="tipo_archivo"
                    value={formDataValues.tipo_archivo}
                    onChange={handleInputChange}
                  >
                    <option value="PDF">PDF</option>
                    <option value="XLSX">XLSX</option>
                    <option value="PPTX">PPTX</option>
                    <option value="DOCX">DOCX</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Usuario editor</strong>
                </td>
                <td>
                  <select
                    name="usuario_editor"
                    value={formDataValues.usuario_editor}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona un usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Firmado por</strong>
                </td>
                <td>
                  <input
                    type="text"
                    name="firmado_por"
                    value={formDataValues.firmado_por}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Autorizado por</strong>
                </td>
                <td>
                  <input
                    type="text"
                    name="autorizado_por"
                    value={formDataValues.autorizado_por}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>¿Es última?</strong>
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="es_ultima"
                    checked={formDataValues.es_ultima}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="document-table-container">
          <Button text="Subir versión" type="submit" />
        </div>
      </form>
      <Footer />
    </div>
  );
}

export default UploadDocument;
