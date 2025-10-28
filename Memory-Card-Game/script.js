/* Food-theme: 10 unique emojis -> 20 cards */
(() => {
  const EMOJIS = ["🍔","🍕","🍩","🍪","🍰","🍟","🥪","🍫","🥨","🍦"]; // 10

  const board = document.getElementById('gameBoard');
  const movesCountEl = document.getElementById('movesCount');
  const restartBtn = document.getElementById('restartBtn');
  const progressBar = document.getElementById('progressBar');
  const winModal = document.getElementById('winModal');
  const finalMovesEl = document.getElementById('finalMoves');
  const playAgainBtn = document.getElementById('playAgainBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const loseModal = document.getElementById('loseModal');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  const movesLeftEl = document.getElementById('movesLeft');
  const confettiCanvas = document.getElementById('confettiCanvas');

  let firstCard = null, secondCard = null, lockBoard = false;
  let moves = 0, matches = 0;
  const totalPairs = EMOJIS.length;

  // Moves limit
  const MOVES_LIMIT = totalPairs * 6; // 10 * 6 = 60 moves
  let movesLeft = MOVES_LIMIT;

  function shuffle(arr){
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function createCard(emoji, idx){
    const card = document.createElement('button');
    card.className = 'memory-card';
    card.type = 'button';
    card.setAttribute('data-emoji', emoji);
    card.setAttribute('data-index', idx);
    card.setAttribute('aria-label', 'Memory card');

    card.innerHTML = `
      <div class="front-face" aria-hidden="true">${emoji}</div>
      <div class="back-face" aria-hidden="true"><span class="pattern">🍽️</span></div>
    `;

    card.addEventListener('click', () => handleFlip(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFlip(card);
      }
    });

    return card;
  }

  function renderBoard(){
    board.innerHTML = '';
    moves = 0;
    matches = 0;
    movesLeft = MOVES_LIMIT;
    movesCountEl.textContent = moves;
    movesLeftEl.textContent = movesLeft;
    progressBar.style.width = '0%';
    closeModal(winModal);
    closeModal(loseModal);

    const deck = shuffle([...EMOJIS, ...EMOJIS]);
    deck.forEach((emj, i) => board.appendChild(createCard(emj, i)));
  }

  function handleFlip(card){
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains('match')) return;
    if (movesLeft <= 0) return;

    card.classList.add('flip');

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;

    // Count move
    moves++;
    movesLeft--;
    movesCountEl.textContent = moves;
    movesLeftEl.textContent = movesLeft;

    checkMatch();

    if (movesLeft <= 0 && matches !== totalPairs) {
      setTimeout(showLose, 900);
    }
  }

  function checkMatch(){
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (isMatch) {
      firstCard.classList.add('match');
      secondCard.classList.add('match');
      firstCard.disabled = true;
      secondCard.disabled = true;
      matches++;
      updateProgress();
      flashText('+1 Match', firstCard);
      resetTurn();
      lockBoard = false;
      if (matches === totalPairs) setTimeout(showWin, 650);
    } else {
      firstCard.classList.add('wrong');
      secondCard.classList.add('wrong');
      setTimeout(() => {
        firstCard.classList.remove('flip','wrong');
        secondCard.classList.remove('flip','wrong');
        resetTurn();
        lockBoard = false;
      }, 700);
    }
  }

  function resetTurn(){
    [firstCard, secondCard] = [null, null];
  }

  function updateProgress(){
    const percent = Math.round((matches / totalPairs) * 100);
    progressBar.style.width = percent + '%';
  }

  function showWin(){
    finalMovesEl.textContent = moves;
    openModal(winModal);
    startConfetti();
  }

  function showLose(){
    openModal(loseModal);
  }

  function openModal(modal){
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'flex';
  }

  function closeModal(modal){
    modal.setAttribute('aria-hidden','true');
    modal.style.display = 'none';
    stopConfetti();
  }

  restartBtn.addEventListener('click', renderBoard);
  playAgainBtn.addEventListener('click', renderBoard);
  closeModalBtn.addEventListener('click', () => closeModal(winModal));
  tryAgainBtn.addEventListener('click', renderBoard);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(winModal);
      closeModal(loseModal);
    }
  });

  function flashText(text, anchorCard){
    const f = document.createElement('div');
    f.className = 'float-feedback';
    f.textContent = text;
    document.body.appendChild(f);

    const r = anchorCard.getBoundingClientRect();
    f.style.left = (r.left + r.width / 2) + 'px';
    f.style.top = (r.top - 12) + 'px';

    f.animate([
      { transform:'translateY(0) scale(1)', opacity:1 },
      { transform:'translateY(-28px) scale(.95)', opacity:0 }
    ], { duration:700, easing:'ease-out' });

    setTimeout(() => f.remove(), 700);
  }

  // CONFETTI
  let confettiCtx, confettiParticles = [], confettiRAF = null;

  function setupConfettiCanvas(){
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCtx = confettiCanvas.getContext('2d');
  }

  function startConfetti(){
    setupConfettiCanvas();
    confettiParticles = [];

    const count = 90;
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: Math.random()*confettiCanvas.width,
        y: -Math.random()*confettiCanvas.height,
        size: 6+Math.random()*8,
        wobble: Math.random()*0.6,
        tilt: Math.random()*360,
        color: `hsl(${Math.floor(Math.random()*360)} 80% 60%)`,
        speed: 2+Math.random()*4,
        gravity: 0.05+Math.random()*0.12
      });
    }

    confettiCanvas.style.display = 'block';
    runConfetti();
  }

  function runConfetti(){
    confettiRAF = requestAnimationFrame(runConfetti);
    confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);

    for (let p of confettiParticles){
      p.y += p.speed;
      p.x += Math.sin(p.y * 0.02) * 1.5;
      p.tilt += p.wobble * 2;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.tilt * Math.PI / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
      confettiCtx.restore();
    }

    confettiParticles = confettiParticles.filter(p => p.y < confettiCanvas.height + 50);
    if (confettiParticles.length === 0) stopConfetti();
  }

  function stopConfetti(){
    if (confettiRAF) cancelAnimationFrame(confettiRAF);
    confettiRAF = null;
    confettiCtx && confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    confettiCanvas.style.display = 'none';
  }

  window.addEventListener('resize', () => {
    if (confettiCanvas) setupConfettiCanvas();
  });

  renderBoard();
})();

