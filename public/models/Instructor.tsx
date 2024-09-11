import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from 'three';
import { Group, SkinnedMesh, Object3D, Material } from "three";
import modelPath from "./avatar.glb";

type GLTFResult = {
  nodes: {
    avaturn_body: SkinnedMesh;
    avaturn_hair_0: SkinnedMesh;
    avaturn_look_0: SkinnedMesh;
    avaturn_shoes_0: SkinnedMesh;
    Hips: Object3D;
  };
  materials: {
    avaturn_body_material: Material;
    avaturn_hair_0_material: Material;
    avaturn_look_0_material: Material;
    avaturn_shoes_0_material: Material;
  };
  animations: THREE.AnimationClip[];
};

type InstructorProps = JSX.IntrinsicElements["group"] & {
  isSpeaking: boolean;
};

export default function Instructor({ isSpeaking, ...props }: InstructorProps) {
  const group = useRef<Group>(null);
  
  const { nodes, materials, animations } = useGLTF(modelPath) as unknown as GLTFResult;
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    const idleAction = actions["IdleV4.2(maya_head)"];
    const handsAction = actions["Hands"];

    if (idleAction && handsAction) {
      if (isSpeaking) {
        idleAction.stop();
        handsAction.reset().play();
      } else {
        handsAction.stop();
        idleAction.reset().play();
      }
    }
  }, [isSpeaking, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="hadi-ghazi">
          <skinnedMesh
            name="avaturn_body"
            geometry={nodes.avaturn_body.geometry}
            material={materials.avaturn_body_material}
            skeleton={nodes.avaturn_body.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_0"
            geometry={nodes.avaturn_hair_0.geometry}
            material={materials.avaturn_hair_0_material}
            skeleton={nodes.avaturn_hair_0.skeleton}
          />
          <skinnedMesh
            name="avaturn_look_0"
            geometry={nodes.avaturn_look_0.geometry}
            material={materials.avaturn_look_0_material}
            skeleton={nodes.avaturn_look_0.skeleton}
          />
          <skinnedMesh
            name="avaturn_shoes_0"
            geometry={nodes.avaturn_shoes_0.geometry}
            material={materials.avaturn_shoes_0_material}
            skeleton={nodes.avaturn_shoes_0.skeleton}
          />
          <primitive object={nodes.Hips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(modelPath);
