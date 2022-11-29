import React from "react";
import "./Footer.css";
import { Button } from "./Button";
import { Link } from "react-router-dom";

function Footer2() {
  return (
    <div className="footer-container" id="footer">
      <div className="social-media-wrap">
        <div className="footer-logo">
          <Link to="/" className="social-logo">
            FRIENDLY TRAVEL
            <i className="fab fa-typo3" />
          </Link>
        </div>
        <small className="website-rights">FRIENDLY TRAVEL © 2022</small>
      </div>
    </div>
  );
}

export default Footer2;
