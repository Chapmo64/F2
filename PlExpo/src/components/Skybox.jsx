import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const Skybox = () => {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "/img/skybox/space_ft.png", // Front
      "/img/skybox/space_bk.png", // Back
      "/img/skybox/space_up.png", // Up
      "/img/skybox/space_dn.png", // Down
      "/img/skybox/space_rt.png", // Right
      "/img/skybox/space_lf.png", // Left
    ]);

    scene.background = texture;
  }, [scene]);

  return null;
};

export default Skybox;
