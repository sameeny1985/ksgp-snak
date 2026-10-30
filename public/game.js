// ========== Snake KSGP - 1000 levels, success-only rewards, falling hazards ==========

const TOTAL_LEVELS = 1000;
const TOTAL_KSGP_REWARD = 10000000; // 10 million total (1000×10000)
const KSGP_PER_LEVEL = 10000; // 10,000 ksgp per successful stage

const TRANSLATIONS = {
  en: {
    title: "Snake",
    subtitle: "Classic snake game with ksgp token scores",
    info1: "Complete each stage to earn ksgp",
    info2: "Failed attempts give 0 ksgp",
    login_btn: "Sign in with Google",
    login_note: "Click the button to choose from your Google accounts",
    balance: "Balance:",
    admin: "Admin",
    logout: "Logout",
    my_panel: "My Panel",
    start: "Start Game",
    continue_game: "Continue",
    save_exit: "Save & Exit",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    stage: "Stage",
    score: "Score this run:",
    timer: "Time:",
    win_title: "Stage Cleared!",
    lose_title: "Game Over",
    win_msg: "You earned {reward} ksgp!",
    lose_msg: "No ksgp this attempt. Try again!",
    ok: "OK",
    saved_ok: "Game saved! Continue later from My Panel.",
    continue_saved: "Continue saved game",
    lang_label: "Language:",
    hazard_warning: "Ice falling from above!",
    control_hint: "Tap or click inside the game area to change direction",
    rights: "All rights reserved by KSGP token",
    choose_game: "Choose a game",
    control_hint_snake: "Snake: tap/click in the play area to steer",
    control_hint_breakout: "Breakout: click left/right side to move the paddle (5 clicks to an edge)",
    captcha_title: "Verify you are human",
    captcha_q: "What is {a} + {b}?",
    captcha_btn: "Verify",
    captcha_ok: "Verified! You can sign in.",
    captcha_fail: "Wrong answer. Try again."
  },
  fa: {
    title: "اسنک",
    subtitle: "بازی مار کلاسیک با امتیاز توکن ksgp",
    info1: "با موفقیت هر مرحله ksgp بگیر",
    info2: "شکست = صفر امتیاز آن مرحله",
    login_btn: "ورود با حساب گوگل",
    login_note: "از بین حساب‌های گوگل خود انتخاب کنید",
    balance: "موجودی:",
    admin: "پنل ادمین",
    logout: "خروج",
    my_panel: "پنل من",
    start: "شروع بازی",
    continue_game: "ادامه",
    save_exit: "ذخیره و خروج",
    pause: "توقف",
    resume: "ادامه",
    stop: "توقف کامل",
    stage: "مرحله",
    score: "امتیاز این دور:",
    timer: "زمان:",
    win_title: "مرحله رد شد!",
    lose_title: "بازی تمام شد",
    win_msg: "تو {reward} ksgp گرفتی!",
    lose_msg: "این دور هیچ ksgp نگرفتی. دوباره تلاش کن!",
    ok: "باشه",
    saved_ok: "بازی ذخیره شد! بعداً از پنل من ادامه بده.",
    continue_saved: "ادامه بازی ذخیره‌شده",
    lang_label: "زبان:",
    hazard_warning: "یخ از بالا می‌بارد!",
    control_hint: "داخل صفحه بازی کلیک یا لمس کنید تا جهت عوض شود",
    rights: "کلیه حقوق متعلق به توکن KSGP است",
    choose_game: "یک بازی انتخاب کنید",
    control_hint_snake: "مار: داخل صفحه کلیک/لمس برای تغییر جهت",
    control_hint_breakout: "بریک‌اوت: کلیک چپ/راست برای حرکت تخته (۵ کلیک تا لبه)",
    captcha_title: "تأیید کنید انسان هستید",
    captcha_q: "{a} + {b} چند می‌شود؟",
    captcha_btn: "تأیید",
    captcha_ok: "تأیید شد! می‌توانید وارد شوید.",
    captcha_fail: "پاسخ اشتباه. دوباره تلاش کنید."
  },
  ar: {
    title: "ثعبان",
    subtitle: "لعبة الثعبان الكلاسيكية مع نقاط رمز ksgp",
    info1: "أكمل كل مرحلة لكسب ksgp",
    info2: "المحاولات الفاشلة تعطي 0 ksgp",
    login_btn: "تسجيل الدخول عبر Google",
    login_note: "اختر من حسابات Google الخاصة بك",
    balance: "الرصيد:",
    admin: "المسؤول",
    logout: "خروج",
    my_panel: "لوحتي",
    start: "ابدأ اللعبة",
    continue_game: "متابعة",
    save_exit: "حفظ وخروج",
    pause: "إيقاف مؤقت",
    resume: "استئناف",
    stop: "إيقاف",
    stage: "المرحلة",
    score: "نقاط هذه الجولة:",
    timer: "الوقت:",
    win_title: "تم اجتياز المرحلة!",
    lose_title: "انتهت اللعبة",
    win_msg: "لقد ربحت {reward} ksgp!",
    lose_msg: "لا ksgp في هذه المحاولة. حاول مرة أخرى!",
    ok: "حسناً",
    saved_ok: "تم حفظ اللعبة!",
    continue_saved: "متابعة اللعبة المحفوظة",
    lang_label: "اللغة:",
    hazard_warning: "جليد يسقط من الأعلى!",
    control_hint: "انقر أو المس داخل منطقة اللعب لتغيير الاتجاه",
    rights: "جميع الحقوق محفوظة لرمز KSGP",
    choose_game: "اختر لعبة",
    control_hint_snake: "الثعبان: انقر/المس للتوجيه",
    control_hint_breakout: "بريكاوت: انقر يسار/يمين لتحريك المضرب",
    captcha_title: "تحقق أنك لست روبوتاً",
    captcha_q: "كم يساوي {a} + {b}؟",
    captcha_btn: "تحقق",
    captcha_ok: "تم التحقق! يمكنك تسجيل الدخول.",
    captcha_fail: "إجابة خاطئة. حاول مرة أخرى."
  },
  tr: {
    title: "Yılan",
    subtitle: "ksgp token puanlı klasik yılan oyunu",
    info1: "ksgp kazanmak için her aşamayı tamamla",
    info2: "Başarısız denemeler 0 ksgp verir",
    login_btn: "Google ile giriş",
    login_note: "Google hesaplarınızdan birini seçin",
    balance: "Bakiye:",
    admin: "Yönetici",
    logout: "Çıkış",
    my_panel: "Panelim",
    start: "Oyunu başlat",
    continue_game: "Devam",
    save_exit: "Kaydet ve çık",
    pause: "Duraklat",
    resume: "Sürdür",
    stop: "Durdur",
    stage: "Aşama",
    score: "Bu tur skoru:",
    timer: "Süre:",
    win_title: "Aşama geçildi!",
    lose_title: "Oyun bitti",
    win_msg: "{reward} ksgp kazandın!",
    lose_msg: "Bu denemede ksgp yok. Tekrar dene!",
    ok: "Tamam",
    saved_ok: "Oyun kaydedildi!",
    continue_saved: "Kayıtlı oyuna devam",
    lang_label: "Dil:",
    hazard_warning: "Yukarıdan buz düşüyor!",
    control_hint: "Yön değiştirmek için oyun alanına tıkla/dokun",
    rights: "Tüm hakları KSGP token saklıdır",
    choose_game: "Bir oyun seç",
    control_hint_snake: "Yılan: yön için tıkla/dokun",
    control_hint_breakout: "Breakout: raketi hareket ettirmek için sol/sağ tıkla",
    captcha_title: "İnsan olduğunuzu doğrulayın",
    captcha_q: "{a} + {b} kaçtır?",
    captcha_btn: "Doğrula",
    captcha_ok: "Doğrulandı! Giriş yapabilirsiniz.",
    captcha_fail: "Yanlış cevap. Tekrar deneyin."
  },
  nl: {
    title: "Slang",
    subtitle: "Klassiek slangenspel met ksgp-tokenscores",
    info1: "Voltooi elke fase om ksgp te verdienen",
    info2: "Mislukte pogingen geven 0 ksgp",
    login_btn: "Inloggen met Google",
    login_note: "Kies een Google-account",
    balance: "Saldo:",
    admin: "Beheer",
    logout: "Uitloggen",
    my_panel: "Mijn paneel",
    start: "Spel starten",
    continue_game: "Doorgaan",
    save_exit: "Opslaan & afsluiten",
    pause: "Pauze",
    resume: "Hervatten",
    stop: "Stop",
    stage: "Fase",
    score: "Score deze ronde:",
    timer: "Tijd:",
    win_title: "Fase gehaald!",
    lose_title: "Game Over",
    win_msg: "Je hebt {reward} ksgp verdiend!",
    lose_msg: "Geen ksgp deze poging.",
    ok: "OK",
    saved_ok: "Spel opgeslagen!",
    continue_saved: "Opgeslagen spel hervatten",
    lang_label: "Taal:",
    hazard_warning: "IJs valt van boven!",
    control_hint: "Tik of klik in het speelveld om van richting te veranderen",
    rights: "Alle rechten voorbehouden aan KSGP-token",
    choose_game: "Kies een spel",
    control_hint_snake: "Slang: tik/klik om te sturen",
    control_hint_breakout: "Breakout: klik links/rechts om het paddle te bewegen",
    captcha_title: "Bevestig dat je een mens bent",
    captcha_q: "Hoeveel is {a} + {b}?",
    captcha_btn: "Verifiëren",
    captcha_ok: "Geverifieerd! Je kunt inloggen.",
    captcha_fail: "Fout antwoord. Probeer opnieuw."
  },
  fr: {
    title: "Serpent",
    subtitle: "Jeu de serpent classique avec scores ksgp",
    info1: "Terminez chaque étape pour gagner des ksgp",
    info2: "Échec = 0 ksgp",
    login_btn: "Se connecter avec Google",
    login_note: "Choisissez un compte Google",
    balance: "Solde :",
    admin: "Admin",
    logout: "Déconnexion",
    my_panel: "Mon panneau",
    start: "Commencer",
    continue_game: "Continuer",
    save_exit: "Sauvegarder et quitter",
    pause: "Pause",
    resume: "Reprendre",
    stop: "Arrêter",
    stage: "Étape",
    score: "Score de cette manche :",
    timer: "Temps :",
    win_title: "Étape réussie !",
    lose_title: "Game Over",
    win_msg: "Vous avez gagné {reward} ksgp !",
    lose_msg: "Aucun ksgp cette tentative.",
    ok: "OK",
    saved_ok: "Partie sauvegardée !",
    continue_saved: "Continuer la partie sauvegardée",
    lang_label: "Langue :",
    hazard_warning: "Glace qui tombe !",
    control_hint: "Touchez ou cliquez dans la zone de jeu pour changer de direction",
    rights: "Tous droits réservés par le jeton KSGP",
    choose_game: "Choisissez un jeu",
    control_hint_snake: "Serpent : touchez/cliquez pour diriger",
    control_hint_breakout: "Breakout : cliquez gauche/droite pour déplacer la raquette",
    captcha_title: "Vérifiez que vous êtes humain",
    captcha_q: "Combien font {a} + {b} ?",
    captcha_btn: "Vérifier",
    captcha_ok: "Vérifié ! Vous pouvez vous connecter.",
    captcha_fail: "Mauvaise réponse. Réessayez."
  },
  de: {
    title: "Schlange",
    subtitle: "Klassisches Schlangenspiel mit ksgp-Punkten",
    info1: "Schließe jede Stufe ab um ksgp zu verdienen",
    info2: "Fehlversuche geben 0 ksgp",
    login_btn: "Mit Google anmelden",
    login_note: "Wähle ein Google-Konto",
    balance: "Guthaben:",
    admin: "Admin",
    logout: "Abmelden",
    my_panel: "Mein Panel",
    start: "Spiel starten",
    continue_game: "Weiter",
    save_exit: "Speichern & Beenden",
    pause: "Pause",
    resume: "Weiter",
    stop: "Stopp",
    stage: "Stufe",
    score: "Punkte dieser Runde:",
    timer: "Zeit:",
    win_title: "Stufe geschafft!",
    lose_title: "Game Over",
    win_msg: "Du hast {reward} ksgp verdient!",
    lose_msg: "Kein ksgp bei diesem Versuch.",
    ok: "OK",
    saved_ok: "Spiel gespeichert!",
    continue_saved: "Gespeichertes Spiel fortsetzen",
    lang_label: "Sprache:",
    hazard_warning: "Eis fällt von oben!",
    control_hint: "Tippen oder klicken Sie im Spielfeld um die Richtung zu ändern",
    rights: "Alle Rechte vorbehalten dem KSGP-Token",
    choose_game: "Spiel wählen",
    control_hint_snake: "Schlange: tippen/klicken zum Steuern",
    control_hint_breakout: "Breakout: links/rechts klicken um den Schläger zu bewegen",
    captcha_title: "Bestätigen Sie, dass Sie ein Mensch sind",
    captcha_q: "Was ist {a} + {b}?",
    captcha_btn: "Prüfen",
    captcha_ok: "Bestätigt! Sie können sich anmelden.",
    captcha_fail: "Falsche Antwort. Erneut versuchen."
  },
  es: {
    title: "Serpiente",
    subtitle: "Juego clásico de serpiente con puntuación ksgp",
    info1: "Completa cada etapa para ganar ksgp",
    info2: "Los intentos fallidos dan 0 ksgp",
    login_btn: "Iniciar sesión con Google",
    login_note: "Elige una cuenta de Google",
    balance: "Saldo:",
    admin: "Admin",
    logout: "Cerrar sesión",
    my_panel: "Mi panel",
    start: "Empezar",
    continue_game: "Continuar",
    save_exit: "Guardar y salir",
    pause: "Pausa",
    resume: "Reanudar",
    stop: "Detener",
    stage: "Etapa",
    score: "Puntos de esta ronda:",
    timer: "Tiempo:",
    win_title: "¡Etapa superada!",
    lose_title: "Game Over",
    win_msg: "¡Has ganado {reward} ksgp!",
    lose_msg: "Sin ksgp en este intento.",
    ok: "OK",
    saved_ok: "¡Partida guardada!",
    continue_saved: "Continuar partida guardada",
    lang_label: "Idioma:",
    hazard_warning: "¡Hielo cayendo!",
    control_hint: "Toca o haz clic en el área de juego para cambiar de dirección",
    rights: "Todos los derechos reservados por el token KSGP",
    choose_game: "Elige un juego",
    control_hint_snake: "Serpiente: toca/clic para dirigir",
    control_hint_breakout: "Breakout: clic izq/der para mover la pala",
    captcha_title: "Verifica que eres humano",
    captcha_q: "¿Cuánto es {a} + {b}?",
    captcha_btn: "Verificar",
    captcha_ok: "¡Verificado! Puedes iniciar sesión.",
    captcha_fail: "Respuesta incorrecta. Inténtalo de nuevo."
  },
  pt: {
    title: "Cobra",
    subtitle: "Jogo clássico da cobra com pontuação ksgp",
    info1: "Complete cada fase para ganhar ksgp",
    info2: "Tentativas falhas dão 0 ksgp",
    login_btn: "Entrar com Google",
    login_note: "Escolha uma conta Google",
    balance: "Saldo:",
    admin: "Admin",
    logout: "Sair",
    my_panel: "Meu painel",
    start: "Começar",
    continue_game: "Continuar",
    save_exit: "Salvar e sair",
    pause: "Pausar",
    resume: "Retomar",
    stop: "Parar",
    stage: "Fase",
    score: "Pontos desta rodada:",
    timer: "Tempo:",
    win_title: "Fase concluída!",
    lose_title: "Game Over",
    win_msg: "Você ganhou {reward} ksgp!",
    lose_msg: "Nenhum ksgp nesta tentativa.",
    ok: "OK",
    saved_ok: "Jogo salvo!",
    continue_saved: "Continuar jogo salvo",
    lang_label: "Idioma:",
    hazard_warning: "Gelo caindo de cima!",
    control_hint: "Toque ou clique na área do jogo para mudar de direção",
    rights: "Todos os direitos reservados ao token KSGP",
    choose_game: "Escolha um jogo",
    control_hint_snake: "Cobra: toque/clique para dirigir",
    control_hint_breakout: "Breakout: clique esq/dir para mover a raquete",
    captcha_title: "Verifique que você é humano",
    captcha_q: "Quanto é {a} + {b}?",
    captcha_btn: "Verificar",
    captcha_ok: "Verificado! Você pode entrar.",
    captcha_fail: "Resposta errada. Tente de novo."
  },
  it: {
    title: "Serpente",
    subtitle: "Gioco classico del serpente con punteggio ksgp",
    info1: "Completa ogni fase per guadagnare ksgp",
    info2: "I tentativi falliti danno 0 ksgp",
    login_btn: "Accedi con Google",
    login_note: "Scegli un account Google",
    balance: "Saldo:",
    admin: "Admin",
    logout: "Esci",
    my_panel: "Il mio pannello",
    start: "Inizia",
    continue_game: "Continua",
    save_exit: "Salva ed esci",
    pause: "Pausa",
    resume: "Riprendi",
    stop: "Stop",
    stage: "Fase",
    score: "Punteggio di questo turno:",
    timer: "Tempo:",
    win_title: "Fase superata!",
    lose_title: "Game Over",
    win_msg: "Hai guadagnato {reward} ksgp!",
    lose_msg: "Nessun ksgp in questo tentativo.",
    ok: "OK",
    saved_ok: "Partita salvata!",
    continue_saved: "Continua partita salvata",
    lang_label: "Lingua:",
    hazard_warning: "Ghiaccio che cade dall'alto!",
    control_hint: "Tocca o clicca nell'area di gioco per cambiare direzione",
    rights: "Tutti i diritti riservati al token KSGP",
    choose_game: "Scegli un gioco",
    control_hint_snake: "Serpente: tocca/clicca per guidare",
    control_hint_breakout: "Breakout: clicca sx/dx per muovere la racchetta",
    captcha_title: "Verifica di essere umano",
    captcha_q: "Quanto fa {a} + {b}?",
    captcha_btn: "Verifica",
    captcha_ok: "Verificato! Puoi accedere.",
    captcha_fail: "Risposta sbagliata. Riprova."
  },
  ru: {
    title: "Змейка",
    subtitle: "Классическая змейка с очками ksgp",
    info1: "Пройдите каждый этап, чтобы заработать ksgp",
    info2: "Неудачные попытки дают 0 ksgp",
    login_btn: "Войти через Google",
    login_note: "Выберите аккаунт Google",
    balance: "Баланс:",
    admin: "Админ",
    logout: "Выйти",
    my_panel: "Моя панель",
    start: "Начать игру",
    continue_game: "Продолжить",
    save_exit: "Сохранить и выйти",
    pause: "Пауза",
    resume: "Продолжить",
    stop: "Стоп",
    stage: "Этап",
    score: "Очки этого раунда:",
    timer: "Время:",
    win_title: "Этап пройден!",
    lose_title: "Игра окончена",
    win_msg: "Вы заработали {reward} ksgp!",
    lose_msg: "Нет ksgp в этой попытке.",
    ok: "OK",
    saved_ok: "Игра сохранена!",
    continue_saved: "Продолжить сохранённую игру",
    lang_label: "Язык:",
    hazard_warning: "Лёд падает сверху!",
    control_hint: "Нажмите или коснитесь игровой зоны, чтобы сменить направление",
    rights: "Все права защищены токеном KSGP",
    choose_game: "Выберите игру",
    control_hint_snake: "Змейка: нажмите/коснитесь для управления",
    control_hint_breakout: "Breakout: клик влево/вправо для ракетки",
    captcha_title: "Подтвердите, что вы человек",
    captcha_q: "Сколько будет {a} + {b}?",
    captcha_btn: "Проверить",
    captcha_ok: "Подтверждено! Можно войти.",
    captcha_fail: "Неверный ответ. Попробуйте снова."
  },
  zh: {
    title: "贪吃蛇",
    subtitle: "经典贪吃蛇，ksgp 代币积分",
    info1: "通关每一关可获得 ksgp",
    info2: "失败尝试获得 0 ksgp",
    login_btn: "使用 Google 登录",
    login_note: "从您的 Google 账号中选择",
    balance: "余额：",
    admin: "管理",
    logout: "退出",
    my_panel: "我的面板",
    start: "开始游戏",
    continue_game: "继续",
    save_exit: "保存并退出",
    pause: "暂停",
    resume: "继续",
    stop: "停止",
    stage: "关卡",
    score: "本局得分：",
    timer: "时间：",
    win_title: "通关！",
    lose_title: "游戏结束",
    win_msg: "你获得了 {reward} ksgp！",
    lose_msg: "本次尝试没有 ksgp。",
    ok: "确定",
    saved_ok: "游戏已保存！",
    continue_saved: "继续已保存的游戏",
    lang_label: "语言：",
    hazard_warning: "上方有冰块落下！",
    control_hint: "在游戏区域内点击或触摸以改变方向",
    rights: "KSGP 代币保留所有权利",
    choose_game: "选择游戏",
    control_hint_snake: "贪吃蛇：点击/触摸转向",
    control_hint_breakout: "打砖块：左右点击移动挡板",
    captcha_title: "请验证您是人类",
    captcha_q: "{a} + {b} 等于多少？",
    captcha_btn: "验证",
    captcha_ok: "已验证！可以登录。",
    captcha_fail: "答案错误，请重试。"
  },
  ja: {
    title: "スネーク",
    subtitle: "ksgpトークン得点のクラシックスネーク",
    info1: "各ステージをクリアしてksgpを獲得",
    info2: "失敗すると0 ksgp",
    login_btn: "Googleでログイン",
    login_note: "Googleアカウントを選択",
    balance: "残高:",
    admin: "管理",
    logout: "ログアウト",
    my_panel: "マイパネル",
    start: "ゲーム開始",
    continue_game: "続ける",
    save_exit: "保存して終了",
    pause: "一時停止",
    resume: "再開",
    stop: "停止",
    stage: "ステージ",
    score: "今回のスコア:",
    timer: "時間:",
    win_title: "ステージクリア！",
    lose_title: "ゲームオーバー",
    win_msg: "{reward} ksgpを獲得しました！",
    lose_msg: "今回はksgpなし。再挑戦！",
    ok: "OK",
    saved_ok: "ゲームを保存しました！",
    continue_saved: "保存したゲームを続ける",
    lang_label: "言語:",
    hazard_warning: "上から氷が落ちてくる！",
    control_hint: "プレイエリアをタップ/クリックして方向転換",
    rights: "All rights reserved by KSGP token",
    choose_game: "ゲームを選択",
    control_hint_snake: "スネーク：タップ/クリックで操作",
    control_hint_breakout: "ブロック崩し：左右クリックでパドル移動",
    captcha_title: "人間であることを確認",
    captcha_q: "{a} + {b} は？",
    captcha_btn: "確認",
    captcha_ok: "確認済み！ログインできます。",
    captcha_fail: "不正解です。もう一度。"
  },
  ko: {
    title: "스네이크",
    subtitle: "ksgp 토큰 점수의 클래식 스네이크",
    info1: "각 스테이지를 클리어하면 ksgp 획득",
    info2: "실패 시 0 ksgp",
    login_btn: "Google로 로그인",
    login_note: "Google 계정을 선택하세요",
    balance: "잔액:",
    admin: "관리",
    logout: "로그아웃",
    my_panel: "내 패널",
    start: "게임 시작",
    continue_game: "계속",
    save_exit: "저장 후 종료",
    pause: "일시정지",
    resume: "재개",
    stop: "중지",
    stage: "스테이지",
    score: "이번 점수:",
    timer: "시간:",
    win_title: "스테이지 클리어!",
    lose_title: "게임 오버",
    win_msg: "{reward} ksgp를 획득했습니다!",
    lose_msg: "이번 시도는 ksgp 없음.",
    ok: "확인",
    saved_ok: "게임이 저장되었습니다!",
    continue_saved: "저장된 게임 계속",
    lang_label: "언어:",
    hazard_warning: "위에서 얼음이 떨어집니다!",
    control_hint: "게임 영역을 탭/클릭하여 방향 전환",
    rights: "KSGP 토큰 판권 소유",
    choose_game: "게임 선택",
    control_hint_snake: "스네이크: 탭/클릭으로 조작",
    control_hint_breakout: "브레이크아웃: 좌/우 클릭으로 패들 이동",
    captcha_title: "사람인지 확인하세요",
    captcha_q: "{a} + {b}는?",
    captcha_btn: "확인",
    captcha_ok: "확인됨! 로그인할 수 있습니다.",
    captcha_fail: "오답입니다. 다시 시도하세요."
  },
  hi: {
    title: "साँप",
    subtitle: "ksgp टोकन स्कोर वाला क्लासिक स्नेक गेम",
    info1: "ksgp कमाने के लिए हर स्टेज पूरा करें",
    info2: "असफल प्रयास = 0 ksgp",
    login_btn: "Google से साइन इन",
    login_note: "अपने Google खातों में से चुनें",
    balance: "शेष:",
    admin: "एडमिन",
    logout: "लॉग आउट",
    my_panel: "मेरा पैनल",
    start: "गेम शुरू",
    continue_game: "जारी रखें",
    save_exit: "सेव और बाहर",
    pause: "रोकें",
    resume: "फिर शुरू",
    stop: "बंद",
    stage: "स्टेज",
    score: "इस राउंड का स्कोर:",
    timer: "समय:",
    win_title: "स्टेज पूरा!",
    lose_title: "गेम ओवर",
    win_msg: "आपने {reward} ksgp कमाए!",
    lose_msg: "इस प्रयास में कोई ksgp नहीं।",
    ok: "ठीक",
    saved_ok: "गेम सेव हो गया!",
    continue_saved: "सेव किया गेम जारी रखें",
    lang_label: "भाषा:",
    hazard_warning: "ऊपर से बर्फ गिर रही है!",
    control_hint: "दिशा बदलने के लिए प्ले एरिया पर टैप/क्लिक करें",
    rights: "सर्वाधिकार KSGP टोकन के पास सुरक्षित",
    choose_game: "एक गेम चुनें",
    control_hint_snake: "साँप: टैप/क्लिक से नियंत्रित करें",
    control_hint_breakout: "ब्रेकआउट: पैडल के लिए बाएँ/दाएँ क्लिक",
    captcha_title: "पुष्टि करें कि आप इंसान हैं",
    captcha_q: "{a} + {b} कितना है?",
    captcha_btn: "पुष्टि",
    captcha_ok: "पुष्टि हो गई! आप साइन इन कर सकते हैं।",
    captcha_fail: "गलत जवाब। फिर कोशिश करें।"
  },
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
  if (typeof resetCaptcha === 'function' && !captchaSolved) resetCaptcha();
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
  // Force site branding (fixes old cached index.html)
  document.title = 'KSGP GAMES';
  const loginH1 = document.querySelector('#login-screen h1');
  if (loginH1) loginH1.innerHTML = '<span class="token">KSGP</span> <span style="color:#fff">GAMES</span>';

  const menuCard = document.querySelector('#menu-area .card');
  // Ensure Jackpot button exists even if HTML is outdated
  if (menuCard && !document.getElementById('btn-jackpot')) {
    const jp = document.createElement('button');
    jp.id = 'btn-jackpot';
    jp.type = 'button';
    jp.className = 'btn';
    jp.textContent = 'Jackpot';
    jp.style.cssText = 'width:100%;margin-top:10px;background:linear-gradient(135deg,#ffd700,#ff6f00);color:#1a0a2e;font-weight:800;';
    const mob = document.getElementById('btn-mobcontrol');
    if (mob && mob.parentNode) mob.parentNode.insertBefore(jp, mob.nextSibling);
    else menuCard.appendChild(jp);
  }

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
  const jpBtn = document.getElementById('btn-jackpot');
  if (jpBtn) {
    jpBtn.onclick = () => {
      if (typeof openJackpot === 'function') openJackpot();
      else alert('Jackpot script not loaded. Upload public/jackpot.js');
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

// ---------- Anti-bot math captcha ----------
let captchaA = 0, captchaB = 0, captchaSolved = false;

function resetCaptcha() {
  captchaA = 2 + Math.floor(Math.random() * 9);
  captchaB = 2 + Math.floor(Math.random() * 9);
  captchaSolved = false;
  const q = document.getElementById('captcha-question');
  const msg = document.getElementById('captcha-msg');
  const ans = document.getElementById('captcha-answer');
  const btn = document.getElementById('google-login-btn');
  if (q) q.textContent = t('captcha_q', { a: captchaA, b: captchaB });
  if (msg) { msg.textContent = ''; msg.style.color = ''; }
  if (ans) ans.value = '';
  if (btn) { btn.classList.remove('ready'); btn.style.pointerEvents = 'none'; btn.style.opacity = '0.4'; }
  // if already verified this session
  if (sessionStorage.getItem('ksgp_human') === '1') {
    captchaSolved = true;
    if (btn) { btn.classList.add('ready'); btn.style.pointerEvents = 'auto'; btn.style.opacity = '1'; }
    if (document.getElementById('captcha-box')) document.getElementById('captcha-box').style.display = 'none';
  }
}

function verifyCaptcha() {
  const ans = document.getElementById('captcha-answer');
  const msg = document.getElementById('captcha-msg');
  const btn = document.getElementById('google-login-btn');
  const val = parseInt(ans && ans.value, 10);
  if (val === captchaA + captchaB) {
    captchaSolved = true;
    sessionStorage.setItem('ksgp_human', '1');
    if (msg) { msg.textContent = t('captcha_ok'); msg.style.color = '#69f0ae'; }
    if (btn) { btn.classList.add('ready'); btn.style.pointerEvents = 'auto'; btn.style.opacity = '1'; }
    setTimeout(() => {
      const box = document.getElementById('captcha-box');
      if (box) box.style.display = 'none';
    }, 600);
  } else {
    captchaSolved = false;
    if (msg) { msg.textContent = t('captcha_fail'); msg.style.color = '#ff5252'; }
    resetCaptcha();
    // keep message after reset of numbers
    if (msg) { msg.textContent = t('captcha_fail'); msg.style.color = '#ff5252'; }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const vbtn = document.getElementById('captcha-verify');
  if (vbtn) vbtn.addEventListener('click', verifyCaptcha);
  const ans = document.getElementById('captcha-answer');
  if (ans) ans.addEventListener('keydown', e => { if (e.key === 'Enter') verifyCaptcha(); });
  resetCaptcha();
});

loadUser();