import React from "react";
import "./Cards.css";
import CardItem from "./CardItem";

function Cards() {
  return (
    <div className='cards'>
      <h1>Planea tus próximas vacaciones con Friendly Travel</h1>    
      <div className='cards__container'>
        <div className='cards__wrapper'>
      <hr></hr>
          <br></br><br></br>
          <ul className='cards__items'>
            <CardItem
              src={require("../assets/images/colonia.jpg")}
              text="Viaja y explora su Barrio Histórico con calles de adoquines"
              label="Colonia"
            />
            <CardItem
              src={require("../assets/images/faro.jpg")}
              text="La costa este de Uruguay es una sucesión de balnearios con paisajes tan variados como maravillosos"
              label="Costa Atlántica"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src={require("../assets/images/punta.jpg")}
              text="Es uno de los centros turísticos más importantes y elegidos del país"
              label="Punta del Este"
            />
            <CardItem
              src={require("../assets/images/traffic.jpg")}
              text="Explora la capital del país y sus sitios más icónicos"
              label="Montevideo"
            />
            <CardItem
              src={require("../assets/images/auto.jpg")}
              text="¡Viaja, explora, conoce nuestro país y haz nuevos amigos!"
              label="Aventura"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
