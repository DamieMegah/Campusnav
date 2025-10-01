// LostFoundCard.jsx
import React from 'react';

const LostFoundCard = ({ item }) => {
  return (
    <div className="lost-found-card">
      <img src={item.imageUrl} alt={item.title} loading="lazy" />
      <h3>{item.title}</h3>
      <p>{item.type === 'lost' ? 'Lost at:' : 'Found at:'} {item.location}</p>
      <p>Date: {item.date}</p>
      <button>View Details</button>
    </div>
  );
};

export default LostFoundCard;
