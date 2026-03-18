// TheCodeKid — Premium Main Application
import { gamification, showToast, initConfetti } from './gamification.js';
import { dsaQuestions } from './data/dsa-questions.js';
import { logicGames } from './data/logic-games.js';
import { badges, levels } from './data/badges.js';

// ============================================
// THEME MANAGER
// ============================================
const themes = {
  default: { name: 'Default', accent: '#7c6cf0' },
  junior: { name: 'Junior Coders', accent: '#FF5722' },
  explorer: { name: 'Explorer Coders', accent: '#06b6d4' },
  pro: { name: 'Pro Coders', accent: '#22c55e' }
};

let currentTheme = localStorage.getItem('codequest_theme') || 'default';

function setTheme(theme) {
  currentTheme = theme;
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('codequest_theme', theme);
}

// ============================================
// ROUTER
// ============================================
const app = document.getElementById('app');

function getRoute() {
  const hash = window.location.hash || '#/';
  return hash.replace('#', '') || '/';
}

function navigate(route) { window.location.hash = route; }

function updateActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

function refreshIcons() { if (window.lucide) window.lucide.createIcons(); }

function icon(name, size = 18) {
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px;"></i>`;
}

// ============================================
// GAME STATE for Logic Games
// ============================================
let gameState = {
  currentGame: 0,
  score: 0,
  answered: false,
  hintShown: false,
};

function resetGameState() {
  gameState = { currentGame: 0, score: 0, answered: false, hintShown: false };
}

// ============================================
// PAGE RENDERERS
// ============================================

// --- HOME ---
function renderHome() {
  updateActiveNav('home');
  const tier = currentTheme;

  let heroTitle, heroSubtitle, heroCTA;
  if (tier === 'junior') {
    heroTitle = `Let's Play &<br>Learn <span class="text-gradient">Coding!</span>`;
    heroSubtitle = 'Become a coding superhero! Solve puzzles, play games, win badges, and build amazing things — all while having tons of fun!';
    heroCTA = `${icon('gamepad-2', 20)} Start Playing!`;
  } else if (tier === 'explorer') {
    heroTitle = `Begin Your<br>Coding <span class="text-gradient">Adventure</span>`;
    heroSubtitle = 'Embark on exciting missions, solve brain teasers, learn real logic, and unlock your coding superpowers!';
    heroCTA = `${icon('rocket', 20)} Start Mission`;
  } else if (tier === 'pro') {
    heroTitle = `Master the<br>Art of <span class="text-gradient">Code</span>`;
    heroSubtitle = 'Tackle real coding challenges, build production-ready projects, and compete with coders across India.';
    heroCTA = `${icon('terminal', 20)} init journey`;
  } else {
    heroTitle = `Learn Coding<br>Like a <span class="text-gradient">Game</span>`;
    heroSubtitle = "India's most engaging coding platform for students. Solve challenges, earn XP, level up, and become a coding master!";
    heroCTA = `${icon('zap', 20)} Get Started`;
  }

  app.innerHTML = `
    <div class="page-enter">
      <section class="hero">
        <div class="hero-content container">
          <div class="hero-tag animate-fadeInDown">${icon('sparkles', 14)} #1 Gamified Coding Platform for Indian Students</div>
          <h1 class="animate-fadeInUp delay-1">${heroTitle}</h1>
          <p class="animate-fadeInUp delay-2">${heroSubtitle}</p>
          <div class="hero-actions animate-fadeInUp delay-3">
            <button class="btn btn-primary btn-lg btn-glow ripple" id="hero-cta">${heroCTA}</button>
            <button class="btn btn-secondary btn-lg ripple" id="hero-explore">${icon('book-open', 18)} Explore Courses</button>
          </div>
          <div class="hero-stats animate-fadeInUp delay-4">
            <div class="hero-stat"><div class="hero-stat-number">50K+</div><div class="hero-stat-label">Active Students</div></div>
            <div class="hero-stat"><div class="hero-stat-number">500+</div><div class="hero-stat-label">Challenges</div></div>
            <div class="hero-stat"><div class="hero-stat-number">100+</div><div class="hero-stat-label">Schools</div></div>
          </div>
        </div>
      </section>

      <section class="section container">
        <div class="section-header text-center">
          <h2 class="section-title reveal">Choose Your Path</h2>
          <p class="section-subtitle reveal" style="margin: 0 auto;">Select your coding level and unlock a personalized experience</p>
        </div>
        <div class="level-cards" style="margin-top: var(--space-2xl);">
          <div class="level-card level-card-junior card reveal" data-theme-select="junior" id="select-junior">
            <div class="level-card-icon">🧸</div>
            <h3>Junior Coders</h3>
            <p>Class 1–5 • Fun puzzles, patterns & games! Build strong logic with colorful interactive challenges.</p>
            <span class="level-card-tag">${icon('gamepad-2', 13)} Game Style</span>
          </div>
          <div class="level-card level-card-explorer card reveal" data-theme-select="explorer" id="select-explorer">
            <div class="level-card-icon">🚀</div>
            <h3>Explorer Coders</h3>
            <p>Class 6–8 • Brain teasers, logic puzzles & intro to coding! Solve real problems like a detective.</p>
            <span class="level-card-tag">${icon('compass', 13)} Adventure Style</span>
          </div>
          <div class="level-card level-card-pro card reveal" data-theme-select="pro" id="select-pro">
            <div class="level-card-icon">💻</div>
            <h3>Pro Coders</h3>
            <p>Class 9–12 • Real-world DSA, competitive coding & career projects. Go pro!</p>
            <span class="level-card-tag">${icon('terminal', 13)} Hacker Style</span>
          </div>
        </div>
      </section>

      <section class="section container">
        <div class="section-header text-center">
          <h2 class="section-title reveal">Why TheCodeKid?</h2>
          <p class="section-subtitle reveal" style="margin: 0 auto;">Everything you need to become a coding master</p>
        </div>
        <div class="features-grid" style="margin-top: var(--space-2xl);">
          <div class="card feature-card reveal"><div class="feature-icon">${icon('gamepad-2', 24)}</div><h3>Gamified Learning</h3><p>Earn XP, level up, unlock badges, and compete. Learning feels like playing!</p></div>
          <div class="card feature-card reveal"><div class="feature-icon">${icon('puzzle', 24)}</div><h3>Interactive Puzzles</h3><p>Pattern games, brain teasers, and visual challenges. Learn by doing!</p></div>
          <div class="card feature-card reveal"><div class="feature-icon">${icon('globe', 24)}</div><h3>Made for India</h3><p>Cricket scores, Diwali lights, train puzzles — examples from your world!</p></div>
          <div class="card feature-card reveal"><div class="feature-icon">${icon('flame', 24)}</div><h3>Daily Streaks</h3><p>Build momentum with daily games. Maintain your streak for special badges!</p></div>
          <div class="card feature-card reveal"><div class="feature-icon">${icon('code-2', 24)}</div><h3>Real Code Editor</h3><p>Pro students write real code in the browser. No setup needed!</p></div>
          <div class="card feature-card reveal"><div class="feature-icon">${icon('trophy', 24)}</div><h3>Compete & Win</h3><p>Rank on leaderboards, share projects, join coders across India.</p></div>
        </div>
      </section>

      <section class="section container text-center">
        <div class="card-glow reveal" style="padding: var(--space-3xl); max-width: 680px; margin: 0 auto; border-radius: var(--radius-2xl);">
          <h2 class="section-title" style="margin-bottom: var(--space-md);">Ready to Start?</h2>
          <p class="section-subtitle" style="margin: 0 auto var(--space-xl);">Join thousands of students learning to code the fun way!</p>
          <button class="btn btn-primary btn-lg btn-glow ripple" id="cta-start">${icon('arrow-right', 18)} Start Now</button>
        </div>
      </section>

      <footer class="footer container">
        <div class="footer-bottom">
          <span>© 2026 TheCodeKid. Made with ❤️ in India.</span>
          <span>Built for students, by students.</span>
        </div>
      </footer>
    </div>
  `;

  document.getElementById('hero-cta')?.addEventListener('click', () => navigate('/courses'));
  document.getElementById('hero-explore')?.addEventListener('click', () => navigate('/courses'));
  document.getElementById('cta-start')?.addEventListener('click', () => navigate('/courses'));

  document.querySelectorAll('[data-theme-select]').forEach(el => {
    el.addEventListener('click', () => {
      const theme = el.dataset.themeSelect;
      setTheme(theme);
      showToast(`Switched to ${themes[theme].name} theme!`, 'info');
      navigate('/dashboard');
    });
  });

  refreshIcons();
  initReveal();
  initRipple();
}

// --- DASHBOARD ---
function renderDashboard() {
  updateActiveNav('dashboard');
  const stats = gamification.getStats();
  const streakCalendar = gamification.getStreakCalendar();
  const allBadges = gamification.getAllBadges();
  const progressPercent = stats.xpForNext > 0 ? Math.round((stats.xpProgress / stats.xpForNext) * 100) : 100;
  const circumference = 2 * Math.PI * 65;
  const dashOffset = circumference - (circumference * (progressPercent / 100));

  app.innerHTML = `
    <div class="page-enter container">
      <section class="section">
        <div class="section-header animate-fadeInUp">
          <h1 class="section-title">Dashboard</h1>
          <p class="section-subtitle">Track your coding journey</p>
        </div>
        <div class="stat-cards animate-fadeInUp delay-1">
          <div class="card stat-card"><div class="stat-value" style="color: #fbbf24;">${icon('sparkles', 24)} ${stats.xp}</div><div class="stat-label">Total XP</div></div>
          <div class="card stat-card"><div class="stat-value" style="color: var(--accent-secondary);">${stats.level.icon} ${stats.level.level}</div><div class="stat-label">${stats.level.title}</div></div>
          <div class="card stat-card"><div class="stat-value" style="color: #f97316;">${icon('flame', 24)} ${stats.streak}</div><div class="stat-label">Day Streak</div></div>
          <div class="card stat-card"><div class="stat-value" style="color: var(--success);">${icon('check-circle', 24)} ${stats.totalSolves}</div><div class="stat-label">Solved</div></div>
        </div>
        <div class="dashboard-grid" style="margin-top: var(--space-xl);">
          <div class="dashboard-main">
            <div class="card xp-ring-container animate-fadeInUp delay-2">
              <div class="xp-ring">
                <svg viewBox="0 0 150 150"><defs><linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--accent-primary)" /><stop offset="100%" stop-color="var(--accent-tertiary)" /></linearGradient></defs><circle class="xp-ring-bg" cx="75" cy="75" r="65" /><circle class="xp-ring-fill" cx="75" cy="75" r="65" id="xp-ring-progress" style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference};" /></svg>
                <div class="xp-ring-text"><div class="xp-ring-value">${progressPercent}%</div><div class="xp-ring-label">Next Level</div></div>
              </div>
              <div class="xp-info">
                <h3>${stats.level.icon} Level ${stats.level.level} — ${stats.level.title}</h3>
                <p class="xp-next">${stats.nextLevel ? `${stats.xpProgress}/${stats.xpForNext} XP to Level ${stats.nextLevel.level}` : 'Max level! 🎉'}</p>
                <div class="progress-bar"><div class="progress-fill" style="width: ${progressPercent}%;"></div></div>
              </div>
            </div>
            <div class="card animate-fadeInUp delay-3" style="padding: var(--space-xl);">
              <h3 style="margin-bottom: var(--space-lg);">${icon('zap', 20)} Quick Actions</h3>
              <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
                <button class="btn btn-primary ripple" id="dash-courses">${icon('book-open', 16)} ${currentTheme === 'pro' ? 'Continue Coding' : 'Play Games'}</button>
                <button class="btn btn-secondary ripple" id="dash-challenge">${icon('target', 16)} Daily Challenge</button>
                <button class="btn btn-secondary ripple" id="dash-leaderboard">${icon('trophy', 16)} Leaderboard</button>
              </div>
            </div>
          </div>
          <div class="dashboard-sidebar">
            <div class="card streak-calendar animate-fadeInRight delay-2">
              <div class="streak-header"><h3>${icon('flame', 18)} Streak</h3><span style="color: var(--text-muted); font-size: var(--text-xs);">${stats.streak} day${stats.streak !== 1 ? 's' : ''}</span></div>
              <div class="streak-grid">${streakCalendar.map(d => `<div class="streak-day ${d.active ? 'active' : ''} ${d.today ? 'today' : ''}" title="${d.date}"></div>`).join('')}</div>
            </div>
            <div class="card animate-fadeInRight delay-3" style="padding: var(--space-xl);">
              <h3 style="margin-bottom: var(--space-lg);">${icon('award', 18)} Badges <span style="color: var(--text-muted); font-size: var(--text-xs);">${stats.badgesEarned}/${stats.totalBadges}</span></h3>
              <div class="badges-grid">${allBadges.map(b => `<div class="badge-item ${b.earned ? 'earned' : ''}" title="${b.name}: ${b.description}"><div class="badge-item-icon">${b.icon}</div><div class="badge-item-name">${b.name}</div></div>`).join('')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  setTimeout(() => { const ring = document.getElementById('xp-ring-progress'); if (ring) ring.style.strokeDashoffset = dashOffset; }, 400);
  document.getElementById('dash-courses')?.addEventListener('click', () => navigate('/courses'));
  document.getElementById('dash-challenge')?.addEventListener('click', () => navigate('/challenges'));
  document.getElementById('dash-leaderboard')?.addEventListener('click', () => navigate('/leaderboard'));
  refreshIcons(); initRipple();
}

// --- COURSES ---
function renderCourses() {
  updateActiveNav('courses');
  const tier = currentTheme === 'junior' ? 'junior' : currentTheme === 'explorer' ? 'explorer' : currentTheme === 'pro' ? 'pro' : 'explorer';
  const isGameTier = tier === 'junior' || tier === 'explorer';
  const games = isGameTier ? logicGames[tier] : [];
  const problems = !isGameTier ? dsaQuestions[tier] : [];

  let label;
  if (tier === 'junior') label = `${icon('gamepad-2', 24)} Fun Logic Games`;
  else if (tier === 'explorer') label = `${icon('compass', 24)} Logic Missions`;
  else label = `${icon('terminal', 24)} Pro Challenges`;

  app.innerHTML = `
    <div class="page-enter container">
      <section class="section">
        <div class="section-header animate-fadeInUp">
          <h1 class="section-title">${label}</h1>
          <p class="section-subtitle">${tier === 'junior' ? 'Build strong logic through fun games and puzzles!' : tier === 'explorer' ? 'Train your brain with logic puzzles and missions!' : 'Real coding challenges. Real skills.'}</p>
        </div>
        <div class="course-tabs animate-fadeInUp delay-1">
          <button class="course-tab ${tier === 'junior' ? 'active' : ''}" data-tier="junior">${icon('gamepad-2', 14)} Junior (1-5)</button>
          <button class="course-tab ${tier === 'explorer' ? 'active' : ''}" data-tier="explorer">${icon('compass', 14)} Explorer (6-8)</button>
          <button class="course-tab ${tier === 'pro' ? 'active' : ''}" data-tier="pro">${icon('terminal', 14)} Pro (9-12)</button>
        </div>

        ${isGameTier ? `
          <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-xl); flex-wrap: wrap;" class="animate-fadeInUp delay-2">
            <button class="btn btn-primary btn-glow ripple" id="play-all-games">${icon('play', 18)} Play All Games</button>
          </div>
          <div class="course-list">
            ${games.map((g, i) => {
              const solved = gamification.isSolved(g.id);
              return `
                <div class="card course-item ripple animate-fadeInUp delay-${Math.min(i + 3, 8)}" data-game-idx="${i}" data-game-tier="${tier}">
                  <div class="course-item-number" style="${solved ? 'background: var(--success-glow); color: var(--success); border-color: rgba(52,211,153,0.2);' : ''}">${solved ? '✅' : i + 1}</div>
                  <div class="course-item-content">
                    <h3>${g.title}</h3>
                    <p>${g.description.split('\n')[0]}</p>
                  </div>
                  <div class="course-item-meta">
                    <span class="course-item-xp">${icon('sparkles', 14)} ${g.xp} XP</span>
                    <span class="course-item-difficulty difficulty-${g.difficulty}">${g.difficulty}</span>
                    <span class="tag tag-primary" style="font-size: 10px;">${g.category}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="course-list">
            ${problems.map((q, i) => {
              const solved = gamification.isSolved(q.id);
              return `
                <div class="card course-item ripple animate-fadeInUp delay-${Math.min(i + 2, 8)}" data-problem-id="${q.id}" data-tier="${tier}">
                  <div class="course-item-number" style="${solved ? 'background: var(--success-glow); color: var(--success);' : ''}">${solved ? icon('check', 18) : i + 1}</div>
                  <div class="course-item-content"><h3>${q.title}</h3><p>${q.description.split('\n')[0]}</p></div>
                  <div class="course-item-meta">
                    <span class="course-item-xp">${icon('sparkles', 14)} ${q.xp} XP</span>
                    <span class="course-item-difficulty difficulty-${q.difficulty}">${q.difficulty}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </section>
    </div>
  `;

  document.querySelectorAll('.course-tab').forEach(tab => {
    tab.addEventListener('click', () => { setTheme(tab.dataset.tier); renderCourses(); });
  });

  // Game click handlers
  document.querySelectorAll('[data-game-idx]').forEach(item => {
    item.addEventListener('click', () => {
      resetGameState();
      gameState.currentGame = parseInt(item.dataset.gameIdx);
      navigate(`/game/${item.dataset.gameTier}/${item.dataset.gameIdx}`);
    });
  });

  document.getElementById('play-all-games')?.addEventListener('click', () => {
    resetGameState();
    navigate(`/game/${tier}/0`);
  });

  // Problem click handlers (Pro tier)
  document.querySelectorAll('[data-problem-id]').forEach(item => {
    item.addEventListener('click', () => navigate(`/problem/${item.dataset.tier}/${item.dataset.problemId}`));
  });

  refreshIcons(); initRipple();
}

// ============================================
// CODEMONKEY COMMAND PARSER & EXECUTOR
// ============================================
function parseCommands(code) {
  const commands = [];
  const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const loopMatch = line.match(/^loop\((\d+)\)\s*\{?\s*$/);
    if (loopMatch) {
      const count = parseInt(loopMatch[1]);
      const body = [];
      i++;
      while (i < lines.length && lines[i] !== '}') { body.push(lines[i]); i++; }
      for (let j = 0; j < count; j++) body.forEach(b => { if (b.match(/^(step|turnRight|turnLeft)\(\)$/)) commands.push(b); });
    } else if (line.match(/^(step|turnRight|turnLeft)\(\)$/)) {
      commands.push(line);
    }
  }
  return commands;
}

const DIRS = { up: [-1,0], down: [1,0], left: [0,-1], right: [0,1] };
const TURN_RIGHT = { up:'right', right:'down', down:'left', left:'up' };
const TURN_LEFT = { up:'left', left:'down', down:'right', right:'up' };
const DIR_ARROWS = { up:'⬆️', down:'⬇️', left:'⬅️', right:'➡️' };

// ============================================
// INTERACTIVE GAME RENDERER
// ============================================
function renderGame(tier, gameIdx) {
  const games = logicGames[tier];
  if (!games) { navigate('/courses'); return; }
  const idx = parseInt(gameIdx);
  if (idx >= games.length) { renderGameComplete(tier); return; }

  const game = games[idx];
  gameState.currentGame = idx;
  gameState.answered = false;
  gameState.hintShown = false;

  let gameBody = '';

  // ===== JUNIOR TAP GAMES =====
  if (game.type === 'tap-pattern' || game.type === 'tap-count') {
    gameBody = `
      <div class="jr-visual">${game.visual.map((v, i) => `<span class="jr-emoji" style="animation-delay:${i*0.1}s">${v}</span>`).join('')}<span class="jr-emoji mystery">❓</span></div>
      <p class="jr-question">${game.description}</p>
      <div class="jr-options" id="game-options">${game.options.map(o => `<button class="jr-option-btn" data-answer="${o}">${o}</button>`).join('')}</div>`;
  }
  else if (game.type === 'tap-odd') {
    gameBody = `
      <p class="jr-question">${game.description}</p>
      <div class="jr-odd-grid" id="game-options">${game.items.map((item, i) => `<button class="jr-odd-item" data-answer="${item}" style="animation-delay:${i*0.1}s">${item}</button>`).join('')}</div>`;
  }
  else if (game.type === 'tap-compare') {
    gameBody = `
      <p class="jr-question">${game.description}</p>
      <div class="jr-compare" id="game-options">
        <button class="jr-compare-card" data-answer="A"><div class="jr-compare-emoji">${game.optionA.emoji}</div><div class="jr-compare-label">${game.optionA.label}</div></button>
        <div class="jr-vs">VS</div>
        <button class="jr-compare-card" data-answer="B"><div class="jr-compare-emoji">${game.optionB.emoji}</div><div class="jr-compare-label">${game.optionB.label}</div></button>
      </div>`;
  }
  else if (game.type === 'tap-sort') {
    const shuffled = [...game.items].sort(() => Math.random() - 0.5);
    gameBody = `
      <p class="jr-question">${game.description}</p>
      <div class="jr-sort-area">
        <div class="jr-sort-slots" id="jr-slots"></div>
        <div class="jr-sort-items" id="game-options">${shuffled.map(item => `<button class="jr-sort-btn" data-size="${item.size}" data-emoji="${item.emoji}" data-label="${item.label}">${item.emoji}<br><small>${item.label}</small></button>`).join('')}</div>
      </div>`;
  }
  // ===== EXPLORER / OTHER =====
  else if (game.type === 'pattern-sequence' || game.type === 'number-sequence') {
    gameBody = `<div class="game-sequence">${game.sequence.map((item, i) => `<div class="game-sequence-item ${item === '?' ? 'mystery' : ''}" style="animation-delay:${i*0.08}s;">${item === '?' ? '❓' : item}</div>`).join('')}</div>
    <p style="font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-xl);">What comes next?</p>
    <div class="game-options" id="game-options">${game.options.map(o => `<button class="game-option" data-answer="${o}">${o}</button>`).join('')}</div>`;
  }
  else {
    gameBody = `<div class="game-card-description">${game.description.replace(/\n/g,'<br>')}</div>
    <div class="game-options" id="game-options">${game.options.map(o => `<button class="game-option" data-answer="${o}">${o}</button>`).join('')}</div>`;
  }

  app.innerHTML = `<div class="page-enter container"><section class="section"><div class="game-container">
    <div class="game-header animate-fadeInDown"><button class="btn btn-ghost btn-sm" id="back-to-courses">${icon('arrow-left',14)} Back</button>
    <div class="game-score"><div class="game-score-item" style="color:#fbbf24;">${icon('sparkles',18)} ${gameState.score} XP</div><div class="game-score-item" style="color:var(--text-muted);">${idx+1}/${games.length}</div></div></div>
    <div class="game-progress-bar animate-fadeIn"><div class="game-progress-fill" style="width:${(idx/games.length)*100}%;"></div></div>
    <div class="card game-card animate-fadeInUp delay-1"><div class="game-card-category">${game.category}</div><h2>${game.title}</h2>
    ${gameBody}<div id="game-feedback"></div>
    <button class="btn btn-ghost btn-sm" id="show-hint" style="margin-top:var(--space-lg);">${icon('lightbulb',14)} Show Hint</button><div id="hint-area"></div></div>
    <div class="game-nav" id="game-nav" style="display:none;">${idx>0?`<button class="btn btn-ghost ripple" id="prev-game">${icon('arrow-left',14)} Previous</button>`:''}<button class="btn btn-primary btn-glow ripple" id="next-game">${icon('arrow-right',14)} ${idx<games.length-1?'Next Game':'See Results'}</button></div>
  </div></section></div>`;

  // === SORTING GAME HANDLER ===
  if (game.type === 'tap-sort') {
    const sorted = [...game.items].sort((a,b) => a.size - b.size);
    let tapIndex = 0;
    const slotsEl = document.getElementById('jr-slots');
    // Show empty slots
    slotsEl.innerHTML = sorted.map((_, i) => `<div class="jr-slot">${i+1}</div>`).join('');

    document.querySelectorAll('.jr-sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (gameState.answered) return;
        const tappedSize = parseInt(btn.dataset.size);
        const expectedSize = sorted[tapIndex].size;
        if (tappedSize === expectedSize) {
          btn.classList.add('jr-sorted');
          btn.disabled = true;
          const slot = slotsEl.children[tapIndex];
          slot.innerHTML = `${btn.dataset.emoji}`;
          slot.classList.add('jr-slot-filled');
          tapIndex++;
          if (tapIndex >= sorted.length) { gameState.answered = true; handleCorrectAnswer(game); }
        } else {
          btn.classList.add('jr-wrong-shake');
          setTimeout(() => btn.classList.remove('jr-wrong-shake'), 500);
          showToast('Not that one! Try the smallest first.', 'info');
        }
      });
    });
  }
  // === COMPARE GAME HANDLER ===
  else if (game.type === 'tap-compare') {
    document.querySelectorAll('.jr-compare-card').forEach(btn => {
      btn.addEventListener('click', () => {
        if (gameState.answered) return;
        gameState.answered = true;
        const isCorrect = btn.dataset.answer === game.answer;
        document.querySelectorAll('.jr-compare-card').forEach(c => c.classList.add('disabled'));
        if (isCorrect) { btn.classList.add('jr-correct'); handleCorrectAnswer(game); }
        else { btn.classList.add('jr-wrong'); document.querySelectorAll('.jr-compare-card').forEach(c => { if (c.dataset.answer === game.answer) c.classList.add('jr-correct'); }); handleWrongAnswer(game); }
      });
    });
  }
  // === ODD ONE OUT HANDLER ===
  else if (game.type === 'tap-odd') {
    document.querySelectorAll('.jr-odd-item').forEach(btn => {
      btn.addEventListener('click', () => {
        if (gameState.answered) return;
        gameState.answered = true;
        const isCorrect = btn.dataset.answer === game.answer;
        document.querySelectorAll('.jr-odd-item').forEach(o => o.classList.add('disabled'));
        if (isCorrect) { btn.classList.add('jr-correct'); handleCorrectAnswer(game); }
        else { btn.classList.add('jr-wrong'); document.querySelectorAll('.jr-odd-item').forEach(o => { if (o.dataset.answer === game.answer) o.classList.add('jr-correct'); }); handleWrongAnswer(game); }
      });
    });
  }
  // === TAP OPTIONS HANDLER (pattern, count, explorer) ===
  else {
    document.querySelectorAll('#game-options .jr-option-btn, #game-options .game-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (gameState.answered) return;
        gameState.answered = true;
        const isCorrect = String(btn.dataset.answer) === String(game.answer);
        document.querySelectorAll('#game-options .jr-option-btn, #game-options .game-option').forEach(o => o.classList.add('disabled'));
        if (isCorrect) { btn.classList.add('correct'); btn.classList.add('jr-correct'); handleCorrectAnswer(game); }
        else { btn.classList.add('wrong'); btn.classList.add('jr-wrong'); document.querySelectorAll('#game-options .jr-option-btn, #game-options .game-option').forEach(o => { if (String(o.dataset.answer)===String(game.answer)) { o.classList.add('correct'); o.classList.add('jr-correct'); } }); handleWrongAnswer(game); }
      });
    });
  }

  document.getElementById('show-hint')?.addEventListener('click', () => { if (!gameState.hintShown) { gameState.hintShown = true; document.getElementById('hint-area').innerHTML = `<div class="game-hint">${icon('lightbulb',16)} ${game.hint}</div>`; refreshIcons(); }});
  document.getElementById('back-to-courses')?.addEventListener('click', () => navigate('/courses'));
  document.getElementById('prev-game')?.addEventListener('click', () => navigate(`/game/${tier}/${idx-1}`));
  document.getElementById('next-game')?.addEventListener('click', () => navigate(`/game/${tier}/${idx+1}`));
  refreshIcons(); initRipple();
}

// ============================================
// CODEMONKEY SPLIT-SCREEN GAME
// ============================================
function renderCodeMonkeyGame(tier, idx, game) {
  const games = logicGames[tier];
  const gridRows = game.grid.length, gridCols = game.grid[0].length;

  app.innerHTML = `<div class="page-enter"><div class="cm-layout">
    <!-- LEFT: VISUAL WORLD -->
    <div class="cm-world">
      <div class="cm-world-header animate-fadeInDown">
        <button class="btn btn-ghost btn-sm" id="back-to-courses">${icon('arrow-left',14)} Back</button>
        <div class="game-score"><div class="game-score-item" style="color:#fbbf24;">${icon('sparkles',18)} ${gameState.score} XP</div><div class="game-score-item" style="color:var(--text-muted);">Level ${idx+1}/${games.length}</div></div>
      </div>
      <div class="cm-grid-wrap animate-fadeInUp delay-1">
        <div class="cm-grid" id="cm-grid" style="grid-template-columns:repeat(${gridCols},1fr);grid-template-rows:repeat(${gridRows},1fr);">
          ${game.grid.map((row,r) => row.map((cell,c) => {
            let cls = 'cm-cell', content = '';
            const isGoal = game.goals.some(g => g[0]===r && g[1]===c);
            const isObs = game.obstacles?.some(o => o[0]===r && o[1]===c);
            const isStart = game.startPos[0]===r && game.startPos[1]===c;
            if (isStart) { cls += ' cm-player'; content = `<div class="cm-monkey" id="cm-monkey">${DIR_ARROWS[game.startDir]}<br>🐵</div>`; }
            else if (isGoal) { cls += ' cm-goal'; content = cell === '⬜' ? '🍌' : cell; }
            else if (isObs || cell === '🌳') { cls += ' cm-obstacle'; content = '🌳'; }
            else { content = ''; }
            return `<div class="${cls}" data-r="${r}" data-c="${c}">${content}</div>`;
          }).join('')).join('')}
        </div>
        <div class="cm-status" id="cm-status">
          <span id="cm-bananas">🍌 0/${game.goals.length}</span>
          <span id="cm-steps">👣 0 steps</span>
        </div>
      </div>
      <div class="cm-tutorial animate-fadeInUp delay-2" id="cm-tutorial">${icon('lightbulb',16)} ${game.tutorial}</div>
    </div>
    <!-- RIGHT: CODE EDITOR -->
    <div class="cm-editor-panel">
      <div class="cm-editor-header animate-fadeInDown">
        <h3>${icon('code-2',18)} Your Commands</h3>
        <div class="cm-commands-ref">${game.availableCommands.map(c => `<span class="cm-cmd-tag">${c}</span>`).join('')}</div>
      </div>
      <div class="cm-code-area animate-fadeInUp delay-1">
        <textarea class="cm-code-editor" id="cm-code" spellcheck="false" placeholder="Type your commands here...">${game.starterCode}</textarea>
      </div>
      <div class="cm-editor-actions animate-fadeInUp delay-2">
        <button class="btn btn-primary btn-glow ripple" id="cm-run">${icon('play',16)} Run Code</button>
        <button class="btn btn-secondary ripple" id="cm-reset">${icon('rotate-ccw',16)} Reset</button>
        <button class="btn btn-ghost btn-sm" id="cm-solution">${icon('eye',14)} Solution</button>
      </div>
      <div class="cm-output" id="cm-output"></div>
      <div class="game-nav" id="game-nav" style="display:none;">
        ${idx>0?`<button class="btn btn-ghost ripple" id="prev-game">${icon('arrow-left',14)} Previous</button>`:''}
        <button class="btn btn-primary btn-glow ripple" id="next-game">${icon('arrow-right',14)} ${idx<games.length-1?'Next Level':'See Results'}</button>
      </div>
    </div>
  </div></div>`;

  // --- EXECUTION ENGINE ---
  let isRunning = false;

  document.getElementById('cm-run')?.addEventListener('click', async () => {
    if (isRunning) return;
    isRunning = true;
    const code = document.getElementById('cm-code').value;
    const cmds = parseCommands(code);
    const output = document.getElementById('cm-output');

    if (cmds.length === 0) { output.innerHTML = `<div class="cm-error">${icon('alert-circle',16)} No valid commands found! Try step(), turnRight(), turnLeft()</div>`; refreshIcons(); isRunning = false; return; }

    // Reset grid
    let pos = [...game.startPos], dir = game.startDir;
    const collected = new Set();
    let stepCount = 0;
    resetGridVisual(game);

    output.innerHTML = `<div class="cm-running">${icon('loader',16)} Running...</div>`;
    refreshIcons();

    for (let i = 0; i < cmds.length; i++) {
      const cmd = cmds[i];
      await sleep(400);

      if (cmd === 'step()') {
        const d = DIRS[dir];
        const nr = pos[0] + d[0], nc = pos[1] + d[1];
        if (nr < 0 || nr >= gridRows || nc < 0 || nc >= gridCols) { output.innerHTML = `<div class="cm-error">💥 Milo hit the wall at step ${i+1}!</div>`; isRunning = false; return; }
        if (game.obstacles?.some(o => o[0]===nr && o[1]===nc) || game.grid[nr][nc] === '🌳') { output.innerHTML = `<div class="cm-error">🌳 Milo hit a tree at step ${i+1}!</div>`; isRunning = false; return; }
        moveMonkey(pos, [nr, nc], dir);
        pos = [nr, nc];
        stepCount++;
        // Check if goal
        const goalKey = `${nr},${nc}`;
        if (game.goals.some(g => g[0]===nr && g[1]===nc) && !collected.has(goalKey)) {
          collected.add(goalKey);
          const goalCell = document.querySelector(`.cm-cell[data-r="${nr}"][data-c="${nc}"]`);
          if (goalCell) goalCell.classList.add('cm-collected');
        }
      } else if (cmd === 'turnRight()') { dir = TURN_RIGHT[dir]; updateMonkeyDir(dir); }
      else if (cmd === 'turnLeft()') { dir = TURN_LEFT[dir]; updateMonkeyDir(dir); }

      document.getElementById('cm-bananas').textContent = `🍌 ${collected.size}/${game.goals.length}`;
      document.getElementById('cm-steps').textContent = `👣 ${stepCount} steps`;
    }

    await sleep(300);
    // Check win
    if (collected.size === game.goals.length) {
      const stars = getStars(game, stepCount);
      output.innerHTML = `<div class="cm-success">
        <div style="font-size:3rem;margin-bottom:8px;">🎉</div>
        <h3>Level Complete!</h3>
        <div class="cm-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
        <p>${stepCount} steps used • ${collected.size} goals collected</p>
        <div style="display:flex;gap:var(--space-md);justify-content:center;margin-top:var(--space-lg);">
          ${idx>0?`<button class="btn btn-ghost ripple" onclick="location.hash='#/game/${tier}/${idx-1}'">${icon('arrow-left',14)} Previous</button>`:''}
          <button class="btn btn-primary btn-glow ripple" onclick="location.hash='#/game/${tier}/${idx+1}'">${icon('arrow-right',14)} ${idx<games.length-1?'Next Level':'See Results'}</button>
        </div>
      </div>`;
      output.scrollIntoView({ behavior: 'smooth', block: 'center' });
      refreshIcons(); initRipple();
      if (!gameState.answered) { gameState.answered = true; handleCorrectAnswer(game); }
    } else {
      output.innerHTML = `<div class="cm-error">
        <div style="font-size:2rem;margin-bottom:8px;">🤔</div>
        <h3>Not all goals reached!</h3>
        <p>Collected ${collected.size}/${game.goals.length}. Try a different path!</p>
      </div>`;
    }
    isRunning = false;
  });

  document.getElementById('cm-reset')?.addEventListener('click', () => { resetGridVisual(game); document.getElementById('cm-output').innerHTML = ''; document.getElementById('cm-bananas').textContent = `🍌 0/${game.goals.length}`; document.getElementById('cm-steps').textContent = '👣 0 steps'; });
  document.getElementById('cm-solution')?.addEventListener('click', () => { document.getElementById('cm-code').value = game.solution; showToast('Solution revealed! Click Run to see it work.', 'info'); });
  document.getElementById('back-to-courses')?.addEventListener('click', () => navigate('/courses'));
  document.getElementById('prev-game')?.addEventListener('click', () => navigate(`/game/${tier}/${idx-1}`));
  document.getElementById('next-game')?.addEventListener('click', () => navigate(`/game/${tier}/${idx+1}`));
  refreshIcons(); initRipple();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function moveMonkey(from, to, dir) {
  const fromCell = document.querySelector(`.cm-cell[data-r="${from[0]}"][data-c="${from[1]}"]`);
  const toCell = document.querySelector(`.cm-cell[data-r="${to[0]}"][data-c="${to[1]}"]`);
  if (fromCell) { fromCell.innerHTML = ''; fromCell.classList.remove('cm-player'); }
  if (toCell) { toCell.innerHTML = `<div class="cm-monkey" id="cm-monkey">${DIR_ARROWS[dir]}<br>🐵</div>`; toCell.classList.add('cm-player'); }
}

function updateMonkeyDir(dir) {
  const monkey = document.getElementById('cm-monkey');
  if (monkey) monkey.innerHTML = `${DIR_ARROWS[dir]}<br>🐵`;
}

function resetGridVisual(game) {
  document.querySelectorAll('.cm-cell').forEach(cell => {
    const r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
    cell.classList.remove('cm-player','cm-collected');
    const isGoal = game.goals.some(g => g[0]===r && g[1]===c);
    const isObs = game.obstacles?.some(o => o[0]===r && o[1]===c);
    const isStart = game.startPos[0]===r && game.startPos[1]===c;
    if (isStart) { cell.classList.add('cm-player'); cell.innerHTML = `<div class="cm-monkey" id="cm-monkey">${DIR_ARROWS[game.startDir]}<br>🐵</div>`; }
    else if (isGoal) { cell.classList.add('cm-goal'); cell.innerHTML = game.grid[r][c] === '⬜' ? '🍌' : game.grid[r][c]; }
    else if (isObs || game.grid[r][c] === '🌳') { cell.innerHTML = '🌳'; }
    else { cell.innerHTML = ''; }
  });
}

function getStars(game, steps) {
  const s = game.stars;
  const thresholds = Object.keys(s).map(Number).sort((a,b) => a-b);
  for (const t of thresholds) { if (steps <= t) return s[t]; }
  return 1;
}

function handleCorrectAnswer(game) {
  const isNew = gamification.solveProblem(game);
  if (isNew) gameState.score += game.xp;
  const feedback = document.getElementById('game-feedback');
  feedback.innerHTML = `
    <div class="game-result success" style="margin-top: var(--space-xl);">
      <div class="game-result-icon">🎉</div>
      <h3>Correct! Amazing!</h3>
      <p>${isNew ? `+${game.xp} XP earned!` : 'Already solved — great for practice!'}</p>
    </div>
  `;
  if (currentTheme === 'junior' && window.triggerConfetti) window.triggerConfetti();
  document.getElementById('game-nav').style.display = 'flex';
}

function handleWrongAnswer(game) {
  const feedback = document.getElementById('game-feedback');
  feedback.innerHTML = `
    <div class="game-result failure" style="margin-top: var(--space-xl);">
      <div class="game-result-icon">🤔</div>
      <h3>Not quite!</h3>
      <p>The correct answer is highlighted. Got it? Try the next one!</p>
    </div>
  `;
  document.getElementById('game-nav').style.display = 'flex';
}

function renderGameComplete(tier) {
  const games = logicGames[tier];
  const totalXP = games.reduce((sum, g) => sum + (gamification.isSolved(g.id) ? g.xp : 0), 0);
  const solved = games.filter(g => gamification.isSolved(g.id)).length;

  app.innerHTML = `
    <div class="page-enter container">
      <section class="section">
        <div class="game-container">
          <div class="game-complete card animate-fadeInUp">
            <div class="game-complete-icon">🏆</div>
            <h2>Games Complete!</h2>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-xl);">You finished all ${tier === 'junior' ? 'Junior' : 'Explorer'} logic games!</p>
            <div class="game-complete-stats">
              <div class="game-complete-stat"><div class="game-complete-stat-value">${solved}/${games.length}</div><div class="game-complete-stat-label">Solved</div></div>
              <div class="game-complete-stat"><div class="game-complete-stat-value">${totalXP}</div><div class="game-complete-stat-label">XP Earned</div></div>
              <div class="game-complete-stat"><div class="game-complete-stat-value">${Math.round((solved / games.length) * 100)}%</div><div class="game-complete-stat-label">Accuracy</div></div>
            </div>
            <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-primary btn-glow ripple" id="replay-games">${icon('rotate-ccw', 16)} Play Again</button>
              <button class="btn btn-secondary ripple" id="go-dashboard">${icon('layout-dashboard', 16)} Dashboard</button>
              <button class="btn btn-secondary ripple" id="go-challenges">${icon('target', 16)} Challenges</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  document.getElementById('replay-games')?.addEventListener('click', () => { resetGameState(); navigate(`/game/${tier}/0`); });
  document.getElementById('go-dashboard')?.addEventListener('click', () => navigate('/dashboard'));
  document.getElementById('go-challenges')?.addEventListener('click', () => navigate('/challenges'));
  refreshIcons(); initRipple();
}

// --- PROBLEM VIEW (Pro Tier) ---
function renderProblem(tier, problemId) {
  const question = dsaQuestions[tier]?.find(q => q.id === problemId);
  if (!question) { app.innerHTML = `<div class="container section text-center"><h2>Not found</h2><button class="btn btn-primary" onclick="location.hash='#/courses'">← Back</button></div>`; return; }
  const solved = gamification.isSolved(question.id);

  app.innerHTML = `
    <div class="page-enter">
      <div class="problem-layout">
        <div class="problem-description glass-medium">
          <button class="btn btn-ghost btn-sm" id="back-to-courses">${icon('arrow-left', 14)} Back</button>
          <h1 class="problem-title" style="margin-top: var(--space-lg);">${question.title}</h1>
          <div class="problem-meta">
            <span class="tag tag-primary">${question.category}</span>
            <span class="course-item-difficulty difficulty-${question.difficulty}">${question.difficulty}</span>
            <span style="color: #fbbf24; font-weight: 600;">${icon('sparkles', 14)} ${question.xp} XP</span>
            ${solved ? '<span class="tag tag-success">✅ Solved</span>' : ''}
          </div>
          <div class="problem-body">
            <p>${question.description.replace(/\n/g, '<br>')}</p>
            <h3>Examples</h3>
            ${question.examples.map(ex => `<pre><code>Input: ${ex.input}\nOutput: ${ex.output}</code></pre>`).join('')}
            <h3>${icon('lightbulb', 16)} Hint</h3>
            <p><em>${question.hint}</em></p>
          </div>
        </div>
        <div class="problem-editor">
          <div class="code-editor-container" style="flex: 1; display: flex; flex-direction: column;">
            <div class="code-editor-header">
              <div class="code-editor-dots"><div class="code-editor-dot red"></div><div class="code-editor-dot yellow"></div><div class="code-editor-dot green"></div></div>
              <span class="code-editor-lang">JavaScript</span>
            </div>
            <div class="code-editor-body" style="flex: 1;">
              <div class="code-line-numbers" id="line-numbers">1</div>
              <textarea class="code-textarea" id="code-editor" spellcheck="false">${question.starterCode}</textarea>
            </div>
            <div class="code-editor-actions">
              <button class="btn btn-secondary btn-sm ripple" id="run-code">${icon('play', 14)} Run</button>
              <button class="btn btn-primary btn-sm ripple" id="submit-code">${icon('send', 14)} Submit</button>
              <button class="btn btn-ghost btn-sm" id="reset-code">${icon('rotate-ccw', 14)} Reset</button>
              <button class="btn btn-ghost btn-sm" id="show-solution">${icon('eye', 14)} Solution</button>
            </div>
            <div class="code-output" id="code-output">// Output appears here...</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const editor = document.getElementById('code-editor'), output = document.getElementById('code-output'), lineNumbers = document.getElementById('line-numbers');
  function updateLineNumbers() { const lines = editor.value.split('\n').length; lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('\n'); }
  editor.addEventListener('input', updateLineNumbers); updateLineNumbers();
  editor.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = editor.selectionStart; editor.value = editor.value.substring(0, s) + '  ' + editor.value.substring(editor.selectionEnd); editor.selectionStart = editor.selectionEnd = s + 2; }});

  document.getElementById('run-code')?.addEventListener('click', () => { output.className = 'code-output'; try { const code = editor.value; const m = code.match(/function\s+(\w+)/); if (!m) { output.textContent = '❌ No function found!'; output.classList.add('error'); return; } const t = question.testCases[0]; const fn = new Function(code + `\nreturn ${m[1]}(...${JSON.stringify(t.input)})`); const r = fn(); const pass = JSON.stringify(r) === JSON.stringify(t.expected); output.textContent = `Input: ${JSON.stringify(t.input)}\nOutput: ${JSON.stringify(r)}\nExpected: ${JSON.stringify(t.expected)}\n\n${pass ? '✅ Test passed!' : '❌ Wrong answer'}`; if (!pass) output.classList.add('error'); } catch (e) { output.textContent = `❌ Error: ${e.message}`; output.classList.add('error'); }});

  document.getElementById('submit-code')?.addEventListener('click', () => { output.className = 'code-output'; try { const code = editor.value; const m = code.match(/function\s+(\w+)/); if (!m) { output.textContent = '❌ No function found!'; output.classList.add('error'); return; } let allPassed = true, txt = ''; for (let i = 0; i < question.testCases.length; i++) { const t = question.testCases[i]; const fn = new Function(code + `\nreturn ${m[1]}(...${JSON.stringify(t.input)})`); const r = fn(); const pass = JSON.stringify(r) === JSON.stringify(t.expected); txt += `Test ${i + 1}: ${pass ? '✅' : '❌'} → Got: ${JSON.stringify(r)}${pass ? '' : ` (Expected: ${JSON.stringify(t.expected)})`}\n`; if (!pass) allPassed = false; } if (allPassed) { txt += '\n🎉 All tests passed! '; const isNew = gamification.solveProblem(question); if (isNew) txt += `+${question.xp} XP!`; else txt += '(Already solved)'; } else { txt += '\n❌ Some tests failed.'; output.classList.add('error'); } output.textContent = txt; } catch (e) { output.textContent = `❌ Error: ${e.message}`; output.classList.add('error'); }});

  document.getElementById('reset-code')?.addEventListener('click', () => { editor.value = question.starterCode; updateLineNumbers(); output.textContent = '// Output appears here...'; output.className = 'code-output'; });
  document.getElementById('show-solution')?.addEventListener('click', () => { editor.value = question.solution; updateLineNumbers(); showToast('Solution revealed!', 'info'); });
  document.getElementById('back-to-courses')?.addEventListener('click', () => navigate('/courses'));
  refreshIcons(); initRipple();
}

// --- CHALLENGES ---
function renderChallenges() {
  updateActiveNav('challenges');
  const isGameTier = currentTheme === 'junior' || currentTheme === 'explorer';
  const tier = currentTheme === 'junior' ? 'junior' : currentTheme === 'explorer' ? 'explorer' : 'pro';
  const allItems = isGameTier ? logicGames[tier] : [...dsaQuestions.junior, ...dsaQuestions.explorer, ...dsaQuestions.pro];
  const unsolved = allItems.filter(q => !gamification.isSolved(q.id));
  const daily = unsolved.length > 0 ? unsolved[Math.floor(Date.now() / 86400000) % unsolved.length] : allItems[0];

  app.innerHTML = `
    <div class="page-enter container">
      <section class="section">
        <div class="section-header animate-fadeInUp">
          <h1 class="section-title">${icon('target', 28)} Daily Challenge</h1>
          <p class="section-subtitle">Test your skills with today's challenge!</p>
        </div>
        <div class="daily-challenge-card card animate-fadeInUp delay-1" style="margin-bottom: var(--space-2xl);">
          <span class="daily-badge">${icon('zap', 12)} TODAY'S CHALLENGE</span>
          <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-sm); position:relative; z-index:1;">${daily.title}</h2>
          <p style="color: var(--text-secondary); position: relative; z-index:1;">${daily.description.split('\n')[0]}</p>
          <div style="display: flex; gap: var(--space-md); margin: var(--space-lg) 0; position:relative; z-index:1;">
            <span class="tag tag-primary">${daily.category}</span>
            <span class="course-item-difficulty difficulty-${daily.difficulty}">${daily.difficulty}</span>
            <span style="color: #fbbf24; font-weight: 600;">${icon('sparkles', 14)} ${daily.xp} XP</span>
          </div>
          <button class="btn btn-primary btn-glow ripple" id="start-daily">${icon('play', 16)} Accept Challenge</button>
        </div>

        <div class="card animate-fadeInUp delay-2" style="padding: var(--space-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><h3>${icon('flame', 20)} Daily Streak: ${gamification.getStreak()} Days</h3><p style="color: var(--text-secondary); font-size: var(--text-sm); margin-top: 4px;">${isGameTier ? 'Play every day to keep your streak!' : 'Code every day!'}</p></div>
            <div style="font-size: 2.5rem;">${gamification.getStreak() >= 7 ? '🏆' : gamification.getStreak() >= 3 ? '🔥' : '💪'}</div>
          </div>
          <div class="progress-bar" style="margin-top: var(--space-lg);">
            <div class="progress-fill" style="width: ${Math.min(100, (gamification.getStreak() / 7) * 100)}%;"></div>
          </div>
        </div>
      </section>
    </div>
  `;

  document.getElementById('start-daily')?.addEventListener('click', () => {
    if (isGameTier) {
      const idx = logicGames[tier].findIndex(g => g.id === daily.id);
      navigate(`/game/${tier}/${idx >= 0 ? idx : 0}`);
    } else {
      const t = dsaQuestions.junior.includes(daily) ? 'junior' : dsaQuestions.explorer.includes(daily) ? 'explorer' : 'pro';
      navigate(`/problem/${t}/${daily.id}`);
    }
  });

  refreshIcons(); initRipple();
}

// --- LEADERBOARD ---
function renderLeaderboard() {
  updateActiveNav('leaderboard');
  const stats = gamification.getStats();
  const names = ['Arjun Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Singh', 'Aditya Gupta', 'Kavya Nair', 'Dev Malhotra', 'Ananya Reddy', 'Vikram Rao', 'Isha Verma'];
  const schools = ['DPS Gurgaon', 'DAV Delhi', 'Ryan Mumbai', 'Kendriya Vidyalaya', 'CBSE School Pune'];
  const avatars = ['AK', 'PP', 'RK', 'SS', 'AG', 'KN', 'DM', 'AR', 'VR', 'IV'];
  const users = names.map((name, i) => ({ name, school: schools[i % schools.length], avatar: avatars[i], xp: Math.floor(Math.random() * 3000) + 200, level: Math.floor(Math.random() * 10) + 1, badges: Math.floor(Math.random() * 8) + 1, isYou: false }));
  users.push({ name: 'You', school: 'Your School', avatar: '⭐', xp: stats.xp, level: stats.level.level, badges: stats.badgesEarned, isYou: true });
  users.sort((a, b) => b.xp - a.xp);

  app.innerHTML = `
    <div class="page-enter container">
      <section class="section">
        <div class="section-header animate-fadeInUp"><h1 class="section-title">${icon('trophy', 28)} Leaderboard</h1></div>
        <div class="card animate-fadeInUp delay-1" style="padding: 0; overflow: hidden;">
          <table class="leaderboard-table">
            <thead><tr><th>Rank</th><th>Coder</th><th>Level</th><th>XP</th></tr></thead>
            <tbody>
              ${users.map((u, i) => `<tr ${u.isYou ? 'style="background: var(--accent-glow);"' : ''}>
                <td class="leaderboard-rank ${i < 3 ? 'rank-' + (i+1) : ''}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                <td><div class="leaderboard-user"><div class="leaderboard-avatar">${u.avatar}</div><div><div class="leaderboard-name">${u.name} ${u.isYou ? '<span class="tag tag-primary" style="font-size:9px;">YOU</span>' : ''}</div><div class="leaderboard-school">${u.school}</div></div></div></td>
                <td class="leaderboard-level">Lv ${u.level}</td>
                <td class="leaderboard-xp">${icon('sparkles', 14)} ${u.xp.toLocaleString()}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
  refreshIcons();
}

// --- COMMUNITY ---
function renderCommunity() {
  updateActiveNav('community');
  const projects = [
    { title: 'Snake Game', author: 'Arjun S.', icon: '🐍', likes: 42, color: 'linear-gradient(135deg, #22c55e, #16a34a)' },
    { title: 'Cricket Score App', author: 'Priya P.', icon: '🏏', likes: 38, color: 'linear-gradient(135deg, #7c6cf0, #a78bfa)' },
    { title: 'Diwali Lights', author: 'Rohit K.', icon: '🪔', likes: 55, color: 'linear-gradient(135deg, #f97316, #fbbf24)' },
    { title: 'Weather App', author: 'Sneha S.', icon: '🌤️', likes: 29, color: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
    { title: 'Quiz Master', author: 'Dev M.', icon: '🧠', likes: 33, color: 'linear-gradient(135deg, #e945a0, #a855f7)' },
    { title: 'Maze Runner', author: 'Aditya G.', icon: '🏃', likes: 51, color: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
  ];

  app.innerHTML = `
    <div class="page-enter container">
      <section class="section">
        <div class="section-header animate-fadeInUp"><h1 class="section-title">${icon('users', 28)} Community</h1><p class="section-subtitle">Projects built by students across India</p></div>
        <div class="community-grid">${projects.map((p, i) => `
          <div class="card project-card animate-fadeInUp delay-${Math.min(i + 2, 8)}">
            <div class="project-preview" style="background: ${p.color};"><span style="font-size: 3.5rem; position: relative; z-index:1;">${p.icon}</span></div>
            <div class="project-info">
              <div class="project-title">${p.title}</div>
              <div class="project-author">by ${p.author}</div>
              <div class="project-actions">
                <button class="project-action-btn like-btn" data-likes="${p.likes}">${icon('heart', 14)} <span class="like-count">${p.likes}</span></button>
                <button class="project-action-btn">${icon('share-2', 14)} Share</button>
              </div>
            </div>
          </div>`).join('')}
        </div>
      </section>
    </div>
  `;

  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('liked');
      const c = btn.querySelector('.like-count'), b = parseInt(btn.dataset.likes);
      c.textContent = btn.classList.contains('liked') ? b + 1 : b;
    });
  });
  refreshIcons(); initRipple();
}

// ============================================
// ROUTER
// ============================================
function handleRoute() {
  const route = getRoute();
  if (route === '/' || route === '') renderHome();
  else if (route === '/dashboard') renderDashboard();
  else if (route === '/courses') renderCourses();
  else if (route.startsWith('/game/')) { const p = route.split('/'); renderGame(p[2], p[3]); }
  else if (route.startsWith('/problem/')) { const p = route.split('/'); renderProblem(p[2], p[3]); }
  else if (route === '/challenges') renderChallenges();
  else if (route === '/leaderboard') renderLeaderboard();
  else if (route === '/community') renderCommunity();
  else renderHome();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// UTILITIES
// ============================================
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .reveal-scale').forEach(el => observer.observe(el));
}

function initRipple() {
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple-effect');
      const rect = btn.getBoundingClientRect(), size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = e.clientX - rect.left - size / 2 + 'px';
      circle.style.top = e.clientY - rect.top - size / 2 + 'px';
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 700);
    });
  });
}

function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function animate() { cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08; glow.style.left = cx + 'px'; glow.style.top = cy + 'px'; requestAnimationFrame(animate); }
  animate();
}

// ============================================
// INIT
// ============================================
function init() {
  setTheme(currentTheme); initConfetti(); initCursorGlow();
  gamification.checkStreak(); gamification.updateNavbar();
  refreshIcons();
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
  const menuBtn = document.getElementById('nav-menu-btn'), navLinks = document.getElementById('nav-links');
  menuBtn?.addEventListener('click', () => { menuBtn.classList.toggle('active'); navLinks.classList.toggle('open'); });
  navLinks?.addEventListener('click', (e) => { if (e.target.closest('.nav-link')) { menuBtn.classList.remove('active'); navLinks.classList.remove('open'); }});
  document.getElementById('nav-brand')?.addEventListener('click', () => navigate('/'));
}

document.addEventListener('DOMContentLoaded', init);
