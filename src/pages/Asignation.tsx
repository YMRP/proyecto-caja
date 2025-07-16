import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- IMPORT
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeaderPages from "../components/HeaderPages";
import { toast } from "sonner";
import "../assets/styles/Asignation.css";
const apiUrl = import.meta.env.VITE_URL_BACKEND;

interface Asignacion {
  id: number;
  version_id: number;
  numero_version: string;
  tipo_asignacion: "control" | "revision";
  revisado: boolean;
  fecha_revision: string | null;
  documento_titulo: string;
}

function Asignation() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const accessToken = localStorage.getItem("access");
  const navigate = useNavigate(); // <-- Inicializa useNavigate

  useEffect(() => {
    const fetchAsignaciones = async () => {
      try {
        const res = await axios.get(`${apiUrl}api/mis-asignaciones/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setAsignaciones(res.data);
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
        <div style={{ fontSize: "1.5rem", color: "green" }}>
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
    <>
      <Header />
      <HeaderPages text="Asignaciones" />
      <div className="asignacion-container" style={{ padding: "1rem" }}>
        <button
          style={{
            marginBottom: "1rem",
            backgroundColor: "#007acc",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
          onClick={handleCrearAsignacion}
        >
          Crear asignación
        </button>

        {asignaciones.length === 0 ? (
          <p>No tienes asignaciones pendientes.</p>
        ) : (
          <table className="tabla-asignaciones">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Versión</th>
                <th>Tipo</th>
                <th>Revisado</th>
                <th>Fecha Revisión</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((a) => (
                <tr
                  key={a.id}
                  style={{
                    backgroundColor: a.revisado ? "#d4edda" : "transparent",
                  }}
                >
                  <td>{a.documento_titulo}</td>
                  <td>{a.numero_version}</td>
                  <td>
                    {a.tipo_asignacion === "control" ? "Contralor" : "Usuario"}
                  </td>
                  <td>{a.revisado ? "Sí" : "No"}</td>
                  <td>
                    {a.fecha_revision
                      ? new Date(a.fecha_revision).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    {!a.revisado &&
                      (a.tipo_asignacion === "control" ? (
                        <button onClick={() => handleLiberar(a.id)}>
                          Liberar
                        </button>
                      ) : (
                        <button onClick={() => handleMarcarRevisado(a.id)}>
                          Marcar revisado
                        </button>
                      ))}
                    {a.revisado && <span>✔</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Asignation;
