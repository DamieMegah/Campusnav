// src/components/CgpaPredictor.jsx
import React, { useState } from 'react';
import './Cgpa.css';


const CgpaPredictor = () => {
  const [lastCgpa, setLastCgpa] = useState('');
  const [semestersLeft, setSemestersLeft] = useState('');
  const [targetCgpa, setTargetCgpa] = useState('4.5');
  const [requiredGpa, setRequiredGpa] = useState(null);

  const calculateRequiredGpa = () => {
    const current = parseFloat(lastCgpa);
    const target = parseFloat(targetCgpa);
    const sems = parseInt(semestersLeft);

    if (isNaN(current) || isNaN(target) || isNaN(sems) || sems <= 0) {
      alert('Please enter valid numbers');
      return;
    }

    const totalSemesters = sems + 1; // include current
    const required = ((target * totalSemesters) - (current)) / sems;

    setRequiredGpa(required.toFixed(2));
  };

  return (
    <div>
      <h2 className="">🎯 Predict Target CGPA</h2>
      <div className="cgpa">
        <div className='line'>
          <label className="label">Last CGPA</label>
          <input
            type="number"
            value={lastCgpa}
            onChange={(e) => setLastCgpa(e.target.value)}
            className="w-full p-2 border rounded"
            step="0.01"
          />
        </div >
        <div className='line'>
          <label className="label">Semesters Left</label>
          <input
            type="number"
            value={semestersLeft}
            onChange={(e) => setSemestersLeft(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className='line'>
          <label className="label">Target CGPA</label>
          <select
            value={targetCgpa}
            onChange={(e) => setTargetCgpa(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="4.5">First Class (≥ 4.5)</option>
            <option value="3.5">Second Class Upper (≥ 3.5)</option>
            <option value="2.5">Second Class Lower (≥ 2.5)</option>
            <option value="1.5">Third Class (≥ 1.5)</option>
            <option value="5.0">Custom (5.0)</option>
          </select>
        </div>

        <button
          onClick={calculateRequiredGpa}
          className="predict"
        >
          🧠 Predict
        </button>

        {requiredGpa && (
          <p >
            You need to average <span className="text-black">{requiredGpa}</span> GPA in your next {semestersLeft} semesters to reach a CGPA of {targetCgpa}.
          </p>
        )}
      </div>
    </div>
  );
};

export default CgpaPredictor;
