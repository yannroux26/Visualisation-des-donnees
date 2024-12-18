import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import './Graph.css'; // Assurez-vous d'ajouter le CSS

const Graph = () => {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [data, setData] = useState([]);
    const graphRef = useRef();
    const csvPath = "/data/regularite-mensuelle-ter-by-region-and-year.csv";
  
    useEffect(() => {
      d3.csv(csvPath).then((data) => {
        const uniqueRegions = Array.from(new Set(data.map((d) => d.Region)));
        setRegions(uniqueRegions);
        setSelectedRegion(uniqueRegions[0]);
        setData(data);
      });
    }, []);
  
    useEffect(() => {
      if (selectedRegion && data.length > 0) {
        const filteredData = data
          .filter((d) => d.Region === selectedRegion)
          .map((d) => ({
            year: +d.Year,
            annulments: +d["Nombre de trains annulés"],
            delays: +d["Nombre de trains en retard à l'arrivée"],
          }));
  
        const groupedData = d3
          .rollups(
            filteredData,
            (v) => ({
              annulments: d3.sum(v, (d) => d.annulments),
              delays: d3.sum(v, (d) => d.delays),
            }),
            (d) => d.year
          )
          .map(([year, values]) => ({
            year,
            annulments: values.annulments,
            delays: values.delays,
          }))
          .sort((a, b) => a.year - b.year);
  
        createLineChart(groupedData, graphRef.current);
      }
    }, [selectedRegion, data]);
  
    const createLineChart = (data, element) => {
      const margin = { top: 20, right: 30, bottom: 50, left: 60 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;
  
      d3.select(element).select("svg").remove();
  
      const svg = d3
        .select(element)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      const x = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.year))
        .range([0, width]);
  
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => Math.max(d.annulments, d.delays))])
        .nice()
        .range([height, 0]);
  
      svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
      svg.append("g").call(d3.axisLeft(y));
  
      const lineAnnulments = d3.line().x((d) => x(d.year)).y((d) => y(d.annulments));
      svg.append("path").datum(data).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 2).attr("d", lineAnnulments);
  
      const lineDelays = d3.line().x((d) => x(d.year)).y((d) => y(d.delays));
      svg.append("path").datum(data).attr("fill", "none").attr("stroke", "orange").attr("stroke-width", 2).attr("d", lineDelays);
  
      svg.append("text").attr("x", width - 100).attr("y", height + 40).attr("text-anchor", "end").text("Années");
      svg.append("text").attr("x", -height / 2).attr("y", -40).attr("transform", "rotate(-90)").attr("text-anchor", "middle").text("Nombre de trains");
    };
  
    return (
      <div class="graph-div">
        <h1> </h1>
        <label htmlFor="region-select">Sélectionnez une région :</label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <div ref={graphRef}></div>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color blue"></div> Annulations
          </div>
          <div className="legend-item">
            <div className="legend-color orange"></div> Retards
          </div>
        </div>
      </div>
    );
  };
  
  export default Graph;
  