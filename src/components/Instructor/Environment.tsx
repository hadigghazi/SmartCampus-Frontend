import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Gltf } from '@react-three/drei';

const Environment: React.FC = () => {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight />
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
