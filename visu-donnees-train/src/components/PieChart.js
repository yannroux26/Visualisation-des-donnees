import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Graph.css'; // Using the same CSS as the graph for a consistent design

const PieChart = () => {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [data, setData] = useState([]);
    const svgRef = useRef();
    const csvPath = "/data/regularite-mensuelle-ter.csv";

    useEffect(() => {
        d3.csv(csvPath).then((data) => {
            const uniqueRegions = Array.from(new Set(data.map((d) => d.Region)));
            setRegions(uniqueRegions);
            setSelectedRegion(uniqueRegions[0]);
            setData(data);
            console.log("Data loaded:", data);
        }).catch((error) => {
            console.error("Error loading CSV data:", error);
        });
    }, []);

    useEffect(() => {
        if (selectedRegion && data.length > 0) {
            const regionData = data.find(d => d.Region === selectedRegion);
            if (!regionData) {
                console.error("Region data not found");
                return;
            }
    
            const pieData = [
                { name: "Annulés", value: +regionData.NbTrainsannulés },
                { name: "En retard", value: +regionData["Nombre de trains en retard à l'arrivée"] },
                { name: "Normaux", value: +regionData["Nombre de trains ayant circulé"] - (+regionData.NbTrainsannulés + +regionData["Nombre de trains en retard à l'arrivée"]) }
            ];
    
            const width = 400;
            const height = 400;
            const radius = Math.min(width, height) / 2;
    
            const color = d3.scaleOrdinal()
                .domain(["Annulés", "En retard", "Normaux"])
                .range(["#ff0000", "#ffa500", "#00ff00"]);
    
            const pie = d3.pie()
                .value(d => d.value);
    
            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);
    
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove(); // Clear previous chart
    
            svg.attr("width", width)
                .attr("height", height + 100);
    
            const g = svg.append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
            // Create a tooltip
            const tooltip = d3.select("body").append("div")
                .style("position", "absolute")
                .style("background", "#fff")
                .style("border", "1px solid #ccc")
                .style("padding", "8px")
                .style("border-radius", "4px")
                .style("pointer-events", "none")
                .style("display", "none");
    
            g.selectAll('path')
                .data(pie(pieData))
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', d => color(d.data.name))
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 0.7)
                .on("mouseover", function (event, d) {
                    tooltip.style("display", "block")
                        .html(`<strong>${d.data.name}</strong>: ${d.data.value}`)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY + 10}px`);
                    d3.select(this).style("opacity", 1);
                })
                .on("mousemove", function (event) {
                    tooltip.style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY + 10}px`);
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none");
                    d3.select(this).style("opacity", 0.7);
                });
    
            g.append("text")
                .attr("x", 0)
                .attr("y", -radius - 20)
                .attr("text-anchor", "middle")
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .text(selectedRegion);
    
            const legend = svg.append("g")
                .attr("transform", `translate(0, ${height + 20})`);
    
            const legendItems = legend.selectAll(".legend-item")
                .data(color.domain())
                .enter()
                .append("g")
                .attr("class", "legend-item")
                .attr("transform", (d, i) => `translate(${width / 2 - 60}, ${i * 20})`);
    
            legendItems.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);
    
            legendItems.append("text")
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(d => d);
        }
    }, [selectedRegion, data]);
    
    

    return (
        <div className="graph-div">
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
            <svg ref={svgRef}></svg>
            <p>
Le camembert montre une forte proportion d'annulations dans la région <strong>Île-de-France</strong>, représentant environ 60% des cas. Cela peut être attribué à la densité du trafic ferroviaire dans cette région et à l'impact de perturbations régulières sur les horaires des trains.
</p>
<p>
En revanche, des régions comme <strong>Bretagne</strong> et <strong>Nouvelle-Aquitaine</strong> enregistrent des taux d'annulation plus faibles, reflétant probablement un trafic moins dense et une meilleure ponctualité.
</p>
<p>
Ces observations soulignent l'importance d'améliorer la gestion des lignes à fort trafic pour réduire le nombre d'annulations, en particulier dans les zones fortement urbanisées.
</p>

        </div>
    );
};

export default PieChart;
