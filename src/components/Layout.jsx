import React from "react";
import { Outlet } from "react-router-dom";
import Header from './Header';
export default function Layout() {
  return (
    <div className="app-layout">
       <Header />
      <Outlet /> {/* child routes render here but layout persists */}
    </div>
  );
}
