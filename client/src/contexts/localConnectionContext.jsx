import { useEffect } from "react";
import { createContext, useState, useRef } from "react";
import { io } from "socket.io-client";
export const LocalConnectionContext = createContext({});

export default function LCProvider({children}){

  const socket = useRef(null)
  const lc = useRef(null);

  const [meetLink, setMeetLink] = useState('')
  const [isHost, setIsHost]  = useState(false);

  useEffect( ()=> {
    socket.current = io("http://localhost:3000");

    socket.current.on('welcome', (data)=>{
      console.log(data)
    })

    socket.current.onAny((eventName, ...args) => {
      console.log(eventName, args)
    });


    return () => {
      socket.current.disconnect();
      lc.current = null;
    };
  },[])

  return <>
    <LocalConnectionContext.Provider value={
      { socket , lc, meetLink, setMeetLink, setIsHost, isHost}
    }>
      {children}

    </LocalConnectionContext.Provider>
  </>
}

