const villageEl = document.getElementById('village');
const orderFillLeft = document.getElementById('orderFillLeft');
const orderFillRight = document.getElementById('orderFillRight');
const orderValue = document.getElementById('orderValue');
const statusText = document.getElementById('statusText');
const startButton = document.getElementById('startRound');
const commitLeftButton = document.getElementById('commitLeft');
const commitRightButton = document.getElementById('commitRight');
const resetScoreButton = document.getElementById('resetScore');
const noiseRange = document.getElementById('noiseRange');
const biasRange = document.getElementById('biasRange');
const noiseValue = document.getElementById('noiseValue');
const biasValue = document.getElementById('biasValue');
const roundCount = document.getElementById('roundCount');
const successCount = document.getElementById('successCount');
const failureCount = document.getElementById('failureCount');
const avgReaction = document.getElementById('avgReaction');
const logBody = document.getElementById('logBody');

const houses = [
  { id: 'left-tree', side: 'left', label: '左岸树屋', top: 12, left: 13 },
  { id: 'left-forge', side: 'left', label: '雾谷铁匠铺', top: 38, left: 16 },
  { id: 'left-dock', side: 'left', label: '群星码头', top: 66, left: 21 },
  { id: 'right-tree', side: 'right', label: '右岸树屋', top: 12, left: 66 },
  { id: 'right-glass', side: 'right', label: '晴岚玻璃屋', top: 38, left: 62 },
  { id: 'right-dock', side: 'right', label: '银潮码头', top: 66, left: 57 },
  { id: 'central-plaza', side: 'center', label: '共鸣广场', top: 48, left: 40 }
];

const mirrorSpacing = window.matchMedia('(max-width: 640px)');

const scoreboard = {
  round: 0,
  successes: 0,
  failures: 0,
  totalReaction: 0,
  history: []
};

let state = 'idle';
let orderParameter = 0;
let orderTimer = null;
let elapsed = 0;
let revealTime = null;
let commitTime = null;
let commitSide = null;
let childHouse = null;

const houseElements = new Map();

function createVillage() {
  houses.forEach((house) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `house ${house.side}`;
    button.id = house.id;
    button.style.top = `${house.top}%`;
    button.style.left = `${house.left}%`;
    button.title = house.label;
    button.innerHTML = `<span>${house.label}</span>`;
    if (house.side === 'center') {
      button.disabled = true;
    } else {
      button.addEventListener('click', () => commitToSide(house.side));
    }
    villageEl.appendChild(button);
    houseElements.set(house.id, button);
  });

  updateHousePositions();
}

function updateHousePositions() {
  const compact = mirrorSpacing.matches;
  houses.forEach((house) => {
    const el = houseElements.get(house.id);
    if (!el) return;
    if (compact) {
      const offset = house.side === 'left' ? 8 : house.side === 'right' ? 52 : 34;
      el.style.left = `${offset}%`;
    } else {
      el.style.left = `${house.left}%`;
    }
  });
}

mirrorSpacing.addEventListener('change', updateHousePositions);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function resetRoundVariables() {
  orderParameter = 0;
  elapsed = 0;
  revealTime = null;
  commitTime = null;
  commitSide = null;
  childHouse = null;
}

function updateOrderMeter() {
  const normalized = clamp(Math.abs(orderParameter) / 2, 0, 1) * 50;
  if (orderParameter < 0) {
    orderFillLeft.style.width = `${normalized}%`;
    orderFillRight.style.width = '0%';
  } else if (orderParameter > 0) {
    orderFillRight.style.width = `${normalized}%`;
    orderFillLeft.style.width = '0%';
  } else {
    orderFillLeft.style.width = '0%';
    orderFillRight.style.width = '0%';
  }
  orderValue.textContent = orderParameter.toFixed(2);
}

function setStatus(message) {
  statusText.textContent = message;
}

function updateVillageVisuals() {
  houses.forEach((house) => {
    const el = houseElements.get(house.id);
    if (!el) return;
    const sign = house.side === 'right' ? 1 : house.side === 'left' ? -1 : 0;
    const intensity = sign === 0 ? 0.25 : clamp(0.4 + 0.35 * (orderParameter / 2) * sign, 0.15, 0.95);
    el.style.setProperty('--intensity', intensity.toFixed(2));
    el.classList.toggle('child', Boolean(childHouse && childHouse.id === house.id));
    el.classList.toggle('committed', Boolean(commitSide && house.side === commitSide));
    el.classList.toggle('resolved-side', Boolean(childHouse && house.side === childHouse.side));
  });
}

function updateButtons() {
  const running = state === 'running' || state === 'resolved';
  startButton.disabled = running;
  commitLeftButton.disabled = !running || Boolean(commitSide);
  commitRightButton.disabled = !running || Boolean(commitSide);
}

function clearTimer() {
  if (orderTimer) {
    clearInterval(orderTimer);
    orderTimer = null;
  }
}

function concludeRound() {
  if (!childHouse || !commitSide) {
    return;
  }

  clearTimer();

  const success = commitSide === childHouse.side;
  if (success) {
    const delta = revealTime === null ? 0 : Math.max(0, (commitTime ?? elapsed) - revealTime);
    scoreboard.successes += 1;
    scoreboard.totalReaction += delta;
    setStatus(`太好了！搜查队在 ${childHouse.label} 找到了孩子，反应时间 ${delta.toFixed(2)} 秒。`);
  } else {
    scoreboard.failures += 1;
    setStatus(`方向判断失误，孩子其实藏在 ${childHouse.label}。总结一下，再来一局吧。`);
  }

  scoreboard.history.unshift({
    round: scoreboard.round,
    noise: parseFloat(noiseRange.value),
    bias: parseFloat(biasRange.value),
    child: childHouse,
    commit: commitSide,
    reaction: success ? Math.max(0, (commitTime ?? elapsed) - (revealTime ?? 0)) : null,
    success
  });
  scoreboard.history = scoreboard.history.slice(0, 6);

  state = 'finished';
  updateButtons();
  updateScoreboard();
  updateVillageVisuals();
}

function scheduleNextStep() {
  orderTimer = setInterval(() => {
    const noise = (Math.random() * 2 - 1) * parseFloat(noiseRange.value);
    const bias = parseFloat(biasRange.value);
    const drift = bias * 0.18;
    const relaxation = -orderParameter * 0.04;

    orderParameter += noise + drift + relaxation;
    orderParameter = clamp(orderParameter, -2.2, 2.2);
    elapsed += 0.2;

    if (!childHouse && Math.abs(orderParameter) >= 1.0) {
      const side = orderParameter > 0 ? 'right' : 'left';
      const candidates = houses.filter((h) => h.side === side);
      childHouse = candidates[Math.floor(Math.random() * candidates.length)];
      revealTime = elapsed;
      state = 'resolved';
      setStatus(`对称被打破！迹象显示孩子更可能在${side === 'left' ? '左岸' : '右岸'}的 ${childHouse.label} 附近。立即下达命令！`);
    }

    updateOrderMeter();
    updateVillageVisuals();
  }, 200);
}

function startRound() {
  if (state === 'running') return;
  clearTimer();
  resetRoundVariables();
  scoreboard.round += 1;
  state = 'running';
  setStatus('村庄保持镜像平衡，留意序参量的任何偏移。');
  updateButtons();
  updateOrderMeter();
  updateVillageVisuals();
  scheduleNextStep();
}

function commitToSide(side) {
  if (state !== 'running' && state !== 'resolved') {
    return;
  }
  if (commitSide) {
    return;
  }
  commitSide = side;
  commitTime = elapsed;
  const sideText = side === 'left' ? '左岸' : '右岸';
  if (!childHouse) {
    setStatus(`你轻声示意搜查队偏向${sideText}，等待对称破缺的信号。`);
  }
  updateButtons();
  updateVillageVisuals();
  if (childHouse) {
    concludeRound();
  }
}

function updateScoreboard() {
  roundCount.textContent = scoreboard.round;
  successCount.textContent = scoreboard.successes;
  failureCount.textContent = scoreboard.failures;
  avgReaction.textContent = scoreboard.successes > 0
    ? `${(scoreboard.totalReaction / scoreboard.successes).toFixed(2)} s`
    : '—';

  if (scoreboard.history.length === 0) {
    logBody.innerHTML = '<tr><td colspan="7">暂无记录</td></tr>';
    return;
  }

  const rows = scoreboard.history.map((entry) => {
    const result = entry.success ? '✔ 成功' : '✘ 失误';
    const reaction = entry.success && entry.reaction != null
      ? `${entry.reaction.toFixed(2)} s`
      : '—';
    return `
      <tr>
        <td>${entry.round}</td>
        <td>${entry.noise.toFixed(2)}</td>
        <td>${entry.bias.toFixed(2)}</td>
        <td>${result}</td>
        <td>${entry.child.label}</td>
        <td>${entry.commit === 'left' ? '左岸' : '右岸'}</td>
        <td>${reaction}</td>
      </tr>
    `;
  }).join('');

  logBody.innerHTML = rows;
}

function resetScoreboard() {
  clearTimer();
  state = 'idle';
  resetRoundVariables();
  scoreboard.round = 0;
  scoreboard.successes = 0;
  scoreboard.failures = 0;
  scoreboard.totalReaction = 0;
  scoreboard.history = [];
  updateButtons();
  updateOrderMeter();
  updateVillageVisuals();
  updateScoreboard();
  setStatus('所有战绩已清空，随时可以重新开始。');
}

startButton.addEventListener('click', startRound);
commitLeftButton.addEventListener('click', () => commitToSide('left'));
commitRightButton.addEventListener('click', () => commitToSide('right'));
resetScoreButton.addEventListener('click', resetScoreboard);

noiseRange.addEventListener('input', () => {
  noiseValue.textContent = parseFloat(noiseRange.value).toFixed(2);
});

biasRange.addEventListener('input', () => {
  biasValue.textContent = parseFloat(biasRange.value).toFixed(2);
});

createVillage();
updateOrderMeter();
updateVillageVisuals();
updateScoreboard();
