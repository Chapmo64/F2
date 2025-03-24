import React, { useRef, useEffect } from "react";
import { useThree, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const Experience = () => {
  const { scene, camera, gl } = useThree();
  const planets = useRef([]);
  const sunRef = useRef(null);
  const orbits = useRef([]); // Store orbit lines
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
        emissive: 0xffaa00, // Makes Sun glow
        emissiveIntensity: 1.5 
      });
    
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    
      // 🌞 Create Sunlight (Inside the if block)
      const sunLight = new THREE.PointLight(0xffffff, 2, 500); // Color: white, Intensity: 2, Max Distance: 500
      sunLight.position.set(0, 0, 0); // Same position as the Sun
      sun.add(sunLight); // Attach the light to the Sun
    
      scene.add(sun);
      sunRef.current = sun;
    }
       

    // 💡 Add Lighting (Only Once)
    if (planets.current.length === 0) {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const sunLight = new THREE.PointLight(0xffffff, 2, 500); // Brightness: 2, Max Distance: 500
      sunLight.position.set(0, 0, 0); // Place at the Sun’s position
      scene.add(sunLight);      

      camera.position.set(0, 50, 150);
    }
  }, [scene, camera, sunTexture]);

  // 🪐 Planet Data (With Rings)
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

  // 🔄 Create Planets and Rings
  useEffect(() => {
    if (!texturesLoaded.current) {
      planetData.forEach((data, index) => {
        // 🌍 Create Planet
        const geometry = new THREE.SphereGeometry(data.size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ map: textures[index] });
        const planet = new THREE.Mesh(geometry, material);

        // Set initial position
        planet.position.set(data.distance, 0, 0);
        scene.add(planet);

        // 💍 Create Rings (If applicable)
        if (data.hasRing) {
          const ringGeometry = new THREE.RingGeometry(data.size * 1.5, data.size * 2, 64);
          const ringMaterial = new THREE.MeshStandardMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6, // Default transparency
          });

          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.x = Math.PI / 2; // Default flat ring

          if (data.texture.includes("saturn")) {
            ring.rotation.x = Math.PI / 3; // Saturn has a 27° tilt
          }

          planet.add(ring); // Attach ring to planet
        }

        planets.current.push({
          mesh: planet,
          distance: data.distance,
          angle: Math.random() * Math.PI * 2,
        });
      });

      texturesLoaded.current = true; // Prevent reloading
    }
  }, [scene, textures]);

  // Create Orbit Paths
  useEffect(() => {
    planetData.forEach((data) => {
      const orbitGeometry = new THREE.CircleGeometry(data.distance, 128);
      const orbitEdges = new THREE.EdgesGeometry(orbitGeometry);
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.1,
        transparent: true,
      });

      const orbit = new THREE.LineSegments(orbitEdges, orbitMaterial);
      orbit.rotation.x = Math.PI / 2; // Rotate to solar plane
      scene.add(orbit);

      orbits.current.push({ mesh: orbit, distance: data.distance });
    });
  }, [scene]);

  // Animate Orbits & Adjust Orbit Brightness
  useFrame(() => {
    planets.current.forEach((planetData, index) => {
      const speed = 0.001 * (index + 1);
      planetData.angle += speed;

      // Update planet position
      planetData.mesh.position.x = Math.cos(planetData.angle) * planetData.distance;
      planetData.mesh.position.z = Math.sin(planetData.angle) * planetData.distance;

      // 🎇 Adjust Orbit Brightness Based on Planet Position
      const orbit = orbits.current[index].mesh;
      const distanceFromCamera = Math.abs(camera.position.z - planetData.mesh.position.z);
      const brightnessFactor = 1 - Math.min(distanceFromCamera / 150, 0.8); // Max dim at distance 150

      orbit.material.opacity = brightnessFactor * 0.8 + 0.2; // Keeps opacity between 0.2 - 1
    });
  });

  return <OrbitControls args={[camera, gl.domElement]} />;
};

export default Experience;
