import React from 'react';
import './Hamburger.css';

function Hamburger() {
    return (
        <div>

            <div className="hidden-menu">
             <ul>
                 <li>home</li>
                 <li>about</li>
                 <li>contact</li>
              </ul>
            </div>

          <nav>
            <div className="ham-menu" onClick={(e) => {
                e.stopPropagation();
                document.querySelector('.hidden-menu').classList.toggle('active');
                document.querySelector('.ham-menu').classList.toggle('active');
            }}>
                <span ></span>
                <span ></span>
                <span ></span>
            </div>
           </nav>
        </div>
    )
}

export default Hamburger;