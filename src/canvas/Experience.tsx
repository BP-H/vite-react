import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { UniverseField } from './UniverseField'

function Scene(){
  return (
    <>
      <color attach="background" args={['#f5f7fa']} />
      <fog attach="fog" args={['#f5f7fa', 10, 35]} />
      <hemisphereLight intensity={0.7} />
      <directionalLight position={[5,8,3]} intensity={0.7} />
      <Suspense fallback={null}>
        <UniverseField />
      </Suspense>
      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.8} />
        <Vignette eskil={false} offset={0.08} darkness={0.4} />
      </EffectComposer>
      <OrbitControls enablePan={false} minDistance={8} maxDistance={24} />
    </>
  )
}

export function Experience(){
  return (
    <Canvas dpr={[1,2]} camera={{ position:[0,1.5,14], fov:45 }}>
      <Scene/>
    </Canvas>
  )
}
