"use strict";

import { questions } from "./assets/questions.js";

const startBtn = document.querySelector(".start");
const progressBar = document.querySelector(".progress");
const progressLength = document.querySelector(".progress-length");
const countEl = document.querySelector(".count");
const finishBtn = document.querySelector(".finish");
const restartBtn = document.querySelector(".restart");
const questionsList = document.querySelector(".questions-list");
const footer = document.querySelector(".footer");
const quizResult = document.querySelector(".quiz-result");
const scoreEl = document.querySelector(".score");
const statusEl = document.querySelector(".status");
const arrowRight = document.querySelector(".arrow-R");
const arrowLeft = document.querySelector(".arrow-L");

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

let active = 0;
let count = 0;
let score = 0;
let status = "";

function startApp() {
  // reset state
  active = 0;
  count = 0;
  score = 0;
  status = "";

  // UI reset
  count = 0;
  progressBar.max = questions.length;
  progressLength.textContent = `/${questions.length}`;
  progressBar.value = count;
  countEl.textContent = count;

  arrowLeft.classList.add("hidden");
  arrowRight.classList.remove("hidden");

  questionsList.querySelectorAll(".question-box").forEach((el) => el.remove());
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
    if (i !== 0) el.classList.add("hidden");
    questionsList.append(el);
  });

  showActive();
}

function showActive() {
  document
    .querySelectorAll(".question-box")
    .forEach((el) => el.classList.add("hidden"));

  const currentEl = document.querySelector(`.question-box._${active}`);
  if (!currentEl) return;

  currentEl.classList.remove("hidden");

  if (!currentEl.dataset.mounted) {
    currentEl.classList.add("enter");
    currentEl.addEventListener(
      "animationend",
      () => {
        currentEl.classList.remove("enter");
      },
      { once: true }
    );
    currentEl.dataset.mounted = "true";
  }

  arrowLeft.classList.toggle("hidden", active === 0);
  arrowRight.classList.toggle("hidden", active === questions.length - 1);
}

document.addEventListener("DOMContentLoaded", () => {
  startApp();
});

startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  questionsList.classList.remove("hidden");
  questionsList.classList.add("flex");
  footer.classList.remove("hidden");
});

function createQuestionEl(q) {
  const questionEl = document.createElement("div");
  questionEl.classList.add("question-box", "hidden", `_${q.id}`);
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
