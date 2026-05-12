// Screen.jsx
import { useEffect, useRef, useState } from "react";

// Animated grid background with perspective
function PerspectiveGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <defs>
        <linearGradient id="gridFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
          <stop offset="50%" stopColor="rgba(6, 182, 212, 0.1)" />
          <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
        </linearGradient>

        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="url(#gridFade)" strokeWidth="0.5" />
        </pattern>

        <pattern id="gridPerspective" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1, 0.3)">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* Flat grid overlay */}
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Perspective floor grid */}
      <g transform="translate(0, 480)">
        <rect width="100%" height="40%" fill="url(#gridPerspective)" opacity="0.5" />
        <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" />
      </g>
    </svg>
  );
}

// Floating geometric shapes
function FloatingShapes() {
  const shapes = [
    { type: 'hex', x: 100, y: 150, size: 40, speed: 20, delay: 0 },
    { type: 'tri', x: 850, y: 100, size: 30, speed: 25, delay: 2 },
    { type: 'diamond', x: 750, y: 500, size: 25, speed: 18, delay: 4 },
    { type: 'hex', x: 150, y: 600, size: 35, speed: 22, delay: 1 },
    { type: 'circle', x: 500, y: 80, size: 20, speed: 30, delay: 3 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 1 }}>
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="shapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0.6)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.6)" />
        </linearGradient>
      </defs>

      {shapes.map((shape, i) => {
        const center = shape.size / 2;
        let path = '';

        if (shape.type === 'hex') {
          const r = shape.size / 2;
          path = `M ${r} 0 L ${r * 1.866} ${r * 0.5} L ${r * 1.866} ${r * 1.5} L ${r} ${r * 2} L ${r * 0.134} ${r * 1.5} L ${r * 0.134} ${r * 0.5} Z`;
        } else if (shape.type === 'tri') {
          path = `M ${center} 0 L ${shape.size} ${shape.size} L 0 ${shape.size} Z`;
        } else if (shape.type === 'diamond') {
          path = `M ${center} 0 L ${shape.size} ${center} L ${center} ${shape.size} L 0 ${center} Z`;
        } else if (shape.type === 'circle') {
          path = `M ${center} 0 A ${center} ${center} 0 1 1 ${center} ${shape.size} A ${center} ${center} 0 1 1 ${center} 0`;
        }

        return (
          <g key={i} transform={`translate(${shape.x}, ${shape.y})`}>
            <path
              d={path}
              fill="none"
              stroke="url(#shapeGrad)"
              strokeWidth="1.5"
              filter="url(#neonGlow)"
              opacity="0.4"
              transform={`translate(-${center}, -${center})`}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${center} ${center}`}
                to={`360 ${center} ${center}`}
                dur={`${shape.speed}s`}
                repeatCount="indefinite"
                additive="sum"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.5;0.2"
                dur="4s"
                begin={`${shape.delay}s`}
                repeatCount="indefinite"
              />
            </path>

            {/* Inner dot */}
            <circle r="2" fill="cyan" opacity="0.6">
              <animate
                attributeName="r"
                values="2;4;2"
                dur="3s"
                begin={`${shape.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

// Animated corner brackets
function CornerBrackets() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });

  useEffect(() => {
    const update = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const size = 30;
  const strokeWidth = 2;
  const { width, height } = dimensions;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
      <defs>
        <linearGradient id="cornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="cyan" />
          <stop offset="100%" stopColor="purple" />
        </linearGradient>
      </defs>

      {/* Top Left */}
      <g>
        <path d={`M 0 ${size} L 0 0 L ${size} 0`} fill="none" stroke="url(#cornerGrad)" strokeWidth={strokeWidth}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="0" cy="0" r="4" fill="cyan">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Top Right */}
      <g transform={`translate(${width}, 0)`}>
        <path d={`M -${size} 0 L 0 0 L 0 ${size}`} fill="none" stroke="url(#cornerGrad)" strokeWidth={strokeWidth}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </path>
        <circle cx="0" cy="0" r="4" fill="purple">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Bottom Left */}
      <g transform={`translate(0, ${height})`}>
        <path d={`M 0 -${size} L 0 0 L ${size} 0`} fill="none" stroke="url(#cornerGrad)" strokeWidth={strokeWidth}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1s" repeatCount="indefinite" />
        </path>
        <circle cx="0" cy="0" r="4" fill="purple">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" begin="1s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Bottom Right */}
      <g transform={`translate(${width}, ${height})`}>
        <path d={`M -${size} 0 L 0 0 L 0 -${size}`} fill="none" stroke="url(#cornerGrad)" strokeWidth={strokeWidth}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1.5s" repeatCount="indefinite" />
        </path>
        <circle cx="0" cy="0" r="4" fill="cyan">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" begin="1.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

// Animated scanline
function Scanline() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <div
        className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
        style={{
          animation: 'scanline 8s linear infinite',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
        }}
      />
      <style>{`
        @keyframes scanline {
          0% { top: -5%; }
          100% { top: 105%; }
        }
      `}</style>
    </div>
  );
}

// Tech noise overlay
function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}

// Animated border frame
function BorderFrame() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });

  useEffect(() => {
    const update = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const { width, height } = dimensions;
  const pad = Math.min(width, height) * 0.02;
  const w = width - pad * 2;
  const h = height - pad * 2;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3 }}>
      <defs>
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0.8)">
            <animate attributeName="stop-color" values="rgba(6,182,212,0.8);rgba(139,92,246,0.8);rgba(6,182,212,0.8)" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="rgba(139, 92, 246, 0.4)" />
          <stop offset="100%" stopColor="rgba(6, 182, 212, 0.8)">
            <animate attributeName="stop-color" values="rgba(6,182,212,0.8);rgba(139,92,246,0.8);rgba(6,182,212,0.8)" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>

        <filter id="borderGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        x={pad}
        y={pad}
        width={w}
        height={h}
        fill="none"
        stroke="url(#borderGrad)"
        strokeWidth="1"
        rx="20"
        filter="url(#borderGlow)"
        opacity="0.6"
      >
        <animate
          attributeName="stroke-dasharray"
          values={`0, ${(w + h) * 2}; ${(w + h) * 2}, 0`}
          dur="10s"
          repeatCount="indefinite"
        />
      </rect>

      {/* Animated corner accents */}
      <g stroke="cyan" strokeWidth="2" fill="none" filter="url(#borderGlow)">
        <path d={`M ${pad} ${pad + 30} L ${pad} ${pad} L ${pad + 30} ${pad}`}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </path>
        <path d={`M ${width - pad - 30} ${pad} L ${width - pad} ${pad} L ${width - pad} ${pad + 30}`}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </path>
        <path d={`M ${width - pad} ${height - pad - 30} L ${width - pad} ${height - pad} L ${width - pad - 30} ${height - pad}`}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1s" repeatCount="indefinite" />
        </path>
        <path d={`M ${pad + 30} ${height - pad} L ${pad} ${height - pad} L ${pad} ${height - pad - 30}`}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1.5s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}

// Tech status indicators
function StatusIndicators() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-6 left-6 right-6 flex justify-between items-center pointer-events-none z-30 font-mono text-xs text-cyan-500/60">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>SYS.ONLINE</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>CPU: 12%</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden md:inline">{time.toISOString().split('T')[0]}</span>
        <span className="text-cyan-400">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
        <div className="flex gap-1">
          <div className="w-1 h-3 bg-cyan-500/40" />
          <div className="w-1 h-3 bg-cyan-500/60" />
          <div className="w-1 h-3 bg-cyan-500/80" />
          <div className="w-1 h-3 bg-cyan-500" />
        </div>
      </div>
    </div>
  );
}

// Animated radial gradient background
function RadialGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
          animation: 'pulseGlow 4s ease-in-out infinite'
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
          animation: 'pulseGlow 6s ease-in-out infinite reverse'
        }}
      />
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Main Screen Component
function Screen({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="font-[merienda] max-w-full text-xl font-bold text-slate-300 p-[50px] min-h-screen overflow-hidden relative"
      style={{
        background: "#050508",
      }}
    >
      {/* Layered background effects */}
      <RadialGlow />
      <PerspectiveGrid />
      <FloatingShapes />
      <NoiseOverlay />
      <Scanline />

      {/* Tech border frame */}
      <BorderFrame />

      {/* Status bar */}
      <StatusIndicators />

      {/* Main content container */}
      <div
        className={`inset-[25px] rounded-2xl md:inset-[50px] absolute p-[20px] md:p-[100px] z-10 overflow-hidden border border-slate-800/30 transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(10, 15, 30, 0.8) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow: `
            0 0 60px rgba(6, 182, 212, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 25px 50px -12px rgba(0, 0, 0, 0.5)
          `
        }}
      >
        {/* Inner tech lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern id="innerGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#innerGrid)" />
        </svg>

        {children}
      </div>

      {/* Decorative corner brackets outside container */}
      <CornerBrackets />

      {/* Bottom tech line */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-cyan-500/50" />
        <div className="w-2 h-2 bg-cyan-500/50 rotate-45" />
        <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-cyan-500/50" />
      </div>
    </div>
  )
}

export default Screen
