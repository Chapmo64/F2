import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const CameraModes = ({ selectedPlanet, cameraMode }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useFrame(() => {
    let targetPos, lookAt;
  
    if (cameraMode === "planet" && selectedPlanet?.mesh) {
      const pos = selectedPlanet.mesh.getWorldPosition(new THREE.Vector3());
      targetPos = pos.clone().add(new THREE.Vector3(0, 10, 20));
      lookAt = pos;
    } else if (cameraMode === "top") {
      if (selectedPlanet?.mesh) {
        const pos = selectedPlanet.mesh.getWorldPosition(new THREE.Vector3());
        targetPos = pos.clone().add(new THREE.Vector3(0, 20, 40));
        lookAt = pos;
      } else {
        targetPos = new THREE.Vector3(80, 90, 10);
        lookAt = new THREE.Vector3(80, 0, 0);
      }
    } else if (cameraMode === "side") {
      targetPos = new THREE.Vector3(90, 50, 0);
      lookAt = new THREE.Vector3(0, 0, 0);
    } else {
      targetPos = new THREE.Vector3(0, 80, 180);
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
  

  useEffect(() => {
    if (!controlsRef.current) return;
    const isLocked = cameraMode === "side";
    controlsRef.current.enabled = !isLocked;
  }, [cameraMode]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.1}
      enablePan={cameraMode !== "side"}
      enableZoom={cameraMode !== "side"}
      enableRotate={cameraMode !== "side"}
    />
  );
};

export default CameraModes;
