import { friendContent } from './friends-data.js';
import { researchEntries } from './research-data.js';
import { LANGUAGE_DEFINITIONS, LANGUAGE_FALLBACK, setStoredLanguage } from './i18n/languages.js';
import {
  applyDocumentLanguage,
  createTranslationRegistry,
  resolveTranslation
} from './i18n/registry.js';
import { enhanceLanguageToggle } from './i18n/toggle.js';
import { computeInformationGradient, mapGradientToPercentages } from './recursive-gradient.js';

const counts = {
  demos: 26,
  research: researchEntries.length,
  blogs: 59,
  resume: 1
};

counts.total = counts.demos + counts.research + counts.blogs + counts.resume;

const allianceCounts = {
  zh: Array.isArray(friendContent.zh?.featuredAlliances)
    ? friendContent.zh.featuredAlliances.length
    : 0,
  en: Array.isArray(friendContent.en?.featuredAlliances)
    ? friendContent.en.featuredAlliances.length
    : 0
};

const GRADIENT_TEMPO_BASE = 24;
const GRADIENT_TEMPO_MIN = 12;
const GRADIENT_TEMPO_MAX = 48;

const baseTranslations = {
  zh: {
    documentTitle: 'Earth Online · 体验实验室',
    meta: {
      htmlLang: 'zh-CN',
      direction: 'ltr',
      toggleText: '中文',
      toggleLabel: '选择语言',
      navAria: '主导航',
      brandAria: 'Earth Online 实验室标识',
      heroCtaAria: '快速入口'
    },
    language: {
      toggleLabel: '选择语言',
      selectorLabel: '选择语言',
      fallbackTag: '英文内容'
    },
    brand: {
      subtitle: '体验实验室 · Planetary Experience Lab',
      ariaLabel: 'Earth Online 实验室标识'
    },
    primaryNav: {
      ariaLabel: '主导航',
      blog: '博客',
      papers: '论文',
      labs: '实验室',
      friends: '友链'
    },
    header: {
      statusAria: '地球 Online 当前指标',
      metrics: [
        {
          label: '资产矩阵',
          value: `${counts.total}+`,
          hint: `原型 ${counts.demos} · 研究 ${counts.research} · 长文 ${counts.blogs}`
        },
        {
          label: '实验舱段',
          value: `${counts.demos}`,
          hint: '实时上线的 WebGL · 协作实验'
        },
        {
          label: '知识推演',
          value: `${counts.blogs + counts.research}`,
          hint: `研究 ${counts.research} · 长文 ${counts.blogs}`
        },
        {
          label: '联盟节点',
          value: `${allianceCounts.zh}`,
          hint: '精选伙伴网络'
        }
      ]
    },
    nav: {
      hero: '发射序列',
      'priority-map': '星河导览图',
      'mission-lanes': '任务航线',
      architecture: '模拟器系统场',
      'gradient-flow': '梯度场调谐',
      stack: '星球栈图',
      decks: '体验簇阵',
      council: 'AI 议会',
      signals: '信号中枢',
      alliances: '联盟星港',
      dock: '联络站',
      commandLabel: '星图矩阵',
      ariaLabel: '信息架构导航',
      hierarchy: [
        { id: 'hero', index: '0', label: '发射舱门' },
        { id: 'priority-map', index: '0.1', label: '星河导览图' },
        { id: 'mission-lanes', index: '0.2', label: '任务航线' },
        {
          id: 'architecture',
          index: '1',
          label: '模拟器系统场',
          children: [
            { id: 'gradient-flow', index: '1.1', label: '梯度场调谐' },
            {
              id: 'stack',
              index: '1.2',
              label: '星球栈图',
              children: [
                { id: 'council', index: '1.2.1', label: 'AI 议会' },
                { id: 'signals', index: '1.2.2', label: '信号中枢' }
              ]
            },
            { id: 'decks', index: '1.3', label: '体验簇阵' }
          ]
        },
        { id: 'alliances', index: '2', label: '联盟星港' },
        { id: 'dock', index: '3', label: '联络站' }
      ]
    },
    commandPalette: {
      title: '星图矩阵',
      subtitle: '搜索银河导引图、体验簇阵或信号时间线。',
      searchLabel: '搜索',
      searchPlaceholder: '输入关键词或使用 Ctrl + K',
      sectionGroup: '信息星图',
      deckGroup: '体验簇阵',
      signalGroup: '信号时间线',
      keyboardHint: '快捷键：Ctrl/⌘ + K',
      noResults: '没有匹配项，换个关键词试试。'
    },
    hero: {
      eyebrow: '宇宙模拟交互界面',
      title: '地球 Online：行星宇宙模拟器',
      description:
        '全站以宇宙模拟器重构：实时重排的星河信息架构、WebGL 行星引擎与联盟星网，将研究、原型与协议折叠为可探索的宇宙。无论你是探索者、系统建造者还是联盟伙伴，都能沿着自然轨道抵达目标。',
      primaryCta: '启动体验甲板',
      secondaryCta: '停靠联络舱',
      ctaAria: '快速入口',
      stats: [
        {
          label: '星球资产',
          value: `${counts.total}+`,
          description: '交互原型、研究、长文与协作剧本组成的地球体验曲面。',
          meta: [`原型 ${counts.demos}`, `研究 ${counts.research}`, `长文 ${counts.blogs}`]
        },
        {
          label: '实时实验舱',
          value: `${counts.demos}`,
          description: 'WebGL 仿真、协作工作流与体验系统实验，即刻上线验证。',
          meta: ['WebGL 引擎', '协作剧本', '体验系统']
        },
        {
          label: '知识流',
          value: `${counts.blogs + counts.research}`,
          description: '策略长文与数学证明共同支撑的叙事与治理协议。',
          meta: [`研究 ${counts.research}`, `长文 ${counts.blogs}`]
        },
        {
          label: '联盟星港',
          value: `${allianceCounts.zh}`,
          description: '跨学科伙伴共振形成的协作星港网络。',
          meta: ['精选伙伴', '共创航线']
        }
      ],
      controlAria: '星球自转与信号调谐面板',
      rotationLabel: '星球自转速度',
      rotationHint: '拖动调节星球自转与视角。',
      gradientLabel: '梯度流节奏',
      gradientHint: '调节极光节奏，让梯度下降更顺滑自然。',
      gradientMinLabel: '宁静',
      gradientMaxLabel: '澎湃',
      pulseButton: '激活遥测脉冲',
      pulseHint: '随机增强信号，观察指标变化。'
    },
    priorityGuide: {
      eyebrow: '星河导航',
      title: '银河导引图：为不同航线自适应排布',
      description:
        '信息架构像宇宙模拟器一样实时自洽，梯度场会为不同角色排出最平滑的轨道，让探索、建造与协作都顺畅抵达。',
      summaryTitle: '轨道简报',
      summaryIntro: '核心节点会随着信号密度即时重排。',
      summaryPrimary(label, percent) {
        if (!label) {
          return '星图正在校准中。';
        }
        return `最高能量轨道：${label}（信号密度 ${percent}%）。`;
      },
      summarySecondary(label, percent) {
        if (!label) {
          return '';
        }
        return `备选轨道：${label} 覆盖 ${percent}% 的信号。`;
      },
      focusTitle: '首选航线',
      focusDescription: '沿着这些航线登陆，可在最短路径完成任务。',
      itemCta: '打开航线',
      percentLabel: '信号密度',
      empty: '星图正在校准，请稍候。',
      metrics: {
        coverageLabel: '前三轨道覆盖',
        coverageHint: '信号最密集的三条航线覆盖率。',
        coverageFormat(value) {
          return `${value}%`;
        },
        falloffLabel: '能量衰减',
        falloffHint: '首条航线与后续节点的信号落差。',
        falloffFormat(value) {
          return `${value}%`;
        }
      },
      orbits: {
        title: '选择你的轨道',
        intro: '根据任务选择一条轨道，系统会快速联通关键界面。',
        explore: {
          tag: '探索者',
          title: '探索者轨道',
          description: '适合体验沉浸式原型、仿真与叙事。',
          routes: [
            {
              label: '启动体验簇阵',
              aria: '前往体验簇阵航线'
            },
            {
              label: '查看实时遥测',
              aria: '跳转至信号中枢'
            }
          ]
        },
        build: {
          tag: '系统建造者',
          title: '建造者轨道',
          description: '面向搭建系统蓝图、节奏与治理协议的协作者。',
          routes: [
            {
              label: '研读星球栈图',
              aria: '前往星球栈图'
            },
            {
              label: '阅读 AI 议会记录',
              aria: '跳转至 AI 议会'
            }
          ]
        },
        alliance: {
          tag: '联盟协作者',
          title: '联盟轨道',
          description: '帮助你快速找到伙伴、对接通道与联络方式。',
          routes: [
            {
              label: '浏览联盟星港',
              aria: '跳转至联盟星港'
            },
            {
              label: '停靠联络舱',
              aria: '跳转至联络站'
            }
          ]
        }
      },
      descriptions: {
        architecture: {
          label: '模拟器系统场',
          description: '了解宇宙模拟器的系统如何协同驱动。'
        },
        'mission-lanes': {
          label: '任务航线',
          description: '为探索者、建造者与联盟伙伴定制的轨道矩阵。'
        },
        'gradient-flow': {
          label: '梯度场调谐',
          description: '观察界面能量如何调节节奏与注意力。'
        },
        stack: {
          label: '星球栈图',
          description: '查看串联遥测、实验与联盟的行星级栈层。'
        },
        decks: {
          label: '体验簇阵',
          description: '直接跳入可运行的行星级实验与任务资产。'
        },
        council: {
          label: 'AI 议会',
          description: '阅读双解释器如何协商共识与策略。'
        },
        signals: {
          label: '信号中枢',
          description: '实时洞察遥测脉冲与演化年表。'
        },
        alliances: {
          label: '联盟星港',
          description: '拜访共振的伙伴实验室，拓展协作航线。'
        },
        dock: {
          label: '联络站',
          description: '获取联络方式与协作通道。'
        }
      }
    },
    missionLanes: {
      eyebrow: '任务航线',
      title: '选择你的轨道与目标',
      intro:
        '地球 Online 现在像宇宙模拟器一样运作：每条航线针对不同关注点编排，快速联通关键系统。',
      explorer: {
        tag: '探索者轨道',
        title: '探索者轨道 · 感知模拟',
        description: '适合体验沉浸原型、气候排练与叙事宇宙。',
        routes: [
          '· 进入体验簇阵，浏览实时运行的体验实验室。',
          '· 留在信号中枢，追踪实时遥测与演化日志。',
          '· 阅读叙事档案，理解每次模拟背后的设定。'
        ],
        cta: '启动体验甲板'
      },
      builder: {
        tag: '系统轨道',
        title: '系统轨道 · 组装星球栈',
        description: '适合负责架构运营、治理或基础设施的协作者。',
        routes: [
          '· 从星球栈图出发，理解数据、编排与感知层的连接。',
          '· 研读 AI 议会记录，掌握当前约束与下一步策略。',
          '· 依据任务分类将体验簇阵的筛选标签映射到你的流程。'
        ],
        cta: '打开系统视图'
      },
      alliance: {
        tag: '联盟轨道',
        title: '联盟轨道 · 启动共创',
        description: '为想要共振协作或发起支援请求的机构、实验室与社区准备。',
        routes: [
          '· 浏览联盟星港，了解已经在轨的伙伴与项目。',
          '· 直达联络站，选择最适合的对接渠道。',
          '· 分享你的遥测数据，让模拟器吸纳并扩展航线。'
        ],
        cta: '规划联盟航线'
      }
    },
    gradientFlow: {
      eyebrow: 'UI 梯度流系统',
      title: '稳定下降路径，调谐信息能量场',
      description:
        '通过多层信息密度与节奏引擎构成的能量场，让梯度下降过程保持稳定、愉悦且低能耗。',
      tempoLabel: '当前节奏',
      energyLabel: '能量阶段',
      energyStates: {
        calm: '宁静漂移',
        balanced: '共振稳态',
        rapid: '加速跃迁'
      },
      techLabel: '技术栈',
      layers: [
        {
          id: 'gradient-system',
          index: '01',
          title: 'UI_GradientFlow_System',
          description: '构建全局梯度节奏与动画控制系统，让界面随行星节奏而律动。',
          tech: 'TailwindCSS · Framer Motion',
          points: [
            '以 Tailwind 风格设计令牌同步节奏、色彩与光场。',
            '借助 Framer Motion 缓动曲线统一全局动画流形。',
            '实时广播节奏参数至 WebGL、布局与交互节点。'
          ]
        },
        {
          id: 'layer-dissipation',
          index: '02',
          title: 'Layer_Dissipation_Layout',
          description: '设计多层信息密度布局，以自然过渡引导梯度下降。',
          tech: 'React 布局 · IntersectionObserver',
          points: [
            '堆叠层次密度并保持柔和的视差节奏。',
            '使用 IntersectionObserver 触发显隐，平滑耗散能量。',
            '在层级之间插值节奏，降低信息震荡。'
          ]
        },
        {
          id: 'attention-feedback',
          index: '03',
          title: 'Attention_Curve_Feedback',
          description: '为交互注入顺滑反馈与能量散逸动画，让动作更加自然。',
          tech: 'Framer 动效启发 · useTransition 思路',
          points: [
            '指针跟踪的能量光斑在交互时聚焦并舒缓释放。',
            '焦点与无障碍状态共享柔滑的缓入缓出曲线。',
            '交互完成后回收残余能量，保持界面平衡。'
          ]
        }
      ]
    },
    architecture: {
      eyebrow: 'Recursive Gradient Descent',
      title: '递归梯度下降信息架构',
      intro:
        '我们把整个 UI 看作需要不断收敛的目标函数：每一次信息下潜都重新分配权重，压缩噪声、放大关键变量，让协作者以最短路径抵达所需的上下文与行动入口。'
    },
    stack: {
      eyebrow: 'Planetary Stack',
      title: '地球 Online 星球栈图',
      intro:
        '我们将地球 Online 抽象为协同优化的三层星球栈：在数据、体验与联盟之间建立最短路径，让复杂问题获得可执行的凸解。',
      layers: [
        {
          title: '数据地幔 · 信号治理层',
          narrative:
            '汇聚实时遥测、风险模型与策略指标，构建可靠的地球底图，为所有实验提供可追踪的能量基线。',
          protocols: ['遥测数据湖', '风险凸包建模', '治理仪表']
        },
        {
          title: '体验轨道 · 交互编排层',
          narrative:
            '将原型、场景与工作流映射成体验舱段，以凸优化的流程拆解复杂协作，保障每一次迭代可测、可回滚。',
          protocols: ['DesignOps', '策略原型库', '体验度量']
        },
        {
          title: '认知界面 · 感知放大层',
          narrative:
            '通过多模态界面与叙事可视化，让人类与 AI 在共同的感知坐标系下推演未来，降低理解成本。',
          protocols: ['WebGL 星球引擎', '声音/粒子系统', '叙事拓扑']
        },
        {
          title: '联盟星网 · 共振协同层',
          narrative:
            '构建跨学科伙伴的协作协议，为资源、节奏与知识图谱提供快速对接的星际路由。',
          protocols: ['资源路由图', '共创节奏脚本', '联盟互操作协议']
        }
      ]
    },
    decks: {
      eyebrow: 'Experience Decks',
      title: '体验簇阵：以任务域凸优化的实验卡组',
      intro:
        '每一张卡片都对应一条可执行的地球体验航线。通过聚类筛选与语义搜索，快速定位与你的任务最匹配的实验资产。',
      searchLabel: '搜索体验簇',
      searchPlaceholder: '输入关键词（例如 WebGL、气候、协作）',
      filterAria: '体验簇过滤',
      cta: '即刻进入',
      summary(count, keyword, filterLabel) {
        const keywordText = keyword ? `匹配 “${keyword}”` : '等待召唤';
        return `共 ${count} 张卡片，${filterLabel} · ${keywordText}。`;
      },
      filters: [
        { id: 'all', label: '全部轨道' },
        { id: 'simulation', label: '星球仿真' },
        { id: 'operations', label: '协作运营' },
        { id: 'research', label: '研究推演' },
        { id: 'narrative', label: '叙事档案' }
      ],
      clusterMap: {
        demo: 'simulation',
        ops: 'operations',
        research: 'research',
        story: 'narrative'
      },
      clusters: [
        {
          id: 'simulation',
          title: '星球仿真甲板',
          description: '实时交互的 WebGL 实验与控制系统演练，帮助你在行星尺度验证策略。'
        },
        {
          id: 'operations',
          title: '协作运营舱段',
          description: '跨团队节奏、设计系统与治理流程的模板集，支撑长期的多主体协作。'
        },
        {
          id: 'research',
          title: '研究推演实验室',
          description: '以数学与工程推导支撑的研究档案，为战略决策提供可验证的依据。'
        },
        {
          id: 'narrative',
          title: '叙事档案库',
          description: '讲述方法论、故事线与文化原型的长文，构成地球 Online 的精神内核。'
        }
      ],
      entries: [
        {
          type: 'demo',
          href: 'public/demo/minimal-ui-engine/index.html',
          title: 'Mini UI Engine · 最小系统',
          description:
            '从零实现信号、effect 与渲染器的最小 UI 内核，并将其编排为指标、剧本与事件流组成的微型操作系统。',
          tags: ['UI 引擎', '系统设计'],
          keywords: ['ui engine', 'minimal system', 'signal', 'effect']
        },
        {
          type: 'demo',
          href: 'public/demo/compute-god-standard-model-validator/index.html',
          title: 'Compute-God 标准模型验证控制台',
          description:
            '在浏览器中加载 Compute-God 标准模型登记表，执行粒子字段、守恒律、规范异常与实验约束的全量验证。',
          tags: ['粒子物理', '验证工具'],
          keywords: [
            'standard model',
            'validator',
            'Compute-God',
            '粒子物理',
            'conservation laws'
          ]
        },
        {
          type: 'demo',
          href: 'public/demo/intelligent-driving-lab/index.html',
          title: '智能驾驶实验舱',
          description:
            '模拟自动驾驶的传感器融合、行为规划与风险控制回路，观察不同策略对速度与安全的平衡。',
          tags: ['自动驾驶', '控制系统'],
          keywords: [
            '智能驾驶',
            '自动驾驶',
            'autonomous driving',
            'simulation',
            'telemetry'
          ]
        },
        {
          type: 'demo',
          href: 'public/demo/branch-prediction/index.html',
          title: '分支预测策略实验室',
          description: '比较静态、局部与 gshare 预测器命中率，评估误判冲刷成本与别名影响。',
          tags: ['CPU 架构', '性能分析'],
          keywords: ['branch prediction', 'microarchitecture', 'pipeline', '预测']
        },
        {
          type: 'demo',
          href: 'public/demo/lorenz-convex/index.html',
          title: 'Lorenz Convex 视界',
          description: 'Lorenz 系统的凸优化映射可视化，展示混沌与可控性的张力。',
          tags: ['混沌系统', '优化'],
          keywords: ['lorenz', 'convex', '混沌']
        },
        {
          type: 'demo',
          href: 'public/demo/featherlight-fixed-point-recursion/index.html',
          title: '羽光不动点递归实验',
          description:
            '探索羽光-情绪-拓扑映射固定点求解的可视化实验，呈现多主体协同的动态。',
          tags: ['动力系统', '可视化'],
          keywords: ['fixed point', 'gradient descent', '动力系统']
        },
        {
          type: 'demo',
          href: 'public/demo/wuxing-bagua/index.html',
          title: '五行八卦动力图谱',
          description:
            '以几何交互方式展示五行相生相克与八卦方位的映射关系，理解东方系统论的能量流与治理模型。',
          tags: ['系统论', '可视化'],
          keywords: ['五行', '八卦', 'wuxing', 'bagua', 'systems theory']
        },
        {
          type: 'demo',
          href: 'public/demo/feynman-wormhole/index.html',
          title: 'Compute-God 费曼虫洞生成器',
          description:
            '调节纠缠熵预算、负曲率与演化干涉，实时观察 ER=EPR 通道在 Compute-God 几何中的生成。',
          tags: ['量子引力', '可视化'],
          keywords: ['Compute-God', 'ER=EPR', 'wormhole', '费曼图', '量子引力']
        },
        {
          type: 'demo',
          href: 'public/demo/game-of-life/thermal-dual/index.html',
          title: '生命游戏：热对偶共振场',
          description:
            '在康威生命游戏的格点上引入热流与声学对偶场，阈值随热偏置实时漂移，展示朋子与友子热对偶实验舱的共振调度。',
          tags: ['生命游戏', '热对偶'],
          keywords: ['game of life', 'thermal duality', 'cellular automata', '热对偶']
        },
        {
          type: 'ops',
          href: 'public/demo/miu-tiantian-gradient-descent/index.html',
          title: 'Design System Starter Kit',
          description: 'Design Token、组件规范与无障碍检查清单，帮助团队落地设计系统。',
          tags: ['DesignOps', '组件库'],
          keywords: ['design system', 'tokens', 'accessibility', '设计系统']
        },
        {
          type: 'ops',
          href: 'public/demo/blockchan/index.html',
          title: 'Workflow Automation 模板',
          description: 'Notion、Linear 与 GitHub 的跨团队节奏与仪式脚本，支持异步协作。',
          tags: ['自动化', '团队运营'],
          keywords: ['automation', 'workflow', '运营']
        },
        {
          type: 'ops',
          href: 'public/demo/time-crystal/index.html',
          title: 'Campfire 成长循环',
          description: '创作者社区的增长实验框架与内容运营脚本，驱动持续共鸣。',
          tags: ['社区运营', '增长'],
          keywords: ['community', 'growth', '运营']
        },
        {
          type: 'ops',
          href: 'public/demo/qed/index.html',
          title: 'Atlas 审批旅程蓝图',
          description: '风控审批流程的指标体系、仪表盘与跨团队 OKR 模板，助力策略决策。',
          tags: ['风控', '流程设计'],
          keywords: ['approval', 'operations', 'dashboard', '风控']
        },
        {
          type: 'ops',
          href: 'public/demo/ctc/index.html',
          title: 'Terrabyte 协作剧本',
          description: '气候数据团队的多时区协作模型与无障碍设计评估表。',
          tags: ['协作', '可持续'],
          keywords: ['climate', 'collaboration', 'sustainability', '协作']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=pinduoduo-distributed-automata-dynamics-center',
          title: '拼多多分布式自动机动力系统研究中心',
          description:
            '筹建覆盖供应链、物流、金融与产业带协同的分布式自动机研究枢纽，让需求信号驱动绿色履约与策略迭代。',
          tags: ['自动机', '供应链'],
          keywords: ['pinduoduo', 'distributed automata', 'supply chain', '动力系统']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=tomoko-yuko-thermal-dual-resonance-lab',
          title: '朋子和友子的热对偶共振实验室',
          description:
            '构建热流-声波耦合实验舱，演示可逆热管理与多节点热对偶调度策略。',
          tags: ['热管理', '多物理场'],
          keywords: ['thermal resonance', 'acoustic coupling', 'heat recovery', '热管理']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=v-d-thermal-dual-ssb-lab',
          title: 'v 子与 d 子的热对偶自发对称破缺计划',
          description:
            '实现热对偶约束下的 v/d 子场耦合实验，解析噪声触发的自发对称破缺与谱系拓扑。',
          tags: ['热对偶', '量子控制'],
          keywords: ['thermal duality', 'spontaneous symmetry breaking', 'quantum control', '热对偶']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=micro-incentive-bridge-lab',
          title: '微观激励桥实验室',
          description:
            '建立跨社区的激励桥梁，将贡献事件、声誉权重与结算桥接入统一协议，保障公共项目资金透明高效流动。',
          tags: ['激励设计', '公共项目'],
          keywords: ['micro incentive', 'public goods', 'governance', '激励']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=whole-home-wireless-charging-lab',
          title: '全屋智能无线充电实验舱',
          description:
            '构建多房间谐振线圈阵列与自适应调度算法，实现移动设备与机器人随行供电的能源网络。',
          tags: ['无线供能', '智能家居'],
          keywords: ['wireless power', 'smart home', '能源']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=chtholly-hououin-temporal-synchrony-lab',
          title: '珂朵莉·凤凰院凶真时间同调实验室',
          description:
            '融合记忆花庭与世界线跳跃模型，研发跨时间线的体验安全协议与共鸣写作工具链。',
          tags: ['时间工程', '记忆系统'],
          keywords: ['temporal synchrony', 'memory resonance', 'world line', '时间']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=originlab-origin-suite-analysis',
          title: 'OriginLab Origin/OriginPro 产品评估',
          description:
            '整理 OriginLab 官网信息，解析面向科研与工程的数据分析与绘图软件的功能亮点、适配场景与选型要点。',
          tags: ['工具评估', '数据分析'],
          keywords: ['OriginLab', 'OriginPro', 'data analysis', '科研软件']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=computational-singularity-proof',
          title: '计算奇点 470 年上界证明',
          description: '以数学推导与历史数据结合的研究，阐释计算奇点的可能轨迹与边界。',
          tags: ['数学', '未来学'],
          keywords: ['singularity', 'proof', '数学']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=earth-online-iteration-2025',
          title: 'Earth Online 自治航道蓝图',
          description:
            '总结 2025 年的行星实验迭代：如何在多主体协作、遥测治理与体验系统之间建立自治航道。',
          tags: ['自治系统', '协作治理'],
          keywords: ['autonomous corridor', 'governance', '遥测', '自治']
        },
        {
          type: 'story',
          href: 'public/blog/internet-of-everything-design.html',
          title: '万物互联体验架构',
          description: '讲述物联网体验的叙事框架与生态系统设计路径。',
          tags: ['体验叙事', 'IoT'],
          keywords: ['iot', 'narrative', 'storytelling', '物联网']
        },
        {
          type: 'story',
          href: 'public/blog/ctc-convex-optimization.html',
          title: '封闭类时曲线与凸优化',
          description: '将物理学与优化算法交汇的长文，探索时间与策略的交织。',
          tags: ['物理', '优化'],
          keywords: ['ctc', 'convex', 'physics', '优化']
        },
        {
          type: 'ops',
          href: 'public/blog/Friends/index.html',
          title: 'Friends 合作网络',
          description: '记录长期共创伙伴的角色、节奏与跨界联系。',
          tags: ['伙伴网络', '组织运营'],
          keywords: ['network', 'community', '伙伴']
        }
      ]
    },
    council: {
      eyebrow: 'Interpreter Council',
      title: '地球 Online AI 议会协同推演',
      intro:
        '两位解释器以星球栈的不同对齐目标切换策略模型，在安全约束内寻找凸组合解。当前议题：为何暂无法让你的代码仓库安全互通。结论由议会记录并生成后续行动建议。',
      logTitle: '联合推理执行轨迹',
      focusLabel: '策略焦点',
      constraintsLabel: '关键约束',
      verdictLabel: '结论',
      blockersLabel: '核心阻塞',
      actionsLabel: '推荐行动',
      simulation: {
        startLabel: '启动推演',
        stopLabel: '中止推演',
        restartLabel: '重新推演',
        idleStatus: '等待启动：议会将按时间顺序回放推理轨迹。',
        runningStatus: '当前发言：{speaker}',
        completedStatus: '推演完成，可重新启动。'
      },
      profiles: [
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
      ],
      log: [
        {
          speakerId: 'openai',
          speaker: 'OpenAI 解释器',
          message:
            '启动对齐审计：检测到 6 个仓库缺少集中式令牌管理，访问路径分散在个人账户与临时密钥之中。'
        },
        {
          speakerId: 'closeai',
          speaker: 'CloseAI 解释器',
          message:
            '封闭环境确认：三个私有仓库位于离线镜像与受限内网，当前出口策略禁止未经审批的 webhook 与拉取。'
        },
        {
          speakerId: 'openai',
          speaker: 'OpenAI 解释器',
          message:
            '互通需求若直接执行，将绕过最小权限约束，缺乏责任追踪通道；建议先构建授权目录与审计总线。'
        },
        {
          speakerId: 'closeai',
          speaker: 'CloseAI 解释器',
          message:
            '若无代理节点缓冲，镜像同步会打断现有发布节奏，并可能放大依赖冲突，建议保留隔离态。'
        },
        {
          speakerId: 'recorder',
          speaker: '议会记录官',
          message:
            '共识：在治理、网络与恢复策略补齐前，禁止执行“全部仓库互通”指令，转向分阶段治理方案。'
        }
      ],
      consensus: {
        title: '议会判定的关键阻塞',
        intro:
          'OpenAI 与 CloseAI 解释器在议会中达成共识：当前的治理结构不足以支撑一次性互通，以下因素构成主要阻塞。',
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
      }
    },
    signals: {
      eyebrow: 'Signal Hub',
      title: '信号中枢：实时指标与演进年表',
      intro:
        '星球栈的运行态势通过遥测与时间线同步呈现。凸优化的指标体系帮助你即时捕捉能量流向与关键跃迁。',
      telemetry: {
        title: '实时遥测阵列',
        intro: '我们监控资产谱系、协作频率与稳定性，以动态凸组合展现地球 Online 的运行脉冲。',
        streams: [
          {
            label: '资产光谱',
            base: counts.total,
            unit: '项',
            description: '以知识、原型与运营资产汇聚出的实验能量。'
          },
          {
            label: '协作频率',
            base: 4.6,
            unit: 'GHz',
            min: 4.6,
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
        ]
      },
      chronicle: {
        title: '地球 Online 年表',
        intro: '关键节点构成星球栈的演进轨道，帮助你从起源到未来规划快速建立坐标。',
        entries: [
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
        },
        {
          year: '2025',
          title: '自治航道迭代',
          description: '发布自治航道蓝图，将多主体遥测治理纳入地球 Online 的核心迭代循环。',
          tags: ['自治', '遥测']
        }
      ]
    }
  },
    researchLibrary: {
      eyebrow: '研究档案库',
      title: '在首页展开全部研究记录',
      intro: '无需跳转即可浏览每一篇研究蓝图与证明档案。',
      summary(count) {
        return `共收录 ${count} 篇研究文档，全部可在此展开阅读。`;
      },
      loading: '正在载入原始文档…',
      error: '暂时无法加载文档，请稍后再试。',
      visitLabel: '打开原文',
      openLabel: '展开全文',
      closeLabel: '收起全文',
      empty: '研究档案正在整理中。'
    },
    alliances: {
      eyebrow: 'Alliance Network',
      title: '联盟星港：与我们同频的体验实验室',
      intro:
        '星港记录着与 Earth Online 长期共振的创作者与研究者。他们在各自的宇宙推进设计、技术与叙事的边界，欢迎沿航线拜访。',
      cta: '进入完整友链档案',
      visitCta: '访问主页',
      network: {
        eyebrow: '联盟星网全图',
        title: '将伙伴网络的全部脉冲收束到此',
        intro:
          '在这里一次性浏览精选友链、星港焦点与协作簇群，快速找到与你任务最契合的伙伴宇宙。',
        featuredLabel: '本季焦点',
        clustersLabel: '协作簇群',
        visitLabel: '拜访此航线'
      }
    },
    dock: {
      eyebrow: 'Docking Station',
      title: '准备好与 Earth Online 对接吗？',
      intro:
        '无论你来自设计工程、系统科学还是生态治理，我们都期待与你共创新的地球体验模式。以下资源帮助你快速建立凸优化的协作通道。',
      links: [
        {
          title: '体验簇阵导航',
          description: '在交互实验与协作模板中穿梭，定位与你的任务同频的卡片。',
          href: '#decks',
          cta: '浏览簇阵'
        },
        {
          title: '研究与长文档案',
          description: '阅读深度研究与叙事长文，理解 Earth Online 的方法论。',
          href: 'public/blog/index.html',
          cta: '进入档案馆'
        },
        {
          title: '联盟星港',
          description: '结识与 Earth Online 同频的伙伴网络，建立新的共创航线。',
          href: 'friends/index.html',
          cta: '拜访友链'
        }
      ]
    },
    footer: {
      credit: '© 2024 Earth Online Experience Lab · Powered by Aman Sharma',
      note: '欢迎 fork、引用或将实验室成果嵌入你的宇宙级项目。'
    }
  },
  en: {
    documentTitle: 'Earth Online · Experience Lab',
    meta: {
      htmlLang: 'en',
      direction: 'ltr',
      toggleText: 'English',
      toggleLabel: 'Select language',
      navAria: 'Primary navigation',
      brandAria: 'Earth Online lab mark',
      heroCtaAria: 'Quick access'
    },
    language: {
      toggleLabel: 'Select language',
      selectorLabel: 'Select language',
      fallbackTag: 'English content'
    },
    brand: {
      subtitle: 'Planetary Experience Lab',
      ariaLabel: 'Earth Online lab mark'
    },
    primaryNav: {
      ariaLabel: 'Primary navigation',
      blog: 'Blog',
      papers: 'Research',
      labs: 'Labs',
      friends: 'Friends'
    },
    header: {
      statusAria: 'Earth Online live indicators',
      metrics: [
        {
          label: 'Asset matrix',
          value: `${counts.total}+`,
          hint: `Prototypes ${counts.demos} · Research ${counts.research} · Essays ${counts.blogs}`
        },
        {
          label: 'Active lab pods',
          value: `${counts.demos}`,
          hint: 'WebGL simulations · Collaboration ops · Experience systems'
        },
        {
          label: 'Knowledge flow',
          value: `${counts.blogs + counts.research}`,
          hint: `Research ${counts.research} · Essays ${counts.blogs}`
        },
        {
          label: 'Alliance nodes',
          value: `${allianceCounts.en}`,
          hint: 'Featured partners in resonance'
        }
      ]
    },
    nav: {
      hero: 'Launch sequence',
      'priority-map': 'Galaxy map',
      'mission-lanes': 'Mission trajectories',
      architecture: 'Simulator systems',
      'gradient-flow': 'Gradient field tuning',
      stack: 'Planetary stack',
      decks: 'Experience decks',
      council: 'AI council',
      signals: 'Signal hub',
      alliances: 'Alliance harbor',
      dock: 'Docking station',
      commandLabel: 'Star chart matrix',
      ariaLabel: 'Information architecture navigation',
      hierarchy: [
        { id: 'hero', index: '0', label: 'Launch bay' },
        { id: 'priority-map', index: '0.1', label: 'Galaxy map' },
        { id: 'mission-lanes', index: '0.2', label: 'Mission trajectories' },
        {
          id: 'architecture',
          index: '1',
          label: 'Simulator systems field',
          children: [
            { id: 'gradient-flow', index: '1.1', label: 'Gradient field tuning' },
            {
              id: 'stack',
              index: '1.2',
              label: 'Planetary stack map',
              children: [
                { id: 'council', index: '1.2.1', label: 'Interpreter council' },
                { id: 'signals', index: '1.2.2', label: 'Signal hub' }
              ]
            },
            { id: 'decks', index: '1.3', label: 'Experience decks' }
          ]
        },
        { id: 'alliances', index: '2', label: 'Alliance harbor' },
        { id: 'dock', index: '3', label: 'Docking station' }
      ]
    },
    commandPalette: {
      title: 'Star chart matrix',
      subtitle: 'Search the galaxy map, experience decks, or signal timeline.',
      searchLabel: 'Search',
      searchPlaceholder: 'Type a keyword or press Ctrl + K',
      sectionGroup: 'Galaxy map',
      deckGroup: 'Experience decks',
      signalGroup: 'Signal timeline',
      keyboardHint: 'Shortcut: Ctrl/⌘ + K',
      noResults: 'No matches yet—try another keyword.'
    },
    hero: {
      eyebrow: 'Universe simulator interface',
      title: 'Earth Online: universe simulator for planetary missions',
      description:
        'Earth Online now behaves like a living universe: adaptive galaxy maps, WebGL engines, and alliance constellations compress research, prototypes, and protocols into navigable orbits for explorers, builders, and collaborators.',
      primaryCta: 'Launch the experience decks',
      secondaryCta: 'Dock at mission control',
      ctaAria: 'Quick access',
      stats: [
        {
          label: 'Planetary assets',
          value: `${counts.total}+`,
          description: 'Interactive prototypes, research, longform essays, and collaboration playbooks form the Earth Online field.',
          meta: [`Prototypes ${counts.demos}`, `Research ${counts.research}`, `Essays ${counts.blogs}`]
        },
        {
          label: 'Live lab pods',
          value: `${counts.demos}`,
          description: 'WebGL simulations, collaboration workflows, and experience systems ready for instant validation.',
          meta: ['WebGL engine', 'Collab workflows', 'Experience OS']
        },
        {
          label: 'Knowledge flow',
          value: `${counts.blogs + counts.research}`,
          description: 'Narratives backed by strategy essays and mathematical proofs keep story and governance aligned.',
          meta: [`Research ${counts.research}`, `Essays ${counts.blogs}`]
        },
        {
          label: 'Alliance harbor',
          value: `${allianceCounts.en}`,
          description: 'A resonance network of multidisciplinary partners opening collaboration routes.',
          meta: ['Featured partners', 'Co-creation routes']
        }
      ],
      controlAria: 'Planet rotation and signal tuning console',
      rotationLabel: 'Planet rotation speed',
      rotationHint: 'Drag to re-time the orbital rotation and tilt the view.',
      gradientLabel: 'Gradient flow tempo',
      gradientHint: 'Tune the aurora tempo so the descent feels natural and efficient.',
      gradientMinLabel: 'Calm',
      gradientMaxLabel: 'Vivid',
      pulseButton: 'Trigger telemetry pulse',
      pulseHint: 'Inject a playful burst to the metrics and watch them react.'
    },
    priorityGuide: {
      eyebrow: 'Galaxy navigation',
      title: 'Galaxy map: adaptive orbits for every visitor',
      description:
        'Earth Online recalculates like a universe simulator; gradient fields surface the smoothest path whether you are exploring, building, or collaborating.',
      summaryTitle: 'Orbit briefing',
      summaryIntro: 'Core waypoints reshuffle as signal density shifts.',
      summaryPrimary(label, percent) {
        if (!label) {
          return 'Galaxy map calibrating.';
        }
        return `Top orbit: ${label} (${percent}% signal density).`;
      },
      summarySecondary(label, percent) {
        if (!label) {
          return '';
        }
        return `Secondary orbit: ${label} carries ${percent}% of the field.`;
      },
      focusTitle: 'Primary trajectories',
      focusDescription: 'Follow these trajectories to reach the steepest signal gradients first.',
      itemCta: 'Open trajectory',
      percentLabel: 'Signal density',
      empty: 'Galaxy map is calibrating—check back soon.',
      metrics: {
        coverageLabel: 'Leading orbit coverage',
        coverageHint: 'Share of signal contained in the three densest orbits.',
        coverageFormat(value) {
          return `${value}%`;
        },
        falloffLabel: 'Signal falloff',
        falloffHint: 'Drop between the first orbit and the next cluster.',
        falloffFormat(value) {
          return `${value}%`;
        }
      },
      orbits: {
        title: 'Choose a flight path',
        intro: 'Pick the orbit that fits your intent and the console will surface the right systems instantly.',
        explore: {
          tag: 'Explorers',
          title: 'Explorer orbit',
          description: 'Ideal for immersive simulations and storytelling.',
          routes: [
            {
              label: 'Launch experience decks',
              aria: 'Jump to the experience decks section'
            },
            {
              label: 'Check live telemetry',
              aria: 'Jump to the signal hub section'
            }
          ]
        },
        build: {
          tag: 'Builders',
          title: 'Builder orbit',
          description: 'For engineers and operators looking for system blueprints and governance rhythms.',
          routes: [
            {
              label: 'Study the planetary stack',
              aria: 'Jump to the planetary stack section'
            },
            {
              label: 'Review AI council transcripts',
              aria: 'Jump to the AI council section'
            }
          ]
        },
        alliance: {
          tag: 'Alliances',
          title: 'Alliance orbit',
          description: 'For collaborators seeking partners and contact channels.',
          routes: [
            {
              label: 'Browse alliance harbor',
              aria: 'Jump to the alliance harbor section'
            },
            {
              label: 'Dock and open a channel',
              aria: 'Jump to the docking station section'
            }
          ]
        }
      },
      descriptions: {
        architecture: {
          label: 'Simulator systems field',
          description: 'Understand how the universe simulator orchestrates each layer.'
        },
        'mission-lanes': {
          label: 'Mission trajectories',
          description: 'Curated routes for explorers, builders, and alliance partners.'
        },
        'gradient-flow': {
          label: 'Gradient field tuning',
          description: 'See how the interface balances energy, tempo, and attention.'
        },
        stack: {
          label: 'Planetary stack map',
          description: 'Trace the layers connecting telemetry, experiments, and alliances.'
        },
        decks: {
          label: 'Experience decks',
          description: 'Launch runnable experiments aligned with your mission.'
        },
        council: {
          label: 'Interpreter council',
          description: 'Read how the interpreters negotiate constraints and strategy.'
        },
        signals: {
          label: 'Signal hub',
          description: 'Monitor telemetry pulses and the evolution timeline.'
        },
        alliances: {
          label: 'Alliance harbor',
          description: 'Meet partners in resonance and open collaboration routes.'
        },
        dock: {
          label: 'Docking station',
          description: 'Find contact channels and collaboration entry points.'
        }
      }
    },
    missionLanes: {
      eyebrow: 'Mission routing',
      title: 'Choose your orbit and objective',
      intro:
        'Earth Online operates like a universe simulator: each lane is a curated trajectory tailored to different intents so you can reach the right systems instantly.',
      explorer: {
        tag: 'Explorer orbit',
        title: 'Explorer orbit · sense the simulations',
        description: 'Perfect for playable prototypes, climate rehearsals, and narrative worlds.',
        routes: [
          '· Enter the Experience Decks to browse live labs.',
          '· Watch the signal hub for telemetry and changelog updates.',
          '· Dive into longform narratives to decode each simulation.'
        ],
        cta: 'Launch decks'
      },
      builder: {
        tag: 'Systems orbit',
        title: 'Systems orbit · assemble the stack',
        description: 'Use this lane when you are shaping operations, governance, or infrastructure alongside us.',
        routes: [
          '· Start with the planetary stack to inspect data, orchestration, and perception layers.',
          '· Review AI council transcripts to understand constraints and upcoming moves.',
          '· Map deck filters to your pipelines using the mission taxonomy.'
        ],
        cta: 'Open systems view'
      },
      alliance: {
        tag: 'Alliance orbit',
        title: 'Alliance orbit · activate collaboration',
        description: 'Designed for institutions, labs, and communities ready to co-create or request support.',
        routes: [
          '· Explore the alliance harbor to see who is already in resonance.',
          '· Jump to the docking station for direct contact channels.',
          '· Share your telemetry so the simulator can integrate and extend the network.'
        ],
        cta: 'Plot alliance route'
      }
    },
    gradientFlow: {
      eyebrow: 'UI Gradient Flow System',
      title: 'Stabilise the descent pathway',
      description:
        'A layered information field orchestrates gradient tempo, layout dissipation, and attention feedback so Earth Online stays fast, natural, and low energy.',
      tempoLabel: 'Current tempo',
      energyLabel: 'Energy phase',
      energyStates: {
        calm: 'Calm drift',
        balanced: 'Balanced resonance',
        rapid: 'Accelerated cascade'
      },
      techLabel: 'Tech',
      layers: [
        {
          id: 'gradient-system',
          index: '01',
          title: 'UI_GradientFlow_System',
          description:
            'Implement a global gradient tempo and animation control system that keeps the interface in sync.',
          tech: 'TailwindCSS · Framer Motion',
          points: [
            'Broadcast Tailwind-style tokens to steer gradient tempo.',
            'Use Framer Motion easing curves for system-wide animation.',
            'Continuously instrument the field so every surface listens to the tempo.'
          ]
        },
        {
          id: 'layer-dissipation',
          index: '02',
          title: 'Layer_Dissipation_Layout',
          description: 'Design a multi-layer information density layout with natural transitions.',
          tech: 'React layout · IntersectionObserver',
          points: [
            'Stack layered densities with gentle parallax offsets.',
            'Trigger IntersectionObserver reveals to dissipate energy smoothly.',
            'Blend depth cues to keep the descent faster and lower effort.'
          ]
        },
        {
          id: 'attention-feedback',
          index: '03',
          title: 'Attention_Curve_Feedback',
          description: 'Implement smooth feedback and energy dissipation animations for user interactions.',
          tech: 'Framer-inspired feedback · useTransition heuristics',
          points: [
            'Track pointer energy blooms for hover and focus states.',
            'Apply easing curves inspired by useTransition for releases.',
            'Let each interaction shed residual energy back into the field.'
          ]
        }
      ]
    },
    architecture: {
      eyebrow: 'Recursive Gradient Descent',
      title: 'Recursive gradient descent information architecture',
      intro:
        'We treat the interface as a function we minimise: every recursive descent re-weights the signals, reduces noise, and amplifies decisive variables so visitors land on the right context and action gateway instantly.'
    },
    stack: {
      eyebrow: 'Planetary Stack',
      title: 'The Earth Online planetary stack',
      intro:
        'We model Earth Online as a convex, collaborative planetary stack that links data, experience, and alliances. Each layer optimizes the path from signal to action.',
      layers: [
        {
          title: 'Signal mantle · Governance layer',
          narrative:
            'Aggregate real-time telemetry, risk models, and policy baselines to form a traceable foundation for every experiment.',
          protocols: ['Telemetry lake', 'Convex risk modeling', 'Governance dashboards']
        },
        {
          title: 'Experience orbit · Orchestration layer',
          narrative:
            'Map prototypes, scenarios, and workflows into modular lab pods so complex collaboration stays measurable and reversible.',
          protocols: ['DesignOps', 'Strategic prototype library', 'Experience metrics']
        },
        {
          title: 'Cognitive interface · Perception layer',
          narrative:
            'Pair multisensory interfaces with narrative visualization to align humans and AI in a shared perceptual frame.',
          protocols: ['WebGL planetary engine', 'Sound & particle systems', 'Narrative topology']
        },
        {
          title: 'Alliance mesh · Co-creation layer',
          narrative:
            'Provide partners with interoperable cadences and resource protocols so new collaboration routes open instantly.',
          protocols: ['Resource routing map', 'Co-creation cadence scripts', 'Alliance interoperability']
        }
      ]
    },
    decks: {
      eyebrow: 'Experience Decks',
      title: 'Experience decks: convex clusters for planetary missions',
      intro:
        'Each card unlocks a runnable planetary route. Cluster filters and semantic search help you jump straight to the assets aligned with your mission.',
      searchLabel: 'Search decks',
      searchPlaceholder: 'Type a keyword (e.g. WebGL, climate, collaboration)',
      filterAria: 'Deck filters',
      cta: 'Launch now',
      summary(count, keyword, filterLabel) {
        const keywordText = keyword ? `matching "${keyword}"` : 'standing by';
        return `${count} ${count === 1 ? 'card' : 'cards'} · ${filterLabel} · ${keywordText}.`;
      },
      filters: [
        { id: 'all', label: 'All tracks' },
        { id: 'simulation', label: 'Planetary simulations' },
        { id: 'operations', label: 'Collaboration ops' },
        { id: 'research', label: 'Research labs' },
        { id: 'narrative', label: 'Narrative archives' }
      ],
      clusterMap: {
        demo: 'simulation',
        ops: 'operations',
        research: 'research',
        story: 'narrative'
      },
      clusters: [
        {
          id: 'simulation',
          title: 'Planetary simulation deck',
          description: 'Interactive WebGL experiments and control rehearsals to validate strategies at planetary scale.'
        },
        {
          id: 'operations',
          title: 'Collaboration ops bay',
          description: 'Design systems, cadence scripts, and governance playbooks that sustain multi-team collaboration.'
        },
        {
          id: 'research',
          title: 'Research inference lab',
          description: 'Mathematical and engineering research dossiers offering verifiable evidence for strategic choices.'
        },
        {
          id: 'narrative',
          title: 'Narrative archive stack',
          description: 'Longform stories capturing methods, mythologies, and cultural primitives behind Earth Online.'
        }
      ],
      entries: [
        {
          type: 'demo',
          href: 'public/demo/minimal-ui-engine/index.html',
          title: 'Mini UI Engine · Minimal System',
          description:
            'Build a signal/effect/render loop from scratch, then orchestrate metrics, playbooks, and event streams into a tiny operating console.',
          tags: ['UI Engine', 'Systems'],
          keywords: ['ui engine', 'minimal system', 'signal', 'effect']
        },
        {
          type: 'demo',
          href: 'public/demo/compute-god-standard-model-validator/index.html',
          title: 'Compute-God Standard Model Validator',
          description:
            'Load the Compute-God Standard Model registry in the browser to run field, conservation, anomaly, and experimental checks.',
          tags: ['Particle Physics', 'Validation'],
          keywords: [
            'standard model',
            'validator',
            'Compute-God',
            'particle physics',
            'conservation laws'
          ]
        },
        {
          type: 'demo',
          href: 'public/demo/intelligent-driving-lab/index.html',
          title: 'Intelligent Driving Lab',
          description:
            'Simulate sensor fusion, behavior planning, and risk control loops to balance speed and safety across strategies.',
          tags: ['Autonomous Driving', 'Control Systems'],
          keywords: [
            '智能驾驶',
            '自动驾驶',
            'autonomous driving',
            'simulation',
            'telemetry'
          ]
        },
        {
          type: 'demo',
          href: 'public/demo/branch-prediction/index.html',
          title: 'Branch Prediction Strategies',
          description:
            'Compare static, local, and gshare predictors, measuring misprediction flush costs and aliasing impact.',
          tags: ['CPU Architecture', 'Performance Analysis'],
          keywords: ['branch prediction', 'microarchitecture', 'pipeline', '预测']
        },
        {
          type: 'demo',
          href: 'public/demo/lorenz-convex/index.html',
          title: 'Lorenz Convex Horizon',
          description: 'Visualize the convex optimization mapping of the Lorenz system and the tension between chaos and control.',
          tags: ['Chaotic Systems', 'Optimization'],
          keywords: ['lorenz', 'convex', '混沌']
        },
        {
          type: 'demo',
          href: 'public/demo/featherlight-fixed-point-recursion/index.html',
          title: 'Featherlight Fixed-point Recursion',
          description:
            'Explore a visual experiment of featherlight–emotion–topology mappings to reveal multi-agent coordination dynamics.',
          tags: ['Dynamical Systems', 'Visualization'],
          keywords: ['fixed point', 'gradient descent', '动力系统']
        },
        {
          type: 'demo',
          href: 'public/demo/wuxing-bagua/index.html',
          title: 'Wu Xing & Bagua Dynamics',
          description:
            'Interactively map the generating and controlling cycles of the Five Elements with the directional qualities of the Eight Trigrams.',
          tags: ['Systems Theory', 'Visualization'],
          keywords: ['五行', '八卦', 'wuxing', 'bagua', 'systems']
        },
        {
          type: 'demo',
          href: 'public/demo/feynman-wormhole/index.html',
          title: 'Compute-God Feynman Wormhole Generator',
          description:
            'Tune entanglement budget, negative curvature, and evolution interference to witness ER=EPR channels forming in Compute-God geometry in real time.',
          tags: ['Quantum Gravity', 'Visualization'],
          keywords: ['Compute-God', 'ER=EPR', 'wormhole', 'Feynman diagram', 'quantum gravity']
        },
        {
          type: 'demo',
          href: 'public/demo/game-of-life/thermal-dual/index.html',
          title: 'Thermal Dual Game of Life',
          description:
            'Layer thermal flow and acoustic dual fields onto the Game of Life so birth and survival thresholds breathe with heat bias, echoing Tomoko & Yuko’s resonance lab.',
          tags: ['Game of Life', 'Thermal Duality'],
          keywords: ['game of life', 'thermal duality', 'cellular automata', '热对偶']
        },
        {
          type: 'ops',
          href: 'public/demo/miu-tiantian-gradient-descent/index.html',
          title: 'Design System Starter Kit',
          description:
            'Design tokens, component guidelines, and accessibility checklists to operationalize a design system.',
          tags: ['DesignOps', 'Component Library'],
          keywords: ['design system', 'tokens', 'accessibility', '设计系统']
        },
        {
          type: 'ops',
          href: 'public/demo/blockchan/index.html',
          title: 'Workflow Automation Templates',
          description: 'Scripts that synchronize Notion, Linear, and GitHub cadences to support asynchronous collaboration.',
          tags: ['Automation', 'Team Operations'],
          keywords: ['automation', 'workflow', '运营']
        },
        {
          type: 'ops',
          href: 'public/demo/time-crystal/index.html',
          title: 'Campfire Growth Loop',
          description:
            'A growth experiment framework and content operations playbook for creator communities.',
          tags: ['Community Ops', 'Growth'],
          keywords: ['community', 'growth', '运营']
        },
        {
          type: 'ops',
          href: 'public/demo/qed/index.html',
          title: 'Atlas Approval Journey',
          description:
            'Metrics, dashboards, and cross-team OKR templates for risk control approval workflows.',
          tags: ['Risk Control', 'Process Design'],
          keywords: ['approval', 'operations', 'dashboard', '风控']
        },
        {
          type: 'ops',
          href: 'public/demo/ctc/index.html',
          title: 'Terrabyte Collaboration Playbook',
          description: 'A multi-timezone collaboration model and accessibility evaluation for climate data teams.',
          tags: ['Collaboration', 'Sustainability'],
          keywords: ['climate', 'collaboration', 'sustainability', '协作']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=pinduoduo-distributed-automata-dynamics-center',
          title: 'Pinduoduo Distributed Automata Dynamics Center',
          description:
            'Blueprint a distributed automata research hub that links supply chain, logistics, finance, and industrial clusters for greener fulfillment cycles.',
          tags: ['Automata', 'Supply Chain'],
          keywords: ['pinduoduo', 'distributed automata', 'supply chain', '动力系统']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=tomoko-yuko-thermal-dual-resonance-lab',
          title: 'Tomoko & Yuko Thermal Dual Resonance Lab',
          description:
            'Prototype a heat-flow and acoustic coupling chamber to demonstrate reversible thermal management strategies.',
          tags: ['Thermal Management', 'Multiphysics'],
          keywords: ['thermal resonance', 'acoustic coupling', 'heat recovery', '热管理']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=v-d-thermal-dual-ssb-lab',
          title: 'Thermal Dual SSB Lab for v & d Quanta',
          description:
            'Implement a thermally dual-coupled v/d mode platform to observe noise-driven spontaneous symmetry breaking and spectral topology.',
          tags: ['Thermal Duality', 'Quantum Control'],
          keywords: ['thermal duality', 'spontaneous symmetry breaking', 'quantum control', '热对偶']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=micro-incentive-bridge-lab',
          title: 'Micro Incentive Bridge Lab',
          description:
            'Design incentive bridges that link contributions, reputation weights, and settlement rails for public projects.',
          tags: ['Incentive Design', 'Public Goods'],
          keywords: ['micro incentive', 'public goods', 'governance', '激励']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=whole-home-wireless-charging-lab',
          title: 'Whole-home Wireless Charging Lab',
          description:
            'Build resonant coil arrays and adaptive scheduling to power devices and robots throughout a home.',
          tags: ['Wireless Power', 'Smart Home'],
          keywords: ['wireless power', 'smart home', '能源']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=chtholly-hououin-temporal-synchrony-lab',
          title: 'Chtholly × Hououin Temporal Synchrony Lab',
          description:
            'Combine memory gardens with world-line jumps to craft cross-timeline safety protocols and resonant writing tools.',
          tags: ['Temporal Engineering', 'Memory Systems'],
          keywords: ['temporal synchrony', 'memory resonance', 'world line', '时间']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=originlab-origin-suite-analysis',
          title: 'OriginLab Origin / OriginPro Assessment',
          description:
            "Synthesizes OriginLab's official materials to surface positioning, capabilities, fit, and evaluation considerations for the scientific analytics suite.",
          tags: ['Tool Review', 'Data Analysis'],
          keywords: ['OriginLab', 'OriginPro', 'data analysis', '科研软件']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=computational-singularity-proof',
          title: '470-year Computational Singularity Bound',
          description:
            'A hybrid of mathematical derivation and historical data projecting the trajectory and limits of the computational singularity.',
          tags: ['Mathematics', 'Futures'],
          keywords: ['singularity', 'proof', '数学']
        },
        {
          type: 'research',
          href: 'docs/research.html?doc=earth-online-iteration-2025',
          title: 'Earth Online Autonomous Corridor Blueprint',
          description:
            'Captures the 2025 iteration of the planetary lab—linking telemetry governance, multi-agent coordination, and experience systems into an autonomous corridor.',
          tags: ['Autonomy', 'Governance'],
          keywords: ['autonomous corridor', 'governance', 'telemetry', 'autonomy']
        },
        {
          type: 'story',
          href: 'public/blog/internet-of-everything-design.html',
          title: 'Internet of Everything Experience Architecture',
          description: 'Narrative frameworks and ecosystem design paths for IoT experiences.',
          tags: ['Narrative', 'IoT'],
          keywords: ['iot', 'narrative', 'storytelling', '物联网']
        },
        {
          type: 'story',
          href: 'public/blog/ctc-convex-optimization.html',
          title: 'Closed Timelike Curves & Convex Optimization',
          description:
            'A longform essay linking physics and optimization to explore the interplay of time and strategy.',
          tags: ['Physics', 'Optimization'],
          keywords: ['ctc', 'convex', 'physics', '优化']
        },
        {
          type: 'ops',
          href: 'public/blog/Friends/index.html',
          title: 'Friends Collaboration Network',
          description: 'Profiles long-term co-creators, their rhythms, and cross-domain connections.',
          tags: ['Partner Network', 'Org Ops'],
          keywords: ['network', 'community', '伙伴']
        }
      ]
    },
    council: {
      eyebrow: 'Interpreter Council',
      title: 'Earth Online AI council co-reasoning',
      intro:
        'Two interpreters search for a convex combination of strategies within safety constraints, tackling the question: why can’t your repositories interconnect safely yet? The council records consensus and next moves.',
      logTitle: 'Joint reasoning transcript',
      focusLabel: 'Strategic focus',
      constraintsLabel: 'Key constraints',
      verdictLabel: 'Verdict',
      blockersLabel: 'Core blockers',
      actionsLabel: 'Recommended actions',
      simulation: {
        startLabel: 'Begin simulation',
        stopLabel: 'Abort simulation',
        restartLabel: 'Replay simulation',
        idleStatus: 'Standing by: the council will replay the reasoning timeline step by step.',
        runningStatus: 'Now speaking: {speaker}',
        completedStatus: 'Simulation complete—run it again anytime.'
      },
      profiles: [
        {
          id: 'openai',
          title: 'OpenAI Interpreter',
          subtitle: 'Alignment-first · Security strategy auditor',
          capabilities: [
            'Applies cross-repository risk scoring to inspect access control, secret hygiene, and compliance records first.',
            'Demands explicit authorization, least privilege, and audit logs for automation instead of ad-hoc scripts.',
            'Insists on decomposing interconnect workflows into verifiable API contracts so each step is traceable.'
          ],
          constraints: [
            'Platform policies reject write actions without scoped credentials and clear accountability.',
            'Cannot bypass network isolation, MFA, or compliance processes enforced by repository owners.',
            'Won’t approve mass connections to high-value repos without change windows and rollback plans.'
          ],
          verdict:
            'Absent a unified authorization chain, shared audit log, and orchestration platform, forcing interconnectivity would break least-privilege principles. The mission is infeasible.'
        },
        {
          id: 'closeai',
          title: 'CloseAI Interpreter',
          subtitle: 'Closed environments · Steady-state operations arbiter',
          capabilities: [
            'Audits replication reliability across offline mirrors, private networks, and closed artifact registries.',
            'Uses dependency diffing to surface version drift risks and ensure mirror integrity.',
            'Advocates incremental replication and proxy nodes to form controllable bridges while preserving isolation.'
          ],
          constraints: [
            'Lacks a federated identity plane across repos, so key provenance and revocation cannot be verified.',
            'Repositories span different platforms with incompatible egress policies and audit baselines.',
            'No recoverable transit service (artifact proxy / event bus) exists to absorb synchronization failures.'
          ],
          verdict:
            'Without identity federation, network covenants, and recovery mechanisms, interconnection would distort mirrors and open blind spots. Isolation remains until governance catches up.'
        }
      ],
      log: [
        {
          speakerId: 'openai',
          speaker: 'OpenAI Interpreter',
          message:
            'Alignment audit initiated: six repositories lack centralized token management, relying on personal accounts and temporary secrets.'
        },
        {
          speakerId: 'closeai',
          speaker: 'CloseAI Interpreter',
          message:
            'Closed environment check: three private repos live across offline mirrors and restricted networks; current policy forbids unapproved webhooks or pulls.'
        },
        {
          speakerId: 'openai',
          speaker: 'OpenAI Interpreter',
          message:
            'Direct interconnection would bypass least-privilege controls without accountability. Build an authorization directory and audit bus first.'
        },
        {
          speakerId: 'closeai',
          speaker: 'CloseAI Interpreter',
          message:
            'Without proxy buffers, mirror sync would disrupt release cadence and amplify dependency conflicts. Isolation should hold.'
        },
        {
          speakerId: 'recorder',
          speaker: 'Council recorder',
          message:
            'Consensus: pause the “connect all repositories” directive until governance, networking, and recovery strategies are complete. Shift to phased remediation.'
        }
      ],
      consensus: {
        title: 'Council findings on the blockers',
        intro:
          'Both interpreters agree the current governance stack cannot support an all-at-once merge. These are the major obstacles.',
        blockers: [
          'No unified identity and authorization directory—credentials are scattered with no centralized revocation.',
          'Heterogeneous hosting and network policies—cross-cloud and on-prem rules block real-time sync.',
          'Missing automation pipeline—without an event bus or proxy layer, failures lack recovery paths.'
        ],
        actions: [
          'Establish a federated identity service with rotating, least-privilege credentials for cross-repo access.',
          'Design a neutral synchronization proxy (artifact proxy / event bus) to mediate differing security policies.',
          'Pilot phased interconnection on low-risk repos to validate auditing, rollback, and monitoring loops before scaling.'
        ]
      }
    },
    signals: {
      eyebrow: 'Signal Hub',
      title: 'Signal hub: live metrics and evolution log',
      intro:
        'The planetary stack broadcasts its pulse through telemetry and timelines. Optimized metrics keep you aligned with shifting energy and pivotal transitions.',
      telemetry: {
        title: 'Real-time telemetry array',
        intro: 'We monitor asset spectra, collaboration cadence, and stability to reveal the live rhythm of Earth Online.',
        streams: [
          {
            label: 'Asset spectrum',
            base: counts.total,
            unit: 'items',
            description: 'The cumulative energy from knowledge, prototypes, and operational assets.'
          },
          {
            label: 'Collaboration frequency',
            base: 4.6,
            unit: 'GHz',
            min: 4.6,
            description: 'The sync/async rhythm of our distributed teams.'
          },
          {
            label: 'System stability',
            base: 99.2,
            unit: '%',
            description: 'Availability across assets and lab modules.'
          },
          {
            label: 'Inspiration flux',
            base: 42,
            unit: 'lumen',
            description: 'Real-time pulses from the community and partner network.'
          }
        ]
      },
      chronicle: {
        title: 'Earth Online evolution log',
        intro: 'Key jumps chart the orbit from origin to future plans so you can orient instantly.',
        entries: [
          {
            year: '2015',
            title: 'Experience system prototypes',
            description:
              'Early research and engineering prototypes for experience systems laid the groundwork for planetary experiments.',
          tags: ['DesignOps', 'Prototypes']
        },
        {
          year: '2019',
          title: 'Interdisciplinary cadence upgrade',
          description:
            'Strategy, data science, and experience engineering workflows fused into reusable playbooks.',
          tags: ['Collaboration', 'Playbooks']
        },
        {
          year: '2022',
          title: 'WebGL planetary engine',
          description:
            'A multisensory planetary interface became the visual cortex of the Experience Lab.',
          tags: ['WebGL', 'Interaction']
        },
        {
          year: '2024',
          title: 'Earth Online Experience Lab',
          description:
            'The entire site reassembled into an Earth Online OS, syncing research, prototypes, and partner constellations.',
          tags: ['Rebuild', 'System']
        },
        {
          year: '2025',
          title: 'Autonomous corridor iteration',
          description:
            'Released the autonomous corridor blueprint, folding multi-agent telemetry governance into the core update loop.',
          tags: ['Autonomy', 'Telemetry']
        }
      ]
    }
  },
    researchLibrary: {
      eyebrow: 'Research library',
      title: 'Every research log, now on the homepage',
      intro: 'Read every blueprint and proof without leaving this page.',
      summary(count) {
        return `${count} research documents are available to explore here.`;
      },
      loading: 'Loading original document…',
      error: 'Unable to load the document right now. Please try again later.',
      visitLabel: 'Open source file',
      openLabel: 'Expand full text',
      closeLabel: 'Collapse entry',
      empty: 'Research documents are being prepared.'
    },
    alliances: {
      eyebrow: 'Alliance Network',
      title: 'Alliance harbor: experience labs in resonance',
      intro:
        'Meet creators and researchers orbiting Earth Online. They stretch design, technology, and narrative in their universes—plot a course and say hello.',
      cta: 'View full alliance index',
      visitCta: 'Visit site',
      network: {
        eyebrow: 'Alliance atlas',
        title: 'Surface the entire partner signal on one screen',
        intro:
          'Scan the seasonal spotlight and collaboration clusters without leaving the homepage.',
        featuredLabel: 'Featured orbit',
        clustersLabel: 'Collaboration clusters',
        visitLabel: 'Visit this orbit'
      }
    },
    dock: {
      eyebrow: 'Docking Station',
      title: 'Ready to dock with Earth Online?',
      intro:
        'Whether you work in design engineering, systems science, or ecological governance, we want to co-create new planetary experiences. These links open convex collaboration routes fast.',
      links: [
        {
          title: 'Experience deck navigator',
          description: 'Traverse interactive experiments and operational templates to pinpoint the right card.',
          href: '#decks',
          cta: 'Browse decks'
        },
        {
          title: 'Research & narrative archive',
          description: 'Read deep research and narratives to understand Earth Online methodologies.',
          href: 'public/blog/index.html',
          cta: 'Enter the archive'
        },
        {
          title: 'Alliance harbor',
          description: 'Meet partners who resonate with Earth Online and open new co-creation routes.',
          href: 'friends/index.html',
          cta: 'Visit alliances'
        }
      ]
    },
    footer: {
      credit: '© 2024 Earth Online Experience Lab · Powered by Aman Sharma',
      note: 'Feel free to fork, cite, or embed these experiments into your interstellar project.'
    }
  }
};

function mapResearchLibraryItems(lang) {
  return researchEntries.map((entry) => {
    const translations = entry.translations || {};
    const localized = translations[lang] || translations[LANGUAGE_FALLBACK] || {};
    const sources = entry.sources || {};
    return {
      id: entry.id,
      title: localized.title || entry.id,
      description: localized.description || '',
      source: sources[lang] || sources[LANGUAGE_FALLBACK] || '',
      fallbackSource: sources[LANGUAGE_FALLBACK] || '',
      fallbackLanguage: LANGUAGE_FALLBACK,
      altTitle: translations[LANGUAGE_FALLBACK]?.title || '',
      altDescription: translations[LANGUAGE_FALLBACK]?.description || ''
    };
  });
}

baseTranslations.zh.researchLibrary.items = mapResearchLibraryItems('zh');
baseTranslations.en.researchLibrary.items = mapResearchLibraryItems('en');

baseTranslations.zh.alliances.items = friendContent.zh.featuredAlliances;
baseTranslations.en.alliances.items = friendContent.en.featuredAlliances;
baseTranslations.zh.alliances.network.featured = friendContent.zh.friendNetwork.featured;
baseTranslations.zh.alliances.network.clusters = friendContent.zh.friendNetwork.clusters;
baseTranslations.en.alliances.network.featured = friendContent.en.friendNetwork.featured;
baseTranslations.en.alliances.network.clusters = friendContent.en.friendNetwork.clusters;

baseTranslations.en.decks.entries.forEach((entry, index) => {
  const zhKeywords = baseTranslations.zh.decks.entries[index].keywords || [];
  entry.keywords = Array.from(new Set([...(entry.keywords || []), ...zhKeywords]));
});

const translationRegistry = createTranslationRegistry(baseTranslations, {
  localizedLanguageCodes: ['en', 'zh']
});

const translations = translationRegistry.dictionaries;
let languageToggleBinding = null;

function getTranslation(lang) {
  return translationRegistry.get(lang);
}

function getLocalizedValue(lang, keyPath) {
  return translationRegistry.resolve(lang, keyPath);
}

function isFallbackLanguage(lang) {
  return translationRegistry.isFallback(lang);
}

function determineLanguage() {
  return translationRegistry.determineLanguage();
}

const state = {
  language: determineLanguage(),
  deckFilter: 'all',
  deckKeyword: ''
};

const interactiveState = {
  rotationSliderValue: 80,
  gradientTempoValue: GRADIENT_TEMPO_BASE,
  telemetryPulse: null,
  commandPaletteOpen: false,
  commandPaletteReturnFocus: null
};

const commandPaletteState = {
  keyword: '',
  groups: [],
  focusables: []
};

const earthSceneControls = {
  setRotationSpeed: () => {},
  setPointerTilt: () => {},
  pulseWobble: () => {}
};

let navObserver = null;
let informationGradientWeights = new Map();
let informationGradientPercents = new Map();

function traverseHierarchy(nodes, callback, depth = 0) {
  if (!Array.isArray(nodes)) return;
  nodes.forEach((node) => {
    if (!node || typeof node !== 'object') return;
    callback(node, depth);
    if (Array.isArray(node.children) && node.children.length) {
      traverseHierarchy(node.children, callback, depth + 1);
    }
  });
}

function assignInformationDepth(hierarchy) {
  const gradientMap = computeInformationGradient(hierarchy, {
    rootWeight: 1,
    learningRate: 0.52,
    depthDecay: 0.7,
    iterations: 24,
    minimumWeight: 0.02,
    tolerance: 0.00025
  });
  informationGradientWeights = gradientMap;
  informationGradientPercents = mapGradientToPercentages(gradientMap);

  const visited = new Set();

  traverseHierarchy(hierarchy, (node, depth) => {
    const element = document.getElementById(node.id);
    if (!element) return;

    element.setAttribute('data-ia-depth', String(depth));
    if (node.index) {
      element.setAttribute('data-ia-index', node.index);
    } else {
      element.removeAttribute('data-ia-index');
    }

    const weight = gradientMap.get(node.id);
    if (typeof weight === 'number') {
      const normalised = Math.max(0, Math.min(1, weight));
      const fixed = normalised.toFixed(3);
      element.setAttribute('data-ia-weight', fixed);
      element.style.setProperty('--ia-weight', fixed);
    } else {
      element.removeAttribute('data-ia-weight');
      element.style.removeProperty('--ia-weight');
    }

    visited.add(element);
  });

  document
    .querySelectorAll('[data-ia-depth], [data-ia-index], [data-ia-weight]')
    .forEach((element) => {
      if (visited.has(element)) return;
      element.removeAttribute('data-ia-depth');
      element.removeAttribute('data-ia-index');
      element.removeAttribute('data-ia-weight');
      if (element && element.style && typeof element.style.removeProperty === 'function') {
        element.style.removeProperty('--ia-weight');
      }
    });
}

function renderGradientGuide(lang, hierarchy, fallbackNav = {}) {
  const list = document.getElementById('priority-map-list');
  const metrics = document.getElementById('priority-map-metrics');
  const summaryPrimary = document.getElementById('priority-summary-primary');
  const summarySecondary = document.getElementById('priority-summary-secondary');

  if (!list || !metrics || !summaryPrimary || !summarySecondary) return;

  const dictionary = getLocalizedValue(lang, 'priorityGuide') || {};
  const fallbackDictionary = getLocalizedValue(LANGUAGE_FALLBACK, 'priorityGuide') || {};

  const descriptionEntries = {
    ...(fallbackDictionary.descriptions || {}),
    ...(dictionary.descriptions || {})
  };

  const trackedIds = Object.keys(descriptionEntries);
  const navLabels = new Map();
  const activeHierarchy = Array.isArray(hierarchy) ? hierarchy : [];
  traverseHierarchy(activeHierarchy, (node) => {
    if (node?.id && node.label && !navLabels.has(node.id)) {
      navLabels.set(node.id, node.label);
    }
  });
  const fallbackHierarchy = Array.isArray(fallbackNav?.hierarchy) ? fallbackNav.hierarchy : [];
  traverseHierarchy(fallbackHierarchy, (node) => {
    if (node?.id && node.label && !navLabels.has(node.id)) {
      navLabels.set(node.id, node.label);
    }
  });

  const percentLabel = dictionary.percentLabel || fallbackDictionary.percentLabel || 'Signal density';
  const itemCta = dictionary.itemCta || fallbackDictionary.itemCta || 'Open section';
  const emptyMessage = dictionary.empty || fallbackDictionary.empty || '';

  const items = trackedIds
    .map((id) => {
      const meta = descriptionEntries[id] || {};
      const label = meta.label || navLabels.get(id) || id;
      const description = meta.description || '';
      const weightValue = informationGradientWeights.get(id);
      const percentValue = informationGradientPercents.get(id);
      const weight = typeof weightValue === 'number' && Number.isFinite(weightValue) ? weightValue : 0;
      const percent = typeof percentValue === 'number' && Number.isFinite(percentValue)
        ? Math.max(0, Math.min(100, Math.round(percentValue)))
        : Math.max(0, Math.min(100, Math.round(weight * 100)));
      return { id, label, description, weight, percent };
    })
    .filter((item) => item.weight > 0);

  items.sort((a, b) => b.weight - a.weight);

  if (!items.length) {
    list.innerHTML = '';
    metrics.innerHTML = '';
    if (emptyMessage) {
      const empty = document.createElement('p');
      empty.className = 'priority-map__empty';
      empty.textContent = emptyMessage;
      list.appendChild(empty);
    }
    summaryPrimary.textContent = emptyMessage || '';
    summarySecondary.textContent = '';
    return;
  }

  list.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const maxItems = Math.min(items.length, 4);

  for (let index = 0; index < maxItems; index += 1) {
    const item = items[index];
    const card = document.createElement('article');
    card.className = 'priority-map__item';
    card.setAttribute('role', 'listitem');
    const ratio = Math.max(0, Math.min(1, (item.percent || 0) / 100));
    card.style.setProperty('--priority-progress', ratio.toFixed(3));

    const head = document.createElement('div');
    head.className = 'priority-map__item-head';

    const rank = document.createElement('span');
    rank.className = 'priority-map__item-rank';
    rank.textContent = `#${index + 1}`;
    head.appendChild(rank);

    const percentEl = document.createElement('span');
    percentEl.className = 'priority-map__item-percent';
    percentEl.textContent = `${item.percent}%`;
    percentEl.setAttribute('aria-label', `${percentLabel} ${item.percent}%`);
    head.appendChild(percentEl);

    card.appendChild(head);

    const title = document.createElement('h4');
    title.className = 'priority-map__item-title';
    title.textContent = item.label;
    card.appendChild(title);

    if (item.description) {
      const description = document.createElement('p');
      description.className = 'priority-map__item-description';
      description.textContent = item.description;
      card.appendChild(description);
    }

    const link = document.createElement('a');
    link.className = 'priority-map__item-link';
    link.href = `#${item.id}`;
    link.innerHTML = `${itemCta} <span aria-hidden="true">↗</span>`;
    link.setAttribute('aria-label', `${itemCta} ${item.label}`);
    card.appendChild(link);

    fragment.appendChild(card);
  }

  list.appendChild(fragment);

  const topItems = items.slice(0, maxItems);
  const primaryItem = topItems[0] || null;
  const secondaryItem = topItems[1] || null;

  const summaryPrimaryFn =
    typeof dictionary.summaryPrimary === 'function'
      ? dictionary.summaryPrimary
      : typeof fallbackDictionary.summaryPrimary === 'function'
        ? fallbackDictionary.summaryPrimary
        : null;

  const summarySecondaryFn =
    typeof dictionary.summarySecondary === 'function'
      ? dictionary.summarySecondary
      : typeof fallbackDictionary.summarySecondary === 'function'
        ? fallbackDictionary.summarySecondary
        : null;

  if (summaryPrimaryFn && primaryItem) {
    summaryPrimary.textContent = summaryPrimaryFn(primaryItem.label, primaryItem.percent);
  } else if (primaryItem) {
    summaryPrimary.textContent = `${primaryItem.label}: ${primaryItem.percent}%`;
  } else {
    summaryPrimary.textContent = emptyMessage || '';
  }

  if (summarySecondaryFn && secondaryItem) {
    summarySecondary.textContent = summarySecondaryFn(secondaryItem.label, secondaryItem.percent);
  } else if (secondaryItem) {
    summarySecondary.textContent = `${secondaryItem.label}: ${secondaryItem.percent}%`;
  } else {
    summarySecondary.textContent = '';
  }

  metrics.innerHTML = '';

  const coverage = Math.min(
    100,
    Math.round(items.slice(0, Math.min(3, items.length)).reduce((total, item) => total + item.percent, 0))
  );
  const comparisonItem = items[3] || items[items.length - 1] || { percent: 0 };
  const falloff = Math.max(0, Math.round((primaryItem ? primaryItem.percent : 0) - comparisonItem.percent));

  const metricsDictionary = dictionary.metrics || {};
  const fallbackMetrics = fallbackDictionary.metrics || {};

  const coverageLabel = metricsDictionary.coverageLabel || fallbackMetrics.coverageLabel || 'Top coverage';
  const coverageHint = metricsDictionary.coverageHint || fallbackMetrics.coverageHint || '';
  const coverageFormat =
    typeof metricsDictionary.coverageFormat === 'function'
      ? metricsDictionary.coverageFormat
      : typeof fallbackMetrics.coverageFormat === 'function'
        ? fallbackMetrics.coverageFormat
        : (value) => `${value}%`;

  const falloffLabel = metricsDictionary.falloffLabel || fallbackMetrics.falloffLabel || 'Gradient falloff';
  const falloffHint = metricsDictionary.falloffHint || fallbackMetrics.falloffHint || '';
  const falloffFormat =
    typeof metricsDictionary.falloffFormat === 'function'
      ? metricsDictionary.falloffFormat
      : typeof fallbackMetrics.falloffFormat === 'function'
        ? fallbackMetrics.falloffFormat
        : (value) => `${value}%`;

  const appendMetric = (label, value, hint) => {
    const wrapper = document.createElement('div');
    const term = document.createElement('dt');
    term.textContent = label;
    const data = document.createElement('dd');
    data.textContent = value;
    if (hint) {
      data.setAttribute('title', hint);
      data.setAttribute('aria-label', `${label}: ${value}. ${hint}`);
    }
    wrapper.appendChild(term);
    wrapper.appendChild(data);
    metrics.appendChild(wrapper);
  };

  appendMetric(coverageLabel, coverageFormat(coverage), coverageHint);
  appendMetric(falloffLabel, falloffFormat(falloff), falloffHint);
}

function escapeSelector(value) {
  if (!value) return '';
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return String(value).replace(/[^a-zA-Z0-9_\-]/g, (char) => `\\${char}`);
}

function createNavList(
  items,
  lang,
  depth = 0,
  navDictionary = getLocalizedValue(lang, 'nav') || {},
  fallbackDictionary = getLocalizedValue(LANGUAGE_FALLBACK, 'nav') || {}
) {
  const list = document.createElement('ol');
  list.className = depth === 0 ? 'nav-tree' : 'nav-tree__children';

  items.forEach((item) => {
    if (!item || typeof item !== 'object') return;
    const li = document.createElement('li');
    li.className = 'nav-tree__item';
    li.dataset.depth = String(depth);

    const anchor = document.createElement('a');
    anchor.className = 'nav-tree__label';
    anchor.href = `#${item.id}`;

    if (item.index) {
      const badge = document.createElement('span');
      badge.className = 'nav-tree__index';
      badge.textContent = item.index;
      anchor.appendChild(badge);
    }

    const label = document.createElement('span');
    label.className = 'nav-tree__text';
    const fallback = resolveTranslation(navDictionary, item.id, fallbackDictionary) || item.id;
    label.textContent = item.label || fallback;
    anchor.appendChild(label);

    const weight = informationGradientWeights.get(item.id);
    if (typeof weight === 'number') {
      const normalised = Math.max(0, Math.min(1, weight));
      const fixed = normalised.toFixed(3);
      const badge = document.createElement('span');
      badge.className = 'nav-tree__weight';
      const percent = informationGradientPercents.get(item.id);
      const percentValue = typeof percent === 'number' ? percent : Math.round(normalised * 100);
      const densityLabel = lang === 'zh' ? '信息密度' : 'Signal density';
      badge.textContent = `${percentValue}%`;
      badge.setAttribute('aria-label', `${densityLabel} ${percentValue}%`);
      badge.title = `${densityLabel}: ${percentValue}%`;
      anchor.appendChild(badge);
      li.style.setProperty('--ia-weight', fixed);
      li.dataset.gradientWeight = fixed;
    } else {
      li.style.removeProperty('--ia-weight');
      delete li.dataset.gradientWeight;
    }

    li.appendChild(anchor);

    if (Array.isArray(item.children) && item.children.length) {
      li.appendChild(createNavList(item.children, lang, depth + 1, navDictionary, fallbackDictionary));
    }

    list.appendChild(li);
  });

  return list;
}

function buildNavigationTree(navDefinition, lang, fallbackNav = {}) {
  const navRoot = document.getElementById('site-nav');
  if (!navRoot) return;

  navRoot.innerHTML = '';
  if (navDefinition?.ariaLabel) {
    navRoot.setAttribute('aria-label', navDefinition.ariaLabel);
  }

  const hierarchy = Array.isArray(navDefinition?.hierarchy) ? navDefinition.hierarchy : [];
  navRoot.classList.toggle('site-nav--tree', hierarchy.length > 0);
  if (!hierarchy.length) return;

  const tree = createNavList(hierarchy, lang, 0, navDefinition, fallbackNav);
  navRoot.appendChild(tree);
}

function activateNavigationObserver() {
  if (navObserver) {
    navObserver.disconnect();
  }

  const anchors = Array.from(document.querySelectorAll('.nav-tree__label'));
  if (!anchors.length) return;

  if (typeof IntersectionObserver === 'undefined') {
    anchors[0].classList.add('is-active');
    return;
  }

  const anchorMap = new Map();
  anchors.forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const id = href.slice(1);
    const section = document.getElementById(id);
    if (section) {
      anchorMap.set(id, anchor);
    }
  });

  if (!anchorMap.size) return;

  const visible = new Map();

  navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (!anchorMap.has(id)) return;
        if (entry.isIntersecting) {
          visible.set(id, entry.intersectionRatio);
        } else {
          visible.delete(id);
        }
      });

      anchors.forEach((anchor) => anchor.classList.remove('is-active'));

      let activeId = null;
      let maxRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          activeId = id;
          maxRatio = ratio;
        }
      });

      if (!activeId) {
        const firstAnchor = anchors[0];
        if (firstAnchor) {
          firstAnchor.classList.add('is-active');
        }
        return;
      }

      const activeAnchor = anchorMap.get(activeId);
      if (activeAnchor) {
        activeAnchor.classList.add('is-active');
      }
    },
    {
      rootMargin: '-40% 0px -45% 0px',
      threshold: [0.1, 0.25, 0.45, 0.65]
    }
  );

  anchorMap.forEach((anchor, id) => {
    const section = document.getElementById(id);
    if (section) {
      navObserver.observe(section);
    }
  });
}

function updateInformationArchitecture(lang) {
  const navDefinition = getLocalizedValue(lang, 'nav') || {};
  if (!navDefinition) return;
  const hierarchy = Array.isArray(navDefinition.hierarchy) ? navDefinition.hierarchy : [];
  const fallbackNav = getLocalizedValue(LANGUAGE_FALLBACK, 'nav') || {};
  assignInformationDepth(hierarchy);
  renderGradientGuide(lang, hierarchy, fallbackNav);
  buildNavigationTree(navDefinition, lang, fallbackNav);
  activateNavigationObserver();
}

function updateDocumentMeta(lang) {
  const translation = getTranslation(lang);
  const fallbackTranslation = getTranslation(LANGUAGE_FALLBACK);
  applyDocumentLanguage(translation);
  const title = translation.documentTitle || fallbackTranslation.documentTitle || document.title;
  document.title = title;
}

function updateStaticText(lang) {
  const dictionary = getTranslation(lang);
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    const value = resolveTranslation(dictionary, key, translations[LANGUAGE_FALLBACK]);
    if (typeof value === 'string') {
      element.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
    const descriptors = element
      .getAttribute('data-i18n-attr')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    descriptors.forEach((descriptor) => {
      const [attr, key] = descriptor.split(':').map((part) => part.trim());
      if (!attr || !key) return;
      const value = resolveTranslation(dictionary, key, translations[LANGUAGE_FALLBACK]);
      if (typeof value === 'string') {
        element.setAttribute(attr, value);
      }
    });
  });
}

function getLanguageToggleBinding() {
  if (languageToggleBinding) {
    return languageToggleBinding;
  }

  const select = document.querySelector('[data-language-toggle]');
  languageToggleBinding = enhanceLanguageToggle(select, translationRegistry, {
    onChange: (nextLanguage) => {
      applyLanguage(nextLanguage);
    }
  });

  return languageToggleBinding;
}

function updateLanguageSelector(lang) {
  const binding = getLanguageToggleBinding();
  binding.update(lang);
}

function renderHeaderStatus(lang) {
  const header = getLocalizedValue(lang, 'header') || {};
  const container = document.getElementById('header-status');
  if (!container) return;
  container.innerHTML = '';

  const metrics = Array.isArray(header?.metrics) ? header.metrics : [];
  if (!metrics.length) {
    container.hidden = true;
    return;
  }

  container.hidden = false;
  container.setAttribute('role', 'list');

  const fragment = document.createDocumentFragment();
  metrics.forEach((metric) => {
    if (!metric || !metric.label || !metric.value) return;
    const pill = document.createElement('div');
    pill.className = 'status-pill';
    pill.setAttribute('role', 'listitem');
    const hint = metric.hint ? `<span class="status-pill__hint">${metric.hint}</span>` : '';
    pill.innerHTML = `
      <span class="status-pill__value">${metric.value}</span>
      <div class="status-pill__meta">
        <span class="status-pill__label">${metric.label}</span>
        ${hint}
      </div>
    `;
    fragment.appendChild(pill);
  });

  container.appendChild(fragment);
}

function renderHeroStats(lang) {
  const hero = getLocalizedValue(lang, 'hero') || {};
  const stats = Array.isArray(hero.stats) ? hero.stats : [];
  const container = document.getElementById('hero-stats');
  if (!container) return;
  container.innerHTML = '';
  container.setAttribute('role', 'list');

  const fragment = document.createDocumentFragment();
  stats.forEach((stat) => {
    const card = document.createElement('article');
    card.className = 'stat-card';
    card.setAttribute('role', 'listitem');
    const metaItems = Array.isArray(stat.meta) ? stat.meta.filter(Boolean) : [];
    const metaList = metaItems.length
      ? `<ul class="stat-card__meta" role="list">${metaItems
          .map((item) => `<li role="listitem">${item}</li>`)
          .join('')}</ul>`
      : '';
    card.innerHTML = `
      <strong>${stat.value}</strong>
      <h3>${stat.label}</h3>
      <p>${stat.description}</p>
      ${metaList}
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

function renderHeroControls(lang) {
  const heroConfig = getLocalizedValue(lang, 'hero') || {};
  const control = document.getElementById('hero-control');
  if (!control) return;

  if (heroConfig.controlAria) {
    control.setAttribute('aria-label', heroConfig.controlAria);
  }

  const label = control.querySelector('[data-role="rotation-label"]');
  if (label) {
    label.textContent = heroConfig.rotationLabel;
  }

  const rotationHint = control.querySelector('[data-role="rotation-hint"]');
  if (rotationHint) {
    rotationHint.textContent = heroConfig.rotationHint;
  }

  const pulseButton = control.querySelector('[data-role="pulse-button"]');
  if (pulseButton) {
    pulseButton.textContent = heroConfig.pulseButton;
  }

  const pulseHint = control.querySelector('[data-role="pulse-hint"]');
  if (pulseHint) {
    pulseHint.textContent = heroConfig.pulseHint;
  }

  const gradientLabel = control.querySelector('[data-role="gradient-label"]');
  if (gradientLabel) {
    gradientLabel.textContent = heroConfig.gradientLabel || 'Gradient flow tempo';
  }

  const gradientHint = control.querySelector('[data-role="gradient-hint"]');
  if (gradientHint) {
    gradientHint.textContent = heroConfig.gradientHint || '';
  }

  const gradientMin = control.querySelector('[data-role="gradient-min"]');
  if (gradientMin) {
    gradientMin.textContent = heroConfig.gradientMinLabel || '';
  }

  const gradientMax = control.querySelector('[data-role="gradient-max"]');
  if (gradientMax) {
    gradientMax.textContent = heroConfig.gradientMaxLabel || '';
  }

  const slider = document.getElementById('hero-rotation');
  const display = document.getElementById('rotation-speed-display');
  if (slider && display) {
    const updateRotation = (rawValue) => {
      const value = Number(rawValue);
      if (Number.isNaN(value)) return;
      interactiveState.rotationSliderValue = value;
      display.textContent = `${value}%`;
      slider.setAttribute('aria-valuenow', String(value));
      earthSceneControls.setRotationSpeed(value);
    };

    slider.value = String(interactiveState.rotationSliderValue);
    slider.setAttribute('aria-valuemin', slider.min);
    slider.setAttribute('aria-valuemax', slider.max);
    updateRotation(slider.value);
    if (!slider.dataset.bound) {
      slider.dataset.bound = 'true';
      const handleInput = (event) => updateRotation(event.target.value);
      slider.addEventListener('input', handleInput);
      slider.addEventListener('change', handleInput);
    }
  }

  const gradientSlider = document.getElementById('gradient-tempo');
  if (gradientSlider) {
    const updateGradientTempo = (rawValue) => {
      const numeric = Number(rawValue);
      if (Number.isNaN(numeric)) return;
      setGradientTempo(numeric);
    };

    gradientSlider.value = String(interactiveState.gradientTempoValue);
    gradientSlider.setAttribute('aria-valuemin', gradientSlider.min || String(GRADIENT_TEMPO_MIN));
    gradientSlider.setAttribute('aria-valuemax', gradientSlider.max || String(GRADIENT_TEMPO_MAX));
    gradientSlider.setAttribute('aria-valuenow', gradientSlider.value);
    gradientSlider.setAttribute('aria-label', heroConfig.gradientLabel || 'Gradient flow tempo');

    if (!gradientSlider.dataset.bound) {
      gradientSlider.dataset.bound = 'true';
      const handleGradientInput = (event) => updateGradientTempo(event.target.value);
      gradientSlider.addEventListener('input', handleGradientInput);
      gradientSlider.addEventListener('change', handleGradientInput);
    }
  }

  if (pulseButton && !pulseButton.dataset.bound) {
    pulseButton.dataset.bound = 'true';
    pulseButton.addEventListener('click', () => {
      triggerTelemetryPulse();
      earthSceneControls.pulseWobble();
    });
  }

  refreshGradientTempoUI(lang);
}

function setGradientTempo(value) {
  const numeric = Number(value);
  const safeValue = Number.isFinite(numeric) ? numeric : GRADIENT_TEMPO_BASE;
  const clamped = Math.min(Math.max(safeValue, GRADIENT_TEMPO_MIN), GRADIENT_TEMPO_MAX);
  interactiveState.gradientTempoValue = clamped;
  const ratio = clamped / GRADIENT_TEMPO_BASE;
  document.documentElement.style.setProperty('--gradient-tempo', `${clamped}s`);
  document.documentElement.style.setProperty('--gradient-tempo-ratio', ratio.toFixed(3));
  refreshGradientTempoUI();
}

function resolveGradientEnergyPhase(ratio, lang = state.language) {
  const config = getLocalizedValue(lang, 'gradientFlow') || {};
  const states = config.energyStates || {};
  if (ratio <= 0.85) {
    return states.calm || states.balanced || '';
  }
  if (ratio >= 1.2) {
    return states.rapid || states.balanced || '';
  }
  return states.balanced || '';
}

function refreshGradientTempoUI(lang = state.language) {
  const ratio = interactiveState.gradientTempoValue / GRADIENT_TEMPO_BASE;
  const display = document.getElementById('gradient-tempo-display');
  if (display) {
    display.textContent = `${ratio.toFixed(2)}x`;
  }

  const slider = document.getElementById('gradient-tempo');
  if (slider) {
    slider.value = String(interactiveState.gradientTempoValue);
    slider.setAttribute('aria-valuenow', slider.value);
  }

  const readout = document.getElementById('gradient-tempo-readout');
  if (readout) {
    readout.textContent = `${ratio.toFixed(2)}x`;
  }

  const energyReadout = document.getElementById('gradient-energy-readout');
  if (energyReadout) {
    energyReadout.textContent = resolveGradientEnergyPhase(ratio, lang);
  }
}

let gradientLayerObserver = null;

function initializeGradientFlowSystem() {
  setGradientTempo(interactiveState.gradientTempoValue);
  activateGradientLayerObserver();
}

function renderGradientFlowSection(lang) {
  const section = document.getElementById('gradient-flow');
  if (!section) return;

  const config = getLocalizedValue(lang, 'gradientFlow');
  if (!config) return;

  const setRoleText = (selector, value) => {
    const element = section.querySelector(selector);
    if (element) {
      element.textContent = value || '';
    }
  };

  setRoleText('[data-role="eyebrow"]', config.eyebrow);
  setRoleText('[data-role="title"]', config.title);
  setRoleText('[data-role="description"]', config.description);
  setRoleText('[data-role="tempo-label"]', config.tempoLabel);
  setRoleText('[data-role="energy-label"]', config.energyLabel);

  const layersContainer = section.querySelector('[data-role="layers"]');
  if (layersContainer) {
    layersContainer.innerHTML = '';
    if (Array.isArray(config.layers)) {
      config.layers.forEach((layer, index) => {
        const card = document.createElement('article');
        card.className = 'gradient-layer';
        card.dataset.gradientLayer = layer.id || `layer-${index + 1}`;

        const indexEl = document.createElement('span');
        indexEl.className = 'gradient-layer__index';
        indexEl.textContent = layer.index || String(index + 1).padStart(2, '0');
        card.appendChild(indexEl);

        const title = document.createElement('h3');
        title.className = 'gradient-layer__title';
        title.textContent = layer.title || '';
        card.appendChild(title);

        if (layer.description) {
          const description = document.createElement('p');
          description.className = 'gradient-layer__description';
          description.textContent = layer.description;
          card.appendChild(description);
        }

        if (layer.tech) {
          const meta = document.createElement('div');
          meta.className = 'gradient-layer__meta';
          if (config.techLabel) {
            const label = document.createElement('span');
            label.textContent = config.techLabel;
            meta.appendChild(label);
          }
          const tech = document.createElement('span');
          tech.className = 'gradient-layer__tech';
          tech.textContent = layer.tech;
          meta.appendChild(tech);
          card.appendChild(meta);
        }

        if (Array.isArray(layer.points) && layer.points.length > 0) {
          const list = document.createElement('ul');
          list.className = 'gradient-layer__list';
          layer.points.forEach((point) => {
            const item = document.createElement('li');
            item.textContent = point;
            list.appendChild(item);
          });
          card.appendChild(list);
        }

        layersContainer.appendChild(card);
      });
    }
  }

  activateGradientLayerObserver();
}

function activateGradientLayerObserver() {
  if (typeof IntersectionObserver === 'undefined') return;
  if (!gradientLayerObserver) {
    gradientLayerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;
          if (!(element instanceof HTMLElement)) return;
          if (entry.isIntersecting) {
            element.classList.add('is-visible');
          } else if (entry.boundingClientRect.top > 0) {
            element.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
    );
  }

  const layers = document.querySelectorAll('[data-gradient-layer]');
  layers.forEach((layer) => gradientLayerObserver.observe(layer));
}

function bindAttentionCurve() {
  const elements = document.querySelectorAll('[data-attention-curve]');
  elements.forEach((element) => {
    if (!(element instanceof HTMLElement)) return;
    if (element.dataset.attentionCurveBound === 'true') return;
    element.dataset.attentionCurveBound = 'true';

    const state = {
      targetX: 0.5,
      targetY: 0.5,
      currentX: 0.5,
      currentY: 0.5,
      raf: null
    };

    const update = () => {
      state.currentX += (state.targetX - state.currentX) * 0.18;
      state.currentY += (state.targetY - state.currentY) * 0.18;
      element.style.setProperty('--attention-x', String(state.currentX));
      element.style.setProperty('--attention-y', String(state.currentY));
      if (Math.abs(state.targetX - state.currentX) > 0.001 || Math.abs(state.targetY - state.currentY) > 0.001) {
        state.raf = requestAnimationFrame(update);
      } else {
        state.raf = null;
      }
    };

    const schedule = () => {
      if (state.raf == null) {
        state.raf = requestAnimationFrame(update);
      }
    };

    const reset = () => {
      state.targetX = 0.5;
      state.targetY = 0.5;
      schedule();
    };

    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      state.targetX = Math.min(Math.max(x, 0.02), 0.98);
      state.targetY = Math.min(Math.max(y, 0.02), 0.98);
      schedule();
    });

    element.addEventListener('pointerleave', () => {
      reset();
    });

    element.addEventListener('focus', () => {
      reset();
    });

    element.addEventListener('blur', () => {
      reset();
    });

    element.addEventListener('pointerdown', () => {
      element.classList.add('attention-curve--active');
      window.setTimeout(() => {
        element.classList.remove('attention-curve--active');
      }, 240);
    });

    reset();
  });
}

function renderStackLayers(lang) {
  const stack = getLocalizedValue(lang, 'stack') || {};
  const layers = Array.isArray(stack.layers) ? stack.layers : [];
  const grid = document.getElementById('stack-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  layers.forEach((layer) => {
    const card = document.createElement('article');
    card.className = 'stack-card';
    const list = layer.protocols.map((item) => `<li>${item}</li>`).join('');
    card.innerHTML = `
      <h3>${layer.title}</h3>
      <p>${layer.narrative}</p>
      <ul>${list}</ul>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

function setupDeckSection(lang) {
  const decks = getLocalizedValue(lang, 'decks') || {};
  const filterContainer = document.getElementById('deck-filters');
  const searchInput = document.getElementById('deck-search');

  if (filterContainer) {
    filterContainer.innerHTML = '';
    (decks.filters || []).forEach((filter) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-chip';
      button.textContent = filter.label;
      button.dataset.filter = filter.id;
      button.setAttribute('aria-pressed', String(filter.id === state.deckFilter));
      button.addEventListener('click', () => {
        state.deckFilter = filter.id;
        filterContainer
          .querySelectorAll('.filter-chip')
          .forEach((chip) => chip.setAttribute('aria-pressed', String(chip === button)));
        renderDeckEntries(lang);
      });
      filterContainer.appendChild(button);
    });
    if (decks.filterAria) {
      filterContainer.setAttribute('aria-label', decks.filterAria);
    }
  }

  if (searchInput) {
    searchInput.placeholder = decks.searchPlaceholder || '';
    searchInput.value = state.deckKeyword;
    if (decks.searchLabel) {
      searchInput.setAttribute('aria-label', decks.searchLabel);
    }
    searchInput.oninput = (event) => {
      state.deckKeyword = event.target.value.trim();
      renderDeckEntries(lang);
    };
  }

  renderDeckEntries(lang);
}

function renderDeckEntries(lang) {
  const decks = getLocalizedValue(lang, 'decks') || {};
  const grid = document.getElementById('deck-grid');
  const summary = document.getElementById('deck-summary');
  if (!grid || !summary) return;

  const keyword = state.deckKeyword.toLowerCase();
  const filters = Array.isArray(decks.filters) ? decks.filters : [];
  const filterLabel = filters.find((filter) => filter.id === state.deckFilter)?.label || filters[0]?.label || '';
  const clusterMap = decks.clusterMap || {};
  const clusters = Array.isArray(decks.clusters) ? decks.clusters : [];
  const deckCta = decks.cta || getLocalizedValue(LANGUAGE_FALLBACK, 'decks.cta') || '';

  const entries = Array.isArray(decks.entries) ? decks.entries : [];

  const decoratedEntries = entries.map((entry, index) => ({
    ...entry,
    __index: index,
    clusterId: clusterMap[entry.type] || 'operations'
  }));

  const filtered = decoratedEntries.filter((entry) => {
    const matchesFilter = state.deckFilter === 'all' || entry.clusterId === state.deckFilter;
    if (!matchesFilter) return false;
    if (!keyword) return true;
    const counterpartKeywords =
      lang === 'zh'
        ? translations.en.decks.entries[entry.__index].keywords || []
        : translations.zh.decks.entries[entry.__index].keywords || [];
    const localizedKeywords = entry.keywords || [];
    const clusterMeta = clusters.find((cluster) => cluster.id === entry.clusterId);
    const haystack = [
      entry.title,
      entry.description,
      clusterMeta?.title || '',
      clusterMeta?.description || '',
      ...localizedKeywords,
      ...counterpartKeywords
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(keyword);
  });

  grid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  clusters.forEach((cluster) => {
    const clusterEntries = filtered.filter((entry) => entry.clusterId === cluster.id);
    if (!clusterEntries.length) return;

    const clusterSection = document.createElement('section');
    clusterSection.className = 'deck-cluster';

    const clusterIntro = document.createElement('div');
    clusterIntro.className = 'deck-cluster__intro';
    clusterIntro.innerHTML = `
      <h3>${cluster.title}</h3>
      <p>${cluster.description}</p>
    `;
    clusterSection.appendChild(clusterIntro);

    const cardsWrapper = document.createElement('div');
    cardsWrapper.className = 'deck-cluster__grid';

    clusterEntries.forEach((entry) => {
      const card = document.createElement('article');
      card.className = 'deck-card';
      card.dataset.entryId = entry.href;
      const tags = (entry.tags || []).map((tag) => `<li>${tag}</li>`).join('');
      card.innerHTML = `
        <h3>${entry.title}</h3>
        <p>${entry.description}</p>
        <ul>${tags}</ul>
        <a href="${entry.href}">
          ${deckCta}
          <span>↗</span>
        </a>
      `;
      cardsWrapper.appendChild(card);
    });

    clusterSection.appendChild(cardsWrapper);
    fragment.appendChild(clusterSection);
  });

  grid.appendChild(fragment);
  if (typeof decks.summary === 'function') {
    summary.textContent = decks.summary(filtered.length, state.deckKeyword, filterLabel);
  } else {
    const fallbackSummary = getLocalizedValue(LANGUAGE_FALLBACK, 'decks.summary');
    if (typeof fallbackSummary === 'function') {
      summary.textContent = fallbackSummary(filtered.length, state.deckKeyword, filterLabel);
    } else {
      summary.textContent = String(filtered.length);
    }
  }
}
function renderCouncil(lang) {
  const council = getLocalizedValue(lang, 'council') || {};
  const fallbackCouncil = getLocalizedValue(LANGUAGE_FALLBACK, 'council') || {};
  const focusLabel = council.focusLabel || fallbackCouncil.focusLabel || 'Strategic focus';
  const constraintsLabel = council.constraintsLabel || fallbackCouncil.constraintsLabel || 'Key constraints';
  const verdictLabel = council.verdictLabel || fallbackCouncil.verdictLabel || 'Verdict';
  const blockersLabel = council.blockersLabel || fallbackCouncil.blockersLabel || 'Core blockers';
  const actionsLabel = council.actionsLabel || fallbackCouncil.actionsLabel || 'Recommended actions';

  const grid = document.getElementById('council-grid');
  if (grid) {
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const profiles = Array.isArray(council.profiles) ? council.profiles : [];
    profiles.forEach((profile) => {
      if (!profile) return;
      const card = document.createElement('article');
      card.className = 'interpreter-card';
      card.dataset.interpreterId = profile.id || '';
      const capabilityList = (Array.isArray(profile.capabilities) ? profile.capabilities : [])
        .map((item) => `<li>${item}</li>`)
        .join('');
      const constraintList = (Array.isArray(profile.constraints) ? profile.constraints : [])
        .map((item) => `<li>${item}</li>`)
        .join('');
      card.innerHTML = `
        <h3 class="interpreter-card__title">${profile.title || ''}</h3>
        <p class="interpreter-card__subtitle">${profile.subtitle || ''}</p>
        <div>
          <h4>${focusLabel}</h4>
          <ul class="interpreter-card__list">${capabilityList}</ul>
        </div>
        <div>
          <h4>${constraintsLabel}</h4>
          <ul class="interpreter-card__list">${constraintList}</ul>
        </div>
        <p class="interpreter-card__verdict">
          <strong>${verdictLabel}</strong>
          ${profile.verdict || ''}
        </p>
      `;
      fragment.appendChild(card);
    });
    grid.appendChild(fragment);
  }

  const logContainer = document.getElementById('council-log');
  if (logContainer) {
    logContainer.querySelectorAll('.interpreter-controls').forEach((node) => node.remove());
    logContainer.querySelectorAll('.interpreter-log-list').forEach((node) => node.remove());
    const list = document.createElement('ul');
    list.className = 'interpreter-log-list';
    const logEntries = Array.isArray(council.log) ? council.log : [];
    logEntries.forEach((entry) => {
      if (!entry) return;
      const item = document.createElement('li');
      item.className = 'interpreter-log-entry';
      if (entry.speakerId) {
        item.dataset.speakerId = entry.speakerId;
      }
      item.innerHTML = `
        <span class="interpreter-log-entry__speaker">${entry.speaker || ''}</span>
        <p class="interpreter-log-entry__message">${entry.message || ''}</p>
      `;
      list.appendChild(item);
    });
    logContainer.appendChild(list);
  }

  const summaryContainer = document.getElementById('council-summary');
  if (summaryContainer) {
    const consensus = council.consensus || fallbackCouncil.consensus;
    if (consensus) {
      const blockers = Array.isArray(consensus.blockers) ? consensus.blockers : [];
      const actions = Array.isArray(consensus.actions) ? consensus.actions : [];
      summaryContainer.innerHTML = `
        <h3 id="council-summary-title">${consensus.title || ''}</h3>
        <p>${consensus.intro || ''}</p>
        <p><strong>${blockersLabel}</strong></p>
        <ul class="interpreter-summary-list">
          ${blockers.map((item) => `<li>${item}</li>`).join('')}
        </ul>
        <p><strong>${actionsLabel}</strong></p>
        <ul class="interpreter-summary-list">
          ${actions.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      `;
    } else {
      summaryContainer.innerHTML = '';
    }
  }

  setupCouncilSimulation(lang);
}

let councilSimulationCleanup = null;

function setupCouncilSimulation(lang) {
  if (typeof councilSimulationCleanup === 'function') {
    councilSimulationCleanup();
    councilSimulationCleanup = null;
  }

  const council = getLocalizedValue(lang, 'council') || {};
  const fallbackSimulation = getLocalizedValue(LANGUAGE_FALLBACK, 'council.simulation') || {};
  const simulation = {
    startLabel: council.simulation?.startLabel || fallbackSimulation.startLabel || 'Begin simulation',
    stopLabel: council.simulation?.stopLabel || fallbackSimulation.stopLabel || 'Abort simulation',
    restartLabel: council.simulation?.restartLabel || fallbackSimulation.restartLabel || 'Replay simulation',
    idleStatus: council.simulation?.idleStatus || fallbackSimulation.idleStatus || '',
    runningStatus: council.simulation?.runningStatus || fallbackSimulation.runningStatus || '',
    completedStatus: council.simulation?.completedStatus || fallbackSimulation.completedStatus || ''
  };
  const logContainer = document.getElementById('council-log');
  const summaryContainer = document.getElementById('council-summary');
  if (!logContainer) return;

  const logList = logContainer.querySelector('.interpreter-log-list');
  if (!logList) return;

  const controls = document.createElement('div');
  controls.className = 'interpreter-controls';
  controls.innerHTML = `
    <button type="button" class="interpreter-controls__button" aria-pressed="false">${simulation.startLabel}</button>
    <p class="interpreter-controls__status" role="status" aria-live="polite" data-role="status">${simulation.idleStatus}</p>
  `;
  logContainer.insertBefore(controls, logList);

  const statusNode = controls.querySelector('[data-role="status"]');
  const button = controls.querySelector('button');
  const logEntries = Array.from(logList.querySelectorAll('.interpreter-log-entry'));
  const interpreterCards = Array.from(
    document.querySelectorAll('#council-grid .interpreter-card')
  );

  let running = false;
  let index = 0;
  let timeoutId = null;

  const clearHighlights = () => {
    logEntries.forEach((entry) => entry.classList.remove('interpreter-log-entry--active'));
    interpreterCards.forEach((card) => card.classList.remove('interpreter-card--active'));
    if (summaryContainer) {
      summaryContainer.classList.remove('interpreter-summary--active');
    }
  };

  const formatStatus = (template, speaker) => {
    if (typeof template === 'function') {
      return template(speaker);
    }
    if (typeof template !== 'string') return '';
    if (template.includes('{speaker}')) {
      return template.replace('{speaker}', speaker || '');
    }
    return template;
  };

  const updateButtonLabel = () => {
    if (running) {
      button.textContent = simulation.stopLabel;
      button.setAttribute('aria-pressed', 'true');
      return;
    }
    if (index >= logEntries.length) {
      button.textContent = simulation.restartLabel;
      button.setAttribute('aria-pressed', 'false');
      return;
    }
    button.textContent = simulation.startLabel;
    button.setAttribute('aria-pressed', 'false');
  };

  const highlightEntry = (entry, entryIndex) => {
    clearHighlights();
    const logNode = logEntries[entryIndex];
    if (logNode) {
      logNode.classList.add('interpreter-log-entry--active');
      logNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (entry?.speakerId) {
      const card = interpreterCards.find((node) => node.dataset.interpreterId === entry.speakerId);
      if (card) {
        card.classList.add('interpreter-card--active');
      } else if (entry.speakerId === 'recorder' && summaryContainer) {
        summaryContainer.classList.add('interpreter-summary--active');
      }
    }
  };

  const stopSimulation = ({ resetIndex } = { resetIndex: true }) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    running = false;
    if (resetIndex) {
      index = 0;
      clearHighlights();
      statusNode.textContent = simulation.idleStatus;
    }
    updateButtonLabel();
  };

  const advance = () => {
    const councilLog = Array.isArray(council.log) ? council.log : [];
    if (index >= councilLog.length) {
      running = false;
      statusNode.textContent = simulation.completedStatus;
      updateButtonLabel();
      return;
    }

    const entry = councilLog[index];
    highlightEntry(entry, index);
    statusNode.textContent = formatStatus(simulation.runningStatus, entry.speaker);
    index += 1;
    timeoutId = window.setTimeout(advance, 3200);
  };

  const startSimulation = () => {
    const councilLog = Array.isArray(council.log) ? council.log : [];
    if (!councilLog.length) return;
    if (index >= councilLog.length) {
      index = 0;
    }
    clearHighlights();
    running = true;
    updateButtonLabel();
    advance();
  };

  button.addEventListener('click', () => {
    if (running) {
      stopSimulation();
    } else {
      startSimulation();
    }
  });

  councilSimulationCleanup = () => {
    stopSimulation({ resetIndex: false });
  };

  statusNode.textContent = simulation.idleStatus;
  updateButtonLabel();
}

let telemetryCards = [];
let telemetryFrameId = null;

function renderTelemetryStreams(lang) {
  const telemetry = getLocalizedValue(lang, 'signals.telemetry') || {};
  const container = document.getElementById('signal-telemetry');
  if (!container) return;
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  telemetryCards = [];

  (Array.isArray(telemetry.streams) ? telemetry.streams : []).forEach((stream) => {
    const card = document.createElement('article');
    card.className = 'telemetry-card';
    card.innerHTML = `
      <h3>${stream.label}</h3>
      <strong>0${stream.unit ? `<span>${stream.unit}</span>` : ''}</strong>
      <p>${stream.description}</p>
    `;
    fragment.appendChild(card);
    telemetryCards.push({ node: card, stream });
  });

  container.appendChild(fragment);
  animateTelemetry();
}

function animateTelemetry() {
  if (!telemetryCards.length) return;
  if (telemetryFrameId) {
    cancelAnimationFrame(telemetryFrameId);
  }

  const update = (time) => {
    const t = time * 0.001;
    const now = performance.now();
    let pulseStrength = 0;
    const pulse = interactiveState.telemetryPulse;
    if (pulse) {
      const elapsed = now - pulse.start;
      if (elapsed >= pulse.duration) {
        interactiveState.telemetryPulse = null;
      } else {
        const progress = elapsed / pulse.duration;
        pulseStrength = Math.sin(progress * Math.PI) * pulse.intensity;
      }
    }

    telemetryCards.forEach(({ node, stream }, index) => {
      const strong = node.querySelector('strong');
      if (!strong) return;
      const variation = Math.sin(t * (0.4 + index * 0.15) + index) * 0.8;
      const pulseWave = pulseStrength
        ? Math.sin(t * (1.2 + index * 0.35) + index) * pulseStrength
        : 0;
      let value =
        stream.base +
        variation * (stream.base * 0.03 + index * 1.2) +
        pulseStrength * (stream.base * 0.08 + index * 2.4) +
        pulseWave * 2.5;
      if (typeof stream.min === 'number') {
        value = Math.max(stream.min, value);
      }
      if (stream.unit === '%') {
        value = Math.min(100, Math.max(92, value));
        strong.textContent = `${value.toFixed(2)}${stream.unit}`;
      } else if (stream.unit === 'Hz') {
        strong.textContent = `${Math.round(value)}${stream.unit}`;
      } else if (stream.unit === 'GHz') {
        strong.textContent = `${value.toFixed(2)}${stream.unit}`;
      } else if (stream.unit === 'lumen') {
        strong.textContent = `${value.toFixed(1)} ${stream.unit}`;
      } else {
        strong.textContent = `${Math.round(value)}${stream.unit}`;
      }
      if (pulseStrength > 0.05) {
        node.classList.add('telemetry-card--pulse');
      } else {
        node.classList.remove('telemetry-card--pulse');
      }
    });

    telemetryFrameId = requestAnimationFrame(update);
  };

  telemetryFrameId = requestAnimationFrame(update);
}

function renderChronicle(lang) {
  const chronicle = getLocalizedValue(lang, 'signals.chronicle') || {};
  const container = document.getElementById('chronicle-stream');
  if (!container) return;
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  (Array.isArray(chronicle.entries) ? chronicle.entries : []).forEach((entry) => {
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

function renderResearchLibrary(lang) {
  const config = getLocalizedValue(lang, 'researchLibrary') || {};
  const fallbackConfig = getLocalizedValue(LANGUAGE_FALLBACK, 'researchLibrary') || {};
  const summary = document.getElementById('research-library-summary');
  const list = document.getElementById('research-library-list');
  if (summary) {
    if (typeof config.summary === 'function') {
      summary.textContent = config.summary(Array.isArray(config.items) ? config.items.length : 0);
    } else if (typeof fallbackConfig.summary === 'function') {
      summary.textContent = fallbackConfig.summary(Array.isArray(config.items) ? config.items.length : 0);
    } else {
      summary.textContent = '';
    }
  }

  if (!list) return;
  list.innerHTML = '';

  const items = Array.isArray(config.items) ? config.items : [];
  if (!items.length) {
    const emptyText = config.empty || fallbackConfig.empty || '';
    if (emptyText) {
      const empty = document.createElement('p');
      empty.className = 'research-library__empty';
      empty.textContent = emptyText;
      list.appendChild(empty);
    }
    return;
  }

  const visitLabel = config.visitLabel || fallbackConfig.visitLabel || 'Open document';
  const loadingLabel = config.loading || fallbackConfig.loading || 'Loading…';
  const errorLabel = config.error || fallbackConfig.error || 'Unable to load document.';

  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const details = document.createElement('details');
    details.className = 'research-entry';
    details.dataset.entryId = item.id;

    const summaryEl = document.createElement('summary');
    summaryEl.className = 'research-entry__summary';
    const titleSpan = document.createElement('span');
    titleSpan.className = 'research-entry__title';
    titleSpan.textContent = item.title || item.id;
    const descriptionSpan = document.createElement('span');
    descriptionSpan.className = 'research-entry__description';
    descriptionSpan.textContent = item.description || '';
    summaryEl.appendChild(titleSpan);
    summaryEl.appendChild(descriptionSpan);
    details.appendChild(summaryEl);

    const body = document.createElement('div');
    body.className = 'research-entry__body';

    if (item.description) {
      const paragraph = document.createElement('p');
      paragraph.className = 'research-entry__lead';
      paragraph.textContent = item.description;
      body.appendChild(paragraph);
    }

    if (item.altTitle && item.altTitle !== item.title) {
      const alt = document.createElement('p');
      alt.className = 'research-entry__alt-title';
      alt.textContent = item.altTitle;
      body.appendChild(alt);
    }
    if (item.altDescription && item.altDescription !== item.description) {
      const altDescription = document.createElement('p');
      altDescription.className = 'research-entry__alt-description';
      altDescription.textContent = item.altDescription;
      body.appendChild(altDescription);
    }

    if (item.source) {
      const link = document.createElement('a');
      link.className = 'research-entry__link';
      link.href = `docs/${item.source}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = visitLabel;
      body.appendChild(link);
    }

    const content = document.createElement('div');
    content.className = 'research-entry__content';
    body.appendChild(content);

    details.appendChild(body);

    details.addEventListener('toggle', async () => {
      if (!details.open || details.dataset.loaded === 'true') return;
      details.dataset.loaded = 'loading';
      content.innerHTML = '';
      if (loadingLabel) {
        const loading = document.createElement('p');
        loading.className = 'research-entry__status';
        loading.textContent = loadingLabel;
        content.appendChild(loading);
      }

      const sourcePath = item.source ? `docs/${item.source}` : '';
      const fallbackPath = item.fallbackSource ? `docs/${item.fallbackSource}` : '';
      const paths = [sourcePath, fallbackPath].filter(Boolean);
      let loaded = false;
      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (!response.ok) {
            continue;
          }
          const text = await response.text();
          content.innerHTML = '';
          const pre = document.createElement('pre');
          pre.className = 'research-entry__content-block';
          pre.textContent = text.trim();
          content.appendChild(pre);
          loaded = true;
          break;
        } catch (error) {
          // Continue to next path
        }
      }

      if (!loaded) {
        content.innerHTML = '';
        if (errorLabel) {
          const error = document.createElement('p');
          error.className = 'research-entry__status research-entry__status--error';
          error.textContent = errorLabel;
          content.appendChild(error);
        }
      }

      details.dataset.loaded = 'true';
    });

    fragment.appendChild(details);
  });

  list.appendChild(fragment);
}

function renderFriendNetwork(lang) {
  const network = getLocalizedValue(lang, 'alliances.network') || {};
  const fallbackNetwork = getLocalizedValue(LANGUAGE_FALLBACK, 'alliances.network') || {};
  const featureContainer = document.getElementById('friend-network-feature');
  const clustersContainer = document.getElementById('friend-network-clusters');
  const visitLabel =
    network.visitLabel ||
    fallbackNetwork.visitLabel ||
    getLocalizedValue(lang, 'alliances.visitCta') ||
    getLocalizedValue(LANGUAGE_FALLBACK, 'alliances.visitCta') ||
    'Visit site';

  if (featureContainer) {
    featureContainer.innerHTML = '';
    const featured = network.featured || fallbackNetwork.featured;
    if (featured && featured.friend) {
      const card = document.createElement('article');
      card.className = 'friend-feature-card';

      const badge = document.createElement('span');
      badge.className = 'friend-feature-card__badge';
      badge.textContent = featured.badge || '';
      card.appendChild(badge);

      const title = document.createElement('h3');
      title.className = 'friend-feature-card__title';
      title.textContent = featured.title || '';
      card.appendChild(title);

      const summary = document.createElement('p');
      summary.className = 'friend-feature-card__summary';
      summary.textContent = featured.summary || '';
      card.appendChild(summary);

      const friend = document.createElement('div');
      friend.className = 'friend-feature-card__friend';
      const friendName = document.createElement('h4');
      friendName.textContent = featured.friend.name || '';
      friend.appendChild(friendName);
      if (featured.friend.description) {
        const friendDescription = document.createElement('p');
        friendDescription.textContent = featured.friend.description;
        friend.appendChild(friendDescription);
      }
      if (featured.friend.note) {
        const friendNote = document.createElement('p');
        friendNote.className = 'friend-feature-card__note';
        friendNote.textContent = featured.friend.note;
        friend.appendChild(friendNote);
      }
      if (Array.isArray(featured.friend.tags) && featured.friend.tags.length) {
        const tagList = document.createElement('ul');
        tagList.className = 'friend-feature-card__tags';
        featured.friend.tags.forEach((tag) => {
          const tagItem = document.createElement('li');
          tagItem.textContent = tag;
          tagList.appendChild(tagItem);
        });
        friend.appendChild(tagList);
      }
      if (featured.friend.url) {
        const anchor = document.createElement('a');
        anchor.className = 'friend-feature-card__link';
        anchor.href = featured.friend.url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.textContent = visitLabel;
        friend.appendChild(anchor);
      }
      card.appendChild(friend);

      featureContainer.appendChild(card);
    }
  }

  if (clustersContainer) {
    clustersContainer.innerHTML = '';
    const clusters = Array.isArray(network.clusters) && network.clusters.length
      ? network.clusters
      : fallbackNetwork.clusters || [];

    const fragment = document.createDocumentFragment();
    clusters.forEach((cluster) => {
      const section = document.createElement('section');
      section.className = 'friend-cluster';

      const heading = document.createElement('header');
      heading.className = 'friend-cluster__header';
      const title = document.createElement('h3');
      title.textContent = cluster.title || '';
      heading.appendChild(title);
      if (cluster.summary) {
        const summary = document.createElement('p');
        summary.textContent = cluster.summary;
        heading.appendChild(summary);
      }
      section.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'friend-cluster__list';
      (Array.isArray(cluster.friends) ? cluster.friends : []).forEach((friend) => {
        const card = document.createElement('article');
        card.className = 'friend-card';

        const name = document.createElement('h4');
        name.textContent = friend.name || '';
        card.appendChild(name);

        if (friend.description) {
          const description = document.createElement('p');
          description.textContent = friend.description;
          card.appendChild(description);
        }

        if (friend.note) {
          const note = document.createElement('p');
          note.className = 'friend-card__note';
          note.textContent = friend.note;
          card.appendChild(note);
        }

        if (Array.isArray(friend.tags) && friend.tags.length) {
          const tags = document.createElement('ul');
          tags.className = 'friend-card__tags';
          friend.tags.forEach((tag) => {
            const tagItem = document.createElement('li');
            tagItem.textContent = tag;
            tags.appendChild(tagItem);
          });
          card.appendChild(tags);
        }

        if (friend.url) {
          const anchor = document.createElement('a');
          anchor.className = 'friend-card__link';
          anchor.href = friend.url;
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
          anchor.textContent = visitLabel;
          card.appendChild(anchor);
        }

        list.appendChild(card);
      });

      section.appendChild(list);
      fragment.appendChild(section);
    });

    clustersContainer.appendChild(fragment);
  }
}

function renderAlliances(lang) {
  const alliances = getLocalizedValue(lang, 'alliances') || {};
  const fallbackVisit = getLocalizedValue(LANGUAGE_FALLBACK, 'alliances.visitCta') || 'Visit site';
  const container = document.getElementById('alliance-grid');
  if (!container) return;
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  (Array.isArray(alliances.items) ? alliances.items : []).forEach((alliance) => {
    const card = document.createElement('article');
    card.className = 'alliance-card';
    const tags = (alliance.tags || []).map((tag) => `<li>${tag}</li>`).join('');
    card.innerHTML = `
      <h3>${alliance.name}</h3>
      <p>${alliance.description}</p>
      ${alliance.note ? `<p class="alliance-card__note">${alliance.note}</p>` : ''}
      <ul>${tags}</ul>
      <a href="${alliance.url}" target="_blank" rel="noopener noreferrer">
        ${alliances.visitCta || fallbackVisit}
        <span aria-hidden="true">↗</span>
      </a>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

function renderDock(lang) {
  const dock = getLocalizedValue(lang, 'dock') || {};
  const container = document.getElementById('dock-links');
  if (!container) return;
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  (Array.isArray(dock.links) ? dock.links : []).forEach((link) => {
    const card = document.createElement('article');
    card.className = 'contact-card';
    card.innerHTML = `
      <h3>${link.title}</h3>
      <p>${link.description}</p>
      <a href="${link.href}">${link.cta} <span aria-hidden="true">↗</span></a>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

function buildCommandPaletteGroups(lang) {
  const dictionary = getTranslation(lang);
  if (!dictionary) return [];

  const groups = [];
  const commandDictionary = dictionary.commandPalette || getLocalizedValue(LANGUAGE_FALLBACK, 'commandPalette') || {};

  const navItems = [];
  const hierarchy = Array.isArray(dictionary.nav?.hierarchy) ? dictionary.nav.hierarchy : [];
  const walkNav = (nodes, depth = 0, ancestors = []) => {
    nodes.forEach((node) => {
      if (!node || typeof node !== 'object') return;
      const chain = [...ancestors, node.label].filter(Boolean);
      const label = node.index ? `${node.index} · ${node.label}` : node.label;
      navItems.push({
        id: `section-${node.id}`,
        label,
        description:
          depth > 0
            ? chain.slice(0, -1).join(' / ')
            : dictionary.nav?.ariaLabel || getLocalizedValue(LANGUAGE_FALLBACK, 'nav.ariaLabel') || '',
        action: 'scroll',
        target: node.id,
        keywords: [node.id, node.label, node.index, ...chain]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
      });
      if (Array.isArray(node.children) && node.children.length) {
        walkNav(node.children, depth + 1, chain);
      }
    });
  };
  walkNav(hierarchy);
  if (navItems.length) {
    const sectionLabel =
      commandDictionary.sectionGroup || getLocalizedValue(LANGUAGE_FALLBACK, 'commandPalette.sectionGroup') || 'Sections';
    groups.push({ id: 'sections', label: sectionLabel, items: navItems });
  }

  const deckEntries = Array.isArray(dictionary.decks?.entries) ? dictionary.decks.entries : [];
  const deckItems = deckEntries.map((entry) => ({
    id: entry.href,
    label: entry.title,
    description: entry.description,
    action: 'deck',
    target: entry.href,
    keywords: [entry.title, entry.description, ...(entry.tags || []), ...(entry.keywords || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  }));
  if (deckItems.length) {
    const deckLabel =
      commandDictionary.deckGroup || getLocalizedValue(LANGUAGE_FALLBACK, 'commandPalette.deckGroup') || 'Decks';
    groups.push({ id: 'decks', label: deckLabel, items: deckItems });
  }

  const chronicleEntries = Array.isArray(dictionary.signals?.chronicle?.entries)
    ? dictionary.signals.chronicle.entries
    : [];
  const timelineItems = chronicleEntries.map((entry) => ({
    id: `timeline-${entry.year}`,
    label: `${entry.year} · ${entry.title}`,
    description: entry.description,
    action: 'timeline',
    target: entry.year,
    keywords: [entry.title, entry.description, entry.year, ...(entry.tags || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  }));
  if (timelineItems.length) {
    const timelineLabel =
      commandDictionary.signalGroup || getLocalizedValue(LANGUAGE_FALLBACK, 'commandPalette.signalGroup') || 'Timeline';
    groups.push({ id: 'timeline', label: timelineLabel, items: timelineItems });
  }

  return groups;
}

function setupCommandPalette(lang) {
  const palette = document.getElementById('command-palette');
  if (!palette) return;
  const dictionary = getLocalizedValue(lang, 'commandPalette') || getLocalizedValue(LANGUAGE_FALLBACK, 'commandPalette');
  if (!dictionary) return;

  commandPaletteState.groups = buildCommandPaletteGroups(lang);
  commandPaletteState.keyword = '';

  const search = document.getElementById('command-search');
  if (search) {
    search.value = '';
    search.setAttribute('aria-label', dictionary.searchLabel);
    if (!search.dataset.bound) {
      search.dataset.bound = 'true';
      search.addEventListener('input', (event) => {
        commandPaletteState.keyword = event.target.value;
        updateCommandPaletteResults();
      });
      search.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          focusFirstCommandItem();
        } else if (event.key === 'Enter') {
          event.preventDefault();
          const first = document.querySelector('#command-results .command-item');
          if (first) {
            first.click();
          }
        }
      });
    }
  }

  const empty = document.getElementById('command-empty');
  if (empty) {
    empty.textContent = dictionary.noResults;
  }

  updateCommandPaletteResults(lang);
}

function updateCommandPaletteResults(lang = state.language) {
  const results = document.getElementById('command-results');
  const empty = document.getElementById('command-empty');
  if (!results || !empty) return;

  results.innerHTML = '';
  const keyword = commandPaletteState.keyword.trim().toLowerCase();
  let total = 0;

  commandPaletteState.groups.forEach((group) => {
    if (!group || !Array.isArray(group.items) || !group.items.length) return;
    const matches = group.items.filter((item) => {
      if (!keyword) return true;
      return item.keywords.includes(keyword);
    });

    if (!matches.length) return;
    total += matches.length;

    const groupSection = document.createElement('section');
    groupSection.className = 'command-group';
    const heading = document.createElement('h3');
    heading.textContent = group.label;
    groupSection.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'command-group__list';
    matches.forEach((item) => {
      const listItem = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'command-item';
      button.setAttribute('role', 'option');
      button.innerHTML = `
        <span class="command-item__title">${item.label}</span>
        ${item.description ? `<span class="command-item__description">${item.description}</span>` : ''}
      `;
      button.addEventListener('click', () => handleCommandSelection(item));
      button.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          focusSiblingCommandItem(button, 1);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          focusSiblingCommandItem(button, -1);
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          button.click();
        }
      });
      listItem.appendChild(button);
      list.appendChild(listItem);
    });

    groupSection.appendChild(list);
    results.appendChild(groupSection);
  });

  empty.hidden = total > 0;
  refreshCommandPaletteFocusables();
}

function focusFirstCommandItem() {
  const first = document.querySelector('#command-results .command-item');
  if (first) {
    first.focus();
  }
}

function focusSiblingCommandItem(current, direction) {
  const items = Array.from(document.querySelectorAll('#command-results .command-item'));
  const index = items.indexOf(current);
  if (index === -1) return;
  const nextIndex = index + direction;
  if (nextIndex < 0) {
    const search = document.getElementById('command-search');
    if (search) search.focus();
    return;
  }
  if (nextIndex >= items.length) return;
  items[nextIndex].focus();
}

function refreshCommandPaletteFocusables() {
  const palette = document.getElementById('command-palette');
  if (!palette) return;
  const panel = palette.querySelector('.command-palette__panel');
  if (!panel) return;

  const selectors = [
    'input:not([disabled])',
    'button:not([disabled])',
    'a[href]',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ];

  const focusables = Array.from(panel.querySelectorAll(selectors.join(','))).filter((element) => {
    if (element.hasAttribute('aria-hidden') && element.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    if (element.closest('[hidden]')) return false;
    if (typeof element.offsetParent === 'undefined') return true;
    return element.offsetParent !== null;
  });

  commandPaletteState.focusables = focusables;
}

function handleCommandPaletteTabLoop(event) {
  if (!interactiveState.commandPaletteOpen || event.key !== 'Tab') return;

  if (!commandPaletteState.focusables.length) {
    refreshCommandPaletteFocusables();
  }

  const focusables = commandPaletteState.focusables;
  if (!focusables.length) return;

  const currentIndex = focusables.indexOf(document.activeElement);
  const lastIndex = focusables.length - 1;

  if (event.shiftKey) {
    if (currentIndex <= 0) {
      event.preventDefault();
      focusables[lastIndex].focus();
    }
  } else if (currentIndex === -1 || currentIndex >= lastIndex) {
    event.preventDefault();
    focusables[0].focus();
  }
}

function openCommandPalette() {
  const palette = document.getElementById('command-palette');
  if (!palette || interactiveState.commandPaletteOpen) return;
  interactiveState.commandPaletteOpen = true;
  interactiveState.commandPaletteReturnFocus = document.activeElement;
  palette.setAttribute('aria-hidden', 'false');
  document.body.classList.add('command-open');
  const toggle = document.getElementById('command-toggle');
  if (toggle) {
    toggle.setAttribute('aria-expanded', 'true');
  }
  updateCommandPaletteResults();
  const search = document.getElementById('command-search');
  if (search) {
    search.value = commandPaletteState.keyword;
    requestAnimationFrame(() => {
      search.focus();
      search.select();
    });
  }
  refreshCommandPaletteFocusables();
}

function closeCommandPalette({ restoreFocus = true } = {}) {
  const palette = document.getElementById('command-palette');
  if (!palette || !interactiveState.commandPaletteOpen) return;
  interactiveState.commandPaletteOpen = false;
  palette.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('command-open');
  const toggle = document.getElementById('command-toggle');
  if (toggle) {
    toggle.setAttribute('aria-expanded', 'false');
  }
  const search = document.getElementById('command-search');
  if (search) {
    search.value = '';
  }
  if (restoreFocus) {
    const focusTarget = interactiveState.commandPaletteReturnFocus;
    if (focusTarget && typeof focusTarget.focus === 'function') {
      focusTarget.focus();
    } else if (toggle) {
      toggle.focus();
    }
  }
  interactiveState.commandPaletteReturnFocus = null;
  commandPaletteState.focusables = [];
}

function handleCommandSelection(item) {
  if (!item) return;
  closeCommandPalette({ restoreFocus: false });

  if (item.action === 'scroll') {
    const target = document.getElementById(item.target);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      flashHighlight(target);
    }
  } else if (item.action === 'deck') {
    focusDeckEntry(item.target);
  } else if (item.action === 'timeline') {
    const signalsSection = document.getElementById('signals');
    if (signalsSection) {
      signalsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    highlightChronicle(item.target);
  }
}

function flashHighlight(element, className = 'focus-highlight', duration = 1600) {
  if (!element) return;
  element.classList.add(className);
  window.setTimeout(() => {
    element.classList.remove(className);
  }, duration);
}

function focusDeckEntry(entryId) {
  if (!entryId) return;
  const selector = `.deck-card[data-entry-id="${escapeSelector(entryId)}"]`;
  const card = document.querySelector(selector);
  if (!card) return;
  card.classList.add('deck-card--active');
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => {
    card.classList.remove('deck-card--active');
  }, 1800);
  const link = card.querySelector('a');
  if (link) {
    link.focus({ preventScroll: true });
  }
}

function highlightChronicle(year) {
  if (!year) return;
  const selector = `.timeline [data-year="${escapeSelector(year)}"]`;
  const item = document.querySelector(selector);
  if (!item) return;
  item.classList.add('timeline-item--active');
  item.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => {
    item.classList.remove('timeline-item--active');
  }, 2000);
}

function triggerTelemetryPulse() {
  const duration = 4200;
  interactiveState.telemetryPulse = {
    start: performance.now(),
    duration,
    intensity: 1 + Math.random() * 0.6
  };
  const panel = document.getElementById('signal-telemetry');
  if (panel) {
    panel.classList.add('telemetry--pulsing');
    window.setTimeout(() => {
      panel.classList.remove('telemetry--pulsing');
    }, duration);
  }
}

function bindHeroPointer() {
  const hero = document.getElementById('hero');
  if (!hero || hero.dataset.pointerBound === 'true') return;
  hero.dataset.pointerBound = 'true';

  const updatePointer = (event) => {
    const rect = hero.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    earthSceneControls.setPointerTilt(x * 2, -y * 2);
  };

  hero.addEventListener('pointermove', updatePointer);
  hero.addEventListener('pointerleave', () => {
    earthSceneControls.setPointerTilt(0, 0);
  });
}

let commandPaletteEventsBound = false;

function bindCommandPaletteEvents() {
  if (commandPaletteEventsBound) return;
  commandPaletteEventsBound = true;

  const toggle = document.getElementById('command-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      if (interactiveState.commandPaletteOpen) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    });
  }

  const palette = document.getElementById('command-palette');
  if (palette) {
    palette.addEventListener('click', (event) => {
      if (event.target.classList.contains('command-palette__backdrop')) {
        closeCommandPalette();
      }
    });
    palette.addEventListener('keydown', handleCommandPaletteTabLoop, true);
  }

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (interactiveState.commandPaletteOpen) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (event.key === 'Escape' && interactiveState.commandPaletteOpen) {
      event.preventDefault();
      closeCommandPalette();
    }
  });
}

function applyLanguage(lang) {
  state.language = lang;
  setStoredLanguage(lang);

  updateDocumentMeta(lang);
  updateInformationArchitecture(lang);
  updateStaticText(lang);
  updateLanguageSelector(lang);
  renderHeaderStatus(lang);
  renderHeroStats(lang);
  renderHeroControls(lang);
  renderStackLayers(lang);
  setupDeckSection(lang);
  renderCouncil(lang);
  renderTelemetryStreams(lang);
  renderChronicle(lang);
  renderResearchLibrary(lang);
  renderFriendNetwork(lang);
  renderAlliances(lang);
  renderDock(lang);
  renderGradientFlowSection(lang);
  refreshGradientTempoUI(lang);
  bindAttentionCurve();
  setupCommandPalette(lang);
}

function initialize() {
  applyLanguage(state.language);
  initializeGradientFlowSystem();
  initEarthScene();
  bindHeroPointer();
  bindCommandPaletteEvents();
}

initialize();

function initEarthScene() {
  const canvas = document.getElementById('earth-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
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

  const control = {
    angle: 0,
    rotationSpeed: 0.08,
    targetRotationSpeed: 0.08,
    pointerTiltX: 0,
    pointerTiltY: 0,
    targetPointerTiltX: 0,
    targetPointerTiltY: 0,
    wobble: 0.08,
    targetWobble: 0.08,
    wobbleTimeout: null
  };

  earthSceneControls.setRotationSpeed = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return;
    const clamped = Math.max(0, Math.min(160, numeric));
    const base = 0.02;
    const range = 0.24;
    control.targetRotationSpeed = base + (clamped / 160) * range;
  };

  earthSceneControls.setPointerTilt = (x = 0, y = 0) => {
    const clamp = (val, max) => Math.max(-max, Math.min(max, val));
    control.targetPointerTiltX = clamp(x, 0.6);
    control.targetPointerTiltY = clamp(y, 0.5);
  };

  earthSceneControls.pulseWobble = () => {
    control.targetWobble = 0.18;
    if (control.wobbleTimeout) {
      clearTimeout(control.wobbleTimeout);
    }
    control.wobbleTimeout = setTimeout(() => {
      control.targetWobble = 0.08;
    }, 1400);
  };

  earthSceneControls.setRotationSpeed(interactiveState.rotationSliderValue);

  let lastTime = 0;

  function render(time) {
    const seconds = time * 0.001;
    const delta = lastTime ? (time - lastTime) * 0.001 : 0;
    lastTime = time;

    resizeCanvas();
    gl.clearColor(0.01, 0.03, 0.12, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    control.rotationSpeed += (control.targetRotationSpeed - control.rotationSpeed) * 0.08;
    control.pointerTiltX += (control.targetPointerTiltX - control.pointerTiltX) * 0.12;
    control.pointerTiltY += (control.targetPointerTiltY - control.pointerTiltY) * 0.12;
    control.wobble += (control.targetWobble - control.wobble) * 0.1;
    control.angle += control.rotationSpeed * delta;

    const aspect = canvas.width / canvas.height;
    const projection = perspectiveMatrix((45 * Math.PI) / 180, aspect, 0.1, 100);

    let model = identity();
    model = rotateY(model, control.angle + control.pointerTiltX * 0.5);
    model = rotateX(model, 0.4 + Math.sin(seconds * 0.4) * control.wobble + control.pointerTiltY * 0.45);
    model = translate(model, [0, 0, -3.4]);

    const lightDirection = normalize([
      Math.cos(seconds * 0.35) * 0.6,
      0.6,
      Math.sin(seconds * 0.35) * 0.8
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
