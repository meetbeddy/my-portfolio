import React from "react";

const STATS_LEFT = [
  { label: "PAC", value: 90 },
  { label: "SHO", value: 92 },
  { label: "PAS", value: 88 },
];

const STATS_RIGHT = [
  { label: "DRI", value: 87 },
  { label: "DEF", value: 85 },
  { label: "PHY", value: 89 },
];

const FootballInterestCard = ({ bgColor = "rgba(255,255,255,0.08)" }) => {
  return (
    <div style={{ backgroundColor: bgColor, padding: "1.5rem", borderRadius: "12px" }}>
      <div style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem", color: "white" }}>
        ⚽ Football
      </div>
      <p style={{ color: "#aaa", marginBottom: "1.5rem", fontSize: "0.88rem", lineHeight: "1.6" }}>
        More hustle than bulk — football keeps me sharp when I&apos;m off the keyboard.
      </p>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');

          .fut-card-wrapper {
            position: relative;
            width: 260px;
            cursor: pointer;
            transform-style: preserve-3d;
            transition: transform 0.15s ease;
            will-change: transform;
          }
          .fut-card-wrapper:hover {
            transform: scale(1.04) rotateY(-7deg) rotateX(4deg);
          }
          .fut-scene {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 24px;
            background: radial-gradient(ellipse at 50% 30%, #1a1200 0%, #0a0800 60%, #000 100%);
            border-radius: 16px;
            position: relative;
            overflow: hidden;
            will-change: transform;
          }
          .scene-glow {
            position: absolute;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(218,165,32,0.1) 0%, transparent 70%);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -58%);
            pointer-events: none;
          }
          .card-outer-glow {
            position: absolute;
            inset: -20px;
            background: radial-gradient(ellipse at 50% 40%, rgba(255,210,50,0.3) 0%, transparent 65%);
            /* Reduced blur for performance */
            filter: blur(12px);
            pointer-events: none;
            z-index: 0;
            will-change: filter;
          }
          .card-body {
            position: relative;
            width: 260px;
            height: 370px;
            z-index: 1;
          }
          .card-svg {
            width: 100%;
            height: 100%;
            overflow: visible;
            /* Simplified drop-shadow */
            filter: drop-shadow(0 15px 30px rgba(0,0,0,0.7));
          }
          @keyframes shimmer-sweep {
            0%   { transform: translateX(-160px); }
            100% { transform: translateX(420px); }
          }
          .shimmer-sweep {
            animation: shimmer-sweep 3.8s ease-in-out infinite;
            animation-delay: 1.2s;
            will-change: transform;
          }
          @keyframes float-particle {
            0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
            20%       { opacity: 1; }
            80%       { opacity: 0.5; }
            100%      { opacity: 0; transform: translateY(-64px) scale(1); }
          }
          .particle {
            position: absolute;
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: #fce97a;
            animation: float-particle 3s ease-out infinite;
            will-change: transform, opacity;
          }
          .fut-footer {
            margin-top: 18px;
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 11px;
            letter-spacing: 3px;
            color: rgba(245,208,96,0.28);
            font-weight: 700;
            text-align: center;
          }
        `}</style>

        <div className="fut-scene">
          <div className="scene-glow" />

          {/* Floating gold particles */}
          {[
            { left: "40%", bottom: "30%", delay: "0s" },
            { left: "55%", bottom: "28%", delay: "0.8s", size: "2px" },
            { left: "48%", bottom: "32%", delay: "1.6s", size: "4px" },
            { left: "62%", bottom: "35%", delay: "2.2s" },
            { left: "35%", bottom: "25%", delay: "0.4s", size: "2px" },
          ].map((p, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: p.left,
                bottom: p.bottom,
                animationDelay: p.delay,
                width: p.size || "3px",
                height: p.size || "3px",
              }}
            />
          ))}

          <div className="fut-card-wrapper">
            <div className="card-outer-glow" />
            <div className="card-body">
              <svg
                className="card-svg"
                viewBox="0 0 260 370"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <clipPath id="card-clip">
                    <path d="M10,42 L50,10 L130,22 L210,10 L250,42 L250,310 L130,368 L10,310 Z" />
                  </clipPath>
                  <linearGradient id="gold-frame" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef3a0" />
                    <stop offset="12%" stopColor="#d4a017" />
                    <stop offset="28%" stopColor="#fce97a" />
                    <stop offset="45%" stopColor="#b8860b" />
                    <stop offset="62%" stopColor="#f0c030" />
                    <stop offset="78%" stopColor="#c8960a" />
                    <stop offset="88%" stopColor="#fce97a" />
                    <stop offset="100%" stopColor="#d4a017" />
                  </linearGradient>
                  <linearGradient id="card-bg" x1="20%" y1="0%" x2="80%" y2="100%">
                    <stop offset="0%" stopColor="#181200" />
                    <stop offset="30%" stopColor="#0d0900" />
                    <stop offset="65%" stopColor="#141000" />
                    <stop offset="100%" stopColor="#0a0700" />
                  </linearGradient>
                  <radialGradient id="inner-glow" cx="50%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#c8960a" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="silk-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="48%" stopColor="#fff" stopOpacity="0.07" />
                    <stop offset="52%" stopColor="#fff" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="shimmer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="40%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#fff" stopOpacity="0.2" />
                    <stop offset="60%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="name-bar" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c8960a" stopOpacity="0" />
                    <stop offset="20%" stopColor="#c8960a" stopOpacity="0.55" />
                    <stop offset="50%" stopColor="#f0c030" stopOpacity="0.65" />
                    <stop offset="80%" stopColor="#c8960a" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#c8960a" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="photo-fade" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0d0900" stopOpacity="0" />
                    <stop offset="60%" stopColor="#0d0900" stopOpacity="0" />
                    <stop offset="100%" stopColor="#0d0900" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="divider-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f5d060" stopOpacity="0" />
                    <stop offset="50%" stopColor="#f5d060" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#f5d060" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="bottom-vignette" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
                  </linearGradient>
                  <pattern id="frame-lines" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="6" x2="6" y2="0" stroke="#fff" strokeWidth="0.3" strokeOpacity="0.08" />
                  </pattern>
                </defs>

                {/* Gold outer frame */}
                <path d="M10,42 L50,10 L130,22 L210,10 L250,42 L250,310 L130,368 L10,310 Z" fill="url(#gold-frame)" />
                <path d="M10,42 L50,10 L130,22 L210,10 L250,42 L250,310 L130,368 L10,310 Z" fill="url(#frame-lines)" />

                {/* Inner card face */}
                <path d="M17,46 L52,16 L130,28 L208,16 L243,46 L243,307 L130,362 L17,307 Z" fill="url(#card-bg)" />
                <path d="M17,46 L52,16 L130,28 L208,16 L243,46 L243,307 L130,362 L17,307 Z" fill="url(#inner-glow)" />
                <path d="M17,46 L52,16 L130,28 L208,16 L243,46 L243,307 L130,362 L17,307 Z" fill="url(#silk-sheen)" />
                <path d="M17,180 L243,180 L243,307 L130,362 L17,307 Z" fill="url(#bottom-vignette)" />

                {/* ICON badge */}
                <rect x="22" y="24" width="38" height="13" rx="3" fill="#c8960a" opacity="0.3" />
                <text x="41" y="34" textAnchor="middle"
                  fontFamily="'Barlow Condensed', sans-serif" fontSize="8" fontWeight="900"
                  letterSpacing="1" fill="#fce97a">ICON</text>

                {/* Overall rating */}
                <text x="48" y="78" textAnchor="middle"
                  fontFamily="'Bebas Neue', Impact, sans-serif"
                  fontSize="52" fill="#f5d060">87</text>
                <text x="48" y="94" textAnchor="middle"
                  fontFamily="'Barlow Condensed', sans-serif"
                  fontSize="11" fontWeight="800" letterSpacing="2" fill="#f5d060">MD</text>

                {/* Nigeria flag */}
                <rect x="22" y="100" width="24" height="16" rx="1.5" fill="#222" />
                <rect x="22" y="100" width="8" height="16" fill="#008751" />
                <rect x="30" y="100" width="8" height="16" fill="#fff" />
                <rect x="38" y="100" width="6" height="16" rx="1.5" fill="#008751" />
                <rect x="38" y="100" width="6" height="16" fill="#008751" />
                <rect x="22" y="100" width="24" height="16" rx="1.5" fill="none" stroke="#fff" strokeWidth="0.4" strokeOpacity="0.4" />

                {/* PlayStyle+ diamonds */}
                {[28, 45, 62].map((y, i) => (
                  <g key={i}>
                    <rect x="212" y={y} width="12" height="12" rx="1.5"
                      transform={`rotate(45 218 ${y + 6})`}
                      fill="url(#gold-frame)" stroke="#fff" strokeWidth="0.8" />
                    <text x="218" y={y + 9} textAnchor="middle"
                      fontFamily="sans-serif" fontSize="6" fill="#000">★</text>
                  </g>
                ))}

                {/* Player image */}
                <image
                  href="/image/obed-jersey.jpeg"
                  x="70" y="48"
                  width="120" height="160"
                  clipPath="url(#card-clip)"
                  style={{ filter: "drop-shadow(0 0 10px rgba(180,100,255,0.2))" }}
                />

                {/* Photo area fade */}
                <rect x="17" y="176" width="226" height="28" fill="url(#photo-fade)" clipPath="url(#card-clip)" />

                {/* Name bar */}
                <rect x="17" y="206" width="226" height="24" fill="url(#name-bar)" />
                <line x1="40" y1="206" x2="220" y2="206" stroke="#f5d060" strokeWidth="0.4" strokeOpacity="0.5" />
                <line x1="40" y1="230" x2="220" y2="230" stroke="#f5d060" strokeWidth="0.3" strokeOpacity="0.3" />
                <text x="130" y="222" textAnchor="middle"
                  fontFamily="'Bebas Neue', sans-serif" fontSize="16"
                  letterSpacing="5" fill="#ffffff">OKPALA</text>

                {/* Stats left column */}
                {STATS_LEFT.map((s, i) => (
                  <g key={s.label}>
                    <text x="62" y={249 + i * 26} textAnchor="middle"
                      fontFamily="'Bebas Neue', sans-serif" fontSize="18" fill="#f5d060">{s.value}</text>
                    <text x="62" y={259 + i * 26} textAnchor="middle"
                      fontFamily="'Barlow Condensed', sans-serif" fontSize="8" fontWeight="700"
                      letterSpacing="1.5" fill="rgba(255,255,255,0.55)">{s.label}</text>
                  </g>
                ))}

                {/* Center divider */}
                <line x1="130" y1="236" x2="130" y2="318" stroke="url(#divider-glow)" strokeWidth="0.6" />

                {/* Stats right column */}
                {STATS_RIGHT.map((s, i) => (
                  <g key={s.label}>
                    <text x="198" y={249 + i * 26} textAnchor="middle"
                      fontFamily="'Bebas Neue', sans-serif" fontSize="18" fill="#f5d060">{s.value}</text>
                    <text x="198" y={259 + i * 26} textAnchor="middle"
                      fontFamily="'Barlow Condensed', sans-serif" fontSize="8" fontWeight="700"
                      letterSpacing="1.5" fill="rgba(255,255,255,0.55)">{s.label}</text>
                  </g>
                ))}

                {/* Stat row separators */}
                <line x1="36" y1="263" x2="224" y2="263" stroke="#f5d060" strokeWidth="0.2" strokeOpacity="0.15" />
                <line x1="36" y1="289" x2="224" y2="289" stroke="#f5d060" strokeWidth="0.2" strokeOpacity="0.15" />

                {/* Bottom bar */}
                <rect x="17" y="318" width="226" height="44" fill="#0a0700" opacity="0.6" clipPath="url(#card-clip)" />
                <line x1="40" y1="318" x2="220" y2="318" stroke="#f5d060" strokeWidth="0.3" strokeOpacity="0.3" />

                {/* Club hex */}
                <polygon points="98,329 106,325 114,329 114,337 106,341 98,337"
                  fill="none" stroke="#f5d060" strokeWidth="0.8" strokeOpacity="0.5" />
                <text x="106" y="336" textAnchor="middle"
                  fontFamily="'Barlow Condensed', sans-serif" fontSize="7" fontWeight="700"
                  fill="#f5d060" opacity="0.6">WEB</text>

                <circle cx="126" cy="333" r="1.2" fill="#f5d060" opacity="0.3" />
                <circle cx="134" cy="333" r="1.2" fill="#f5d060" opacity="0.3" />

                {/* League hex */}
                <polygon points="146,329 154,325 162,329 162,337 154,341 146,337"
                  fill="none" stroke="#f5d060" strokeWidth="0.8" strokeOpacity="0.5" />
                <text x="154" y="336" textAnchor="middle"
                  fontFamily="'Barlow Condensed', sans-serif" fontSize="7" fontWeight="700"
                  fill="#f5d060" opacity="0.6">DFC</text>

                {/* Chemistry style badge */}
                <rect x="214" y="326" width="18" height="18" rx="3"
                  fill="rgba(200,150,10,0.15)" stroke="#f5d060" strokeWidth="0.6" strokeOpacity="0.5" />
                <text x="223" y="338" textAnchor="middle"
                  fontFamily="'Barlow Condensed', sans-serif" fontSize="9" fontWeight="800"
                  fill="#f5d060" opacity="0.7">A</text>

                {/* Frame corner ornaments */}
                <path d="M20,52 L30,32 L40,25" stroke="#fce97a" strokeWidth="0.5" fill="none" opacity="0.4" />
                <path d="M240,52 L230,32 L220,25" stroke="#fce97a" strokeWidth="0.5" fill="none" opacity="0.4" />
                <path d="M105,20 L115,16 L125,14 L130,13 L135,14 L145,16 L155,20"
                  stroke="#fce97a" strokeWidth="0.6" fill="none" opacity="0.5" />
                <circle cx="130" cy="13" r="2.5" fill="#fce97a" opacity="0.5" />
                <path d="M118,358 L124,364 L130,368 L136,364 L142,358"
                  stroke="#fce97a" strokeWidth="0.6" fill="none" opacity="0.4" />
                <circle cx="130" cy="368" r="2" fill="#fce97a" opacity="0.3" />

                {/* Frame edge highlights */}
                <path d="M10,42 L50,10 L130,22" stroke="#fef3a0" strokeWidth="1.5" fill="none" opacity="0.6" />
                <path d="M17,46 L52,16 L130,28" stroke="#fff" strokeWidth="0.5" fill="none" opacity="0.25" />
                <path d="M250,42 L250,310 L130,368" stroke="#7a5500" strokeWidth="1" fill="none" opacity="0.5" />

                {/* Shimmer sweep */}
                <g className="shimmer-sweep" clipPath="url(#card-clip)">
                  <rect x="-60" y="0" width="80" height="370" fill="url(#shimmer-grad)" opacity="0.9" />
                </g>

                {/* EA watermark */}
                <text x="130" y="354" textAnchor="middle"
                  fontFamily="'Barlow Condensed', sans-serif" fontSize="6.5" fontWeight="700"
                  letterSpacing="2" fill="#f5d060" opacity="0.22">EA SPORTS FC 25</text>
              </svg>
            </div>
          </div>

          <p className="fut-footer">ICON SERIES — ULTIMATE TEAM</p>
        </div>
      </div>
    </div>
  );
};

export default FootballInterestCard;