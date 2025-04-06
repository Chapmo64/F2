// CameraModes.jsx
import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const CameraModes = ({ selectedPlanet, cameraMode }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useFrame(() => {
    let targetPos, lookAt;

    if (selectedPlanet?.mesh && cameraMode === "top") {
      // Rotate around selected planet in Top View
      const position = selectedPlanet.mesh.position;
      targetPos = position.clone().add(new THREE.Vector3(0, 10, 20));
      lookAt = position;
    } else {
      switch (cameraMode) {
        case "top":
          targetPos = new THREE.Vector3(80, 90, 10);
          lookAt = new THREE.Vector3(80, 0, 0);
          break;
        case "side":
          targetPos = new THREE.Vector3(90, 50, 0);
          lookAt = new THREE.Vector3(0, 0, 0);
          break;
          
        default: 
          return;
      }
    }

    if (targetPos && lookAt) {
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(lookAt);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(lookAt, 0.1);
        controlsRef.current.update();
      }
    }
  });

  // Set enable/disable control on view change
  useEffect(() => {
    if (!controlsRef.current) return;
    if (cameraMode === "side") {
      controlsRef.current.enabled = false; // Restrict mouse movement
    } else {
      controlsRef.current.enabled = true; // Allow control in free & top
    }
  }, [cameraMode]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.1}
    />
  );
};

export default CameraModes;
