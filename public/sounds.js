// ========== KSGP GAMES — shared SFX (Web Audio) ==========
const SFX = (() => {
  let ctx = null;
  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type, vol, when) {
    const c = ac(); if (!c) return;
    const t0 = (when || 0) + c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'square';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.08, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function noise(dur, vol) {
    const c = ac(); if (!c) return;
    const n = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource();
    const g = c.createGain();
    src.buffer = buf;
    g.gain.value = vol || 0.05;
    src.connect(g); g.connect(c.destination);
    src.start();
  }
  return {
    unlock() { ac(); },
    // Snake
    eat() { tone(520, 0.06, 'square', 0.07); tone(720, 0.08, 'square', 0.05, 0.05); },
    die() { tone(200, 0.15, 'sawtooth', 0.1); tone(120, 0.25, 'sawtooth', 0.08, 0.1); },
    win() { tone(440, 0.1, 'sine', 0.08); tone(554, 0.1, 'sine', 0.08, 0.1); tone(659, 0.2, 'sine', 0.1, 0.2); },
    // Breakout
    paddle() { tone(180, 0.04, 'triangle', 0.06); },
    brick() { tone(600, 0.05, 'square', 0.06); noise(0.04, 0.03); },
    // Mob
    shoot() { tone(880, 0.03, 'square', 0.04); tone(400, 0.04, 'sawtooth', 0.03, 0.02); },
    hit() { tone(150, 0.05, 'triangle', 0.06); },
    gate() { tone(523, 0.08, 'sine', 0.07); tone(784, 0.1, 'sine', 0.06, 0.08); },
    // Jackpot
    spin() {
      for (let i = 0; i < 12; i++) tone(200 + i * 30, 0.04, 'square', 0.03, i * 0.05);
    },
    stop() { tone(330, 0.08, 'triangle', 0.07); },
    jackpotWin() {
      tone(523, 0.12, 'sine', 0.1);
      tone(659, 0.12, 'sine', 0.1, 0.12);
      tone(784, 0.12, 'sine', 0.1, 0.24);
      tone(1046, 0.25, 'sine', 0.12, 0.36);
    },
    jackpotLose() { tone(300, 0.15, 'sawtooth', 0.06); tone(180, 0.2, 'sawtooth', 0.05, 0.12); },
    click() { tone(700, 0.03, 'square', 0.04); }
  };
})();
window.SFX = SFX;
document.addEventListener('pointerdown', () => { if (window.SFX) SFX.unlock(); }, { once: true });
