import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { LocalConnectionContext } from "../contexts/localConnectionContext";
import Line from "../components/Line";
import ShowLink from "../components/ShowLink";
import Chat from "../components/Chat";
import AllButtons from "../components/AllButtons";
import Videos from "../components/Videos";
import { music } from "../assets/assets";

function Emoji({emoji}){
  return <div className="absolute z-[500] top-[50%] left-[50%] animate-ping text-[96px]">
    {emoji} 
  </div>
}

function getTime(){
  const time = new Date();
  const hour  = String(time.getHours()).length < 2 ? '0' + time.getHours() : time.getHours();
  const min  = String(time.getMinutes()).length < 2 ? '0' + time.getMinutes() : time.getMinutes();
  return hour + ":" + min;
}

function Meet() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { lc, isHost, socket } = useContext(LocalConnectionContext);

  // receive or send channel for chats.
  const channel = useRef(null);

  // actually video streams will be added on this.
  const localStream = useRef(null);
  const remoteStream = useRef(null);

  const myVideo = useRef(null)
  const otherVideo = useRef(null)

  // for cleaning up in useEffect
  const myVideoSrcRef = useRef(null);
  const otherVideoSrcRef = useRef(null);

  // rtcrtp transport
  const sender = useRef([]);

  const [isScreenShare, setIsScreenShare] = useState(false);

  // other peer video when onaddtrack.
  const [isVideoAvailable, setIsVideoAvailable] = useState(false);

  const [showMute, setShowMute] = useState(true);

  // used when you your screen off, to know is your video (userMedia) is visible or not
  const [isMyVideoOff, setIsMyVideoOff] = useState(false);

  //this link will visible to right-top(bouncing) to the sender(host).
  const [link, setLink] = useState('');

  // this the input message 
  const [message, setMessage] = useState('');

  // sender + reciver
  const [allMessages, setAllMessages] = useState([
    //{me : 'hi', time : '12:23'},
    //{other : 'hi', time : '12:23'},
    //{me : 'hi', time : '12:23'},
    //{other : 'kay hal chal', time : '12:23'},
    //{me : 'bye', time : '12:23'},
    //{me : 'hi', time : '12:23'},
    //{other : 'hi', time : '12:23'},
    //{me : 'hi', time : '12:23'},
    //{other : 'kay hal chal', time : '12:23'},
    //{me : 'bye', time : '12:23'},
  ]);

  const [showEmoji, setShowEmoji] = useState(false)
  const [showChat, setShowChat] = useState(false)

  //partner id 
  const pid = useRef(null);

  const handleOnMessage = (e) => {
    const data = JSON.parse(e.data);
    const key = Object.keys(data)[0];

    switch(key) {
      case 'message' : 
        setAllMessages(prev => [...prev , { other : data[key], time : getTime() }]);
        break;

      case 'emoji' : 
        setShowEmoji(true)
        setTimeout(()=>{
          setShowEmoji(false)
        },500)
        break;
      case 'videoOff' : 
        console.log(data[key])
        setIsVideoAvailable(data[key])
        break;
      case 'audioOff' : 
        setShowMute(data[key]);
        console.log(data[key])
        break;
      case 'callOff' : // drop the call
        //console.log("call off")
        navigate('/')
        break;
    }
  }

  const handleOnOpen = () => {
    channel.current.send(JSON.stringify({audioOff : localStream.current.getAudioTracks()[0].enabled}))
    setTimeout(()=>{
      channel.current.send(JSON.stringify({videoOff : localStream.current.getVideoTracks()[0].enabled}))
    },500)
  }

  async function startMeeting(){
    // every time we are creating new rtcPeerConnection;
    lc.current = new RTCPeerConnection({
      iceServers : [
        { urls: "stun:stun.l.google.com:19302" },
      ]
    });
    // get useMedia and play on local.
    localStream.current = await navigator.mediaDevices.getUserMedia(
      {video :{ frameRate: { ideal: 10, max: 15 } }, audio : true}
    )
    myVideo.current.srcObject = localStream.current;
    myVideo.current.onloadedmetadata = ()=> myVideo.current.play()
    myVideoSrcRef.current = myVideo.current.srcObject;

    const video = localStream.current.getVideoTracks()[0]
    video.enabled = isMyVideoOff;
    
    console.log('meeting')

    // add userMedia to the localConnection.
    localStream.current.getTracks().forEach( track => {
      sender.current.push(lc.current.addTrack(track, localStream.current));
    })

    // when other peer added the track
    lc.current.ontrack = e => {
      // basically for other Peer.
      remoteStream.current = e.streams[0];

      //console.log(remoteStream.current.getVideoTracks()[0]);

      otherVideo.current.srcObject = remoteStream.current;
      otherVideo.current.onloadedmetadata = ()=> otherVideo.current.play()
      otherVideoSrcRef.current = otherVideo.current.srcObject;
      setIsVideoAvailable(true);
    }

    // if we are making call
    if(isHost) {

      channel.current = lc.current.createDataChannel('chat');
      channel.current.onmessage = handleOnMessage; 
      channel.current.onopen = handleOnOpen; 

      lc.current.createOffer().then( o => {
        lc.current.setLocalDescription(o)
      });

      lc.current.onicecandidate = () => {
        socket.current.emit('save-offer', lc.current.localDescription);
      }

      socket.current.on('meet-id', ( roomId ) =>{
        setLink(`http://localhost:5173/roomNo/${roomId}`)
      })
      socket.current.on('answer', (answer, p) => {
        pid.current = p;
        lc.current.setRemoteDescription(answer)
      })
    } else {
      lc.current.ondatachannel = e => {
        channel.current = e.channel;
        channel.current.onmessage = handleOnMessage; 
        channel.current.onopen = () => console.log("OPENED") 
      }
      // if we are reciver of the call
      lc.current.onicecandidate = (event) => {
        if (event.candidate === null) {
          socket.current.emit('share-answer', lc.current.localDescription, roomId);
        }
      };
      // ask for sdp the server will send it to the next line on 'spd' event
      socket.current.emit('get-sdp', roomId);
      socket.current.on('sdp', async (sdp)=> {
        if(!sdp) return alert('No room found'), navigate('/');
        await lc.current.setRemoteDescription(sdp)
        lc.current.createAnswer().then( async answer => {
          await lc.current.setLocalDescription(answer);
        })
      });

    }
    socket.current.on('lost', p => {
      console.log(p)
      if(p == pid.current){
        navigate('/')
        window.location.reload();
      }
    })
  }

  async function toggleShareScreen(){
    // stop all videos
    if (myVideo.current.srcObject) {
      myVideo.current.srcObject.getTracks().forEach(track => track.stop());
    }

    if(isScreenShare){
      try {
        localStream.current = await navigator.mediaDevices.getDisplayMedia({video :{ frameRate: { ideal: 10, max: 60 }},  audio : true });
        localStream.current.getVideoTracks()[0].enabled = true
        if(channel.current.readyState == 'open'){
          channel.current.send(JSON.stringify({videoOff : true}))
        }
      } catch (error) {
        setIsScreenShare(false);
      }
    } else {
      if(!isScreenShare){
        localStream.current = await navigator.mediaDevices.getUserMedia({video : { frameRate: { ideal: 10, max: 60 }, }, audio :true });
        const video = localStream.current.getVideoTracks()[0]
        video.enabled = isMyVideoOff;
      }
    }
    myVideo.current.srcObject = localStream.current;

    const video = localStream.current.getVideoTracks()[0]
    lc.current.addEventListener('datachannel', (e) => {
      e.channel.send(JSON.stringify({videoOff : isMyVideoOff}))
    })

    const videoTrack = localStream.current.getVideoTracks()[0];
    // sender is rtcrtp transport 
    const sender = lc.current.getSenders?.().find(s => s.track?.kind === "video");
    if (sender && videoTrack) sender.replaceTrack(videoTrack);
  }

  useEffect(()=>{
    if(!roomId && !isHost) {
      navigate('/')
    };
  })

  useEffect(()=>{
    startMeeting();
    return () => {(channel.current.readyState == 'open'&&channel.current.send(JSON.stringify({callOff : true})) , window.location.reload())}
  },[])

  useEffect(()=>{
    toggleShareScreen();
  },[isScreenShare])


  return (
    <div className={`
          bg-gradient-to-r from-black via-cyan-500 to-black 
          font-[merienda] max-w-full text-xl font-bold text-cyan-400 p-[50px] min-h-screen md:border-1 overflow-hidden`}>

      { !isVideoAvailable && <audio controls autoPlay src={music}></audio>}

      <div className="border-2 inset-[15px] rounded-xl md:inset-[25px] absolute bg-black z-10 overflow-hidden">

        <Videos 
          isMyVideoOff={isMyVideoOff}
          showMute={showMute}
          showChat={showChat}
          myVideo={myVideo} 
          otherVideo={otherVideo} 
          isVideoAvailable={isVideoAvailable} />

        {
          showEmoji && <Emoji emoji={"♥️"}/>
        }
        { 
          showChat && 
            <Chat 
              allMessages={allMessages}
              setMessage={setMessage}
              setAllMessages={setAllMessages}
              message={message}
              channel={channel}
            />
        }
        <AllButtons
          isMyVideoOff={isMyVideoOff}
          setIsMyVideoOff={setIsMyVideoOff}
          navigate={navigate}
          setShowChat={setShowChat}
          channel={channel}
          localStream={localStream}
          isScreenShare={isScreenShare}
          setIsScreenShare={setIsScreenShare}
          lc={lc}
        />

        {/*link && <ShowLink onclick={()=>{}} link={link}/>*/}
        {link && <ShowLink onclick={()=>history.pushState(null, "", link)} link={link}/>}
      </div>
      <Line l={0} deg={130} /> <Line l={30} deg={130}/> <Line l={60} deg={130}/> <Line l={90} deg={130}/> <Line l={120} deg={130}/> <Line l={150} deg={130}/> <Line l={180} deg={130}/> <Line l={210} deg={130}/> <Line l={240} deg={130}/> <Line l={270} deg={130}/> <Line l={300} deg={130}/> <Line l={330} deg={130}/> 
    </div>
  )
}
export default Meet

