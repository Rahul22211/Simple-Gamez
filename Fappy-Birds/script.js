const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menu = document.getElementById("menu");
const gameOverMenu = document.getElementById("gameOverMenu");
const finalScore = document.getElementById("finalScore");

let bird, pipes, clouds, frame, score, gameOver, gameStarted;

// Initialize game
function resetGame() {
  bird = {
    x: 50,
    y: 250,
    width: 30,
    height: 30,
    gravity: 0.3, // slower fall
    lift: -7,     // smoother jump
    velocity: 0,
  };
  pipes = [];
  clouds = [
    { x: 50, y: 80, size: 40 },
    { x: 250, y: 50, size: 60 },
    { x: 400, y: 120, size: 50 },
  ];
  frame = 0;
  score = 0;
  gameOver = false;
  gameStarted = true;

  menu.classList.add("hidden");
  gameOverMenu.classList.add("hidden");
  loop();
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && gameStarted && !gameOver) {
    bird.velocity = bird.lift;
  }
});

startBtn.addEventListener("click", () => resetGame());
restartBtn.addEventListener("click", () => resetGame());

// Drawing the bird with wings + eye
function drawBird() {
  // Body
  ctx.fillStyle = "#ffeb3b"; // bright yellow
  ctx.beginPath();
  ctx.ellipse(bird.x + 20, bird.y + 20, 20, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly (white oval)
  ctx.fillStyle = "#fffde7";
  ctx.beginPath();
  ctx.ellipse(bird.x + 20, bird.y + 25, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = "#ffeb3b";
  ctx.beginPath();
  ctx.arc(bird.x + 35, bird.y + 10, 10, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(bird.x + 38, bird.y + 8, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = "#ff9800"; // orange
  ctx.beginPath();
  ctx.moveTo(bird.x + 45, bird.y + 10); // tip of beak
  ctx.lineTo(bird.x + 38, bird.y + 6);  // upper side
  ctx.lineTo(bird.x + 38, bird.y + 12); // lower side
  ctx.closePath();
  ctx.fill();

  // Wing
  ctx.fillStyle = "#fdd835";
  ctx.beginPath();
  ctx.moveTo(bird.x + 10, bird.y + 15);
  ctx.quadraticCurveTo(bird.x, bird.y + 10, bird.x + 5, bird.y + 25);
  ctx.lineTo(bird.x + 15, bird.y + 20);
  ctx.closePath();
  ctx.fill();

  // Tail
  ctx.fillStyle = "#fbc02d";
  ctx.beginPath();
  ctx.moveTo(bird.x, bird.y + 25);
  ctx.lineTo(bird.x - 10, bird.y + 20);
  ctx.lineTo(bird.x - 10, bird.y + 30);
  ctx.closePath();
  ctx.fill();
}


function drawClouds() {
  ctx.fillStyle = "white";
  clouds.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size * 0.5, 0, Math.PI * 2);
    ctx.arc(c.x + c.size / 2, c.y - 10, c.size * 0.4, 0, Math.PI * 2);
    ctx.arc(c.x + c.size, c.y, c.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Move clouds slowly
  clouds.forEach((c) => {
    c.x -= 0.3;
    if (c.x + c.size < 0) {
      c.x = canvas.width + 50;
      c.y = Math.random() * 150 + 30;
    }
  });
}

function drawPipes() {
  ctx.fillStyle = "#2e8b57";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  if (bird.y + bird.height > canvas.height) gameOver = true;
  if (bird.y < 0) bird.y = 0;
}

function updatePipes() {
  if (frame % 120 === 0) {
    let top = Math.random() * (canvas.height / 2);
    let gap = 160;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: top,
      bottom: canvas.height - top - gap,
    });
  }

  pipes.forEach((pipe) => (pipe.x -= 2));

  if (pipes.length && pipes[0].x + pipes[0].width < 0) {
    pipes.shift();
    score++;
  }
}

function checkCollision() {
  pipes.forEach((pipe) => {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }
  });
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "24px Poppins";
  ctx.fillText("Score: " + score, 10, 30);
}

function showGameOver() {
  gameOverMenu.classList.remove("hidden");
  finalScore.textContent = score;
}

function loop() {
  if (gameOver) {
    showGameOver();
    gameStarted = false;
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawClouds();
  drawBird();
  drawPipes();
  updateBird();
  updatePipes();
  checkCollision();
  drawScore();

  frame++;
  requestAnimationFrame(loop);
}
