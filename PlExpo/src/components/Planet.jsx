import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const Planet = ({ name, size, texture, distance, speed = 0.01, rotationSpeed = 0.01, onPlanetClick }) => {
  const planetRef = useRef();
  const planetTexture = useLoader(THREE.TextureLoader, texture || "/textures/default.jpg");

  useFrame(({ clock }) => {
    if (planetRef.current) {
      const t = clock.getElapsedTime() * speed;

      // Orbit movement around the Sun
      planetRef.current.position.x = Math.cos(t) * distance;
      planetRef.current.position.z = Math.sin(t) * distance;

      // Self-rotation
      planetRef.current.rotation.y += rotationSpeed;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (onPlanetClick && planetRef.current) {
      onPlanetClick(name, planetRef.current);
    }
  };

  return (
    <mesh ref={planetRef} onClick={handleClick}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial map={planetTexture} roughness={0.7} metalness={0} />
    </mesh>
  );
};

export default Planet;
