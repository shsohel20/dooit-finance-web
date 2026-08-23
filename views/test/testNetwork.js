"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { links, nodes } from "./utils";

const WIDTH = 1200;
const HEIGHT = 680;

const TestNetwork = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.current?.getBoundingClientRect();

    console.log(rect);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // The force simulation mutates links and nodes, so work on copies
    // and leave the imported data untouched.
    const linkData = links.map((d) => ({ ...d }));
    const nodeData = nodes.map((d) => ({ ...d }));

    const simulation = d3
      .forceSimulation(nodeData)
      .force(
        "link",
        d3.forceLink(linkData).id((d) => d.id),
      )
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // Create the SVG container.
    const svg = d3
      .create("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT])
      .attr("style", "max-width: 100%; height: auto;");

    // Add a line for each link, and a circle for each node.
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(linkData)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodeData)
      .join("circle")
      .attr("r", 15)
      .attr("fill", (d) => color(d.group));

    // Add text under each node
    const nodeText = svg
      .append("g")
      .selectAll("text")
      .data(nodeData)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("dy", 35) // 15px radius + 20px gap
      .attr("fill", "#000")
      .text((d) => d.name);

    node.append("title").text((d) => d.id);

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends,
    // and unfix the subject position.
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    node.call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    // Mount the chart into the DOM.
    container.appendChild(svg.node());

    // Cleanup: stop the simulation and remove the SVG so React Strict Mode's
    // double-invoke (and any unmount) doesn't leave duplicate charts behind.
    return () => {
      simulation.stop();
      svg.remove();
    };
  }, []);

  return <div ref={containerRef} className="border" />;
};

export default TestNetwork;
