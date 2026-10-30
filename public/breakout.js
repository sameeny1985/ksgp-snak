// ========== Breakout KSGP ==========
// Paddle: click left/right half of canvas — 5 steps to each edge

function getBreakoutConfig(level) {
  const t = Math.min(level / 1000, 1);
  const rows = Math.min(8, 3 + Math.floor(t * 5));
  const cols = Math.min(10, 6 + Math.floor(t * 4));
  const ballSpeed = 2.2 + t * 3.5;
  const timeLimit = Math.max(40, Math.floor(130 - t * 70));
  return { rows, cols, ballSpeed, timeLimit, level };
}

class BreakoutGame {
  constructor(config, levelNum, savedState = null) {
    this.config = config;
    this.levelNum = levelNum;
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.W = 400;
    this.H = 400;
    this.canvas.width = this.W;
    this.canvas.height = this.H;

    this.paddleW = 72;
    this.paddleH = 12;
    this.paddleY = this.H - 28;
    this.minPX = 0;
    this.maxPX = this.W - this.paddleW;
    this.paddleStep = (this.maxPX - this.minPX) / 5; // 5 clicks edge to edge

    this.ballR = 6;
    this.running = false;
    this.paused = false;
    this.interval = null;
    this.timerInterval = null;
    this.gameToken = null;
    this.startedAt = Date.now();
    this.gameType = 'breakout';

    if (savedState && savedState.gameType === 'breakout') {
      this.paddleX = savedState.paddleX ?? (this.W - this.paddleW) / 2;
      this.ballX = savedState.ballX ?? this.W / 2;
      this.ballY = savedState.ballY ?? this.H - 50;
      this.ballVX = savedState.ballVX ?? config.ballSpeed;
      this.ballVY = savedState.ballVY ?? -config.ballSpeed;
      this.bricks = savedState.bricks || this.buildBricks();
      this.score = savedState.score || 0;
      this.timeLeft = savedState.timeLeft ?? config.timeLimit;
    } else {
      this.paddleX = (this.W - this.paddleW) / 2;
      this.ballX = this.W / 2;
      this.ballY = this.H - 50;
      this.ballVX = config.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
      this.ballVY = -config.ballSpeed;
      this.bricks = this.buildBricks();
      this.score = 0;
      this.timeLeft = config.timeLimit;
    }

    document.getElementById('run-score').textContent = this.score;
    this.updateTimerDisplay();
    this.bindControls();
  }

  buildBricks() {
    const { rows, cols } = this.config;
    const bricks = [];
    const gap = 4;
    const top = 40;
    const bw = (this.W - gap * (cols + 1)) / cols;
    const bh = 14;
    const colors = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#00acc1', '#ec407a'];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: gap + c * (bw + gap),
          y: top + r * (bh + gap),
          w: bw,
          h: bh,
          alive: true,
          color: colors[r % colors.length]
        });
      }
    }
    return bricks;
  }

  bindControls() {
    this._clickHandler = (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (this.W / rect.width);
      if (x < this.W / 2) {
        this.paddleX = Math.max(this.minPX, this.paddleX - this.paddleStep);
      } else {
        this.paddleX = Math.min(this.maxPX, this.paddleX + this.paddleStep);
      }
    };
    this._touchHandler = (e) => {
      if (!e.touches || !e.touches[0]) return;
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.touches[0].clientX - rect.left) * (this.W / rect.width);
      if (x < this.W / 2) {
        this.paddleX = Math.max(this.minPX, this.paddleX - this.paddleStep);
      } else {
        this.paddleX = Math.min(this.maxPX, this.paddleX + this.paddleStep);
      }
    };
    this.keyHandler = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        this.paddleX = Math.max(this.minPX, this.paddleX - this.paddleStep);
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.paddleX = Math.min(this.maxPX, this.paddleX + this.paddleStep);
      }
      if (e.key === ' ') this.togglePause();
    };
    this.canvas.addEventListener('click', this._clickHandler);
    this.canvas.addEventListener('touchstart', this._touchHandler, { passive: false });
    window.addEventListener('keydown', this.keyHandler);
  }

  start() {
    this.running = true;
    this.paused = false;
    this.interval = setInterval(() => this.tick(), 16); // ~60fps
    this.timerInterval = setInterval(() => this.tickTimer(), 1000);
    this.draw();
  }

  tickTimer() {
    if (this.paused || !this.running) return;
    this.timeLeft--;
    this.updateTimerDisplay();
    if (this.timeLeft <= 0) this.gameOver(false);
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
    if (btn) btn.textContent = this.paused ? (typeof t === 'function' ? t('resume') : 'Resume') : (typeof t === 'function' ? t('pause') : 'Pause');
  }

  tick() {
    if (this.paused || !this.running) return;

    this.ballX += this.ballVX;
    this.ballY += this.ballVY;

    // Walls
    if (this.ballX - this.ballR <= 0) { this.ballX = this.ballR; this.ballVX = Math.abs(this.ballVX); }
    if (this.ballX + this.ballR >= this.W) { this.ballX = this.W - this.ballR; this.ballVX = -Math.abs(this.ballVX); }
    if (this.ballY - this.ballR <= 0) { this.ballY = this.ballR; this.ballVY = Math.abs(this.ballVY); }

    // Bottom = lose
    if (this.ballY - this.ballR > this.H) {
      return this.gameOver(false);
    }

    // Paddle
    if (
      this.ballY + this.ballR >= this.paddleY &&
      this.ballY - this.ballR <= this.paddleY + this.paddleH &&
      this.ballX >= this.paddleX &&
      this.ballX <= this.paddleX + this.paddleW &&
      this.ballVY > 0
    ) {
      this.ballVY = -Math.abs(this.ballVY);
      // angle by hit position
      const hit = (this.ballX - this.paddleX) / this.paddleW - 0.5;
      this.ballVX = hit * 6;
      const speed = Math.sqrt(this.ballVX * this.ballVX + this.ballVY * this.ballVY);
      const target = this.config.ballSpeed;
      this.ballVX = (this.ballVX / speed) * target;
      this.ballVY = (this.ballVY / speed) * target;
      this.ballY = this.paddleY - this.ballR;
    }

    // Bricks
    for (const b of this.bricks) {
      if (!b.alive) continue;
      if (
        this.ballX + this.ballR > b.x &&
        this.ballX - this.ballR < b.x + b.w &&
        this.ballY + this.ballR > b.y &&
        this.ballY - this.ballR < b.y + b.h
      ) {
        b.alive = false;
        this.score++;
        document.getElementById('run-score').textContent = this.score;
        // bounce
        const overlapL = this.ballX + this.ballR - b.x;
        const overlapR = b.x + b.w - (this.ballX - this.ballR);
        const overlapT = this.ballY + this.ballR - b.y;
        const overlapB = b.y + b.h - (this.ballY - this.ballR);
        const minO = Math.min(overlapL, overlapR, overlapT, overlapB);
        if (minO === overlapL || minO === overlapR) this.ballVX *= -1;
        else this.ballVY *= -1;
        break;
      }
    }

    if (this.bricks.every(b => !b.alive)) {
      return this.gameOver(true);
    }

    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    // background like classic arkanoid blue
    ctx.fillStyle = '#0d1b4c';
    ctx.fillRect(0, 0, this.W, this.H);

    // subtle pattern
    ctx.fillStyle = 'rgba(30,60,140,0.35)';
    for (let y = 0; y < this.H; y += 16) {
      for (let x = 0; x < this.W; x += 16) {
        if ((x + y) % 32 === 0) ctx.fillRect(x, y, 14, 14);
      }
    }

    // bricks
    for (const b of this.bricks) {
      if (!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.strokeRect(b.x, b.y, b.w, b.h);
    }

    // paddle
    ctx.fillStyle = '#cfd8dc';
    ctx.fillRect(this.paddleX, this.paddleY, this.paddleW, this.paddleH);
    ctx.fillStyle = '#ff5252';
    ctx.fillRect(this.paddleX, this.paddleY, 8, this.paddleH);
    ctx.fillRect(this.paddleX + this.paddleW - 8, this.paddleY, 8, this.paddleH);

    // ball
    ctx.beginPath();
    ctx.arc(this.ballX, this.ballY, this.ballR, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  getSaveState() {
    return {
      gameType: 'breakout',
      level: this.levelNum,
      score: this.score,
      paddleX: this.paddleX,
      ballX: this.ballX,
      ballY: this.ballY,
      ballVX: this.ballVX,
      ballVY: this.ballVY,
      bricks: this.bricks,
      timeLeft: this.timeLeft,
      savedAt: new Date().toISOString()
    };
  }

  async gameOver(won) {
    this.running = false;
    clearInterval(this.interval);
    if (this.timerInterval) clearInterval(this.timerInterval);

    if (!won) {
      const modal = document.getElementById('result-modal');
      document.getElementById('result-title').textContent = typeof t === 'function' ? t('lose_title') : 'Game Over';
      document.getElementById('result-msg').textContent = typeof t === 'function' ? t('lose_msg') : 'Try again';
      document.getElementById('result-reward').textContent = '0 ksgp';
      modal.classList.remove('hidden');
      document.getElementById('result-ok').onclick = () => {
        modal.classList.add('hidden');
        beginBreakout(this.levelNum, null);
      };
      return;
    }

    try {
      const res = await fetch('/api/game/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: this.levelNum,
          completed: true,
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
      const reward = data.earned || (typeof KSGP_PER_LEVEL !== 'undefined' ? KSGP_PER_LEVEL : 100000);
      const modal = document.getElementById('result-modal');
      document.getElementById('result-title').textContent = typeof t === 'function' ? t('win_title') : 'Stage Cleared!';
      document.getElementById('result-msg').textContent = typeof t === 'function' ? t('win_msg', { reward: Number(reward).toLocaleString() }) : ('+' + reward + ' ksgp');
      document.getElementById('result-reward').textContent = Number(reward).toLocaleString() + ' ksgp';
      modal.classList.remove('hidden');
      document.getElementById('result-ok').onclick = () => {
        modal.classList.add('hidden');
        if (this.levelNum >= 1000) {
          document.getElementById('play-area').classList.add('hidden');
          document.getElementById('menu-area').classList.remove('hidden');
          if (typeof loadUser === 'function') loadUser();
        } else {
          beginBreakout(this.levelNum + 1, null);
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
    if (this._clickHandler) this.canvas.removeEventListener('click', this._clickHandler);
    if (this._touchHandler) this.canvas.removeEventListener('touchstart', this._touchHandler);
  }
}

async function beginBreakout(levelNum, savedState) {
  document.getElementById('menu-area').classList.add('hidden');
  document.getElementById('play-area').classList.remove('hidden');
  document.getElementById('current-stage').textContent = levelNum;

  let gameToken = null;
  try {
    const res = await fetch('/api/game/start', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const data = await res.json();
    if (data.success && data.token) {
      gameToken = data.token;
      if (data.level && !savedState) {
        levelNum = data.level;
        document.getElementById('current-stage').textContent = levelNum;
      }
    }
  } catch (e) { console.error(e); }

  const cfg = getBreakoutConfig(levelNum);
  if (typeof game !== 'undefined' && game) game.destroy();
  game = new BreakoutGame(cfg, levelNum, savedState);
  game.gameToken = gameToken;
  game.startedAt = Date.now();
  game.start();

  const warn = document.getElementById('hazard-warn');
  if (warn) warn.classList.add('hidden');
}

window.BreakoutGame = BreakoutGame;
window.beginBreakout = beginBreakout;
window.getBreakoutConfig = getBreakoutConfig;
