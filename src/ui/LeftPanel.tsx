import { motion } from 'framer-motion'
import { useApp } from '../app/store'
import { Link } from 'react-router-dom'

export function LeftPanel(){
  const { setView } = useApp()
  return (
    <motion.aside className="left-panel" initial={{x:-40,opacity:0}} animate={{x:0,opacity:1}}>
      <header className="brand">PORTAL</header>
      <nav className="nav">
        <button className="nav-btn" onClick={()=>setView('3d')}>3D</button>
        <Link className="nav-btn" to="/feed" onClick={()=>setView('2d')}>2D</Link>
      </nav>
      {/* contextual controls… */}
    </motion.aside>
  )
}
