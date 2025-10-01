import React from "react";
import "./GradingSystem.css"; // optional for styling

const GradingSystem = () => {
  return (
    <details className="grading-system">
      <summary className="grading-summary">Grading System</summary>

      {/* First Table */}
      <div className="container">
      <div className="table-wrapper">
        <table className="grading-table">
          <thead>
            <tr>
              <th>Grade</th>
              <th>Score (%)</th>
              <th>Grade Point</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A1</td>
              <td>75 - 100</td>
              <td>4.00</td>
            </tr>
            <tr>
              <td>A2</td>
              <td>70 - 74</td>
              <td>3.50</td>
            </tr>
            <tr>
              <td>B1</td>
              <td>65 - 69</td>
              <td>3.25</td>
            </tr>
            <tr>
              <td>B2</td>
              <td>60 - 64</td>
              <td>3.00</td>
            </tr>
            <tr>
              <td>C1</td>
              <td>55 - 59</td>
              <td>2.75</td>
            </tr>
            <tr>
              <td>C2</td>
              <td>50 - 54</td>
              <td>2.50</td>
            </tr>
            <tr>
              <td>D1</td>
              <td>45 - 49</td>
              <td>2.25</td>
            </tr>
            <tr style={{background:"#e9d811", color:"white"}}>
              <td>D2</td>
              <td>40 - 44</td>
              <td>2.00</td>
            </tr>
            <tr style={{background:"red", color:"white"}}>
              <td>F</td>
              <td>0 - 39</td>
              <td>0.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Second Table */}
      <div className="table-wrapper">
        <table className="grading-table">
          <thead>
            <tr>
              <th>CGPA Range</th>
              <th>Class of Degree</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3.50 – 4.00</td>
              <td>Distinction</td>
            </tr>
            <tr>
              <td>3.00 – 3.49</td>
              <td>Upper Credit</td>
            </tr>
            <tr>
              <td>2.50 – 2.99</td>
              <td>Lower Credit</td>
            </tr>
            <tr style={{background:"#e9d811", color:"white"}}>
              <td>2.00 – 2.49</td>
              <td>Pass</td>
            </tr>
            <tr style={{background:"red", color:"white"}}> 
              <td>0.00 – 1.99</td>
              <td>Fail</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    </details>
  );
};

export default GradingSystem;
