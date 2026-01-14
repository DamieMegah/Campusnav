// src/App.jsx
import React from 'react';
import {Routes, Route } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import Footer from './components/Footer';
import CgpaPage from './pages/CgpaPage';
import About from './pages/About';
import HallSearch from './components/HallSearch';
import Alert from './components/Alert';
import Chat from './pages/Chat';
import './index.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './App.css';
import useAnalytics from "./hooks/useAnalytics";
import Layout from "./components/Layout";
import { StateProvider } from "./context/StateContext";

function App() {
  useAnalytics();
  const location = useLocation();

  // Make it lowercase to avoid case issues
  const showFooter = location.pathname.toLowerCase() !== "/chat";
  

  return (
    <StateProvider>
    
     
       <div className="App">
        <Alert />
         <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HallSearch />} />
              <Route path="/cgpa" element={<CgpaPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/chat" element={<Chat />} />  {/* note lowercase */}
              <Route path="/location/:coords" element={<HallSearch />} />
              <Route path="/hall/:hallCode" element={<HallSearch />} />
            </Route>
          </Routes>
       </div>
       {showFooter && <Footer />}
    </StateProvider>
  );
}

export default App;

