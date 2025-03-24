import React from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import Skybox from "./Skybox";

const SolarSystem = () => {
  return (
    <Canvas camera={{ position: [0, 50, 100] }} style={{ width: "100vw", height: "100vh" }}>
      <Skybox />
      <Experience />
    </Canvas>
  );
};

export default SolarSystem;
