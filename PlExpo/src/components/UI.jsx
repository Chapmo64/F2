// UI.jsx
import React from "react";

const UI = ({ planetInfo, onClose }) => {
  if (!planetInfo) return null;

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
      <h2>{planetInfo.name}</h2>
      <p><strong>Mass:</strong> {planetInfo.mass}</p>
      <p><strong>Radius:</strong> {planetInfo.radius} km</p>
      <p><strong>Gravity:</strong> {planetInfo.gravity} m/s²</p>
      <button onClick={onClose} style={{
        marginTop: "10px",
        padding: "5px 10px",
        border: "none",
        background: "#ff6600",
        color: "white",
        borderRadius: "4px",
        cursor: "pointer"
      }}>
        Close
      </button>
    </div>
  );
};

export default UI;
