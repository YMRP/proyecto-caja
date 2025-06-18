import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BACKEND,
});

// ✅ Interceptor de solicitud: añade el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    console.log("Se adjunta token al request:", token); // ✅ AGREGAR ESTO

    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Función para refrescar el token
async function refreshToken(): Promise<string | null> {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const response = await axios.post(`${import.meta.env.VITE_URL_BACKEND}api/token/refresh/`, {
      refresh,
    });

    const newAccess = response.data.access;
    console.log("Nuevo access token recibido:", newAccess);

    localStorage.setItem("access", newAccess);
    return newAccess;
  } catch (error) {

    console.error("Error al refrescar el token:", error);
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
}

// ✅ Interceptor de respuesta: intenta refrescar si da 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      console.warn("Token expirado. Intentando refresh...");

      originalRequest._retry = true;
      const newToken = await refreshToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
