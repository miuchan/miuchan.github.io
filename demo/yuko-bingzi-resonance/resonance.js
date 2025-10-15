const canvas = document.getElementById('resonanceCanvas');
const ctx = canvas.getContext('2d');

const controls = {
  yukoFrequency: document.getElementById('yukoFrequency'),
  bingziFrequency: document.getElementById('bingziFrequency'),
  coupling: document.getElementById('coupling'),
  damping: document.getElementById('damping'),
};

const labels = {
  yukoFrequency: document.getElementById('yukoFrequencyLabel'),
  bingziFrequency: document.getElementById('bingziFrequencyLabel'),
  coupling: document.getElementById('couplingLabel'),
  damping: document.getElementById('dampingLabel'),
};

const readout = {
  synchrony: document.getElementById('synchrony'),
  energy: document.getElementById('energy'),
  mood: document.getElementById('mood'),
};

const state = {
  yuko: { position: 1, velocity: 0 },
  bingzi: { position: -1, velocity: 0 },
  time: 0,
  lastUpdate: performance.now(),
  moodTimer: 0,
};

function updateLabel(name, value) {
  if (!labels[name]) return;
  const formatted = name === 'coupling' || name === 'damping'
    ? Number(value).toFixed(2)
    : Number(value).toFixed(2) + ' Hz';
  labels[name].textContent = formatted;
}

Object.entries(controls).forEach(([name, input]) => {
  updateLabel(name, input.value);
  input.addEventListener('input', () => updateLabel(name, input.value));
});

function integrate(dt) {
  const omegaY = Number(controls.yukoFrequency.value) * Math.PI * 2;
  const omegaB = Number(controls.bingziFrequency.value) * Math.PI * 2;
  const coupling = Number(controls.coupling.value);
  const damping = Number(controls.damping.value);

  const dyuko = state.yuko.velocity;
  const dbingzi = state.bingzi.velocity;

  const forceYuko = -omegaY * omegaY * state.yuko.position - coupling * (state.yuko.position - state.bingzi.position) - damping * dyuko;
  const forceBingzi = -omegaB * omegaB * state.bingzi.position - coupling * (state.bingzi.position - state.yuko.position) - damping * dbingzi;

  state.yuko.velocity += forceYuko * dt;
  state.bingzi.velocity += forceBingzi * dt;

  state.yuko.position += state.yuko.velocity * dt;
  state.bingzi.position += state.bingzi.velocity * dt;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const scale = canvas.height * 0.25;

  // background glow
  const gradient = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, canvas.width * 0.6);
  gradient.addColorStop(0, 'rgba(255, 158, 219, 0.18)');
  gradient.addColorStop(0.6, 'rgba(93, 220, 255, 0.12)');
  gradient.addColorStop(1, 'rgba(11, 16, 38, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const yukoX = centerX - scale;
  const bingziX = centerX + scale;
  const yukoY = centerY + state.yuko.position * scale;
  const bingziY = centerY + state.bingzi.position * scale;

  // connection wave
  ctx.lineWidth = 3;
  const connectionGradient = ctx.createLinearGradient(yukoX, yukoY, bingziX, bingziY);
  connectionGradient.addColorStop(0, '#ff9edb');
  connectionGradient.addColorStop(1, '#5ddcff');
  ctx.strokeStyle = connectionGradient;

  ctx.beginPath();
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = yukoX + (bingziX - yukoX) * t;
    const wave = Math.sin(state.time * 1.5 + t * Math.PI * 2) * 12;
    const y = (1 - t) * yukoY + t * bingziY + wave;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  function drawNode(x, y, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 36 + Math.sin(state.time * 2) * 6, 0, Math.PI * 2);
    ctx.strokeStyle = color.replace('1)', '0.35)');
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  drawNode(yukoX, yukoY, 'rgba(255, 158, 219, 1)');
  drawNode(bingziX, bingziY, 'rgba(93, 220, 255, 1)');
}

const history = [];
const HISTORY_LIMIT = 180;

function updateReadout() {
  const synchronyValue = 1 - Math.abs(state.yuko.position - state.bingzi.position) / 4;
  const clampedSynchrony = Math.max(0, Math.min(1, synchronyValue));
  const totalEnergy = 0.5 * (
    Math.pow(state.yuko.velocity, 2) + Math.pow(state.bingzi.velocity, 2) +
    Math.pow(state.yuko.position, 2) + Math.pow(state.bingzi.position, 2)
  );

  history.push({ synchrony: clampedSynchrony, energy: totalEnergy });
  if (history.length > HISTORY_LIMIT) history.shift();

  const avgSync = history.reduce((sum, item) => sum + item.synchrony, 0) / history.length;
  const avgEnergy = history.reduce((sum, item) => sum + item.energy, 0) / history.length;

  readout.synchrony.textContent = `共振指数：${(avgSync * 100).toFixed(1)}%`;
  readout.energy.textContent = `总能量：${avgEnergy.toFixed(2)}`;

  const descriptor = avgSync > 0.8
    ? '两人心意相通，悸动在同一条世界线上跃迁。'
    : avgSync > 0.55
      ? '节奏渐渐靠拢，彼此在寻觅合拍的呼吸。'
      : avgSync > 0.3
        ? '共鸣尚浅，需要更多的倾听与回应。'
        : '相位差距明显，情绪仍在独立游荡。';

  state.moodTimer += 1;
  if (state.moodTimer > 15) {
    readout.mood.textContent = `情绪状态：${descriptor}`;
    state.moodTimer = 0;
  }
}

function step(now) {
  const dt = (now - state.lastUpdate) / 1000;
  state.lastUpdate = now;
  state.time += dt;

  const iterations = Math.max(1, Math.floor(dt / 0.016));
  const fixedDt = dt / iterations;
  for (let i = 0; i < iterations; i++) {
    integrate(fixedDt);
  }

  draw();
  updateReadout();

  requestAnimationFrame(step);
}

function resetState() {
  state.yuko.position = 1;
  state.yuko.velocity = 0;
  state.bingzi.position = -1;
  state.bingzi.velocity = 0;
  state.time = 0;
  state.lastUpdate = performance.now();
  history.length = 0;
}

resetState();
requestAnimationFrame(step);
