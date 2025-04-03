// src/components/Orbit.jsx
import React from "react";
import { Line } from "@react-three/drei";

const Orbit = ({ distance }) => {
  const segments = 64;
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push([Math.cos(angle) * distance, 0, Math.sin(angle) * distance]);
  }
  return <Line points={points} color="white" lineWidth={1} opacity={0.3} transparent />;
};

export default Orbit;
