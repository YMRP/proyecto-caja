import Button from "../components/Button";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_URL_BACKEND;

function NewPassword() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        if (usuario && usuario.correo) {
          setCorreo(usuario.correo);
        }
      } catch (error) {
        console.error("Error al leer usuario de localStorage:", error);
      }
    }
  }, []);

  const handleChangePassword = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.preventDefault();

    if (!correo || !tempPassword || !newPassword) {
      toast.error("Todos los campos son obligatorios", {
        position: "top-right",
      });
      return;
    }

    const loadingToast = toast.loading(
      <div style={{ color: "black" }}>Cargando...</div>,
      { position: "top-right" }
    );

    try {
      await axios.post(`${apiUrl}api/cambiar-contrasena-temporal/`, {
        correo,
        contrasena_actual: tempPassword,
        nueva_contrasena: newPassword,
      });

      toast.dismiss(loadingToast);
      toast.success(
        <div style={{ color: "green" }}>
          Contraseña actualizada correctamente
        </div>,
        { position: "top-right" }
      );

      localStorage.removeItem("usuario");
      navigate("/");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const msg =
        error?.response?.data?.mensaje || "Error al actualizar contraseña";
      toast.error(msg, { position: "top-right" });
      console.error("Error en cambio de contraseña:", error);
    }
  };

  return (
    <div
      className="flex items-center justify-center w-screen min-h-screen bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1001%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgb(0,102,94)'%3e%3c/rect%3e%3cpath d='M0%2c663.893C124.432%2c659.107%2c177.749%2c500.138%2c263.22%2c409.579C326.933%2c342.073%2c386.922%2c277.563%2c437.861%2c199.964C497.871%2c108.547%2c591.143%2c24.82%2c587.537%2c-84.475C583.883%2c-195.214%2c492.047%2c-279.753%2c419.275%2c-363.304C346.672%2c-446.662%2c270.574%2c-529.902%2c166.682%2c-567.668C59.135%2c-606.762%2c-64.349%2c-622.43%2c-169.522%2c-577.338C-271.245%2c-533.725%2c-308.515%2c-413.73%2c-383.096%2c-331.954C-460.242%2c-247.365%2c-594.791%2c-201.097%2c-615.367%2c-88.476C-635.928%2c24.058%2c-546.69%2c125.317%2c-484.141%2c221.1C-429.313%2c305.06%2c-350.56%2c362.666%2c-276.564%2c430.342C-185.685%2c513.459%2c-123.065%2c668.627%2c0%2c663.893' fill='rgb(7,53,54)'%3e%3c/path%3e%3cpath d='M1440 1169.891C1560.39 1191.439 1693.576 1180.722 1794.798 1112.077 1895.296 1043.923 1925.045 914.984 1977.423 805.433 2030.82 693.751 2104.421 588.259 2104.429 464.469 2104.438 331.32 2070.22 189.811 1977.47 94.28 1886.143 0.214 1742.385-4.578 1615.82-38.789 1492.22-72.199 1370.058-131.704 1245.127-103.676 1116.909-74.91 1008.284 12.255 927.242 115.693 848.539 216.144 809.332 340.562 797.519 467.625 786.109 590.358 792.045 722.332 861.371 824.251 927.235 921.08 1057.868 938.118 1158.404 998.172 1254.739 1055.717 1329.541 1150.121 1440 1169.891' fill='rgb(73,188,166)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1001'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e")`,
      }}
    >
      <div className="bg-white shadow-2xl p-8 w-full max-w-md flex flex-col items-center gap-6 rounded-lg">
        <img
          src="images/logo_blanco.png"
          alt="Logo Caja"
          className="w-28 h-24 object-contain shadow-md"
        />
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Ingresa una nueva contraseña
        </h1>

        <form className="w-full space-y-4 flex flex-col">
          <div>
            <label
              htmlFor="correo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo
            </label>
            <input
              type="email"
              id="correo"
              disabled
              className="w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="tempPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña temporal
            </label>
            <input
              type="password"
              id="tempPassword"
              placeholder="Tu contraseña temporal"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-[var(--agua)] focus:ring-2"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nueva contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="Tu nueva contraseña"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-[var(--agua)] focus:ring-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            text="Actualizar"
            id="buttonLogin"
            onClick={handleChangePassword}
          
          />
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
