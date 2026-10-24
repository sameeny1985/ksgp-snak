// ========== Snake KSGP - Full game logic + i18n ==========

const TRANSLATIONS = {
  en: {
    title: "Snake",
    subtitle: "Classic snake game with ksgp token scores",
    info1: "Each point = 0.000001 ksgp",
    info2: "Complete final stage = 1000 ksgp",
    login_btn: "Sign in with Google",
    login_note: "Click the button to choose from your Google accounts",
    balance: "Balance:",
    admin: "Admin",
    logout: "Logout",
    select_level: "Select Level",
    level_hint: "Locked levels unlock by completing previous ones. Level 10 is extremely hard!",
    level: "Level:",
    score: "Score:",
    round_ksgp: "Round ksgp:",
    pause: "Pause",
    resume: "Resume",
    back: "Back to levels",
    result: "Result",
    earned: "Earned ksgp:",
    bonus: "🎉 Final stage bonus: +1000 ksgp",
    ok: "OK",
    win_title: "🎉 Well done! Level completed",
    lose_title: "💀 Game Over",
    win_msg: "You reached the target of {target} points!",
    lose_msg: "Try again",
    lang_label: "Language:",
    my_panel: "My Panel",
    save_exit: "Save & Exit",
    saved_ok: "Game saved! Continue later from My Panel.",
    continue_saved: "Continue saved game",
    level_names: ["Easy", "Beginner", "Medium", "Challenge", "Hard", "Very Hard", "Pro", "Master", "Genius", "Legendary 💀"]
  },
  fa: {
    title: "اسنک",
    subtitle: "بازی مار کلاسیک با امتیاز توکن ksgp",
    info1: "هر امتیاز = ۰.۰۰۰۰۰۱ ksgp",
    info2: "تکمیل مرحله آخر = ۱۰۰۰ ksgp",
    login_btn: "ورود با حساب گوگل",
    login_note: "با کلیک روی دکمه، از بین حساب‌های گوگل خود انتخاب کنید",
    balance: "موجودی:",
    admin: "پنل ادمین",
    logout: "خروج",
    select_level: "انتخاب مرحله",
    level_hint: "مراحل قفل‌شده با تکمیل مرحله قبلی باز می‌شوند. مرحله ۱۰ بسیار سخت است!",
    level: "مرحله:",
    score: "امتیاز:",
    round_ksgp: "ksgp این دور:",
    pause: "توقف",
    resume: "ادامه",
    back: "بازگشت به مراحل",
    result: "نتیجه",
    earned: "ksgp کسب‌شده:",
    bonus: "🎉 جایزه مرحله آخر: +۱۰۰۰ ksgp",
    ok: "باشه",
    win_title: "🎉 آفرین! سطح کامل شد",
    lose_title: "💀 بازی تمام شد",
    win_msg: "به هدف {target} امتیاز رسیدی!",
    lose_msg: "دوباره تلاش کن",
    lang_label: "زبان:",
    my_panel: "پنل من",
    save_exit: "ذخیره و خروج",
    saved_ok: "بازی ذخیره شد! بعداً از پنل من ادامه بده.",
    continue_saved: "ادامه بازی ذخیره‌شده",
    level_names: ["آسان", "مبتدی", "متوسط", "چالش", "سخت", "خیلی سخت", "حرفه‌ای", "استاد", "نابغه", "افسانه‌ای 💀"]
  },
  nl: {
    title: "Slang",
    subtitle: "Klassiek slangenspel met ksgp-tokenscores",
    info1: "Elk punt = 0.000001 ksgp",
    info2: "Voltooi laatste fase = 1000 ksgp",
    login_btn: "Inloggen met Google",
    login_note: "Klik op de knop om een Google-account te kiezen",
    balance: "Saldo:",
    admin: "Beheer",
    logout: "Uitloggen",
    select_level: "Selecteer niveau",
    level_hint: "Vergrendelde niveaus openen door vorige te voltooien. Niveau 10 is extreem moeilijk!",
    level: "Niveau:",
    score: "Score:",
    round_ksgp: "Ronde ksgp:",
    pause: "Pauze",
    resume: "Hervatten",
    back: "Terug naar niveaus",
    result: "Resultaat",
    earned: "Verdiende ksgp:",
    bonus: "🎉 Bonus laatste fase: +1000 ksgp",
    ok: "OK",
    win_title: "🎉 Goed gedaan! Niveau voltooid",
    lose_title: "💀 Game Over",
    win_msg: "Je hebt het doel van {target} punten bereikt!",
    lose_msg: "Probeer opnieuw",
    lang_label: "Taal:",
    my_panel: "Mijn paneel",
    save_exit: "Opslaan & afsluiten",
    saved_ok: "Spel opgeslagen! Ga later verder via Mijn paneel.",
    continue_saved: "Opgeslagen spel hervatten",
    level_names: ["Makkelijk", "Beginner", "Gemiddeld", "Uitdaging", "Moeilijk", "Zeer moeilijk", "Pro", "Meester", "Genie", "Legendarisch 💀"]
  },
  fr: {
    title: "Serpent",
    subtitle: "Jeu de serpent classique avec scores en jetons ksgp",
    info1: "Chaque point = 0.000001 ksgp",
    info2: "Terminer le dernier niveau = 1000 ksgp",
    login_btn: "Se connecter avec Google",
    login_note: "Cliquez sur le bouton pour choisir parmi vos comptes Google",
    balance: "Solde :",
    admin: "Admin",
    logout: "Déconnexion",
    select_level: "Choisir un niveau",
    level_hint: "Les niveaux verrouillés s'ouvrent en terminant les précédents. Le niveau 10 est extrêmement difficile !",
    level: "Niveau :",
    score: "Score :",
    round_ksgp: "ksgp de la manche :",
    pause: "Pause",
    resume: "Reprendre",
    back: "Retour aux niveaux",
    result: "Résultat",
    earned: "ksgp gagnés :",
    bonus: "🎉 Bonus du dernier niveau : +1000 ksgp",
    ok: "OK",
    win_title: "🎉 Bravo ! Niveau terminé",
    lose_title: "💀 Game Over",
    win_msg: "Vous avez atteint l'objectif de {target} points !",
    lose_msg: "Réessayez",
    lang_label: "Langue :",
    my_panel: "Mon panneau",
    save_exit: "Sauvegarder et quitter",
    saved_ok: "Partie sauvegardée ! Continuez plus tard depuis Mon panneau.",
    continue_saved: "Continuer la partie sauvegardée",
    level_names: ["Facile", "Débutant", "Moyen", "Défi", "Difficile", "Très difficile", "Pro", "Maître", "Génie", "Légendaire 💀"]
  },
  de: {
    title: "Schlange",
    subtitle: "Klassisches Schlangenspiel mit ksgp-Token-Punkten",
    info1: "Jeder Punkt = 0.000001 ksgp",
    info2: "Letzte Stufe abschließen = 1000 ksgp",
    login_btn: "Mit Google anmelden",
    login_note: "Klicke auf den Button, um aus deinen Google-Konten zu wählen",
    balance: "Guthaben:",
    admin: "Admin",
    logout: "Abmelden",
    select_level: "Level wählen",
    level_hint: "Gesperrte Level werden durch Abschluss der vorherigen freigeschaltet. Level 10 ist extrem schwer!",
    level: "Level:",
    score: "Punkte:",
    round_ksgp: "Runden-ksgp:",
    pause: "Pause",
    resume: "Weiter",
    back: "Zurück zu den Levels",
    result: "Ergebnis",
    earned: "Verdiente ksgp:",
    bonus: "🎉 Bonus der letzten Stufe: +1000 ksgp",
    ok: "OK",
    win_title: "🎉 Gut gemacht! Level abgeschlossen",
    lose_title: "💀 Game Over",
    win_msg: "Du hast das Ziel von {target} Punkten erreicht!",
    lose_msg: "Versuch es nochmal",
    lang_label: "Sprache:",
    my_panel: "Mein Panel",
    save_exit: "Speichern & Beenden",
    saved_ok: "Spiel gespeichert! Später über Mein Panel fortsetzen.",
    continue_saved: "Gespeichertes Spiel fortsetzen",
    level_names: ["Einfach", "Anfänger", "Mittel", "Herausforderung", "Schwer", "Sehr schwer", "Profi", "Meister", "Genie", "Legendär 💀"]
  }
};

const LEVELS = [
  { speed: 180, grid: 20, walls: false, obstacles: 0, target: 5 },
  { speed: 150, grid: 20, walls: false, obstacles: 0, target: 8 },
  { speed: 130, grid: 18, walls: false, obstacles: 2, target: 10 },
  { speed: 110, grid: 18, walls: true,  obstacles: 3, target: 12 },
  { speed: 95,  grid: 16, walls: true,  obstacles: 4, target: 15 },
  { speed: 80,  grid: 16, walls: true,  obstacles: 6, target: 18 },
  { speed: 70,  grid: 14, walls: true,  obstacles: 8, target: 20 },
  { speed: 60,  grid: 14, walls: true,  obstacles: 10, target: 22 },
  { speed: 50,  grid: 12, walls: true,  obstacles: 12, target: 25 },
  { speed: 38,  grid: 12, walls: true,  obstacles: 16, target: 30 }
];

let currentLang = localStorage.getItem('snake_ksgp_lang') || 'en';
let user = null;
let currentLevelIndex = 0;
let game = null;

function t(key, replacements = {}) {
  let text = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS.en[key] || key;
  Object.keys(replacements).forEach(k => {
    text = text.replace(`{${k}}`, replacements[k]);
  });
  return text;
}

function applyLanguage() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
  document.body.style.fontFamily = currentLang === 'fa'
    ? "'Vazirmatn', Tahoma, sans-serif"
    : "'Inter', system-ui, sans-serif";

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Special cases
  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.textContent = t('lang_label');

  // Pause button may be "Resume"
  const pauseBtn = document.getElementById('pause-btn');
  if (pauseBtn && game && game.paused) {
    pauseBtn.textContent = t('resume');
  }

  // Update level buttons titles if needed
  renderLevels();
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('snake_ksgp_lang', lang);
  document.getElementById('lang-select').value = lang;
  applyLanguage();
}

// ---------- User load ----------
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
    console.error(e);
    document.getElementById('login-screen').classList.remove('hidden');
  }
}

function showGameScreen() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');

  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-pic').src = user.picture || 'https://via.placeholder.com/48';
  document.getElementById('ksgp-amount').textContent = user.ksgp.toFixed(6);

  if (user.isAdmin) {
    document.getElementById('admin-btn').classList.remove('hidden');
    document.getElementById('admin-btn').onclick = () => location.href = '/admin.html';
  }

  applyLanguage();
  renderLevels();

  // Offer continue if saved game exists
  if (user.hasSavedGame) {
    const cont = document.createElement('button');
    cont.className = 'btn';
    cont.style.marginTop = '12px';
    cont.style.width = '100%';
    cont.textContent = t('continue_saved');
    cont.onclick = () => resumeSavedGame();
    const hint = document.querySelector('.level-hint');
    if (hint && !document.getElementById('continue-saved-btn')) {
      cont.id = 'continue-saved-btn';
      hint.parentNode.insertBefore(cont, hint.nextSibling);
    }
  }
}

async function resumeSavedGame() {
  try {
    const res = await fetch('/api/game/saved', { credentials: 'include' });
    const data = await res.json();
    if (!data.savedGame) {
      alert('No saved game');
      return;
    }
    const sg = data.savedGame;
    const idx = sg.level - 1;
    if (idx < 0 || idx >= LEVELS.length) return;

    currentLevelIndex = idx;
    document.querySelector('.level-select').classList.add('hidden');
    document.getElementById('play-area').classList.remove('hidden');
    document.getElementById('current-level').textContent = sg.level;

    if (game) game.destroy();
    game = new SnakeGame(LEVELS[idx], sg.level, sg); // pass saved state
    game.start();
  } catch (e) {
    console.error(e);
  }
}

function renderLevels() {
  const container = document.getElementById('levels');
  if (!container) return;
  container.innerHTML = '';
  const names = t('level_names');
  LEVELS.forEach((lvl, i) => {
    const btn = document.createElement('button');
    btn.className = 'level-btn';
    btn.textContent = i + 1;
    btn.title = names[i] || `Level ${i + 1}`;
    const unlocked = user ? (i + 1) <= user.currentLevel : false;
    if (unlocked) {
      btn.classList.add('unlocked');
      if (user && i + 1 === user.currentLevel) btn.classList.add('current');
      btn.onclick = () => startLevel(i);
    } else {
      btn.disabled = true;
      btn.title = (names[i] || '') + ' 🔒';
    }
    container.appendChild(btn);
  });
}

function startLevel(index) {
  currentLevelIndex = index;
  document.querySelector('.level-select').classList.add('hidden');
  document.getElementById('play-area').classList.remove('hidden');
  document.getElementById('current-level').textContent = index + 1;

  if (game) game.destroy();
  game = new SnakeGame(LEVELS[index], index + 1);
  game.start();
}

document.getElementById('back-btn').onclick = () => {
  if (game) game.destroy();
  document.getElementById('play-area').classList.add('hidden');
  document.querySelector('.level-select').classList.remove('hidden');
  loadUser();
};

document.getElementById('pause-btn').onclick = () => {
  if (game) game.togglePause();
};

document.getElementById('save-btn').onclick = async () => {
  if (!game || !game.running) return;
  game.paused = true;
  try {
    const res = await fetch('/api/game/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        level: game.levelNum,
        score: game.score,
        snake: game.snake,
        dir: game.dir,
        food: game.food,
        obstacles: game.obstacles
      })
    });
    const data = await res.json();
    if (data.success) {
      alert(t('saved_ok'));
      game.destroy();
      document.getElementById('play-area').classList.add('hidden');
      document.querySelector('.level-select').classList.remove('hidden');
      loadUser();
    }
  } catch (e) {
    console.error(e);
    alert('Save failed');
    game.paused = false;
  }
};

// ---------- Snake Game Class ----------
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
    this.completed = false;

    if (savedState) {
      // Resume from saved state
      this.snake = savedState.snake || [{ x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) }];
      this.dir = savedState.dir || { x: 1, y: 0 };
      this.nextDir = { ...this.dir };
      this.food = savedState.food;
      this.obstacles = savedState.obstacles || [];
      this.score = savedState.score || 0;
      document.getElementById('score').textContent = this.score;
      document.getElementById('round-ksgp').textContent = (this.score * 0.000001).toFixed(6);
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
        pos = {
          x: Math.floor(Math.random() * this.gridSize),
          y: Math.floor(Math.random() * this.gridSize)
        };
      } while (
        this.snake.some(s => s.x === pos.x && s.y === pos.y) ||
        this.obstacles.some(o => o.x === pos.x && o.y === pos.y)
      );
      this.obstacles.push(pos);
    }
  }

  spawnFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
    } while (
      this.snake.some(s => s.x === pos.x && s.y === pos.y) ||
      this.obstacles.some(o => o.x === pos.x && o.y === pos.y)
    );
    this.food = pos;
  }

  bindControls() {
    this.keyHandler = (e) => {
      const key = e.key;
      if (key === 'ArrowUp' || key === 'w') this.setDir(0, -1);
      if (key === 'ArrowDown' || key === 's') this.setDir(0, 1);
      if (key === 'ArrowLeft' || key === 'a') this.setDir(-1, 0);
      if (key === 'ArrowRight' || key === 'd') this.setDir(1, 0);
      if (key === ' ') this.togglePause();
    };
    window.addEventListener('keydown', this.keyHandler);

    document.getElementById('btn-up').onclick = () => this.setDir(0, -1);
    document.getElementById('btn-down').onclick = () => this.setDir(0, 1);
    document.getElementById('btn-left').onclick = () => this.setDir(-1, 0);
    document.getElementById('btn-right').onclick = () => this.setDir(1, 0);

    let touchStart = null;
    this.canvas.addEventListener('touchstart', e => {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    this.canvas.addEventListener('touchend', e => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        this.setDir(dx > 0 ? 1 : -1, 0);
      } else {
        this.setDir(0, dy > 0 ? 1 : -1);
      }
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
    this.interval = setInterval(() => this.tick(), this.config.speed);
    this.draw();
  }

  togglePause() {
    if (!this.running) return;
    this.paused = !this.paused;
    const btn = document.getElementById('pause-btn');
    btn.textContent = this.paused ? t('resume') : t('pause');
  }

  tick() {
    if (this.paused || !this.running) return;

    this.dir = { ...this.nextDir };
    const head = {
      x: this.snake[0].x + this.dir.x,
      y: this.snake[0].y + this.dir.y
    };

    if (this.config.walls) {
      if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
        return this.gameOver(false);
      }
    } else {
      head.x = (head.x + this.gridSize) % this.gridSize;
      head.y = (head.y + this.gridSize) % this.gridSize;
    }

    if (
      this.snake.some(s => s.x === head.x && s.y === head.y) ||
      this.obstacles.some(o => o.x === head.x && o.y === head.y)
    ) {
      return this.gameOver(false);
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      document.getElementById('score').textContent = this.score;
      document.getElementById('round-ksgp').textContent = (this.score * 0.000001).toFixed(6);
      this.spawnFood();

      if (this.score >= this.config.target) {
        return this.gameOver(true);
      }
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const c = this.cell;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i <= this.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * c, 0);
      ctx.lineTo(i * c, this.canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * c);
      ctx.lineTo(this.canvas.width, i * c);
      ctx.stroke();
    }

    ctx.fillStyle = '#ff5252';
    this.obstacles.forEach(o => {
      ctx.fillRect(o.x * c + 1, o.y * c + 1, c - 2, c - 2);
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
    this.completed = won;

    try {
      const res = await fetch('/api/game/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          level: this.levelNum,
          score: this.score,
          completed: won
        })
      });
      const data = await res.json();
      if (data.success) {
        user.ksgp = data.ksgp;
        user.currentLevel = data.currentLevel;
        user.highestLevel = data.highestLevel;
        document.getElementById('ksgp-amount').textContent = data.ksgp.toFixed(6);
      }

      const modal = document.getElementById('result-modal');
      document.getElementById('result-title').textContent = won ? t('win_title') : t('lose_title');
      document.getElementById('result-msg').textContent = won
        ? t('win_msg', { target: this.config.target })
        : t('lose_msg');
      document.getElementById('result-score').textContent = this.score;
      document.getElementById('result-earned').textContent = (this.score * 0.000001).toFixed(6) + ' ksgp';

      const bonusEl = document.getElementById('result-bonus');
      if (data.bonus && data.bonus > 0) {
        bonusEl.classList.remove('hidden');
        bonusEl.textContent = t('bonus');
      } else {
        bonusEl.classList.add('hidden');
      }

      modal.classList.remove('hidden');
      document.getElementById('result-ok').onclick = () => {
        modal.classList.add('hidden');
        document.getElementById('play-area').classList.add('hidden');
        document.querySelector('.level-select').classList.remove('hidden');
        renderLevels();
      };
    } catch (e) {
      console.error(e);
      alert('Error saving result');
    }
  }

  destroy() {
    this.running = false;
    clearInterval(this.interval);
    window.removeEventListener('keydown', this.keyHandler);
  }
}

// Init language selector
document.getElementById('lang-select').value = currentLang;
document.getElementById('lang-select').addEventListener('change', (e) => {
  setLanguage(e.target.value);
});

// Start
applyLanguage();
loadUser();
