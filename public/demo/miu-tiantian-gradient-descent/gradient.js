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
    reset: document.getElementById('reset'),
    scanFixedPoint: document.getElementById('scan-fixed-point'),
    fixedPointStatus: document.getElementById('fixed-point-status'),
    fixedPointMaxStatus: document.getElementById('fixed-point-max-status')
  };

  const config = {
    world: { left: -2.6, right: 2.6, top: 2.1, bottom: -2.1 },
    historyLimit: 600,
    batchSteps: 4,
    maxIterations: 2400
  };

  const searchSettings = {
    learningRate: { min: 0.06, max: 0.36, step: 0.04 },
    momentum: { min: 0.0, max: 0.9, step: 0.15 },
    coherence: { min: 0.0, max: 0.24, step: 0.04 },
    iterations: 180,
    warmup: 60,
    stabilityThreshold: 0.045,
    stabilityConsecutive: 6
  };

  function buildRange({ min, max, step }) {
    const values = [];
    for (let value = min; value <= max + 1e-8; value += step) {
      values.push(Number(value.toFixed(2)));
    }
    return values;
  }

  function clampPoint(point, world) {
    const marginX = (world.right - world.left) * 0.02;
    const marginY = (world.top - world.bottom) * 0.02;
    point.x = Math.min(world.right - marginX, Math.max(world.left + marginX, point.x));
    point.y = Math.min(world.top - marginY, Math.max(world.bottom + marginY, point.y));
  }

  function createDeterministicRandom(seed) {
    let state = Math.floor(seed) % 2147483647;
    if (state <= 0) {
      state += 2147483646;
    }
    return function () {
      state = (state * 16807) % 2147483647;
      return (state - 1) / 2147483646;
    };
  }

  function combinationSeed(base, parameters) {
    const lr = Math.round(parameters.learningRate * 100);
    const momentum = Math.round(parameters.momentum * 100);
    const coherence = Math.round(parameters.coherence * 100);
    return base + lr * 97 + momentum * 193 + coherence * 389;
  }

  function evaluateCombination(field, world, start, parameters, options) {
    const {
      iterations,
      warmup,
      stabilityThreshold = 0.045,
      stabilityConsecutive = 6
    } = options;
    const random = createDeterministicRandom(options.seed);
    const position = { x: start.x, y: start.y };
    const velocity = { x: 0, y: 0 };
    let accumulated = 0;
    let samples = 0;
    let energy = field.evaluate(position.x, position.y).value;
    let stabilizedIteration = null;
    let consecutiveStable = 0;

    for (let i = 0; i < iterations; i += 1) {
      const { gx, gy } = field.evaluate(position.x, position.y);
      const noiseScale = parameters.coherence * Math.sqrt(parameters.learningRate);
      const noiseX = (random() * 2 - 1) * noiseScale;
      const noiseY = (random() * 2 - 1) * noiseScale;

      velocity.x = parameters.momentum * velocity.x - parameters.learningRate * gx + noiseX;
      velocity.y = parameters.momentum * velocity.y - parameters.learningRate * gy + noiseY;

      position.x += velocity.x;
      position.y += velocity.y;
      clampPoint(position, world);

      const { value } = field.evaluate(position.x, position.y);
      energy = value;
      const stepMagnitude = Math.hypot(velocity.x, velocity.y);

      if (i >= warmup) {
        accumulated += stepMagnitude;
        samples += 1;
        if (stepMagnitude < stabilityThreshold) {
          consecutiveStable += 1;
          if (consecutiveStable >= stabilityConsecutive && stabilizedIteration === null) {
            stabilizedIteration = i + 1;
          }
        } else {
          consecutiveStable = 0;
        }
      }
    }

    const averageStep = samples > 0 ? accumulated / samples : 0;
    const finalStep = Math.hypot(velocity.x, velocity.y);
    return {
      averageStep,
      energy,
      position: { x: position.x, y: position.y },
      stabilizedIteration,
      finalStep
    };
  }

  function compareGreatestFixedPoint(a, b) {
    const epsilon = 1e-4;
    if (a.energy > b.energy + epsilon) return 1;
    if (a.energy < b.energy - epsilon) return -1;

    const aIterations = a.stabilizedIteration ?? -Infinity;
    const bIterations = b.stabilizedIteration ?? -Infinity;
    if (aIterations > bIterations) return 1;
    if (aIterations < bIterations) return -1;

    if (a.averageStep > b.averageStep + epsilon) return 1;
    if (a.averageStep < b.averageStep - epsilon) return -1;

    if (a.finalStep > b.finalStep + epsilon) return 1;
    if (a.finalStep < b.finalStep - epsilon) return -1;

    return 0;
  }

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
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        const first = state.path[0];
        ctx.moveTo(this.toCanvasX(first.x), this.toCanvasY(first.y));
        for (let i = 1; i < state.path.length - 1; i += 1) {
          const current = state.path[i];
          const next = state.path[i + 1];
          const controlX = this.toCanvasX(current.x);
          const controlY = this.toCanvasY(current.y);
          const endX = (controlX + this.toCanvasX(next.x)) / 2;
          const endY = (controlY + this.toCanvasY(next.y)) / 2;
          ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        }

        const last = state.path[state.path.length - 1];
        ctx.lineTo(this.toCanvasX(last.x), this.toCanvasY(last.y));
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

  function ensureValue(values, value) {
    const rounded = Number(value.toFixed(2));
    if (!values.some((candidate) => Math.abs(candidate - rounded) < 1e-6)) {
      values.push(rounded);
      values.sort((a, b) => a - b);
    }
  }

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
    DOM.fixedPointMaxStatus.textContent = '最大不动点尚未计算。';
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

  DOM.scanFixedPoint.addEventListener('click', () => {
    runner.stop();
    updateRunLabel(false);
    DOM.fixedPointStatus.textContent = '正在探索学习率、动量与协同噪声的平衡……';
    DOM.fixedPointMaxStatus.textContent = '最大不动点计算中……';

    const startPoint = simulation.state.iterations > 0
      ? { x: simulation.state.position.x, y: simulation.state.position.y }
      : { x: simulation.state.start.x, y: simulation.state.start.y };
    const baselineParameters = panel.getParameters();
    const baseSeed = Math.floor((startPoint.x + 5) * 7919 + (startPoint.y + 5) * 1543) + 17;

    const learningRates = buildRange(searchSettings.learningRate);
    const momenta = buildRange(searchSettings.momentum);
    const coherences = buildRange(searchSettings.coherence);

    ensureValue(learningRates, baselineParameters.learningRate);
    ensureValue(momenta, baselineParameters.momentum);
    ensureValue(coherences, baselineParameters.coherence);

    const searchOptions = {
      iterations: searchSettings.iterations,
      warmup: searchSettings.warmup,
      stabilityThreshold: searchSettings.stabilityThreshold,
      stabilityConsecutive: searchSettings.stabilityConsecutive
    };

    window.setTimeout(() => {
      const baselineResult = evaluateCombination(
        field,
        config.world,
        startPoint,
        baselineParameters,
        {
          ...searchOptions,
          seed: combinationSeed(baseSeed, baselineParameters)
        }
      );

      let best = null;
      let greatestFixed = null;

      for (const lr of learningRates) {
        for (const momentum of momenta) {
          for (const coherence of coherences) {
            const parameters = { learningRate: lr, momentum, coherence };
            const result = evaluateCombination(
              field,
              config.world,
              startPoint,
              parameters,
              {
                ...searchOptions,
                seed: combinationSeed(baseSeed, parameters)
              }
            );

            if (!best ||
              result.averageStep < best.averageStep - 1e-4 ||
              (Math.abs(result.averageStep - best.averageStep) <= 1e-4 && result.energy < best.energy - 1e-4)) {
              best = {
                ...parameters,
                ...result
              };
            }

            if (result.stabilizedIteration !== null) {
              const candidate = {
                ...parameters,
                ...result
              };
              if (!greatestFixed || compareGreatestFixedPoint(candidate, greatestFixed) > 0) {
                greatestFixed = candidate;
              }
            }
          }
        }
      }

      let selection;
      const improvement = best
        ? baselineResult.averageStep - best.averageStep
        : 0;

      if (!best || improvement <= 1e-3) {
        selection = { ...baselineParameters, ...baselineResult, baseline: true };
      } else {
        selection = { ...best, baseline: false };
      }

      DOM.learningRate.value = selection.learningRate.toFixed(2);
      DOM.momentum.value = selection.momentum.toFixed(2);
      DOM.coherence.value = selection.coherence.toFixed(2);
      panel.updateSliders();

      if (selection.baseline) {
        DOM.fixedPointStatus.textContent = `当前组合已近似不动点：学习率 ${selection.learningRate.toFixed(2)}、动量 ${selection.momentum.toFixed(2)}、协同噪声 ${selection.coherence.toFixed(2)}，平均步长约 ${selection.averageStep.toFixed(3)}，势能 ${selection.energy.toFixed(3)}。`;
      } else {
        const delta = Math.max(improvement, 0);
        DOM.fixedPointStatus.textContent = `找到更稳态的组合：学习率 ${selection.learningRate.toFixed(2)}、动量 ${selection.momentum.toFixed(2)}、协同噪声 ${selection.coherence.toFixed(2)}，平均步长 ${selection.averageStep.toFixed(3)}，较当前减少 ${delta.toFixed(3)}，势能 ${selection.energy.toFixed(3)}。`;
      }

      if (greatestFixed) {
        const iterationText = greatestFixed.stabilizedIteration !== null
          ? `${greatestFixed.stabilizedIteration}`
          : '—';
        DOM.fixedPointMaxStatus.textContent = `最大不动点：学习率 ${greatestFixed.learningRate.toFixed(2)}、动量 ${greatestFixed.momentum.toFixed(2)}、协同噪声 ${greatestFixed.coherence.toFixed(2)}，稳定迭代 ${iterationText}，平均步长 ${greatestFixed.averageStep.toFixed(3)}，势能 ${greatestFixed.energy.toFixed(3)}，终端步长 ${greatestFixed.finalStep.toFixed(3)}。`;
      } else {
        DOM.fixedPointMaxStatus.textContent = '在给定的稳定阈值下未找到最大不动点组合。';
      }

      renderer.draw(simulation.state);
    }, 30);
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
