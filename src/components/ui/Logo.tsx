import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-32 h-32" }: LogoProps) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-xl" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="bgCircGradi" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2589bd" />
            <stop offset="100%" stopColor="#085285" />
          </radialGradient>
          
          <linearGradient id="bubbleGradi" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#43b8e8" />
            <stop offset="100%" stopColor="#1e84ba" />
          </linearGradient>

          <linearGradient id="robotGradi" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="glowHeavy" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="shadowHeavy">
            <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#000" floodOpacity="0.4"/>
          </filter>
          <filter id="shadowLight">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Outer Circle (White border) */}
        <circle cx="250" cy="250" r="240" fill="#fff" />
        
        {/* Inner Circle (Black border) */}
        <circle cx="250" cy="250" r="230" fill="#000" />
        
        {/* Main Blue Circle */}
        <circle cx="250" cy="250" r="215" fill="url(#bgCircGradi)" />

        {/* Network connections (Lines) */}
        <g stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2">
            <line x1="120" y1="160" x2="250" y2="70" />
            <line x1="250" y1="70" x2="330" y2="100" />
            <line x1="330" y1="100" x2="410" y2="180" />
            <line x1="410" y1="180" x2="420" y2="280" />
            <line x1="420" y1="280" x2="350" y2="380" />
            <line x1="350" y1="380" x2="250" y2="440" />
            <line x1="250" y1="440" x2="140" y2="390" />
            <line x1="140" y1="390" x2="80" y2="280" />
            <line x1="80" y1="280" x2="120" y2="160" />
            
            {/* Interconnections */}
            <line x1="120" y1="160" x2="180" y2="220" />
            <line x1="330" y1="100" x2="280" y2="240" />
            <line x1="410" y1="180" x2="340" y2="220" />
            <line x1="80" y1="280" x2="170" y2="300" />
            <line x1="250" y1="440" x2="250" y2="360" />
            <line x1="350" y1="380" x2="280" y2="280" />
            
            <line x1="180" y1="90" x2="120" y2="160" />
            <line x1="250" y1="70" x2="290" y2="150" />
            <line x1="380" y1="130" x2="330" y2="100" />
            <line x1="420" y1="350" x2="350" y2="380" />
            <line x1="140" y1="390" x2="100" y2="340" />
            <line x1="80" y1="280" x2="100" y2="220" />

            <line x1="120" y1="160" x2="70" y2="100" />
            <line x1="360" y1="50" x2="330" y2="100" />
            <line x1="440" y1="110" x2="410" y2="180" />
        </g>

        {/* Network Nodes (User icons) */}
        {[
          [250, 70], [120, 160], [330, 100], [410, 180], [420, 280], [350, 380], [250, 440], [140, 390], [80, 280],
          [180, 220], [280, 240], [340, 220], [170, 300], [250, 360], [280, 280],
          [180, 90], [290, 150], [380, 130], [420, 350], [100, 340], [100, 220], [70, 100], [360, 50], [440, 110]
        ].map((pos, i) => (
          <g key={i} transform={`translate(${pos[0]}, ${pos[1]})`}>
            <circle cx="0" cy="0" r="14" fill="#085285" stroke="#fff" strokeWidth="2" />
            {/* Simple torso for user */}
            <path d="M -7 7 Q 0 -4 7 7 Z" fill="#fff" />
            {/* Simple head */}
            <circle cx="0" cy="-3" r="4" fill="#fff" />
          </g>
        ))}

        {/* Bubble */}
        <g filter="url(#shadowHeavy)" transform="translate(130, 190)">
          {/* Main Bubble rounded rectangle */}
          <path d="M 0 30 
                   Q 0 0 30 0
                   L 210 0
                   Q 240 0 240 30
                   L 240 130
                   Q 240 160 210 160
                   L 90 160
                   L 30 220
                   L 45 160
                   L 30 160
                   Q 0 160 0 130
                   Z" 
                fill="url(#bubbleGradi)" 
                stroke="#6be4ff" strokeWidth="2.5" 
          />
        </g>
        
        {/* Robot Head Area */}
        <g transform="translate(180, 100)" filter="url(#shadowLight)">
          {/* Antenna line */}
          <line x1="70" y1="0" x2="70" y2="-25" stroke="#94a3b8" strokeWidth="6" />
          {/* Antenna ball */}
          <circle cx="70" cy="-25" r="9" fill="#1d4ed8" />
          
          {/* Neck base */}
          <path d="M 50 90 L 90 90 L 85 105 L 55 105 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
          
          {/* Main Head Base */}
          <rect x="0" y="0" width="140" height="95" rx="20" fill="url(#robotGradi)" stroke="#cbd5e1" strokeWidth="3" />
          
          {/* Ears */}
          <rect x="-10" y="25" width="20" height="45" rx="8" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="130" y="25" width="20" height="45" rx="8" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Inner Face Frame */}
          <rect x="10" y="10" width="120" height="75" rx="15" fill="#f8fafc" />
          
          {/* Face Screen */}
          <rect x="15" y="15" width="110" height="65" rx="10" fill="#0f172a" />
          
          {/* Glowing Eyes */}
          <path d="M 35 48 Q 45 33 55 48 Z" fill="#38bdf8" filter="url(#glowLight)" />
          <path d="M 85 48 Q 95 33 105 48 Z" fill="#38bdf8" filter="url(#glowLight)" />
          
          {/* Screen details */}
          <circle cx="65" cy="70" r="1.5" fill="#475569" />
          <circle cx="70" cy="70" r="1.5" fill="#475569" />
          <circle cx="75" cy="70" r="1.5" fill="#475569" />
        </g>

      </svg>
    </div>
  );
}
