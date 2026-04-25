const express = require('express');
const router = express.Router();
const axios = require('axios');

// Judge0 API configuration
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_HOST = process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';

// Language IDs for Judge0 (https://judge0.com/docs/languages/)
const LANGUAGES = {
  python: 71,        // Python 3.8.1
  python3: 71,
  javascript: 63,    // JavaScript (Node.js 12.14.0)
  nodejs: 63,
  java: 62,          // Java 11.0.6
  cpp: 54,           // C++ (GCC 9.2.0)
  c: 50,             // C (GCC 9.2.0)
};

// Common headers for Judge0 API
const getJudge0Headers = () => ({
  'X-RapidAPI-Key': JUDGE0_API_KEY,
  'X-RapidAPI-Host': JUDGE0_HOST,
  'Content-Type': 'application/json',
});

// ─────────────────────────────────────────
// POST /api/compiler/run
// Body: { code, language, input? }
// Returns: { output, stderr, status, executionTime, memory }
// ─────────────────────────────────────────
router.post('/run', async (req, res) => {
  try {
    const { code, language = 'python', input = '' } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({ error: 'Code is required' });
    }

    const languageId = LANGUAGES[language.toLowerCase()] || LANGUAGES.python;

    // Step 1: Submit code to Judge0 for execution
    const submissionResponse = await axios.post(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`,
      {
        source_code: code,
        language_id: languageId,
        stdin: input,
      },
      {
        headers: getJudge0Headers(),
      }
    );

    const submissionToken = submissionResponse.data.token;

    if (!submissionToken) {
      return res.status(500).json({ error: 'Failed to submit code to Judge0' });
    }

    // Step 2: Poll for result (with timeout)
    let result = null;
    const maxAttempts = 30;
    const pollInterval = 500; // 500ms

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const statusResponse = await axios.get(
        `${JUDGE0_API_URL}/submissions/${submissionToken}?base64_encoded=false`,
        {
          headers: getJudge0Headers(),
        }
      );

      result = statusResponse.data;

      // Status IDs: 1=In Queue, 2=Processing, 3=Accepted, 4=Wrong Answer, 5=Time Limit Exceeded, 6=Runtime Error, etc.
      if (result.status && result.status.id >= 3) {
        break;
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    if (!result || !result.status) {
      return res.status(500).json({ error: 'Failed to get execution result' });
    }

    // Format the response
    const response = {
      output: result.stdout || '',
      stderr: result.stderr || '',
      compileOutput: result.compile_output || '',
      status: {
        id: result.status.id,
        description: result.status.description,
      },
      executionTime: result.time || '0',
      memory: result.memory || 0,
      exitCode: result.exit_code,
    };

    res.json(response);
  } catch (error) {
    console.error('Judge0 API Error:', error.response?.data || error.message);

    // Handle specific error cases
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid Judge0 API key' });
    }
    if (error.response?.status === 403) {
      return res.status(403).json({ error: 'Judge0 API access forbidden - check your subscription' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded - too many requests' });
    }

    res.status(500).json({
      error: 'Failed to execute code',
      details: error.response?.data || error.message
    });
  }
});

// ─────────────────────────────────────────
// GET /api/compiler/languages
// Returns list of supported languages
// ─────────────────────────────────────────
router.get('/languages', async (req, res) => {
  try {
    const response = await axios.get(
      `${JUDGE0_API_URL}/languages?base64_encoded=false`,
      {
        headers: getJudge0Headers(),
      }
    );

    // Filter to only return languages we support
    const supportedIds = Object.values(LANGUAGES);
    const languages = response.data
      .filter(lang => supportedIds.includes(lang.id))
      .map(lang => ({
        id: lang.id,
        name: lang.name,
        key: Object.keys(LANGUAGES).find(key => LANGUAGES[key] === lang.id),
      }));

    res.json(languages);
  } catch (error) {
    console.error('Failed to fetch languages:', error.message);
    // Return fallback languages
    res.json([
      { id: 71, name: 'Python 3.8.1', key: 'python' },
      { id: 63, name: 'JavaScript (Node.js)', key: 'javascript' },
      { id: 62, name: 'Java 11.0.6', key: 'java' },
      { id: 54, name: 'C++ (GCC 9.2.0)', key: 'cpp' },
      { id: 50, name: 'C (GCC 9.2.0)', key: 'c' },
    ]);
  }
});

// ─────────────────────────────────────────
// GET /api/compiler/health
// Health check endpoint
// ─────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    judge0Configured: !!JUDGE0_API_KEY,
    judge0Url: JUDGE0_API_URL,
  });
});

module.exports = router;
