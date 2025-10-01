// src/pages/CgpaPage.jsx
import React, { useState } from 'react';
import CgpaPredictor from '../components/CgpaPredictor';
import GpaCalculator from '../components/GpaCalculator';
import CgpaCalculator from '../components/CgpaCalculator';
import GradingSystem from '../components/GradingSystem';
import { useAppState } from '../context/StateContext';

import  './Cgpa.css';

const CgpaPage = () => {
 const { activeCgpaComponent, setActiveCgpaComponent } = useAppState();

  return (
    <div className="cgpa-container">
      <h1> CGPA Tools<i className="fas fa-cogs"></i></h1>

      <div className="inner">
        <button
          className="btn-1"
          onClick={() => setActiveCgpaComponent('predictor')}
        >
          <i className="fas fa-bullseye"></i> CGPA Predictor
        </button>
        <button
          className="btn-2"
          onClick={() => setActiveCgpaComponent('gpa')}
        >
          <i className="fas fa-calculator"></i> GPA Calculator
        </button>
        <button
          className="btn-3"
          onClick={() => setActiveCgpaComponent('cgpa')}
        >
          <i className="fas fa-bar-chart"></i> CGPA Calculator
        </button>
      </div>

      <div className="box">
        {activeCgpaComponent === 'predictor' && <CgpaPredictor />}
        {activeCgpaComponent === 'gpa' && <GpaCalculator />}
        {activeCgpaComponent === 'cgpa' && <CgpaCalculator />}
      </div>
      <div className="grading-system-container">
        <GradingSystem  />
      </div>
    </div>
  );
};

export default CgpaPage;
