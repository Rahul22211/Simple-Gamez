let secretNumber;
let tries;

// Persistent score keys
const WINS_KEY = 'guessWins_v1';
const BEST_KEY = 'guessBest_v1'; // fewest tries

let wins = 0;
let best = null; // null means no record yet

function loadScores() {
  try {
    const w = localStorage.getItem(WINS_KEY);
    wins = w ? Number(w) : 0;
    const b = localStorage.getItem(BEST_KEY);
    best = b ? Number(b) : null;
  } catch (e) {
    // localStorage may throw in some environments; fall back to defaults
    wins = 0;
    best = null;
  }
  updateScoreUI();
}

function saveScores() {
  try {
    localStorage.setItem(WINS_KEY, String(wins));
    if (best !== null) localStorage.setItem(BEST_KEY, String(best));
  } catch (e) {
    // ignore storage errors
  }
}

function updateScoreUI() {
  const winsEl = document.getElementById('wins');
  const bestEl = document.getElementById('best');
  if (winsEl) winsEl.textContent = wins;
  if (bestEl) bestEl.textContent = best === null ? '—' : best;
}

function startGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  tries = 0;
  document.getElementById('message').textContent = '';
  document.getElementById('attempts').textContent = '';
  const input = document.getElementById('guessInput');
  if (input) input.value = '';
  // ensure card style reset
  const card = document.getElementById('gameCard');
  if (card) card.classList.remove('card-correct');
  loadScores();
}

function checkguess() {
  const guessInput = document.getElementById('guessInput');
  const guess = Number(guessInput ? guessInput.value : NaN);

  if (!guess || guess < 1 || guess > 100) {
    document.getElementById('message').textContent = 'Enter a number between 1 and 100!';
    return;
  } else if (!Number.isInteger(guess)) {
    document.getElementById('message').textContent = 'Enter a valid number!';
    return;
  }
  tries++;
  const attemptsEl = document.getElementById('attempts');
  if (attemptsEl) attemptsEl.textContent = `Tries: ${tries}`;

  const diff = Math.abs(secretNumber - guess);

  if (guess === secretNumber) {
    document.getElementById('message').textContent = `🎉 Correct! The number was ${secretNumber}. You guessed it in ${tries} ${tries === 1 ? 'try' : 'tries'}.`;
    // update persistent scores
    wins++;
    if (best === null || tries < best) best = tries;
    saveScores();
    updateScoreUI();
    const card = document.getElementById('gameCard');
    if (card) card.classList.add('card-correct');
  } else if (guess < secretNumber) {
    if (diff > 10) {
      document.getElementById('message').textContent = '⬆️ Too low! Try again.';
    } else {
      document.getElementById('message').textContent = '⬆️ Close! Try a bit higher.';
    }
  } else {
    if (diff > 10) {
      document.getElementById('message').textContent = '⬇️ Too high! Try again.';
    } else {
      document.getElementById('message').textContent = '⬇️ Close! Try a bit lower.';
    }
  }
}

function restartGame() {
  startGame();
}

function resetScores() {
  wins = 0;
  best = null;
  try {
    localStorage.removeItem(WINS_KEY);
    localStorage.removeItem(BEST_KEY);
  } catch (e) {}
  updateScoreUI();
}

window.onload = startGame;
