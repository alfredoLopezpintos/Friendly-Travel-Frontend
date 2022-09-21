import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      {/*<video src='/videos/video-2.mp4' autoPlay loop muted />*/}
      <h1>TU VIAJE TE ESPERA</h1>
      <p>¿A qué estás esperando?</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          BUSCAR VIAJE
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          SOBRE CARPOOLING <i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
