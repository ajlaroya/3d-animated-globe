"use client";
import { useEffect } from "react";

import initPlanet3D from "@/components/3D/planet";

export default function Home() {
  useEffect(() => {
    initPlanet3D();
  }, []);

  return (
    <div className="page">
      <section className="hero_main">
        <div className="content">
          <h1>Welcome to the GA.IA</h1>

          <p>
            AI agents that bring value to businesses and elevate workers
            productivity
          </p>

          <button className="cta_btn">Get started.</button>
        </div>
        <canvas className="planet-3D" />
      </section>
    </div>
  );
}
