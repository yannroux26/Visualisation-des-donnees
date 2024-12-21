import React from "react";
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <h1>🚄 Analyse des Retards</h1>
                <p className="tagline">Explorez les données ferroviaires comme jamais auparavant</p>
            </div>
            <nav className="nav">
                <ul>
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/context">Contexte</Link></li>
                    <li><Link to="/map">Carte</Link></li> 
                    <li><Link to="/pie">Camembert</Link></li>
                    <li><Link to="/graph">Graphe</Link></li>
                    <li><Link to="/source">Sources</Link></li>

                </ul>
            </nav>
        </header>
    );
};

export default Header;
