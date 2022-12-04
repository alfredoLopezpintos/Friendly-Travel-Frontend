import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Link, useHistory } from "react-router-dom";
import { getToken, resetUserSession } from "./service/AuthService";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const history = useHistory();

  const handleHistory = () => {
    history.push("/login");
  };

  const logoutHandler = () => {
    resetUserSession();
    closeMobileMenu();
  };

  const logoutHandler2 = () => {
    resetUserSession();
    window.location.reload(false);
  };

  const showButton = () => {
    if (window.innerWidth <= 1185) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            FRIENDLY TRAVEL
            <i className="fab fa-typo3" />
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/services"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Sobre nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/carpool"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Carpooling
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/faqsPage"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Preguntas Frecuentes
              </Link>
            </li>

            <li onClick={handleHistory}>
              {getToken() === null ? (
                <Link
                  to="/login"
                  className="nav-links-mobile"
                  onClick={closeMobileMenu}
                >
                  Iniciar sesión
                </Link>
              ) : (
                <Link
                  to="/"
                  className="nav-links-mobile"
                  onClick={logoutHandler}
                >
                  Cerrar sesión
                </Link>
              )}
            </li>
          </ul>
          {button &&
            (getToken() === null ? (
              <Button onClick={handleHistory} buttonStyle="btn--outline">
                Iniciar sesión
              </Button>
            ) : (
              <Button onClick={logoutHandler2} buttonStyle="btn--outline">
                Cerrar sesión
              </Button>
            ))}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
