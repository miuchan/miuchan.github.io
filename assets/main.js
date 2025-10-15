const projects = [
  {
    title: 'Blockchan',
    description: '区块链主题的视觉实验，使用组件化方式搭建，尝试用动效呈现信息结构。',
    href: 'demo/blockchan/index.html',
    cta: '打开演示 →'
  },
  {
    title: 'Canvas Low Poly',
    description: '基于 Delaunay 三角剖分的低多边形生成器，探索 Canvas 与色彩的更多可能性。',
    href: 'demo/canvas-demo/lowpoly/index.html',
    cta: '立即体验 →'
  },
  {
    title: '生命游戏：吸子催化',
    description: '模拟滑翔子（引子）与吸子之间的经典催化反应，观察吸子如何重复吞噬来袭引子。',
    href: 'demo/game-of-life/eater-catalysis/index.html',
    cta: '观看反应 →'
  },
  {
    title: '奇点生命场',
    description: '在生命游戏的规则上引入引力奇点，体验弯曲邻域下分形生命的诞生与湮灭。',
    href: 'demo/singularity-life/index.html',
    cta: '唤醒奇点 →'
  },
  {
    title: '生命游戏：三维宇宙',
    description: '把生命游戏扩展到 16³ 的立方空间，遵循 B5/S45 规则，观察三维结构的自组织与崩解。',
    href: 'demo/game-of-life/3d-life/index.html',
    cta: '进入宇宙 →'
  },
  {
    title: '生命游戏：球面拓扑',
    description: '在球面上用测地距离定义邻域，探索非欧几何曲面上的生命波前如何缠绕、汇聚与传播。',
    href: 'demo/game-of-life/non-euclidean/index.html',
    cta: '登上星球 →'
  },
  {
    title: '生命游戏：三角晶格',
    description: '把生命游戏搬到等边三角晶格，体验更稠密邻域下的波纹、织纹与流体般演化。',
    href: 'demo/game-of-life/triangular/index.html',
    cta: '开启演化 →'
  },
  {
    title: '封闭类时曲线实验室',
    description: '用可视化的时空图演示广义相对论中的封闭类时曲线，透过交互感受时间扭曲。',
    href: 'demo/ctc/index.html',
    cta: '探索时间循环 →'
  },
  {
    title: 'CTC 凸优化实验',
    description: '在保持因果约束的前提下对封闭类时曲线做凸优化，观察世界线如何趋于平滑且遵守光速边界。',
    href: 'demo/ctc-optimizer/index.html',
    cta: '调参收敛 →'
  },
  {
    title: '时间晶体共振舱',
    description: '调节驱动、对称破缺与耗散，观看时间晶体在离散时间对称下如何自发锁模与周期跳跃。',
    href: 'demo/time-crystal/index.html',
    cta: '捕捉节拍 →'
  },
  {
    title: '巨子与微子反应室',
    description: '构建巨子、微子与中微子的假想模型，通过滑杆观察中微子催化下的能量振荡与相态转化。',
    href: 'demo/neutrino-catalysis/index.html',
    cta: '进入实验 →'
  },
  {
    title: 'B子与P子联动工作室',
    description: '把两位站娘视作耦合振子，调参观测她们的节奏如何从独立舞动逐渐走向灵感同频。',
    href: 'demo/bchan-pchan-synchrony/index.html',
    cta: '启动联动 →'
  },
  {
    title: '悠子与冰子共振实验',
    description: '用双耦合谐振模型描绘两人情绪的能量交换，调节参数让她们逐渐走向同频。',
    href: 'demo/yuko-bingzi-resonance/index.html',
    cta: '感受共振 →'
  },
  {
    title: 'Baidu IFE 系列',
    description: 'IFE 训练营阶段性作品集，涵盖布局、交互与组件练习，是成长路上的重要脚印。',
    href: 'demo/baidu-ife-task/task_1_06/index.html',
    cta: '查看练习 →'
  },
  {
    title: '在线简历',
    description: '完整介绍我的技能栈、经历与项目情况，也是保持自我复盘的重要方式。',
    href: 'resume/index.html',
    cta: '阅读简历 →'
  }
];

const timeline = [
  {
    datetime: '2024-06-15',
    label: '2024 · Jun',
    title: '对生命游戏进行凸优化',
    link: 'blog/game-of-life-convex-optimization.html',
    summary: '把康威生命游戏松弛成凸优化问题，探索变量设计、目标函数与控制策略，让复杂结构的“定制”更有章法。'
  },
  {
    datetime: '2024-06-01',
    label: '2024 · Jun',
    title: '万物互联的设计与实现',
    link: 'blog/internet-of-everything-design.html',
    summary: '从战略、架构、体验到运营四个篇章，记录打造可信赖 IoE 平台的思考与实践工具。'
  },
  {
    datetime: '2024-05-01',
    label: '2024 · May',
    title: '理解封闭类时曲线凸优化的本质',
    link: 'blog/ctc-convex-optimization.html',
    summary: '用凸优化的语言梳理封闭类时曲线的因果约束、目标函数与数值求解，让“时间循环”有了可计算的解释。'
  },
  {
    datetime: '2015-10-20',
    label: '2015 · Oct 20',
    title: 'Hello World',
    link: 'blog/2015/10/20/hello-world/index.html',
    summary: '搭建博客后的第一篇文章，记录了向开源与分享迈出的第一步。'
  },
  {
    datetime: '2015-10-20',
    label: '2015 · Oct 20',
    title: '测试页面',
    link: 'blog/2015/10/20/test/index.html',
    summary: '尝试新的排版与样式设置，让内容的呈现方式更加灵活。'
  },
  {
    datetime: '2024',
    label: '持续更新',
    title: '更多灵感',
    summary: '更多关于前端实践、工具笔记与生活观察，正在整理上架，敬请期待。'
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
