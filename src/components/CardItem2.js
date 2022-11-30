import React from 'react';
import { Link } from 'react-router-dom';

function CardItem2(props) {
  return (
    <>
      <li className='text__item'>
        <div className='text__item__link' >
          <figure className='text__item__pic-wrap'>
            <img
              className='text__item__img'
              alt='Travel'
              src={props.src}
            />
          </figure>
        </div>
      </li>
    </>
  );
}

export default CardItem2;
