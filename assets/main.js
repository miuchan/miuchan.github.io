const freezeDeep = (value) => {
  if (Array.isArray(value)) {
    value.forEach(freezeDeep);
    return Object.freeze(value);
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freezeDeep);
    return Object.freeze(value);
  }
  return value;
};

const resources = freezeDeep([
  {
    title: '分支预测策略实验室',
    description:
      '比较静态、局部与 gshare 预测器的命中率，观察误判冲刷成本与别名对性能的影响。',
    href: 'demo/branch-prediction/index.html',
    cta: '体验预测器 →'
  },
  {
    title: 'Atlas 审批旅程蓝图',
    description:
      '风控平台的指标看板、审批旅程与跨团队 OKR 模板，帮助你复制端到端的决策体验。',
    href: 'demo/qed/index.html',
    cta: '查看蓝图 →'
  },
  {
    title: 'Terrabyte 协作剧本',
    description:
      '气候数据团队的多时区协作模型与无障碍设计评估表，可直接嵌入现有流程。',
    href: 'demo/ctc/index.html',
    cta: '阅读剧本 →'
  },
  {
    title: 'Campfire 成长循环',
    description:
      '创作者社区的增长实验框架与内容运营脚本，适合快速搭建社区增长循环。',
    href: 'demo/time-crystal/index.html',
    cta: '解锁循环 →'
  },
  {
    title: 'Design System Starter Kit',
    description:
      'Design Token、组件规范与无障碍检查清单，帮助团队加速设计系统的落地。',
    href: 'demo/miu-tiantian-gradient-descent/index.html',
    cta: '使用工具包 →'
  },
  {
    title: '羽光不动点一致性递归梯度下降',
    description:
      '可视化羽光-情绪-拓扑映射的固定点求解，体验递归梯度下降的多层回响。',
    href: 'demo/featherlight-fixed-point-recursion/index.html',
    cta: '体验羽光回响 →'
  },
  {
    title: 'Workflow Automation 模板',
    description:
      '结合 Notion、Linear 与 GitHub 的跨团队节奏，附带仪式脚本与沟通模版。',
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
]);

const insights = freezeDeep([
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
]);

const pipe = (...fns) => (input) => fns.reduce((acc, fn) => fn(acc), input);
const when = (predicate, fn) => (value) => (predicate(value) ? fn(value) : value);
const map = (fn) => (collection) => collection.map(fn);
const filter = (fn) => (collection) => collection.filter(fn);
const sortBy = (comparator) => (collection) => [...collection].sort(comparator);
const head = ([first]) => first;
const compact = (collection) => collection.filter(Boolean);

const listFormatter = new Intl.ListFormat('zh-CN', {
  style: 'short',
  type: 'conjunction'
});

const createElement = (tag, ...enhancers) => pipe(() => document.createElement(tag), ...enhancers)();
const withClass = (...tokens) => (element) => {
  const classes = tokens.flat().filter(Boolean);
  if (classes.length) {
    element.classList.add(...classes);
  }
  return element;
};
const withAttributes = (attributes = {}) => (element) => {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value != null) {
      element.setAttribute(key, value);
    }
  });
  return element;
};
const withText = (text) => (element) => {
  if (typeof text === 'string') {
    element.textContent = text;
  }
  return element;
};
const withChildren = (children = []) => (element) => {
  children.forEach((child) => {
    if (child) {
      element.appendChild(child);
    }
  });
  return element;
};
const toFragment = (nodes) =>
  nodes.reduce((fragment, node) => {
    fragment.appendChild(node);
    return fragment;
  }, document.createDocumentFragment());
const injectInto = (id) => (content) => {
  const target = document.getElementById(id);
  if (target) {
    target.replaceChildren(content);
  }
  return content;
};

const createResourceCard = ({ title, description, href, cta }) =>
  createElement(
    'a',
    withClass('card'),
    withAttributes({ href }),
    withChildren([
      createElement('h3', withText(title)),
      createElement('p', withText(description)),
      createElement('span', withClass('link'), withText(cta))
    ])
  );

const optionalNode = (condition, factory) => (condition ? factory() : null);
const createInsightItem = ({ datetime, label, title, link, summary }) =>
  createElement(
    'div',
    withClass('timeline-item'),
    withChildren(
      compact([
        optionalNode(Boolean(datetime), () =>
          createElement(
            'time',
            withAttributes({ dateTime: datetime }),
            withText(label)
          )
        ),
        optionalNode(!datetime, () => createElement('span', withText(label))),
        createElement(
          'h3',
          withChildren([
            optionalNode(Boolean(link), () =>
              createElement('a', withAttributes({ href: link }), withText(title))
            ) || createElement('span', withText(title))
          ])
        ),
        createElement('p', withText(summary))
      ])
    )
  );

const renderList = (items, renderer, targetId) =>
  pipe(map(renderer), toFragment, injectInto(targetId))(items);

const extractTopic = (text) =>
  pipe(
    () => (typeof text === 'string' ? text.split(/[，。]/u) : []),
    (parts) => parts.find(Boolean) || text || ''
  )();

const formatDate = (value) =>
  pipe(
    () => (value ? new Date(value) : null),
    when(Boolean, (date) => new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(date))
  )();

const createSummaryList = (entries = []) =>
  optionalNode(entries.length > 0, () =>
    createElement(
      'ul',
      withClass('summary-list'),
      withChildren(
        entries.map(({ label, value }) =>
          createElement(
            'li',
            withChildren([
              createElement('strong', withText(`${label}：`)),
              createElement('span', withText(value))
            ])
          )
        )
      )
    )
  );

const createSummaryCard = ({ eyebrow, title, description, entries }) =>
  createElement(
    'article',
    withClass('summary-card'),
    withChildren(
      compact([
        optionalNode(Boolean(eyebrow), () =>
          createElement('span', withClass('summary-eyebrow'), withText(eyebrow))
        ),
        optionalNode(Boolean(title), () => createElement('h3', withText(title))),
        optionalNode(Boolean(description), () =>
          createElement('p', withClass('summary-description'), withText(description))
        ),
        createSummaryList(entries)
      ])
    )
  );

const createResourceSummary = (items) => {
  const total = items.length;
  const featured = items.slice(0, 3);
  const newest = head(items);
  const topicSummary = pipe(
    () => featured.map(({ description }) => extractTopic(description)).filter(Boolean),
    (topics) => (topics.length ? listFormatter.format(topics) : '')
  )();

  return createSummaryCard({
    eyebrow: 'Knowledge Stats',
    title: `${total} 个跨学科资源`,
    description:
      '整合策略、体验系统与设计工程的模板、指南与 Demo，帮助你快速评估合作价值。',
    entries: compact([
      newest && {
        label: '最新上线',
        value: `${newest.title}`
      },
      topicSummary && {
        label: '覆盖主题',
        value: topicSummary
      }
    ])
  });
};

const createInsightSummary = (items) => {
  const datedInsights = filter((item) => Boolean(item.datetime))(items);
  const latest = head(sortBy((a, b) => new Date(b.datetime) - new Date(a.datetime))(datedInsights));
  const liveCall = items.find((item) => !item.datetime);
  const total = items.length;
  const linkedCount = filter((item) => Boolean(item.link))(items).length;

  return createSummaryCard({
    eyebrow: 'Insight Feed',
    title: `${total} 条洞察持续更新`,
    description: '记录复盘、公开分享与共创邀请，便于快速理解我的思考框架。',
    entries: compact([
      latest && {
        label: '最近更新',
        value: `${latest.label} · ${latest.title}${
          latest.datetime ? `（${formatDate(latest.datetime)}）` : ''
        }`
      },
      liveCall && {
        label: liveCall.label || '当前焦点',
        value: liveCall.summary
      },
      linkedCount > 0 && {
        label: '可深入阅读',
        value: `${linkedCount} 篇附带详细文档`
      }
    ])
  });
};

const mountSummaries = () => {
  const resourceSummary = createResourceSummary(resources);
  const insightSummary = createInsightSummary(insights);

  pipe(() => [resourceSummary], toFragment, injectInto('resource-summary'))();
  pipe(() => [insightSummary], toFragment, injectInto('insight-summary'))();
};

const mountResources = () => renderList(resources, createResourceCard, 'resource-list');
const mountInsights = () => renderList(insights, createInsightItem, 'insight-list');

const updateCopyrightYear = () =>
  pipe(
    () => document.getElementById('year'),
    when(Boolean, (element) => {
      element.textContent = String(new Date().getFullYear());
    })
  )();

const bootstrap = () => {
  mountSummaries();
  mountResources();
  mountInsights();
  updateCopyrightYear();
};

bootstrap();
