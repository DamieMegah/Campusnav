
import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import './Cgpa.css';

const CgpaCalculator = () => {
 const { cgpaInputs, setCgpaInputs } = useAppState();

  // initialize from context if available
  const [semesters, setSemesters] = useState(
    cgpaInputs.semesters || [{ gpa: '', units: '' }]
  );
  const [cgpa, setCgpa] = useState(cgpaInputs.cgpa || null)

   useEffect(() => {
    setCgpaInputs({
      ...cgpaInputs,
      semesters,
      cgpa
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesters, cgpa]); 

  const addSemester = () => {
    setSemesters([...semesters, { gpa: '', units: '' }]);
  };

  const updateSemester = (index, field, value) => {
    const updated = [...semesters];
    updated[index][field] = value;
    setSemesters(updated);
  };

  const calculateCgpa = () => {
    let totalQualityPoints = 0;
    let totalUnits = 0;

    for (let sem of semesters) {
      const gpa = parseFloat(sem.gpa);
      const units = parseFloat(sem.units);

      if (isNaN(gpa) || isNaN(units) || gpa < 0.00 || gpa > 4.00 || units <= 0) {
        alert('Enter valid GPA (0.00-4.00) and unit values for all semesters.');
        return;
      }

      totalQualityPoints += gpa * units;
      totalUnits += units;
    }

    const result = totalQualityPoints / totalUnits;
    setCgpa(result.toFixed(2));
  };

  return (
    <div>
      <h2 className="cgpa container">📊 CGPA Calculator</h2>
      <small>Get insight on how to achive your target grade, get started </small>

      {semesters.map((sem, index) => (
        <div key={index} className="inner">
          <input
            type="number"
            placeholder="GPA"
            value={sem.gpa}
            onChange={(e) => updateSemester(index, 'gpa', e.target.value)}
            className="p-2 border rounded w-24"
            step="0.01"
            min="0"
            max="5"
          />
          <input
            type="number"
            placeholder="Total Units"
            value={sem.units}
            onChange={(e) => updateSemester(index, 'units', e.target.value)}
            className="p-2 border rounded w-32"
          />
        </div>
      ))}

      <div>
        <button
          onClick={addSemester}
          
        >
          ➕ Add Semester
        </button>
        <button
          onClick={calculateCgpa}

        >
         <i className="fas fa-brain"></i> Calculate Total CGPA
        </button>
      </div>

      {cgpa && (
        <p className="mt-6 text-purple-700 font-semibold">
          ✅ Your CGPA is: <span className="text-black">{cgpa}</span>
        </p>
      )}
    </div>
  );
};

export default CgpaCalculator;
