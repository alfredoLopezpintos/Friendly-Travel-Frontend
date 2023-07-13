import React, { useState } from "react";
import { MenuItems } from "./MenuItems";
import "./DropDown.css";
import { Link } from "react-router-dom";
import { resetUserSession } from "./service/AuthService";

function Dropdown() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const logoutHandler2 = () => {
    resetUserSession();
    window.location.reload(false);
  };

  return (
    <>
      <ul
        onClick={handleClick}
        className={click ? "dropdown-menu clicked" : "dropdown-menu"}
      >
        {MenuItems.map((item, index) => {
          return (
            <li key={index}>
              <Link
                className={item.cName}
                to={item.path}
                onClick={() => setClick(false)}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
        <li onClick={logoutHandler2} className="dropdown-link">
          Cerrar Sesión
        </li>
      </ul>
    </>
  );
}

export default Dropdown;
