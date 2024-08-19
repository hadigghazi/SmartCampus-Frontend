import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Gltf, Environment } from '@react-three/drei';
import Instructor from '../../../public/models/Instructor';

const Experience: React.FC = () => {
  return (
    <Canvas>
      <OrbitControls />
      <Environment preset="sunset" />
      <ambientLight intensity={0.8} color={"pink"} />
      
      <Gltf
        src="/models/classroom.glb"
        position={[0, -8, 0]}
        rotation={[0, Math.PI, 0]}
      />
      <Instructor
        src="/models/avatar.glb"
        scale={(7)}
        position={[-11, -7.95, -14]}
        rotation={[0, 0.5, 0]}
       />
    </Canvas>
  );
}

export default Experience;
