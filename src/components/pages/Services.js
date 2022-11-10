import React from 'react';
import '../../App.css';
import Footer from '../Footer';
import CardItem from '../CardItem';

function Services() {
  return (
    <>
      <div className='cards'>
      <h1>Sobre nosotros</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/nosotros.png'
              text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, odio!'
              label='¿Quienes somos?'
            />
            <CardItem
              src='images/utec.jpg'
              text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, odio!'
              label='UTEC Durazno'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/parada.jpg'
              text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, odio!'
              label='Nuestra problemática'
            />
            <CardItem
              src='images/viaje.jpg'
              text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, odio!'
              label='Nuestra misión'
 
            />
          </ul>
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
}
export default Services