import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";

const SatelliteDot = ({ planetMesh, offset = 5, speed = 0.5, name, showLabel }) => {
  const dotRef = useRef();

  useFrame(({ clock }) => {
    if (planetMesh?.current && dotRef.current) {
      const t = clock.getElapsedTime() * speed;
      const center = planetMesh.current.getWorldPosition(new THREE.Vector3());

      const x = center.x + offset * Math.cos(t);
      const z = center.z + offset * Math.sin(t);
      const y = center.y + Math.sin(t * 2); // Small vertical bob

      dotRef.current.position.set(x, y, z);
    }
  });

  return (
    <group ref={dotRef}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial emissive={"aqua"} emissiveIntensity={1} />
      </mesh>
      {showLabel && (
        <Billboard>
          <Text fontSize={1} color="white" anchorX="center" position={[0, 1.2, 0]}>
            {name}
          </Text>
        </Billboard>
      )}
    </group>
  );
};

export default SatelliteDot;
