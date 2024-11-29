import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const TrainDataVisualization = () => {
  const chartRef = useRef(null);
  const csvFilePath = "/data/regularite-mensuelle-ter.csv"; // Correct path

  useEffect(() => {
    // Use d3.dsv to specify semicolon as delimiter
    const parseSemicolonCSV = d3.dsvFormat(";");
    
    d3.text(csvFilePath) // Use d3.text to fetch the CSV as text
      .then((data) => {
        const parsedData = parseSemicolonCSV.parse(data);
        
        const processedData = parsedData.map((d) => ({
          Date: d["Date"],
          Region: d["Region"],
          NombreDeTrainsProgrammés: +d["Nombre de trains programmés"] || 0,
          NombreDeTrainsAyantCirculé: +d["Nombre de trains ayant circulé"] || 0,
          NbTrainsAnnulés: +d["NbTrainsannulés"] || 0,
          NombreDeTrainsEnRetard: +d["Nombre de trains en retard à l'arrivée"] || 0,
          TauxDeRégularité: +d["Taux de régularité"] || 0,
          NbTrainsALHeure: +d["Nombre de trains à l'heure pour un train en retard à l'arrivée"] || 0,
          Commentaires: d["Commentaires"] || ""
        }));

        console.log("Données chargées:", processedData);

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };

        const x = d3
          .scaleBand()
          .domain(processedData.map((d) => d["Region"]))
          .range([margin.left, width - margin.right])
          .padding(0.1);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(processedData, (d) => d.NbTrainsAnnulés)])
          .nice()
          .range([height - margin.bottom, margin.top]);

        d3.select(chartRef.current).selectAll("*").remove();

        const svg = d3
          .select(chartRef.current)
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .style("background-color", "#f0f0f0");

        svg
          .append("g")
          .selectAll("rect")
          .data(processedData)
          .join("rect")
          .attr("x", (d) => x(d["Region"]))
          .attr("y", (d) => y(d.NbTrainsAnnulés))
          .attr("height", (d) => y(0) - y(d.NbTrainsAnnulés))
          .attr("width", x.bandwidth())
          .attr("fill", "steelblue");

        svg
          .append("g")
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

        svg
          .append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          .call((g) => g.select(".domain").remove());
      })
      .catch((error) => {
        console.error("Error loading the CSV file:", error);
      });
  }, []);

  return <div ref={chartRef}></div>;
};

export default TrainDataVisualization;
