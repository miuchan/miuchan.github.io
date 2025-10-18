import { friendContent } from './friends-data.js';

const counts = {
  demos: 21,
  research: 6,
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
    header: {
      statusAria: '地球 Online 当前指标',
      metrics: [
        {
          label: '资产矩阵',
          value: `${counts.total}+`,
          hint: `原型 ${counts.demos} · 研究 ${counts.research} · 长文 ${counts.blogs} · 履历 ${counts.resume}`
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
      hero: '开场',
      architecture: '递归信息场',
      stack: '星球栈图',
      decks: '体验簇阵',
      council: 'AI 议会',
      signals: '信号中枢',
      alliances: '联盟星港',
      dock: '联络站',
      ariaLabel: '信息架构导航',
      hierarchy: [
        { id: 'hero', index: '0', label: '轨道入口' },
        {
          id: 'architecture',
          index: '1',
          label: '递归信息场',
          children: [
            {
              id: 'stack',
              index: '1.1',
              label: '星球栈图',
              children: [
                { id: 'council', index: '1.1.1', label: 'AI 议会' },
                { id: 'signals', index: '1.1.2', label: '信号中枢' }
              ]
            },
            { id: 'decks', index: '1.2', label: '体验簇阵' }
          ]
        },
        { id: 'alliances', index: '2', label: '联盟星港' },
        { id: 'dock', index: '3', label: '联络站' }
      ]
    },
    hero: {
      eyebrow: 'Planetary Experience Interface',
      title: '地球 Online：行星级体验操作室',
      description:
        '以 WebGL 星球引擎、凸优化信息架构与联盟星网，将研究、原型与协议压缩进一个实时进化的空间界面，邀请你随时登舰探索。',
      primaryCta: '进入体验簇阵',
      secondaryCta: '查看履历网络',
      ctaAria: '快速入口',
      stats: [
        {
          label: '星球资产',
          value: `${counts.total}+`,
          description: '交互原型、研究、长文与协作剧本组成的地球体验曲面。',
          meta: [
            `原型 ${counts.demos}`,
            `研究 ${counts.research}`,
            `长文 ${counts.blogs}`,
            `履历 ${counts.resume}`
          ]
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
            '构建跨学科伙伴的协作协议，为履历、节奏与资源提供快速对接的星际路由。',
          protocols: ['履历网络', '共创节奏脚本', '伙伴路由图']
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
          href: 'docs/originlab-origin-suite-analysis.md',
          title: 'OriginLab Origin/OriginPro 产品评估',
          description:
            '整理 OriginLab 官网信息，解析面向科研与工程的数据分析与绘图软件的功能亮点、适配场景与选型要点。',
          tags: ['工具评估', '数据分析'],
          keywords: ['OriginLab', 'OriginPro', 'data analysis', '科研软件']
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
    council: {
      eyebrow: 'Interpreter Council',
      title: '地球 Online AI 议会协同推演',
      intro:
        '两位解释器以星球栈的不同对齐目标切换策略模型，在安全约束内寻找凸组合解。当前议题：为何暂无法让你的代码仓库安全互通。结论由议会记录并生成后续行动建议。',
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
          }
        ]
      }
    },
    alliances: {
      eyebrow: 'Alliance Network',
      title: '联盟星港：与我们同频的体验实验室',
      intro:
        '星港记录着与 Earth Online 长期共振的创作者与研究者。他们在各自的宇宙推进设计、技术与叙事的边界，欢迎沿航线拜访。',
      cta: '进入完整友链档案',
      visitCta: '访问主页'
    },
    dock: {
      eyebrow: 'Docking Station',
      title: '准备好与 Earth Online 对接吗？',
      intro:
        '无论你来自设计工程、系统科学还是生态治理，我们都期待与你共创新的地球体验模式。以下资源帮助你快速建立凸优化的协作通道。',
      links: [
        {
          title: '星际履历网络',
          description: '探索履历、技能矩阵与合作协议，确定你的对接轨道。',
          href: 'public/resume/index.html',
          cta: '进入履历站'
        },
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
    header: {
      statusAria: 'Earth Online live indicators',
      metrics: [
        {
          label: 'Asset matrix',
          value: `${counts.total}+`,
          hint: `Prototypes ${counts.demos} · Research ${counts.research} · Essays ${counts.blogs} · Resume ${counts.resume}`
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
      hero: 'Launch',
      architecture: 'Recursive IA',
      stack: 'Planetary Stack',
      decks: 'Experience Decks',
      council: 'AI Council',
      signals: 'Signal Hub',
      alliances: 'Alliance Harbor',
      dock: 'Dock',
      ariaLabel: 'Information architecture navigation',
      hierarchy: [
        { id: 'hero', index: '0', label: 'Launch bay' },
        {
          id: 'architecture',
          index: '1',
          label: 'Recursive information field',
          children: [
            {
              id: 'stack',
              index: '1.1',
              label: 'Planetary stack map',
              children: [
                { id: 'council', index: '1.1.1', label: 'Interpreter council' },
                { id: 'signals', index: '1.1.2', label: 'Signal hub' }
              ]
            },
            { id: 'decks', index: '1.2', label: 'Experience decks' }
          ]
        },
        { id: 'alliances', index: '2', label: 'Alliance harbor' },
        { id: 'dock', index: '3', label: 'Docking station' }
      ]
    },
    hero: {
      eyebrow: 'Planetary Experience Interface',
      title: 'Earth Online: planetary experience console',
      description:
        'A continuously evolving operating room for Earth: WebGL engines, convex information architecture, and alliance networks compress research, prototypes, and protocols into a navigable spatial console.',
      primaryCta: 'Enter the experience decks',
      secondaryCta: 'View resume network',
      ctaAria: 'Quick access',
      stats: [
        {
          label: 'Planetary assets',
          value: `${counts.total}+`,
          description: 'Interactive prototypes, research, longform essays, and collaboration playbooks form the Earth Online field.',
          meta: [
            `Prototypes ${counts.demos}`,
            `Research ${counts.research}`,
            `Essays ${counts.blogs}`,
            `Resume ${counts.resume}`
          ]
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
            'Provide partners with interoperable resumes, cadences, and resource protocols to open new collaboration routes fast.',
          protocols: ['Resume network', 'Co-creation cadence scripts', 'Partner routing map']
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
          href: 'docs/originlab-origin-suite-analysis.md',
          title: 'OriginLab Origin / OriginPro Assessment',
          description:
            "Synthesizes OriginLab's official materials to surface positioning, capabilities, fit, and evaluation considerations for the scientific analytics suite.",
          tags: ['Tool Review', 'Data Analysis'],
          keywords: ['OriginLab', 'OriginPro', 'data analysis', '科研软件']
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
    council: {
      eyebrow: 'Interpreter Council',
      title: 'Earth Online AI council co-reasoning',
      intro:
        'Two interpreters search for a convex combination of strategies within safety constraints, tackling the question: why can’t your repositories interconnect safely yet? The council records consensus and next moves.',
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
          }
        ]
      }
    },
    alliances: {
      eyebrow: 'Alliance Network',
      title: 'Alliance harbor: experience labs in resonance',
      intro:
        'Meet creators and researchers orbiting Earth Online. They stretch design, technology, and narrative in their universes—plot a course and say hello.',
      cta: 'View full alliance index',
      visitCta: 'Visit site'
    },
    dock: {
      eyebrow: 'Docking Station',
      title: 'Ready to dock with Earth Online?',
      intro:
        'Whether you work in design engineering, systems science, or ecological governance, we want to co-create new planetary experiences. These links open convex collaboration routes fast.',
      links: [
        {
          title: 'Interstellar resume network',
          description: 'Explore resumes, skill matrices, and collaboration protocols to find the right alignment.',
          href: 'public/resume/index.html',
          cta: 'Enter the resume hub'
        },
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
translations.zh.alliances.items = friendContent.zh.featuredAlliances;
translations.en.alliances.items = friendContent.en.featuredAlliances;

translations.en.decks.entries.forEach((entry, index) => {
  const zhKeywords = translations.zh.decks.entries[index].keywords || [];
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
  deckFilter: 'all',
  deckKeyword: ''
};

let navObserver = null;

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
    visited.add(element);
  });

  document.querySelectorAll('[data-ia-depth]').forEach((element) => {
    if (!visited.has(element)) {
      element.removeAttribute('data-ia-depth');
    }
  });

  document.querySelectorAll('[data-ia-index]').forEach((element) => {
    if (!visited.has(element)) {
      element.removeAttribute('data-ia-index');
    }
  });
}

function createNavList(items, lang, depth = 0, navDictionary = translations[lang]?.nav || {}) {
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
    const fallback = resolveTranslation(navDictionary, item.id) || item.id;
    label.textContent = item.label || fallback;
    anchor.appendChild(label);

    li.appendChild(anchor);

    if (Array.isArray(item.children) && item.children.length) {
      li.appendChild(createNavList(item.children, lang, depth + 1, navDictionary));
    }

    list.appendChild(li);
  });

  return list;
}

function buildNavigationTree(navDefinition, lang) {
  const navRoot = document.getElementById('site-nav');
  if (!navRoot) return;

  navRoot.innerHTML = '';
  if (navDefinition?.ariaLabel) {
    navRoot.setAttribute('aria-label', navDefinition.ariaLabel);
  }

  const hierarchy = Array.isArray(navDefinition?.hierarchy) ? navDefinition.hierarchy : [];
  navRoot.classList.toggle('site-nav--tree', hierarchy.length > 0);
  if (!hierarchy.length) return;

  const tree = createNavList(hierarchy, lang, 0);
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
  const navDefinition = translations[lang]?.nav;
  if (!navDefinition) return;
  const hierarchy = Array.isArray(navDefinition.hierarchy) ? navDefinition.hierarchy : [];
  assignInformationDepth(hierarchy);
  buildNavigationTree(navDefinition, lang);
  activateNavigationObserver();
}

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

function renderHeaderStatus(lang) {
  const header = translations[lang]?.header;
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
  const stats = translations[lang].hero.stats;
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

function renderStackLayers(lang) {
  const layers = translations[lang].stack.layers;
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
  const decks = translations[lang].decks;
  const filterContainer = document.getElementById('deck-filters');
  const searchInput = document.getElementById('deck-search');

  if (filterContainer) {
    filterContainer.innerHTML = '';
    decks.filters.forEach((filter) => {
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
    filterContainer.setAttribute('aria-label', decks.filterAria);
  }

  if (searchInput) {
    searchInput.placeholder = decks.searchPlaceholder;
    searchInput.value = state.deckKeyword;
    searchInput.setAttribute('aria-label', decks.searchLabel);
    searchInput.oninput = (event) => {
      state.deckKeyword = event.target.value.trim();
      renderDeckEntries(lang);
    };
  }

  renderDeckEntries(lang);
}

function renderDeckEntries(lang) {
  const decks = translations[lang].decks;
  const grid = document.getElementById('deck-grid');
  const summary = document.getElementById('deck-summary');
  if (!grid || !summary) return;

  const keyword = state.deckKeyword.toLowerCase();
  const filterLabel =
    decks.filters.find((filter) => filter.id === state.deckFilter)?.label || decks.filters[0].label;
  const clusterMap = decks.clusterMap || {};

  const decoratedEntries = decks.entries.map((entry, index) => ({
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
    const clusterMeta = decks.clusters.find((cluster) => cluster.id === entry.clusterId);
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
  decks.clusters.forEach((cluster) => {
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
      const tags = (entry.tags || []).map((tag) => `<li>${tag}</li>`).join('');
      card.innerHTML = `
        <h3>${entry.title}</h3>
        <p>${entry.description}</p>
        <ul>${tags}</ul>
        <a href="${entry.href}">
          ${decks.cta}
          <span>↗</span>
        </a>
      `;
      cardsWrapper.appendChild(card);
    });

    clusterSection.appendChild(cardsWrapper);
    fragment.appendChild(clusterSection);
  });

  grid.appendChild(fragment);
  summary.textContent = decks.summary(filtered.length, state.deckKeyword, filterLabel);
}
function renderCouncil(lang) {
  const council = translations[lang].council;
  const grid = document.getElementById('council-grid');
  if (grid) {
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    council.profiles.forEach((profile) => {
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

  const logContainer = document.getElementById('council-log');
  if (logContainer) {
    logContainer.querySelectorAll('.interpreter-log-list').forEach((node) => node.remove());
    const list = document.createElement('ul');
    list.className = 'interpreter-log-list';
    council.log.forEach((entry) => {
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

  const summaryContainer = document.getElementById('council-summary');
  if (summaryContainer) {
    const consensus = council.consensus;
    summaryContainer.innerHTML = `
      <h3 id="council-summary-title">${consensus.title}</h3>
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

function renderTelemetryStreams(lang) {
  const telemetry = translations[lang].signals.telemetry;
  const container = document.getElementById('signal-telemetry');
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

function renderChronicle(lang) {
  const chronicle = translations[lang].signals.chronicle;
  const container = document.getElementById('chronicle-stream');
  if (!container) return;
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  chronicle.entries.forEach((entry) => {
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

function renderDock(lang) {
  const dock = translations[lang].dock;
  const container = document.getElementById('dock-links');
  if (!container) return;
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  dock.links.forEach((link) => {
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
  updateInformationArchitecture(lang);
  updateStaticText(lang);
  updateLanguageToggle(lang);
  renderHeaderStatus(lang);
  renderHeroStats(lang);
  renderStackLayers(lang);
  setupDeckSection(lang);
  renderCouncil(lang);
  renderTelemetryStreams(lang);
  renderChronicle(lang);
  renderAlliances(lang);
  renderDock(lang);
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
