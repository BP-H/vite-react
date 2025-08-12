import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LeftPanel } from '../ui/LeftPanel'
import { Experience } from '../canvas/Experience'
import './styles/tokens.css'
import './styles/global.css'

export default function App(){
  return (
    <BrowserRouter>
      <div className="app-shell">
        <LeftPanel/>
        <div className="canvas-wrap">
          <Experience/>
        </div>
      </div>
      <Routes>
        {/* 3D is default; 2D feed overlays via route */}
        <Route path="/" element={null}/>
        <Route path="/feed" element={<div className="feed2d">2D feed goes here</div>} />
      </Routes>
    </BrowserRouter>
  )
}
