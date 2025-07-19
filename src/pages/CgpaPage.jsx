// src/pages/CgpaPage.jsx
import React, { useState } from 'react';
import CgpaPredictor from '../components/CgpaPredictor';
import GpaCalculator from '../components/GpaCalculator';
import CgpaCalculator from '../components/CgpaCalculator';
import Footer from '../components/Footer';
import  './Cgpa.css';

const CgpaPage = () => {
  const [activeComponent, setActiveComponent] = useState('predictor');

  return (
    <div className="cgpa-container">
      <h1>🎓 CGPA Tool Center</h1>

      <div className="inner">
        <button
          className="btn-1"
          onClick={() => setActiveComponent('predictor')}
        >
          🎯 CGPA Predictor
        </button>
        <button
          className="btn-2"
          onClick={() => setActiveComponent('gpa')}
        >
          🧮 GPA Calculator
        </button>
        <button
          className="btn-3"
          onClick={() => setActiveComponent('cgpa')}
        >
          📊 CGPA Calculator
        </button>
      </div>

      <div className="box">
        {activeComponent === 'predictor' && <CgpaPredictor />}
        {activeComponent === 'gpa' && <GpaCalculator />}
        {activeComponent === 'cgpa' && <CgpaCalculator />}
      </div>
       <Footer />
    </div>
  );
};

export default CgpaPage;
