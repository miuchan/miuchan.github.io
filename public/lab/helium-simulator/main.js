const canvas = document.getElementById('simCanvas');
const ctx = canvas?.getContext('2d');
const altitudeInput = document.getElementById('altitude');
const smoothingInput = document.getElementById('smoothing');
const copilotToggle = document.getElementById('copilotToggle');
const anomalyToggle = document.getElementById('anomalyToggle');
const altitudeValue = document.getElementById('altitudeValue');
const smoothingValue = document.getElementById('smoothingValue');
const telemetryTable = document.getElementById('telemetryTable');
const eventFeed = document.getElementById('eventFeed');
const copilotInstruction = document.getElementById('copilotInstruction');
const copilotTags = document.getElementById('copilotTags');
const telemetryTicker = document.getElementById('telemetryTicker');

const assets = [
  {
    id: 'helium-01',
    label: 'Helium-01',
    color: '#91a9ff',
    orbitRadius: 0.32,
    phase: 0.12,
    health: 0.96
  },
  {
    id: 'helium-02',
    label: 'Helium-02',
    color: '#4ce0b3',
    orbitRadius: 0.45,
    phase: 0.55,
    health: 0.9
  },
  {
    id: 'relay-arc',
    label: 'Relay-ARC',
    color: '#ffd46f',
    orbitRadius: 0.56,
    phase: 0.28,
    health: 0.82
  }
];

let lastTimestamp = 0;
let smoothingGain = parseFloat(smoothingInput?.value ?? '0.35');
let targetAltitude = parseInt(altitudeInput?.value ?? '280', 10);
let tickAccumulator = 0;
let copilotEnabled = copilotToggle?.checked ?? true;
let anomalyWatch = anomalyToggle?.checked ?? false;

const events = [];
const copilotScripts = {
  idle: {
    text: '维持同步轨道，准备重建遥测投影。',
    tags: ['Attitude control', 'Telemetry refresh']
  },
  adjust: {
    text: '执行逆推校正，确保航迹与地面站窗口重叠。',
    tags: ['Thruster burn', 'Window alignment']
  },
  anomaly: {
    text: '触发异常追踪，收敛姿态漂移并通知联盟节点。',
    tags: ['Anomaly response', 'Council alert']
  }
};

function resizeCanvas() {
  if (!canvas) return;
  const parent = canvas.parentElement;
  if (!parent) return;
  const rect = parent.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
  }
}

function updateTelemetry(dt) {
  tickAccumulator += dt;
  if (tickAccumulator < 300) return;
  tickAccumulator = 0;
  assets.forEach((asset, index) => {
    const variance = (Math.random() - 0.5) * 0.8;
    asset.altitude = targetAltitude + (index * 22 + variance) * (1 - smoothingGain);
    asset.velocity = 7.3 + (Math.random() - 0.5) * 0.2;
    asset.health += (Math.random() - 0.5) * 0.01;
    asset.health = Math.min(1, Math.max(0.68, asset.health));
  });
  renderTelemetry();
  telemetryTicker.textContent = `${(300 / 1000).toFixed(1)}s`;
  emitEvent('Telemetry refresh', 'Updated orbit solutions and power draw.');
}

function renderTelemetry() {
  if (!telemetryTable) return;
  telemetryTable.innerHTML = assets
    .map((asset) => {
      const status = asset.health > 0.9 ? 'Nominal' : asset.health > 0.8 ? 'Guarded' : 'Watch';
      const statusColor =
        status === 'Nominal' ? 'var(--success)' : status === 'Guarded' ? 'var(--warning)' : 'var(--danger)';
      return `
        <tr>
          <td>${asset.label}</td>
          <td>${Math.round(asset.altitude ?? targetAltitude)} km</td>
          <td>${(asset.velocity ?? 7.3).toFixed(2)} km/s</td>
          <td style="color:${statusColor}">${status}</td>
        </tr>
      `;
    })
    .join('');
}

function emitEvent(title, summary) {
  events.unshift({ title, summary, time: new Date() });
  if (events.length > 6) events.length = 6;
  if (!eventFeed) return;
  eventFeed.innerHTML = events
    .map((event) => {
      const time = event.time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      return `<div class="list-item"><strong>${event.title}</strong><span class="tagline">${summaryWithTime(
        event.summary,
        time
      )}</span></div>`;
    })
    .join('');
}

function summaryWithTime(summary, time) {
  return `${time} · ${summary}`;
}

function draw(timestamp) {
  if (!canvas || !ctx) return;
  if (!lastTimestamp) lastTimestamp = timestamp;
  const dt = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  updateTelemetry(dt);

  const width = canvas.getBoundingClientRect().width;
  const height = canvas.getBoundingClientRect().height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(5, 8, 14, 0.88)';
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * 0.38;

  ctx.strokeStyle = 'rgba(145, 169, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * (0.6 + i * 0.18), 0, Math.PI * 2);
    ctx.stroke();
  }

  assets.forEach((asset, index) => {
    const orbitRadius = baseRadius * (asset.orbitRadius + (targetAltitude - 280) / 600);
    const speed = 0.0003 + index * 0.00012;
    const angle = timestamp * speed + asset.phase * Math.PI * 2;
    const x = centerX + Math.cos(angle) * orbitRadius;
    const y = centerY + Math.sin(angle) * orbitRadius * 0.78;

    ctx.beginPath();
    ctx.strokeStyle = `${asset.color}33`;
    ctx.lineWidth = 2;
    ctx.ellipse(centerX, centerY, orbitRadius, orbitRadius * 0.78, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = asset.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = `${asset.color}aa`;
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(242, 245, 255, 0.9)';
    ctx.font = '13px Inter, system-ui';
    ctx.fillText(asset.label, x + 10, y - 10);
  });

  if (copilotEnabled) {
    const pulse = (Math.sin(timestamp / 300) + 1) / 2;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(77, 106, 255, ${0.2 + pulse * 0.3})`;
    ctx.lineWidth = 2;
    ctx.arc(centerX, centerY, baseRadius * 0.45 + pulse * 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  window.requestAnimationFrame(draw);
}

function setCopilotScript() {
  if (!copilotInstruction || !copilotTags) return;
  let script = copilotScripts.idle;
  if (!copilotEnabled) {
    script = {
      text: '手动模式开启，等待操作员指令。',
      tags: ['Manual control']
    };
  } else if (anomalyWatch) {
    script = copilotScripts.anomaly;
  } else if (Math.abs(targetAltitude - 280) > 40) {
    script = copilotScripts.adjust;
  }

  copilotInstruction.textContent = script.text;
  copilotTags.innerHTML = script.tags.map((tag) => `<span class="token">${tag}</span>`).join('');
}

altitudeInput?.addEventListener('input', (event) => {
  const value = parseInt(event.target.value, 10);
  targetAltitude = value;
  altitudeValue.textContent = `${value} km`;
  setCopilotScript();
});

smoothingInput?.addEventListener('input', (event) => {
  smoothingGain = parseFloat(event.target.value);
  smoothingValue.textContent = smoothingGain.toFixed(2);
});

copilotToggle?.addEventListener('change', (event) => {
  copilotEnabled = event.target.checked;
  setCopilotScript();
  emitEvent('Copilot toggled', copilotEnabled ? 'AI copilots synced to mission timeline.' : 'Manual override accepted.');
});

anomalyToggle?.addEventListener('change', (event) => {
  anomalyWatch = event.target.checked;
  setCopilotScript();
  emitEvent(anomalyWatch ? 'Anomaly watch' : 'Nominal ops', anomalyWatch ? 'Scanning clusters for drift anomalies.' : 'Returning to nominal operations.');
});

resizeCanvas();
renderTelemetry();
setCopilotScript();
window.addEventListener('resize', resizeCanvas);
window.requestAnimationFrame(draw);
