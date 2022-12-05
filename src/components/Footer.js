import React from "react";
import "./Footer.css";
import { Button } from "./Button";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer-container">
      <section className="footer-subscription">
        <p className="footer-subscription-heading">
          ¡Únete a la aventura y comienza a viajar con Friendly Travel!
        </p>
        <div className="input-areas"></div>
      </section>
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Mapa del sitio</h2>
            <Link to="/faqsPage">Preguntas frecuentes</Link>
            <Link to="/about">Quienes somos</Link>
            <Link to="/">Acerca de Carpooling</Link>
            <Link to="/">Términos y Condiciones</Link>
          </div>
          <div className="footer-link-items">
            <h2>Contactanos</h2>
            <Link>friendly.travel.uy@gmail.com</Link>
            <Link>diego.rosales@estudiantes.utec.edu.uy</Link>
            <Link>rodrigo.serron@estudiantes.utec.edu.uy</Link>
            <Link>alfredo.lopezpintos@estudiantes.utec.edu.uy</Link>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link to="/" className="social-logo">
              FRIENDLY TRAVEL
              <i className="fab fa-typo3" />
            </Link>
          </div>
          <small className="website-rights">FRIENDLY TRAVEL © 2022</small>
          <div className="social-icons">
            <Link
              className="social-icon-link facebook"
              to="/"
              target="_blank"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f" />
            </Link>
            <Link
              className="social-icon-link instagram"
              to="/"
              target="_blank"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" />
            </Link>
            <Link
              className="social-icon-link youtube"
              to="/"
              target="_blank"
              aria-label="Youtube"
            >
              <i className="fab fa-youtube" />
            </Link>
            <Link
              className="social-icon-link twitter"
              to="/"
              target="_blank"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter" />
            </Link>
            <Link
              className="social-icon-link twitter"
              to="/"
              target="_blank"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
