class Game2048 {
    constructor() {
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = localStorage.getItem('2048-best-score') || 0;
        this.won = false;
        this.over = false;
        this.moved = false;
        
        // DOM elements
        this.gridContainer = document.getElementById('grid-container');
        this.scoreElement = document.getElementById('current-score');
        this.bestScoreElement = document.getElementById('best-score');
        this.messageElement = document.getElementById('game-message');
        this.messageTitleElement = document.getElementById('message-title');
        this.messageTextElement = document.getElementById('message-text');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.tryAgainBtn = document.getElementById('try-again-btn');
        
        this.init();
        this.setupControls();
    }

    init() {
        // Initialize grid
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.won = false;
        this.over = false;
        this.moved = false;
        
        // Update display
        this.updateScore();
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
        this.hideMessage();
        
        console.log('Game initialized');
    }

    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.over && !this.won) return;
            
            let moved = false;
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    moved = this.move('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    moved = this.move('right');
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    moved = this.move('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    moved = this.move('down');
                    break;
            }
            
            if (moved) {
                setTimeout(() => {
                    this.addRandomTile();
                    this.updateDisplay();
                    this.checkGameState();
                }, 150);
            }
        });

        // Touch controls
        let startX, startY;
        let isTouch = false;

        this.gridContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isTouch = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.gridContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        this.gridContainer.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!isTouch || this.over && !this.won) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            let moved = false;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe
                if (Math.abs(diffX) > 30) {
                    moved = diffX > 0 ? this.move('left') : this.move('right');
                }
            } else {
                // Vertical swipe
                if (Math.abs(diffY) > 30) {
                    moved = diffY > 0 ? this.move('up') : this.move('down');
                }
            }
            
            if (moved) {
                setTimeout(() => {
                    this.addRandomTile();
                    this.updateDisplay();
                    this.checkGameState();
                }, 150);
            }
            
            isTouch = false;
        });

        // Button controls
        this.newGameBtn.addEventListener('click', () => this.restart());
        this.tryAgainBtn.addEventListener('click', () => this.restart());
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        const previousGrid = this.grid.map(row => [...row]);
        const previousScore = this.score;
        let moved = false;

        if (direction === 'left') {
            for (let i = 0; i < this.size; i++) {
                const row = this.grid[i].filter(val => val !== 0);
                for (let j = 0; j < row.length - 1; j++) {
                    if (row[j] === row[j + 1]) {
                        row[j] *= 2;
                        this.score += row[j];
                        row.splice(j + 1, 1);
                    }
                }
                while (row.length < this.size) {
                    row.push(0);
                }
                this.grid[i] = row;
            }
        } else if (direction === 'right') {
            for (let i = 0; i < this.size; i++) {
                const row = this.grid[i].filter(val => val !== 0);
                for (let j = row.length - 1; j > 0; j--) {
                    if (row[j] === row[j - 1]) {
                        row[j] *= 2;
                        this.score += row[j];
                        row.splice(j - 1, 1);
                        j--;
                    }
                }
                while (row.length < this.size) {
                    row.unshift(0);
                }
                this.grid[i] = row;
            }
        } else if (direction === 'up') {
            for (let j = 0; j < this.size; j++) {
                const column = [];
                for (let i = 0; i < this.size; i++) {
                    if (this.grid[i][j] !== 0) {
                        column.push(this.grid[i][j]);
                    }
                }
                for (let i = 0; i < column.length - 1; i++) {
                    if (column[i] === column[i + 1]) {
                        column[i] *= 2;
                        this.score += column[i];
                        column.splice(i + 1, 1);
                    }
                }
                while (column.length < this.size) {
                    column.push(0);
                }
                for (let i = 0; i < this.size; i++) {
                    this.grid[i][j] = column[i];
                }
            }
        } else if (direction === 'down') {
            for (let j = 0; j < this.size; j++) {
                const column = [];
                for (let i = 0; i < this.size; i++) {
                    if (this.grid[i][j] !== 0) {
                        column.push(this.grid[i][j]);
                    }
                }
                for (let i = column.length - 1; i > 0; i--) {
                    if (column[i] === column[i - 1]) {
                        column[i] *= 2;
                        this.score += column[i];
                        column.splice(i - 1, 1);
                        i--;
                    }
                }
                while (column.length < this.size) {
                    column.unshift(0);
                }
                for (let i = 0; i < this.size; i++) {
                    this.grid[i][j] = column[i];
                }
            }
        }

        // Check if grid changed
        for (let i = 0; i < this.size && !moved; i++) {
            for (let j = 0; j < this.size && !moved; j++) {
                if (this.grid[i][j] !== previousGrid[i][j]) {
                    moved = true;
                }
            }
        }

        if (moved) {
            this.updateScore();
            this.updateDisplay();
        }

        return moved;
    }

    updateDisplay() {
        // Clear existing tiles
        const existingTiles = this.gridContainer.querySelectorAll('.tile');
        existingTiles.forEach(tile => tile.remove());

        // Add current tiles
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== 0) {
                    this.createTile(this.grid[i][j], i, j);
                }
            }
        }
    }

    createTile(value, row, col) {
        const tile = document.createElement('div');
        tile.className = `tile tile-${value}`;
        tile.textContent = value;
        
        // Calculate position
        const containerRect = this.gridContainer.getBoundingClientRect();
        const cellSize = (containerRect.width - 50) / 4;
        const position = {
            left: col * (cellSize + 10) + 10,
            top: row * (cellSize + 10) + 10
        };
        
        tile.style.left = position.left + 'px';
        tile.style.top = position.top + 'px';
        tile.style.width = cellSize + 'px';
        tile.style.height = cellSize + 'px';
        
        this.gridContainer.appendChild(tile);
        
        // Add animation class for new tiles
        if (this.moved) {
            setTimeout(() => tile.classList.add('tile-new'), 10);
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score.toLocaleString();
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.bestScoreElement.textContent = this.bestScore.toLocaleString();
            localStorage.setItem('2048-best-score', this.bestScore);
        } else {
            this.bestScoreElement.textContent = this.bestScore.toLocaleString();
        }
    }

    checkGameState() {
        // Check for 2048 tile (win condition)
        if (!this.won) {
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    if (this.grid[i][j] === 2048) {
                        this.won = true;
                        setTimeout(() => {
                            this.showMessage('🎉 You Win! 🎉', 'Congratulations! You reached 2048!\nKeep playing to get an even higher score!');
                        }, 500);
                        return;
                    }
                }
            }
        }

        // Check for game over
        if (this.isGameOver()) {
            this.over = true;
            setTimeout(() => {
                this.showMessage('😔 Game Over!', `No more moves available!\nFinal Score: ${this.score.toLocaleString()}\n${this.score === this.bestScore ? 'New Best Score! 🏆' : ''}`);
            }, 300);
        }
    }

    isGameOver() {
        // Check for empty cells
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    return false;
                }
            }
        }

        // Check for possible merges
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.grid[i][j];
                if ((i > 0 && this.grid[i-1][j] === current) ||
                    (i < this.size-1 && this.grid[i+1][j] === current) ||
                    (j > 0 && this.grid[i][j-1] === current) ||
                    (j < this.size-1 && this.grid[i][j+1] === current)) {
                    return false;
                }
            }
        }

        return true;
    }

    showMessage(title, text) {
        this.messageTitleElement.textContent = title;
        this.messageTextElement.textContent = text;
        this.messageElement.classList.add('show');
    }

    hideMessage() {
        this.messageElement.classList.remove('show');
    }

    restart() {
        console.log('Restarting game...');
        this.hideMessage();
        this.init();
    }

    // Utility method to get current game state
    getGameState() {
        return {
            grid: this.grid,
            score: this.score,
            bestScore: this.bestScore,
            won: this.won,
            over: this.over
        };
    }

    // Method to print grid to console (for debugging)
    printGrid() {
        console.log('Current Grid:');
        for (let i = 0; i < this.size; i++) {
            console.log(this.grid[i].join('\t'));
        }
        console.log(`Score: ${this.score}, Best: ${this.bestScore}`);
    }
}

// Initialize game when DOM is loaded
let game;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing 2048 game...');
    game = new Game2048();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (game) {
        setTimeout(() => {
            game.updateDisplay();
        }, 100);
    }
});

// Prevent default touch behavior on the game container
document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.grid-container')) {
        e.preventDefault();
    }
}, { passive: false });

// Export game for debugging (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game2048;
}