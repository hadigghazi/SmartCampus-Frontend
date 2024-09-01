import React from "react";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";
import { Mesh } from "three";

const Experience: React.FC = () => {
  return (
    <>
      <Float
        rotation-x={-Math.PI / 4}
        floatIntensity={1}
        speed={2}
        rotationIntensity={2}
      >
        <Book />
      </Float>
      <OrbitControls />
      <Environment preset="studio" />
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <mesh
        position-y={-1.5}
        rotation-x={-Math.PI / 2}
        receiveShadow
        ref={(mesh) => {
          if (mesh) {
            (mesh as Mesh).receiveShadow = true;
          }
        }}
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};

export default Experience;
