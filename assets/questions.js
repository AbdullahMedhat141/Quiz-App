// export const questions = [
//   {
//     question:
//       "Which keyword is used to declare a constant variable in JavaScript?",
//     options: ["var", "let", "const", "static"],
//     correctAnswer: 2,
//     points: 10,
//   },
//   {
//     question: "What is the output of: console.log(typeof NaN)?",
//     options: ["number", "NaN", "undefined", "object"],
//     correctAnswer: 0,
//     points: 10,
//   },
//   {
//     question: "Which method converts a JSON string into a JavaScript object?",
//     options: [
//       "JSON.parse()",
//       "JSON.stringify()",
//       "JSON.toObject()",
//       "JSON.convert()",
//     ],
//     correctAnswer: 0,
//     points: 10,
//   },
//   {
//     question: "What will `console.log(2 == '2')` print?",
//     options: ["true", "false", "undefined", "TypeError"],
//     correctAnswer: 0,
//     points: 10,
//   },
//   {
//     question: "Which of the following is NOT a JavaScript data type?",
//     options: ["String", "Boolean", "Float", "Undefined"],
//     correctAnswer: 2,
//     points: 10,
//   },
//   {
//     question: "What will be the value of `let x; console.log(x);`?",
//     options: ["0", "null", "undefined", "NaN"],
//     correctAnswer: 2,
//     points: 10,
//   },
//   {
//     question: "Which operator is used to check both value and type?",
//     options: ["=", "==", "===", "!=="],
//     correctAnswer: 2,
//     points: 10,
//   },
//   {
//     question: "How do you create a function in JavaScript?",
//     options: [
//       "function = myFunction()",
//       "function myFunction()",
//       "create function myFunction()",
//       "def myFunction()",
//     ],
//     correctAnswer: 1,
//     points: 10,
//   },
//   {
//     question: "Which array method adds a new element to the end of an array?",
//     options: ["push()", "pop()", "shift()", "unshift()"],
//     correctAnswer: 0,
//     points: 10,
//   },
//   {
//     question: "What will `console.log([] == false)` output?",
//     options: ["true", "false", "TypeError", "undefined"],
//     correctAnswer: 0,
//     points: 10,
//   },
// ];

export const questions = [
  {
    type: "MCQ",
    question:
      "Which keyword is used to declare a constant variable in JavaScript?",
    options: ["var", "let", "const", "static"],
    correctAnswer: 2,
    points: 10,
  },
  {
    type: "TF",
    question: "In JavaScript, `NaN` has the type 'number'.",
    correctAnswer: "T",
    points: 10,
  },
  {
    type: "MCQ",
    question: "Which method converts a JSON string into a JavaScript object?",
    options: [
      "JSON.parse()",
      "JSON.stringify()",
      "JSON.toObject()",
      "JSON.convert()",
    ],
    correctAnswer: 0,
    points: 10,
  },
  {
    type: "TF",
    question: "`2 === '2'` will evaluate to true.",
    correctAnswer: "F",
    points: 10,
  },
  {
    type: "MCQ",
    question: "Which of the following is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Undefined"],
    correctAnswer: 2,
    points: 10,
  },
  {
    type: "TF",
    question:
      "A variable declared with `let` without initialization will be `undefined`.",
    correctAnswer: "T",
    points: 10,
  },
  {
    type: "MCQ",
    question: "Which operator is used to check both value and type?",
    options: ["=", "==", "===", "!=="],
    correctAnswer: 2,
    points: 10,
  },
  {
    type: "MCQ",
    question: "How do you create a function in JavaScript?",
    options: [
      "function = myFunction()",
      "function myFunction()",
      "create function myFunction()",
      "def myFunction()",
    ],
    correctAnswer: 1,
    points: 10,
  },
  {
    type: "TF",
    question: "`push()` adds an element to the start of an array.",
    correctAnswer: "F",
    points: 10,
  },
  {
    type: "MCQ",
    question: "What will `console.log([] == false)` output?",
    options: ["true", "false", "TypeError", "undefined"],
    correctAnswer: 0,
    points: 10,
  },
];
