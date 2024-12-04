// src/pages/Home.js
import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <h2 className="welcome-text">Bienvenue sur l'analyse des retards de trains</h2>
            <p className="description">
                Explorez les données et visualisez les retards de trains en France avec des graphiques et des cartes interactives.
            </p>
            <div className="animation-container">
                <div className="train-animation">🚂</div>
            </div>
        </div>
    );
};

export default Home;
