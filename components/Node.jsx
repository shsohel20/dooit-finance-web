import React, { useState, useRef, useEffect } from "react";

export default function NodeTree() {
  const [nodes, setNodes] = useState([{ id: 1, x: 300, y: 200, parent: null }]);
  const [dragging, setDragging] = useState(null);
  const containerRef = useRef(null);

  const handleAddNode = (parentId, e) => {
    const rect = containerRef.current.getBoundingClientRect();

    const newNode = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      parent: parentId,
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const handleMouseDown = (id, e) => {
    e.stopPropagation(); // prevent creating a node when dragging
    setDragging({
      id,
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = containerRef.current.getBoundingClientRect();

    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === dragging.id
          ? {
              ...n,
              x: e.clientX - rect.left - dragging.offsetX,
              y: e.clientY - rect.top - dragging.offsetY,
            }
          : n
      )
    );
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const styles = {
    container: {
      position: "relative",
      width: "100vw",
      height: "100vh",
      backgroundColor: "#f3f4f6",
      overflow: "hidden",
      cursor: dragging ? "grabbing" : "default",
    },
    node: {
      position: "absolute",
      width: "60px",
      height: "60px",
      backgroundColor: "#2563eb",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      cursor: "grab",
      userSelect: "none",
      boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
      transition: "transform 0.15s",
    },
    svg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    },
  };

  return (
    <div
      ref={containerRef}
      style={styles.container}
      onMouseMove={handleMouseMove}
      onClick={(e) => handleAddNode(null, e)}
    >
      <svg style={styles.svg}>
        {nodes
          .filter((node) => node.parent)
          .map((node) => {
            const parent = nodes.find((n) => n.id === node.parent);
            if (!parent) return null;
            return (
              <line
                key={node.id}
                x1={parent.x + 30}
                y1={parent.y + 30}
                x2={node.x + 30}
                y2={node.y + 30}
                stroke="#333"
                strokeWidth="2"
              />
            );
          })}
      </svg>

      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            ...styles.node,
            left: node.x,
            top: node.y,
            transform: dragging?.id === node.id ? "scale(1.1)" : "scale(1)",
          }}
          onMouseDown={(e) => handleMouseDown(node.id, e)}
          onClick={(e) => {
            e.stopPropagation(); // prevent click on container
            handleAddNode(node.id, e);
          }}
        >
          {node.id === 1 ? "Root" : "Node"}
        </div>
      ))}
    </div>
  );
}
