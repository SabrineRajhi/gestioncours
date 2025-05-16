import React from 'react';
import { FaLinkedin, FaFacebook } from 'react-icons/fa';

import './Accueil.css';

function Accueil() {
  return (
  

      <div className="social-icons">
        <a
          href="https://www.linkedin.com/company/datadoit"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label="Notre LinkedIn"
        >
          <FaLinkedin size={28} />
        </a>
        
        <a
          href="https://www.facebook.com/datadoit"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label="Notre Facebook"
        >
          <FaFacebook size={28} />
        </a>
      </div>
   
  );
}

export default Accueil;