import { FaFacebookF, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative bottom-0 left-0 w-full bg-[var(--bosque)] text-white py-6 shadow-inner z-50 max-sm:py-3">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-center text-sm md:text-base font-semibold">
          © {new Date().getFullYear()} Caja Popular Tlajomulco. Todos los derechos reservados.
        </p>

        <div className="flex space-x-4 text-xl">
          <a href="https://web.facebook.com/CPTlajomulco" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 duration-200">
            <FaFacebookF />
          </a>

          <a href="https://www.instagram.com/cajatlajomulco/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 duration-200">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
