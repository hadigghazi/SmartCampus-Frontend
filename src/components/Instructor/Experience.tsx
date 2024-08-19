import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Gltf } from '@react-three/drei';

const Environment: React.FC = () => {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={1} color={"white"} />
      <directionalLight position={[0, 5, 0]} intensity={1} castShadow />
      <pointLight position={[0, 2, 0]} intensity={1} castShadow />
      <Gltf
        src="/models/classroom.glb"
        position={[0, -8, 0]}
        rotation={[0, Math.PI, 0]}
      />
      <Gltf
        src="/models/avatar.glb"
        scale={(7)}
        position={[-11, -7.95, -14]}
        rotation={[0, 0.5, 0]}
      />
    </Canvas>
  );
}

export default Environment;
