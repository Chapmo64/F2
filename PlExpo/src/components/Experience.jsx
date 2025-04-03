import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import Sun from "./Sun";
import Planet from "./Planet";
import Orbit from "./Orbit";
import planetData from "./planetData";

const CameraController = ({ selectedPlanet }) => {
  const { camera, gl } = useThree(); // Get camera and WebGL renderer
  const controlsRef = useRef();

  useFrame(() => {
    if (selectedPlanet && selectedPlanet.mesh) {
      const { position } = selectedPlanet.mesh;
      const targetPosition = position.clone().add(new THREE.Vector3(0, 10, 20));

      camera.position.lerp(targetPosition, 0.05);
      camera.lookAt(position);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(position, 0.1);
      }
    }
  });

  return <OrbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
};

const RotatingPlanets = ({ onPlanetClick }) => {
  const groupRef = useRef();
  const planetRefs = useRef([]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((planet, index) => {
        const data = planetData[index];
        if (data) {
          const angle = elapsed * data.speed;
          planet.position.x = data.distance * Math.cos(angle);
          planet.position.z = data.distance * Math.sin(angle);
          planet.rotation.y += 0.02; // Self-rotation
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {planetData.map((data, index) => (
        <Planet
          key={index}
          {...data}
          onPlanetClick={onPlanetClick}
          ref={(el) => (planetRefs.current[index] = el)}
        />
      ))}
    </group>
  );
};

const Experience = ({ onPlanetSelect }) => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const handlePlanetClick = (name, mesh) => {
    if (!mesh) return;
    setSelectedPlanet({ name, mesh });
    if (onPlanetSelect) onPlanetSelect(name);
  };

  const handleCanvasClick = (event) => {
    if (!event.intersections || event.intersections.length === 0) {
      setSelectedPlanet(null);
    }
  };

  return (
    <Canvas camera={{ position: [0, 50, 150] }} shadows onPointerMissed={handleCanvasClick}>
      <ambientLight intensity={0.3} />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade />
      <Sun />
      <RotatingPlanets onPlanetClick={handlePlanetClick} />
      {planetData.map((data, index) => (
        <Orbit key={index} distance={data.distance} />
      ))}
      <CameraController selectedPlanet={selectedPlanet} />
      <OrbitControls enableDamping={true} dampingFactor={0.05} rotateSpeed={0.8} />
    </Canvas>
  );
};

export default Experience;
