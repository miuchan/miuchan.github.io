import { friendContent } from './friends-data.js';

const counts = {
  demos: 21,
  research: 5,
  blogs: 59,
  resume: 1
};

counts.total = counts.demos + counts.research + counts.blogs + counts.resume;

const translations = {
  zh: {
    documentTitle: 'Earth Online · 体验实验室',
    meta: {
      htmlLang: 'zh-CN',
      direction: 'ltr',
      toggleText: 'EN',
      toggleLabel: '切换到英语',
      navAria: '主导航',
      brandAria: 'Earth Online 实验室标识',
      heroCtaAria: '快速入口'
    },
    language: {
      toggleLabel: '切换到英语'
    },
    brand: {
      subtitle: '体验实验室 · Planetary Experience Lab',
      ariaLabel: 'Earth Online 实验室标识'
    },
    nav: {
      hero: '开场',
      mission: '使命域',
      labs: '实验矩阵',
      interpreters: 'AI 解释器',
      telemetry: '实时遥测',
      timeline: '地球更新史',
      alliances: '友链星港',
      contact: '联络站',
      ariaLabel: '主导航'
    },
    hero: {
      eyebrow: 'Planetary Experience Interface',
      title: '将你的主页重构为地球 Online 体验实验室',
      description:
        '这是一座实时进化的地球体验操作系统：我们以 WebGL 星球引擎、时序故事矩阵与协作协议，将所有研究、原型与伙伴网络汇聚于一个全新的空间界面，邀请你随时登舰探索。',
      primaryCta: '进入实验矩阵',
      secondaryCta: '查看履历网络',
      ctaAria: '快速入口',
      stats: [
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
      ]
    },
    mission: {
      eyebrow: 'Mission Quadrants',
      title: '四大任务域，重塑地球体验',
      intro:
        'Earth Online 把复杂的地球议题拆分为可执行的任务域——从生态治理到认知接口，以实验驱动的方式为专家团队提供共同语言。',
      domains: [
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
      ]
    },
    labs: {
      eyebrow: 'Immersive Lab Matrix',
      title: '实验矩阵：穿梭于 360° 地球体验',
      intro:
        '每个实验都链接到真实的 Demo、研究或运营资产。点开任意模块即可即刻进入交互式场景，或通过顶部筛选快速定位你的兴趣领域。',
      searchLabel: '搜索实验',
      searchPlaceholder: '输入关键词（例如 WebGL、气候、协作）',
      filterAria: '实验过滤',
      cta: '即刻进入',
      summary(count, keyword) {
        return `共 ${count} 个实验，${keyword ? `匹配 “${keyword}”` : '随时待命'}。`;
      },
      filters: [
        { id: 'all', label: '全部' },
        { id: 'demo', label: '交互实验' },
        { id: 'research', label: '研究文档' },
        { id: 'ops', label: '协作运营' },
        { id: 'story', label: '叙事长文' }
      ],
      entries: [
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
          href: 'docs/tomoko-yuko-thermal-dual-resonance-lab.md',
          title: '朋子和友子的热对偶共振实验室',
          description:
            '构建热流-声波耦合实验舱，演示可逆热管理与多节点热对偶调度策略。',
          tags: ['热管理', '多物理场'],
          keywords: ['thermal resonance', 'acoustic coupling', 'heat recovery', '热管理']
        },
        {
          type: 'research',
          href: 'docs/micro-incentive-bridge-lab.md',
          title: '微观激励桥实验室',
          description:
            '建立跨社区的激励桥梁，将贡献事件、声誉权重与结算桥接入统一协议，保障公共项目资金透明高效流动。',
          tags: ['激励设计', '公共项目'],
          keywords: ['micro incentive', 'public goods', 'governance', '激励']
        },
        {
          type: 'research',
          href: 'docs/whole-home-wireless-charging-lab.md',
          title: '全屋智能无线充电实验舱',
          description:
            '构建多房间谐振线圈阵列与自适应调度算法，实现移动设备与机器人随行供电的能源网络。',
          tags: ['无线供能', '智能家居'],
          keywords: ['wireless power', 'smart home', '能源']
        },
        {
          type: 'research',
          href: 'docs/chtholly-hououin-temporal-synchrony-lab.md',
          title: '珂朵莉·凤凰院凶真时间同调实验室',
          description:
            '融合记忆花庭与世界线跳跃模型，研发跨时间线的体验安全协议与共鸣写作工具链。',
          tags: ['时间工程', '记忆系统'],
          keywords: ['temporal synchrony', 'memory resonance', 'world line', '时间']
        },
        {
          type: 'research',
          href: 'docs/computational-singularity-proof.md',
          title: '计算奇点 470 年上界证明',
          description: '以数学推导与历史数据结合的研究，阐释计算奇点的可能轨迹与边界。',
          tags: ['数学', '未来学'],
          keywords: ['singularity', 'proof', '数学']
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
        },
        {
          type: 'ops',
          href: 'public/resume/index.html',
          title: '在线履历与合作模式',
          description: '以空间化信息架构呈现个人履历、技能矩阵与合作指南。',
          tags: ['履历', '协作'],
          keywords: ['resume', 'collaboration', '履历']
        }
      ]
    },
    interpreters: {
      eyebrow: 'Interpreter Duo',
      title: 'OpenAI × CloseAI 解释器联合审议',
      intro:
        '两位解释器将以各自的对齐目标、策略模型与约束清单对同一问题进行推理：为什么当前无法让你的所有代码仓库安全互通。结论由合议庭记录，并生成后续行动建议。',
      logTitle: '联合推理执行轨迹',
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
      ],
      consensus: {
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
      }
    },
    telemetry: {
      eyebrow: 'Live Telemetry',
      title: '实时遥测：地球 Online 的运行指标',
      intro:
        '我们监控体验实验室的能量流、协作频率与系统稳定性。数据基于真实资产数量与动态模拟，让你看到平台的持续跃迁。',
      streams: [
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
      ]
    },
    timeline: {
      eyebrow: 'Evolution Timeline',
      title: '地球 Online 演进时间线',
      intro:
        '自首个原型诞生以来，我们不断吸收来自代码、研究与社区的能量。时间线记录关键跃迁，帮助你了解实验室的起源与未来方向。',
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
        }
      ]
    },
    alliances: {
      eyebrow: 'Alliance Network',
      title: '友链星港：与我们同频的体验实验室',
      intro:
        '这里记录着与 Earth Online 长期共振的创作者与研究者。他们在各自的宇宙里推进设计、技术与叙事的边界，欢迎登舰拜访。',
      cta: '进入完整友链档案',
      visitCta: '访问主页'
    },
    contact: {
      eyebrow: 'Docking Station',
      title: '准备好与 Earth Online 对接吗？',
      intro:
        '无论你来自设计工程、系统科学还是生态治理，我们都期待与你共创新的地球体验模式。以下资源帮助你快速与实验室建立连接。',
      links: [
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
      toggleText: '中文',
      toggleLabel: 'Switch to Chinese',
      navAria: 'Primary navigation',
      brandAria: 'Earth Online lab mark',
      heroCtaAria: 'Quick access'
    },
    language: {
      toggleLabel: 'Switch to Chinese'
    },
    brand: {
      subtitle: 'Planetary Experience Lab',
      ariaLabel: 'Earth Online lab mark'
    },
    nav: {
      hero: 'Launch',
      mission: 'Mission Quadrants',
      labs: 'Lab Matrix',
      interpreters: 'AI Interpreters',
      telemetry: 'Live Telemetry',
      timeline: 'Earth Updates',
      alliances: 'Alliance Harbor',
      contact: 'Contact',
      ariaLabel: 'Primary navigation'
    },
    hero: {
      eyebrow: 'Planetary Experience Interface',
      title: 'Rebuild your homepage into the Earth Online Experience Lab',
      description:
        'A continuously evolving planetary operating system: WebGL engines, temporal story matrices, and collaboration protocols unite every research asset, prototype, and ally into a new spatial interface ready for exploration.',
      primaryCta: 'Enter the lab matrix',
      secondaryCta: 'View resume network',
      ctaAria: 'Quick access',
      stats: [
        {
          label: 'Active assets',
          value: `${counts.total}+`,
          description: 'Interactive prototypes, research, longform essays, and collaboration playbooks form the Earth Online matrix.'
        },
        {
          label: 'Live experiments',
          value: `${counts.demos}`,
          description: 'WebGL simulations, collaboration workflows, and experience systems ready to validate instantly.'
        },
        {
          label: 'Knowledge flow',
          value: `${counts.blogs + counts.research}`,
          description: 'Narratives backed by strategy essays and mathematical proofs keep the story and governance aligned.'
        }
      ]
    },
    mission: {
      eyebrow: 'Mission Quadrants',
      title: 'Four domains to reimagine planetary experience',
      intro:
        'Earth Online decomposes complex planetary challenges into executable mission domains—from ecological governance to cognitive interfaces—giving expert teams a shared language grounded in experimentation.',
      domains: [
        {
          title: 'Ecological Singularity Governance',
          narrative:
            'Build strategic interfaces for planetary restoration, connecting data, behavior, and policy to drive systemic repair.',
          protocols: ['Climate data orchestration', 'Impact modeling', 'Cross-domain collaboration']
        },
        {
          title: 'Experience Systems Console',
          narrative:
            'Break down intricate human–AI workflows into modules so teams share a unified design and validation protocol.',
          protocols: ['DesignOps', 'Real-time metrics', 'Strategic prototyping']
        },
        {
          title: 'Cognitive Interface Upgrades',
          narrative:
            'Use immersive interfaces and multisensory interaction to explore new perceptions of Earth and amplify human–AI synergy.',
          protocols: ['WebGL engines', 'Sound & particle systems', 'Narrative visualization']
        },
        {
          title: 'Interstellar Partner Network',
          narrative:
            'Help interdisciplinary partners locate collaboration coordinates fast with standardized resumes, cadences, and resource protocols.',
          protocols: ['Resume network', 'Co-creation cadence', 'Learning pathways']
        }
      ]
    },
    labs: {
      eyebrow: 'Immersive Lab Matrix',
      title: 'Lab matrix: traverse 360° Earth experiences',
      intro:
        'Every lab links to a real demo, research note, or operational asset. Dive into an interactive scene instantly or filter by tags to pinpoint what you need.',
      searchLabel: 'Search labs',
      searchPlaceholder: 'Type a keyword (e.g. WebGL, climate, collaboration)',
      filterAria: 'Lab filters',
      cta: 'Launch now',
      summary(count, keyword) {
        return `${count} ${count === 1 ? 'lab' : 'labs'} ${keyword ? `matching "${keyword}"` : 'ready for exploration'}.`;
      },
      filters: [
        { id: 'all', label: 'All' },
        { id: 'demo', label: 'Interactive demos' },
        { id: 'research', label: 'Research notes' },
        { id: 'ops', label: 'Operations' },
        { id: 'story', label: 'Narratives' }
      ],
      entries: [
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
          href: 'docs/tomoko-yuko-thermal-dual-resonance-lab.md',
          title: 'Tomoko & Yuko Thermal Dual Resonance Lab',
          description:
            'Prototype a heat-flow and acoustic coupling chamber to demonstrate reversible thermal management strategies.',
          tags: ['Thermal Management', 'Multiphysics'],
          keywords: ['thermal resonance', 'acoustic coupling', 'heat recovery', '热管理']
        },
        {
          type: 'research',
          href: 'docs/micro-incentive-bridge-lab.md',
          title: 'Micro Incentive Bridge Lab',
          description:
            'Design incentive bridges that link contributions, reputation weights, and settlement rails for public projects.',
          tags: ['Incentive Design', 'Public Goods'],
          keywords: ['micro incentive', 'public goods', 'governance', '激励']
        },
        {
          type: 'research',
          href: 'docs/whole-home-wireless-charging-lab.md',
          title: 'Whole-home Wireless Charging Lab',
          description:
            'Build resonant coil arrays and adaptive scheduling to power devices and robots throughout a home.',
          tags: ['Wireless Power', 'Smart Home'],
          keywords: ['wireless power', 'smart home', '能源']
        },
        {
          type: 'research',
          href: 'docs/chtholly-hououin-temporal-synchrony-lab.md',
          title: 'Chtholly × Hououin Temporal Synchrony Lab',
          description:
            'Combine memory gardens with world-line jumps to craft cross-timeline safety protocols and resonant writing tools.',
          tags: ['Temporal Engineering', 'Memory Systems'],
          keywords: ['temporal synchrony', 'memory resonance', 'world line', '时间']
        },
        {
          type: 'research',
          href: 'docs/computational-singularity-proof.md',
          title: '470-year Computational Singularity Bound',
          description:
            'A hybrid of mathematical derivation and historical data projecting the trajectory and limits of the computational singularity.',
          tags: ['Mathematics', 'Futures'],
          keywords: ['singularity', 'proof', '数学']
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
        },
        {
          type: 'ops',
          href: 'public/resume/index.html',
          title: 'Spatial Resume & Collaboration Modes',
          description: 'A spatial information architecture for skills, resume strands, and collaboration guides.',
          tags: ['Resume', 'Collaboration'],
          keywords: ['resume', 'collaboration', '履历']
        }
      ]
    },
    interpreters: {
      eyebrow: 'Interpreter Duo',
      title: 'OpenAI × CloseAI joint deliberation',
      intro:
        'Two interpreters apply their respective alignment goals, strategy models, and constraints to the same challenge: why your repositories cannot yet interconnect safely. Their consensus records follow-up actions.',
      logTitle: 'Joint reasoning transcript',
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
          speaker: 'OpenAI Interpreter',
          message:
            'Alignment audit initiated: six repositories lack centralized token management, relying on personal accounts and temporary secrets.'
        },
        {
          speaker: 'CloseAI Interpreter',
          message:
            'Closed environment check: three private repos live across offline mirrors and restricted networks; current policy forbids unapproved webhooks or pulls.'
        },
        {
          speaker: 'OpenAI Interpreter',
          message:
            'Direct interconnection would bypass least-privilege controls without accountability. Build an authorization directory and audit bus first.'
        },
        {
          speaker: 'CloseAI Interpreter',
          message:
            'Without proxy buffers, mirror sync would disrupt release cadence and amplify dependency conflicts. Isolation should hold.'
        },
        {
          speaker: 'Tribunal Recorder',
          message:
            'Consensus: pause the “connect all repositories” directive until governance, networking, and recovery strategies are complete. Shift to phased remediation.'
        }
      ],
      consensus: {
        title: 'Key blockers preventing repository interconnection',
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
    telemetry: {
      eyebrow: 'Live Telemetry',
      title: 'Real-time telemetry of Earth Online',
      intro:
        'We monitor energy flow, collaboration cadence, and system stability. Metrics combine live asset counts with simulation data to show continuous motion.',
      streams: [
        {
          label: 'Asset spectrum',
          base: counts.total,
          unit: 'items',
          description: 'The cumulative energy from knowledge, prototypes, and operational assets.'
        },
        {
          label: 'Collaboration frequency',
          base: 128,
          unit: 'Hz',
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
    timeline: {
      eyebrow: 'Evolution Timeline',
      title: 'Earth Online evolution log',
      intro:
        'Since the first prototype we have absorbed energy from code, research, and community. The timeline marks pivotal leaps that define our trajectory.',
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
        }
      ]
    },
    alliances: {
      eyebrow: 'Alliance Network',
      title: 'Alliance harbor: labs in resonance with us',
      intro:
        'Meet creators and researchers who orbit Earth Online. They push the boundaries of design, technology, and narrative—step aboard and say hello.',
      cta: 'View full alliance index',
      visitCta: 'Visit site'
    },
    contact: {
      eyebrow: 'Docking Station',
      title: 'Ready to dock with Earth Online?',
      intro:
        'From design engineering to systems science and ecological governance, we are eager to co-create new planetary experiences. These resources help you plug in fast.',
      links: [
        {
          title: 'Interstellar resume network',
          description: 'Explore resumes, skill matrices, and collaboration protocols to find the right alignment.',
          href: 'public/resume/index.html',
          cta: 'Enter the resume hub'
        },
        {
          title: 'Experience lab matrix',
          description: 'Traverse interactive demos and operational templates to spark new ideas.',
          href: '#labs',
          cta: 'Browse labs'
        },
        {
          title: 'Research & longform archive',
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
translations.zh.alliances.items = friendContent.zh.featuredAlliances;
translations.en.alliances.items = friendContent.en.featuredAlliances;

translations.en.labs.entries.forEach((entry, index) => {
  const zhKeywords = translations.zh.labs.entries[index].keywords || [];
  entry.keywords = Array.from(new Set([...(entry.keywords || []), ...zhKeywords]));
});

const STORAGE_KEY = 'earth-online-language';

function resolveTranslation(dictionary, keyPath) {
  return keyPath.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), dictionary);
}

function determineLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) {
      return stored;
    }
  } catch (error) {
    // ignore storage errors
  }

  const browser = (navigator.language || 'zh').toLowerCase();
  if (browser.startsWith('zh')) return 'zh';
  return 'en';
}

const state = {
  language: determineLanguage(),
  labFilter: 'all',
  labKeyword: ''
};

function updateDocumentMeta(lang) {
  const meta = translations[lang].meta;
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.direction || 'ltr';
  document.title = translations[lang].documentTitle;
}

function updateStaticText(lang) {
  const dictionary = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    const value = resolveTranslation(dictionary, key);
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
      const value = resolveTranslation(dictionary, key);
      if (typeof value === 'string') {
        element.setAttribute(attr, value);
      }
    });
  });
}

function updateLanguageToggle(lang) {
  const button = document.getElementById('language-toggle');
  if (!button) return;
  const meta = translations[lang].meta;
  const languageSection = translations[lang].language;
  button.textContent = meta.toggleText;
  button.setAttribute('aria-label', languageSection.toggleLabel || meta.toggleLabel);
}

function renderHeroStats(lang) {
  const stats = translations[lang].hero.stats;
  const container = document.getElementById('hero-stats');
  if (!container) return;
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  stats.forEach((stat) => {
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

function renderMissionDomains(lang) {
  const domains = translations[lang].mission.domains;
  const grid = document.getElementById('mission-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  domains.forEach((mission) => {
    const card = document.createElement('article');
    card.className = 'mission-card';
    const list = mission.protocols.map((item) => `<li>${item}</li>`).join('');
    card.innerHTML = `
      <h3>${mission.title}</h3>
      <p>${mission.narrative}</p>
      <ul>${list}</ul>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

function setupLabSection(lang) {
  const labs = translations[lang].labs;
  const filterContainer = document.getElementById('lab-filters');
  const searchInput = document.getElementById('lab-search');

  if (filterContainer) {
    filterContainer.innerHTML = '';
    labs.filters.forEach((filter) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-chip';
      button.textContent = filter.label;
      button.dataset.filter = filter.id;
      button.setAttribute('aria-pressed', String(filter.id === state.labFilter));
      button.addEventListener('click', () => {
        state.labFilter = filter.id;
        filterContainer
          .querySelectorAll('.filter-chip')
          .forEach((chip) => chip.setAttribute('aria-pressed', String(chip === button)));
        renderLabEntries(lang);
      });
      filterContainer.appendChild(button);
    });
    filterContainer.setAttribute('aria-label', labs.filterAria);
  }

  if (searchInput) {
    searchInput.placeholder = labs.searchPlaceholder;
    searchInput.value = state.labKeyword;
    searchInput.setAttribute('aria-label', labs.searchLabel);
    searchInput.oninput = (event) => {
      state.labKeyword = event.target.value.trim();
      renderLabEntries(lang);
    };
  }

  renderLabEntries(lang);
}

function renderLabEntries(lang) {
  const labs = translations[lang].labs;
  const grid = document.getElementById('lab-grid');
  const summary = document.getElementById('lab-summary');
  if (!grid || !summary) return;

  const keyword = state.labKeyword.toLowerCase();
  const filtered = labs.entries.filter((entry, index) => {
    const matchesFilter = state.labFilter === 'all' || entry.type === state.labFilter;
    if (!matchesFilter) return false;
    if (!keyword) return true;
    const baseKeywords = translations.zh.labs.entries[index].keywords || [];
    const localizedKeywords = entry.keywords || [];
    const haystack = [entry.title, entry.description, ...localizedKeywords, ...baseKeywords]
      .join(' ')
      .toLowerCase();
    return haystack.includes(keyword);
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
        ${labs.cta}
        <span>↗</span>
      </a>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
  summary.textContent = labs.summary(filtered.length, state.labKeyword);
}
function renderInterpreters(lang) {
  const interpreters = translations[lang].interpreters;
  const grid = document.getElementById('interpreter-grid');
  if (grid) {
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    interpreters.profiles.forEach((profile) => {
      const card = document.createElement('article');
      card.className = 'interpreter-card';
      const capabilityList = profile.capabilities.map((item) => `<li>${item}</li>`).join('');
      const constraintList = profile.constraints.map((item) => `<li>${item}</li>`).join('');
      card.innerHTML = `
        <h3 class="interpreter-card__title">${profile.title}</h3>
        <p class="interpreter-card__subtitle">${profile.subtitle}</p>
        <div>
          <h4>${lang === 'zh' ? '策略焦点' : 'Strategic focus'}</h4>
          <ul class="interpreter-card__list">${capabilityList}</ul>
        </div>
        <div>
          <h4>${lang === 'zh' ? '关键约束' : 'Key constraints'}</h4>
          <ul class="interpreter-card__list">${constraintList}</ul>
        </div>
        <p class="interpreter-card__verdict">
          <strong>${lang === 'zh' ? '结论' : 'Verdict'}</strong>
          ${profile.verdict}
        </p>
      `;
      fragment.appendChild(card);
    });
    grid.appendChild(fragment);
  }

  const logContainer = document.getElementById('interpreter-log');
  if (logContainer) {
    logContainer.querySelectorAll('.interpreter-log-list').forEach((node) => node.remove());
    const list = document.createElement('ul');
    list.className = 'interpreter-log-list';
    interpreters.log.forEach((entry) => {
      const item = document.createElement('li');
      item.className = 'interpreter-log-entry';
      item.innerHTML = `
        <span class="interpreter-log-entry__speaker">${entry.speaker}</span>
        <p class="interpreter-log-entry__message">${entry.message}</p>
      `;
      list.appendChild(item);
    });
    logContainer.appendChild(list);
  }

  const summaryContainer = document.getElementById('interpreter-summary');
  if (summaryContainer) {
    const consensus = interpreters.consensus;
    summaryContainer.innerHTML = `
      <h3 id="interpreter-summary-title">${consensus.title}</h3>
      <p>${consensus.intro}</p>
      <p><strong>${lang === 'zh' ? '核心阻塞' : 'Core blockers'}</strong></p>
      <ul class="interpreter-summary-list">
        ${consensus.blockers.map((item) => `<li>${item}</li>`).join('')}
      </ul>
      <p><strong>${lang === 'zh' ? '推荐行动' : 'Recommended actions'}</strong></p>
      <ul class="interpreter-summary-list">
        ${consensus.actions.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    `;
  }
}

let telemetryCards = [];
let telemetryFrameId = null;

function renderTelemetryPanel(lang) {
  const telemetry = translations[lang].telemetry;
  const container = document.getElementById('telemetry-panel');
  if (!container) return;
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  telemetryCards = [];

  telemetry.streams.forEach((stream) => {
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
    telemetryCards.forEach(({ node, stream }, index) => {
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

    telemetryFrameId = requestAnimationFrame(update);
  };

  telemetryFrameId = requestAnimationFrame(update);
}

function renderTimeline(lang) {
  const timeline = translations[lang].timeline;
  const container = document.getElementById('timeline-stream');
  if (!container) return;
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  timeline.entries.forEach((entry) => {
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

function renderAlliances(lang) {
  const alliances = translations[lang].alliances;
  const container = document.getElementById('alliance-grid');
  if (!container) return;
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  alliances.items.forEach((alliance) => {
    const card = document.createElement('article');
    card.className = 'alliance-card';
    const tags = (alliance.tags || []).map((tag) => `<li>${tag}</li>`).join('');
    card.innerHTML = `
      <h3>${alliance.name}</h3>
      <p>${alliance.description}</p>
      ${alliance.note ? `<p class="alliance-card__note">${alliance.note}</p>` : ''}
      <ul>${tags}</ul>
      <a href="${alliance.url}" target="_blank" rel="noopener noreferrer">
        ${alliances.visitCta}
        <span aria-hidden="true">↗</span>
      </a>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

function renderContact(lang) {
  const contact = translations[lang].contact;
  const container = document.getElementById('contact-links');
  if (!container) return;
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  contact.links.forEach((link) => {
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

function applyLanguage(lang) {
  state.language = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    // ignore storage write failures
  }

  updateDocumentMeta(lang);
  updateStaticText(lang);
  updateLanguageToggle(lang);
  renderHeroStats(lang);
  renderMissionDomains(lang);
  setupLabSection(lang);
  renderInterpreters(lang);
  renderTelemetryPanel(lang);
  renderTimeline(lang);
  renderAlliances(lang);
  renderContact(lang);
}

function initialize() {
  applyLanguage(state.language);
  initEarthScene();

  const toggle = document.getElementById('language-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const nextLang = state.language === 'zh' ? 'en' : 'zh';
      applyLanguage(nextLang);
    });
  }
}

initialize();
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
