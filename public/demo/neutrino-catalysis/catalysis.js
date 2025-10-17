const canvas = document.getElementById('state-plot');
const ctx = canvas.getContext('2d');

const fluxSlider = document.getElementById('flux');
const couplingSlider = document.getElementById('coupling');
const initialSlider = document.getElementById('initial-giant');

const fluxDisplay = document.getElementById('flux-display');
const couplingDisplay = document.getElementById('coupling-display');
const initialDisplay = document.getElementById('initial-giant-display');

const giantCount = document.getElementById('giant-count');
const microCount = document.getElementById('micro-count');
const fluxValue = document.getElementById('flux-value');
const reactionRateLabel = document.getElementById('reaction-rate');
const energyLabel = document.getElementById('energy-output');

const toggleButton = document.getElementById('toggle');
const resetButton = document.getElementById('reset');

const history = [];
const HISTORY_LENGTH = 360;
const BASE_TOTAL = 1.0;

const state = {
  giant: parseFloat(initialSlider.value),
  micro: BASE_TOTAL - parseFloat(initialSlider.value),
  neutrino: parseFloat(fluxSlider.value)
};

let running = true;
let lastTime = performance.now();
let currentRate = 0;
let energyOutput = 0;

function adjustForHiDPI() {
  const ratio = window.devicePixelRatio || 1;
  const { width, height } = canvas.getBoundingClientRect();
  if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
    canvas.width = width * ratio;
    canvas.height = height * ratio;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normaliseTotal() {
  const total = state.giant + state.micro;
  if (total <= 0) {
    state.giant = BASE_TOTAL * parseFloat(initialSlider.value);
    state.micro = BASE_TOTAL - state.giant;
    return;
  }
  const factor = BASE_TOTAL / total;
  state.giant *= factor;
  state.micro *= factor;
}

function updateRangeDisplays() {
  fluxDisplay.textContent = parseFloat(fluxSlider.value).toFixed(2);
  couplingDisplay.textContent = parseFloat(couplingSlider.value).toFixed(2);
  initialDisplay.textContent = parseFloat(initialSlider.value).toFixed(2);
}

function pushHistory() {
  history.push({
    giant: state.giant,
    micro: state.micro,
    neutrino: state.neutrino
  });
  if (history.length > HISTORY_LENGTH) {
    history.shift();
  }
}

function resetHistory() {
  history.length = 0;
  for (let i = 0; i < HISTORY_LENGTH / 4; i++) {
    pushHistory();
  }
}

function resetState() {
  state.giant = parseFloat(initialSlider.value);
  state.micro = BASE_TOTAL - state.giant;
  state.neutrino = parseFloat(fluxSlider.value);
  currentRate = 0;
  energyOutput = 0;
  resetHistory();
}

function integrate(dt) {
  const flux = parseFloat(fluxSlider.value);
  const coupling = parseFloat(couplingSlider.value);

  state.neutrino += (flux - state.neutrino) * dt * 2.4;

  const reaction = coupling * state.giant * state.neutrino;
  const recombination = 0.35 * state.micro * (1 - 0.3 * state.neutrino);
  const excitation = 0.12 * state.neutrino * (BASE_TOTAL - state.micro);
  const structuralDecay = 0.08 * state.giant * state.neutrino;

  state.giant += dt * (-reaction + recombination - structuralDecay * 0.6);
  state.micro += dt * (reaction - recombination + excitation - 0.05 * state.micro);

  state.giant = clamp(state.giant, 0, BASE_TOTAL * 1.2);
  state.micro = clamp(state.micro, 0, BASE_TOTAL * 1.2);
  normaliseTotal();

  currentRate = Math.max(0, reaction - recombination * 0.5);
  energyOutput = currentRate * currentRate;

  pushHistory();
}

function render() {
  const width = canvas.width;
  const height = canvas.height;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  const rect = canvas.getBoundingClientRect();
  const ratio = width / rect.width;
  ctx.save();
  ctx.scale(ratio, ratio);

  const drawWidth = rect.width;
  const drawHeight = rect.height;
  const margin = 36;
  const plotWidth = drawWidth - margin * 2;
  const plotHeight = drawHeight - margin * 2;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
  ctx.fillRect(0, 0, drawWidth, drawHeight);

  ctx.translate(margin, margin);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.lineWidth = 1;
  const horizontalLines = 4;
  for (let i = 0; i <= horizontalLines; i++) {
    const y = (i / horizontalLines) * plotHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(plotWidth, y);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
  const verticalLines = 6;
  for (let i = 0; i <= verticalLines; i++) {
    const x = (i / verticalLines) * plotWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, plotHeight);
    ctx.stroke();
  }

  if (history.length > 1) {
    const step = plotWidth / (history.length - 1);
    const maxValue = BASE_TOTAL * 1.1;

    function drawLine(color, accessor) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      history.forEach((point, index) => {
        const value = accessor(point);
        const x = index * step;
        const y = plotHeight - (value / maxValue) * plotHeight;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    drawLine('#38bdf8', (p) => p.giant);
    drawLine('#facc15', (p) => p.micro);
    drawLine('#a855f7', (p) => p.neutrino);
  }

  ctx.restore();

  giantCount.textContent = state.giant.toFixed(2);
  microCount.textContent = state.micro.toFixed(2);
  fluxValue.textContent = state.neutrino.toFixed(2);
  reactionRateLabel.textContent = currentRate.toFixed(3);
  energyLabel.textContent = energyOutput.toFixed(3);
}

function tick(now) {
  const delta = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  if (running) {
    let remaining = delta;
    const step = 0.01;
    while (remaining > 0) {
      integrate(Math.min(step, remaining));
      remaining -= step;
    }
  }

  render();
  requestAnimationFrame(tick);
}

function handleInitialChange() {
  const ratio = parseFloat(initialSlider.value);
  const total = state.giant + state.micro;
  state.giant = total * ratio;
  state.micro = total - state.giant;
  normaliseTotal();
  updateRangeDisplays();
}

fluxSlider.addEventListener('input', updateRangeDisplays);
couplingSlider.addEventListener('input', updateRangeDisplays);
initialSlider.addEventListener('input', handleInitialChange);
initialSlider.addEventListener('change', () => {
  updateRangeDisplays();
});

toggleButton.addEventListener('click', () => {
  running = !running;
  toggleButton.textContent = running ? '暂停演化' : '恢复演化';
});

resetButton.addEventListener('click', () => {
  resetState();
});

window.addEventListener('resize', () => {
  adjustForHiDPI();
});

updateRangeDisplays();
adjustForHiDPI();
resetState();
render();
requestAnimationFrame(tick);

document.getElementById('year').textContent = new Date().getFullYear();
