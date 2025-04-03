import React from "react";

const PlanetInfo = ({ planet, onClose }) => {
  if (!planet) return null;

  return (
    <div style={{
      position: "absolute",
      top: "20px",
      right: "20px",
      width: "300px",
      padding: "15px",
      background: "rgba(0, 0, 0, 0.8)",
      color: "white",
      borderRadius: "8px",
      fontFamily: "sans-serif",
      zIndex: 10,
    }}>
      <h2>{planet.englishName || planet.name}</h2>
      <p>Mass: {planet.mass ? `${planet.mass.massValue} x 10^${planet.mass.massExponent}` : "N/A"}</p>
      <p>Radius: {planet.meanRadius ? planet.meanRadius : "N/A"} km</p>
      <p>Gravity: {planet.gravity ? planet.gravity : "N/A"} m/s²</p>
      <p>Moons: {planet.moons ? planet.moons.length : 0}</p>
      <button onClick={onClose} style={{ marginTop: "10px", padding: "5px 10px", border: "none", background: "#ff6600", color: "white", borderRadius: "4px", cursor: "pointer" }}>Close</button>
    </div>
  );
};

export default PlanetInfo;
