import React from "react";
import "./PlanetInfo.css";

const PlanetInfo = ({ name, onClose }) => {
  if (!name) return null;

  return (
    <div className="planet-info">
      <button className="close-btn" onClick={onClose}>X</button>
      <h2>{name}</h2>
      <p><strong>Description:</strong> Lorem ipsum dolor sit amet.</p>
      <p><strong>Mass:</strong> Placeholder</p>
      <p><strong>Distance from Sun:</strong> Placeholder</p>
      <p><strong>More details coming soon ...</strong></p>
    </div>
  );
};

export default PlanetInfo;
