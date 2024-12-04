import React from "react";
import "./Header.css";
// src/components/Header.js
import { Link } from 'react-router-dom';
import './Header.css'; // Assure-toi de créer un fichier CSS pour le style

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <h1>Analyse des Retards</h1>
            </div>
            <nav className="nav">
                <ul>
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/context">Contexte</Link></li>
                    <li><Link to="/map">Map</Link></li>

                </ul>
            </nav>
        </header>
    );
};

export default Header;
