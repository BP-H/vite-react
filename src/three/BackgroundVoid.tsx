import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function Knot() {
  const ref = React.useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { ref.current.rotation.x += dt * 0.2; ref.current.rotation.y += dt * 0.3; });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref} position={[0,0,-6]}>
        <torusKnotGeometry args={[1.2, 0.35, 220, 32]} />
        <meshStandardMaterial color="#ff2db8" emissive="#ff2db8" emissiveIntensity={0.4} metalness={0.1} roughness={0.25}/>
      </mesh>
    </Float>
  );
}

export default function BackgroundVoid() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0 }}>
      <Canvas camera={{ position:[0,0,4], fov:60 }}>
        <color attach="background" args={["#06070c"]} />
        <hemisphereLight intensity={0.5} />
        <pointLight position={[5,5,5]} intensity={1} />
        <Stars radius={60} depth={40} factor={2} fade />
        <Knot />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
