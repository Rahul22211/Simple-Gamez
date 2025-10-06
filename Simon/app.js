document.addEventListener("DOMContentLoaded", () => {
  const red = document.getElementById("red");
  const blue = document.getElementById("blue");
  const pink = document.getElementById("pink");
  const brown = document.getElementById("brown");
  const startBtn = document.getElementById("start");
  const score = document.getElementById("score");
  let sequence = [];
  let playerSequence = [];
  let level = 0;
  let isPlaying = false;
  const flickClass = (element) => {
    element.classList.add("flick");
    setTimeout(() => {
      element.classList.remove("flick");
    }, 1000);
  };
  const colors = [red, blue, pink, brown];
  let idx = Math.floor(Math.random() * colors.length);
  const playSequence = () => {
    let i = 0;
    const interval = setInterval(() => {
      flickClass(colors[sequence[i]]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        isPlaying = true;
      }
    }, 750);
  };

  const nextLevel = () => {
    level++;
    score.textContent = `Score: ${level}`;
    playerSequence = [];
    sequence.push(Math.floor(Math.random() * 4));
    setTimeout(() => {
      playSequence();
    }, 1000);
  };
  const gameOver = () => {
    level = 0;
    score.textContent = "Score: 0";
    sequence = [];
    playerSequence = [];
    isPlaying = false;
  };

  colors.forEach((color, index) => {
    color.addEventListener("click", () => {
      if (!isPlaying) return;

      flickClass(color);
      playerSequence.push(index);

      const currentStep = playerSequence.length - 1;
      if (playerSequence[currentStep] !== sequence[currentStep]) {
        gameOver();
        return;
      }
      if(playerSequence.length===sequence.length){
        isPlaying=false
        setTimeout(nextLevel,1000)
      }
    });
  });
  startBtn.addEventListener("click", () => {
    sequence = [];
    playerSequence = [];
    level = 0;
    isPlaying = true;
    nextLevel();
  });
});
