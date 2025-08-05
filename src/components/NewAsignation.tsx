import { useEffect, useState } from "react";
import HeaderPages from "./HeaderPages";
import Layout from "../pages/Layout";
import axios from "axios";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

function NewAsignation() {
  const token = localStorage.getItem("access");
  const [documentos, setDocumentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    versionId: "", // <- nuevo nombre
    usuarioId: "",
    tipoAsignacion: "",
    observaciones: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, usersRes] = await Promise.all([
          axios.get(`${apiUrl}documentos-visibles/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${apiUrl}api/admin/usuarios/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setDocumentos(docsRes.data);
        setUsuarios(usersRes.data);

        console.log(docsRes.data);
        console.log(usersRes.data);
      } catch (error) {
        toast.error("Error al cargar datos del servidor", {
          position: "top-right",
        });
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      version: formData.versionId, // <-- clave que espera el backend
      usuario_asignado: formData.usuarioId,
      tipo_asignacion: formData.tipoAsignacion,
      observaciones: formData.observaciones,
    };

    try {
      await axios.post(`${apiUrl}api/asignaciones/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Asignación registrada con éxito", {
        position: "top-right",
      });

      setFormData({
        versionId: "",
        usuarioId: "",
        tipoAsignacion: "",
        observaciones: "",
      });
    } catch (error) {
      toast.error("Error al registrar asignación", { position: "top-right" });
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col px-4 sm:px-10 md:px-20 py-10 gap-6">
        <HeaderPages text="Nueva asignación" />

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
          {/* Documento */}
          <div className="flex flex-col ">
            <label className="font-semibold mb-1">Archivo:</label>
            <select
              name="versionId"
              value={formData.versionId}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Seleccione un archivo</option>

              {documentos.map((doc: any) =>
                doc.versiones?.map((v: any) => (
                  <option key={v.id} value={v.id}>
                    {v.nombre_archivo} - versión {v.numero_version}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Usuario */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Usuario Asignado:</label>
            <select
              name="usuarioId"
              value={formData.usuarioId}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Seleccione un usuario</option>
              {usuarios.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de asignación */}
          {/* Tipo de asignación */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Tipo De Asignación:</label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipoAsignacion"
                  value="revision" // ✅ correcto
                  checked={formData.tipoAsignacion === "revision"}
                  onChange={handleChange}
                />
                Revisión
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipoAsignacion"
                  value="control" // ✅ correcto
                  checked={formData.tipoAsignacion === "control"}
                  onChange={handleChange}
                />
                Contralor
              </label>
            </div>
          </div>

          {/* Observaciones */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Observaciones:</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="border rounded px-3 py-2 min-h-[100px]"
            ></textarea>
          </div>

          {/* Botón de envío */}
          <div className="text-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Asignar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default NewAsignation;
