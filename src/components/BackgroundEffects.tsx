import React from "react";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-visible pointer-events-none z-0">
      {/* Left & right ambient orbs – visible colour, moderate blur */}
      <div 
        className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full animate-pulse opacity-90 overflow-hidden" 
        style={{ 
          background: "radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0.08) 40%, transparent 70%)", 
          filter: "blur(80px)" 
        }} 
      />
      <div 
        className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full animate-pulse opacity-90 overflow-hidden" 
        style={{ 
          background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)", 
          filter: "blur(80px)", 
          animationDelay: "2s" 
        }} 
      />
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{ 
          backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} 
      />
      {/* Beams: full height (top → bottom), staggered so when one exits another starts = continuous flow */}
      {/* Left: emerald – 2 beams, half-period offset */}
      <div className="absolute top-0 left-[12%] w-[2px] h-full overflow-visible pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[100px] rounded-full" 
          style={{ 
            background: "linear-gradient(to bottom, transparent, rgba(16,185,129,0.7) 25%, rgba(16,185,129,0.9) 50%, rgba(16,185,129,0.7) 75%, transparent)", 
            boxShadow: "0 0 25px rgba(16,185,129,0.6), 0 0 50px rgba(16,185,129,0.35)", 
            animation: "beam-travel 7s linear infinite" 
          }} 
        />
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[100px] rounded-full" 
          style={{ 
            background: "linear-gradient(to bottom, transparent, rgba(16,185,129,0.7) 25%, rgba(16,185,129,0.9) 50%, rgba(16,185,129,0.7) 75%, transparent)", 
            boxShadow: "0 0 25px rgba(16,185,129,0.6), 0 0 50px rgba(16,185,129,0.35)", 
            animation: "beam-travel 7s linear 3.5s infinite" 
          }} 
        />
      </div>
      {/* Left-center: blue */}
      <div className="absolute top-0 left-[28%] w-[2px] h-full overflow-visible pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[100px] rounded-full" 
          style={{ 
            background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.7) 25%, rgba(59,130,246,0.9) 50%, rgba(59,130,246,0.7) 75%, transparent)", 
            boxShadow: "0 0 25px rgba(59,130,246,0.6), 0 0 50px rgba(59,130,246,0.35)", 
            animation: "beam-travel 6s linear infinite" 
          }} 
        />
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[100px] rounded-full" 
          style={{ 
            background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.7) 25%, rgba(59,130,246,0.9) 50%, rgba(59,130,246,0.7) 75%, transparent)", 
            boxShadow: "0 0 25px rgba(59,130,246,0.6), 0 0 50px rgba(59,130,246,0.35)", 
            animation: "beam-travel 6s linear 3s infinite" 
          }} 
        />
      </div>
      {/* Center: violet */}
      <div className="absolute top-0 left-1/2 w-[2px] h-full -translate-x-1/2 overflow-visible pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[120px] rounded-full" 
          style={{ 
            background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.7) 25%, rgba(139,92,246,0.9) 50%, rgba(139,92,246,0.7) 75%, transparent)", 
            boxShadow: "0 0 25px rgba(139,92,246,0.6), 0 0 50px rgba(139,92,246,0.35)", 
            animation: "beam-travel 6s linear 0.5s infinite" 
          }} 
        />
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[120px] rounded-full" 
          style={{ 
            background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.7) 25%, rgba(139,92,246,0.9) 50%, rgba(139,92,246,0.7) 75%, transparent)", 
            boxShadow: "0 0 25px rgba(139,92,246,0.6), 0 0 50px rgba(139,92,246,0.35)", 
            animation: "beam-travel 6s linear 3.5s infinite" 
          }} 
        />
      </div>
      {/* Right-center: pink */}
      <div className="absolute top-0 right-[28%] left-auto w-[2px] h-full overflow-visible pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[100px] rounded-full" 
          style={{ 
            background: "linear-gradient(to bottom, transparent, rgba(236,72,153,0.7) 25%, rgba(236,72,153,0.9) 50%, rgba(236,72,153,0.7) 75%, transparent)", 
            boxShadow: "0 0 25px rgba(236,72,153,0.6), 0 0 50px rgba(236,72,153,0.35)", 
            animation: "beam-travel 8s linear infinite" 
          }} 
        />
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[100px] rounded-full" 
          style={{ 
            background: "linear-gradient(to bottom, transparent, rgba(236,72,153,0.7) 25%, rgba(236,72,153,0.9) 50%, rgba(236,72,153,0.7) 75%, transparent)", 
            boxShadow: "0 0 25px rgba(236,72,153,0.6), 0 0 50px rgba(236,72,153,0.35)", 
            animation: "beam-travel 8s linear 4s infinite" 
          }} 
        />
      </div>
      {/* Right: amber */}
      <div className="absolute top-0 right-[12%] left-auto w-[2px] h-full overflow-visible pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[100px] rounded-full" 
          style={{ 
            background: "linear-gradient(to bottom, transparent, rgba(245,158,11,0.7) 25%, rgba(245,158,11,0.9) 50%, rgba(245,158,11,0.7) 75%, transparent)", 
            boxShadow: "0 0 25px rgba(245,158,11,0.6), 0 0 50px rgba(245,158,11,0.35)", 
            animation: "beam-travel 7s linear 1.5s infinite" 
          }} 
        />
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[100px] rounded-full" 
          style={{ 
            background: "linear-gradient(to bottom, transparent, rgba(245,158,11,0.7) 25%, rgba(245,158,11,0.9) 50%, rgba(245,158,11,0.7) 75%, transparent)", 
            boxShadow: "0 0 25px rgba(245,158,11,0.6), 0 0 50px rgba(245,158,11,0.35)", 
            animation: "beam-travel 7s linear 5.2s infinite" 
          }} 
        />
      </div>
    </div>
  );
}
