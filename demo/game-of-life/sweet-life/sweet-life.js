(() => {
  const canvas = document.getElementById("lifeCanvas");
  const ctx = canvas.getContext("2d");
  const toggleBtn = document.getElementById("toggle");
  const stepBtn = document.getElementById("step");
  const randomBtn = document.getElementById("random");
  const clearBtn = document.getElementById("clear");
  const sweetnessSlider = document.getElementById("sweetness");
  const speedSlider = document.getElementById("speed");
  const statusEl = document.getElementById("status");

  const cellSize = 16;
  const rows = 40;
  const cols = 40;
  const width = cols * cellSize;
  const height = rows * cellSize;

  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(devicePixelRatio, devicePixelRatio);

  let grid = createGrid(rows, cols, 0);
  let buffer = createGrid(rows, cols, 0);
  let running = false;
  let animationFrame = null;
  let lastUpdate = 0;
  let paintActive = false;
  let paintValue = 1;

  const sugarSparkles = Array.from({ length: 60 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 2 + 1,
    o: Math.random() * 0.25 + 0.05,
  }));

  const sliderMax = Number(speedSlider.max);
  let interval = sliderToInterval(Number(speedSlider.value));

  drawGrid();
  updateStatus();

  toggleBtn.addEventListener("click", () => {
    running ? stop() : start();
  });

  stepBtn.addEventListener("click", () => {
    if (!running) {
      advance();
    }
  });

  randomBtn.addEventListener("click", () => {
    if (!running) {
      sprinkleRandom();
    } else {
      sprinkleRandom();
    }
  });

  clearBtn.addEventListener("click", () => {
    stop(true);
    clearGrid(grid);
    drawGrid();
    updateStatus();
  });

  sweetnessSlider.addEventListener("input", () => {
    drawGrid();
    updateStatus();
  });

  speedSlider.addEventListener("input", () => {
    interval = sliderToInterval(Number(speedSlider.value));
    updateStatus();
  });

  canvas.addEventListener("pointerdown", (event) => {
    const cell = getCellFromEvent(event);
    if (!cell) return;
    paintValue = grid[cell.row][cell.col] ? 0 : 1;
    paintActive = true;
    grid[cell.row][cell.col] = paintValue;
    canvas.setPointerCapture(event.pointerId);
    drawGrid();
    updateStatus();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!paintActive) return;
    const cell = getCellFromEvent(event);
    if (!cell) return;
    if (grid[cell.row][cell.col] !== paintValue) {
      grid[cell.row][cell.col] = paintValue;
      drawGrid();
      updateStatus();
    }
  });

  canvas.addEventListener("pointerup", (event) => {
    paintActive = false;
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointerleave", () => {
    paintActive = false;
  });

  canvas.addEventListener("pointercancel", () => {
    paintActive = false;
  });

  function start() {
    running = true;
    toggleBtn.textContent = "暂停撒糖";
    toggleBtn.setAttribute("aria-pressed", "true");
    lastUpdate = performance.now();
    animationFrame = requestAnimationFrame(loop);
    updateStatus();
  }

  function stop(resetLabel = false) {
    running = false;
    toggleBtn.textContent = resetLabel ? "开始撒糖" : "继续撒糖";
    toggleBtn.setAttribute("aria-pressed", "false");
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    updateStatus();
  }

  function loop(timestamp) {
    if (!running) return;
    if (timestamp - lastUpdate >= interval) {
      advance();
      lastUpdate = timestamp;
    }
    animationFrame = requestAnimationFrame(loop);
  }

  function advance() {
    step();
    drawGrid();
    updateStatus();
  }

  function sprinkleRandom() {
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        grid[r][c] = Math.random() < 0.24 ? 1 : 0;
      }
    }
    drawGrid();
    updateStatus();
  }

  function createGrid(r, c, fill) {
    return Array.from({ length: r }, () => Array(c).fill(fill));
  }

  function clearGrid(target) {
    for (let r = 0; r < rows; r += 1) {
      target[r].fill(0);
    }
  }

  function countNeighbors(r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (dr === 0 && dc === 0) continue;
        const rr = (r + dr + rows) % rows;
        const cc = (c + dc + cols) % cols;
        count += grid[rr][cc];
      }
    }
    return count;
  }

  function step() {
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const neighbors = countNeighbors(r, c);
        const alive = grid[r][c] === 1;
        buffer[r][c] = alive ? (neighbors === 2 || neighbors === 3 ? 1 : 0) : neighbors === 3 ? 1 : 0;
      }
    }

    const temp = grid;
    grid = buffer;
    buffer = temp;
  }

  function drawGrid() {
    const sweetness = Number(sweetnessSlider.value);
    const baseGradient = ctx.createLinearGradient(0, 0, width, height);
    baseGradient.addColorStop(0, "rgba(255, 244, 251, 0.92)");
    baseGradient.addColorStop(1, "rgba(230, 250, 255, 0.9)");
    ctx.fillStyle = baseGradient;
    ctx.fillRect(0, 0, width, height);

    drawSparkles();

    const puffiness = 0.85 + sweetness / 200;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = c * cellSize;
        const y = r * cellSize;

        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

        if (grid[r][c] === 1) {
          const hueBase = 330 + (sweetness / 100) * 35;
          const hue = (hueBase + ((r * 7 + c * 11) % 45)) % 360;
          const candy = ctx.createRadialGradient(
            x + cellSize * 0.3,
            y + cellSize * 0.3,
            cellSize * 0.1,
            x + cellSize / 2,
            y + cellSize / 2,
            cellSize * puffiness
          );
          candy.addColorStop(0, `hsla(${hue}, 95%, 95%, 0.95)`);
          candy.addColorStop(0.45, `hsla(${hue}, 82%, ${Math.max(55, 75 - sweetness * 0.25)}%, 0.95)`);
          candy.addColorStop(1, `hsla(${(hue + 25) % 360}, 78%, ${Math.max(40, 60 - sweetness * 0.2)}%, 0.9)`);
          ctx.fillStyle = candy;
          ctx.fillRect(x + 1.2, y + 1.2, cellSize - 2.4, cellSize - 2.4);

          ctx.fillStyle = `hsla(${(hue + 60) % 360}, 95%, 92%, 0.8)`;
          ctx.beginPath();
          ctx.arc(x + cellSize * 0.7, y + cellSize * 0.35, cellSize * 0.14, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = 0.8;
    for (let r = 0; r <= rows; r += 1) {
      const y = r * cellSize + 0.5;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    for (let c = 0; c <= cols; c += 1) {
      const x = c * cellSize + 0.5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    ctx.stroke();
  }

  function drawSparkles() {
    ctx.save();
    for (const sparkle of sugarSparkles) {
      ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.o})`;
      ctx.beginPath();
      ctx.arc(sparkle.x, sparkle.y, sparkle.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function getCellFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const col = Math.floor(((event.clientX - rect.left) * scaleX) / cellSize);
    const row = Math.floor(((event.clientY - rect.top) * scaleY) / cellSize);
    if (col < 0 || col >= cols || row < 0 || row >= rows) {
      return null;
    }
    return { row, col };
  }

  function sliderToInterval(value) {
    const minInterval = 90;
    const maxInterval = 650;
    const ratio = value / sliderMax;
    return maxInterval - (maxInterval - minInterval) * ratio;
  }

  function updateStatus() {
    let alive = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        alive += grid[r][c];
      }
    }
    const density = ((alive / (rows * cols)) * 100).toFixed(1);
    const sweetness = Number(sweetnessSlider.value);
    const beats = (1000 / interval).toFixed(1);
    const mode = running ? "撒糖中" : "糖罐静置";
    statusEl.textContent = `${mode} · 糖果 ${alive} 颗（${density}%） · 甜度 ${sweetness}% · 节奏 ${beats} 次/秒`;
  }
})();
