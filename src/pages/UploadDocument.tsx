import HeaderPages from "../components/HeaderPages";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_URL_BACKEND.replace(/\/+$/, "");
import { toast } from "sonner";
import type { Usuario } from "../types/types";
import Layout from "./Layout";

function UploadDocument() {
  const { id } = useParams();
  const accessToken = localStorage.getItem("access");

  const [nombreDocumento, setNombreDocumento] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [formDataValues, setFormDataValues] = useState({
    tipo_categoria: "",
    nombre_documento: "",
    nombre_archivo: "",
    numero_version: "",
    archivo: null as File | null,
    tipo_archivo: "PDF",
    usuario_editor: "",
    firmado_por: "",
    autorizado_por: "",
    es_ultima: false,
  });

  useEffect(() => {
    const fetchNombreDocumento = async () => {
      try {
        const response = await axios.get(`${apiUrl}/documentos-visibles/`, {
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
        const response = await axios.get(`${apiUrl}/api/admin/usuarios/`, {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formDataValues.tipo_categoria) {
      toast.error("Por favor, selecciona un tipo de documento");
      return;
    }

    const formData = new FormData();
    formData.append("documento", String(Number(id)));
    formData.append("tipo_categoria", formDataValues.tipo_categoria);
    formData.append("nombre_documento", formDataValues.nombre_documento);
    formData.append("numero_version", formDataValues.numero_version);
    formData.append("tipo_archivo", formDataValues.tipo_archivo);
    formData.append("firmado_por", formDataValues.firmado_por);
    formData.append("autorizado_por", formDataValues.autorizado_por);
    formData.append("es_ultima", formDataValues.es_ultima.toString());
    formData.append("nombre_archivo", formDataValues.nombre_archivo);


    if (formDataValues.archivo) {
      formData.append("archivo_path", formDataValues.archivo);
    }

    const loadingToast = toast.loading(
      <div style={{ color: "black" }}>Cargando...</div>,
      {
        position: "top-right",
      }
    );

    try {
      console.log("Enviando datos:", {
        tipo_categoria: formDataValues.tipo_categoria,
        // ... otros campos
      });

      await axios.post(`${apiUrl}/api/crear-version/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success(
        <div style={{ color: "green" }}>{"Versión subida con éxito"}</div>,
        { position: "top-right" }
      );

      setFormDataValues({
        tipo_categoria: "",
        nombre_documento: nombreDocumento,
        nombre_archivo: "",
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
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          {"Error al subir versión"}
        </div>,
        { position: "top-right" }
      );
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <Layout>
      <div className="my-10 flex flex-col gap-6">
        <HeaderPages text="Subir nueva versión de documento" />
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Nueva versión: {nombreDocumento}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Selector de tipo_categoria */}
            <div>
              <label className="block font-medium mb-1">
                Tipo de documento
              </label>
              <select
                name="tipo_categoria"
                value={formDataValues.tipo_categoria}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Selecciona tipo</option>
                <option value="manual">Manual</option>
                <option value="anexo">Anexo</option>
                <option value="proceso">Proceso</option>
                <option value="ficha_tecnica">Ficha Técnica</option>
                <option value="capacitacion">Capacitación</option>
                <option value="comunicado">Comunicado</option>
                <option value="formato">Formato</option>
                <option value="procedimiento">Procedimiento</option>
                <option value="flujograma">Flujograma</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">
                Nombre del archivo
              </label>
              <input
                type="text"
                name="nombre_archivo"
                value={formDataValues.nombre_archivo}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Número de versión
              </label>
              <input
                type="number"
                name="numero_version"
                value={formDataValues.numero_version}
                onChange={handleInputChange}
                min={1}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Archivo</label>
              <input
                type="file"
                name="archivo_path"
                accept=".pdf,.xlsx,.pptx,.docx"
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Tipo de archivo</label>
              <select
                name="tipo_archivo"
                value={formDataValues.tipo_archivo}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="PDF">PDF</option>
                <option value="XLSX">XLSX</option>
                <option value="PPTX">PPTX</option>
                <option value="DOCX">DOCX</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Usuario editor</label>
              <select
                name="usuario_editor"
                value={formDataValues.usuario_editor}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Selecciona un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Firmado por</label>
              <input
                type="text"
                name="firmado_por"
                value={formDataValues.firmado_por}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Autorizado por</label>
              <input
                type="text"
                name="autorizado_por"
                value={formDataValues.autorizado_por}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center mt-4 col-span-full">
              <input
                type="checkbox"
                name="es_ultima"
                checked={formDataValues.es_ultima}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="font-medium">¿Es la última versión?</label>
            </div>
          </div>

          <div className="pt-6 text-right">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow"
            >
              Subir versión
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default UploadDocument;
