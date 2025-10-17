const resources = [
  {
    title: '分支预测策略实验室',
    description:
      '比较静态、局部与 gshare 预测器的命中率，观察误判冲刷成本与别名对性能的影响。',
    href: '/demo/branch-prediction/index.html',
    cta: '体验预测器 →'
  },
  {
    title: 'Atlas 审批旅程蓝图',
    description:
      '风控平台的指标看板、审批旅程与跨团队 OKR 模板，帮助你复制端到端的决策体验。',
    href: '/demo/qed/index.html',
    cta: '查看蓝图 →'
  },
  {
    title: 'Terrabyte 协作剧本',
    description:
      '气候数据团队的多时区协作模型与无障碍设计评估表，可直接嵌入现有流程。',
    href: '/demo/ctc/index.html',
    cta: '阅读剧本 →'
  },
  {
    title: 'Campfire 成长循环',
    description:
      '创作者社区的增长实验框架与内容运营脚本，适合快速搭建社区增长循环。',
    href: '/demo/time-crystal/index.html',
    cta: '解锁循环 →'
  },
  {
    title: 'Design System Starter Kit',
    description:
      'Design Token、组件规范与无障碍检查清单，帮助团队加速设计系统的落地。',
    href: '/demo/miu-tiantian-gradient-descent/index.html',
    cta: '使用工具包 →'
  },
  {
    title: '羽光不动点一致性递归梯度下降',
    description:
      '可视化羽光-情绪-拓扑映射的固定点求解，体验递归梯度下降的多层回响。',
    href: '/demo/featherlight-fixed-point-recursion/index.html',
    cta: '体验羽光回响 →'
  },
  {
    title: 'Workflow Automation 模板',
    description:
      '结合 Notion、Linear 与 GitHub 的跨团队节奏，附带仪式脚本与沟通模版。',
    href: '/demo/blockchan/index.html',
    cta: '复制流程 →'
  },
  {
    title: '设计工程 Demo 集',
    description: '展示 TypeScript + WebGL 的互动体验原型，可作为设计工程协作的参考。',
    href: '/demo/bchan-pchan-synchrony/index.html',
    cta: '浏览 Demo →'
  },
  {
    title: '在线简历',
    description: '了解更完整的经历、技能矩阵与合作模式，便于确认项目匹配度。',
    href: '/resume/index.html',
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
    link: '/blog/internet-of-everything-design.html',
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

const listFormatter = new Intl.ListFormat('zh-CN', {
  style: 'short',
  type: 'conjunction'
});

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(new Date(value))
    : '';

const extractTopic = (text) => {
  if (typeof text !== 'string') {
    return '';
  }
  const [first = ''] = text.split(/[，。]/u).filter(Boolean);
  return first;
};

const createResourceSummary = (items) => {
  const total = items.length;
  const featuredTopics = items
    .slice(0, 3)
    .map((item) => extractTopic(item.description))
    .filter(Boolean);
  const topicSummary = featuredTopics.length ? listFormatter.format(featuredTopics) : '';
  const newest = items[0];

  const entries = [];
  if (newest) {
    entries.push({ label: '最新上线', value: newest.title });
  }
  if (topicSummary) {
    entries.push({ label: '覆盖主题', value: topicSummary });
  }

  return {
    eyebrow: 'Knowledge Stats',
    title: `${total} 个跨学科资源`,
    description:
      '整合策略、体验系统与设计工程的模板、指南与 Demo，帮助你快速评估合作价值。',
    entries
  };
};

const createInsightSummary = (items) => {
  const datedInsights = items.filter((item) => Boolean(item.datetime));
  const latest = datedInsights
    .slice()
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))[0];
  const liveCall = items.find((item) => !item.datetime);
  const linkedCount = items.filter((item) => Boolean(item.link)).length;

  const entries = [];
  if (latest) {
    const dateLabel = latest.datetime ? `（${formatDate(latest.datetime)}）` : '';
    entries.push({ label: '最近更新', value: `${latest.label} · ${latest.title}${dateLabel}` });
  }
  if (liveCall) {
    entries.push({ label: liveCall.label || '当前焦点', value: liveCall.summary });
  }
  if (linkedCount > 0) {
    entries.push({ label: '可深入阅读', value: `${linkedCount} 篇附带详细文档` });
  }

  return {
    eyebrow: 'Insight Feed',
    title: `${items.length} 条洞察持续更新`,
    description: '记录复盘、公开分享与共创邀请，便于快速理解我的思考框架。',
    entries
  };
};

const SummaryCard = ({ eyebrow, title, description, entries }) => (
  <article className="summary-card">
    {eyebrow ? <span className="summary-eyebrow">{eyebrow}</span> : null}
    {title ? <h3>{title}</h3> : null}
    {description ? <p className="summary-description">{description}</p> : null}
    {entries?.length ? (
      <ul className="summary-list">
        {entries.map(({ label, value }) => (
          <li key={label}>
            <strong>{label}：</strong>
            <span>{value}</span>
          </li>
        ))}
      </ul>
    ) : null}
  </article>
);

const ResourceCard = ({ title, description, href, cta }) => (
  <a className="card" href={href}>
    <h3>{title}</h3>
    <p>{description}</p>
    <span className="link">{cta}</span>
  </a>
);

const InsightItem = ({ datetime, label, title, link, summary }) => (
  <div className="timeline-item">
    {datetime ? <time dateTime={datetime}>{label}</time> : <span>{label}</span>}
    <h3>{link ? <a href={link}>{title}</a> : <span>{title}</span>}</h3>
    <p>{summary}</p>
  </div>
);

export default function HomePage() {
  const resourceSummary = createResourceSummary(resources);
  const insightSummary = createInsightSummary(insights);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <div className="wrapper">
        <nav className="site-nav">
          <a href="#overview" className="logo">
            aman · experience systems
          </a>
          <div className="nav-links" role="list">
            <a href="#overview">总览</a>
            <a href="#profile">履历概览</a>
            <a href="#focus">聚焦领域</a>
            <a href="#projects">代表项目</a>
            <a href="#outcomes">成果指标</a>
            <a href="#process">协作流程</a>
            <a href="#knowledge">知识库</a>
            <a href="#insights">洞察</a>
            <a href="#connect">联系</a>
          </div>
        </nav>

        <main id="main-content">
          <section className="hero" id="overview" aria-labelledby="hero-title">
            <div className="hero-content">
              <span className="eyebrow">Aman Sharma · Product Designer &amp; Frontend Engineer</span>
              <h1 id="hero-title">把多端 SaaS 体验重组为可持续增长的产品系统。</h1>
              <p className="hero-lede">
                我专注于数据密集型平台与新兴行业的体验重构，结合产品战略、设计系统与设计工程，帮助团队将“愿景、体验、发布”连接成一套可度量的交付节奏。
              </p>
              <ul className="hero-highlights" role="list">
                <li>
                  <span className="highlight-label">行业覆盖</span>
                  <span className="highlight-value">FinTech · 气候科技 · 教育科技</span>
                </li>
                <li>
                  <span className="highlight-label">端到端发布</span>
                  <span className="highlight-value">12 次产品上线 · 4 个设计系统</span>
                </li>
                <li>
                  <span className="highlight-label">团队协作</span>
                  <span className="highlight-value">远程 / 混合 · 支持多时区交付</span>
                </li>
              </ul>
              <div className="hero-actions">
                <a className="button primary" href="#projects">
                  浏览项目
                </a>
                <a className="button secondary" href="/resume/index.html">
                  查看详细履历
                </a>
                <a className="button ghost" href="#knowledge">
                  进入知识库
                </a>
              </div>
            </div>
            <aside className="hero-quick-nav" aria-label="快速入门">
              <h2>3 个问题，定位合作价值</h2>
              <ol className="step-list quick-step-list">
                <li>
                  <strong>01 · 需要破解的业务目标？</strong>
                  <p>
                    <a href="#outcomes">成果指标</a>
                    梳理了我常协助的转化、留存与运营指标。
                  </p>
                </li>
                <li>
                  <strong>02 · 面临怎样的体验挑战？</strong>
                  <p>
                    <a href="#focus">聚焦领域</a>
                    展示从策略到工程的系统化能力。
                  </p>
                </li>
                <li>
                  <strong>03 · 期待怎样的协作方式？</strong>
                  <p>
                    <a href="#process">协作流程</a>
                    提供端到端节奏，帮助团队快速对齐。
                  </p>
                </li>
              </ol>
              <dl className="hero-stat-block">
                <div className="hero-stat">
                  <dt>经验年限</dt>
                  <dd>7+ 年跨学科产品实践</dd>
                </div>
                <div className="hero-stat">
                  <dt>可合作时段</dt>
                  <dd>UTC+5:30 / UTC+8 · 4 周内可启动</dd>
                </div>
              </dl>
            </aside>
          </section>

          <section className="section bright" id="profile">
            <div className="section-header">
              <div>
                <span className="eyebrow">Profile Snapshot</span>
                <h2>职业概览与协作定位</h2>
              </div>
              <p className="section-intro">
                围绕产品战略、体验系统与工程落地构建复合能力，帮助成长阶段的团队快速建立以指标为导向的体验决策机制。
              </p>
            </div>
            <div className="profile-grid">
              <article className="profile-card">
                <h3>核心身份</h3>
                <p>产品体验负责人 / 设计工程师，擅长在复杂数据场景中搭建可迭代的设计系统，将研究洞察与技术实现无缝连接。</p>
                <ul>
                  <li>在 3 家高速增长公司组建体验与前端团队。</li>
                  <li>主持跨时区工作坊与路线图对齐 40+ 次。</li>
                  <li>推动设计系统采用率平均提升 60%。</li>
                </ul>
              </article>
              <article className="profile-card">
                <h3>合作方式</h3>
                <p>可作为产品/设计团队的“第二大脑”，负责体验蓝图、快速验证与工程落地，也能嵌入现有团队承担特定模块的设计工程。</p>
                <ul>
                  <li>嵌入式产品小组（4-8 人）。</li>
                  <li>体验系统建设与设计运营顾问。</li>
                  <li>关键里程碑冲刺（4-6 周）。</li>
                </ul>
              </article>
              <article className="profile-card highlight">
                <h3>可提供的即时价值</h3>
                <dl>
                  <div>
                    <dt>战略对齐</dt>
                    <dd>价值主张、用户旅程与指标看板一体化。</dd>
                  </div>
                  <div>
                    <dt>设计工程</dt>
                    <dd>设计系统 + 前端组件库协同落地。</dd>
                  </div>
                  <div>
                    <dt>增长循环</dt>
                    <dd>实验、反馈与内容运营闭环设计。</dd>
                  </div>
                </dl>
              </article>
            </div>
          </section>

          <section className="section" id="focus">
            <div className="section-header">
              <div>
                <span className="eyebrow">Impact Areas</span>
                <h2>聚焦的产品与体验议题</h2>
              </div>
              <p className="section-intro">
                以下三个方向构成我的工作重心：以指标驱动的产品策略、可扩展的体验系统，以及将设计融入工程流水线的设计工程实践。
              </p>
            </div>
            <div className="focus-grid">
              <article className="focus-card">
                <h3>产品策略与指标架构</h3>
                <p>构建覆盖激活、留存、付费的指标体系，让团队能够在季度节奏中验证假设并持续迭代。</p>
                <ul>
                  <li>价值主张工作坊与用户旅程共创。</li>
                  <li>指标看板与运营节奏设计。</li>
                  <li>产品定位、包装与发布故事线。</li>
                </ul>
              </article>
              <article className="focus-card">
                <h3>体验系统与设计运营</h3>
                <p>搭建 Design System 与内容基线，保障多团队、多平台的一致性，让体验演进成为可持续的资产。</p>
                <ul>
                  <li>Design Token + 组件规范治理。</li>
                  <li>无障碍与多语言设计评估。</li>
                  <li>设计评审、知识库与培训机制。</li>
                </ul>
              </article>
              <article className="focus-card">
                <h3>设计工程与交付</h3>
                <p>将 Figma、Notion、TypeScript、Next.js 等工具串联成统一管线，实现从原型到上线的高效迭代。</p>
                <ul>
                  <li>前端组件库与数据可视化开发。</li>
                  <li>实验框架、A/B 测试与性能优化。</li>
                  <li>发布流程与质量基线自动化。</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="section bright" id="projects">
            <div className="section-header">
              <div>
                <span className="eyebrow">Flagship Projects</span>
                <h2>代表性项目与关键贡献</h2>
              </div>
              <p className="section-intro">
                从金融风控到气候科技平台，这些项目展示了我如何在复杂约束中整合策略、体验与工程。
              </p>
            </div>
            <div className="project-grid">
              <article className="project-card">
                <header>
                  <h3>Atlas · 金融风控 SaaS 平台</h3>
                  <p className="project-meta">产品体验负责人 · 2022-至今</p>
                </header>
                <p>将分散的风控工具整合为统一平台，引入决策可视化与自动化工作流，支持多区域团队协作。</p>
                <dl className="project-highlights">
                  <div>
                    <dt>我的角色</dt>
                    <dd>负责策略对齐、设计系统与设计工程落地。</dd>
                  </div>
                  <div>
                    <dt>影响</dt>
                    <dd>审批周期缩短 35%，客单价提升 22%。</dd>
                  </div>
                  <div>
                    <dt>可复用资产</dt>
                    <dd>审批旅程模板、跨团队 OKR 仪表板。</dd>
                  </div>
                </dl>
                <ul className="tag-list">
                  <li>FinTech</li>
                  <li>Design System</li>
                  <li>Workflow Automation</li>
                </ul>
              </article>
              <article className="project-card">
                <header>
                  <h3>Terrabyte · 气候数据协作平台</h3>
                  <p className="project-meta">首席设计工程师 · 2020-2022</p>
                </header>
                <p>为能源分析师和城市规划者打造实时协作的气候数据平台，提供情景规划、指标追踪与报告自动化。</p>
                <dl className="project-highlights">
                  <div>
                    <dt>我的角色</dt>
                    <dd>主导信息架构、无障碍基线与数据可视化组件。</dd>
                  </div>
                  <div>
                    <dt>影响</dt>
                    <dd>项目交付时间缩短 40%，用户活跃度提升 1.8 倍。</dd>
                  </div>
                  <div>
                    <dt>可复用资产</dt>
                    <dd>多语言图表库、环境数据的设计准则。</dd>
                  </div>
                </dl>
                <ul className="tag-list">
                  <li>ClimateTech</li>
                  <li>Data Viz</li>
                  <li>Accessibility</li>
                </ul>
              </article>
              <article className="project-card">
                <header>
                  <h3>Campfire · 创作者成长社区</h3>
                  <p className="project-meta">联合创始人 · 2017-2020</p>
                </header>
                <p>构建线上线下结合的创作者社群，提供课程、资源市场与导师体系，帮助创作者将作品商业化。</p>
                <dl className="project-highlights">
                  <div>
                    <dt>我的角色</dt>
                    <dd>负责产品蓝图、增长实验与知识库建设。</dd>
                  </div>
                  <div>
                    <dt>影响</dt>
                    <dd>会员留存率 78%，年 GMV 达 180 万美元。</dd>
                  </div>
                  <div>
                    <dt>可复用资产</dt>
                    <dd>课程设计模板、增长运营脚本、数据看板。</dd>
                  </div>
                </dl>
                <ul className="tag-list">
                  <li>Community</li>
                  <li>Growth</li>
                  <li>Knowledge Ops</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="section" id="outcomes">
            <div className="section-header">
              <div>
                <span className="eyebrow">Impact Scoreboard</span>
                <h2>关键成果与指标</h2>
              </div>
              <p className="section-intro">
                每一次合作都围绕指标推进，这里汇总了最能说明我工作方式的成果片段。
              </p>
            </div>
            <div className="metrics-grid">
              <article className="metric-card">
                <h3>体验指标体系</h3>
                <p>为 5 个产品建立体验 KPI 与仪表板，帮助团队将业务指标与用户体验串联。</p>
                <span className="metric-value">+38% 激活率</span>
              </article>
              <article className="metric-card">
                <h3>设计系统建设</h3>
                <p>落地 4 套跨端设计系统，覆盖桌面端、移动端与内部运营工具。</p>
                <span className="metric-value">60% 组件复用</span>
              </article>
              <article className="metric-card">
                <h3>增长实验与转化</h3>
                <p>规划并执行 25+ 组实验，将漏斗表现与内容运营结合。</p>
                <span className="metric-value">+27% 付费转化</span>
              </article>
              <article className="metric-card">
                <h3>跨团队赋能</h3>
                <p>设计培训、知识库与导师机制，帮助团队在组织扩张阶段保持节奏。</p>
                <span className="metric-value">40 场工作坊</span>
              </article>
            </div>
          </section>

          <section className="section bright" id="process">
            <div className="section-header">
              <div>
                <span className="eyebrow">Collaboration Playbook</span>
                <h2>端到端协作流程</h2>
              </div>
              <p className="section-intro">
                根据项目阶段量身定制的协作节奏，确保策略、体验、工程同步推进。
              </p>
            </div>
            <ol className="process-flow">
              <li>
                <h3>对齐目标与成功指标</h3>
                <p>通过价值假设工作坊与指标映射，明确要解决的核心问题与预期成果。</p>
              </li>
              <li>
                <h3>体验蓝图与系统设计</h3>
                <p>建立信息架构、用户旅程与内容模型，同时输出设计系统基线与验证计划。</p>
              </li>
              <li>
                <h3>设计工程集成</h3>
                <p>将设计资产转化为组件库与数据接口，搭建自动化测试、性能与发布流程。</p>
              </li>
              <li>
                <h3>发布与增长循环</h3>
                <p>上线后持续追踪指标，运行增长实验与知识回流机制，确保产品持续迭代。</p>
              </li>
            </ol>
          </section>

          <section className="section" id="knowledge">
            <div className="section-header">
              <div>
                <span className="eyebrow">Knowledge Hub</span>
                <h2>可直接应用的文档与 Demo</h2>
              </div>
              <p className="section-intro">
                以下资源覆盖策略对齐、体验系统、设计工程与增长运营，帮助你快速了解我的工作深度。
              </p>
            </div>
            <div className="summary-grid">
              <SummaryCard {...resourceSummary} />
            </div>
            <div className="grid cards">
              {resources.map((resource) => (
                <ResourceCard key={resource.title} {...resource} />
              ))}
            </div>
          </section>

          <section className="section" id="insights">
            <div className="section-header">
              <div>
                <span className="eyebrow">Latest Insights</span>
                <h2>公开分享与阶段性复盘</h2>
              </div>
              <p className="section-intro">
                持续记录产品实践的迭代，涵盖公开演讲、文章与内部复盘，帮助你洞悉我的思考方式。
              </p>
            </div>
            <div className="summary-grid">
              <SummaryCard {...insightSummary} />
            </div>
            <div className="timeline">
              {insights.map((insight) => (
                <InsightItem key={`${insight.label}-${insight.title}`} {...insight} />
              ))}
            </div>
          </section>

          <section className="section" id="connect">
            <div className="section-header">
              <div>
                <span className="eyebrow">Work Together</span>
                <h2>约一个 30 分钟的探索会议</h2>
              </div>
              <p className="section-intro">
                告诉我你的业务目标、团队节奏或当前瓶颈，我们可以在一次快速会谈中确定下一步方案。
              </p>
            </div>
            <div className="contact-card">
              <div>
                <h3>我能提供的支持</h3>
                <p>需求梳理、体验评估、路线图建议或设计系统诊断，均可在首次会谈中获得初步建议。</p>
              </div>
              <div className="social-links">
                <a href="mailto:workwithaman@hey.com">Email</a>
                <a href="https://www.linkedin.com/in/miuchan" target="_blank" rel="noopener">
                  LinkedIn
                </a>
                <a href="https://github.com/miuchan" target="_blank" rel="noopener">
                  GitHub
                </a>
                <a href="/resume/index.html">简历</a>
              </div>
            </div>
          </section>
        </main>

        <footer>
          <div>© {currentYear} Aman Sharma · Designing systems that scale thoughtfully.</div>
        </footer>
      </div>
    </>
  );
}
