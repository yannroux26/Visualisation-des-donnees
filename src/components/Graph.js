import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import './Graph.css';

const Graph = () => {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [data, setData] = useState([]);
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

            const groupedData = d3
                .rollups(
                    filteredData,
                    (v) => ({
                        annulments: d3.sum(v, (d) => d.annulments),
                        delays: d3.sum(v, (d) => d.delays),
                        total:  d3.sum(v, (d) => d.total),

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
            createRegularityChart(groupedData, regularityGraphRef.current); 
        }
    }, [selectedRegion, data]);

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

        addPoints(svg, data, x, y);
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
            .nice()
            .range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
        svg.append("g").call(d3.axisLeft(y).ticks(10).tickFormat(d3.format(".0f")));

        const lineRegularity = d3.line().x((d) => x(d.year)).y((d) => y(d.regularity));
        svg.append("path")
            .datum(regularityData)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 2)
            .attr("d", lineRegularity);

        svg.selectAll(".dot-regularity")
            .data(regularityData)
            .enter()
            .append("circle")
            .attr("class", "dot-regularity")
            .attr("cx", (d) => x(d.year))
            .attr("cy", (d) => y(d.regularity))
            .attr("r", 4)
            .attr("fill", "green")
            .on("mouseover", function(event, d) {
                tooltip.style("display", "block")
                    .html(`Régularité: ${d.regularity.toFixed(2)}%<br>Année: ${d.year}`);
            })
            .on("mousemove", function(event) {
                const mouse = d3.pointer(event);
                tooltip.style("left", `${mouse[0] + margin.left + 490}px`)
                    .style("top", `${mouse[1] + margin.top + 240}px`);
            })
            .on("mouseout", () => tooltip.style("display", "none"));

        const tooltip = d3.select(element)
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "rgba(255, 255, 255, 0.9)")
            .style("padding", "10px")
            .style("border", "1px solid #ccc")
            .style("border-radius", "5px")
            .style("box-shadow", "0 2px 8px rgba(0, 0, 0, 0.2)")
            .style("display", "none");

        svg.append("text").attr("x", width + 400).attr("y", height + 400).attr("text-anchor", "end").text("Années");
        svg.append("text").attr("x", -height / 2).attr("y", -40).attr("transform", "rotate(-90)").attr("text-anchor", "middle").text("Taux de régularité (%)");
    };

    const addPoints = (svg, data, x, y) => {
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('display', 'none')
            .style('background', '#fff')
            .style('border', '1px solid #ccc')
            .style('padding', '5px')
            .style('border-radius', '5px')
            .style('pointer-events', 'none');

        svg.selectAll(".dot-annulments")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot-annulments")
            .attr("cx", (d) => x(d.year))
            .attr("cy", (d) => y(d.annulments))
            .attr("r", 4)
            .attr("fill", "steelblue")
            .on("mouseover", function(event, d) {
                tooltip.style("display", "block")
                    .html(`Annulations: ${d.annulments}<br>Année: ${d.year}`);
            })
            .on("mousemove", function(event) {
                const mouse = d3.pointer(event);
                tooltip.style("left", `${mouse[0] + margin.left + 220  }px`)
                    .style("top", `${mouse[1] + margin.top + 270}px`);
            })
            .on("mouseout", () => tooltip.style("display", "none"));

        svg.selectAll(".dot-delays")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot-delays")
            .attr("cx", (d) => x(d.year))
            .attr("cy", (d) => y(d.delays))
            .attr("r", 4)
            .attr("fill", "orange")
            .on("mouseover", function(event, d) {
                tooltip.style("display", "block")
                    .html(`Retards: ${d.delays}<br>Année: ${d.year}`);
            })
            .on("mousemove", function(event) {
                const mouse = d3.pointer(event);
                tooltip.style("left", `${mouse[0] + margin.left +220}px`)
                    .style("top", `${mouse[1] + margin.top + 270}px`);
            })
            .on("mouseout", () => tooltip.style("display", "none"));
    };

    const handleRegionChange = (event) => {
        setSelectedRegion(event.target.value);
    };

    return (
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
                <svg className="graph" ref={regularityGraphRef}></svg> {/* Add a second graph */}
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
    );
};

export default Graph;