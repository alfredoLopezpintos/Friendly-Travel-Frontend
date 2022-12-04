import React from "react";
import CardItem2 from "../CardItem2";
import TextItem from "../TextItem";
import Footer from "../Footer";
import "../Text.css";

function Carpool() {
  return (
    <>
      <div className="text">
        <div className="text__container">
          <div className="text__wrapper">
            <h1>¿Qué es Friendly Travel?</h1>
            <br></br>
            <br></br>
            <hr></hr>
            <br></br>
            <ul className="text__items">
              <TextItem
                text="Es una plataforma colaborativa que conecta conductores con acompañantes para compartir gastos en trayectos de cualquier distancia, generando una forma más económica
               y sustentable de viajar. De esta manera, tanto el conductor como los acompañante se ven beneficiados, al haber compartido una experiencia más económica, amigable y sustentable."
              />

              <CardItem2 src={require("../../assets/images/comu.jpg")} />
            </ul>
          </div>
        </div>
        <h1>Ventajas de utilizar Friendly Travel</h1>
        <div className="text__container">
          <div className="text__wrapper">
            <hr></hr>
            <br></br>
            <br></br>
            <br></br>
            <ul className="text__items">
              <ul>
                <CardItem2 src={require("../../assets/images/pic2.JPG")} />
                <TextItem text="Accesibilidad y ahorro en viajes" />
              </ul>
              <ul>
                <CardItem2 src={require("../../assets/images/pic1.JPG")} />
                <TextItem text="Contribuir con el medio ambiente" />
              </ul>
              <ul>
                <CardItem2 src={require("../../assets/images/pic3.JPG")} />
                <TextItem text="Disminución del tránsito urbano" />
              </ul>
              <ul>
                <CardItem2 src={require("../../assets/images/pic5.JPG")} />
                <TextItem text="Ciudades más verdes y limpias" />
              </ul>
            </ul>
            <br></br>
            <br></br>
            <h1>¿Por qué utilizar Friendly Travel?</h1>
            <br></br>
            <br></br>
            <hr></hr>
            <br></br>
            <br></br>
            <ul className="cards__items">
              <TextItem
                text="No solo es una medida para combatir y ayudar a mitigar la contaminación del aire debido a los impactos ambientales de los vehículos, 
                también es una manera de descongestionar el transporte y las vías públicas,
                 una manera de aprovechar más el tiempo, de romper la rutina y de viajar más cómodo."
              />
              <CardItem2 src={require("../../assets/images/comparte.jpg")} />
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Carpool;
