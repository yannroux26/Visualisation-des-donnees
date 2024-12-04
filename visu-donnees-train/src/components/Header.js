import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Train Delay Visualizer</h1>
        <p className="header-subtitle">Explore train delays across France, Belgium, and Poland</p>
      </div>
    </header>
  );
}

export default Header;
