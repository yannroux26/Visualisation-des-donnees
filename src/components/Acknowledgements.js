import React from "react";
import "./Acknowledgements.css";

const Acknowledgements = () => {
  return (
    <div className="acknowledgements-container">
      <h1 className="title">Project Acknowledgements</h1>

      <section className="sources">
        <h2>Sources de Dataset</h2>
        <ul>
          <li>
            <a href="https://www.data.gouv.fr/fr/datasets/regularite-mensuelle-ter-sncf/" target="_blank" rel="noopener noreferrer">
              Source 1: SNCF TER Dataset
            </a>
          </li>
          <li>
            <a href="https://www.data.gouv.fr/fr/datasets/regularite-mensuelle-intercites-sncf/" target="_blank" rel="noopener noreferrer">
              Source 2: SNCF TGV Dataset
            </a>
          </li>
        </ul>
      </section>

      <section className="contributors">
        <h2>Contributeurs</h2>
        <p>Ce projet a été réalisé par :</p>
        <ul>
          <li>Rana Rochdi</li>
          <li>Yann Roux</li>
        </ul>
      </section>

      <footer className="footer">
        <p>Merci d'avoir exploré notre projet !</p>
      </footer>
    </div>
  );
};

export default Acknowledgements;
