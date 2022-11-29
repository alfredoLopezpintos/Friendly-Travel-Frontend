import React from 'react';
import CardItem2 from './CardItem2';
import TextItem from './TextItem';
import './Text.css';

function Text() {
  return (
    <div className='text'>
      <h1>¡Tu próximo destino te espera!</h1>
      <div className='text__container'>
        <div className='text__wrapper'>
          <ul className='text__items'>
            <CardItem2
              src={require("../assets/images/carpool.jpg")}
            />
            <TextItem
              text='La costa este de Uruguay es una sucesión de balnearios con paisajes tan variados como maravillosos'
            />
          </ul>
          <ul className='cards__items'>
              <TextItem
                text='La costa este de Uruguay es una sucesión de balnearios con paisajes tan variados como maravillosos'
              />
            <CardItem2
              src={require("../assets/images/carpool.jpg")}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Text;
