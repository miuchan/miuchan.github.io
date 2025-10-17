(function () {
  const canvas = document.getElementById('qed-diagram');
  if (!canvas || !canvas.getContext) {
    return;
  }

  const ctx = canvas.getContext('2d');

  const energyInput = document.getElementById('energy');
  const loopsInput = document.getElementById('loops');
  const fieldInput = document.getElementById('field');
  const energyValue = document.getElementById('energy-value');
  const loopsValue = document.getElementById('loops-value');
  const fieldValue = document.getElementById('field-value');
  const alphaReading = document.getElementById('alpha-reading');
  const amplitudeReading = document.getElementById('amplitude-reading');
  const correctionReading = document.getElementById('correction-reading');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const constants = {
    alpha0: 1 / 137.035999084, // 真空中的精细结构常数
    electronMassGeV: 0.000511
  };

  const state = {
    energy: parseFloat(energyInput.value),
    loops: parseInt(loopsInput.value, 10),
    field: parseFloat(fieldInput.value),
    time: 1.2,
    vertices: { v1: { x: 0, y: 0 }, v2: { x: 0, y: 0 } },
    electronPaths: [],
    photonBase: [],
    observables: {
      alpha: 0,
      amplitude: 0,
      correction: 0
    }
  };

  const config = {
    width: canvas.width,
    height: canvas.height
  };

  let resizeTimer = null;
  let needsGeometryUpdate = true;
  let animationId = null;
  let lastTimestamp = null;

  function setCanvasSize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.width;
    const height = rect.height || canvas.height;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    config.width = width;
    config.height = height;
    needsGeometryUpdate = true;
  }

  function quadraticAt(p0, p1, p2, t) {
    const inv = 1 - t;
    return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
  }

  function sampleSegments(segments, samplesPerSegment) {
    const points = [];
    segments.forEach((segment, index) => {
      const steps = samplesPerSegment;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = quadraticAt(segment.start.x, segment.control.x, segment.end.x, t);
        const y = quadraticAt(segment.start.y, segment.control.y, segment.end.y, t);
        if (index > 0 && i === 0) {
          continue;
        }
        points.push({ x, y });
      }
    });
    return points;
  }

  function buildGeometry() {
    const width = config.width;
    const height = config.height;

    const v1 = { x: width * 0.35, y: height * 0.48 };
    const v2 = { x: width * 0.67, y: height * 0.36 };

    const electronPaths = [
      {
        offset: 0,
        segments: [
          {
            start: { x: width * 0.14, y: height * 0.92 },
            control: { x: width * 0.25, y: height * 0.62 },
            end: v1
          },
          {
            start: v1,
            control: { x: width * 0.32, y: height * 0.2 },
            end: { x: width * 0.24, y: height * 0.08 }
          }
        ],
        samples: []
      },
      {
        offset: 0.5,
        segments: [
          {
            start: { x: width * 0.86, y: height * 0.94 },
            control: { x: width * 0.74, y: height * 0.62 },
            end: v2
          },
          {
            start: v2,
            control: { x: width * 0.7, y: height * 0.22 },
            end: { x: width * 0.8, y: height * 0.08 }
          }
        ],
        samples: []
      }
    ];

    electronPaths.forEach((path) => {
      path.samples = sampleSegments(path.segments, 280);
    });

    const photonBase = [];
    const photonSteps = 160;
    for (let i = 0; i <= photonSteps; i++) {
      const t = i / photonSteps;
      photonBase.push({
        x: v1.x + (v2.x - v1.x) * t,
        y: v1.y + (v2.y - v1.y) * t
      });
    }

    state.vertices = { v1, v2 };
    state.electronPaths = electronPaths;
    state.photonBase = photonBase;
  }

  function computeRunningAlpha(energy) {
    const q = Math.max(constants.electronMassGeV, energy);
    const logTerm = Math.log((q * q) / (constants.electronMassGeV * constants.electronMassGeV));
    const denom = 1 - (constants.alpha0 / (3 * Math.PI)) * logTerm;
    return constants.alpha0 / Math.max(denom, 0.6); // 避免过小的分母
  }

  function updateObservables() {
    const { energy, loops, field } = state;
    const runningAlpha = computeRunningAlpha(energy);
    const effectiveAlpha = runningAlpha * (1 + field * 0.08);
    const amplitude = Math.sqrt(effectiveAlpha * (1 + field * 0.6)) * (1 + loops * 0.2);
    const correction = ((Math.log(1 + energy) / Math.log(1 + 500)) * loops * 0.12 + field * 0.2) * 100;

    state.observables.alpha = effectiveAlpha;
    state.observables.amplitude = amplitude;
    state.observables.correction = correction;

    alphaReading.textContent = effectiveAlpha.toFixed(5);
    amplitudeReading.textContent = amplitude.toFixed(3);
    correctionReading.textContent = correction.toFixed(1) + '%';
  }

  function drawBackground() {
    ctx.clearRect(0, 0, config.width, config.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, config.height);
    gradient.addColorStop(0, '#020617');
    gradient.addColorStop(1, '#0b1120');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, config.height);

    const spacing = 56;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.12)';
    ctx.setLineDash([4, 14]);
    for (let x = config.width * 0.1; x <= config.width * 0.9; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, config.height * 0.1);
      ctx.lineTo(x, config.height * 0.9);
      ctx.stroke();
    }
    for (let y = config.height * 0.15; y <= config.height * 0.88; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(config.width * 0.08, y);
      ctx.lineTo(config.width * 0.92, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawAxes() {
    ctx.save();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';

    const baseY = config.height * 0.86;
    const baseX = config.width * 0.1;

    ctx.beginPath();
    ctx.moveTo(config.width * 0.08, baseY);
    ctx.lineTo(config.width * 0.92, baseY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(baseX, config.height * 0.92);
    ctx.lineTo(baseX, config.height * 0.12);
    ctx.stroke();

    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '13px "Inter", "Noto Sans SC", sans-serif';
    ctx.fillText('空间 x', config.width * 0.86, baseY - 10);
    ctx.fillText('时间 t', baseX + 10, config.height * 0.16);

    ctx.beginPath();
    ctx.moveTo(config.width * 0.92, baseY);
    ctx.lineTo(config.width * 0.92 - 10, baseY - 6);
    ctx.lineTo(config.width * 0.92 - 10, baseY + 6);
    ctx.closePath();
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(baseX, config.height * 0.12);
    ctx.lineTo(baseX - 6, config.height * 0.12 + 12);
    ctx.lineTo(baseX + 6, config.height * 0.12 + 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawFieldGlow() {
    const radiusBase = 80 + state.field * 60;
    [state.vertices.v1, state.vertices.v2].forEach((vertex, index) => {
      const radius = radiusBase * (index === 0 ? 1 : 0.85);
      const gradient = ctx.createRadialGradient(vertex.x, vertex.y, 0, vertex.x, vertex.y, radius);
      gradient.addColorStop(0, `rgba(56, 189, 248, ${0.16 + state.field * 0.24})`);
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawPhotonLine() {
    const amplitude = 14 + state.field * 34;
    const frequency = 6 + state.loops * 2;
    const base = state.photonBase;
    if (!base.length) {
      return;
    }

    ctx.save();
    ctx.beginPath();
    base.forEach((point, index) => {
      const t = index / (base.length - 1);
      const wave = Math.sin(t * frequency * Math.PI + state.time * 2.4) * amplitude;
      const y = point.y + wave;
      if (index === 0) {
        ctx.moveTo(point.x, y);
      } else {
        ctx.lineTo(point.x, y);
      }
    });
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
    ctx.lineWidth = 2.6;
    ctx.shadowColor = 'rgba(250, 204, 21, 0.38)';
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.restore();
  }

  function drawPhotonPulse() {
    const base = state.photonBase;
    if (!base.length) {
      return;
    }
    const amplitude = 14 + state.field * 34;
    const frequency = 6 + state.loops * 2;
    const progress = (state.time * (0.25 + state.energy / 1200)) % 1;
    const index = Math.floor(progress * (base.length - 1));
    const t = index / (base.length - 1);
    const point = base[index];
    const wave = Math.sin(t * frequency * Math.PI + state.time * 2.4) * amplitude;
    const x = point.x;
    const y = point.y + wave;

    const glowRadius = 14 + state.field * 26;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius * 1.8);
    gradient.addColorStop(0, 'rgba(250, 204, 21, 0.95)');
    gradient.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, glowRadius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
    ctx.fill();
  }

  function drawLoops() {
    const center = {
      x: (state.vertices.v1.x + state.vertices.v2.x) / 2,
      y: (state.vertices.v1.y + state.vertices.v2.y) / 2
    };
    ctx.save();
    for (let i = 0; i < state.loops; i++) {
      const radiusX = 40 + i * 18;
      const radiusY = 22 + i * 14;
      const rotation = Math.sin(state.time * 0.6 + i) * 0.35;
      ctx.beginPath();
      ctx.ellipse(center.x, center.y, radiusX, radiusY, rotation, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(96, 165, 250, ${0.28 + i * 0.1})`;
      ctx.lineWidth = 1.6 + i * 0.4;
      ctx.setLineDash([10, 12]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  function drawElectronPaths() {
    state.electronPaths.forEach((path, index) => {
      ctx.save();
      ctx.beginPath();
      const segments = path.segments;
      ctx.moveTo(segments[0].start.x, segments[0].start.y);
      segments.forEach((segment) => {
        ctx.quadraticCurveTo(segment.control.x, segment.control.y, segment.end.x, segment.end.y);
      });
      const gradient = ctx.createLinearGradient(
        segments[0].start.x,
        segments[0].start.y,
        segments[segments.length - 1].end.x,
        segments[segments.length - 1].end.y
      );
      gradient.addColorStop(0, 'rgba(129, 140, 248, 0.65)');
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0.95)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3.2;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.45)';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();

      const points = path.samples;
      if (!points.length) {
        return;
      }
      const speed = 0.18 + state.energy / 1200 + index * 0.05;
      const pos = ((state.time * speed) + path.offset) % 1;
      const idx = Math.floor(pos * (points.length - 1));
      const point = points[idx];
      const radius = 6 + state.field * 8;

      const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 2.2);
      glow.addColorStop(0, 'rgba(191, 219, 254, 0.9)');
      glow.addColorStop(1, 'rgba(191, 219, 254, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(224, 231, 255, 0.95)';
      ctx.fill();
    });
  }

  function drawVertices() {
    [state.vertices.v1, state.vertices.v2].forEach((vertex) => {
      ctx.save();
      const size = 7 + state.field * 4;
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(248, 250, 252, 0.95)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
      ctx.stroke();
      ctx.restore();
    });
  }

  function draw() {
    if (needsGeometryUpdate) {
      buildGeometry();
      needsGeometryUpdate = false;
    }

    drawBackground();
    drawAxes();
    drawFieldGlow();
    drawLoops();
    drawElectronPaths();
    drawPhotonLine();
    drawPhotonPulse();
    drawVertices();
  }

  function animate(timestamp) {
    if (lastTimestamp != null) {
      const delta = (timestamp - lastTimestamp) / 1000;
      const speedFactor = Math.min(1.6, 0.5 + state.energy / 400);
      state.time += delta * speedFactor;
    }
    lastTimestamp = timestamp;
    draw();
    animationId = requestAnimationFrame(animate);
  }

  function handleEnergyInput(event) {
    state.energy = parseFloat(event.target.value);
    energyValue.textContent = state.energy.toFixed(1);
    updateObservables();
    if (prefersReducedMotion) {
      draw();
    }
  }

  function handleLoopsInput(event) {
    state.loops = parseInt(event.target.value, 10);
    loopsValue.textContent = state.loops.toString();
    updateObservables();
    if (prefersReducedMotion) {
      draw();
    }
  }

  function handleFieldInput(event) {
    state.field = parseFloat(event.target.value);
    fieldValue.textContent = state.field.toFixed(2);
    updateObservables();
    if (prefersReducedMotion) {
      draw();
    }
  }

  function init() {
    setCanvasSize();
    updateObservables();
    draw();
    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(animate);
    }
  }

  energyInput.addEventListener('input', handleEnergyInput);
  loopsInput.addEventListener('input', handleLoopsInput);
  fieldInput.addEventListener('input', handleFieldInput);

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setCanvasSize();
      draw();
    }, 150);
  });

  window.addEventListener('pagehide', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  });

  init();
})();
