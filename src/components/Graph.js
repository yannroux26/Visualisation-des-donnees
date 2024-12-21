import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import './Graph.css';

const Graph = () => {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [data, setData] = useState([]);
    const [analysis, setAnalysis] = useState("");
    const graphRef = useRef();
    const regularityGraphRef = useRef(); 
    const csvPath = "/data/regularite-mensuelle-ter-by-region-and-year.csv";

    useEffect(() => {
        d3.csv(csvPath).then((data) => {
            const uniqueRegions = Array.from(new Set(data.map((d) => d.Region)));
            console.log(uniqueRegions);
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
                    total: +d["Nombre de trains programmés"]
                }));

            const groupedData = Array.from(
                d3.group(filteredData, d => d.year),
                ([year, values]) => ({
                    year,
                    annulments: d3.sum(values, (d) => d.annulments),
                    delays: d3.sum(values, (d) => d.delays),
                    total: d3.sum(values, (d) => d.total),
                })
            ).sort((a, b) => a.year - b.year);

            createLineChart(groupedData, graphRef.current);
            createRegularityChart(groupedData, regularityGraphRef.current);
            generateAnalysis(groupedData); 
        }
    }, [selectedRegion, data]);

    const generateAnalysis = (groupedData) => {
        if (groupedData.length === 0) {
            setAnalysis("Aucune donnée disponible pour cette région.");
            return;
        }

        const firstYear = groupedData[0].year;
        const lastYear = groupedData[groupedData.length - 1].year;
        const totalAnnulments = d3.sum(groupedData, d => d.annulments);
        const totalDelays = d3.sum(groupedData, d => d.delays);
        const avgRegularity = d3.mean(groupedData, d => (d.delays / (d.delays + d.annulments)) * 100).toFixed(2);

        const trendAnnulments = groupedData[groupedData.length - 1].annulments - groupedData[0].annulments;
        const trendDelays = groupedData[groupedData.length - 1].delays - groupedData[0].delays;

        const analysisText = `
            Pour la région <b>${selectedRegion}</b>, entre <b>${firstYear}</b> et <b>${lastYear}</b> :
            <ul>
            <li>Le nombre total d'annulations est de <b>${totalAnnulments}</b>.</li>
            <li>Le nombre total de retards est de <b>${totalDelays}</b>.</li>
            <li>Le taux de régularité moyen est de <b>${avgRegularity}%</b>.</li>
            <li>La tendance des annulations est <b>${trendAnnulments >= 0 ? `en hausse de ${trendAnnulments}` : `en baisse de ${Math.abs(trendAnnulments)}`}</b> sur la période.</li>
            <li>La tendance des retards est <b>${trendDelays >= 0 ? `en hausse de ${trendDelays}` : `en baisse de ${Math.abs(trendDelays)}`}</b> sur la période.</li>
            </ul>
        `;
        setAnalysis(analysisText);
    };

    const createLineChart = (data, element) => {
        const margin = { top: 20, right: 30, bottom: 50, left: 60 };
        const width = 550 - margin.left - margin.right;
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
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", lineAnnulments);

        const lineDelays = d3.line().x((d) => x(d.year)).y((d) => y(d.delays));
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 2)
            .attr("d", lineDelays);
    };

    const createRegularityChart = (data, element) => {
        const margin = { top: 20, right: 30, bottom: 50, left: 60 };
        const width = 550 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        d3.select(element).select("svg").remove();

        const svg = d3
            .select(element)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const regularityData = data.map(d => ({
            year: d.year,
            regularity: (d.delays / (d.delays + d.annulments)) * 100 
        }));

        const x = d3
            .scaleLinear()
            .domain(d3.extent(regularityData, (d) => d.year))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
        const yAxis = d3.axisLeft(y);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.regularity));

        svg.append("path")
            .datum(regularityData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);
    };

    const handleRegionChange = (event) => {
        setSelectedRegion(event.target.value);
    };

    return (
        <>
        <div className="graph-container">
            <h1>Graphe de changement de données par rapport aux années</h1>
            <label htmlFor="region-select">Sélectionnez une région:</label>
            <select
                id="region-select"
                value={selectedRegion}
                onChange={handleRegionChange}
            >
                {regions.map((region) => (
                    <option key={region} value={region}>
                        {region}
                    </option>
                ))}
            </select>

            <div className="graph-row">
                <svg className="graph" ref={graphRef}></svg>
                <svg className="graph" ref={regularityGraphRef}></svg>
            </div>

            <div className="legend">
                <div className="legend-item">
                    <div className="legend-color blue"></div>
                    <span>Annulations</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color orange"></div>
                    <span>Retards</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color green"></div>
                    <span>Taux de régularité</span>
                </div>
            </div>

            
        </div>
        <div className="analysis-container">
                <h2 className="analysis-title">Analyse des données</h2>
                <div
                    className="analysis-text"
                    dangerouslySetInnerHTML={{ __html: analysis }}
                ></div>
            </div>
            </>
    );
};

export default Graph;
