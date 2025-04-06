// Experience.jsx
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

import Sun from "./Sun";
import Planet from "./Planet";
import Orbit from "./Orbit";
import planetData from "./planetData";
import CameraModes from "./CameraModes";
import RotatingPlanets from "./RotatingPlanets";

// Smooth camera transition to selected planet
const CameraController = ({ selectedPlanet }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useFrame(() => {
    if (selectedPlanet?.mesh) {
      const position = selectedPlanet.mesh.position;
      const target = position.clone().add(new THREE.Vector3(0, 10, 20));

      camera.position.lerp(target, 0.05);
      camera.lookAt(position);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(position, 0.1);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.1}
    />
  );
};

const Experience = ({ onPlanetSelect }) => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [cameraMode, setCameraMode] = useState("free");
  const [shouldResetView, setShouldResetView] = useState(false);

  const layout = cameraMode === "top" ? "line" : "orbit";
  const planetRefs = useRef([]);

  const handlePlanetClick = (name, mesh) => {
    if (!mesh) return;
    setSelectedPlanet({ name, mesh });
    if (onPlanetSelect) onPlanetSelect(name);

    // Only switch to planet view if not in top
    if (cameraMode !== "top") {
      setCameraMode("planet");
    }
  };

  const handleCanvasClick = (e) => {
    if (!e.intersections || e.intersections.length === 0) {
      setSelectedPlanet(null);

      if (cameraMode === "planet") {
        if (layout === "line") {
          // Was in top view → trigger a side reset → then back to free
          setShouldResetView(true);
          setCameraMode("side");
        } else {
          setCameraMode("free");
        }
      }
    }
  };

  // Automatically return to free view after showing side view briefly
  useEffect(() => {
    if (shouldResetView && cameraMode === "side") {
      const timeout = setTimeout(() => {
        setCameraMode("free");
        setShouldResetView(false);
      }, 150); // Adjust delay as needed
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
        <ambientLight intensity={0.4} />
        <Stars radius={300} depth={60} count={5000} factor={4} fade />

        <Sun />

        <RotatingPlanets
          onPlanetClick={handlePlanetClick}
          planetRefs={planetRefs}
          layout={layout}
        />

        {/* Hide orbits in top view */}
        {cameraMode !== "top" &&
          planetData.map((planet, i) => (
            <Orbit key={i} distance={planet.distance} />
          ))}

        <CameraModes
          selectedPlanet={selectedPlanet}
          cameraMode={cameraMode}
        />

        <CameraController selectedPlanet={selectedPlanet} />
      </Canvas>
    </>
  );
};

export default Experience;
