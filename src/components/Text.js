import React from "react";
import CardItem2 from "./CardItem2";
import TextItem from "./TextItem";
import "./Text.css";

function Text() {
  return (
    <div className="text">
      <div className="text__container">
        <div className="text__wrapper">
          <h1>¿Qué es Carpooling?</h1>
          <br />
          <hr />
          <br />
          <ul className="text__items">
            <TextItem
              text="El Carpooling es la práctica que consiste en 
              compartir un automóvil con otras personas tanto para viajes periódicos como para trayectos puntuales. Con Friendly Travel reduciremos la 
              congestión de tránsito en las grandes ciudades así como también facilitaremos los desplazamientos de personas que no dispongan de coche propio. Además, supone una 
              notable disminución de emisiones de CO2, al reducir el número de coches en las carreteras. A su vez, favorece las relaciones sociales entre personas que realizan 
              los mismos recorridos."
            />
            <CardItem2 src={require("../assets/images/cp.jpg")} />
          </ul>
        </div>
      </div>

      <div className="text__container">
        <div className="text__wrapper">

          <h1>Ventajas de utilizar Friendly Travel</h1>
          <br />
          <br />
          <hr />
          <br />
          <br />
          <ul className="text__items">
            <CardItem2 src={require("../assets/images/carpool.jpg")} />

            <TextItem
              text="Ofrecer una mejor solución en movilidad a todas aquellas personas que necesiten trasladarse y 
              estén en la busqueda de una forma más eficiente de hacerlo en 
              materia de tiempos, costos y beneficios."
            />
          </ul>
          <br />
          <br />
          <hr />
          <br />
          <br />
          <ul className="cards__items">
            <TextItem
              text="No solo es una medida para combatir y ayudar a mitigar la contaminación del aire debido a los impactos ambientales de los vehículos, 
                también es una manera de descongestionar el transporte y las vías públicas,
                 una manera de aprovechar más el tiempo, de romper la rutina y de viajar más cómodo."
            />
            <CardItem2 src={require("../assets/images/comparte.jpg")} />
          </ul>

          <br />
          <br />
          <br />
          <br />
          <hr />
          <br />
          <br />
            <ul className="text__items">
              <ul>
                <CardItem2 src={require("../assets/images/pic2.JPG")} />
                <TextItem text="Accesibilidad y ahorro en viajes" />
              </ul>
              <ul>
                <CardItem2 src={require("../assets/images/pic1.JPG")} />
                <TextItem text="Contribuir con el medio ambiente" />
              </ul>
              <ul>
                <CardItem2 src={require("../assets/images/pic3.JPG")} />
                <TextItem text="Disminución del tránsito urbano" />
              </ul>
              <ul>
                <CardItem2 src={require("../assets/images/pic5.JPG")} />
                <TextItem text="Ciudades más verdes y limpias" />
              </ul>
            </ul>
        </div>
      </div>
    </div>
  );
}

export default Text;
