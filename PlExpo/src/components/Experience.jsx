import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Html, Billboard, Text } from "@react-three/drei";
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
        <Skybox />

        {/* Lighting */}
        <ambientLight intensity={2} />
        <directionalLight position={[100, 100, 100]} intensity={0.8} />
        <directionalLight position={[-100, -100, -100]} intensity={0.5} />

        <Stars radius={300} depth={60} count={5000} factor={4} fade />
        <ShootingStar />
        <Sun />

        <RotatingPlanets onPlanetClick={handlePlanetClick} planetRefs={planetRefs} layout={layout} />

        {cameraMode !== "top" &&
          planetData.map((planet, i) => (
            <Orbit key={i} distance={planet.distance} />
          ))}

        {/* Orbiting Satellites */}
        {planetRefs.current.map((ref, i) => {
          const planet = planetData[i];
          const isSelected = selectedPlanetName === planet.name;

          return (
            <group key={`sat-group-${i}`}>
              {[1, 2].map((n) => (
                <OrbitingSatellite
                  key={`dot-${i}-${n}`}
                  planetMesh={ref}
                  offset={planet.distance / 10 + n * 1.8}
                  speed={0.3 + i * 0.05 + n * 0.03}
                  name={`Satellite ${n}`}
                  showLabel={isSelected}
                  glowColor="aqua"
                />
              ))}
            </group>
          );
        })}

        <CameraModes selectedPlanet={selectedPlanet} cameraMode={cameraMode} />

        <EffectComposer>
          <Bloom intensity={1} luminanceThreshold={0.1} luminanceSmoothing={0.7} height={300} />
        </EffectComposer>
      </Canvas>
    </>
  );
};

export default Experience;

// Orbiting satellite with glow + animation
const OrbitingSatellite = ({ planetMesh, offset, speed, name, showLabel, glowColor }) => {
  const ref = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    if (planetMesh?.current && ref.current) {
      const t = clock.getElapsedTime() * speed;
      const center = planetMesh.current.getWorldPosition(new THREE.Vector3());

      const x = center.x + offset * Math.cos(t);
      const z = center.z + offset * Math.sin(t);
      const y = center.y + Math.sin(t * 2) * 0.5;

      ref.current.position.set(x, y, z);

      // Pulsing glow
      if (glowRef.current) {
        const scale = 1 + 0.2 * Math.sin(clock.getElapsedTime() * 5);
        glowRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <group ref={ref}>
      {/* Glowing core */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Billboard>
          <Text fontSize={0.7} color="white" anchorX="center" position={[0, 0.9, 0]}>
            {name}
          </Text>
        </Billboard>
      )}
    </group>
  );
};
