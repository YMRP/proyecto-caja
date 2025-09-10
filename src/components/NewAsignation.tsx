import { useEffect, useState } from "react";
import HeaderPages from "./HeaderPages";
import Layout from "../pages/Layout";
import axios from "axios";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

// Lista de perfiles operativos
const PERFILES = [
  ["gerente_general", "Gerente General"],
  ["subgerente", "Subgerente"],
  ["jefe_de_proyectos_especiales", "Jefe de Proyectos Especiales"],
  ["controloria", "Controlaría"],
  ["administracion_de_riegos", "Administración de Riesgos"],
  ["auditor_interno", "Auditor Interno"],
  ["auxiliar_de_auditor_interno", "Auxiliar de Auditor Interno"],
  [
    "oficial_de_seguridad_de_la_informacion",
    "Oficial de Seguridad de la Información",
  ],
  ["jefe_de_desarrollo_humano", "Jefe de Desarrollo Humano"],
  ["capacitador", "Capacitador"],
  ["jefe_de_credito", "Jefe de Credito"],
  ["supervisor_de_credito", "Supervisor de Credito"],
  ["controlaria_de_credito", "Controlaria de Credito"],
  ["analista_de_credito", "Analista de Credito"],
  ["supervisor_de_uens", "Supervisor de UENS"],
  ["encargado_de_uens", "Encargado de UENS"],
  ["jefe_de_cobranza", "Jefe de Cobranza"],
  ["supervisor_de_cobranza", "Supervisor de Cobranza"],
  ["asesores_de_cobranza", "Asesores de Cobranza"],
  ["jefe_de_captacion", "Jefe de Captacion"],
  ["auxiliar_de_captacion", "Auxiliar de Captacion"],
  ["jefe_de_sistemas", "Jefe de Sistemas"],
  ["auxiliar_de_sistemas", "Auxiliar de Sistemas"],
  ["jefe_de_tesoreria", "Jefe de Tesoreria"],
  ["jefe_de_contabilidad", "Jefe de Contabilidad"],
  ["auxiliar_de_contabilidad", "Auxiliar de Contabilidad"],
  ["oficial_de_cumplimiento", "Oficial de Cumplimiento"],
  [
    "auxiliar_de_oficial_de_cumplimiento",
    "Auxiliar de Oficial de Cumplimiento",
  ],
  ["jefe_de_mercadotecnia", "Jefe de Mercadotecnia"],
  ["auxiliar_de_mercadotecnia", "Auxiliar de Mercadotecnia"],
  ["asesores_de_servicios_multiples", "Asesores de Servicios Multiples"],
  ["auxiliaresde_servicios_multiples", "Auxiliares de Servicios Multiples"],
  ["cajeros", "Cajeros"],
  ["volantes_generales", "Volantes Generales"],
  ["encargado_de_archivo", "Encargado de Archivo"],
  ["auxiliar_de_archivo", "Auxiliar de Archivo"],
];

// Tipos
interface Documento {
  id: number;
  versiones: Version[];
}
interface Version {
  id: number;
  nombre_archivo: string;
  numero_version: string;
}
interface Usuario {
  id: number;
  nombre: string;
}
interface FormData {
  versionId: string;
  usuarioId: string;
  perfilOperativo: string;
  tipoAsignacion: string;
  observaciones: string;
}
type ModoAsignacion = "usuario" | "todos" | "perfil";

function NewAsignation() {
  const token = localStorage.getItem("access");
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modoAsignacion, setModoAsignacion] =
    useState<ModoAsignacion>("usuario");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    versionId: "",
    usuarioId: "",
    perfilOperativo: "",
    tipoAsignacion: "",
    observaciones: "",
  });

  // Cargar datos iniciales
  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, usersRes] = await Promise.all([
        axios.get(`${apiUrl}documentos-visibles/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiUrl}api/admin/usuarios/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setDocumentos(docsRes.data);
      setUsuarios(usersRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar datos del servidor", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Cambio de formulario
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Cambio de modo de asignación
  const handleModoAsignacionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newMode = e.target.value as ModoAsignacion;
    setModoAsignacion(newMode);
    setFormData((prev) => ({
      ...prev,
      usuarioId: "",
      perfilOperativo: "",
      tipoAsignacion:
        newMode === "todos" && prev.tipoAsignacion === "control"
          ? ""
          : prev.tipoAsignacion,
    }));
  };

  // Validación
  const validateForm = (): boolean => {
    if (!formData.versionId) {
      toast.error("Debes seleccionar un archivo");
      return false;
    }
    if (!formData.tipoAsignacion) {
      toast.error("Debes seleccionar un tipo de asignación");
      return false;
    }
    if (modoAsignacion === "usuario" && !formData.usuarioId) {
      toast.error("Debes seleccionar un usuario");
      return false;
    }
    if (modoAsignacion === "perfil" && !formData.perfilOperativo) {
      toast.error("Debes seleccionar un perfil operativo");
      return false;
    }
    return true;
  };

  // Payload
  const buildPayload = () => {
    const payload: any = {
      version: formData.versionId,
      tipo_asignacion: formData.tipoAsignacion,
      modo_asignacion: modoAsignacion,
      observaciones: formData.observaciones?.trim() || "",
    };

    if (modoAsignacion === "usuario" && formData.usuarioId) {
      payload.usuario_asignado = formData.usuarioId;
    } else if (modoAsignacion === "perfil" && formData.perfilOperativo) {
      payload.perfil_operativo = formData.perfilOperativo;
    } else if (modoAsignacion === "todos") {
      // No agregamos usuario_asignado ni perfil_operativo
    } else {
      console.warn("Modo de asignación desconocido:", modoAsignacion);
    }

    return payload;
  };

  const resetForm = () => {
    setFormData({
      versionId: "",
      usuarioId: "",
      perfilOperativo: "",
      tipoAsignacion: "",
      observaciones: "",
    });
    setModoAsignacion("usuario");
  };

  // Envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    // Validación del formulario
    if (!validateForm()) {
      return;
    }

    // Construir payload
    const payload = buildPayload();
   

    try {
      setLoading(true);

      const res = await axios.post(
        `${apiUrl}api/asignaciones/crear/`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );



      toast.success(res.data.mensaje || "Asignación registrada con éxito", {
        position: "top-right",
      });

      // Resetear formulario
      resetForm();
    } catch (error: any) {
      console.error("=== DEBUG: Error al registrar asignación ===");

      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);

        const errorMsg =
          error.response.data?.error ||
          error.response.data?.message ||
          "Error al registrar asignación";
        toast.error(errorMsg, { position: "top-right" });
      } else {
        console.error("Error sin respuesta del servidor:", error);
        toast.error("Error de conexión", { position: "top-right" });
      }
    } finally {
      setLoading(false);
    }
  };

  // Opciones de documentos
  const renderDocumentOptions = () =>
    documentos.flatMap(
      (doc) =>
        doc.versiones?.map((v) => (
          <option key={v.id} value={v.id}>
            {v.nombre_archivo} - versión {v.numero_version}
          </option>
        )) || []
    );

  return (
    <Layout>
      <div className="flex flex-col px-4 sm:px-10 md:px-20 py-10 gap-6">
        <HeaderPages text="Asignación de documento" />
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
          {/* Documento */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Archivo:</label>
            <select
              name="versionId"
              value={formData.versionId}
              onChange={handleChange}
              className="border rounded px-3 py-2 disabled:opacity-50"
              required
              disabled={loading}
            >
              <option value="">Seleccione un archivo</option>
              {renderDocumentOptions()}
            </select>
          </div>

          {/* Modo de asignación */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Modo de asignación:</label>
            <select
              value={modoAsignacion}
              onChange={handleModoAsignacionChange}
              className="border rounded px-3 py-2 disabled:opacity-50"
              disabled={loading}
            >
              <option value="usuario">Usuario específico</option>
              <option value="todos">Todos los usuarios</option>
              <option value="perfil">Perfil operativo</option>
            </select>
          </div>

          {/* Usuario específico */}
          {modoAsignacion === "usuario" && (
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Usuario asignado:</label>
              <select
                name="usuarioId"
                value={formData.usuarioId}
                onChange={handleChange}
                className="border rounded px-3 py-2 disabled:opacity-50"
                required
                disabled={loading}
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Perfil operativo */}
          {modoAsignacion === "perfil" && (
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Perfil operativo:</label>
              <select
                name="perfilOperativo"
                value={formData.perfilOperativo}
                onChange={handleChange}
                className="border rounded px-3 py-2 disabled:opacity-50"
                required
                disabled={loading}
              >
                <option value="">Seleccione un perfil</option>
                {PERFILES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tipo de asignación */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Tipo de asignación:</label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipoAsignacion"
                  value="revision"
                  checked={formData.tipoAsignacion === "revision"}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                Revisión
              </label>
              {modoAsignacion === "usuario" && (
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipoAsignacion"
                    value="control"
                    checked={formData.tipoAsignacion === "control"}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  Contralor
                </label>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Observaciones:</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="border rounded px-3 py-2 min-h-[100px] disabled:opacity-50"
              placeholder="Ingrese observaciones adicionales (opcional)"
              disabled={loading}
            />
          </div>

          {/* Botón */}
          <div className="text-end">
            <button
              type="submit"
              className="bg-[var(--cielo)] text-white px-6 py-2 rounded hover:bg-[var(--jade)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Asignar"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default NewAsignation;
