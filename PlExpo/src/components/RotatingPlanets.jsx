const RotatingPlanets = ({ onPlanetClick, planetRefs, layout }) => {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    groupRef.current?.children.forEach((planet, i) => {
      const data = planetData[i];

      if (layout === "line") {
        // Align planets in a line (top view mode)
        const sunOffset = 10;
        const spacing = 20;
        planet.position.set(sunOffset + i * spacing, 0, 0);
      } else {
        // Orbit mode
        const angle = elapsed * data.speed;
        planet.position.set(
          data.distance * Math.cos(angle),
          0,
          data.distance * Math.sin(angle)
        );
        planet.rotation.y += 0.01;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {planetData.map((data, i) => (
        <Planet
          key={i}
          {...data}
          onPlanetClick={onPlanetClick}
          ref={(el) => (planetRefs.current[i] = el)}
        />
      ))}
    </group>
  );
};
