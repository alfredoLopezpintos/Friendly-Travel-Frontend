import React from 'react';
import { Link } from 'react-router-dom';

function TextItem(props) {
  return (
    <>
      <li className='text__item'>
        <div className='text__item__link' >
          
          <div className='text__item__info'>
            <h5 className='text__item__text'>{props.text}</h5>
          </div>
        </div>
      </li>
    </>
  );
}

export default TextItem;
