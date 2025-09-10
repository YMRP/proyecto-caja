import NavElement from "./NavElement";
import api from "../api/axios";
import { accessWithoutToken } from "../utils/noToken";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { FaHome, FaUsers, FaBell } from "react-icons/fa";
import { BsListCheck } from "react-icons/bs";
import { IoDocumentTextSharp } from "react-icons/io5";
import type { Usuario, LogSesion } from "../types/types";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

function Header() {
  accessWithoutToken();

  const usuario: Usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const id = usuario.id; // asumiendo que el usuario tiene un campo id

  const esOperativo = usuario.rol === "operativo";

  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [ultimoAcceso, setUltimoAcceso] = useState<string | null>(null);

  const [notificacionesOpen, setNotificacionesOpen] = useState(false);
  const notiRef = useRef<HTMLDivElement>(null);

  const [notificaciones, setNotificaciones] = useState<
    { id: number; texto: string }[]
  >([]);

  useEffect(() => {
    const obtenerAsignacionesPendientes = async () => {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) return;

      try {
        const res = await axios.get(`${apiUrl}api/mis-asignaciones/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const pendientes = res.data.filter((a: any) => !a.revisado);
        const formateadas = pendientes.map((a: any) => ({
          id: a.id,
          texto: `Asignación pendiente: ${a.documento_titulo}`,
        }));

        setNotificaciones(formateadas);
      } catch (err: any) {
        console.error("Error al obtener asignaciones pendientes:", err.message);
      }
    };

    obtenerAsignacionesPendientes();
    const interval = setInterval(obtenerAsignacionesPendientes, 30000); // cada 30s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const obtenerUltimoAcceso = () => {
      if (usuario && Array.isArray(usuario.logs_sesion)) {
        // Filtramos solo sesiones cerradas (con fecha_fin no nulo)
        const sesionesCerradas = (usuario.logs_sesion as LogSesion[])
          .filter((log) => log.fecha_fin !== null)
          .sort(
            (a, b) =>
              new Date(b.fecha_fin!).getTime() -
              new Date(a.fecha_fin!).getTime()
          );

        if (sesionesCerradas.length > 0) {
          const fecha = new Date(sesionesCerradas[0].fecha_fin!);
          const fechaFormateada = fecha.toLocaleString("es-MX", {
            dateStyle: "short",
            timeStyle: "short",
          });
          setUltimoAcceso(fechaFormateada);
        } else {
          setUltimoAcceso("No hay registros previos");
        }
      }
    };

    const obtenerImagen = async () => {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) return;

      try {
        const response = await axios.get(`${apiUrl}api/obtener-perfil/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setFotoPerfil(response.data.foto_perfil || null);
      } catch (err: any) {
        console.error("Error al obtener la imagen:", err.message);
      }
    };

    obtenerImagen();
    obtenerUltimoAcceso();
  }, [usuario]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const token = localStorage.getItem("access");
      if (!token) return;

      const body = JSON.stringify({ token });
      const blob = new Blob([body], { type: "application/json" });

      const endpoint = apiUrl.endsWith("/")
        ? `${apiUrl}cerrar-sesion-beacon/`
        : `${apiUrl}/cerrar-sesion-beacon/`;

      navigator.sendBeacon(endpoint, blob);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const obtenerUltimoAccesoDesdeApi = async () => {
      if (!usuario.id) {
        setUltimoAcceso("Usuario no válido");
        return;
      }

      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        setUltimoAcceso("No autorizado");
        return;
      }

      try {
        const response = await axios.get(
          `${apiUrl}api/admin/usuarios/${usuario.id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const logsSesion: LogSesion[] = response.data.logs_sesion;

        // Filtramos sesiones cerradas
        const sesionesCerradas = logsSesion
          .filter((log) => log.fecha_fin !== null)
          .sort(
            (a, b) =>
              new Date(b.fecha_fin!).getTime() -
              new Date(a.fecha_fin!).getTime()
          );

        if (sesionesCerradas.length > 0) {
          const fecha = new Date(sesionesCerradas[0].fecha_fin!);
          const fechaFormateada = fecha.toLocaleString("es-MX", {
            dateStyle: "short",
            timeStyle: "short",
          });
          setUltimoAcceso(fechaFormateada);
        } else {
          setUltimoAcceso("No hay registros previos");
        }
      } catch (error: any) {
        console.error("Error al obtener logs de sesión:", error.message);
        setUltimoAcceso("Error al obtener último acceso");
      }
    };

    obtenerUltimoAccesoDesdeApi();
  }, [usuario.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).classList.contains("profile-pic")
      ) {
        setMenuOpen(false);
      }
      if (
        notiRef.current &&
        !notiRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).classList.contains("noti-icon")
      ) {
        setNotificacionesOpen(false);
      }
    }
    if (menuOpen || notificacionesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, notificacionesOpen]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setNotificacionesOpen(false);
  };

  const toggleNotificaciones = () => {
    setNotificacionesOpen((prev) => !prev);
    setMenuOpen(false);
  };

  const cerrarSesion = async () => {
    accessWithoutToken();
    try {
      await api.post("/api/cerrar-sesion/");
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión", error);
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="bg-white shadow-md w-full top-0 z-50">
      <header className="max-w-full mx-auto flex items-center justify-between px-6 py-3 sm:py-4">
        <div className="flex items-center">
          <a href="/home">
            <img
              src="/images/logo_blanco.png"
              alt="Logo"
              className="h-12 w-auto sm:h-16"
            />
          </a>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8 text-white font-semibold">
            <NavElement href="/home" value="INICIO" icon={<FaHome />} />
            {!esOperativo && (
              <NavElement href="/users" value="USUARIOS" icon={<FaUsers />} />
            )}
            <NavElement
              href="/asignations/:id"
              value="ASIGNACIONES"
              icon={<BsListCheck />}
            />
            {!esOperativo && (
              <NavElement
                href="/documents"
                value="DOCUMENTOS"
                icon={<IoDocumentTextSharp />}
              />
            )}

            <button
              onClick={toggleNotificaciones}
              className="relative noti-icon focus:outline-none"
              aria-label="Mostrar notificaciones"
              type="button"
            >
              <FaBell className="text-[var(--jade)] w-6 h-6" />
              {notificaciones.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {notificaciones.length}
                </span>
              )}
            </button>
          </nav>

          <div className="relative flex items-center gap-4">
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={toggleMenu}
              aria-label="Abrir menú"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <img
              src={fotoPerfil || "images/default.jpg"}
              alt="FotoPerfil"
              className="profile-pic w-10 h-10 rounded-full cursor-pointer ring-2 ring-white hover:ring-[var(--jade)] transition duration-200"
              onClick={toggleMenu}
            />

            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-2 text-sm text-gray-700 "
              >
                <nav className="flex flex-col px-2 mb-2 md:hidden gap-2">
                  <NavElement
                    href="/home"
                    value="INICIO"
                    icon={<FaHome />}
                    onClick={() => setMenuOpen(false)}
                  />
                  {!esOperativo && (
                    <NavElement
                      href="/users"
                      value="USUARIOS"
                      icon={<FaUsers />}
                      onClick={() => setMenuOpen(false)}
                    />
                  )}
                  <NavElement
                    href="/asignations/:id"
                    value="ASIGNACIONES"
                    icon={<BsListCheck />}
                    onClick={() => setMenuOpen(false)}
                  />
                  {!esOperativo && (
                    <NavElement
                      href="/documents"
                      value="DOCUMENTOS"
                      icon={<IoDocumentTextSharp />}
                      onClick={() => setMenuOpen(false)}
                    />
                  )}
                </nav>

                <a
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Ajustes de perfil
                </a>
                <button
                  onClick={cerrarSesion}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Cerrar sesión
                </button>

                {ultimoAcceso && (
                  <button
                    onClick={() => alert(`Último acceso: ${ultimoAcceso}`)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs text-gray-500"
                  >
                    Último acceso: {ultimoAcceso}
                  </button>
                )}
              </div>
            )}

            {notificacionesOpen && (
              <div
                ref={notiRef}
                className="absolute right-10 top-full mt-2 w-64 bg-white rounded-md shadow-lg py-2 text-sm text-gray-700 z-50"
              >
               <h3 className="font-semibold px-4 py-2 border-b border-gray-200 flex justify-between items-center">
  Notificaciones
  {notificaciones.length > 0 && (
    <button
      onClick={() => setNotificaciones([])}
      className="text-xs text-red-500 hover:underline"
    >
      Limpiar
    </button>
  )}
</h3>
                {notificaciones.length === 0 ? (
                  <p className="px-4 py-2 text-gray-500">
                    No hay notificaciones
                  </p>
                ) : (
                  notificaciones.map((noti) => (
                    <p
                      key={noti.id}
                      className="px-4 py-2 border-b border-gray-100 last:border-none"
                    >
                      {noti.texto}
                    </p>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
