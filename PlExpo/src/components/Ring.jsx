import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const Ring = ({ size }) => {
  const ringTexture = useLoader(THREE.TextureLoader, "/img/saturn_ring.jpg");
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <ringGeometry args={[size * 1.5, size * 2, 64]} />
      <meshStandardMaterial 
        map={ringTexture} 
        side={THREE.DoubleSide} 
        transparent 
        opacity={0.6} 
      />
    </mesh>
  );
};

export default Ring;
