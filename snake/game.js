const GRID_SIZE = 24;
const CELL = 24;
const TICK_MS = 120;

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const stateEl = document.getElementById("state");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const directionMap = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

const opposite = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const vectors = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

let timer = null;
let snake = [];
let direction = "right";
let nextDirection = "right";
let food = { x: 10, y: 10 };
let score = 0;
let best = Number(localStorage.getItem("snake-best") || 0);
let state = "ready";

bestEl.textContent = String(best);

function setState(label) {
  stateEl.textContent = label;
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((part) => part.x === food.x && part.y === food.y));
}

function resetGame() {
  snake = [
    { x: 8, y: 12 },
    { x: 7, y: 12 },
    { x: 6, y: 12 },
  ];
  direction = "right";
  nextDirection = "right";
  score = 0;
  scoreEl.textContent = "0";
  placeFood();
  state = "ready";
  setState("待开始");
  draw();
}

function stopLoop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startLoop() {
  if (timer) return;
  timer = setInterval(step, TICK_MS);
}

function startGame() {
  if (state === "over") {
    resetGame();
  }
  state = "running";
  setState("进行中");
  startLoop();
}

function pauseGame() {
  if (state !== "running") return;
  state = "paused";
  setState("已暂停");
  stopLoop();
}

function gameOver() {
  state = "over";
  setState("游戏结束");
  stopLoop();
}

function setDirection(dir) {
  if (state === "ready") {
    startGame();
  }
  if (state !== "running") return;
  if (opposite[direction] === dir) return;
  nextDirection = dir;
}

function step() {
  direction = nextDirection;
  const move = vectors[direction];
  const head = snake[0];
  const nextHead = { x: head.x + move.x, y: head.y + move.y };

  if (
    nextHead.x < 0 ||
    nextHead.x >= GRID_SIZE ||
    nextHead.y < 0 ||
    nextHead.y >= GRID_SIZE ||
    snake.some((part) => part.x === nextHead.x && part.y === nextHead.y)
  ) {
    gameOver();
    draw();
    return;
  }

  snake.unshift(nextHead);

  if (nextHead.x === food.x && nextHead.y === food.y) {
    score += 1;
    scoreEl.textContent = String(score);
    if (score > best) {
      best = score;
      localStorage.setItem("snake-best", String(best));
      bestEl.textContent = String(best);
    }
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function drawGrid() {
  ctx.fillStyle = "#0b1220";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#1f2937";
  ctx.lineWidth = 1;

  for (let i = 1; i < GRID_SIZE; i += 1) {
    const p = i * CELL;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(canvas.width, p);
    ctx.stroke();
  }
}

function drawFood() {
  ctx.fillStyle = "#f97316";
  ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
}

function drawSnake() {
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#16a34a" : "#22c55e";
    ctx.fillRect(part.x * CELL + 2, part.y * CELL + 2, CELL - 4, CELL - 4);
  });
}

function drawOverlay(text) {
  if (!text) return;
  ctx.fillStyle = "rgba(2, 6, 23, 0.72)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function draw() {
  drawGrid();
  drawFood();
  drawSnake();

  if (state === "ready") drawOverlay("按开始键");
  if (state === "paused") drawOverlay("已暂停");
  if (state === "over") drawOverlay("游戏结束");
}

window.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const dir = directionMap[key];
  if (!dir) return;
  event.preventDefault();
  setDirection(dir);
});

document.querySelectorAll("[data-dir]").forEach((button) => {
  button.addEventListener("click", () => {
    setDirection(button.dataset.dir);
  });
});

startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
restartBtn.addEventListener("click", () => {
  resetGame();
  startGame();
});

resetGame();
