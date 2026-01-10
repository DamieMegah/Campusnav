import React, { useState } from "react";
import "./TopMarquee.css";

export default function TopMarquee() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const text = [
    "⚠️ Do NOT share sensitive information or your home address in chat.  ",
    "No spamming ",
    "Avoid sharing financial details or passwords.  ",
   
    "Be cautious of phishing attempts and suspicious links.  ",
    "Foul language and hate speech are  strictly prohibited.  ",
   
    " Keep conversations professional and related to CampusNav+ services only...",
  ].join("   ---•---   ");

  return (
    <div className="marquee-wrap" role="status" aria-live="polite" aria-atomic="true">
      <div className="marquee-inner" title="Warning - click to pause by hovering">
        <div className="marquee-track">
          <span className="marquee-text">{text}</span>
          <span className="marquee-text marquee-duplicate">{text}</span>
        </div>
      </div>

      <button
        className="marquee-close"
        aria-label="Dismiss warning"
        onClick={() => setVisible(false)}
      >
        ✕
      </button>
    </div>
  );
}
