import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import LiveChat from "../components/LiveChat";

export default function App() {
  

  useEffect(() => {
    // test Supabase connection
    const testConnection = async () => {
      const { data, error } = await supabase
        .from("messages")   // or any table you created
        .select("*");
      if (error) {
        console.error("Supabase connection error:", error);
        alert("Check if your device has a stable internet connection");
      } else {
        console.log("Supabase connection success: Live Chat", data);
      }
    };

    testConnection();
  }, []);

 

  return (
    <div style={{ textAlign: "center" }}>
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "5rem",
          justifyContent: "center",
          gap: "8px",
        }}
      >PINS
        <i className="fas fa-comment-dots" style={{ color: "#4a90e2" }}></i>
      
      </h2>
      <LiveChat /> {/* Your chat component shows here */}
    </div>
  );
}
