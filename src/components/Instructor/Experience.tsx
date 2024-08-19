import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Instructor from "../../../public/models/Instructor";
import Classroom from "../../../public/models/Classroom";
import { CameraManager } from "./CameraManager";

const Experience: React.FC = () => {
  return (
    <Canvas className="canvas" camera={{ position: [0, 0, 5.5] }}>
      <CameraManager />
      <OrbitControls enableZoom={true} />
      <Environment preset="sunset" />
      <ambientLight intensity={0.8} color={"pink"} />

      <Classroom position={[0, -8, 0]} rotation={[0, Math.PI, 0]} />

      <Instructor
        scale={(7)}
        position={[-12, -7.95, -14]}
        rotation={[0, 1, 0]}
      />
    </Canvas>
  );
};

export default Experience;
