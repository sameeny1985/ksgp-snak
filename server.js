require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'shapyaar@gmail.com').toLowerCase();

// ---------- PostgreSQL (Neon) ----------
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set. Add your Neon connection string in Render env vars.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      google_id TEXT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      picture TEXT,
      ksgp DOUBLE PRECISION DEFAULT 0,
      current_level INTEGER DEFAULT 1,
      highest_level INTEGER DEFAULT 1,
      total_score INTEGER DEFAULT 0,
      games_played INTEGER DEFAULT 0,
      last_played TIMESTAMPTZ,
      saved_game JSONB,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  // session table for connect-pg-simple
  await pool.query(`
    CREATE TABLE IF NOT EXISTS session (
      sid VARCHAR NOT NULL PRIMARY KEY,
      sess JSON NOT NULL,
      expire TIMESTAMP(6) NOT NULL
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);`);
  console.log('Database ready');
}

function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    googleId: row.google_id,
    email: row.email,
    name: row.name,
    picture: row.picture || '',
    ksgp: Number(row.ksgp) || 0,
    currentLevel: row.current_level || 1,
    highestLevel: row.highest_level || 1,
    totalScore: row.total_score || 0,
    gamesPlayed: row.games_played || 0,
    lastPlayed: row.last_played ? row.last_played.toISOString() : null,
    savedGame: row.saved_game || null,
    isAdmin: !!row.is_admin,
    createdAt: row.created_at ? row.created_at.toISOString() : null
  };
}

async function findUserByEmail(email) {
  const r = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  return rowToUser(r.rows[0]);
}

async function findUserById(id) {
  const r = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rowToUser(r.rows[0]);
}

async function getOrCreateUser(profile) {
  const email = (profile.emails && profile.emails[0] && profile.emails[0].value || '').toLowerCase();
  let user = await findUserByEmail(email);
  const isAdmin = email === ADMIN_EMAIL;
  const name = profile.displayName || 'Player';
  const picture = (profile.photos && profile.photos[0] && profile.photos[0].value) || '';

  if (!user) {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO users (id, google_id, email, name, picture, is_admin)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, profile.id, email, name, picture, isAdmin]
    );
    user = await findUserById(id);
  } else {
    await pool.query(
      `UPDATE users SET name = $1, picture = $2, google_id = $3, is_admin = $4 WHERE id = $5`,
      [name, picture, profile.id, isAdmin, user.id]
    );
    user = await findUserById(user.id);
  }
  return user;
}

async function updateUser(id, fields) {
  const map = {
    ksgp: 'ksgp',
    currentLevel: 'current_level',
    highestLevel: 'highest_level',
    totalScore: 'total_score',
    gamesPlayed: 'games_played',
    lastPlayed: 'last_played',
    savedGame: 'saved_game',
    isAdmin: 'is_admin'
  };
  const sets = [];
  const vals = [];
  let i = 1;
  for (const [k, col] of Object.entries(map)) {
    if (fields[k] !== undefined) {
      sets.push(`${col} = $${i++}`);
      vals.push(k === 'savedGame' ? (fields[k] === null ? null : JSON.stringify(fields[k])) : fields[k]);
    }
  }
  if (!sets.length) return;
  vals.push(id);
  await pool.query(`UPDATE users SET ${sets.join(', ')} WHERE id = $${i}`, vals);
}

// ---------- Passport ----------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL || '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await getOrCreateUser(profile);
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

// ---------- Middleware ----------
app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'snake-ksgp-super-secret-change-me-32chars',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true
  }
};

if (process.env.DATABASE_URL) {
  sessionConfig.store = new pgSession({
    pool,
    tableName: 'session',
    createTableIfMissing: true
  });
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Auth ----------
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/?error=auth' }),
  (req, res) => res.redirect('/')
);

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => res.redirect('/'));
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
      ksgp: Number(u.ksgp) || 0,
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
app.post('/api/game/save', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });
  const { level, score, snake, dir, food, obstacles, hazards } = req.body;
  if (typeof level !== 'number' || typeof score !== 'number' || !Array.isArray(snake)) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  try {
    const savedGame = {
      level, score, snake,
      dir: dir || { x: 1, y: 0 },
      food, obstacles: obstacles || [], hazards: hazards || [],
      savedAt: new Date().toISOString()
    };
    await updateUser(req.user.id, {
      savedGame,
      lastPlayed: new Date().toISOString()
    });
    res.json({ success: true, message: 'Game saved' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Save failed' });
  }
});

app.get('/api/game/saved', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });
  try {
    const user = await findUserById(req.user.id);
    res.json({ savedGame: user ? user.savedGame : null });
  } catch (e) {
    res.status(500).json({ error: 'Load failed' });
  }
});

app.post('/api/game/clear-save', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });
  try {
    await updateUser(req.user.id, { savedGame: null });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/game/result', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });

  const { level, completed } = req.body;
  if (typeof level !== 'number' || !completed) {
    return res.status(400).json({ error: 'Only successful completions are accepted' });
  }

  const TOTAL_LEVELS = 1000;
  const KSGP_PER_LEVEL = 100000;

  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const expected = user.currentLevel || 1;
    if (level !== expected) {
      return res.status(400).json({ error: 'Invalid level progress', expected });
    }
    if (level > TOTAL_LEVELS) {
      return res.status(400).json({ error: 'All stages already completed' });
    }

    const earned = KSGP_PER_LEVEL;
    const newKsgp = (user.ksgp || 0) + earned;
    const newCurrent = Math.min(level + 1, TOTAL_LEVELS + 1);
    const newHighest = Math.max(user.highestLevel || 1, newCurrent);

    await updateUser(user.id, {
      ksgp: newKsgp,
      totalScore: (user.totalScore || 0) + 1,
      gamesPlayed: (user.gamesPlayed || 0) + 1,
      lastPlayed: new Date().toISOString(),
      savedGame: null,
      currentLevel: newCurrent,
      highestLevel: newHighest
    });

    res.json({
      success: true,
      ksgp: newKsgp,
      currentLevel: newCurrent,
      highestLevel: newHighest,
      earned,
      bonus: 0
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Admin ----------
app.get('/api/admin/users', async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin only' });
  }
  try {
    const r = await pool.query('SELECT * FROM users ORDER BY ksgp DESC');
    const users = r.rows.map(rowToUser);
    const list = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      ksgp: Number(u.ksgp) || 0,
      currentLevel: u.currentLevel,
      highestLevel: u.highestLevel,
      totalScore: u.totalScore,
      gamesPlayed: u.gamesPlayed,
      lastPlayed: u.lastPlayed,
      hasSavedGame: !!(u.savedGame),
      isAdmin: u.isAdmin,
      createdAt: u.createdAt
    }));
    const summary = {
      totalUsers: users.length,
      totalKsgpDistributed: users.reduce((s, u) => s + (u.ksgp || 0), 0),
      totalGamesPlayed: users.reduce((s, u) => s + (u.gamesPlayed || 0), 0),
      totalScoreAll: users.reduce((s, u) => s + (u.totalScore || 0), 0),
      usersWithSave: users.filter(u => u.savedGame).length,
      maxLevelReached: Math.max(0, ...users.map(u => u.highestLevel || 1), 1)
    };
    res.json({ users: list, summary });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Snake KSGP on port ${PORT}`);
      console.log(`Admin: ${ADMIN_EMAIL}`);
      console.log(process.env.DATABASE_URL ? 'Using PostgreSQL (Neon)' : 'WARNING: No DATABASE_URL');
    });
  })
  .catch((err) => {
    console.error('DB init failed:', err);
    process.exit(1);
  });
