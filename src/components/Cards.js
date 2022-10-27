import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>¡Tu próximo destino te espera!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/colonia.jpg'
              text='Viaja y explora su Barrio Histórico con calles de adoquines'
              label='Colonia'
            />
            <CardItem
              src='images/faro.jpg'
              text='La costa este de Uruguay es una sucesión de balnearios con paisajes tan variados como maravillosos'
              label='Costa Atlántica'

            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/punta.jpg'
              text='Es uno de los centros turísticos más importante y elegidos del país'
              label='Punta del Este'

            />
            <CardItem
              src='images/traffic.jpg'
              text='Explora la capital del país y sus sitios más iconicos'
              label='Montevideo'
 
            />
            <CardItem
              src='images/auto.jpg'
              text='¡Viaja, explora, conoce nuestro país y has nuevos amigos!'
              label='Aventura'

            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
