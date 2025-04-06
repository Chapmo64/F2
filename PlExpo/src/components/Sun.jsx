// Sun.jsx
import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const Sun = () => {
  const sunTexture = useLoader(TextureLoader, "/img/sun_hd.jpg");

  return (
    <mesh>
      <sphereGeometry args={[10, 64, 64]} />
      <meshBasicMaterial map={sunTexture} />
    </mesh>
  );
};

export default Sun;
