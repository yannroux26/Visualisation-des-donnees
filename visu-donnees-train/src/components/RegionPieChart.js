import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const RegionPieChart = ({ regionData }) => {
  const pieChartRef = useRef(null);

  useEffect(() => {
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(pieChartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(["Retardés", "Annulés", "Prévu"])
      .range(["#ff7f0e", "#d62728", "#2ca02c"]);

    const pie = d3.pie()
      .value(d => d.value);

    const data_ready = pie(d3.entries(regionData));

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    svg.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.key))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg.append("text")
      .attr("x", 0)
      .attr("y", -height / 2 + 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text(regionData.region);

  }, [regionData]);

  return <svg ref={pieChartRef}></svg>;
};

export default RegionPieChart;