import { useState, useEffect } from "react";
import HeaderPages from "../components/HeaderPages";
import axios from "axios";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
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

        const creador =
          usuarios
            .find((u) => u.id === doc.usuario_creador?.id)
            ?.id?.toString() || "";

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
          usuario_creador: doc.usuario_creador?.toString() || "",
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
        formData.append(
          key,
          key === "usuario_creador" ? String(Number(value)) : value
        );
      }
    }

    const loadingToast = toast.loading("Cargando...", {
      position: "top-right",
    });

    try {
      const response = await axios.put(
        `${apiUrl}api/documento/${id}/`,
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      toast.success(
        <div style={{ color: "green" }}>
          {response.data.mensaje || "Documento modificado correctamente"}
        </div>,
        { position: "top-right" }
      );

      navigate("/documents");
    } catch (error: any) {
      toast.error(
        <div style={{ color: "red" }}>Error al modificar el documento</div>,
        { position: "top-right" }
      );
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen  my-10">
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
                      ) : key === "categoria" ? (
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
                      ) : key === "area_operativa" ? (
                        <select
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">Selecciona un área</option>
                          <option value="administrativa">Administrativa</option>
                          <option value="gestion_de_riesgos">
                            Gestión de Riesgos
                          </option>
                          <option value="auditoria">Auditoría</option>
                          <option value="seguridad_de_la_informacion">
                            Seguridad de la Información
                          </option>
                          <option value="recursos_humanos">
                            Recursos Humanos
                          </option>
                          <option value="credito">Crédito</option>
                          <option value="tecnologias_de_la_informacion">
                            Tecnologías de la Información
                          </option>
                          <option value="tesoreria">Tesorería</option>
                          <option value="contabilidad">Contabilidad</option>
                          <option value="pld">PLD</option>
                          <option value="mercadotecnia">Mercadotecnia</option>
                          <option value="operaciones">Operaciones</option>
                        </select>
                      ) : key === "funcionarios_aplican" ? (
                        <select
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">Selecciona un funcionario</option>
                          <option value="gerente_general">
                            Gerente General
                          </option>
                          <option value="subgerente">Subgerente</option>
                          <option value="">Selecciona un funcionario</option>
                          <option value="gerente_general">
                            Gerente General
                          </option>
                          <option value="subgerente">Subgerente</option>
                          <option value="jefe_de_proyectos_especiales">
                            Jefe de Proyectos Especiales
                          </option>
                          <option value="controloria">Controlaría</option>
                          <option value="administracion_de_riegos">
                            Administración de Riesgos
                          </option>
                          <option value="auditor_interno">
                            Auditor Interno
                          </option>
                          <option value="auxiliar_de_auditor_interno">
                            Auxiliar de Auditor Interno
                          </option>
                          <option value="oficial_de_seguridad_de_la_informacion">
                            Oficial de Seguridad de la Información
                          </option>
                          <option value="jefe_de_desarrollo_humano">
                            Jefe de Desarrollo Humano
                          </option>
                          <option value="capacitador">Capacitador</option>
                          <option value="jefe_de_credito">
                            Jefe de Crédito
                          </option>
                          <option value="supervisor_de_credito">
                            Supervisor de Crédito
                          </option>
                          <option value="controlaria_de_credito">
                            Controlaría de Crédito
                          </option>
                          <option value="analista_de_credito">
                            Analista de Crédito
                          </option>
                          <option value="supervisor_de_uens">
                            Supervisor de UENS
                          </option>
                          <option value="encargado_de_uens">
                            Encargado de UENS
                          </option>
                          <option value="jefe_de_cobranza">
                            Jefe de Cobranza
                          </option>
                          <option value="supervisor_de_cobranza">
                            Supervisor de Cobranza
                          </option>
                          <option value="asesores_de_cobranza">
                            Asesores de Cobranza
                          </option>
                          <option value="jefe_de_captacion">
                            Jefe de Captación
                          </option>
                          <option value="auxiliar_de_captacion">
                            Auxiliar de Captación
                          </option>
                          <option value="jefe_de_sistemas">
                            Jefe de Sistemas
                          </option>
                          <option value="auxiliar_de_sistemas">
                            Auxiliar de Sistemas
                          </option>
                          <option value="jefe_de_tesoreria">
                            Jefe de Tesorería
                          </option>
                          <option value="jefe_de_ contabilidad">
                            Jefe de Contabilidad
                          </option>
                          <option value="auxiliar de contabilidad">
                            Auxiliar de Contabilidad
                          </option>
                          <option value="oficial de cumplimiento">
                            Oficial de Cumplimiento
                          </option>
                          <option value="auxiliar de oficial de cumplimiento">
                            Auxiliar de Oficial de Cumplimiento
                          </option>
                          <option value="jefe de mercadotecnia">
                            Jefe de Mercadotecnia
                          </option>
                          <option value="auxiliar de mercadotecnia">
                            Auxiliar de Mercadotecnia
                          </option>
                          <option value="asesores de servicios multiples">
                            Asesores de Servicios Múltiples
                          </option>
                          <option value="auxiliares de servicios multiples">
                            Auxiliares de Servicios Múltiples
                          </option>
                          <option value="cajeros">Cajeros</option>
                          <option value="volantes generales">
                            Volantes Generales
                          </option>
                          <option value="encargado de archivo">
                            Encargado de Archivo
                          </option>
                          <option value="auxiliar de archivo">
                            Auxiliar de Archivo
                          </option>
                        </select>
                      ) : key === "usuario_creador" ? (
                        <select
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">Selecciona un usuario</option>
                          {usuarios.map((usuario) => (
                           <option key={usuario.id} value={usuario.id.toString()}>

                              {usuario.nombre} ({usuario.correo})
                            </option>
                          ))}
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
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow"
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
