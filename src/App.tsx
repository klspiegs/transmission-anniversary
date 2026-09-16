import { Route, Routes } from 'react-router-dom'
import Electronic from './pages/Electronic'
import Hiphop from './pages/Hiphop'
import Home from './pages/Home'
import Rock from './pages/Rock'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hiphop" element={<Hiphop />} />
      <Route path="/electronic" element={<Electronic />} />
      <Route path="/rock" element={<Rock />} />
    </Routes>
  )
}

export default App
