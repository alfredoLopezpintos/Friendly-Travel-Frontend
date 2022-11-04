import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const history = useHistory();

  const handleHistory = () => {
    history.push("/login");
  }

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

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            FRIENDLY TRAVEL
            <i className='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Inicio
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/services'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Sobre nosotros
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/products'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Carpooling
              </Link>
            </li>

            <li onClick={handleHistory}>
              <Link
                className='nav-links-mobile'
              >
                Iniciar sesión
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle='btn--outline'>Iniciar sesión</Button>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
