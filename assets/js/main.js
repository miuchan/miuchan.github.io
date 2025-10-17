const counts = {
  demos: 20,
  blogPosts: 59,
  researchDocs: 1,
  resumeAssets: 1,
  totalArtifacts: 20 + 59 + 1 + 1
};

const heroMeta = [
  {
    label: '静态资产总量',
    value: `${counts.totalArtifacts}+`,
    description: '覆盖交互原型、研究文章、履历与协作模板的完整集合。'
  },
  {
    label: '交互 Demo',
    value: counts.demos,
    description: 'WebGL、数据可视化与流程建模示例，为设计工程协作提供参考。'
  },
  {
    label: '研究长文',
    value: counts.blogPosts,
    description: '策略、算法与体验系统文章，可直接引用于跨部门评审。'
  }
];

const overviewDomains = [
  {
    eyebrow: 'Core Platform',
    title: '静态知识主站',
    description:
      'index.html 与 assets/ 组成的零框架站点，负责全局导航、语义布局与数据驱动的动态生成。',
    stats: [
      { label: '页面', value: '1 个入口' },
      { label: '模块', value: '6 大展区' },
      { label: '技术栈', value: '原生 HTML · CSS · JS' }
    ]
  },
  {
    eyebrow: 'Research Layer',
    title: '研究与证明库',
    description:
      'docs/ 下存放了计算奇点等数学推演，提供策略评估的严谨依据，并与博客长文交叉引用。',
    stats: [
      { label: 'Markdown', value: `${counts.researchDocs} 篇核心证明` },
      { label: '引用规范', value: 'APA / DOI 链接' }
    ]
  },
  {
    eyebrow: 'Prototype Layer',
    title: '交互原型走廊',
    description:
      'public/demo/ 收录 20 个面向算法、体验与运营协作的可执行 Demo，涵盖仿真、可视化与流程脚本。',
    stats: [
      { label: 'Demo 数量', value: `${counts.demos} 个` },
      { label: '涉及领域', value: 'CPU 架构 · WebGL · 运营流程' }
    ]
  },
  {
    eyebrow: 'Ops & Talent',
    title: '履历与治理资产',
    description:
      'public/resume/ 与 blog/Friends 目录整合人才画像、合作模式与伙伴网络，支撑项目准备阶段。',
    stats: [
      { label: '履历版本', value: `${counts.resumeAssets} 套` },
      { label: '伙伴链接', value: '10+ 行业伙伴' }
    ]
  }
];

const repositoryMap = [
  {
    path: 'index.html',
    title: '知识图谱入口',
    tags: ['layout', 'meta', 'accessibility'],
    description:
      '定义语义结构、导航与交互分区，是站点的编排中枢，协调下游数据渲染脚本。',
    highlights: {
      focus: ['主导航语义化标签', 'ARIA 描述与实时更新区域', '自适应网格布局'],
      consumers: ['前端开发', '体验设计', '信息架构'],
      actions: [
        '集成新的展区时，扩展 <main> 内的 section 并在导航中登记。',
        '维持无障碍属性，确保动态内容具备 aria-live。'
      ]
    }
  },
  {
    path: 'assets/css/styles.css',
    title: '体验系统样式层',
    tags: ['design system', 'theming'],
    description:
      '集中定义色彩、阴影与响应式网格，提供高对比度的夜间观测体验，并对可读性进行强化。',
    highlights: {
      focus: ['CSS 自定义属性', '卡片式布局', '响应式断点'],
      consumers: ['设计工程', '可视化专家'],
      actions: [
        '新增组件前，优先复用变量与阴影令主题保持一致。',
        '移动端布局需在 900px 以下断点进行验证。'
      ]
    }
  },
  {
    path: 'assets/js/main.js',
    title: '数据驱动呈现层',
    tags: ['vanilla js', 'data viz', 'state'],
    description:
      '聚合目录元数据、生成卡片、驱动搜索过滤与表达式解释器，实现零依赖的交互体验。',
    highlights: {
      focus: ['数据常量映射仓库结构', '无框架组件化渲染', '过滤与统计逻辑'],
      consumers: ['前端开发', '架构师'],
      actions: [
        '引入新资源时，更新 artifacts 数组以保持索引准确。',
        '保持输入校验，防止解释器执行非预期表达式。'
      ]
    }
  },
  {
    path: 'docs/',
    title: '研究文档集',
    tags: ['research', 'math'],
    description:
      '以 Markdown 形式记录可引用的研究成果，当前聚焦计算奇点的上界证明，可扩展更多论文。',
    highlights: {
      focus: ['历史基线数据', '增长率推导', '物理极限引用'],
      consumers: ['研究科学家', '战略顾问'],
      actions: [
        '新增文档请在附录的版本历史中登记。',
        '确保引用格式包含 doi 或出版信息。'
      ]
    }
  },
  {
    path: 'public/demo/',
    title: '交互实验矩阵',
    tags: ['prototype', 'visualization'],
    description:
      '面向算法验证、体验评估与增长运营的原型集合，提供即点即用的 Web 实验。',
    highlights: {
      focus: ['CPU 预测模型', '多主体协作流程', '可持续体验模拟'],
      consumers: ['数据科学', '产品设计', '运营策略'],
      actions: [
        'Demo 目录保持 index.html 与资源同级，便于 GitHub Pages 直接引用。',
        '如需添加依赖，请使用原生 API 或将打包结果直接放入目录。'
      ]
    }
  },
  {
    path: 'public/blog/',
    title: '知识档案馆',
    tags: ['longform', 'content strategy'],
    description:
      '整合 2015 与 2024 年的长文，包括体验系统方法论、Convex 优化与合作网络的记录。',
    highlights: {
      focus: ['IA 策略', '算法洞察', '社区运营'],
      consumers: ['内容策略', '创新顾问', '教育团队'],
      actions: [
        '新增文章时更新 archives/index.html，保证时间线可追溯。',
        '维持 CSS 与 assets 目录的共享设计风格。'
      ]
    }
  },
  {
    path: 'public/resume/',
    title: '履历与合作模板',
    tags: ['talent', 'ops'],
    description:
      '包含在线履历与静态资源，为合作前的角色匹配、技能矩阵与沟通节奏提供现成材料。',
    highlights: {
      focus: ['合作模式说明', '技能矩阵', '可下载版本'],
      consumers: ['人力合作伙伴', '项目发起人'],
      actions: [
        '履历更新后同步调整链接以保持历史版本可访问。'
      ]
    }
  }
];

const knowledgeStreams = [
  {
    title: '策略与体验系统重构',
    focus: ['审批旅程', '设计系统', '增长实验'],
    description:
      '适合产品策略与体验负责人，快速浏览 Atlas 审批蓝图、DesignOps 工具与社区增长脚本。',
    links: [
      { label: 'Atlas 审批旅程蓝图', href: 'public/demo/qed/index.html' },
      { label: 'Design System Starter Kit', href: 'public/demo/miu-tiantian-gradient-descent/index.html' },
      { label: 'Campfire 社区增长手册', href: 'public/demo/time-crystal/index.html' }
    ]
  },
  {
    title: '算法与工程验证',
    focus: ['CPU 分支预测', '复杂系统仿真', 'WebGL'],
    description:
      '面向数据科学家与工程师，集合分支预测实验室、Lorenz 系列仿真与羽光不动点递归研究。',
    links: [
      { label: '分支预测策略实验室', href: 'public/demo/branch-prediction/index.html' },
      { label: 'Lorenz Convex 可视化', href: 'public/demo/lorenz-convex/index.html' },
      { label: '羽光不动点递归梯度下降', href: 'public/demo/featherlight-fixed-point-recursion/index.html' }
    ]
  },
  {
    title: '研究叙事与知识沉淀',
    focus: ['计算奇点', '物联网体验', '封闭类时曲线'],
    description:
      '帮助研究顾问梳理关键长文与证明，支撑战略推演与技术决策审查。',
    links: [
      { label: '计算奇点 470 年上界证明', href: 'docs/computational-singularity-proof.md' },
      { label: '万物互联体验架构', href: 'public/blog/internet-of-everything-design.html' },
      { label: '封闭类时曲线与凸优化', href: 'public/blog/ctc-convex-optimization.html' }
    ]
  },
  {
    title: '人才协作与组织运营',
    focus: ['角色对齐', '合作网络', '学习路径'],
    description:
      '提供共创团队的招募、伙伴网络与学习计划，支持项目落地阶段的组织准备。',
    links: [
      { label: '在线履历与合作模式', href: 'public/resume/index.html' },
      { label: 'Friends 合作网络', href: 'public/blog/Friends/index.html' },
      { label: 'Inner Sanctuary 学习路径', href: 'public/blog/inner-sanctuary.html' }
    ]
  }
];

const artifactFilters = [
  { id: 'all', label: '全部' },
  { id: 'demo', label: '交互 Demo' },
  { id: 'research', label: '研究文档' },
  { id: 'blog', label: '博客长文' },
  { id: 'resume', label: '履历 / 网络' }
];

const artifactEntries = [
  // Demo entries
  {
    title: '分支预测策略实验室',
    description: '比较静态、局部与 gshare 预测器命中率，评估误判冲刷成本与别名影响。',
    href: 'public/demo/branch-prediction/index.html',
    type: 'demo',
    meta: ['CPU 架构', '性能分析'],
    keywords: ['branch prediction', 'microarchitecture', 'pipeline']
  },
  {
    title: 'Atlas 审批旅程蓝图',
    description: '风控审批流程的指标体系、仪表盘与跨团队 OKR 模板。',
    href: 'public/demo/qed/index.html',
    type: 'demo',
    meta: ['风控', '流程设计'],
    keywords: ['approval', 'operations', 'dashboard']
  },
  {
    title: 'Terrabyte 协作剧本',
    description: '气候数据团队的多时区协作模型与无障碍设计评估表。',
    href: 'public/demo/ctc/index.html',
    type: 'demo',
    meta: ['协作', '可持续性'],
    keywords: ['climate', 'collaboration', 'accessibility']
  },
  {
    title: 'Campfire 成长循环',
    description: '创作者社区的增长实验框架与内容运营脚本。',
    href: 'public/demo/time-crystal/index.html',
    type: 'demo',
    meta: ['社区运营', '增长'],
    keywords: ['community', 'growth']
  },
  {
    title: 'Design System Starter Kit',
    description: 'Design Token、组件规范与无障碍检查清单，帮助团队落地设计系统。',
    href: 'public/demo/miu-tiantian-gradient-descent/index.html',
    type: 'demo',
    meta: ['DesignOps', '组件库'],
    keywords: ['design system', 'tokens', 'accessibility']
  },
  {
    title: 'Workflow Automation 模板',
    description: 'Notion、Linear 与 GitHub 的跨团队节奏与仪式脚本。',
    href: 'public/demo/blockchan/index.html',
    type: 'demo',
    meta: ['自动化', '团队运营'],
    keywords: ['automation', 'workflow']
  },
  {
    title: '设计工程 Demo 集',
    description: 'TypeScript + WebGL 的互动体验原型集合，演示设计工程协作的边界。',
    href: 'public/demo/bchan-pchan-synchrony/index.html',
    type: 'demo',
    meta: ['WebGL', '设计工程'],
    keywords: ['webgl', 'prototype']
  },
  {
    title: '羽光不动点一致性递归梯度下降',
    description: '探索羽光-情绪-拓扑映射固定点求解的可视化实验。',
    href: 'public/demo/featherlight-fixed-point-recursion/index.html',
    type: 'demo',
    meta: ['动力系统', '可视化'],
    keywords: ['fixed point', 'gradient descent']
  },
  {
    title: 'Lorenz Convex 视界',
    description: 'Lorenz 系统的凸优化映射可视化，展示混沌与可控性的张力。',
    href: 'public/demo/lorenz-convex/index.html',
    type: 'demo',
    meta: ['混沌系统', '优化'],
    keywords: ['lorenz', 'convex']
  },
  {
    title: 'Yuko · 冰子共鸣实验',
    description: '声音与粒子系统的交互实验，探索情感与物理刺激的耦合。',
    href: 'public/demo/yuko-bingzi-resonance/index.html',
    type: 'demo',
    meta: ['声音设计', '粒子系统'],
    keywords: ['sound', 'particle']
  },
  {
    title: 'Ambient Sketch',
    description: '围绕环境感知与光影动态的视觉草图。',
    href: 'public/demo/ambient-sketch/index.html',
    type: 'demo',
    meta: ['感官体验'],
    keywords: ['ambient', 'visual']
  },
  {
    title: '百度 IFE 任务集',
    description: '面向前端学习的交互式作业集合，涵盖布局、动画与数据绑定。',
    href: 'public/demo/baidu-ife-task/index.html',
    type: 'demo',
    meta: ['前端训练'],
    keywords: ['frontend', 'exercise']
  },
  {
    title: 'Canvas Playground',
    description: 'HTML Canvas 动画与绘制实验集合。',
    href: 'public/demo/canvas-demo/index.html',
    type: 'demo',
    meta: ['Canvas', '可视化'],
    keywords: ['canvas', 'animation']
  },
  {
    title: 'CTC Optimizer',
    description: '封闭类时曲线优化器的参数探索工具。',
    href: 'public/demo/ctc-optimizer/index.html',
    type: 'demo',
    meta: ['优化器', '时空'],
    keywords: ['ctc', 'optimizer']
  },
  {
    title: 'Neutrino Catalysis Lab',
    description: '模拟中微子催化反应的交互式可视化实验。',
    href: 'public/demo/neutrino-catalysis/index.html',
    type: 'demo',
    meta: ['物理仿真'],
    keywords: ['neutrino', 'simulation']
  },
  {
    title: 'Singularity Life',
    description: '探索奇点生命体在多维空间中的演化脚本。',
    href: 'public/demo/singularity-life/index.html',
    type: 'demo',
    meta: ['奇点研究'],
    keywords: ['singularity', 'life']
  },
  {
    title: 'Qianli · 冰封战术图',
    description: '多角色任务协作的旅程图，用于危机响应演练。',
    href: 'public/demo/qianli-bingfeng/index.html',
    type: 'demo',
    meta: ['危机响应', '旅程图'],
    keywords: ['journey', 'operations']
  },
  {
    title: 'Seek Child SSB',
    description: '以互动小说形式呈现的情感推演与决策树实验。',
    href: 'public/demo/seek-child-ssb/index.html',
    type: 'demo',
    meta: ['叙事设计'],
    keywords: ['story', 'decision tree']
  },
  {
    title: 'AGI / ASI Reaction Chamber',
    description: '模拟 AGI 与 ASI 交互的反应室模型，分析安全边界。',
    href: 'public/demo/agi-asi-reaction-chamber/index.html',
    type: 'demo',
    meta: ['AI 安全'],
    keywords: ['agi', 'asi', 'safety']
  },
  {
    title: 'Game of Life · Convex',
    description: '将康威生命游戏嵌入凸优化框架的实验。',
    href: 'public/demo/game-of-life/index.html',
    type: 'demo',
    meta: ['元胞自动机'],
    keywords: ['game of life', 'convex']
  },
  {
    title: 'Bchan · Pchan Synchrony',
    description: '双通道节奏协作演示，展示实时同步机制。',
    href: 'public/demo/bchan-pchan-synchrony/index.html',
    type: 'demo',
    meta: ['同步', '协作'],
    keywords: ['synchrony', 'collaboration']
  },
  // Research & blog entries
  {
    title: '计算奇点 470 年上界证明',
    description: '通过历史算力与物理极限推导出计算奇点不会超过 470 年的严格上界。',
    href: 'docs/computational-singularity-proof.md',
    type: 'research',
    meta: ['数学证明', '未来学'],
    keywords: ['singularity', 'proof']
  },
  {
    title: '万物互联的设计与实现',
    description: '系统梳理 IoE 体验的设计方法、技术栈与运营策略。',
    href: 'public/blog/internet-of-everything-design.html',
    type: 'blog',
    meta: ['IoE', '体验设计'],
    keywords: ['iot', 'experience']
  },
  {
    title: '封闭类时曲线的凸优化视角',
    description: '从凸优化角度理解 CTC 结构与可计算性，探讨目标函数与因果约束。',
    href: 'public/blog/ctc-convex-optimization.html',
    type: 'blog',
    meta: ['时空物理', '优化'],
    keywords: ['ctc', 'optimization']
  },
  {
    title: 'Inner Sanctuary 学习路径',
    description: '构建跨学科学习的仪式与实践路径，保持创造力与专注力。',
    href: 'public/blog/inner-sanctuary.html',
    type: 'blog',
    meta: ['学习体系'],
    keywords: ['learning', 'ritual']
  },
  {
    title: 'Game of Life 的凸优化解释',
    description: '以可视化长文阐释如何将生命游戏映射为凸优化问题。',
    href: 'public/blog/game-of-life-convex-optimization.html',
    type: 'blog',
    meta: ['算法', '可视化'],
    keywords: ['game of life', 'convex']
  },
  {
    title: 'Friends · 合作网络',
    description: '记录长期合作伙伴与贡献者，便于快速对接专家资源。',
    href: 'public/blog/Friends/index.html',
    type: 'resume',
    meta: ['合作网络'],
    keywords: ['network', 'partners']
  },
  {
    title: '在线履历',
    description: '展示经历、技能矩阵与合作模式，支持项目前期评估。',
    href: 'public/resume/index.html',
    type: 'resume',
    meta: ['履历', '合作模式'],
    keywords: ['resume', 'profile']
  },
  {
    title: '档案索引（Archives）',
    description: '以时间线形式整理全部 59 篇博客文章，可用于快速查找主题。',
    href: 'public/blog/archives/index.html',
    type: 'blog',
    meta: ['时间线'],
    keywords: ['archives', 'timeline']
  },
  {
    title: '博客首页',
    description: '汇总全部文章、专题与导航，是长文阅读的统一入口。',
    href: 'public/blog/index.html',
    type: 'blog',
    meta: ['目录'],
    keywords: ['blog', 'index']
  }
];

const collaborationMetrics = [
  {
    title: '跨团队 OKR 节奏',
    value: '6 周',
    description: '建议以 6 周为一个节拍迭代审批旅程、增长实验与设计系统更新。'
  },
  {
    title: 'Demo 更新频率',
    value: '每季度 ≥2',
    description: '保持交互原型的季度刷新，确保研究洞察与工程能力同步。'
  },
  {
    title: '知识库审阅',
    value: '双月',
    description: '邀请领域专家每两个月审阅文档与博客，维持论证的前沿性。'
  }
];

const appendixSections = [
  {
    title: '版本演化摘要',
    body: `2024 年完成从 Next.js 向原生技术栈的迁移：删除 app/ 目录、构建 index.html 为核心入口，并以 assets/ 中的 CSS 与 JS 驱动全部交互。所有历史 Demo 与博客继续保留在 public/ 下，确保链接兼容。`
  },
  {
    title: '维护原则',
    body: '1) 新资源需在 artifacts 数据源登记并提供关键词；2) 任何研究文档需包含引用来源；3) UI 扩展需复用现有设计变量保持一致性。'
  },
  {
    title: '扩展建议',
    body: '引入自动化脚本定期统计 Demo 与文章数据，或接入 JSON 数据源以便未来集成 headless CMS，同时可新增多语言支持以覆盖更多协作伙伴。'
  }
];

function createElement(tag, options = {}) {
  const el = document.createElement(tag);
  if (options.className) {
    el.className = options.className;
  }
  if (options.text) {
    el.textContent = options.text;
  }
  if (options.html) {
    el.innerHTML = options.html;
  }
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        el.setAttribute(key, value);
      }
    });
  }
  return el;
}

function renderHeroMeta() {
  const container = document.getElementById('hero-meta');
  heroMeta.forEach((item) => {
    const card = createElement('div', { className: 'meta-card' });
    const label = createElement('span', { className: 'card__eyebrow', text: item.label });
    const value = createElement('strong', { text: item.value });
    const desc = createElement('p', { className: 'card__description', text: item.description });
    card.append(label, value, desc);
    container.append(card);
  });
}

function renderOverview() {
  const grid = document.getElementById('overview-grid');
  overviewDomains.forEach((domain) => {
    const card = createElement('article', { className: 'card' });
    card.append(
      createElement('span', { className: 'card__eyebrow', text: domain.eyebrow }),
      createElement('h3', { className: 'card__title', text: domain.title }),
      createElement('p', { className: 'card__description', text: domain.description })
    );
    const stats = createElement('div', { className: 'card__stats' });
    domain.stats.forEach((stat) => {
      const statEl = createElement('div', { className: 'stat' });
      statEl.append(
        createElement('strong', { text: stat.value }),
        createElement('span', { text: stat.label })
      );
      stats.append(statEl);
    });
    card.append(stats);
    grid.append(card);
  });
}

function renderRepositoryMap() {
  const grid = document.getElementById('repository-map-grid');
  repositoryMap.forEach((section) => {
    const card = createElement('article', { className: 'repo-card', attrs: { 'aria-expanded': 'false' } });
    const header = createElement('div', { className: 'repo-card__header' });
    header.append(
      createElement('h3', { text: section.title }),
      createElement('span', { className: 'repo-card__path', text: section.path })
    );
    card.append(header);

    const tags = createElement('div', { className: 'repo-card__tags' });
    section.tags.forEach((tag) => tags.append(createElement('span', { className: 'tag', text: tag })));
    card.append(tags);

    card.append(createElement('p', { className: 'repo-card__description', text: section.description }));

    const toggle = createElement('button', { text: '展开细节', attrs: { type: 'button' } });
    const body = createElement('div', { className: 'repo-card__body' });

    const details = createElement('div', { className: 'repo-card__details' });
    details.append(createElement('h4', { text: '关注要点' }));
    const focusList = createElement('ul');
    section.highlights.focus.forEach((item) => focusList.append(createElement('li', { text: item })));
    details.append(focusList);

    details.append(createElement('h4', { text: '协作角色' }));
    const consumerList = createElement('ul');
    section.highlights.consumers.forEach((item) => consumerList.append(createElement('li', { text: item })));
    details.append(consumerList);

    details.append(createElement('h4', { text: '推荐行动' }));
    const actionList = createElement('ul');
    section.highlights.actions.forEach((item) => actionList.append(createElement('li', { text: item })));
    details.append(actionList);

    body.append(details);
    card.append(toggle, body);

    toggle.addEventListener('click', () => {
      const expanded = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', String(!expanded));
      toggle.textContent = expanded ? '展开细节' : '收起细节';
    });

    grid.append(card);
  });
}

function renderKnowledgeStreams() {
  const grid = document.getElementById('knowledge-streams-grid');
  knowledgeStreams.forEach((stream) => {
    const card = createElement('article', { className: 'stream-card' });
    card.append(createElement('h3', { text: stream.title }));

    const focus = createElement('div', { className: 'stream-card__focus' });
    stream.focus.forEach((item) => focus.append(createElement('span', { className: 'tag', text: item })));
    card.append(focus);

    card.append(createElement('p', { className: 'card__description', text: stream.description }));

    const list = createElement('ul', { className: 'stream-card__links' });
    stream.links.forEach((link) => {
      const item = createElement('li');
      const anchor = createElement('a', { text: link.label, attrs: { href: link.href } });
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener');
      item.append(anchor);
      list.append(item);
    });
    card.append(list);
    grid.append(card);
  });
}

function renderFilters() {
  const container = document.getElementById('artifact-filters');
  artifactFilters.forEach((filter) => {
    const button = createElement('button', {
      className: 'filter-chip',
      text: filter.label,
      attrs: {
        type: 'button',
        'data-filter': filter.id,
        'aria-pressed': filter.id === 'all' ? 'true' : 'false'
      }
    });
    container.append(button);
  });
}

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function filterArtifacts(activeFilter, query) {
  const normalizedQuery = normalize(query.trim());
  return artifactEntries.filter((entry) => {
    const typeMatch = activeFilter === 'all' || entry.type === activeFilter;
    if (!typeMatch) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    const haystack = [entry.title, entry.description, ...(entry.meta || []), ...(entry.keywords || [])]
      .filter(Boolean)
      .map(normalize)
      .join(' ');
    return haystack.includes(normalizedQuery);
  });
}

function renderArtifacts(activeFilter = 'all', query = '') {
  const list = document.getElementById('artifact-list');
  list.innerHTML = '';
  const results = filterArtifacts(activeFilter, query);

  const summary = document.getElementById('artifact-summary');
  summary.textContent = `共检索到 ${results.length} 条资源（总库 ${artifactEntries.length} 项）。`;

  if (results.length === 0) {
    list.append(createElement('p', { text: '没有匹配的资源，请尝试其他关键字或切换筛选。' }));
    return;
  }

  results.forEach((entry) => {
    const card = createElement('article', { className: 'artifact-card' });
    card.append(createElement('h3', { text: entry.title }));
    if (entry.meta?.length) {
      const meta = createElement('div', { className: 'artifact-card__meta' });
      entry.meta.forEach((item) => meta.append(createElement('span', { text: item })));
      card.append(meta);
    }
    card.append(createElement('p', { text: entry.description }));
    const cta = createElement('a', {
      className: 'artifact-card__cta',
      text: '访问资源',
      attrs: { href: entry.href, target: '_blank', rel: 'noopener' }
    });
    card.append(cta);
    list.append(card);
  });
}

function setupArtifactInteractions() {
  const search = document.getElementById('artifact-search');
  const filterButtons = Array.from(document.querySelectorAll('.filter-chip'));
  let activeFilter = 'all';

  const update = () => {
    renderArtifacts(activeFilter, search.value || '');
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.setAttribute('aria-pressed', btn === button ? 'true' : 'false'));
      update();
    });
  });

  search.addEventListener('input', () => {
    window.requestAnimationFrame(update);
  });

  update();
}

function setupInterpreter() {
  const form = document.getElementById('interpreter-form');
  const input = document.getElementById('interpreter-input');
  const output = document.getElementById('interpreter-output');

  const allowedPattern = /^[\d+\-*/().\s]+$/;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const expression = input.value.trim();
    if (!expression) {
      output.textContent = '请输入需要计算的表达式。';
      return;
    }
    if (!allowedPattern.test(expression)) {
      output.textContent = '仅支持数字与 + - * / () 运算符。';
      return;
    }

    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${expression});`)();
      if (Number.isFinite(result)) {
        output.textContent = `结果：${result}`;
      } else {
        output.textContent = '无法计算：结果不是有限数值。';
      }
    } catch (error) {
      output.textContent = `无法计算：${error.message}`;
    }
  });
}

function renderMetrics() {
  const list = document.getElementById('metrics-list');
  collaborationMetrics.forEach((metric) => {
    const item = createElement('li');
    item.append(createElement('strong', { text: metric.value }));
    item.append(createElement('span', { text: metric.title }));
    item.append(createElement('p', { className: 'card__description', text: metric.description }));
    list.append(item);
  });
}

function renderAppendix() {
  const container = document.getElementById('appendix-content');
  appendixSections.forEach((section) => {
    const block = createElement('section', { className: 'appendix-section' });
    block.append(createElement('h3', { text: section.title }));
    block.append(createElement('p', { text: section.body }));
    container.append(block);
  });
}

function init() {
  renderHeroMeta();
  renderOverview();
  renderRepositoryMap();
  renderKnowledgeStreams();
  renderFilters();
  setupArtifactInteractions();
  setupInterpreter();
  renderMetrics();
  renderAppendix();
}

document.addEventListener('DOMContentLoaded', init);
