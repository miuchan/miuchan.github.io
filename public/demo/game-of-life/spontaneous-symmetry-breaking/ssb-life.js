const canvas = document.getElementById('lifeCanvas');
const ctx = canvas.getContext('2d');
const chartCanvas = document.getElementById('orderChart');
const chartCtx = chartCanvas.getContext('2d');
const generationEl = document.querySelector('[data-generation]');
const aliveEl = document.querySelector('[data-alive]');
const orderEl = document.querySelector('[data-order]');
const ratioEl = document.querySelector('[data-ratio]');
const speedSlider = document.getElementById('speed');
const speedLabel = document.querySelector('[data-speed]');
const couplingSlider = document.getElementById('coupling');
const couplingLabel = document.querySelector('[data-coupling]');
const noiseSlider = document.getElementById('noise');
const noiseLabel = document.querySelector('[data-noise]');
const biasSlider = document.getElementById('bias');
const biasLabel = document.querySelector('[data-bias]');
const toggleBtn = document.getElementById('toggle');
const stepBtn = document.getElementById('step');
const clearBtn = document.getElementById('clear');
const randomBtn = document.getElementById('random');
const symmetricBtn = document.getElementById('symmetricSeed');
const brushPositiveBtn = document.getElementById('brushPositive');
const brushNegativeBtn = document.getElementById('brushNegative');
const yearEl = document.getElementById('year');

const cellSize = 12;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);

let grid = createGrid();
let buffer = createGrid();
let running = false;
let generation = 0;
let brushSpin = 1;
let animationFrame = null;
let orderHistory = [];
const historyLength = 200;
let lastTimestamp = 0;
let speedMs = Number(speedSlider.value);

function createGrid() {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ alive: false, spin: 1 }))
  );
}

function getCoupling() {
  return Number(couplingSlider.value) / 100;
}

function getNoise() {
  return Number(noiseSlider.value) / 100;
}

function getBias() {
  return Number(biasSlider.value) / 100;
}

function updateParameterLabels() {
  speedLabel.textContent = `${speedMs} ms`;
  couplingLabel.textContent = getCoupling().toFixed(2);
  noiseLabel.textContent = getNoise().toFixed(2);
  biasLabel.textContent = getBias().toFixed(2);
}

function computeStats() {
  let alive = 0;
  let red = 0;
  let blue = 0;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const cell = grid[y][x];
      if (cell.alive) {
        alive += 1;
        if (cell.spin > 0) {
          red += 1;
        } else {
          blue += 1;
        }
      }
    }
  }
  const spinSum = red - blue;
  const orderParameter = alive === 0 ? 0 : spinSum / alive;
  return { alive, red, blue, orderParameter };
}

function updateStatsDisplay(stats) {
  generationEl.textContent = generation.toString();
  aliveEl.textContent = stats.alive.toString();
  orderEl.textContent = stats.orderParameter.toFixed(2);
  ratioEl.textContent = `${stats.red} / ${stats.blue}`;
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(8, 11, 18, 0.94)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const cell = grid[y][x];
      if (!cell.alive) continue;
      ctx.fillStyle = cell.spin > 0 ? 'rgba(255, 107, 107, 0.82)' : 'rgba(77, 139, 247, 0.85)';
      ctx.fillRect(
        x * cellSize + 1,
        y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    }
  }
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= cols; x += 1) {
    const px = x * cellSize + 0.5;
    ctx.moveTo(px, 0);
    ctx.lineTo(px, rows * cellSize);
  }
  for (let y = 0; y <= rows; y += 1) {
    const py = y * cellSize + 0.5;
    ctx.moveTo(0, py);
    ctx.lineTo(cols * cellSize, py);
  }
  ctx.stroke();
}

function drawChart() {
  chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  chartCtx.fillStyle = 'rgba(8, 11, 18, 0.92)';
  chartCtx.fillRect(0, 0, chartCanvas.width, chartCanvas.height);

  chartCtx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  chartCtx.lineWidth = 1;
  chartCtx.beginPath();
  chartCtx.moveTo(0, chartCanvas.height / 2);
  chartCtx.lineTo(chartCanvas.width, chartCanvas.height / 2);
  chartCtx.stroke();

  if (orderHistory.length < 2) return;

  const stepX = chartCanvas.width / (historyLength - 1);
  chartCtx.lineWidth = 2;
  chartCtx.strokeStyle = 'rgba(255, 224, 102, 0.9)';
  chartCtx.beginPath();
  orderHistory.forEach((value, index) => {
    const x = index * stepX;
    const y = (1 - (value + 1) / 2) * chartCanvas.height;
    if (index === 0) {
      chartCtx.moveTo(x, y);
    } else {
      chartCtx.lineTo(x, y);
    }
  });
  chartCtx.stroke();
}

function render({ recordHistory } = { recordHistory: false }) {
  if (orderHistory.length === 0) {
    initialiseHistory();
  }
  const stats = computeStats();
  if (recordHistory || orderHistory.length === 0) {
    orderHistory.push(stats.orderParameter);
    if (orderHistory.length > historyLength) {
      orderHistory.shift();
    }
  } else {
    orderHistory[orderHistory.length - 1] = stats.orderParameter;
  }
  drawGrid();
  drawChart();
  updateStatsDisplay(stats);
}

function countNeighbors(x, y) {
  let aliveCount = 0;
  let spinSum = 0;
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const nx = (x + dx + cols) % cols;
      const ny = (y + dy + rows) % rows;
      const cell = grid[ny][nx];
      if (cell.alive) {
        aliveCount += 1;
        spinSum += cell.spin;
      }
    }
  }
  return { aliveCount, spinSum };
}

function stepSimulation() {
  const coupling = getCoupling();
  const noise = getNoise();
  const bias = getBias();

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const cell = grid[y][x];
      const { aliveCount, spinSum } = countNeighbors(x, y);
      const next = buffer[y][x];
      next.alive = cell.alive;
      next.spin = cell.spin;

      if (cell.alive) {
        if (aliveCount < 2 || aliveCount > 3) {
          next.alive = false;
        } else {
          next.alive = true;
          const alignment = aliveCount === 0 ? 0 : spinSum / aliveCount;
          const persistence = (1 - coupling) * cell.spin;
          const field = persistence + coupling * alignment + bias + (Math.random() * 2 - 1) * noise;
          next.spin = field >= 0 ? 1 : -1;
        }
      } else if (aliveCount === 3) {
        next.alive = true;
        const alignment = spinSum / aliveCount;
        const field = coupling * alignment + bias + (Math.random() * 2 - 1) * noise;
        next.spin = field >= 0 ? 1 : -1;
      } else {
        next.alive = false;
      }
    }
  }

  const temp = grid;
  grid = buffer;
  buffer = temp;
  generation += 1;
  render({ recordHistory: true });
}

function loop(timestamp) {
  if (!running) return;
  if (timestamp - lastTimestamp >= speedMs) {
    stepSimulation();
    lastTimestamp = timestamp;
  }
  animationFrame = requestAnimationFrame(loop);
}

function start() {
  if (running) return;
  running = true;
  toggleBtn.textContent = '暂停演化';
  lastTimestamp = performance.now();
  animationFrame = requestAnimationFrame(loop);
}

function stop() {
  running = false;
  toggleBtn.textContent = '开始演化';
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}

function toggleRunning() {
  if (running) {
    stop();
  } else {
    start();
  }
}

function clearGrid() {
  stop();
  grid = createGrid();
  buffer = createGrid();
  generation = 0;
  initialiseHistory();
  render({ recordHistory: false });
}

function sprinkleNoise() {
  const intensity = 0.04;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (Math.random() < intensity) {
        const cell = grid[y][x];
        cell.alive = true;
        cell.spin = Math.random() < 0.5 ? 1 : -1;
      }
    }
  }
  render({ recordHistory: false });
}

function seedSymmetricPattern() {
  stop();
  grid = createGrid();
  buffer = createGrid();
  generation = 0;
  const leftBound = 4;
  const rightBound = cols - 5;
  const top = Math.floor(rows * 0.2);
  const bottom = Math.floor(rows * 0.8);
  for (let y = top; y < bottom; y += 1) {
    for (let x = leftBound; x < cols / 2; x += 1) {
      if (Math.random() < 0.22) {
        const spin = Math.random() < 0.5 ? 1 : -1;
        const mirrorX = cols - 1 - x;
        grid[y][x].alive = true;
        grid[y][x].spin = spin;
        grid[y][mirrorX].alive = true;
        grid[y][mirrorX].spin = -spin;
      }
    }
  }

  const centerX = Math.floor(cols / 2);
  for (let y = top; y < bottom; y += 3) {
    const cell = grid[y][centerX];
    cell.alive = true;
    cell.spin = y % 6 === 0 ? 1 : -1;
  }
  initialiseHistory();
  render({ recordHistory: false });
}

function getCellFromPointer(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(((event.clientX - rect.left) / rect.width) * cols);
  const y = Math.floor(((event.clientY - rect.top) / rect.height) * rows);
  return { x: Math.min(Math.max(x, 0), cols - 1), y: Math.min(Math.max(y, 0), rows - 1) };
}

let drawing = false;
let erasing = false;

canvas.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  const { x, y } = getCellFromPointer(event);
  const cell = grid[y][x];
  drawing = true;
  erasing = cell.alive && cell.spin === brushSpin;
  if (erasing) {
    cell.alive = false;
  } else {
    cell.alive = true;
    cell.spin = brushSpin;
  }
  render({ recordHistory: false });
});

canvas.addEventListener('pointermove', (event) => {
  if (!drawing) return;
  const { x, y } = getCellFromPointer(event);
  const cell = grid[y][x];
  if (erasing) {
    cell.alive = false;
  } else {
    cell.alive = true;
    cell.spin = brushSpin;
  }
  render({ recordHistory: false });
});

function endDrawing() {
  drawing = false;
  erasing = false;
}

canvas.addEventListener('pointerup', endDrawing);
canvas.addEventListener('pointerleave', endDrawing);
canvas.addEventListener('pointercancel', endDrawing);
canvas.addEventListener('contextmenu', (event) => event.preventDefault());

toggleBtn.addEventListener('click', () => {
  toggleRunning();
});

stepBtn.addEventListener('click', () => {
  stop();
  stepSimulation();
});

clearBtn.addEventListener('click', () => {
  clearGrid();
});

randomBtn.addEventListener('click', () => {
  sprinkleNoise();
});

symmetricBtn.addEventListener('click', () => {
  seedSymmetricPattern();
});

speedSlider.addEventListener('input', () => {
  speedMs = Number(speedSlider.value);
  updateParameterLabels();
});

couplingSlider.addEventListener('input', () => {
  updateParameterLabels();
});

noiseSlider.addEventListener('input', () => {
  updateParameterLabels();
});

biasSlider.addEventListener('input', () => {
  updateParameterLabels();
});

brushPositiveBtn.addEventListener('click', () => {
  brushSpin = 1;
  brushPositiveBtn.classList.add('active');
  brushNegativeBtn.classList.remove('active');
});

brushNegativeBtn.addEventListener('click', () => {
  brushSpin = -1;
  brushNegativeBtn.classList.add('active');
  brushPositiveBtn.classList.remove('active');
});

function initialiseHistory() {
  orderHistory = Array.from({ length: historyLength }, () => 0);
}

yearEl.textContent = new Date().getFullYear().toString();
initialiseHistory();
updateParameterLabels();
render({ recordHistory: false });
