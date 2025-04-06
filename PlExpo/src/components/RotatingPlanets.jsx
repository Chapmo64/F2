import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import planetData from "./planetData";
import Planet from "./Planet";

const RotatingPlanets = ({ onPlanetClick, planetRefs, layout }) => {
  const groupRef = useRef();
  const [isSnapped, setIsSnapped] = useState(false);

  useEffect(() => {
    if (layout === "line" && groupRef.current) {
      groupRef.current.children.forEach((planet, i) => {
        planet.position.set(i * 15 + 20, 0, 0);
        planet.rotation.y = 0;
      });
      setIsSnapped(true);
    } else {
      setIsSnapped(false);
    }
  }, [layout]);
  

  useFrame(({ clock }) => {
    if (!isSnapped && layout === "orbit") {
      const elapsed = clock.getElapsedTime();
      groupRef.current?.children.forEach((planet, i) => {
        const data = planetData[i];
        const angle = elapsed * data.speed;
        planet.position.set(
          data.distance * Math.cos(angle),
          0,
          data.distance * Math.sin(angle)
        );
      });
    }

  groupRef.current?.children.forEach((planet) => {
      planet.rotation.y += 0.01;
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

export default RotatingPlanets;
