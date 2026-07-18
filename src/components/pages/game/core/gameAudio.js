const playTone = (ctx, { freq = 440, type = 'sine', gain = 0.18, dur = 0.12, decay = 0.08 } = {}) => {
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.connect(vol); vol.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + dur);
    vol.gain.setValueAtTime(gain * (ctx.__sfxVolume ?? 1), ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur + decay);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur + decay + 0.01);
  } catch { }
};

export const createAudio = () => {
  try { return new (window.AudioContext || window.webkitAudioContext)(); }
  catch { return null; }
};

export const SFX = {
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
    [523, 659, 784].forEach((freq, index) => {
      setTimeout(() => playTone(ctx, { freq, type: 'sine', gain: 0.28, dur: 0.22, decay: 0.18 }), index * 140);
    });
  },
};

export const startSynthwave = (ctx) => {
  if (!ctx || ctx.state === 'suspended') return null;
  try {
    const notes = [55, 82.5, 55, 110, 55, 82.5, 110, 82.5];
    let step = 0;
    const stepDur = (60 / 128) / 2;
    const playNote = () => {
      if (!ctx || ctx.state === 'closed') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 800;
      osc.type = 'sawtooth'; osc.frequency.value = notes[step % notes.length];
      const time = ctx.currentTime;
      gain.gain.setValueAtTime(0.06 * (ctx.__musicVolume ?? 1), time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + stepDur * 0.85);
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      osc.start(time); osc.stop(time + stepDur); step++;
    };
    playNote();
    return setInterval(playNote, stepDur * 1000);
  } catch { return null; }
};
