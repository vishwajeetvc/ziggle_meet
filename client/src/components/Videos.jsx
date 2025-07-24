import { call } from "../assets/assets"

export default function Videos({myVideo, otherVideo, isVideoAvailable, showChat}){

  return <div className=" inset-0 absolute">

    <div className={``}>
        <video 
          style={{ objectFit: 'cover', overflowClipMargin : '' }}
          className={`absolute md:top-0 ${!isVideoAvailable ? 'opacity-0' : ''} left-0 md:w-full  h-[100vh] overflow-visible z-1 [overflow-clip-margin:0px]`} 
          ref={otherVideo}/>
    </div>

    <div className="md:w-[320px] w-[120px] absolute md:bottom-[300px] bottom-[278px] md:right-[20px] right-[20px]">
      <video 
        style={{ objectFit: 'cover', overflowClipMargin : '' }}
        className={`absolute top-0 rounded-xl left-0 md:w-full  border-cyan-400 border z-1 h-[200px] w-[500px] overflow-hidden [overflow-clip-margin:0px]`} 
       ref={myVideo}/>
    </div>

    <div>
      <div style={{ backgroundImage : `url(${call})`}}
        className="absolute inset-0 md:bg-cover bg-[center_center] bg-no-repeat bg-size-[700px] z-0"></div>,
      <div className="absolute top-[50%] left-[50%] translate-x-[-10px_-10px]">
        <div className="w-5 h-5 border-cyan-400 border top-0 absolute animate-ping rounded-full"></div>,
        <div className="w-5 h-5 bg-cyan-200 top-0 absolute rounded-full"></div>
        <div className="w-[100px] h-[100px] rounded-full border-dashed border-[25px] animate-spin absolute top-[-42px] left-[-40px]"></div>
        <div className="w-[200px] h-[200px] rounded-full border-dashed border-[1px] animate-ping absolute top-[-92px] left-[-90px]"></div>
        <div className="w-[300px] h-[300px] rounded-full border-dashed border-blue-400 border-[1px] animate-ping absolute top-[-142px] left-[-140px]"></div>
      </div>
    </div>
  </div>
}
