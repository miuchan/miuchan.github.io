(function () {
  const canvas = document.getElementById('universe');
  const ctx = canvas.getContext('2d');

  const DOM = {
    learningRate: document.getElementById('learning-rate'),
    momentum: document.getElementById('momentum'),
    coherence: document.getElementById('coherence'),
    learningRateValue: document.getElementById('learning-rate-value'),
    momentumValue: document.getElementById('momentum-value'),
    coherenceValue: document.getElementById('coherence-value'),
    energy: document.getElementById('energy'),
    iterations: document.getElementById('iterations'),
    stepSize: document.getElementById('step-size'),
    run: document.getElementById('run'),
    step: document.getElementById('step'),
    reset: document.getElementById('reset')
  };

  const config = {
    world: { left: -2.6, right: 2.6, top: 2.1, bottom: -2.1 },
    historyLimit: 600,
    batchSteps: 4,
    maxIterations: 2400
  };

  class PotentialField {
    constructor() {
      this.gaussians = [
        { cx: 1.15, cy: -0.4, ax: 1.35, ay: 1.1, weight: -1.6 },
        { cx: -1.28, cy: 0.7, ax: 1.2, ay: 1.45, weight: -1.35 },
        { cx: -0.1, cy: -0.1, ax: 0.7, ay: 0.8, weight: -0.45 },
        { cx: 0.0, cy: 1.45, ax: 0.7, ay: 1.6, weight: 0.35 },
        { cx: 0.0, cy: -1.6, ax: 0.6, ay: 1.3, weight: 0.32 }
      ];
    }

    static gaussianContribution(x, y, { cx, cy, ax, ay, weight }) {
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

    evaluate(x, y) {
      let value = 0;
      let gx = 0;
      let gy = 0;

      for (const gaussian of this.gaussians) {
        const contribution = PotentialField.gaussianContribution(x, y, gaussian);
        value += contribution.value;
        gx += contribution.gx;
        gy += contribution.gy;
      }

      const ridge = x + 0.4 * y;
      value += 0.15 * ridge * ridge;
      gx += 0.3 * ridge;
      gy += 0.12 * ridge;

      const swirl = Math.sin(0.9 * x) * Math.cos(0.7 * y);
      value += 0.55 * swirl;
      gx += 0.55 * 0.9 * Math.cos(0.9 * x) * Math.cos(0.7 * y);
      gy += 0.55 * Math.sin(0.9 * x) * (-0.7) * Math.sin(0.7 * y);

      const radial = x * x + 0.45 * y * y;
      value += 0.12 * radial;
      gx += 0.24 * x;
      gy += 0.108 * y;

      const quarticX = x * x * x * x;
      const quarticY = y * y * y * y;
      value += 0.04 * quarticX + 0.02 * quarticY;
      gx += 0.16 * x * x * x;
      gy += 0.08 * y * y * y;

      return { value, gx, gy };
    }

    palette(t) {
      const clamped = Math.min(1, Math.max(0, t));
      const eased = clamped * clamped * (3 - 2 * clamped);
      const low = [24, 40, 94];
      const high = [255, 138, 255];
      const r = Math.round(low[0] + (high[0] - low[0]) * eased);
      const g = Math.round(low[1] + (high[1] - low[1]) * eased);
      const b = Math.round(low[2] + (high[2] - low[2]) * eased);
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
          const { value } = this.evaluate(wx, wy);
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
        const [r, g, b] = this.palette(t);
        const base = i * 4;
        image.data[base] = r;
        image.data[base + 1] = g;
        image.data[base + 2] = b;
        image.data[base + 3] = 255;
      }

      return image;
    }
  }

  class GradientDescent {
    constructor(field, world, config) {
      this.field = field;
      this.world = world;
      this.config = config;
        this.state = {
          position: { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
          iterations: 0,
          energy: 0,
          path: [],
          start: { x: 0, y: 0 }
        };
    }

    randomize() {
      const { left, right, top, bottom } = this.world;
      const x = Math.random() * (right - left) + left;
      const y = Math.random() * (top - bottom) + bottom;
      this.state.position = { x, y };
      this.state.velocity = { x: 0, y: 0 };
      this.state.iterations = 0;
      this.state.path = [{ x, y }];
      this.state.start = { x, y };
      const { value } = this.field.evaluate(x, y);
      this.state.energy = value;
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

    step(parameters) {
      const { learningRate, momentum, coherence } = parameters;
      const { position, velocity } = this.state;

      const { gx, gy } = this.field.evaluate(position.x, position.y);
      const noiseScale = coherence * Math.sqrt(learningRate);
      const noiseX = (Math.random() * 2 - 1) * noiseScale;
      const noiseY = (Math.random() * 2 - 1) * noiseScale;

      velocity.x = momentum * velocity.x - learningRate * gx + noiseX;
      velocity.y = momentum * velocity.y - learningRate * gy + noiseY;

      position.x += velocity.x;
      position.y += velocity.y;
      this.clamp();

      this.state.path.push({ x: position.x, y: position.y });
      if (this.state.path.length > this.config.historyLimit) {
        this.state.path.shift();
      }

      this.state.iterations += 1;
      const { value } = this.field.evaluate(position.x, position.y);
      this.state.energy = value;

      return Math.hypot(velocity.x, velocity.y);
    }
  }

  class UniverseRenderer {
    constructor(context, canvas, world, surfaceImage) {
      this.ctx = context;
      this.canvas = canvas;
      this.world = world;
      this.surface = surfaceImage;
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
        ctx.fillStyle = '#120e24';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }

      if (state.path.length > 1) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        const first = state.path[0];
        ctx.moveTo(this.toCanvasX(first.x), this.toCanvasY(first.y));
        for (let i = 1; i < state.path.length; i += 1) {
          const point = state.path[i];
          ctx.lineTo(this.toCanvasX(point.x), this.toCanvasY(point.y));
        }
        ctx.stroke();
      }

      ctx.fillStyle = '#ffb3ff';
      ctx.beginPath();
      ctx.arc(this.toCanvasX(state.start.x), this.toCanvasY(state.start.y), 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(this.toCanvasX(state.position.x), this.toCanvasY(state.position.y), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  class ControlPanel {
    constructor(dom) {
      this.dom = dom;
    }

    getParameters() {
      return {
        learningRate: parseFloat(this.dom.learningRate.value),
        momentum: parseFloat(this.dom.momentum.value),
        coherence: parseFloat(this.dom.coherence.value)
      };
    }

    updateReadout(state, stepSize) {
      this.dom.energy.textContent = state.energy.toFixed(3);
      this.dom.iterations.textContent = state.iterations;
      this.dom.stepSize.textContent = stepSize.toFixed(2);
    }

    updateSliders() {
      this.dom.learningRateValue.textContent = Number(this.dom.learningRate.value).toFixed(2);
      this.dom.momentumValue.textContent = Number(this.dom.momentum.value).toFixed(2);
      this.dom.coherenceValue.textContent = Number(this.dom.coherence.value).toFixed(2);
    }

    bindSliderUpdates() {
      const update = (input, label) => {
        label.textContent = Number(input.value).toFixed(2);
      };
      this.dom.learningRate.addEventListener('input', () => update(this.dom.learningRate, this.dom.learningRateValue));
      this.dom.momentum.addEventListener('input', () => update(this.dom.momentum, this.dom.momentumValue));
      this.dom.coherence.addEventListener('input', () => update(this.dom.coherence, this.dom.coherenceValue));
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

  const field = new PotentialField();
  const surface = field.createSurface(canvas.width, canvas.height, config.world);
  const simulation = new GradientDescent(field, config.world, config);
  const renderer = new UniverseRenderer(ctx, canvas, config.world, surface);
  const panel = new ControlPanel(DOM);
  function updateRunLabel(running) {
    const isRunning = typeof running === 'boolean' ? running : runner.running;
    DOM.run.textContent = isRunning
      ? '暂停下降'
      : simulation.state.iterations > 0
        ? '继续下降'
        : '开始下降';
  }

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

  DOM.step.addEventListener('click', () => {
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
