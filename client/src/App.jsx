import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import Meet from './pages/Meet'
import LCProvider from './contexts/localConnectionContext'
import Account from './pages/Account'

function App() {
  return (
    <LCProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/roomNo/:roomId?" element={<Meet/>}/>
          <Route path="/account" element={<Account/>}/>
        </Routes>
      </BrowserRouter>
    </LCProvider>
  )
}

export default App
