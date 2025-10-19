(function () {
  const canvas = document.getElementById('wormhole-canvas');
  const ctx = canvas.getContext('2d');

  const entanglementInput = document.getElementById('entanglement');
  const curvatureInput = document.getElementById('curvature');
  const coherenceInput = document.getElementById('coherence');

  const entanglementValue = document.getElementById('entanglement-value');
  const curvatureValue = document.getElementById('curvature-value');
  const coherenceValue = document.getElementById('coherence-value');

  const areaReading = document.getElementById('area-reading');
  const entropyReading = document.getElementById('entropy-reading');
  const gainReading = document.getElementById('gain-reading');
  const delayReading = document.getElementById('delay-reading');
  const telemetryStream = document.getElementById('telemetry-stream');

  const state = {
    entanglement: parseFloat(entanglementInput.value),
    curvature: parseFloat(curvatureInput.value),
    coherence: parseFloat(coherenceInput.value)
  };

  let width = canvas.width;
  let height = canvas.height;
  let dpr = window.devicePixelRatio || 1;
  let animationId = null;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || canvas.width;
    height = rect.height || canvas.height;
    dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function updateState() {
    state.entanglement = parseFloat(entanglementInput.value);
    state.curvature = parseFloat(curvatureInput.value);
    state.coherence = parseFloat(coherenceInput.value);

    entanglementValue.textContent = state.entanglement.toFixed(2);
    curvatureValue.textContent = state.curvature.toFixed(2);
    coherenceValue.textContent = state.coherence.toFixed(2);

    updateTelemetry();
  }

  function updateTelemetry() {
    const curvatureMagnitude = Math.abs(state.curvature);
    const throatRadius = 8 + state.entanglement * 22 - curvatureMagnitude * 4.5;
    const area = clamp((4 * Math.PI * Math.pow(throatRadius, 2)) / (1 + curvatureMagnitude * 1.6), 0.12, 240);
    const entropy = area / 4;
    const gainBase = 1 + state.coherence * 2.8 - curvatureMagnitude * 0.75;
    const gain = clamp(gainBase, 0.32, 4.5);
    const delay = clamp(48 / (state.entanglement * state.coherence + 0.14) + curvatureMagnitude * 32, 18, 320);
    const flux = clamp(0.24 + state.entanglement * 0.42 + state.coherence * 0.28 - curvatureMagnitude * 0.12, 0.12, 0.96);

    areaReading.textContent = area.toFixed(2);
    entropyReading.textContent = entropy.toFixed(2);
    gainReading.textContent = gain.toFixed(2);
    delayReading.textContent = Math.round(delay).toString();
    telemetryStream.textContent = `CG-Σ: ${(flux * 100).toFixed(1)}% · Φ: ${state.curvature.toFixed(2)} · χ: ${(state.entanglement * state.coherence * 3.8).toFixed(2)}`;
  }

  function drawWorldline(xBase, amplitude, frequency, phase, color, time) {
    ctx.beginPath();
    for (let y = 0; y <= height; y += 4) {
      const offset = Math.sin(y * frequency + time * 1.4 + phase) * amplitude;
      const x = xBase + offset;
      if (y === 0) {
        ctx.moveTo(x, y + height * 0.06);
      } else {
        ctx.lineTo(x, y + height * 0.06);
      }
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.4;
    ctx.globalAlpha = 0.78;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawWormhole(time) {
    const curvatureMagnitude = Math.abs(state.curvature);
    const throat = clamp(80 + state.entanglement * 140 - curvatureMagnitude * 60, 46, 210);
    const ripple = 0.28 + state.coherence * 0.35;
    const wobble = Math.sin(time * 0.6) * (state.entanglement * 12);

    const leftX = width * 0.5 - throat * 0.5;
    const rightX = width * 0.5 + throat * 0.5;
    const topY = height * 0.12;
    const bottomY = height * 0.92;

    const gradient = ctx.createLinearGradient(leftX, topY, rightX, bottomY);
    gradient.addColorStop(0, 'rgba(129, 140, 248, 0.22)');
    gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.36)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.25)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(leftX, topY + wobble);
    ctx.bezierCurveTo(width * 0.32, height * 0.3, width * 0.32, height * 0.74, leftX, bottomY - wobble);
    ctx.lineTo(rightX, bottomY - wobble);
    ctx.bezierCurveTo(width * 0.68, height * 0.74, width * 0.68, height * 0.3, rightX, topY + wobble);
    ctx.closePath();
    ctx.globalAlpha = 0.72;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.24)';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(width * 0.5, topY + wobble * 0.4);
    ctx.bezierCurveTo(width * 0.46, height * 0.42, width * 0.46, height * 0.62, width * 0.5, bottomY - wobble * 0.4);
    ctx.stroke();
    ctx.setLineDash([]);

    const pulses = 8;
    for (let i = 0; i < pulses; i += 1) {
      const progress = (time * 0.12 + i / pulses + state.coherence * 0.18) % 1;
      const y = topY + progress * (bottomY - topY);
      const x = width * 0.5 + Math.sin(progress * Math.PI * 2 + time * ripple * 1.8) * throat * 0.18;
      const pulseRadius = 6 + state.entanglement * 10 * (1 - progress);
      const pulseGradient = ctx.createRadialGradient(x, y, 0, x, y, pulseRadius);
      pulseGradient.addColorStop(0, 'rgba(250, 204, 21, 0.85)');
      pulseGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = pulseGradient;
      ctx.beginPath();
      ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawQuantumLattice(time) {
    const gridSpacing = 64;
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -gridSpacing; x < width + gridSpacing; x += gridSpacing) {
      ctx.moveTo(x + (time * 10) % gridSpacing, 0);
      ctx.lineTo(x + (time * 10) % gridSpacing, height);
    }
    for (let y = -gridSpacing; y < height + gridSpacing; y += gridSpacing) {
      ctx.moveTo(0, y + (time * 8) % gridSpacing);
      ctx.lineTo(width, y + (time * 8) % gridSpacing);
    }
    ctx.stroke();
  }

  function drawLoops(time) {
    const curvatureMagnitude = Math.abs(state.curvature);
    const baseXLeft = width * 0.22;
    const baseXRight = width * 0.78;
    const amplitude = 28 + state.entanglement * 42;
    const frequency = 0.016 + state.coherence * 0.02;

    drawWorldline(baseXLeft, amplitude, frequency, 0, 'rgba(96, 165, 250, 0.9)', time);
    drawWorldline(baseXRight, amplitude, frequency, Math.PI, 'rgba(129, 140, 248, 0.85)', time);

    ctx.strokeStyle = 'rgba(14, 165, 233, 0.45)';
    ctx.lineWidth = 1.8;
    for (let i = 0; i < 3; i += 1) {
      const offset = (i - 1) * 36;
      const radius = 32 + curvatureMagnitude * 16 + i * 12;
      const centerY = height * 0.32 + offset + Math.sin(time * 1.2 + i) * 6;
      ctx.beginPath();
      ctx.ellipse(baseXLeft + Math.sin(time * 0.6 + i) * 12, centerY, radius, radius * 0.6, Math.sin(time * 0.4 + i) * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(baseXRight + Math.sin(time * 0.6 + i) * 12, centerY + 48, radius, radius * 0.6, Math.sin(time * 0.4 + i + 0.5) * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function draw(time) {
    if (!canvas.isConnected) {
      cancelAnimationFrame(animationId);
      return;
    }

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const background = ctx.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, 'rgba(15, 23, 42, 0.92)');
    background.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    drawQuantumLattice(time * 0.0016);
    drawLoops(time * 0.0011);
    drawWormhole(time * 0.0015);

    ctx.restore();
    animationId = requestAnimationFrame(draw);
  }

  function init() {
    resizeCanvas();
    updateTelemetry();
    animationId = requestAnimationFrame(draw);
  }

  entanglementInput.addEventListener('input', updateState);
  curvatureInput.addEventListener('input', updateState);
  coherenceInput.addEventListener('input', updateState);

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  init();
})();
