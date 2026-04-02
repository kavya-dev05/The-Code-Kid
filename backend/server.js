const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5500',        // VS Code Live Server (most common)
    'http://127.0.0.1:5500',
    'http://localhost:3001',
    'https://thecodekid.vercel.app', // replace with your real domain after deploy
  ],
  credentials: true,
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/user',        require('./routes/user'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// ─── Health check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'TheCodeKid backend is running ✅' });
});

// ─── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 TheCodeKid backend running on http://localhost:${PORT}\n`);
});