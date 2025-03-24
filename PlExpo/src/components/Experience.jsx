import React, { useRef, useEffect } from "react";
import { useThree, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const Experience = () => {
  const { scene, camera, gl } = useThree();
  const planets = useRef([]);
  const sunRef = useRef(null);
  const texturesLoaded = useRef(false);

  // 🌞 Load Textures
  const sunTexture = useLoader(THREE.TextureLoader, "/img/sun_hd.jpg");
  const ringTexture = useLoader(THREE.TextureLoader, "/img/saturn_ring.jpg");

  useEffect(() => {
    // 🌞 Create Sun (Only Once)
    if (!sunRef.current) {
      const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
      const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      scene.add(sun);
      sunRef.current = sun;
    }

    // 💡 Add Lighting (Only Once)
    if (planets.current.length === 0) {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(50, 50, 50);
      scene.add(directionalLight);

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
    { size: 6, texture: "/img/saturn_hd.jpg", distance: 90, hasRing: true }, // 🌟 Saturn with a ring
    { size: 4.5, texture: "/img/uranus_hd.jpg", distance: 110, hasRing: false }, // 🌟 Uranus with a ring
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
        // Create Planet
        const geometry = new THREE.SphereGeometry(data.size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ map: textures[index] });
        const planet = new THREE.Mesh(geometry, material);

        // Set initial position
        planet.position.set(data.distance, 0, 0);
        scene.add(planet);
        
        // Path
        const orbitGeometry = new THREE.CircleGeometry(data.distance, 64)
        const orbitEdges = new THREE.EdgesGeometry(orbitGeometry);
        const orbitMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          opacity: 0.5,
          transparent: true,
        });
      
        const orbit = new THREE.LineSegments(orbitEdges, orbitMaterial);
        orbit.rotation.x = Math.PI / 2; // Rotate to match the solar system plane
        scene.add(orbit);

        // Create Rings
        if (data.hasRing) {
          const ringGeometry = new THREE.RingGeometry(data.size * 1.5, data.size * 2, 64);
          const ringMaterial = new THREE.MeshStandardMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: .6,
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

  // 🔄 Animate Orbits
  useFrame(() => {
    planets.current.forEach((planetData, index) => {
      const speed = 0.001 * (index + 1);
      planetData.angle += speed;
      planetData.mesh.position.x = Math.cos(planetData.angle) * planetData.distance;
      planetData.mesh.position.z = Math.sin(planetData.angle) * planetData.distance;
    });
  });

  return <OrbitControls args={[camera, gl.domElement]} />;
};

export default Experience;
