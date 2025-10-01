// LostFoundPage.jsx
import React, { useState, useEffect } from 'react';
import LostFoundCard from './LostFoundCard';
import './LostFound.css';

const LostFoundPage = () => {
  const [items, setItems] = useState([]); 
  const [search, setSearch] = useState('');

  useEffect(() => {
    // fetch items from your database (Supabase, Firebase, etc.)
  }, []);

  return (
    <div className="lost-found-container">
      <h2>Lost & Found</h2>
      <div className="lost-found-actions">
        <input 
          type="text" 
          placeholder="Search items..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
        />
        <button className="post-btn">+ Post Lost Item</button>
        <button className="post-btn">📝 Post Found Item</button>
      </div>

      <div className="lost-found-grid">
        {items
          .filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
          .map(item => (
            <LostFoundCard key={item.id} item={item} />
          ))
        }
      </div>
    </div>
  );
};

export default LostFoundPage;
