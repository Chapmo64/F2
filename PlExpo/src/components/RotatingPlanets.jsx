import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Planet from "./Planet";
import planetData from "./planetData";

const RotatingPlanets = ({ onPlanetClick }) => {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((planet, index) => {
        const data = planetData[index];
        if (data) {
          const angle = elapsed * data.speed; // Orbital motion
          planet.position.x = Math.cos(angle) * data.distance;
          planet.position.z = Math.sin(angle) * data.distance;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {planetData.map((data, index) => (
        <Planet key={index} {...data} onPlanetClick={onPlanetClick} />
      ))}
    </group>
  );
};

export default RotatingPlanets;
