import * as THREE from 'three'
import { GroupProps, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useApp } from '../app/store'
import { MeshPortalMaterial } from '@react-three/drei'
import { VideoPortal } from './VideoPortal'

type Props = GroupProps & { shine?: number }

export function UniverseOrb({ shine=0.3, ...props }: Props){
  const ref = useRef<THREE.Mesh>(null!)
  const [hover, setHover] = useState(false)
  const { setActive } = useApp()

  useFrame((_,dt)=>{
    ref.current.rotation.y += dt * 0.1
  })

  return (
    <group {...props}>
      <mesh
        ref={ref}
        onPointerOver={()=>setHover(true)}
        onPointerOut={()=>setHover(false)}
        onClick={()=>setActive('active')}
      >
        <sphereGeometry args={[1.4, 64, 64]} />
        {/* Portal material: shows nested content within the sphere */}
        <MeshPortalMaterial side={THREE.DoubleSide}>
          <ambientLight intensity={0.6}/>
          <VideoPortal url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />
        </MeshPortalMaterial>
      </mesh>
      {/* Soft halo */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial transparent opacity={hover ? 0.45 : 0.25} color="#FFFFFF" />
      </mesh>
      {/* Emissive glint */}
      <mesh position={[0,0,0]}>
        <sphereGeometry args={[1.401, 32, 32]} />
        <meshStandardMaterial emissive={'#FFFFFF'} emissiveIntensity={shine * 0.6} color="#ffffff" roughness={0.2} metalness={0.5}/>
      </mesh>
    </group>
  )
}
