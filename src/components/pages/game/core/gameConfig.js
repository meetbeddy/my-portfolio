export const MAX_HP = 100;
export const TUTORIAL_KEY = 'asteroidFieldTutorialComplete';
export const AUDIO_SETTINGS_KEY = 'asteroidFieldAudioSettings';
const HIGH_SCORE_KEY = 'asteroidFieldHighScore';

export const DIFFICULTIES = {
  chill: { label: 'CHILL', desc: 'shielded start', rule: 'Slower heat · +30 hull per sector · more drops', spawnBase: 2600, damage: 0.75, scoreMult: 0.9, speed: 0.85, heatMult: 0.82, overheatLock: 2000, sectorRepair: 30, startShield: true, powerupInterval: 0.78, projectileSpeed: 0.9 },
  arcade: { label: 'ARCADE', desc: 'balanced', rule: 'Standard rules · +20 hull per sector', spawnBase: 2200, damage: 1, scoreMult: 1, speed: 1, heatMult: 1, overheatLock: 2500, sectorRepair: 20, startShield: false, powerupInterval: 1, projectileSpeed: 1 },
  insane: { label: 'INSANE', desc: 'high-risk score', rule: 'Hot weapons · +8 hull per sector · dense bosses', spawnBase: 1750, damage: 1.25, scoreMult: 1.2, speed: 1.18, heatMult: 1.15, overheatLock: 3200, sectorRepair: 8, startShield: false, powerupInterval: 1.3, projectileSpeed: 1.15 },
};
export const DIFFICULTY_OPTIONS = Object.keys(DIFFICULTIES);

export const TUTORIAL_STEPS = [
  { title: 'FLIGHT CONTROL', text: 'Move with the mouse, touch, WASD, or arrow keys.' },
  { title: 'WEAPONS ONLINE', text: 'Hold Space, press Enter, click, or tap to fire.' },
  { title: 'HEAT DISCIPLINE', text: 'Build weapon heat above 30%, then stop firing and let it cool below 15%.' },
  { title: 'RISK AND REWARD', text: 'Enter the dashed center zone for bonus points, then keep moving to survive.' },
];

export const hasCompletedTutorial = () => {
  try { return localStorage.getItem(TUTORIAL_KEY) === 'true'; }
  catch { return false; }
};

export const readAudioSettings = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(AUDIO_SETTINGS_KEY) || '{}');
    return {
      enabled: stored.enabled ?? true,
      sfxVolume: Number.isFinite(stored.sfxVolume) ? stored.sfxVolume : 0.8,
      musicVolume: Number.isFinite(stored.musicVolume) ? stored.musicVolume : 0.55,
    };
  } catch {
    return { enabled: true, sfxVolume: 0.8, musicVolume: 0.55 };
  }
};

export const SECTOR_UPGRADES = [
  { id: 'fireRate', label: 'PULSE ACCELERATOR', short: 'FIRE', description: 'Fire 12% faster. Stacks reduce the delay between every shot.', color: '#ff7a66', max: 3 },
  { id: 'cooling', label: 'CRYO VENTS', short: 'COOL', description: 'Build 15% less heat and cool weapons faster between bursts.', color: '#48e0e0', max: 3 },
  { id: 'damage', label: 'DENSE MUNITIONS', short: 'DMG', description: 'Shots deal 35% more damage to asteroids and sector bosses.', color: '#ffb74d', max: 3 },
  { id: 'piercing', label: 'PHASE ROUNDS', short: 'PIERCE', description: 'Shots pass through one additional target before breaking.', color: '#c98cff', max: 2 },
  { id: 'armor', label: 'REACTIVE PLATING', short: 'ARMOR', description: 'Reduce all hull damage by 12% for the rest of this run.', color: '#80ff9b', max: 3 },
  { id: 'aegis', label: 'AEGIS RELAY', short: 'AEGIS', description: 'Begin every new sector with a shield that blocks one collision.', color: '#7aaeff', max: 1 },
];
export const SALVAGE_UPGRADE = { id: 'repair', label: 'FIELD REPAIR', short: 'REPAIR', description: 'Restore 25 hull integrity before entering the next sector.', color: '#80ff9b', max: 1 };
export const emptyUpgrades = () => Object.fromEntries(SECTOR_UPGRADES.map(upgrade => [upgrade.id, 0]));
export const drawUpgradeChoices = levels => {
  const available = SECTOR_UPGRADES.filter(upgrade => (levels[upgrade.id] || 0) < upgrade.max);
  if (available.length === 0) return [SALVAGE_UPGRADE];
  return [...available].sort(() => Math.random() - 0.5).slice(0, 3);
};

export const highScoreKey = mode => `${HIGH_SCORE_KEY}:${mode}`;
export const readHighScore = (mode = 'arcade') => {
  try {
    const legacyScore = mode === 'arcade' ? localStorage.getItem(HIGH_SCORE_KEY) || sessionStorage.getItem('hs') : null;
    const stored = Number(localStorage.getItem(highScoreKey(mode)) || legacyScore || 0);
    return Number.isFinite(stored) ? stored : 0;
  } catch { return 0; }
};

export const PUPS = {
  shield: { color: 0x4880e0, hex: '#4880e0', label: 'SHIELD', dur: 10000 },
  rapid: { color: 0x48e080, hex: '#48e080', label: 'RAPID FIRE', dur: 8000 },
  bigbullet: { color: 0xffb74d, hex: '#ffb74d', label: 'BIG SHOT', dur: 8000 },
  spread: { color: 0xc048e0, hex: '#c048e0', label: 'SPREAD', dur: 8000 },
  laser: { color: 0x48e0e0, hex: '#48e0e0', label: 'LASER', dur: 6000 },
  bomb: { color: 0xe02048, hex: '#e02048', label: 'SMART BOMB', dur: 0 },
  repair: { color: 0x80ff80, hex: '#80ff80', label: 'REPAIR KIT', dur: 0 },
};

export const SECTOR_PALETTES = [
  { star: 0xffffff, ambient: 0x223344, fog: '#0a0a1a', accent: '#ffffff' },
  { star: 0x00ffff, ambient: 0x003344, fog: '#001a1a', accent: '#00ffff' },
  { star: 0xff00ff, ambient: 0x330033, fog: '#1a001a', accent: '#ff00ff' },
  { star: 0xffff00, ambient: 0x333300, fog: '#1a1a00', accent: '#ffff00' },
  { star: 0x00ff88, ambient: 0x003322, fog: '#001a0e', accent: '#00ff88' },
  { star: 0xff4444, ambient: 0x330011, fog: '#1a0005', accent: '#ff4444' },
];
