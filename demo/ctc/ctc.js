(function () {
  const canvas = document.getElementById('ctc-diagram');
  if (!canvas || !canvas.getContext) {
    return;
  }

  const ctx = canvas.getContext('2d');
  const warpInput = document.getElementById('warp');
  const loopsInput = document.getElementById('loops');
  const warpValue = document.getElementById('warp-value');
  const loopsValue = document.getElementById('loops-value');
  const velocityEl = document.getElementById('velocity');
  const properTimeEl = document.getElementById('proper-time');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state = {
    warp: parseFloat(warpInput.value),
    loops: parseInt(loopsInput.value, 10),
    progress: 0,
    points: []
  };

  const config = {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    centerX: canvas.width / 2,
    timeOrigin: canvas.height * 0.82,
    timeScale: canvas.height * 0.32,
    spaceScale: canvas.width * 0.22
  };

  let needsRebuild = true;
  let resizeTimer = null;

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.width;
    const height = rect.height || canvas.height;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    config.canvasWidth = width;
    config.canvasHeight = height;
    config.centerX = width / 2;
    config.timeOrigin = height * 0.82;
    config.timeScale = height * 0.32;
    config.spaceScale = width * 0.22;
    needsRebuild = true;
  }

  function buildCurve() {
    const points = [];
    const { warp, loops } = state;
    const steps = 900;

    for (let i = 0; i <= steps; i++) {
      const tau = (i / steps) * Math.PI * 2;
      const phase = tau * loops;
      const timeComponent = Math.cos(tau) + warp * 0.45 * Math.sin(phase);
      const spaceEnvelope = 0.72 + warp * 0.22 * Math.sin(phase + Math.PI / 2);
      const spaceComponent = Math.sin(tau) * spaceEnvelope;

      points.push({
        x: config.centerX + spaceComponent * config.spaceScale,
        y: config.timeOrigin - timeComponent * config.timeScale,
        t: timeComponent,
        s: spaceComponent
      });
    }

    state.points = points;
  }

  function drawBackground() {
    ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    const gradient = ctx.createLinearGradient(0, 0, 0, config.canvasHeight);
    gradient.addColorStop(0, '#0b1120');
    gradient.addColorStop(1, '#030712');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
  }

  function drawArrow(x, y, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-6, -14);
    ctx.lineTo(6, -14);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function drawAxes() {
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
    ctx.lineWidth = 1.4;

    ctx.beginPath();
    ctx.moveTo(config.centerX, config.canvasHeight * 0.08);
    ctx.lineTo(config.centerX, config.canvasHeight * 0.95);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(config.canvasWidth * 0.08, config.timeOrigin);
    ctx.lineTo(config.canvasWidth * 0.92, config.timeOrigin);
    ctx.stroke();

    drawArrow(config.centerX, config.canvasHeight * 0.08 + 12, 0, 'rgba(148, 163, 184, 0.65)');
    drawArrow(config.canvasWidth * 0.92 - 12, config.timeOrigin, Math.PI / 2, 'rgba(148, 163, 184, 0.65)');

    ctx.fillStyle = 'rgba(148, 163, 184, 0.75)';
    ctx.font = '14px "Inter", "Noto Sans SC", sans-serif';
    ctx.fillText('时间 t', config.centerX + 14, config.canvasHeight * 0.1);
    ctx.fillText('空间 x', config.canvasWidth * 0.92 - 56, config.timeOrigin - 12);
    ctx.restore();
  }

  function drawLightCone() {
    ctx.save();
    const coneHeight = config.timeScale * 1.25;
    ctx.fillStyle = 'rgba(59, 130, 246, 0.18)';
    ctx.beginPath();
    ctx.moveTo(config.centerX, config.timeOrigin);
    ctx.lineTo(config.centerX - config.timeScale, config.timeOrigin - config.timeScale);
    ctx.lineTo(config.centerX, config.timeOrigin - coneHeight);
    ctx.lineTo(config.centerX + config.timeScale, config.timeOrigin - config.timeScale);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(96, 165, 250, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(config.centerX, config.timeOrigin);
    ctx.lineTo(config.centerX - config.timeScale, config.timeOrigin - config.timeScale);
    ctx.moveTo(config.centerX, config.timeOrigin);
    ctx.lineTo(config.centerX + config.timeScale, config.timeOrigin - config.timeScale);
    ctx.stroke();
    ctx.restore();
  }

  function drawCurve() {
    if (!state.points.length) {
      return;
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(state.points[0].x, state.points[0].y);
    for (let i = 1; i < state.points.length; i++) {
      ctx.lineTo(state.points[i].x, state.points[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(250, 204, 21, 0.08)';
    ctx.fill('evenodd');

    const gradient = ctx.createLinearGradient(0, config.timeOrigin - config.timeScale * 1.2, 0, config.timeOrigin + config.timeScale * 0.4);
    gradient.addColorStop(0, 'rgba(250, 204, 21, 0.95)');
    gradient.addColorStop(1, 'rgba(250, 204, 21, 0.5)');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.restore();
  }

  function updateReadings(currentIndex) {
    const points = state.points;
    if (!points.length) {
      return;
    }
    const maxIndex = points.length - 1;
    const next = points[(currentIndex + 1) % maxIndex];
    const prev = points[(currentIndex - 1 + maxIndex) % maxIndex];
    const current = points[currentIndex];

    const dt = next.t - prev.t;
    const ds = next.s - prev.s;
    const velocity = Math.min(0.99, Math.abs(ds / (dt || 1e-6)));
    velocityEl.textContent = velocity.toFixed(2);
    const properTime = state.progress * Math.PI * 2;
    properTimeEl.textContent = properTime.toFixed(2);

    return { current, next };
  }

  function drawMarker() {
    if (!state.points.length) {
      return;
    }
    const maxIndex = state.points.length - 1;
    const index = Math.floor(state.progress * maxIndex) % maxIndex;
    const reading = updateReadings(index);

    if (!reading) {
      return;
    }

    const { current, next } = reading;

    ctx.save();
    ctx.shadowColor = 'rgba(250, 204, 21, 0.55)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(current.x, current.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(current.x, current.y, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    const angle = Math.atan2(next.y - current.y, next.x - current.x);
    drawArrow(current.x + Math.cos(angle) * 20, current.y + Math.sin(angle) * 20, angle + Math.PI / 2, 'rgba(250, 204, 21, 0.6)');
  }

  function renderFrame() {
    if (needsRebuild) {
      buildCurve();
      needsRebuild = false;
    }

    drawBackground();
    drawLightCone();
    drawAxes();
    drawCurve();
    drawMarker();
  }

  function tick() {
    renderFrame();
    state.progress = (state.progress + 0.0018) % 1;
    requestAnimationFrame(tick);
  }

  function refreshForInput() {
    needsRebuild = true;
    if (prefersReducedMotion) {
      renderFrame();
    }
  }

  warpInput.addEventListener('input', (event) => {
    state.warp = parseFloat(event.target.value);
    warpValue.textContent = state.warp.toFixed(2);
    refreshForInput();
  });

  loopsInput.addEventListener('input', (event) => {
    state.loops = parseInt(event.target.value, 10) || 1;
    loopsValue.textContent = state.loops.toString();
    refreshForInput();
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      if (prefersReducedMotion) {
        renderFrame();
      }
    }, 120);
  });

  resizeCanvas();
  renderFrame();
  if (!prefersReducedMotion) {
    requestAnimationFrame(tick);
  }
})();
