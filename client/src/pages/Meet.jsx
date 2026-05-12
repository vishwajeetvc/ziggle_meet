// Meet.jsx
import { useContext, useEffect, useRef, useState, useCallback, memo } from "react";
import { useNavigate, useParams } from "react-router"
import { LocalConnectionContext } from "../contexts/localConnectionContext";
import Line from "../components/Line";
import ShowLink from "../components/ShowLink";
import Videos from "../components/Videos";
import { music } from "../assets/assets";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, MessageSquare, Smile, Copy, X, Send } from "lucide-react";

// ============ CONNECTION LOADING ANIMATION ============

const ConnectionLoader = memo(function ConnectionLoader() {

  const { roomId } = useContext(LocalConnectionContext)
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <svg width="300" height="300" viewBox="0 0 300 300" className="animate-[spin_20s_linear_infinite]">
        <defs>
          <linearGradient id="loaderGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="loaderGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="loaderGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle cx="150" cy="150" r="120" fill="none" stroke="url(#loaderGrad1)" strokeWidth="1" opacity="0.3" filter="url(#loaderGlow)">
          <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="10s" repeatCount="indefinite" />
        </circle>

        {/* Middle ring with dashes */}
        <circle cx="150" cy="150" r="100" fill="none" stroke="url(#loaderGrad2)" strokeWidth="2" strokeDasharray="20 10 5 10" filter="url(#loaderGlow)">
          <animateTransform attributeName="transform" type="rotate" from="360 150 150" to="0 150 150" dur="8s" repeatCount="indefinite" />
        </circle>

        {/* Inner ring */}
        <circle cx="150" cy="150" r="80" fill="none" stroke="cyan" strokeWidth="1" opacity="0.5" filter="url(#loaderGlow)">
          <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="-360 150 150" dur="6s" repeatCount="indefinite" />
        </circle>

        {/* Orbiting dots */}
        <circle cx="150" cy="30" r="4" fill="#06b6d4" filter="url(#loaderGlow)">
          <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="50" r="3" fill="#8b5cf6" filter="url(#loaderGlow)">
          <animateTransform attributeName="transform" type="rotate" from="360 150 150" to="0 150 150" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="70" r="2" fill="white" filter="url(#loaderGlow)">
          <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="-360 150 150" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Center pulse */}
        <circle cx="150" cy="150" r="20" fill="none" stroke="cyan" strokeWidth="2" filter="url(#loaderGlow)">
          <animate attributeName="r" values="10;30;10" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="150" r="5" fill="#06b6d4" filter="url(#loaderGlow)">
          <animate attributeName="r" values="5;8;5" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Hexagon pattern */}
        <g opacity="0.2" transform="translate(150,150)">
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <polygon
              key={i}
              points="20,0 10,17.3 -10,17.3 -20,0 -10,-17.3 10,-17.3"
              fill="none"
              stroke="cyan"
              strokeWidth="0.5"
              transform={`rotate(${deg}) translate(60, 0)`}
            >
              <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </polygon>
          ))}
        </g>
      </svg>

      <div className="absolute flex flex-col items-center gap-4">
        <div className="text-8xl bg-black font-mono font-bold text-cyan-400 animate-pulse tracking-widest">
          {roomId.at(-1)}
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
        <div className="text-xs font-mono text-slate-500">ESTABLISHING_PEER_CONNECTION</div>
      </div>
    </div>
  );
});

// ============ TECH BACKGROUND - CLEAN NO IMAGE ============

function MeetBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#050508]">
      {/* Subtle grid using CSS instead of heavy SVG */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Corner accents - lightweight SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cornerLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line x1="0" y1="100" x2="300" y2="100" stroke="url(#cornerLine)" strokeWidth="1" />
        <line x1="100" y1="0" x2="100" y2="300" stroke="url(#cornerLine)" strokeWidth="1" />
        <line x1="100%" y1="100" x2="calc(100% - 300px)" y2="100" stroke="url(#cornerLine)" strokeWidth="1" />
        <line x1="calc(100% - 100px)" y1="0" x2="calc(100% - 100px)" y2="300" stroke="url(#cornerLine)" strokeWidth="1" />
      </svg>

      {/* Ambient glow spots */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
    </div>
  );
}

// ============ VIDEO FRAME ============

function VideoFrame() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5]">
      <div className="absolute inset-[1px] rounded-xl border border-cyan-500/20" />
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500/50 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-500/50 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-500/50 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/50 rounded-br-xl" />
    </div>
  );
}

// ============ NOISE & SCANLINE ============

function MeetNoise() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-40 opacity-[0.015]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

function MeetScanline() {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden opacity-30">
      <div
        className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
        style={{
          animation: 'meetScan 4s linear infinite',
        }}
      />
      <style>{`
        @keyframes meetScan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

// ============ CONNECTION STATUS ============

const ConnectionStatus = memo(function ConnectionStatus({ isConnected }) {
  return (
    <div className="absolute top-4 left-4 z-50 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md rounded-lg px-3 py-1.5 border border-slate-700/50">
      <div className="relative">
        <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-ping`} />
      </div>
      <span className="text-[11px] font-mono text-cyan-400 font-bold">
        {isConnected ? 'CONNECTED' : 'CONNECTING'}
      </span>
    </div>
  );
});

// ============ EMOJI ============

const TechEmoji = memo(function TechEmoji({ emoji }) {
  return (
    <div className="absolute z-[500] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-xl animate-ping" style={{ width: '120px', height: '120px', margin: '-10px' }} />
        <div className="text-[96px] animate-bounce drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]">
          {emoji}
        </div>
      </div>
    </div>
  );
});

// ============ CHAT PANEL - OPTIMIZED ============

const ChatPanel = memo(function ChatPanel({ allMessages, setMessage, setAllMessages, message, channel }) {
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  // Only scroll if user was already at bottom
  useEffect(() => {
    if (!shouldScroll) return;
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages, shouldScroll]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
    setShouldScroll(isAtBottom);
  }, []);

  const sendMessage = useCallback(() => {
    if (!message.trim()) return;
    const time = getTime();
    setAllMessages(prev => [...prev, { me: message, time }]);
    if (channel.current?.readyState === 'open') {
      channel.current.send(JSON.stringify({ message }));
    }
    setMessage('');
    setShouldScroll(true);
  }, [message, channel, setAllMessages, setMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  return (
    <div className="absolute right-4 top-16 bottom-24 z-50 w-80 flex flex-col pointer-events-auto">
      {/* Glass container */}
      <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 font-bold tracking-wider">CHAT</span>
          </div>
          <span className="text-[10px] font-mono text-slate-600">{allMessages.length} MSG</span>
        </div>

        {/* Messages - optimized with will-change */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3 space-y-2 will-change-transform"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(100,116,139,0.3) transparent'
          }}
        >
          {allMessages.length === 0 && (
            <div className="text-center py-8">
              <span className="text-[10px] font-mono text-slate-700">NO_MESSAGES</span>
            </div>
          )}
          {allMessages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.me ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed ${msg.me
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                : 'bg-slate-800/60 text-slate-300 border border-slate-700/30'
                }`}>
                {msg.me || msg.other}
              </div>
              <span className="text-[9px] font-mono text-slate-700 mt-0.5 px-1">{msg.time}</span>
            </div>
          ))}
          <div ref={chatEndRef} className="h-1" />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-700/50 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type..."
              className="flex-1 bg-slate-800/60 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 outline-none border border-slate-700/30 focus:border-cyan-500/40 transition-colors font-mono text-xs"
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============ CONTROL BUTTONS ============

const ControlButton = memo(function ControlButton({
  onClick,
  active,
  activeClass,
  inactiveClass,
  icon: Icon,
  label,
  danger
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${danger
        ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]'
        : active
          ? activeClass
          : inactiveClass
        }`}
    >
      <Icon size={18} />
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none bg-slate-900/90 px-1.5 py-0.5 rounded">
        {label}
      </span>
    </button>
  );
});

const AllButtons = memo(function AllButtons({
  isMyVideoOff,
  setIsMyVideoOff,
  navigate,
  setShowChat,
  channel,
  localStream,
  isScreenShare,
  setIsScreenShare,
  showChat,
  setShowEmoji
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [showLinkCopied, setShowLinkCopied] = useState(false);

  const toggleMute = useCallback(() => {
    const audioTrack = localStream.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      if (channel.current?.readyState === 'open') {
        channel.current.send(JSON.stringify({ audioOff: audioTrack.enabled }));
      }
    }
  }, [localStream, channel]);

  const toggleVideo = useCallback(() => {
    const videoTrack = localStream.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsMyVideoOff(!videoTrack.enabled);
      if (channel.current?.readyState === 'open') {
        channel.current.send(JSON.stringify({ videoOff: videoTrack.enabled }));
      }
    }
  }, [localStream, channel, setIsMyVideoOff]);

  const sendEmoji = useCallback(() => {
    setShowEmoji(true);
    if (channel.current?.readyState === 'open') {
      channel.current.send(JSON.stringify({ emoji: true }));
    }
    setTimeout(() => setShowEmoji(false), 600);
  }, [channel, setShowEmoji]);

  const endCall = useCallback(() => {
    if (channel.current?.readyState === 'open') {
      channel.current.send(JSON.stringify({ callOff: true }));
    }
    navigate('/');
    window.location.reload();
  }, [channel, navigate]);

  const toggleScreenShare = useCallback(() => {
    setIsScreenShare(prev => !prev);
  }, [setIsScreenShare]);

  const toggleChat = useCallback(() => {
    setShowChat(prev => !prev);
  }, [setShowChat]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setShowLinkCopied(true);
    setTimeout(() => setShowLinkCopied(false), 2000);
  }, []);

  const activeBtnClass = "bg-cyan-500/25 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]";
  const inactiveBtnClass = "bg-slate-800/70 text-slate-400 border border-slate-700/40 hover:bg-slate-700/50 hover:text-cyan-400 hover:border-cyan-500/30 transition-all";
  const offBtnClass = "bg-red-500/15 text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]";

  return (
    <>
      {/* Main Control Bar */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-xl rounded-2xl px-4 py-2.5 border border-slate-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">

          <ControlButton
            onClick={toggleMute}
            active={isMuted}
            activeClass={offBtnClass}
            inactiveClass={inactiveBtnClass}
            icon={isMuted ? MicOff : Mic}
            label={isMuted ? "UNMUTE" : "MUTE"}
          />

          <ControlButton
            onClick={toggleVideo}
            active={!isMyVideoOff}
            activeClass={activeBtnClass}
            inactiveClass={offBtnClass}
            icon={isMyVideoOff ? VideoOff : Video}
            label={isMyVideoOff ? "START_VIDEO" : "STOP_VIDEO"}
          />

          <div className="w-px h-6 bg-slate-700/40 mx-1" />

          <ControlButton
            onClick={toggleScreenShare}
            active={isScreenShare}
            activeClass={activeBtnClass}
            inactiveClass={inactiveBtnClass}
            icon={MonitorUp}
            label={isScreenShare ? "STOP_SHARE" : "SHARE"}
          />

          <ControlButton
            onClick={sendEmoji}
            active={false}
            activeClass=""
            inactiveClass="bg-yellow-500/10 text-yellow-500/70 border border-yellow-500/20 hover:bg-yellow-500/20 hover:text-yellow-400"
            icon={Smile}
            label="REACT"
          />

          <ControlButton
            onClick={toggleChat}
            active={showChat}
            activeClass={activeBtnClass}
            inactiveClass={inactiveBtnClass}
            icon={MessageSquare}
            label={showChat ? "CLOSE" : "CHAT"}
          />

          <div className="w-px h-6 bg-slate-700/40 mx-1" />

          <button
            onClick={endCall}
            className="w-12 h-11 rounded-xl flex items-center justify-center bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all duration-200"
          >
            <PhoneOff size={18} />
          </button>
        </div>
      </div>

      {/* Copy Link */}
      <button
        onClick={copyLink}
        className="absolute top-4 right-4 z-50 bg-slate-900/70 backdrop-blur-md rounded-lg px-3 py-1.5 border border-slate-700/40 hover:border-cyan-500/40 transition-all flex items-center gap-2 group"
      >
        <Copy size={13} className="text-cyan-400/70 group-hover:text-cyan-400" />
        <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">COPY</span>
      </button>

      {/* Link copied toast */}
      {showLinkCopied && (
        <div className="absolute top-14 right-4 z-50 bg-slate-900/95 backdrop-blur-md rounded-lg px-3 py-1.5 border border-cyan-500/30 shadow-lg animate-in fade-in slide-in-from-top-2">
          <span className="text-[10px] font-mono text-cyan-400">COPIED!</span>
        </div>
      )}
    </>
  );
});

// ============ MAIN MEET COMPONENT ============

function getTime() {
  const time = new Date();
  const hour = String(time.getHours()).padStart(2, '0');
  const min = String(time.getMinutes()).padStart(2, '0');
  return hour + ":" + min;
}

function Meet() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { lc, isHost, socket } = useContext(LocalConnectionContext);

  const channel = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const myVideo = useRef(null);
  const otherVideo = useRef(null);
  const myVideoSrcRef = useRef(null);
  const otherVideoSrcRef = useRef(null);
  const sender = useRef([]);
  const pid = useRef(null);

  const [isScreenShare, setIsScreenShare] = useState(false);
  const [isVideoAvailable, setIsVideoAvailable] = useState(true);
  const [showMute, setShowMute] = useState(true);
  const [isMyVideoOff, setIsMyVideoOff] = useState(true);
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  const handleOnMessage = useCallback((e) => {
    const data = JSON.parse(e.data);
    const key = Object.keys(data)[0];

    switch (key) {
      case 'message':
        setAllMessages(prev => [...prev, { other: data[key], time: getTime() }]);
        break;
      case 'emoji':
        setShowEmoji(true);
        setTimeout(() => setShowEmoji(false), 600);
        break;
      case 'videoOff':
        setIsVideoAvailable(data[key]);
        break;
      case 'audioOff':
        setShowMute(data[key]);
        break;
      case 'callOff':
        navigate('/');
        break;
    }
  }, [navigate]);

  const handleOnOpen = useCallback(() => {
    setIsConnected(true);
    setIsConnecting(false);
    channel.current.send(JSON.stringify({ audioOff: localStream.current.getAudioTracks()[0].enabled }));
    setTimeout(() => {
      channel.current.send(JSON.stringify({ videoOff: localStream.current.getVideoTracks()[0].enabled }));
    }, 500);
  }, []);

  async function startMeeting() {
    lc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    localStream.current = await navigator.mediaDevices.getUserMedia(
      { video: { frameRate: { ideal: 10, max: 15 } }, audio: true }
    );
    myVideo.current.srcObject = localStream.current;
    myVideo.current.onloadedmetadata = () => myVideo.current.play();
    myVideoSrcRef.current = myVideo.current.srcObject;

    const video = localStream.current.getVideoTracks()[0];
    video.enabled = isMyVideoOff;

    localStream.current.getTracks().forEach(track => {
      sender.current.push(lc.current.addTrack(track, localStream.current));
    });

    lc.current.ontrack = e => {
      remoteStream.current = e.streams[0];
      otherVideo.current.srcObject = remoteStream.current;
      otherVideo.current.onloadedmetadata = () => otherVideo.current.play();
      otherVideoSrcRef.current = otherVideo.current.srcObject;
      setIsVideoAvailable(true);
      setIsConnected(true);
      setIsConnecting(false);
    }

    if (isHost) {
      channel.current = lc.current.createDataChannel('chat');
      channel.current.onmessage = handleOnMessage;
      channel.current.onopen = handleOnOpen;

      lc.current.createOffer().then(o => {
        lc.current.setLocalDescription(o);
      });

      lc.current.onicecandidate = () => {
        socket.current.emit('save-offer', lc.current.localDescription);
      }

      socket.current.on('meet-id', (roomId) => {
        setLink(`${roomId}`);
      });
      socket.current.on('answer', (answer, p) => {
        pid.current = p;
        lc.current.setRemoteDescription(answer);
      });
    } else {
      lc.current.ondatachannel = e => {
        channel.current = e.channel;
        channel.current.onmessage = handleOnMessage;
        channel.current.onopen = handleOnOpen;
      }
      lc.current.onicecandidate = (event) => {
        if (event.candidate === null) {
          socket.current.emit('share-answer', lc.current.localDescription, roomId);
        }
      };
      socket.current.emit('get-sdp', roomId);
      socket.current.on('sdp', async (sdp) => {
        if (!sdp) return alert('No room found'), navigate('/');
        await lc.current.setRemoteDescription(sdp);
        lc.current.createAnswer().then(async answer => {
          await lc.current.setLocalDescription(answer);
        });
      });
    }
    socket.current.on('lost', p => {
      if (p == pid.current) {
        navigate('/');
        window.location.reload();
      }
    });
  }

  async function toggleShareScreen() {
    if (myVideo.current.srcObject) {
      myVideo.current.srcObject.getTracks().forEach(track => track.stop());
    }

    if (isScreenShare) {
      try {
        localStream.current = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: { ideal: 10, max: 60 } },
          audio: true
        });
        localStream.current.getVideoTracks()[0].enabled = true;
        if (channel.current?.readyState === 'open') {
          channel.current.send(JSON.stringify({ videoOff: true }));
        }
      } catch (error) {
        setIsScreenShare(false);
      }
    } else {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: { frameRate: { ideal: 10, max: 15 } },
        audio: true
      });
      const video = localStream.current.getVideoTracks()[0];
      video.enabled = isMyVideoOff;
    }
    myVideo.current.srcObject = localStream.current;

    const videoTrack = localStream.current.getVideoTracks()[0];
    const sender = lc.current.getSenders?.().find(s => s.track?.kind === "video");
    if (sender && videoTrack) sender.replaceTrack(videoTrack);
  }

  useEffect(() => {
    if (!roomId && !isHost) {
      navigate('/');
    };
  }, []);

  useEffect(() => {
    startMeeting();
    return () => {
      if (channel.current?.readyState === 'open') {
        channel.current.send(JSON.stringify({ callOff: true }));
      }
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    toggleShareScreen();
  }, [isScreenShare]);

  return (
    <div className="relative max-w-full min-h-screen overflow-hidden bg-[#050508]">
      {/* Background layers */}
      <MeetBackground />
      <MeetNoise />
      <MeetScanline />

      {/* Connection loading animation */}
      {isConnecting && <ConnectionLoader />}

      {/* Status indicators */}
      <ConnectionStatus isConnected={isConnected} />

      {/* Room ID */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/70 backdrop-blur-md rounded-lg px-4 py-1.5 border border-slate-700/40">
        <div className="text-[9px] font-mono text-slate-600 mb-0.5 text-center tracking-wider">ROOM</div>
        <div className="text-sm font-mono text-cyan-400/80 font-bold tracking-[0.2em]">
          {roomId || 'HOST'}
        </div>
      </div>

      {/* Hidden audio for disconnected peer */}
      {!isVideoAvailable && <audio controls autoPlay src={music} className="hidden" />}

      {/* Main video container */}
      <div className="absolute inset-[12px] md:inset-[20px] rounded-xl bg-black/70 z-10 overflow-hidden border border-slate-800/40">
        <VideoFrame />

        <Videos
          isMyVideoOff={isMyVideoOff}
          showMute={showMute}
          showChat={showChat}
          myVideo={myVideo}
          otherVideo={otherVideo}
          isVideoAvailable={isVideoAvailable}
        />

        {showEmoji && <TechEmoji emoji={"♥️"} />}

        {/* Chat Panel */}
        {showChat && (
          <ChatPanel
            allMessages={allMessages}
            setMessage={setMessage}
            setAllMessages={setAllMessages}
            message={message}
            channel={channel}
          />
        )}

        {/* Control Buttons */}
        <AllButtons
          isMyVideoOff={isMyVideoOff}
          setIsMyVideoOff={setIsMyVideoOff}
          navigate={navigate}
          setShowChat={setShowChat}
          channel={channel}
          localStream={localStream}
          isScreenShare={isScreenShare}
          setIsScreenShare={setIsScreenShare}
          showChat={showChat}
          setShowEmoji={setShowEmoji}
        />

        {/* Show Link for host */}
        {link && <ShowLink onclick={() => history.pushState(null, "", link)} link={link} />}
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <Line l={0} deg={130} />
        <Line l={60} deg={130} />
        <Line l={120} deg={130} />
        <Line l={180} deg={130} />
        <Line l={240} deg={130} />
        <Line l={300} deg={130} />
      </div>
    </div>
  )
}

export default Meet
