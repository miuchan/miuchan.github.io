(function () {
  const canvas = document.getElementById('life');
  const ctx = canvas.getContext('2d');

  const CELL_SIZE = 12;
  const COLS = Math.floor(canvas.width / CELL_SIZE);
  const ROWS = Math.floor(canvas.height / CELL_SIZE);
  const STEP_INTERVAL = 120; // ms between generations
  const CYCLE_LENGTH = 120;  // generations between new gliders

  const eaterPattern = [
    [0, 0], [0, 1], [1, 0], [2, 2], [3, 1], [3, 2]
  ];
  const gliderPattern = [
    [1, 0], [2, 1], [0, 2], [1, 2], [2, 2]
  ];

  const eaterOrigin = { x: 36, y: 20 };
  const gliderOrigin = { x: 20, y: 4 };
  const resetColumn = eaterOrigin.x - 4; // keep a safe gap when clearing old debris

  let grid = createMatrix(ROWS, COLS);
  let buffer = createMatrix(ROWS, COLS);
  let generation = 0;
  let lastFrame = 0;

  const generationLabel = document.querySelector('[data-generation]');
  const countdownLabel = document.querySelector('[data-countdown]');
  const resetButton = document.querySelector('[data-reset]');

  function createMatrix(rows, cols) {
    return Array.from({ length: rows }, () => new Array(cols).fill(0));
  }

  function clearMatrix(matrix) {
    for (let y = 0; y < matrix.length; y += 1) {
      matrix[y].fill(0);
    }
  }

  function applyPattern(pattern, offsetX, offsetY) {
    for (const [dx, dy] of pattern) {
      const x = offsetX + dx;
      const y = offsetY + dy;
      if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
        grid[y][x] = 1;
      }
    }
  }

  function ensureEater() {
    applyPattern(eaterPattern, eaterOrigin.x, eaterOrigin.y);
  }

  function seedGlider() {
    applyPattern(gliderPattern, gliderOrigin.x, gliderOrigin.y);
  }

  function clearRegion(x0, y0, width, height) {
    const xMax = Math.min(COLS, x0 + width);
    const yMax = Math.min(ROWS, y0 + height);
    for (let y = Math.max(0, y0); y < yMax; y += 1) {
      for (let x = Math.max(0, x0); x < xMax; x += 1) {
        grid[y][x] = 0;
        buffer[y][x] = 0;
      }
    }
  }

  function getPatternBounds(pattern) {
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

  function drawPatternPreview(canvas, pattern, options = {}) {
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

    const bounds = getPatternBounds(pattern);
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

    ctxPreview.fillStyle = options.cellColor || 'rgba(56, 189, 248, 0.95)';
    for (const [dx, dy] of pattern) {
      const px = (dx + offsetX) * cell;
      const py = (dy + offsetY) * cell;
      ctxPreview.fillRect(px + margin, py + margin, cell - margin * 2, cell - margin * 2);
    }

    ctxPreview.restore();
  }

  function renderPatternPreviews() {
    if (!renderPatternPreviews.canvases) {
      const list = document.querySelectorAll('[data-pattern-preview]');
      renderPatternPreviews.canvases = Array.from(list);
    }
    const previews = renderPatternPreviews.canvases;
    const configs = {
      eater: { pattern: eaterPattern, cellColor: 'rgba(165, 243, 252, 0.95)' },
      glider: { pattern: gliderPattern, cellColor: 'rgba(56, 189, 248, 0.95)' }
    };

    for (const canvas of previews) {
      const key = canvas.dataset.patternPreview;
      const config = configs[key];
      if (!config) continue;
      drawPatternPreview(canvas, config.pattern, { cellColor: config.cellColor });
    }
  }

  function step() {
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        let neighbours = 0;
        for (let dy = -1; dy <= 1; dy += 1) {
          const ny = y + dy;
          if (ny < 0 || ny >= ROWS) continue;
          for (let dx = -1; dx <= 1; dx += 1) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            if (nx < 0 || nx >= COLS) continue;
            neighbours += grid[ny][nx];
          }
        }
        const alive = grid[y][x] === 1;
        if (alive) {
          buffer[y][x] = neighbours === 2 || neighbours === 3 ? 1 : 0;
        } else {
          buffer[y][x] = neighbours === 3 ? 1 : 0;
        }
      }
    }
    const temp = grid;
    grid = buffer;
    buffer = temp;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background glow
    const gradient = ctx.createRadialGradient(
      canvas.width * 0.35,
      canvas.height * 0.3,
      20,
      canvas.width * 0.5,
      canvas.height * 0.5,
      canvas.width * 0.65
    );
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
    gradient.addColorStop(1, 'rgba(2, 6, 23, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw faint grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE + 0.5, 0);
      ctx.lineTo(x * CELL_SIZE + 0.5, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y += 1) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE + 0.5);
      ctx.lineTo(canvas.width, y * CELL_SIZE + 0.5);
      ctx.stroke();
    }

    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        if (!grid[y][x]) continue;
        const inEater =
          x >= eaterOrigin.x - 1 &&
          x <= eaterOrigin.x + 4 &&
          y >= eaterOrigin.y - 1 &&
          y <= eaterOrigin.y + 4;
        ctx.fillStyle = inEater ? 'rgba(165, 243, 252, 0.9)' : 'rgba(56, 189, 248, 0.9)';
        ctx.fillRect(
          x * CELL_SIZE + 1,
          y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      }
    }
  }

  function updateUI() {
    if (generationLabel) {
      generationLabel.textContent = generation.toString();
    }
    if (countdownLabel) {
      const progress = generation % CYCLE_LENGTH;
      const remaining = progress === 0 ? CYCLE_LENGTH : CYCLE_LENGTH - progress;
      countdownLabel.textContent = remaining.toString();
    }
  }

  function injectGlider() {
    clearRegion(0, 0, resetColumn, ROWS);
    ensureEater();
    seedGlider();
  }

  function resetSimulation() {
    generation = 0;
    clearMatrix(grid);
    clearMatrix(buffer);
    ensureEater();
    seedGlider();
    updateUI();
    draw();
  }

  function tick(timestamp) {
    if (timestamp - lastFrame < STEP_INTERVAL) {
      requestAnimationFrame(tick);
      return;
    }
    lastFrame = timestamp;

    if (generation !== 0 && generation % CYCLE_LENGTH === 0) {
      injectGlider();
    }

    step();
    generation += 1;
    draw();
    updateUI();

    requestAnimationFrame(tick);
  }

  resetButton?.addEventListener('click', () => {
    resetSimulation();
  });

  // initialise
  ensureEater();
  seedGlider();
  draw();
  updateUI();
  renderPatternPreviews();
  requestAnimationFrame(tick);

  window.addEventListener('resize', () => {
    renderPatternPreviews();
  });
})();
