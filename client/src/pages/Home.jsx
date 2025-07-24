import { useContext, useState } from "react"
import { useNavigate } from "react-router";
import { LocalConnectionContext } from "../contexts/localConnectionContext";
import Line from "../components/Line";
import {  eye, z } from "../assets/assets";

function Home() {
  const { setIsHost } = useContext(LocalConnectionContext);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  return (
    <div className="font-[merienda] max-w-full text-xl font-bold text-cyan-400 p-[50px] bg-black min-h-screen border-2 overflow-hidden">
      <div
        style={{
          backgroundImage : `url(${eye})`,
          backgroundRepeat : 'no-repeat'
        }}
        className="border inset-[25px] bg-size-[500px] bg-center md:bg-right md:bg-size-[800px] 2xl:bg-size-[1400px] rounded md:inset-[50px] shadow-lg shadow-cyan-400/40 absolute p-[20px] md:p-[100px] bg-black z-10 overflow-hidden">
        <div className="py-8 mt-[10%]">
          <div 
            style={{
              backgroundImage : `url(${z})`,
              backgroundRepeat : 'no-repeat'
            }}
            className={` h-[70px] w-full bg-center mb-[50px] md:mb-5 md:h-[160px] bg-contain md:w-[900px]`}
          ></div>
          {<p className="text-center md:px-8 md:text-left">Next-Level Video Conferencing for <span className="text-red-600 text-3xl border-b-2 inline-block"> HACKERS!</span></p>}
        </div>

        <div className="mt-[50px] flex flex-col md:flex-row gap-4 absolute md:static bottom-[10px]">
          <button 
            className={`p-[20px_30px] text-cyan-400 border-2 rounded md:border-1 hover:cursor-pointer hover:bg-cyan-400 hover:text-black transition-all delay-100`}
            onClick={()=>{
              setIsHost(true);
              navigate('/roomNo')
            }} >Start New Meeting</button>
          <div className="border-3 md:border-1 rounded-lg flex md:block flex-wrap justify-center">
            <input 
              className="text-xl md:text-3xl p-[10px_15px] text-center md:p-[20px_30px] mx-4 outline-none animate-pulse"
              type="text" name="roomId" value={roomId}
              placeholder={'Enter the Code.'}
              onChange={ (e) => {
                setRoomId(e.target.value);
              }}/>
          </div>
          <button 
            className="p-[20px] text-cyan-400 outline-none hover:cursor-pointer"
            onClick={()=>{
              roomId.length == 8 && navigate(`/roomNo/${roomId}`);
            }}>Join</button>
        </div>
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

export default Home


