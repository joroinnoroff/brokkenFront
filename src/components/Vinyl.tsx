"use client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function VinylModel() {

  const [scale, setScale] = useState(20);

  // MatchMedia logic
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setScale(e.matches ? 30 : 20); // If mobile/tablet → scale 30
    };

    // Run once on mount
    handleMediaChange(mediaQuery);

    // Listen to changes
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const ref = useRef<THREE.Group>(null);
  const gltf = useGLTF("/vinylModel/scene.gltf");

  useFrame(() => {
    if (ref.current) {
      // Spin around Y axis (vertical axis)
      ref.current.rotation.y += 0.01; // adjust speed as needed
      // Keep it perfectly upright
      ref.current.rotation.x = -1.2;
      ref.current.rotation.z = 0.5;
    }
  });

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={scale}           // adjust scale if too small/big
      position={[0, -1, 0]} // center vertically
    />
  );
}

export default function Vinyl() {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 0, 12], fov: 35 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <VinylModel />
      </Canvas>
    </div>

  );
}