// DSA Questions Data
export const dsaQuestions = {
  junior: [
    {
      id: 'j1',
      title: 'Mission 1: Find the Biggest Number',
      description: 'You have a list of numbers. Find which one is the biggest!',
      difficulty: 'easy',
      xp: 20,
      category: 'Logic',
      hint: 'Compare each number one by one.',
      examples: [
        { input: '[3, 7, 2, 9, 4]', output: '9' },
        { input: '[10, 5, 8]', output: '10' }
      ],
      starterCode: `function findBiggest(numbers) {\n  // Write your code here!\n  // Hint: Use a loop to check each number\n  \n}`,
      testCases: [
        { input: [3, 7, 2, 9, 4], expected: 9 },
        { input: [10, 5, 8], expected: 10 },
        { input: [1], expected: 1 }
      ],
      solution: `function findBiggest(numbers) {\n  let biggest = numbers[0];\n  for (let i = 1; i < numbers.length; i++) {\n    if (numbers[i] > biggest) {\n      biggest = numbers[i];\n    }\n  }\n  return biggest;\n}`
    },
    {
      id: 'j2',
      title: 'Mission 2: Unlock the Secret Pattern',
      description: 'Print a triangle pattern of stars! ⭐\nFor n=4:\n*\n**\n***\n****',
      difficulty: 'easy',
      xp: 25,
      category: 'Patterns',
      hint: 'Use two loops — outer for rows, inner for stars.',
      examples: [
        { input: '3', output: '*\\n**\\n***' },
        { input: '4', output: '*\\n**\\n***\\n****' }
      ],
      starterCode: `function printTriangle(n) {\n  let result = "";\n  // Build the triangle pattern\n  \n  return result;\n}`,
      testCases: [
        { input: [3], expected: '*\n**\n***' },
        { input: [4], expected: '*\n**\n***\n****' }
      ],
      solution: `function printTriangle(n) {\n  let result = "";\n  for (let i = 1; i <= n; i++) {\n    result += "*".repeat(i);\n    if (i < n) result += "\\n";\n  }\n  return result;\n}`
    },
    {
      id: 'j3',
      title: 'Mission 3: Count the Treasures',
      description: 'Count how many times a specific item appears in a list!',
      difficulty: 'easy',
      xp: 20,
      category: 'Arrays',
      hint: 'Loop through and count every match.',
      examples: [
        { input: '[1, 2, 3, 2, 2, 4], 2', output: '3' },
        { input: '["apple", "banana", "apple"], "apple"', output: '2' }
      ],
      starterCode: `function countItem(list, item) {\n  // Count how many times item appears\n  \n}`,
      testCases: [
        { input: [[1, 2, 3, 2, 2, 4], 2], expected: 3 },
        { input: [['apple', 'banana', 'apple'], 'apple'], expected: 2 }
      ],
      solution: `function countItem(list, item) {\n  let count = 0;\n  for (let i = 0; i < list.length; i++) {\n    if (list[i] === item) count++;\n  }\n  return count;\n}`
    },
    {
      id: 'j4',
      title: 'Mission 4: Reverse the Magic Word',
      description: 'Reverse a string to decode the secret message!',
      difficulty: 'easy',
      xp: 25,
      category: 'Strings',
      hint: 'Build a new string from back to front.',
      examples: [
        { input: '"hello"', output: '"olleh"' },
        { input: '"code"', output: '"edoc"' }
      ],
      starterCode: `function reverseWord(word) {\n  // Reverse the string\n  \n}`,
      testCases: [
        { input: ['hello'], expected: 'olleh' },
        { input: ['code'], expected: 'edoc' },
        { input: ['a'], expected: 'a' }
      ],
      solution: `function reverseWord(word) {\n  return word.split("").reverse().join("");\n}`
    },
    {
      id: 'j5',
      title: 'Mission 5: Even or Odd Detector',
      description: 'Build a program that tells if each number is even or odd!',
      difficulty: 'easy',
      xp: 20,
      category: 'Logic',
      hint: 'Use the % (modulo) operator.',
      examples: [
        { input: '[1, 2, 3, 4]', output: '["odd", "even", "odd", "even"]' }
      ],
      starterCode: `function evenOdd(numbers) {\n  // Return array of "even" or "odd"\n  \n}`,
      testCases: [
        { input: [[1, 2, 3, 4]], expected: ['odd', 'even', 'odd', 'even'] },
        { input: [[10, 15]], expected: ['even', 'odd'] }
      ],
      solution: `function evenOdd(numbers) {\n  return numbers.map(n => n % 2 === 0 ? "even" : "odd");\n}`
    }
  ],
  explorer: [
    {
      id: 'e1',
      title: 'Mission 1: The Two Sum Challenge',
      description: 'Find two numbers in an array that add up to a target sum. Return their indices.\n\nThis is a classic coding challenge used in real interviews!',
      difficulty: 'medium',
      xp: 50,
      category: 'Arrays',
      hint: 'Use a map to store numbers you have already seen.',
      examples: [
        { input: '[2, 7, 11, 15], target = 9', output: '[0, 1]' },
        { input: '[3, 2, 4], target = 6', output: '[1, 2]' }
      ],
      starterCode: `function twoSum(nums, target) {\n  // Find two indices whose values sum to target\n  \n}`,
      testCases: [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { input: [[3, 2, 4], 6], expected: [1, 2] },
        { input: [[3, 3], 6], expected: [0, 1] }
      ],
      solution: `function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) {\n      return [map[complement], i];\n    }\n    map[nums[i]] = i;\n  }\n  return [];\n}`
    },
    {
      id: 'e2',
      title: 'Mission 2: Sort the Leaderboard',
      description: 'Implement Bubble Sort to arrange scores from highest to lowest!\n\nBubble Sort compares adjacent elements and swaps them if they are in the wrong order.',
      difficulty: 'medium',
      xp: 50,
      category: 'Sorting',
      hint: 'Use nested loops. Outer loop runs n times, inner loop compares adjacent pairs.',
      examples: [
        { input: '[64, 34, 25, 12, 22, 11, 90]', output: '[11, 12, 22, 25, 34, 64, 90]' }
      ],
      starterCode: `function bubbleSort(arr) {\n  // Sort array using bubble sort\n  // Return sorted array\n  \n}`,
      testCases: [
        { input: [[64, 34, 25, 12, 22, 11, 90]], expected: [11, 12, 22, 25, 34, 64, 90] },
        { input: [[5, 1, 4, 2, 8]], expected: [1, 2, 4, 5, 8] }
      ],
      solution: `function bubbleSort(arr) {\n  const n = arr.length;\n  const result = [...arr];\n  for (let i = 0; i < n - 1; i++) {\n    for (let j = 0; j < n - i - 1; j++) {\n      if (result[j] > result[j + 1]) {\n        [result[j], result[j + 1]] = [result[j + 1], result[j]];\n      }\n    }\n  }\n  return result;\n}`
    },
    {
      id: 'e3',
      title: 'Mission 3: Palindrome Checker',
      description: 'Check if a string reads the same forwards and backwards.\n\nIgnore spaces and case when checking!',
      difficulty: 'easy',
      xp: 30,
      category: 'Strings',
      hint: 'Clean the string first, then compare with its reverse.',
      examples: [
        { input: '"racecar"', output: 'true' },
        { input: '"hello"', output: 'false' },
        { input: '"A man a plan a canal Panama"', output: 'true' }
      ],
      starterCode: `function isPalindrome(str) {\n  // Check if string is a palindrome\n  // Ignore spaces and case\n  \n}`,
      testCases: [
        { input: ['racecar'], expected: true },
        { input: ['hello'], expected: false },
        { input: ['A man a plan a canal Panama'], expected: true }
      ],
      solution: `function isPalindrome(str) {\n  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return cleaned === cleaned.split("").reverse().join("");\n}`
    },
    {
      id: 'e4',
      title: 'Mission 4: Fibonacci Sequence',
      description: 'Generate the first N numbers of the Fibonacci sequence.\n\nEach number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13...',
      difficulty: 'medium',
      xp: 40,
      category: 'Recursion',
      hint: 'Start with [0, 1] and keep adding the sum of the last two numbers.',
      examples: [
        { input: '5', output: '[0, 1, 1, 2, 3]' },
        { input: '8', output: '[0, 1, 1, 2, 3, 5, 8, 13]' }
      ],
      starterCode: `function fibonacci(n) {\n  // Return first n Fibonacci numbers\n  \n}`,
      testCases: [
        { input: [5], expected: [0, 1, 1, 2, 3] },
        { input: [8], expected: [0, 1, 1, 2, 3, 5, 8, 13] }
      ],
      solution: `function fibonacci(n) {\n  if (n <= 0) return [];\n  if (n === 1) return [0];\n  const fib = [0, 1];\n  for (let i = 2; i < n; i++) {\n    fib.push(fib[i - 1] + fib[i - 2]);\n  }\n  return fib;\n}`
    },
    {
      id: 'e5',
      title: 'Mission 5: Cricket Score Calculator 🏏',
      description: 'Calculate the total runs, highest score, and average for a cricket team!\n\nGiven an array of runs scored by each batsman, return an object with total, highest, and average.',
      difficulty: 'easy',
      xp: 35,
      category: 'Arrays',
      hint: 'Use reduce for total, Math.max for highest, total/length for average.',
      examples: [
        { input: '[45, 67, 12, 89, 34, 8]', output: '{ total: 255, highest: 89, average: 42.5 }' }
      ],
      starterCode: `function cricketStats(runs) {\n  // Calculate total, highest, and average\n  \n}`,
      testCases: [
        { input: [[45, 67, 12, 89, 34, 8]], expected: { total: 255, highest: 89, average: 42.5 } },
        { input: [[100, 0, 50]], expected: { total: 150, highest: 100, average: 50 } }
      ],
      solution: `function cricketStats(runs) {\n  const total = runs.reduce((sum, r) => sum + r, 0);\n  return {\n    total,\n    highest: Math.max(...runs),\n    average: total / runs.length\n  };\n}`
    }
  ],
  pro: [
    {
      id: 'p1',
      title: 'Binary Search',
      description: 'Implement binary search on a sorted array.\n\nGiven a sorted array of integers and a target value, return the index if the target is found, or -1 if not.\n\n**Constraints:**\n- Array is sorted in ascending order\n- O(log n) time complexity required',
      difficulty: 'medium',
      xp: 60,
      category: 'Search',
      hint: 'Divide the search space in half each iteration using two pointers.',
      examples: [
        { input: '[-1,0,3,5,9,12], target = 9', output: '4' },
        { input: '[-1,0,3,5,9,12], target = 2', output: '-1' }
      ],
      starterCode: `function binarySearch(nums, target) {\n  // Implement binary search\n  // Return index or -1\n  \n}`,
      testCases: [
        { input: [[-1,0,3,5,9,12], 9], expected: 4 },
        { input: [[-1,0,3,5,9,12], 2], expected: -1 },
        { input: [[5], 5], expected: 0 }
      ],
      solution: `function binarySearch(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`
    },
    {
      id: 'p2',
      title: 'Valid Parentheses',
      description: 'Given a string containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nA string is valid if:\n- Open brackets are closed by the same type\n- Open brackets are closed in the correct order\n- Every close bracket has a corresponding open bracket',
      difficulty: 'medium',
      xp: 60,
      category: 'Stacks',
      hint: 'Use a stack. Push opening brackets, pop and match closing brackets.',
      examples: [
        { input: '"()"', output: 'true' },
        { input: '"()[]{}"', output: 'true' },
        { input: '"(]"', output: 'false' }
      ],
      starterCode: `function isValid(s) {\n  // Check if parentheses are valid\n  \n}`,
      testCases: [
        { input: ['()'], expected: true },
        { input: ['()[]{}'], expected: true },
        { input: ['(]'], expected: false },
        { input: ['([)]'], expected: false },
        { input: ['{[]}'], expected: true }
      ],
      solution: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if ('({['.includes(c)) {\n      stack.push(c);\n    } else {\n      if (stack.pop() !== map[c]) return false;\n    }\n  }\n  return stack.length === 0;\n}`
    },
    {
      id: 'p3',
      title: 'Maximum Subarray (Kadane\'s)',
      description: 'Find the contiguous subarray within an array that has the largest sum.\n\n**Constraints:**\n- Array has at least one number\n- O(n) solution required',
      difficulty: 'hard',
      xp: 80,
      category: 'Dynamic Programming',
      hint: 'Track current sum and maximum sum. Reset current sum when it goes below 0.',
      examples: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6 (subarray [4,-1,2,1])' },
        { input: '[1]', output: '1' }
      ],
      starterCode: `function maxSubArray(nums) {\n  // Find maximum subarray sum\n  \n}`,
      testCases: [
        { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },
        { input: [[1]], expected: 1 },
        { input: [[5,4,-1,7,8]], expected: 23 }
      ],
      solution: `function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}`
    },
    {
      id: 'p4',
      title: 'Merge Two Sorted Arrays',
      description: 'Given two sorted arrays, merge them into one sorted array.\n\n**Constraints:**\n- Both arrays are sorted in ascending order\n- O(n + m) time complexity required',
      difficulty: 'medium',
      xp: 50,
      category: 'Arrays',
      hint: 'Use two pointers, one for each array. Compare and pick the smaller element.',
      examples: [
        { input: '[1,3,5], [2,4,6]', output: '[1,2,3,4,5,6]' },
        { input: '[1,2], [3,4,5]', output: '[1,2,3,4,5]' }
      ],
      starterCode: `function mergeSorted(arr1, arr2) {\n  // Merge two sorted arrays\n  \n}`,
      testCases: [
        { input: [[1,3,5], [2,4,6]], expected: [1,2,3,4,5,6] },
        { input: [[1,2], [3,4,5]], expected: [1,2,3,4,5] },
        { input: [[], [1,2]], expected: [1,2] }
      ],
      solution: `function mergeSorted(arr1, arr2) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < arr1.length && j < arr2.length) {\n    if (arr1[i] <= arr2[j]) result.push(arr1[i++]);\n    else result.push(arr2[j++]);\n  }\n  return [...result, ...arr1.slice(i), ...arr2.slice(j)];\n}`
    },
    {
      id: 'p5',
      title: 'Diwali Lights Pattern 🪔',
      description: 'Create a function that generates a Diwali lights blinking pattern!\n\nGiven n lights and k rounds, each round toggles specific lights:\n- Round 1: toggle every light\n- Round 2: toggle every 2nd light\n- Round i: toggle every i-th light\n\nReturn the final state of all lights (true = on, false = off).\nAll lights start as OFF.',
      difficulty: 'medium',
      xp: 60,
      category: 'Simulation',
      hint: 'Only perfect square positions end up ON. Think about why!',
      examples: [
        { input: '5', output: '[true, false, false, true, false]' },
        { input: '10', output: '[true, false, false, true, false, false, false, false, true, false]' }
      ],
      starterCode: `function diwaliLights(n) {\n  // Simulate the light toggling\n  // Return array of booleans\n  \n}`,
      testCases: [
        { input: [5], expected: [true, false, false, true, false] },
        { input: [10], expected: [true, false, false, true, false, false, false, false, true, false] }
      ],
      solution: `function diwaliLights(n) {\n  const lights = new Array(n).fill(false);\n  for (let round = 1; round <= n; round++) {\n    for (let i = round - 1; i < n; i += round) {\n      lights[i] = !lights[i];\n    }\n  }\n  return lights;\n}`
    }
  ]
};
