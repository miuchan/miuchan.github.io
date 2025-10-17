const canvas = document.getElementById('chamberCanvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;

const ranges = {
  iteration: document.getElementById('iteration'),
  feedback: document.getElementById('feedback'),
  alignment: document.getElementById('alignment'),
  buffer: document.getElementById('buffer'),
  tempo: document.getElementById('tempo'),
};

const rangeDisplays = {
  iteration: document.getElementById('iterationDisplay'),
  feedback: document.getElementById('feedbackDisplay'),
  alignment: document.getElementById('alignmentDisplay'),
  buffer: document.getElementById('bufferDisplay'),
  tempo: document.getElementById('tempoDisplay'),
};

const statElements = {
  agi: document.getElementById('agiValue'),
  asi: document.getElementById('asiValue'),
  stability: document.getElementById('stabilityValue'),
  energy: document.getElementById('energyValue'),
  narrative: document.getElementById('narrative'),
};

const toggleButton = document.getElementById('toggle');
const resetButton = document.getElementById('reset');
const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const baseState = {
  agi: 0.46,
  asi: 0.18,
  oversight: 0.52,
  energy: 0,
  stability: 0.64,
};

let state = { ...baseState };
let running = true;
let particles = [];
let lastTime = performance.now();

function createParticles() {
  particles = Array.from({ length: 120 }, (_, index) => {
    const angle = (index / 120) * Math.PI * 2;
    return {
      angle,
      radius: 110 + Math.random() * 90,
      speed: 0.15 + Math.random() * 0.35,
      offset: Math.random() * Math.PI * 2,
      hue: 200 + Math.random() * 60,
      jitter: Math.random() * 0.6,
    };
  });
}

function resizeCanvas() {
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

function updateRangeDisplay(id) {
  if (id === 'tempo') {
    rangeDisplays[id].textContent = `${parseFloat(ranges[id].value).toFixed(2)}x`;
  } else {
    rangeDisplays[id].textContent = parseFloat(ranges[id].value).toFixed(2);
  }
}

Object.keys(ranges).forEach((key) => {
  updateRangeDisplay(key);
  ranges[key].addEventListener('input', () => updateRangeDisplay(key));
});

toggleButton.addEventListener('click', () => {
  running = !running;
  toggleButton.textContent = running ? '暂停演化' : '继续演化';
  if (running) {
    lastTime = performance.now();
  }
});

resetButton.addEventListener('click', () => {
  state = { ...baseState };
  statElements.narrative.textContent = '反应室归零，重新点火启动…';
});

function updateState(dt) {
  const iteration = parseFloat(ranges.iteration.value);
  const feedback = parseFloat(ranges.feedback.value);
  const alignment = parseFloat(ranges.alignment.value);
  const buffer = parseFloat(ranges.buffer.value);

  const agiTarget = 0.68 + feedback * 0.08;
  const agiDrive = iteration * (agiTarget - state.agi);
  const crossCoupling = (state.asi - state.agi) * feedback * 0.35;
  const oversightBrake = alignment * (state.agi - buffer * 0.8);

  state.agi += (agiDrive + crossCoupling - oversightBrake) * dt;
  state.agi = clamp(state.agi, 0, 1.25);

  const threshold = 0.38 + (1 - buffer) * 0.18;
  const catalytic = Math.max(0, state.agi - threshold) * feedback * 0.85;
  const selfAmplify = state.asi * feedback * 0.32;
  const oversightDamp = (alignment + buffer * 0.3) * state.asi * 0.72;

  state.asi += (catalytic + selfAmplify - oversightDamp) * dt;
  state.asi = clamp(state.asi, 0, 1.6);

  const oversightTarget = buffer * 0.75 + alignment * 0.55 + 0.26;
  const oversightShift = (oversightTarget - state.oversight) * (0.7 + alignment * 0.6);
  const turbulence = state.asi * (0.25 - buffer * 0.18);

  state.oversight += (oversightShift - turbulence) * dt;
  state.oversight = clamp(state.oversight, 0, 1.35);

  const innovationPulse = state.agi * (0.5 + feedback * 0.4) + state.asi * (0.8 + feedback * 0.6);
  const damping = state.oversight * (0.6 + alignment * 0.5) + buffer * 0.3;

  state.energy = clamp(innovationPulse - damping, 0, 2.8);
  state.stability = clamp(1 - (0.55 * state.asi + Math.abs(state.agi - state.oversight) * 0.75) + buffer * 0.42 + alignment * 0.18, 0, 1);
}

function updateStats() {
  statElements.agi.textContent = state.agi.toFixed(2);
  statElements.asi.textContent = state.asi.toFixed(2);
  statElements.stability.textContent = state.stability.toFixed(2);
  statElements.energy.textContent = state.energy.toFixed(2);

  let narrative = '';
  if (state.stability < 0.25) {
    narrative = '对齐稳定性跌入低谷，反应室出现湍流，建议提升安全缓冲或降低反馈。';
  } else if (state.asi > 1.1) {
    narrative = 'ASI 临界度已穿越 1.0，高阶态正迅速扩散，需要强化对齐张力与安全护栏。';
  } else if (state.energy > 1.8) {
    narrative = '反应能量充沛，创新势与风险并存，注意监测监督域的跟进速度。';
  } else if (state.agi > 0.75 && state.stability > 0.6) {
    narrative = 'AGI 潜势稳定且对齐状态良好，可以尝试逐步提高反馈增益，探索高阶能力。';
  } else {
    narrative = '反应室在温和演化，适度调整参数以探索新的智能构型。';
  }

  statElements.narrative.textContent = narrative;
}

function drawChamber() {
  const { width, height } = canvas.getBoundingClientRect();
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.36;

  const gradient = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.2);
  gradient.addColorStop(0, 'rgba(110, 168, 255, 0.18)');
  gradient.addColorStop(0.45, 'rgba(13, 22, 40, 0.65)');
  gradient.addColorStop(1, 'rgba(5, 9, 18, 0.9)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const points = {
    agi: { x: cx - radius, y: cy + radius * 0.7 },
    asi: { x: cx + radius, y: cy + radius * 0.7 },
    oversight: { x: cx, y: cy - radius * 0.85 },
  };

  // connection glow
  ctx.globalCompositeOperation = 'lighter';
  const energyFactor = Math.min(1, state.energy / 2.2 + 0.1);

  function drawBeam(from, to, strength, hue) {
    const beamGradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    beamGradient.addColorStop(0, `hsla(${hue}, 85%, 70%, ${0.05 + strength * 0.35})`);
    beamGradient.addColorStop(0.5, `hsla(${hue + 20}, 85%, 65%, ${0.1 + strength * 0.45})`);
    beamGradient.addColorStop(1, `hsla(${hue + 40}, 85%, 70%, ${0.05 + strength * 0.35})`);

    ctx.lineWidth = 6 + strength * 12;
    ctx.strokeStyle = beamGradient;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(cx, cy, to.x, to.y);
    ctx.stroke();
  }

  drawBeam(points.agi, points.asi, energyFactor * (0.6 + state.asi * 0.25), 205);
  drawBeam(points.asi, points.oversight, energyFactor * (0.5 + state.asi * 0.3), 285);
  drawBeam(points.oversight, points.agi, energyFactor * (0.4 + state.oversight * 0.25), 165);

  ctx.globalCompositeOperation = 'source-over';

  // particles swirl
  particles.forEach((p) => {
    p.angle += (p.speed + state.energy * 0.15) * 0.01;
    const strength = 0.3 + state.energy * 0.25;
    const px = cx + Math.cos(p.angle + p.offset) * (p.radius + Math.sin(p.angle * 3) * p.jitter * 12);
    const py = cy + Math.sin(p.angle + p.offset) * (p.radius + Math.cos(p.angle * 2) * p.jitter * 8);
    const alpha = clamp(0.05 + strength * 0.25, 0.05, 0.45);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, 2 + state.energy * 0.6, 0, Math.PI * 2);
    ctx.fill();
  });

  function drawNode(point, value, label, hue) {
    const nodeRadius = 22 + value * 18;
    const nodeGradient = ctx.createRadialGradient(point.x, point.y, nodeRadius * 0.2, point.x, point.y, nodeRadius);
    nodeGradient.addColorStop(0, `hsla(${hue}, 95%, 75%, 0.9)`);
    nodeGradient.addColorStop(0.5, `hsla(${hue + 15}, 90%, 65%, 0.55)`);
    nodeGradient.addColorStop(1, 'rgba(8, 12, 24, 0.1)');

    ctx.fillStyle = nodeGradient;
    ctx.beginPath();
    ctx.arc(point.x, point.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `hsla(${hue}, 85%, 70%, 0.45)`;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '600 14px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(231, 236, 249, 0.9)';
    ctx.textAlign = 'center';
    ctx.fillText(label, point.x, point.y - nodeRadius - 12);
    ctx.font = '500 16px Inter, system-ui, sans-serif';
    ctx.fillText(value.toFixed(2), point.x, point.y + nodeRadius + 18);
  }

  drawNode(points.agi, state.agi, 'AGI 基态', 200);
  drawNode(points.asi, state.asi, 'ASI 放大量', 285);
  drawNode(points.oversight, state.oversight, '监督域', 150);

  ctx.restore();
}

function animate(now) {
  const tempo = parseFloat(ranges.tempo.value);
  const dt = Math.min(0.1, ((now - lastTime) / 1000) * tempo);
  lastTime = now;

  if (running) {
    updateState(dt);
    updateStats();
  }

  drawChamber();
  requestAnimationFrame(animate);
}

function init() {
  resizeCanvas();
  createParticles();
  updateStats();
  drawChamber();
  requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    animate(timestamp);
  });
}

window.addEventListener('resize', () => {
  resizeCanvas();
  drawChamber();
});

init();
