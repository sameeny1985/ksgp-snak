// ========== Mob Control KSGP ==========
// Blue shooters at bottom. Click left/right to move.
// Left: +gates (prizes). Center: soldiers & giants. Right: rollers.
// Fail to kill threats → units die. Clear wave / survive stage to win.

function getMobConfig(level) {
  // 1000 stages — much harder, longer stages
  const t = Math.min(level / 1000, 1);
  const startUnits = Math.min(25, 6 + Math.floor(level / 50));
  const enemyHp = 2 + Math.floor(t * 14);
  const giantHp = 18 + Math.floor(t * 80);
  const rollerHp = 30 + Math.floor(t * 120);
  const spawnRate = Math.max(280, 900 - t * 550); // more enemies
  const timeLimit = Math.max(70, Math.floor(140 - t * 50)); // more time but more targets
  // Need many kills to clear — early ~25, late ~120
  const targetKills = Math.min(120, 25 + Math.floor(t * 95));
  return { startUnits, enemyHp, giantHp, rollerHp, spawnRate, timeLimit, targetKills, level };
}

class MobControlGame {
  constructor(config, levelNum, savedState = null) {
    this.config = config;
    this.levelNum = levelNum;
    this.gameType = 'mobcontrol';
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.W = 400;
    this.H = 400;
    this.canvas.width = this.W;
    this.canvas.height = this.H;

    this.running = false;
    this.paused = false;
    this.interval = null;
    this.timerInterval = null;
    this.spawnAcc = 0;
    this.gameToken = null;
    this.startedAt = Date.now();

    this.groupX = this.W / 2;
    this.bullets = [];
    this.enemies = [];
    this.gates = [];
    this.particles = [];
    this.shootCooldown = 0;
    this.kills = 0;

    if (savedState && savedState.gameType === 'mobcontrol') {
      this.units = savedState.units || config.startUnits;
      this.groupX = savedState.groupX ?? this.W / 2;
      this.kills = savedState.kills || 0;
      this.timeLeft = savedState.timeLeft ?? config.timeLimit;
      this.enemies = savedState.enemies || [];
      this.gates = savedState.gates || [];
    } else {
      this.units = config.startUnits;
      this.timeLeft = config.timeLimit;
      this.seedGates();
    }

    document.getElementById('run-score').textContent = this.units;
    this.updateTimerDisplay();
    this.bindControls();
  }

  seedGates() {
    // Prize gates on left side of road, moving down
    const bonuses = [3, 5, 8, 10, 15];
    for (let i = 0; i < 4; i++) {
      this.gates.push({
        x: 30 + Math.random() * 50,
        y: -80 - i * 140,
        w: 56,
        h: 36,
        bonus: bonuses[Math.floor(Math.random() * bonuses.length)],
        taken: false
      });
    }
  }

  bindControls() {
    const moveFromClient = (clientX) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * (this.W / rect.width);
      // click left half → move left, right half → move right (step)
      const step = this.W / 6;
      if (x < this.W / 2) this.groupX = Math.max(40, this.groupX - step);
      else this.groupX = Math.min(this.W - 40, this.groupX + step);
    };
    this._click = (e) => { e.preventDefault(); moveFromClient(e.clientX); };
    this._touch = (e) => {
      if (!e.touches[0]) return;
      e.preventDefault();
      moveFromClient(e.touches[0].clientX);
    };
    this.keyHandler = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') this.groupX = Math.max(40, this.groupX - this.W / 6);
      if (e.key === 'ArrowRight' || e.key === 'd') this.groupX = Math.min(this.W - 40, this.groupX + this.W / 6);
      if (e.key === ' ') this.togglePause();
    };
    this.canvas.addEventListener('click', this._click);
    this.canvas.addEventListener('touchstart', this._touch, { passive: false });
    window.addEventListener('keydown', this.keyHandler);
  }

  start() {
    this.running = true;
    this.paused = false;
    this.interval = setInterval(() => this.tick(), 16);
    this.timerInterval = setInterval(() => this.tickTimer(), 1000);
    this.draw();
  }

  tickTimer() {
    if (this.paused || !this.running) return;
    this.timeLeft--;
    this.updateTimerDisplay();
    if (this.timeLeft <= 0) {
      // survive with units left = win if enough kills, else fail
      // Timer up: only win if full target reached
      if (this.units > 0 && this.kills >= this.config.targetKills) this.gameOver(true);
      else this.gameOver(false);
    }
  }

  updateTimerDisplay() {
    const el = document.getElementById('run-timer');
    if (el) {
      el.textContent = Math.max(0, this.timeLeft);
      el.style.color = this.timeLeft <= 10 ? '#ff5252' : '#eee';
    }
  }

  togglePause() {
    if (!this.running) return;
    this.paused = !this.paused;
    const btn = document.getElementById('pause-btn');
    if (btn) btn.textContent = this.paused ? 'Resume' : 'Pause';
  }

  spawnEnemy() {
    const r = Math.random();
    let type, hp, x, speed, radius, color;
    if (r < 0.15) {
      // roller from right
      type = 'roller';
      hp = this.config.rollerHp;
      x = this.W - 30 - Math.random() * 40;
      speed = 0.6 + Math.random() * 0.4;
      radius = 28;
      color = '#546e7a';
    } else if (r < 0.3) {
      // giant from center
      type = 'giant';
      hp = this.config.giantHp;
      x = this.W * 0.35 + Math.random() * this.W * 0.3;
      speed = 0.5 + Math.random() * 0.3;
      radius = 22;
      color = '#c62828';
    } else {
      // soldier from center-ish
      type = 'soldier';
      hp = this.config.enemyHp;
      x = this.W * 0.25 + Math.random() * this.W * 0.5;
      speed = 0.9 + Math.random() * 0.6;
      radius = 10;
      color = '#e53935';
    }
    this.enemies.push({ type, x, y: -20, hp, maxHp: hp, speed, radius, color });
  }

  tick() {
    if (this.paused || !this.running) return;

    // spawn
    this.spawnAcc += 16;
    if (this.spawnAcc >= this.config.spawnRate) {
      this.spawnAcc = 0;
      this.spawnEnemy();
      // occasionally new gate
      if (Math.random() < 0.25) {
        const bonuses = [3, 5, 8, 10, 12];
        this.gates.push({
          x: 25 + Math.random() * 60,
          y: -50,
          w: 56,
          h: 36,
          bonus: bonuses[Math.floor(Math.random() * bonuses.length)],
          taken: false
        });
      }
    }

    // auto shoot
    this.shootCooldown -= 16;
    if (this.shootCooldown <= 0 && this.units > 0) {
      this.shootCooldown = Math.max(90, 260 - this.units * 2);
      const n = Math.min(6, 1 + Math.floor(this.units / 10));
      if (window.SFX) SFX.shoot();
      for (let i = 0; i < n; i++) {
        this.bullets.push({
          x: this.groupX + (Math.random() - 0.5) * 40,
          y: this.H - 70,
          vy: -7 - Math.random() * 2,
          dmg: 1
        });
      }
    }

    // bullets
    for (const b of this.bullets) b.y += b.vy;
    this.bullets = this.bullets.filter(b => b.y > -10);

    // gates move down
    for (const g of this.gates) {
      if (g.taken) continue;
      g.y += 1.2;
      // collect if near group
      if (
        Math.abs(g.x + g.w / 2 - this.groupX) < 50 &&
        g.y + g.h > this.H - 90 &&
        g.y < this.H - 40
      ) {
        g.taken = true;
        this.units += g.bonus;
        if (window.SFX) SFX.gate();
        document.getElementById('run-score').textContent = this.units;
      }
    }
    this.gates = this.gates.filter(g => !g.taken && g.y < this.H + 40);

    // enemies move down
    for (const e of this.enemies) {
      e.y += e.speed;
    }

    // bullet vs enemy
    for (const b of this.bullets) {
      for (const e of this.enemies) {
        if (e.hp <= 0) continue;
        const dx = b.x - e.x, dy = b.y - e.y;
        if (dx * dx + dy * dy < (e.radius + 4) * (e.radius + 4)) {
          e.hp -= b.dmg;
          b.y = -999;
          if (window.SFX) SFX.hit();
          if (e.hp <= 0) {
            this.kills++;
            document.getElementById('run-score').textContent = this.units + ' | K:' + this.kills;
          }
        }
      }
    }
    this.enemies = this.enemies.filter(e => e.hp > 0 && e.y < this.H + 40);

    // enemy reaches player line → kill units
    for (const e of this.enemies) {
      if (e.y + e.radius >= this.H - 55) {
        const loss = e.type === 'roller' ? Math.max(5, Math.ceil(this.units * 0.25))
          : e.type === 'giant' ? Math.max(3, Math.ceil(this.units * 0.15))
          : 1;
        this.units = Math.max(0, this.units - loss);
        e.hp = 0;
        document.getElementById('run-score').textContent = this.units;
        if (this.units <= 0) {
          this.enemies = this.enemies.filter(x => x.hp > 0);
          return this.gameOver(false);
        }
      }
    }
    this.enemies = this.enemies.filter(e => e.hp > 0);

    // win by target kills
    if (this.kills >= this.config.targetKills) {
      return this.gameOver(true);
    }

    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    // sky / city hint
    const grd = ctx.createLinearGradient(0, 0, 0, this.H);
    grd.addColorStop(0, '#4fc3f7');
    grd.addColorStop(0.5, '#81d4fa');
    grd.addColorStop(1, '#78909c');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.W, this.H);

    // road
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(20, 0, this.W - 40, this.H);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(this.W / 2, 0);
    ctx.lineTo(this.W / 2, this.H);
    ctx.stroke();
    ctx.setLineDash([]);

    // gates (prizes left)
    for (const g of this.gates) {
      if (g.taken) continue;
      ctx.fillStyle = '#1565c0';
      ctx.fillRect(g.x, g.y, g.w, g.h);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+' + g.bonus, g.x + g.w / 2, g.y + 24);
    }

    // enemies
    for (const e of this.enemies) {
      ctx.fillStyle = e.color;
      if (e.type === 'roller') {
        // roller cylinder
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffc107';
        ctx.fillRect(e.x - e.radius, e.y - 8, e.radius * 2, 10);
        // spikes
        ctx.fillStyle = '#37474f';
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(e.x + Math.cos(a) * e.radius * 0.7, e.y + Math.sin(a) * e.radius * 0.7, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (e.type === 'giant') {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(e.x - 10, e.y - e.radius - 6, 20, 5); // hp bar bg
        ctx.fillStyle = '#69f0ae';
        ctx.fillRect(e.x - 10, e.y - e.radius - 6, 20 * (e.hp / e.maxHp), 5);
      } else {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // bullets
    ctx.fillStyle = '#ffeb3b';
    for (const b of this.bullets) {
      ctx.fillRect(b.x - 2, b.y - 6, 4, 10);
    }

    // player group (blue units)
    const n = Math.min(this.units, 40);
    for (let i = 0; i < n; i++) {
      const col = i % 8;
      const row = Math.floor(i / 8);
      const px = this.groupX + (col - 3.5) * 11;
      const py = this.H - 35 - row * 12;
      ctx.fillStyle = '#2196f3';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0d47a1';
      ctx.fillRect(px - 1, py - 10, 2, 6); // gun
    }

    // unit count badge
    ctx.fillStyle = 'rgba(13,71,161,0.9)';
    ctx.roundRect?.(this.groupX - 28, this.H - 22, 56, 18, 8);
    if (!ctx.roundRect) {
      ctx.fillRect(this.groupX - 28, this.H - 22, 56, 18);
    } else {
      ctx.fill();
    }
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(this.units), this.groupX, this.H - 9);
  }

  getSaveState() {
    return {
      gameType: 'mobcontrol',
      level: this.levelNum,
      units: this.units,
      groupX: this.groupX,
      kills: this.kills,
      timeLeft: this.timeLeft,
      enemies: this.enemies,
      gates: this.gates,
      savedAt: new Date().toISOString()
    };
  }

  async gameOver(won) {
    this.running = false;
    clearInterval(this.interval);
    if (this.timerInterval) clearInterval(this.timerInterval);

    if (!won) {
      if (window.SFX) SFX.die();
      const modal = document.getElementById('result-modal');
      document.getElementById('result-title').textContent = typeof t === 'function' ? t('lose_title') : 'Game Over';
      document.getElementById('result-msg').textContent = typeof t === 'function' ? t('lose_msg') : 'Your squad was wiped out';
      document.getElementById('result-reward').textContent = '0 ksgp';
      modal.classList.remove('hidden');
      document.getElementById('result-ok').onclick = () => {
        modal.classList.add('hidden');
        beginMobControl(this.levelNum, null);
      };
      return;
    }

    if (window.SFX) SFX.win();
    try {
      const res = await fetch('/api/game/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: this.levelNum,
          completed: true,
          gameType: 'mobcontrol',
          token: this.gameToken || null,
          durationMs: Date.now() - (this.startedAt || Date.now())
        })
      });
      const data = await res.json();
      if (data.success && typeof user !== 'undefined' && user) {
        user.ksgp = data.ksgp;
        user.currentLevel = data.currentLevel;
        const el = document.getElementById('ksgp-amount');
        if (el) el.textContent = Number(data.ksgp).toLocaleString(undefined, { maximumFractionDigits: 0 });
      }
      const reward = data.earned || (typeof KSGP_PER_LEVEL !== 'undefined' ? KSGP_PER_LEVEL : 10000);
      const modal = document.getElementById('result-modal');
      document.getElementById('result-title').textContent = typeof t === 'function' ? t('win_title') : 'Stage Cleared!';
      document.getElementById('result-msg').textContent = typeof t === 'function' ? t('win_msg', { reward: Number(reward).toLocaleString() }) : ('+' + reward);
      document.getElementById('result-reward').textContent = Number(reward).toLocaleString() + ' ksgp';
      modal.classList.remove('hidden');
      document.getElementById('result-ok').onclick = () => {
        modal.classList.add('hidden');
        if (this.levelNum >= 1000) {
          document.getElementById('play-area').classList.add('hidden');
          document.getElementById('menu-area').classList.remove('hidden');
          if (typeof loadUser === 'function') loadUser();
        } else {
          beginMobControl(this.levelNum + 1, null);
        }
      };
    } catch (e) {
      console.error(e);
      alert('Error');
    }
  }

  destroy() {
    this.running = false;
    clearInterval(this.interval);
    if (this.timerInterval) clearInterval(this.timerInterval);
    window.removeEventListener('keydown', this.keyHandler);
    if (this._click) this.canvas.removeEventListener('click', this._click);
    if (this._touch) this.canvas.removeEventListener('touchstart', this._touch);
  }
}

async function beginMobControl(levelNum, savedState) {
  document.getElementById('menu-area').classList.add('hidden');
  document.getElementById('play-area').classList.remove('hidden');
  document.getElementById('current-stage').textContent = levelNum;

  let gameToken = null;
  try {
    const res = await fetch('/api/game/start', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gameType: 'mobcontrol' })
    });
    const data = await res.json();
    if (data.success && data.token) {
      gameToken = data.token;
      if (data.level && !savedState) {
        levelNum = data.level;
        document.getElementById('current-stage').textContent = levelNum;
      }
    }
  } catch (e) { console.error(e); }

  const cfg = getMobConfig(levelNum);
  if (typeof game !== 'undefined' && game) game.destroy();
  game = new MobControlGame(cfg, levelNum, savedState);
  game.gameToken = gameToken;
  game.startedAt = Date.now();
  game.start();

  const warn = document.getElementById('hazard-warn');
  if (warn) {
    warn.classList.remove('hidden');
    warn.textContent = 'Left: +gates | Center: enemies | Right: rollers | Click L/R to move';
    warn.style.color = '#90caf9';
  }
}

window.MobControlGame = MobControlGame;
window.beginMobControl = beginMobControl;
window.getMobConfig = getMobConfig;
