import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import PlanetInfo from "./PlanetInfo";
import Sun from "./Sun";
import Planet from "./Planet";
import Orbit from "./Orbit";
import planetData from "./planetData";
import CameraModes from "./CameraModes";
import RotatingPlanets from "./RotatingPlanets";
import ShootingStar from "./ShootingStar";
import Skybox from "./Skybox";

const Experience = ({ onPlanetSelect }) => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [cameraMode, setCameraMode] = useState("free");
  const [shouldResetView, setShouldResetView] = useState(false);
  const [selectedPlanetName, setSelectedPlanetName] = useState(null);
  const layout = cameraMode === "top" ? "line" : "orbit";
  const planetRefs = useRef([]);

  const handlePlanetClick = (name, mesh) => {
    if (!mesh) return;

    setSelectedPlanet({ name, mesh });
    setSelectedPlanetName(name);
    if (onPlanetSelect) onPlanetSelect(name);

    if (cameraMode !== "top") {
      setCameraMode("planet");
    }
  };

  const handleCanvasClick = (e) => {
    if (!e.intersections || e.intersections.length === 0) {
      setSelectedPlanet(null);
      setSelectedPlanetName(null);
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
      {/* View Mode Buttons */}
      <div className="view-buttons" style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <button onClick={() => setCameraMode("side")}>Default View</button>
        <button onClick={() => setCameraMode("top")}>Top View</button>
        <button onClick={() => setCameraMode("free")}>Free View</button>
      </div>

      {/* Planet Info Panel */}
      <PlanetInfo name={selectedPlanetName} onClose={() => setSelectedPlanetName(null)} />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 50, 150], fov: 60 }}
        shadows
        onPointerMissed={handleCanvasClick}
      >
        {/* Skybox Background */}
        <Skybox />

        {/* Lighting */}
        <ambientLight intensity={2} />
        <directionalLight position={[100, 100, 100]} intensity={0.8} />
        <directionalLight position={[-100, -100, -100]} intensity={0.5} />

        {/* Stars + Shooting Star */}
        <Stars radius={300} depth={60} count={5000} factor={4} fade />
        <ShootingStar />

        {/* Glowing Sun */}
        <Sun />

        {/* Planets */}
        <RotatingPlanets onPlanetClick={handlePlanetClick} planetRefs={planetRefs} layout={layout} />

        {/* Orbits */}
        {cameraMode !== "top" &&
          planetData.map((planet, i) => (
            <Orbit key={i} distance={planet.distance} />
          ))}

        {/* Camera Modes */}
        <CameraModes selectedPlanet={selectedPlanet} cameraMode={cameraMode} />

        {/* Bloom Effect */}
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
      </Canvas>
    </>
  );
};

export default Experience;
