// src/components/CgpaPredictor.jsx
import React, { useState, useEffect  } from 'react';
import { useAppState } from '../context/StateContext';
import './Cgpa.css';


const CgpaPredictor = () => {
  const { cgpaInputs, setCgpaInputs } = useAppState();

  // initialize local state from context
  const [lastCgpa, setLastCgpa] = useState(cgpaInputs.lastCgpa || '');
  const [semestersLeft, setSemestersLeft] = useState(cgpaInputs.semestersLeft || '');
  const [targetCgpa, setTargetCgpa] = useState(cgpaInputs.targetCgpa || '4.5');
  const [requiredGpa, setRequiredGpa] = useState(null);

  // save to context whenever inputs change
  useEffect(() => {
    setCgpaInputs({
      ...cgpaInputs,
      lastCgpa,
      semestersLeft,
      targetCgpa
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastCgpa, semestersLeft, targetCgpa]);

  // (optional) restore requiredGpa if you saved it in context as well
  // useEffect(() => {
  //   if (cgpaInputs.requiredGpa) setRequiredGpa(cgpaInputs.requiredGpa);
  // }, []);

  const calculateRequiredGpa = () => {
    const current = parseFloat(lastCgpa);
    const target = parseFloat(targetCgpa);
    const sems = parseInt(semestersLeft);

    if (isNaN(current) || isNaN(target) || isNaN(sems) || sems <= 0) {
      alert('Please enter valid numbers');
      return;
    }

    const totalSemesters = sems + 1; // include current
    const required = ((target * totalSemesters) - current) / sems;

    setRequiredGpa(required.toFixed(2));
    // if you also want to persist requiredGpa:
     setCgpaInputs(prev => ({ ...prev, requiredGpa: required.toFixed(2) }));
  };
  return (
    <div>
      <h2 className="">Calculate Possible CGPA</h2>
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
            <option value="4.00">Distinction/First Class (≥ 4.00)</option>
            <option value="3.50">Distinction (≥ 3.50)</option>
            <option value="3.00">Second Class Upper (≥ 3.00)</option>
            <option value="2.50">Second Class Lower(≥ 2.50)</option>
            <option value="2.00">Pass(≥ 2.00)</option>
            <option value="1.99">Fail(Less than 1.99)</option>
            <option value="5.0">Custom (0.00)</option>
          </select>
        </div>

        <button
          onClick={calculateRequiredGpa}
          className="predict"
        >
        <i className="fas fa-brain"></i> Predict
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
