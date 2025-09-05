"use strict";

import { questions } from "./assets/questions.js";

const startBtn = document.querySelector(".start");
const sideBox = document.querySelector(".side-box");
const progressBox = document.querySelector(".progress-box");
const progressBar = document.querySelector(".progress");
const progressLength = document.querySelector(".progress-length");
const countEl = document.querySelector(".count");
const finishBtn = document.querySelector(".finish");
const restartBtn = document.querySelector(".restart");
const questionsList = document.querySelector(".questions-list");
const quizResult = document.querySelector(".quiz-result");
const scoreEl = document.querySelector(".score");
const resultEl = document.querySelector(".result");

class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.progress = 0;
    this.result = "";
    this.status = "active";
  }
  startQuiz() {
    reset();

    progressBar.max = questions.length;
    progressLength.textContent = `/${questions.length}`;
    progressBar.value = Number(quiz.progress) || 0;
    countEl.textContent = Number(quiz.progress) || 0;

    questions.forEach((q, i) => {
      const qObj = new Question(
        i,
        q.question,
        q.options,
        q.correctAnswer,
        q.points
      );
      this.questions.push(qObj);
      const el = createQuestionEl(qObj);
      el.classList.add("question-box", `_${i}`);
      questionsList.append(el);
    });
  }
  finishQuiz() {
    quiz.status = "finished";
    const quizStatus = statusStorage.getValue();
    quizStatus.status = quiz.status;

    quiz.score = 0;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    quiz.questions.forEach((q) => {
      if (q.getAnswer() !== null && q.correctAnswer === q.getAnswer()) {
        quiz.score += q.points;
      }
    });

    const percent = Math.round((quiz.score / totalPoints) * 100);

    quizStatus.score = percent;
    quiz.result = percent >= 70 ? "Pass" : "Fail";

    quizStatus.result = quiz.result;

    statusStorage.setValue(quizStatus);

    resultEl.classList.remove("pass", "fail");
    resultEl.classList.add(quiz.result === "Pass" ? "pass" : "fail");
    scoreEl.textContent = percent;
    resultEl.textContent = quiz.result;

    finishBtn.classList.add("hidden");
    restartBtn.classList.remove("hidden");
  }
  restartQuiz() {
    quiz.questions.map((q) => {
      q.setAnswer(null);
    });
    const oldQuestions = document.querySelectorAll(".question-box");
    for (let i = 0; i < oldQuestions.length; i++) {
      oldQuestions[i].remove();
    }
    restartBtn.classList.add("hidden");
    quizResult.classList.add("hidden");
    finishBtn.classList.remove("hidden");
    finishBtn.classList.add("hidden");
    startBtn.classList.remove("hidden");
    questionsList.classList.add("hidden");
    progressBox.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

class Storage {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    localStorage.setItem(this.key, JSON.stringify(this.value));
  }
  getValue() {
    return JSON.parse(localStorage.getItem(this.key));
  }
  setValue(answers) {
    localStorage.setItem(this.key, JSON.stringify(answers));
  }
}

class Question {
  #answer;
  constructor(id, question, options, correctAnswer, points) {
    this.id = id;
    this.question = question;
    this.options = [...options];
    this.correctAnswer = correctAnswer;
    this.points = points;
  }
  setAnswer(i) {
    this.#answer = i;
  }
  getAnswer() {
    return this.#answer;
  }
}

progressBar.max = questions.length;
progressLength.textContent = `/${questions.length}`;

let quiz;

let answersStorage = new Storage(
  "answersList",
  JSON.parse(localStorage.getItem("answersList") || "[]")
);
let statusStorage = new Storage(
  "quizStatus",
  JSON.parse(localStorage.getItem("quizStatus") || "{}")
);

let quizStatusObj = statusStorage.getValue();

if (answersStorage.getValue().length !== 0) {
  quiz = new Quiz([]);

  let answers = answersStorage.getValue();
  questionsList.classList.remove("hidden");
  startBtn.classList.add("hidden");
  sideBox.classList.remove("hidden");

  questions.forEach((q, i) => {
    const qObj = new Question(
      i,
      q.question,
      q.options,
      q.correctAnswer,
      q.points
    );
    qObj.setAnswer(answers[i]);
    quiz.questions.push(qObj);
    const el = createQuestionEl(qObj);
    el.classList.add("question-box", `_${i}`);
    el.querySelectorAll(".option").forEach((o, j) => {
      j === answers[i] && o.classList.add("selected-option");
    });
    questionsList.append(el);
  });

  quiz.progress = Number(quizStatusObj.progress) || 0;
  quiz.score = Number(quizStatusObj.score) || 0;
  quiz.result = quizStatusObj.result;
  quiz.status = quizStatusObj.status;

  progressBar.value = quiz.progress;
  countEl.textContent = quiz.progress;
  scoreEl.textContent = quiz.score;
  resultEl.textContent = quiz.result;

  if (quiz.status === "complete") {
    finishBtn.classList.remove("hidden");
  }
  if (quiz.status === "finished") {
    quizResult.classList.remove("hidden");
    quizResult.classList.add("flex");
    resultEl.classList.add(quiz.result === "Pass" ? "pass" : "fail");
    restartBtn.classList.remove("hidden");

    showCorrectAnswers();
  }
}

startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  questionsList.classList.remove("hidden");
  questionsList.classList.add("flex");
  sideBox.classList.remove("hidden");
  progressBox.classList.remove("hidden");
  quizResult.classList.add("flex");

  quiz = new Quiz([]);
  quiz.startQuiz();
});

questionsList.addEventListener("click", (e) => {
  const option = e.target.closest(".option");
  if (!option) return;

  const questionEl = option.closest(".question-box");
  if (!questionEl) return;

  const qid = Number(questionEl.dataset.qid);
  const idx = Number(option.dataset.idx);

  questionEl
    .querySelectorAll(".option")
    .forEach((btn) => btn.classList.remove("selected-option"));
  option.classList.add("selected-option");

  const questionObj = quiz.questions[qid];
  if (questionObj && typeof questionObj.setAnswer === "function") {
    const wasAnswered =
      questionObj.getAnswer() !== null && questionObj.getAnswer() !== undefined;
    questionObj.setAnswer(idx);

    const answers = answersStorage.getValue() || [];
    answers[qid] = idx;
    answersStorage.setValue(answers);

    if (!wasAnswered) {
      quiz.progress = (Number(quiz.progress) || 0) + 1;
    }
  }

  const quizStatus = statusStorage.getValue() || {};
  quizStatus.progress = quiz.progress;
  statusStorage.setValue(quizStatus);

  progressBar.value = quiz.progress;
  countEl.textContent = quiz.progress;

  if (quiz.progress === quiz.questions.length) {
    quiz.status = "complete";
    quizStatus.status = quiz.status;
    statusStorage.setValue(quizStatus);
    finishBtn.classList.remove("hidden");
  }
});

finishBtn.addEventListener("click", () => {
  quiz.finishQuiz();
  showCorrectAnswers();
});

restartBtn.addEventListener("click", () => {
  quiz.restartQuiz();
  reset();
});

function createQuestionEl(q) {
  const questionEl = document.createElement("div");
  questionEl.classList.add("question-box", `_${q.id}`);
  questionEl.dataset.qid = String(q.id);

  // header
  const questionHeader = document.createElement("div");
  questionHeader.classList.add("question-head");

  const questionNum = document.createElement("h2");
  questionNum.textContent = `Question ${q.id + 1}`;

  const questionPoints = document.createElement("p");
  questionPoints.classList.add("question-points");
  questionPoints.textContent = `${q.points} points`;

  const collectedPoints = document.createElement("p");
  collectedPoints.classList.add("collected-points", "hidden");
  collectedPoints.textContent = `0/${q.points}`;

  questionHeader.append(questionNum, questionPoints, collectedPoints);

  // text
  const questionText = document.createElement("p");
  questionText.textContent = q.question;

  // options
  const optionsList = document.createElement("div");
  optionsList.classList.add("optionsList");

  q.options.forEach((o, idx) => {
    const option = document.createElement("button");
    option.type = "button";
    option.classList.add("option", `_${idx}`);
    option.dataset.idx = String(idx);
    option.textContent = o;
    optionsList.append(option);
  });

  questionEl.append(questionHeader, questionText, optionsList);
  return questionEl;
}

function showCorrectAnswers() {
  quizResult.classList.remove("hidden");
  quizResult.classList.add("flex");
  questionsList.querySelectorAll(".question-box .option").forEach((btn) => {
    btn.disabled = true;
  });

  quiz.questions.forEach((q, qid) => {
    const questionEl = questionsList.querySelector(`.question-box._${qid}`);
    if (!questionEl) return;

    questionEl.querySelectorAll(".option").forEach((btn) => {
      btn.classList.remove("correct-option", "wrong-option");
    });

    const chosenBtn =
      q.getAnswer() !== null
        ? questionEl.querySelector(`.option._${q.getAnswer()}`)
        : null;
    const correctBtn = questionEl.querySelector(`.option._${q.correctAnswer}`);

    if (chosenBtn && String(q.getAnswer()) !== String(q.correctAnswer)) {
      chosenBtn.classList.add("wrong-option");
    }
    if (correctBtn) {
      correctBtn.classList.add("correct-option");
    }

    const slot = questionEl.querySelector(".collected-points");
    const questionPoints = questionEl.querySelector(".question-points");
    questionPoints.classList.add("hidden");
    if (slot) {
      const got =
        q.getAnswer() !== null && q.getAnswer() === q.correctAnswer
          ? q.points
          : 0;
      slot.textContent = `${got}/${q.points}`;
      slot.classList.remove("hidden");
      slot.style.fontWeight = "bold";
      slot.style.color = got > 0 ? "#10B981" : "#EF4444";
    }
  });
}

function reset() {
  quiz.progress = 0;
  quiz.score = 0;
  quiz.result = "";
  quiz.status = "active";

  quizStatusObj = {
    progress: 0,
    score: 0,
    result: "",
    status: "active",
  };

  answersStorage.setValue([]);
  statusStorage.setValue(quizStatusObj);
}
