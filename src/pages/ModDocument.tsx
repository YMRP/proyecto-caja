import Header from "../components/Header";
import { useState, useEffect } from "react";
import HeaderPages from "../components/HeaderPages";
import axios from "axios";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import type { Usuario } from "../types/types";
import Layout from "./Layout";

function ModDocument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [archivo, setArchivo] = useState<File | null>(null);
  const accessToken = localStorage.getItem("access");

  const [formDataValues, setFormDataValues] = useState({
    titulo: "",
    referencia: "",
    descripcion: "",
    categoria: "interno",
    fecha_ultima_revision: "",
    fecha_ultima_actualizacion: "",
    fecha_aprobacion_ca: "",
    fecha_revocacion: "",
    organo_ejecutivo_aprobador: "Consejo De Administración",
    numero_sesion_aprobacion: "",
    area_operativa: "",
    area_operativa_otro: "",
    funcionarios_aplican: "",
    funcionarios_aplican_otro: "",
    proceso_operativo: "",
    numero_sesion_ultima_act: "",
    numero_acuerdo: "",
    usuario_creador: "",
    version_actual: "",
    firmado_por: "",
    autorizado_por: "",
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/admin/usuarios/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUsuarios(response.data);
        return response.data;
      } catch (err: any) {
        console.error("Error al obtener usuarios:", err.message);
        return [];
      }
    };

    const fetchDocumento = async (usuarios: Usuario[]) => {
      try {
        const response = await axios.get(`${apiUrl}documentos-visibles/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const doc = response.data.find((d: any) => d.id === Number(id));
        if (!doc) throw new Error("Documento no encontrado");

        const creador = usuarios.find(
          (u) => u.id === doc.usuario_creador?.id
        )?.id?.toString() || "";

        setFormDataValues({
          titulo: doc.titulo || "",
          referencia: doc.referencia || "",
          descripcion: doc.descripcion || "",
          categoria: doc.categoria || "interno",
          fecha_ultima_revision: doc.fecha_ultima_revision || "",
          fecha_ultima_actualizacion: doc.fecha_ultima_actualizacion || "",
          fecha_aprobacion_ca: doc.fecha_aprobacion_ca || "",
          fecha_revocacion: doc.fecha_revocacion || "",
          organo_ejecutivo_aprobador: doc.organo_ejecutivo_aprobador || "",
          numero_sesion_aprobacion: doc.numero_sesion_aprobacion || "",
          area_operativa: doc.area_operativa || "",
          area_operativa_otro: doc.area_operativa_otro || "",
          funcionarios_aplican: doc.funcionarios_aplican || "",
          funcionarios_aplican_otro: doc.funcionarios_aplican_otro || "",
          proceso_operativo: doc.proceso_operativo || "",
          numero_sesion_ultima_act: doc.numero_sesion_ultima_act || "",
          numero_acuerdo: doc.numero_acuerdo || "",
          usuario_creador: creador,
          version_actual: doc.version_actual?.toString() || "1",
          firmado_por: doc.firmado_por || "",
          autorizado_por: doc.autorizado_por || "",
        });
      } catch (err: any) {
        console.error("Error al obtener documento:", err.message);
        toast.error("Documento no encontrado");
      }
    };

    const fetchData = async () => {
      const usuariosData = await fetchUsuarios();
      await fetchDocumento(usuariosData);
    };

    fetchData();
  }, [id, accessToken]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "archivo_path" && files) {
      setArchivo(files[0]);
    } else {
      setFormDataValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (archivo) formData.append("archivo_path", archivo);
    for (const key in formDataValues) {
      const value = formDataValues[key as keyof typeof formDataValues];
      if (value) {
        formData.append(key, key === "usuario_creador" ? String(Number(value)) : value);
      }
    }

    const loadingToast = toast.loading("Cargando...", { position: "top-right" });

    try {
      const response = await axios.put(`${apiUrl}api/documento/${id}/`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      toast.success(
        <div style={{ fontSize: "1.5rem", color: "green" }}>
          {response.data.mensaje || "Documento modificado correctamente"}
        </div>,
        { position: "top-right" }
      );

      navigate("/documents");
    } catch (error: any) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Error al modificar el documento
        </div>,
        { position: "top-right" }
      );
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 my-10">
      <HeaderPages text="Modificar Documento" />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Formulario de modificación
          </h2>
          <table className="w-full text-sm text-left border border-gray-300 rounded overflow-hidden">
            <tbody>
              {Object.entries(formDataValues).map(([key, value]) => (
                <tr key={key} className="border-t border-gray-200">
                  <th className="bg-gray-100 px-4 py-3 font-medium capitalize w-1/3">
                    {key.replace(/_/g, " ")}
                  </th>
                  <td className="px-4 py-2">
                    {key === "descripcion" ? (
                      <textarea
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 h-28"
                      />
                    ) : key === "categoria" || key === "area_operativa" || key === "funcionarios_aplican" ? (
                      <select
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="interno">Interno</option>
                        <option value="confidencial">Confidencial</option>
                        <option value="restringido">Restringido</option>
                        <option value="publico">Público</option>
                      </select>
                    ) : (
                      <input
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pt-6 text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
    </Layout>
  );
}

export default ModDocument;
