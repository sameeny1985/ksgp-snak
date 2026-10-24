// ========== Snake KSGP - 1000 levels, success-only rewards, falling hazards ==========

const TOTAL_LEVELS = 1000;
const TOTAL_KSGP_REWARD = 100000000; // 100 million total
const KSGP_PER_LEVEL = 100000; // 100,000 ksgp per successful stage

const TRANSLATIONS = {
  en: {
    title: "Snake", subtitle: "Classic snake game with ksgp token scores",
    info1: "Complete each stage to earn ksgp", info2: "Failed attempts give 0 ksgp",
    login_btn: "Sign in with Google", login_note: "Click the button to choose from your Google accounts",
    balance: "Balance:", admin: "Admin", logout: "Logout", my_panel: "My Panel",
    start: "Start Game", continue_game: "Continue", save_exit: "Save & Exit",
    pause: "Pause", resume: "Resume", stop: "Stop",
    stage: "Stage", score: "Score this run:",
    timer: "Time:",
    win_title: "🎉 Stage Cleared!", lose_title: "💀 Game Over",
    win_msg: "You earned {reward} ksgp!", lose_msg: "No ksgp this attempt. Try again!",
    ok: "OK", saved_ok: "Game saved! Continue later from My Panel.",
    continue_saved: "Continue saved game", lang_label: "Language:",
    hazard_warning: "⚠ Ice falling from above!"
  },
  fa: {
    title: "اسنک", subtitle: "بازی مار کلاسیک با امتیاز توکن ksgp",
    info1: "با موفقیت هر مرحله ksgp بگیر", info2: "شکست = صفر امتیاز آن مرحله",
    login_btn: "ورود با حساب گوگل", login_note: "از بین حساب‌های گوگل خود انتخاب کنید",
    balance: "موجودی:", admin: "پنل ادمین", logout: "خروج", my_panel: "پنل من",
    start: "شروع بازی", continue_game: "ادامه", save_exit: "ذخیره و خروج",
    pause: "توقف", resume: "ادامه", stop: "توقف کامل",
    stage: "مرحله", score: "امتیاز این دور:",
    timer: "زمان:",
    win_title: "🎉 مرحله رد شد!", lose_title: "💀 بازی تمام شد",
    win_msg: "تو {reward} ksgp گرفتی!", lose_msg: "این دور هیچ ksgp نگرفتی. دوباره تلاش کن!",
    ok: "باشه", saved_ok: "بازی ذخیره شد! بعداً از پنل من ادامه بده.",
    continue_saved: "ادامه بازی ذخیره‌شده", lang_label: "زبان:",
    hazard_warning: "⚠ یخ از بالا می‌بارد!"
  },
  nl: {
    title: "Slang", subtitle: "Klassiek slangenspel met ksgp-tokenscores",
    info1: "Voltooi elke fase om ksgp te verdienen", info2: "Mislukte pogingen geven 0 ksgp",
    login_btn: "Inloggen met Google", login_note: "Kies een Google-account",
    balance: "Saldo:", admin: "Beheer", logout: "Uitloggen", my_panel: "Mijn paneel",
    start: "Spel starten", continue_game: "Doorgaan", save_exit: "Opslaan & afsluiten",
    pause: "Pauze", resume: "Hervatten", stop: "Stop",
    stage: "Fase", score: "Score deze ronde:",
    timer: "Tijd:",
    win_title: "🎉 Fase gehaald!", lose_title: "💀 Game Over",
    win_msg: "Je hebt {reward} ksgp verdiend!", lose_msg: "Geen ksgp deze poging.",
    ok: "OK", saved_ok: "Spel opgeslagen!", continue_saved: "Opgeslagen spel hervatten",
    lang_label: "Taal:", hazard_warning: "⚠ IJs valt van boven!"
  },
  fr: {
    title: "Serpent", subtitle: "Jeu de serpent classique avec scores ksgp",
    info1: "Terminez chaque étape pour gagner des ksgp", info2: "Échec = 0 ksgp",
    login_btn: "Se connecter avec Google", login_note: "Choisissez un compte Google",
    balance: "Solde :", admin: "Admin", logout: "Déconnexion", my_panel: "Mon panneau",
    start: "Commencer", continue_game: "Continuer", save_exit: "Sauvegarder et quitter",
    pause: "Pause", resume: "Reprendre", stop: "Arrêter",
    stage: "Étape", score: "Score de cette manche :",
    timer: "Temps :",
    win_title: "🎉 Étape réussie !", lose_title: "💀 Game Over",
    win_msg: "Vous avez gagné {reward} ksgp !", lose_msg: "Aucun ksgp cette tentative.",
    ok: "OK", saved_ok: "Partie sauvegardée !", continue_saved: "Continuer la partie sauvegardée",
    lang_label: "Langue :", hazard_warning: "⚠ Glace qui tombe !"
  },
  de: {
    title: "Schlange", subtitle: "Klassisches Schlangenspiel mit ksgp-Punkten",
    info1: "Schließe jede Stufe ab um ksgp zu verdienen", info2: "Fehlversuche geben 0 ksgp",
    login_btn: "Mit Google anmelden", login_note: "Wähle ein Google-Konto",
    balance: "Guthaben:", admin: "Admin", logout: "Abmelden", my_panel: "Mein Panel",
    start: "Spiel starten", continue_game: "Weiter", save_exit: "Speichern & Beenden",
    pause: "Pause", resume: "Weiter", stop: "Stopp",
    stage: "Stufe", score: "Punkte dieser Runde:",
    timer: "Zeit:",
    win_title: "🎉 Stufe geschafft!", lose_title: "💀 Game Over",
    win_msg: "Du hast {reward} ksgp verdient!", lose_msg: "Kein ksgp bei diesem Versuch.",
    ok: "OK", saved_ok: "Spiel gespeichert!", continue_saved: "Gespeichertes Spiel fortsetzen",
    lang_label: "Sprache:", hazard_warning: "⚠ Eis fällt von oben!"
  }
};

function getLevelConfig(level) {
  const t = Math.min(level / TOTAL_LEVELS, 1);
  const speed = Math.max(28, Math.floor(170 - t * 140));
  const grid = Math.max(10, Math.floor(20 - t * 10));
  const walls = level >= 4;
  const obstacles = Math.min(20, Math.floor(t * 18));
  // Food needed: stage 1 ≈ 12, stage 1000 ≈ 80 (much harder)
  const target = Math.min(80, 12 + Math.floor(t * 68));
  const hazards = level >= 500;
  // Time limit: a bit more time because more food is required
  const timeLimit = Math.max(35, Math.floor(120 - t * 80));
  return { speed, grid, walls, obstacles, target, hazards, timeLimit, level };
}

let currentLang = localStorage.getItem('snake_ksgp_lang') || 'en';
let user = null;
let game = null;

function t(key, replacements = {}) {
  let text = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS.en[key] || key;
  Object.keys(replacements).forEach(k => { text = text.replace(`{${k}}`, replacements[k]); });
  return text;
}

function applyLanguage() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
  document.body.style.fontFamily = currentLang === 'fa' ? "'Vazirmatn', Tahoma, sans-serif" : "'Inter', system-ui, sans-serif";
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.textContent = t('lang_label');
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('snake_ksgp_lang', lang);
  document.getElementById('lang-select').value = lang;
  applyLanguage();
}

async function loadUser() {
  try {
    const res = await fetch('/api/me', { credentials: 'include' });
    const data = await res.json();
    if (data.authenticated) {
      user = data.user;
      showGameScreen();
    } else {
      document.getElementById('login-screen').classList.remove('hidden');
      document.getElementById('game-screen').classList.add('hidden');
    }
  } catch (e) {
    document.getElementById('login-screen').classList.remove('hidden');
  }
}

function showGameScreen() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-pic').src = user.picture || 'https://via.placeholder.com/48';
  document.getElementById('ksgp-amount').textContent = Number(user.ksgp).toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (user.isAdmin) {
    document.getElementById('admin-btn').classList.remove('hidden');
    document.getElementById('admin-btn').onclick = () => location.href = '/admin.html';
  }
  applyLanguage();
  updateStartUI();
}

function updateStartUI() {
  const startBtn = document.getElementById('start-btn');
  const contBtn = document.getElementById('continue-saved-btn');
  if (!startBtn) return;
  startBtn.textContent = t('start');
  startBtn.onclick = () => startLevel(user.currentLevel || 1);
  if (user.hasSavedGame && contBtn) {
    contBtn.classList.remove('hidden');
    contBtn.textContent = t('continue_saved');
    contBtn.onclick = resumeSavedGame;
  } else if (contBtn) {
    contBtn.classList.add('hidden');
  }
}

async function resumeSavedGame() {
  try {
    const res = await fetch('/api/game/saved', { credentials: 'include' });
    const data = await res.json();
    if (!data.savedGame) return;
    beginPlay(data.savedGame.level, data.savedGame);
  } catch (e) { console.error(e); }
}

function startLevel(levelNum) { beginPlay(levelNum, null); }

function beginPlay(levelNum, savedState) {
  document.getElementById('menu-area').classList.add('hidden');
  document.getElementById('play-area').classList.remove('hidden');
  document.getElementById('current-stage').textContent = levelNum;
  const cfg = getLevelConfig(levelNum);
  if (game) game.destroy();
  game = new SnakeGame(cfg, levelNum, savedState);
  game.start();
  const warn = document.getElementById('hazard-warn');
  if (warn) {
    if (cfg.hazards) { warn.classList.remove('hidden'); warn.textContent = t('hazard_warning'); }
    else warn.classList.add('hidden');
  }
}

class SnakeGame {
  constructor(config, levelNum, savedState = null) {
    this.config = config;
    this.levelNum = levelNum;
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = config.grid;
    this.cell = Math.floor(400 / this.gridSize);
    this.canvas.width = this.gridSize * this.cell;
    this.canvas.height = this.gridSize * this.cell;
    this.running = false;
    this.paused = false;
    this.interval = null;
    this.hazardInterval = null;
    this.hazards = [];
    if (savedState) {
      this.snake = savedState.snake;
      this.dir = savedState.dir || { x: 1, y: 0 };
      this.nextDir = { ...this.dir };
      this.food = savedState.food;
      this.obstacles = savedState.obstacles || [];
      this.score = savedState.score || 0;
      this.hazards = savedState.hazards || [];
      document.getElementById('run-score').textContent = this.score;
      if (!this.food) this.spawnFood();
    } else {
      this.snake = [{ x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) }];
      this.dir = { x: 1, y: 0 };
      this.nextDir = { x: 1, y: 0 };
      this.food = null;
      this.obstacles = [];
      this.score = 0;
      this.generateObstacles();
      this.spawnFood();
    }
    this.bindControls();
  }
  generateObstacles() {
    this.obstacles = [];
    for (let i = 0; i < this.config.obstacles; i++) {
      let pos;
      do {
        pos = { x: Math.floor(Math.random() * this.gridSize), y: Math.floor(Math.random() * this.gridSize) };
      } while (this.snake.some(s => s.x === pos.x && s.y === pos.y) || this.obstacles.some(o => o.x === pos.x && o.y === pos.y));
      this.obstacles.push(pos);
    }
  }
  spawnFood() {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * this.gridSize), y: Math.floor(Math.random() * this.gridSize) };
    } while (this.snake.some(s => s.x === pos.x && s.y === pos.y) || this.obstacles.some(o => o.x === pos.x && o.y === pos.y));
    this.food = pos;
  }
  spawnHazard() {
    if (!this.config.hazards) return;
    this.hazards.push({ x: Math.floor(Math.random() * this.gridSize), y: 0, speed: 0.15 + Math.random() * 0.2 });
  }
  bindControls() {
    this.keyHandler = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') this.setDir(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's') this.setDir(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a') this.setDir(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') this.setDir(1, 0);
      if (e.key === ' ') this.togglePause();
    };
    window.addEventListener('keydown', this.keyHandler);
    document.getElementById('btn-up').onclick = () => this.setDir(0, -1);
    document.getElementById('btn-down').onclick = () => this.setDir(0, 1);
    document.getElementById('btn-left').onclick = () => this.setDir(-1, 0);
    document.getElementById('btn-right').onclick = () => this.setDir(1, 0);
    let touchStart = null;
    this.canvas.addEventListener('touchstart', e => { touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
    this.canvas.addEventListener('touchend', e => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > Math.abs(dy)) this.setDir(dx > 0 ? 1 : -1, 0);
      else this.setDir(0, dy > 0 ? 1 : -1);
      touchStart = null;
    }, { passive: true });
  }
  setDir(x, y) {
    if (this.dir.x + x === 0 && this.dir.y + y === 0) return;
    this.nextDir = { x, y };
  }
  start() {
    this.running = true;
    this.paused = false;
    this.timeLeft = this.config.timeLimit || 60;
    this.updateTimerDisplay();
    this.interval = setInterval(() => this.tick(), this.config.speed);
    this.timerInterval = setInterval(() => this.tickTimer(), 1000);
    if (this.config.hazards) this.hazardInterval = setInterval(() => this.spawnHazard(), 900);
    this.draw();
  }

  tickTimer() {
    if (this.paused || !this.running) return;
    this.timeLeft--;
    this.updateTimerDisplay();
    if (this.timeLeft <= 0) {
      this.gameOver(false); // time up = fail
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
    document.getElementById('pause-btn').textContent = this.paused ? t('resume') : t('pause');
  }
  tick() {
    if (this.paused || !this.running) return;
    this.dir = { ...this.nextDir };
    const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };
    if (this.config.walls) {
      if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) return this.gameOver(false);
    } else {
      head.x = (head.x + this.gridSize) % this.gridSize;
      head.y = (head.y + this.gridSize) % this.gridSize;
    }
    if (this.snake.some(s => s.x === head.x && s.y === head.y) || this.obstacles.some(o => o.x === head.x && o.y === head.y)) return this.gameOver(false);
    for (const h of this.hazards) {
      if (Math.floor(h.x) === head.x && Math.floor(h.y) === head.y) return this.gameOver(false);
    }
    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      document.getElementById('run-score').textContent = this.score;
      this.spawnFood();
      if (this.score >= this.config.target) return this.gameOver(true);
    } else this.snake.pop();
    this.hazards.forEach(h => { h.y += h.speed; });
    this.hazards = this.hazards.filter(h => h.y < this.gridSize);
    for (const h of this.hazards) {
      const hx = Math.floor(h.x), hy = Math.floor(h.y);
      if (this.snake.some(s => s.x === hx && s.y === hy)) return this.gameOver(false);
    }
    this.draw();
  }
  draw() {
    const ctx = this.ctx, c = this.cell;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i <= this.gridSize; i++) {
      ctx.beginPath(); ctx.moveTo(i * c, 0); ctx.lineTo(i * c, this.canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * c); ctx.lineTo(this.canvas.width, i * c); ctx.stroke();
    }
    ctx.fillStyle = '#ff5252';
    this.obstacles.forEach(o => ctx.fillRect(o.x * c + 1, o.y * c + 1, c - 2, c - 2));
    ctx.fillStyle = '#81d4fa';
    this.hazards.forEach(h => {
      ctx.beginPath();
      ctx.arc(h.x * c + c / 2, h.y * c + c / 2, c / 2 - 1, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#00e676';
    ctx.beginPath();
    ctx.arc(this.food.x * c + c / 2, this.food.y * c + c / 2, c / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    this.snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#69f0ae' : '#00c853';
      ctx.fillRect(s.x * c + 1, s.y * c + 1, c - 2, c - 2);
    });
  }
  async gameOver(won) {
    this.running = false;
    clearInterval(this.interval);
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.hazardInterval) clearInterval(this.hazardInterval);
    if (!won) {
      const modal = document.getElementById('result-modal');
      document.getElementById('result-title').textContent = t('lose_title');
      document.getElementById('result-msg').textContent = t('lose_msg');
      document.getElementById('result-reward').textContent = '0 ksgp';
      modal.classList.remove('hidden');
      document.getElementById('result-ok').onclick = () => {
        modal.classList.add('hidden');
        beginPlay(this.levelNum, null);
      };
      return;
    }
    try {
      const res = await fetch('/api/game/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: this.levelNum, completed: true })
      });
      const data = await res.json();
      if (data.success) {
        user.ksgp = data.ksgp;
        user.currentLevel = data.currentLevel;
        document.getElementById('ksgp-amount').textContent = Number(data.ksgp).toLocaleString(undefined, { maximumFractionDigits: 0 });
      }
      const reward = data.earned || KSGP_PER_LEVEL;
      const modal = document.getElementById('result-modal');
      document.getElementById('result-title').textContent = t('win_title');
      document.getElementById('result-msg').textContent = t('win_msg', { reward: Number(reward).toLocaleString() });
      document.getElementById('result-reward').textContent = Number(reward).toLocaleString() + ' ksgp';
      modal.classList.remove('hidden');
      document.getElementById('result-ok').onclick = () => {
        modal.classList.add('hidden');
        if (this.levelNum >= TOTAL_LEVELS) {
          document.getElementById('play-area').classList.add('hidden');
          document.getElementById('menu-area').classList.remove('hidden');
          loadUser();
        } else {
          beginPlay(this.levelNum + 1, null);
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
    if (this.hazardInterval) clearInterval(this.hazardInterval);
    window.removeEventListener('keydown', this.keyHandler);
  }
}

document.getElementById('pause-btn').onclick = () => { if (game) game.togglePause(); };
document.getElementById('save-btn').onclick = async () => {
  if (!game || !game.running) return;
  game.paused = true;
  try {
    const res = await fetch('/api/game/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        level: game.levelNum, score: game.score, snake: game.snake, dir: game.dir,
        food: game.food, obstacles: game.obstacles, hazards: game.hazards
      })
    });
    const data = await res.json();
    if (data.success) {
      alert(t('saved_ok'));
      game.destroy();
      document.getElementById('play-area').classList.add('hidden');
      document.getElementById('menu-area').classList.remove('hidden');
      loadUser();
    }
  } catch (e) { game.paused = false; }
};
document.getElementById('stop-btn').onclick = () => {
  if (game) game.destroy();
  document.getElementById('play-area').classList.add('hidden');
  document.getElementById('menu-area').classList.remove('hidden');
  loadUser();
};
document.getElementById('lang-select').value = currentLang;
document.getElementById('lang-select').addEventListener('change', e => setLanguage(e.target.value));
applyLanguage();
loadUser();
