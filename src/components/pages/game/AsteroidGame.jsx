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
  10%{transform:translate(-6px, 4px)}
  20%{transform:translate(7px,-5px)}
  30%{transform:translate(-5px, 4px)}
  40%{transform:translate(6px,-3px)}
  50%{transform:translate(-4px, 5px)}
  60%{transform:translate(5px,-4px)}
  70%{transform:translate(-3px, 3px)}
  80%{transform:translate(3px,-3px)}
  90%{transform:translate(-2px, 2px)}
`;
const grazeFlash = keyframes`
  0%{opacity:0;transform:translateX(-50%) scale(.7)}
  40%{opacity:1;transform:translateX(-50%) scale(1.08)}
  100%{opacity:0;transform:translateX(-50%) scale(.9)}
`;
const heatPulse = keyframes`
  0%,100%{box-shadow:0 0 8px #ff4400aa}
  50%{box-shadow:0 0 22px #ff2200ff,0 0 40px #ff000066}
`;
const bossWarning = keyframes`
  0%,100%{opacity:0;transform:translateX(-50%) scale(0.85)}
  50%{opacity:1;transform:translateX(-50%) scale(1)}
`;
const sectorSlam = keyframes`
  0%{opacity:0;transform:translateX(-50%) scaleX(2.4) scaleY(0.3);filter:blur(12px)}
  35%{opacity:1;transform:translateX(-50%) scaleX(0.92) scaleY(1.08);filter:blur(0px)}
  55%{transform:translateX(-50%) scaleX(1.04) scaleY(0.97)}
  75%{transform:translateX(-50%) scaleX(0.98) scaleY(1.01)}
  100%{opacity:1;transform:translateX(-50%) scaleX(1) scaleY(1)}
`;
const sectorSub = keyframes`
  0%{opacity:0;transform:translateX(-50%) translateY(12px);letter-spacing:20px}
  60%{opacity:1;transform:translateX(-50%) translateY(0);letter-spacing:6px}
  100%{opacity:1;transform:translateX(-50%) translateY(0);letter-spacing:6px}
`;
const scanSweep = keyframes`
  0%{top:-4px;opacity:1}85%{opacity:1}100%{top:100%;opacity:0}
`;
const vortexRing = keyframes`
  0%{transform:translate(-50%,-50%) scale(0);opacity:0.9}
  100%{transform:translate(-50%,-50%) scale(3.5);opacity:0}
`;
const fadeOutUp = keyframes`
  0%{opacity:1;transform:translateX(-50%) translateY(0)}
  100%{opacity:0;transform:translateX(-50%) translateY(-30px)}
`;
const healthFlash = keyframes`
  0%{opacity:1}30%{opacity:0.2}60%{opacity:0.9}100%{opacity:1}
`;
const bossEntrance = keyframes`
  0%{opacity:0;transform:translateX(-50%) translateY(-20px) scale(0.6)}
  60%{opacity:1;transform:translateX(-50%) translateY(4px) scale(1.05)}
  100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}
`;
const dangerZonePulse = keyframes`
  0%,100%{opacity:0.15}
  50%{opacity:0.35}
`;
const overHeatShake = keyframes`
  0%,100%{transform:translateX(0)}
  25%{transform:translateX(-3px)}
  75%{transform:translateX(3px)}
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const Wrapper = styled.div`
  position:fixed;inset:0;background:#060612;
  overflow:hidden;font-family:'Fira Code','Courier New',monospace;user-select:none;
  ${p => p.$shake && css`animation:${shakeAnim} .45s ease-out;`}
`;
const CanvasMount = styled.div`width:100%;height:100%;touch-action:none;`;

// Danger zone ring overlay
const DangerZone = styled.div`
  position:absolute;
  left:50%;top:50%;
  width:min(40vw,300px);
  height:min(40vw,300px);
  transform:translate(-50%,-50%);
  border-radius:50%;
  border:2px dashed rgba(255,200,0,0.4);
  pointer-events:none;z-index:5;
  animation:${dangerZonePulse} 2s ease-in-out infinite;
  &::after{
    content:'DANGER ZONE';
    position:absolute;top:50%;left:50%;
    transform:translate(-50%,-50%);
    font-size:.5rem;letter-spacing:3px;
    color:rgba(255,200,0,0.3);white-space:nowrap;
  }
`;

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

// Health bar
const HealthBarWrap = styled.div`
  display:flex;flex-direction:column;gap:.2rem;min-width:120px;
  ${p => p.$flash && css`animation:${healthFlash} .35s ease-out;`}
`;
const HealthBarTrack = styled.div`
  width:120px;height:8px;background:rgba(255,255,255,.1);
  border-radius:4px;overflow:hidden;border:1px solid rgba(255,255,255,.15);
`;
const HealthBarFill = styled.div`
  height:100%;border-radius:4px;transition:width .25s ease, background .4s;
  width:${p => p.$pct}%;
  background:${p =>
    p.$pct > 60 ? '#48e080' :
      p.$pct > 30 ? '#ffb74d' : '#e04848'};
  box-shadow:0 0 8px ${p =>
    p.$pct > 60 ? '#48e08099' :
      p.$pct > 30 ? '#ffb74d99' : '#e0484899'};
`;

// Heat bar
const HeatBarWrap = styled.div`display:flex;flex-direction:column;gap:.2rem;min-width:100px;`;
const HeatBarTrack = styled.div`
  width:100px;height:6px;background:rgba(255,255,255,.1);
  border-radius:3px;overflow:hidden;border:1px solid rgba(255,255,255,.15);
`;
const HeatBarFill = styled.div`
  height:100%;border-radius:3px;transition:width .1s linear;
  width:${p => p.$pct}%;
  background:${p => p.$overheat ? '#ff2200' : p.$pct > 70 ? '#ff8800' : '#ff5500'};
  ${p => p.$overheat && css`animation:${heatPulse} .3s ease-in-out infinite;`}
`;
const OverheatLabel = styled.div`
  font-size:.55rem;letter-spacing:2px;
  color:#ff2200;text-shadow:0 0 8px #ff2200;
  ${css`animation:${overHeatShake} .2s ease-in-out infinite;`}
`;

// Boss health bar
const BossBarWrap = styled.div`
  position:absolute;bottom:3.5rem;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;gap:.3rem;align-items:center;
  pointer-events:none;z-index:10;
`;
const BossLabel = styled.div`
  font-size:.65rem;letter-spacing:4px;color:#ff2200;
  text-shadow:0 0 12px #ff220099;
  animation:${pulse} .8s ease-in-out infinite;
`;
const BossBarTrack = styled.div`
  width:min(300px,60vw);height:10px;
  background:rgba(255,255,255,.1);border-radius:5px;overflow:hidden;
  border:1px solid rgba(255,0,0,.3);
`;
const BossBarFill = styled.div`
  height:100%;border-radius:5px;transition:width .2s ease;
  width:${p => p.$pct}%;
  background:linear-gradient(90deg,#ff2200,#ff8800);
  box-shadow:0 0 12px #ff440099;
`;

// Boss Warning
const BossWarningBanner = styled.div`
  position:absolute;top:28%;left:50%;
  font-size:clamp(1.4rem,5vw,2.2rem);font-weight:900;letter-spacing:8px;
  color:#ff2200;white-space:nowrap;pointer-events:none;z-index:20;
  text-shadow:0 0 30px #ff2200,0 0 60px #ff000066;
  animation:${bossWarning} .5s ease-in-out infinite,${bossEntrance} .6s ease-out both;
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
const DamagePopup = styled.div`
  position:absolute;bottom:42%;left:50%;
  font-size:1.2rem;font-weight:900;letter-spacing:4px;
  color:${p => p.$color || '#ff4444'};
  text-shadow:0 0 20px ${p => p.$color || '#ff4444'};
  animation:${grazeFlash} .7s ease-out forwards;white-space:nowrap;
  pointer-events:none;z-index:12;
`;

// Sector clear overlay
const SectorClearOverlay = styled.div`position:absolute;inset:0;pointer-events:none;z-index:50;overflow:hidden;`;
const SectorClearTitle = styled.div`
  position:absolute;top:36%;left:50%;
  font-size:clamp(2.2rem,8vw,4rem);font-weight:900;letter-spacing:10px;
  color:#fff;white-space:nowrap;
  text-shadow:0 0 30px rgba(255,255,255,0.9),0 0 60px rgba(255,200,100,0.6),0 0 100px rgba(255,100,0,0.4);
  animation:${sectorSlam} 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
`;
const SectorClearSub = styled.div`
  position:absolute;top:calc(36% + clamp(3rem,9vw,5.2rem));left:50%;
  font-size:clamp(0.75rem,2vw,1rem);font-weight:600;letter-spacing:6px;
  color:rgba(255,200,100,0.85);white-space:nowrap;
  text-shadow:0 0 16px rgba(255,180,80,0.7);
  animation:${sectorSub} 0.7s 0.2s cubic-bezier(0.22,1,0.36,1) both;
`;
const SectorClearScore = styled.div`
  position:absolute;top:calc(36% + clamp(5.2rem,13vw,7.8rem));left:50%;
  font-size:clamp(0.7rem,1.6vw,0.85rem);font-weight:600;letter-spacing:4px;
  color:rgba(160,255,160,0.8);white-space:nowrap;
  text-shadow:0 0 12px rgba(100,255,100,0.5);
  animation:${p => p.$exit
    ? css`${fadeOutUp} 0.5s ease forwards`
    : css`${sectorSub} 0.6s 0.5s cubic-bezier(0.22,1,0.36,1) both`};
`;
const ScanLine = styled.div`
  position:absolute;left:0;right:0;height:3px;
  background:linear-gradient(90deg,
    transparent 0%,rgba(255,255,255,0.08) 10%,
    rgba(255,255,255,0.6) 50%,rgba(255,255,255,0.08) 90%,transparent 100%);
  box-shadow:0 0 18px 4px rgba(255,255,255,0.25);
  animation:${scanSweep} ${p => p.$dur || 1.1}s ${p => p.$delay || 0}s linear forwards;
`;
const VortexRing = styled.div`
  position:absolute;left:50%;top:50%;
  width:120px;height:120px;margin-left:-60px;margin-top:-60px;
  border-radius:50%;
  border:2px solid rgba(255,200,100,0.7);
  box-shadow:0 0 20px rgba(255,180,80,0.4),inset 0 0 20px rgba(255,180,80,0.2);
  animation:${vortexRing} ${p => p.$dur || 0.8}s ${p => p.$delay || 0}s ease-out forwards;
`;

const PowerBar = styled.div`
  position:absolute;bottom:1.4rem;left:50%;transform:translateX(-50%);
  display:flex;gap:.6rem;pointer-events:none;z-index:10;flex-wrap:wrap;justify-content:center;
  max-width:90vw;
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
  border-radius:.75rem;padding:.9rem 1.3rem;width:min(480px,90vw);
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
const Legend = styled.div`display:flex;gap:.55rem;flex-wrap:wrap;justify-content:center;width:min(480px,90vw);`;
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
const MAX_HP = 100;

const PUPS = {
  shield: { color: 0x4880e0, hex: '#4880e0', label: 'SHIELD', dur: 10000 },
  rapid: { color: 0x48e080, hex: '#48e080', label: 'RAPID FIRE', dur: 8000 },
  bigbullet: { color: 0xffb74d, hex: '#ffb74d', label: 'BIG SHOT', dur: 8000 },
  spread: { color: 0xc048e0, hex: '#c048e0', label: 'SPREAD', dur: 8000 },
  laser: { color: 0x48e0e0, hex: '#48e0e0', label: 'LASER', dur: 6000 },
  bomb: { color: 0xe02048, hex: '#e02048', label: 'SMART BOMB', dur: 0 },
  repair: { color: 0x80ff80, hex: '#80ff80', label: 'REPAIR KIT', dur: 0 },
};

// ─── Asteroid types — now with damage ────────────────────────────────────────
// damage: how many HP the player loses on collision
// hitsToDie: how many bullet hits to destroy
const ASTEROID_TYPES = [
  {
    // SMALL — fast, low damage, 1 hit
    id: 'small',
    sizeRange: [0.25, 0.45],
    damage: 8,
    hitsToDie: 1,
    pts: 25,
    speed: 1.6,
    matProps: () => ({ color: new THREE.Color('#7aaeff'), roughness: 0.25, metalness: 0.7 }),
    emissive: new THREE.Color('#2244aa'),
    emissiveIntensity: 0.5,
    weight: 4,
    label: 'SMALL',
    labelColor: '#7aaeff',
  },
  {
    // MEDIUM — balanced
    id: 'medium',
    sizeRange: [0.5, 0.75],
    damage: 20,
    hitsToDie: 2,
    pts: 12,
    speed: 1.0,
    matProps: () => ({ color: new THREE.Color('#8a7a50'), roughness: 0.35, metalness: 0.88 }),
    emissive: null,
    emissiveIntensity: 0,
    weight: 4,
    label: 'MEDIUM',
    labelColor: '#ffb74d',
  },
  {
    // LARGE — slow, heavy damage, 3 hits
    id: 'large',
    sizeRange: [0.85, 1.25],
    damage: 35,
    hitsToDie: 3,
    pts: 8,
    speed: 0.55,
    matProps: () => ({ color: new THREE.Color('#c05a3a'), roughness: 0.8, metalness: 0.15 }),
    emissive: new THREE.Color('#6a1500'),
    emissiveIntensity: 0.3,
    weight: 3,
    label: 'LARGE',
    labelColor: '#e04848',
  },
  {
    // CRYSTAL — medium size, medium damage, 1 hit, high points
    id: 'crystal',
    sizeRange: [0.4, 0.65],
    damage: 12,
    hitsToDie: 1,
    pts: 40,
    speed: 1.2,
    matProps: () => ({ color: new THREE.Color('#9aaeff'), roughness: 0.05, metalness: 0.95 }),
    emissive: new THREE.Color('#4466ff'),
    emissiveIntensity: 0.8,
    weight: 2,
    label: 'CRYSTAL',
    labelColor: '#aabbff',
  },
];

const pickAsteroidType = () => {
  const total = ASTEROID_TYPES.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  for (const t of ASTEROID_TYPES) { r -= t.weight; if (r <= 0) return t; }
  return ASTEROID_TYPES[0];
};

// ─── Sound ────────────────────────────────────────────────────────────────────
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
  shootWeak: ctx => playTone(ctx, { freq: 440, type: 'square', gain: 0.05, dur: 0.04, decay: 0.02 }),
  explode: ctx => playTone(ctx, { freq: 120, type: 'sawtooth', gain: 0.22, dur: 0.18, decay: 0.14 }),
  bigExplode: ctx => { playTone(ctx, { freq: 80, type: 'sawtooth', gain: 0.30, dur: 0.30, decay: 0.25 }); playTone(ctx, { freq: 160, type: 'sawtooth', gain: 0.15, dur: 0.20, decay: 0.18 }); },
  hit: ctx => playTone(ctx, { freq: 55, type: 'sawtooth', gain: 0.28, dur: 0.25, decay: 0.20 }),
  heavyHit: ctx => playTone(ctx, { freq: 35, type: 'sawtooth', gain: 0.40, dur: 0.35, decay: 0.30 }),
  powerup: ctx => playTone(ctx, { freq: 660, type: 'sine', gain: 0.20, dur: 0.25, decay: 0.12 }),
  graze: ctx => playTone(ctx, { freq: 1200, type: 'sine', gain: 0.12, dur: 0.07, decay: 0.06 }),
  overheat: ctx => playTone(ctx, { freq: 200, type: 'sawtooth', gain: 0.25, dur: 0.40, decay: 0.20 }),
  bossHit: ctx => playTone(ctx, { freq: 180, type: 'sawtooth', gain: 0.20, dur: 0.18, decay: 0.14 }),
  sectorClear: ctx => {
    [523, 659, 784].forEach((freq, i) => {
      setTimeout(() => playTone(ctx, { freq, type: 'sine', gain: 0.28, dur: 0.22, decay: 0.18 }), i * 140);
    });
  },
};

// ─── Synthwave ────────────────────────────────────────────────────────────────
const startSynthwave = (ctx) => {
  if (!ctx || ctx.state === 'suspended') return null;
  try {
    const notes = [55, 82.5, 55, 110, 55, 82.5, 110, 82.5];
    let step = 0;
    const bpm = 128;
    const stepDur = (60 / bpm) / 2;
    const playNote = () => {
      if (!ctx || ctx.state === 'closed') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 800;
      osc.type = 'sawtooth';
      osc.frequency.value = notes[step % notes.length];
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + stepDur * 0.85);
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      osc.start(t); osc.stop(t + stepDur);
      step++;
    };
    playNote();
    const interval = setInterval(playNote, stepDur * 1000);
    return interval;
  } catch { return null; }
};

// ─── Component ────────────────────────────────────────────────────────────────
const AsteroidGame = () => {
  const mountRef = useRef(null);
  const audioCtxRef = useRef(null);
  const shakeTimer = useRef(null);
  const uiTick = useRef(0);
  const sectorClearTimer = useRef(null);
  const scoreRef = useRef(0);

  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(MAX_HP);
  const [phase, setPhase] = useState('start');
  const [activePUps, setActivePUps] = useState({});
  const [combo, setCombo] = useState(0);
  const [popups, setPopups] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [grazeMsg, setGrazeMsg] = useState(null);
  const [damageMsg, setDamageMsg] = useState(null);
  const [paused, setPaused] = useState(false);
  const [gameStats, setGameStats] = useState({ grazesTotal: 0, enemiesDestroyed: 0, timeSurvived: 0, maxCombo: 0, bossesKilled: 0 });
  const [sector, setSector] = useState(1);
  const [flash, setFlash] = useState(false);
  const [healthFlashing, setHealthFlashing] = useState(false);
  const [sectorClearAnim, setSectorClearAnim] = useState(null);
  const [heat, setHeat] = useState(0);
  const [overheated, setOverheated] = useState(false);
  const [bossHP, setBossHP] = useState(null); // null when no boss
  const [bossMaxHP, setBossMaxHP] = useState(1);
  const [bossWarningVisible, setBossWarningVisible] = useState(false);
  const [dangerZoneBonus, setDangerZoneBonus] = useState(false);

  const finalScore = useRef(0);
  const highScore = useRef(Number(sessionStorage.getItem('hs') || 0));
  const popupId = useRef(0);
  const gameStartTime = useRef(0);
  const statsRef = useRef({ grazesTotal: 0, enemiesDestroyed: 0, maxCombo: 0, bossesKilled: 0 });
  const synthIntervalRef = useRef(null);
  const lastSectorScore = useRef(0);

  const unlockAudio = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = createAudio();
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume().catch(() => { });
  }, []);

  const addPopup = (x, y, text, color, big = false) => {
    const id = popupId.current++;
    setPopups(ps => [...ps, { id, x, y, text, color, big }]);
    setTimeout(() => setPopups(ps => ps.filter(p => p.id !== id)), 950);
  };

  const togglePause = useCallback(() => setPaused(prev => !prev), []);

  const startGame = (withWarp = false) => {
    unlockAudio();
    finalScore.current = 0;
    scoreRef.current = 0;
    gameStartTime.current = Date.now();
    statsRef.current = { grazesTotal: 0, enemiesDestroyed: 0, maxCombo: 0, bossesKilled: 0 };
    lastSectorScore.current = 0;
    setScore(0); setHp(MAX_HP); setActivePUps({}); setSector(1);
    setCombo(0); setPopups([]); setShaking(false); setGrazeMsg(null); setDamageMsg(null);
    setPaused(false); setSectorClearAnim(null); setHeat(0); setOverheated(false);
    setBossHP(null); setBossWarningVisible(false); setDangerZoneBonus(false);
    setGameStats({ grazesTotal: 0, enemiesDestroyed: 0, timeSurvived: 0, maxCombo: 0, bossesKilled: 0 });

    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    setTimeout(() => { synthIntervalRef.current = startSynthwave(audioCtxRef.current); }, 500);

    if (withWarp) { setPhase('warp'); setTimeout(() => setPhase('playing'), 1800); }
    else setPhase('playing');
  };

  const triggerShake = useCallback((intensity = 1) => {
    setShaking(false);
    requestAnimationFrame(() => setShaking(true));
    clearTimeout(shakeTimer.current);
    shakeTimer.current = setTimeout(() => setShaking(false), intensity > 1 ? 600 : 420);
  }, []);

  const showGraze = useCallback((pts) => {
    const id = Date.now();
    setGrazeMsg({ id, pts });
    setTimeout(() => setGrazeMsg(g => g?.id === id ? null : g), 820);
  }, []);

  const showDamage = useCallback((dmg, color = '#ff4444') => {
    const id = Date.now();
    setDamageMsg({ id, dmg, color });
    setHealthFlashing(true);
    setTimeout(() => { setDamageMsg(d => d?.id === id ? null : d); setHealthFlashing(false); }, 700);
  }, []);

  const triggerFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing' && phase !== 'warp') return;
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = mount.clientWidth < 768;
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x060612);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const aspect = mount.clientWidth / mount.clientHeight;
    const cam = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    cam.position.set(0, 0, 15);

    const halfH = Math.tan(THREE.MathUtils.degToRad(30)) * 15;
    const halfW = halfH * aspect;
    const B = { x: halfW * 0.88, y: halfH * 0.88 };
    const DANGER_ZONE_R = Math.min(B.x, B.y) * 0.45;

    const screenToWorld = (sx, sy) => {
      const rect = mount.getBoundingClientRect();
      const nx = (sx - rect.left) / rect.width;
      const ny = (sy - rect.top) / rect.height;
      return { x: (nx - 0.5) * B.x * 2, y: -(ny - 0.5) * B.y * 2 };
    };
    const worldToScreen = (wx, wy) => {
      const v = new THREE.Vector3(wx, wy, 0).project(cam);
      return { x: (v.x * 0.5 + 0.5) * mount.clientWidth, y: (-v.y * 0.5 + 0.5) * mount.clientHeight };
    };
    const dist2D = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

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
      running: true, hpLeft: MAX_HP, sectorClearing: false,
      bullets: [], enemyBullets: [], asteroids: [], particles: [], powerups: [], ufos: [],
      keys: {}, mouse: { x: 0, y: -B.y + 2 }, touchActive: false,
      lastShot: 0, lastSpawn: 0, lastPowerUp: 0, lastUfoSpawn: 0,
      waveTimer: 0,
      spawnInterval: 2200, diffMult: 1,
      shield: false, shieldExpires: 0,
      rapid: false, rapidExpires: 0,
      bigbullet: false, bigbulletExpires: 0,
      spread: false, spreadExpires: 0,
      laser: false, laserExpires: 0,
      lastHitTime: 0, comboCount: 0,
      grazedIds: new Set(),
      vortexTime: 0,
      // Heat system
      heat: 0, overheated: false, overheatLockEnd: 0,
      // Boss
      boss: null, bossHPLeft: 0, bossMaxHP: 0,
      bossSpawned: false,
      // Danger zone bonus
      dangerZoneFrames: 0,
      // Local sector tracking
      localSector: 1,
    };
    let localScore = scoreRef.current, localHP = MAX_HP;

    const disposables = [];
    const particleMats = [];
    const particleGeo = new THREE.SphereGeometry(.08, 4, 4);
    let lastTouchTime = 0;

    const trackMesh = (mesh) => { disposables.push(mesh); return mesh; };

    // ── Thruster Trail ─────────────────────────────────────────────────────
    const trailGeo = new THREE.SphereGeometry(0.07, 4, 4);
    const trailParticles = [];
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

    // ── Bullets ────────────────────────────────────────────────────────────
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
      gs.bullets.push({ mesh, vx: Math.sin(rad) * (isLaser ? 0.5 : 0.18), vy: isLaser ? 0.7 : 0.32, big: gs.bigbullet, pierce: isLaser, geo, mat });
    };

    const shoot = () => {
      const now = performance.now();
      if (gs.overheated || now < gs.overheatLockEnd) return;

      SFX.shoot(audioCtxRef.current);
      const angles = [0];
      if (gs.spread) angles.push(-12, 12, -24, 24);
      else if (gs.rapid) angles.push(-15, 15);
      angles.forEach(ang => makeBullet(ang));

      // Heat build-up
      const heatIncrease = gs.rapid ? 12 : gs.spread ? 15 : gs.laser ? 18 : 8;
      gs.heat = Math.min(100, gs.heat + heatIncrease);
      setHeat(gs.heat);

      if (gs.heat >= 100 && !gs.overheated) {
        gs.overheated = true;
        gs.overheatLockEnd = now + 2500;
        setOverheated(true);
        SFX.overheat(audioCtxRef.current);
        setTimeout(() => { gs.overheated = false; gs.heat = 0; setOverheated(false); setHeat(0); }, 2500);
      }
    };

    const makeEnemyBullet = (x, y, angleOffset = 0) => {
      const geo = new THREE.SphereGeometry(0.18, 8, 8);
      const color = 0xcc22ff;
      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = trackMesh(new THREE.Mesh(geo, mat));
      const bLight = new THREE.PointLight(color, 2, 4);
      mesh.position.set(x, y, 0);
      const rad = THREE.MathUtils.degToRad(angleOffset);
      mesh.rotation.z = -rad;
      mesh.add(bLight);
      scene.add(mesh);
      gs.enemyBullets.push({ mesh, vx: Math.sin(rad) * 0.12, vy: -0.22, geo, mat });
    };

    // ── Asteroid ──────────────────────────────────────────────────────────
    const makeAsteroid = (forcedType = null) => {
      const type = forcedType || pickAsteroidType();
      const [minS, maxS] = type.sizeRange;
      const size = minS + Math.random() * (maxS - minS);

      let geo;
      if (type.id === 'crystal') geo = new THREE.OctahedronGeometry(size, 1);
      else if (type.id === 'large') geo = new THREE.IcosahedronGeometry(size, 0);
      else geo = new THREE.IcosahedronGeometry(size, Math.random() > .5 ? 1 : 0);

      const mat = new THREE.MeshStandardMaterial({
        ...type.matProps(size),
        emissive: type.emissive || new THREE.Color('#000000'),
        emissiveIntensity: type.emissiveIntensity || 0,
      });
      const mesh = trackMesh(new THREE.Mesh(geo, mat));
      mesh.position.set((Math.random() - .5) * B.x * 1.8, B.y + size + .5, (Math.random() - .5) * 1.5);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      if (type.emissive) mesh.add(new THREE.PointLight(type.emissive, 1.5, 4));
      scene.add(mesh);
      gs.asteroids.push({
        mesh, size, type,
        pts: type.pts,
        damage: type.damage,
        hitsLeft: type.hitsToDie,
        id: Math.random().toString(36).slice(2),
        vy: -(0.018 + Math.random() * 0.010) * gs.diffMult * type.speed,
        rx: (Math.random() - .5) * .016,
        ry: (Math.random() - .5) * .016,
        vortexing: false,
        vortexDelay: 0,
        flashFrames: 0,
        geo, mat,
      });
    };

    const makePowerUp = () => {
      const types = Object.keys(PUPS);
      // Weight repair more when low HP
      const weights = types.map(t => {
        if (t === 'repair') return localHP < 50 ? 4 : 1;
        return 2;
      });
      const total = weights.reduce((s, w) => s + w, 0);
      let r = Math.random() * total;
      let type = types[types.length - 1];
      for (let i = 0; i < types.length; i++) { r -= weights[i]; if (r <= 0) { type = types[i]; break; } }

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
      const geo1 = new THREE.SphereGeometry(0.7, 16, 8); geo1.scale(1, 0.25, 1);
      const mat1 = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.1 });
      const mesh1 = trackMesh(new THREE.Mesh(geo1, mat1));
      const geo2 = new THREE.SphereGeometry(0.4, 16, 8); geo2.scale(1, 0.7, 1);
      const mat2 = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      const mesh2 = trackMesh(new THREE.Mesh(geo2, mat2));
      mesh2.position.y = 0.2;
      const uLight = new THREE.PointLight(0x00ffff, 3, 5);
      g.add(mesh1); g.add(mesh2); g.add(uLight);
      const fromLeft = Math.random() > 0.5;
      g.position.set(fromLeft ? -B.x - 2 : B.x + 2, B.y - 1 - Math.random() * (B.y - 1), 0);
      scene.add(g);
      gs.ufos.push({ mesh: g, vx: (fromLeft ? 1 : -1) * (0.05 + Math.random() * 0.04), pts: 100, damage: 25 });
    };

    // ── BOSS ──────────────────────────────────────────────────────────────
    const spawnBoss = () => {
      if (gs.boss) return;
      const bossHP_val = 30 + gs.localSector * 10;
      gs.bossMaxHP = bossHP_val;
      gs.bossHPLeft = bossHP_val;
      gs.bossSpawned = true;
      setBossMaxHP(bossHP_val);
      setBossHP(bossHP_val);

      const g = new THREE.Group();
      // Core
      const coreGeo = new THREE.IcosahedronGeometry(1.8, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x880000, emissive: 0xff0000, emissiveIntensity: 0.5,
        roughness: 0.3, metalness: 0.8,
      });
      disposables.push(new THREE.Mesh(coreGeo, coreMat));
      const core = new THREE.Mesh(coreGeo, coreMat);
      g.add(core);
      // Ring
      const ringGeo = new THREE.TorusGeometry(2.2, 0.2, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
      disposables.push(new THREE.Mesh(ringGeo, ringMat));
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      g.add(ring);
      g.add(new THREE.PointLight(0xff2200, 5, 10));
      g.position.set(0, B.y + 3, 0);
      scene.add(g);
      gs.boss = { mesh: g, entering: true, enterProgress: 0, shootTimer: 0, orbitAngle: 0, core, ring };
      disposables.push(core); disposables.push(ring);

      setBossWarningVisible(true);
      setTimeout(() => setBossWarningVisible(false), 2500);
    };

    const explode = (pos, color = 0xff5500, count = 14) => {
      const particleCount = isMobile ? Math.floor(count * 0.6) : count;
      for (let i = 0; i < particleCount; i++) {
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
        particleMats.push(mat);
        const m = new THREE.Mesh(particleGeo, mat);
        m.position.copy(pos);
        const vel = new THREE.Vector3((Math.random() - .5) * .22, (Math.random() - .5) * .22, (Math.random() - .5) * .08);
        scene.add(m);
        gs.particles.push({ mesh: m, vel, life: 1, mat });
      }
      const ringGeo = new THREE.TorusGeometry(0.1, 0.04, 6, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      particleMats.push(ringMat);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos); ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      gs.particles.push({ mesh: ring, vel: new THREE.Vector3(), life: 1, mat: ringMat, isRing: true, scale: 0.1 });
    };

    // ── Input ─────────────────────────────────────────────────────────────
    const onKeyDown = e => { gs.keys[e.code] = true; unlockAudio(); if (e.code === 'Escape') togglePause(); };
    const onKeyUp = e => { gs.keys[e.code] = false; };
    const onMouseMove = e => {
      const w = screenToWorld(e.clientX, e.clientY);
      gs.mouse.x = w.x; gs.mouse.y = THREE.MathUtils.clamp(w.y, -B.y + .5, B.y - .5);
      gs.touchActive = false;
    };
    const onClick = () => {
      if (Date.now() - lastTouchTime < 500) return;
      unlockAudio(); if (gs.running) shoot();
    };
    let touchOrigin = null;
    const onTouchMove = e => {
      e.preventDefault(); if (!touchOrigin) return;
      const t = e.touches[0];
      const dx = t.clientX - touchOrigin.clientX;
      const dy = t.clientY - touchOrigin.clientY;
      const scale = (B.x * 2) / mount.clientWidth;
      gs.mouse.x = THREE.MathUtils.clamp(touchOrigin.shipX + dx * scale, -B.x + .5, B.x - .5);
      gs.mouse.y = THREE.MathUtils.clamp(touchOrigin.shipY - dy * scale, -B.y + .5, B.y - .5);
      gs.touchActive = true;
    };
    const onTouchStart = e => {
      e.preventDefault(); lastTouchTime = Date.now(); unlockAudio();
      const t = e.touches[0];
      touchOrigin = { clientX: t.clientX, clientY: t.clientY, shipX: shipGroup.position.x, shipY: shipGroup.position.y };
      gs.touchActive = true; if (gs.running) shoot();
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
    const removeMesh = (mesh) => { scene.remove(mesh); };

    const takeDamage = (dmg, color = '#ff4444') => {
      const wasHP = localHP;
      localHP = Math.max(0, localHP - dmg);
      gs.hpLeft = localHP;
      setHp(localHP);
      showDamage(dmg, color);
      if (localHP <= 0 && wasHP > 0) {
        gs.running = false;
        finalScore.current = localScore;
        if (localScore > highScore.current) { highScore.current = localScore; sessionStorage.setItem('hs', localScore); }
        clearInterval(synthIntervalRef.current);
        const timeSurvived = Math.floor((Date.now() - gameStartTime.current) / 1000);
        setGameStats({ ...statsRef.current, timeSurvived });
        setSectorClearAnim(null); setBossHP(null);
        setPhase('over');
      }
    };

    const tick = t => {
      uiTick.current++;
      raf = requestAnimationFrame(tick);
      const now = performance.now();

      // ── Warp ──────────────────────────────────────────────────────────
      if (phase === 'warp') {
        if (warpStart === 0) warpStart = now;
        const elapsed = now - warpStart;
        const progress = Math.min(elapsed / 1600, 1);
        const stretch = progress < 0.5 ? 1 + progress * 30 : 16 - (progress - 0.5) * 30;
        starField.scale.set(1, Math.max(1, stretch), 1);
        renderer.render(scene, cam); return;
      } else { starField.scale.set(1, 1, 1); }

      if (!gs.running) return;
      if (paused) { renderer.render(scene, cam); return; }

      // ── Heat cool-down ─────────────────────────────────────────────────
      if (!gs.overheated && uiTick.current % 3 === 0) {
        gs.heat = Math.max(0, gs.heat - 1);
        if (uiTick.current % 12 === 0) setHeat(gs.heat);
      }

      // ── Ship movement ─────────────────────────────────────────────────
      const spd = .13;
      const usingKeyboard =
        gs.keys['ArrowLeft'] || gs.keys['ArrowRight'] ||
        gs.keys['ArrowUp'] || gs.keys['ArrowDown'] ||
        gs.keys['KeyA'] || gs.keys['KeyD'] ||
        gs.keys['KeyW'] || gs.keys['KeyS'];

      if (!gs.sectorClearing) {
        if (gs.keys['ArrowLeft'] || gs.keys['KeyA']) shipGroup.position.x = Math.max(-B.x + .5, shipGroup.position.x - spd);
        if (gs.keys['ArrowRight'] || gs.keys['KeyD']) shipGroup.position.x = Math.min(B.x - .5, shipGroup.position.x + spd);
        if (gs.keys['ArrowUp'] || gs.keys['KeyW']) shipGroup.position.y = Math.min(B.y - .5, shipGroup.position.y + spd * .8);
        if (gs.keys['ArrowDown'] || gs.keys['KeyS']) shipGroup.position.y = Math.max(-B.y + .5, shipGroup.position.y - spd * .8);
        if (!usingKeyboard) {
          shipGroup.position.x += (gs.mouse.x - shipGroup.position.x) * .09;
          shipGroup.position.y += (gs.mouse.y - shipGroup.position.y) * .06;
          shipGroup.position.x = THREE.MathUtils.clamp(shipGroup.position.x, -B.x + .5, B.x - .5);
          shipGroup.position.y = THREE.MathUtils.clamp(shipGroup.position.y, -B.y + .5, B.y - .5);
        }
      }

      shipLight.position.copy(shipGroup.position); shipLight.position.z = 3;
      engineMesh.material.color.setHex(gs.overheated
        ? (Math.random() > .5 ? 0xff0000 : 0xff4400)
        : Math.random() > .35 ? 0xff8800 : 0xff3300);
      shipGroup.rotation.z = Math.sin(t * .002) * .05;
      if (uiTick.current % 2 === 0) emitTrail();

      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const tp = trailParticles[i];
        tp.mesh.position.y += tp.vy;
        tp.mesh.position.x += (Math.random() - 0.5) * 0.015;
        tp.life -= 0.07;
        tp.mesh.material.opacity = Math.max(0, tp.life * 0.8);
        tp.mesh.scale.setScalar(Math.max(0, tp.life));
        if (tp.life <= 0) { removeMesh(tp.mesh); trailParticles.splice(i, 1); }
      }

      // ── Danger zone bonus ─────────────────────────────────────────────
      const shipDist = Math.hypot(shipGroup.position.x, shipGroup.position.y);
      const inDangerZone = shipDist < DANGER_ZONE_R;
      if (inDangerZone) {
        gs.dangerZoneFrames++;
        if (gs.dangerZoneFrames % 120 === 0) {
          const bonusPts = 5 + gs.localSector * 2;
          localScore += bonusPts;
          setScore(localScore);
          scoreRef.current = localScore;
          const sp = worldToScreen(shipGroup.position.x, shipGroup.position.y);
          addPopup(sp.x, sp.y - 30, `DANGER ZONE +${bonusPts}`, '#ffe082');
        }
      } else { gs.dangerZoneFrames = 0; }
      if (uiTick.current % 30 === 0) setDangerZoneBonus(inDangerZone);

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
      if (uiTick.current % 6 === 0) setActivePUps({ ...pActive });

      // Auto-fire while space held
      const cooldown = gs.rapid ? 80 : 190;
      if (!gs.sectorClearing && (gs.keys['Space'] || gs.keys['Enter']) && t - gs.lastShot > cooldown) {
        shoot(); gs.lastShot = t;
      }

      // ── Dynamic difficulty ─────────────────────────────────────────────
      gs.waveTimer += 16;
      const waveLen = 18000;
      const wavePos = (gs.waveTimer % waveLen) / waveLen;
      const scaledScore = Math.floor(localScore / 200);
      let waveMod = 1.0;
      if (wavePos < 0.4) waveMod = 1.0 + wavePos * 1.5;
      else if (wavePos < 0.6) waveMod = 1.6 - (wavePos - 0.4) * 4;
      else waveMod = 0.8 + (wavePos - 0.6) * 0.5;
      gs.diffMult = (1 + scaledScore * 0.16) * waveMod;
      const chaos = 0.85 + Math.random() * 0.3;
      gs.spawnInterval = Math.max(650, ((2200 - scaledScore * 80) / waveMod) * chaos);

      // ── Boss spawn every 3 sectors ─────────────────────────────────────
      if (!gs.sectorClearing && !gs.boss && gs.localSector > 1 && gs.localSector % 3 === 0 && !gs.bossSpawned) {
        spawnBoss();
      }

      // ── Sector Progression ────────────────────────────────────────────
      if (!gs.sectorClearing && !gs.boss && localScore >= lastSectorScore.current + 1000) {
        lastSectorScore.current += 1000;
        gs.sectorClearing = true;
        gs.vortexTime = 0;
        gs.asteroids.forEach(a => { a.vortexing = true; a.vortexDelay = Math.random() * 30; });
        SFX.sectorClear(audioCtxRef.current);
        triggerFlash();
        const newSector = Math.floor(localScore / 1000) + 1;
        setSectorClearAnim({ sector: newSector, phase: 'in' });

        sectorClearTimer.current = setTimeout(() => {
          gs.asteroids.forEach((a, idx) => {
            setTimeout(() => { if (a.mesh) { explode(a.mesh.position, 0xff8800, 8); removeMesh(a.mesh); } }, idx * 40);
          });
          gs.asteroids = [];
          gs.ufos.forEach(u => { explode(u.mesh.position, 0x00ffff, 12); removeMesh(u.mesh); });
          gs.ufos = []; gs.enemyBullets.forEach(b => removeMesh(b.mesh));
          gs.enemyBullets = []; gs.grazedIds.clear();
          triggerShake();
        }, 1400);
      }

      // ── Vortex pull ───────────────────────────────────────────────────
      if (gs.sectorClearing) {
        gs.vortexTime++;
        for (let i = gs.asteroids.length - 1; i >= 0; i--) {
          const a = gs.asteroids[i];
          if (!a.vortexing || gs.vortexTime < (a.vortexDelay || 0)) continue;
          const dx = -a.mesh.position.x, dy = -a.mesh.position.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
          const pull = 0.015 + gs.vortexTime * 0.0008;
          a.mesh.position.x += (dx / d) * pull * d * 0.4 + (-dy / d) * 0.04;
          a.mesh.position.y += (dy / d) * pull * d * 0.4 + (dx / d) * 0.04;
          a.mesh.rotation.x += 0.09; a.mesh.rotation.y += 0.09;
          const distToCenter = Math.sqrt(a.mesh.position.x ** 2 + a.mesh.position.y ** 2);
          if (distToCenter < 0.6) { explode(a.mesh.position, 0xff8800, 10); removeMesh(a.mesh); gs.asteroids.splice(i, 1); gs.grazedIds.delete(a.id); }
        }
        if (gs.vortexTime < 50) {
          shipGroup.position.x += (Math.random() - 0.5) * 0.045;
          engineMesh.material.color.setHex(gs.vortexTime % 4 < 2 ? 0xffaa00 : 0xff4400);
          shipLight.intensity = Math.min(6, 3 + gs.vortexTime * 0.06);
        } else {
          shipGroup.position.y += 0.25;
          engineMesh.material.color.setHex(0xffffff);
          shipLight.intensity = Math.min(10, shipLight.intensity + 0.2);
        }
        if (shipGroup.position.y > B.y + 2) {
          gs.sectorClearing = false;
          shipGroup.position.y = -B.y + 2;
          shipLight.intensity = 3;
          const newSector = Math.floor(localScore / 1000) + 1;
          gs.localSector = newSector;
          gs.bossSpawned = false;
          setSector(newSector);
          triggerShake();
          triggerFlash();
          // Heal 20 HP on sector clear
          localHP = Math.min(MAX_HP, localHP + 20);
          gs.hpLeft = localHP;
          setHp(localHP);
          const sp = worldToScreen(0, 0);
          addPopup(sp.x, sp.y, 'HULL REPAIRED +20 HP', '#48e080', true);
          setSectorClearAnim(prev => prev ? { ...prev, phase: 'out' } : null);
          setTimeout(() => setSectorClearAnim(null), 600);
          setPhase('warp');
          setTimeout(() => setPhase('playing'), 1800);
          const sectorColors = [0xffffff, 0x00ffff, 0xff00ff, 0xffff00, 0x00ff00, 0xff4444];
          starField.material.color.setHex(sectorColors[(newSector - 1) % sectorColors.length]);
          ambientLight.color.setHex(sectorColors[(newSector - 1) % sectorColors.length]);
          ambientLight.intensity = 0.4;
          setTimeout(() => { ambientLight.intensity = 1.2; }, 1000);
          return;
        }
      }

      // ── Boss AI ───────────────────────────────────────────────────────
      if (gs.boss) {
        const boss = gs.boss;
        if (boss.entering) {
          boss.enterProgress += 0.018;
          boss.mesh.position.y = THREE.MathUtils.lerp(B.y + 3, B.y - 2.5, Math.min(1, boss.enterProgress));
          if (boss.enterProgress >= 1) boss.entering = false;
        } else {
          boss.orbitAngle += 0.008;
          boss.mesh.position.x = Math.sin(boss.orbitAngle) * (B.x * 0.55);
          boss.mesh.position.y = B.y - 2.5 + Math.sin(boss.orbitAngle * 2.3) * 1.2;
          boss.core.rotation.x += 0.02; boss.core.rotation.y += 0.015;
          boss.ring.rotation.z += 0.04;
          boss.shootTimer++;
          const shootRate = Math.max(40, 90 - gs.localSector * 5);
          if (boss.shootTimer % shootRate === 0) {
            const dx = shipGroup.position.x - boss.mesh.position.x;
            const dy = shipGroup.position.y - boss.mesh.position.y;
            const deg = THREE.MathUtils.radToDeg(Math.atan2(dx, -dy));
            makeEnemyBullet(boss.mesh.position.x, boss.mesh.position.y - 0.5, deg);
            if (gs.localSector >= 3) {
              makeEnemyBullet(boss.mesh.position.x, boss.mesh.position.y - 0.5, deg - 20);
              makeEnemyBullet(boss.mesh.position.x, boss.mesh.position.y - 0.5, deg + 20);
            }
          }
        }
      }

      // ── Spawn ─────────────────────────────────────────────────────────
      if (!gs.sectorClearing && !gs.boss && t - gs.lastSpawn > gs.spawnInterval) {
        makeAsteroid();
        if (Math.random() > .68) makeAsteroid();
        gs.lastSpawn = t;
      }
      if (!gs.sectorClearing) {
        let pDropChance = 11000 + Math.random() * 8000;
        if (localHP < 40) pDropChance *= 0.55;
        if (gs.lastPowerUp === 0 || t - gs.lastPowerUp > pDropChance) { makePowerUp(); gs.lastPowerUp = t; }
      }
      if (!gs.sectorClearing && !gs.boss && (gs.lastUfoSpawn === 0 || t - gs.lastUfoSpawn > 20000 + Math.random() * 15000)) {
        makeUfo(); gs.lastUfoSpawn = t;
      }

      // ── Player Bullets ────────────────────────────────────────────────
      for (let i = gs.bullets.length - 1; i >= 0; i--) {
        const b = gs.bullets[i];
        b.mesh.position.x += b.vx || 0;
        b.mesh.position.y += b.vy;
        let hit = false;

        // Check boss collision first
        if (gs.boss && !gs.boss.entering) {
          const dist = dist2D(b.mesh.position, gs.boss.mesh.position);
          if (dist < 2.2) {
            SFX.bossHit(audioCtxRef.current);
            explode(b.mesh.position, 0xff2200, 6);
            if (!b.pierce) { removeMesh(b.mesh); hit = true; }
            gs.bossHPLeft = Math.max(0, gs.bossHPLeft - (b.big ? 2 : 1));
            setBossHP(gs.bossHPLeft);
            gs.boss.core.material.emissiveIntensity = 1.5;
            setTimeout(() => { if (gs.boss) gs.boss.core.material.emissiveIntensity = 0.5; }, 100);

            if (gs.bossHPLeft <= 0) {
              // Boss dead!
              SFX.bigExplode(audioCtxRef.current);
              for (let e = 0; e < 5; e++) setTimeout(() => explode(gs.boss.mesh.position, 0xff4400, 20), e * 150);
              removeMesh(gs.boss.mesh);
              gs.boss = null; gs.bossSpawned = true;
              setBossHP(null);
              const earned = 500 * gs.localSector;
              localScore += earned; setScore(localScore); scoreRef.current = localScore;
              statsRef.current.bossesKilled++;
              triggerShake(2); triggerFlash();
              const sp = worldToScreen(0, 0);
              addPopup(sp.x, sp.y, `BOSS DESTROYED! +${earned}`, '#ff8800', true);
              // Spawn repair kit
              makePowerUp();
            }
            if (!hit) gs.bullets.splice(i, 1);
            continue;
          }
        }

        for (let j = gs.asteroids.length - 1; j >= 0; j--) {
          const a = gs.asteroids[j];
          const hr = b.big ? a.size + .3 : a.size + .14;
          if (dist2D(b.mesh.position, a.mesh.position) < hr) {
            a.hitsLeft--;
            a.flashFrames = 6;
            // Flash hit asteroid red
            a.mat.emissive = new THREE.Color('#ffffff');
            a.mat.emissiveIntensity = 1;
            setTimeout(() => {
              if (a.mat) {
                a.mat.emissive = a.type.emissive || new THREE.Color('#000000');
                a.mat.emissiveIntensity = a.type.emissiveIntensity || 0;
              }
            }, 80);

            if (!b.pierce) { removeMesh(b.mesh); hit = true; }

            if (a.hitsLeft <= 0) {
              SFX.explode(audioCtxRef.current);
              explode(a.mesh.position);
              removeMesh(a.mesh);
              gs.asteroids.splice(j, 1);
              gs.grazedIds.delete(a.id);

              const timeSinceLast = now - gs.lastHitTime;
              if (timeSinceLast < 1500) gs.comboCount = Math.min(gs.comboCount + 1, 8);
              else gs.comboCount = 1;
              gs.lastHitTime = now;
              const multiplier = gs.comboCount >= 3 ? gs.comboCount : 1;
              // Danger zone scoring bonus
              const dzMult = inDangerZone ? 1.5 : 1;
              const earned = Math.floor(a.pts * multiplier * dzMult);
              localScore += earned; setScore(localScore); scoreRef.current = localScore;
              if (gs.comboCount >= 3) setCombo(gs.comboCount); else setCombo(0);
              statsRef.current.enemiesDestroyed++;
              if (gs.comboCount > statsRef.current.maxCombo) statsRef.current.maxCombo = gs.comboCount;

              const sp = worldToScreen(a.mesh.position.x, a.mesh.position.y);
              const popColor = a.type.labelColor;
              const label = (multiplier > 1 || dzMult > 1)
                ? `+${earned}${multiplier > 1 ? ` ×${multiplier}` : ''}${dzMult > 1 ? ' 🔥' : ''}`
                : `+${earned}`;
              addPopup(sp.x, sp.y, label, popColor, multiplier > 1);
            } else {
              // Hit but not dead yet — show remaining hits
              SFX.explode(audioCtxRef.current);
              explode(b.mesh.position, 0xffffff, 4);
              const sp = worldToScreen(a.mesh.position.x, a.mesh.position.y);
              addPopup(sp.x, sp.y, `${a.hitsLeft} HIT${a.hitsLeft > 1 ? 'S' : ''} LEFT`, a.type.labelColor);
            }
            break;
          }
        }

        if (!hit) {
          for (let k = gs.ufos.length - 1; k >= 0; k--) {
            const u = gs.ufos[k];
            const uRadius = b.big ? 1.0 : 0.8;
            if (dist2D(b.mesh.position, u.mesh.position) < uRadius) {
              SFX.explode(audioCtxRef.current);
              explode(u.mesh.position, 0x00ffff, 25);
              removeMesh(u.mesh);
              if (!b.pierce) { removeMesh(b.mesh); hit = true; }
              gs.ufos.splice(k, 1);
              const multiplier = gs.comboCount >= 3 ? gs.comboCount : 1;
              const earned = 100 * multiplier;
              localScore += earned; setScore(localScore); scoreRef.current = localScore;
              statsRef.current.enemiesDestroyed++;
              if (gs.comboCount > statsRef.current.maxCombo) statsRef.current.maxCombo = gs.comboCount;
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

      // ── Enemy Bullets ─────────────────────────────────────────────────
      for (let i = gs.enemyBullets.length - 1; i >= 0; i--) {
        const b = gs.enemyBullets[i];
        b.mesh.position.x += b.vx;
        b.mesh.position.y += b.vy;
        let hit = false;
        if (!gs.sectorClearing && dist2D(b.mesh.position, shipGroup.position) < 0.6) {
          hit = true;
          if (gs.shield) {
            SFX.explode(audioCtxRef.current);
            explode(b.mesh.position, 0x4880e0, 10);
            gs.shield = false;
            const sp = worldToScreen(shipGroup.position.x, shipGroup.position.y);
            addPopup(sp.x, sp.y, 'SHIELD BLOCKED', '#4880e0', true);
          } else {
            SFX.hit(audioCtxRef.current);
            triggerShake();
            explode(shipGroup.position, 0xe04848, 20);
            gs.comboCount = 0; setCombo(0);
            takeDamage(18, '#cc44ff');
          }
        }
        if (hit || b.mesh.position.y < -B.y - 2 || b.mesh.position.x < -B.x - 2 || b.mesh.position.x > B.x + 2) {
          removeMesh(b.mesh); gs.enemyBullets.splice(i, 1);
        }
      }

      // ── Asteroids ─────────────────────────────────────────────────────
      for (let i = gs.asteroids.length - 1; i >= 0; i--) {
        const a = gs.asteroids[i];
        if (!a.vortexing) {
          a.mesh.position.y += a.vy;
          a.mesh.rotation.x += a.rx;
          a.mesh.rotation.y += a.ry;
        }
        const distToShip = dist2D(a.mesh.position, shipGroup.position);
        const hitRadius = a.size + .5;
        const grazeRadius = a.size + 1.3;

        if (distToShip > hitRadius && distToShip < grazeRadius && !gs.grazedIds.has(a.id)) {
          gs.grazedIds.add(a.id);
          const grazePts = 5;
          localScore += grazePts; setScore(localScore); scoreRef.current = localScore;
          SFX.graze(audioCtxRef.current);
          showGraze(grazePts);
          statsRef.current.grazesTotal++;
        }

        if (distToShip < hitRadius && !gs.sectorClearing) {
          if (gs.shield) {
            SFX.explode(audioCtxRef.current);
            explode(a.mesh.position, 0x4880e0, 12);
            removeMesh(a.mesh); gs.asteroids.splice(i, 1); gs.grazedIds.delete(a.id);
            gs.shield = false;
            const sp = worldToScreen(shipGroup.position.x, shipGroup.position.y);
            addPopup(sp.x, sp.y, 'SHIELD BLOCKED', '#4880e0', true);
            continue;
          }
          const isHeavy = a.type.id === 'large';
          isHeavy ? SFX.heavyHit(audioCtxRef.current) : SFX.hit(audioCtxRef.current);
          triggerShake(isHeavy ? 2 : 1);
          explode(shipGroup.position, 0xe04848, 20);
          removeMesh(a.mesh); gs.asteroids.splice(i, 1); gs.grazedIds.delete(a.id);
          gs.comboCount = 0; setCombo(0);
          takeDamage(a.damage, a.type.labelColor);
          continue;
        }

        if (a.mesh.position.y < -B.y - 2 && !gs.sectorClearing) {
          // Penalty for letting asteroids through — only large & medium
          if (a.type.id !== 'small') {
            SFX.hit(audioCtxRef.current);
            triggerShake();
            removeMesh(a.mesh); gs.asteroids.splice(i, 1); gs.grazedIds.delete(a.id);
            gs.comboCount = 0; setCombo(0);
            takeDamage(a.type.id === 'large' ? 15 : 8, a.type.labelColor);
          } else {
            removeMesh(a.mesh); gs.asteroids.splice(i, 1); gs.grazedIds.delete(a.id);
          }
        }
      }

      // ── UFOs ──────────────────────────────────────────────────────────
      for (let i = gs.ufos.length - 1; i >= 0; i--) {
        const u = gs.ufos[i];
        u.mesh.position.x += u.vx;
        u.mesh.rotation.y += 0.05;
        if (!gs.sectorClearing && gs.localSector >= 2 && Math.random() < 0.015 + (gs.localSector * 0.005)) {
          const dx = shipGroup.position.x - u.mesh.position.x;
          const dy = shipGroup.position.y - u.mesh.position.y;
          const deg = THREE.MathUtils.radToDeg(Math.atan2(dx, -dy));
          makeEnemyBullet(u.mesh.position.x, u.mesh.position.y - 0.5, deg);
        }
        if (!gs.sectorClearing && dist2D(u.mesh.position, shipGroup.position) < 1.4) {
          if (gs.shield) {
            SFX.explode(audioCtxRef.current);
            explode(u.mesh.position, 0x00ffff, 15);
            removeMesh(u.mesh); gs.ufos.splice(i, 1);
            gs.shield = false;
            const sp = worldToScreen(shipGroup.position.x, shipGroup.position.y);
            addPopup(sp.x, sp.y, 'SHIELD BLOCKED', '#4880e0', true);
            continue;
          }
          SFX.hit(audioCtxRef.current); triggerShake();
          explode(shipGroup.position, 0xe04848, 20);
          removeMesh(u.mesh); gs.ufos.splice(i, 1);
          gs.comboCount = 0; setCombo(0);
          takeDamage(u.damage, '#00ffff');
          continue;
        }
        if ((u.vx > 0 && u.mesh.position.x > B.x + 2) || (u.vx < 0 && u.mesh.position.x < -B.x - 2)) {
          removeMesh(u.mesh); gs.ufos.splice(i, 1);
        }
      }

      // ── Power-ups ─────────────────────────────────────────────────────
      for (let i = gs.powerups.length - 1; i >= 0; i--) {
        const p = gs.powerups[i];
        p.mesh.position.y += p.vy;
        p.mesh.rotation.y += .03; p.mesh.rotation.x += .02;
        if (dist2D(p.mesh.position, shipGroup.position) < 1.05) {
          SFX.powerup(audioCtxRef.current);
          const sp = worldToScreen(p.mesh.position.x, p.mesh.position.y);
          addPopup(sp.x, sp.y, PUPS[p.type].label, PUPS[p.type].hex, true);
          removeMesh(p.mesh); gs.powerups.splice(i, 1);
          if (p.type === 'bomb') {
            triggerShake();
            explode(shipGroup.position, 0xe02048, 40);
            for (let j = gs.asteroids.length - 1; j >= 0; j--) {
              const a = gs.asteroids[j];
              explode(a.mesh.position, 0xff5500, 8);
              removeMesh(a.mesh);
              localScore += a.pts * (gs.comboCount || 1);
              statsRef.current.enemiesDestroyed++;
            }
            setScore(localScore); scoreRef.current = localScore; gs.asteroids = [];
            continue;
          }
          if (p.type === 'repair') {
            const healAmt = 30;
            localHP = Math.min(MAX_HP, localHP + healAmt);
            gs.hpLeft = localHP; setHp(localHP);
            const sp2 = worldToScreen(p.mesh.position.x, p.mesh.position.y);
            addPopup(sp2.x, sp2.y - 20, `+${healAmt} HP`, '#80ff80', true);
            continue;
          }
          gs[p.type] = true; gs[`${p.type}Expires`] = now + PUPS[p.type].dur;
          continue;
        }
        if (p.mesh.position.y < -B.y - 2) { removeMesh(p.mesh); gs.powerups.splice(i, 1); }
      }

      // ── Particles ─────────────────────────────────────────────────────
      for (let i = gs.particles.length - 1; i >= 0; i--) {
        const p = gs.particles[i];
        if (p.isRing) {
          p.scale = (p.scale || 0.1) + 0.18;
          p.mesh.scale.setScalar(p.scale); p.life -= 0.055;
          p.mesh.material.opacity = Math.max(0, p.life);
        } else {
          p.mesh.position.add(p.vel); p.vel.multiplyScalar(.88);
          p.life -= .045; p.mesh.material.opacity = Math.max(0, p.life);
        }
        if (p.life <= 0) { removeMesh(p.mesh); gs.particles.splice(i, 1); }
      }

      renderer.render(scene, cam);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      gs.running = false;
      cancelAnimationFrame(raf);
      clearTimeout(sectorClearTimer.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('click', onClick);
      mount.removeEventListener('touchstart', onTouchStart);
      mount.removeEventListener('touchmove', onTouchMove);
      mount.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      const uniqueGeos = new Set();
      disposables.forEach(mesh => {
        if (mesh.geometry) uniqueGeos.add(mesh.geometry);
        if (mesh.material) {
          if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose());
          else mesh.material.dispose();
        }
      });
      uniqueGeos.forEach(g => g.dispose());
      particleGeo.dispose(); particleMats.forEach(m => m.dispose());
      sg.dispose(); starField.material.dispose(); scene.remove(starField);
      [coneMesh, wings, engineMesh, shieldMesh].forEach(m => { m.geometry.dispose(); m.material.dispose(); });
      [ambientLight, sun, shipLight, shieldLight].forEach(l => scene.remove(l));
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => { }); audioCtxRef.current = null; }
    };
  }, [phase, triggerShake, showGraze, showDamage, unlockAudio, paused, togglePause, triggerFlash]);

  const hpPct = (hp / MAX_HP) * 100;
  const heatPct = heat;

  return (
    <Wrapper $shake={shaking}>
      {flash && <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 100, opacity: 0.4, pointerEvents: 'none' }} />}

      <BackBtn to="/">← PORTFOLIO</BackBtn>
      <CanvasMount ref={mountRef} />

      {/* Danger zone overlay — shown during gameplay */}
      {phase === 'playing' && <DangerZone />}

      <PopupLayer>
        {popups.map(p => (
          <Popup key={p.id} style={{ left: p.x, top: p.y }} $color={p.color} $big={p.big}>{p.text}</Popup>
        ))}
      </PopupLayer>

      {grazeMsg && <GrazePopup key={grazeMsg.id}>GRAZE +{grazeMsg.pts}</GrazePopup>}
      {damageMsg && <DamagePopup key={damageMsg.id} $color={damageMsg.color}>-{damageMsg.dmg} HP</DamagePopup>}

      {/* Boss warning */}
      {bossWarningVisible && <BossWarningBanner>⚠ BOSS INCOMING ⚠</BossWarningBanner>}

      {/* Sector Clear Overlay */}
      {sectorClearAnim && (
        <SectorClearOverlay>
          <VortexRing $dur="0.9" $delay="0" />
          <VortexRing $dur="0.9" $delay="0.18" />
          <VortexRing $dur="0.9" $delay="0.36" />
          <ScanLine $dur="1.2" $delay="0.05" />
          <ScanLine $dur="1.2" $delay="0.5" />
          <SectorClearTitle>SECTOR CLEAR</SectorClearTitle>
          <SectorClearSub>SECTOR {sectorClearAnim.sector - 1} COMPLETE · JUMPING TO {sectorClearAnim.sector}</SectorClearSub>
          <SectorClearScore $exit={sectorClearAnim.phase === 'out'}>+20 HP · WARP DRIVE CHARGED</SectorClearScore>
        </SectorClearOverlay>
      )}

      {/* HUD */}
      {phase === 'playing' && (
        <>
          <HUD>
            {/* Left — Score */}
            <HudBlock>
              <HudLabel>SCORE</HudLabel>
              <HudValue $accent="#e04848" $lg>{String(score).padStart(6, '0')}</HudValue>
              <HudLabel style={{ marginTop: '.3rem' }}>HULL INTEGRITY</HudLabel>
              <HealthBarWrap $flash={healthFlashing}>
                <HealthBarTrack>
                  <HealthBarFill $pct={hpPct} />
                </HealthBarTrack>
                <HudLabel style={{ fontSize: '.55rem' }}>{hp} / {MAX_HP}</HudLabel>
              </HealthBarWrap>
            </HudBlock>

            {/* Center */}
            <HudCenter>
              {combo >= 3 && <ComboText>COMBO ×{combo}</ComboText>}
              {dangerZoneBonus && (
                <div style={{ fontSize: '.6rem', color: '#ffe082', letterSpacing: '2px', animation: 'none', opacity: 0.9 }}>
                  🔥 DANGER ZONE
                </div>
              )}
              <HudLabel style={{ textAlign: 'center', letterSpacing: '1px', marginTop: '.1rem' }}>
                SEC {sector} · LVL {Math.max(1, Math.floor(score / 300) + 1)}
              </HudLabel>
            </HudCenter>

            {/* Right — Heat */}
            <HudBlock style={{ alignItems: 'flex-end' }}>
              <HudLabel>WEAPON HEAT</HudLabel>
              <HeatBarWrap>
                <HeatBarTrack>
                  <HeatBarFill $pct={heatPct} $overheat={overheated} />
                </HeatBarTrack>
                {overheated
                  ? <OverheatLabel>OVERHEAT!</OverheatLabel>
                  : <HudLabel style={{ fontSize: '.55rem', textAlign: 'right' }}>{Math.round(heatPct)}%</HudLabel>
                }
              </HeatBarWrap>
            </HudBlock>
          </HUD>

          {/* Boss HP bar */}
          {bossHP !== null && (
            <BossBarWrap>
              <BossLabel>★ SECTOR BOSS ★</BossLabel>
              <BossBarTrack>
                <BossBarFill $pct={(bossHP / bossMaxHP) * 100} />
              </BossBarTrack>
              <HudLabel style={{ fontSize: '.5rem' }}>{bossHP} / {bossMaxHP}</HudLabel>
            </BossBarWrap>
          )}

          {/* Power-up bar */}
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

      {/* Warp */}
      {phase === 'warp' && (
        <Overlay style={{ background: 'transparent', backdropFilter: 'none', pointerEvents: 'none' }}>
          <GameTitle style={{ fontSize: 'clamp(1.8rem,6vw,2.4rem)', letterSpacing: '10px', opacity: 0.9 }}>
            {sector > 1 ? `SECTOR ${sector}` : 'ENTERING WARP'}
          </GameTitle>
          <Sub style={{ letterSpacing: '6px', opacity: 0.7 }}>
            {sector > 1 ? 'HYPER-JUMP SUCCESSFUL' : 'PREPARE FOR LAUNCH'}
          </Sub>
        </Overlay>
      )}

      {/* Start screen */}
      {phase === 'start' && (
        <Overlay>
          <GameTitle>ASTEROID FIELD</GameTitle>
          <Sub>THREE.JS COMBAT EXPERIENCE</Sub>
          <ObjBox>
            <ObjTitle>ASTEROID THREAT LEVELS</ObjTitle>
            <ObjRow $vc="#7aaeff"><span>🔵 Small — 1 hit to destroy</span>     <span className="v">-8 HP · +25 pts</span></ObjRow>
            <ObjRow $vc="#ffb74d"><span>🟡 Medium — 2 hits to destroy</span>   <span className="v">-20 HP · +12 pts</span></ObjRow>
            <ObjRow $vc="#e04848"><span>🔴 Large — 3 hits to destroy</span>    <span className="v">-35 HP · +8 pts</span></ObjRow>
            <ObjRow $vc="#aabbff"><span>💎 Crystal — 1 hit, high value</span>  <span className="v">-12 HP · +40 pts</span></ObjRow>
            <ObjRow $vc="#ffe082"><span>🟠 Near-miss graze</span>              <span className="v">+5 pts</span></ObjRow>
            <ObjRow $vc="#48e080"><span>🔥 Danger Zone (center)</span>         <span className="v">+bonus pts</span></ObjRow>
            <ObjRow $vc="#ff8800"><span>★ Boss — every 3 sectors</span>        <span className="v">+500×sector pts</span></ObjRow>
            <ObjRow $vc="#ff4444"><span>Asteroid passes bottom</span>           <span className="v">−HP penalty</span></ObjRow>
            <ObjRow>              <span>Hull Integrity</span>                  <span className="v">100 HP</span></ObjRow>
          </ObjBox>
          <Legend>
            <LItem $c="#4880e0">SHIELD — absorbs one hit</LItem>
            <LItem $c="#48e080">RAPID — fast 3-way fire</LItem>
            <LItem $c="#ffb74d">BIG SHOT — double damage</LItem>
            <LItem $c="#c048e0">SPREAD — 5-way fire</LItem>
            <LItem $c="#48e0e0">LASER — piercing beam</LItem>
            <LItem $c="#e02048">SMART BOMB — destroys all</LItem>
            <LItem $c="#80ff80">REPAIR KIT — +30 HP</LItem>
          </Legend>
          <ObjBox style={{ background: 'rgba(255,80,0,.04)', borderColor: 'rgba(255,140,0,.15)' }}>
            <ObjTitle>⚠ WEAPON HEAT SYSTEM</ObjTitle>
            <ObjRow><span>Rapid fire builds heat — cool down or overheat!</span></ObjRow>
            <ObjRow><span>Overheat locks weapons for <span className="v">2.5 seconds</span></span></ObjRow>
          </ObjBox>
          <CtrlRow>
            MOUSE / TOUCH — move &nbsp;·&nbsp; WASD / ARROWS — keyboard<br />
            SPACE (hold) / CLICK / TAP — shoot
          </CtrlRow>
          {highScore.current > 0 && <HighScore>BEST: {String(highScore.current).padStart(6, '0')}</HighScore>}
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
            <ObjRow $vc="#a0c0ff"><span>Enemies Destroyed</span>  <span className="v">{gameStats.enemiesDestroyed}</span></ObjRow>
            <ObjRow $vc="#ff8800"><span>Bosses Killed</span>       <span className="v">{gameStats.bossesKilled}</span></ObjRow>
            <ObjRow $vc="#ffb74d"><span>Max Combo</span>           <span className="v">{gameStats.maxCombo}×</span></ObjRow>
            <ObjRow $vc="#e04848"><span>Time Survived</span>       <span className="v">{gameStats.timeSurvived}s</span></ObjRow>
            <ObjRow $vc="#48e080"><span>Danger Grazes</span>       <span className="v">{gameStats.grazesTotal}</span></ObjRow>
          </ObjBox>
          {finalScore.current >= highScore.current && finalScore.current > 0 &&
            <Sub style={{ color: '#ffb74d', opacity: 1, marginBottom: '.5rem' }}>★ NEW HIGH SCORE ★</Sub>}
          {highScore.current > 0 && <HighScore>BEST: {String(highScore.current).padStart(6, '0')}</HighScore>}
          <LaunchBtn onClick={() => startGame(true)}>PLAY AGAIN ▶</LaunchBtn>
        </Overlay>
      )}

      {/* Pause */}
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