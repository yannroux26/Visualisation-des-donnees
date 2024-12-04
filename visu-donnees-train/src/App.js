import React from "react";
import Header from "./components/Header";
import CarteAnnulationFrance from "./components/CarteAnnulationFrance";
import CarteRetardFrance from "./components/CarteRetardFrance";
import PieChart from "./components/PieChart";
import "./App.css";
import Home from './components/Home';
import Contexte from './components/Contexte';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {
  return (
      <Router>
          <Header />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/context" element={<Contexte />} />
              <Route path="/map" element={<div className="image-container">
        <CarteAnnulationFrance />
        <CarteRetardFrance />
      </div>}/>
          </Routes>
      </Router>
  );
};
export default App;
