// ========== KSGP GAMES — Casino Jackpot 3×3 with real spin ==========
const SYMBOL_EMOJI = {
  cherry: '🍒', lemon: '🍋', orange: '🍊', plum: '🟣',
  bell: '🔔', bar: '⬛', seven: '7️⃣', diamond: '💎'
};
const SYMBOL_LIST = Object.keys(SYMBOL_EMOJI);
const SYMBOL_COLOR = {
  cherry: '#ff1744', lemon: '#ffea00', orange: '#ff9100', plum: '#d500f9',
  bell: '#ffd600', bar: '#b0bec5', seven: '#00e676', diamond: '#00e5ff'
};

let jackpotBet = 1000;
let spinning = false;

function stripHTML(symbols, highlightMid) {
  // symbols: [top, mid, bot]
  return symbols.map((s, i) => {
    const cls = i === 1 ? 'sym mid' : 'sym';
    const col = SYMBOL_COLOR[s] || '#fff';
    return `<div class="${cls}" style="color:${col}">${SYMBOL_EMOJI[s] || '❓'}</div>`;
  }).join('');
}

function randomSym() {
  return SYMBOL_LIST[Math.floor(Math.random() * SYMBOL_LIST.length)];
}

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
        <div class="jackpot-window jackpot-3x3">
          <div class="payline-label">PAY LINE</div>
          <div class="reel-col" id="col0"></div>
          <div class="reel-col" id="col1"></div>
          <div class="reel-col" id="col2"></div>
        </div>
        <div class="jackpot-result" id="jp-result">Middle row pays · Spin the reels!</div>
        <div class="jackpot-bets" id="jp-bets"></div>
        <button type="button" class="jackpot-lever" id="jp-spin">🎰 SPIN</button>
        <div class="jackpot-pay">
          <small>Pay line = middle row · 3× 💎×150 · 7️⃣×80 · ⬛×40 · 🔔×20 · 2-match smaller</small>
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
        if (window.SFX) SFX.click();
        jackpotBet = b;
        box.querySelectorAll('.jp-bet-btn').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
      };
      box.appendChild(btn);
    });
    // Initial reels
    for (let c = 0; c < 3; c++) {
      document.getElementById('col' + c).innerHTML = stripHTML([randomSym(), randomSym(), randomSym()]);
    }
  }
  jp.classList.remove('hidden');
  if (typeof user !== 'undefined' && user) {
    document.getElementById('jp-bal').textContent = Number(user.ksgp || 0).toLocaleString();
  }
}

function animateReelColumn(colEl, finalMid, duration, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      const start = performance.now();
      let last = 0;
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        // ease out
        const speed = 1 - t * t;
        if (now - last > 40 + t * 80) {
          last = now;
          const top = randomSym();
          const mid = t > 0.85 ? finalMid : randomSym();
          const bot = randomSym();
          colEl.innerHTML = stripHTML([top, mid, bot]);
          colEl.classList.add('spinning');
        }
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          // Final: top and bot random, mid = server result
          colEl.innerHTML = stripHTML([randomSym(), finalMid, randomSym()]);
          colEl.classList.remove('spinning');
          if (window.SFX) SFX.stop();
          resolve();
        }
      }
      requestAnimationFrame(frame);
    }, delay);
  });
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
  if (window.SFX) SFX.spin();

  // Optimistic visual spin while waiting for server
  const spinPromise = (async () => {
    try {
      const res = await fetch('/api/jackpot/spin', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bet: jackpotBet })
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'Network error' };
    }
  })();

  // Start column animations (staggered stop like real slots)
  const cols = [0, 1, 2].map(i => document.getElementById('col' + i));
  // Temporary random spin
  const tempAnim = setInterval(() => {
    cols.forEach(col => {
      col.innerHTML = stripHTML([randomSym(), randomSym(), randomSym()]);
      col.classList.add('spinning');
    });
  }, 60);

  const data = await spinPromise;
  clearInterval(tempAnim);

  if (!data.success) {
    cols.forEach(c => c.classList.remove('spinning'));
    document.getElementById('jp-result').textContent = data.error || 'Error';
    document.getElementById('jp-result').style.color = '#ff5252';
    spinning = false;
    spinBtn.disabled = false;
    spinBtn.textContent = '🎰 SPIN';
    return;
  }

  // Staggered settle: col0, col1, col2
  await animateReelColumn(cols[0], data.reels[0], 900, 0);
  await animateReelColumn(cols[1], data.reels[1], 1100, 150);
  await animateReelColumn(cols[2], data.reels[2], 1300, 300);

  user.ksgp = data.ksgp;
  document.getElementById('jp-bal').textContent = Number(data.ksgp).toLocaleString();
  const bal = document.getElementById('ksgp-amount');
  if (bal) bal.textContent = Number(data.ksgp).toLocaleString();

  if (data.win > 0) {
    if (window.SFX) SFX.jackpotWin();
    document.getElementById('jp-result').textContent =
      '🎉 WIN +' + Number(data.win).toLocaleString() + ' ksgp (×' + data.mult + ')';
    document.getElementById('jp-result').style.color = '#69f0ae';
    // Flash middle row
    document.querySelectorAll('.reel-col .sym.mid').forEach(el => {
      el.classList.add('win-flash');
      setTimeout(() => el.classList.remove('win-flash'), 1200);
    });
  } else {
    if (window.SFX) SFX.jackpotLose();
    document.getElementById('jp-result').textContent =
      'No match — lost ' + Number(data.bet).toLocaleString() + ' ksgp';
    document.getElementById('jp-result').style.color = '#ff8a80';
  }

  spinning = false;
  spinBtn.disabled = false;
  spinBtn.textContent = '🎰 SPIN';
}

window.openJackpot = openJackpot;
