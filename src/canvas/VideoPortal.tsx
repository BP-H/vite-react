import * as THREE from 'three'
import { useEffect, useMemo } from 'react'
import Hls from 'hls.js'

export function VideoPortal({ url }: { url: string }){
  const video = useMemo(() => {
    const v = document.createElement('video')
    v.crossOrigin = 'anonymous'
    v.loop = true
    v.muted = true
    ;(v as any).playsInline = true
    return v
  }, [])

  const texture = useMemo(() => new THREE.VideoTexture(video), [video])

  useEffect(() => {
    let hls: Hls | undefined
    if (url.endsWith('.m3u8') && Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(video)
    } else {
      video.src = url
    }
    video.play().catch(() => {})
    return () => {
      if (hls) hls.destroy()
    }
  }, [url, video])

  return (
    <mesh position={[0,0,-0.01]}>
      <planeGeometry args={[2.4, 2.4]} />
      <meshBasicMaterial map={texture} toneMapped={false}/>
    </mesh>
  )
}
