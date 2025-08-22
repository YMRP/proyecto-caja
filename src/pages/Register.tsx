import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
const apiUrl = import.meta.env.VITE_URL_BACKEND;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handlePasswordConfirmationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setPasswordConfirmation(e.target.value);

  const validation = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    if (!name || !email || !password || !passwordConfirmation) {
      toast.error(
        <div style={{ fontSize: "1.5rem", color: "red" }}>
          Existen campos vacíos
        </div>,
        { position: "top-right" }
      );
      return;
    }

    if (password.length < 8) {
      toast.error(
        <div style={{ color: "red" }}>
          La contraseña debe tener al menos 8 caracteres
        </div>,
        { position: "top-right" }
      );
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error(
        <div style={{  color: "red" }}>
          Las contraseñas no coinciden
        </div>,
        { position: "top-right" }
      );
      return;
    }

    if (
      !email.endsWith("@cajatlajomulco.com.mx") &&
      !email.endsWith("@cajatlajomulco.com") &&
      !email.endsWith("@gmail.com")
    ) {
      toast.error(
        <div style={{ color: "red" }}>
          Dirección de correo no válida
        </div>,
        { position: "top-right" }
      );
      return;
    }

    // Validar si el correo ya existe usando response.data.existe
    try {
      const response = await axios.get(`${apiUrl}api/validar-usuario/`, {
        params: { correo: email },
      });

      if (response.data?.existe) {
        toast.error(
          <div style={{  color: "red" }}>
            El correo ya está registrado
          </div>,
          { position: "top-right" }
        );
        return;
      }
    } catch (error) {
      console.error("Error al validar correo:", error);
      toast.error(
        <div style={{ color: "red" }}>
          Error al validar el correo
        </div>,
        { position: "top-right" }
      );
      return;
    }

    // Si pasó la validación, registrar al usuario
    const rol = "operativo";
    const fechaActual: Date = new Date();
    const loadingToast = toast.loading(
      <div style={{  color: "black" }}>Cargando...</div>,
      {
        position: "top-right",
      }
    );
    try {
      const response = await axios.post(`${apiUrl}api/usuarios/`, {
        nombre: name,
        correo: email,
        password: password,
        rol,
        fechaActual,
      });
      toast.dismiss(loadingToast);


      toast.success(
        <div style={{  color: "green" }}>
          Verificación enviada a tu dirección de correo
        </div>,
        {
          position: "top-right",
        }
      );

      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (error: unknown) {
      toast.dismiss(loadingToast);

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const data = error.response.data;
        const message =
          typeof data === "string"
            ? data
            : typeof data.message === "string"
            ? data.message
            : JSON.stringify(data);

        toast.error(
          <div style={{ color: "red" }}>
            Error {status}: {message || "Error del servidor"}
          </div>,
          { position: "top-right" }
        );
      } else {
        console.error("Error inesperado al registrar:", error);
        toast.error(
          <div style={{ color: "red" }}>
            Error inesperado al enviar datos
          </div>,
          {
            position: "top-right",
          }
        );
      }
    }
  };

  return (
  <div
    className="flex items-center justify-center w-screen min-h-screen bg-center bg-cover bg-no-repeat"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1001%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgba(24%2c 106%2c 59%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c663.893C124.432%2c659.107%2c177.749%2c500.138%2c263.22%2c409.579C326.933%2c342.073%2c386.922%2c277.563%2c437.861%2c199.964C497.871%2c108.547%2c591.143%2c24.82%2c587.537%2c-84.475C583.883%2c-195.214%2c492.047%2c-279.753%2c419.275%2c-363.304C346.672%2c-446.662%2c270.574%2c-529.902%2c166.682%2c-567.668C59.135%2c-606.762%2c-64.349%2c-622.43%2c-169.522%2c-577.338C-271.245%2c-533.725%2c-308.515%2c-413.73%2c-383.096%2c-331.954C-460.242%2c-247.365%2c-594.791%2c-201.097%2c-615.367%2c-88.476C-635.928%2c24.058%2c-546.69%2c125.317%2c-484.141%2c221.1C-429.313%2c305.06%2c-350.56%2c362.666%2c-276.564%2c430.342C-185.685%2c513.459%2c-123.065%2c668.627%2c0%2c663.893' fill='%23104728'%3e%3c/path%3e%3cpath d='M1440 1169.891C1560.39 1191.4389999999999 1693.576 1180.722 1794.798 1112.077 1895.296 1043.923 1925.045 914.9839999999999 1977.423 805.433 2030.8200000000002 693.751 2104.4210000000003 588.259 2104.429 464.469 2104.438 331.32 2070.2200000000003 189.81099999999998 1977.47 94.27999999999997 1886.143 0.21400000000005548 1742.385-4.5779999999999745 1615.82-38.78899999999999 1492.22-72.19899999999996 1370.058-131.70399999999995 1245.127-103.67600000000004 1116.909-74.90999999999997 1008.284 12.254999999999995 927.242 115.69299999999998 848.539 216.144 809.332 340.562 797.519 467.625 786.109 590.358 792.045 722.332 861.371 824.251 927.235 921.0799999999999 1057.868 938.1179999999999 1158.404 998.172 1254.739 1055.717 1329.541 1150.121 1440 1169.891' fill='%23208d4f'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1001'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e")`
    }}
  >
    <div className="bg-white shadow-2xl p-8 w-full max-w-md flex flex-col items-center gap-6 rounded">
      <img
        src="images/logo.jpg"
        alt="Logo Caja"
        className="w-30 h-24 object-contain  shadow-md"
      />
      <h1 className="text-3xl font-bold text-gray-800">Regístrate</h1>

      <form className="w-full flex flex-col ">
        <div className="mb-4">
          <label htmlFor="campoNombre" className="block text-gray-700 font-medium mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="campoNombre"
            placeholder="Tu nombre"
            className="w-full px-4 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={handleNameChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="campoEmail" className="block text-gray-700 font-medium mb-1">
            Correo
          </label>
          <input
            type="email"
            id="campoEmail"
            placeholder="correo@correo.com"
            className="w-full px-4 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 "
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="campoPassword" className="block text-gray-700 font-medium mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="campoPassword"
            placeholder="Tu Contraseña"
            className="w-full px-4 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 "
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="campoPasswordConfirm" className="block text-gray-700 font-medium mb-1">
            Reescribe tu contraseña
          </label>
          <input
            type="password"
            id="campoPasswordConfirm"
            placeholder="Tu Contraseña"
            className="w-full px-4 py-2 border shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 "
            value={passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
          />
        </div>

        <Button
          type="submit"
          text="Registrar"
          onClick={validation}
          id="buttonRegister"
          className="w-full bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4  transition-colors duration-200 cursor-pointer"
        />
      </form>

      <p className="text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/" className="text-green-600 hover:underline font-semibold">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  </div>
);
}

export default Register;
