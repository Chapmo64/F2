import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare";

const Sun = () => {
  const sunRef = useRef();
  const { scene } = useThree();

  const texture = useLoader(THREE.TextureLoader, "/img/sun_hd.jpg");
  const flareTexture = useLoader(THREE.TextureLoader, "/img/lensflare2.png");

  useEffect(() => {
    const lensflare = new Lensflare();

    const addFlareElement = (size, distance) => {
      const material = new THREE.SpriteMaterial({
        map: flareTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const element = new LensflareElement(flareTexture, size, distance, material);
      lensflare.addElement(element);
    };

    addFlareElement(700, 0);
    addFlareElement(300, 0.2);
    addFlareElement(120, 0.4);
    addFlareElement(70, 0.6);

    if (sunRef.current) {
      sunRef.current.add(lensflare);
    }
  }, [flareTexture]);

  useFrame(({ clock }) => {
    const pulse = 1 + 0.05 * Math.sin(clock.elapsedTime * 2);
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
      sunRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[8, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        emissive={new THREE.Color(0xffaa00)}
        emissiveIntensity={5}
        color={0xffffff}
      />
    </mesh>
  );
};

export default Sun;
