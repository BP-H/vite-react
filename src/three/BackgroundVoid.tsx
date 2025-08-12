import { Canvas } from "@react-three/fiber";
import { Float, Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

function Grid() {
  const geo = useMemo(() => new THREE.PlaneGeometry(200, 200, 80, 80), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, -6]} geometry={geo}>
      <meshBasicMaterial color="#e6ebf4" wireframe transparent opacity={0.22} />
    </mesh>
  );
}

function PeopleOrbs() {
  const count = 12;
  const positions = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const r = 6.5;
        return [Math.cos(a) * r, Math.sin(a) * 0.8, -8 - (i % 3) * 0.4] as [number, number, number];
      }),
    []
  );
  return (
    <Instances limit={count}>
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial
        color="#7b83ff"
        emissive="#9aa2ff"
        emissiveIntensity={0.18}
        roughness={0.25}
        metalness={0.55}
      />
      {positions.map((p, i) => (
        <Float key={i} floatIntensity={0.7} rotationIntensity={0.3} speed={1 + (i % 3) * 0.2}>
          <Instance position={p} />
        </Float>
      ))}
    </Instances>
  );
}

export default function BackgroundVoid() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 50 }}>
        <color attach="background" args={["#f5f7fb"]} />
        <fog attach="fog" args={["#eef1f7", 10, 40]} />
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 8, 3]} intensity={0.6} />
        <Grid />
        <PeopleOrbs />
      </Canvas>
    </div>
  );
}
