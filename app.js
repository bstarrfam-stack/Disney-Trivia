let triviaData = [];
let filteredData = [];
let currentIndex = 0;
let mode = "flash"; // "flash" or "mc"

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("flashcard-answer");
const mcContainer = document.getElementById("mc-options");
const revealBtn = document.getElementById("btn-reveal");
const progressEl = document.getElementById("progress");
const categorySelect = document.getElementById("category");

const modeFlashBtn = document.getElementById("mode-flash");
const modeMcBtn = document.getElementById("mode-mc");

const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnRandom = document.getElementById("btn-random");

async function loadTrivia() {
  const res = await fetch("trivia.json");
  triviaData = await res.json();
  buildCategories();
  setCategory("all");
}

function buildCategories() {
  const categories = new Set();
  triviaData.forEach(q => {
    if (q.category) categories.add(q.category);
  });

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

function setCategory(cat) {
  if (cat === "all") {
    filteredData = [...triviaData];
  } else {
    filteredData = triviaData.filter(q => q.category === cat);
  }
  currentIndex = 0;
  renderCard();
}

function renderCard() {
  if (!filteredData.length) {
    questionEl.textContent = "No questions in this category yet.";
    answerEl.textContent = "";
    mcContainer.innerHTML = "";
    progressEl.textContent = "";
    revealBtn.classList.add("hidden");
    return;
  }

  const item = filteredData[currentIndex];
  questionEl.textContent = item.question;
  answerEl.textContent = item.answer;
  answerEl.classList.add("hidden");
  mcContainer.classList.add("hidden");
  mcContainer.innerHTML = "";
  revealBtn.textContent = mode === "flash" ? "Reveal Answer" : "Show Options";
  revealBtn.classList.remove("hidden");

  progressEl.textContent = `Question ${currentIndex + 1} of ${filteredData.length}`;
}

function showFlashAnswer() {
  answerEl.classList.remove("hidden");
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showMultipleChoice() {
  const correct = filteredData[currentIndex];
  const options = [correct];

  // pick 3 random other questions as wrong answers
  const others = triviaData.filter(q => q !== correct);
  shuffleArray(others)
    .slice(0, 3)
    .forEach(q => options.push(q));

  const shuffled = shuffleArray(options);

  mcContainer.innerHTML = "";
  mcContainer.classList.remove("hidden");
  answerEl.classList.add("hidden");

  shuffled.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "mc-option";
    btn.textContent = opt.answer;
    btn.addEventListener("click", () => {
      if (opt === correct) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("incorrect");
      }
    });
    mcContainer.appendChild(btn);
  });
}

revealBtn.addEventListener("click", () => {
  if (mode === "flash") {
    showFlashAnswer();
  } else {
    showMultipleChoice();
  }
});

btnNext.addEventListener("click", () => {
  if (!filteredData.length) return;
  currentIndex = (currentIndex + 1) % filteredData.length;
  renderCard();
});

btnPrev.addEventListener("click", () => {
  if (!filteredData.length) return;
  currentIndex = (currentIndex - 1 + filteredData.length) % filteredData.length;
  renderCard();
});

btnRandom.addEventListener("click", () => {
  if (!filteredData.length) return;
  currentIndex = Math.floor(Math.random() * filteredData.length);
  renderCard();
});

modeFlashBtn.addEventListener("click", () => {
  mode = "flash";
  modeFlashBtn.classList.add("active");
  modeMcBtn.classList.remove("active");
  renderCard();
});

modeMcBtn.addEventListener("click", () => {
  mode = "mc";
  modeMcBtn.classList.add("active");
  modeFlashBtn.classList.remove("active");
  renderCard();
});

categorySelect.addEventListener("change", e => {
  setCategory(e.target.value);
});

loadTrivia();
