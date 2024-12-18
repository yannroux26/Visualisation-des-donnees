// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Contexte from './components/Contexte';
import TrainDataVisualization from './components/TrainDataVisualization';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/context" element={<Contexte />} />
                <Route path="/map" element={<TrainDataVisualization/>}/>
            </Routes>
        </Router>
    );
};

export default App;
