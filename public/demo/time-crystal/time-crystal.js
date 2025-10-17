const canvas = document.getElementById('crystalCanvas');
const ctx = canvas.getContext('2d');

const controls = {
  drive: document.getElementById('drive'),
  phase: document.getElementById('phase'),
  symmetry: document.getElementById('symmetry'),
  damping: document.getElementById('damping'),
};

const display = {
  drive: document.getElementById('driveValue'),
  phase: document.getElementById('phaseValue'),
  symmetry: document.getElementById('symmetryValue'),
  damping: document.getElementById('dampingValue'),
  order: document.getElementById('orderParam'),
  mode: document.getElementById('modeLock'),
  energy: document.getElementById('energyLevel'),
  narrative: document.getElementById('narrative'),
};

const buttons = {
  toggle: document.getElementById('toggle'),
  reset: document.getElementById('reset'),
};

const state = {
  running: true,
  time: 0,
  lastTime: performance.now(),
  trails: [],
  metrics: [],
  narrativeTimer: 0,
};

const TAU = Math.PI * 2;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
    canvas.width = width * ratio;
    canvas.height = height * ratio;
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function updateDisplay() {
  display.drive.textContent = `${Number(controls.drive.value).toFixed(2)} Hz`;
  display.phase.textContent = `${Number(controls.phase.value).toFixed(2)} rad`;
  display.symmetry.textContent = `${Math.round(Number(controls.symmetry.value) * 100)}%`;
  display.damping.textContent = Number(controls.damping.value).toFixed(2);
}

Object.values(controls).forEach((input) => {
  input.addEventListener('input', updateDisplay);
});

function resetState() {
  state.time = 0;
  state.lastTime = performance.now();
  state.trails.length = 0;
  state.metrics.length = 0;
  state.narrativeTimer = 0;
  display.order.textContent = '--';
  display.mode.textContent = '--';
  display.energy.textContent = '--';
  display.narrative.textContent = '等待晶体捕捉第一道时间脉冲…';
}

function computeCrystal() {
  const drive = Number(controls.drive.value);
  const phase = Number(controls.phase.value);
  const symmetry = Number(controls.symmetry.value);
  const damping = Number(controls.damping.value);

  const rect = canvas.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const baseRadius = Math.min(rect.width, rect.height) * 0.32;

  const segments = 160;
  const points = [];
  const radii = [];

  const envelope = 1 - Math.min(0.9, damping * 2.6);
  const subharmonicFreq = drive * (0.5 + symmetry * 0.45);

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * TAU;
    const primary = Math.sin(state.time * drive + angle * 2);
    const subharmonic = Math.sin(state.time * subharmonicFreq * 0.5 + angle * 4 + phase);
    const twist = Math.sin(state.time * (drive * 1.5 + symmetry) - angle * 3 + phase * 0.5);

    const radius = baseRadius * (1 + 0.18 * primary)
      + 68 * symmetry * subharmonic
      + 44 * envelope * twist
      - 36 * damping * Math.cos(angle * 2 - state.time * drive * 0.6);

    const modRadius = Math.max(baseRadius * 0.35, baseRadius + radius * 0.35);

    const x = centerX + Math.cos(angle) * modRadius;
    const y = centerY + Math.sin(angle) * modRadius;

    points.push({ x, y, angle, radius: modRadius });
    radii.push(modRadius);
  }

  const meanRadius = radii.reduce((sum, r) => sum + r, 0) / radii.length;
  const variance = radii.reduce((sum, r) => sum + (r - meanRadius) ** 2, 0) / radii.length;
  const orderParam = 1 - Math.min(1, Math.sqrt(variance) / (meanRadius || 1));

  let fundamental = 0;
  let subharmonicStrength = 0;
  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * TAU;
    fundamental += radii[i] * Math.sin(angle + state.time * drive);
    subharmonicStrength += radii[i] * Math.sin(angle * 2 + state.time * drive * 0.5 + phase);
  }
  const modeLock = Math.min(1, Math.abs(subharmonicStrength) / (Math.abs(fundamental) + 1e-6));

  const energy = radii.reduce((sum, r) => sum + r * r, 0) / (segments * 1000);

  return { points, orderParam, modeLock, energy };
}

function drawBackground() {
  const rect = canvas.getBoundingClientRect();
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.fillRect(0, 0, rect.width, rect.height);

  const gradient = ctx.createRadialGradient(rect.width / 2, rect.height / 2, 0, rect.width / 2, rect.height / 2, rect.width * 0.6);
  gradient.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
  gradient.addColorStop(0.55, 'rgba(129, 140, 248, 0.08)');
  gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, rect.width, rect.height);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
  ctx.lineWidth = 1;
  const rings = 4;
  for (let i = 1; i <= rings; i += 1) {
    const radius = (Math.min(rect.width, rect.height) / 2) * (i / rings);
    ctx.beginPath();
    ctx.arc(rect.width / 2, rect.height / 2, radius, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCrystal(points, metrics, recordTrail = true) {
  const rect = canvas.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  if (recordTrail) {
    state.trails.push(points.map((p) => ({ x: p.x, y: p.y })));
    if (state.trails.length > 60) state.trails.shift();
  }

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < state.trails.length; i += 1) {
    const trail = state.trails[i];
    const alpha = (i / state.trails.length) * 0.45;
    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
    ctx.lineWidth = 1 + i * 0.04;
    ctx.beginPath();
    trail.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();

  const hueBase = 200 + metrics.modeLock * 120;
  ctx.save();
  ctx.lineWidth = 2.6;
  ctx.strokeStyle = `hsla(${hueBase}, 95%, 65%, 0.9)`;
  ctx.shadowBlur = 28;
  ctx.shadowColor = `hsla(${hueBase}, 100%, 75%, 0.6)`;

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  const coreRadius = Math.min(rect.width, rect.height) * 0.18;
  const pulse = 0.5 + metrics.orderParam * 0.5;
  const coreGradient = ctx.createRadialGradient(centerX, centerY, coreRadius * 0.2, centerX, centerY, coreRadius);
  coreGradient.addColorStop(0, `rgba(56, 189, 248, ${0.25 + pulse * 0.4})`);
  coreGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, coreRadius, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function updateReadout(metrics) {
  const orderPercent = (metrics.orderParam * 100).toFixed(1);
  const modePercent = (metrics.modeLock * 100).toFixed(1);
  const energy = metrics.energy.toFixed(2);

  display.order.textContent = `${orderPercent}%`;
  display.mode.textContent = `${modePercent}%`;
  display.energy.textContent = energy;

  state.metrics.push(metrics);
  if (state.metrics.length > 120) state.metrics.shift();

  state.narrativeTimer += 1;
  if (state.narrativeTimer > 90) {
    const avgOrder = state.metrics.reduce((sum, item) => sum + item.orderParam, 0) / state.metrics.length;
    const avgMode = state.metrics.reduce((sum, item) => sum + item.modeLock, 0) / state.metrics.length;

    let message;
    if (avgOrder > 0.86 && avgMode > 0.6) {
      message = '时间晶体锁定在稳定的周期加倍态，跨周期的节拍清晰可辨。';
    } else if (avgOrder > 0.7) {
      message = '晶体保持相对有序，偶尔出现子谐波跳跃，正在寻找新的节奏。';
    } else if (avgMode > 0.5) {
      message = '锁模信号增强但主序混乱，考虑减弱耗散或调整驱动频率。';
    } else {
      message = '对称尚未破缺，晶体仍贴着驱动节拍波动，可适度提升对称破缺系数。';
    }

    display.narrative.textContent = message;
    state.narrativeTimer = 0;
  }
}

function tick(now) {
  const delta = Math.min(0.05, (now - state.lastTime) / 1000);
  state.lastTime = now;

  if (state.running) {
    const drive = Number(controls.drive.value);
    const damping = Number(controls.damping.value);
    const symmetry = Number(controls.symmetry.value);

    const effective = drive * (1 + symmetry * 0.2);
    state.time += delta * effective * (1 - damping * 0.35);

    const metrics = computeCrystal();
    drawBackground();
    drawCrystal(metrics.points, metrics);
    updateReadout(metrics);
  } else {
    drawBackground();
    if (state.trails.length > 0) {
      const metrics = computeCrystal();
      const latest = state.trails[state.trails.length - 1];
      if (latest) {
        drawCrystal(latest.map((point) => ({ x: point.x, y: point.y })), metrics, false);
      }
    }
  }

  requestAnimationFrame(tick);
}

buttons.toggle.addEventListener('click', () => {
  state.running = !state.running;
  buttons.toggle.textContent = state.running ? '暂停演化' : '恢复演化';
});

buttons.reset.addEventListener('click', () => {
  controls.drive.value = 1.45;
  controls.phase.value = 2.4;
  controls.symmetry.value = 0.58;
  controls.damping.value = 0.08;
  updateDisplay();
  resetState();
});

window.addEventListener('resize', () => {
  resizeCanvas();
});

updateDisplay();
resizeCanvas();
resetState();
requestAnimationFrame(tick);

document.getElementById('year').textContent = new Date().getFullYear();
