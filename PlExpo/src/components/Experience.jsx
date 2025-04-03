// Experience.jsx
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Sun from "./Sun";
import Planet from "./Planet";
import Orbit from "./Orbit";
import Skybox from "./Skybox";
import planetData from "./planetData";
// We'll assume UI is rendered separately in SolarSystem.jsx

const Experience = ({ onPlanetSelect }) => {
  const { camera } = useThree();
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const defaultCameraPosition = new THREE.Vector3(0, 50, 150);
  const targetPosition = useRef(null);

  // Callback when a planet is clicked
  const handlePlanetClick = (name, position) => {
    setSelectedPlanet({ name, position });
    // Set target position: position plus an offset so we don't clip inside the planet.
    targetPosition.current = new THREE.Vector3(position.x, position.y + 5, position.z + 10);
    // Notify parent if needed
    if (onPlanetSelect) onPlanetSelect(name);
  };

  // Animate camera zooming toward the target position when a planet is selected.
  useFrame(() => {
    if (targetPosition.current) {
      camera.position.lerp(targetPosition.current, 0.05);
    } else {
      camera.position.lerp(defaultCameraPosition, 0.05);
    }
  });

  return (
    <>
      <Skybox />
      <ambientLight intensity={0.3} />
      <Sun />
      {planetData.map((data, index) => (
        <Planet key={index} {...data} onPlanetClick={handlePlanetClick} />
      ))}
      {planetData.map((data, index) => (
        <Orbit key={index} distance={data.distance} />
      ))}
      <OrbitControls enableZoom={true} />
    </>
  );
};

export default Experience;
