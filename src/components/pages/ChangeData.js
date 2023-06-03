import "../Cards.css";
import Footer from "../Footer";
import CardItem from "../CardItem";
import React, { useState, useEffect } from "react";
import ModalRegistrarVehiculo from '../../components/ModalRegistrarVehiculo'

export function ChangeData() {

  return (
    <>
      <div className="cards">
        <div className="cards__container">
          <div className="cards__wrapper">
            <ul className="cards__items">
              <CardItem
                src={require("../../assets/images/pic5.JPG")}
                text="Pagina en construcción! Proximamente disponible, por ahora, intenta con otra sección."
                label="Woops!"
              />
            </ul>
          </div>
        </div>
      </div>
      
      <ModalRegistrarVehiculo  />
      <Footer />
    </>
  );
}
