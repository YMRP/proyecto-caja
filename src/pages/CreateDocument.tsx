import Header from "../components/Header";
import { useState, useEffect } from "react";
import "../assets/styles/CreateDocument.css";
import HeaderPages from "../components/HeaderPages";
import axios from "axios";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import { toast } from "sonner";
import Footer from "../components/Footer";
import type { Usuario } from "../types/types";

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
    <div>
      <Header />
      <HeaderPages text="Crear Documento" />
      <div className="contenedorHome">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <table className="formulario-tabla">
            <tbody>
              <tr>
                <th>Referencia</th>
                <td>
                  <input name="referencia" onChange={handleChange} required />
                </td>
              </tr>
              <tr>
                <th>Título</th>
                <td>
                  <input name="titulo" onChange={handleChange} required />
                </td>
              </tr>

              <tr>
                <th>Descripción</th>
                <td>
                  <textarea
                    name="descripcion"
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <th>Categoría</th>
                <td>
                  <select name="categoria" onChange={handleChange}>
                    <option value="interno">Interno</option>
                    <option value="confidencial">Confidencial</option>
                    <option value="restringido">Restringido</option>
                    <option value="publico">Público</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Fecha Última Revisión</th>
                <td>
                  <input
                    type="date"
                    name="fecha_ultima_revision"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Fecha Última Actualización</th>
                <td>
                  <input
                    type="date"
                    name="fecha_ultima_actualizacion"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Fecha Aprobación CA</th>
                <td>
                  <input
                    type="date"
                    name="fecha_aprobacion_ca"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Fecha Revocación</th>
                <td>
                  <input
                    type="date"
                    name="fecha_revocacion"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Órgano Ejecutivo Aprobador</th>
                <td>
                  <input
                    name="organo_ejecutivo_aprobador"
                    value={formDataValues.organo_ejecutivo_aprobador}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Número Sesión Aprobación</th>
                <td>
                  <input
                    name="numero_sesion_aprobacion"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Área Operativa</th>
                <td>
                  <select
                    name="area_operativa"
                    onChange={handleChange}
                    value={formDataValues.area_operativa}
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
                </td>
              </tr>
              <tr>
                <th>Área Operativa otro</th>
                <td>
                  <input
                    name="area_operativa_otro"
                    type="text"
                    placeholder="Si tu área operativa no esta en la lista, escribela aquí"
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>Funcionarios Aplican</th>
                <td>
                  <select
                    name="funcionarios_aplican"
                    onChange={handleChange}
                    value={formDataValues.funcionarios_aplican}
                  >
                    <option value="">Selecciona un funcionario</option>
                    <option value="gerente_general">Gerente General</option>
                    <option value="subgerente">Subgerente</option>
                    <option value="jefe_de_proyectos_especiales">
                      Jefe de Proyectos Especiales
                    </option>
                    <option value="controloria">Controlaría</option>
                    <option value="administracion_de_riegos">
                      Administración de Riesgos
                    </option>
                    <option value="auditor_interno">Auditor Interno</option>
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
                    <option value="jefe_de_credito">Jefe de Crédito</option>
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
                    <option value="encargado_de_uens">Encargado de UENS</option>
                    <option value="jefe_de_cobranza">Jefe de Cobranza</option>
                    <option value="supervisor_de_cobranza">
                      Supervisor de Cobranza
                    </option>
                    <option value="asesores_de_cobranza">
                      Asesores de Cobranza
                    </option>
                    <option value="jefe_de_captacion">Jefe de Captación</option>
                    <option value="auxiliar_de_captacion">
                      Auxiliar de Captación
                    </option>
                    <option value="jefe_de_sistemas">Jefe de Sistemas</option>
                    <option value="auxiliar_de_sistemas">
                      Auxiliar de Sistemas
                    </option>
                    <option value="jefe_de_tesoreria">Jefe de Tesorería</option>
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
                </td>
              </tr>
              <tr>
                <th>Funcionarios Aplican Otro </th>
                <td>
                  <input
                    name="funcionarios_aplican_otro"
                    type="text"
                    placeholder="Si tu funcionario no esta en la lista, escribela aquí"
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>Proceso Operativo</th>
                <td>
                  <input name="proceso_operativo" onChange={handleChange} />
                </td>
              </tr>

              <tr>
                <th>Número Sesión Última Actualización</th>
                <td>
                  <input
                    name="numero_sesion_ultima_act"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Número de Acuerdo</th>
                <td>
                  <input name="numero_acuerdo" onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <th>Usuario Creador</th>
                <td>
                  <select
                    name="usuario_creador"
                    id="usuario_creador"
                    onChange={handleChange}
                    value={formDataValues.usuario_creador}
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
                <th>Versión Actual</th>
                <td>
                  <input
                    name="version_actual"
                    onChange={handleChange}
                    type="number"
                    min={1}
                  />
                </td>
              </tr>
              <tr>
                <th>Firmado por</th>
                <td>
                  <input name="firmado_por" onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <th>Autorizado por</th>
                <td>
                  <input name="autorizado_por" onChange={handleChange} />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit">Crear Documento</button>
        </form>
      </div>
            <Footer/>

    </div>
  );
}

export default CreateDocument;
