(function () {
  const canvas = document.getElementById('universe');
  const ctx = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;

  const world = {
    left: -2.6,
    right: 2.6,
    top: 2.1,
    bottom: -2.1
  };

  const learningRateInput = document.getElementById('learning-rate');
  const momentumInput = document.getElementById('momentum');
  const coherenceInput = document.getElementById('coherence');
  const learningRateValue = document.getElementById('learning-rate-value');
  const momentumValue = document.getElementById('momentum-value');
  const coherenceValue = document.getElementById('coherence-value');
  const energyEl = document.getElementById('energy');
  const iterationsEl = document.getElementById('iterations');
  const stepSizeEl = document.getElementById('step-size');
  const runButton = document.getElementById('run');
  const stepButton = document.getElementById('step');
  const resetButton = document.getElementById('reset');

  let surfaceImage = null;
  let animationFrame = null;

  const state = {
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    iterations: 0,
    energy: 0,
    running: false,
    path: [],
    start: { x: 0, y: 0 }
  };

  function gaussianContribution(x, y, cx, cy, ax, ay, weight) {
    const dx = x - cx;
    const dy = y - cy;
    const exponent = -(ax * dx * dx + ay * dy * dy);
    const g = Math.exp(exponent);
    const value = weight * g;
    const factor = -2 * weight * g;
    return {
      value,
      gx: factor * ax * dx,
      gy: factor * ay * dy
    };
  }

  function evaluatePotential(x, y) {
    let value = 0;
    let gx = 0;
    let gy = 0;

    const contributions = [
      gaussianContribution(x, y, 1.15, -0.4, 1.35, 1.1, -1.6),
      gaussianContribution(x, y, -1.28, 0.7, 1.2, 1.45, -1.35),
      gaussianContribution(x, y, -0.1, -0.1, 0.7, 0.8, -0.45),
      gaussianContribution(x, y, 0.0, 1.45, 0.7, 1.6, 0.35),
      gaussianContribution(x, y, 0.0, -1.6, 0.6, 1.3, 0.32)
    ];

    contributions.forEach((c) => {
      value += c.value;
      gx += c.gx;
      gy += c.gy;
    });

    const bridge = 0.15 * Math.pow(x + 0.4 * y, 2);
    value += bridge;
    gx += 0.3 * (x + 0.4 * y);
    gy += 0.12 * (x + 0.4 * y);

    const swirl = 0.55 * Math.sin(0.9 * x) * Math.cos(0.7 * y);
    value += swirl;
    gx += 0.55 * 0.9 * Math.cos(0.9 * x) * Math.cos(0.7 * y);
    gy += 0.55 * Math.sin(0.9 * x) * (-0.7) * Math.sin(0.7 * y);

    const radial = 0.12 * (x * x + 0.45 * y * y);
    value += radial;
    gx += 0.24 * x;
    gy += 0.12 * 0.45 * 2 * y;

    const quartic = 0.04 * Math.pow(x, 4) + 0.02 * Math.pow(y, 4);
    value += quartic;
    gx += 0.16 * Math.pow(x, 3);
    gy += 0.08 * Math.pow(y, 3);

    return { value, gx, gy };
  }

  function clampPosition() {
    const marginX = (world.right - world.left) * 0.02;
    const marginY = (world.top - world.bottom) * 0.02;
    state.position.x = Math.min(world.right - marginX, Math.max(world.left + marginX, state.position.x));
    state.position.y = Math.min(world.top - marginY, Math.max(world.bottom + marginY, state.position.y));
  }

  function toCanvasX(x) {
    return ((x - world.left) / (world.right - world.left)) * width;
  }

  function toCanvasY(y) {
    return ((world.top - y) / (world.top - world.bottom)) * height;
  }

  function palette(t) {
    const clamped = Math.min(1, Math.max(0, t));
    const eased = clamped * clamped * (3 - 2 * clamped);
    const low = [24, 40, 94];
    const high = [255, 138, 255];
    const r = Math.round(low[0] + (high[0] - low[0]) * eased);
    const g = Math.round(low[1] + (high[1] - low[1]) * eased);
    const b = Math.round(low[2] + (high[2] - low[2]) * eased);
    return [r, g, b];
  }

  function precomputeSurface() {
    const values = new Float32Array(width * height);
    let min = Infinity;
    let max = -Infinity;

    for (let y = 0; y < height; y += 1) {
      const wy = world.top - (y / (height - 1)) * (world.top - world.bottom);
      for (let x = 0; x < width; x += 1) {
        const wx = world.left + (x / (width - 1)) * (world.right - world.left);
        const { value } = evaluatePotential(wx, wy);
        const idx = y * width + x;
        values[idx] = value;
        if (value < min) min = value;
        if (value > max) max = value;
      }
    }

    const image = ctx.createImageData(width, height);
    const range = max - min || 1;

    for (let i = 0; i < values.length; i += 1) {
      const t = (values[i] - min) / range;
      const [r, g, b] = palette(t);
      const base = i * 4;
      image.data[base] = r;
      image.data[base + 1] = g;
      image.data[base + 2] = b;
      image.data[base + 3] = 255;
    }

    surfaceImage = image;
  }

  function drawScene() {
    if (surfaceImage) {
      ctx.putImageData(surfaceImage, 0, 0);
    } else {
      ctx.fillStyle = '#120e24';
      ctx.fillRect(0, 0, width, height);
    }

    if (state.path.length > 1) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      const first = state.path[0];
      ctx.moveTo(toCanvasX(first.x), toCanvasY(first.y));
      for (let i = 1; i < state.path.length; i += 1) {
        const point = state.path[i];
        ctx.lineTo(toCanvasX(point.x), toCanvasY(point.y));
      }
      ctx.stroke();
    }

    const start = state.start;
    ctx.fillStyle = '#ffb3ff';
    ctx.beginPath();
    ctx.arc(toCanvasX(start.x), toCanvasY(start.y), 5, 0, Math.PI * 2);
    ctx.fill();

    const current = state.position;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(toCanvasX(current.x), toCanvasY(current.y), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function updateReadout(stepSize = 0) {
    energyEl.textContent = state.energy.toFixed(3);
    iterationsEl.textContent = state.iterations;
    stepSizeEl.textContent = stepSize.toFixed(2);
  }

  function randomizePosition() {
    const rx = Math.random() * (world.right - world.left) + world.left;
    const ry = Math.random() * (world.top - world.bottom) + world.bottom;
    state.position.x = rx;
    state.position.y = ry;
    state.velocity.x = 0;
    state.velocity.y = 0;
    state.path = [{ x: rx, y: ry }];
    state.iterations = 0;
    state.start = { x: rx, y: ry };
    const { value } = evaluatePotential(rx, ry);
    state.energy = value;
    updateReadout(0);
    drawScene();
  }

  function stepDescent() {
    const learningRate = parseFloat(learningRateInput.value);
    const momentum = parseFloat(momentumInput.value);
    const coherence = parseFloat(coherenceInput.value);

    const { gx, gy } = evaluatePotential(state.position.x, state.position.y);

    const noiseScale = coherence * Math.sqrt(learningRate);
    const noiseX = (Math.random() * 2 - 1) * noiseScale;
    const noiseY = (Math.random() * 2 - 1) * noiseScale;

    state.velocity.x = momentum * state.velocity.x - learningRate * gx + noiseX;
    state.velocity.y = momentum * state.velocity.y - learningRate * gy + noiseY;

    state.position.x += state.velocity.x;
    state.position.y += state.velocity.y;
    clampPosition();

    state.path.push({ x: state.position.x, y: state.position.y });
    if (state.path.length > 600) {
      state.path.shift();
    }

    state.iterations += 1;
    const { value: newValue } = evaluatePotential(state.position.x, state.position.y);
    state.energy = newValue;

    const stepSize = Math.hypot(state.velocity.x, state.velocity.y);
    updateReadout(stepSize);
  }

  function runLoop() {
    if (!state.running) return;
    for (let i = 0; i < 4; i += 1) {
      stepDescent();
    }
    drawScene();

    if (state.iterations > 2400) {
      toggleRun(false);
      return;
    }

    animationFrame = requestAnimationFrame(runLoop);
  }

  function toggleRun(nextState) {
    const shouldRun = typeof nextState === 'boolean' ? nextState : !state.running;
    state.running = shouldRun;
    if (shouldRun) {
      runButton.textContent = '暂停下降';
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(runLoop);
    } else {
      cancelAnimationFrame(animationFrame);
      runButton.textContent = state.iterations > 0 ? '继续下降' : '开始下降';
    }
  }

  learningRateInput.addEventListener('input', () => {
    learningRateValue.textContent = Number(learningRateInput.value).toFixed(2);
  });

  momentumInput.addEventListener('input', () => {
    momentumValue.textContent = Number(momentumInput.value).toFixed(2);
  });

  coherenceInput.addEventListener('input', () => {
    coherenceValue.textContent = Number(coherenceInput.value).toFixed(2);
  });

  runButton.addEventListener('click', () => {
    toggleRun();
  });

  stepButton.addEventListener('click', () => {
    if (state.running) {
      toggleRun(false);
    }
    stepDescent();
    drawScene();
  });

  resetButton.addEventListener('click', () => {
    toggleRun(false);
    randomizePosition();
    runButton.textContent = '开始下降';
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.running) {
      toggleRun(false);
    }
  });

  precomputeSurface();
  randomizePosition();
  drawScene();
  learningRateValue.textContent = Number(learningRateInput.value).toFixed(2);
  momentumValue.textContent = Number(momentumInput.value).toFixed(2);
  coherenceValue.textContent = Number(coherenceInput.value).toFixed(2);
})();
