const projects = [
  {
    title: 'Nebula City XR 数字孪生',
    description: '担任体验负责人，打造跨端沉浸式城市社交，整合 Web、AR 眼镜与 CAVE 互动场景，首月激活率提升 38%。',
    href: 'demo/ctc/index.html',
    cta: '查看交互概念 →'
  },
  {
    title: 'Horizon Arena 虚拟演唱会平台',
    description: '设计并实现实时舞台编排与粉丝互动玩法，将 WebGL / WebGPU 渲染延迟控制在 28ms 内，单场在线突破 120 万。',
    href: 'demo/time-crystal/index.html',
    cta: '体验舞台 →'
  },
  {
    title: 'LumenDesk 分布式协作工作台',
    description: '围绕远距团队搭建多模态协作工具，构建低延迟白板、语义任务流与仪式化提醒，让跨时区交付效率提升 45%。',
    href: 'demo/miu-tiantian-gradient-descent/index.html',
    cta: '浏览原型 →'
  },
  {
    title: 'Ripple Protocol 控制中心',
    description: '为 Web3 基础设施打造资产与节点治理面板，负责信息架构、动效系统与 TypeScript 前端，实现 0.5 秒内数据响应。',
    href: 'demo/blockchan/index.html',
    cta: '查看仪表盘 →'
  },
  {
    title: 'OmniSpace 创作者工具包',
    description: '为创作者提供跨宇宙叙事编辑器，集成音视频协作、可视化脚本与实时同步，帮助团队 2 周内完成主题发布。',
    href: 'demo/bchan-pchan-synchrony/index.html',
    cta: '进入工具包 →'
  },
  {
    title: '在线简历',
    description: '更详细的工作经历、技能矩阵与案例拆解，可快速了解我如何帮助团队交付成果。',
    href: 'resume/index.html',
    cta: '阅读简历 →'
  }
];

const timeline = [
  {
    datetime: '2024-07-01',
    label: '2024 · Jul',
    title: 'Nebula City 2.0 正式开放',
    summary: '完成跨端体验升级，上线 AI 导航与协作空间，核心场景留存率提升 18%，沉浸时长提升 26%。'
  },
  {
    datetime: '2024-06-16',
    label: '2024 · Jun',
    title: '在 GDC China 分享 XR DesignOps 实践',
    summary: '受邀发表《让 XR 团队协同有章法》的主题演讲，分享指标驱动、设计系统与跨端交付的落地经验。'
  },
  {
    datetime: '2024-05-22',
    label: '2024 · May',
    title: 'LumenDesk 获得战略合作',
    summary: '牵头体验路线与体验指标体系，助力产品与三家全球创新团队达成联合试点，续费率达到 92%。'
  },
  {
    datetime: '2024-04-08',
    label: '2024 · Apr',
    title: '发布《XR 团队体验指标手册》',
    link: 'blog/internet-of-everything-design.html',
    summary: '整理沉浸式体验中的业务指标、体验指标与技术指标映射关系，帮助团队从愿景对齐到结果复盘。'
  },
  {
    datetime: '2024-02-28',
    label: '2024 · Feb',
    title: '主持 12 场跨时区设计冲刺',
    summary: '与产品、工程、市场共创，三周内完成沉浸式新人旅程升级，用户激活任务成功率提升 34%。'
  },
  {
    label: 'Now',
    title: '开放新的合作机会',
    summary: '希望与愿景大胆、行动快速的团队合作，共同打造下一代元宇宙与协作体验。'
  }
];

const createProjectCard = ({ title, description, href, cta }) => {
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

const createTimelineItem = ({ datetime, label, title, link, summary }) => {
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

const mountProjects = () => {
  const container = document.getElementById('project-list');
  if (!container) return;
  const fragment = document.createDocumentFragment();
  projects.forEach((project) => {
    fragment.appendChild(createProjectCard(project));
  });
  container.appendChild(fragment);
};

const mountTimeline = () => {
  const container = document.getElementById('timeline-list');
  if (!container) return;
  const fragment = document.createDocumentFragment();
  timeline.forEach((entry) => {
    fragment.appendChild(createTimelineItem(entry));
  });
  container.appendChild(fragment);
};

const updateCopyrightYear = () => {
  const target = document.getElementById('year');
  if (target) {
    target.textContent = new Date().getFullYear();
  }
};

mountProjects();
mountTimeline();
updateCopyrightYear();
