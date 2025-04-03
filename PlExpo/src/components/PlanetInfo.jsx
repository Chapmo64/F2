import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import Ring from "./Ring";

const Planet = ({ size, texture, distance, hasRing, speed = 0.01 }) => {
  const planetTexture = useLoader(THREE.TextureLoader, texture);
  const planetRef = useRef();
  const angleRef = useRef(Math.random() * Math.PI * 2); // Start at a random position

  useFrame(() => {
    angleRef.current += speed * 0.05;  

    const x = Math.cos(angleRef.current) * distance;
    const z = Math.sin(angleRef.current) * distance;
    
    if (planetRef.current) {
      planetRef.current.position.set(x, 0, z);
      planetRef.current.rotation.y += 0.01; // Planet self-rotation
    }
  });

  return (
    <group ref={planetRef}> {/* Group ensures planet and ring move together */}
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={planetTexture} roughness={0.7} metalness={0} />
      </mesh>
      {hasRing && <Ring size={size} />} {/* Rings are now inside the moving group */}
    </group>
  );
};

export default Planet;
