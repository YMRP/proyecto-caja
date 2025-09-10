import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiShield,
  FiUsers,
  FiCreditCard,
  FiSettings,
  FiDatabase,
  FiTrendingUp,
  FiFileText,
  FiBarChart2,
  FiPackage,
} from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { useState, useEffect } from "react";

const AREAS: {
  key: string;
  label: string;
  Icon: React.ComponentType<{ size?: string | number; className?: string }>;
}[] = [
  { key: "administrativa", label: "Administrativa", Icon: FiBriefcase },
  { key: "gestion_de_riesgos", label: "Gestión de Riesgos", Icon: FiShield },
  { key: "auditoria", label: "Auditoría", Icon: FiUsers },
  {
    key: "seguridad_de_la_informacion",
    label: "Seguridad de la Información",
    Icon: FiShield,
  },
  { key: "recursos_humanos", label: "Recursos Humanos", Icon: FiUsers },
  { key: "credito_cobranza", label: "Crédito y cobranza", Icon: FiCreditCard },
  
  {
    key: "tecnologias_de_la_informacion",
    label: "Tecnologías de la Información",
    Icon: FiSettings,
  },
  { key: "tesoreria", label: "Tesorería", Icon: FiDatabase },
  { key: "contabilidad", label: "Contabilidad", Icon: FiTrendingUp },
  { key: "pld", label: "PLD", Icon: FiFileText },
  { key: "mercadotecnia", label: "Mercadotecnia", Icon: FiBarChart2 },
  { key: "operaciones", label: "Operaciones", Icon: FiPackage },
];

function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-[var(--agua)] ">
        <Hero />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-6">
          {AREAS.map(({ key, label, Icon }) => (
            <Link
              to={`/area/${key}`}
              key={key}
              className="group flex flex-col items-center justify-center border-2 border-[var(--cielo)] rounded-lg p-8 shadow-md bg-white
                         hover:bg-[var(--sol)] transition-colors duration-300"
            >
              <div className="bg-white group-hover:bg-[var(--darkerSol)] rounded-full p-4 mb-5 transition-colors duration-300">
                <Icon
                  size={56}
                  className="text-[var(--darkerSol)] group-hover:text-white transition-colors duration-300"
                />
              </div>
              <span className="text-black group-hover:text-white uppercase text-lg tracking-wide font-semibold text-center">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
