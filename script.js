const board = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");
const levelDisplay = document.getElementById("level");

const symbolPool = [
  "🍎","🚀","🎲","🎵","🎯","🐶","🌈","⚡","🍕","🧠","📦","🧊","🛸","🧩","🚂","🍭",
  "💎","🎁","🎮","🧁","🚁","🐸","🥇","🪐","🌟","📱","🎃","🐱","🐼","🍇","🍌","🥶"
];

let flipped = [], matched = [], moves = 0, timer = null, seconds = 0;
let level = 1, pairs = 4;

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    timeDisplay.textContent = seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function restartGame(nextLevel = false) {
  board.innerHTML = "";
  flipped = [];
  matched = [];
  moves = 0;
  seconds = 0;
  movesDisplay.textContent = 0;
  timeDisplay.textContent = 0;

  if (nextLevel) {
    level++;
    pairs += 2;
  } else {
    level = 1;
    pairs = 4;
  }

  levelDisplay.textContent = level;
  stopTimer();

  const totalCards = pairs * 2;
  const symbols = shuffle([...symbolPool]).slice(0, pairs);
  const cardSymbols = shuffle([...symbols, ...symbols]);

  const columns = Math.ceil(Math.sqrt(totalCards));
  board.style.gridTemplateColumns = `repeat(${columns}, 80px)`;

  cardSymbols.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.symbol = symbol;
    card.dataset.index = index;

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-front text-2xl";
    front.textContent = symbol;

    const back = document.createElement("div");
    back.className = "card-back";

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    board.appendChild(card);

    card.addEventListener("click", () => flipCard(card));
  });
}

function flipCard(card) {
  if (!timer) startTimer();

  const index = card.dataset.index;
  if (flipped.length >= 2 || card.classList.contains("flipped") || matched.includes(index)) return;

  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    movesDisplay.textContent = moves;

    const [card1, card2] = flipped;
    if (card1.dataset.symbol === card2.dataset.symbol) {
      matched.push(card1.dataset.index, card2.dataset.index);
      flipped = [];

      if (matched.length === pairs * 2) {
        stopTimer();
        setTimeout(() => {
          alert(`🎉 Level ${level} Complete!\nMoves: ${moves}, Time: ${seconds}s`);
          restartGame(true);
        }, 500);
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flipped = [];
      }, 1000);
    }
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

restartGame(); // Initialize
