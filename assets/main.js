const resources = [
  {
    title: '分支预测策略实验室',
    description: '比较静态、局部与 gshare 预测器的命中率，观察误判冲刷成本与别名对性能的影响。',
    href: 'demo/branch-prediction/index.html',
    cta: '体验预测器 →'
  },
  {
    title: 'Atlas 审批旅程蓝图',
    description: '风控平台的指标看板、审批旅程与跨团队 OKR 模板，帮助你复制端到端的决策体验。',
    href: 'demo/qed/index.html',
    cta: '查看蓝图 →'
  },
  {
    title: 'Terrabyte 协作剧本',
    description: '气候数据团队的多时区协作模型与无障碍设计评估表，可直接嵌入现有流程。',
    href: 'demo/ctc/index.html',
    cta: '阅读剧本 →'
  },
  {
    title: 'Campfire 成长循环',
    description: '创作者社区的增长实验框架与内容运营脚本，适合快速搭建社区增长循环。',
    href: 'demo/time-crystal/index.html',
    cta: '解锁循环 →'
  },
  {
    title: 'Design System Starter Kit',
    description: 'Design Token、组件规范与无障碍检查清单，帮助团队加速设计系统的落地。',
    href: 'demo/miu-tiantian-gradient-descent/index.html',
    cta: '使用工具包 →'
  },
  {
    title: '羽光不动点一致性递归梯度下降',
    description: '可视化羽光-情绪-拓扑映射的固定点求解，体验递归梯度下降的多层回响。',
    href: 'demo/featherlight-fixed-point-recursion/index.html',
    cta: '体验羽光回响 →'
  },
  {
    title: 'Workflow Automation 模板',
    description: '结合 Notion、Linear 与 GitHub 的跨团队节奏，附带仪式脚本与沟通模版。',
    href: 'demo/blockchan/index.html',
    cta: '复制流程 →'
  },
  {
    title: '设计工程 Demo 集',
    description: '展示 TypeScript + WebGL 的互动体验原型，可作为设计工程协作的参考。',
    href: 'demo/bchan-pchan-synchrony/index.html',
    cta: '浏览 Demo →'
  },
  {
    title: '在线简历',
    description: '了解更完整的经历、技能矩阵与合作模式，便于确认项目匹配度。',
    href: 'resume/index.html',
    cta: '查看履历 →'
  }
];

const insights = [
  {
    datetime: '2024-07-12',
    label: '2024 · Jul',
    title: 'Atlas 审批体验 2.0 发布复盘',
    summary: '分享指标对齐方法与审批旅程升级细节，附带价值主张画布与成功指标清单。'
  },
  {
    datetime: '2024-06-21',
    label: '2024 · Jun',
    title: '在 Product Led Summit 分享设计工程实践',
    summary: '介绍设计系统与工程协作的接口契约，提供组件治理与验收脚本。'
  },
  {
    datetime: '2024-05-18',
    label: '2024 · May',
    title: '发布《气候数据体验的 6 个信息架构要点》',
    link: 'blog/internet-of-everything-design.html',
    summary: '涵盖多源数据的 IA 策略、图表可读性与多语言协作基线。'
  },
  {
    datetime: '2024-03-30',
    label: '2024 · Mar',
    title: 'Campfire 社区增长实验手册 v3.0',
    summary: '整合增长仪表板、内容节奏与导师体系，帮助社区复制增长循环。'
  },
  {
    datetime: '2024-01-25',
    label: '2024 · Jan',
    title: 'DesignOps 工具集开源',
    summary: '公开设计评审模板、团队仪式脚本与自动化检查工具，便于快速复用。'
  },
  {
    label: 'Now',
    title: '开放新一轮产品共创',
    summary: '寻找希望加速体验重构与设计工程协作的团队，欢迎预约探索会议。'
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

const createInsightItem = ({ datetime, label, title, link, summary }) => {
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

const mountInsights = () => {
  const container = document.getElementById('insight-list');
  if (!container) return;
  const fragment = document.createDocumentFragment();
  insights.forEach((entry) => {
    fragment.appendChild(createInsightItem(entry));
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
mountInsights();
updateCopyrightYear();
