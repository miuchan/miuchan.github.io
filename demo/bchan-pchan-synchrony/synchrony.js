const canvas = document.getElementById('syncCanvas');
const ctx = canvas.getContext('2d');

const controls = {
  bFrequency: document.getElementById('bFrequency'),
  pFrequency: document.getElementById('pFrequency'),
  coupling: document.getElementById('coupling'),
  inspiration: document.getElementById('inspiration'),
};

const labels = {
  bFrequency: document.getElementById('bFrequencyLabel'),
  pFrequency: document.getElementById('pFrequencyLabel'),
  coupling: document.getElementById('couplingLabel'),
  inspiration: document.getElementById('inspirationLabel'),
};

const readout = {
  harmony: document.getElementById('harmony'),
  momentum: document.getElementById('momentum'),
  narrative: document.getElementById('narrative'),
};

const state = {
  b: { phase: 0 },
  p: { phase: Math.PI },
  time: 0,
  lastUpdate: performance.now(),
  trail: [],
  narrativeTimer: 0,
};

const history = [];
const TRAIL_LIMIT = 160;
const HISTORY_LIMIT = 240;

function updateLabel(name, value) {
  if (!labels[name]) return;
  if (name === 'bFrequency' || name === 'pFrequency') {
    labels[name].textContent = `${Number(value).toFixed(2)} Hz`;
  } else if (name === 'coupling') {
    labels[name].textContent = Number(value).toFixed(2);
  } else if (name === 'inspiration') {
    labels[name].textContent = `${Math.round(Number(value) * 100)}%`;
  }
}

Object.entries(controls).forEach(([name, input]) => {
  updateLabel(name, input.value);
  input.addEventListener('input', () => updateLabel(name, input.value));
});

document.getElementById('reset').addEventListener('click', () => {
  resetState();
});

function wrap(angle) {
  const tau = Math.PI * 2;
  angle %= tau;
  return angle < 0 ? angle + tau : angle;
}

function normalize(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function integrate(dt) {
  const omegaB = Number(controls.bFrequency.value) * Math.PI * 2;
  const omegaP = Number(controls.pFrequency.value) * Math.PI * 2;
  const coupling = Number(controls.coupling.value);
  const inspiration = Number(controls.inspiration.value);

  const diff = normalize(state.p.phase - state.b.phase);
  const shared = wrap((state.b.phase + state.p.phase) / 2);

  const couplingForce = coupling * Math.sin(diff);

  state.b.phase += (omegaB + couplingForce) * dt;
  state.p.phase += (omegaP - couplingForce) * dt;

  state.b.phase = wrap(state.b.phase);
  state.p.phase = wrap(state.p.phase);

  const alignForceB = inspiration * Math.sin(normalize(shared - state.b.phase));
  const alignForceP = inspiration * Math.sin(normalize(shared - state.p.phase));

  state.b.phase += alignForceB * dt;
  state.p.phase += alignForceP * dt;

  state.b.phase = wrap(state.b.phase);
  state.p.phase = wrap(state.p.phase);

  state.time += dt;
}

function draw(harmony) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const baseRadius = Math.min(canvas.width, canvas.height) * 0.32;

  const backgroundGlow = ctx.createRadialGradient(centerX, centerY, 24, centerX, centerY, canvas.width * 0.65);
  backgroundGlow.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
  backgroundGlow.addColorStop(0.35, 'rgba(96, 196, 255, 0.14)');
  backgroundGlow.addColorStop(0.75, 'rgba(255, 127, 214, 0.12)');
  backgroundGlow.addColorStop(1, 'rgba(5, 7, 20, 0)');
  ctx.fillStyle = backgroundGlow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const diff = normalize(state.p.phase - state.b.phase);
  const bRadius = baseRadius * (1 + 0.05 * Math.sin(state.time * 1.3));
  const pRadius = baseRadius * (1 + 0.05 * Math.cos(state.time * 1.5));

  const bPos = {
    x: centerX + Math.cos(state.b.phase) * bRadius,
    y: centerY + Math.sin(state.b.phase) * bRadius,
  };
  const pPos = {
    x: centerX + Math.cos(state.p.phase) * pRadius,
    y: centerY + Math.sin(state.p.phase) * pRadius,
  };

  state.trail.push({ b: bPos, p: pPos, harmony });
  if (state.trail.length > TRAIL_LIMIT) state.trail.shift();

  function drawTrail(key, color) {
    for (let i = 1; i < state.trail.length; i++) {
      const prev = state.trail[i - 1][key];
      const curr = state.trail[i][key];
      const t = i / state.trail.length;
      ctx.strokeStyle = `rgba(${color}, ${t * 0.55})`;
      ctx.lineWidth = 0.8 + t * 2.2;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.stroke();
    }
  }

  drawTrail('b', '96, 196, 255');
  drawTrail('p', '255, 127, 214');

  const separation = Math.hypot(pPos.x - bPos.x, pPos.y - bPos.y) || 1;
  const normalX = (pPos.y - bPos.y) / separation;
  const normalY = (bPos.x - pPos.x) / separation;
  const wave = Math.sin(state.time * 1.4 + diff * 1.1) * (28 + (1 - harmony) * 36);

  const midX = (bPos.x + pPos.x) / 2;
  const midY = (bPos.y + pPos.y) / 2;

  const ctrl1X = midX + normalX * wave;
  const ctrl1Y = midY + normalY * wave;
  const ctrl2X = midX - normalX * wave;
  const ctrl2Y = midY - normalY * wave;

  const ribbon = ctx.createLinearGradient(bPos.x, bPos.y, pPos.x, pPos.y);
  ribbon.addColorStop(0, 'rgba(96, 196, 255, 0.92)');
  ribbon.addColorStop(0.5, `rgba(255, 255, 255, ${0.25 + harmony * 0.35})`);
  ribbon.addColorStop(1, 'rgba(255, 127, 214, 0.92)');

  ctx.lineWidth = 4.4;
  ctx.strokeStyle = ribbon;
  ctx.beginPath();
  ctx.moveTo(bPos.x, bPos.y);
  ctx.bezierCurveTo(ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, pPos.x, pPos.y);
  ctx.stroke();

  ctx.save();
  ctx.globalAlpha = 0.35 + harmony * 0.25;
  ctx.lineWidth = 2.4;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, baseRadius * 1.05, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  function drawNode(position, fill, halo) {
    ctx.save();
    ctx.translate(position.x, position.y);

    ctx.beginPath();
    ctx.fillStyle = halo;
    ctx.globalAlpha = 0.32;
    ctx.arc(0, 0, 40 + Math.sin(state.time * 3) * 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = fill.replace('1)', '0.35)').replace('0.95)', '0.35)');
    ctx.arc(0, 0, 32 + Math.sin(state.time * 2.2) * 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  drawNode(bPos, 'rgba(96, 196, 255, 0.95)', 'rgba(96, 196, 255, 0.65)');
  drawNode(pPos, 'rgba(255, 127, 214, 0.95)', 'rgba(255, 127, 214, 0.65)');
}

function computeMomentum() {
  const avgFreq = (Number(controls.bFrequency.value) + Number(controls.pFrequency.value)) / 2;
  const synergy = Number(controls.coupling.value) * 0.45 + Number(controls.inspiration.value) * 1.4;
  return avgFreq * (1 + synergy);
}

function updateReadout(harmony, momentum, dt) {
  history.push({ harmony, momentum });
  if (history.length > HISTORY_LIMIT) history.shift();

  const avgHarmony = history.reduce((sum, item) => sum + item.harmony, 0) / history.length;
  const avgMomentum = history.reduce((sum, item) => sum + item.momentum, 0) / history.length;

  readout.harmony.textContent = `联动率：${(avgHarmony * 100).toFixed(1)}%`;
  readout.momentum.textContent = `创作动量：${avgMomentum.toFixed(2)}`;

  state.narrativeTimer += dt;
  if (state.narrativeTimer > 2.6) {
    let descriptor;
    if (avgHarmony > 0.86) {
      descriptor = '灵感像蓝粉色的星带一样交织，合作进入无缝衔接阶段。';
    } else if (avgHarmony > 0.62) {
      descriptor = '节奏逐渐对齐，B子铺陈氛围，P子带来细腻的收束。';
    } else if (avgHarmony > 0.4) {
      descriptor = '两位站娘在试探彼此的拍点，偶有火花闪现。';
    } else {
      descriptor = '她们仍保持各自节奏，调高耦合或灵感共鸣能让波形贴近。';
    }

    if (avgMomentum > 3.4) {
      descriptor += ' 动量充沛，记得安排喘息来保持灵感续航。';
    } else if (avgMomentum < 1.4) {
      descriptor += ' 动量偏低，可以尝试提升灵感共鸣或节奏强度。';
    }

    readout.narrative.textContent = `灵感状态：${descriptor}`;
    state.narrativeTimer = 0;
  }
}

function resetState() {
  state.b.phase = 0;
  state.p.phase = Math.PI;
  state.time = 0;
  state.trail.length = 0;
  state.lastUpdate = performance.now();
  state.narrativeTimer = 0;
  history.length = 0;
  readout.harmony.textContent = '联动率：--';
  readout.momentum.textContent = '创作动量：--';
  readout.narrative.textContent = '灵感状态：等待捕捉第一束火花…';
}

function step(now) {
  const delta = (now - state.lastUpdate) / 1000;
  state.lastUpdate = now;

  let dt = Math.min(delta, 0.08);
  const fixed = 1 / 90;
  let accumulator = dt;
  while (accumulator > 0) {
    const stepDt = Math.min(fixed, accumulator);
    integrate(stepDt);
    accumulator -= stepDt;
  }

  const diff = normalize(state.p.phase - state.b.phase);
  const harmony = 0.5 * (1 + Math.cos(diff));
  const momentum = computeMomentum();

  draw(harmony);
  updateReadout(harmony, momentum, dt);

  requestAnimationFrame(step);
}

resetState();
requestAnimationFrame(step);
