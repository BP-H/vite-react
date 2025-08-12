import { useMemo } from 'react'
import { UniverseOrb } from './UniverseOrb'

const N = 24
export function UniverseField(){
  // Fibonacci sphere for pleasing distribution
  const positions = useMemo(()=> {
    const pts: [number,number,number][] = []
    const phi = Math.PI * (3 - Math.sqrt(5))
    for(let i=0;i<N;i++){
      const y = 1 - (i / (N - 1)) * 2
      const radius = Math.sqrt(1 - y*y)
      const theta = phi * i
      pts.push([Math.cos(theta) * radius * 8, y * 6, Math.sin(theta) * radius * 8])
    }
    return pts
  },[])
  return (
    <>
      {positions.map((p,i)=>(
        <UniverseOrb key={i} position={p as any} shine={i%7===0 ? 1 : 0.3}/>
      ))}
    </>
  )
}
