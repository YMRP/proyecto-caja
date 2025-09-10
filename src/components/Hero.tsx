import { useState, useEffect } from "react";

function Hero() {
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        setNombreUsuario(usuario.nombre || "Usuario");
      } catch (error) {
        setNombreUsuario("Usuario");
      }
    } else {
      setNombreUsuario("Usuario");
    }
  }, []);

  return (
    <section className="bg-gradient-to-br from-[var(--cielo)] to-[var(--jade)] text-white py-20 px-6 text-center shadow-md">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 ">
          Bienvenido <span className="text-[var(--sol)]">{nombreUsuario}</span> al panel de administración de
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold ">
          Caja Popular San José de Tlajomulco
        </h2>
        <p className="mt-6 text-lg md:text-xl  ">
          Administra documentos, versiones y asignaciones de forma segura y eficiente.
        </p>
      </div>
    </section>
  );
}

export default Hero;
