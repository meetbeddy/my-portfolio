import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowLeft, Crosshair, Flame, Play, Star, TriangleAlert, Trophy } from 'lucide-react';
import {
  AUDIO_SETTINGS_KEY, DIFFICULTIES, DIFFICULTY_OPTIONS, MAX_HP,
  PUPS, SALVAGE_UPGRADE, SECTOR_PALETTES, SECTOR_UPGRADES, TUTORIAL_KEY,
  TUTORIAL_STEPS, drawUpgradeChoices, emptyUpgrades,
  hasCompletedTutorial, highScoreKey, readAudioSettings, readHighScore,
} from './core/gameConfig';
import { createAudio, SFX, startSynthwave } from './core/gameAudio';
import { useTouchControls } from './core/useTouchControls';

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
const hitConfirm = keyframes`
  0%{opacity:0;transform:translate(-50%,-50%) scale(1.8) rotate(45deg)}
  25%{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(45deg)}
  100%{opacity:0;transform:translate(-50%,-50%) scale(.7) rotate(45deg)}
`;
const chargePulse = keyframes`
  0%,100%{opacity:.55;transform:translateX(-50%) scale(1)}
  50%{opacity:1;transform:translateX(-50%) scale(1.05)}
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
  display:flex;align-items:center;gap:.45rem;
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
  display:flex;align-items:center;gap:.65rem;
`;
const BossAttackBanner = styled.div`
  position:absolute;top:23%;left:50%;transform:translateX(-50%);
  color:#ffd166;font-size:.62rem;font-weight:800;letter-spacing:4px;
  text-shadow:0 0 14px rgba(255,209,102,.8);pointer-events:none;z-index:16;
  animation:${chargePulse} .45s ease-in-out infinite;white-space:nowrap;
`;
const HitMarker = styled.div`
  position:absolute;left:50%;top:50%;width:18px;height:18px;z-index:14;
  pointer-events:none;animation:${hitConfirm} .26s ease-out forwards;
  &::before,&::after{content:'';position:absolute;left:8px;top:0;width:2px;height:18px;background:${p => p.$color};box-shadow:0 0 8px ${p => p.$color};}
  &::after{transform:rotate(90deg);}
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
  @media(max-width:767px){bottom:6.8rem;}
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
  display:inline-flex;align-items:center;gap:.35rem;
  &:hover{background:rgba(255,255,255,.14);color:#fff;}
`;
const GameControls = styled.div`
  position:absolute;right:1.4rem;top:3.2rem;z-index:30;display:flex;gap:.45rem;
  @media(max-width:640px){top:3.4rem;right:.8rem;bottom:auto;}
`;
const IconControl = styled.button`
  background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);
  color:rgba(255,255,255,.68);width:2.1rem;height:2.1rem;border-radius:50%;
  display:grid;place-items:center;font-family:inherit;font-size:.78rem;cursor:pointer;
  backdrop-filter:blur(8px);transition:background .2s,color .2s,transform .18s;
  &:hover{background:rgba(255,255,255,.14);color:#fff;transform:translateY(-1px);}
`;
const TouchControls = styled.div`
  display:none;
  @media(max-width:767px){display:block;position:absolute;inset:0;z-index:17;pointer-events:none;}
`;
const JoystickPad = styled.div`
  position:absolute;left:max(1rem,env(safe-area-inset-left));bottom:max(1rem,env(safe-area-inset-bottom));
  width:92px;height:92px;border-radius:50%;pointer-events:auto;touch-action:none;
  border:1px solid rgba(122,174,255,.38);background:rgba(4,4,14,.48);backdrop-filter:blur(5px);
  box-shadow:inset 0 0 24px rgba(122,174,255,.08);
`;
const JoystickKnob = styled.div`
  position:absolute;left:50%;top:50%;width:38px;height:38px;border-radius:50%;
  transform:translate(calc(-50% + ${p => p.$x * 25}px),calc(-50% + ${p => p.$y * 25}px));
  background:rgba(122,174,255,.28);border:1px solid rgba(122,174,255,.72);
  box-shadow:0 0 16px rgba(122,174,255,.3);pointer-events:none;
`;
const TouchFire = styled.button`
  position:absolute;right:max(1rem,env(safe-area-inset-right));bottom:max(1rem,env(safe-area-inset-bottom));
  width:74px;height:74px;border-radius:50%;pointer-events:auto;touch-action:none;
  display:grid;place-items:center;border:1px solid rgba(224,72,72,.72);color:#ff8c8c;
  background:rgba(80,12,20,.52);box-shadow:0 0 22px rgba(224,72,72,.22);cursor:pointer;
  &:active{background:rgba(224,72,72,.3);transform:scale(.96);}
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
const QuickBrief = styled.div`
  display:grid;grid-template-columns:repeat(3,1fr);gap:.65rem;width:min(620px,92vw);
  @media(max-width:640px){grid-template-columns:1fr;}
`;
const EngineeringNote = styled.div`
  width:min(560px,90vw);padding:.8rem 1rem;border-left:2px solid #7aaeff;
  background:rgba(122,174,255,.055);color:rgba(255,255,255,.58);
  font-size:.66rem;line-height:1.55;text-align:left;
`;
const EngineeringTitle = styled.div`
  color:#7aaeff;font-size:.6rem;font-weight:800;letter-spacing:2px;margin-bottom:.35rem;
`;
const EngineeringSystems = styled.div`
  display:flex;gap:.45rem;flex-wrap:wrap;margin-top:.55rem;
`;
const EngineeringSystem = styled.span`
  color:rgba(255,255,255,.68);font-size:.52rem;letter-spacing:1px;
`;
const BriefCard = styled.div`
  background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.1);
  border-radius:.6rem;padding:.75rem .9rem;text-align:left;
`;
const BriefLabel = styled.div`
  color:${p => p.$c || '#ffb74d'};font-size:.62rem;font-weight:700;letter-spacing:2px;
  margin-bottom:.35rem;text-transform:uppercase;
`;
const BriefText = styled.div`color:rgba(255,255,255,.64);font-size:.72rem;line-height:1.5;`;
const OptionRow = styled.div`
  display:flex;gap:.55rem;flex-wrap:wrap;justify-content:center;width:min(620px,92vw);
`;
const OptionButton = styled.button`
  border:1px solid ${p => p.$active ? '#e04848' : 'rgba(255,255,255,.14)'};
  background:${p => p.$active ? 'rgba(224,72,72,.18)' : 'rgba(255,255,255,.045)'};
  color:${p => p.$active ? '#fff' : 'rgba(255,255,255,.58)'};
  border-radius:999px;padding:.42rem .8rem;font-family:inherit;font-size:.66rem;
  letter-spacing:1.5px;cursor:pointer;transition:background .18s,border-color .18s,color .18s,transform .18s;
  &:hover{transform:translateY(-1px);border-color:rgba(224,72,72,.65);color:#fff;}
`;
const SettingsPanel = styled.div`
  width:min(440px,90vw);display:flex;flex-direction:column;gap:.8rem;padding:1rem;
  background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.1);border-radius:8px;
`;
const SettingRow = styled.label`
  display:grid;grid-template-columns:90px 1fr 42px;align-items:center;gap:.75rem;
  color:rgba(255,255,255,.62);font-size:.65rem;letter-spacing:1px;
`;
const VolumeSlider = styled.input`
  width:100%;accent-color:#e04848;cursor:pointer;
`;
const PauseActions = styled.div`
  display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center;
`;
const PauseLink = styled(Link)`
  display:inline-flex;align-items:center;justify-content:center;padding:.62rem 1rem;
  border:1px solid rgba(255,255,255,.18);border-radius:5px;color:rgba(255,255,255,.72);
  background:rgba(255,255,255,.06);font-size:.68rem;letter-spacing:2px;text-decoration:none;
  &:hover{color:#fff;background:rgba(255,255,255,.12);}
`;
const PauseButton = styled.button`
  padding:.62rem 1rem;border:1px solid ${p => p.$primary ? '#e04848' : 'rgba(255,255,255,.18)'};
  border-radius:5px;color:${p => p.$primary ? '#fff' : 'rgba(255,255,255,.72)'};
  background:${p => p.$primary ? 'rgba(224,72,72,.22)' : 'rgba(255,255,255,.06)'};
  font-family:inherit;font-size:.68rem;letter-spacing:2px;cursor:pointer;
  &:hover{color:#fff;background:${p => p.$primary ? 'rgba(224,72,72,.34)' : 'rgba(255,255,255,.12)'};}
`;
const LaunchBtn = styled.button`
  background:linear-gradient(135deg,#e04848,#b02020);color:#fff;
  border:none;padding:.65rem 2.2rem;border-radius:2rem;font-size:.9rem;
  font-family:inherit;font-weight:700;letter-spacing:4px;cursor:pointer;
  box-shadow:0 4px 20px rgba(224,72,72,.5);transition:transform .18s,box-shadow .18s;
  margin-top:.2rem;
  display:inline-flex;align-items:center;justify-content:center;gap:.55rem;
  &:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 8px 28px rgba(224,72,72,.7);}
  &:active{transform:scale(.97);}
`;
const HighScore = styled.div`font-size:.9rem;color:rgba(255,255,255,.5);letter-spacing:2px;`;
const FinalScore = styled.div`font-size:1.4rem;color:#e04848;letter-spacing:3px;`;
const HintBanner = styled.div`
  position:absolute;left:50%;bottom:5.4rem;transform:translateX(-50%);
  z-index:18;pointer-events:none;width:min(520px,88vw);text-align:center;
  padding:.55rem .9rem;border:1px solid rgba(255,183,77,.25);border-radius:999px;
  background:rgba(6,6,18,.72);backdrop-filter:blur(8px);
  color:rgba(255,232,180,.92);font-size:.68rem;line-height:1.45;letter-spacing:1px;
  box-shadow:0 0 24px rgba(255,183,77,.12);
  animation:${slideIn} .25s ease;
`;
const TutorialCoach = styled.div`
  position:absolute;left:50%;bottom:4.8rem;transform:translateX(-50%);z-index:19;
  width:min(560px,90vw);padding:.8rem .9rem;background:rgba(4,4,14,.86);
  border:1px solid rgba(122,174,255,.35);border-radius:6px;backdrop-filter:blur(10px);
  box-shadow:0 10px 30px rgba(0,0,0,.28);animation:${slideIn} .25s ease;
  @media(max-width:767px){bottom:7.2rem;}
`;
const TutorialTop = styled.div`
  display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:.38rem;
`;
const TutorialTitle = styled.div`
  color:#7aaeff;font-size:.65rem;font-weight:800;letter-spacing:2px;
`;
const TutorialProgress = styled.div`
  color:rgba(255,255,255,.35);font-size:.55rem;letter-spacing:2px;white-space:nowrap;
`;
const TutorialText = styled.div`
  color:rgba(255,255,255,.76);font-size:.72rem;line-height:1.5;padding-right:5.5rem;
  @media(max-width:520px){padding-right:0;}
`;
const TutorialSkip = styled.button`
  position:absolute;right:.9rem;bottom:.8rem;border:0;border-bottom:1px solid rgba(255,255,255,.28);
  padding:.18rem 0;background:transparent;color:rgba(255,255,255,.45);font-family:inherit;
  font-size:.55rem;letter-spacing:1px;cursor:pointer;
  &:hover,&:focus-visible{color:#fff;border-color:#fff;outline:none;}
  @media(max-width:520px){position:static;margin-top:.65rem;}
`;
const UpgradeOverlay = styled.div`
  position:absolute;inset:0;z-index:70;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:1rem;padding:1.25rem;
  background:rgba(4,4,14,.88);backdrop-filter:blur(10px);overflow-y:auto;
  @media(max-width:680px){justify-content:flex-start;padding-top:4.5rem;}
`;
const UpgradeEyebrow = styled.div`
  color:#ffb74d;font-size:.62rem;font-weight:700;letter-spacing:5px;text-transform:uppercase;
`;
const UpgradeTitle = styled.h2`
  margin:0;color:#fff;font-size:clamp(1.5rem,5vw,2.4rem);letter-spacing:5px;text-align:center;
`;
const UpgradeGrid = styled.div`
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.75rem;width:min(760px,94vw);
  @media(max-width:680px){grid-template-columns:1fr;max-width:420px;}
`;
const UpgradeCard = styled.button`
  min-height:150px;padding:1rem;text-align:left;font-family:inherit;cursor:pointer;
  color:#fff;background:rgba(255,255,255,.05);border:1px solid ${p => p.$color}66;
  border-radius:8px;transition:transform .18s,border-color .18s,background .18s,box-shadow .18s;
  &:hover,&:focus-visible{transform:translateY(-3px);border-color:${p => p.$color};background:${p => p.$color}15;box-shadow:0 10px 30px ${p => p.$color}22;outline:none;}
`;
const UpgradeCardLabel = styled.div`
  color:${p => p.$color};font-size:.78rem;font-weight:800;letter-spacing:2px;margin-bottom:.65rem;
`;
const UpgradeCardText = styled.div`
  color:rgba(255,255,255,.64);font-size:.72rem;line-height:1.55;min-height:3.4rem;
`;
const UpgradeLevel = styled.div`
  margin-top:.8rem;color:rgba(255,255,255,.36);font-size:.58rem;letter-spacing:2px;
`;
const UpgradeSummary = styled.div`
  position:absolute;left:1.4rem;bottom:1.25rem;z-index:10;display:flex;gap:.35rem;flex-wrap:wrap;
  max-width:min(430px,70vw);pointer-events:none;
  @media(max-width:767px){left:.8rem;bottom:6.8rem;max-width:65vw;}
`;
const UpgradeChip = styled.div`
  padding:.22rem .45rem;border:1px solid ${p => p.$color}55;border-radius:4px;
  background:rgba(4,4,14,.65);color:${p => p.$color};font-size:.5rem;letter-spacing:1px;
`;
const SectorFlash = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 60;
  background: ${p => p.$color};
  opacity: ${p => p.$opacity};
  transition: opacity 0.6s ease;
  mix-blend-mode: screen;
`;

const SectorVignette = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
  background: radial-gradient(ellipse at center,
    transparent 30%,
    ${p => p.$color}33 70%,
    ${p => p.$color}88 100%
  );
  transition: background 2s ease;
`;

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
    behavior: 'drift',
    unlockSector: 1,
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
    behavior: 'weave',
    unlockSector: 1,
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
    behavior: 'hunter',
    unlockSector: 2,
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
    behavior: 'zigzag',
    unlockSector: 2,
    label: 'CRYSTAL',
    labelColor: '#aabbff',
  },
  {
    id: 'splitter',
    sizeRange: [0.65, 0.9],
    damage: 18,
    hitsToDie: 2,
    pts: 35,
    speed: 0.9,
    matProps: () => ({ color: new THREE.Color('#48d6a8'), roughness: 0.2, metalness: 0.65 }),
    emissive: new THREE.Color('#0a6b52'),
    emissiveIntensity: 0.65,
    weight: 2,
    behavior: 'splitter',
    unlockSector: 2,
    label: 'SPLITTER',
    labelColor: '#48e0b0',
  },
];

const pickAsteroidType = (sector = 1) => {
  const availableTypes = ASTEROID_TYPES.filter(type => sector >= type.unlockSector);
  const total = availableTypes.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  for (const t of availableTypes) { r -= t.weight; if (r <= 0) return t; }
  return availableTypes[0];
};

const UFO_TYPES = {
  raider: { label: 'RAIDER', color: 0x00ffff, hex: '#48e0e0', behavior: 'strafe', damage: 22, pts: 100, cooldown: 1700 },
  hunter: { label: 'HUNTER', color: 0xff4f87, hex: '#ff6b9b', behavior: 'hunt', damage: 26, pts: 140, cooldown: 1450 },
  sentinel: { label: 'SENTINEL', color: 0xffc857, hex: '#ffd166', behavior: 'orbit', damage: 20, pts: 175, cooldown: 1250 },
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
  const [sectorFlash, setSectorFlash] = useState({ color: '#ffffff', opacity: 0 });
  const [sectorVignette, setSectorVignette] = useState('#0a0a1a');
  const [difficulty, setDifficulty] = useState('arcade');
  const [audioEnabled, setAudioEnabled] = useState(() => readAudioSettings().enabled);
  const [sfxVolume, setSfxVolume] = useState(() => readAudioSettings().sfxVolume);
  const [musicVolume, setMusicVolume] = useState(() => readAudioSettings().musicVolume);
  const [hint, setHint] = useState(null);
  const [upgrades, setUpgrades] = useState(emptyUpgrades);
  const [upgradeChoices, setUpgradeChoices] = useState(null);
  const [bossAttack, setBossAttack] = useState(null);
  const [hitMarker, setHitMarker] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(null);
  const [bestScore, setBestScore] = useState(() => readHighScore('arcade'));
  const [newHighScore, setNewHighScore] = useState(false);

  const finalScore = useRef(0);
  const highScore = useRef(readHighScore('arcade'));
  const popupId = useRef(0);
  const gameStartTime = useRef(0);
  const statsRef = useRef({ grazesTotal: 0, enemiesDestroyed: 0, maxCombo: 0, bossesKilled: 0 });
  const synthIntervalRef = useRef(null);
  const lastSectorScore = useRef(0);
  const audioEnabledRef = useRef(readAudioSettings().enabled);
  const audioSettingsRef = useRef(readAudioSettings());
  const pausedRef = useRef(false);
  const hintTimer = useRef(null);
  const shownHints = useRef(new Set());
  const upgradesRef = useRef(emptyUpgrades());
  const upgradeSelectionRef = useRef(null);
  const hitMarkerTimer = useRef(null);
  const tutorialRef = useRef({ active: false, step: null, startedAt: 0, heatSeen: false });

  const unlockAudio = useCallback(() => {
    if (!audioEnabledRef.current) return;
    if (!audioCtxRef.current) audioCtxRef.current = createAudio();
    if (audioCtxRef.current) {
      audioCtxRef.current.__sfxVolume = audioSettingsRef.current.sfxVolume;
      audioCtxRef.current.__musicVolume = audioSettingsRef.current.musicVolume;
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume().catch(() => { });
  }, []);
  const {
    inputRef: touchInputRef,
    stick: touchStick,
    updateJoystick,
    startJoystick,
    stopJoystick,
    startFire: startTouchFire,
    stopFire: stopTouchFire,
    reset: resetTouchControls,
  } = useTouchControls(unlockAudio);

  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
    audioSettingsRef.current = { enabled: audioEnabled, sfxVolume, musicVolume };
    if (audioCtxRef.current) {
      audioCtxRef.current.__sfxVolume = audioEnabled ? sfxVolume : 0;
      audioCtxRef.current.__musicVolume = audioEnabled ? musicVolume : 0;
    }
    try { localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(audioSettingsRef.current)); } catch { }
    if ((!audioEnabled || musicVolume === 0 || phase !== 'playing') && synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    } else if (audioEnabled && musicVolume > 0 && phase === 'playing' && audioCtxRef.current && !synthIntervalRef.current) {
      synthIntervalRef.current = startSynthwave(audioCtxRef.current);
    }
  }, [audioEnabled, sfxVolume, musicVolume, phase]);

  useEffect(() => {
    const modeBest = readHighScore(difficulty);
    highScore.current = modeBest;
    setBestScore(modeBest);
  }, [difficulty]);

  useEffect(() => () => {
    clearTimeout(hintTimer.current);
    clearTimeout(hitMarkerTimer.current);
    clearInterval(synthIntervalRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => { });
      audioCtxRef.current = null;
    }
  }, []);

  const showHint = useCallback((key, text, dur = 3400) => {
    if (tutorialRef.current.active) return;
    if (shownHints.current.has(key)) return;
    shownHints.current.add(key);
    clearTimeout(hintTimer.current);
    setHint(text);
    hintTimer.current = setTimeout(() => setHint(null), dur);
  }, []);

  const finishTutorial = useCallback((skipped = false) => {
    tutorialRef.current = { active: false, step: null, startedAt: 0, heatSeen: false };
    setTutorialStep(null);
    try { localStorage.setItem(TUTORIAL_KEY, 'true'); } catch { }
    if (!skipped) showHint('training-complete', 'Flight training complete. Clear 1,000 points to reach the next sector.', 4200);
  }, [showHint]);

  const advanceTutorial = useCallback((expectedStep) => {
    const tutorial = tutorialRef.current;
    if (!tutorial.active || tutorial.step !== expectedStep) return;
    const nextStep = expectedStep + 1;
    if (nextStep >= TUTORIAL_STEPS.length) {
      finishTutorial(false);
      return;
    }
    tutorialRef.current = { ...tutorial, step: nextStep, startedAt: performance.now(), heatSeen: false };
    setTutorialStep(nextStep);
  }, [finishTutorial]);

  const toggleAudio = () => {
    const next = !audioEnabled;
    audioEnabledRef.current = next;
    setAudioEnabled(next);
    if (next) unlockAudio();
  };

  const updateAudioLevel = (channel, value) => {
    const nextValue = Number(value);
    if (channel === 'sfx') setSfxVolume(nextValue);
    else setMusicVolume(nextValue);
    if (nextValue > 0 && !audioEnabledRef.current) {
      audioEnabledRef.current = true;
      setAudioEnabled(true);
      unlockAudio();
    }
  };

  const chooseUpgrade = upgrade => {
    if (upgrade.id === SALVAGE_UPGRADE.id) {
      upgradeSelectionRef.current = upgrade.id;
      setUpgradeChoices(null);
      return;
    }
    const next = {
      ...upgradesRef.current,
      [upgrade.id]: Math.min(upgrade.max, (upgradesRef.current[upgrade.id] || 0) + 1),
    };
    upgradesRef.current = next;
    upgradeSelectionRef.current = upgrade.id;
    setUpgrades(next);
    setUpgradeChoices(null);
  };

  const addPopup = (x, y, text, color, big = false) => {
    const id = popupId.current++;
    setPopups(ps => [...ps, { id, x, y, text, color, big }]);
    setTimeout(() => setPopups(ps => ps.filter(p => p.id !== id)), 950);
  };

  const togglePause = useCallback(() => setPaused(prev => {
    const next = !prev;
    pausedRef.current = next;
    return next;
  }), []);

  const startGame = (withWarp = false) => {
    unlockAudio();
    finalScore.current = 0;
    scoreRef.current = 0;
    gameStartTime.current = Date.now();
    statsRef.current = { grazesTotal: 0, enemiesDestroyed: 0, maxCombo: 0, bossesKilled: 0 };
    lastSectorScore.current = 0;
    shownHints.current = new Set();
    const tutorialEnabled = !hasCompletedTutorial();
    tutorialRef.current = { active: tutorialEnabled, step: tutorialEnabled ? 0 : null, startedAt: performance.now(), heatSeen: false };
    upgradesRef.current = emptyUpgrades();
    upgradeSelectionRef.current = null;
    setScore(0); setHp(MAX_HP); setActivePUps({}); setSector(1);
    setCombo(0); setPopups([]); setShaking(false); setGrazeMsg(null); setDamageMsg(null);
    pausedRef.current = false;
    setPaused(false); setSectorClearAnim(null); setHeat(0); setOverheated(false);
    setBossHP(null); setBossWarningVisible(false); setDangerZoneBonus(false);
    setHint(null); setUpgradeChoices(null); setUpgrades(upgradesRef.current);
    setBossAttack(null); setHitMarker(null); setTutorialStep(tutorialEnabled ? 0 : null);
    setNewHighScore(false);
    resetTouchControls();
    setGameStats({ grazesTotal: 0, enemiesDestroyed: 0, timeSurvived: 0, maxCombo: 0, bossesKilled: 0 });

    if (synthIntervalRef.current) { clearInterval(synthIntervalRef.current); synthIntervalRef.current = null; }
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

  const showHitMarker = useCallback((color = '#ffffff') => {
    const marker = { id: Date.now() + Math.random(), color };
    setHitMarker(marker);
    clearTimeout(hitMarkerTimer.current);
    hitMarkerTimer.current = setTimeout(() => setHitMarker(current => current?.id === marker.id ? null : current), 280);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing' && phase !== 'warp') return;
    const mount = mountRef.current;
    if (!mount) return;
    const difficultyCfg = DIFFICULTIES[difficulty];

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
    scene.fog = new THREE.FogExp2('#0a0a1a', 0.006);

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
      running: true, hpLeft: MAX_HP, sectorClearing: false, awaitingUpgrade: false,
      bullets: [], enemyBullets: [], asteroids: [], particles: [], powerups: [], ufos: [],
      keys: {}, mouse: { x: 0, y: -B.y + 2 }, touchActive: false,
      lastShot: 0, lastSpawn: 0, lastPowerUp: 0, lastUfoSpawn: 0,
      waveTimer: 0,
      spawnInterval: difficultyCfg.spawnBase, diffMult: difficultyCfg.speed,
      shield: difficultyCfg.startShield, shieldExpires: difficultyCfg.startShield ? Infinity : 0,
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
      localSector: sector,
      tutorialStart: { x: 0, y: -B.y + 2 },
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
      gs.bullets.push({
        mesh,
        vx: Math.sin(rad) * (isLaser ? 0.5 : 0.18),
        vy: isLaser ? 0.7 : 0.32,
        big: gs.bigbullet,
        pierce: isLaser,
        penetration: isLaser ? Infinity : upgradesRef.current.piercing,
        damage: (gs.bigbullet ? 2 : 1) * (1 + upgradesRef.current.damage * 0.35),
        hitTargets: new Set(),
        hitBoss: false,
        geo,
        mat,
      });
    };

    const shoot = () => {
      const now = performance.now();
      if (gs.overheated || now < gs.overheatLockEnd) return;
      if (phase === 'playing') advanceTutorial(1);

      SFX.shoot(audioCtxRef.current);
      const angles = [0];
      if (gs.spread) angles.push(-12, 12, -24, 24);
      else if (gs.rapid) angles.push(-15, 15);
      angles.forEach(ang => makeBullet(ang));

      // Heat build-up
      const baseHeat = gs.rapid ? 12 : gs.spread ? 15 : gs.laser ? 18 : 8;
      const heatIncrease = Math.max(3, baseHeat * difficultyCfg.heatMult * (1 - upgradesRef.current.cooling * 0.15));
      gs.heat = Math.min(100, gs.heat + heatIncrease);
      setHeat(gs.heat);

      if (gs.heat >= 100 && !gs.overheated) {
        gs.overheated = true;
        gs.overheatLockEnd = now + difficultyCfg.overheatLock;
        setOverheated(true);
        SFX.overheat(audioCtxRef.current);
        setTimeout(() => { gs.overheated = false; gs.heat = 0; setOverheated(false); setHeat(0); }, difficultyCfg.overheatLock);
      }
    };

    const makeEnemyBullet = (x, y, angleOffset = 0, options = {}) => {
      const geo = new THREE.SphereGeometry(0.18, 8, 8);
      const color = options.color || 0xcc22ff;
      const speed = (options.speed || 0.22) * difficultyCfg.projectileSpeed;
      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = trackMesh(new THREE.Mesh(geo, mat));
      const bLight = new THREE.PointLight(color, 2, 4);
      mesh.position.set(x, y, 0);
      const rad = THREE.MathUtils.degToRad(angleOffset);
      mesh.rotation.z = -rad;
      mesh.add(bLight);
      scene.add(mesh);
      gs.enemyBullets.push({
        mesh,
        vx: Math.sin(rad) * speed,
        vy: -Math.cos(rad) * speed,
        damage: options.damage || 18,
        hitColor: options.hitColor || '#cc44ff',
        geo,
        mat,
      });
    };

    // ── Asteroid ──────────────────────────────────────────────────────────
    const makeAsteroid = (forcedType = null, options = {}) => {
      const type = forcedType || pickAsteroidType(gs.localSector);
      const [minS, maxS] = type.sizeRange;
      const size = (minS + Math.random() * (maxS - minS)) * (options.scale || 1);

      let geo;
      if (type.id === 'crystal') geo = new THREE.OctahedronGeometry(size, 1);
      else if (type.id === 'splitter') geo = new THREE.DodecahedronGeometry(size, 0);
      else if (type.id === 'large') geo = new THREE.IcosahedronGeometry(size, 0);
      else geo = new THREE.IcosahedronGeometry(size, Math.random() > .5 ? 1 : 0);

      const mat = new THREE.MeshStandardMaterial({
        ...type.matProps(size),
        emissive: type.emissive || new THREE.Color('#000000'),
        emissiveIntensity: type.emissiveIntensity || 0,
      });
      const mesh = trackMesh(new THREE.Mesh(geo, mat));
      if (options.position) mesh.position.copy(options.position);
      else mesh.position.set((Math.random() - .5) * B.x * 1.8, B.y + size + .5, (Math.random() - .5) * 1.5);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      if (type.emissive) mesh.add(new THREE.PointLight(type.emissive, 1.5, 4));
      scene.add(mesh);
      const asteroid = {
        mesh, size, type,
        pts: type.pts,
        damage: type.damage,
        hitsLeft: type.hitsToDie,
        id: Math.random().toString(36).slice(2),
        vy: -(0.018 + Math.random() * 0.010) * gs.diffMult * type.speed,
        vx: options.vx || 0,
        rx: (Math.random() - .5) * .016,
        ry: (Math.random() - .5) * .016,
        age: 0,
        originX: mesh.position.x,
        behaviorPhase: Math.random() * Math.PI * 2,
        vortexing: false,
        vortexDelay: 0,
        flashFrames: 0,
        geo, mat,
      };
      gs.asteroids.push(asteroid);
      return asteroid;
    };

    const makePowerUp = () => {
      showHint('powerup', 'Power-ups change your weapon for a few seconds. Grab them when the screen gets crowded.');
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
      const availableTypes = ['raider'];
      if (gs.localSector >= 2) availableTypes.push('hunter');
      if (gs.localSector >= 3) availableTypes.push('sentinel');
      const typeId = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const cfg = UFO_TYPES[typeId];
      const g = new THREE.Group();
      const geo1 = new THREE.SphereGeometry(0.7, 16, 8); geo1.scale(1, 0.25, 1);
      const mat1 = new THREE.MeshStandardMaterial({ color: 0x777777, emissive: cfg.color, emissiveIntensity: 0.18, metalness: 0.9, roughness: 0.1 });
      const mesh1 = trackMesh(new THREE.Mesh(geo1, mat1));
      const geo2 = new THREE.SphereGeometry(0.4, 16, 8); geo2.scale(1, 0.7, 1);
      const mat2 = new THREE.MeshBasicMaterial({ color: cfg.color });
      const mesh2 = trackMesh(new THREE.Mesh(geo2, mat2));
      mesh2.position.y = 0.2;
      const uLight = new THREE.PointLight(cfg.color, 3, 5);
      g.add(mesh1); g.add(mesh2); g.add(uLight);
      const fromLeft = Math.random() > 0.5;
      if (cfg.behavior === 'strafe') {
        g.position.set(fromLeft ? -B.x - 2 : B.x + 2, B.y - 1 - Math.random() * (B.y - 1), 0);
      } else {
        g.position.set((Math.random() - 0.5) * B.x * 1.4, B.y + 2, 0);
      }
      scene.add(g);
      gs.ufos.push({
        mesh: g,
        typeId,
        cfg,
        vx: (fromLeft ? 1 : -1) * (0.05 + Math.random() * 0.04),
        vy: -0.035,
        pts: cfg.pts,
        damage: cfg.damage,
        spawnedAt: performance.now(),
        lastShot: performance.now() + Math.random() * 500,
        orbitAngle: Math.random() * Math.PI * 2,
        lastShipX: shipGroup.position.x,
        lastShipY: shipGroup.position.y,
      });
      const sp = worldToScreen(g.position.x, g.position.y);
      addPopup(sp.x, Math.max(70, sp.y), cfg.label, cfg.hex, true);
    };

    // ── BOSS ──────────────────────────────────────────────────────────────
    const spawnBoss = () => {
      if (gs.boss) return;
      showHint('boss', 'Bosses arrive every third sector. Keep moving after each shot pattern.');
      const bossHP_val = Math.round((30 + gs.localSector * 10) * (0.9 + difficultyCfg.damage * 0.1));
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
      const telegraphGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const telegraphMat = new THREE.LineBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0 });
      const telegraphLine = trackMesh(new THREE.Line(telegraphGeo, telegraphMat));
      scene.add(telegraphLine);
      gs.boss = {
        mesh: g,
        entering: true,
        enterProgress: 0,
        attackClock: 0,
        orbitAngle: 0,
        core,
        ring,
        telegraphLine,
        telegraphGeo,
        telegraphMat,
        charging: false,
        lockTarget: new THREE.Vector3(),
        phase: 1,
      };
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
    const onKeyDown = e => { gs.keys[e.code] = true; unlockAudio(); if (e.code === 'Escape' && !e.repeat) togglePause(); };
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
      gs.touchActive = true;
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
      const armorReduction = 1 - upgradesRef.current.armor * 0.12;
      const scaledDamage = Math.max(1, Math.round(dmg * difficultyCfg.damage * armorReduction));
      localHP = Math.max(0, localHP - scaledDamage);
      gs.hpLeft = localHP;
      setHp(localHP);
      showDamage(scaledDamage, color);
      if (localHP <= 0 && wasHP > 0) {
        gs.running = false;
        finalScore.current = localScore;
        const earnedNewHighScore = localScore > highScore.current;
        setNewHighScore(earnedNewHighScore);
        if (earnedNewHighScore) {
          highScore.current = localScore;
          setBestScore(localScore);
          try { localStorage.setItem(highScoreKey(difficulty), String(localScore)); } catch { }
        }
        clearInterval(synthIntervalRef.current);
        const timeSurvived = Math.floor((Date.now() - gameStartTime.current) / 1000);
        setGameStats({ ...statsRef.current, timeSurvived });
        setSectorClearAnim(null); setBossHP(null); setBossAttack(null);
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
      if (pausedRef.current) { renderer.render(scene, cam); return; }
      if (gs.awaitingUpgrade) {
        const selectedUpgradeId = upgradeSelectionRef.current;
        if (!selectedUpgradeId) { renderer.render(scene, cam); return; }
        upgradeSelectionRef.current = null;
        gs.awaitingUpgrade = false;
        gs.lastSpawn = t;
        if (upgradesRef.current.aegis > 0) {
          gs.shield = true;
          gs.shieldExpires = Infinity;
        }
        if (selectedUpgradeId === SALVAGE_UPGRADE.id) {
          localHP = Math.min(MAX_HP, localHP + 25);
          gs.hpLeft = localHP;
          setHp(localHP);
        }
        const selectedUpgrade = SECTOR_UPGRADES.find(upgrade => upgrade.id === selectedUpgradeId) || SALVAGE_UPGRADE;
        if (selectedUpgrade) {
          SFX.powerup(audioCtxRef.current);
          const sp = worldToScreen(shipGroup.position.x, shipGroup.position.y);
          const selectedLabel = selectedUpgradeId === SALVAGE_UPGRADE.id
            ? `${selectedUpgrade.label} +25 HP`
            : `${selectedUpgrade.label} LV.${upgradesRef.current[selectedUpgradeId]}`;
          addPopup(sp.x, sp.y - 30, selectedLabel, selectedUpgrade.color, true);
        }
      }

      // ── Heat cool-down ─────────────────────────────────────────────────
      if (!gs.overheated && uiTick.current % 3 === 0) {
        gs.heat = Math.max(0, gs.heat - (1 + upgradesRef.current.cooling * 0.35));
        if (uiTick.current % 12 === 0) setHeat(gs.heat);
      }

      // ── Ship movement ─────────────────────────────────────────────────
      const spd = .13;
      const usingKeyboard =
        gs.keys['ArrowLeft'] || gs.keys['ArrowRight'] ||
        gs.keys['ArrowUp'] || gs.keys['ArrowDown'] ||
        gs.keys['KeyA'] || gs.keys['KeyD'] ||
        gs.keys['KeyW'] || gs.keys['KeyS'];
      const touchControl = touchInputRef.current;
      const usingJoystick = touchControl.active && Math.hypot(touchControl.x, touchControl.y) > 0.06;

      if (!gs.sectorClearing) {
        if (usingJoystick) {
          shipGroup.position.x = THREE.MathUtils.clamp(shipGroup.position.x + touchControl.x * spd, -B.x + .5, B.x - .5);
          shipGroup.position.y = THREE.MathUtils.clamp(shipGroup.position.y - touchControl.y * spd * .8, -B.y + .5, B.y - .5);
          gs.mouse.x = shipGroup.position.x;
          gs.mouse.y = shipGroup.position.y;
        } else {
          if (gs.keys['ArrowLeft'] || gs.keys['KeyA']) shipGroup.position.x = Math.max(-B.x + .5, shipGroup.position.x - spd);
          if (gs.keys['ArrowRight'] || gs.keys['KeyD']) shipGroup.position.x = Math.min(B.x - .5, shipGroup.position.x + spd);
          if (gs.keys['ArrowUp'] || gs.keys['KeyW']) shipGroup.position.y = Math.min(B.y - .5, shipGroup.position.y + spd * .8);
          if (gs.keys['ArrowDown'] || gs.keys['KeyS']) shipGroup.position.y = Math.max(-B.y + .5, shipGroup.position.y - spd * .8);
        }
        if (!usingKeyboard && !usingJoystick) {
          shipGroup.position.x += (gs.mouse.x - shipGroup.position.x) * .09;
          shipGroup.position.y += (gs.mouse.y - shipGroup.position.y) * .06;
          shipGroup.position.x = THREE.MathUtils.clamp(shipGroup.position.x, -B.x + .5, B.x - .5);
          shipGroup.position.y = THREE.MathUtils.clamp(shipGroup.position.y, -B.y + .5, B.y - .5);
        }
      }

      const tutorial = tutorialRef.current;
      if (tutorial.active && tutorial.step === 0) {
        const moved = Math.hypot(
          shipGroup.position.x - gs.tutorialStart.x,
          shipGroup.position.y - gs.tutorialStart.y,
        );
        if (moved > 0.7 || now - tutorial.startedAt > 7000) advanceTutorial(0);
      } else if (tutorial.active && tutorial.step === 2) {
        if (gs.heat >= 30) tutorialRef.current.heatSeen = true;
        if ((tutorialRef.current.heatSeen && gs.heat <= 15) || now - tutorial.startedAt > 12000) advanceTutorial(2);
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
      if (tutorialRef.current.active && tutorialRef.current.step === 3) {
        const riskStepElapsed = now - tutorialRef.current.startedAt;
        if (inDangerZone || riskStepElapsed > 9000) advanceTutorial(3);
      }
      if (inDangerZone) {
        gs.dangerZoneFrames++;
        if (gs.dangerZoneFrames % 120 === 0) {
          showHint('danger', 'The center danger zone pays bonus points, but it leaves less room to dodge.');
          const bonusPts = Math.round((5 + gs.localSector * 2) * difficultyCfg.scoreMult);
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
          else { pActive[type] = gs[`${type}Expires`] === Infinity ? 'READY' : Math.ceil((gs[`${type}Expires`] - now) / 1000); }
        }
      }
      shieldMesh.material.opacity = gs.shield ? .65 : 0;
      shieldLight.intensity = gs.shield ? 2 : 0;
      if (gs.shield) shieldMesh.rotation.z += .03;
      if (uiTick.current % 6 === 0) setActivePUps({ ...pActive });

      // Auto-fire while space held
      const cooldown = Math.max(65, (gs.rapid ? 80 : 190) * (1 - upgradesRef.current.fireRate * 0.12));
      if (!gs.sectorClearing && (gs.keys['Space'] || gs.keys['Enter'] || touchInputRef.current.firing) && t - gs.lastShot > cooldown) {
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
      gs.diffMult = (1 + scaledScore * 0.16) * waveMod * difficultyCfg.speed;
      const chaos = 0.85 + Math.random() * 0.3;
      gs.spawnInterval = Math.max(520, ((difficultyCfg.spawnBase - scaledScore * 80) / waveMod) * chaos);

      // ── Boss spawn every 3 sectors ─────────────────────────────────────
      if (!gs.sectorClearing && !gs.boss && gs.localSector > 1 && gs.localSector % 3 === 0 && !gs.bossSpawned) {
        spawnBoss();
      }

      // ── Sector Progression ────────────────────────────────────────────
      if (!gs.sectorClearing && !gs.boss && localScore >= lastSectorScore.current + 1000) {
        lastSectorScore.current = localScore;
        gs.sectorClearing = true;
        gs.vortexTime = 0;
        gs.asteroids.forEach(a => { a.vortexing = true; a.vortexDelay = Math.random() * 30; });
        SFX.sectorClear(audioCtxRef.current);
        triggerFlash();
        const newSector = gs.localSector + 1;
        setSectorClearAnim({ sector: newSector, phase: 'in' });

        sectorClearTimer.current = setTimeout(() => {
          gs.asteroids.forEach((a, idx) => {
            setTimeout(() => { if (a.mesh) { explode(a.mesh.position, 0xff8800, 8); removeMesh(a.mesh); } }, idx * 40);
          });
          gs.asteroids = [];
          gs.ufos.forEach(u => { explode(u.mesh.position, u.cfg.color, 12); removeMesh(u.mesh); });
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
          const newSector = gs.localSector + 1;
          gs.localSector = newSector;
          gs.bossSpawned = false;
          setSector(newSector);
          triggerShake();
          triggerFlash();
          localHP = Math.min(MAX_HP, localHP + difficultyCfg.sectorRepair);
          gs.hpLeft = localHP;
          setHp(localHP);
          const sp = worldToScreen(0, 0);
          addPopup(sp.x, sp.y, `HULL REPAIRED +${difficultyCfg.sectorRepair} HP`, '#48e080', true);
          setSectorClearAnim(prev => prev ? { ...prev, phase: 'out' } : null);
          setTimeout(() => setSectorClearAnim(null), 600);
          gs.awaitingUpgrade = true;
          upgradeSelectionRef.current = null;
          setUpgradeChoices(drawUpgradeChoices(upgradesRef.current));
          const palette = SECTOR_PALETTES[(newSector - 1) % SECTOR_PALETTES.length];
          setSectorFlash({ color: palette.accent, opacity: 0.7 });
          setTimeout(() => setSectorFlash({ color: palette.accent, opacity: 0 }), 400);
          setSectorVignette(palette.accent);
          starField.material.color.setHex(palette.star);
          ambientLight.color.setHex(palette.ambient);
          ambientLight.intensity = 0.2; // dim during warp
          setTimeout(() => { ambientLight.intensity = 1.2; }, 1800);

          // Add scene fog
          scene.fog = new THREE.FogExp2(palette.fog, 0.012);
          setTimeout(() => { scene.fog = new THREE.FogExp2(palette.fog, 0.006); }, 1800);
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
          const hpRatio = gs.bossHPLeft / gs.bossMaxHP;
          const nextPhase = hpRatio > 0.66 ? 1 : hpRatio > 0.33 ? 2 : 3;
          if (nextPhase !== boss.phase) {
            boss.phase = nextPhase;
            triggerShake();
            const sp = worldToScreen(boss.mesh.position.x, boss.mesh.position.y);
            addPopup(sp.x, sp.y, `BOSS PHASE ${nextPhase}`, '#ff7a66', true);
          }

          boss.attackClock++;
          const shootRate = Math.max(72, 116 - gs.localSector * 4);
          const warningFrames = 42;
          if (!boss.charging && boss.attackClock >= shootRate - warningFrames) {
            boss.charging = true;
            boss.lockTarget.copy(shipGroup.position);
            showHint('boss-telegraph', 'The gold targeting line locks before each boss volley. Break away after it fixes on you.');
          }

          if (boss.charging) {
            const chargeProgress = Math.min(1, (boss.attackClock - (shootRate - warningFrames)) / warningFrames);
            const positions = boss.telegraphGeo.attributes.position.array;
            positions[0] = boss.mesh.position.x; positions[1] = boss.mesh.position.y - 0.5; positions[2] = 0;
            positions[3] = boss.lockTarget.x; positions[4] = boss.lockTarget.y; positions[5] = 0;
            boss.telegraphGeo.attributes.position.needsUpdate = true;
            boss.telegraphMat.opacity = 0.2 + chargeProgress * 0.75;
            boss.core.material.emissiveIntensity = 0.7 + chargeProgress * 1.8;
            boss.ring.scale.setScalar(1 + Math.sin(boss.attackClock * 0.45) * 0.08);
            if (uiTick.current % 6 === 0) setBossAttack({ phase: boss.phase, progress: Math.round(chargeProgress * 100) });
          }

          if (boss.attackClock >= shootRate) {
            const dx = boss.lockTarget.x - boss.mesh.position.x;
            const dy = boss.lockTarget.y - boss.mesh.position.y;
            const deg = THREE.MathUtils.radToDeg(Math.atan2(dx, -dy));
            let pattern = boss.phase === 1 ? [0] : boss.phase === 2 ? [-16, 0, 16] : [-28, -14, 0, 14, 28];
            if (difficulty === 'insane') {
              pattern = boss.phase === 1 ? [-8, 8] : boss.phase === 2 ? [-24, -12, 0, 12, 24] : [-36, -24, -12, 0, 12, 24, 36];
            }
            pattern.forEach(offset => makeEnemyBullet(boss.mesh.position.x, boss.mesh.position.y - 0.5, deg + offset));
            boss.attackClock = 0;
            boss.charging = false;
            boss.telegraphMat.opacity = 0;
            boss.core.material.emissiveIntensity = 0.5;
            boss.ring.scale.setScalar(1);
            setBossAttack(null);
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
        pDropChance *= difficultyCfg.powerupInterval;
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
        if (gs.boss && !gs.boss.entering && !b.hitBoss) {
          const dist = dist2D(b.mesh.position, gs.boss.mesh.position);
          if (dist < 2.2) {
            SFX.bossHit(audioCtxRef.current);
            explode(b.mesh.position, 0xff2200, 6);
            showHitMarker('#ff7a66');
            b.hitBoss = true;
            if (!b.pierce && b.penetration <= 0) { removeMesh(b.mesh); hit = true; }
            else if (!b.pierce) b.penetration--;
            gs.bossHPLeft = Math.max(0, gs.bossHPLeft - b.damage);
            setBossHP(gs.bossHPLeft);
            gs.boss.core.material.emissiveIntensity = 1.5;
            setTimeout(() => { if (gs.boss) gs.boss.core.material.emissiveIntensity = 0.5; }, 100);

            if (gs.bossHPLeft <= 0) {
              // Boss dead!
              SFX.bigExplode(audioCtxRef.current);
              for (let e = 0; e < 5; e++) setTimeout(() => explode(gs.boss.mesh.position, 0xff4400, 20), e * 150);
              removeMesh(gs.boss.telegraphLine);
              removeMesh(gs.boss.mesh);
              gs.boss = null; gs.bossSpawned = true;
              setBossHP(null); setBossAttack(null);
              const earned = Math.round(500 * gs.localSector * difficultyCfg.scoreMult);
              localScore += earned; setScore(localScore); scoreRef.current = localScore;
              statsRef.current.bossesKilled++;
              triggerShake(2); triggerFlash();
              const sp = worldToScreen(0, 0);
              addPopup(sp.x, sp.y, `BOSS DESTROYED! +${earned}`, '#ff8800', true);
              // Spawn repair kit
              makePowerUp();
            }
            if (hit) gs.bullets.splice(i, 1);
            continue;
          }
        }

        for (let j = gs.asteroids.length - 1; j >= 0; j--) {
          const a = gs.asteroids[j];
          const hr = b.big ? a.size + .3 : a.size + .14;
          if (!b.hitTargets.has(a.id) && dist2D(b.mesh.position, a.mesh.position) < hr) {
            b.hitTargets.add(a.id);
            a.hitsLeft -= b.damage;
            a.flashFrames = 6;
            showHitMarker(a.type.labelColor);
            // Flash hit asteroid red
            a.mat.emissive = new THREE.Color('#ffffff');
            a.mat.emissiveIntensity = 1;
            setTimeout(() => {
              if (a.mat) {
                a.mat.emissive = a.type.emissive || new THREE.Color('#000000');
                a.mat.emissiveIntensity = a.type.emissiveIntensity || 0;
              }
            }, 80);

            if (!b.pierce && b.penetration <= 0) { removeMesh(b.mesh); hit = true; }
            else if (!b.pierce) b.penetration--;

            if (a.hitsLeft <= 0) {
              SFX.explode(audioCtxRef.current);
              const destroyedAt = a.mesh.position.clone();
              const explosionColor = a.type.id === 'crystal' ? 0x6688ff : a.type.id === 'splitter' ? 0x48d6a8 : 0xff5500;
              explode(a.mesh.position, explosionColor, a.type.id === 'large' ? 24 : 14);
              if (a.type.id === 'large') triggerShake();
              removeMesh(a.mesh);
              gs.asteroids.splice(j, 1);
              gs.grazedIds.delete(a.id);

              if (a.type.id === 'splitter') {
                [-1, 1].forEach(direction => {
                  const fragmentPosition = destroyedAt.clone();
                  fragmentPosition.x += direction * 0.28;
                  makeAsteroid(ASTEROID_TYPES[0], { position: fragmentPosition, scale: 0.8, vx: direction * 0.04 });
                });
                const splitAt = worldToScreen(destroyedAt.x, destroyedAt.y);
                addPopup(splitAt.x, splitAt.y - 16, 'SPLIT ×2', '#48e0b0', true);
              }

              const timeSinceLast = now - gs.lastHitTime;
              if (timeSinceLast < 1500) gs.comboCount = Math.min(gs.comboCount + 1, 8);
              else gs.comboCount = 1;
              gs.lastHitTime = now;
              const multiplier = gs.comboCount >= 3 ? gs.comboCount : 1;
              // Danger zone scoring bonus
              const dzMult = inDangerZone ? 1.5 : 1;
              const earned = Math.floor(a.pts * multiplier * dzMult * difficultyCfg.scoreMult);
              localScore += earned; setScore(localScore); scoreRef.current = localScore;
              if (gs.comboCount >= 3) setCombo(gs.comboCount); else setCombo(0);
              statsRef.current.enemiesDestroyed++;
              if (gs.comboCount > statsRef.current.maxCombo) statsRef.current.maxCombo = gs.comboCount;

              const sp = worldToScreen(a.mesh.position.x, a.mesh.position.y);
              const popColor = a.type.labelColor;
              const label = (multiplier > 1 || dzMult > 1)
                ? `+${earned}${multiplier > 1 ? ` ×${multiplier}` : ''}${dzMult > 1 ? ' DANGER' : ''}`
                : `+${earned}`;
              addPopup(sp.x, sp.y, label, popColor, multiplier > 1);
            } else {
              // Hit but not dead yet — show remaining hits
              SFX.explode(audioCtxRef.current);
              explode(b.mesh.position, 0xffffff, 4);
              const sp = worldToScreen(a.mesh.position.x, a.mesh.position.y);
              const hitsRemaining = Math.ceil(a.hitsLeft);
              addPopup(sp.x, sp.y, `${hitsRemaining} HIT${hitsRemaining > 1 ? 'S' : ''} LEFT`, a.type.labelColor);
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
              explode(u.mesh.position, u.cfg.color, 25);
              showHitMarker(u.cfg.hex);
              removeMesh(u.mesh);
              if (!b.pierce && b.penetration <= 0) { removeMesh(b.mesh); hit = true; }
              else if (!b.pierce) b.penetration--;
              gs.ufos.splice(k, 1);
              const multiplier = gs.comboCount >= 3 ? gs.comboCount : 1;
              const earned = Math.round(u.pts * multiplier * difficultyCfg.scoreMult);
              localScore += earned; setScore(localScore); scoreRef.current = localScore;
              statsRef.current.enemiesDestroyed++;
              if (gs.comboCount > statsRef.current.maxCombo) statsRef.current.maxCombo = gs.comboCount;
              const sp = worldToScreen(u.mesh.position.x, u.mesh.position.y);
              addPopup(sp.x, sp.y, `+${earned} ${u.cfg.label}!`, u.cfg.hex, true);
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
            takeDamage(b.damage, b.hitColor);
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
          a.age++;
          a.mesh.position.y += a.vy;
          if (a.type.behavior === 'drift') {
            a.mesh.position.x += a.vx;
          } else if (a.type.behavior === 'weave') {
            a.mesh.position.x = THREE.MathUtils.clamp(a.originX + Math.sin(a.age * 0.045 + a.behaviorPhase) * 1.15, -B.x + a.size, B.x - a.size);
          } else if (a.type.behavior === 'hunter') {
            const steering = THREE.MathUtils.clamp((shipGroup.position.x - a.mesh.position.x) * 0.006, -0.018, 0.018);
            a.mesh.position.x = THREE.MathUtils.clamp(a.mesh.position.x + steering, -B.x + a.size, B.x - a.size);
          } else if (a.type.behavior === 'zigzag') {
            if (a.vx === 0) a.vx = Math.sin(a.behaviorPhase) >= 0 ? 0.045 : -0.045;
            a.mesh.position.x += a.vx;
            if (Math.abs(a.mesh.position.x) > B.x - a.size) a.vx *= -1;
          } else if (a.type.behavior === 'splitter') {
            a.mesh.position.x = THREE.MathUtils.clamp(a.originX + Math.sin(a.age * 0.07 + a.behaviorPhase) * 0.65, -B.x + a.size, B.x - a.size);
          }
          a.mesh.rotation.x += a.rx;
          a.mesh.rotation.y += a.ry;
        }
        const distToShip = dist2D(a.mesh.position, shipGroup.position);
        const hitRadius = a.size + .5;
        const grazeRadius = a.size + 1.3;

        if (distToShip > hitRadius && distToShip < grazeRadius && !gs.grazedIds.has(a.id)) {
          gs.grazedIds.add(a.id);
          const grazePts = Math.max(1, Math.round(5 * difficultyCfg.scoreMult));
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
        const shipVx = shipGroup.position.x - u.lastShipX;
        const shipVy = shipGroup.position.y - u.lastShipY;

        if (u.cfg.behavior === 'strafe') {
          u.mesh.position.x += u.vx;
        } else if (u.cfg.behavior === 'hunt') {
          u.mesh.position.x += THREE.MathUtils.clamp((shipGroup.position.x - u.mesh.position.x) * 0.012, -0.055, 0.055);
          u.mesh.position.y += THREE.MathUtils.clamp((shipGroup.position.y + 2.4 - u.mesh.position.y) * 0.012, -0.045, 0.015);
        } else {
          u.orbitAngle += 0.018;
          const orbitX = THREE.MathUtils.clamp(shipGroup.position.x + Math.cos(u.orbitAngle) * 3.2, -B.x + 1, B.x - 1);
          const orbitY = THREE.MathUtils.clamp(shipGroup.position.y + 3.2 + Math.sin(u.orbitAngle) * 1.5, -B.y + 2, B.y - 1);
          u.mesh.position.x += (orbitX - u.mesh.position.x) * 0.035;
          u.mesh.position.y += (orbitY - u.mesh.position.y) * 0.035;
        }
        u.mesh.rotation.y += 0.05;
        if (!gs.sectorClearing && now - u.lastShot >= u.cfg.cooldown) {
          const predictionFrames = u.cfg.behavior === 'hunt' ? 18 : u.cfg.behavior === 'orbit' ? 9 : 0;
          const targetX = THREE.MathUtils.clamp(shipGroup.position.x + shipVx * predictionFrames, -B.x, B.x);
          const targetY = THREE.MathUtils.clamp(shipGroup.position.y + shipVy * predictionFrames, -B.y, B.y);
          const dx = targetX - u.mesh.position.x;
          const dy = targetY - u.mesh.position.y;
          const deg = THREE.MathUtils.radToDeg(Math.atan2(dx, -dy));
          const offsets = u.cfg.behavior === 'orbit' ? [-12, 0, 12] : [0];
          offsets.forEach(offset => makeEnemyBullet(u.mesh.position.x, u.mesh.position.y - 0.5, deg + offset, {
            color: u.cfg.color,
            speed: u.cfg.behavior === 'hunt' ? 0.25 : 0.21,
            damage: Math.round(u.damage * 0.65),
            hitColor: u.cfg.hex,
          }));
          u.lastShot = now;
        }
        u.lastShipX = shipGroup.position.x;
        u.lastShipY = shipGroup.position.y;
        if (!gs.sectorClearing && dist2D(u.mesh.position, shipGroup.position) < 1.4) {
          if (gs.shield) {
            SFX.explode(audioCtxRef.current);
            explode(u.mesh.position, u.cfg.color, 15);
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
          takeDamage(u.damage, u.cfg.hex);
          continue;
        }
        const strafeComplete = u.cfg.behavior === 'strafe' && ((u.vx > 0 && u.mesh.position.x > B.x + 2) || (u.vx < 0 && u.mesh.position.x < -B.x - 2));
        const expired = now - u.spawnedAt > 18000;
        if (strafeComplete || expired || u.mesh.position.y < -B.y - 2) {
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
              localScore += Math.round(a.pts * (gs.comboCount || 1) * difficultyCfg.scoreMult);
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
    };
  }, [phase, triggerShake, showGraze, showDamage, showHitMarker, unlockAudio, togglePause, triggerFlash, difficulty, showHint, advanceTutorial]);

  const hpPct = (hp / MAX_HP) * 100;
  const heatPct = heat;

  return (
    <Wrapper $shake={shaking}>
      {flash && <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 100, opacity: 0.4, pointerEvents: 'none' }} />}

      <BackBtn to="/"><ArrowLeft size={14} aria-hidden="true" /> PORTFOLIO</BackBtn>
      {phase === 'playing' && (
        <GameControls>
          <IconControl onClick={togglePause} title="Pause">II</IconControl>
          <IconControl onClick={toggleAudio} title={audioEnabled ? 'Mute audio' : 'Enable audio'}>
            {audioEnabled ? 'ON' : 'OFF'}
          </IconControl>
        </GameControls>
      )}
      {phase === 'playing' && !paused && !upgradeChoices && (
        <TouchControls aria-label="Touch controls">
          <JoystickPad
            role="application"
            aria-label="Movement joystick"
            onPointerDown={startJoystick}
            onPointerMove={updateJoystick}
            onPointerUp={stopJoystick}
            onPointerCancel={stopJoystick}
          >
            <JoystickKnob $x={touchStick.x} $y={touchStick.y} />
          </JoystickPad>
          <TouchFire
            type="button"
            aria-label="Fire"
            title="Fire"
            onPointerDown={startTouchFire}
            onPointerUp={stopTouchFire}
            onPointerCancel={stopTouchFire}
          >
            <Crosshair size={28} strokeWidth={1.8} />
          </TouchFire>
        </TouchControls>
      )}
      <CanvasMount ref={mountRef} />

      <SectorVignette $color={sectorVignette} />
      <SectorFlash $color={sectorFlash.color} $opacity={sectorFlash.opacity} />

      {/* Danger zone overlay — shown during gameplay */}
      {phase === 'playing' && <DangerZone />}

      <PopupLayer>
        {popups.map(p => (
          <Popup key={p.id} style={{ left: p.x, top: p.y }} $color={p.color} $big={p.big}>{p.text}</Popup>
        ))}
      </PopupLayer>

      {grazeMsg && <GrazePopup key={grazeMsg.id}>GRAZE +{grazeMsg.pts}</GrazePopup>}
      {damageMsg && <DamagePopup key={damageMsg.id} $color={damageMsg.color}>-{damageMsg.dmg} HP</DamagePopup>}
      {hitMarker && <HitMarker key={hitMarker.id} $color={hitMarker.color} />}
      {hint && phase === 'playing' && <HintBanner>{hint}</HintBanner>}
      {tutorialStep !== null && phase === 'playing' && (
        <TutorialCoach key={tutorialStep} role="status" aria-live="polite">
          <TutorialTop>
            <TutorialTitle>{TUTORIAL_STEPS[tutorialStep].title}</TutorialTitle>
            <TutorialProgress>{tutorialStep + 1} / {TUTORIAL_STEPS.length}</TutorialProgress>
          </TutorialTop>
          <TutorialText>{TUTORIAL_STEPS[tutorialStep].text}</TutorialText>
          <TutorialSkip type="button" onClick={() => finishTutorial(true)}>SKIP TRAINING</TutorialSkip>
        </TutorialCoach>
      )}

      {/* Boss warning */}
      {bossWarningVisible && (
        <BossWarningBanner>
          <TriangleAlert size="1em" aria-hidden="true" />
          BOSS INCOMING
          <TriangleAlert size="1em" aria-hidden="true" />
        </BossWarningBanner>
      )}
      {bossAttack && <BossAttackBanner>PHASE {bossAttack.phase} · TARGET LOCK {bossAttack.progress}%</BossAttackBanner>}

      {upgradeChoices && (
        <UpgradeOverlay>
          <UpgradeEyebrow>SECTOR {sector - 1} CLEARED</UpgradeEyebrow>
          <UpgradeTitle>CHOOSE ONE UPGRADE</UpgradeTitle>
          <UpgradeGrid>
            {upgradeChoices.map(upgrade => (
              <UpgradeCard key={upgrade.id} type="button" $color={upgrade.color} onClick={() => chooseUpgrade(upgrade)}>
                <UpgradeCardLabel $color={upgrade.color}>{upgrade.label}</UpgradeCardLabel>
                <UpgradeCardText>{upgrade.description}</UpgradeCardText>
                <UpgradeLevel>
                  {upgrade.id === SALVAGE_UPGRADE.id
                    ? 'RESTORE 25 HULL'
                    : `LEVEL ${upgrades[upgrade.id] || 0} → ${Math.min(upgrade.max, (upgrades[upgrade.id] || 0) + 1)} / ${upgrade.max}`}
                </UpgradeLevel>
              </UpgradeCard>
            ))}
          </UpgradeGrid>
          <Sub>THE RUN RESUMES WHEN YOU CHOOSE</Sub>
        </UpgradeOverlay>
      )}

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
          <SectorClearScore $exit={sectorClearAnim.phase === 'out'}>+{DIFFICULTIES[difficulty].sectorRepair} HP · WARP DRIVE CHARGED</SectorClearScore>
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
                <div style={{ fontSize: '.6rem', color: '#ffe082', letterSpacing: '2px', animation: 'none', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                  <Flame size={12} aria-hidden="true" /> DANGER ZONE
                </div>
              )}
              <HudLabel style={{ textAlign: 'center', letterSpacing: '1px', marginTop: '.1rem' }}>
                {DIFFICULTIES[difficulty].label} · SEC {sector} · LVL {Math.max(1, Math.floor(score / 300) + 1)}
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
              <BossLabel>
                <Star size={13} fill="currentColor" aria-hidden="true" />
                SECTOR BOSS · PHASE {bossAttack?.phase || (bossHP / bossMaxHP > .66 ? 1 : bossHP / bossMaxHP > .33 ? 2 : 3)}
                <Star size={13} fill="currentColor" aria-hidden="true" />
              </BossLabel>
              <BossBarTrack>
                <BossBarFill $pct={(bossHP / bossMaxHP) * 100} />
              </BossBarTrack>
              <HudLabel style={{ fontSize: '.5rem' }}>{Math.ceil(bossHP)} / {bossMaxHP}</HudLabel>
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

          {Object.values(upgrades).some(Boolean) && (
            <UpgradeSummary aria-label="Run upgrades">
              {SECTOR_UPGRADES.filter(upgrade => upgrades[upgrade.id] > 0).map(upgrade => (
                <UpgradeChip key={upgrade.id} $color={upgrade.color}>{upgrade.short} {upgrades[upgrade.id]}</UpgradeChip>
              ))}
            </UpgradeSummary>
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
          <Sub>SURVIVE, CLEAR SECTORS, BEAT BOSSES</Sub>
          <QuickBrief>
            <BriefCard>
              <BriefLabel $c="#7aaeff">Move</BriefLabel>
              <BriefText>Mouse, touch, WASD, or arrow keys. Stay nimble near the center for bonus points.</BriefText>
            </BriefCard>
            <BriefCard>
              <BriefLabel $c="#ffb74d">Fire</BriefLabel>
              <BriefText>Hold SPACE, click, tap, or press Enter. Watch weapon heat before it locks.</BriefText>
            </BriefCard>
            <BriefCard>
              <BriefLabel $c="#48e080">Upgrade</BriefLabel>
              <BriefText>Collect power-ups for shields, spread shots, lasers, bombs, and repair kits.</BriefText>
            </BriefCard>
          </QuickBrief>
          <OptionRow aria-label="Difficulty">
            {DIFFICULTY_OPTIONS.map(mode => (
              <OptionButton
                key={mode}
                type="button"
                $active={difficulty === mode}
                onClick={() => setDifficulty(mode)}
              >
                {DIFFICULTIES[mode].label} - {DIFFICULTIES[mode].desc}
              </OptionButton>
            ))}
          </OptionRow>
          <OptionRow aria-label="Audio">
            <OptionButton type="button" $active={audioEnabled} onClick={toggleAudio}>
              AUDIO {audioEnabled ? 'ON' : 'OFF'}
            </OptionButton>
          </OptionRow>
          <CtrlRow style={{ color: 'rgba(255,255,255,.55)' }}>{DIFFICULTIES[difficulty].rule}</CtrlRow>
          <CtrlRow>
            BUILT WITH THREE.JS, REACT, PROCEDURAL AUDIO, AND CUSTOM GAME LOGIC
          </CtrlRow>
          {bestScore > 0 && <HighScore>{DIFFICULTIES[difficulty].label} BEST: {String(bestScore).padStart(6, '0')}</HighScore>}
          <LaunchBtn onClick={() => startGame(true)}>LAUNCH <Play size={17} fill="currentColor" aria-hidden="true" /></LaunchBtn>
        </Overlay>
      )}

      {/* Game over */}
      {phase === 'over' && (
        <Overlay>
          <GameTitle style={{ fontSize: 'clamp(1.8rem,6vw,2.6rem)' }}>GAME OVER</GameTitle>
          <FinalScore>SCORE: {String(finalScore.current).padStart(6, '0')}</FinalScore>
          <ObjBox style={{ marginTop: '.5rem', marginBottom: '.5rem' }}>
            <ObjTitle>PERFORMANCE STATS</ObjTitle>
            <ObjRow $vc="#7aaeff"><span>Mode</span>                    <span className="v">{DIFFICULTIES[difficulty].label}</span></ObjRow>
            <ObjRow $vc="#a0c0ff"><span>Enemies Destroyed</span>  <span className="v">{gameStats.enemiesDestroyed}</span></ObjRow>
            <ObjRow $vc="#ff8800"><span>Bosses Killed</span>       <span className="v">{gameStats.bossesKilled}</span></ObjRow>
            <ObjRow $vc="#ffb74d"><span>Max Combo</span>           <span className="v">{gameStats.maxCombo}×</span></ObjRow>
            <ObjRow $vc="#e04848"><span>Time Survived</span>       <span className="v">{gameStats.timeSurvived}s</span></ObjRow>
            <ObjRow $vc="#48e080"><span>Danger Grazes</span>       <span className="v">{gameStats.grazesTotal}</span></ObjRow>
          </ObjBox>
          <EngineeringNote>
            <EngineeringTitle>ENGINEERING UNDER THE RUN</EngineeringTitle>
            This result came from a real-time simulation that keeps frame-critical game state outside React while synchronizing score, health, upgrades, audio, and overlays back into the interface.
            <EngineeringSystems>
              <EngineeringSystem>THREE.JS RENDER LOOP</EngineeringSystem>
              <EngineeringSystem>CUSTOM COLLISION</EngineeringSystem>
              <EngineeringSystem>ENEMY STATE MACHINES</EngineeringSystem>
              <EngineeringSystem>PROCEDURAL AUDIO</EngineeringSystem>
              <EngineeringSystem>PERSISTENT SETTINGS</EngineeringSystem>
            </EngineeringSystems>
          </EngineeringNote>
          {newHighScore &&
            <Sub style={{ color: '#ffb74d', opacity: 1, marginBottom: '.5rem', display: 'flex', alignItems: 'center', gap: '.45rem' }}>
              <Trophy size={14} aria-hidden="true" /> NEW HIGH SCORE
            </Sub>}
          {bestScore > 0 && <HighScore>{DIFFICULTIES[difficulty].label} BEST: {String(bestScore).padStart(6, '0')}</HighScore>}
          <PauseLink to="/projects">VIEW PROJECT CASE STUDY</PauseLink>
          <LaunchBtn onClick={() => startGame(true)}>PLAY AGAIN <Play size={17} fill="currentColor" aria-hidden="true" /></LaunchBtn>
        </Overlay>
      )}

      {/* Pause */}
      {paused && phase === 'playing' && (
        <Overlay style={{ background: 'rgba(6,6,18,0.7)' }}>
          <GameTitle style={{ fontSize: '2rem', letterSpacing: '8px' }}>PAUSED</GameTitle>
          <SettingsPanel>
            <SettingRow>
              <span>SFX</span>
              <VolumeSlider type="range" min="0" max="1" step="0.05" value={sfxVolume} onChange={event => updateAudioLevel('sfx', event.target.value)} />
              <span>{Math.round(sfxVolume * 100)}%</span>
            </SettingRow>
            <SettingRow>
              <span>MUSIC</span>
              <VolumeSlider type="range" min="0" max="1" step="0.05" value={musicVolume} onChange={event => updateAudioLevel('music', event.target.value)} />
              <span>{Math.round(musicVolume * 100)}%</span>
            </SettingRow>
            <OptionButton type="button" $active={audioEnabled} onClick={toggleAudio}>
              MASTER AUDIO {audioEnabled ? 'ON' : 'OFF'}
            </OptionButton>
          </SettingsPanel>
          <CtrlRow>MOVE: WASD / ARROWS / MOUSE · FIRE: SPACE / ENTER / CLICK · PAUSE: ESC</CtrlRow>
          <PauseActions>
            <PauseButton type="button" $primary onClick={togglePause}>RESUME</PauseButton>
            <PauseButton type="button" onClick={() => startGame(true)}>RESTART</PauseButton>
            <PauseLink to="/">PORTFOLIO</PauseLink>
          </PauseActions>
        </Overlay>
      )}
    </Wrapper>
  );
};

export default AsteroidGame;
