import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const getRandomVector = () =>
  new THREE.Vector3(
    Math.random() * 300 - 150,
    Math.random() * 200 + 50,
    Math.random() * 300 - 150
  );

const ShootingStar = () => {
  const meshRef = useRef();
  const trailRef = useRef([]);
  const [start, setStart] = useState(getRandomVector());
  const [end, setEnd] = useState(getRandomVector());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStart(getRandomVector());
      setEnd(getRandomVector());
      setProgress(0);
      trailRef.current = [];
    }, 1000); // every 15s

    return () => clearInterval(interval);
  }, []);

  useFrame((_, delta) => {
    if (progress < 1) {
      const newProgress = Math.min(progress + delta * 0.3, 1);
      setProgress(newProgress);
      const currentPos = new THREE.Vector3().lerpVectors(start, end, newProgress);

      if (meshRef.current) {
        meshRef.current.position.copy(currentPos);
      }

      trailRef.current.push(currentPos.clone());
      if (trailRef.current.length > 30) trailRef.current.shift();
    }
  });

  return (
    <>
      {/* Shooting star head */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial emissive={"#ffffff"} emissiveIntensity={5} color="white" />
      </mesh>

      {/* Trail */}
      {trailRef.current.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            emissive="#aaaaff"
            emissiveIntensity={0.5 * (i / trailRef.current.length)}
            transparent
            opacity={0.2 * (i / trailRef.current.length)}
            color="white"
          />
        </mesh>
      ))}
    </>
  );
};

export default ShootingStar;
