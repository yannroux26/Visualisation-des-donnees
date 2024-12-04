import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const TrainDataMap = () => {
  const mapRef = useRef(null);
  const csvFilePath = "/data/regularite-mensuelle-ter.csv";
  const geoJsonFilePath = "/data/france-regions.json";

  useEffect(() => {
    const parseCommaCSV = d3.dsvFormat(",");

    Promise.all([
      d3.text(csvFilePath).then((data) => parseCommaCSV.parse(data)),
      d3.json(geoJsonFilePath),
    ])
      .then(([csvData, geoData]) => {
        // Traiter les données CSV
        const trainData = csvData.map((d) => ({
          region: d["Region"].trim(),
          nbTrainsAnnules: +d["NbTrainsannulés"] || 0,
        }));

        // Créer un dictionnaire des valeurs par région
        const dataByRegion = {};
        trainData.forEach((d) => {
          dataByRegion[d.region] = d.nbTrainsAnnules;
        });

        // Dimensions de la carte
        const width = 800;
        const height = 600;

        // Projections et chemin
        const projection = d3
          .geoMercator()
          .center([2.5, 46.5]) // Centrage pour la France
          .scale(2400)
          .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        // Palette de couleurs
        const colorScale = d3
          .scaleSequential()
          .domain([0, d3.max(trainData, (d) => d.nbTrainsAnnules)])
          .interpolator(d3.interpolateBlues);

        // Supprimer les anciens éléments
        d3.select(mapRef.current).selectAll("*").remove();

        // Créer le conteneur SVG
        const svg = d3
          .select(mapRef.current)
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .style("background-color", "#f9f9f9");

        // Ajouter les régions
        svg
          .append("g")
          .selectAll("path")
          .data(geoData.features)
          .join("path")
          .attr("d", path)
          .attr("fill", (d) => {
            const regionName = d.properties.nom.trim(); // Nom de la région
            return dataByRegion[regionName]
              ? colorScale(dataByRegion[regionName])
              : "#ccc"; // Gris si aucune donnée
          })
          .attr("stroke", "#000")
          .attr("stroke-width", 0.5)
          .on("mouseover", (event, d) => {
            const regionName = d.properties.nom;
            const value = dataByRegion[regionName] || "Données non disponibles";
            tooltip
              .style("visibility", "visible")
              .html(
                `<strong>Région:</strong> ${regionName}<br>
                 <strong>Trains annulés:</strong> ${value}`
              );
          })
          .on("mousemove", (event) => {
            tooltip
              .style("top", `${event.pageY - 170}px`)
              .style("left", `${event.pageX + 10}px`);
          })
          .on("mouseout", () => tooltip.style("visibility", "hidden"));

        // Ajouter un tooltip
        const tooltip = d3
          .select(mapRef.current)
          .append("div")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.7)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("visibility", "hidden")
          .style("font-size", "12px");

        // Ajouter une légende
        const legendWidth = 300;
        const legendHeight = 10;

        const legend = svg
          .append("g")
          .attr("transform", `translate(${width - legendWidth - 50},${height - 50})`);

        const legendScale = d3
          .scaleLinear()
          .domain(colorScale.domain())
          .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale).ticks(5);

        legend
          .append("g")
          .selectAll("rect")
          .data(d3.range(legendWidth))
          .join("rect")
          .attr("x", (d) => d)
          .attr("y", 0)
          .attr("width", 1)
          .attr("height", legendHeight)
          .attr("fill", (d) => colorScale(legendScale.invert(d)));

        legend
          .append("g")
          .attr("transform", `translate(0,${legendHeight})`)
          .call(legendAxis)
          .select(".domain")
          .remove();
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des fichiers:", error);
      });
  }, []);

  return <div ref={mapRef} style={{ position: "relative" }}></div>;
};

export default TrainDataMap;
