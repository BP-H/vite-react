import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Text } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { PostCard } from "./Feed2D";

export default function World3D({ post, onBack }: { post: PostCard; onBack: () => void }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // initial state: bright white → quickly fade to the world
    const t = setTimeout(() => setRevealed(true), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="world-wrap">
      <div className="world-topbar">
        <button className="pill" onClick={onBack}>Back to Feed</button>
        <div className="crumb">Portal • {post.title}</div>
      </div>

      <Canvas camera={{ position: [0, 2.2, 6], fov: 45 }} dpr={[1, 2]}>
        {/* BRIGHT WHITE VOID that then reveals the world */}
        <color attach="background" args={[revealed ? post.world === "void" ? "#ffffff" : "#0b0c0f" : "#ffffff"]} />
        {post.world === "void" ? <fog attach="fog" args={["#ffffff", 4, 14]} /> : null}

        <ambientLight intensity={post.world === "void" ? 1.1 : 0.4} />
        <directionalLight position={[3, 5, 7]} intensity={post.world === "void" ? 0.4 : 0.9} />

        {/* Scene selection */}
        {post.world === "void" && <VoidUniverse tint={post.palette[2]} />}
        {post.world === "knots" && <KnotRealm color={post.palette[2]} />}
        {post.world === "ocean" && <OceanRealm color={post.palette[2]} />}

        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}

function VoidUniverse({ tint = "#6a73ff" }) {
  // A minimal bright infinity with floating “post cards”
  const cards = useMemo(() => {
    const arr: { p: THREE.Vector3; r: number }[] = [];
    for (let i = 0; i < 16; i++) {
      arr.push({
        p: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.3) * 4,
          (Math.random() - 0.5) * 8
        ),
        r: Math.random() * 0.8 + 0.2,
      });
    }
    return arr;
  }, []);
  return (
    <group>
      <Text position={[0, 2.6, 0]} fontSize={0.5} color="#222" anchorX="center" anchorY="middle">
        white void
      </Text>
      {cards.map((c, i) => (
        <Float key={i} speed={0.8 + (i % 3) * 0.2} rotationIntensity={0.2} floatIntensity={0.6}>
          <mesh position={c.p}>
            <planeGeometry args={[1.6 + c.r, 0.9 + c.r * 0.4, 1, 1]} />
            <meshPhysicalMaterial color={tint} roughness={0.95} transparent opacity={0.18} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function KnotRealm({ color = "#6a73ff" }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    g.current.rotation.y += dt * 0.3;
  });
  return (
    <group ref={g}>
      <Float speed={1} rotationIntensity={0.7} floatIntensity={0.6}>
        <mesh>
          <torusKnotGeometry args={[1.6, 0.36, 200, 32]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
        </mesh>
      </Float>
      {[...Array(6)].map((_, i) => (
        <Float key={i} speed={0.6 + i * 0.1} rotationIntensity={0.3}>
          <mesh position={[Math.sin(i) * 3, Math.cos(i * 1.3) * 1.2, Math.cos(i) * 3]}>
            <icosahedronGeometry args={[0.25 + (i % 3) * 0.12]} />
            <meshStandardMaterial color={color} roughness={0.7} metalness={0.15} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function OceanRealm({ color = "#7bb3ff" }) {
  const ref = useRef<THREE.Mesh>(null!);
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    const geo = ref.current.geometry as THREE.PlaneGeometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 1.7 + t.current * 1.1) * 0.35 + Math.cos(y * 1.9 + t.current * 0.8) * 0.22);
    }
    pos.needsUpdate = true;
    (geo as any).computeVertexNormals?.();
  });
  return (
    <group>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <planeGeometry args={[40, 40, 180, 180]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
      </mesh>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.6}>
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.35, 48, 48]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
        </mesh>
      </Float>
    </group>
  );
}
