// SolarSystem.jsx
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import UI from "./UI";
import { useNASAData } from "./useNASAData"; // Your custom hook to fetch NASA data

const SolarSystem = () => {
  // State to hold the name of the selected planet
  const [selectedPlanetName, setSelectedPlanetName] = useState(null);
  // Fetch NASA data for the selected planet (you can customize this hook as needed)
  const planetInfo = useNASAData(selectedPlanetName);

  const handlePlanetSelect = (name) => {
    setSelectedPlanetName(name);
  };

  const handleCloseInfo = () => {
    setSelectedPlanetName(null);
  };

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 50, 150] }}
        gl={{ preserveDrawingBuffer: true, antialias: true, shadowMap: true }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <Experience onPlanetSelect={handlePlanetSelect} />
      </Canvas>
      <UI planetInfo={planetInfo} onClose={handleCloseInfo} />
    </>
  );
};

export default SolarSystem;
