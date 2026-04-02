// Gamification System — XP, Levels, Badges, Streaks
import { badges, levels } from './data/badges.js';

class Gamification {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem('codequest_state');
      if (saved) return JSON.parse(saved);
    } catch(e) { /* ignore */ }
    return {
      xp: 0,
      level: 1,
      solvedProblems: [],
      badges: [],
      streak: 0,
      lastVisit: null,
      dailyChallengeCompleted: false,
      totalSolves: 0,
      categorySolves: {},
      projectsBuilt: 0,
      startTime: null,
    };
  }

  saveState() {
    try {
      localStorage.setItem('codequest_state', JSON.stringify(this.state));
    } catch(e) { /* ignore */ }
    this.notify();
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // XP
  addXP(amount, reason) {
    this.state.xp += amount;
    this.saveState();
    this.checkLevelUp();
    showToast(`+${amount} XP — ${reason}`, 'xp');
    this.updateNavbar();
    return amount;
  }

  getXP() { return this.state.xp; }

  // Level
  getCurrentLevel() {
    let currentLevel = levels[0];
    for (const lvl of levels) {
      if (this.state.xp >= lvl.xpRequired) {
        currentLevel = lvl;
      } else break;
    }
    return currentLevel;
  }

  getNextLevel() {
    const current = this.getCurrentLevel();
    const idx = levels.findIndex(l => l.level === current.level);
    return levels[idx + 1] || null;
  }

  checkLevelUp() {
    const newLevel = this.getCurrentLevel();
    if (newLevel.level > this.state.level) {
      this.state.level = newLevel.level;
      this.saveState();
      this.showLevelUp(newLevel);
    }
  }

  showLevelUp(level) {
    const modal = document.getElementById('levelup-modal');
    document.getElementById('levelup-level-text').textContent = `Level ${level.level}`;
    document.getElementById('levelup-title-text').textContent = `${level.icon} ${level.title}`;
    document.getElementById('levelup-xp-text').textContent = `${level.xpRequired} XP`;
    modal.style.display = 'flex';

    // Trigger confetti
    if (window.triggerConfetti) window.triggerConfetti();

    document.getElementById('levelup-close').onclick = () => {
      modal.style.display = 'none';
    };
  }

  // Streaks
  checkStreak() {
    const today = new Date().toDateString();
    if (this.state.lastVisit === today) return;

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (this.state.lastVisit === yesterday) {
      this.state.streak += 1;
      if (this.state.streak >= 7) {
        this.checkBadge('streak_warrior');
      }
      showToast(`🔥 ${this.state.streak} Day Streak!`, 'streak');
    } else if (this.state.lastVisit !== today) {
      this.state.streak = 1;
    }
    this.state.lastVisit = today;
    this.state.dailyChallengeCompleted = false;
    this.saveState();
    this.updateNavbar();
  }

  getStreak() { return this.state.streak; }

  // Problem Solving
  solveProblem(problem) {
    if (this.state.solvedProblems.includes(problem.id)) {
      showToast('Already solved! Try another challenge.', 'info');
      return false;
    }

    this.state.solvedProblems.push(problem.id);
    this.state.totalSolves += 1;

    // Category tracking
    if (problem.category) {
      this.state.categorySolves[problem.category] = 
        (this.state.categorySolves[problem.category] || 0) + 1;
    }

    this.addXP(problem.xp, problem.title);
    this.saveState();

    // Check badges
    this.checkAllBadges(problem);

    return true;
  }

  isSolved(problemId) {
    return this.state.solvedProblems.includes(problemId);
  }

  // Badges
  checkAllBadges(problem) {
    for (const badge of badges) {
      if (this.state.badges.includes(badge.id)) continue;

      const req = badge.requirement;
      let earned = false;

      switch (req.type) {
        case 'total_solves':
          earned = this.state.totalSolves >= req.count;
          break;
        case 'solves':
          earned = (this.state.categorySolves[req.category] || 0) >= req.count;
          break;
        case 'xp':
          earned = this.state.xp >= req.count;
          break;
        case 'streak':
          earned = this.state.streak >= req.count;
          break;
        case 'projects':
          earned = this.state.projectsBuilt >= req.count;
          break;
        case 'specific':
          earned = this.state.solvedProblems.includes(req.problemId);
          break;
      }

      if (earned) {
        this.awardBadge(badge);
      }
    }
  }

  checkBadge(badgeId) {
    if (this.state.badges.includes(badgeId)) return;
    const badge = badges.find(b => b.id === badgeId);
    if (badge) this.awardBadge(badge);
  }

  awardBadge(badge) {
    this.state.badges.push(badge.id);
    this.saveState();
    this.showBadgeModal(badge);
  }

  showBadgeModal(badge) {
    setTimeout(() => {
      const modal = document.getElementById('badge-modal');
      document.getElementById('badge-icon-display').textContent = badge.icon;
      document.getElementById('badge-name-text').textContent = badge.name;
      document.getElementById('badge-desc-text').textContent = badge.description;
      modal.style.display = 'flex';

      document.getElementById('badge-close').onclick = () => {
        modal.style.display = 'none';
      };
    }, 1500);
  }

  getEarnedBadges() {
    return badges.filter(b => this.state.badges.includes(b.id));
  }

  getAllBadges() {
    return badges.map(b => ({
      ...b,
      earned: this.state.badges.includes(b.id)
    }));
  }

  // Streak calendar data (last 28 days)
  getStreakCalendar() {
    const days = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toDateString(),
        active: i < this.state.streak,
        today: i === 0
      });
    }
    return days;
  }

  // Progress stats
  getStats() {
    const currentLevel = this.getCurrentLevel();
    const nextLevel = this.getNextLevel();
    const xpForNext = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : 0;
    const xpProgress = nextLevel ? this.state.xp - currentLevel.xpRequired : xpForNext;

    return {
      xp: this.state.xp,
      level: currentLevel,
      nextLevel,
      xpProgress,
      xpForNext,
      streak: this.state.streak,
      totalSolves: this.state.totalSolves,
      badgesEarned: this.state.badges.length,
      totalBadges: badges.length,
      solvedProblems: this.state.solvedProblems,
    };
  }

  // Update navbar
  updateNavbar() {
    const xpEl = document.getElementById('nav-xp-count');
    const streakEl = document.getElementById('nav-streak-count');
    const levelEl = document.getElementById('nav-level-badge');

    if (xpEl) xpEl.textContent = this.state.xp;
    if (streakEl) streakEl.textContent = this.state.streak;
    if (levelEl) {
      const lvl = this.getCurrentLevel();
      levelEl.textContent = `Lv ${lvl.level}`;
    }
  }

  // Reset (for testing)
  reset() {
    localStorage.removeItem('codequest_state');
    this.state = this.loadState();
    this.updateNavbar();
    this.notify();
  }
}

// Toast notification helper
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { xp: '⭐', badge: '🏆', streak: '🔥', info: '💡', success: '✅', error: '❌' };
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '💡'}</span>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Confetti
export function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animating = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 3 + 2;
      this.speedX = Math.random() * 4 - 2;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 10 - 5;
      this.color = ['#ff6b9d', '#ffd700', '#00d2ff', '#c44dff', '#3fb950', '#ff6b6b', '#fdcb6e'][Math.floor(Math.random() * 7)];
      this.opacity = 1;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;
      this.opacity -= 0.005;
      return this.opacity > 0 && this.y < canvas.height;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  function animate() {
    if (!animating && particles.length === 0) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => {
      p.draw();
      return p.update();
    });
    if (particles.length > 0 || animating) {
      requestAnimationFrame(animate);
    }
  }

  window.triggerConfetti = () => {
    animating = true;
    for (let i = 0; i < 100; i++) {
      setTimeout(() => particles.push(new Particle()), Math.random() * 500);
    }
    setTimeout(() => { animating = false; }, 2000);
    animate();
  };
}

export const gamification = new Gamification();
