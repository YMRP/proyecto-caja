import axios from "axios";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
const apiUrl = import.meta.env.VITE_URL_BACKEND;
import { toast } from "sonner";

export function ModProfile() {
  const FUNCIONARIOS = [
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

  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [perfilOp, setPerfilOp] = useState("");

  const accessToken = localStorage.getItem("access");

  // Obtener datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      const loadingToast = toast.loading(
        <div style={{ color: "black" }}>Cargando...</div>,
        { position: "top-right" }
      );
      try {
        const response = await axios.get(`${apiUrl}api/obtener-perfil/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        toast.dismiss(loadingToast);

        const userData = response.data;
        console.log(userData);
        setNombre(userData.nombre || "");
        setPerfilOp(userData.perfil_operativo || "");
        setPassword("");
      } catch (error: any) {
        console.error("Error al obtener los datos del usuario:", error.message);
      }
    };

    fetchUserData();
  }, [accessToken]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const modUser = async () => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("password", password);
    formData.append("perfil_operativo", perfilOp);

    if (file) formData.append("foto_perfil", file);

    try {
      const response = await axios.put(
        `${apiUrl}api/modificar-perfil/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        <div style={{ color: "green" }}>{response.data.mensaje}</div>,
        { position: "top-right" }
      );
    } catch (e: any) {
      toast.error(
        <div style={{ color: "red" }}>{"Error al actualizar perfil"}</div>,
        { position: "top-right" }
      );
      console.log(e);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        modUser();
      }}
      className="w-full flex flex-col gap-6"
    >
      {/* Nombre */}
      <div className="flex flex-col gap-2">
        <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          placeholder="Nuevo nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Perfil operativo */}
      <div className="flex flex-col gap-2">
        <label htmlFor="perfilOp" className="text-sm font-medium text-gray-700">
          Perfil operativo:
        </label>
        <select
          id="perfilOp"
          value={perfilOp}
          onChange={(e) => setPerfilOp(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Seleccione un perfil</option>
          {FUNCIONARIOS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Contraseña */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Subir foto */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="inputPhoto"
          className="text-sm font-medium text-gray-700"
        >
          Subir una foto
        </label>
        <input
          type="file"
          id="inputPhoto"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
        />
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-200 font-semibold"
      >
        Actualizar Perfil
      </button>
    </form>
  );
}

export default ModProfile;
