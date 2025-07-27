
import {
  MonitorOff,
  PhoneOff, MessageSquareMore, 
  MessageSquareOff, Heart, 
  Video, MonitorUp, 
  VideoOff, Mic, MicOff
} from "lucide-react";

import ButtonIcon from "../components/ButtonIcon";


export default function AllButtons({
  setIsScreenShare, 
  isScreenShare, lc,
  localStream, 
  channel, 
  setShowChat, 
  navigate, 
  setIsMyVideoOff,
  isMyVideoOff
  }){

  const iconSize = window.innerWidth < 600 ? 16 : 28; 

  return (
    <div className={`absolute bottom-[20px]  justify-center md:justify-end md:px-5 gap-2 md:gap-4 z-10 flex w-full flex-wrap-reverse md:flex-row`}>
      
      <ButtonIcon onclick={()=>{
        setIsScreenShare(prev => !prev);
        if(channel.current?.readyState == 'open'){
          channel.current.send(JSON.stringify({videoOff : isMyVideoOff}))
        }
      }} icon={<MonitorOff size={iconSize}/>} offIcon={isScreenShare ? <MonitorUp size={iconSize}/> : <MonitorOff size={iconSize}/>} />

      <ButtonIcon onclick={()=>{
        setShowChat(prev => !prev)
      }} offIcon={<MessageSquareMore size={iconSize}/>} icon={<MessageSquareOff size={iconSize} />} />

      <ButtonIcon onclick={()=>{
        if(channel.current.readyState == 'open'){
          channel.current.send(JSON.stringify({callOff : true}))
        }
        navigate('/')
      }} icon={<PhoneOff color={'red'} size={iconSize}/>} />

      { !isScreenShare &&
        <ButtonIcon onclick={()=>{
          // you disable video the browser stop sending video to the rtcPeerConnection;
          const video = localStream.current.getVideoTracks()[0]
          video.enabled = !video.enabled;
          setIsMyVideoOff(video.enabled)
          // send the local pause/play info to the other peer after(click) connection open on both side.
          if(channel.current.readyState == 'open'){
            channel.current.send(JSON.stringify({videoOff : video.enabled}))
          }
        }} icon={<VideoOff size={iconSize}/>} offIcon={<Video size={iconSize}/>}/>
      } 

      
      <ButtonIcon onclick={()=>{
        // you have to work differently for audio. Browser don't actually stop sending audio. you have to explicitly stop audio.

        const audio = localStream.current.getAudioTracks()[0]
        audio.enabled = !audio.enabled;


        // send the local pause/play info to the other peer after(click) connection open on both side.
        if(channel.current.readyState == 'open'){
          channel.current.send(JSON.stringify({audioOff : audio.enabled}))
        }

        const sender = lc.current.getSenders().find(s => s.track.kind === 'audio');
        if (sender) {
          sender.track.enabled = !sender.track.enabled;
        }
      }} offIcon={<MicOff size={iconSize} />} icon={<Mic size={iconSize}/>}/>

      <ButtonIcon 
        onclick={()=>{
          channel.current.send(JSON.stringify({emoji : '♥️' }))
        }} 
        icon={<Heart fill="red" stroke="red" size={iconSize}/>}/>


    </div>
  )
}

