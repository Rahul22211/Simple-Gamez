const gameArea = document.getElementById("game-area");
const scoreSpan = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

const gridSize = 20;
let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
let food = {x: 5, y: 5};
let score = 0;
let gameInterval;
let isGameOver = false;

function drawGame() {
    gameArea.innerHTML = "";
    // Draw snake
    snake.forEach(segment => {
        const cell = document.createElement("div");
        cell.classList.add("cell", "snake");
        cell.style.gridColumnStart = segment.x;
        cell.style.gridRowStart = segment.y;
        gameArea.appendChild(cell);
    });
    // Draw food
    const foodCell = document.createElement("div");
    foodCell.classList.add("cell", "food");
    foodCell.style.gridColumnStart = food.x;
    foodCell.style.gridRowStart = food.y;
    gameArea.appendChild(foodCell);
    // Update score
    scoreSpan.textContent = "Score: " + score;
}

function moveSnake() {
    if (direction.x === 0 && direction.y === 0) return; // Don't move at start

    const newHead = { 
        x: snake[0].x + direction.x, 
        y: snake[0].y + direction.y 
    };

    // Check wall collision
    if (
        newHead.x < 1 || newHead.x > gridSize ||
        newHead.y < 1 || newHead.y > gridSize ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
        gameOver();
        return;
    }

    snake.unshift(newHead);

    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * gridSize) + 1,
            y: Math.floor(Math.random() * gridSize) + 1
        };
        // Ensure food doesn't spawn on snake
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            break;
        }
    }
    food = newFood;
}

function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    alert("Game Over! Your score: " + score);
}

function restartGame() {
    snake = [{x: 10, y: 10}];
    direction = {x: 0, y: 0};
    score = 0;
    isGameOver = false;
    placeFood();
    drawGame();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        if (!isGameOver) {
            moveSnake();
            drawGame();
        }
    }, 120);
}

document.addEventListener("keydown", e => {
    if (isGameOver) return;
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 1) break;
            direction = {x: 0, y: -1};
            break;
        case "ArrowDown":
            if (direction.y === -1) break;
            direction = {x: 0, y: 1};
            break;
        case "ArrowLeft":
            if (direction.x === 1) break;
            direction = {x: -1, y: 0};
            break;
        case "ArrowRight":
            if (direction.x === -1) break;
            direction = {x: 1, y: 0};
            break;
    }
});

restartBtn.addEventListener("click", restartGame);

restartGame();