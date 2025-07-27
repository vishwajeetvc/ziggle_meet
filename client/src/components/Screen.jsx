import Line from "./Line"
import {  eye, z } from "../assets/assets";
import { useEffect, useRef, useState } from "react";

function Screen({children}) {

  const timer = useRef(null);
  const [saturate, setSaturate] = useState(1);
  useEffect(()=>{
    timer.current = setInterval( () => {
      setSaturate(prev => prev == 1 ? setSaturate(2) : setSaturate(1))
    },1000)
    return ()=> clearInterval(timer.current);
  },[])

  return (
    <div className="font-[merienda] max-w-full text-xl font-bold text-cyan-400 p-[50px] bg-black min-h-screen border-2 overflow-hidden">
      <div
        className="border inset-[25px] bg-size-[500px] bg-center md:bg-right md:bg-size-[800px] 2xl:bg-size-[1400px] rounded md:inset-[50px] shadow-lg shadow-cyan-400/40 absolute p-[20px] md:p-[100px] bg-black z-10 overflow-hidden"
        style={{
          backgroundImage : `url(${eye})`,
          backgroundRepeat : 'no-repeat',
          transition : 'all 2s',
          filter : `saturate(${saturate})`
      }}>
        {children}
      </div>
      <Line l={0} deg={130} />
      <Line l={30} deg={130}/>
      <Line l={60} deg={130}/>
      <Line l={90} deg={130}/>
      <Line l={120} deg={130}/>
      <Line l={150} deg={130}/>
      <Line l={180} deg={130}/>
      <Line l={210} deg={130}/>
      <Line l={240} deg={130}/>
      <Line l={270} deg={130}/>
      <Line l={300} deg={130}/>
      <Line l={330} deg={130}/>
    </div>
  )
}

export default Screen
