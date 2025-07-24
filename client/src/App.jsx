import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import Meet from './pages/Meet'
import LCProvider from './contexts/localConnectionContext'

function App() {
  return (
    <LCProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/roomNo/:roomId?" element={<Meet/>}/>
        </Routes>
      </BrowserRouter>
    </LCProvider>
  )
}

export default App
