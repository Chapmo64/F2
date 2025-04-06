// CameraModes.jsx
import React, { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const CameraModes = ({ selectedPlanet, cameraMode }) => {
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
    } else {
      // Handle views
      let targetPos, lookAt;

      switch (cameraMode) {
        case "top":
          targetPos = new THREE.Vector3(80, 90, 10);  // Zoomed above to see planets in a line
          lookAt = new THREE.Vector3(80, 0, 0);
          break;
        case "side":
          targetPos = new THREE.Vector3(0, 50, 150);
          lookAt = new THREE.Vector3(0, 0, 0);
          break;
        default:
          targetPos = new THREE.Vector3(0, 80, 90);
          lookAt = new THREE.Vector3(0, 0, 0);
      }

      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(lookAt);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(lookAt, 0.1);
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


export default CameraModes;
