// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Contexte from './components/Contexte';
import TrainDataMap from './components/TrainDataVisualization';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/context" element={<Contexte />} />
                <Route path="/map" element={<TrainDataMap/>}/>
            </Routes>
        </Router>
    );
};

export default App;
