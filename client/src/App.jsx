import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
//import Meet from './pages/Meet'
import LCProvider from './contexts/localConnectionContext'
import Account from './pages/Account'
import { lazy, Suspense } from 'react'
import Screen from './components/Screen'

//const Meet = lazy(wait(3000).then(()=>import('./pages/Meet')))
const Meet = lazy(()=> import('./pages/Meet'))

function wait(time){
  return new Promise(res => {
    setTimeout(()=>{
      res()
    },time)
  })
}

function App() {
  return (
    <LCProvider>
      <BrowserRouter>
        <Suspense fallback={<Screen/>}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/roomNo/:roomId?" element={
                <Suspense fallback={<Screen></Screen>}>
                  <Meet />
                </Suspense>
              }
            />
            <Route path="/account" element={<Account/>}/>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LCProvider>
  )
}

export default App
