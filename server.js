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

const crypto = require('crypto');

// In-memory rate limits (per user id) — resets on process restart but still useful
const rateLimitMap = new Map(); // userId -> { count, windowStart, lastCompleteAt }
const GAME_TOKENS = new Map(); // userId -> { token, level, issuedAt }

function checkRateLimit(userId, maxPerWindow = 30, windowMs = 60000) {
  const now = Date.now();
  let e = rateLimitMap.get(userId);
  if (!e || now - e.windowStart > windowMs) {
    e = { count: 0, windowStart: now, lastCompleteAt: e ? e.lastCompleteAt : 0 };
  }
  e.count += 1;
  rateLimitMap.set(userId, e);
  if (e.count > maxPerWindow) return false;
  return true;
}

function minTimeBetweenCompletes(userId, minMs = 8000) {
  const e = rateLimitMap.get(userId);
  const now = Date.now();
  if (e && e.lastCompleteAt && (now - e.lastCompleteAt) < minMs) return false;
  return true;
}

function markComplete(userId) {
  const e = rateLimitMap.get(userId) || { count: 0, windowStart: Date.now(), lastCompleteAt: 0 };
  e.lastCompleteAt = Date.now();
  rateLimitMap.set(userId, e);
}

function issueGameToken(userId, level) {
  const token = crypto.randomBytes(24).toString('hex');
  GAME_TOKENS.set(userId, { token, level, issuedAt: Date.now() });
  // cleanup old tokens occasionally
  if (GAME_TOKENS.size > 5000) {
    const cutoff = Date.now() - 30 * 60 * 1000;
    for (const [k, v] of GAME_TOKENS) if (v.issuedAt < cutoff) GAME_TOKENS.delete(k);
  }
  return token;
}

function consumeGameToken(userId, token, level) {
  const entry = GAME_TOKENS.get(userId);
  if (!entry) return false;
  if (entry.token !== token) return false;
  if (entry.level !== level) return false;
  // token max age 20 minutes
  if (Date.now() - entry.issuedAt > 20 * 60 * 1000) {
    GAME_TOKENS.delete(userId);
    return false;
  }
  GAME_TOKENS.delete(userId); // one-time use
  return true;
}



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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ledger (
      id BIGSERIAL PRIMARY KEY,
      user_id UUID,
      email TEXT,
      action TEXT NOT NULL,
      detail JSONB,
      amount DOUBLE PRECISION DEFAULT 0,
      balance_after DOUBLE PRECISION,
      tx_hash TEXT,
      prev_hash TEXT,
      block_number INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  // migrate columns if table existed without them
  await pool.query(`ALTER TABLE ledger ADD COLUMN IF NOT EXISTS tx_hash TEXT`);
  await pool.query(`ALTER TABLE ledger ADD COLUMN IF NOT EXISTS prev_hash TEXT`);
  await pool.query(`ALTER TABLE ledger ADD COLUMN IF NOT EXISTS block_number INTEGER`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_ledger_user ON ledger (user_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_ledger_created ON ledger (created_at DESC)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_ledger_hash ON ledger (tx_hash)`);
  console.log('Database ready (KSGP GAMES + ledger chain)');
}

async function getLastLedgerHash() {
  const r = await pool.query(`SELECT tx_hash FROM ledger WHERE tx_hash IS NOT NULL ORDER BY id DESC LIMIT 1`);
  return r.rows[0] ? r.rows[0].tx_hash : 'GENESIS_KSGP_GAMES_0';
}

async function logActivity(userId, email, action, detail, amount, balanceAfter) {
  try {
    const prev = await getLastLedgerHash();
    const createdAt = new Date().toISOString();
    const payload = JSON.stringify({
      userId, email, action, detail: detail || {}, amount: amount || 0,
      balanceAfter, prev, createdAt
    });
    const txHash = crypto.createHash('sha256').update(payload).digest('hex');
    // block every 10 txs
    const cnt = await pool.query(`SELECT COUNT(*)::int AS c FROM ledger`);
    const blockNumber = Math.floor((cnt.rows[0].c) / 10) + 1;
    await pool.query(
      `INSERT INTO ledger (user_id, email, action, detail, amount, balance_after, tx_hash, prev_hash, block_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [userId || null, email || null, action, JSON.stringify(detail || {}), amount || 0, balanceAfter, txHash, prev, blockNumber]
    );
  } catch (e) {
    console.error('ledger write failed', e.message);
  }
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
  await logActivity(user.id, user.email, 'login', { name: user.name }, 0, user.ksgp);
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
    await logActivity(req.user.id, req.user.email, 'save_game', { level, score, gameType: req.body.gameType || 'unknown' }, 0, req.user.ksgp);
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


// Issue one-time token when player starts a stage (required to claim reward)
app.post('/api/game/start', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });
  if (!checkRateLimit(req.user.id, 60, 60000)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const level = user.currentLevel || 1;
    if (level > 1000) return res.status(400).json({ error: 'All stages completed' });
    const token = issueGameToken(user.id, level);
    res.json({ success: true, level, token, serverTime: Date.now() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/game/result', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });

  // Rate limit: max 20 complete attempts per minute
  if (!checkRateLimit(req.user.id, 20, 60000)) {
    return res.status(429).json({ error: 'Too many requests. Slow down.' });
  }
  // Minimum 8 seconds between successful claims (anti-bot spam)
  if (!minTimeBetweenCompletes(req.user.id, 8000)) {
    return res.status(429).json({ error: 'Too fast. Play the stage properly.' });
  }

  const { level, completed, token, durationMs } = req.body;
  if (typeof level !== 'number' || !completed) {
    return res.status(400).json({ error: 'Only successful completions are accepted' });
  }
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Missing game token. Start the stage from the game.' });
  }
  // Client-reported duration must be at least a few seconds (cannot be trusted alone but blocks silly bots)
  if (typeof durationMs === 'number' && durationMs < 5000) {
    return res.status(400).json({ error: 'Stage completed too quickly.' });
  }

  const TOTAL_LEVELS = 1000;
  const KSGP_PER_LEVEL = 10000; // 10,000 per stage

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

    // One-time server-issued token must match this user + level
    if (!consumeGameToken(user.id, token, level)) {
      return res.status(403).json({ error: 'Invalid or expired game token' });
    }

    markComplete(user.id);
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

    await logActivity(user.id, user.email, 'level_complete', {
      level, earned, game: 'stage'
    }, earned, newKsgp);

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

// ---------- Jackpot (server-side fair RNG) ----------
const JACKPOT_SYMBOLS = ['cherry', 'lemon', 'orange', 'plum', 'bell', 'bar', 'seven', 'diamond'];
const JACKPOT_BETS = [100, 500, 1000, 5000, 10000, 50000];

function jackpotPayout(reels, bet) {
  const [a, b, c] = reels;
  // 3 of a kind
  if (a === b && b === c) {
    const mult = {
      cherry: 5, lemon: 8, orange: 10, plum: 12,
      bell: 20, bar: 40, seven: 80, diamond: 150
    }[a] || 5;
    return { win: bet * mult, mult, kind: 'three' };
  }
  // 2 of a kind
  if (a === b || b === c || a === c) {
    const sym = a === b ? a : (b === c ? b : a);
    const mult = { cherry: 1.2, lemon: 1.3, orange: 1.5, plum: 1.6, bell: 2, bar: 2.5, seven: 3, diamond: 5 }[sym] || 1.2;
    return { win: Math.floor(bet * mult), mult, kind: 'two' };
  }
  return { win: 0, mult: 0, kind: 'none' };
}

app.post('/api/jackpot/spin', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });
  if (!checkRateLimit(req.user.id, 40, 60000)) {
    return res.status(429).json({ error: 'Too many spins' });
  }
  const bet = Number(req.body.bet);
  if (!JACKPOT_BETS.includes(bet)) {
    return res.status(400).json({ error: 'Invalid bet', allowed: JACKPOT_BETS });
  }
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if ((user.ksgp || 0) < bet) {
      return res.status(400).json({ error: 'Insufficient ksgp', balance: user.ksgp });
    }
    // Fair RNG
    const reels = [
      JACKPOT_SYMBOLS[crypto.randomInt(0, JACKPOT_SYMBOLS.length)],
      JACKPOT_SYMBOLS[crypto.randomInt(0, JACKPOT_SYMBOLS.length)],
      JACKPOT_SYMBOLS[crypto.randomInt(0, JACKPOT_SYMBOLS.length)]
    ];
    const { win, mult, kind } = jackpotPayout(reels, bet);
    const delta = win - bet;
    const newBal = (user.ksgp || 0) + delta;
    await updateUser(user.id, { ksgp: newBal, lastPlayed: new Date().toISOString() });
    await logActivity(user.id, user.email, win > 0 ? 'jackpot_win' : 'jackpot_lose', {
      bet, reels, win, mult, kind, delta
    }, delta, newBal);
    res.json({
      success: true,
      reels,
      bet,
      win,
      mult,
      kind,
      delta,
      ksgp: newBal
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Spin failed' });
  }
});

app.get('/api/jackpot/info', (req, res) => {
  res.json({
    symbols: JACKPOT_SYMBOLS,
    bets: JACKPOT_BETS,
    paytable: {
      three: { cherry: 5, lemon: 8, orange: 10, plum: 12, bell: 20, bar: 40, seven: 80, diamond: 150 },
      two: { cherry: 1.2, lemon: 1.3, orange: 1.5, plum: 1.6, bell: 2, bar: 2.5, seven: 3, diamond: 5 }
    }
  });
});

// User activity report
app.get('/api/me/history', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please login' });
  try {
    const r = await pool.query(
      `SELECT id, action, detail, amount, balance_after, created_at
       FROM ledger WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100`,
      [req.user.id]
    );
    res.json({ history: r.rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

// ---------- Admin ----------


// ---------- Public Blockchain Explorer ----------
app.get('/api/explorer/summary', async (req, res) => {
  try {
    const total = await pool.query(`SELECT COUNT(*)::int AS c FROM ledger`);
    const blocks = await pool.query(`SELECT COALESCE(MAX(block_number),0)::int AS b FROM ledger`);
    const last = await pool.query(`SELECT * FROM ledger ORDER BY id DESC LIMIT 1`);
    res.json({
      totalTransactions: total.rows[0].c,
      totalBlocks: blocks.rows[0].b,
      lastTx: last.rows[0] ? formatTx(last.rows[0]) : null
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/explorer/transactions', async (req, res) => {
  try {
    const limit = Math.min(100, parseInt(req.query.limit || '40', 10));
    const offset = Math.max(0, parseInt(req.query.offset || '0', 10));
    const action = req.query.action || null;
    const email = req.query.email || null;
    let q = `SELECT * FROM ledger WHERE 1=1`;
    const params = [];
    if (action) { params.push(action); q += ` AND action = $${params.length}`; }
    if (email) { params.push(email.toLowerCase()); q += ` AND email = $${params.length}`; }
    q += ` ORDER BY id DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`;
    params.push(limit, offset);
    const r = await pool.query(q, params);
    res.json({ transactions: r.rows.map(formatTx), limit, offset });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/explorer/tx/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let r;
    if (/^[0-9]+$/.test(id)) {
      r = await pool.query(`SELECT * FROM ledger WHERE id = $1`, [id]);
    } else {
      r = await pool.query(`SELECT * FROM ledger WHERE tx_hash = $1`, [id]);
    }
    if (!r.rows[0]) return res.status(404).json({ error: 'Transaction not found' });
    const tx = formatTx(r.rows[0]);
    // neighbors
    const prev = await pool.query(`SELECT id, tx_hash FROM ledger WHERE id < $1 ORDER BY id DESC LIMIT 1`, [r.rows[0].id]);
    const next = await pool.query(`SELECT id, tx_hash FROM ledger WHERE id > $1 ORDER BY id ASC LIMIT 1`, [r.rows[0].id]);
    res.json({
      transaction: tx,
      prevId: prev.rows[0] ? prev.rows[0].id : null,
      nextId: next.rows[0] ? next.rows[0].id : null,
      note: 'This record is hashed with SHA-256. Changing any field would break the chain hash link.'
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/explorer/blocks', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT block_number,
             COUNT(*)::int AS tx_count,
             MIN(created_at) AS first_at,
             MAX(created_at) AS last_at,
             (array_agg(tx_hash ORDER BY id DESC))[1] AS head_hash
      FROM ledger
      WHERE block_number IS NOT NULL
      GROUP BY block_number
      ORDER BY block_number DESC
      LIMIT 50
    `);
    res.json({
      blocks: r.rows.map(b => ({
        number: b.block_number,
        txCount: b.tx_count,
        firstAt: b.first_at,
        lastAt: b.last_at,
        headHash: b.head_hash
      }))
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/explorer/block/:num', async (req, res) => {
  try {
    const num = parseInt(req.params.num, 10);
    const r = await pool.query(
      `SELECT * FROM ledger WHERE block_number = $1 ORDER BY id ASC`,
      [num]
    );
    res.json({
      blockNumber: num,
      transactions: r.rows.map(formatTx)
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

function formatTx(row) {
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    action: row.action,
    detail: row.detail,
    amount: Number(row.amount) || 0,
    balanceAfter: row.balance_after != null ? Number(row.balance_after) : null,
    txHash: row.tx_hash,
    prevHash: row.prev_hash,
    blockNumber: row.block_number,
    createdAt: row.created_at
  };
}


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

// Admin ledger = private "blockchain" of all actions
app.get('/api/admin/ledger', async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin only' });
  }
  try {
    const email = req.query.email || null;
    const limit = Math.min(500, parseInt(req.query.limit || '200', 10));
    let r;
    if (email) {
      r = await pool.query(
        `SELECT * FROM ledger WHERE email = $1 ORDER BY created_at DESC LIMIT $2`,
        [email.toLowerCase(), limit]
      );
    } else {
      r = await pool.query(
        `SELECT * FROM ledger ORDER BY created_at DESC LIMIT $1`,
        [limit]
      );
    }
    const actions = r.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      email: row.email,
      action: row.action,
      detail: row.detail,
      amount: Number(row.amount) || 0,
      balanceAfter: row.balance_after != null ? Number(row.balance_after) : null,
      createdAt: row.created_at
    }));
    res.json({ chain: actions, count: actions.length });
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
      console.log(`KSGP GAMES on port ${PORT}`);
      console.log(`Admin: ${ADMIN_EMAIL}`);
      console.log(process.env.DATABASE_URL ? 'Using PostgreSQL (Neon)' : 'WARNING: No DATABASE_URL');
    });
  })
  .catch((err) => {
    console.error('DB init failed:', err);
    process.exit(1);
  });
