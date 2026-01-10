// src/components/GpaCalculator.jsx
import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import './Cgpa.css';

// ✅ Move this object outside to avoid re-creation on every render
const GRADE_POINTS = {
  Grade: null,
  A1: 4.00,
  A2: 3.50,
  B1: 3.25,
  B2: 3.00,
  C1: 2.75,
  C2: 2.50,
  D1: 2.25,
  D2: 2.00,
  F: 0.00,
};

const GpaCalculator = () => {
  // ✅ Pull your global state
  const { cgpaInputs, setCgpaInputs } = useAppState();

  // ✅ Instead of local state, use context (persist across pages)
  const [gpa, setGpa] = useState(null);

  // ✅ Initialize courses from context, fallback to one row if empty
  const courses = cgpaInputs.courses || [{ unit: '', grade: 'Grade' }];

  const setCourses = (newCourses) => {
    setCgpaInputs({ ...cgpaInputs, courses: newCourses });
  };

  const addCourse = () => {
    setCourses([...courses, { unit: '', grade: 'Grade' }]);
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

      if (gradePoint === null) {
        alert('Please select a grade for all courses.');
        return;
      }

      totalPoints += unit * gradePoint;
      totalUnits += unit;
    }

    const result = totalPoints / totalUnits;
    setGpa(result.toFixed(2));
  };

  return (
    <div className="gpa">
      <h2>🧮 GPA Calculator</h2>
      <small>
        Track your performance and analyze how much work is required in the current semester.
      </small>

      {courses.map((course, index) => (
        <div key={index}>
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
        <button onClick={addCourse}>➕ Add Another Course</button>
        <button onClick={calculateGpa}>
          <i className="fas fa-brain"></i> Calculate GPA
        </button>
      </div>

      {gpa && (
        <p>
          ✅ Your GPA for this semester will be: <span>{gpa}</span>
        </p>
      )}
    </div>
  );
};

export default GpaCalculator;
