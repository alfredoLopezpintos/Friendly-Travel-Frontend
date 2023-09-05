import React from "react";
import "../App.css";
import { Button } from "./Button";
import { Link, useHistory } from "react-router-dom";
import "./HeroSection.css";

function HeroSection() {
  const history = useHistory();

  const handleHistory = () => {
    history.push("/viajes");
  };

  return (
    <div className="hero-container">
      {/*<video src='/videos/video-2.mp4' autoPlay loop muted />*/}
      <h1 style={{"userSelect": "none"}}>TU VIAJE TE ESPERA</h1>
      <p style={{"userSelect": "none"}}>¿Qué estás esperando?</p>
      <div className="hero-btns">
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
          onClick={handleHistory}
        >
          BUSCAR VIAJE
        </Button>
        <Link to="/faqsPage" style={{ textDecoration: "none" }}>
          <Button
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
          >
            SOBRE CARPOOLING <i className="fa fa-info-circle" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;
