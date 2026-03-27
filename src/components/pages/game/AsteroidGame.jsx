import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

// ─── Keyframes ───────────────────────────────────────────────────────────────
const pulse = keyframes`0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.95)}`;
const floatUp = keyframes`0%{opacity:1;transform:translateY(0) translateX(-50%)}100%{opacity:0;transform:translateY(-48px) translateX(-50%)}`;
const slideIn = keyframes`from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}`;
const shakeAnim = keyframes`
  0%,100%{transform:translate(0,0)}
  10%{transform:translate(-4px, 3px)}
  20%{transform:translate(5px,-3px)}
  30%{transform:translate(-4px, 2px)}
  40%{transform:translate(4px,-2px)}
  50%{transform:translate(-3px, 3px)}
  60%{transform:translate(3px,-3px)}
  70%{transform:translate(-2px, 2px)}
  80%{transform:translate(2px,-2px)}
  90%{transform:translate(-1px, 1px)}
`;
const grazeFlash = keyframes`
  0%{opacity:0;transform:translateX(-50%) scale(.7)}
  40%{opacity:1;transform:translateX(-50%) scale(1.08)}
  100%{opacity:0;transform:translateX(-50%) scale(.9)}
`;

// ─── UI Components ────────────────────────────────────────────────────────────
const Wrapper = styled.div`
  position:fixed;inset:0;background:#060612;
  overflow:hidden;font-family:'Fira Code','Courier New',monospace;user-select:none;
  ${p => p.$shake && css`animation:${shakeAnim} .38s ease-out;`}
`;
const CanvasMount = styled.div`width:100%;height:100%;touch-action:none;`;

const HUD = styled.div`
  position:absolute;top:0;left:0;right:0;
  padding:1rem 1.4rem;display:flex;justify-content:space-between;
  align-items:flex-start;pointer-events:none;z-index:10;gap:1rem;
`;
const HudBlock = styled.div`display:flex;flex-direction:column;gap:.15rem;`;
const HudLabel = styled.div`font-size:.6rem;letter-spacing:3px;color:rgba(255,255,255,.3);`;
const HudValue = styled.div`
  font-size:${p => p.$lg ? '1.3rem' : '1rem'};font-weight:700;letter-spacing:3px;
  color:${p => p.$accent || 'rgba(255,255,255,.85)'};
  ${p => p.$accent && css`text-shadow:0 0 12px ${p.$accent}99;`}
`;
const HudCenter = styled.div`
  display:flex;flex-direction:column;align-items:center;gap:.1rem;pointer-events:none;
`;
const ComboText = styled.div`
  font-size:1.1rem;font-weight:700;letter-spacing:2px;
  color:#ffb74d;text-shadow:0 0 14px rgba(255,183,77,.8);
  animation:${pulse} .6s ease-in-out infinite;
`;

const PopupLayer = styled.div`position:absolute;inset:0;pointer-events:none;z-index:11;overflow:hidden;`;
const Popup = styled.div`
  position:absolute;
  font-size:${p => p.$big ? '1rem' : '.8rem'};font-weight:700;letter-spacing:1px;
  color:${p => p.$color || '#fff'};text-shadow:0 0 8px ${p => p.$color || '#fff'}88;
  animation:${floatUp} .9s ease-out forwards;white-space:nowrap;
`;
const GrazePopup = styled.div`
  position:absolute;bottom:30%;left:50%;
  font-size:1.05rem;font-weight:700;letter-spacing:3px;
  color:#ffe082;text-shadow:0 0 16px rgba(255,224,130,.9);
  animation:${grazeFlash} .8s ease-out forwards;white-space:nowrap;
  pointer-events:none;z-index:12;
`;

const PowerBar = styled.div`
  position:absolute;bottom:1.4rem;left:50%;transform:translateX(-50%);
  display:flex;gap:.6rem;pointer-events:none;z-index:10;
`;
const Pill = styled.div`
  display:flex;align-items:center;gap:.35rem;
  background:rgba(0,0,0,.6);backdrop-filter:blur(6px);
  border:1px solid ${p => p.$c};border-radius:2rem;
  padding:.28rem .75rem;font-size:.7rem;letter-spacing:1px;
  color:${p => p.$c};box-shadow:0 0 10px ${p => p.$c}44;
  animation:${pulse} 1.2s ease-in-out infinite;
`;

const BackBtn = styled(Link)`
  position:absolute;top:1rem;right:1.4rem;
  background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);
  color:rgba(255,255,255,.6);padding:.3rem .85rem;border-radius:1.5rem;
  font-size:.72rem;font-family:inherit;letter-spacing:1px;
  text-decoration:none;z-index:30;backdrop-filter:blur(8px);
  transition:background .2s,color .2s;
  &:hover{background:rgba(255,255,255,.14);color:#fff;}
`;

const Overlay = styled.div`
  position:absolute;inset:0;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:.9rem;
  background:rgba(6,6,18,.9);backdrop-filter:blur(8px);
  z-index:20;animation:${slideIn} .4s ease;overflow-y:auto;padding:1.5rem 1rem;
`;
const GameTitle = styled.h1`
  font-size:clamp(2rem,7vw,3rem);margin:0;color:#e04848;
  text-shadow:0 0 24px rgba(224,72,72,.9),0 0 50px rgba(224,72,72,.3);
  letter-spacing:6px;
`;
const Sub = styled.p`color:rgba(255,255,255,.4);font-size:.65rem;margin:0;letter-spacing:3px;`;
const ObjBox = styled.div`
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);
  border-radius:.75rem;padding:.9rem 1.3rem;width:min(420px,90vw);
`;
const ObjTitle = styled.div`
  color:rgba(255,255,255,.4);font-size:.6rem;letter-spacing:3px;text-transform:uppercase;
  margin-bottom:.55rem;border-bottom:1px solid rgba(255,255,255,.07);padding-bottom:.35rem;
`;
const ObjRow = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:.18rem 0;font-size:.75rem;color:rgba(255,255,255,.65);
  span.v{color:${p => p.$vc || '#e04848'};font-weight:600;}
`;
const Legend = styled.div`display:flex;gap:.55rem;flex-wrap:wrap;justify-content:center;width:min(420px,90vw);`;
const LItem = styled.div`
  display:flex;align-items:center;gap:.3rem;font-size:.68rem;
  color:${p => p.$c};background:${p => p.$c}18;border:1px solid ${p => p.$c}50;
  border-radius:1rem;padding:.22rem .6rem;
`;
const CtrlRow = styled.div`font-size:.67rem;color:rgba(255,255,255,.3);letter-spacing:1px;text-align:center;line-height:2;`;
const LaunchBtn = styled.button`
  background:linear-gradient(135deg,#e04848,#b02020);color:#fff;
  border:none;padding:.65rem 2.2rem;border-radius:2rem;font-size:.9rem;
  font-family:inherit;font-weight:700;letter-spacing:4px;cursor:pointer;
  box-shadow:0 4px 20px rgba(224,72,72,.5);transition:transform .18s,box-shadow .18s;
  margin-top:.2rem;
  &:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 8px 28px rgba(224,72,72,.7);}
  &:active{transform:scale(.97);}
`;
const HighScore = styled.div`font-size:.9rem;color:rgba(255,255,255,.5);letter-spacing:2px;`;
const FinalScore = styled.div`font-size:1.4rem;color:#e04848;letter-spacing:3px;`;

// ─── Constants ────────────────────────────────────────────────────────────────
const PUPS = {
  shield: { color: 0x4880e0, hex: '#4880e0', label: 'SHIELD', dur: 10000 },
  rapid: { color: 0x48e080, hex: '#48e080', label: 'RAPID FIRE', dur: 8000 },
  bigbullet: { color: 0xffb74d, hex: '#ffb74d', label: 'BIG SHOT', dur: 8000 },
  spread: { color: 0xc048e0, hex: '#c048e0', label: 'SPREAD', dur: 8000 },
  laser: { color: 0x48e0e0, hex: '#48e0e0', label: 'LASER', dur: 6000 },
  bomb: { color: 0xe02048, hex: '#e02048', label: 'SMART BOMB', dur: 0 },
};

// ✅ FIX 1: Correct colour construction — use THREE.Color properly, not raw floats
const ASTEROID_TYPES = [
  // Rocky (common) — grey, matte
  { weight: 5, matProps: (size) => ({ color: new THREE.Color('#595968'), roughness: 0.92, metalness: 0.05 }), emissive: null, ptsMult: 1 },
  // Metallic (uncommon) — dark gold sheen
  { weight: 3, matProps: (size) => ({ color: new THREE.Color('#8a7a50'), roughness: 0.35, metalness: 0.88 }), emissive: null, ptsMult: 1 },
  // Crystal (rare) — glowing blue-white shard
  { weight: 2, matProps: (size) => ({ color: new THREE.Color('#9aaeff'), roughness: 0.15, metalness: 0.6 }), emissive: new THREE.Color('#3355bb'), ptsMult: 2 },
];

const pickAsteroidType = () => {
  const total = ASTEROID_TYPES.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  for (const t of ASTEROID_TYPES) { r -= t.weight; if (r <= 0) return t; }
  return ASTEROID_TYPES[0];
};

const asteroidConfig = (size) => {
  if (size > 0.85) return { pts: 5 };
  if (size > 0.52) return { pts: 10 };
  return { pts: 20 };
};

// ─── Sound Hooks (Web Audio API) ─────────────────────────────────────────────
// ✅ FIX 5: Sound hooks — lazy AudioContext (unmuted on first user gesture)
const createAudio = () => {
  try { return new (window.AudioContext || window.webkitAudioContext)(); }
  catch { return null; }
};

const playTone = (ctx, { freq = 440, type = 'sine', gain = 0.18, dur = 0.12, decay = 0.08 } = {}) => {
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.connect(vol); vol.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + dur);
    vol.gain.setValueAtTime(gain, ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur + decay);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur + decay + 0.01);
  } catch { }
};

const SFX = {
  shoot: ctx => playTone(ctx, { freq: 880, type: 'square', gain: 0.09, dur: 0.06, decay: 0.04 }),
  explode: ctx => playTone(ctx, { freq: 120, type: 'sawtooth', gain: 0.22, dur: 0.18, decay: 0.14 }),
  hit: ctx => playTone(ctx, { freq: 55, type: 'sawtooth', gain: 0.28, dur: 0.25, decay: 0.20 }),
  powerup: ctx => playTone(ctx, { freq: 660, type: 'sine', gain: 0.20, dur: 0.25, decay: 0.12 }),
  graze: ctx => playTone(ctx, { freq: 1200, type: 'sine', gain: 0.12, dur: 0.07, decay: 0.06 }),
};

// ─── Synthwave Audio ──────────────────────────────────────────────────────────
const startSynthwave = (ctx) => {
  if (!ctx || ctx.state === 'suspended') return null;
  try {
    // Bassline pattern (root, 5th, root, octave)
    const notes = [55, 82.5, 55, 110, 55, 82.5, 110, 82.5]; // A1, E2, A1, A2
    let step = 0;
    const bpm = 128;
    const stepDur = (60 / bpm) / 2; // 8th notes

    const playNote = () => {
      if (!ctx || ctx.state === 'closed') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      osc.type = 'sawtooth';
      osc.frequency.value = notes[step % notes.length];
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + stepDur * 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + stepDur);
      step++;
    };

    playNote();
    const interval = setInterval(playNote, stepDur * 1000);
    return interval;
  } catch { return null; }
};

const AsteroidGame = () => {
  const mountRef = useRef(null);
  const audioCtxRef = useRef(null);
  const shakeTimer = useRef(null);
  const uiTick = useRef(0); // Fix 2: throttle React state updates

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [phase, setPhase] = useState('start');
  const [activePUps, setActivePUps] = useState({});
  const [combo, setCombo] = useState(0);
  const [popups, setPopups] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [grazeMsg, setGrazeMsg] = useState(null);
  const [paused, setPaused] = useState(false);
  const [gameStats, setGameStats] = useState({ grazesTotal: 0, asteroidsDestroyed: 0, timeSurvived: 0, maxCombo: 0 });

  const finalScore = useRef(0);
  const highScore = useRef(Number(sessionStorage.getItem('hs') || 0));
  const popupId = useRef(0);
  const gameStartTime = useRef(0);
  const statsRef = useRef({ grazesTotal: 0, asteroidsDestroyed: 0, maxCombo: 0 });
  const synthIntervalRef = useRef(null);

  // ── Audio unlock on first interaction ───────────────────────────────────
  const unlockAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudio();
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => { });
    }
  }, []);

  const addPopup = (x, y, text, color, big = false) => {
    const id = popupId.current++;
    setPopups(ps => [...ps, { id, x, y, text, color, big }]);
    setTimeout(() => setPopups(ps => ps.filter(p => p.id !== id)), 950);
  };

  const togglePause = useCallback(() => {
    setPaused(prev => !prev);
  }, []);

  const startGame = (withWarp = false) => {
    unlockAudio();
    finalScore.current = 0;
    gameStartTime.current = Date.now();
    statsRef.current = { grazesTotal: 0, asteroidsDestroyed: 0, maxCombo: 0 };
    setScore(0); setLives(3); setActivePUps({});
    setCombo(0); setPopups([]); setShaking(false); setGrazeMsg(null); setPaused(false);
    setGameStats({ grazesTotal: 0, asteroidsDestroyed: 0, timeSurvived: 0, maxCombo: 0 });
    // Start synthwave loop after a short delay (audio context needs to unlock first)
    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    setTimeout(() => {
      synthIntervalRef.current = startSynthwave(audioCtxRef.current);
    }, 500);
    if (withWarp) {
      setPhase('warp');
      setTimeout(() => setPhase('playing'), 1800);
    } else {
      setPhase('playing');
    }
  };

  // ✅ FIX 4: Screen shake — toggle class, re-trigger via key
  const triggerShake = useCallback(() => {
    setShaking(false);
    requestAnimationFrame(() => setShaking(true));
    clearTimeout(shakeTimer.current);
    shakeTimer.current = setTimeout(() => setShaking(false), 420);
  }, []);

  const showGraze = useCallback((pts) => {
    const id = Date.now();
    setGrazeMsg({ id, pts });
    setTimeout(() => setGrazeMsg(g => g?.id === id ? null : g), 820);
  }, []);


  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing' && phase !== 'warp') return;
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const isMobile = mount.clientWidth < 768;
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, // Disable antialias on mobile for performance
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x060612);
    mount.appendChild(renderer.domElement);

    // ── Scene + Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const aspect = mount.clientWidth / mount.clientHeight;
    const cam = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    cam.position.set(0, 0, 15);

    const halfH = Math.tan(THREE.MathUtils.degToRad(30)) * 15;
    const halfW = halfH * aspect;
    const B = { x: halfW * 0.88, y: halfH * 0.88 };

    const screenToWorld = (sx, sy) => {
      const rect = mount.getBoundingClientRect();
      const nx = (sx - rect.left) / rect.width;
      const ny = (sy - rect.top) / rect.height;
      return { x: (nx - 0.5) * B.x * 2, y: -(ny - 0.5) * B.y * 2 };
    };
    const worldToScreen = (wx, wy) => {
      const v = new THREE.Vector3(wx, wy, 0).project(cam);
      return {
        x: (v.x * 0.5 + 0.5) * mount.clientWidth,
        y: (-v.y * 0.5 + 0.5) * mount.clientHeight,
      };
    };

    // ── Lights ────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x223344, 1.2);
    scene.add(ambientLight);
    const sun = new THREE.DirectionalLight(0xffffff, 0.9);
    sun.position.set(4, 8, 6);
    scene.add(sun);
    const shipLight = new THREE.PointLight(0xe04848, 3, 8);
    scene.add(shipLight);

    // ── Stars ─────────────────────────────────────────────────────────────
    const starCount = isMobile ? 300 : 600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - .5) * 55;
      starPos[i * 3 + 1] = (Math.random() - .5) * 38;
      starPos[i * 3 + 2] = -5 - Math.random() * 15;
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starField = new THREE.Points(sg,
      new THREE.PointsMaterial({ color: 0xffffff, size: .065, sizeAttenuation: true, transparent: true, opacity: .8 }));
    scene.add(starField);

    // ── Ship ──────────────────────────────────────────────────────────────
    const shipGroup = new THREE.Group();
    const coneMesh = new THREE.Mesh(
      new THREE.ConeGeometry(.45, 1.3, 3),
      new THREE.MeshStandardMaterial({ color: 0xe04848, emissive: 0x3a0000, roughness: .28, metalness: .75 })
    );
    shipGroup.add(coneMesh);
    const wings = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, .08, .4),
      new THREE.MeshStandardMaterial({ color: 0xcc3333, metalness: .9, roughness: .2 })
    );
    wings.position.y = -.4;
    shipGroup.add(wings);
    const engineMesh = new THREE.Mesh(
      new THREE.SphereGeometry(.18, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff8800 })
    );
    engineMesh.position.y = -.75;
    shipGroup.add(engineMesh);
    const shieldMesh = new THREE.Mesh(
      new THREE.TorusGeometry(.95, .06, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0x4880e0, transparent: true, opacity: 0 })
    );
    shieldMesh.rotation.x = Math.PI / 2;
    shipGroup.add(shieldMesh);
    const shieldLight = new THREE.PointLight(0x4880e0, 0, 5);
    shipGroup.add(shieldLight);
    shipGroup.position.set(0, -B.y + 2, 0);
    scene.add(shipGroup);

    // ── Game State ────────────────────────────────────────────────────────
    const gs = {
      running: true, livesLeft: 3,
      bullets: [], asteroids: [], particles: [], powerups: [], ufos: [],
      keys: {}, mouse: { x: 0, y: -B.y + 2 }, touchActive: false,
      lastShot: 0, lastSpawn: 0, lastPowerUp: 0, lastUfoSpawn: 0,
      // ✅ FIX 3: Dynamic difficulty — wave-based breathing pattern
      waveTimer: 0, wavePhase: 0, // 0=normal 1=surge 2=calm
      spawnInterval: 2200, diffMult: 1,
      shield: false, shieldExpires: 0,
      rapid: false, rapidExpires: 0,
      bigbullet: false, bigbulletExpires: 0,
      spread: false, spreadExpires: 0,
      laser: false, laserExpires: 0,
      lastHitTime: 0, comboCount: 0,
      // Graze state — one graze per asteroid
      grazedIds: new Set(),
    };
    let localScore = 0, localLives = 3;

    // ── Factories ─────────────────────────────────────────────────────────
    const disposables = [];  // meshes tracked for geometry+material disposal
    const particleMats = []; // Fix 7: particle materials (shared geo, dispose mats only)
    // Fix 7: one shared geometry for ALL particles — much cheaper than per-explosion alloc
    const particleGeo = new THREE.SphereGeometry(.08, 4, 4);
    let lastTouchTime = 0; // Fix 4: ghost-click guard

    const trackMesh = (mesh) => { disposables.push(mesh); return mesh; };

    // ── Thruster Trail ─────────────────────────────────────────────────────
    const trailGeo = new THREE.SphereGeometry(0.07, 4, 4);
    const trailParticles = [];
    let lastTrailPos = { x: 0, y: 0 };

    const emitTrail = () => {
      const TRAIL_COLORS = [0xff8800, 0xff4400, 0xff2200];
      const color = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
      particleMats.push(mat);
      const m = new THREE.Mesh(trailGeo, mat);
      m.position.copy(engineMesh.getWorldPosition(new THREE.Vector3()));
      m.position.x += (Math.random() - 0.5) * 0.12;
      m.position.z += (Math.random() - 0.5) * 0.15;
      scene.add(m);
      trailParticles.push({ mesh: m, life: 1, vy: -(Math.random() * 0.04 + 0.01) });
    };

    const makeBullet = (angleOffset = 0, isLaser = gs.laser) => {
      const size = gs.bigbullet ? .28 : .12;
      const color = isLaser ? 0x48e0e0 : gs.bigbullet ? 0xffb74d : 0xff5500;
      
      let geo, mat, mesh, bLight;
      if (isLaser) {
        geo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8);
        mat = new THREE.MeshBasicMaterial({ color });
        mesh = trackMesh(new THREE.Mesh(geo, mat));
        bLight = new THREE.PointLight(color, 4, 6);
      } else {
        geo = new THREE.SphereGeometry(size, 8, 8);
        mat = new THREE.MeshBasicMaterial({ color });
        mesh = trackMesh(new THREE.Mesh(geo, mat));
        bLight = new THREE.PointLight(color, gs.bigbullet ? 4 : 2.5, gs.bigbullet ? 6 : 4);
      }
      
      mesh.position.copy(shipGroup.position);
      mesh.position.y += .9;
      const rad = THREE.MathUtils.degToRad(angleOffset);
      mesh.rotation.z = -rad;
      mesh.add(bLight);
      scene.add(mesh);
      gs.bullets.push({ 
        mesh, 
        vx: Math.sin(rad) * (isLaser ? 0.5 : 0.18), 
        vy: isLaser ? 0.7 : 0.32, 
        big: gs.bigbullet, 
        pierce: isLaser,
        geo, mat 
      });
    };

    const shoot = () => {
      SFX.shoot(audioCtxRef.current);
      if (gs.spread) {
        makeBullet(-24); makeBullet(-12); makeBullet(0); makeBullet(12); makeBullet(24);
      } else if (gs.rapid) {
        makeBullet(-16); makeBullet(0); makeBullet(16);
      } else {
        makeBullet(0);
      }
    };

    const makeAsteroid = () => {
      const size = .35 + Math.random() * .78;
      const cfg = asteroidConfig(size);
      const type = pickAsteroidType();
      const matProps = type.matProps(size);
      const detail = Math.random() > .5 ? 1 : 0;
      
      // Crystal asteroids use Box/Octahedron for a sharper look
      let geo;
      if (type === ASTEROID_TYPES[2]) {
        geo = new THREE.OctahedronGeometry(size, detail);
      } else {
        geo = new THREE.IcosahedronGeometry(size, detail);
      }
      
      const mat = new THREE.MeshStandardMaterial({
        ...matProps,
        emissive: type.emissive || new THREE.Color('#000000'),
        emissiveIntensity: type.emissive ? 0.45 : 0,
      });
      const mesh = trackMesh(new THREE.Mesh(geo, mat));
      mesh.position.set((Math.random() - .5) * B.x * 1.8, B.y + size + .5, (Math.random() - .5) * 1.5);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      
      // Crystal asteroids glow
      if (type.emissive) {
        const glow = new THREE.PointLight(matProps.color, 1.5, 4);
        mesh.add(glow);
      }
      
      scene.add(mesh);
      gs.asteroids.push({
        mesh, size, pts: cfg.pts * type.ptsMult, geo, mat,
        id: Math.random().toString(36).slice(2),
        vy: -(0.022 + Math.random() * 0.011) * gs.diffMult,
        rx: (Math.random() - .5) * .016,
        ry: (Math.random() - .5) * .016,
      });
    };

    const makePowerUp = () => {
      const types = Object.keys(PUPS);
      const type = types[Math.floor(Math.random() * types.length)];
      const cfg = PUPS[type];
      const geo = new THREE.OctahedronGeometry(.38);
      const mat = new THREE.MeshStandardMaterial({ color: cfg.color, emissive: cfg.color, emissiveIntensity: .4, roughness: .2, metalness: .8 });
      const mesh = trackMesh(new THREE.Mesh(geo, mat));
      mesh.position.set((Math.random() - .5) * B.x * 1.6, B.y + .6, 0);
      mesh.add(new THREE.PointLight(cfg.color, 2.5, 5));
      scene.add(mesh);
      gs.powerups.push({ mesh, type, vy: -0.016, geo, mat });
    };

    const makeUfo = () => {
      const g = new THREE.Group();
      
      // UFO Base
      const geo1 = new THREE.SphereGeometry(0.7, 16, 8);
      geo1.scale(1, 0.25, 1);
      const mat1 = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.1 });
      const mesh1 = trackMesh(new THREE.Mesh(geo1, mat1));
      
      // UFO Cockpit
      const geo2 = new THREE.SphereGeometry(0.4, 16, 8);
      geo2.scale(1, 0.7, 1);
      const mat2 = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      const mesh2 = trackMesh(new THREE.Mesh(geo2, mat2));
      mesh2.position.y = 0.2;
      
      const uLight = new THREE.PointLight(0x00ffff, 3, 5);
      
      g.add(mesh1);
      g.add(mesh2);
      g.add(uLight);
      
      const fromLeft = Math.random() > 0.5;
      g.position.set(fromLeft ? -B.x - 2 : B.x + 2, B.y - 1 - Math.random() * (B.y - 1), 0);
      scene.add(g);
      
      // We push meshes so we can track and delete them if needed, but removeMesh handles the Group just fine usually
      gs.ufos.push({
        mesh: g,
        vx: (fromLeft ? 1 : -1) * (0.05 + Math.random() * 0.04),
        pts: 100
      });
    };

    const explode = (pos, color = 0xff5500, count = 14) => {
      const particleCount = mount.clientWidth < 768 ? Math.floor(count * 0.6) : count;
      for (let i = 0; i < particleCount; i++) {
        // Fix 7: reuse shared particleGeo — never track via trackMesh (avoids double-dispose)
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
        particleMats.push(mat);
        const m = new THREE.Mesh(particleGeo, mat);
        m.position.copy(pos);
        const vel = new THREE.Vector3(
          (Math.random() - .5) * .22,
          (Math.random() - .5) * .22,
          (Math.random() - .5) * .08
        );
        scene.add(m);
        gs.particles.push({ mesh: m, vel, life: 1, mat });
      }

      // ── Energy Ring: expanding torus that fades out ────────────────
      const ringGeo = new THREE.TorusGeometry(0.1, 0.04, 6, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      particleMats.push(ringMat);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      gs.particles.push({ mesh: ring, vel: new THREE.Vector3(0, 0, 0), life: 1, mat: ringMat, isRing: true, scale: 0.1 });
    };

    // ── Input ─────────────────────────────────────────────────────────────
    const onKeyDown = e => {
      gs.keys[e.code] = true;
      unlockAudio();
      if (e.code === 'Escape') togglePause();
    };
    const onKeyUp = e => { gs.keys[e.code] = false; };

    const onMouseMove = e => {
      const w = screenToWorld(e.clientX, e.clientY);
      gs.mouse.x = w.x;
      gs.mouse.y = THREE.MathUtils.clamp(w.y, -B.y + .5, B.y - .5);
      gs.touchActive = false;
    };

    const onClick = () => {
      // Fix 4: ignore ghost click emitted right after touchstart on mobile
      if (Date.now() - lastTouchTime < 500) return;
      unlockAudio();
      if (gs.running) { shoot(); }
    };

    // ✅ Relative Touch Joystick — drag anywhere to move ship, tap to shoot
    let touchOrigin = null; // { clientX, clientY, shipX, shipY }

    const onTouchMove = e => {
      e.preventDefault();
      if (!touchOrigin) return;
      const t = e.touches[0];
      const dx = t.clientX - touchOrigin.clientX;
      const dy = t.clientY - touchOrigin.clientY;
      // Convert pixel delta to world units (approx)
      const worldW = B.x * 2;
      const pxW = mount.clientWidth;
      const scale = worldW / pxW;
      gs.mouse.x = THREE.MathUtils.clamp(touchOrigin.shipX + dx * scale, -B.x + .5, B.x - .5);
      gs.mouse.y = THREE.MathUtils.clamp(touchOrigin.shipY - dy * scale, -B.y + .5, B.y - .5);
      gs.touchActive = true;
    };

    const onTouchStart = e => {
      e.preventDefault();
      lastTouchTime = Date.now();
      unlockAudio();
      const t = e.touches[0];
      // Record the finger origin and current ship world position
      touchOrigin = {
        clientX: t.clientX,
        clientY: t.clientY,
        shipX: shipGroup.position.x,
        shipY: shipGroup.position.y,
      };
      gs.touchActive = true;
      if (gs.running) shoot();
    };

    const onTouchEnd = () => { touchOrigin = null; };

    const onResize = () => {
      cam.aspect = mount.clientWidth / mount.clientHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    mount.addEventListener('mousemove', onMouseMove);
    mount.addEventListener('click', onClick);
    mount.addEventListener('touchstart', onTouchStart, { passive: false });
    mount.addEventListener('touchmove', onTouchMove, { passive: false });
    mount.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', onResize);

    // ── Game Loop ─────────────────────────────────────────────────────────
    let raf;
    let warpStart = phase === 'warp' ? performance.now() : 0;
    // Fix 3: only remove from scene here — cleanup() does the single-pass disposal
    const removeMesh = (mesh) => { scene.remove(mesh); };

    const tick = t => {
      uiTick.current++;
      raf = requestAnimationFrame(tick);
      const now = performance.now();

      // ── Hyperspace Warp ───────────────────────────────────────────────
      if (phase === 'warp') {
        if (warpStart === 0) warpStart = now;
        const elapsed = now - warpStart;
        const progress = Math.min(elapsed / 1600, 1);
        // Stretch stars upward, then snap back
        const stretch = progress < 0.5
          ? 1 + progress * 30        // ramp up: scale from 1 → 16
          : 16 - (progress - 0.5) * 30; // snap back: scale 16 → 1
        starField.scale.set(1, Math.max(1, stretch), 1);
        renderer.render(scene, cam);
        return;
      } else {
        starField.scale.set(1, 1, 1);
      }

      if (!gs.running) return;

      // ── Pause gate ────────────────────────────────────────────────────
      if (paused) { renderer.render(scene, cam); return; }

      // ── Ship movement ─────────────────────────────────────────────────
      const spd = .13;
      const usingKeyboard =
        gs.keys['ArrowLeft'] || gs.keys['ArrowRight'] ||
        gs.keys['ArrowUp'] || gs.keys['ArrowDown'] ||
        gs.keys['KeyA'] || gs.keys['KeyD'] || gs.keys['KeyW'] || gs.keys['KeyS'];

      if (gs.keys['ArrowLeft'] || gs.keys['KeyA'])
        shipGroup.position.x = Math.max(-B.x + .5, shipGroup.position.x - spd);
      if (gs.keys['ArrowRight'] || gs.keys['KeyD'])
        shipGroup.position.x = Math.min(B.x - .5, shipGroup.position.x + spd);
      if (gs.keys['ArrowUp'] || gs.keys['KeyW'])
        shipGroup.position.y = Math.min(B.y - .5, shipGroup.position.y + spd * .8);
      if (gs.keys['ArrowDown'] || gs.keys['KeyS'])
        shipGroup.position.y = Math.max(-B.y + .5, shipGroup.position.y - spd * .8);

      if (!usingKeyboard) {
        shipGroup.position.x += (gs.mouse.x - shipGroup.position.x) * .09;
        shipGroup.position.y += (gs.mouse.y - shipGroup.position.y) * .06;
        shipGroup.position.x = THREE.MathUtils.clamp(shipGroup.position.x, -B.x + .5, B.x - .5);
        shipGroup.position.y = THREE.MathUtils.clamp(shipGroup.position.y, -B.y + .5, B.y - .5);
      }

      // Ship FX
      shipLight.position.copy(shipGroup.position); shipLight.position.z = 3;
      engineMesh.material.color.setHex(Math.random() > .35 ? 0xff8800 : 0xff3300);
      shipGroup.rotation.z = Math.sin(t * .002) * .05;

      // Thruster trail — emit every 2 frames
      if (uiTick.current % 2 === 0) emitTrail();

      // Update trail particles
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const tp = trailParticles[i];
        tp.mesh.position.y += tp.vy;
        tp.mesh.position.x += (Math.random() - 0.5) * 0.015;
        tp.life -= 0.07;
        tp.mesh.material.opacity = Math.max(0, tp.life * 0.8);
        const s = Math.max(0, tp.life);
        tp.mesh.scale.setScalar(s);
        if (tp.life <= 0) { removeMesh(tp.mesh); trailParticles.splice(i, 1); }
      }

      // Power-up timing
      const pActive = {};
      for (const type of ['shield', 'rapid', 'bigbullet', 'spread', 'laser']) {
        if (gs[type]) {
          if (now > gs[`${type}Expires`]) { gs[type] = false; }
          else { pActive[type] = Math.ceil((gs[`${type}Expires`] - now) / 1000); }
        }
      }
      shieldMesh.material.opacity = gs.shield ? .65 : 0;
      shieldLight.intensity = gs.shield ? 2 : 0;
      if (gs.shield) shieldMesh.rotation.z += .03;
      // Fix 2: throttle React state — only push UI updates at ~10fps (every 6 frames)
      if (uiTick.current % 6 === 0) setActivePUps({ ...pActive });

      // Keyboard shooting (held = auto-fire)
      const cooldown = gs.rapid ? 80 : 190;
      if ((gs.keys['Space'] || gs.keys['Enter']) && t - gs.lastShot > cooldown) {
        shoot(); gs.lastShot = t;
      }

      // ✅ FIX 3: Dynamic difficulty — wave-breathing system
      gs.waveTimer += 16; // ~60fps tick
      const waveLen = 18000; // 18s per wave cycle
      const wavePos = (gs.waveTimer % waveLen) / waveLen; // 0..1
      const scaledScore = Math.floor(localScore / 200);
      // Surge 40% of cycle, calm 20%, normal 40%
      let waveMod = 1.0;
      if (wavePos < 0.4) {
        waveMod = 1.0 + wavePos * 1.5; // ramp up → 1.0 to 1.6
      } else if (wavePos < 0.6) {
        waveMod = 1.6 - (wavePos - 0.4) * 4; // rapid drop → 1.6 to 0.8
      } else {
        waveMod = 0.8 + (wavePos - 0.6) * 0.5; // slow recovery → 0.8 to 1.0
      }
      gs.diffMult = (1 + scaledScore * 0.2) * waveMod;
      // Fix 6: chaos factor makes difficulty feel organic, not mathematical
      const chaos = 0.85 + Math.random() * 0.3;
      gs.spawnInterval = Math.max(450, ((2200 - scaledScore * 100) / waveMod) * chaos);

      // Spawn asteroids
      if (t - gs.lastSpawn > gs.spawnInterval) {
        makeAsteroid();
        if (Math.random() > .65) makeAsteroid();
        gs.lastSpawn = t;
      }

      // Spawn power-ups
      if (gs.lastPowerUp === 0 || t - gs.lastPowerUp > 10000 + Math.random() * 7000) {
        makePowerUp(); gs.lastPowerUp = t;
      }

      // Spawn UFOs
      if (gs.lastUfoSpawn === 0 || t - gs.lastUfoSpawn > 20000 + Math.random() * 15000) {
        makeUfo(); gs.lastUfoSpawn = t;
      }

      // ── Bullets ───────────────────────────────────────────────────────
      for (let i = gs.bullets.length - 1; i >= 0; i--) {
        const b = gs.bullets[i];
        b.mesh.position.x += b.vx || 0;
        b.mesh.position.y += b.vy;
        let hit = false;

        for (let j = gs.asteroids.length - 1; j >= 0; j--) {
          const a = gs.asteroids[j];
          const hr = b.big ? a.size + .3 : a.size + .14;
          if (b.mesh.position.distanceTo(a.mesh.position) < hr) {
            SFX.explode(audioCtxRef.current);
            explode(a.mesh.position);
            removeMesh(a.mesh);
            if (!b.pierce) {
              removeMesh(b.mesh);
              hit = true;
            }
            gs.asteroids.splice(j, 1);
            gs.grazedIds.delete(a.id);

            // Combo calc
            const timeSinceLast = now - gs.lastHitTime;
            if (timeSinceLast < 1500) { gs.comboCount = Math.min(gs.comboCount + 1, 8); }
            else { gs.comboCount = 1; }
            gs.lastHitTime = now;
            const multiplier = gs.comboCount >= 3 ? gs.comboCount : 1;
            const earned = a.pts * multiplier;
            localScore += earned;
            setScore(localScore);
            if (gs.comboCount >= 3) setCombo(gs.comboCount);
            else setCombo(0);

            // Track stats
            statsRef.current.asteroidsDestroyed++;
            if (gs.comboCount > statsRef.current.maxCombo) statsRef.current.maxCombo = gs.comboCount;

            const sp = worldToScreen(a.mesh.position.x, a.mesh.position.y);
            const popColor = a.pts === 20 ? '#a0c0ff' : a.pts === 5 ? '#aaa' : '#ffb74d';
            const label = multiplier > 1 ? `+${earned} ×${multiplier}` : `+${earned}`;
            addPopup(sp.x, sp.y, label, popColor, multiplier > 1);
            break;
          }
        }

        if (!hit) {
          for (let k = gs.ufos.length - 1; k >= 0; k--) {
            const u = gs.ufos[k];
            const uRadius = b.big ? 1.0 : 0.8;
            if (b.mesh.position.distanceTo(u.mesh.position) < uRadius) {
              SFX.explode(audioCtxRef.current);
              explode(u.mesh.position, 0x00ffff, 25);
              removeMesh(u.mesh);
              if (!b.pierce) { removeMesh(b.mesh); hit = true; }
              gs.ufos.splice(k, 1);
              
              const multiplier = gs.comboCount >= 3 ? gs.comboCount : 1;
              const earned = u.pts * multiplier;
              localScore += earned;
              setScore(localScore);
              const sp = worldToScreen(u.mesh.position.x, u.mesh.position.y);
              addPopup(sp.x, sp.y, `+${earned} UFO!`, '#00ffff', true);
              break;
            }
          }
        }

        if (hit || b.mesh.position.y > B.y + 2 || b.mesh.position.x < -B.x - 2 || b.mesh.position.x > B.x + 2) {
          if (!hit) removeMesh(b.mesh);
          gs.bullets.splice(i, 1);
        }
      }

      // ── Asteroids ─────────────────────────────────────────────────────
      for (let i = gs.asteroids.length - 1; i >= 0; i--) {
        const a = gs.asteroids[i];
        a.mesh.position.y += a.vy;
        a.mesh.rotation.x += a.rx;
        a.mesh.rotation.y += a.ry;

        const distToShip = a.mesh.position.distanceTo(shipGroup.position);

        // ✅ FIX 7: Near-miss graze bonus — band between (hit+0.05) and (hit+0.8)
        const hitRadius = a.size + .5;
        const grazeRadius = a.size + 1.3;
        if (
          distToShip > hitRadius &&
          distToShip < grazeRadius &&
          !gs.grazedIds.has(a.id)
        ) {
          gs.grazedIds.add(a.id);
          const grazePts = 5; // Fix 5: +5 makes chasing danger actually rewarding
          localScore += grazePts;
          setScore(localScore);
          SFX.graze(audioCtxRef.current);
          showGraze(grazePts);
          statsRef.current.grazesTotal++;
        }

        // Collision
        if (distToShip < hitRadius) {
          if (gs.shield) {
            SFX.explode(audioCtxRef.current);
            explode(a.mesh.position, 0x4880e0, 12);
            removeMesh(a.mesh);
            gs.asteroids.splice(i, 1);
            gs.grazedIds.delete(a.id);
            gs.shield = false;
            const sp = worldToScreen(shipGroup.position.x, shipGroup.position.y);
            addPopup(sp.x, sp.y, 'SHIELD BLOCKED', '#4880e0', true);
            continue;
          }
          SFX.hit(audioCtxRef.current);
          triggerShake();
          explode(shipGroup.position, 0xe04848, 20);
          removeMesh(a.mesh);
          gs.asteroids.splice(i, 1);
          gs.grazedIds.delete(a.id);
          gs.comboCount = 0; setCombo(0);
          localLives--; setLives(localLives);
          if (localLives <= 0) {
            gs.running = false;
            finalScore.current = localScore;
            if (localScore > highScore.current) {
              highScore.current = localScore;
              sessionStorage.setItem('hs', localScore);
            }
            setPhase('over'); return;
          }
          continue;
        }

        if (a.mesh.position.y < -B.y - 2) {
          SFX.hit(audioCtxRef.current);
          triggerShake();
          removeMesh(a.mesh);
          gs.asteroids.splice(i, 1);
          gs.grazedIds.delete(a.id);
          gs.comboCount = 0; setCombo(0);
          localLives--; setLives(localLives);
          if (localLives <= 0) {
            gs.running = false;
            finalScore.current = localScore;
            if (localScore > highScore.current) {
              highScore.current = localScore;
              sessionStorage.setItem('hs', localScore);
            }
            clearInterval(synthIntervalRef.current);
            const timeSurvived = Math.floor((Date.now() - gameStartTime.current) / 1000);
            setGameStats({ ...statsRef.current, timeSurvived });
            setPhase('over'); return;
          }
        }
      }

      // ── UFOs ──────────────────────────────────────────────────────────
      for (let i = gs.ufos.length - 1; i >= 0; i--) {
        const u = gs.ufos[i];
        u.mesh.position.x += u.vx;
        u.mesh.rotation.y += 0.05;
        
        if (u.mesh.position.distanceTo(shipGroup.position) < 1.4) {
          if (gs.shield) {
            SFX.explode(audioCtxRef.current);
            explode(u.mesh.position, 0x00ffff, 15);
            removeMesh(u.mesh);
            gs.ufos.splice(i, 1);
            gs.shield = false;
            const sp = worldToScreen(shipGroup.position.x, shipGroup.position.y);
            addPopup(sp.x, sp.y, 'SHIELD BLOCKED', '#4880e0', true);
            continue;
          }
          SFX.hit(audioCtxRef.current);
          triggerShake();
          explode(shipGroup.position, 0xe04848, 20);
          removeMesh(u.mesh);
          gs.ufos.splice(i, 1);
          gs.comboCount = 0; setCombo(0);
          localLives--; setLives(localLives);
          if (localLives <= 0) {
            gs.running = false;
            finalScore.current = localScore;
            if (localScore > highScore.current) {
              highScore.current = localScore;
              sessionStorage.setItem('hs', localScore);
            }
            clearInterval(synthIntervalRef.current);
            const timeSurvived = Math.floor((Date.now() - gameStartTime.current) / 1000);
            setGameStats({ ...statsRef.current, timeSurvived });
            setPhase('over'); return;
          }
          continue;
        }

        if ((u.vx > 0 && u.mesh.position.x > B.x + 2) || (u.vx < 0 && u.mesh.position.x < -B.x - 2)) {
          removeMesh(u.mesh);
          gs.ufos.splice(i, 1);
        }
      }

      // ── Power-ups ─────────────────────────────────────────────────────
      for (let i = gs.powerups.length - 1; i >= 0; i--) {
        const p = gs.powerups[i];
        p.mesh.position.y += p.vy;
        p.mesh.rotation.y += .03;
        p.mesh.rotation.x += .02;
        if (p.mesh.position.distanceTo(shipGroup.position) < 1.05) {
          SFX.powerup(audioCtxRef.current);
          const sp = worldToScreen(p.mesh.position.x, p.mesh.position.y);
          addPopup(sp.x, sp.y, PUPS[p.type].label, PUPS[p.type].hex, true);
          removeMesh(p.mesh);
          gs.powerups.splice(i, 1);

          if (p.type === 'bomb') {
            triggerShake();
            explode(shipGroup.position, 0xe02048, 40);
            
            for (let j = gs.asteroids.length - 1; j >= 0; j--) {
              const a = gs.asteroids[j];
              explode(a.mesh.position, 0xff5500, 8);
              removeMesh(a.mesh);
              localScore += a.pts * (gs.comboCount || 1);
            }
            setScore(localScore);
            gs.asteroids = [];
            continue;
          }

          gs[p.type] = true;
          gs[`${p.type}Expires`] = now + PUPS[p.type].dur;
          continue;
        }
        if (p.mesh.position.y < -B.y - 2) { removeMesh(p.mesh); gs.powerups.splice(i, 1); }
      }

      // ── Particles ─────────────────────────────────────────────────────
      for (let i = gs.particles.length - 1; i >= 0; i--) {
        const p = gs.particles[i];
        if (p.isRing) {
          // Expand the ring outward and fade
          p.scale = (p.scale || 0.1) + 0.18;
          p.mesh.scale.setScalar(p.scale);
          p.life -= 0.055;
          p.mesh.material.opacity = Math.max(0, p.life);
        } else {
          p.mesh.position.add(p.vel);
          p.vel.multiplyScalar(.88);
          p.life -= .045;
          p.mesh.material.opacity = Math.max(0, p.life);
        }
        if (p.life <= 0) { removeMesh(p.mesh); gs.particles.splice(i, 1); }
      }

      renderer.render(scene, cam);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      gs.running = false;
      cancelAnimationFrame(raf);

      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('click', onClick);
      mount.removeEventListener('touchstart', onTouchStart);
      mount.removeEventListener('touchmove', onTouchMove);
      mount.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);

      // Fix 3: single-pass disposal — use a Set so shared geometries are disposed only once
      const uniqueGeos = new Set();
      disposables.forEach(mesh => {
        if (mesh.geometry) uniqueGeos.add(mesh.geometry);
        if (mesh.material) {
          if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose());
          else mesh.material.dispose();
        }
      });
      uniqueGeos.forEach(g => g.dispose());

      // Fix 7: dispose shared particle geo + all particle materials
      particleGeo.dispose();
      particleMats.forEach(m => m.dispose());

      // Star field
      sg.dispose(); starField.material.dispose(); scene.remove(starField);

      // Ship meshes
      [coneMesh, wings, engineMesh, shieldMesh].forEach(m => {
        m.geometry.dispose(); m.material.dispose();
      });

      [ambientLight, sun, shipLight, shieldLight].forEach(l => scene.remove(l));

      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);

      // Fix 1: close AudioContext to prevent SPA accumulation
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [phase, triggerShake, showGraze, unlockAudio, paused, togglePause]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Wrapper $shake={shaking}>
      <BackBtn to="/">← PORTFOLIO</BackBtn>
      <CanvasMount ref={mountRef} />

      {/* Floating score popups */}
      <PopupLayer>
        {popups.map(p => (
          <Popup key={p.id} style={{ left: p.x, top: p.y }} $color={p.color} $big={p.big}>
            {p.text}
          </Popup>
        ))}
      </PopupLayer>

      {/* Graze notification */}
      {grazeMsg && (
        <GrazePopup key={grazeMsg.id}>
          GRAZE +{grazeMsg.pts}
        </GrazePopup>
      )}

      {/* HUD */}
      {phase === 'playing' && (
        <>
          <HUD>
            <HudBlock>
              <HudLabel>SCORE</HudLabel>
              <HudValue $accent="#e04848" $lg>{String(score).padStart(6, '0')}</HudValue>
            </HudBlock>
            <HudCenter>
              {combo >= 3 && <ComboText>COMBO ×{combo}</ComboText>}
              <HudLabel style={{ textAlign: 'center', letterSpacing: '1px', marginTop: combo >= 3 ? '.2rem' : '0' }}>
                LVL {Math.max(1, Math.floor(score / 300) + 1)}
              </HudLabel>
            </HudCenter>
            <HudBlock style={{ alignItems: 'flex-end' }}>
              <HudLabel>LIVES</HudLabel>
              <HudValue>{'♥ '.repeat(Math.max(0, lives)).trim() || '!'}</HudValue>
            </HudBlock>
          </HUD>
          {Object.keys(activePUps).length > 0 && (
            <PowerBar>
              {activePUps.shield && <Pill $c="#4880e0">SHIELD {activePUps.shield}s</Pill>}
              {activePUps.rapid && <Pill $c="#48e080">RAPID {activePUps.rapid}s</Pill>}
              {activePUps.bigbullet && <Pill $c="#ffb74d">BIG SHOT {activePUps.bigbullet}s</Pill>}
              {activePUps.spread && <Pill $c="#c048e0">SPREAD {activePUps.spread}s</Pill>}
              {activePUps.laser && <Pill $c="#48e0e0">LASER {activePUps.laser}s</Pill>}
            </PowerBar>
          )}
        </>
      )}

      {/* Hyperspace Warp overlay */}
      {phase === 'warp' && (
        <Overlay style={{ background: 'transparent', backdropFilter: 'none', pointerEvents: 'none' }}>
          <GameTitle style={{ fontSize: 'clamp(1.8rem,6vw,2.4rem)', letterSpacing: '10px', opacity: 0.9 }}>ENTERING WARP</GameTitle>
          <Sub style={{ letterSpacing: '6px', opacity: 0.7 }}>PREPARE FOR LAUNCH</Sub>
        </Overlay>
      )}

      {/* Start screen */}
      {phase === 'start' && (
        <Overlay>
          <GameTitle>ASTEROID FIELD</GameTitle>
          <Sub>THREE.JS EXPERIENCE · MEET BEDDY</Sub>

          <ObjBox>
            <ObjTitle>MISSION OBJECTIVES</ObjTitle>
            <ObjRow $vc="#a0c0ff"><span>Small asteroid</span>   <span className="v">+20 pts</span></ObjRow>
            <ObjRow $vc="#ffb74d"><span>Medium asteroid</span>  <span className="v">+10 pts</span></ObjRow>
            <ObjRow $vc="#888">  <span>Large asteroid</span>    <span className="v">+5 pts</span></ObjRow>
            <ObjRow $vc="#ffe082"><span>Near-miss graze</span>  <span className="v">+3 pts</span></ObjRow>
            <ObjRow $vc="#48e080"><span>Combo hits (3+)</span>  <span className="v">score ×N</span></ObjRow>
            <ObjRow $vc="#e04848"><span>Asteroid hits ship</span><span className="v">−1 life</span></ObjRow>
            <ObjRow $vc="#e04848"><span>Asteroid passes you</span><span className="v">−1 life</span></ObjRow>
            <ObjRow>              <span>Total lives</span>      <span className="v">♥ ♥ ♥</span></ObjRow>
          </ObjBox>

          <Legend>
            <LItem $c="#4880e0">SHIELD — absorbs one hit (10s)</LItem>
            <LItem $c="#48e080">RAPID — fast 3-way fire (8s)</LItem>
            <LItem $c="#ffb74d">BIG SHOT — double size (8s)</LItem>
            <LItem $c="#c048e0">SPREAD — wide 5-way fire (8s)</LItem>
            <LItem $c="#48e0e0">LASER — piercing beam (6s)</LItem>
            <LItem $c="#e02048">SMART BOMB — destroys all (instant)</LItem>
          </Legend>

          <CtrlRow>
            MOUSE / TOUCH — move ship &nbsp;·&nbsp; WASD / ARROWS — keyboard<br />
            SPACE (hold) / CLICK / TAP — shoot &nbsp;·&nbsp; RAPID: 3-way spread
          </CtrlRow>
          {highScore.current > 0 &&
            <HighScore>BEST: {String(highScore.current).padStart(6, '0')}</HighScore>}
          <LaunchBtn onClick={() => startGame(true)}>LAUNCH ▶</LaunchBtn>
        </Overlay>
      )}

      {/* Game over */}
      {phase === 'over' && (
        <Overlay>
          <GameTitle style={{ fontSize: 'clamp(1.8rem,6vw,2.6rem)' }}>GAME OVER</GameTitle>
          <FinalScore>SCORE: {String(finalScore.current).padStart(6, '0')}</FinalScore>
          
          <ObjBox style={{ marginTop: '.5rem', marginBottom: '.5rem' }}>
            <ObjTitle>PERFORMANCE STATS</ObjTitle>
            <ObjRow $vc="#a0c0ff"><span>Asteroids Destroyed</span> <span className="v">{gameStats.asteroidsDestroyed}</span></ObjRow>
            <ObjRow $vc="#ffb74d"><span>Max Combo</span> <span className="v">{gameStats.maxCombo}×</span></ObjRow>
            <ObjRow $vc="#e04848"><span>Time Survived</span> <span className="v">{gameStats.timeSurvived}s</span></ObjRow>
            <ObjRow $vc="#48e080"><span>Danger Grazes</span> <span className="v">{gameStats.grazesTotal}</span></ObjRow>
          </ObjBox>

          {finalScore.current >= highScore.current && finalScore.current > 0 &&
            <Sub style={{ color: '#ffb74d', opacity: 1, marginBottom: '.5rem' }}>★ NEW HIGH SCORE ★</Sub>}
          {highScore.current > 0 &&
            <HighScore>BEST: {String(highScore.current).padStart(6, '0')}</HighScore>}
          <LaunchBtn onClick={() => startGame(true)}>PLAY AGAIN ▶</LaunchBtn>
        </Overlay>
      )}

      {/* Pause Overlay */}
      {paused && phase === 'playing' && (
        <Overlay style={{ background: 'rgba(6,6,18,0.7)' }}>
          <GameTitle style={{ fontSize: '2rem', letterSpacing: '8px' }}>PAUSED</GameTitle>
          <LaunchBtn onClick={togglePause} style={{ marginTop: '2rem' }}>RESUME ▶</LaunchBtn>
        </Overlay>
      )}
    </Wrapper>
  );
};

export default AsteroidGame;