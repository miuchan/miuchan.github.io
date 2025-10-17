const canvas = document.getElementById('lifeCanvas');
const ctx = canvas.getContext('2d');
const CELL_SIZE = 12;
const COLS = Math.floor(canvas.width / CELL_SIZE);
const ROWS = Math.floor(canvas.height / CELL_SIZE);

const STATE = {
  VOID: 0,
  LIFE: 1,
  SINGULARITY: 2,
};

const tempoInput = document.getElementById('tempo');
const tempoValue = document.getElementById('tempoValue');
const gravityInput = document.getElementById('gravity');
const gravityValue = document.getElementById('gravityValue');
const reachInput = document.getElementById('reach');
const reachValue = document.getElementById('reachValue');

const toggleBtn = document.getElementById('toggle');
const stepBtn = document.getElementById('step');
const randomBtn = document.getElementById('random');
const clearBtn = document.getElementById('clear');
const seedBtn = document.getElementById('seedSingularity');

const populationNode = document.getElementById('population');
const singularityNode = document.getElementById('singularityCount');
const entropyNode = document.getElementById('entropy');
const narrativeNode = document.getElementById('narrative');

let grid = createGrid(STATE.VOID);
let running = true;
let lastStepTime = performance.now();
let tempo = Number(tempoInput.value);
let stepInterval = 1000 / tempo;

tempoValue.textContent = `${tempo} 代/秒`;
gravityValue.textContent = Number(gravityInput.value).toFixed(2);
reachValue.textContent = `${reachInput.value} 格`;

let painting = false;
let paintMode = null;
let paintTarget = null;
let needsRecount = false;

function createGrid(defaultValue) {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(defaultValue));
}

function seedInitialField() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      grid[y][x] = STATE.VOID;
    }
  }

  const anchors = [
    { x: Math.floor(COLS * 0.35), y: Math.floor(ROWS * 0.45) },
    { x: Math.floor(COLS * 0.65), y: Math.floor(ROWS * 0.55) },
  ];

  anchors.forEach(({ x, y }) => {
    grid[(y + ROWS) % ROWS][(x + COLS) % COLS] = STATE.SINGULARITY;
  });

  const density = 0.18;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] === STATE.SINGULARITY) continue;
      grid[y][x] = Math.random() < density ? STATE.LIFE : STATE.VOID;
    }
  }
}

function clearGrid() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      grid[y][x] = STATE.VOID;
    }
  }
}

function randomize(density = 0.28) {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] === STATE.SINGULARITY) continue;
      grid[y][x] = Math.random() < density ? STATE.LIFE : STATE.VOID;
    }
  }
}

function getNeighbors(x, y) {
  let alive = 0;
  let singular = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = (x + dx + COLS) % COLS;
      const ny = (y + dy + ROWS) % ROWS;
      const state = grid[ny][nx];
      if (state === STATE.LIFE) alive++;
      else if (state === STATE.SINGULARITY) singular++;
    }
  }

  return { alive, singular };
}

function step() {
  const next = createGrid(STATE.VOID);
  const gravity = Number(gravityInput.value);

  let births = 0;
  let deaths = 0;
  let survivors = 0;
  let flux = 0;
  let singularities = 0;
  const hotspotCandidates = [];

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const state = grid[y][x];

      if (state === STATE.SINGULARITY) {
        next[y][x] = STATE.SINGULARITY;
        singularities++;
        continue;
      }

      const { alive, singular } = getNeighbors(x, y);
      const weightedBirth = alive + singular * gravity * 1.6;
      const weightedSurvive = alive + singular * gravity * 1.2;

      if (state === STATE.LIFE) {
        const overcrowded = alive >= 5 && singular === 0;
        const survive = (alive === 2 || alive === 3) ||
          (weightedSurvive >= 1.6 && alive <= 4) ||
          (singular >= 2 && gravity > 0.12);

        if (survive && !overcrowded) {
          next[y][x] = STATE.LIFE;
          survivors++;
          flux += weightedSurvive;
        } else {
          next[y][x] = STATE.VOID;
          deaths++;
          if (singular > 0) {
            hotspotCandidates.push({ x, y, score: weightedSurvive + singular * 2 });
          }
        }
      } else {
        const born = alive === 3 ||
          (weightedBirth >= 2.6 && alive >= 1) ||
          (singular >= 1 && alive === 2);

        if (born) {
          next[y][x] = STATE.LIFE;
          births++;
          flux += weightedBirth;
        } else {
          next[y][x] = STATE.VOID;
          if (singular >= 2 && alive >= 2) {
            hotspotCandidates.push({ x, y, score: weightedBirth + singular * 2.4 });
          }
        }
      }
    }
  }

  if (gravity > 0.62 && hotspotCandidates.length) {
    hotspotCandidates.sort((a, b) => b.score - a.score);
    const { x, y } = hotspotCandidates[0];
    next[y][x] = STATE.SINGULARITY;
    singularities++;
  }

  grid = next;

  const population = survivors + births;
  const area = COLS * ROWS;
  const density = population / area;
  const entropy = area === 0 ? 0 : ((births + deaths) / area) * 100;
  const delta = births - deaths;

  updateStats({
    population,
    density,
    singularities,
    entropy,
    flux,
    manual: false,
    delta,
  });
}

function computeInfluence() {
  const reach = Number(reachInput.value);
  const influence = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
  if (reach <= 0) return influence;

  const singularities = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] === STATE.SINGULARITY) {
        singularities.push({ x, y });
      }
    }
  }

  if (!singularities.length) return influence;

  const reachSq = reach * reach;
  singularities.forEach(({ x: sx, y: sy }) => {
    for (let dy = -reach; dy <= reach; dy++) {
      const maxDx = Math.floor(Math.sqrt(Math.max(0, reachSq - dy * dy)));
      for (let dx = -maxDx; dx <= maxDx; dx++) {
        const nx = (sx + dx + COLS) % COLS;
        const ny = (sy + dy + ROWS) % ROWS;
        const distSq = dx * dx + dy * dy;
        const potential = 1 - distSq / (reachSq || 1);
        if (potential > influence[ny][nx]) {
          influence[ny][nx] = potential;
        }
      }
    }
  });

  return influence;
}

function draw() {
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const influence = computeInfluence();

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const state = grid[y][x];
      const energy = influence[y][x];
      const px = x * CELL_SIZE;
      const py = y * CELL_SIZE;

      if (state === STATE.VOID) {
        const alpha = 0.4 + energy * 0.35;
        ctx.fillStyle = `rgba(8, 16, 32, ${alpha.toFixed(3)})`;
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
      } else if (state === STATE.LIFE) {
        const hue = 185 - energy * 60;
        const lightness = 62 + energy * 22;
        ctx.fillStyle = `hsl(${hue}, 85%, ${lightness}%)`;
        ctx.fillRect(px + 0.5, py + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
        if (energy > 0.5) {
          ctx.fillStyle = `hsla(${hue + 40}, 90%, ${Math.min(90, lightness + 12)}%, ${0.35 + energy * 0.25})`;
          ctx.fillRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        }
      } else if (state === STATE.SINGULARITY) {
        const gradient = ctx.createRadialGradient(
          px + CELL_SIZE / 2,
          py + CELL_SIZE / 2,
          0,
          px + CELL_SIZE / 2,
          py + CELL_SIZE / 2,
          CELL_SIZE * 1.2,
        );
        gradient.addColorStop(0, 'rgba(244, 114, 182, 0.95)');
        gradient.addColorStop(0.45, 'rgba(192, 38, 211, 0.6)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.1)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, CELL_SIZE * 0.65, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= COLS; x++) {
    const pos = x * CELL_SIZE + 0.5;
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, canvas.height);
  }
  for (let y = 0; y <= ROWS; y++) {
    const pos = y * CELL_SIZE + 0.5;
    ctx.moveTo(0, pos);
    ctx.lineTo(canvas.width, pos);
  }
  ctx.stroke();
}

function updateStats({ population, density, singularities, entropy, flux, manual, delta }) {
  const densityPercent = (density * 100).toFixed(1);
  populationNode.textContent = `${densityPercent}%`;
  singularityNode.textContent = String(singularities);
  entropyNode.textContent = manual ? '—' : `${entropy.toFixed(1)}%`;

  updateNarrative(density, singularities, flux, manual ? null : delta);
}

function updateNarrative(density, singularities, flux, delta) {
  let message;
  if (singularities === 0 && density === 0) {
    message = '等待引力井缓缓成形…';
  } else if (singularities === 0) {
    message = density < 0.12
      ? '生命在平直的空间里游走，尚未遇见奇点的牵引。'
      : '密集的生命正在寻找锚点，一旦出现奇点便会倾泻而去。';
  } else {
    const fluxPerSingularity = singularities ? flux / singularities : 0;
    if (density < 0.06) {
      message = '奇点静静脉动，稀薄的生命在引力阴影中闪烁。';
    } else if (density > 0.34) {
      message = '引力井几乎饱和，光环像等离子体一样翻滚。';
    } else if (fluxPerSingularity > 6) {
      message = '多重奇点之间形成能量通道，生命沿着光丝被牵引。';
    } else {
      message = '细胞沿着势能谷排布，奇点之间出现了缓慢的潮汐。';
    }
  }

  if (typeof delta === 'number') {
    if (delta > 30) {
      message = '新生潮涌，奇点正大量吸纳周围的生命。';
    } else if (delta < -30) {
      message = '引力风暴收缩，大片生命坠入了奇点。';
    }
  }

  narrativeNode.textContent = message;
}

function recount() {
  let population = 0;
  let singularities = 0;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const state = grid[y][x];
      if (state === STATE.LIFE) population++;
      else if (state === STATE.SINGULARITY) singularities++;
    }
  }
  const area = COLS * ROWS;
  const density = population / area;
  updateStats({
    population,
    density,
    singularities,
    entropy: 0,
    flux: 0,
    manual: true,
    delta: null,
  });
}

function injectSingularity() {
  for (let attempt = 0; attempt < 40; attempt++) {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    if (grid[y][x] !== STATE.SINGULARITY) {
      grid[y][x] = STATE.SINGULARITY;
      return true;
    }
  }
  return false;
}

function toggleRunning() {
  running = !running;
  toggleBtn.textContent = running ? '暂停演化' : '继续演化';
}

function getCellFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor(((event.clientX - rect.left) * scaleX) / CELL_SIZE);
  const y = Math.floor(((event.clientY - rect.top) * scaleY) / CELL_SIZE);
  if (Number.isNaN(x) || Number.isNaN(y) || x < 0 || x >= COLS || y < 0 || y >= ROWS) {
    return null;
  }
  return { x, y };
}

function setCell(x, y, value) {
  if (grid[y][x] === value) return false;
  grid[y][x] = value;
  needsRecount = true;
  return true;
}

function determineMode(event) {
  if (event.altKey) return 'erase';
  if (event.shiftKey) return 'singularity';
  return 'life';
}

canvas.addEventListener('pointerdown', (event) => {
  const cell = getCellFromEvent(event);
  if (!cell) return;

  paintMode = determineMode(event);
  painting = true;

  if (paintMode === 'life') {
    if (grid[cell.y][cell.x] === STATE.SINGULARITY) {
      painting = false;
      paintMode = null;
      return;
    }
    paintTarget = grid[cell.y][cell.x] === STATE.LIFE ? STATE.VOID : STATE.LIFE;
    if (setCell(cell.x, cell.y, paintTarget)) draw();
  } else if (paintMode === 'singularity') {
    paintTarget = STATE.SINGULARITY;
    if (setCell(cell.x, cell.y, STATE.SINGULARITY)) draw();
  } else {
    paintTarget = STATE.VOID;
    if (setCell(cell.x, cell.y, STATE.VOID)) draw();
  }

  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove', (event) => {
  if (!painting || paintMode === null) return;
  const cell = getCellFromEvent(event);
  if (!cell) return;

  if (paintMode === 'life') {
    if (grid[cell.y][cell.x] === STATE.SINGULARITY) return;
    if (setCell(cell.x, cell.y, paintTarget)) draw();
  } else if (paintMode === 'singularity') {
    if (setCell(cell.x, cell.y, STATE.SINGULARITY)) draw();
  } else if (paintMode === 'erase') {
    if (setCell(cell.x, cell.y, STATE.VOID)) draw();
  }
});

function endPainting(event) {
  if (painting) {
    painting = false;
    paintMode = null;
    paintTarget = null;
    if (event && event.pointerId) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch (err) {
        // ignore if pointer capture was not set
      }
    }
    if (needsRecount) {
      recount();
      needsRecount = false;
    }
  }
}

canvas.addEventListener('pointerup', endPainting);
canvas.addEventListener('pointerleave', endPainting);
canvas.addEventListener('pointercancel', endPainting);

toggleBtn.addEventListener('click', () => {
  toggleRunning();
});

stepBtn.addEventListener('click', () => {
  if (!running) {
    step();
    draw();
  } else {
    step();
  }
});

randomBtn.addEventListener('click', () => {
  randomize(0.24);
  recount();
  draw();
});

clearBtn.addEventListener('click', () => {
  clearGrid();
  recount();
  draw();
});

seedBtn.addEventListener('click', () => {
  if (injectSingularity()) {
    recount();
    draw();
  }
});

tempoInput.addEventListener('input', () => {
  tempo = Number(tempoInput.value);
  stepInterval = 1000 / Math.max(1, tempo);
  tempoValue.textContent = `${tempo} 代/秒`;
});

gravityInput.addEventListener('input', () => {
  const value = Number(gravityInput.value);
  gravityValue.textContent = value.toFixed(2);
});

reachInput.addEventListener('input', () => {
  const value = Number(reachInput.value);
  reachValue.textContent = `${value} 格`;
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    toggleRunning();
  }
});

function loop(timestamp) {
  const delta = timestamp - lastStepTime;
  if (running && delta >= stepInterval) {
    step();
    lastStepTime = timestamp;
  }
  draw();
  requestAnimationFrame(loop);
}

document.getElementById('year').textContent = new Date().getFullYear();
seedInitialField();
recount();
draw();
requestAnimationFrame(loop);
