import { useEffect, useRef } from "react";
import { Router } from "../router";
import { Toaster } from "sonner";
import api from "./api/axios"; // Asegúrate que es la misma instancia que en Header
import { accessWithoutToken } from "./utils/noToken";
import { toast } from "sonner";
function App() {
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);

  const cerrarSesion = async () => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) return;

    accessWithoutToken();

    try {
      await api.post("api/cerrar-sesion/");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const resetInactivityTimer = () => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) return;

    // Limpiar timers previos
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);

    // Duración de inactividad: 15 minutos
    const fifteenMinutes = 15 * 60 * 1000;
    const warningBefore = 1 * 60 * 1000; // 1 minuto antes del cierre

    warningTimer.current = setTimeout(() => {
      toast("Tu sesión se cerrará en 1 minuto por inactividad.");
    }, fifteenMinutes - warningBefore);

    logoutTimer.current = setTimeout(() => {
      cerrarSesion();
    }, fifteenMinutes);
  };

  useEffect(() => {
    const activityEvents = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    resetInactivityTimer();

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <Router />
    </div>
  );
}

export default App;
