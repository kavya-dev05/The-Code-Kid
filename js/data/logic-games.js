// TheCodeKid — Simple Visual Logic Games
// Junior: Big buttons, visual patterns, tap-to-play (NO typing/code)
// Explorer: Brain teasers, logic puzzles

export const logicGames = {
  junior: [
    // ====== PATTERN FUN ======
    {
      id: 'j-1', title: '🔴🔵 What Comes Next?', category: '🎨 Patterns',
      type: 'tap-pattern', difficulty: 'easy', xp: 15,
      description: 'Look at the colors and tap what comes next!',
      visual: ['🔴', '🔵', '🔴', '🔵', '🔴'],
      answer: '🔵', options: ['🔴', '🔵', '🟢', '🟡'],
      hint: 'Red, Blue, Red, Blue, Red... what next?'
    },
    {
      id: 'j-2', title: '⭐🌙 Star Moon Pattern', category: '🎨 Patterns',
      type: 'tap-pattern', difficulty: 'easy', xp: 15,
      description: 'Stars and moons! What comes next?',
      visual: ['⭐', '⭐', '🌙', '⭐', '⭐', '🌙', '⭐', '⭐'],
      answer: '🌙', options: ['⭐', '🌙', '☀️', '🌈'],
      hint: 'Star Star Moon, Star Star Moon...'
    },
    {
      id: 'j-3', title: '🔺🔻 Shape Dance', category: '🎨 Patterns',
      type: 'tap-pattern', difficulty: 'easy', xp: 15,
      description: 'Up triangle, down triangle... what comes next?',
      visual: ['🔺', '🔻', '🔺', '🔻', '🔺'],
      answer: '🔻', options: ['🔺', '🔻', '⬛', '🔶'],
      hint: 'Up, Down, Up, Down, Up...'
    },

    // ====== COUNTING & NUMBERS ======
    {
      id: 'j-4', title: '🐾 Count the Paws', category: '🔢 Counting',
      type: 'tap-count', difficulty: 'easy', xp: 20,
      description: 'How many paw prints do you see?',
      visual: ['🐾', '🐾', '🐾', '🐾', '🐾'],
      answer: 5, options: [3, 4, 5, 6],
      hint: 'Point at each paw and count: 1, 2, 3...'
    },
    {
      id: 'j-5', title: '🍎 Apple Math', category: '🔢 Counting',
      type: 'tap-count', difficulty: 'easy', xp: 20,
      description: '🍎🍎🍎 + 🍎🍎 = How many apples?',
      visual: ['🍎', '🍎', '🍎', '➕', '🍎', '🍎', '🟰'],
      answer: 5, options: [4, 5, 6, 7],
      hint: '3 apples plus 2 apples = ?'
    },
    {
      id: 'j-6', title: '🔢 Missing Number', category: '🔢 Counting',
      type: 'tap-pattern', difficulty: 'easy', xp: 20,
      description: 'Find the missing number!',
      visual: ['1', '2', '3', '❓', '5'],
      answer: '4', options: ['3', '4', '6', '7'],
      hint: '1, 2, 3, ?, 5 — count on your fingers!'
    },

    // ====== ODD ONE OUT ======
    {
      id: 'j-7', title: '🍎🍊 Odd Fruit Out!', category: '🧩 Odd One Out',
      type: 'tap-odd', difficulty: 'easy', xp: 20,
      description: 'One fruit is different! Tap the odd one.',
      items: ['🍎', '🍎', '🍊', '🍎', '🍎'],
      answer: '🍊',
      hint: 'Most are apples. Which one is NOT an apple?'
    },
    {
      id: 'j-8', title: '🐱🐶 Who Doesn\'t Belong?', category: '🧩 Odd One Out',
      type: 'tap-odd', difficulty: 'easy', xp: 20,
      description: 'All are cats except one! Find it!',
      items: ['🐱', '🐱', '🐱', '🐶', '🐱'],
      answer: '🐶',
      hint: 'Look for the one that barks, not meows!'
    },

    // ====== BIGGER / SMALLER ======
    {
      id: 'j-9', title: '🐘🐭 Who Is Bigger?', category: '📏 Compare',
      type: 'tap-compare', difficulty: 'easy', xp: 15,
      description: 'Tap the BIGGER animal!',
      optionA: { emoji: '🐘', label: 'Elephant' },
      optionB: { emoji: '🐭', label: 'Mouse' },
      answer: 'A',
      hint: 'Think about which animal you see at the zoo!'
    },
    {
      id: 'j-10', title: '🔢 Which Is More?', category: '📏 Compare',
      type: 'tap-compare', difficulty: 'easy', xp: 15,
      description: 'Which group has MORE stars?',
      optionA: { emoji: '⭐⭐⭐⭐⭐', label: '5 stars' },
      optionB: { emoji: '⭐⭐⭐', label: '3 stars' },
      answer: 'A',
      hint: 'Count each group and pick the bigger number!'
    },

    // ====== SORTING ======
    {
      id: 'j-11', title: '📏 Small to Big', category: '📐 Sorting',
      type: 'tap-sort', difficulty: 'easy', xp: 25,
      description: 'Put these animals from SMALLEST to BIGGEST!',
      items: [
        { emoji: '🐜', label: 'Ant', size: 1 },
        { emoji: '🐈', label: 'Cat', size: 2 },
        { emoji: '🐘', label: 'Elephant', size: 3 },
      ],
      hint: 'Ant is tiny, Cat is medium, Elephant is huge!'
    },
    {
      id: 'j-12', title: '🔢 Number Order', category: '📐 Sorting',
      type: 'tap-sort', difficulty: 'easy', xp: 25,
      description: 'Tap numbers from SMALLEST to BIGGEST!',
      items: [
        { emoji: '5', label: 'Five', size: 5 },
        { emoji: '2', label: 'Two', size: 2 },
        { emoji: '8', label: 'Eight', size: 8 },
        { emoji: '1', label: 'One', size: 1 },
      ],
      hint: 'Start with 1, then 2, then 5, then 8!'
    },

    // ====== MATCHING ======
    {
      id: 'j-13', title: '🎨 Color Match', category: '🧠 Matching',
      type: 'tap-pattern', difficulty: 'easy', xp: 15,
      description: 'Which color is the sky?',
      visual: ['☁️', '🌤️', '🦋'],
      answer: '🔵', options: ['🔴', '🟢', '🔵', '🟡'],
      hint: 'Look outside! What color is the sky?'
    },
    {
      id: 'j-14', title: '🏠 Where Does It Live?', category: '🧠 Matching',
      type: 'tap-pattern', difficulty: 'easy', xp: 15,
      description: '🐟 Fish lives in...',
      visual: ['🐟', '💭'],
      answer: '🌊', options: ['🌳', '🌊', '🏔️', '🏠'],
      hint: 'Fish swim in...'
    },

    // ====== SIMPLE SEQUENCES ======
    {
      id: 'j-15', title: '🎵 Clap Pattern', category: '🎵 Rhythm',
      type: 'tap-pattern', difficulty: 'easy', xp: 20,
      description: 'Clap Clap Rest, Clap Clap Rest, Clap Clap...',
      visual: ['👏', '👏', '😶', '👏', '👏', '😶', '👏', '👏'],
      answer: '😶', options: ['👏', '😶', '🎵', '🤫'],
      hint: 'Two claps then a rest. Two claps then a rest...'
    },
    {
      id: 'j-16', title: '🌈 Rainbow Order', category: '🎨 Patterns',
      type: 'tap-pattern', difficulty: 'easy', xp: 20,
      description: 'What comes after Orange in the rainbow?',
      visual: ['🔴', '🟠'],
      answer: '🟡', options: ['🔵', '🟢', '🟡', '🟣'],
      hint: 'ROYGBIV — Red, Orange, Yellow...'
    },

    // ====== DIWALI / INDIAN THEMES ======
    {
      id: 'j-17', title: '🪔 Count the Diyas', category: '🇮🇳 Diwali Fun',
      type: 'tap-count', difficulty: 'easy', xp: 20,
      description: 'How many diyas are lit for Diwali?',
      visual: ['🪔', '🪔', '🪔', '🪔', '🪔', '🪔', '🪔'],
      answer: 7, options: [5, 6, 7, 8],
      hint: 'Count each diya slowly!'
    },
    {
      id: 'j-18', title: '🏏 Cricket Runs', category: '🇮🇳 Cricket Fun',
      type: 'tap-count', difficulty: 'easy', xp: 25,
      description: 'Virat hit 4 runs, then 6 runs. Total runs?',
      visual: ['4️⃣', '➕', '6️⃣', '🟰'],
      answer: 10, options: [8, 9, 10, 11],
      hint: '4 + 6 = ?'
    },
  ],

  explorer: [
    {
      id: 'e-1', title: '📊 Number Pyramid', category: 'Number Patterns',
      type: 'pattern-sequence', difficulty: 'easy', xp: 30,
      description: 'Each row doubles! What number goes in row 5?',
      sequence: [1, 2, 4, 8, '?'],
      answer: 16, options: [10, 12, 16, 20],
      hint: 'Each number is multiplied by 2!'
    },
    {
      id: 'e-2', title: '🔐 Password Decoder', category: 'Logic Puzzles',
      type: 'decode-game', difficulty: 'medium', xp: 40,
      description: 'If A=1, B=2, C=3... What does "CAB" equal?',
      answer: 6, options: [5, 6, 7, 8],
      hint: 'C=3, A=1, B=2. Now add them up!'
    },
    {
      id: 'e-3', title: '🌀 Fibonacci Flowers', category: 'Number Patterns',
      type: 'number-sequence', difficulty: 'medium', xp: 40,
      sequence: [1, 1, 2, 3, 5, 8, '?'],
      answer: 13, options: [10, 11, 13, 15],
      description: 'Each number is the sum of the two before it!',
      hint: '5 + 8 = ?'
    },
    {
      id: 'e-4', title: '⬛⬜ Chessboard Logic', category: 'Visual Logic',
      type: 'pattern-sequence', difficulty: 'easy', xp: 25,
      sequence: ['⬛', '⬜', '⬛', '⬜', '⬛', '⬜', '⬛'],
      answer: '⬜', options: ['⬛', '⬜', '🟫', '🟥'],
      description: 'Black, white, black, white... like a chessboard!',
      hint: 'Alternating pattern!'
    },
    {
      id: 'e-5', title: '🧠 Boolean Brain', category: 'Logic Gates',
      type: 'boolean-game', difficulty: 'medium', xp: 45,
      description: 'AND means both must be true.\n\nTrue AND True = True\nTrue AND False = False\n\nWhat is: True AND True AND False?',
      answer: 'False', options: ['True', 'False'],
      hint: 'If ANY value is False in AND, the result is False!'
    },
    {
      id: 'e-6', title: '🔢 Square Numbers', category: 'Number Patterns',
      type: 'number-sequence', difficulty: 'medium', xp: 35,
      sequence: [1, 4, 9, 16, 25, '?'],
      answer: 36, options: [30, 34, 36, 49],
      description: 'These are special numbers!',
      hint: '1×1, 2×2, 3×3... 6×6?'
    },
    {
      id: 'e-7', title: '🐍 Loop Challenge', category: 'Intro to Code',
      type: 'code-puzzle', difficulty: 'medium', xp: 50,
      description: 'This code prints numbers:\n\nfor i in range(5):\n  print(i)\n\nWhat will it show?',
      answer: '0 1 2 3 4', options: ['1 2 3 4 5', '0 1 2 3 4', '0 1 2 3 4 5', '1 2 3 4'],
      hint: 'range(5) starts at 0 and goes up to 4!'
    },
    {
      id: 'e-8', title: '🎯 Flowchart', category: 'Flowcharts',
      type: 'flowchart-game', difficulty: 'hard', xp: 50,
      description: 'START → Is number > 10?\n  YES → Is it even?\n    YES → "Big Even"\n    NO → "Big Odd"\n  NO → "Small"\n\nWhat for 15?',
      answer: 'Big Odd', options: ['Big Even', 'Big Odd', 'Small', 'Error'],
      hint: '15 > 10 = YES. 15 is odd = NO → Big Odd!'
    },
    {
      id: 'e-9', title: '🐛 Bug Hunter', category: 'Debugging',
      type: 'code-puzzle', difficulty: 'hard', xp: 50,
      description: 'Fix the bug! What should "???" be?\n\nfunction add(a, b) {\n  return ???;\n}\nadd(3, 5) should give 8',
      answer: 'a + b', options: ['a * b', 'a + b', 'a - b', '8'],
      hint: 'We want to ADD two numbers!'
    },
    {
      id: 'e-10', title: '🏏 IPL Points', category: 'Data & Logic',
      type: 'math-game', difficulty: 'medium', xp: 40,
      description: 'Win = 2 pts, Tie = 1, Loss = 0\n\nCSK: 5 Wins, 2 Ties, 1 Loss\nMI: 4 Wins, 1 Tie, 3 Losses\n\nWho has more?',
      answer: 'CSK', options: ['CSK', 'MI', 'Same', 'Cannot tell'],
      hint: 'CSK = 5×2 + 2×1 = 12. MI = 4×2 + 1×1 = 9.'
    },
    {
      id: 'e-11', title: '🪙 Coin Flip', category: 'Probability',
      type: 'math-game', difficulty: 'medium', xp: 40,
      description: 'Flip a coin 3 times.\nHow many different outcomes?',
      answer: 8, options: [3, 6, 8, 9],
      hint: '2 × 2 × 2 = ?'
    },
    {
      id: 'e-12', title: '🚂 Train Problem', category: 'Logic Puzzles',
      type: 'math-game', difficulty: 'medium', xp: 35,
      description: 'Train A: 60 km/h from Delhi.\nTrain B: 60 km/h toward Delhi.\n180 km apart. Start 9:00 AM.\n\nWhen do they meet?',
      answer: '10:30 AM', options: ['10:00 AM', '10:30 AM', '11:00 AM', '12:00 PM'],
      hint: 'Combined speed = 120 km/h. 180 ÷ 120 = 1.5 hours.'
    },
  ]
};
