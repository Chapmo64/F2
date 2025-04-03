import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const Sun = () => {
  const sunTexture = useLoader(THREE.TextureLoader, "/img/sun_hd.jpg");

  return (
    <mesh castShadow={false}>
      <sphereGeometry args={[10, 32, 32]} />
      <meshStandardMaterial 
        map={sunTexture} 
        emissive={0xffaa00} 
        emissiveIntensity={2.0} 
      />
      {/* A directional light simulating sunlight */}
      <directionalLight
        position={[50, 50, 50]}
        intensity={5}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={10}
        shadow-camera-far={500}
        shadow-bias={-0.0005}
      />
    </mesh>
  );
};

export default Sun;
