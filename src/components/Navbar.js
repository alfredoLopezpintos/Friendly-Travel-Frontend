import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import DropDown from "./DropDown";
import { Link, useHistory } from "react-router-dom";
import { getToken, resetUserSession } from "./service/AuthService";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [dropdown, setDropdown] = useState(false);

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

  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link style={{"userSelect": "none"}} to="/" className="navbar-logo" onClick={closeMobileMenu}>
            FRIENDLY TRAVEL &nbsp;
            <img
              src={require("../assets/images/logo.png")}
              alt="travel logo"
              width={50}
            ></img>
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link style={{"userSelect": "none"}} to="/about" className="nav-links" onClick={closeMobileMenu}>
                Sobre nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link
                style={{"userSelect": "none"}}
                to="/carpool"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Carpooling
              </Link>
            </li>
            <li className="nav-item">
              <Link
                style={{"userSelect": "none"}}
                to="/faqsPage"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Preguntas Frecuentes
              </Link>
            </li>

            {(button && (getToken() === null))? (
              <li className="nav-item">
              <Link style={{"userSelect": "none"}}
              to="/login" 
              className="nav-links"
                onClick={closeMobileMenu}>
                Iniciar sesión
              </Link>
              </li>
            ) : (
              <li
                className="nav-item"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                <Link style={{"userSelect": "none"}} to="/" className="nav-links" onClick={closeMobileMenu}>
                  <img
                    src={require("../assets/images/user.png")}
                    alt="travel logo"
                    width={50}
                  ></img>{" "}
                  &nbsp; &nbsp; <i className="fas fa-caret-down" />
                </Link>
                {dropdown && <DropDown />}
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
