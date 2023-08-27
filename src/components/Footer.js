import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer-container">
      <section className="footer-subscription">
        <p className="footer-subscription-heading" style={{"userSelect": "none"}}>
          ¡Únete a la aventura y comienza a viajar con Friendly Travel!
        </p>
        <div className="input-areas"></div>
      </section>
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2 style={{"userSelect": "none"}}>Mapa del sitio</h2>
            <Link to="/faqsPage">Preguntas frecuentes</Link>
            <Link to="/services">Quienes somos</Link>
            <Link to="/carpool">Acerca de Carpooling</Link>
            <Link to="/policy">Términos y Condiciones</Link>
          </div>
          <div className="footer-link-items">

          <div className="big_logo">
              <img src={require("../assets/images/logo2.png")} alt="travel logo" width={150}></img>
            </div>            
          </div>
          
          <div className="footer-link-items">
            <h2 style={{"userSelect": "none"}}>Contactanos</h2>
            <small className="website-rights">friendly.travel.uy@gmail.com</small>
            <small className="website-rights">diego.rosales@estudiantes.utec.edu.uy</small>
            <small className="website-rights">rodrigo.serron@estudiantes.utec.edu.uy</small>
            <small className="website-rights">alfredo.lopezpintos@estudiantes.utec.edu.uy</small>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <div className="social-logo-footer">
            FRIENDLY TRAVEL &nbsp;
            <img
              src={require("../assets/images/logo.png")}
              alt="travel logo"
              width={50}
              disable
            ></img>
          </div>
          </div>
          <small className="website-copyright">FRIENDLY TRAVEL © 2023</small>
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
