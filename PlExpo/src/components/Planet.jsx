// Planet.jsx
import React, { forwardRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const Planet = forwardRef(({ name, texture, size, onPlanetClick }, ref) => {
  const colorMap = useLoader(TextureLoader, texture);

  return (
    <mesh
      ref={ref}
      onClick={(e) => onPlanetClick(name, e.object)}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
});

export default Planet;
