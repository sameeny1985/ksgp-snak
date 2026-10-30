// ========== KSGP GAMES — Casino Jackpot ==========
const SYMBOL_EMOJI = {
  cherry: '🍒', lemon: '🍋', orange: '🍊', plum: '🟣',
  bell: '🔔', bar: '⬛', seven: '7️⃣', diamond: '💎'
};
const SYMBOL_COLOR = {
  cherry: '#ff1744', lemon: '#ffea00', orange: '#ff9100', plum: '#d500f9',
  bell: '#ffd600', bar: '#b0bec5', seven: '#00e676', diamond: '#00e5ff'
};

let jackpotBet = 1000;
let spinning = false;

async function openJackpot() {
  document.getElementById('menu-area').classList.add('hidden');
  document.getElementById('play-area').classList.add('hidden');
  let jp = document.getElementById('jackpot-area');
  if (!jp) {
    jp = document.createElement('div');
    jp.id = 'jackpot-area';
    jp.className = 'jackpot-area';
    jp.innerHTML = `
      <div class="jackpot-cabinet">
        <div class="jackpot-top">
          <div class="jackpot-marquee">★ KSGP JACKPOT ★</div>
          <div class="jackpot-balance">Balance: <span id="jp-bal">0</span> <span class="token">ksgp</span></div>
        </div>
        <div class="jackpot-window">
          <div class="reel" id="reel0"><div class="reel-symbol">❓</div></div>
          <div class="reel" id="reel1"><div class="reel-symbol">❓</div></div>
          <div class="reel" id="reel2"><div class="reel-symbol">❓</div></div>
        </div>
        <div class="jackpot-result" id="jp-result">Place your bet & pull the lever</div>
        <div class="jackpot-bets" id="jp-bets"></div>
        <button type="button" class="jackpot-lever" id="jp-spin">🎰 SPIN</button>
        <div class="jackpot-pay">
          <small>3× 💎×150 · 7️⃣×80 · ⬛×40 · 🔔×20 · others ×5–12 · 2-match smaller wins</small>
        </div>
        <button type="button" class="btn secondary" id="jp-back" style="width:100%;margin-top:12px;">Back to games</button>
      </div>`;
    document.getElementById('game-screen').appendChild(jp);
    document.getElementById('jp-spin').onclick = spinJackpot;
    document.getElementById('jp-back').onclick = () => {
      jp.classList.add('hidden');
      document.getElementById('menu-area').classList.remove('hidden');
      if (typeof loadUser === 'function') loadUser();
    };
    const bets = [100, 500, 1000, 5000, 10000, 50000];
    const box = document.getElementById('jp-bets');
    bets.forEach(b => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'jp-bet-btn' + (b === jackpotBet ? ' active' : '');
      btn.textContent = b.toLocaleString();
      btn.onclick = () => {
        jackpotBet = b;
        box.querySelectorAll('.jp-bet-btn').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
      };
      box.appendChild(btn);
    });
  }
  jp.classList.remove('hidden');
  if (typeof user !== 'undefined' && user) {
    document.getElementById('jp-bal').textContent = Number(user.ksgp || 0).toLocaleString();
  }
}

async function spinJackpot() {
  if (spinning) return;
  if (typeof user === 'undefined' || !user) return;
  if ((user.ksgp || 0) < jackpotBet) {
    document.getElementById('jp-result').textContent = 'Not enough ksgp for this bet';
    document.getElementById('jp-result').style.color = '#ff5252';
    return;
  }
  spinning = true;
  const spinBtn = document.getElementById('jp-spin');
  spinBtn.disabled = true;
  spinBtn.textContent = '…';
  document.getElementById('jp-result').textContent = 'Spinning…';
  document.getElementById('jp-result').style.color = '#ffd54f';

  // Visual spin animation
  const syms = Object.keys(SYMBOL_EMOJI);
  let ticks = 0;
  const anim = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      const s = syms[Math.floor(Math.random() * syms.length)];
      const el = document.querySelector('#reel' + i + ' .reel-symbol');
      if (el) {
        el.textContent = SYMBOL_EMOJI[s];
        el.style.color = SYMBOL_COLOR[s];
      }
    }
    ticks++;
    if (ticks > 18) clearInterval(anim);
  }, 80);

  try {
    const res = await fetch('/api/jackpot/spin', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bet: jackpotBet })
    });
    const data = await res.json();
    clearInterval(anim);
    if (!data.success) {
      document.getElementById('jp-result').textContent = data.error || 'Error';
      document.getElementById('jp-result').style.color = '#ff5252';
    } else {
      data.reels.forEach((s, i) => {
        const el = document.querySelector('#reel' + i + ' .reel-symbol');
        if (el) {
          el.textContent = SYMBOL_EMOJI[s] || s;
          el.style.color = SYMBOL_COLOR[s] || '#fff';
        }
      });
      user.ksgp = data.ksgp;
      document.getElementById('jp-bal').textContent = Number(data.ksgp).toLocaleString();
      const bal = document.getElementById('ksgp-amount');
      if (bal) bal.textContent = Number(data.ksgp).toLocaleString();
      if (data.win > 0) {
        document.getElementById('jp-result').textContent =
          '🎉 WIN +' + Number(data.win).toLocaleString() + ' ksgp (×' + data.mult + ')';
        document.getElementById('jp-result').style.color = '#69f0ae';
      } else {
        document.getElementById('jp-result').textContent =
          'No match — lost ' + Number(data.bet).toLocaleString() + ' ksgp';
        document.getElementById('jp-result').style.color = '#ff8a80';
      }
    }
  } catch (e) {
    clearInterval(anim);
    document.getElementById('jp-result').textContent = 'Network error';
    document.getElementById('jp-result').style.color = '#ff5252';
  }
  spinning = false;
  spinBtn.disabled = false;
  spinBtn.textContent = '🎰 SPIN';
}

window.openJackpot = openJackpot;