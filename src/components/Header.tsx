
import '../assets/styles/Header.css'
import NavElement from './NavElement';

function Header() {
  return (
    <>
      <header>
        <img className="logo__header" alt='Logo' src='../src/assets/images/logo.jpg'/>
        <nav>
          <NavElement href="#" value="OPCION 1" />
          <NavElement href="#" value="OPCION 2" />
          <NavElement href="#" value="OPCION 3" />
          
        </nav>
      </header>
    </>
  );
}

export default Header;
