document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guess');
    const submitBtn = document.getElementById('submit');
    const restartBtn = document.getElementById('restart');
    const message = document.getElementById('message');
    const attemptsEl = document.getElementById('attempts');
    
    let randomNumber;
    let attempts;
    
    function startNewGame() {
        randomNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        message.textContent = '';
        message.className = '';
        attemptsEl.textContent = 'Attempts: 0';
        guessInput.value = '';
        guessInput.focus();
    }
    
    function makeGuess() {
        const guess = parseInt(guessInput.value);
        
        if (!guess || guess < 1 || guess > 100) {
            message.textContent = 'Please enter a valid number between 1 and 100!';
            message.className = '';
            return;
        }
        
        attempts++;
        attemptsEl.textContent = `Attempts: ${attempts}`;
        
        if (guess === randomNumber) {
            message.textContent = `🎉 Correct! You won in ${attempts} attempts!`;
            message.className = 'correct';
        } else if (guess < randomNumber) {
            message.textContent = '📈 Too low! Try higher.';
            message.className = 'too-low';
        } else {
            message.textContent = '📉 Too high! Try lower.';
            message.className = 'too-high';
        }
        
        guessInput.value = '';
        guessInput.focus();
    }
    
    submitBtn.addEventListener('click', makeGuess);
    restartBtn.addEventListener('click', startNewGame);
    
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            makeGuess();
        }
    });
    
        
    startNewGame();
});