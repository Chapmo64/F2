import React, { forwardRef, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Text, Billboard } from "@react-three/drei";

const Planet = forwardRef(({ name, texture, size, onPlanetClick }, ref) => {
  const colorMap = useLoader(TextureLoader, texture);
  const meshRef = useRef();

  return (
    <group>
      <mesh
        ref={(node) => {
          meshRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPlanetClick(name, e.object); // e.object = actual planet mesh
        }}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={colorMap} />
      </mesh>

      {/* Always-facing name tag */}
      <Billboard>
        <Text
          position={[0, size + 2, 0]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      </Billboard>
    </group>
  );
});

export default Planet;
