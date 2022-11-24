import React from 'react';
import '../App.css';
import { Button } from './Button';
import { useHistory } from "react-router-dom";
import './HeroSection.css';


function HeroSection() {
  const history = useHistory();

  const handleHistory = () => {
    history.push("/viajes");
  }

  return (
    <div className='hero-container'>
      {/*<video src='/videos/video-2.mp4' autoPlay loop muted />*/}
      <h1>TU VIAJE TE ESPERA</h1>
      <p>¿Qué estás esperando?</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={handleHistory}
        >
          BUSCAR VIAJE
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          /*onClick={console.log('hey')}*/
        >
            SOBRE CARPOOLING  <i className='fa fa-info-circle' />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
 