// Planet.jsx
import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Ring from "./Ring";

const Planet = ({ name, size, texture, distance, hasRing, speed = 0.01, onPlanetClick }) => {
  const planetRef = useRef();
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const planetTexture = useLoader(THREE.TextureLoader, texture);

  useFrame(({ clock }) => {
    // Increase the orbit angle based on elapsed time
    angleRef.current += speed * 0.05;
    if (planetRef.current) {
      const x = Math.cos(angleRef.current) * distance;
      const z = Math.sin(angleRef.current) * distance;
      planetRef.current.position.set(x, 0, z);
      // Also, let the planet spin on its own axis
      planetRef.current.rotation.y += 0.01;
    }
  });

  // When the planet is clicked, call onPlanetClick with its name and current position
  const handleClick = (e) => {
    // Prevent click events from propagating to children
    e.stopPropagation();
    if (onPlanetClick && planetRef.current) {
      onPlanetClick(name, planetRef.current.position.clone());
    }
  };

  return (
    // Using group so that the entire planet and its ring move together
    <group ref={planetRef} onClick={handleClick}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={planetTexture} roughness={0.7} metalness={0} />
      </mesh>
      {hasRing && <Ring size={size} />}
    </group>
  );
};

export default Planet;
