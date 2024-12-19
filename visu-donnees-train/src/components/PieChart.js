import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

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
        }).catch(error => {
            console.error("Error loading CSV data:", error);
        });
    }, []);

    useEffect(() => {
        console.log("Selected region changed:", selectedRegion);
        if (selectedRegion && data.length > 0) {
            const regionData = data.find(d => d.Region === selectedRegion);
            if (!regionData) {
                console.error("Region data not found");
                return;
            }

            console.log("Selected Region Data:", regionData);

            const pieData = [
                { name: "Annulés", value: +regionData.NbTrainsannulés },
                { name: "En retard", value: +regionData["Nombre de trains en retard à l'arrivée"] },
                { name: "Normaux", value: +regionData["Nombre de trains ayant circulé"] - (+regionData.NbTrainsannulés + +regionData["Nombre de trains en retard à l'arrivée"]) }
            ];

            console.log("Pie Data:", pieData);

            const width = 500;
            const height = 500;
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
                .attr("height", height);

            const g = svg.append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

            const paths = g.selectAll('path')
                .data(pie(pieData))
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', d => color(d.data.name))
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 0.7);

            console.log("Paths after append:", paths.nodes());

            g.append("text")
                .attr("x", 0)
                .attr("y", -radius - 10)
                .attr("text-anchor", "middle")
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .text(selectedRegion);

            // Add legend
            const legend = svg.append("g")
                .attr("transform", `translate(${width - 150}, 20)`);

            legend.selectAll(".legend-item")
                .data(color.domain())
                .enter()
                .append("g")
                .attr("class", "legend-item")
                .attr("transform", (d, i) => `translate(0, ${i * 20})`)
                .call(g => {
                    g.append("rect")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", 18)
                        .attr("height", 18)
                        .style("fill", color);

                    g.append("text")
                        .attr("x", 24)
                        .attr("y", 9)
                        .attr("dy", ".35em")
                        .text(d => d);
                });
        }
    }, [selectedRegion, data]);

    return (
        <div>
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
        </div>
    );
};

export default PieChart;