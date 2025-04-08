import React, { useEffect, useState, useRef } from "react";
import "./PlanetInfo.css";

const satelliteData = {
  earth: ["Hubble Space Telescope", "ISS", "Landsat 8"],
  mars: ["Mars Reconnaissance Orbiter", "MAVEN", "ExoMars TGO"],
  jupiter: ["Juno"],
  // add more as needed
};

const PlanetInfo = ({ name, onClose }) => {
  const [planetData, setPlanetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMoons, setShowMoons] = useState(false);
  const [showSatellites, setShowSatellites] = useState(false);
  const panelRef = useRef();

  useEffect(() => {
    if (!name) return;

    const fetchPlanetData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.le-systeme-solaire.net/rest/bodies/${name.toLowerCase()}`
        );
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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        onClose();
        setShowMoons(false);
        setShowSatellites(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const toggleMoons = () => {
    setShowMoons(!showMoons);
    setShowSatellites(false);
  };

  const toggleSatellites = () => {
    setShowSatellites(!showSatellites);
    setShowMoons(false);
  };

  return (
    <>
      {/* Right Info Panel */}
      <div className={`planet-info-drawer-right ${name ? "open" : ""}`} ref={panelRef}>
        <div className="panel planet-panel">
          <button className="delete close-button" onClick={onClose}></button>
          {loading ? (
            <p className="has-text-grey-light">Loading data...</p>
          ) : planetData ? (
            <>
              <p className="panel-heading">{planetData.englishName}</p>
              <div className="panel-block is-block">
                <ul className="planet-details">
                  <li><strong>Mass:</strong> {planetData.mass?.massValue} × 10<sup>{planetData.mass?.massExponent}</sup> kg</li>
                  <li><strong>Gravity:</strong> {planetData.gravity} m/s²</li>
                  <li><strong>Density:</strong> {planetData.density} g/cm³</li>
                  <li><strong>Orbit Period:</strong> {planetData.sideralOrbit} days</li>
                  <li><strong>Rotation Period:</strong> {planetData.sideralRotation} hours</li>
                  <li><strong>Discovered By:</strong> {planetData.discoveredBy || "Unknown"}</li>
                  <li><strong>Discovery Date:</strong> {planetData.discoveryDate || "Unknown"}</li>
                </ul>
                <p className="planet-description">
                  {planetData.englishName} is a unique celestial body with its own orbital, gravitational, and physical properties that make it an interesting part of our solar system.
                </p>
              </div>

              <div className="dropdown-section-buttons">
                <button className="button is-link is-small" onClick={toggleMoons}>
                  {showMoons ? "Hide Moons" : "Show Moons"}
                </button>
                <button className="button is-info is-small" onClick={toggleSatellites}>
                  {showSatellites ? "Hide Satellites" : "Show Satellites"}
                </button>
              </div>
            </>
          ) : (
            <p className="has-text-grey-light">No data available.</p>
          )}
        </div>
      </div>

      {/* Moons Box */}
      {showMoons && (
        <div className="floating-box left-box moons-box">
          <p className="panel-heading">Moons</p>
          <ul>
            {planetData?.moons?.length > 0 ? (
              planetData.moons.map((moon, index) => (
                <li key={index}>{moon.moon}</li>
              ))
            ) : (
              <li>No moons available</li>
            )}
          </ul>
        </div>
      )}

      {/* Satellites Box */}
      {showSatellites && (
        <div className="floating-box left-box satellites-box">
          <p className="panel-heading">Satellites</p>
          <ul>
            {satelliteData[name?.toLowerCase()]?.length > 0 ? (
              satelliteData[name.toLowerCase()].map((sat, index) => (
                <li key={index}>{sat}</li>
              ))
            ) : (
              <li>No satellites available</li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default PlanetInfo;
