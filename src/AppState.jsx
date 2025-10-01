// src/AppState.jsx
import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  // persisted states
  const [activeTab, setActiveTab] = useState(() => {
    try { return localStorage.getItem("activeTab") || "general"; } catch { return "general"; }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("messages");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [scrollPositions, setScrollPositions] = useState({});

  // runtime-only - map instance, pending highlight
  const mapRef = useRef(null);
  const [pendingHighlight, setPendingHighlight] = useState(null);

  // persist
  useEffect(() => {
    try { localStorage.setItem("activeTab", activeTab); } catch {}
  }, [activeTab]);

  useEffect(() => {
    try { localStorage.setItem("messages", JSON.stringify(messages)); } catch {}
  }, [messages]);

  // messages helpers
  const addMessage = (msg) => {
    setMessages(prev => [...prev, { id: Date.now(), ...msg }]);
  };
  const clearMessages = () => setMessages([]);

  // map helpers
  const setMapInstance = (mapInstance) => {
    mapRef.current = mapInstance;
    // if there's a pending highlight, apply immediately
    if (pendingHighlight && mapInstance) {
      try {
        mapInstance.setView([pendingHighlight.lat, pendingHighlight.lng], pendingHighlight.zoom || 18);
        if (pendingHighlight.openPopupFn) pendingHighlight.openPopupFn();
      } catch (e) {
        console.warn("pan to pending highlight failed", e);
      }
      setPendingHighlight(null);
    }
  };

  // Try to pan immediately, otherwise queue for when map is ready
  const panOrQueue = ({ lat, lng, zoom = 18, openPopupFn = null }) => {
    if (mapRef.current) {
      try {
        mapRef.current.setView([lat, lng], zoom);
        if (openPopupFn) openPopupFn();
      } catch (e) {
        console.warn("map pan failed, queueing", e);
        setPendingHighlight({ lat, lng, zoom, openPopupFn });
      }
    } else {
      setPendingHighlight({ lat, lng, zoom, openPopupFn });
    }
  };

  return (
    <AppStateContext.Provider value={{
      activeTab, setActiveTab,
      scrollPositions, setScrollPositions,
      messages, addMessage, clearMessages,
      mapRef, setMapInstance, panOrQueue, pendingHighlight, setPendingHighlight
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
