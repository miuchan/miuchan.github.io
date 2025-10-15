const canvas = document.getElementById('worldline');
const ctx = canvas.getContext('2d');

const smoothSlider = document.getElementById('smoothness');
const targetSlider = document.getElementById('target-weight');
const lightconeSlider = document.getElementById('lightcone');
const smoothValue = document.getElementById('smoothness-value');
const targetValue = document.getElementById('target-weight-value');
const lightconeValue = document.getElementById('lightcone-value');
const energyLabel = document.getElementById('energy');
const velocityLabel = document.getElementById('velocity');
const iterationLabel = document.getElementById('iterations');
const optimizeButton = document.getElementById('optimize');
const resetButton = document.getElementById('reset');

const N = 120;
const loops = 3; // how many periods until we meet the starting event again
const t = new Float64Array(N);
const targetX = new Float64Array(N);
const stateX = new Float64Array(N);
const velocity = new Float64Array(N - 1);
const dt = loops / (N - 1);

const particle = {
  index: 0,
  alpha: 0
};

for (let i = 0; i < N; i++) {
  t[i] = i * dt;
}

function buildTarget() {
  for (let i = 0; i < N; i++) {
    const phase = (t[i] / loops) * Math.PI * 2 * loops;
    const envelope = 0.65 * Math.sin(Math.PI * t[i] / loops) ** 2 + 0.1;
    targetX[i] = envelope * Math.sin(phase * 0.5) + 0.1 * Math.cos(phase * 0.33);
  }
  targetX[0] = 0;
  targetX[N - 1] = 0;
}

function addNoise() {
  for (let i = 0; i < N; i++) {
    stateX[i] = targetX[i] + (Math.random() - 0.5) * 0.6;
  }
  stateX[0] = 0;
  stateX[N - 1] = 0;
}

buildTarget();
addNoise();

let iterations = 0;
let animationFrame = null;

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
  // forward pass
  for (let i = 0; i < N - 1; i++) {
    const limit = cMax * dt;
    const diff = stateX[i + 1] - stateX[i];
    const clamped = Math.max(-limit, Math.min(limit, diff));
    stateX[i + 1] = stateX[i] + clamped;
  }
  // backward pass to prevent drift
  for (let i = N - 1; i > 0; i--) {
    const limit = cMax * dt;
    const diff = stateX[i] - stateX[i - 1];
    const clamped = Math.max(-limit, Math.min(limit, diff));
    stateX[i - 1] = stateX[i] - clamped;
  }

  stateX[0] = 0;
  stateX[N - 1] = 0;
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
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  for (let i = 0; i < loops; i++) {
    const yStart = (i / loops) * drawHeight;
    const yEnd = ((i + 1) / loops) * drawHeight;
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

  // draw light cone boundaries from origin repeated
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(drawWidth / 2, drawHeight);
  ctx.lineTo(drawWidth, drawHeight - drawHeight / loops);
  ctx.moveTo(drawWidth / 2, drawHeight);
  ctx.lineTo(0, drawHeight - drawHeight / loops);
  ctx.stroke();
  ctx.setLineDash([]);

  const xScale = drawWidth / 2;
  const centerX = drawWidth / 2;

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
  addNoise();
  iterations = 0;
  particle.index = 0;
  particle.alpha = 0;
  render();
  animationFrame = requestAnimationFrame(animate);
});

[smoothSlider, targetSlider, lightconeSlider].forEach((slider) => {
  slider.addEventListener('input', () => {
    render();
  });
});

render();
animationFrame = requestAnimationFrame(animate);
