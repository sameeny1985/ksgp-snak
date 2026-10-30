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
    hazard_warning: "⚠ Ice falling from above!",
    control_hint: "Tap or click inside the game area to change direction",
    rights: "All rights reserved by KSGP token",
    choose_game: "Choose a game",
    control_hint_snake: "Snake: tap/click in the play area to steer",
    control_hint_breakout: "Breakout: click left/right side to move the paddle (5 clicks to an edge)"
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
    hazard_warning: "⚠ یخ از بالا می‌بارد!",
    rights: "کلیه حقوق متعلق به توکن KSGP است"
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

const PROMO_HTML = {
  "en": "<p><strong>Dear user,</strong></p>\n<p>By playing this game you receive <strong>KSGP</strong> tokens. KSGP is a cryptocurrency token on the <strong>BSC (BNB Smart Chain)</strong> network, listed and viewable on <strong>BscScan</strong>.</p>\n<p>If the number of users of this game grows to a level acceptable to Binance exchange, with the support of the community the KSGP token can be listed on global exchanges — including <strong>Binance</strong>, the largest cryptocurrency exchange in the world. By playing, you earn KSGP tokens that are intended to be transferred to your digital wallet. When KSGP is listed, you will be able to sell your tokens.</p>\n<p>Please share this game with your friends. More users means a faster path toward listing and the chance to convert your KSGP into USD or EUR.</p>\n<p class=\"promo-sign\">Thank you<br>From the founder of the KSGP token and the manager of this site</p>",
  "fa": "<p><strong>کاربر عزیز،</strong></p>\n<p>شما با بازی در این بازی توکن‌های <strong>KSGP</strong> دریافت می‌کنید. KSGP یک توکن ارز دیجیتال در شبکه <strong>BSC</strong> است که در سایت <strong>BscScan</strong> لیست شده و قابل مشاهده است.</p>\n<p>اگر تعداد کاربران این بازی به حدی برسد که از نظر صرافی بایننس قابل قبول باشد، با حمایت کاربران توکن KSGP می‌تواند در صرافی‌های جهان از جمله <strong>بایننس</strong> (بزرگ‌ترین صرافی ارز دیجیتال جهان) لیست شود. شما با بازی کردن معادل توکن KSGP دریافت می‌کنید که در نهایت به کیف پول دیجیتال شما واریز خواهد شد و در زمان لیست شدن قادر به فروش خواهید بود.</p>\n<p>از معرفی این بازی به دوستان خود کوتاهی نکنید؛ بالا رفتن تعداد کاربران یعنی زودتر لیست شدن و نقد شدن توکن‌های KSGP شما به دلار و یورو.</p>\n<p class=\"promo-sign\">متشکرم<br>از طرف مدیر و فاندر توکن KSGP و مدیر این سایت</p>",
  "ar": "<p><strong>عزيزي المستخدم،</strong></p>\n<p>من خلال اللعب في هذه اللعبة تحصل على رموز <strong>KSGP</strong>. KSGP هو رمز عملة رقمية على شبكة <strong>BSC</strong> ومدرج على <strong>BscScan</strong>.</p>\n<p>إذا وصل عدد المستخدمين إلى مستوى مقبول لدى منصة Binance، يمكن إدراج KSGP في البورصات العالمية بما فيها <strong>Binance</strong>. الرموز التي تكسبها مخصصة للتحويل إلى محفظتك الرقمية، وعند الإدراج يمكنك بيعها.</p>\n<p>شارك اللعبة مع أصدقائك. المزيد من المستخدمين يعني طريقاً أسرع نحو الإدراج وتحويل KSGP إلى دولار أو يورو.</p>\n<p class=\"promo-sign\">شكراً<br>من مؤسس رمز KSGP ومدير هذا الموقع</p>",
  "tr": "<p><strong>Değerli kullanıcı,</strong></p>\n<p>Bu oyunu oynayarak <strong>KSGP</strong> token kazanırsınız. KSGP, <strong>BSC</strong> ağında bir kripto para tokenidir ve <strong>BscScan</strong> üzerinde görüntülenebilir.</p>\n<p>Kullanıcı sayısı Binance için kabul edilebilir bir seviyeye ulaşırsa, KSGP global borsalarda — dünyanın en büyük kripto borsası <strong>Binance</strong> dahil — listelenebilir. Kazandığınız tokenlar dijital cüzdanınıza aktarılması amaçlanan tokenlardır; listelendiğinde satabilirsiniz.</p>\n<p>Oyunu arkadaşlarınızla paylaşın. Daha fazla kullanıcı, listelenmeye ve KSGP’nizi USD/EUR’ye çevirmeye giden yolu hızlandırır.</p>\n<p class=\"promo-sign\">Teşekkürler<br>KSGP token kurucusu ve site yöneticisi</p>",
  "nl": "<p><strong>Beste gebruiker,</strong></p>\n<p>Door dit spel te spelen ontvang je <strong>KSGP</strong>-tokens. KSGP is een cryptotoken op het <strong>BSC</strong>-netwerk, zichtbaar op <strong>BscScan</strong>.</p>\n<p>Als het aantal gebruikers groot genoeg is voor Binance, kan KSGP op wereldwijde beurzen worden genoteerd — inclusief <strong>Binance</strong>. Je tokens zijn bedoeld voor overdracht naar je digitale wallet; na listing kun je ze verkopen.</p>\n<p>Deel het spel met vrienden. Meer gebruikers betekent een snellere weg naar listing en omzetting in USD of EUR.</p>\n<p class=\"promo-sign\">Bedankt<br>Oprichter van de KSGP-token en beheerder van deze site</p>",
  "fr": "<p><strong>Cher utilisateur,</strong></p>\n<p>En jouant à ce jeu vous recevez des jetons <strong>KSGP</strong>. KSGP est un jeton crypto sur le réseau <strong>BSC</strong>, visible sur <strong>BscScan</strong>.</p>\n<p>Si le nombre d’utilisateurs atteint un niveau acceptable pour Binance, KSGP pourra être listé sur les exchanges mondiaux, dont <strong>Binance</strong>. Les jetons gagnés sont destinés à être transférés vers votre portefeuille numérique ; une fois listés, vous pourrez les vendre.</p>\n<p>Partagez le jeu avec vos amis. Plus d’utilisateurs = un chemin plus rapide vers le listing et la conversion en USD ou EUR.</p>\n<p class=\"promo-sign\">Merci<br>Le fondateur du jeton KSGP et le responsable de ce site</p>",
  "de": "<p><strong>Lieber Nutzer,</strong></p>\n<p>Durch das Spielen erhältst du <strong>KSGP</strong>-Token. KSGP ist ein Krypto-Token im <strong>BSC</strong>-Netzwerk und auf <strong>BscScan</strong> einsehbar.</p>\n<p>Wenn die Nutzerzahl ein für Binance akzeptables Niveau erreicht, kann KSGP an globalen Börsen gelistet werden — einschließlich <strong>Binance</strong>. Deine Token sollen auf deine digitale Wallet übertragen werden; nach dem Listing kannst du sie verkaufen.</p>\n<p>Teile das Spiel mit Freunden. Mehr Nutzer bedeuten einen schnelleren Weg zum Listing und zur Umwandlung in USD oder EUR.</p>\n<p class=\"promo-sign\">Danke<br>Gründer des KSGP-Tokens und Betreiber dieser Seite</p>",
  "es": "<p><strong>Estimado usuario,</strong></p>\n<p>Al jugar recibes tokens <strong>KSGP</strong>. KSGP es un token cripto en la red <strong>BSC</strong>, visible en <strong>BscScan</strong>.</p>\n<p>Si el número de usuarios alcanza un nivel aceptable para Binance, KSGP podrá listarse en exchanges globales, incluido <strong>Binance</strong>. Los tokens se destinan a tu billetera digital; al listarse podrás venderlos.</p>\n<p>Comparte el juego con tus amigos. Más usuarios = camino más rápido al listing y a convertir KSGP en USD o EUR.</p>\n<p class=\"promo-sign\">Gracias<br>Fundador del token KSGP y administrador de este sitio</p>",
  "pt": "<p><strong>Caro usuário,</strong></p>\n<p>Ao jogar você recebe tokens <strong>KSGP</strong>. KSGP é um token cripto na rede <strong>BSC</strong>, visível no <strong>BscScan</strong>.</p>\n<p>Se o número de usuários atingir um nível aceitável para a Binance, o KSGP poderá ser listado em exchanges globais, incluindo a <strong>Binance</strong>. Os tokens são destinados à sua carteira digital; após a listagem você poderá vendê-los.</p>\n<p>Compartilhe o jogo com amigos. Mais usuários = caminho mais rápido para listagem e conversão em USD ou EUR.</p>\n<p class=\"promo-sign\">Obrigado<br>Fundador do token KSGP e administrador deste site</p>",
  "it": "<p><strong>Caro utente,</strong></p>\n<p>Giocando ricevi token <strong>KSGP</strong>. KSGP è un token crypto sulla rete <strong>BSC</strong>, visibile su <strong>BscScan</strong>.</p>\n<p>Se il numero di utenti raggiunge un livello accettabile per Binance, KSGP potrà essere listato sugli exchange globali, inclusa <strong>Binance</strong>. I token sono destinati al tuo wallet digitale; dopo il listing potrai venderli.</p>\n<p>Condividi il gioco con gli amici. Più utenti = percorso più rapido verso listing e conversione in USD o EUR.</p>\n<p class=\"promo-sign\">Grazie<br>Fondatore del token KSGP e gestore di questo sito</p>",
  "ru": "<p><strong>Уважаемый пользователь,</strong></p>\n<p>Играя, вы получаете токены <strong>KSGP</strong>. KSGP — криптотокен в сети <strong>BSC</strong>, доступный на <strong>BscScan</strong>.</p>\n<p>Если число пользователей достигнет уровня, приемлемого для Binance, KSGP может быть листингован на мировых биржах, включая <strong>Binance</strong>. Токены предназначены для перевода на ваш цифровой кошелёк; после листинга вы сможете их продать.</p>\n<p>Поделитесь игрой с друзьями. Больше пользователей — быстрее путь к листингу и обмену KSGP на USD или EUR.</p>\n<p class=\"promo-sign\">Спасибо<br>Основатель токена KSGP и администратор сайта</p>",
  "zh": "<p><strong>尊敬的用户：</strong></p>\n<p>通过游玩本游戏，您将获得 <strong>KSGP</strong> 代币。KSGP 是部署在 <strong>BSC</strong> 网络上的加密代币，可在 <strong>BscScan</strong> 上查看。</p>\n<p>若用户数量达到币安可接受的规模，在社区支持下 KSGP 有望登陆全球交易所，包括全球最大的加密货币交易所 <strong>币安（Binance）</strong>。您获得的代币计划转入您的数字钱包；上市后即可出售。</p>\n<p>请将本游戏分享给朋友。用户越多，上市与将 KSGP 兑换为美元或欧元的路径就越快。</p>\n<p class=\"promo-sign\">谢谢<br>KSGP 代币创始人兼本站管理员</p>",
  "ja": "<p><strong>ユーザーの皆様へ</strong></p>\n<p>このゲームをプレイすると <strong>KSGP</strong> トークンを獲得できます。KSGP は <strong>BSC</strong> ネットワーク上の暗号資産トークンで、<strong>BscScan</strong> で確認できます。</p>\n<p>ユーザー数が Binance に受け入れられる規模に達すれば、コミュニティの支持により KSGP は世界の取引所（世界最大の <strong>Binance</strong> を含む）に上場できる可能性があります。獲得トークンはデジタルウォレットへの送金を想定しており、上場後は売却できます。</p>\n<p>友人にゲームを紹介してください。ユーザー増加は上場と KSGP の USD/EUR 化への近道です。</p>\n<p class=\"promo-sign\">ありがとうございます<br>KSGP トークン創設者・当サイト管理者</p>",
  "ko": "<p><strong>사용자 여러분,</strong></p>\n<p>이 게임을 플레이하면 <strong>KSGP</strong> 토큰을 받습니다. KSGP는 <strong>BSC</strong> 네트워크의 암호화폐 토큰이며 <strong>BscScan</strong>에서 확인할 수 있습니다.</p>\n<p>사용자 수가 바이낸스가 수용할 수 있는 수준에 도달하면, 커뮤니티 지지로 KSGP가 세계 거래소(세계 최대 <strong>Binance</strong> 포함)에 상장될 수 있습니다. 획득 토큰은 디지털 지갑으로 이전될 예정이며, 상장 후 판매할 수 있습니다.</p>\n<p>친구에게 게임을 공유해 주세요. 사용자가 많을수록 상장과 KSGP의 USD/EUR 전환이 빨라집니다.</p>\n<p class=\"promo-sign\">감사합니다<br>KSGP 토큰 창립자 및 본 사이트 관리자</p>",
  "hi": "<p><strong>प्रिय उपयोगकर्ता,</strong></p>\n<p>इस गेम को खेलकर आप <strong>KSGP</strong> टोकन प्राप्त करते हैं। KSGP <strong>BSC</strong> नेटवर्क पर एक क्रिप्टो टोकन है, जिसे <strong>BscScan</strong> पर देखा जा सकता है।</p>\n<p>यदि उपयोगकर्ताओं की संख्या Binance के लिए स्वीकार्य स्तर तक पहुँचती है, तो समुदाय के समर्थन से KSGP वैश्विक एक्सचेंजों — जिसमें दुनिया का सबसे बड़ा <strong>Binance</strong> शामिल है — पर लिस्ट हो सकता है। आपके टोकन डिजिटल वॉलेट में ट्रांसफर के लिए हैं; लिस्टिंग के बाद आप बेच सकते हैं।</p>\n<p>इस गेम को दोस्तों के साथ साझा करें। अधिक उपयोगकर्ता = लिस्टिंग और KSGP को USD/EUR में बदलने का तेज़ रास्ता।</p>\n<p class=\"promo-sign\">धन्यवाद<br>KSGP टोकन के संस्थापक और इस साइट के प्रबंधक</p>"
};

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
  const rtl = (currentLang === 'fa' || currentLang === 'ar' || currentLang === 'he');
  document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  document.body.style.fontFamily = (currentLang === 'fa' || currentLang === 'ar')
    ? "'Vazirmatn', Tahoma, sans-serif"
    : "'Inter', system-ui, sans-serif";
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  const promoEl = document.querySelector('[data-i18n-html="promo"]');
  if (promoEl) {
    promoEl.innerHTML = PROMO_HTML[currentLang] || PROMO_HTML.en;
  }
  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.textContent = t('lang_label') || 'Language:';
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
  const snakeBtn = document.getElementById('btn-snake');
  const breakBtn = document.getElementById('btn-breakout');
  const contBtn = document.getElementById('continue-saved-btn');
  if (snakeBtn) {
    snakeBtn.onclick = () => startLevel(user.currentLevel || 1);
  }
  if (breakBtn) {
    breakBtn.onclick = () => {
      if (typeof beginBreakout === 'function') beginBreakout(user.currentLevel || 1, null);
    };
  }
  const mobBtn = document.getElementById('btn-mobcontrol');
  if (mobBtn) {
    mobBtn.onclick = () => {
      if (typeof beginMobControl === 'function') beginMobControl(user.currentLevel || 1, null);
    };
  }
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
    const sg = data.savedGame;
    if (sg.gameType === 'breakout' && typeof beginBreakout === 'function') {
      beginBreakout(sg.level, sg);
    } else if (sg.gameType === 'mobcontrol' && typeof beginMobControl === 'function') {
      beginMobControl(sg.level, sg);
    } else {
      beginPlay(sg.level, sg);
    }
  } catch (e) { console.error(e); }
}

function startLevel(levelNum) { beginPlay(levelNum, null); }

async function beginPlay(levelNum, savedState) {
  document.getElementById('menu-area').classList.add('hidden');
  document.getElementById('play-area').classList.remove('hidden');
  document.getElementById('current-stage').textContent = levelNum;

  let gameToken = null;
  try {
    const res = await fetch('/api/game/start', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const data = await res.json();
    if (data.success && data.token) {
      gameToken = data.token;
      if (data.level && data.level !== levelNum && !savedState) {
        levelNum = data.level;
        document.getElementById('current-stage').textContent = levelNum;
      }
    }
  } catch (e) { console.error('start token', e); }

  const cfg = getLevelConfig(levelNum);
  if (game) game.destroy();
  game = new SnakeGame(cfg, levelNum, savedState);
  game.gameToken = gameToken;
  game.startedAt = Date.now();
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
    this.gameType = 'snake';
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

    // Click / tap inside canvas → steer toward that point relative to snake head
    const steerFromClient = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const px = (clientX - rect.left) * scaleX;
      const py = (clientY - rect.top) * scaleY;
      const head = this.snake[0];
      const hx = head.x * this.cell + this.cell / 2;
      const hy = head.y * this.cell + this.cell / 2;
      const dx = px - hx;
      const dy = py - hy;
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      if (Math.abs(dx) > Math.abs(dy)) this.setDir(dx > 0 ? 1 : -1, 0);
      else this.setDir(0, dy > 0 ? 1 : -1);
    };

    this._clickHandler = (e) => {
      e.preventDefault();
      steerFromClient(e.clientX, e.clientY);
    };
    this._touchHandler = (e) => {
      if (!e.touches || !e.touches[0]) return;
      e.preventDefault();
      steerFromClient(e.touches[0].clientX, e.touches[0].clientY);
    };
    this.canvas.addEventListener('click', this._clickHandler);
    this.canvas.addEventListener('touchstart', this._touchHandler, { passive: false });
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
        body: JSON.stringify({
          level: this.levelNum,
          completed: true,
          token: this.gameToken || null,
          durationMs: Date.now() - (this.startedAt || Date.now())
        })
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
    if (this._clickHandler) this.canvas.removeEventListener('click', this._clickHandler);
    if (this._touchHandler) this.canvas.removeEventListener('touchstart', this._touchHandler);
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
      body: JSON.stringify(
        ((game.gameType === 'breakout' || game.gameType === 'mobcontrol') && typeof game.getSaveState === 'function')
          ? game.getSaveState()
          : {
              gameType: 'snake',
              level: game.levelNum, score: game.score, snake: game.snake, dir: game.dir,
              food: game.food, obstacles: game.obstacles, hazards: game.hazards || [],
              savedAt: new Date().toISOString()
            }
      )
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