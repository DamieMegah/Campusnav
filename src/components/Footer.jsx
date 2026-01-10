import React from 'react';
import './Footer.css';

function Footer() {
    return(
    <div className="footer-container">
        <small className="copy" /*onClick={ () => window.location.href = 'about me'*/ >&copy; 2025 DamieMegah </small>
       <a 
  href="https://damiemegah.github.io/damiemegah_privacy-policy/" 
  target="_blank" 
  rel="noopener noreferrer" 
 className="copy"
>
   Privacy & Policy
</a>
     </div>
    )
}

export  default Footer;