import { Environment, Gltf, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Instructor from "../../../public/models/Instructor";
import { CameraManager } from "./CameraManager";

const Experience: React.FC = () => {
  return (
    <Canvas className="canvas" camera={{ position: [-3, 1.5, 0], fov: 50 }}>
      <CameraManager />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        target={[0, 1.5, 0]} 
        minPolarAngle={Math.PI / 2} 
        maxPolarAngle={Math.PI / 1} 
      />
      <Environment preset="sunset" />
      <ambientLight intensity={0.8} color={"pink"} />

      <Gltf
        src="../../../public/models/basic_classroom.glb"
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
      />

      <Instructor
        scale={1.1}
        position={[0.7, 0, -2]}
        rotation={[0, -0.4, 0]}
      />
    </Canvas>
  );
};

export default Experience;
