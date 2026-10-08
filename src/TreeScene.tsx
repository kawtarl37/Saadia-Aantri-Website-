import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Vector2, type Group } from "three";
export const applePositions = [
  [26, 29],
  [52, 19],
  [75, 34],
];
function Fruit({ x, y, index }: { x: number; y: number; index: number }) {
  const group = useRef<Group>(null);
  const appleProfile = useMemo(
    () => [[0,-.39],[.1,-.41],[.25,-.35],[.36,-.18],[.4,.02],[.37,.22],[.27,.34],[.14,.32],[.07,.25],[0,.25]].map(([radius,height]) => new Vector2(radius,height)),
    [],
  );
  const viewport = useThree((s) => s.viewport);
  useFrame(({ clock }) => {
    if (group.current)
      group.current.rotation.z =
        Math.sin(clock.elapsedTime * 0.6 + index) * 0.035;
  });
  return (
    <group
      ref={group}
      position={[
        ((x - 50) / 100) * viewport.width,
        ((50 - y) / 100) * viewport.height,
        0,
      ]}
    >
      <Float speed={0.7} rotationIntensity={0.08} floatIntensity={0.12}>
        <mesh scale={[1, 1, .7]}>
          <latheGeometry args={[appleProfile, 32]} />
          <meshStandardMaterial color="#4D0E12" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.36, 0]} rotation={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.025, 0.035, 0.2, 8]} />
          <meshStandardMaterial color="#4A2E27" />
        </mesh>
        <mesh
          position={[0.13, 0.42, 0]}
          rotation={[0, 0, -0.5]}
          scale={[0.14, 0.045, 0.025]}
        >
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#4A2E27" />
        </mesh>
      </Float>
    </group>
  );
}
export default function TreeScene({
  onReady,
  onFailure,
}: {
  onReady: () => void;
  onFailure: () => void;
}) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 70 }}
      frameloop="always"
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onFailure, {
          once: true,
        });
        onReady();
      }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[-3, 5, 4]} intensity={3} />
      {applePositions.map(([x, y], index) => (
        <Fruit key={index} x={x} y={y} index={index} />
      ))}
    </Canvas>
  );
}
