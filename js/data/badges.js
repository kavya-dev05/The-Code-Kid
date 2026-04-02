// Badges Data
export const badges = [
  { id: 'logic_genius', name: 'Logic Genius', icon: '🧠', description: 'Solved 10 logic puzzles', requirement: { type: 'solves', category: 'Logic', count: 10 } },
  { id: 'python_starter', name: 'Python Starter', icon: '🐍', description: 'Completed first coding challenge', requirement: { type: 'total_solves', count: 1 } },
  { id: 'debug_master', name: 'Debugging Master', icon: '🔧', description: 'Fixed 5 broken programs', requirement: { type: 'total_solves', count: 5 } },
  { id: 'project_builder', name: 'Project Builder', icon: '🚀', description: 'Built 3 projects', requirement: { type: 'projects', count: 3 } },
  { id: 'streak_warrior', name: 'Streak Warrior', icon: '🔥', description: '7 day coding streak', requirement: { type: 'streak', count: 7 } },
  { id: 'century', name: 'Century Maker', icon: '💯', description: 'Earned 100 XP', requirement: { type: 'xp', count: 100 } },
  { id: 'array_ace', name: 'Array Ace', icon: '📊', description: 'Solved 5 array problems', requirement: { type: 'solves', category: 'Arrays', count: 5 } },
  { id: 'sort_master', name: 'Sort Master', icon: '🔄', description: 'Solved all sorting problems', requirement: { type: 'solves', category: 'Sorting', count: 3 } },
  { id: 'first_blood', name: 'First Blood', icon: '⚡', description: 'Solved a problem in under 60 seconds', requirement: { type: 'speed', seconds: 60 } },
  { id: 'diwali_dev', name: 'Diwali Dev', icon: '🪔', description: 'Completed the Diwali challenge', requirement: { type: 'specific', problemId: 'p5' } },
  { id: 'cricket_coder', name: 'Cricket Coder', icon: '🏏', description: 'Completed the Cricket challenge', requirement: { type: 'specific', problemId: 'e5' } },
  { id: 'perfectionist', name: 'Perfectionist', icon: '✨', description: 'Got 100% on first try', requirement: { type: 'perfect', count: 1 } },
];

export const levels = [
  { level: 1, title: 'Beginner', xpRequired: 0, icon: '🌱' },
  { level: 2, title: 'Curious Coder', xpRequired: 50, icon: '🔍' },
  { level: 3, title: 'Bug Squasher', xpRequired: 120, icon: '🐛' },
  { level: 4, title: 'Pattern Finder', xpRequired: 200, icon: '🧩' },
  { level: 5, title: 'Logic Master', xpRequired: 350, icon: '🧠' },
  { level: 6, title: 'Algorithm Ace', xpRequired: 500, icon: '⚡' },
  { level: 7, title: 'Data Wrangler', xpRequired: 700, icon: '📊' },
  { level: 8, title: 'Code Ninja', xpRequired: 900, icon: '🥷' },
  { level: 9, title: 'System Architect', xpRequired: 1200, icon: '🏗️' },
  { level: 10, title: 'Code Warrior', xpRequired: 1500, icon: '⚔️' },
  { level: 15, title: 'Digital Wizard', xpRequired: 2500, icon: '🧙‍♂️' },
  { level: 20, title: 'Coding Ninja', xpRequired: 4000, icon: '🐉' },
];
