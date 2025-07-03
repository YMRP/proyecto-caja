import Header from "../components/Header";
import { useState } from "react";
import '../assets/styles/CreateDocument.css'
import HeaderPages from "../components/HeaderPages";
function CreateDocument() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [formDataValues, setFormDataValues] = useState({
    titulo: "",
    descripcion: "",
    categoria: "interno",
    fecha_ultima_revision: "",
    fecha_ultima_actualizacion: "",
    fecha_aprobacion_ca: "",
    organo_ejecutivo_aprobador: "Consejo Directivo",
    numero_sesion_aprobacion: "",
    area_operativa: "",
    funcionarios_aplican: "",
    proceso_operativo: "",
    numero_sesion_ultima_act: "",
    numero_acuerdo: "",
    firmado_por: "",
    autorizado_por: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

    try {
      const response = await fetch("https://tudominio.com/api/documento-con-version/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Documento creado con versión:", data);
      alert("Documento creado exitosamente");
    } catch (error) {
      console.error("Error al crear el documento:", error);
      alert("Hubo un error al enviar el documento");
    }
  };

  return (
    <div>
      <Header />
      <HeaderPages text="Crear Documento con versión"/>
      <div className="contenedorHome">
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <table className="formulario-tabla">
            <tbody>
              <tr>
                <th>Archivo</th>
                <td><input type="file" name="archivo_path" accept=".pdf,.docx" onChange={handleChange} required /></td>
              </tr>
              <tr><th>Título</th><td><input name="titulo" onChange={handleChange} required /></td></tr>
              <tr><th>Descripción</th><td><textarea name="descripcion" onChange={handleChange} required /></td></tr>
              <tr>
                <th>Categoría</th>
                <td>
                  <select name="categoria" onChange={handleChange}>
                    <option value="interno">Interno</option>
                  </select>
                </td>
              </tr>
              <tr><th>Fecha Última Revisión</th><td><input type="date" name="fecha_ultima_revision" onChange={handleChange} /></td></tr>
              <tr><th>Fecha Última Actualización</th><td><input type="date" name="fecha_ultima_actualizacion" onChange={handleChange} /></td></tr>
              <tr><th>Fecha Aprobación CA</th><td><input type="date" name="fecha_aprobacion_ca" onChange={handleChange} /></td></tr>
              <tr><th>Órgano Ejecutivo Aprobador</th><td><input name="organo_ejecutivo_aprobador" value={formDataValues.organo_ejecutivo_aprobador} onChange={handleChange} /></td></tr>
              <tr><th>Número Sesión Aprobación</th><td><input name="numero_sesion_aprobacion" onChange={handleChange} /></td></tr>
              <tr><th>Área Operativa</th><td><input name="area_operativa" onChange={handleChange} /></td></tr>
              <tr><th>Funcionarios Aplican</th><td><input name="funcionarios_aplican" onChange={handleChange} /></td></tr>
              <tr><th>Proceso Operativo</th><td><input name="proceso_operativo" onChange={handleChange} /></td></tr>
              <tr><th>Sesión Última Actualización</th><td><input name="numero_sesion_ultima_act" onChange={handleChange} /></td></tr>
              <tr><th>Número de Acuerdo</th><td><input name="numero_acuerdo" onChange={handleChange} /></td></tr>
              <tr><th>Firmado por</th><td><input name="firmado_por" onChange={handleChange} /></td></tr>
              <tr><th>Autorizado por</th><td><input name="autorizado_por" onChange={handleChange} /></td></tr>
            </tbody>
          </table>
          <button type="submit">Enviar Documento</button>
        </form>
      </div>
    </div>
  );
}

export default CreateDocument;
