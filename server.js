require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'shapyaar@google.com').toLowerCase();

// ---------- ذخیره داده (فایل JSON - برای Render ephemeral است، در پروداکشن MongoDB پیشنهاد می‌شود) ----------
const DATA_FILE = path.join(__dirname, 'data', 'users.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ users: {} }, null, 2));
}

function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { users: {} };
  }
}

function saveUsers(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getOrCreateUser(profile) {
  const data = loadUsers();
  const email = (profile.emails && profile.emails[0] && profile.emails[0].value || '').toLowerCase();
  let user = Object.values(data.users).find(u => u.email === email);

  if (!user) {
    const id = uuidv4();
    user = {
      id,
      googleId: profile.id,
      email,
      name: profile.displayName || 'Player',
      picture: (profile.photos && profile.photos[0] && profile.photos[0].value) || '',
      ksgp: 0,
      currentLevel: 1,
      highestLevel: 1,
      totalScore: 0,
      gamesPlayed: 0,
      lastPlayed: null,
      savedGame: null,            // mid-game save state
      isAdmin: email === ADMIN_EMAIL,
      createdAt: new Date().toISOString()
    };
    data.users[id] = user;
    saveUsers(data);
  } else {
    // آپدیت عکس و نام
    user.name = profile.displayName || user.name;
    user.picture = (profile.photos && profile.photos[0] && profile.photos[0].value) || user.picture;
    user.isAdmin = email === ADMIN_EMAIL;
    data.users[user.id] = user;
    saveUsers(data);
  }
  return user;
}

// ---------- Passport Google ----------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL || '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  try {
    const user = getOrCreateUser(profile);
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const data = loadUsers();
  const user = data.users[id];
  done(null, user || null);
});

// ---------- Middleware ----------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'snake-ksgp-super-secret-change-me-32chars',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Auth Routes ----------
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/?error=auth' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

app.get('/api/me', (req, res) => {
  if (!req.user) return res.json({ authenticated: false });
  const u = req.user;
  res.json({
    authenticated: true,
    user: {
      id: u.id,
      name: u.name,
      email: u.email,
      picture: u.picture,
      ksgp: Number((u.ksgp || 0).toFixed(6)),
      currentLevel: u.currentLevel || 1,
      highestLevel: u.highestLevel || 1,
      totalScore: u.totalScore || 0,
      gamesPlayed: u.gamesPlayed || 0,
      lastPlayed: u.lastPlayed || null,
      hasSavedGame: !!(u.savedGame),
      savedGameInfo: u.savedGame ? {
        level: u.savedGame.level,
        score: u.savedGame.score,
        savedAt: u.savedGame.savedAt
      } : null,
      isAdmin: !!u.isAdmin,
      createdAt: u.createdAt
    }
  });
});

// ---------- Game API ----------
// Save mid-game state (so user can continue later)
app.post('/api/game/save', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });

  const { level, score, snake, dir, food, obstacles } = req.body;
  if (typeof level !== 'number' || typeof score !== 'number' || !Array.isArray(snake)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const data = loadUsers();
  const user = data.users[req.user.id];
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.savedGame = {
    level,
    score,
    snake,
    dir: dir || { x: 1, y: 0 },
    food,
    obstacles: obstacles || [],
    savedAt: new Date().toISOString()
  };
  user.lastPlayed = new Date().toISOString();
  data.users[user.id] = user;
  saveUsers(data);

  res.json({ success: true, message: 'Game saved' });
});

// Load saved game state
app.get('/api/game/saved', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });
  const data = loadUsers();
  const user = data.users[req.user.id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ savedGame: user.savedGame || null });
});

// Clear saved game (after finishing or starting new)
app.post('/api/game/clear-save', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });
  const data = loadUsers();
  const user = data.users[req.user.id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.savedGame = null;
  data.users[user.id] = user;
  saveUsers(data);
  res.json({ success: true });
});

// Save result of a finished run / level complete
app.post('/api/game/result', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });

  const { level, score, completed } = req.body;
  if (typeof level !== 'number' || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const data = loadUsers();
  const user = data.users[req.user.id];
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Each point = 0.000001 ksgp
  const earned = score * 0.000001;
  user.ksgp = Number(((user.ksgp || 0) + earned).toFixed(6));
  user.totalScore = (user.totalScore || 0) + score;
  user.gamesPlayed = (user.gamesPlayed || 0) + 1;
  user.lastPlayed = new Date().toISOString();
  user.savedGame = null; // clear mid-game save after finishing

  if (completed && level >= (user.currentLevel || 1)) {
    user.currentLevel = Math.min(level + 1, 10);
    user.highestLevel = Math.max(user.highestLevel || 1, user.currentLevel);

    if (level === 10) {
      user.ksgp = Number((user.ksgp + 1000).toFixed(6));
    }
  }

  data.users[user.id] = user;
  saveUsers(data);

  res.json({
    success: true,
    ksgp: user.ksgp,
    currentLevel: user.currentLevel,
    highestLevel: user.highestLevel,
    earned: Number(earned.toFixed(6)),
    bonus: (completed && level === 10) ? 1000 : 0
  });
});

// ---------- Admin API (full reports) ----------
app.get('/api/admin/users', (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin only' });
  }
  const data = loadUsers();
  const users = Object.values(data.users);
  const list = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    ksgp: Number((u.ksgp || 0).toFixed(6)),
    currentLevel: u.currentLevel || 1,
    highestLevel: u.highestLevel || 1,
    totalScore: u.totalScore || 0,
    gamesPlayed: u.gamesPlayed || 0,
    lastPlayed: u.lastPlayed || null,
    hasSavedGame: !!(u.savedGame),
    isAdmin: !!u.isAdmin,
    createdAt: u.createdAt
  }));

  // Summary stats for admin
  const summary = {
    totalUsers: users.length,
    totalKsgpDistributed: Number(users.reduce((s, u) => s + (u.ksgp || 0), 0).toFixed(6)),
    totalGamesPlayed: users.reduce((s, u) => s + (u.gamesPlayed || 0), 0),
    totalScoreAll: users.reduce((s, u) => s + (u.totalScore || 0), 0),
    usersWithSave: users.filter(u => u.savedGame).length,
    maxLevelReached: Math.max(0, ...users.map(u => u.highestLevel || 1))
  };

  res.json({ users: list, summary });
});

// ---------- Fallback ----------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`اسنک KSGP روی پورت ${PORT} اجرا شد`);
  console.log(`ادمین: ${ADMIN_EMAIL}`);
});
