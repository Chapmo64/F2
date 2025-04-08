import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

import Sun from "./Sun";
import Planet from "./Planet";
import Orbit from "./Orbit";
import planetData from "./planetData";
import CameraModes from "./CameraModes";
import RotatingPlanets from "./RotatingPlanets";

const Experience = ({ onPlanetSelect }) => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [cameraMode, setCameraMode] = useState("free");
  const [shouldResetView, setShouldResetView] = useState(false);

  const layout = cameraMode === "top" ? "line" : "orbit";
  const planetRefs = useRef([]);

  const handlePlanetClick = (name, mesh) => {
    if (!mesh) return;
    const position = mesh.getWorldPosition(new THREE.Vector3());
    setSelectedPlanet({ name, mesh, position });
    if (onPlanetSelect) onPlanetSelect(name);

    if (cameraMode !== "top") {
      setCameraMode("planet");
    }
  };

  const handleCanvasClick = (e) => {
    if (!e.intersections || e.intersections.length === 0) {
      setSelectedPlanet(null);
      if (cameraMode === "planet") {
        if (layout === "line") {
          setShouldResetView(true);
          setCameraMode("side");
        } else {
          setCameraMode("free");
        }
      }
    }
  };

  useEffect(() => {
    if (shouldResetView && cameraMode === "side") {
      const timeout = setTimeout(() => {
        setCameraMode("free");
        setShouldResetView(false);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [shouldResetView, cameraMode]);

  return (
    <>
      <div className="view-buttons" style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <button onClick={() => setCameraMode("side")}>Default View</button>
        <button onClick={() => setCameraMode("top")}>Top View</button>
        <button onClick={() => setCameraMode("free")}>Free View</button>
      </div>

      <Canvas
        camera={{ position: [0, 50, 150], fov: 60 }}
        shadows
        onPointerMissed={handleCanvasClick}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[100, 100, 100]} intensity={0.8} />
        <directionalLight position={[-100, -100, -100]} intensity={0.5} />
        <Stars radius={300} depth={60} count={5000} factor={4} fade />

        <Sun />

        <RotatingPlanets
          onPlanetClick={handlePlanetClick}
          planetRefs={planetRefs}
          layout={layout}
        />

        {cameraMode !== "top" &&
          planetData.map((planet, i) => (
            <Orbit key={i} distance={planet.distance} />
          ))}

        <CameraModes
          selectedPlanet={selectedPlanet}
          cameraMode={cameraMode}
        />
      </Canvas>
    </>
  );
};

export default Experience;
