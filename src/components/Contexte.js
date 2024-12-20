// src/pages/Contexte.js
import React from 'react';
import './Contexte.css';

const Contexte = () => {
  return (
    <div className="contexte-container">
      <h2>Contexte de l'analyse des retards de train en France</h2>
      <p>
        Bienvenue dans notre projet d'analyse des retards de train en France. 
        Nous avons choisi d'explorer les données des retards et des annulations par région, 
        en offrant des visualisations dynamiques et informatives.
      </p>
      <p>
        Nous commencerons par deux cartes de la France qui illustrent les retards des trains 
        et leurs annulations par région. Ensuite, nous vous proposerons un graphique circulaire 
        représentant les pourcentages de retards, d'annulations et de trains à l'heure pour 
        chaque région. Enfin, nous analyserons l'évolution du taux de régularité au fil des années 
        depuis 2013 pour chaque région.
      </p>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Visualisation</th>
              <th>Type de Variable Visuelle</th>
              <th>Ordonnée</th>
              <th>Associative</th>
              <th>Sélective</th>
              <th>Quantitative</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Retards des trains</td>
              <td>Position</td>
              <td>x</td>
              <td>x</td>
              <td>x</td>
              <td>x</td>
            </tr>
            <tr>
              <td>Annulations de trains</td>
              <td>Taille</td>
              <td>x</td>
              <td>x</td>
              <td>x</td>
              <td>x</td>
            </tr>
            <tr>
              <td>Pourcentages de retards</td>
              <td>Couleur (teinte)</td>
              <td>x</td>
              <td>x</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Pourcentages d'annulations</td>
              <td>Couleur (teinte)</td>
              <td>x</td>
              <td>x</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Taux de régularité</td>
              <td>Taille</td>
              <td>x</td>
              <td>x</td>
              <td>x</td>
              <td>x</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contexte;
