const resources = [
  {
    title: 'Nebula City XR 体验知识手册',
    description: '沉浸式社交平台的指标拆解、旅程地图与无障碍检查清单，适合评估跨端体验上线策略。',
    href: 'demo/ctc/index.html',
    cta: '浏览体验地图 →'
  },
  {
    title: 'Horizon Arena 虚拟演唱会蓝图',
    description: '实时舞台编排与粉丝互动的工程方案，覆盖 WebGL/WebGPU 架构、性能监测与运营脚本。',
    href: 'demo/time-crystal/index.html',
    cta: '查看蓝图 →'
  },
  {
    title: 'LumenDesk 分布式协作仪表盘',
    description: '多模态协作工具的任务流、低延迟白板与仪式化提醒设计，附带组件库与指标看板示例。',
    href: 'demo/miu-tiantian-gradient-descent/index.html',
    cta: '打开仪表盘 →'
  },
  {
    title: 'Ripple Protocol 控制中心',
    description: 'Web3 基础设施治理的可视化策略，包含信息架构、动效系统与 TypeScript 前端最佳实践。',
    href: 'demo/blockchan/index.html',
    cta: '阅读控制中心 →'
  },
  {
    title: 'OmniSpace 创作者工具包',
    description: '跨宇宙叙事编辑器的知识库：音视频协作、可视化脚本与发布流程的模板集合。',
    href: 'demo/bchan-pchan-synchrony/index.html',
    cta: '进入工具包 →'
  },
  {
    title: '在线简历',
    description: '更详细的经历、技能矩阵与案例拆解，帮助你验证合作深度与可用时段。',
    href: 'resume/index.html',
    cta: '阅读简历 →'
  }
];

const updates = [
  {
    datetime: '2024-07-01',
    label: '2024 · Jul',
    title: 'Nebula City 2.0 发布复盘',
    summary: '上线 AI 导航与协作空间，沉浸时长 +26%，复盘中附带指标看板模板与旅程优化策略。'
  },
  {
    datetime: '2024-06-16',
    label: '2024 · Jun',
    title: '在 GDC China 分享 XR DesignOps',
    summary: '输出沉浸式团队协同的仪式与指标体系，公开分享幻灯与工具包。'
  },
  {
    datetime: '2024-05-22',
    label: '2024 · May',
    title: 'LumenDesk 获得战略合作',
    summary: '联手三家全球创新团队开展试点，续费率达 92%，沉浸式入门手册升级至 v2.1。'
  },
  {
    datetime: '2024-04-08',
    label: '2024 · Apr',
    title: '发布《XR 团队体验指标手册》',
    link: 'blog/internet-of-everything-design.html',
    summary: '梳理沉浸式体验中的业务、体验与技术指标映射，附带指标仪表与协作节奏模板。'
  },
  {
    datetime: '2024-02-28',
    label: '2024 · Feb',
    title: '主持跨时区设计冲刺 12 场',
    summary: '三周内完成新人旅程升级，激活任务成功率提升 34%，沉浸式冲刺脚本开放下载。'
  },
  {
    label: 'Now',
    title: '开放新的合作机会',
    summary: '寻找勇于实验沉浸式体验与协作工具的团队，让知识库直接作用于下一次发布。'
  }
];

const createResourceCard = ({ title, description, href, cta }) => {
  const link = document.createElement('a');
  link.className = 'card';
  link.href = href;
  link.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    <span class="link">${cta}</span>
  `;
  return link;
};

const createUpdateItem = ({ datetime, label, title, link, summary }) => {
  const item = document.createElement('div');
  item.className = 'timeline-item';

  if (datetime) {
    const timeEl = document.createElement('time');
    timeEl.dateTime = datetime;
    timeEl.textContent = label;
    item.appendChild(timeEl);
  } else {
    const span = document.createElement('span');
    span.textContent = label;
    item.appendChild(span);
  }

  const heading = document.createElement('h3');
  if (link) {
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.textContent = title;
    heading.appendChild(anchor);
  } else {
    heading.textContent = title;
  }
  item.appendChild(heading);

  const paragraph = document.createElement('p');
  paragraph.textContent = summary;
  item.appendChild(paragraph);

  return item;
};

const mountResources = () => {
  const container = document.getElementById('resource-list');
  if (!container) return;
  const fragment = document.createDocumentFragment();
  resources.forEach((resource) => {
    fragment.appendChild(createResourceCard(resource));
  });
  container.appendChild(fragment);
};

const mountUpdates = () => {
  const container = document.getElementById('update-list');
  if (!container) return;
  const fragment = document.createDocumentFragment();
  updates.forEach((entry) => {
    fragment.appendChild(createUpdateItem(entry));
  });
  container.appendChild(fragment);
};

const updateCopyrightYear = () => {
  const target = document.getElementById('year');
  if (target) {
    target.textContent = new Date().getFullYear();
  }
};

mountResources();
mountUpdates();
updateCopyrightYear();
