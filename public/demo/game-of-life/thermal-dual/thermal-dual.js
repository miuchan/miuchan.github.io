const canvas = document.getElementById('lifeCanvas');
const ctx = canvas.getContext('2d');

const generationEl = document.querySelector('[data-generation]');
const aliveEl = document.querySelector('[data-alive]');
const heatEl = document.querySelector('[data-heat]');
const coherenceEl = document.querySelector('[data-coherence]');
const yearEl = document.getElementById('year');

const toggleBtn = document.getElementById('toggle');
const stepBtn = document.getElementById('step');
const clearBtn = document.getElementById('clear');
const randomBtn = document.getElementById('random');
const pulseBtn = document.getElementById('pulse');

const speedInput = document.getElementById('speed');
const diffusionInput = document.getElementById('diffusion');
const couplingInput = document.getElementById('coupling');
const tuningInput = document.getElementById('tuning');

const speedValueEl = document.querySelector('[data-speed]');
const diffusionValueEl = document.querySelector('[data-diffusion]');
const couplingValueEl = document.querySelector('[data-coupling]');
const tuningValueEl = document.querySelector('[data-tuning]');

const COLS = 60;
const ROWS = 60;
const CELL_SIZE = 12;
const TOTAL = COLS * ROWS;

canvas.width = COLS * CELL_SIZE;
canvas.height = ROWS * CELL_SIZE;

const life = new Uint8Array(TOTAL);
const heat = new Float32Array(TOTAL);
const resonance = new Float32Array(TOTAL);

let generation = 0;
let aliveCount = 0;
let averageHeat = 0;
let averageResonance = 0;
let coherenceIndex = 0;

let interval = Number(speedInput.value);
let diffusion = Number(diffusionInput.value);
let coupling = Number(couplingInput.value);
let tuning = Number(tuningInput.value);
let timerId = null;
let running = true;
let painting = false;
let paintValue = 1;

const neighbors = [];
for (let y = 0; y < ROWS; y += 1) {
  for (let x = 0; x < COLS; x += 1) {
    const list = [];
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = (x + dx + COLS) % COLS;
        const ny = (y + dy + ROWS) % ROWS;
        list.push(ny * COLS + nx);
      }
    }
    neighbors.push(list);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function index(x, y) {
  return y * COLS + x;
}

function heatInjection(alive) {
  return alive ? 0.18 : -0.12;
}

function updateStats() {
  generationEl.textContent = generation.toString();
  aliveEl.textContent = aliveCount.toString();
  const heatMilli = (averageHeat * 400).toFixed(0);
  const heatSign = heatMilli >= 0 ? '+' : '';
  heatEl.textContent = `${heatSign}${heatMilli} mK`;
  const coherencePercent = Math.round(coherenceIndex * 100);
  coherenceEl.textContent = `${coherencePercent}%`;
}

function recalcStats() {
  let alive = 0;
  let heatSum = 0;
  let resSum = 0;
  let coherenceSum = 0;
  for (let i = 0; i < TOTAL; i += 1) {
    if (life[i]) alive += 1;
    heatSum += heat[i];
    resSum += resonance[i];
    coherenceSum += Math.min(1, Math.abs(heat[i] - resonance[i]));
  }
  aliveCount = alive;
  averageHeat = heatSum / TOTAL;
  averageResonance = resSum / TOTAL;
  coherenceIndex = clamp(1 - coherenceSum / TOTAL, 0, 1);
  updateStats();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const idx = index(x, y);
      const alive = life[idx] === 1;
      const temp = clamp((heat[idx] + 1.2) / 2.4, 0, 1);
      const res = clamp((resonance[idx] + 1.2) / 2.4, 0, 1);
      const hue = 200 - temp * 160 + res * 20;
      const saturation = alive ? 72 + res * 18 : 42 + res * 16;
      const lightness = alive ? 38 + temp * 20 + res * 10 : 16 + temp * 18 + res * 8;
      ctx.fillStyle = `hsl(${hue.toFixed(1)}, ${saturation.toFixed(1)}%, ${lightness.toFixed(1)}%)`;
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function step() {
  const nextLife = new Uint8Array(TOTAL);
  const nextHeat = new Float32Array(TOTAL);
  const nextRes = new Float32Array(TOTAL);

  let alive = 0;
  let heatSum = 0;
  let resSum = 0;
  let coherenceSum = 0;

  const biasStrength = tuning;
  const heatEffectScale = 0.8 * biasStrength;
  const resEffectScale = biasStrength;

  for (let i = 0; i < TOTAL; i += 1) {
    const aliveNow = life[i] === 1;
    const neigh = neighbors[i];
    let liveNeighbors = 0;
    let heatNeighbors = 0;
    let resNeighbors = 0;
    for (let n = 0; n < neigh.length; n += 1) {
      const ni = neigh[n];
      liveNeighbors += life[ni];
      heatNeighbors += heat[ni];
      resNeighbors += resonance[ni];
    }
    const avgHeat = heatNeighbors / neigh.length;
    const avgRes = resNeighbors / neigh.length;

    const currentHeat = heat[i];
    const currentRes = resonance[i];

    const heatGradient = avgHeat - currentHeat;
    const resGradient = avgRes - currentRes;

    let newRes = currentRes + coupling * heatGradient - currentRes * 0.08 + (aliveNow ? 0.05 : -0.035);
    newRes += coupling * 0.35 * resGradient;
    newRes = clamp(newRes, -1.2, 1.2);

    let newHeat = currentHeat + diffusion * heatGradient + heatInjection(aliveNow) + coupling * 0.25 * resGradient;
    newHeat += newRes * 0.12;
    newHeat = clamp(newHeat, -1.2, 1.2);

    const heatBias = Math.round(newHeat * heatEffectScale);
    const resBias = Math.round(newRes * resEffectScale);

    const birthMin = clamp(3 + heatBias - resBias, 1, 5);
    const birthMax = clamp(birthMin + 1, birthMin, 6);
    const surviveMin = clamp(2 - resBias, 0, 5);
    const surviveMax = clamp(3 + heatBias, surviveMin + 1, 6);

    let nextState = 0;
    if (aliveNow) {
      if (liveNeighbors >= surviveMin && liveNeighbors <= surviveMax) {
        nextState = 1;
      }
    } else if (liveNeighbors >= birthMin && liveNeighbors <= birthMax) {
      nextState = 1;
    }

    nextLife[i] = nextState;
    nextHeat[i] = newHeat;
    nextRes[i] = newRes;

    if (nextState) alive += 1;
    heatSum += newHeat;
    resSum += newRes;
    coherenceSum += Math.min(1, Math.abs(newHeat - newRes));
  }

  life.set(nextLife);
  heat.set(nextHeat);
  resonance.set(nextRes);

  generation += 1;
  aliveCount = alive;
  averageHeat = heatSum / TOTAL;
  averageResonance = resSum / TOTAL;
  coherenceIndex = clamp(1 - coherenceSum / TOTAL, 0, 1);

  updateStats();
  draw();
}

function tick() {
  step();
}

function start() {
  running = true;
  toggleBtn.textContent = '暂停演化';
  toggleBtn.setAttribute('aria-pressed', 'true');
  if (timerId) clearInterval(timerId);
  timerId = setInterval(tick, interval);
}

function stop() {
  running = false;
  toggleBtn.textContent = '继续演化';
  toggleBtn.setAttribute('aria-pressed', 'false');
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function restartLoop() {
  if (running) {
    start();
  }
}

function randomize(density = 0.32) {
  for (let i = 0; i < TOTAL; i += 1) {
    const aliveCell = Math.random() < density ? 1 : 0;
    life[i] = aliveCell;
    heat[i] = aliveCell ? 0.3 + Math.random() * 0.4 : (Math.random() - 0.5) * 0.1;
    resonance[i] = aliveCell ? (Math.random() - 0.5) * 0.3 : (Math.random() - 0.5) * 0.05;
  }
  generation = 0;
  recalcStats();
  draw();
}

function clear() {
  life.fill(0);
  heat.fill(0);
  resonance.fill(0);
  generation = 0;
  recalcStats();
  draw();
}

function pointerCell(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor(((event.clientX - rect.left) * scaleX) / CELL_SIZE);
  const y = Math.floor(((event.clientY - rect.top) * scaleY) / CELL_SIZE);
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null;
  return { x, y, idx: index(x, y) };
}

function applyPaint(idx) {
  life[idx] = paintValue;
  if (paintValue === 1) {
    heat[idx] = clamp(heat[idx] + 0.45, -1.2, 1.2);
    resonance[idx] = clamp(resonance[idx] + 0.2, -1.2, 1.2);
  } else {
    heat[idx] *= 0.4;
    resonance[idx] *= 0.4;
  }
}

canvas.addEventListener('pointerdown', (event) => {
  const cell = pointerCell(event);
  if (!cell) return;
  painting = true;
  const current = life[cell.idx];
  paintValue = current === 1 ? 0 : 1;
  applyPaint(cell.idx);
  generation = 0;
  recalcStats();
  draw();
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove', (event) => {
  if (!painting) return;
  const cell = pointerCell(event);
  if (!cell) return;
  applyPaint(cell.idx);
  generation = 0;
  recalcStats();
  draw();
});

function endPaint(event) {
  if (!painting) return;
  painting = false;
  canvas.releasePointerCapture(event.pointerId);
}

canvas.addEventListener('pointerup', endPaint);
canvas.addEventListener('pointercancel', endPaint);

speedInput.addEventListener('input', () => {
  interval = Number(speedInput.value);
  speedValueEl.textContent = `${interval} ms`;
  restartLoop();
});

diffusionInput.addEventListener('input', () => {
  diffusion = Number(diffusionInput.value);
  diffusionValueEl.textContent = diffusion.toFixed(2);
});

couplingInput.addEventListener('input', () => {
  coupling = Number(couplingInput.value);
  couplingValueEl.textContent = coupling.toFixed(2);
});

tuningInput.addEventListener('input', () => {
  tuning = Number(tuningInput.value);
  tuningValueEl.textContent = tuning.toFixed(1);
});

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    if (running) {
      stop();
    } else {
      start();
    }
  });
}

if (stepBtn) {
  stepBtn.addEventListener('click', () => {
    if (!running) {
      step();
    } else {
      stop();
      step();
    }
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    stop();
    clear();
  });
}

if (randomBtn) {
  randomBtn.addEventListener('click', () => {
    stop();
    randomize(Math.random() * 0.25 + 0.25);
  });
}

function thermalPulse() {
  const centerX = Math.floor(COLS / 2);
  const centerY = Math.floor(ROWS / 2);
  const radius = 8 + Math.random() * 12;
  const outer = radius * (1.6 + Math.random() * 0.4);
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.hypot(dx, dy);
      const idx = index(x, y);
      if (dist < radius) {
        const boost = Math.cos((dist / radius) * Math.PI) * 0.6;
        heat[idx] = clamp(heat[idx] + boost, -1.2, 1.2);
        resonance[idx] = clamp(resonance[idx] + Math.sin((dist / radius) * Math.PI) * 0.4, -1.2, 1.2);
        if (Math.random() < 0.35) life[idx] = 1;
      } else if (dist < outer) {
        const attenuation = Math.sin(((dist - radius) / (outer - radius)) * Math.PI) * 0.45;
        heat[idx] = clamp(heat[idx] - attenuation, -1.2, 1.2);
        resonance[idx] = clamp(resonance[idx] - attenuation * 0.6, -1.2, 1.2);
        if (Math.random() < 0.12) life[idx] = 0;
      }
    }
  }
  recalcStats();
  draw();
}

if (pulseBtn) {
  pulseBtn.addEventListener('click', () => {
    stop();
    thermalPulse();
  });
}

function init() {
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
  speedValueEl.textContent = `${interval} ms`;
  diffusionValueEl.textContent = diffusion.toFixed(2);
  couplingValueEl.textContent = coupling.toFixed(2);
  tuningValueEl.textContent = tuning.toFixed(1);
  randomize(0.34);
  draw();
  updateStats();
  start();
}

init();
