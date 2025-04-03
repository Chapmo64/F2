// src/components/useNASAData.js
import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const API_URL = "https://api.le-systeme-solaire.net/rest/bodies/";

export function useNASAData(planetName) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!planetName) return;
    fetch(`${API_URL}${planetName.toLowerCase()}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((error) => console.error("Error fetching NASA data:", error));
  }, [planetName]);

  return data;
}
