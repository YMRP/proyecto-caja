import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Hero />
        <div className="contenedorHome">
          {/* Aquí iría el contenido principal */}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
