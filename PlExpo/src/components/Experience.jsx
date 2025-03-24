import React, { useRef, useEffect } from "react";
import { useThree, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const Experience = () => {
  const { scene, camera, gl } = useThree();
  const planets = useRef([]);
  const sunRef = useRef(null);
  const orbits = useRef([]);
  const texturesLoaded = useRef(false);

  // 🌞 Load Textures
  const sunTexture = useLoader(THREE.TextureLoader, "/img/sun_hd.jpg");
  const ringTexture = useLoader(THREE.TextureLoader, "/img/saturn_ring.jpg");

  useEffect(() => {
    // 🌞 Create Sun (Only Once)
    if (!sunRef.current) {
      const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
      const sunMaterial = new THREE.MeshStandardMaterial({ 
        map: sunTexture, 
        emissive: 0xffaa00, 
        emissiveIntensity: 2.0 
      });

      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.castShadow = false; // Prevent Sun from blocking light

      // ☀️ Directional Light (Simulating Sunlight)
      const sunLight = new THREE.DirectionalLight(0xffffff, 5);
      sunLight.position.set(50, 50, 50); // Simulates sunlight angle
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 4096;
      sunLight.shadow.mapSize.height = 4096;
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 500;
      sunLight.shadow.bias = -0.0005;

      // 🌍 Hemisphere Light (Soft Global Light)
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.8);
      scene.add(hemiLight); // Adds soft ambient light

      scene.add(sunLight);
      scene.add(sun);
      sunRef.current = sun;
    }

    // 💡 Ambient Light (Extra Softness)
    if (planets.current.length === 0) {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);      
      camera.position.set(0, 50, 150);
    }
  }, [scene, camera, sunTexture]);

  // 🪐 Planet Data
  const planetData = [
    { size: 2, texture: "/img/mercury_hd.jpg", distance: 20, hasRing: false },
    { size: 3, texture: "/img/venus_hd.jpg", distance: 30, hasRing: false },
    { size: 3.5, texture: "/img/earth_hd.jpg", distance: 40, hasRing: false },
    { size: 2.8, texture: "/img/mars_hd.jpg", distance: 50, hasRing: false },
    { size: 7, texture: "/img/jupiter_hd.jpg", distance: 70, hasRing: false },
    { size: 6, texture: "/img/saturn_hd.jpg", distance: 90, hasRing: true },
    { size: 4.5, texture: "/img/uranus_hd.jpg", distance: 110, hasRing: false },
    { size: 4, texture: "/img/neptune_hd.jpg", distance: 130, hasRing: false },
  ];

  // 🎨 Load Planet Textures
  const textures = useLoader(
    THREE.TextureLoader,
    planetData.map((data) => data.texture)
  );

  // 🔄 Create Planets, Rings, and Orbits
  useEffect(() => {
    if (!texturesLoaded.current) {
      planetData.forEach((data, index) => {
        // 🌍 Create Planet
        const geometry = new THREE.SphereGeometry(data.size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ 
          map: textures[index], 
          roughness: 0.7, 
          metalness: 0, 
          emissive: 0x111111, 
          emissiveIntensity: 0.2 
        });

        const planet = new THREE.Mesh(geometry, material);
        planet.castShadow = true;
        planet.receiveShadow = true;

        // Set random orbit positions
        const angle = Math.random() * Math.PI * 2;
        planet.position.set(
          Math.cos(angle) * data.distance, 
          0, 
          Math.sin(angle) * data.distance
        );

        scene.add(planet);

        // 💍 Create Rings (If applicable)
        if (data.hasRing) {
          const ringGeometry = new THREE.RingGeometry(data.size * 1.5, data.size * 2, 64);
          const ringMaterial = new THREE.MeshStandardMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6,
          });

          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.x = Math.PI / 2;

          if (data.texture.includes("saturn")) {
            ring.rotation.x = Math.PI / 3; // Saturn's tilt
          }

          planet.add(ring);
        }

        planets.current.push({
          mesh: planet,
          distance: data.distance,
          angle,
        });
      });

      texturesLoaded.current = true;
    }

    // 🛤️ Create Orbit Paths
    planetData.forEach((data) => {
      const orbitGeometry = new THREE.CircleGeometry(data.distance, 128);
      const orbitEdges = new THREE.EdgesGeometry(orbitGeometry);
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.3, // Soft orbit visibility
        transparent: true,
      });

      const orbit = new THREE.LineSegments(orbitEdges, orbitMaterial);
      orbit.rotation.x = Math.PI / 2; // Rotate to lie flat
      scene.add(orbit);

      orbits.current.push({ mesh: orbit, distance: data.distance });
    });
  }, [scene, textures]);

  // 🔄 Animate Orbits & Adjust Orbit Brightness
  useFrame(() => {
    planets.current.forEach((planetData, index) => {
      const speed = 0.001 * (index + 1);
      planetData.angle += speed;

      // Update planet position
      planetData.mesh.position.x = Math.cos(planetData.angle) * planetData.distance;
      planetData.mesh.position.z = Math.sin(planetData.angle) * planetData.distance;

      // Adjust orbit visibility
      const orbit = orbits.current[index].mesh;
      const distanceFromCamera = Math.abs(camera.position.z - planetData.mesh.position.z);
      const brightnessFactor = 1 - Math.min(distanceFromCamera / 150, 0.8);
      orbit.material.opacity = brightnessFactor * 0.8 + 0.2;
    });
  });

  return <OrbitControls args={[camera, gl.domElement]} />;
};

export default Experience;
