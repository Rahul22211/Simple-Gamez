const container = document.getElementById("sudoku-container");
const checkBtn = document.getElementById("checkBtn");
const hintBtn = document.getElementById("hintBtn");
const hintCountSpan = document.getElementById("hintCount");
const message = document.getElementById("message");
const levelButtons = document.querySelectorAll(".level-btn");

let puzzle, solution, hintsLeft = 3;

// Predefined puzzles for levels
const puzzles = {
  easy: {
    puzzle: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    solution: [
      [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9]
    ]
  },
  medium: {
    puzzle: [
      [0,0,0,0,6,0,0,0,0],
      [0,0,0,1,0,9,0,0,0],
      [0,9,0,0,0,0,0,6,0],
      [0,0,0,0,0,0,3,0,0],
      [0,0,8,0,0,0,5,0,0],
      [0,0,3,0,0,0,0,0,0],
      [0,6,0,0,0,0,0,2,0],
      [0,0,0,7,0,2,0,0,0],
      [0,0,0,0,3,0,0,0,0]
    ],
    solution: [
      [2,3,1,5,6,7,9,4,8],
      [5,8,6,1,2,9,7,3,2],
      [4,9,7,3,8,2,1,6,5],
      [1,5,2,6,7,4,3,8,9],
      [6,7,8,2,9,1,5,4,3],
      [9,4,3,8,5,3,6,1,7],
      [3,6,5,9,1,8,4,2,1],
      [8,1,4,7,4,2,2,5,6],
      [7,2,9,4,3,6,8,9,1]
    ]
  },
  hard: {
    puzzle: [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,3,0,8,5],
      [0,0,1,0,2,0,0,0,0],
      [0,0,0,5,0,7,0,0,0],
      [0,0,4,0,0,0,1,0,0],
      [0,9,0,0,0,0,0,0,0],
      [5,0,0,0,0,0,0,7,3],
      [0,0,2,0,1,0,0,0,0],
      [0,0,0,0,4,0,0,0,9]
    ],
    solution: [
      [9,8,7,6,5,4,3,2,1],
      [2,4,6,1,7,3,9,8,5],
      [3,5,1,9,2,8,7,4,6],
      [1,2,8,5,3,7,6,9,4],
      [6,3,4,8,9,2,1,5,7],
      [7,9,5,4,6,1,8,3,2],
      [5,1,9,2,8,6,4,7,3],
      [4,7,2,3,1,9,5,6,8],
      [8,6,3,7,4,5,2,1,9]
    ]
  }
};

// Initialize selected level
function loadLevel(level) {
  puzzle = JSON.parse(JSON.stringify(puzzles[level].puzzle));
  solution = puzzles[level].solution;
  hintsLeft = 3;
  hintCountSpan.textContent = hintsLeft;
  message.textContent = "";
  renderGrid();
}

// Render Sudoku Grid
function renderGrid() {
  container.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.max = 9;
      input.dataset.row = i;
      input.dataset.col = j;
      if (puzzle[i][j] !== 0) {
        input.value = puzzle[i][j];
        input.disabled = true;
      }
      container.appendChild(input);
    }
  }
}

// Level buttons
levelButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    loadLevel(btn.dataset.level);
  });
});

// Check solution
checkBtn.addEventListener("click", () => {
  const inputs = container.querySelectorAll("input");
  let isCorrect = true;

  inputs.forEach(input => {
    const r = parseInt(input.dataset.row);
    const c = parseInt(input.dataset.col);
    const val = parseInt(input.value);
    if (val !== solution[r][c]) isCorrect = false;
  });

  if (isCorrect) {
    message.textContent = "✅ Correct! Well done!";
    message.style.color = "green";
  } else {
    message.textContent = "❌ Incorrect Solution!";
    message.style.color = "red";
  }
});

// Hint button (max 3)
hintBtn.addEventListener("click", () => {
  if (hintsLeft <= 0) return;

  const inputs = container.querySelectorAll("input");
  const emptyCells = Array.from(inputs).filter(input => input.value === "");
  if (emptyCells.length === 0) return;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const r = parseInt(randomCell.dataset.row);
  const c = parseInt(randomCell.dataset.col);
  randomCell.value = solution[r][c];
  randomCell.style.backgroundColor = "#dff9fb";
  hintsLeft--;
  hintCountSpan.textContent = hintsLeft;
});

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {
  // Reset the puzzle to initial state
  hintsLeft = 3;
  hintCountSpan.textContent = hintsLeft;
  message.textContent = "";
  renderGrid();
});


// Load easy level by default
loadLevel("easy");
