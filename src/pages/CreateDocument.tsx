import { useState, useEffect } from "react";
import HeaderPages from "../components/HeaderPages";
import axios from "axios";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import { toast } from "sonner";
import type { Usuario } from "../types/types";
import Button from "../components/Button";
import Layout from "./Layout";

function CreateDocument() {
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
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsuarios(response.data);
      } catch (err: any) {
        console.error("Error al obtener usuarios:", err.message);
      }
    };

    fetchUsuarios();
  }, []);

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
    if (archivo) {
      formData.append("archivo_path", archivo);
    }

    for (const key in formDataValues) {
      formData.append(key, formDataValues[key as keyof typeof formDataValues]);
    }

    const loadingToast = toast.loading(
      <div style={{ fontSize: "1.5rem", color: "black" }}>Cargando...</div>,
      {
        position: "top-right",
      }
    );

    try {
      const response = await axios.post(
        `${apiUrl}api/crear-documento`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Documento creado:", response.data);
      toast.success(
        <div style={{ fontSize: "1.5rem", color: "green" }}>
          {response.data.mensaje}
        </div>,
        { position: "top-right" }
      );
    } catch (error: any) {
      console.error("Error al crear el documento:", error);
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          {"Error al crear el documento"}
        </div>,
        { position: "top-right" }
      );
    } finally {
      toast.dismiss(loadingToast);
    }
  }; // <-- AQUÍ se cierra bien handleSubmit

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 flex flex-col my-10 gap-6">
        <HeaderPages text="Crear Documento" />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <table className="w-full table-auto border border-gray-300 shadow-md mb-6">
            <tbody>
              {[
                {
                  label: "Referencia",
                  input: (
                    <input
                      name="referencia"
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Título",
                  input: (
                    <input
                      name="titulo"
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Descripción",
                  input: (
                    <textarea
                      name="descripcion"
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Categoría",
                  input: (
                    <select
                      name="categoria"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="interno"
                    >
                      <option value="interno">Interno</option>
                      <option value="confidencial">Confidencial</option>
                      <option value="restringido">Restringido</option>
                      <option value="publico">Público</option>
                    </select>
                  ),
                },
                {
                  label: "Fecha Última Revisión",
                  input: (
                    <input
                      type="date"
                      name="fecha_ultima_revision"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Fecha Última Actualización",
                  input: (
                    <input
                      type="date"
                      name="fecha_ultima_actualizacion"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Fecha Aprobación CA",
                  input: (
                    <input
                      type="date"
                      name="fecha_aprobacion_ca"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Fecha Revocación",
                  input: (
                    <input
                      type="date"
                      name="fecha_revocacion"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Órgano Ejecutivo Aprobador",
                  input: (
                    <input
                      name="organo_ejecutivo_aprobador"
                      value={formDataValues.organo_ejecutivo_aprobador}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Número Sesión Aprobación",
                  input: (
                    <input
                      name="numero_sesion_aprobacion"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Área Operativa",
                  input: (
                    <select
                      name="area_operativa"
                      onChange={handleChange}
                      value={formDataValues.area_operativa}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="administrativa">Administrativa</option>
                      <option value="gestion_de_riesgos">
                        Gestión de Riesgos
                      </option>
                      <option value="auditoria">Auditoría</option>
                      <option value="seguridad_de_la_informacion">
                        Seguridad de la Información
                      </option>
                      <option value="recursos_humanos">Recursos Humanos</option>
                      <option value="credito">Crédito</option>
                      <option value="cobranza">Cobranza</option>
                      <option value="tecnologias_de_la_informacion">
                        Tecnologías de la Información
                      </option>
                      <option value="tesoreria">Tesorería</option>
                      <option value="contabilidad">Contabilidad</option>
                      <option value="pld">PLD</option>
                      <option value="mercadotecnia">Mercadotecnia</option>
                      <option value="operaciones">Operaciones</option>
                    </select>
                  ),
                },
                {
                  label: "Área Operativa otro",
                  input: (
                    <input
                      name="area_operativa_otro"
                      type="text"
                      placeholder="Si tu área operativa no está en la lista, escríbela aquí"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Funcionarios Aplican",
                  input: (
                    <select
                      name="funcionarios_aplican"
                      onChange={handleChange}
                      value={formDataValues.funcionarios_aplican}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona un funcionario</option>
                      {/* Opciones cortadas para brevedad; agregar todas igual que en tu código */}
                      <option value="gerente_general">Gerente General</option>
                      <option value="subgerente">Subgerente</option>
                      {/* ...otras opciones... */}
                    </select>
                  ),
                },
                {
                  label: "Funcionarios Aplican Otro",
                  input: (
                    <input
                      name="funcionarios_aplican_otro"
                      type="text"
                      placeholder="Si tu funcionario no está en la lista, escríbelo aquí"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Proceso Operativo",
                  input: (
                    <input
                      name="proceso_operativo"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Número Sesión Última Actualización",
                  input: (
                    <input
                      name="numero_sesion_ultima_act"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Número de Acuerdo",
                  input: (
                    <input
                      name="numero_acuerdo"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Usuario Creador",
                  input: (
                    <select
                      name="usuario_creador"
                      id="usuario_creador"
                      onChange={handleChange}
                      value={formDataValues.usuario_creador}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona un usuario</option>
                      {usuarios.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>
                          {usuario.nombre}
                        </option>
                      ))}
                    </select>
                  ),
                },
                {
                  label: "Versión Actual",
                  input: (
                    <input
                      name="version_actual"
                      onChange={handleChange}
                      type="number"
                      min={1}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Firmado por",
                  input: (
                    <input
                      name="firmado_por"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
                {
                  label: "Autorizado por",
                  input: (
                    <input
                      name="autorizado_por"
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ),
                },
              ].map(({ label, input }, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <th className="text-left px-4 py-2 border border-gray-300 font-medium w-1/3">
                    {label}
                  </th>
                  <td className="px-4 py-2 border border-gray-300">{input}</td>
                </tr>
              ))}
            </tbody>
          </table>

          

          <Button text='Crear documento' type="submit" />
        </form>
      </div>
    </Layout>
  );
}

export default CreateDocument;
