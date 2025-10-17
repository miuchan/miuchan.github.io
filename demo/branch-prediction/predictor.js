(function () {
  const canvas = document.getElementById('prediction-canvas');
  if (!canvas || !canvas.getContext) {
    return;
  }

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DOM = {
    trace: document.getElementById('trace'),
    predictor: document.getElementById('predictor'),
    history: document.getElementById('history'),
    historyValue: document.getElementById('history-value'),
    historyControl: document.getElementById('history-control'),
    tableSize: document.getElementById('table-size'),
    tableSizeValue: document.getElementById('table-size-value'),
    penaltyInput: document.getElementById('penalty-input'),
    penaltyValue: document.getElementById('penalty-value'),
    predictorHint: document.getElementById('predictor-hint'),
    accuracy: document.getElementById('accuracy'),
    mispredict: document.getElementById('mispredict'),
    windowAccuracy: document.getElementById('window-accuracy'),
    penalty: document.getElementById('penalty'),
    progress: document.getElementById('progress'),
    run: document.getElementById('run'),
    step: document.getElementById('step'),
    reset: document.getElementById('reset'),
    branchTable: document.getElementById('branch-table')
  };

  const predictorHints = {
    alwaysTaken: '永远预测跳转，适合循环占主导的程序，但会对 if/else 造成系统性误判。',
    alwaysNot: '永远预测不跳，面对循环会频繁冲刷，更适合控制流稀疏的代码。',
    btfnt: 'BTFNT：对回退分支预测跳转，对前进分支预测不跳。对自然循环有效，但遇到非典型布局会失手。',
    oneBit: '一位局部分支表：记住每个分支最近一次的真实结果。对尾程 not taken 的循环恢复较慢。',
    twoBit: '二位饱和计数器：四种状态抵抗偶发颠簸，循环里的尾程误判大幅减少。',
    gshare: 'gshare：全局历史与分支地址异或，兼顾跨分支关联与局部性，需要足够的表项避免别名。'
  };

  const config = {
    margin: 32,
    rowGap: 16,
    timelineRows: 3,
    flushPenalty: 12,
    animationInterval: prefersReducedMotion ? 520 : 260,
    branchLabels: ['实际执行', '预测结果', '命中情况']
  };

  const state = {
    trace: [],
    results: [],
    index: 0,
    playing: false,
    lastTimestamp: 0,
    predictor: null,
    predictorType: DOM.predictor.value,
    traceType: DOM.trace.value,
    historyBits: parseInt(DOM.history.value, 10),
    tableSize: roundToPowerOfTwo(parseInt(DOM.tableSize.value, 10)),
    flushPenalty: parseInt(DOM.penaltyInput.value, 10)
  };

  DOM.tableSize.value = state.tableSize.toString();
  DOM.tableSizeValue.textContent = state.tableSize.toString();
  DOM.penaltyValue.textContent = state.flushPenalty.toString();
  DOM.historyValue.textContent = state.historyBits.toString();
  updateHistoryVisibility();
  updatePredictorHint();

  const branchPrograms = {
    loop: createLoopTrace,
    alternating: createAlternatingTrace,
    correlated: createCorrelatedTrace,
    random: createRandomTrace
  };

  function createDeterministicRandom(seed) {
    let state = (seed ^ 0x5f356495) >>> 0;
    return function () {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      state >>>= 0;
      return (state & 0xfffffff) / 0x0fffffff;
    };
  }

  function roundToPowerOfTwo(value) {
    const clamped = Math.max(16, Math.min(512, value));
    const exponent = Math.round(Math.log2(clamped));
    return Math.max(16, Math.min(512, 2 ** exponent));
  }

  function computeIndex(pc, size) {
    const hash = (pc >>> 2) ^ (pc >>> 5) ^ (pc >>> 11) ^ (pc >>> 17);
    return Math.abs(hash) & (size - 1);
  }

  function createPredictor(type, options) {
    switch (type) {
      case 'alwaysTaken':
        return {
          reset() {},
          predict() { return true; },
          update() {}
        };
      case 'alwaysNot':
        return {
          reset() {},
          predict() { return false; },
          update() {}
        };
      case 'btfnt':
        return {
          reset() {},
          predict(event) { return !!event.isBackward; },
          update() {}
        };
      case 'oneBit': {
        const table = new Array(options.tableSize).fill(1);
        return {
          reset() {
            table.fill(1);
          },
          predict(event) {
            const index = computeIndex(event.pc, options.tableSize);
            return table[index] === 1;
          },
          update(event, actual) {
            const index = computeIndex(event.pc, options.tableSize);
            table[index] = actual ? 1 : 0;
          }
        };
      }
      case 'twoBit': {
        const table = new Array(options.tableSize).fill(3);
        return {
          reset() {
            table.fill(3);
          },
          predict(event) {
            const index = computeIndex(event.pc, options.tableSize);
            return table[index] >= 2;
          },
          update(event, actual) {
            const index = computeIndex(event.pc, options.tableSize);
            const value = table[index];
            if (actual) {
              table[index] = value < 3 ? value + 1 : 3;
            } else {
              table[index] = value > 0 ? value - 1 : 0;
            }
          }
        };
      }
      case 'gshare': {
        const table = new Array(options.tableSize).fill(3);
        const mask = options.tableSize - 1;
        let history = 0;
        const historyMask = (1 << options.historyBits) - 1;
        return {
          reset() {
            table.fill(3);
            history = 0;
          },
          predict(event) {
            const hashed = (event.pc >>> 2) & mask;
            const index = (hashed ^ history) & mask;
            return table[index] >= 2;
          },
          update(event, actual) {
            const hashed = (event.pc >>> 2) & mask;
            const index = (hashed ^ history) & mask;
            const value = table[index];
            if (actual) {
              table[index] = value < 3 ? value + 1 : 3;
            } else {
              table[index] = value > 0 ? value - 1 : 0;
            }
            history = ((history << 1) | (actual ? 1 : 0)) & historyMask;
          }
        };
      }
      default:
        return createPredictor('alwaysTaken', options);
    }
  }

  function createLoopTrace() {
    const events = [];
    const loopPc = 0x100;
    const guardPc = 0x118;
    const exitPc = 0x134;

    for (let block = 0; block < 9; block += 1) {
      for (let iter = 0; iter < 8; iter += 1) {
        const taken = iter < 7;
        events.push({
          pc: loopPc,
          label: '循环尾',
          outcome: taken,
          isBackward: true
        });
        const guardOutcome = (iter % 3) === 0;
        events.push({
          pc: guardPc,
          label: '循环内分支',
          outcome: guardOutcome,
          isBackward: false
        });
      }
      const exitOutcome = block % 2 === 0;
      events.push({
        pc: exitPc,
        label: '阶段切换',
        outcome: exitOutcome,
        isBackward: false
      });
    }

    return events;
  }

  function createAlternatingTrace() {
    const events = [];
    const branchA = 0x204;
    const branchB = 0x210;
    const branchLoop = 0x224;

    for (let cycle = 0; cycle < 60; cycle += 1) {
      const outcomeA = cycle % 2 === 0;
      events.push({
        pc: branchA,
        label: '交替 A',
        outcome: outcomeA,
        isBackward: false
      });
      const outcomeB = !outcomeA;
      events.push({
        pc: branchB,
        label: '交替 B',
        outcome: outcomeB,
        isBackward: false
      });
      const loopTaken = cycle % 4 !== 3;
      events.push({
        pc: branchLoop,
        label: '小循环',
        outcome: loopTaken,
        isBackward: true
      });
    }

    return events;
  }

  function createCorrelatedTrace() {
    const events = [];
    const controlPc = 0x300;
    const relatedPc = 0x30c;
    const loopPc = 0x320;
    const rng = createDeterministicRandom(42);
    const truthTable = [false, true, true, false, true, false, false, true];
    let globalHistory = 0b101011;

    const pushEvent = (event) => {
      events.push(event);
      globalHistory = ((globalHistory << 1) | (event.outcome ? 1 : 0)) & 0xff;
    };

    for (let block = 0; block < 60; block += 1) {
      const controlOutcome = rng() > 0.35;
      pushEvent({
        pc: controlPc,
        label: '扰动控制',
        outcome: controlOutcome,
        isBackward: false
      });

      const historyIndex = globalHistory & 0b111;
      const dependentOutcome = truthTable[historyIndex];
      pushEvent({
        pc: relatedPc,
        label: '历史相关',
        outcome: dependentOutcome,
        isBackward: false
      });

      const takenCount = dependentOutcome ? 3 : 1;
      for (let i = 0; i < 4; i += 1) {
        pushEvent({
          pc: loopPc,
          label: '同步回跳',
          outcome: i < takenCount,
          isBackward: true
        });
      }
    }

    return events;
  }

  function createRandomTrace() {
    const events = [];
    const pcs = [0x400, 0x40c, 0x418];
    const labels = ['噪声 A', '噪声 B', '噪声 C'];
    const probabilities = [0.62, 0.38, 0.5];
    const rng = createDeterministicRandom(84);

    for (let i = 0; i < 198; i += 1) {
      const index = i % pcs.length;
      const outcome = rng() < probabilities[index];
      events.push({
        pc: pcs[index],
        label: labels[index],
        outcome,
        isBackward: index === 2 && (i % 5 !== 4)
      });
    }

    return events;
  }

  function initialize() {
    state.predictor = createPredictor(state.predictorType, {
      tableSize: state.tableSize,
      historyBits: state.historyBits
    });
    rebuildTrace();
    resizeCanvas();
  }

  function rebuildTrace() {
    const generator = branchPrograms[state.traceType] || branchPrograms.loop;
    state.trace = generator();
    state.results = [];
    state.index = 0;
    state.predictor.reset?.();
    updateStats();
    render();
  }

  function stepSimulation() {
    if (state.index >= state.trace.length) {
      stopPlaying();
      return;
    }

    const event = state.trace[state.index];
    const prediction = state.predictor.predict(event, state);
    const correct = prediction === event.outcome;
    state.results.push({
      prediction,
      correct,
      event
    });
    state.predictor.update(event, event.outcome);
    state.index += 1;
    updateStats();
    render();
  }

  function updateStats() {
    const total = state.results.length;
    const correct = state.results.reduce((sum, entry) => sum + (entry.correct ? 1 : 0), 0);
    const mispredicts = total - correct;
    const window = state.results.slice(-24);
    const windowCorrect = window.reduce((sum, entry) => sum + (entry.correct ? 1 : 0), 0);
    const windowRate = window.length ? (windowCorrect / window.length) : null;

    DOM.accuracy.textContent = total ? `${((correct / total) * 100).toFixed(1)}%` : '—';
    DOM.mispredict.textContent = mispredicts.toString();
    DOM.windowAccuracy.textContent = windowRate !== null ? `${(windowRate * 100).toFixed(1)}%` : '—';
    const penaltyCost = mispredicts * state.flushPenalty;
    DOM.penalty.textContent = penaltyCost.toString();
    DOM.progress.textContent = `${total} / ${state.trace.length}`;

    updateBranchTable();
  }

  function updateBranchTable() {
    const tbody = DOM.branchTable;
    tbody.innerHTML = '';

    if (!state.results.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 5;
      cell.textContent = '等待执行……';
      row.appendChild(cell);
      tbody.appendChild(row);
      return;
    }

    const summary = new Map();
    for (let i = 0; i < state.results.length; i += 1) {
      const { event } = state.results[i];
      let record = summary.get(event.pc);
      if (!record) {
        record = {
          pc: event.pc,
          label: event.label,
          total: 0,
          misses: 0
        };
        summary.set(event.pc, record);
      }
      record.total += 1;
      if (!state.results[i].correct) {
        record.misses += 1;
      }
    }

    const rows = Array.from(summary.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);

    rows.forEach((entry) => {
      const row = document.createElement('tr');
      const accuracy = entry.total ? 1 - entry.misses / entry.total : 0;

      row.innerHTML = `
        <td>0x${entry.pc.toString(16)}</td>
        <td>${entry.label}</td>
        <td>${entry.total}</td>
        <td>${entry.misses}</td>
        <td>${(accuracy * 100).toFixed(1)}%</td>
      `;
      tbody.appendChild(row);
    });
  }

  function render() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.width;
    const height = rect.height || canvas.height;
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(4, 23, 36, 0.95)');
    gradient.addColorStop(1, 'rgba(3, 9, 18, 0.96)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const timelineWidth = width - config.margin * 2;
    const cellWidth = state.trace.length ? timelineWidth / state.trace.length : timelineWidth;
    const rowHeight = (height - config.margin * 2 - config.rowGap * (config.timelineRows - 1)) / config.timelineRows;

    ctx.textBaseline = 'bottom';
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(200, 238, 255, 0.72)';

    for (let row = 0; row < config.timelineRows; row += 1) {
      const y = config.margin + row * (rowHeight + config.rowGap);
      ctx.fillText(config.branchLabels[row], config.margin - 8, y - 6);
      ctx.strokeStyle = 'rgba(56, 248, 217, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(config.margin, y + rowHeight);
      ctx.lineTo(width - config.margin, y + rowHeight);
      ctx.stroke();
    }

    for (let i = 0; i < state.trace.length; i += 1) {
      const x = config.margin + i * cellWidth;
      const event = state.trace[i];
      const baseY = config.margin;
      const actualColor = event.outcome ? 'rgba(56, 248, 217, 0.75)' : 'rgba(59, 130, 246, 0.75)';
      ctx.fillStyle = actualColor;
      ctx.fillRect(x, baseY, Math.max(1, cellWidth - 1), rowHeight);

      if (i < state.results.length) {
        const result = state.results[i];
        const predictY = baseY + rowHeight + config.rowGap;
        const predictedColor = result.prediction ? 'rgba(34, 197, 147, 0.75)' : 'rgba(14, 165, 233, 0.75)';
        ctx.fillStyle = predictedColor;
        ctx.fillRect(x, predictY, Math.max(1, cellWidth - 1), rowHeight);

        const statusY = predictY + rowHeight + config.rowGap;
        ctx.fillStyle = result.correct ? 'rgba(34, 197, 94, 0.65)' : 'rgba(248, 113, 113, 0.8)';
        ctx.fillRect(x, statusY, Math.max(1, cellWidth - 1), rowHeight);

        if (!result.correct) {
          ctx.strokeStyle = 'rgba(248, 113, 113, 0.9)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, statusY, Math.max(1, cellWidth - 1), rowHeight);
        }
      } else {
        const predictY = baseY + rowHeight + config.rowGap;
        ctx.fillStyle = 'rgba(148, 163, 184, 0.18)';
        ctx.fillRect(x, predictY, Math.max(1, cellWidth - 1), rowHeight * 2 + config.rowGap);
      }
    }

    if (state.index < state.trace.length) {
      const markerX = config.margin + state.index * cellWidth;
      ctx.strokeStyle = 'rgba(56, 248, 217, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(markerX, config.margin - 10);
      ctx.lineTo(markerX, height - config.margin + 10);
      ctx.stroke();
    }
  }

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.width;
    const height = rect.height || canvas.height;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    render();
  }

  function play(timestamp) {
    if (!state.playing) {
      return;
    }
    if (!state.lastTimestamp) {
      state.lastTimestamp = timestamp;
    }
    const delta = timestamp - state.lastTimestamp;
    if (delta >= config.animationInterval) {
      stepSimulation();
      state.lastTimestamp = timestamp;
    }
    if (state.playing) {
      window.requestAnimationFrame(play);
    }
  }

  function startPlaying() {
    if (state.playing) {
      return;
    }
    state.playing = true;
    state.lastTimestamp = 0;
    DOM.run.textContent = '暂停播放';
    window.requestAnimationFrame(play);
  }

  function stopPlaying() {
    if (!state.playing) {
      return;
    }
    state.playing = false;
    DOM.run.textContent = '开始播放';
  }

  function togglePlaying() {
    if (state.playing) {
      stopPlaying();
    } else {
      if (state.index >= state.trace.length) {
        rebuildTrace();
      }
      startPlaying();
    }
  }

  function handleTraceChange() {
    stopPlaying();
    state.traceType = DOM.trace.value;
    rebuildTrace();
  }

  function handlePredictorChange() {
    stopPlaying();
    state.predictorType = DOM.predictor.value;
    updateHistoryVisibility();
    updatePredictorHint();
    state.predictor = createPredictor(state.predictorType, {
      tableSize: state.tableSize,
      historyBits: state.historyBits
    });
    rebuildTrace();
  }

  function updateHistoryVisibility() {
    if (DOM.historyControl) {
      DOM.historyControl.style.display = state.predictorType === 'gshare' ? '' : 'none';
    }
  }

  function updatePredictorHint() {
    const hint = predictorHints[state.predictorType] || '';
    DOM.predictorHint.textContent = hint;
  }

  function handleHistoryChange() {
    stopPlaying();
    state.historyBits = parseInt(DOM.history.value, 10);
    DOM.historyValue.textContent = state.historyBits.toString();
    state.predictor = createPredictor(state.predictorType, {
      tableSize: state.tableSize,
      historyBits: state.historyBits
    });
    rebuildTrace();
  }

  function handleTableSizeChange() {
    stopPlaying();
    state.tableSize = roundToPowerOfTwo(parseInt(DOM.tableSize.value, 10));
    DOM.tableSize.value = state.tableSize.toString();
    DOM.tableSizeValue.textContent = state.tableSize.toString();
    state.predictor = createPredictor(state.predictorType, {
      tableSize: state.tableSize,
      historyBits: state.historyBits
    });
    rebuildTrace();
  }

  function handlePenaltyChange() {
    state.flushPenalty = parseInt(DOM.penaltyInput.value, 10);
    DOM.penaltyValue.textContent = state.flushPenalty.toString();
    updateStats();
  }

  DOM.run.addEventListener('click', togglePlaying);
  DOM.step.addEventListener('click', () => {
    if (state.playing) {
      stopPlaying();
    }
    stepSimulation();
  });
  DOM.reset.addEventListener('click', () => {
    stopPlaying();
    rebuildTrace();
  });
  DOM.trace.addEventListener('change', handleTraceChange);
  DOM.predictor.addEventListener('change', handlePredictorChange);
  DOM.history.addEventListener('input', handleHistoryChange);
  DOM.tableSize.addEventListener('input', handleTableSizeChange);
  DOM.penaltyInput.addEventListener('input', handlePenaltyChange);
  window.addEventListener('resize', resizeCanvas);

  initialize();
})();
