import React from "react";
import Header from "./components/Header";
import CarteAnnulationFrance from "./components/CarteAnnulationFrance";
import CarteRetardFrance from "./components/CarteRetardFrance";
import PieChart from "./components/PieChart";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="image-container">
        <CarteAnnulationFrance />
        <CarteRetardFrance />
      </div>
      {/* <PieChart /> */}
      </div>
  );
}
export default App;
