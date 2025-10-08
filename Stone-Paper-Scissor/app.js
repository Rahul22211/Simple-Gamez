// Game constants
const GAME_STATE = {
  DEFAULT_MSG: "No games have been played yet",
  STORAGE_KEYS: {
    SCORE: "score",
    LAST_MSG: "RPS_lastMsg",
  },
  AUTO_PLAY: {
    MIN_INTERVAL: 100,
    MAX_INTERVAL: 10000,
    MIN_DURATION: 1,
    MAX_DURATION: 300,
    HTML_ELEMENTS: `
  <div class="duration-container">
    <label for="timeInput" id="timeLabel" class="time-label">Enter total time to run (in seconds)</label>
    <input type="text" id="timeInput" class="time-input auto-play-input" placeholder="e.g., 60 (max 300s)">
  </div>
  <div class="interval-container">
    <label for="intervalInput" id="intervalLabel" class="interval-label">Enter the interval (in milliseconds)</label>
    <input type="text" id="intervalInput" class="interval-input auto-play-input" placeholder="e.g., 500 (min 100ms)">
  </div>
`,
    ERROR_MESSAGES: {
      INTERVAL_INVALID_SIZE:
        "Interval: Please enter a valid integer in the range [100, 10000]",
      DURATION_INVALID_SIZE:
        "Duration: Please enter a valid integer in the range [1, 300]",
      INTERVAL_EMPTY: "Interval: Please enter the interval",
      DURATION_EMPTY: "Duration: Please enter the duration",
      INVALID_INPUT: "Please enter only integer numbers",
    },
  },
};

const MESSAGES = {
  WIN: "You've won kiddo well done",
  LOSE: "You've lost kiddo",
  TIE: "The game is Tied",
};

// Game configuration
const beats = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

const choiceImages = {
  rock: '<div class="game-button rock"></div>',
  paper: '<div class="game-button paper"></div>',
  scissors: '<div class="game-button scissors"></div>',
};

// Game State
let score = JSON.parse(localStorage.getItem(GAME_STATE.STORAGE_KEYS.SCORE)) || {
  wins: 0,
  losses: 0,
  tied: 0,
};

// Game Functions
function displayTable() {
  return `Wins: ${score.wins} Losses: ${score.losses} Tied: ${score.tied}`;
}

function getComputerChoice() {
  const choices = Object.keys(beats);
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function showResult(message, computerChoice, playerChoice) {
  const finalResult = `
  The computer chose ${choiceImages[computerChoice]} 
  and you chose ${choiceImages[playerChoice]}
   
  ${message}
  
  ${displayTable()}`.trim();

  document.getElementById("result").innerHTML = finalResult;
  localStorage.setItem(GAME_STATE.STORAGE_KEYS.LAST_MSG, finalResult);
}

function playGame(playerChoice) {
  const computerChoice = getComputerChoice();

  if (playerChoice === computerChoice) {
    score.tied++;
    showResult(MESSAGES.TIE, computerChoice, playerChoice);
  } else if (beats[playerChoice] === computerChoice) {
    score.wins++;
    showResult(MESSAGES.WIN, computerChoice, playerChoice);
  } else {
    score.losses++;
    showResult(MESSAGES.LOSE, computerChoice, playerChoice);
  }
  localStorage.setItem(GAME_STATE.STORAGE_KEYS.SCORE, JSON.stringify(score));
}

function reset() {
  score = { wins: 0, losses: 0, tied: 0 };
  document.getElementById("result").textContent = GAME_STATE.DEFAULT_MSG;

  localStorage.setItem(GAME_STATE.STORAGE_KEYS.SCORE, JSON.stringify(score));
  localStorage.setItem(
    GAME_STATE.STORAGE_KEYS.LAST_MSG,
    GAME_STATE.DEFAULT_MSG
  );

  stopAutoPlayMethod();
}

//To validate duration and interval inputs
function validateInput(intervalValue, durationValue) {
  const errors = [];
  const {
    ERROR_MESSAGES,
    MIN_INTERVAL,
    MAX_INTERVAL,
    MIN_DURATION,
    MAX_DURATION,
  } = GAME_STATE.AUTO_PLAY;

  // Validate the interval input independently.
  if (intervalValue === "") {
    errors.push(ERROR_MESSAGES.INTERVAL_EMPTY);
  } else if (!/^\d+$/.test(intervalValue)) {
    errors.push(`Interval: ${ERROR_MESSAGES.INVALID_INPUT}`);
  } else {
    const num = parseInt(intervalValue, 10);
    if (!(num >= MIN_INTERVAL && num <= MAX_INTERVAL)) {
      errors.push(ERROR_MESSAGES.INTERVAL_INVALID_SIZE);
    }
  }

  // Validate the duration input independently.
  if (durationValue === "") {
    errors.push(ERROR_MESSAGES.DURATION_EMPTY);
  } else if (!/^\d+$/.test(durationValue)) {
    errors.push(`Duration: ${ERROR_MESSAGES.INVALID_INPUT}`);
  } else {
    const num = parseInt(durationValue, 10);
    if (!(num >= MIN_DURATION && num <= MAX_DURATION)) {
      errors.push(ERROR_MESSAGES.DURATION_INVALID_SIZE);
    }
  }

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return false;
  }

  return [parseInt(intervalValue, 10), parseInt(durationValue, 10)];
}

//Display elements for taking input
function autoPlayDisplay() {
  const autoPlayOptionsEle = document.getElementById("autoPlayOptions");
  if (autoPlayOptionsEle.children.length === 0) {
    autoPlayOptionsEle.insertAdjacentHTML(
      "beforeend",
      GAME_STATE.AUTO_PLAY.HTML_ELEMENTS
    );

    //Single event listener for both of them.
    autoPlayOptionsEle.addEventListener("keydown", (e) => {
      const isInput = e.target.classList.contains("auto-play-input");
      if (isInput && e.key === "Enter") {
        e.preventDefault();
        autoPlaySettings();
      }
    });
  }

  autoPlayOptionsEle.classList.toggle("hidden");
}

//Take the Inputs and create the stopAutoPlay button
function autoPlaySettings() {
  const intervalInputEle = document.getElementById("intervalInput");
  const timeInputEle = document.getElementById("timeInput");
  const resetAndAutoPlayEle = document.getElementById("resetAndAutoPlay");

  const validationResult = validateInput(
    intervalInputEle.value.trim(),
    timeInputEle.value.trim()
  );

  if (!validationResult) return;
  const [intervalMs, durationS] = validationResult;
  const durationMs = durationS * 1000;

  //To run the following block of code only once
  let stopAutoPlayEle = document.getElementById("stopAutoPlay");
  if (stopAutoPlayEle === null) {
    const stopBtn = document.createElement("div");
    stopBtn.id = "stopAutoPlay";
    stopBtn.className = "stop-auto-play";
    stopBtn.textContent = "Stop auto play";
    resetAndAutoPlayEle.appendChild(stopBtn);

    stopAutoPlayEle = stopBtn;

    stopAutoPlayEle.addEventListener("click", stopAutoPlayMethod);
  }

  if (stopAutoPlayEle.style.display === "none") {
    stopAutoPlayEle.style.display = "inline-block";
  }

  autoPlaySim(intervalMs, durationMs);
}

// To simulate the autoPlay
let timeoutID = null;
let intervalID = null;
function autoPlaySim(intervalMs, durationMs) {
  if (intervalID !== null) {
    clearInterval(intervalID);
    intervalID = null;
  }

  if (timeoutID !== null) {
    clearTimeout(timeoutID);
    timeoutID = null;
  }

  intervalID = setInterval(() => {
    const computerChoice = getComputerChoice();
    playGame(computerChoice);
  }, intervalMs);

  timeoutID = setTimeout(() => {
    stopAutoPlayMethod();
  }, durationMs);
}

function stopAutoPlayMethod() {
  clearInterval(intervalID);
  intervalID = null;

  clearTimeout(timeoutID);
  timeoutID = null;

  const autoPlayOptionsEle = document.getElementById("autoPlayOptions");
  const stopAutoPlayEle = document.getElementById("stopAutoPlay");
  const intervalInputEle = document.getElementById("intervalInput");
  const timeInputEle = document.getElementById("timeInput");

  if (autoPlayOptionsEle && stopAutoPlayEle) {
    autoPlayOptionsEle.classList.add("hidden");
    stopAutoPlayEle.style.display = "none";

    if (intervalInputEle) intervalInputEle.value = "";
    if (timeInputEle) timeInputEle.value = "";
  }
}

//Event listeners
document.addEventListener("DOMContentLoaded", () => {
  const resultElement = document.getElementById("result");
  const resetEle = document.getElementById("resetBtn");
  const gameControlsEle = document.getElementById("gameControls");
  const autoPlayEle = document.getElementById("autoPlay");

  const lastMsg = localStorage.getItem(GAME_STATE.STORAGE_KEYS.LAST_MSG);
  resultElement.innerHTML = lastMsg || GAME_STATE.DEFAULT_MSG;

  gameControlsEle.addEventListener("click", (e) => {
    if (e.target.classList.contains("game-button")) {
      const playerChoice = e.target.id;
      playGame(playerChoice);
    }
  });

  resetEle.addEventListener("click", reset);
  autoPlayEle.addEventListener("click", autoPlayDisplay);
});
