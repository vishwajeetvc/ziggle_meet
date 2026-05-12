//
/// Home.jsx
import { useContext, useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router";
import { LocalConnectionContext } from "../contexts/localConnectionContext";
import Screen from "../components/Screen";

// Animated SVG Background Component
function TechBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.opacity})`;
        ctx.fill();

        // Connect nearby particles
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

// Glitch Text Effect
function GlitchText({ text }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span className="font-mono">{displayText}</span>;
}

// Animated Circuit Lines
function CircuitLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 1 }}>
      <defs>
        <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(6,182,212,0)">
            <animate attributeName="offset" values="-1;1" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="rgba(6,182,212,0.8)">
            <animate attributeName="offset" values="-0.5;1.5" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="rgba(6,182,212,0)">
            <animate attributeName="offset" values="0;2" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Animated path 1 */}
      <path
        d="M -100 200 Q 200 200 300 100 T 600 150 T 900 100 T 1200 200"
        fill="none"
        stroke="url(#circuitGrad)"
        strokeWidth="2"
        filter="url(#glow)"
      >
        <animate
          attributeName="stroke-dasharray"
          values="0,1000;1000,0"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Animated path 2 */}
      <path
        d="M 1300 400 Q 1000 400 900 300 T 600 350 T 300 300 T 0 400"
        fill="none"
        stroke="url(#circuitGrad)"
        strokeWidth="1.5"
        filter="url(#glow)"
        opacity="0.6"
      >
        <animate
          attributeName="stroke-dasharray"
          values="0,1000;1000,0"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Animated path 3 - vertical */}
      <path
        d="M 400 -50 L 400 150 L 500 250 L 500 450 L 350 600 L 350 850"
        fill="none"
        stroke="rgba(139,92,246,0.4)"
        strokeWidth="2"
        filter="url(#glow)"
      >
        <animate
          attributeName="stroke-dasharray"
          values="0,1000;1000,0"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>

      {/* Pulse circles at joints */}
      <circle cx="400" cy="150" r="4" fill="cyan" filter="url(#glow)">
        <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>

      <circle cx="500" cy="250" r="3" fill="purple" filter="url(#glow)">
        <animate attributeName="r" values="3;6;3" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* Hexagon grid pattern */}
      <g opacity="0.1">
        {[...Array(5)].map((_, row) => (
          [...Array(8)].map((_, col) => (
            <polygon
              key={`${row}-${col}`}
              points="30,0 60,15 60,45 30,60 0,45 0,15"
              fill="none"
              stroke="cyan"
              strokeWidth="0.5"
              transform={`translate(${col * 70 + (row % 2) * 35}, ${row * 60}) scale(0.5)`}
            >
              <animate
                attributeName="opacity"
                values="0.1;0.3;0.1"
                dur={`${3 + Math.random() * 2}s`}
                repeatCount="indefinite"
              />
            </polygon>
          ))
        ))}
      </g>
    </svg>
  );
}

// Animated Waveform
function Waveform() {
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-end gap-1 h-12 opacity-40">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full"
          style={{
            height: '20%',
            animation: `waveform 1s ease-in-out infinite`,
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
      <style>{`
        @keyframes waveform {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
    </div>
  );
}

// Rotating 3D-like rings
function TechRings() {
  return (
    <div className="absolute top-1/2 right-[10%] -translate-y-1/2 pointer-events-none hidden xl:block">
      <svg width="300" height="300" viewBox="0 0 300 300" className="animate-[spin_20s_linear_infinite]">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(6,182,212,0.8)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.8)" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="150" r="100" fill="none" stroke="url(#ringGrad)" strokeWidth="1" opacity="0.3" />
        <circle cx="150" cy="150" r="80" fill="none" stroke="url(#ringGrad)" strokeWidth="0.5" opacity="0.5"
          strokeDasharray="10 5" />
        <circle cx="150" cy="150" r="120" fill="none" stroke="cyan" strokeWidth="0.5" opacity="0.2" />

        {/* Orbiting dot */}
        <circle cx="150" cy="50" r="3" fill="cyan" filter="url(#glow)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 150 150"
            to="360 150 150"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

// Data stream effect
function DataStream() {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const generateStream = () => ({
      id: Math.random(),
      left: Math.random() * 100,
      speed: 2 + Math.random() * 3,
      chars: Array(20).fill(0).map(() =>
        '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'[Math.floor(Math.random() * 50)]
      )
    });

    const interval = setInterval(() => {
      setStreams(prev => {
        const filtered = prev.filter(s => s.top < 120);
        return [...filtered, generateStream()].slice(-8);
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {streams.map(stream => (
        <div
          key={stream.id}
          className="absolute text-cyan-500/20 font-mono text-xs whitespace-nowrap"
          style={{
            left: `${stream.left}%`,
            animation: `dataFall ${stream.speed}s linear forwards`
          }}
        >
          {stream.chars.map((char, i) => (
            <div
              key={i}
              className="leading-tight"
              style={{
                opacity: i === 0 ? 1 : 0.3 - (i * 0.01),
                textShadow: i === 0 ? '0 0 10px rgba(6,182,212,0.8)' : 'none'
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
      <style>{`
        @keyframes dataFall {
          from { transform: translateY(-100%); }
          to { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}

function Home() {
  const { setIsHost } = useContext(LocalConnectionContext);
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://ziggle-meet.onrender.com/health')
      .then(resp => resp.text())
      .then(() => setIsLoading(false))
      .catch(() => {
        alert("something went wrong")
      })
  }, [])

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Screen>
      <TechBackground />
      <DataStream />
      <CircuitLines />
      <TechRings />

      {isLoading && <ServerStartingLoader />}

      <div
        className="py-8 mt-[5%] xl:mt-[10%] relative z-20"
        style={{
          transform: `translate(${(mousePos.x - 0.5) * 10}px, ${(mousePos.y - 0.5) * 10}px)`
        }}
      >
        {/* Modern title with glitch effect */}
        <div className="mb-[50px] md:mb-8 relative">
          <h1 className="text-6xl md:text-8xl font-black text-center md:text-left tracking-tighter relative">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              <GlitchText text="ZIGGLEMEET NO DATA ON THE SERVER" />
            </span>
            {/* Decorative brackets */}
            <span className="absolute -left-8 top-0 text-cyan-500/30 text-4xl animate-pulse">[</span>
            <span className="absolute -right-8 top-0 text-purple-500/30 text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>]</span>
          </h1>

          {/* Animated underline with tech decoration */}
          <div className="relative h-1 w-32 md:w-48 mt-6 mx-auto md:mx-0">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full" />
            <div className="absolute right-0 -top-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            <div className="absolute left-1/2 -top-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          </div>

          {/* Binary decoration */}
          <div className="absolute -bottom-8 left-0 text-[10px] text-cyan-500/20 font-mono hidden md:block">
            01001000 01000101 01001100 01001100 01001111
          </div>
        </div>

        <p className="text-center md:px-8 md:text-left text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed relative">
          Next-Level Video Conferencing for{' '}
          <span className="relative inline-block group cursor-default">
            <span className="text-cyan-400 font-bold text-2xl md:text-3xl relative z-10 font-mono">
              {'<HACKERS/>'}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-cyan-400/20 -skew-x-12 group-hover:h-full group-hover:bg-cyan-400/10 transition-all duration-300" />
            {/* Blinking cursor */}
            <span className="absolute -right-2 top-0 w-0.5 h-full bg-cyan-400 animate-pulse" />
          </span>
        </p>
      </div>

      <div className="mt-[50px] flex flex-col md:flex-row gap-6 absolute md:static bottom-[10px] w-full md:w-auto px-4 md:px-0 z-20">
        {/* Start Meeting Button with tech styling */}
        <button
          className="group relative px-8 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95"
          onClick={() => {
            setIsHost(true);
            navigate('/roomNo')
          }}
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />

          <span className="relative z-10 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <GlitchText text="INIT_MEETING" />
          </span>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white/50" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-white/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-white/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white/50" />

          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* Room Input with holographic effect */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-xl opacity-40 group-hover:opacity-80 transition duration-500 blur-sm animate-pulse" />

          <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden">
            {/* HOLOGRAPHIC LINES - add pointer-events-none here */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(6,182,212,0.03)_2px,rgba(6,182,212,0.03)_4px)] pointer-events-none" />

            {/* INPUT - add relative z-10 here */}
            <input
              className="relative z-10 bg-transparent text-xl md:text-2xl p-[18px_25px] text-center md:text-left outline-none text-cyan-300 placeholder-slate-600 w-full md:w-[320px] font-mono tracking-widest uppercase"
              type="text"
              name="roomId"
              value={roomId}
              placeholder="_ _ _ _ _ _ _ _"
              maxLength={8}
              autoFocus
              onChange={(e) => setRoomId(e.target.value)}
            />

            {/* BUTTON - also needs z-10 */}
            <button
              className={`relative z-10 px-6 py-4 mr-2 rounded-lg font-mono font-bold transition-all duration-300 ${roomId.length === 8
                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                }`}
              onClick={() => roomId.length === 8 && navigate(`/roomNo/${roomId}`)}
              disabled={roomId.length !== 8}
            >
              EXECUTE
            </button>
          </div>
        </div>
      </div>

      <Waveform />
    </Screen>
  )
}

export default Home

function ServerStartingLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-black/70">
      <div className="flex flex-col items-center gap-8 p-10 bg-slate-900/95 rounded-2xl border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.3)] relative overflow-hidden">
        {/* CRT scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />

        {/* Tech spinner */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="2" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="cyan" strokeWidth="2"
              strokeDasharray="70 200" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1"
              strokeDasharray="50 150" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* Center pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
          </div>
        </div>

        <div className="text-center space-y-3 relative z-10">
          <p className="text-xl font-mono font-bold text-cyan-400 tracking-wider">
            <GlitchText text="SYSTEM_BOOT" />
          </p>
          <p className="text-sm text-slate-500 font-mono">
            Initializing neural handshake...
          </p>
          <p className="text-xs text-slate-600 font-mono">
            ETA: ~30 seconds
          </p>
        </div>

        {/* Progress bar with tech styling */}
        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(6,182,212,0.3)_10px,rgba(6,182,212,0.3)_12px)]" />
          <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-[loading_2s_ease-in-out_infinite]"
            style={{
              width: '60%',
              boxShadow: '0 0 10px rgba(6,182,212,0.5)'
            }}
          />
          <style>{`
            @keyframes loading {
              0% { width: 0%; margin-left: 0%; }
              50% { width: 60%; margin-left: 20%; }
              100% { width: 0%; margin-left: 100%; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
