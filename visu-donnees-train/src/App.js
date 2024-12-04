import React from "react";
import Header from "./components/Header";
import TrainDataVisualization from "./components/TrainDataVisualization";
import PieChart from "./components/PieChart";

function App() {
  return (
    <div className="app">
      <Header />
      <TrainDataVisualization />
      {/* <PieChart /> */}
      </div>
  );
}
export default App;
