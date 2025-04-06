// Orbit.jsx
import React from "react";

const Orbit = ({ distance }) => {
  const points = [];
  for (let i = 0; i <= 360; i++) {
    const angle = (i * Math.PI) / 180;
    points.push([Math.cos(angle) * distance, 0, Math.sin(angle) * distance]);
  }

  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="white" transparent opacity={0.3} />
    </line>
  );
};

export default Orbit;
