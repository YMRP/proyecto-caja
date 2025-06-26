import Header from "../components/Header";
import "../assets/styles/Home.css";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <div className="contenedorHome"></div>

      <Footer />
    </div>
  );
}

export default Home;
