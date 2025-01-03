// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Contexte from './components/Contexte';
import TrainDataVisualization from './components/TrainDataVisualization';
import PieChart from './components/PieChart';
import Graph from './components/Graph';
import Acknowledgements from './components/Acknowledgements';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/context" element={<Contexte />} />
                <Route path="/map" element={<TrainDataVisualization/>}/>
                <Route path="/pie" element={<PieChart/>}/>                
                <Route path="/graph" element={<Graph />}/>
                <Route path="/source" element={<Acknowledgements />}/>

            </Routes>
        </Router>
    );
};

export default App;
