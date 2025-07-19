import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';



function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const closeMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        Campus<span>Nav</span><sup>+</sup>
      </Link>

      <div className={`nav ${menuOpen ? 'active' : ''}`} onClick={closeMenu}>
        <Link to="/">Home</Link>
        <Link to="/cgpa">CGPA CalC</Link>
        <Link to="/groups">Groups</Link>
        <Link to="/about">About</Link>
       
      </div>

      <div className="ham-menu-box">
        <div
          className={`ham-menu ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
}

export default Header;
