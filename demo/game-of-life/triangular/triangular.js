const canvas = document.getElementById('lifeCanvas');
const ctx = canvas.getContext('2d');
const toggleBtn = document.getElementById('toggle');
const stepBtn = document.getElementById('step');
const clearBtn = document.getElementById('clear');
const randomBtn = document.getElementById('random');
const speedInput = document.getElementById('speed');
const birthInput = document.getElementById('birth');
const surviveMinInput = document.getElementById('surviveMin');
const surviveMaxInput = document.getElementById('surviveMax');
const speedValueEl = document.querySelector('[data-speed]');
const birthValueEl = document.querySelector('[data-birth]');
const surviveMinValueEl = document.querySelector('[data-survive-min]');
const surviveMaxValueEl = document.querySelector('[data-survive-max]');
const generationEl = document.querySelector('[data-generation]');
const aliveEl = document.querySelector('[data-alive]');
const ruleEl = document.querySelector('[data-rule]');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const CELL_SIZE = 24;
const TRIANGLE_HEIGHT = (CELL_SIZE * Math.sqrt(3)) / 2;
const squares = Math.floor(canvas.width / CELL_SIZE);
const cols = squares * 2;
const rows = Math.floor(canvas.height / TRIANGLE_HEIGHT);
const actualWidth = squares * CELL_SIZE;
const actualHeight = rows * TRIANGLE_HEIGHT;
const offsetX = (canvas.width - actualWidth) / 2;
const offsetY = (canvas.height - actualHeight) / 2;

const geometry = Array.from({ length: rows }, () => Array(cols));
for (let row = 0; row < rows; row += 1) {
  for (let col = 0; col < cols; col += 1) {
    const baseX = offsetX + Math.floor(col / 2) * CELL_SIZE;
    const baseY = offsetY + row * TRIANGLE_HEIGHT;
    const isUp = (row % 2) === (col % 2);
    const vertices = isUp
      ? [
          { x: baseX, y: baseY + TRIANGLE_HEIGHT },
          { x: baseX + CELL_SIZE, y: baseY + TRIANGLE_HEIGHT },
          { x: baseX + CELL_SIZE / 2, y: baseY },
        ]
      : [
          { x: baseX, y: baseY },
          { x: baseX + CELL_SIZE, y: baseY },
          { x: baseX + CELL_SIZE / 2, y: baseY + TRIANGLE_HEIGHT },
        ];
    const centroid = {
      x: (vertices[0].x + vertices[1].x + vertices[2].x) / 3,
      y: (vertices[0].y + vertices[1].y + vertices[2].y) / 3,
    };
    geometry[row][col] = { vertices, centroid, isUp };
  }
}

const neighborRadius = CELL_SIZE * 1.28;
const neighborMap = Array.from({ length: rows }, () => Array(cols));
for (let row = 0; row < rows; row += 1) {
  for (let col = 0; col < cols; col += 1) {
    const center = geometry[row][col].centroid;
    const neighbors = [];
    for (let dr = -2; dr <= 2; dr += 1) {
      for (let dc = -3; dc <= 3; dc += 1) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const candidate = geometry[nr][nc].centroid;
        const dist = Math.hypot(candidate.x - center.x, candidate.y - center.y);
        if (dist <= neighborRadius) {
          neighbors.push([nr, nc]);
        }
      }
    }
    neighborMap[row][col] = neighbors;
  }
}

let state = Array.from({ length: rows }, () => Array(cols).fill(0));
let buffer = Array.from({ length: rows }, () => Array(cols).fill(0));
let generation = 0;
let aliveCount = 0;
let running = true;
let interval = Number(speedInput.value);
let accumulator = 0;
let lastTime = null;
let needsRedraw = true;

function formatRule(birth, surviveMin, surviveMax) {
  return surviveMin === surviveMax
    ? `B${birth}/S${surviveMin}`
    : `B${birth}/S${surviveMin}-${surviveMax}`;
}

function updateStats() {
  generationEl.textContent = generation.toString();
  aliveEl.textContent = aliveCount.toString();
  ruleEl.textContent = formatRule(birthValue(), surviveMinValue(), surviveMaxValue());
}

function updateSliderLabels() {
  speedValueEl.textContent = `${interval} ms`;
  birthValueEl.textContent = birthValue().toString();
  surviveMinValueEl.textContent = surviveMinValue().toString();
  surviveMaxValueEl.textContent = surviveMaxValue().toString();
}

function birthValue() {
  return Number(birthInput.value);
}

function surviveMinValue() {
  return Number(surviveMinInput.value);
}

function surviveMaxValue() {
  return Number(surviveMaxInput.value);
}

function drawTriangle(vertices, alive) {
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  ctx.lineTo(vertices[1].x, vertices[1].y);
  ctx.lineTo(vertices[2].x, vertices[2].y);
  ctx.closePath();
  if (alive) {
    const gradient = ctx.createLinearGradient(vertices[0].x, vertices[0].y, vertices[1].x, vertices[2].y);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.95)');
    gradient.addColorStop(1, 'rgba(34, 211, 238, 0.7)');
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
  }
  ctx.fill();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
  ctx.lineWidth = 0.6;
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      drawTriangle(geometry[row][col].vertices, state[row][col] === 1);
    }
  }
}

function stepAutomaton() {
  let nextAlive = 0;
  const birth = birthValue();
  const sMin = surviveMinValue();
  const sMax = surviveMaxValue();

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const alive = state[row][col] === 1;
      const neighbors = neighborMap[row][col];
      let count = 0;
      for (let i = 0; i < neighbors.length; i += 1) {
        const [nr, nc] = neighbors[i];
        if (state[nr][nc] === 1) count += 1;
      }
      let next = 0;
      if (alive) {
        next = count >= sMin && count <= sMax ? 1 : 0;
      } else if (count === birth) {
        next = 1;
      }
      buffer[row][col] = next;
      if (next === 1) nextAlive += 1;
    }
  }

  [state, buffer] = [buffer, state];
  generation += 1;
  aliveCount = nextAlive;
  needsRedraw = true;
}

function recountAlive() {
  aliveCount = state.reduce(
    (sum, row) => sum + row.reduce((rowSum, cell) => rowSum + cell, 0),
    0,
  );
}

function clearBoard() {
  for (let row = 0; row < rows; row += 1) {
    state[row].fill(0);
    buffer[row].fill(0);
  }
  generation = 0;
  aliveCount = 0;
  needsRedraw = true;
  updateStats();
}

function randomizeBoard(density = 0.32) {
  let total = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const value = Math.random() < density ? 1 : 0;
      state[row][col] = value;
      buffer[row][col] = 0;
      if (value === 1) total += 1;
    }
  }
  generation = 0;
  aliveCount = total;
  needsRedraw = true;
  updateStats();
}

function toggleRunning(nextState) {
  running = typeof nextState === 'boolean' ? nextState : !running;
  toggleBtn.textContent = running ? '暂停演化' : '继续演化';
}

function handleSpeedChange() {
  interval = Number(speedInput.value);
  updateSliderLabels();
}

function ensureSurvivalOrder(changedInput) {
  const min = surviveMinValue();
  const max = surviveMaxValue();
  if (min > max) {
    if (changedInput === surviveMinInput) {
      surviveMaxInput.value = min;
    } else {
      surviveMinInput.value = max;
    }
  }
  updateSliderLabels();
  updateStats();
}

function locateCell(evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (evt.clientX - rect.left) * scaleX;
  const y = (evt.clientY - rect.top) * scaleY;
  const localX = x - offsetX;
  const localY = y - offsetY;
  if (localX < 0 || localY < 0 || localX > actualWidth || localY > actualHeight) return null;

  const row = Math.floor(localY / TRIANGLE_HEIGHT);
  const squareCol = Math.floor(localX / CELL_SIZE);
  if (row < 0 || row >= rows || squareCol < 0 || squareCol >= squares) return null;

  const candidates = [squareCol * 2, squareCol * 2 + 1];
  for (let i = 0; i < candidates.length; i += 1) {
    const col = candidates[i];
    if (col >= cols) continue;
    const verts = geometry[row][col].vertices;
    if (pointInTriangle(x, y, verts)) {
      return [row, col];
    }
  }
  return null;
}

function pointInTriangle(px, py, vertices) {
  const [v1, v2, v3] = vertices;
  const d1 = sign(px, py, v1.x, v1.y, v2.x, v2.y);
  const d2 = sign(px, py, v2.x, v2.y, v3.x, v3.y);
  const d3 = sign(px, py, v3.x, v3.y, v1.x, v1.y);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

function sign(px, py, x1, y1, x2, y2) {
  return (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
}

let painting = false;
let paintValue = 1;
const paintedCells = new Set();

function applyPaint(row, col) {
  const key = `${row}:${col}`;
  if (paintedCells.has(key)) return;
  paintedCells.add(key);
  if (state[row][col] === paintValue) return;
  state[row][col] = paintValue;
  aliveCount += paintValue === 1 ? 1 : -1;
  needsRedraw = true;
  updateStats();
}

canvas.addEventListener('pointerdown', (evt) => {
  const cell = locateCell(evt);
  if (!cell) return;
  canvas.setPointerCapture(evt.pointerId);
  painting = true;
  paintedCells.clear();
  const [row, col] = cell;
  paintValue = state[row][col] === 1 ? 0 : 1;
  applyPaint(row, col);
});

canvas.addEventListener('pointermove', (evt) => {
  if (!painting) return;
  const cell = locateCell(evt);
  if (!cell) return;
  const [row, col] = cell;
  applyPaint(row, col);
});

function stopPainting(evt) {
  if (!painting) return;
  painting = false;
  paintedCells.clear();
  if (canvas.hasPointerCapture(evt.pointerId)) {
    canvas.releasePointerCapture(evt.pointerId);
  }
}

canvas.addEventListener('pointerup', stopPainting);
canvas.addEventListener('pointercancel', stopPainting);
canvas.addEventListener('pointerleave', (evt) => {
  if (painting && canvas.hasPointerCapture(evt.pointerId)) {
    canvas.releasePointerCapture(evt.pointerId);
  }
  painting = false;
  paintedCells.clear();
});

canvas.addEventListener('contextmenu', (evt) => evt.preventDefault());

toggleBtn.addEventListener('click', () => {
  toggleRunning();
});

stepBtn.addEventListener('click', () => {
  if (running) toggleRunning(false);
  accumulator = 0;
  stepAutomaton();
  updateStats();
});

clearBtn.addEventListener('click', () => {
  if (running) toggleRunning(false);
  clearBoard();
  updateStats();
});

randomBtn.addEventListener('click', () => {
  randomizeBoard();
  needsRedraw = true;
});

speedInput.addEventListener('input', handleSpeedChange);
birthInput.addEventListener('input', () => {
  updateSliderLabels();
  updateStats();
});
surviveMinInput.addEventListener('input', () => ensureSurvivalOrder(surviveMinInput));
surviveMaxInput.addEventListener('input', () => ensureSurvivalOrder(surviveMaxInput));

function loop(timestamp) {
  if (lastTime === null) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  if (running) {
    accumulator += delta;
    if (accumulator >= interval) {
      const steps = Math.floor(accumulator / interval);
      for (let i = 0; i < steps; i += 1) {
        stepAutomaton();
      }
      accumulator -= steps * interval;
      updateStats();
    }
  }

  if (needsRedraw) {
    draw();
    needsRedraw = false;
  }

  requestAnimationFrame(loop);
}

updateSliderLabels();
updateStats();
randomizeBoard(0.25);
requestAnimationFrame(loop);
