const socket = io();
socket.on('welcome', data => console.log(data))

const cm = document.querySelector('.cm'); // create meeting Button.
const jm = document.querySelector('.jm'); // join meeting Button.
const stopVideo = document.querySelector('.stopVideo'); //
const stopAudio = document.querySelector('.stopAudio'); // 
const screenShare = document.querySelector(".screenShare"); 
const sayHi = document.querySelector(".data"); //
const sendMsg = document.querySelector(".send");

let ss = false;// toggle screen share based on value

const input = document.querySelector('input');
const [video1, video2] = document.querySelectorAll('video');

let localConnection;

cm.addEventListener('click', async ()=>{
  localConnection = await createConnection('start', null );
})

// these both are inter related them will emit and server will send the sdp to the socket
jm.addEventListener('click', async ()=>{
  socket.emit('get-sdp', input.value);
})
socket.on('sdp', async (sdp ,roomId)=> {
  if(!sdp) return alert('No room found'), window.location.href = "http://localhost:3000";
  localConnection = await createConnection('join', sdp, roomId );
});
//=======================================================================================

socket.on('answer', answer => {
  localConnection.setRemoteDescription(answer)
})

//offerer code via link
const urlParams = new URLSearchParams(window.location.search)
const roomId = urlParams.get('roomId')
if(roomId){
  socket.emit('get-sdp', roomId);
}

async function createConnection( type, sdp, roomId = null){
  const lc = new RTCPeerConnection({
    iceServers : [
      { urls: "stun:stun.l.google.com:19302" },
    ]
  });
  let sendChannel = lc.createDataChannel('chat')
  sayHi.onclick = () => {
    sendChannel.send('hi');
  }
  lc.ondatachannel = e => {
    sendChannel = e.channel; 
  }
  sendMsg.onclick= () => {
    sendChannel.send(document.querySelector('.message').value)
  }
  sendChannel.onmessage =e => messageShow(e.data)
  sendChannel.onopen = e => console.log("open!!!!");
  sendChannel.onclose =e => console.log("closed!!!!!!");

  // check weither offeror or answerer and make connection according to that
  let timer = null;
  if(type == 'start'){
    lc.onicecandidate = e => {
      socket.emit('save-offer', lc.localDescription);
    }
    socket.on('meet-id', ( roomId ) =>{
      input.value=`http://localhost:3000/?roomId=${roomId}`
    })
  } else {
    lc.onicecandidate = () => {
      clearTimeout(timer);
      timer = setTimeout(()=>{
        socket.emit('share-answer', lc.localDescription, roomId);
      },100)
    }
  }

  // add default userMedia;
  let media = await navigator.mediaDevices.getUserMedia({video : true, audio:true });
  video2.srcObject = media;
  video2.onloadedmetadata = ()=>{
    video2.play();
  }

  const sender = [];
  media.getTracks().forEach( track => {
    sender.push(lc.addTrack(track , media));
  })

  stopVideo.onclick = ()=>{
    const video = media.getVideoTracks()[0]
    video.enabled = !video.enabled;
  }

  stopAudio.onclick = ()=>{
    const audio = media.getAudioTracks()[0]
    audio.enabled = !audio.enabled;
  }

  // toggle video/screenshare
  screenShare.onclick = async () => {
    if(!ss){
      ss = true;
      media = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    } else {
      ss = false;
      media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    }
    video2.srcObject = media;
    const videoTrack = media.getVideoTracks()[0];
    const sender = lc.getSenders().find(s => s.track.kind === "video");
    if (sender && videoTrack) sender.replaceTrack(videoTrack);
  }

  lc.ontrack = async e => {
    video1.srcObject = e.streams[0];
    video1.onloadedmetadata  = async () => await video1.play();
  }

  if(type == 'start'){
    lc.createOffer().then ( async offer => {
      await lc.setLocalDescription(offer);
    })
  } else {
    await lc.setRemoteDescription(sdp)
    lc.createAnswer().then ( async offer => {
      await lc.setLocalDescription(offer);
    })
  }
  return lc;
}


function messageShow(text){
  const span = document.createElement('span');
  span.innerText = text;
  document.body.append(span);
  span.style.position = "absolute";
  span.style.fontSize = "34px";
  span.style.bottom = "10px";
  span.style.left = "10px";
  setTimeout(()=>{
    span.remove()
  },2000)
}
