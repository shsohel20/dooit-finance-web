// import { getCustomerRelations } from "@/app/dashboard/client/onboarding/customer-queue/actions";
// import React, { useEffect, useState } from "react";

// export default function RelationGraph({ details }) {
//   console.log("details", details);
//   const [relations, setRelations] = useState([]);

//   useEffect(() => {
//     const fetchRelations = async () => {
//       const payload = {
//         entity_type: "customer",
//         entity_id: details?._id,
//         max_hops: 3,
//         include_transactions: true,
//       };
//       const relations = await getCustomerRelations(payload);
//       console.log("relations", relations);
//       setRelations(relations);
//     };
//     fetchRelations();
//   }, []);
//   return <div>RelationGraph</div>;
// }
"use client";
import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";
import { forceSimulation, forceLink, forceManyBody, forceCenter } from "d3-force";

export default function GraphPage() {
  const mountRef = useRef(null);

  useEffect(() => {
    let app = null;
    let sim = null;
    (async () => {
      const app = new Application();
      await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0x0d0d0f,
      });
      mountRef.current?.appendChild(app.canvas ?? null);

      const nodes = [{ id: "center" }, ...Array.from({ length: 300 }, (_, i) => ({ id: `w${i}` }))];
      const links = nodes
        .slice(1)
        .map((n) => ({ source: "center", target: n.id, dir: Math.random() > 0.5 ? "out" : "in" }));

      const edgeGfx = new Graphics();
      app.stage.addChild(edgeGfx);

      // Node circles
      const nodeMap = {};
      nodes.forEach((n) => {
        const g = new Graphics();
        g.fill(n.id === "center" ? 0xef4444 : 0x4a9eff, 0.9);
        g.circle(0, 0, n.id === "center" ? 20 : 5);
        g.fill(n.id === "center" ? 0xef4444 : 0x4a9eff, 0.9);
        g.interactive = true;
        app.stage.addChild(g);
        nodeMap[n.id] = g;
      });

      // Force simulation
      sim = forceSimulation(nodes)
        .force(
          "link",
          forceLink(links)
            .id((d) => d.id)
            .distance(120),
        )
        .force("charge", forceManyBody().strength(-80))
        .force("center", forceCenter(window.innerWidth / 2, window.innerHeight / 2));

      app.ticker.add(() => {
        edgeGfx.clear();
        links.forEach((l) => {
          const color = l.dir === "out" ? 0xe05252 : 0x52c97a;
          edgeGfx.setStrokeStyle(0.8, color, 0.35);
          edgeGfx.moveTo(l.source.x, l.source.y);
          edgeGfx.lineTo(l.target.x, l.target.y);
        });
        nodes.forEach((n) => {
          if (nodeMap[n.id]) {
            nodeMap[n.id].x = n.x;
            nodeMap[n.id].y = n.y;
          }
        });
      });
    })();

    return () => {
      // app.destroy(true);
      // sim.stop();
    };
  }, []);

  return <div ref={mountRef} />;
}
