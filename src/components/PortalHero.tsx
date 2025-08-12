// src/components/PortalHero.tsx
import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/** Small helper shapes so the hero always renders (no external models). */
function Rock({ seed = 0 }: { seed?: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const color = useMemo(
    () => new THREE.Color().setHSL((seed * 0.137) % 1, 0.25, 0.6),
    [seed]
  );
  useFrame((_, d) => {
    mesh.current.rotation.x += 0.25 * d;
    mesh.current.rotation.y -= 0.18 * d;
  });
  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <icosahedronGeometry args={[0.35, 0]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

function Cube({ seed = 0 }: { seed?: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const color = useMemo(
    () => new THREE.Color().setHSL((0.6 + seed * 0.21) % 1, 0.2, 0.7),
    [seed]
  );
  useFrame((_, d) => {
    mesh.current.rotation.x += 0.2 * d;
    mesh.current.rotation.z += 0.15 * d;
  });
  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <boxGeometry args={[0.48, 0.48, 0.48]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.15} />
    </mesh>
  );
}

function Torus({ glass = false }: { glass?: boolean }) {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_, d) => {
    mesh.current.rotation.y -= 0.35 * d;
  });
  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <torusKnotGeometry args={[0.26, 0.08, 100, 16]} />
      {glass ? (
        <meshPhysicalMaterial
          metalness={0.1}
          roughness={0.05}
          transmission={0.9}
          thickness={0.6}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.15}
          color="#b9b5ff"
        />
      ) : (
        <meshStandardMaterial color="#b9b5ff" roughness={0.25} metalness={0.25} />
      )}
    </mesh>
  );
}

export default function PortalHero() {
  const [webglReady, setWebglReady] = useState(true);

  const onCreated = (state: any) => {
    const webgl2 = !!state.gl?.capabilities?.isWebGL2;
    setWebglReady(webgl2);
  };

  return (
    <div style={wrapStyle}>
      {/* soft glows */}
      <div style={{ ...glowStyle, ...pinkGlow }} aria-hidden />
      <div style={{ ...glowStyle, ...blueGlow }} aria-hidden />

      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        onCreated={onCreated}
      >
        <color attach="background" args={["#0a0b10"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 2]} intensity={0.8} />

        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.8}>
          <group position={[-1.2, 0.2, 0]}>
            <Rock seed={1} />
          </group>
        </Float>
        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.7}>
          <group position={[0.8, -0.2, 0.2]}>
            <Cube seed={2} />
          </group>
        </Float>
        <Float speed={0.9} rotationIntensity={0.4} floatIntensity={0.9}>
          <group position={[0.2, 0.35, -0.3]}>
            <Torus glass />
          </group>
        </Float>

        <ContactShadows position={[0, -0.85, 0]} opacity={0.25} scale={10} blur={1.6} far={2} />
      </Canvas>

      {!webglReady && (
        <div style={fallback}>
          Your browser disabled WebGL2. Showing a static card instead.
        </div>
      )}
    </div>
  );
}

/* — inline styles — */
const wrapStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: 260,
  borderRadius: 16,
  overflow: "hidden",
  border: "1px solid rgba(0,0,0,.06)",
  background: "linear-gradient(180deg, #0c0f16, #0a0d14)",
  boxShadow: "0 24px 60px rgba(0,0,0,.35)",
};

const glowStyle: React.CSSProperties = {
  position: "absolute",
  inset: -20,
  pointerEvents: "none",
  mixBlendMode: "screen",
  filter: "blur(16px)",
};

const pinkGlow: React.CSSProperties = {
  background:
    "radial-gradient(60% 50% at 50% 35%, rgba(255,45,184,0.25) 0%, transparent 70%)",
};

const blueGlow: React.CSSProperties = {
  background:
    "radial-gradient(55% 45% at 50% 30%, rgba(155,140,255,0.20) 0%, transparent 70%)",
};

const fallback: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  color: "white",
  fontWeight: 600,
};
