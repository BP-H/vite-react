// src/three/BackgroundVoid.tsx
import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

function Starfield({ count = 8000, radius = 80 }) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random()) // denser center
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      p[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      p[i * 3 + 2] = r * Math.cos(phi)
    }
    return p
  }, [count, radius])

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y -= dt * 0.03
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial size={0.02} sizeAttenuation depthWrite={false} transparent opacity={0.6} />
    </Points>
  )
}

function WireKnot() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.14
      ref.current.rotation.y += dt * 0.1
    }
  })
  return (
    <Float speed={1} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh ref={ref}>
        <torusKnotGeometry args={[1.5, 0.42, 180, 24]} />
        <meshBasicMaterial wireframe color={'#7f6dff'} />
      </mesh>
    </Float>
  )
}

export default function BackgroundVoid() {
  // Rendered as a fixed, pointer‑transparent background
  return (
    <Canvas
      id="bg3d"
      gl={{ antialias: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 60 }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#05060a']} />
        <fog attach="fog" args={['#05060a', 30, 120]} />
        <Starfield count={9000} radius={90} />
        <group position={[0, 0, -3]}>
          <WireKnot />
        </group>
      </Suspense>
    </Canvas>
  )
}
