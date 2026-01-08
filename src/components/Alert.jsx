import React, { useState } from 'react';
import './Alert.css';
import alertIcon from '../assets/alert-image.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function Alert() {
  const [checked, setChecked] = useState(false);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (checked) {
      setVisible(false);
      document.querySelector('.checker').classList.remove('highlight');
      
    } else {
      alert("Please read and accept the disclaimer before proceeding.");
      document.querySelector('.checker').classList.add('highlight'); // Highlight the checkbox if not checked
    }
  };

  if (!visible) return null;

  return (
    <div className="alert-container" role="alert">
      <div className="alert-content">
        <h2 className="alert-title">
          IMPORTANT DISCLAIMER!!! </h2>
          <img src={alertIcon} alt="Important Alert Icon" className="alert-icon" />
        <p className="alert-message">
        CampusNav will never ask you to make any payment on this website or through any external link/domain provided here.
All payments must only be made directly on the official school website or through a verified agent authorized by the institution. <br />

          <strong>NOTE:</strong> This alert is to ensure your safety and prevent any fraudulent activities.
        </p>

        <label className="alert-checkbox">
          <input
            type="checkbox" className="checker"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          &nbsp; I have read and understood the disclaimer
        </label>

       <a 
  href="https://damiemegah.github.io/damiemegah_privacy-policy/" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="alert-link"
>
  Read Privacy & Policy
</a>

        <button className="alert-close" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default Alert;
// Note: The above code is a React component that displays an alert with a disclaimer.
// It includes a checkbox for users to acknowledge the disclaimer and a button to continue.
// The alert can be dismissed by checking the box and clicking "Continue".
// The component uses state to manage visibility and checkbox status.   