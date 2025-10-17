(function () {
  const canvas = document.getElementById('feather-canvas');
  const ctx = canvas.getContext('2d');

  const DOM = {
    learningRate: document.getElementById('learning-rate'),
    damping: document.getElementById('damping'),
    depth: document.getElementById('depth'),
    echo: document.getElementById('echo'),
    lookahead: document.getElementById('lookahead'),
    learningRateValue: document.getElementById('learning-rate-value'),
    dampingValue: document.getElementById('damping-value'),
    depthValue: document.getElementById('depth-value'),
    echoValue: document.getElementById('echo-value'),
    lookaheadValue: document.getElementById('lookahead-value'),
    residual: document.getElementById('residual'),
    iterations: document.getElementById('iterations'),
    step: document.getElementById('step'),
    consistency: document.getElementById('consistency'),
    run: document.getElementById('run'),
    singleStep: document.getElementById('single-step'),
    reset: document.getElementById('reset')
  };

  const config = {
    world: { left: -2.8, right: 2.8, top: 2.4, bottom: -2.4 },
    historyLimit: 720,
    batchSteps: 3,
    maxIterations: 2600
  };

  class FeatherMap {
    constructor() {
      this.params = {
        alpha: 0.84,
        beta: 0.28,
        gamma: 0.76,
        delta: 0.26,
        coupling: 0.19,
        phase1: 0.9,
        phase2: 0.4,
        phase3: 0.6,
        phase4: 1.1,
        swirl1: 0.12,
        swirl2: 0.1
      };
    }

    components(x, y) {
      const {
        alpha,
        beta,
        gamma,
        delta,
        coupling,
        phase1,
        phase2,
        phase3,
        phase4,
        swirl1,
        swirl2
      } = this.params;

      const sinY = Math.sin(y);
      const sinX = Math.sin(x);
      const cosY = Math.cos(y);
      const cosX = Math.cos(x);

      const tanhA = Math.tanh(y - 0.6 * x);
      const tanhB = Math.tanh(x + 0.35 * y);
      const sech2A = 1 - tanhA * tanhA;
      const sech2B = 1 - tanhB * tanhB;

      const swirl = Math.sin(phase1 * x + phase2 * y);
      const swirlCos = Math.cos(phase1 * x + phase2 * y);

      const drift = Math.sin(phase3 * x - phase4 * y);
      const driftCos = Math.cos(phase3 * x - phase4 * y);

      const residualX =
        alpha * sinY -
        beta * x * x * x +
        coupling * tanhA +
        swirl1 * swirl +
        0.05 * y -
        0.02 * x;

      const residualY =
        gamma * sinX -
        delta * y * y * y +
        coupling * tanhB -
        swirl2 * drift +
        0.04 * x -
        0.03 * y;

      const dResidualXdx =
        -3 * beta * x * x +
        coupling * sech2A * -0.6 +
        swirl1 * phase1 * swirlCos -
        0.02;

      const dResidualXdy =
        alpha * cosY +
        coupling * sech2A * 1 +
        swirl1 * phase2 * swirlCos +
        0.05;

      const dResidualYdx =
        gamma * cosX +
        coupling * sech2B * 1 -
        swirl2 * phase3 * driftCos +
        0.04;

      const dResidualYdy =
        -3 * delta * y * y +
        coupling * sech2B * 0.35 +
        swirl2 * phase4 * driftCos -
        0.03;

      const mapX = x + residualX;
      const mapY = y + residualY;

      return {
        residual: { x: residualX, y: residualY },
        partials: {
          dResidualXdx,
          dResidualXdy,
          dResidualYdx,
          dResidualYdy
        },
        map: { x: mapX, y: mapY }
      };
    }

    evaluate(x, y) {
      const base = this.components(x, y);
      const { residual, partials, map } = base;

      const gradientX = residual.x * partials.dResidualXdx + residual.y * partials.dResidualYdx;
      const gradientY = residual.x * partials.dResidualXdy + residual.y * partials.dResidualYdy;

      const energy = 0.5 * (residual.x * residual.x + residual.y * residual.y);

      const next = this.components(map.x, map.y);
      const consistency = Math.hypot(next.map.x - map.x, next.map.y - map.y);

      return {
        residual,
        gradient: { x: gradientX, y: gradientY },
        energy,
        map,
        consistency
      };
    }

    palette(t) {
      const clamped = Math.min(1, Math.max(0, t));
      if (clamped < 0.5) {
        const ratio = clamped / 0.5;
        const from = [18, 44, 90];
        const to = [74, 210, 255];
        const r = Math.round(from[0] + (to[0] - from[0]) * ratio);
        const g = Math.round(from[1] + (to[1] - from[1]) * ratio);
        const b = Math.round(from[2] + (to[2] - from[2]) * ratio);
        return [r, g, b];
      }
      const ratio = (clamped - 0.5) / 0.5;
      const from = [74, 210, 255];
      const to = [255, 142, 120];
      const r = Math.round(from[0] + (to[0] - from[0]) * ratio);
      const g = Math.round(from[1] + (to[1] - from[1]) * ratio);
      const b = Math.round(from[2] + (to[2] - from[2]) * ratio);
      return [r, g, b];
    }

    createSurface(width, height, world) {
      const values = new Float32Array(width * height);
      let min = Infinity;
      let max = -Infinity;

      for (let y = 0; y < height; y += 1) {
        const wy = world.top - (y / (height - 1)) * (world.top - world.bottom);
        for (let x = 0; x < width; x += 1) {
          const wx = world.left + (x / (width - 1)) * (world.right - world.left);
          const { energy } = this.evaluate(wx, wy);
          const idx = y * width + x;
          values[idx] = energy;
          if (energy < min) min = energy;
          if (energy > max) max = energy;
        }
      }

      const range = max - min || 1;
      const image = ctx.createImageData(width, height);

      for (let i = 0; i < values.length; i += 1) {
        const normalized = (values[i] - min) / range;
        const shaped = Math.pow(normalized, 0.65);
        const [r, g, b] = this.palette(shaped);
        const base = i * 4;
        image.data[base] = r;
        image.data[base + 1] = g;
        image.data[base + 2] = b;
        image.data[base + 3] = 255;
      }

      return image;
    }
  }

  class RecursiveDescent {
    constructor(field, world, config) {
      this.field = field;
      this.world = world;
      this.config = config;
      this.state = {
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        iterations: 0,
        residual: 0,
        energy: 0,
        consistency: 0,
        map: { x: 0, y: 0 },
        path: [],
        start: { x: 0, y: 0 }
      };
    }

    randomize() {
      const { left, right, top, bottom } = this.world;
      const x = Math.random() * (right - left) + left;
      const y = Math.random() * (top - bottom) + bottom;
      const evaluation = this.field.evaluate(x, y);

      this.state.position = { x, y };
      this.state.velocity = { x: 0, y: 0 };
      this.state.iterations = 0;
      this.state.residual = Math.hypot(evaluation.residual.x, evaluation.residual.y);
      this.state.energy = evaluation.energy;
      this.state.consistency = evaluation.consistency;
      this.state.map = evaluation.map;
      this.state.path = [{ x, y }];
      this.state.start = { x, y };

      return this.state;
    }

    clamp() {
      const marginX = (this.world.right - this.world.left) * 0.02;
      const marginY = (this.world.top - this.world.bottom) * 0.02;
      this.state.position.x = Math.min(
        this.world.right - marginX,
        Math.max(this.world.left + marginX, this.state.position.x)
      );
      this.state.position.y = Math.min(
        this.world.top - marginY,
        Math.max(this.world.bottom + marginY, this.state.position.y)
      );
    }

    recursiveGradient(position, parameters, evaluation) {
      const { depth, echo, lookahead, baseScale } = parameters;

      const recurse = (pos, remaining, scale, cachedEval) => {
        const evalResult = cachedEval ?? this.field.evaluate(pos.x, pos.y);
        const { gradient } = evalResult;
        if (remaining === 0 || echo === 0) {
          return { x: gradient.x, y: gradient.y };
        }

        const stepX = scale * gradient.x;
        const stepY = scale * gradient.y;
        const nextPos = { x: pos.x - stepX, y: pos.y - stepY };
        const nextEval = this.field.evaluate(nextPos.x, nextPos.y);
        const deeper = recurse(nextPos, remaining - 1, scale * lookahead, nextEval);

        return {
          x: (1 - echo) * gradient.x + echo * deeper.x,
          y: (1 - echo) * gradient.y + echo * deeper.y
        };
      };

      return recurse(position, depth, baseScale, evaluation);
    }

    step(parameters) {
      const { learningRate, damping, depth, echo, lookahead } = parameters;
      const evaluation = this.field.evaluate(this.state.position.x, this.state.position.y);

      const gradient = this.recursiveGradient(
        this.state.position,
        {
          depth,
          echo,
          lookahead,
          baseScale: learningRate * lookahead
        },
        evaluation
      );

      const { velocity, position } = this.state;

      velocity.x = damping * velocity.x - learningRate * gradient.x;
      velocity.y = damping * velocity.y - learningRate * gradient.y;

      position.x += velocity.x;
      position.y += velocity.y;
      this.clamp();

      const after = this.field.evaluate(position.x, position.y);

      this.state.residual = Math.hypot(after.residual.x, after.residual.y);
      this.state.energy = after.energy;
      this.state.consistency = after.consistency;
      this.state.map = after.map;
      this.state.iterations += 1;

      this.state.path.push({ x: position.x, y: position.y });
      if (this.state.path.length > this.config.historyLimit) {
        this.state.path.shift();
      }

      return Math.hypot(velocity.x, velocity.y);
    }
  }

  class FeatherRenderer {
    constructor(context, canvas, world, surface) {
      this.ctx = context;
      this.canvas = canvas;
      this.world = world;
      this.surface = surface;
    }

    toCanvasX(x) {
      return ((x - this.world.left) / (this.world.right - this.world.left)) * this.canvas.width;
    }

    toCanvasY(y) {
      return ((this.world.top - y) / (this.world.top - this.world.bottom)) * this.canvas.height;
    }

    draw(state) {
      const { ctx } = this;
      if (this.surface) {
        ctx.putImageData(this.surface, 0, 0);
      } else {
        ctx.fillStyle = '#0a0714';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }

      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      for (let gx = this.world.left; gx <= this.world.right; gx += 1) {
        const cx = this.toCanvasX(gx);
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, this.canvas.height);
        ctx.stroke();
      }
      for (let gy = Math.ceil(this.world.bottom); gy <= this.world.top; gy += 1) {
        const cy = this.toCanvasY(gy);
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(this.canvas.width, cy);
        ctx.stroke();
      }
      ctx.restore();

      if (state.path.length > 1) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        const first = state.path[0];
        ctx.moveTo(this.toCanvasX(first.x), this.toCanvasY(first.y));
        for (let i = 1; i < state.path.length; i += 1) {
          const point = state.path[i];
          ctx.lineTo(this.toCanvasX(point.x), this.toCanvasY(point.y));
        }
        ctx.stroke();
      }

      const currentX = this.toCanvasX(state.position.x);
      const currentY = this.toCanvasY(state.position.y);
      const mapX = this.toCanvasX(state.map.x);
      const mapY = this.toCanvasY(state.map.y);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(mapX, mapY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ffa4d0';
      ctx.beginPath();
      ctx.arc(this.toCanvasX(state.start.x), this.toCanvasY(state.start.y), 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(currentX, currentY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(255, 158, 179, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mapX, mapY, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  class ControlPanel {
    constructor(dom) {
      this.dom = dom;
    }

    getParameters() {
      return {
        learningRate: parseFloat(this.dom.learningRate.value),
        damping: parseFloat(this.dom.damping.value),
        depth: parseInt(this.dom.depth.value, 10),
        echo: parseFloat(this.dom.echo.value),
        lookahead: parseFloat(this.dom.lookahead.value)
      };
    }

    updateReadout(state, stepSize) {
      this.dom.residual.textContent = state.residual.toFixed(3);
      this.dom.iterations.textContent = state.iterations;
      this.dom.step.textContent = stepSize.toFixed(2);
      this.dom.consistency.textContent = state.consistency.toFixed(3);
    }

    updateSliders() {
      this.dom.learningRateValue.textContent = Number(this.dom.learningRate.value).toFixed(2);
      this.dom.dampingValue.textContent = Number(this.dom.damping.value).toFixed(2);
      this.dom.depthValue.textContent = this.dom.depth.value;
      this.dom.echoValue.textContent = Number(this.dom.echo.value).toFixed(2);
      this.dom.lookaheadValue.textContent = Number(this.dom.lookahead.value).toFixed(2);
    }

    bindSliderUpdates() {
      const updateNumber = (input, label, formatter) => {
        label.textContent = formatter(input.value);
      };

      this.dom.learningRate.addEventListener('input', () =>
        updateNumber(this.dom.learningRate, this.dom.learningRateValue, (v) => Number(v).toFixed(2))
      );
      this.dom.damping.addEventListener('input', () =>
        updateNumber(this.dom.damping, this.dom.dampingValue, (v) => Number(v).toFixed(2))
      );
      this.dom.depth.addEventListener('input', () =>
        updateNumber(this.dom.depth, this.dom.depthValue, (v) => v)
      );
      this.dom.echo.addEventListener('input', () =>
        updateNumber(this.dom.echo, this.dom.echoValue, (v) => Number(v).toFixed(2))
      );
      this.dom.lookahead.addEventListener('input', () =>
        updateNumber(this.dom.lookahead, this.dom.lookaheadValue, (v) => Number(v).toFixed(2))
      );
    }
  }

  class Runner {
    constructor(simulation, renderer, panel, config, onStateChange) {
      this.simulation = simulation;
      this.renderer = renderer;
      this.panel = panel;
      this.config = config;
      this.animationFrame = null;
      this.running = false;
      this.onStateChange = onStateChange;
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.onStateChange?.(this.running);
      this.loop();
    }

    stop() {
      this.running = false;
      cancelAnimationFrame(this.animationFrame);
      this.onStateChange?.(this.running);
    }

    toggle() {
      if (this.running) {
        this.stop();
      } else {
        this.start();
      }
    }

    loop() {
      if (!this.running) return;

      const parameters = this.panel.getParameters();
      let stepSize = 0;
      for (let i = 0; i < this.config.batchSteps; i += 1) {
        stepSize = this.simulation.step(parameters);
      }

      this.panel.updateReadout(this.simulation.state, stepSize);
      this.renderer.draw(this.simulation.state);

      if (this.simulation.state.iterations > this.config.maxIterations) {
        this.stop();
        return;
      }

      this.animationFrame = requestAnimationFrame(() => this.loop());
    }
  }

  const field = new FeatherMap();
  const surface = field.createSurface(canvas.width, canvas.height, config.world);
  const simulation = new RecursiveDescent(field, config.world, config);
  const renderer = new FeatherRenderer(ctx, canvas, config.world, surface);
  const panel = new ControlPanel(DOM);

  const updateRunLabel = (running) => {
    const isRunning = typeof running === 'boolean' ? running : runner.running;
    DOM.run.textContent = isRunning
      ? '暂停羽光'
      : simulation.state.iterations > 0
        ? '继续羽光'
        : '启动羽光下降';
  };

  const runner = new Runner(simulation, renderer, panel, config, (running) => {
    updateRunLabel(running);
  });

  function resetSimulation() {
    simulation.randomize();
    panel.updateReadout(simulation.state, 0);
    renderer.draw(simulation.state);
    updateRunLabel(false);
  }

  DOM.run.addEventListener('click', () => {
    runner.toggle();
  });

  DOM.singleStep.addEventListener('click', () => {
    if (runner.running) {
      runner.stop();
    }
    const stepSize = simulation.step(panel.getParameters());
    panel.updateReadout(simulation.state, stepSize);
    renderer.draw(simulation.state);
  });

  DOM.reset.addEventListener('click', () => {
    runner.stop();
    resetSimulation();
  });

  panel.bindSliderUpdates();
  panel.updateSliders();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && runner.running) {
      runner.stop();
    }
  });

  resetSimulation();
})();
