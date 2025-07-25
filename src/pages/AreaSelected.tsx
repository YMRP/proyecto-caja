import { useParams } from "react-router-dom";
import Layout from "./Layout";
import {
  FiFileText,
  FiBookOpen,
  FiSettings,
  FiUsers,
  FiClipboard,
  FiSpeaker,
  FiEdit,
  FiFilePlus,
  FiGitBranch,
} from "react-icons/fi";

const DOCUMENT_TYPES = [
  { key: "manual", label: "Manual", Icon: FiBookOpen },
  { key: "anexo", label: "Anexo", Icon: FiFileText },
  { key: "proceso", label: "Proceso", Icon: FiSettings },
  { key: "capacitacion", label: "Capacitación", Icon: FiUsers },
  { key: "ficha_tecnica", label: "Ficha Técnica", Icon: FiClipboard },
  { key: "comunicado", label: "Comunicado", Icon: FiSpeaker },
  { key: "procedimiento", label: "Procedimiento", Icon: FiEdit },
  { key: "formato", label: "Formato", Icon: FiFilePlus },
  { key: "flujograma", label: "Flujograma", Icon: FiGitBranch },
];

function AreaSelected() {
  const { area } = useParams(); // para capturar el nombre del área desde la URL

  return (
    <Layout>
      <div className="py-10 px-6">
        <h1 className="text-3xl font-bold mb-8 text-center capitalize">
          Área: {area?.replace(/_/g, " ")}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {DOCUMENT_TYPES.map(({ key, label, Icon }) => (
            <button
              key={key}
              className="group flex flex-col items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl p-8 shadow-lg transition duration-300"
            >
              <Icon size={48} className="mb-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg font-semibold uppercase">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default AreaSelected;
