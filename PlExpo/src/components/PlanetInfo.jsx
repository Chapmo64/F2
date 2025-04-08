import React, { useEffect, useState } from "react";
import "./PlanetInfo.css"; // optional for styling

const PlanetInfo = ({ name, onClose }) => {
  const [planetData, setPlanetData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!name) return;

    const fetchPlanetData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.le-systeme-solaire.net/rest/bodies/${name.toLowerCase()}`);
        const data = await response.json();
        setPlanetData(data);
      } catch (error) {
        console.error("Failed to fetch planet data:", error);
        setPlanetData(null);
      }
      setLoading(false);
    };

    fetchPlanetData();
  }, [name]);

  if (!name) return null;

  return (
    <div className="planet-info-container">
      <button onClick={onClose} className="close-btn">✖</button>
      {loading && <p>Loading data...</p>}
      {planetData && (
        <>
          <h2>{planetData.englishName}</h2>
          <p><strong>Mass:</strong> {planetData.mass?.massValue} × 10^{planetData.mass?.massExponent} kg</p>
          <p><strong>Gravity:</strong> {planetData.gravity} m/s²</p>
          <p><strong>Density:</strong> {planetData.density} g/cm³</p>
          <p><strong>Orbital Period:</strong> {planetData.sideralOrbit} days</p>
          <p><strong>Rotation Period:</strong> {planetData.sideralRotation} hours</p>
          <p><strong>Discovered By:</strong> {planetData.discoveredBy || "Unknown"}</p>
          <p><strong>Discovery Date:</strong> {planetData.discoveryDate || "Unknown"}</p>
        </>
      )}
    </div>
  );
};

export default PlanetInfo;
