// src/components/GpaCalculator.jsx
import React, { useState } from 'react';
import './Cgpa.css';

const GRADE_POINTS = {
  Grade:null,
  A: 4,
  B: 3.50,
  C: 2.50,
  D: 1.50,
  E: 1.00,
  F: 0,
};

const GpaCalculator = () => {
  const [courses, setCourses] = useState([{ unit: '', grade: 'Grade' }]);
  const [gpa, setGpa] = useState(null);

  const addCourse = () => {
    setCourses([...courses, { unit: '', grade: 'A' }]);
  };

  const updateCourse = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  const calculateGpa = () => {
    let totalPoints = 0;
    let totalUnits = 0;

    for (let course of courses) {
      const unit = parseFloat(course.unit);
      const gradePoint = GRADE_POINTS[course.grade];

      if (isNaN(unit) || unit <= 0) {
        alert('Please enter valid unit values for all courses.');
        return;
      }

      
      if (gradePoint <= 0) {
        alert('Please enter a grade value');
        return;
      }


      totalPoints += unit * gradePoint;
      totalUnits += unit;
    }

    const result = totalPoints / totalUnits;
    setGpa(result.toFixed(2));
  };

  return (
    <div className=" gpa">
      <h2>🧮 GPA Calculator</h2>

      {courses.map((course, index) => (
        <div key={index} >
          <input
            type="number"
            placeholder="Course Unit"
            value={course.unit}
            onChange={(e) => updateCourse(index, 'unit', e.target.value)}
          
          />
          <select
            value={course.grade}
            onChange={(e) => updateCourse(index, 'grade', e.target.value)}
           placeholder="Your Grade"
          >
            {Object.keys(GRADE_POINTS).map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div>
        <button
          onClick={addCourse}
         
        >
          ➕ Add Course
        </button>
        <button
          onClick={calculateGpa}>
          🧠 Calculate GPA
        </button>
      </div>

      {gpa && (
        <p>
          ✅ Your GPA for this semester is: <span>{gpa}</span>
        </p>
      )}
    </div>
  );
};

export default GpaCalculator;
