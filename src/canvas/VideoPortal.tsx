import * as THREE from 'three'
import { useEffect, useMemo } from 'react'

export function VideoPortal({ url }: { url: string }){
  const video = useMemo(()=>{
    const v = document.createElement('video')
    v.src = url
    v.crossOrigin = 'anonymous'
    v.loop = true
    v.muted = true
    ;(v as any).playsInline = true
    return v
  },[url])

  const texture = useMemo(()=> new THREE.VideoTexture(video), [video])
  useEffect(()=> { video.play().catch(()=>{}) }, [video])

  return (
    <mesh position={[0,0,-0.01]}>
      <planeGeometry args={[2.4, 2.4]} />
      <meshBasicMaterial map={texture} toneMapped={false}/>
    </mesh>
  )
}
