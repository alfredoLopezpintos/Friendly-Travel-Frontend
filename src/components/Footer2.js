import React from 'react';
import './Footer.css';
import { Button } from './Button';
import { Link } from 'react-router-dom';

function Footer2() {
  return (
    <div className='footer-container'>
        <div class='social-media-wrap'>
          <div class='footer-logo'>
            <Link to='/' className='social-logo'>
              FRIENDLY TRAVEL
              <i class='fab fa-typo3' />
            </Link>
          </div>
          <small class='website-rights'>FRIENDLY TRAVEL © 2022</small>
        </div>
    </div>
  );
}

export default Footer2;

