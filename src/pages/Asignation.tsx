import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- IMPORT
import axios from "axios";
import HeaderPages from "../components/HeaderPages";
import { toast } from "sonner";
import type {AsignacionProps} from '../types/types'
import Layout from "./Layout";
import { FaCheckCircle } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_URL_BACKEND;



function Asignation() {
  const [asignaciones, setAsignaciones] = useState<AsignacionProps[]>([]);
  const accessToken = localStorage.getItem("access");
  const navigate = useNavigate(); // <-- Inicializa useNavigate

  useEffect(() => {
    const fetchAsignaciones = async () => {
      try {
        const res = await axios.get(`${apiUrl}api/mis-asignaciones/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setAsignaciones(res.data);
        console.log(res.data)
      } catch (error) {
        console.error("Error al obtener asignaciones:", error);
        toast.error(
          <div style={{ fontSize: "1.5rem", color: "red" }}>
            {"error al obtener asignaciones"}
          </div>,
          { position: "top-right" }
        );
      }
    };
    fetchAsignaciones();
  }, []);

  

  const handleLiberar = async (id: number) => {
    try {
      await axios.post(`${apiUrl}api/liberar-version/${id}/`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success("Versión liberada correctamente");

      setAsignaciones((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, revisado: true, fecha_revision: new Date().toISOString() }
            : a
        )
      );
    } catch (error) {
      toast.error("Error al liberar la versión");
      console.error(error);
    }
  };

  // Función para marcar como revisado
  const handleMarcarRevisado = async (id: number) => {
    try {
      await axios.post(
        `${apiUrl}api/marcar_revisado/`,
        { asignacion_id: id },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      toast.success(
        <div style={{ color: "green" }}>
          {"Version marcada como revisada"}
        </div>,
        { position: "top-right" }
      );
      setAsignaciones((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, revisado: true, fecha_revision: new Date().toISOString() }
            : a
        )
      );
    } catch (error) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "green" }}>
          {"error al marcar como revisada"}
        </div>,
        { position: "top-right" }
      );
      console.error(error);
    }
  };

  // función para crear asignación
  const handleCrearAsignacion = () => {
    const idParaCrear =
      asignaciones.length > 0 ? asignaciones[0].version_id : 0;
    navigate(`/newAsignation/${idParaCrear}`);
  };

  // ... aquí sigue tu código handleLiberar y handleMarcarRevisado

  return (
  <Layout>
    <div className="pt-20 px-4 min-h-screen bg-gray-50">
          <HeaderPages text="Asignaciones" />

      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleCrearAsignacion}
          className="mb-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
        >
          Crear asignación
        </button>

        {asignaciones.length === 0 ? (
          <p className="text-gray-700 text-lg">No tienes asignaciones pendientes.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-green-800 text-white text-sm uppercase">
                <tr>
                  <th className="py-3 px-4 text-left">Documento</th>
                  <th className="py-3 px-4 text-left">Versión</th>
                  <th className="py-3 px-4 text-left">Fecha Asignación</th>
                  <th className="py-3 px-4 text-left">Revisado</th>
                  <th className="py-3 px-4 text-left">Fecha Revisión</th>
                  <th className="py-3 px-4 text-left">Observaciones</th>
                  <th className="py-3 px-4 text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.map((a) => (
                  <tr
                    key={a.id}
                    className={`border-b border-gray-200 ${
                      a.revisado ? "bg-green-100" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4">{a.documento_titulo}</td>
                    <td className="py-3 px-4">{a.numero_version}</td>
                    <td className="py-3 px-4">
                      {a.fecha_asignacion
                        ? new Date(a.fecha_asignacion).toLocaleString()
                        : "-"}
                    </td>
                    <td className="py-3 px-4">{a.revisado ? "Sí" : "No"}</td>
                    <td className="py-3 px-4">
                      {a.fecha_revision
                        ? new Date(a.fecha_revision).toLocaleString()
                        : "-"}
                    </td>
                    <td className="py-3 px-4">{a.observaciones || "-"}</td>

                    <td className="py-3 px-4">
                      {!a.revisado ? (
                        a.tipo_asignacion === "control" ? (
                          <button
                            onClick={() => handleLiberar(a.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-3 rounded transition duration-200"
                          >
                            Liberar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarcarRevisado(a.id)}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded transition duration-200"
                          >
                            Marcar revisado
                          </button>
                        )
                      ) : (
                        <span className="text-green-700 text-lg font-bold flex flex-col items-center"><FaCheckCircle/></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </Layout>
);

}

export default Asignation;
