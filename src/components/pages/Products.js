import React from 'react';
import '../../App.css';
import Footer from '../Footer';
import CardItem from '../CardItem';

function Products() {
  return (
    <>
    <div className='cards'>
      <h1>Información acerca de Carpooling</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src={require("../../assets/images/pol.jpg")}
              text='El transporte es uno de los grandes desafíos para las grandes cuidades del mundo en términos de reducción de emisiones de gases de efecto invernadero, 
              especialmente dióxido de carbono (CO2) a la atmósfera. 
              Con friendly travel vamos a hacer el mundo de un lugar mejor, ayudando a las personas a trasladarse de forma sustentable, a un menor costo, con más comodidad y de una manera 
              amigable con el medio ambiente.'
              label='¿Qué resuelve Friendly Travel?'
            />
            <CardItem
              src={require("../../assets/images/carp.png")}
              text='Es una tendencia internacional que ayuda a reducir el tráfico y caos vehicular, y cuidar el ambiente. A través de esta plataforma digital, conductores 
              y pasajeros pueden buscar viajes 
              disponibles y autos con asientos libres, respectivamente. 
              Es decir, una fórmula sencilla: viajar
               varias personas en un mismo vehículo para llegar a un destino común. Su objetivo es claro y preciso: optimizar el uso del auto al maximizar la cantidad de asientos utilizados.'
              label='¿De qué se trata?'

            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src={require("../../assets/images/works.jpg")}
              text='Conductores y pasajeros publican los trayectos que necesitan recorrer, con fechas y horarios. 
              Cuando hay una coincidencia, el sistema les permite ponerse en contacto, acordar la división de costos y empezar a viajar juntos.    
    
    Hay dos tipos de viajes. Por un lado, el del conductor, que es quien tiene lugares disponibles en su auto para que otras personas le pidan subirse al viaje. 
    Por otro lado, el del pasajero, que es quien está en la búsqueda de realizar un viaje y busca a alguien con auto para sumarse al viaje.'
              label='¿Cómo funciona?'

            />
            <CardItem
              src={require("../../assets/images/green.jpg")}
              text='El carpooling cuenta además con múltiples beneficios desde las tres aristas de la sustentabilidad: económica, social y ambiental. Entre ellas se encuentran: el ahorro de tiempo, 
              pues al popularizarse la tendencia se reduce el número de autos en la calle; la reducción de CO2; la prevención del estrés que genera tener que manejar en la hora pico; y la socialización 
              al conocer a personas nuevas que pueden incluso terminar siendo amigos.'
              label='Beneficios de utilizar Friendly Travel'
 
            />
          </ul>
        </div>
      </div>
    </div>
      
      <Footer />
    </>
  );
}

export default Products;