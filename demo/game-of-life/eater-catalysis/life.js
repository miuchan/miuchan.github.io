(function () {
  const canvas = document.getElementById('life');
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const CELL_SIZE = 12;
  const COLS = Math.floor(canvas.width / CELL_SIZE);
  const ROWS = Math.floor(canvas.height / CELL_SIZE);
  const STEP_INTERVAL = 120;
  const CYCLE_LENGTH = 120;

  const eaterPattern = [
    [0, 0], [0, 1], [1, 0], [2, 2], [3, 1], [3, 2]
  ];

  const gliderPattern = [
    [1, 0], [2, 1], [0, 2], [1, 2], [2, 2]
  ];

  const eaterOrigin = { x: 36, y: 20 };
  const gliderOrigin = { x: 20, y: 4 };
  const resetColumn = eaterOrigin.x - 4;

  class GameOfLife {
    constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.grid = GameOfLife.createMatrix(rows, cols);
      this.buffer = GameOfLife.createMatrix(rows, cols);
    }

    static createMatrix(rows, cols) {
      return Array.from({ length: rows }, () => new Array(cols).fill(0));
    }

    clear() {
      this.grid.forEach((row) => row.fill(0));
      this.buffer.forEach((row) => row.fill(0));
    }

    clearRegion(x0, y0, width, height) {
      const xMin = Math.max(0, x0);
      const yMin = Math.max(0, y0);
      const xMax = Math.min(this.cols, x0 + width);
      const yMax = Math.min(this.rows, y0 + height);

      for (let y = yMin; y < yMax; y += 1) {
        for (let x = xMin; x < xMax; x += 1) {
          this.grid[y][x] = 0;
          this.buffer[y][x] = 0;
        }
      }
    }

    applyPattern(pattern, offsetX, offsetY) {
      for (const [dx, dy] of pattern) {
        const x = offsetX + dx;
        const y = offsetY + dy;
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
          this.grid[y][x] = 1;
        }
      }
    }

    step() {
      for (let y = 0; y < this.rows; y += 1) {
        for (let x = 0; x < this.cols; x += 1) {
          let neighbours = 0;

          for (let dy = -1; dy <= 1; dy += 1) {
            const ny = y + dy;
            if (ny < 0 || ny >= this.rows) continue;

            for (let dx = -1; dx <= 1; dx += 1) {
              if (dx === 0 && dy === 0) continue;
              const nx = x + dx;
              if (nx < 0 || nx >= this.cols) continue;
              neighbours += this.grid[ny][nx];
            }
          }

          const alive = this.grid[y][x] === 1;
          if (alive) {
            this.buffer[y][x] = neighbours === 2 || neighbours === 3 ? 1 : 0;
          } else {
            this.buffer[y][x] = neighbours === 3 ? 1 : 0;
          }
        }
      }

      const temp = this.grid;
      this.grid = this.buffer;
      this.buffer = temp;
    }

    get state() {
      return this.grid;
    }
  }

  class LifeRenderer {
    constructor(canvasElement, context, cellSize, highlightArea) {
      this.canvas = canvasElement;
      this.ctx = context;
      this.cellSize = cellSize;
      this.highlightArea = highlightArea;
      this.colors = {
        base: 'rgba(56, 189, 248, 0.9)',
        highlight: 'rgba(165, 243, 252, 0.9)'
      };
    }

    draw(grid) {
      const rows = grid.length;
      const cols = rows > 0 ? grid[0].length : 0;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const gradient = this.ctx.createRadialGradient(
        this.canvas.width * 0.35,
        this.canvas.height * 0.3,
        20,
        this.canvas.width * 0.5,
        this.canvas.height * 0.5,
        this.canvas.width * 0.65
      );
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
      gradient.addColorStop(1, 'rgba(2, 6, 23, 1)');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
      this.ctx.lineWidth = 1;

      for (let x = 0; x <= cols; x += 1) {
        const px = x * this.cellSize + 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(px, 0);
        this.ctx.lineTo(px, this.canvas.height);
        this.ctx.stroke();
      }

      for (let y = 0; y <= rows; y += 1) {
        const py = y * this.cellSize + 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, py);
        this.ctx.lineTo(this.canvas.width, py);
        this.ctx.stroke();
      }

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          if (!grid[y][x]) continue;

          const inHighlight =
            this.highlightArea &&
            x >= this.highlightArea.x0 &&
            x <= this.highlightArea.x1 &&
            y >= this.highlightArea.y0 &&
            y <= this.highlightArea.y1;

          this.ctx.fillStyle = inHighlight ? this.colors.highlight : this.colors.base;
          this.ctx.fillRect(
            x * this.cellSize + 1,
            y * this.cellSize + 1,
            this.cellSize - 2,
            this.cellSize - 2
          );
        }
      }
    }
  }

  class PatternPreviewer {
    constructor(canvases, patterns) {
      this.canvases = Array.from(canvases);
      this.patterns = patterns;
    }

    renderAll() {
      for (const canvas of this.canvases) {
        const key = canvas.dataset.patternPreview;
        const config = this.patterns[key];
        if (!config) continue;
        PatternPreviewer.drawPattern(canvas, config.pattern, config.cellColor);
      }
    }

    static drawPattern(canvas, pattern, cellColor) {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || canvas.width;
      const height = canvas.clientHeight || canvas.height;
      if (!width || !height) {
        return;
      }

      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
      }

      const ctxPreview = canvas.getContext('2d');
      if (!ctxPreview) {
        return;
      }

      ctxPreview.save();
      ctxPreview.setTransform(1, 0, 0, 1, 0, 0);
      ctxPreview.scale(ratio, ratio);
      ctxPreview.clearRect(0, 0, width, height);

      const gradient = ctxPreview.createRadialGradient(
        width * 0.4,
        height * 0.35,
        Math.min(width, height) * 0.15,
        width * 0.5,
        height * 0.6,
        Math.max(width, height) * 0.75
      );
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0.92)');
      ctxPreview.fillStyle = gradient;
      ctxPreview.fillRect(0, 0, width, height);

      const bounds = PatternPreviewer.getPatternBounds(pattern);
      const patternWidth = bounds.maxX - bounds.minX + 1;
      const patternHeight = bounds.maxY - bounds.minY + 1;
      const paddingCells = 2;
      const gridSize = Math.max(patternWidth + paddingCells * 2, patternHeight + paddingCells * 2, 8);
      const cell = Math.min(width, height) / gridSize;
      const margin = cell * 0.18;
      const offsetX = Math.floor((gridSize - patternWidth) / 2) - bounds.minX;
      const offsetY = Math.floor((gridSize - patternHeight) / 2) - bounds.minY;

      ctxPreview.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctxPreview.lineWidth = 1;
      for (let i = 0; i <= gridSize; i += 1) {
        const x = i * cell + 0.5;
        ctxPreview.beginPath();
        ctxPreview.moveTo(x, 0);
        ctxPreview.lineTo(x, height);
        ctxPreview.stroke();
      }
      for (let j = 0; j <= gridSize; j += 1) {
        const y = j * cell + 0.5;
        ctxPreview.beginPath();
        ctxPreview.moveTo(0, y);
        ctxPreview.lineTo(width, y);
        ctxPreview.stroke();
      }

      ctxPreview.fillStyle = cellColor || 'rgba(56, 189, 248, 0.95)';
      for (const [dx, dy] of pattern) {
        const px = (dx + offsetX) * cell;
        const py = (dy + offsetY) * cell;
        ctxPreview.fillRect(px + margin, py + margin, cell - margin * 2, cell - margin * 2);
      }

      ctxPreview.restore();
    }

    static getPatternBounds(pattern) {
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      for (const [dx, dy] of pattern) {
        if (dx < minX) minX = dx;
        if (dx > maxX) maxX = dx;
        if (dy < minY) minY = dy;
        if (dy > maxY) maxY = dy;
      }

      return { minX, maxX, minY, maxY };
    }
  }

  class CatalysisScene {
    constructor(life) {
      this.life = life;
    }

    seed() {
      this.ensureEater();
      this.seedGlider();
    }

    ensureEater() {
      this.life.applyPattern(eaterPattern, eaterOrigin.x, eaterOrigin.y);
    }

    seedGlider() {
      this.life.applyPattern(gliderPattern, gliderOrigin.x, gliderOrigin.y);
    }

    reset() {
      this.life.clear();
      this.seed();
    }

    inject() {
      this.life.clearRegion(0, 0, resetColumn, this.life.rows);
      this.ensureEater();
      this.seedGlider();
    }
  }

  class Simulation {
    constructor({ life, renderer, scene, stepInterval, cycleLength, onGenerationUpdate }) {
      this.life = life;
      this.renderer = renderer;
      this.scene = scene;
      this.stepInterval = stepInterval;
      this.cycleLength = cycleLength;
      this.onGenerationUpdate = onGenerationUpdate;
      this.generation = 0;
      this.lastFrame = 0;
      this.running = false;
      this.tick = this.tick.bind(this);
    }

    reset() {
      this.scene.reset();
      this.generation = 0;
      this.lastFrame = 0;
      this.renderer.draw(this.life.state);
      this.onGenerationUpdate?.(this.generation, this.cycleLength);
    }

    start() {
      if (this.running) {
        return;
      }
      this.running = true;
      requestAnimationFrame(this.tick);
    }

    tick(timestamp) {
      if (!this.running) {
        return;
      }

      if (this.lastFrame === 0) {
        this.lastFrame = timestamp;
      }

      if (timestamp - this.lastFrame >= this.stepInterval) {
        this.lastFrame = timestamp;

        if (this.generation !== 0 && this.generation % this.cycleLength === 0) {
          this.scene.inject();
        }

        this.life.step();
        this.generation += 1;
        this.renderer.draw(this.life.state);
        this.onGenerationUpdate?.(this.generation, this.cycleLength);
      }

      requestAnimationFrame(this.tick);
    }
  }

  const generationLabel = document.querySelector('[data-generation]');
  const countdownLabel = document.querySelector('[data-countdown]');
  const resetButton = document.querySelector('[data-reset]');

  function updateStats(generation, cycleLength) {
    if (generationLabel) {
      generationLabel.textContent = generation.toString();
    }

    if (countdownLabel) {
      const progress = generation % cycleLength;
      const remaining = progress === 0 ? cycleLength : cycleLength - progress;
      countdownLabel.textContent = remaining.toString();
    }
  }

  const life = new GameOfLife(ROWS, COLS);
  const renderer = new LifeRenderer(canvas, ctx, CELL_SIZE, {
    x0: eaterOrigin.x - 1,
    x1: eaterOrigin.x + 4,
    y0: eaterOrigin.y - 1,
    y1: eaterOrigin.y + 4
  });
  const scene = new CatalysisScene(life);

  const patternPreviewer = new PatternPreviewer(document.querySelectorAll('[data-pattern-preview]'), {
    eater: { pattern: eaterPattern, cellColor: 'rgba(165, 243, 252, 0.95)' },
    glider: { pattern: gliderPattern, cellColor: 'rgba(56, 189, 248, 0.95)' }
  });

  const simulation = new Simulation({
    life,
    renderer,
    scene,
    stepInterval: STEP_INTERVAL,
    cycleLength: CYCLE_LENGTH,
    onGenerationUpdate: updateStats
  });

  resetButton?.addEventListener('click', () => {
    simulation.reset();
  });

  window.addEventListener('resize', () => {
    patternPreviewer.renderAll();
  });

  patternPreviewer.renderAll();
  simulation.reset();
  simulation.start();
})();
