import React from "react";
import CarteAnnulationFrance from './CarteAnnulationFrance';
import CarteRetardFrance from './CarteRetardFrance';
import './TrainDataVisualization.css'; // Import the CSS file

const TrainDataVisualization = () => {
  return (
    <div>
    <div className="train-data-container">
      <CarteAnnulationFrance />
      <CarteRetardFrance />
      </div>
      <section id="analysis-section">
        
  <h2>Analyse des Retards et Annulations de Trains en France</h2>
  <p>
    Les données montrent des variations significatives entre les régions en matière de retards et d'annulations de trains. Par exemple, la région <strong>Île-de-France</strong> présente le plus grand nombre de trains annulés, avec 27 951 annulations enregistrées. Cela peut s'expliquer par une densité de trafic élevée et des perturbations fréquentes dans cette région fortement urbanisée.
  </p>
  <p>
    En revanche, la région <strong>Auvergne-Rhône-Alpes</strong>, bien que moins peuplée, enregistre tout de même un nombre significatif d'annulations (3 406) et de retards (14 328). Cela pourrait être lié à la topographie complexe de cette région, avec des liaisons ferroviaires traversant les Alpes.
  </p>
  <p>
    Une région comme la <strong>Nouvelle-Aquitaine</strong> montre des chiffres élevés pour les retards avec 87 376 trains retardés, bien que le taux de régularité reste relativement bon. Cela reflète peut-être des problèmes spécifiques à certaines lignes ou une infrastructure vieillissante nécessitant des améliorations.
  </p>
  <p>
    À l'opposé, des régions comme les <strong>Hauts-de-France</strong> présentent des chiffres plus modestes avec 5 058 annulations, mais un taux de retard (30 536) qui mérite une attention particulière. Une analyse approfondie pourrait aider à identifier les problèmes récurrents dans cette région.
  </p>
  <p>
    Ces données soulignent l'importance d'investir dans l'infrastructure ferroviaire et d'optimiser la gestion des flux pour améliorer la régularité et réduire les perturbations. Une meilleure coordination et des technologies innovantes peuvent aider à améliorer l'expérience des usagers dans les années à venir.
  </p>
</section>
</div>
  );
};

export default TrainDataVisualization;