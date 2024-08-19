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
    </Canvas>
  );
}

export default Environment;
