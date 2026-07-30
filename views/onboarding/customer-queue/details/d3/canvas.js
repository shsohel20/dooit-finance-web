"use client";

import { useEffect, useRef } from "react";
import { forceSimulation, forceManyBody, forceCenter, forceCollide, forceLink } from "d3-force";

export default function D3Canvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    //---------------------------------------
    // Create Nodes
    //---------------------------------------

    const nodes = [
      {
        id: "center",
      },
    ];

    for (let i = 0; i < 25; i++) {
      nodes.push({
        id: `${i}`,
      });
    }

    //---------------------------------------
    // Create Links
    //---------------------------------------

    const links = [];

    for (let i = 1; i < nodes.length; i++) {
      links.push({
        source: "center",
        target: `${i - 1}`,
      });
    }

    //---------------------------------------
    // Camera
    //---------------------------------------

    const camera = {
      x: 0,
      y: 0,
    };

    //---------------------------------------
    // D3 Physics
    //---------------------------------------

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink(links)
          .id((d) => d.id)
          .distance(170),
      )
      .force("charge", forceManyBody().strength(-450))
      .force("center", forceCenter(canvas.width / 2, canvas.height / 2))
      .force("collision", forceCollide(30));

    //---------------------------------------
    // Draw Everything
    //---------------------------------------

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawEdges();
      drawNodes();
    }

    //---------------------------------------
    // Draw Edges
    //---------------------------------------

    function drawEdges() {
      ctx.strokeStyle = "#2f855a";
      ctx.lineWidth = 1.5;

      links.forEach((link) => {
        ctx.beginPath();

        ctx.moveTo(link.source.x + camera.x, link.source.y + camera.y);

        ctx.lineTo(link.target.x + camera.x, link.target.y + camera.y);

        ctx.stroke();
      });
    }

    //---------------------------------------
    // Draw Nodes
    //---------------------------------------

    function drawNodes() {
      nodes.forEach((node) => {
        ctx.beginPath();

        ctx.arc(
          node.x + camera.x,
          node.y + camera.y,
          node.id === "center" ? 24 : 15,
          0,
          Math.PI * 2,
        );

        ctx.fillStyle = node.id === "center" ? "#f97316" : "#3b82f6";

        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";

        ctx.fillText(node.id, node.x + camera.x, node.y + camera.y + 30);
      });
    }

    //---------------------------------------
    // Every physics tick redraw
    //---------------------------------------

    simulation.on(" ", draw);

    //---------------------------------------
    // Cleanup
    //---------------------------------------

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen ">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
