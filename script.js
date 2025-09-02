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
  count = 0;
  const currentEl = getCurrentEl();
  if (Number(currentEl.dataset.qid) === questions.length - 1) {
    finishBtn.classList.remove("hidden");
  }
});

function getCurrentEl() {
  return document.querySelector(`.question-box._${active}`);
}

function isCurrentAnswered() {
  const current = document.querySelector(`.question-box._${active}`);
  return !!current?.querySelector(".selected-option");
}

arrowRight.addEventListener("click", () => {
  if (!isCurrentAnswered()) {
    requireAnswer();
    return;
  }
  function requireAnswer() {
    const el = getCurrentEl();
    el?.classList.add("need-answer");
    setTimeout(() => el?.classList.remove("need-answer"), 360);
  }
  if (active < questions.length - 1) {
    active += 1;
    showActive();
  }
});

arrowLeft.addEventListener("click", () => {
  if (active > 0) {
    active -= 1;
    showActive();
  }
});

finishBtn.addEventListener("click", () => {
  // UI: show result area, lock choices
  quizResult.classList.remove("hidden");
  quizResult.classList.add("flex");
  questionsList.querySelectorAll(".question-box .option").forEach((btn) => {
    btn.disabled = true;
  });

  // 1) Reset and compute score safely
  score = 0;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  questions.forEach((q) => {
    if (q.getAnswer() !== null && q.correctAnswer === q.getAnswer()) {
      score += q.points;
    }
  });

  // 2) Status via percentage (robust for any quiz size)
  const percent = Math.round((score / totalPoints) * 100);
  status = percent >= 70 ? "Pass" : "Fail";

  // 3) Render totals
  statusEl.classList.remove("pass-status", "fail-status");
  statusEl.classList.add(status === "Pass" ? "pass-status" : "fail-status");
  scoreEl.textContent = score; // or `${percent}%` if you prefer
  statusEl.textContent = status;

  // 4) Hide/Show action buttons
  finishBtn.classList.add("hidden");
  restartBtn.classList.remove("hidden");

  // 5) Final reveal per question (correct/wrong + optional points)
  questions.forEach((q, qid) => {
    const questionEl = questionsList.querySelector(`.question-box._${qid}`);
    if (!questionEl) return;

    // Clear old state
    questionEl.querySelectorAll(".option").forEach((btn) => {
      btn.classList.remove("selected-option", "correct-option", "wrong-option");
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

    // (Optional) Per-question points text
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
