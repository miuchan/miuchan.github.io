const canvas = document.getElementById('life-sphere');
const ctx = canvas?.getContext('2d');

if (!canvas || !ctx) {
  throw new Error('Canvas not available for sphere life.');
}

const LAT_DIVS = 24;
const LON_DIVS = 48;
const CELL_COUNT = LAT_DIVS * LON_DIVS;
const NEIGHBOR_ANGLE = 0.24;
const STEP_INTERVAL = 460;

const cells = new Uint8Array(CELL_COUNT);
const buffer = new Uint8Array(CELL_COUNT);
const neighbourList = Array.from({ length: CELL_COUNT }, () => []);

const generationLabel = document.querySelector('[data-generation]');
const populationLabel = document.querySelector('[data-population]');
const resetButton = document.querySelector('[data-reset]');

const points = [];

for (let lat = 0; lat < LAT_DIVS; lat += 1) {
  const phi = Math.PI * ((lat + 0.5) / LAT_DIVS);
  const latRatio = lat / (LAT_DIVS - 1);
  for (let lon = 0; lon < LON_DIVS; lon += 1) {
    const theta = 2 * Math.PI * (lon / LON_DIVS);
    points.push({
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.cos(phi),
      z: Math.sin(phi) * Math.sin(theta),
      latRatio,
    });
  }
}

for (let i = 0; i < CELL_COUNT; i += 1) {
  const p1 = points[i];
  for (let j = i + 1; j < CELL_COUNT; j += 1) {
    const p2 = points[j];
    const dot = Math.max(-1, Math.min(1, p1.x * p2.x + p1.y * p2.y + p1.z * p2.z));
    const angle = Math.acos(dot);
    if (angle <= NEIGHBOR_ANGLE) {
      neighbourList[i].push(j);
      neighbourList[j].push(i);
    }
  }
}

let generation = 0;
let population = 0;
let rotationY = 0;
let rotationX = 0.35;
let dragging = false;
let pointerX = 0;
let pointerY = 0;
let radius = 0;
let centerX = 0;
let centerY = 0;
let zoom = 1;

function updateLabels() {
  if (generationLabel) generationLabel.textContent = String(generation);
  if (populationLabel) populationLabel.textContent = String(population);
}

function randomizeCells() {
  population = 0;
  for (let i = 0; i < CELL_COUNT; i += 1) {
    const alive = Math.random() < 0.28 ? 1 : 0;
    cells[i] = alive;
    population += alive;
  }
  generation = 0;
  updateLabels();
}

function stepLife() {
  let aliveCount = 0;
  for (let i = 0; i < CELL_COUNT; i += 1) {
    const neighbours = neighbourList[i];
    let sum = 0;
    for (let k = 0; k < neighbours.length; k += 1) {
      sum += cells[neighbours[k]];
    }

    const alive = cells[i] === 1;
    const next = alive ? (sum === 2 || sum === 3 ? 1 : 0) : (sum === 3 ? 1 : 0);
    buffer[i] = next;
    aliveCount += next;
  }

  cells.set(buffer);
  if (aliveCount === 0) {
    randomizeCells();
    return;
  }

  population = aliveCount;
  generation += 1;
  updateLabels();
}

function hsl(latRatio, alive, alpha) {
  if (!alive) return `rgba(11, 17, 32, ${alpha})`;
  const hue = Math.round((0.58 - latRatio * 0.3) * 360);
  const lightness = Math.round((0.52 + (0.18 * (1 - Math.abs(0.5 - latRatio) * 2))) * 100);
  return `hsla(${hue} 78% ${lightness}% / ${alpha})`;
}

function resizeRenderer() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  centerX = w / 2;
  centerY = h / 2;
  radius = Math.min(w, h) * 0.38 * zoom;
}

function rotatePoint({ x, y, z }) {
  const cosY = Math.cos(rotationY);
  const sinY = Math.sin(rotationY);
  const x1 = x * cosY + z * sinY;
  const z1 = z * cosY - x * sinY;

  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);
  const y2 = y * cosX - z1 * sinX;
  const z2 = z1 * cosX + y * sinX;

  return { x: x1, y: y2, z: z2 };
}

function drawSphere() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.26,
    centerY - radius * 0.26,
    radius * 0.2,
    centerX,
    centerY,
    radius,
  );
  gradient.addColorStop(0, 'rgba(29, 78, 216, 0.4)');
  gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.55)');
  gradient.addColorStop(1, 'rgba(2, 6, 23, 0.75)');

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  const rendered = points.map((point, index) => {
    const rotated = rotatePoint(point);
    const depth = (rotated.z + 1) * 0.5;
    const scale = 0.4 + depth * 0.9;
    return {
      index,
      x: centerX + rotated.x * radius,
      y: centerY + rotated.y * radius,
      z: rotated.z,
      size: Math.max(1.2, radius * 0.035 * scale),
      alpha: 0.2 + depth * 0.9,
    };
  });

  rendered.sort((a, b) => a.z - b.z);

  for (let i = 0; i < rendered.length; i += 1) {
    const cell = rendered[i];
    const alive = cells[cell.index] === 1;
    const latRatio = points[cell.index].latRatio;
    ctx.beginPath();
    ctx.arc(cell.x, cell.y, cell.size, 0, Math.PI * 2);
    ctx.fillStyle = hsl(latRatio, alive, cell.alpha);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.28)';
  ctx.lineWidth = Math.max(1, radius * 0.008);
  ctx.stroke();
}

let lastStep = 0;

function animate(timestamp) {
  requestAnimationFrame(animate);

  if (!dragging) {
    rotationY += 0.003;
  }

  if (timestamp - lastStep > STEP_INTERVAL) {
    stepLife();
    lastStep = timestamp;
  }

  drawSphere();
}

canvas.addEventListener('pointerdown', (event) => {
  dragging = true;
  pointerX = event.clientX;
  pointerY = event.clientY;
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  const dx = event.clientX - pointerX;
  const dy = event.clientY - pointerY;
  pointerX = event.clientX;
  pointerY = event.clientY;

  rotationY += dx * 0.006;
  rotationX = Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, rotationX + dy * 0.006));
});

canvas.addEventListener('pointerup', (event) => {
  dragging = false;
  canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener('pointercancel', (event) => {
  dragging = false;
  canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  const direction = Math.sign(event.deltaY);
  zoom = Math.max(0.72, Math.min(1.35, zoom - direction * 0.06));
  resizeRenderer();
}, { passive: false });

resetButton?.addEventListener('click', randomizeCells);
window.addEventListener('resize', resizeRenderer);

resizeRenderer();
randomizeCells();
requestAnimationFrame(animate);
