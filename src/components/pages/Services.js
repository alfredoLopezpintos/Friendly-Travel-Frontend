import React from 'react';
import CardItem2 from '../CardItem2';
import TextItem from '../TextItem';
import Footer2 from '../Footer2';
import '../Text.css';

function Services() {
  return (
    <>
    <div className='text'>
      <div className='text__container'>
        <div className='text__wrapper'>
          <h1>¿Quienes somos?</h1>
          <br></br>
          <hr></hr>
          <br></br><br></br><br></br>
          <ul className='text__items'>
            <ul>
              
            <CardItem2
              src={require("../../assets/images/diego.png")}
            />
            <TextItem
                text=' &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp;Diego Rosales &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'
                
              />
            </ul>
            <ul>
            <CardItem2
              src={require("../../assets/images/rodrigo.png")}
            />
            <TextItem
                text=' &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Rodrigo Serrón &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'
              />
            </ul>
            <ul>
            <CardItem2
              src={require("../../assets/images/alfredo.png")}
            />
            <TextItem
                text=' &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Alfredo López Píntos  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'
              />
            </ul>
          </ul>
          
          <br></br><br></br><br></br><br></br>
          
          <ul className='text__items'>
          <hr></hr>
            <TextItem
              text='Como estudiantes del último semestre de la universidad tecnológica del Uruguay (UTEC) y materializando el proyecto final de titulación, 
              es que detectamos esta necesidad. La cual responde a la posibilidad de traslado desde cada punto del territorio nacional hacia los centros de UTEC 
              en las jornadas presenciales y evidenciando la escasa conectividad y frecuencia que los transportes convencionales ofrecen en este sentido.'
            />  
            <img src={require("../../assets/images/utec.jpg")} alt="utec" width={500}></img>   
          </ul>
        </div>
      </div>
      <br></br>
      <h1>¿Por qué elegimos Friendly Travel?</h1>
     
      <br></br>
      <div className='text__container'>
        <div className='text__wrapper'>
          <ul className='text__items'>
            
            <CardItem2
              src={require("../../assets/images/code.jpg")}
            />
            
            <TextItem
              text='En la busqueda de un proyecto que nos fuera de interés para llevarlo adelante como proyecto de titulación, comenzamos a pensar en varias alternativas.
               Fué así que llegamos a Friendly Travel, habiendo vivido todos los integrantes del equipo esta problemática durante toda la carrera, se nos ocurrió una solución como alternativa a este problema y ayudar a otros.  '
            />
           
          </ul>
          <br></br><br></br>
          <hr></hr>
          <ul className='cards__items'>
          <hr></hr>
              <TextItem
                text='En adición a la solución en movilidad, Friendly Travel nos terminó de convencer por muchos otros motivos. Entre los más importantes están por supuesto el transporte a un mucho menor costo, la construcción de una comunidad de usuarios que compartan esta problemática, la disminución de la huella de carbono, la contribución a la agilización del transito en grandes cuidades, entre otras...'
              />
            <CardItem2
              src={require("../../assets/images/idea.jpg")}
            />
          </ul>
        </div>
      </div>
    </div>
    <Footer2 />
    </>
  );
}

export default Services;
