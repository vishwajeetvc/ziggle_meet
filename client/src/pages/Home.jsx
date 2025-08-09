import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router";
import { LocalConnectionContext } from "../contexts/localConnectionContext";
import {  z } from "../assets/assets";
import { CircleUserRound } from "lucide-react";
import Screen from "../components/Screen";


function Home() {
  const { setIsHost } = useContext(LocalConnectionContext);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  return (
    <Screen>
      <div className="absolute top-0 right-0 px-5 py-2 m-2 group ">
        <Link to={"/account"}>
          <CircleUserRound size={32} />
        </Link>
        <ul className="hidden group-hover:block absolute w-[150px] bg-black rounded-lg top-[90%] right-[50%] p-5 border ">
          <li>About</li>
          <li>LogOut</li>
        </ul>
      </div>
      <div className="py-8 mt-[5%] xl:mt-[10%]">
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
    </Screen>
  )
}

export default Home


