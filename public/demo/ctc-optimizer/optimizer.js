const canvas = document.getElementById('worldline');
const ctx = canvas.getContext('2d');

const smoothSlider = document.getElementById('smoothness');
const targetSlider = document.getElementById('target-weight');
const lightconeSlider = document.getElementById('lightcone');
const curveSelect = document.getElementById('curve-type');
const smoothValue = document.getElementById('smoothness-value');
const targetValue = document.getElementById('target-weight-value');
const lightconeValue = document.getElementById('lightcone-value');
const energyLabel = document.getElementById('energy');
const velocityLabel = document.getElementById('velocity');
const iterationLabel = document.getElementById('iterations');
const optimizeButton = document.getElementById('optimize');
const resetButton = document.getElementById('reset');

const STRONG_MARGIN = 0.96;
const POSITION_CORRIDOR = 0.96;
const N = 120;
const loopsByMode = {
  closed: 3,
  open: 1
};

let curveMode = curveSelect ? curveSelect.value : 'closed';
let loops = loopsByMode[curveMode] || loopsByMode.closed;
const t = new Float64Array(N);
const targetX = new Float64Array(N);
const stateX = new Float64Array(N);
const velocity = new Float64Array(N - 1);
let dt = 0;

const particle = {
  index: 0,
  alpha: 0
};

let iterations = 0;
let animationFrame = null;

function updateTimeAxis() {
  loops = loopsByMode[curveMode] || loopsByMode.closed;
  dt = loops / (N - 1);
  for (let i = 0; i < N; i++) {
    t[i] = i * dt;
  }
}

function buildClosedTarget() {
  for (let i = 0; i < N; i++) {
    const normalized = t[i] / loops;
    const phase = normalized * Math.PI * 2 * loops;
    const envelope = 0.65 * Math.sin(Math.PI * normalized) ** 2 + 0.1;
    targetX[i] = envelope * Math.sin(phase * 0.5) + 0.1 * Math.cos(phase * 0.33);
  }
  targetX[0] = 0;
  targetX[N - 1] = 0;
}

function buildOpenTarget() {
  for (let i = 0; i < N; i++) {
    const normalized = i / (N - 1);
    const ramp = -0.42 + 0.5 * normalized;
    const wave = 0.07 * Math.sin(Math.PI * normalized);
    const ripple = 0.015 * Math.sin(3 * Math.PI * normalized) * (1 - 0.35 * normalized);
    const arch = 0.08 * normalized * (1 - normalized);
    targetX[i] = ramp + wave + ripple + arch + 0.22;
  }
  targetX[0] = -0.2;
  targetX[N - 1] = 0.3;
}

function buildTarget() {
  if (curveMode === 'open') {
    buildOpenTarget();
  } else {
    buildClosedTarget();
  }
}

function lockBoundaries() {
  stateX[0] = targetX[0];
  stateX[N - 1] = targetX[N - 1];
}

function addNoise() {
  const noiseScale = curveMode === 'open' ? 0.35 : 0.6;
  for (let i = 0; i < N; i++) {
    stateX[i] = targetX[i] + (Math.random() - 0.5) * noiseScale;
  }
  lockBoundaries();
}

function computeObjective(smoothWeight, targetWeight) {
  let smooth = 0;
  for (let i = 1; i < N - 1; i++) {
    const d = stateX[i + 1] - 2 * stateX[i] + stateX[i - 1];
    smooth += d * d;
  }

  let fidelity = 0;
  for (let i = 1; i < N - 1; i++) {
    const diff = stateX[i] - targetX[i];
    fidelity += diff * diff;
  }

  return smoothWeight * smooth + targetWeight * fidelity;
}

function computeGradient(smoothWeight, targetWeight) {
  const grad = new Float64Array(N);

  for (let i = 1; i < N - 1; i++) {
    const d = stateX[i + 1] - 2 * stateX[i] + stateX[i - 1];
    grad[i - 1] += 2 * smoothWeight * d;
    grad[i] += -4 * smoothWeight * d;
    grad[i + 1] += 2 * smoothWeight * d;
  }

  for (let i = 1; i < N - 1; i++) {
    grad[i] += 2 * targetWeight * (stateX[i] - targetX[i]);
  }

  grad[0] = 0;
  grad[N - 1] = 0;
  return grad;
}

function enforceConstraints(cMax) {
  const safeLimit = Math.max(1e-4, cMax * dt * STRONG_MARGIN);
  lockBoundaries();

  for (let i = 0; i < N - 1; i++) {
    const diff = stateX[i + 1] - stateX[i];
    const clamped = Math.max(-safeLimit, Math.min(safeLimit, diff));
    stateX[i + 1] = stateX[i] + clamped;
  }

  lockBoundaries();

  for (let i = N - 1; i > 0; i--) {
    const diff = stateX[i - 1] - stateX[i];
    const clamped = Math.max(-safeLimit, Math.min(safeLimit, diff));
    stateX[i - 1] = stateX[i] + clamped;
  }

  for (let i = 1; i < N - 1; i++) {
    stateX[i] = Math.max(-POSITION_CORRIDOR, Math.min(POSITION_CORRIDOR, stateX[i]));
  }

  lockBoundaries();
}

function updateVelocity() {
  let maxV = 0;
  for (let i = 0; i < N - 1; i++) {
    const v = (stateX[i + 1] - stateX[i]) / dt;
    velocity[i] = v;
    maxV = Math.max(maxV, Math.abs(v));
  }
  return maxV;
}

function optimizeStep() {
  const smoothWeight = parseFloat(smoothSlider.value);
  const targetWeight = parseFloat(targetSlider.value);
  const cMax = parseFloat(lightconeSlider.value);
  const grad = computeGradient(smoothWeight, targetWeight);
  const stepSize = 0.02;

  for (let i = 1; i < N - 1; i++) {
    stateX[i] -= stepSize * grad[i];
  }

  enforceConstraints(cMax);
  iterations += 1;

  render();
}

function render() {
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const margin = 60;
  const drawWidth = width - margin * 2;
  const drawHeight = height - margin * 2;

  ctx.save();
  ctx.translate(margin, margin);

  // draw light cone stripes
  const stripeCount = Math.max(1, Math.round(loops));
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  for (let i = 0; i < stripeCount; i++) {
    const yStart = (i / stripeCount) * drawHeight;
    const yEnd = ((i + 1) / stripeCount) * drawHeight;
    ctx.fillRect(0, yStart, drawWidth, yEnd - yStart);
  }

  // axes
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(drawWidth / 2, 0);
  ctx.lineTo(drawWidth / 2, drawHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, drawHeight - 1);
  ctx.lineTo(drawWidth, drawHeight - 1);
  ctx.stroke();

  // draw light cone boundaries
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(drawWidth / 2, drawHeight);
  ctx.lineTo(drawWidth, drawHeight - drawHeight / stripeCount);
  ctx.moveTo(drawWidth / 2, drawHeight);
  ctx.lineTo(0, drawHeight - drawHeight / stripeCount);
  ctx.stroke();
  ctx.setLineDash([]);

  const xScale = drawWidth / 2;
  const centerX = drawWidth / 2;

  const safeSlope = parseFloat(lightconeSlider.value) * STRONG_MARGIN;
  const maxOffset = Math.min(drawWidth / 2, safeSlope * loops * xScale);
  ctx.strokeStyle = 'rgba(63, 191, 246, 0.25)';
  ctx.setLineDash([4, 10]);
  ctx.beginPath();
  ctx.moveTo(centerX, drawHeight);
  ctx.lineTo(centerX + maxOffset, 0);
  ctx.moveTo(centerX, drawHeight);
  ctx.lineTo(centerX - maxOffset, 0);
  ctx.stroke();
  ctx.setLineDash([]);

  function toCanvas(i) {
    const y = drawHeight - (t[i] / loops) * drawHeight;
    const x = centerX + stateX[i] * xScale;
    const xtarget = centerX + targetX[i] * xScale;
    return { x, y, xtarget };
  }

  // target curve
  ctx.strokeStyle = '#f6c344';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const { xtarget, y } = toCanvas(i);
    if (i === 0) ctx.moveTo(xtarget, y);
    else ctx.lineTo(xtarget, y);
  }
  ctx.stroke();

  // current curve
  ctx.strokeStyle = '#3fbff6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const { x, y } = toCanvas(i);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  if (curveMode === 'open') {
    const start = toCanvas(0);
    const end = toCanvas(N - 1);
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(start.x, start.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(end.x, end.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // draw particle
  particle.alpha += 0.008;
  if (particle.alpha >= 1) {
    particle.alpha = 0;
    particle.index = (particle.index + 1) % (N - 1);
  }
  const { x, y } = toCanvas(particle.index);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  const smoothWeight = parseFloat(smoothSlider.value);
  const targetWeight = parseFloat(targetSlider.value);
  const energy = computeObjective(smoothWeight, targetWeight);
  const maxVelocity = updateVelocity();

  energyLabel.textContent = energy.toFixed(3);
  velocityLabel.textContent = `${maxVelocity.toFixed(3)} c`;
  iterationLabel.textContent = iterations.toString();

  smoothValue.textContent = smoothWeight.toFixed(2);
  targetValue.textContent = targetWeight.toFixed(2);
  lightconeValue.textContent = parseFloat(lightconeSlider.value).toFixed(2);
}

function animate() {
  render();
  animationFrame = requestAnimationFrame(animate);
}

function resetState(withNoise = true) {
  if (withNoise) {
    addNoise();
  } else {
    lockBoundaries();
  }
  enforceConstraints(parseFloat(lightconeSlider.value));
  iterations = 0;
  particle.index = 0;
  particle.alpha = 0;
  render();
}

optimizeButton.addEventListener('click', () => {
  cancelAnimationFrame(animationFrame);
  const steps = 80;
  let current = 0;

  function run() {
    optimizeStep();
    current += 1;
    if (current < steps) {
      requestAnimationFrame(run);
    } else {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  run();
});

resetButton.addEventListener('click', () => {
  cancelAnimationFrame(animationFrame);
  resetState(true);
  animationFrame = requestAnimationFrame(animate);
});

if (curveSelect) {
  curveSelect.addEventListener('change', () => {
    curveMode = curveSelect.value;
    cancelAnimationFrame(animationFrame);
    updateTimeAxis();
    buildTarget();
    resetState(true);
    animationFrame = requestAnimationFrame(animate);
  });
}

[smoothSlider, targetSlider, lightconeSlider].forEach((slider) => {
  slider.addEventListener('input', () => {
    if (slider === lightconeSlider) {
      enforceConstraints(parseFloat(lightconeSlider.value));
    }
    render();
  });
});

updateTimeAxis();
buildTarget();
resetState(true);
animationFrame = requestAnimationFrame(animate);
