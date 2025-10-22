const tracks = {
  'constellation-design': {
    title: 'Constellation design',
    description:
      '维护星图拓扑、语义链接与推演路径，生成可复制的跨学科作战地图。',
    tags: ['Systems research', 'Simulation', 'Narratives'],
    briefs: 6,
    ingest: 18,
    cluster: 'Atlas Core'
  },
  'experience-engineering': {
    title: 'Experience engineering',
    description:
      '原型化空间界面、遥测面板与 AI 协作体，将实验快速升舱到生产环境。',
    tags: ['Spatial UI', 'AI toolkit', 'Telemetry'],
    briefs: 4,
    ingest: 12,
    cluster: 'Experience Stack'
  },
  'alliance-operations': {
    title: 'Alliance operations',
    description:
      '编排合作仪式、激励桥梁与自治节点对齐例会，为联盟提供节奏。',
    tags: ['Partner programs', 'Incentive design', 'Operations'],
    briefs: 5,
    ingest: 9,
    cluster: 'Alliance Orbit'
  }
};

const constellationNodes = [
  {
    id: 'atlas-core',
    label: 'Atlas Core',
    type: 'track',
    x: 0.2,
    y: 0.45,
    orbit: 0
  },
  { id: 'experience-stack', label: 'Experience Stack', type: 'track', x: 0.52, y: 0.25, orbit: 0 },
  { id: 'alliance-orbit', label: 'Alliance Orbit', type: 'track', x: 0.76, y: 0.52, orbit: 0 },
  {
    id: 'ritual-summit',
    label: 'Governance summit',
    type: 'ritual',
    x: 0.36,
    y: 0.72,
    orbit: 1
  },
  { id: 'launch-console', label: 'Launch console', type: 'asset', x: 0.6, y: 0.65, orbit: 1 },
  { id: 'knowledge-graph', label: 'Knowledge graph', type: 'asset', x: 0.45, y: 0.38, orbit: 1 },
  { id: 'pilot-ops', label: 'Pilot ops', type: 'ritual', x: 0.72, y: 0.32, orbit: 1 }
];

const links = [
  ['atlas-core', 'experience-stack'],
  ['atlas-core', 'knowledge-graph'],
  ['experience-stack', 'launch-console'],
  ['experience-stack', 'pilot-ops'],
  ['alliance-orbit', 'pilot-ops'],
  ['atlas-core', 'ritual-summit'],
  ['ritual-summit', 'alliance-orbit']
];

const timelineEvents = [
  {
    id: 'atlas-sprint',
    time: 'Mon 09:00',
    title: 'Atlas weekly sprint',
    description: '对齐研究吸收、星图修补与下一批原型发布的节奏。'
  },
  {
    id: 'ritual-design',
    time: 'Tue 15:30',
    title: 'Ritual design studio',
    description: '联合设计伙伴固化治理仪式与指标，生成执行脚本。'
  },
  {
    id: 'launch-review',
    time: 'Thu 11:00',
    title: 'Launch review loop',
    description: '审视体验遥测、风险与补强项，并更新资产库版本。'
  },
  {
    id: 'council-sync',
    time: 'Fri 17:00',
    title: 'Council sync',
    description: '记录联盟决策、共享 scorecard，并生成多语种回顾。'
  }
];

const assetInventory = [
  {
    id: 'atlas-map',
    title: 'Atlas navigation map',
    summary: '全局语义地图，覆盖 182 个研究节点和 54 条推演路径。',
    status: 'v3.1 · Fresh build'
  },
  {
    id: 'experience-kit',
    title: 'Experience prototyping kit',
    summary: '空间界面组件库与 Telemetry SDK，用于快速拼装体验。',
    status: 'v2.4 · Stable'
  },
  {
    id: 'governance-playbook',
    title: 'Governance playbook',
    summary: '仪式模板、角色脚本与复盘提问清单。',
    status: 'v1.9 · Live updates'
  }
];

const trackList = document.getElementById('trackList');
const trackTitle = document.getElementById('trackTitle');
const trackDescription = document.getElementById('trackDescription');
const trackTags = document.getElementById('trackTags');
const trackBriefs = document.getElementById('trackBriefs');
const trackIngest = document.getElementById('trackIngest');
const activeCluster = document.getElementById('activeCluster');

trackList?.addEventListener('click', (event) => {
  const target = event.target.closest('button[data-track]');
  if (!target) return;

  const trackId = target.dataset.track;
  const data = tracks[trackId];
  if (!data) return;

  trackList.querySelectorAll('button').forEach((button) => {
    button.setAttribute('aria-pressed', button === target ? 'true' : 'false');
  });

  trackTitle.textContent = data.title;
  trackDescription.textContent = data.description;
  trackTags.innerHTML = data.tags.map((tag) => `<span class="token">${tag}</span>`).join('');
  trackBriefs.textContent = data.briefs;
  trackIngest.textContent = data.ingest;
  activeCluster.textContent = data.cluster;
  drawConstellation(trackId);
});

const timelineContainer = document.getElementById('timeline');
if (timelineContainer) {
  timelineContainer.innerHTML = timelineEvents
    .map(
      (event) => `
        <article class="timeline-item">
          <time>${event.time}</time>
          <strong>${event.title}</strong>
          <span class="tagline">${event.description}</span>
        </article>
      `
    )
    .join('');
}

const assetList = document.getElementById('assetList');
if (assetList) {
  assetList.innerHTML = assetInventory
    .map(
      (asset) => `
        <div class="list-item">
          <strong>${asset.title}</strong>
          <span class="tagline">${asset.summary}</span>
          <span class="badge">${asset.status}</span>
        </div>
      `
    )
    .join('');
}

const canvas = document.getElementById('constellationCanvas');
const ctx = canvas?.getContext('2d');
let activeTrack = 'constellation-design';

function resizeCanvas() {
  if (!canvas) return;
  const rect = canvas.parentElement?.getBoundingClientRect();
  if (!rect) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  if (ctx) {
    ctx.scale(ratio, ratio);
  }
  drawConstellation(activeTrack, true);
}

let scaled = false;

function drawConstellation(trackId, force = false) {
  if (!canvas || !ctx) return;
  if (force) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const ratio = window.devicePixelRatio || 1;
    ctx.scale(ratio, ratio);
  }

  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  const nodeRadius = 10;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const radius = Math.min(rect.width, rect.height) * 0.42;

  ctx.lineWidth = 1.4;
  ctx.strokeStyle = 'rgba(145, 169, 255, 0.4)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.75, 0, Math.PI * 2);
  ctx.stroke();

  links.forEach(([fromId, toId]) => {
    const from = constellationNodes.find((node) => node.id === fromId);
    const to = constellationNodes.find((node) => node.id === toId);
    if (!from || !to) return;
    const fromPoint = positionForNode(from, rect, radius, centerX, centerY);
    const toPoint = positionForNode(to, rect, radius, centerX, centerY);
    ctx.strokeStyle = 'rgba(145, 169, 255, 0.28)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.stroke();
  });

  constellationNodes.forEach((node) => {
    const { x, y } = positionForNode(node, rect, radius, centerX, centerY);
    const isActive =
      (trackId === 'constellation-design' && node.id === 'atlas-core') ||
      (trackId === 'experience-engineering' && node.id === 'experience-stack') ||
      (trackId === 'alliance-operations' && node.id === 'alliance-orbit');

    ctx.beginPath();
    if (node.type === 'track') {
      ctx.fillStyle = isActive ? 'rgba(77, 106, 255, 0.9)' : 'rgba(145, 169, 255, 0.6)';
      ctx.strokeStyle = 'rgba(145, 169, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.arc(x, y, nodeRadius + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius + 1, 0, Math.PI * 2);
      ctx.fill();
    } else if (node.type === 'ritual') {
      ctx.fillStyle = 'rgba(76, 224, 179, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(255, 212, 111, 0.8)';
      ctx.beginPath();
      ctx.rect(x - nodeRadius, y - nodeRadius, nodeRadius * 2, nodeRadius * 2);
      ctx.fill();
    }

    ctx.font = '13px Inter, system-ui';
    ctx.fillStyle = 'rgba(242, 245, 255, 0.85)';
    ctx.textAlign = 'center';
    ctx.fillText(node.label, x, y + nodeRadius + 16);
  });

  activeTrack = trackId;
}

function positionForNode(node, rect, radius, cx, cy) {
  const baseAngle = node.orbit === 0 ? 0 : Math.PI / 4;
  const angle = baseAngle + node.x * Math.PI * 1.6;
  const orbitRadius = node.orbit === 0 ? radius * 0.5 : radius * (0.5 + node.y * 0.4);
  return {
    x: cx + Math.cos(angle) * orbitRadius,
    y: cy + Math.sin(angle) * orbitRadius
  };
}

window.addEventListener('resize', () => resizeCanvas());
resizeCanvas();
drawConstellation(activeTrack);
