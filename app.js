let triviaData = [];
let filteredData = [];
let currentIndex = 0;
let mode = "flash"; // "flash" or "mc"

// DOM elements
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("flashcard-answer");
const mcContainer = document.getElementById("mc-options");
const revealBtn = document.getElementById("btn-reveal");
const progressEl = document.getElementById("progress");

const categorySelect = document.getElementById("category");
const movieSelect = document.getElementById("movie");

const modeFlashBtn = document.getElementById("mode-flash");
const modeMcBtn = document.getElementById("mode-mc");

const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnRandom = document.getElementById("btn-random");

// Load JSON
async function loadTrivia() {
  const res = await fetch("trivia.json");
  triviaData = await res.json();

  buildCategories();
  buildMovies();
  setFilters();
}

// Build category dropdown
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

// Build movie dropdown
function buildMovies() {
  const movies = new Set();
  triviaData.forEach(q => {
    if (q.movie) movies.add(q.movie);
  });

  movies.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    movieSelect.appendChild(opt);
  });
}

// Unified filter logic
function setFilters() {
  const selectedCategory = categorySelect.value;
  const selectedMovie = movieSelect.value;

  filteredData = triviaData.filter(q => {
    const categoryMatch = selectedCategory === "all" || q.category === selectedCategory;
    const movieMatch = selectedMovie === "all" || q.movie === selectedMovie;
    return categoryMatch && movieMatch;
  });

  currentIndex = 0;
  renderCard();
}

// Render card
function renderCard() {
  if (!filteredData.length) {
    questionEl.textContent = "No questions match your filters.";
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

// Flashcard reveal
function showFlashAnswer() {
  answerEl.classList.remove("hidden");
}

// Shuffle helper
function shuffleArray(arr