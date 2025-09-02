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
const statusEl = document.querySelector(".status");

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

let progress = 0;
let count = 0;
let score = 0;
let status = "";

function startApp() {
  count = 0;
  score = 0;
  status = "";

  count = 0;
  progressBar.max = questions.length;
  progressLength.textContent = `/${questions.length}`;
  progressBar.value = count;
  countEl.textContent = count;

  questions.forEach((q, i) => {
    const qObj = new Question(
      i,
      q.question,
      q.options,
      q.correctAnswer,
      q.points
    );
    const el = createQuestionEl(qObj);
    el.classList.add("question-box", `_${i}`);
    questionsList.append(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  startApp();
});

startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  questionsList.classList.remove("hidden");
  questionsList.classList.add("flex");
  sideBox.classList.remove("hidden");
  progressBox.classList.remove("hidden");
  quizResult.classList.add("flex");
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

  const questionObj = questions[qid];
  if (questionObj && typeof questionObj.setAnswer === "function") {
    questionObj.setAnswer(idx);
  }
  questions.map((q) => {
    if (q.getAnswer() !== null) count++;
  });
  progressBar.value = count;
  countEl.textContent = count;
  progress = count;
  count = 0;
  if (progress === 10) {
    finishBtn.classList.remove("hidden");
  }
});

finishBtn.addEventListener("click", () => {
  quizResult.classList.remove("hidden");
  quizResult.classList.add("flex");
  questionsList.querySelectorAll(".question-box .option").forEach((btn) => {
    btn.disabled = true;
  });

  score = 0;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  questions.forEach((q) => {
    if (q.getAnswer() !== null && q.correctAnswer === q.getAnswer()) {
      score += q.points;
    }
  });

  const percent = Math.round((score / totalPoints) * 100);
  status = percent >= 70 ? "Pass" : "Fail";

  statusEl.classList.remove("pass-status", "fail-status");
  statusEl.classList.add(status === "Pass" ? "pass-status" : "fail-status");
  scoreEl.textContent = score;
  statusEl.textContent = status;

  finishBtn.classList.add("hidden");
  restartBtn.classList.remove("hidden");

  questions.forEach((q, qid) => {
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
});

restartBtn.addEventListener("click", () => {
  questions.map((q) => {
    q.setAnswer(null);
  });
  const oldQuestions = document.querySelectorAll(".question-box");
  for (let i = 0; i < oldQuestions.length; i++) {
    oldQuestions[i].remove();
  }
  restartBtn.classList.add("hidden");
  quizResult.classList.add("hidden");
  finishBtn.classList.remove("hidden");
  startApp();
  finishBtn.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
