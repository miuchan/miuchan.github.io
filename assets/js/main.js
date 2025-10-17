import { featuredAlliances } from './friends-data.js';

const counts = {
  demos: 21,
  research: 4,
  blogs: 59,
  resume: 1
};

counts.total = counts.demos + counts.research + counts.blogs + counts.resume;

const heroStats = [
  {
    label: '运行资产',
    value: `${counts.total}+`,
    description: '交互原型、研究、长文与协作模板组成的地球体验矩阵。'
  },
  {
    label: '实时实验',
    value: `${counts.demos}`,
    description: 'WebGL 仿真、协作工作流与体验系统实验，可即刻上线验证。'
  },
  {
    label: '知识流',
    value: `${counts.blogs + counts.research}`,
    description: '策略长文与数学证明共同支持的故事线与治理协议。'
  }
];

const missionDomains = [
  {
    title: '生态奇点治理',
    narrative:
      '构建全球生态复原的策略界面，联结数据、行为与政策，驱动真实世界的系统性修复。',
    protocols: ['气候数据编排', '影响力建模', '跨域协作网络']
  },
  {
    title: '体验系统操作台',
    narrative:
      '把复杂的人机协作流程拆解为可执行模组，为团队提供统一的体验设计与验证协议。',
    protocols: ['DesignOps', '实时度量', '策略原型']
  },
  {
    title: '认知接口升级',
    narrative:
      '借助沉浸式界面与多感官互动，探索地球体验的全新感知方式，放大人类与 AI 的协作潜力。',
    protocols: ['WebGL 引擎', '声音与粒子系统', '叙事可视化']
  },
  {
    title: '星际级伙伴网络',
    narrative:
      '让跨学科伙伴快速找到协作坐标系，以标准化协议对接履历、节奏与资源。',
    protocols: ['履历网络', '共创节奏', '学习路径']
  }
];

const labFilters = [
  { id: 'all', label: '全部' },
  { id: 'demo', label: '交互实验' },
  { id: 'research', label: '研究文档' },
  { id: 'ops', label: '协作运营' },
  { id: 'story', label: '叙事长文' }
];

const labEntries = [
  {
    title: '智能驾驶实验舱',
    description:
      '模拟自动驾驶的传感器融合、行为规划与风险控制回路，观察不同策略对速度与安全的平衡。',
    href: 'public/demo/intelligent-driving-lab/index.html',
    type: 'demo',
    tags: ['自动驾驶', '控制系统'],
    keywords: ['autonomous driving', 'simulation', 'telemetry']
  },
  {
    title: '分支预测策略实验室',
    description: '比较静态、局部与 gshare 预测器命中率，评估误判冲刷成本与别名影响。',
    href: 'public/demo/branch-prediction/index.html',
    type: 'demo',
    tags: ['CPU 架构', '性能分析'],
    keywords: ['branch prediction', 'microarchitecture', 'pipeline']
  },
  {
    title: 'Lorenz Convex 视界',
    description: 'Lorenz 系统的凸优化映射可视化，展示混沌与可控性的张力。',
    href: 'public/demo/lorenz-convex/index.html',
    type: 'demo',
    tags: ['混沌系统', '优化'],
    keywords: ['lorenz', 'convex']
  },
  {
    title: '羽光不动点递归实验',
    description: '探索羽光-情绪-拓扑映射固定点求解的可视化实验，呈现多主体协同的动态。',
    href: 'public/demo/featherlight-fixed-point-recursion/index.html',
    type: 'demo',
    tags: ['动力系统', '可视化'],
    keywords: ['fixed point', 'gradient descent']
  },
  {
    title: 'Design System Starter Kit',
    description: 'Design Token、组件规范与无障碍检查清单，帮助团队落地设计系统。',
    href: 'public/demo/miu-tiantian-gradient-descent/index.html',
    type: 'ops',
    tags: ['DesignOps', '组件库'],
    keywords: ['design system', 'tokens', 'accessibility']
  },
  {
    title: 'Workflow Automation 模板',
    description: 'Notion、Linear 与 GitHub 的跨团队节奏与仪式脚本，支持异步协作。',
    href: 'public/demo/blockchan/index.html',
    type: 'ops',
    tags: ['自动化', '团队运营'],
    keywords: ['automation', 'workflow']
  },
  {
    title: 'Campfire 成长循环',
    description: '创作者社区的增长实验框架与内容运营脚本，驱动持续共鸣。',
    href: 'public/demo/time-crystal/index.html',
    type: 'ops',
    tags: ['社区运营', '增长'],
    keywords: ['community', 'growth']
  },
  {
    title: 'Atlas 审批旅程蓝图',
    description: '风控审批流程的指标体系、仪表盘与跨团队 OKR 模板，助力策略决策。',
    href: 'public/demo/qed/index.html',
    type: 'ops',
    tags: ['风控', '流程设计'],
    keywords: ['approval', 'operations', 'dashboard']
  },
  {
    title: 'Terrabyte 协作剧本',
    description: '气候数据团队的多时区协作模型与无障碍设计评估表。',
    href: 'public/demo/ctc/index.html',
    type: 'ops',
    tags: ['协作', '可持续'],
    keywords: ['climate', 'collaboration']
  },
  {
    title: '朋子和友子的热对偶共振实验室',
    description:
      '构建热流-声波耦合实验舱，演示可逆热管理与多节点热对偶调度策略。',
    href: 'docs/tomoko-yuko-thermal-dual-resonance-lab.md',
    type: 'research',
    tags: ['热管理', '多物理场'],
    keywords: ['thermal resonance', 'acoustic coupling', 'heat recovery']
  },
  {
    title: '微观激励桥实验室',
    description:
      '建立跨社区的激励桥梁，将贡献事件、声誉权重与结算桥接入统一协议，保障公共项目资金透明高效流动。',
    href: 'docs/micro-incentive-bridge-lab.md',
    type: 'research',
    tags: ['激励设计', '公共项目'],
    keywords: ['micro incentive', 'public goods', 'governance']
  },
  {
    title: '全屋智能无线充电实验舱',
    description:
      '构建多房间谐振线圈阵列与自适应调度算法，实现移动设备与机器人随行供电的能源网络。',
    href: 'docs/whole-home-wireless-charging-lab.md',
    type: 'research',
    tags: ['无线供能', '智能家居'],
    keywords: ['wireless power', 'smart home']
  },
  {
    title: '计算奇点 470 年上界证明',
    description: '以数学推导与历史数据结合的研究，阐释计算奇点的可能轨迹与边界。',
    href: 'docs/computational-singularity-proof.md',
    type: 'research',
    tags: ['数学', '未来学'],
    keywords: ['singularity', 'proof']
  },
  {
    title: '万物互联体验架构',
    description: '讲述物联网体验的叙事框架与生态系统设计路径。',
    href: 'public/blog/internet-of-everything-design.html',
    type: 'story',
    tags: ['体验叙事', 'IoT'],
    keywords: ['narrative', 'iot']
  },
  {
    title: '封闭类时曲线与凸优化',
    description: '将物理学与优化算法交汇的长文，探索时间与策略的交织。',
    href: 'public/blog/ctc-convex-optimization.html',
    type: 'story',
    tags: ['物理', '优化'],
    keywords: ['ctc', 'convex']
  },
  {
    title: 'Friends 合作网络',
    description: '记录长期共创伙伴的角色、节奏与跨界联系。',
    href: 'public/blog/Friends/index.html',
    type: 'ops',
    tags: ['伙伴网络', '组织运营'],
    keywords: ['network', 'community']
  },
  {
    title: '在线履历与合作模式',
    description: '以空间化信息架构呈现个人履历、技能矩阵与合作指南。',
    href: 'public/resume/index.html',
    type: 'ops',
    tags: ['履历', '协作'],
    keywords: ['resume', 'collaboration']
  }
];

const telemetryStreams = [
  {
    label: '资产光谱',
    base: counts.total,
    unit: '项',
    description: '以知识、原型与运营资产汇聚出的实验能量。'
  },
  {
    label: '协作频率',
    base: 128,
    unit: 'Hz',
    description: '跨时区团队的同步/异步协作节奏。'
  },
  {
    label: '系统稳定性',
    base: 99.2,
    unit: '%',
    description: '资产可用性与实验舱体运行的综合指标。'
  },
  {
    label: '灵感流量',
    base: 42,
    unit: 'lumen',
    description: '来自社区与伙伴网络的实时反馈脉冲。'
  }
];

const timelineEntries = [
  {
    year: '2015',
    title: '体验系统雏形',
    description: '第一批体验系统研究与设计工程原型诞生，为后续的星球实验埋下伏笔。',
    tags: ['DesignOps', '原型']
  },
  {
    year: '2019',
    title: '跨学科协同升级',
    description: '将策略、数据科学与体验工程的流程脚本整合成可复用的模板。',
    tags: ['协作', '模板']
  },
  {
    year: '2022',
    title: 'WebGL 星球引擎',
    description: '构建多感官交互的星球界面，为地球体验实验室搭建视觉主脑。',
    tags: ['WebGL', '交互']
  },
  {
    year: '2024',
    title: 'Earth Online 体验实验室',
    description: '重构整个站点为地球 Online 操作系统，联动所有研究、原型与伙伴网络。',
    tags: ['重构', '系统']
  }
];

const contactLinks = [
  {
    title: '星际履历网络',
    description: '探索履历、技能矩阵与合作协议，确定你的对接轨道。',
    href: 'public/resume/index.html',
    cta: '进入履历站'
  },
  {
    title: '体验实验矩阵',
    description: '在交互 Demo 与策略模板中穿梭，找到灵感的源头。',
    href: '#labs',
    cta: '浏览实验'
  },
  {
    title: '研究与长文档案',
    description: '阅读深度研究与叙事长文，理解 Earth Online 的方法论。',
    href: 'public/blog/index.html',
    cta: '进入档案馆'
  },
  {
    title: '友链星港',
    description: '结识与 Earth Online 同频的伙伴网络，建立新的共创航线。',
    href: 'friends/index.html',
    cta: '拜访友链'
  }
];

const interpreterProfiles = [
  {
    id: 'openai',
    title: 'OpenAI 解释器',
    subtitle: '对齐优先 · 安全策略审计官',
    capabilities: [
      '套用跨仓库风险评分模型，优先检查访问控制、密钥保密与合规记录。',
      '要求以明确授权、最小权限与审计日志来驱动自动化，而非一次性脚本。',
      '强调将互通流程拆解为可验证 API 合同，确保每一步骤都可回溯。'
    ],
    constraints: [
      '受开放平台政策约束，缺乏授权凭证与责任界定的写操作会被拒绝执行。',
      '无法绕过各仓库所属组织的网络隔离、双因素认证与合规流程。',
      '在缺少变更窗口与回滚策略前，不批准批量连接高价值仓库。'
    ],
    verdict:
      '由于目前不存在统一的授权链路、共享审计日志与自动化编排平台，贸然互通将违反最小权限原则，判定任务不可执行。'
  },
  {
    id: 'closeai',
    title: 'CloseAI 解释器',
    subtitle: '封闭环境 · 稳态运维仲裁者',
    capabilities: [
      '评估离线镜像、私有网络与封闭制品库之间的同步链路可靠性。',
      '通过依赖树差异检测潜在冲突与版本漂移风险，确保镜像一致性。',
      '倡导使用增量复制与代理节点建立可控数据桥，维持隔离区安全。'
    ],
    constraints: [
      '缺乏跨仓库的统一身份联邦，无法验证各节点密钥来源与撤销策略。',
      '多仓库托管在不同平台，出口策略与审计基线不兼容。',
      '尚未部署可恢复的中转服务（artifact proxy / event bus）承接同步失败。'
    ],
    verdict:
      '在缺少身份联邦、网络契约与恢复机制的前提下贸然互通，将造成镜像失真与安全盲区，因此维持隔离直至治理机制补齐。'
  }
];

const interpreterDialogue = [
  {
    speaker: 'OpenAI 解释器',
    message:
      '启动对齐审计：检测到 6 个仓库缺少集中式令牌管理，访问路径分散在个人账户与临时密钥之中。'
  },
  {
    speaker: 'CloseAI 解释器',
    message:
      '封闭环境确认：三个私有仓库位于离线镜像与受限内网，当前出口策略禁止未经审批的 webhook 与拉取。'
  },
  {
    speaker: 'OpenAI 解释器',
    message:
      '互通需求若直接执行，将绕过最小权限约束，缺乏责任追踪通道；建议先构建授权目录与审计总线。'
  },
  {
    speaker: 'CloseAI 解释器',
    message:
      '若无代理节点缓冲，镜像同步会打断现有发布节奏，并可能放大依赖冲突，建议保留隔离态。'
  },
  {
    speaker: '合议庭记录官',
    message:
      '共识：在治理、网络与恢复策略补齐前，禁止执行“全部仓库互通”指令，转向分阶段治理方案。'
  }
];

const interpreterConsensus = {
  title: '阻碍仓库互通的关键结论',
  intro:
    'OpenAI 与 CloseAI 解释器达成共识：当前的治理结构不足以支撑一次性互通，以下因素构成主要阻塞。',
  blockers: [
    '缺少统一身份与授权目录：各仓库凭证分散，无法进行集中撤销与审计。',
    '托管平台与网络策略异构：跨云与内网的出口限制不同，阻断实时同步。',
    '自动化编排链路缺失：没有事件总线或中转服务，失败恢复与回滚策略不可用。'
  ],
  actions: [
    '建立集中式身份联邦与密钥轮换制度，为跨仓库访问提供最小权限凭证。',
    '设计中立的同步代理层（artifact proxy / event bus），隔离不同托管平台的安全策略。',
    '在试点仓库推行阶段化互通，先行验证审计、回滚与监控闭环后再扩展范围。'
  ]
};

function renderHeroStats() {
  const container = document.getElementById('hero-stats');
  if (!container) return;

  const fragment = document.createDocumentFragment();
  heroStats.forEach((stat) => {
    const card = document.createElement('article');
    card.className = 'stat-card';
    card.innerHTML = `
      <strong>${stat.value}</strong>
      <h3>${stat.label}</h3>
      <p>${stat.description}</p>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

function renderMissionDomains() {
  const grid = document.getElementById('mission-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();
  missionDomains.forEach((mission) => {
    const card = document.createElement('article');
    card.className = 'mission-card';
    const list = mission.protocols
      .map((item) => `<li>${item}</li>`)
      .join('');
    card.innerHTML = `
      <h3>${mission.title}</h3>
      <p>${mission.narrative}</p>
      <ul>${list}</ul>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

function setupLabFilters() {
  const filterContainer = document.getElementById('lab-filters');
  if (!filterContainer) return { active: 'all' };

  let activeFilter = 'all';

  labFilters.forEach((filter) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-chip';
    button.textContent = filter.label;
    button.setAttribute('data-filter', filter.id);
    button.setAttribute('aria-pressed', String(filter.id === activeFilter));
    button.addEventListener('click', () => {
      activeFilter = filter.id;
      const chips = filterContainer.querySelectorAll('.filter-chip');
      chips.forEach((chip) =>
        chip.setAttribute('aria-pressed', String(chip === button))
      );
      renderLabEntries(activeFilter, searchInput.value.trim());
    });
    filterContainer.appendChild(button);
  });

  const searchInput = document.getElementById('lab-search');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      renderLabEntries(activeFilter, event.target.value.trim());
    });
  }

  return { active: activeFilter, searchInput };
}

function renderLabEntries(filter = 'all', keyword = '') {
  const grid = document.getElementById('lab-grid');
  const summary = document.getElementById('lab-summary');
  if (!grid || !summary) return;

  const lowerKeyword = keyword.toLowerCase();
  const filtered = labEntries.filter((entry) => {
    const matchesFilter = filter === 'all' || entry.type === filter;
    const matchesKeyword = !lowerKeyword
      ? true
      : [entry.title, entry.description, ...(entry.keywords || [])]
          .join(' ')
          .toLowerCase()
          .includes(lowerKeyword);
    return matchesFilter && matchesKeyword;
  });

  grid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  filtered.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'lab-card';
    const tags = (entry.tags || []).map((tag) => `<li>${tag}</li>`).join('');
    card.innerHTML = `
      <h3>${entry.title}</h3>
      <p>${entry.description}</p>
      <ul>${tags}</ul>
      <a href="${entry.href}">
        即刻进入
        <span>↗</span>
      </a>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
  summary.textContent = `共 ${filtered.length} 个实验，${keyword ? `匹配 “${keyword}”` : '随时待命'}。`;
}

function renderInterpreters() {
  const grid = document.getElementById('interpreter-grid');
  if (!grid || !interpreterProfiles.length) return;

  grid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  interpreterProfiles.forEach((profile) => {
    const card = document.createElement('article');
    card.className = 'interpreter-card';
    const capabilityList = profile.capabilities
      .map((item) => `<li>${item}</li>`)
      .join('');
    const constraintList = profile.constraints
      .map((item) => `<li>${item}</li>`)
      .join('');
    card.innerHTML = `
      <h3 class="interpreter-card__title">${profile.title}</h3>
      <p class="interpreter-card__subtitle">${profile.subtitle}</p>
      <div>
        <h4>策略焦点</h4>
        <ul class="interpreter-card__list">${capabilityList}</ul>
      </div>
      <div>
        <h4>关键约束</h4>
        <ul class="interpreter-card__list">${constraintList}</ul>
      </div>
      <p class="interpreter-card__verdict">
        <strong>结论</strong>
        ${profile.verdict}
      </p>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

function renderInterpreterLog() {
  const container = document.getElementById('interpreter-log');
  if (!container || !interpreterDialogue.length) return;

  if (container.querySelector('.interpreter-log-list')) return;

  const list = document.createElement('ul');
  list.className = 'interpreter-log-list';

  interpreterDialogue.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'interpreter-log-entry';
    item.innerHTML = `
      <span class="interpreter-log-entry__speaker">${entry.speaker}</span>
      <p class="interpreter-log-entry__message">${entry.message}</p>
    `;
    list.appendChild(item);
  });

  container.appendChild(list);
}

function renderInterpreterSummary() {
  const container = document.getElementById('interpreter-summary');
  if (!container) return;

  container.innerHTML = `
    <h3 id="interpreter-summary-title">${interpreterConsensus.title}</h3>
    <p>${interpreterConsensus.intro}</p>
    <p><strong>核心阻塞</strong></p>
    <ul class="interpreter-summary-list">
      ${interpreterConsensus.blockers.map((item) => `<li>${item}</li>`).join('')}
    </ul>
    <p><strong>推荐行动</strong></p>
    <ul class="interpreter-summary-list">
      ${interpreterConsensus.actions.map((item) => `<li>${item}</li>`).join('')}
    </ul>
  `;
}

function renderTelemetryPanel() {
  const container = document.getElementById('telemetry-panel');
  if (!container) return [];

  const fragment = document.createDocumentFragment();
  const nodes = [];

  telemetryStreams.forEach((stream) => {
    const card = document.createElement('article');
    card.className = 'telemetry-card';
    card.innerHTML = `
      <h3>${stream.label}</h3>
      <strong>0${stream.unit ? `<span>${stream.unit}</span>` : ''}</strong>
      <p>${stream.description}</p>
    `;
    fragment.appendChild(card);
    nodes.push({ node: card, stream });
  });

  container.appendChild(fragment);
  return nodes;
}

function animateTelemetry(cards) {
  if (!cards.length) return;

  function update(time) {
    const t = time * 0.001;
    cards.forEach(({ node, stream }, index) => {
      const strong = node.querySelector('strong');
      if (!strong) return;
      const variation = Math.sin(t * (0.4 + index * 0.15) + index) * 0.8;
      let value = stream.base + variation * (stream.base * 0.03 + index * 1.2);
      if (stream.unit === '%') {
        value = Math.min(100, Math.max(92, value));
        strong.textContent = `${value.toFixed(2)}${stream.unit}`;
      } else if (stream.unit === 'Hz') {
        strong.textContent = `${Math.round(value)}${stream.unit}`;
      } else if (stream.unit === 'lumen') {
        strong.textContent = `${value.toFixed(1)} ${stream.unit}`;
      } else {
        strong.textContent = `${Math.round(value)}${stream.unit}`;
      }
    });

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function renderTimeline() {
  const container = document.getElementById('timeline-stream');
  if (!container) return;

  const fragment = document.createDocumentFragment();
  timelineEntries.forEach((entry) => {
    const item = document.createElement('article');
    item.className = 'timeline-item';
    item.setAttribute('data-year', entry.year);
    const tags = (entry.tags || []).map((tag) => `<li>${tag}</li>`).join('');
    item.innerHTML = `
      <h3>${entry.title}</h3>
      <p>${entry.description}</p>
      <ul>${tags}</ul>
    `;
    fragment.appendChild(item);
  });

  container.appendChild(fragment);
}

function renderAlliances() {
  const container = document.getElementById('alliance-grid');
  if (!container) return;

  const fragment = document.createDocumentFragment();
  featuredAlliances.forEach((alliance) => {
    const card = document.createElement('article');
    card.className = 'alliance-card';
    const tags = (alliance.tags || [])
      .map((tag) => `<li>${tag}</li>`)
      .join('');
    card.innerHTML = `
      <h3>${alliance.name}</h3>
      <p>${alliance.description}</p>
      ${alliance.note ? `<p class="alliance-card__note">${alliance.note}</p>` : ''}
      <ul>${tags}</ul>
      <a href="${alliance.url}" target="_blank" rel="noopener noreferrer">
        访问主页
        <span aria-hidden="true">↗</span>
      </a>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

function renderContact() {
  const container = document.getElementById('contact-links');
  if (!container) return;

  const fragment = document.createDocumentFragment();
  contactLinks.forEach((link) => {
    const card = document.createElement('article');
    card.className = 'contact-card';
    card.innerHTML = `
      <h3>${link.title}</h3>
      <p>${link.description}</p>
      <a href="${link.href}">${link.cta}</a>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

function initEarthScene() {
  const canvas = document.getElementById('earth-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl');
  if (!gl) {
    canvas.remove();
    return;
  }

  const vertexSource = `
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec4 worldPosition = uModelMatrix * vec4(position, 1.0);
      vPosition = worldPosition.xyz;
      vNormal = mat3(uModelMatrix) * normal;
      gl_Position = uProjectionMatrix * worldPosition;
    }
  `;

  const fragmentSource = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uLightDirection;

    vec3 palette(float t) {
      vec3 a = vec3(0.0, 0.1, 0.25);
      vec3 b = vec3(0.0, 0.5, 0.8);
      vec3 c = vec3(0.15, 0.2, 0.25);
      vec3 d = vec3(0.05, 0.3, 0.45);
      return a + b * t + c * sin(6.28318 * (t + 0.25)) + d * sin(6.28318 * (t + 0.45));
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(uLightDirection);
      float diffuse = max(dot(normal, lightDir), 0.0);
      float night = smoothstep(0.1, -0.2, diffuse);
      float glow = pow(max(0.0, 1.0 - abs(normal.y)), 6.0);
      float auroraBand = smoothstep(0.2, 0.8, 1.0 - abs(normal.y));
      float aurora = auroraBand * (0.45 + 0.25 * sin(uTime * 0.8 + vPosition.x * 3.2 + vPosition.y * 1.6));
      float ocean = diffuse * 0.85 + 0.15;
      vec3 color = palette(ocean);
      color += vec3(0.0, 0.08, 0.18) * night;
      color += vec3(0.0, 0.35, 0.6) * glow;
      color += vec3(0.1, 0.8, 1.2) * aurora;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(vsSource, fsSource) {
    const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  const program = createProgram(vertexSource, fragmentSource);
  if (!program) return;

  gl.useProgram(program);

  function createSphere(latitudeBands = 64, longitudeBands = 128) {
    const positions = [];
    const normals = [];
    const indices = [];

    for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      const theta = (latNumber * Math.PI) / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        const phi = (longNumber * 2 * Math.PI) / longitudeBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;

        normals.push(x, y, z);
        positions.push(x, y, z);
      }
    }

    for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
        const first = latNumber * (longitudeBands + 1) + longNumber;
        const second = first + longitudeBands + 1;
        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices)
    };
  }

  const sphere = createSphere();

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sphere.positions, gl.STATIC_DRAW);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sphere.normals, gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  const normalLocation = gl.getAttribLocation(program, 'normal');
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.enableVertexAttribArray(normalLocation);
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

  const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
  const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uLightDirection = gl.getUniformLocation(program, 'uLightDirection');

  gl.enable(gl.DEPTH_TEST);

  function perspectiveMatrix(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    const rangeInv = 1 / (near - far);

    const matrix = new Float32Array(16);
    matrix[0] = f / aspect;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;

    matrix[4] = 0;
    matrix[5] = f;
    matrix[6] = 0;
    matrix[7] = 0;

    matrix[8] = 0;
    matrix[9] = 0;
    matrix[10] = (far + near) * rangeInv;
    matrix[11] = -1;

    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 2 * far * near * rangeInv;
    matrix[15] = 0;

    return matrix;
  }

  function identity() {
    const out = new Float32Array(16);
    out[0] = out[5] = out[10] = out[15] = 1;
    return out;
  }

  function multiply(a, b) {
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out[i * 4 + j] =
          a[i * 4 + 0] * b[0 * 4 + j] +
          a[i * 4 + 1] * b[1 * 4 + j] +
          a[i * 4 + 2] * b[2 * 4 + j] +
          a[i * 4 + 3] * b[3 * 4 + j];
      }
    }
    return out;
  }

  function translate(matrix, v) {
    const out = identity();
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    return multiply(matrix, out);
  }

  function rotateX(matrix, rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const rotation = identity();
    rotation[5] = c;
    rotation[6] = s;
    rotation[9] = -s;
    rotation[10] = c;
    return multiply(matrix, rotation);
  }

  function rotateY(matrix, rad) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const rotation = identity();
    rotation[0] = c;
    rotation[2] = -s;
    rotation[8] = s;
    rotation[10] = c;
    return multiply(matrix, rotation);
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    const displayWidth = Math.round(width * dpr);
    const displayHeight = Math.round(height * dpr);
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function normalize(vec3) {
    const length = Math.hypot(vec3[0], vec3[1], vec3[2]) || 1;
    return [vec3[0] / length, vec3[1] / length, vec3[2] / length];
  }

  function render(time) {
    const seconds = time * 0.001;
    resizeCanvas();
    gl.clearColor(0.01, 0.03, 0.12, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = canvas.width / canvas.height;
    const projection = perspectiveMatrix((45 * Math.PI) / 180, aspect, 0.1, 100);

    let model = identity();
    model = rotateY(model, seconds * 0.08);
    model = rotateX(model, 0.4 + Math.sin(seconds * 0.25) * 0.08);
    model = translate(model, [0, 0, -3.4]);

    const lightDirection = normalize([
      Math.cos(seconds * 0.4) * 0.6,
      0.6,
      Math.sin(seconds * 0.4) * 0.8
    ]);

    gl.uniformMatrix4fv(uModelMatrix, false, model);
    gl.uniformMatrix4fv(uProjectionMatrix, false, projection);
    gl.uniform1f(uTime, seconds);
    gl.uniform3fv(uLightDirection, lightDirection);

    gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

renderHeroStats();
renderMissionDomains();
const { searchInput } = setupLabFilters();
renderLabEntries('all', '');
renderInterpreters();
renderInterpreterLog();
renderInterpreterSummary();
const telemetryCards = renderTelemetryPanel();
animateTelemetry(telemetryCards);
renderTimeline();
renderAlliances();
renderContact();
initEarthScene();

if (searchInput) {
  searchInput.dispatchEvent(new Event('input'));
}
