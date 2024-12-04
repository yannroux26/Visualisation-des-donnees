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
        const trainData = csvData.map((d) => ({
          region: d["Region"].trim(),
          nbTrainsAnnules: +d["NbTrainsannulés"] || 0,
        }));

        const dataByRegion = {};
        trainData.forEach((d) => {
          dataByRegion[d.region] = d.nbTrainsAnnules;
        });

        const width = 800;
        const height = 700;

        const projection = d3
          .geoMercator()
          .center([2.5, 46.5])
          .scale(2400)
          .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        const colorScale = d3
          .scaleSequential()
          .domain([0, d3.max(trainData, (d) => d.nbTrainsAnnules)])
          .interpolator(d3.interpolateBlues);

        d3.select(mapRef.current).selectAll("*").remove();

        const svg = d3
          .select(mapRef.current)
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .style("background-color", "#ffffff")
          .style("border", "1px solid #ddd")
          .style("box-shadow", "0 4px 10px rgba(0,0,0,0.1)");

        // Add a title
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", 30)
          .attr("text-anchor", "middle")
          .attr("font-size", "24px")
          .attr("font-weight", "bold")
          .attr("fill", "#333")
          .text("Train Annulments Across French Regions");

        svg
          .append("g")
          .selectAll("path")
          .data(geoData.features)
          .join("path")
          .attr("d", path)
          .attr("fill", (d) => {
            const regionName = d.properties.nom.trim();
            return dataByRegion[regionName]
              ? colorScale(dataByRegion[regionName])
              : "#ccc";
          })
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.7)
          .attr("filter", "url(#shadow)") // Add shadow effect
          .on("mouseover", (event, d) => {
            const regionName = d.properties.nom;
            const value = dataByRegion[regionName] || "No Data";
            tooltip
              .style("visibility", "visible")
              .html(
                `<strong>Region:</strong> ${regionName}<br>
                 <strong>Train Annulments:</strong> ${value}`
              );
          })
          .on("mousemove", (event) => {
            tooltip
              .style("top", `${event.pageY - 170}px`)
              .style("left", `${event.pageX + 10}px`);
          })
          .on("mouseout", () => tooltip.style("visibility", "hidden"));

        // Tooltip
        const tooltip = d3
          .select(mapRef.current)
          .append("div")
          .style("position", "absolute")
          .style("background", "#333")
          .style("color", "#fff")
          .style("padding", "10px")
          .style("border-radius", "5px")
          .style("box-shadow", "0px 4px 10px rgba(0,0,0,0.1)")
          .style("visibility", "hidden")
          .style("font-size", "14px");

        // Legend
        const legendWidth = 300;
        const legendHeight = 10;

        const legend = svg
          .append("g")
          .attr("transform", `translate(${width / 2 - legendWidth / 2},${height - 60})`);

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

        legend
          .append("text")
          .attr("x", legendWidth / 2)
          .attr("y", -10)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("fill", "#333")
          .text("Number of Train Annulments");
      })
      .catch((error) => {
        console.error("Error loading files:", error);
      });
  }, []);

  return <div ref={mapRef} style={{ position: "relative" }}></div>;
};

export default TrainDataMap;
