(() => {
  const iceCanvas = document.getElementById('iceCanvas');
  const snowCanvas = document.getElementById('snowCanvas');
  const iceCtx = iceCanvas.getContext('2d');
  const snowCtx = snowCanvas.getContext('2d');

  const intensityInput = document.getElementById('intensity');
  const snowInput = document.getElementById('snowDensity');
  const intensityLabel = document.getElementById('intensityLabel');
  const snowLabel = document.getElementById('snowLabel');
  const resetButton = document.getElementById('resetIce');

  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;
  let lastTime = 0;
  let intensityFactor = Number(intensityInput.value) / 100;

  const MAX_DEPTH = 4;
  const MAX_SEGMENTS = 780;

  let segments = [];
  let glows = [];
  let snowflakes = [];

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  class IceSegment {
    constructor(x, y, angle, depth) {
      this.startX = x;
      this.startY = y;
      this.angle = angle;
      this.depth = depth;
      const base = randomRange(70, 170);
      this.length = base * Math.pow(0.72, depth + randomRange(-0.04, 0.04));
      this.speed = randomRange(160, 260) * Math.pow(0.8, depth);
      this.progress = 0;
      this.spawned = false;
    }

    get fullEndX() {
      return this.startX + Math.cos(this.angle) * this.length;
    }

    get fullEndY() {
      return this.startY + Math.sin(this.angle) * this.length;
    }

    update(dt, growthFactor) {
      const delta = (this.speed * growthFactor * dt) / this.length;
      this.progress = Math.min(1, this.progress + delta);
      if (this.progress >= 0.92 && !this.spawned) {
        this.spawned = true;
        this.spawnChildren();
      }
    }

    spawnChildren() {
      const endX = this.fullEndX;
      const endY = this.fullEndY;
      if (this.depth >= MAX_DEPTH) {
        glows.push({
          x: endX,
          y: endY,
          radius: randomRange(22, 46),
          life: 1,
          decay: randomRange(0.85, 1.2)
        });
        return;
      }

      const childCount = Math.random() < 0.4 ? 1 : 2;
      for (let i = 0; i < childCount; i++) {
        const dir = Math.random() > 0.5 ? 1 : -1;
        const branchOffset = randomRange(0.45, 0.9);
        const branchX = this.startX + (endX - this.startX) * branchOffset;
        const branchY = this.startY + (endY - this.startY) * branchOffset;
        const angleOffset = randomRange(0.3, 1.25) * dir;
        spawnSegment(branchX, branchY, this.angle + angleOffset, this.depth + 1);
        glows.push({
          x: branchX,
          y: branchY,
          radius: randomRange(16, 42),
          life: 1,
          decay: randomRange(0.6, 0.95)
        });
      }

      if (Math.random() < 0.5) {
        spawnSegment(endX, endY, this.angle + randomRange(-0.28, 0.28), this.depth + 1);
        glows.push({
          x: endX,
          y: endY,
          radius: randomRange(18, 40),
          life: 1,
          decay: randomRange(0.7, 1.05)
        });
      }
    }

    draw(ctx) {
      const endX = this.startX + Math.cos(this.angle) * this.length * this.progress;
      const endY = this.startY + Math.sin(this.angle) * this.length * this.progress;
      const depthFactor = 1 - this.depth / (MAX_DEPTH + 1);
      const widthFactor = Math.max(0.45, (3.8 - this.depth * 0.7) * (0.55 + 0.45 * (1 - this.progress)));

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(this.startX, this.startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = widthFactor * 1.6;
      ctx.strokeStyle = `rgba(94, 167, 226, ${0.08 + depthFactor * 0.2})`;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.startX, this.startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = widthFactor;
      ctx.shadowBlur = Math.max(0, 14 - this.depth * 3);
      ctx.shadowColor = `rgba(156, 220, 255, ${0.35 + depthFactor * 0.35})`;
      ctx.strokeStyle = `rgba(198, 244, 255, ${0.3 + depthFactor * 0.4})`;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.moveTo(this.startX, this.startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = widthFactor * 0.45;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.18 + depthFactor * 0.32})`;
      ctx.stroke();
    }

    isOutOfBounds(w, h) {
      const ex = this.fullEndX;
      const ey = this.fullEndY;
      return ex < -200 || ex > w + 200 || ey < -200 || ey > h + 200;
    }
  }

  class Snowflake {
    constructor(spawnInView = false) {
      this.reset(spawnInView);
    }

    reset(spawnInView = false) {
      this.x = Math.random() * width;
      this.y = spawnInView ? Math.random() * height : -randomRange(10, height * 0.2 + 40);
      this.radius = randomRange(0.9, 2.8);
      this.speed = randomRange(22, 48);
      this.sway = randomRange(10, 28);
      this.drift = randomRange(0.6, 1.4);
      this.alpha = randomRange(0.35, 0.8);
      this.phase = Math.random() * Math.PI * 2;
    }

    update(dt, wind, fallMultiplier) {
      this.phase += dt * this.drift;
      this.y += this.speed * dt * fallMultiplier;
      this.x += Math.cos(this.phase + this.y * 0.012) * this.sway * dt + wind * dt;

      if (this.y > height + this.radius * 2) {
        this.reset();
      }

      if (this.x < -20) {
        this.x = width + 20;
      } else if (this.x > width + 20) {
        this.x = -20;
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(234, 244, 255, ${this.alpha})`;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      const glowRadius = this.radius * 2.6;
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
      gradient.addColorStop(0, `rgba(240, 252, 255, ${0.22 + this.alpha * 0.35})`);
      gradient.addColorStop(1, 'rgba(240, 252, 255, 0)');
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function spawnSegment(x, y, angle, depth) {
    if (segments.length >= MAX_SEGMENTS) return;
    segments.push(new IceSegment(x, y, angle, depth));
  }

  function seedCracks() {
    segments = [];
    glows = [];
    iceCtx.save();
    iceCtx.globalCompositeOperation = 'source-over';
    iceCtx.globalAlpha = 1;
    iceCtx.fillStyle = 'rgba(4, 12, 22, 1)';
    iceCtx.fillRect(0, 0, width, height);
    iceCtx.restore();

    const baseCount = Math.round(randomRange(5, 8));
    const radius = Math.min(width, height) * randomRange(0.1, 0.16);
    for (let i = 0; i < baseCount; i++) {
      const angle = (Math.PI * 2 * i) / baseCount + randomRange(-0.38, 0.38);
      const distance = radius * randomRange(0.25, 0.9);
      const x = width / 2 + Math.cos(angle) * distance;
      const y = height / 2 + Math.sin(angle) * distance;
      spawnSegment(x, y, angle + randomRange(-0.25, 0.25), 0);
      glows.push({
        x,
        y,
        radius: randomRange(26, 64),
        life: 1,
        decay: randomRange(0.5, 0.8)
      });
    }

    const extraSeeds = Math.round(randomRange(2, 4));
    for (let i = 0; i < extraSeeds; i++) {
      const angle = randomRange(0, Math.PI * 2);
      const distance = Math.min(width, height) * randomRange(0.22, 0.36);
      const x = width / 2 + Math.cos(angle) * distance;
      const y = height / 2 + Math.sin(angle) * distance;
      spawnSegment(x, y, angle + Math.PI + randomRange(-0.4, 0.4), 1);
    }
  }

  function updateGlows(dt) {
    for (let i = glows.length - 1; i >= 0; i--) {
      const glow = glows[i];
      glow.life -= glow.decay * dt;
      if (glow.life <= 0) {
        glows.splice(i, 1);
      }
    }
  }

  function drawGlows(ctx) {
    if (!glows.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (const glow of glows) {
      const radius = glow.radius * (0.7 + (1 - glow.life) * 0.6);
      const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, radius);
      gradient.addColorStop(0, `rgba(212, 248, 255, ${0.18 * glow.life})`);
      gradient.addColorStop(0.45, `rgba(128, 205, 255, ${0.12 * glow.life})`);
      gradient.addColorStop(1, 'rgba(28, 82, 142, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(glow.x, glow.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function updateSnow(timestamp, dt) {
    snowCtx.save();
    snowCtx.setTransform(1, 0, 0, 1, 0, 0);
    snowCtx.clearRect(0, 0, width, height);
    snowCtx.restore();

    const wind = Math.sin(timestamp * 0.00022) * 18 * (0.6 + Math.sin(timestamp * 0.00008) * 0.2);
    const fallMultiplier = 0.75 + intensityFactor * 0.35;

    for (const flake of snowflakes) {
      flake.update(dt, wind, fallMultiplier);
      flake.draw(snowCtx);
    }
  }

  function updateSnowDensity() {
    const target = Math.round(Number(snowInput.value));
    snowLabel.textContent = target;
    if (target > snowflakes.length) {
      const toAdd = target - snowflakes.length;
      for (let i = 0; i < toAdd; i++) {
        snowflakes.push(new Snowflake(true));
      }
    } else if (target < snowflakes.length) {
      snowflakes.splice(target);
    }
  }

  function resize() {
    dpr = Math.min(2.5, window.devicePixelRatio || 1);
    width = window.innerWidth;
    height = window.innerHeight;

    [iceCanvas, snowCanvas].forEach((canvas) => {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    });

    iceCtx.setTransform(1, 0, 0, 1, 0, 0);
    snowCtx.setTransform(1, 0, 0, 1, 0, 0);
    iceCtx.scale(dpr, dpr);
    snowCtx.scale(dpr, dpr);

    for (const flake of snowflakes) {
      flake.reset(true);
    }

    seedCracks();
  }

  function updateIntensity() {
    intensityFactor = Number(intensityInput.value) / 100;
    intensityLabel.textContent = `${intensityFactor.toFixed(2)}×`;
  }

  function animate(timestamp) {
    requestAnimationFrame(animate);
    if (!lastTime) {
      lastTime = timestamp;
      return;
    }

    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    iceCtx.save();
    iceCtx.globalCompositeOperation = 'source-over';
    iceCtx.globalAlpha = 0.18;
    iceCtx.fillStyle = 'rgba(4, 12, 24, 1)';
    iceCtx.fillRect(0, 0, width, height);
    iceCtx.restore();

    for (const segment of segments) {
      segment.update(dt, intensityFactor);
    }
    segments = segments.filter((segment) => !segment.isOutOfBounds(width, height));

    updateGlows(dt);
    drawGlows(iceCtx);

    iceCtx.save();
    iceCtx.globalCompositeOperation = 'lighter';
    for (const segment of segments) {
      segment.draw(iceCtx);
    }
    iceCtx.restore();

    updateSnow(timestamp, dt);
  }

  resetButton.addEventListener('click', () => {
    seedCracks();
  });

  intensityInput.addEventListener('input', () => {
    updateIntensity();
  });

  snowInput.addEventListener('input', () => {
    updateSnowDensity();
  });

  window.addEventListener('resize', () => {
    resize();
    updateSnowDensity();
  });

  updateIntensity();
  resize();
  updateSnowDensity();

  requestAnimationFrame((time) => {
    lastTime = time;
    animate(time);
  });
})();
