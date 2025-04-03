import React, { useState } from "react";
import Experience from "./Experience";
import UI from "./UI";

const SolarSystem = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const handlePlanetSelect = (name) => {
    setSelectedPlanet({ name });
  };

  return (
    <>
      <Experience onPlanetSelect={handlePlanetSelect} />
      <UI selectedPlanet={selectedPlanet} />
    </>
  );
};

export default SolarSystem;