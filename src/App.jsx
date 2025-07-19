// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CgpaPage from './pages/CgpaPage';
import About from './pages/About';
import HallSearch from './components/HallSearch';
import HallPage from './pages/HallPage';
import Alert from './components/Alert';
import './index.css';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <div className="App">
         <Alert />
        <Routes>
          <Route path="/" element={<HallSearch />} /> {/* Home/Search page */}
          <Route path="/cgpa" element={<CgpaPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/hall/:code" element={<HallPage />} /> {/* Dynamic hall map */}
        </Routes>
      </div>
    </>
  );
}

export default App;
