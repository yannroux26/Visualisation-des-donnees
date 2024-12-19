import React from "react";
import CarteAnnulationFrance from './CarteAnnulationFrance';
import CarteRetardFrance from './CarteRetardFrance';
import './TrainDataVisualization.css'; // Import the CSS file

const TrainDataVisualization = () => {
  return (
    <div className="train-data-container">
      <CarteAnnulationFrance />
      <CarteRetardFrance />
    </div>
  );
};

export default TrainDataVisualization;