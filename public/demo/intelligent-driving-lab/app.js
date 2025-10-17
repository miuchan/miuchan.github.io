const canvas = document.getElementById('drivingCanvas');
const ctx = canvas.getContext('2d');

const meterToPixel = 5;
const pixelToMeter = 1 / meterToPixel;

const pathPoints = [
  { x: 140, y: 460 },
  { x: 220, y: 420 },
  { x: 320, y: 360 },
  { x: 410, y: 300 },
  { x: 520, y: 240 },
  { x: 640, y: 210 },
  { x: 760, y: 240 },
  { x: 820, y: 320 },
  { x: 780, y: 400 },
  { x: 680, y: 460 },
  { x: 540, y: 490 },
  { x: 380, y: 480 },
  { x: 240, y: 440 }
];

const obstacles = [
  { x: 360, y: 360, width: 46, height: 44 },
  { x: 610, y: 280, width: 62, height: 38 },
  { x: 470, y: 420, width: 46, height: 32 },
  { x: 720, y: 340, width: 38, height: 60 }
];

const modeProfiles = {
  cruise: {
    lookAheadRadius: 70,
    steerGain: 1.6,
    accel: 5,
    brake: 8,
    riskTolerance: 0.55,
    sensorBias: 1
  },
  safety: {
    lookAheadRadius: 90,
    steerGain: 1.2,
    accel: 3,
    brake: 12,
    riskTolerance: 0.4,
    sensorBias: 1.4
  },
  attack: {
    lookAheadRadius: 55,
    steerGain: 2,
    accel: 7,
    brake: 6,
    riskTolerance: 0.7,
    sensorBias: 0.85
  }
};

const sensors = [
  { id: 'front', angle: 0, color: '#4cc9f0' },
  { id: 'left', angle: 0.55, color: '#82dfff' },
  { id: 'right', angle: -0.55, color: '#82dfff' }
];

const maxSensorRange = 220;
const safeDistance = 120;

const telemetryMetrics = [
  { id: 'speed', label: '速度', unit: 'm/s' },
  { id: 'steering', label: '转向角', unit: '°' },
  { id: 'risk', label: '风险指数', unit: '' },
  { id: 'mode', label: '模式', unit: '' },
  { id: 'front', label: '前向距离', unit: 'm' },
  { id: 'progress', label: '圈进度', unit: '%' }
];

const state = {
  car: {
    x: pathPoints[0].x,
    y: pathPoints[0].y,
    heading: -Math.PI / 2,
    speed: 0,
    steering: 0,
    targetIndex: 1,
    distanceTravelled: 0
  },
  readings: new Map(),
  mode: 'cruise',
  targetSpeed: 18,
  showSensors: true,
  showWaypoints: true,
  risk: 0,
  loopLength: 0
};

function computeLoopLength() {
  let length = 0;
  for (let i = 0; i < pathPoints.length; i += 1) {
    const a = pathPoints[i];
    const b = pathPoints[(i + 1) % pathPoints.length];
    length += Math.hypot(b.x - a.x, b.y - a.y) * pixelToMeter;
  }
  state.loopLength = length;
}

computeLoopLength();

function roundRectPath(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

const telemetryGrid = document.getElementById('telemetryGrid');
telemetryMetrics.forEach((metric) => {
  const card = document.createElement('article');
  card.className = 'telemetry-card';
  card.dataset.metric = metric.id;
  card.innerHTML = `
    <h3>${metric.label}</h3>
    <strong>0</strong>
    <span>${metric.unit}</span>
  `;
  telemetryGrid.appendChild(card);
});

const modeSelect = document.getElementById('modeSelect');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const showSensorsToggle = document.getElementById('showSensors');
const showWaypointsToggle = document.getElementById('showWaypoints');

modeSelect.addEventListener('change', () => {
  state.mode = modeSelect.value;
});

speedSlider.addEventListener('input', () => {
  state.targetSpeed = Number(speedSlider.value);
  speedValue.textContent = state.targetSpeed.toFixed(0);
});

showSensorsToggle.addEventListener('change', () => {
  state.showSensors = showSensorsToggle.checked;
});

showWaypointsToggle.addEventListener('change', () => {
  state.showWaypoints = showWaypointsToggle.checked;
});

speedValue.textContent = state.targetSpeed.toFixed(0);

function wrapAngle(angle) {
  if (angle > Math.PI) {
    return angle - Math.PI * 2;
  }
  if (angle < -Math.PI) {
    return angle + Math.PI * 2;
  }
  return angle;
}

function intersectRayWithSegment(origin, direction, p1, p2) {
  const v1x = origin.x - p1.x;
  const v1y = origin.y - p1.y;
  const v2x = p2.x - p1.x;
  const v2y = p2.y - p1.y;
  const denominator = direction.x * v2y - direction.y * v2x;

  if (Math.abs(denominator) < 1e-6) return Infinity;

  const t1 = (v2x * v1y - v2y * v1x) / denominator;
  const t2 = (direction.x * v1y - direction.y * v1x) / denominator;

  if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
    return t1;
  }

  return Infinity;
}

function castSensorRay(origin, angle) {
  const direction = {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };

  let minDistance = maxSensorRange;

  const testSegments = [];

  // Canvas bounds
  testSegments.push(
    [
      { x: 0, y: 0 },
      { x: canvas.width, y: 0 }
    ],
    [
      { x: canvas.width, y: 0 },
      { x: canvas.width, y: canvas.height }
    ],
    [
      { x: canvas.width, y: canvas.height },
      { x: 0, y: canvas.height }
    ],
    [
      { x: 0, y: canvas.height },
      { x: 0, y: 0 }
    ]
  );

  obstacles.forEach((rect) => {
    testSegments.push(
      [
        { x: rect.x, y: rect.y },
        { x: rect.x + rect.width, y: rect.y }
      ],
      [
        { x: rect.x + rect.width, y: rect.y },
        { x: rect.x + rect.width, y: rect.y + rect.height }
      ],
      [
        { x: rect.x + rect.width, y: rect.y + rect.height },
        { x: rect.x, y: rect.y + rect.height }
      ],
      [
        { x: rect.x, y: rect.y + rect.height },
        { x: rect.x, y: rect.y }
      ]
    );
  });

  testSegments.forEach(([start, end]) => {
    const distance = intersectRayWithSegment(origin, direction, start, end);
    if (distance < minDistance) {
      minDistance = distance;
    }
  });

  return Math.min(maxSensorRange, minDistance);
}

function updateSensors(car) {
  sensors.forEach((sensor) => {
    const distance = castSensorRay(car, car.heading + sensor.angle);
    state.readings.set(sensor.id, distance);
  });
}

function updateRisk() {
  const distances = sensors.map((sensor) => state.readings.get(sensor.id) || maxSensorRange);
  const normalized = distances.map((d) => Math.min(1, d / safeDistance));
  const deficit = normalized.map((n) => 1 - n);
  const averageDeficit = deficit.reduce((sum, d) => sum + d, 0) / deficit.length;
  const profile = modeProfiles[state.mode];
  const risk = Math.min(1, averageDeficit * profile.sensorBias);
  state.risk = risk;
}

function updateCar(dt) {
  const profile = modeProfiles[state.mode];
  const car = state.car;
  const targetPoint = pathPoints[car.targetIndex];

  const dx = targetPoint.x - car.x;
  const dy = targetPoint.y - car.y;
  const distanceToTarget = Math.hypot(dx, dy);

  if (distanceToTarget < profile.lookAheadRadius) {
    car.targetIndex = (car.targetIndex + 1) % pathPoints.length;
  }

  const desiredHeading = Math.atan2(dy, dx);
  let headingError = wrapAngle(desiredHeading - car.heading);
  const maxSteer = 0.75;
  car.steering = Math.max(-maxSteer, Math.min(maxSteer, headingError * profile.steerGain));
  car.heading = wrapAngle(car.heading + car.steering * dt);

  const riskPenalty = Math.max(0, state.risk - profile.riskTolerance);
  const safeTarget = state.targetSpeed * Math.max(0.25, 1 - riskPenalty * 1.5);

  if (car.speed < safeTarget) {
    car.speed = Math.min(safeTarget, car.speed + profile.accel * dt);
  } else {
    car.speed = Math.max(safeTarget, car.speed - profile.brake * dt);
  }

  if (state.risk > 0.85) {
    car.speed = Math.max(2, car.speed - profile.brake * dt * 1.5);
  }

  const vx = Math.cos(car.heading) * car.speed * dt * meterToPixel;
  const vy = Math.sin(car.heading) * car.speed * dt * meterToPixel;

  car.x += vx;
  car.y += vy;
  car.distanceTravelled += car.speed * dt;

  // Keep vehicle within canvas bounds
  car.x = Math.max(20, Math.min(canvas.width - 20, car.x));
  car.y = Math.max(20, Math.min(canvas.height - 20, car.y));
}

function drawTrack() {
  ctx.save();
  ctx.lineWidth = 32;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(40, 70, 110, 0.5)';
  ctx.beginPath();
  ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
  for (let i = 1; i < pathPoints.length; i += 1) {
    const point = pathPoints[i];
    ctx.lineTo(point.x, point.y);
  }
  ctx.lineTo(pathPoints[0].x, pathPoints[0].y);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(76, 201, 240, 0.35)';
  ctx.setLineDash([10, 12]);
  ctx.beginPath();
  ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
  for (let i = 1; i < pathPoints.length; i += 1) {
    ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
  }
  ctx.lineTo(pathPoints[0].x, pathPoints[0].y);
  ctx.stroke();
  ctx.restore();

  if (state.showWaypoints) {
    ctx.save();
    ctx.fillStyle = 'rgba(130, 223, 255, 0.5)';
    pathPoints.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, index === state.car.targetIndex ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}

function drawObstacles() {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 107, 107, 0.18)';
  ctx.strokeStyle = 'rgba(255, 107, 107, 0.6)';
  ctx.lineWidth = 2;
  obstacles.forEach((rect) => {
    roundRectPath(ctx, rect.x, rect.y, rect.width, rect.height, 6);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
}

function drawSensors(car) {
  if (!state.showSensors) return;
  ctx.save();
  sensors.forEach((sensor) => {
    const angle = car.heading + sensor.angle;
    const distance = state.readings.get(sensor.id) || maxSensorRange;
    ctx.beginPath();
    ctx.moveTo(car.x, car.y);
    ctx.strokeStyle = sensor.color;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 2;
    ctx.lineTo(car.x + Math.cos(angle) * distance, car.y + Math.sin(angle) * distance);
    ctx.stroke();
  });
  ctx.restore();
}

function drawCar(car) {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.heading);
  ctx.fillStyle = '#1f2d50';
  ctx.strokeStyle = '#4cc9f0';
  ctx.lineWidth = 2;
  const length = 36;
  const width = 18;
  roundRectPath(ctx, -length / 2, -width / 2, length, width, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4cc9f0';
  roundRectPath(ctx, length / 4, -width / 2 + 2, length / 4, width - 4, 4);
  ctx.fill();
  ctx.restore();
}

function drawRiskOverlay(car) {
  if (state.risk < 0.7) return;
  ctx.save();
  const intensity = Math.min(0.8, (state.risk - 0.7) * 2.4);
  ctx.fillStyle = `rgba(255, 107, 107, ${0.15 + intensity * 0.6})`;
  ctx.beginPath();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.heading);
  ctx.rect(14, -28, 160, 56);
  ctx.fill();
  ctx.restore();
}

function updateTelemetry() {
  const car = state.car;
  const cards = telemetryGrid.querySelectorAll('.telemetry-card');
  const frontDistance = state.readings.get('front') || maxSensorRange;
  const frontMeters = frontDistance * pixelToMeter;
  const progress = state.loopLength
    ? ((car.distanceTravelled % state.loopLength) / state.loopLength) * 100
    : 0;

  cards.forEach((card) => {
    const id = card.dataset.metric;
    const valueEl = card.querySelector('strong');
    switch (id) {
      case 'speed':
        valueEl.textContent = car.speed.toFixed(1);
        break;
      case 'steering':
        valueEl.textContent = (car.steering * (180 / Math.PI)).toFixed(1);
        break;
      case 'risk':
        valueEl.textContent = state.risk.toFixed(2);
        break;
      case 'mode':
        valueEl.textContent = modeSelect.options[modeSelect.selectedIndex].textContent;
        break;
      case 'front':
        valueEl.textContent = frontMeters.toFixed(1);
        break;
      case 'progress':
        valueEl.textContent = progress.toFixed(0);
        break;
      default:
        break;
    }
  });
}

function clearCanvas() {
  ctx.fillStyle = '#04060d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let previousTimestamp = performance.now();

function loop(timestamp) {
  const dt = Math.min(0.04, (timestamp - previousTimestamp) / 1000);
  previousTimestamp = timestamp;

  updateSensors(state.car);
  updateRisk();
  updateCar(dt);

  clearCanvas();
  drawTrack();
  drawObstacles();
  drawSensors(state.car);
  drawCar(state.car);
  drawRiskOverlay(state.car);
  updateTelemetry();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
