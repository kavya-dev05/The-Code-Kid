const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ─── Rate Limiting ───────────────────────────────────────────
// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints - stricter limiting (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/signup attempts per window
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Compiler endpoints - prevent API quota exhaustion
const compilerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 code executions per minute
  message: { error: 'Too many code executions, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── CORS ───────────────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    // Allowed origins pattern
    const allowedOrigins = [
      'https://thecodekid.vercel.app',
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
    ];

    const isAllowed = allowedOrigins.some(pattern => {
      if (pattern instanceof RegExp) return pattern.test(origin);
      return origin === pattern;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ─── Middleware ───────────────────────────────────────────
app.use(express.json());
app.use(apiLimiter);

// ─── Routes ──────────────────────────────────────────────
app.use('/api/auth',        authLimiter, require('./routes/auth'));
app.use('/api/user',        require('./routes/user'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/compiler',    compilerLimiter, require('./routes/compiler'));

// ─── Health check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'TheCodeKid backend is running ✅' });
});

// ─── Environment Validation ───────────────────────────────
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'JUDGE0_API_URL', 'JUDGE0_API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('\n❌ CRITICAL: Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n   Please check your .env file and restart the server.\n');
  process.exit(1);
}

// ─── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 TheCodeKid backend running on http://localhost:${PORT}`);
  console.log(`   Supabase: ${process.env.SUPABASE_URL}`);
  console.log(`   Judge0: ${process.env.JUDGE0_API_URL}\n`);
});