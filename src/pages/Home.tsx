import Header from "../components/Header";
import "../assets/styles/Home.css";
import { accessWithoutToken } from "../utils/NoToken";


function Home() {
  
   accessWithoutToken()
  return (
    <div>
      <Header />

      <div className="contenedor__home"></div>
    </div>
  );
}

export default Home;
