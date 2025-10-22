import { researchEntries } from './research-data.js';
import { getFriendContent } from './friends-data.js';

const LANGUAGE_FALLBACK = 'en';
const SUPPORTED_LANGUAGES = ['en', 'zh'];

const missionTracks = [
  {
    id: 'constellation-design',
    icon: '⟢',
    translations: {
      en: {
        title: 'Constellation design',
        description:
          'Model economic, social, and technical systems. We turn exploratory math, simulations, and governance theory into actionable playbooks.',
        tags: ['Systems research', 'Simulation', 'Narratives']
      },
      zh: {
        title: '星群设计',
        description: '建模经济、社会与技术系统，将探索性的数学、仿真和治理理论压缩为可执行的手册。',
        tags: ['系统研究', '模拟推演', '叙事设计']
      }
    }
  },
  {
    id: 'experience-engineering',
    icon: '✦',
    translations: {
      en: {
        title: 'Experience engineering',
        description:
          'Prototype spatial interfaces, knowledge tools, and AI copilots. Every experiment ships with instrumentation so it can graduate into production.',
        tags: ['WebGL & AI', 'Operational tooling', 'Telemetry']
      },
      zh: {
        title: '体验工程',
        description: '原型化空间界面、知识工具和 AI 协同体，并配备遥测系统，确保实验可以快速升舱到生产环境。',
        tags: ['WebGL 与 AI', '工具链', '遥测指标']
      }
    }
  },
  {
    id: 'alliance-operations',
    icon: '∞',
    translations: {
      en: {
        title: 'Alliance operations',
        description:
          'Activate partner programs and incentive bridges. We help independent labs coordinate launches, learning cohorts, and funding loops.',
        tags: ['Partner strategy', 'Incentive design', 'Community ops']
      },
      zh: {
        title: '联盟运维',
        description: '启动伙伴计划与激励桥梁，协助独立实验室协调发布、学习航班与资金循环。',
        tags: ['伙伴战略', '激励设计', '社区运营']
      }
    }
  }
];

const labDecks = [
  {
    id: 'atlas-console',
    type: 'lab',
    external: false,
    url: 'public/lab/atlas-console/index.html',
    translations: {
      en: {
        title: 'Atlas Console',
        summary: 'A navigation layer for research, assets, and governance rituals with multiplayer spatial UI.',
        tags: ['Spatial UI', 'Knowledge graph'],
        cta: 'Visit console'
      },
      zh: {
        title: 'Atlas 控制台',
        summary: '将研究、资产与治理仪式串联的导航层，配备多人空间界面。',
        tags: ['空间界面', '知识图谱'],
        cta: '访问控制台'
      }
    },
    status: {
      en: 'In production',
      zh: '生产中'
    }
  },
  {
    id: 'helium-simulator',
    type: 'lab',
    external: false,
    url: 'public/lab/helium-simulator/index.html',
    translations: {
      en: {
        title: 'Helium Simulator',
        summary: 'A WebGL engine orchestrating planetary telemetry and AI copilots for operations teams.',
        tags: ['WebGL', 'AI copilot'],
        cta: 'Launch simulator'
      },
      zh: {
        title: 'Helium 模拟器',
        summary: '驱动行星遥测与 AI 协同体的 WebGL 引擎，服务操作团队。',
        tags: ['WebGL', 'AI 协作'],
        cta: '启动模拟器'
      }
    },
    status: {
      en: 'Beta pilots',
      zh: '测试航班'
    }
  },
  {
    id: 'council-studio',
    type: 'lab',
    external: false,
    url: 'public/lab/council-studio/index.html',
    translations: {
      en: {
        title: 'Council Studio',
        summary: 'An AI-native governance studio that scripts rituals, scorecards, and shared decision records.',
        tags: ['Governance', 'Narrative tools'],
        cta: 'Enter studio'
      },
      zh: {
        title: 'Council Studio',
        summary: '面向 AI 的治理工作室，编排仪式、记分卡与共享决策记录。',
        tags: ['治理体系', '叙事工具'],
        cta: '进入工作室'
      }
    },
    status: {
      en: 'Design partner program',
      zh: '设计伙伴计划'
    }
  }
];

const demoDecks = [
  {
    id: 'demo-directory',
    type: 'demo',
    external: false,
    url: 'public/demo/index.html',
    translations: {
      en: {
        title: 'Demo Directory',
        summary: 'Browse the full archive with a navigable tree that lists every experiment and nested prototype.',
        tags: ['Archive', 'Tree view'],
        cta: 'Open directory'
      },
      zh: {
        title: '演示目录',
        summary: '以树状结构浏览全部实验与嵌套原型，快速定位历史 Demo。',
        tags: ['归档', '目录视图'],
        cta: '打开目录'
      }
    },
    status: {
      en: 'Auto-generated map',
      zh: '自动生成目录'
    },
    links: [
      {
        url: 'https://github.com/miuchan/miuchan.github.io/blob/main/scripts/generate_demo_tree.py',
        external: true,
        translations: {
          en: 'View generation script',
          zh: '查看生成脚本'
        }
      }
    ]
  },
  {
    id: 'branch-prediction-lab',
    type: 'demo',
    external: true,
    url: 'public/demo/branch-prediction/index.html',
    translations: {
      en: {
        title: 'Branch Prediction Lab',
        summary: 'Experiment with branch predictor strategies using live traces, rolling accuracy, and pipeline flush costs.',
        tags: ['Microarchitecture', 'Visualization'],
        cta: 'Launch demo'
      },
      zh: {
        title: '分支预测策略实验室',
        summary: '通过交互式轨迹与统计面板体验分支预测策略，观察命中率与流水线冲刷成本。',
        tags: ['微架构', '可视化'],
        cta: '启动演示'
      }
    },
    status: {
      en: 'Playable in browser',
      zh: '浏览器演示'
    }
  },
  {
    id: 'compute-god-validator',
    type: 'demo',
    external: true,
    url: 'public/demo/compute-god-standard-model-validator/index.html',
    translations: {
      en: {
        title: 'Compute-God Validator',
        summary: 'Load the Standard Model registry in-browser and generate traceable validation reports across symmetries and constraints.',
        tags: ['Physics', 'Field tools'],
        cta: 'Run validator'
      },
      zh: {
        title: 'Compute-God 标准模型验证控制台',
        summary: '在浏览器中载入标准模型登记表，对对称性与实验约束生成可追踪的验证报告。',
        tags: ['物理', '场景工具'],
        cta: '启动验证器'
      }
    },
    status: {
      en: 'Interactive console',
      zh: '交互式控制台'
    }
  },
  {
    id: 'agi-asi-reaction',
    type: 'demo',
    external: true,
    url: 'public/demo/agi-asi-reaction-chamber/index.html',
    translations: {
      en: {
        title: 'AGI / ASI Reaction Chamber',
        summary: 'Balance innovation and alignment by tuning feedback loops inside an evolving intelligence chamber visualization.',
        tags: ['Systems dynamics', 'AI governance'],
        cta: 'Enter chamber'
      },
      zh: {
        title: 'AGI / ASI 反应室',
        summary: '调节反馈与监督参数，观察智能反应室在创新与对齐之间的动态。',
        tags: ['系统动力学', 'AI 治理'],
        cta: '进入反应室'
      }
    },
    status: {
      en: 'Interactive field study',
      zh: '交互式场域'
    }
  },
  {
    id: 'ambient-sketch',
    type: 'demo',
    external: true,
    url: 'public/demo/ambient-sketch/index.html',
    translations: {
      en: {
        title: 'Ambient Music Sketch',
        summary: 'Compose a gentle ambient loop with Web Audio controls for tempo, chords, and melodic phrasing.',
        tags: ['Sound', 'Web Audio'],
        cta: 'Play composition'
      },
      zh: {
        title: '环境乐随想',
        summary: '使用 Web Audio 控制速度与和弦，生成一段为数字花园写下的环境乐循环。',
        tags: ['声音', 'Web Audio'],
        cta: '播放乐段'
      }
    },
    status: {
      en: 'Audio playground',
      zh: '音频体验'
    }
  }
];

const deckClusters = [
  {
    id: 'production-labs',
    variant: 'default',
    decks: labDecks,
    translations: {
      en: {
        eyebrow: 'Production fleet',
        title: 'Operational lab consoles',
        description: 'Interfaces shipping with live telemetry, active partners, and governance rituals.'
      },
      zh: {
        eyebrow: '生产舰队',
        title: '运行中的实验室控制台',
        description: '这些界面携带遥测、伙伴协作与治理仪式，持续在生产环境迭代。'
      }
    }
  },
  {
    id: 'demo-garden',
    variant: 'compact',
    decks: demoDecks,
    translations: {
      en: {
        eyebrow: 'Demo garden',
        title: 'Interactive research experiments',
        description: 'Hand-picked prototypes exploring microarchitecture, physics field tools, and narrative soundscapes.'
      },
      zh: {
        eyebrow: '演示花园',
        title: '交互式研究实验',
        description: '精选展示微架构、物理工具与叙事声景的交互原型。'
      }
    }
  }
];

const signalLog = [
  {
    id: 'research-2025',
    date: '2025 · 02',
    translations: {
      en: {
        title: 'Iteration 2025 release train',
        description:
          'Shipped the 2025 operating model with a refreshed Atlas Console, modular governance rituals, and automated research ingestion.'
      },
      zh: {
        title: '2025 迭代列车',
        description: '发布 2025 版操作系统：升级 Atlas 控制台、模块化治理仪式与自动化研究入库。'
      }
    },
    tags: {
      en: ['Release'],
      zh: ['版本发布']
    }
  },
  {
    id: 'alliance-gathering',
    date: '2024 · 11',
    translations: {
      en: {
        title: 'Alliance harbor fieldwork',
        description:
          'Hosted a joint workshop with partner labs to map cross-network incentive bridges and knowledge transfer protocols.'
      },
      zh: {
        title: '联盟星港田野',
        description: '与伙伴实验室共创，梳理跨网络激励桥梁与知识传输协议。'
      }
    },
    tags: {
      en: ['Alliance'],
      zh: ['联盟行动']
    }
  },
  {
    id: 'signal-telemetry',
    date: '2024 · 07',
    translations: {
      en: {
        title: 'Telemetry fabric upgrade',
        description:
          'Upgraded the operations telemetry fabric with near-real-time dashboards and anomaly prediction for active decks.'
      },
      zh: {
        title: '遥测织网升级',
        description: '为体验甲板升级遥测织网，提供近实时仪表与异常预测。'
      }
    },
    tags: {
      en: ['Infrastructure'],
      zh: ['基础设施']
    }
  }
];

const heroStatConfig = [
  {
    id: 'assets',
    translations: {
      en: { label: 'Live assets', hint: 'Research decks, prototypes, and essays' },
      zh: { label: '在线资产', hint: '研究甲板、原型与长文' }
    },
    compute: (ctx) => `${ctx.decks + ctx.research + ctx.signals}+`
  },
  {
    id: 'alliances',
    translations: {
      en: { label: 'Alliance nodes', hint: 'Independent labs collaborating with Earth Online' },
      zh: { label: '联盟节点', hint: '与 Earth Online 共创的独立实验室' }
    },
    compute: (ctx) => `${ctx.alliances}`
  },
  {
    id: 'deployments',
    translations: {
      en: { label: 'Active deployments', hint: 'Production experiences monitored in real time' },
      zh: { label: '活跃部署', hint: '实时监控的生产体验' }
    },
    compute: (ctx) => `${ctx.decks}`
  }
];

const textDictionary = {
  en: {
    documentTitle: 'Earth Online · Experience Lab',
    brand: { name: 'Earth Online' },
    nav: {
      mission: 'Mission',
      labs: 'Labs',
      research: 'Research',
      signals: 'Signals',
      alliances: 'Alliances',
      contact: 'Contact',
      blog: 'Blog',
      home: 'Return home',
      researchLibrary: 'Research Library'
    },
    hero: {
      eyebrow: 'Planetary experience interface',
      title: 'A control console for future knowledge ecosystems',
      description:
        'We rebuild Earth as a navigable information nebula. The lab fuses research decks, WebGL experiments, and alliance protocols into one continuously evolving operating system.',
      primaryCta: 'Explore experience decks',
      secondaryCta: 'Start a collaboration',
      caption:
        'Signals stream through the lab every day. We simulate new narratives, protocols, and interfaces, then ship them to production.'
    },
    mission: {
      eyebrow: 'Mission layers',
      title: 'Three tracks for building the planetary console',
      description:
        'Each track links research, prototyping, and alliance operations into one orbital loop. Together they keep Earth Online’s operating model alive.'
    },
    labs: {
      eyebrow: 'Experience decks',
      title: 'Active laboratories shipping in production',
      description:
        'We maintain a rotating fleet of experiments. Each deck links interface research with real usage and telemetry.'
    },
    research: {
      eyebrow: 'Research library',
      title: 'Mathematical proofs and lab blueprints',
      description:
        'Our research notes model economic systems, simulation hardware, and narrative governance. Read the latest manuscripts or explore the full archive.',
      cta: 'Browse the full library →'
    },
    signals: {
      eyebrow: 'Signal log',
      title: 'Recent transmissions from the lab',
      description:
        'The signal log keeps track of new deployments, essays, and alliance events. Follow the cadence and plug into the network.'
    },
    alliances: {
      eyebrow: 'Alliance harbor',
      title: 'Partners shaping the experience network',
      description:
        'We maintain an alliance network of independent labs, studios, and communities. They help us test new protocols and activate joint missions.',
      cta: 'Meet the alliance harbor →'
    },
    contact: {
      eyebrow: 'Docking station',
      title: 'Launch a joint mission with Earth Online',
      description:
        'Tell us about the system you want to build. We’ll assemble a bespoke team across research, design, and engineering to bring it to life.',
      primary: 'Email the lab',
      secondary: 'Visit our GitHub'
    },
    footer: {
      title: 'Earth Online · Experience Lab',
      description: 'Building navigable systems for knowledge, alliances, and planetary scale collaboration.',
      blog: 'Blog',
      research: 'Research',
      friends: 'Alliance Harbor',
      github: 'GitHub',
      note: '© {year} Earth Online Lab. All rights reserved.'
    }
  },
  zh: {
    documentTitle: 'Earth Online · 体验实验室',
    brand: { name: 'Earth Online' },
    nav: {
      mission: '使命',
      labs: '实验室',
      research: '研究',
      signals: '信号',
      alliances: '联盟',
      contact: '联络',
      blog: '博客',
      home: '返回首页',
      researchLibrary: '研究库'
    },
    hero: {
      eyebrow: '行星体验界面',
      title: '为未来知识生态构建控制台',
      description:
        '我们把地球重构为可导航的信息星云，将研究甲板、WebGL 实验与联盟协议折叠成一套持续进化的操作系统。',
      primaryCta: '探索体验甲板',
      secondaryCta: '发起合作',
      caption: '每天都有信号流经实验室，我们模拟叙事、协议与界面，并快速投入生产。'
    },
    mission: {
      eyebrow: '使命分层',
      title: '三条轨道共建行星控制台',
      description: '每条轨道都把研究、原型与联盟运维连成一个循环，确保 Earth Online 的操作模型持续运转。'
    },
    labs: {
      eyebrow: '体验甲板',
      title: '投产中的活跃实验室',
      description: '我们维护一个轮换的实验舰队，让界面研究与真实使用、遥测指标保持同步。'
    },
    research: {
      eyebrow: '研究文库',
      title: '数学证明与实验室蓝图',
      description: '研究笔记覆盖经济系统、模拟硬件与叙事治理。阅读最新文稿或访问完整档案。',
      cta: '浏览完整文库 →'
    },
    signals: {
      eyebrow: '信号日志',
      title: '实验室最新传输',
      description: '信号日志记录新的部署、长文与联盟行动。跟随节奏接入网络。'
    },
    alliances: {
      eyebrow: '联盟星港',
      title: '共建体验网络的伙伴',
      description: '我们维护跨学科实验室、工作室与社区组成的联盟星网，共同验证新协议并启动联合任务。',
      cta: '前往联盟星港 →'
    },
    contact: {
      eyebrow: '停靠舱',
      title: '与 Earth Online 发起联合任务',
      description: '告诉我们你想构建的系统，我们会组建研究、设计与工程团队，把它快速落地。',
      primary: '发送邮件',
      secondary: '访问 GitHub'
    },
    footer: {
      title: 'Earth Online · 体验实验室',
      description: '构建可导航的知识、联盟与行星协作系统。',
      blog: '博客',
      research: '研究',
      friends: '联盟星港',
      github: 'GitHub',
      note: '© {year} Earth Online Lab. 保留所有权利。'
    }
  }
};

function getDictionary(lang) {
  if (SUPPORTED_LANGUAGES.includes(lang)) {
    return textDictionary[lang];
  }
  return textDictionary[LANGUAGE_FALLBACK];
}

function resolveTranslation(translations, lang) {
  return translations?.[lang] || translations?.[LANGUAGE_FALLBACK] || Object.values(translations || {})[0] || {};
}

function renderHeroStats(lang) {
  const heroStatsElement = document.getElementById('hero-stats');
  if (!heroStatsElement) return;
  const allianceCount = getFriendContent(lang).featuredAlliances.length;
  const deckCount = deckClusters.reduce((total, cluster) => total + cluster.decks.length, 0);
  const context = {
    decks: deckCount,
    research: researchEntries.length,
    signals: signalLog.length,
    alliances: allianceCount
  };
  heroStatsElement.innerHTML = '';
  heroStatConfig.forEach((stat) => {
    const value = stat.compute(context);
    const copy = resolveTranslation(stat.translations, lang);
    const statCard = document.createElement('div');
    statCard.className = 'hero-stat';

    const label = document.createElement('p');
    label.className = 'hero-stat__label';
    label.textContent = copy.label;

    const metric = document.createElement('p');
    metric.className = 'hero-stat__value';
    metric.textContent = value;

    const hint = document.createElement('p');
    hint.className = 'hero-stat__hint';
    hint.textContent = copy.hint;

    statCard.append(label, metric, hint);
    heroStatsElement.appendChild(statCard);
  });
}

function renderMission(lang) {
  const grid = document.getElementById('mission-grid');
  if (!grid) return;
  grid.innerHTML = '';
  missionTracks.forEach((track) => {
    const copy = resolveTranslation(track.translations, lang);
    const card = document.createElement('article');
    card.className = 'card';

    const icon = document.createElement('span');
    icon.className = 'card__icon';
    icon.textContent = track.icon;

    const title = document.createElement('h3');
    title.className = 'card__title';
    title.textContent = copy.title;

    const description = document.createElement('p');
    description.textContent = copy.description;

    const meta = document.createElement('div');
    meta.className = 'card__meta';
    copy.tags?.forEach((tag) => {
      const badge = document.createElement('span');
      badge.className = 'tag';
      badge.textContent = tag;
      meta.appendChild(badge);
    });

    card.append(icon, title, description, meta);
    grid.appendChild(card);
  });
}

function getDeckDefaultLabel(type, lang) {
  const defaults = {
    lab: { en: 'Visit lab', zh: '访问实验室' },
    demo: { en: 'Launch demo', zh: '启动 Demo' }
  };
  const mapping = defaults[type] || defaults.lab;
  return mapping?.[lang] || mapping?.[LANGUAGE_FALLBACK] || (lang === 'zh' ? '打开链接' : 'Open link');
}

function createDeckCard(deck, lang, options = {}) {
  const copy = resolveTranslation(deck.translations, lang);
  const fallbackCopy = resolveTranslation(deck.translations, LANGUAGE_FALLBACK);
  const card = document.createElement('article');
  card.className = 'deck';
  if (options.variant === 'compact') {
    card.classList.add('deck--compact');
  }

  const header = document.createElement('div');
  header.className = 'deck__header';

  const title = document.createElement('h3');
  title.className = 'deck__title';
  const titleLink = document.createElement('a');
  titleLink.href = deck.url;
  if (deck.external !== false) {
    titleLink.target = '_blank';
    titleLink.rel = 'noopener';
  }
  titleLink.textContent = copy.title;
  title.appendChild(titleLink);
  header.appendChild(title);

  const statusText = deck.status?.[lang] || deck.status?.[LANGUAGE_FALLBACK];
  if (statusText) {
    const status = document.createElement('span');
    status.className = 'deck__status';
    status.textContent = statusText;
    header.appendChild(status);
  }

  card.appendChild(header);

  if (copy.summary) {
    const summary = document.createElement('p');
    summary.className = 'deck__summary';
    summary.textContent = copy.summary;
    card.appendChild(summary);
  }

  const tags = copy.tags?.length ? copy.tags : fallbackCopy?.tags;
  if (tags?.length) {
    const meta = document.createElement('div');
    meta.className = 'deck__meta';
    tags.forEach((tag) => {
      const badge = document.createElement('span');
      badge.className = 'tag';
      badge.textContent = tag;
      meta.appendChild(badge);
    });
    card.appendChild(meta);
  }

  const actions = [];
  const defaultLabel = copy.cta || fallbackCopy?.cta || getDeckDefaultLabel(deck.type, lang);
  if (deck.url) {
    actions.push({ url: deck.url, label: defaultLabel, external: deck.external });
  }

  if (Array.isArray(deck.links)) {
    deck.links.forEach((link) => {
      if (!link?.url) return;
      const label =
        link.translations?.[lang] ||
        link.translations?.[LANGUAGE_FALLBACK] ||
        link.label ||
        (lang === 'zh' ? '了解更多' : 'Learn more');
      actions.push({ url: link.url, label, external: link.external ?? deck.external });
    });
  }

  if (actions.length) {
    const actionGroup = document.createElement('div');
    actionGroup.className = 'deck__actions';
    actions.forEach((action) => {
      const anchor = document.createElement('a');
      anchor.className = 'deck__link';
      anchor.href = action.url;
      if (action.external !== false) {
        anchor.target = '_blank';
        anchor.rel = 'noopener';
      }
      anchor.innerHTML = `<span>${action.label}</span><span aria-hidden="true">↗</span>`;
      actionGroup.appendChild(anchor);
    });
    card.appendChild(actionGroup);
  }

  return card;
}

function renderDecks(lang) {
  const grid = document.getElementById('lab-grid');
  if (!grid) return;
  grid.innerHTML = '';
  grid.classList.add('deck-clusters');

  deckClusters.forEach((cluster) => {
    const clusterCopy = resolveTranslation(cluster.translations, lang);
    const section = document.createElement('section');
    section.className = 'deck-cluster';

    const header = document.createElement('div');
    header.className = 'deck-cluster__header';

    if (clusterCopy?.eyebrow) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'deck-cluster__eyebrow';
      eyebrow.textContent = clusterCopy.eyebrow;
      header.appendChild(eyebrow);
    }

    if (clusterCopy?.title) {
      const title = document.createElement('h3');
      title.className = 'deck-cluster__title';
      title.textContent = clusterCopy.title;
      header.appendChild(title);
    }

    if (clusterCopy?.description) {
      const description = document.createElement('p');
      description.className = 'deck-cluster__description';
      description.textContent = clusterCopy.description;
      header.appendChild(description);
    }

    if (header.children.length) {
      section.appendChild(header);
    }

    const clusterGrid = document.createElement('div');
    clusterGrid.className = 'deck-grid';
    if (cluster.variant === 'compact') {
      clusterGrid.classList.add('deck-grid--compact');
    }

    cluster.decks.forEach((deck) => {
      const card = createDeckCard(deck, lang, { variant: cluster.variant });
      clusterGrid.appendChild(card);
    });

    section.appendChild(clusterGrid);
    grid.appendChild(section);
  });
}

function getLocalizedResearchEntries(lang) {
  return researchEntries.map((entry) => {
    const translation = resolveTranslation(entry.translations, lang);
    return {
      id: entry.id,
      title: translation.title || entry.id,
      description: translation.description || '',
      source: entry.sources?.[lang] || entry.sources?.[LANGUAGE_FALLBACK],
      tags: entry.tags || []
    };
  });
}

function renderResearchHighlight(lang) {
  const container = document.getElementById('research-highlight');
  if (!container) return;
  container.innerHTML = '';
  const localized = getLocalizedResearchEntries(lang).slice(0, 3);
  localized.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'research-card';

    const title = document.createElement('h3');
    title.className = 'research-card__title';
    const link = document.createElement('a');
    link.href = `docs/research.html?doc=${entry.id}&lang=${lang}`;
    link.textContent = entry.title;
    title.appendChild(link);

    const description = document.createElement('p');
    description.textContent = entry.description;

    const meta = document.createElement('div');
    meta.className = 'card__meta';
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = lang === 'zh' ? '研究' : 'Research';
    meta.appendChild(tag);

    card.append(title, description, meta);
    container.appendChild(card);
  });
}

function renderSignalLog(lang) {
  const container = document.getElementById('signal-timeline');
  if (!container) return;
  container.innerHTML = '';
  signalLog.forEach((entry) => {
    const copy = resolveTranslation(entry.translations, lang);
    const tags = entry.tags?.[lang] || entry.tags?.[LANGUAGE_FALLBACK] || [];

    const item = document.createElement('article');
    item.className = 'timeline-entry';

    const meta = document.createElement('p');
    meta.className = 'timeline-entry__meta';
    meta.textContent = `${entry.date}`;

    const title = document.createElement('h3');
    title.textContent = copy.title;

    const description = document.createElement('p');
    description.textContent = copy.description;

    const tagsList = document.createElement('div');
    tagsList.className = 'card__meta';
    tags.forEach((tag) => {
      const badge = document.createElement('span');
      badge.className = 'tag';
      badge.textContent = tag;
      tagsList.appendChild(badge);
    });

    item.append(meta, title, description, tagsList);
    container.appendChild(item);
  });
}

function renderAlliances(lang) {
  const container = document.getElementById('alliance-grid');
  if (!container) return;
  container.innerHTML = '';
  const content = getFriendContent(lang);
  content.featuredAlliances.forEach((friend) => {
    const card = document.createElement('article');
    card.className = 'alliance-card';

    const title = document.createElement('h3');
    title.className = 'alliance-card__title';
    const link = document.createElement('a');
    link.href = friend.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = friend.name;
    title.appendChild(link);

    const description = document.createElement('p');
    description.textContent = friend.description;

    const meta = document.createElement('div');
    meta.className = 'alliance-card__meta';
    friend.tags?.slice(0, 3).forEach((tag) => {
      const badge = document.createElement('span');
      badge.className = 'tag';
      badge.textContent = tag;
      meta.appendChild(badge);
    });

    card.append(title, description, meta);
    container.appendChild(card);
  });
}

function applyStaticText(lang) {
  const dictionary = getDictionary(lang);
  const fallback = getDictionary(LANGUAGE_FALLBACK);
  const docTitle = dictionary.documentTitle || fallback.documentTitle;
  if (docTitle) {
    document.title = docTitle;
  }
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const path = node.getAttribute('data-i18n');
    if (!path) return;
    const segments = path.split('.');
    let current = dictionary;
    let fallbackCursor = fallback;
    for (const segment of segments) {
      current = current?.[segment];
      fallbackCursor = fallbackCursor?.[segment];
    }
    if (typeof current === 'string') {
      if (path === 'footer.note') {
        node.textContent = current.replace('{year}', new Date().getFullYear());
      } else {
        node.textContent = current;
      }
    } else if (typeof fallbackCursor === 'string') {
      node.textContent = fallbackCursor.replace('{year}', new Date().getFullYear());
    }
  });
}

function updateLanguageSelect(lang) {
  const select = document.getElementById('language-select');
  if (!select) return;
  select.value = lang;
}

function applyLanguage(lang) {
  const nextLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : LANGUAGE_FALLBACK;
  applyStaticText(nextLang);
  renderHeroStats(nextLang);
  renderMission(nextLang);
  renderDecks(nextLang);
  renderResearchHighlight(nextLang);
  renderSignalLog(nextLang);
  renderAlliances(nextLang);
  updateLanguageSelect(nextLang);
  window.localStorage.setItem('earth-online-language', nextLang);
}

function getInitialLanguage() {
  const stored = window.localStorage.getItem('earth-online-language');
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    return stored;
  }
  const browser = navigator.language?.toLowerCase() || LANGUAGE_FALLBACK;
  if (browser.startsWith('zh')) {
    return 'zh';
  }
  return LANGUAGE_FALLBACK;
}

function handleNavigation() {
  const nav = document.getElementById('primary-nav');
  const toggle = document.getElementById('nav-toggle');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.getAttribute('data-open') === 'true';
    const next = !isOpen;
    nav.setAttribute('data-open', String(next));
    toggle.setAttribute('aria-expanded', String(next));
  });

  nav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      nav.setAttribute('data-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const activeLink = navLinks.find((link) => link.getAttribute('href') === `#${id}`);
        if (activeLink) {
          activeLink.setAttribute('data-active', entry.isIntersecting ? 'true' : 'false');
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0.2 }
  );

  document.querySelectorAll('main section[id]').forEach((section) => {
    observer.observe(section);
  });
}

function initLanguageToggle() {
  const select = document.getElementById('language-select');
  if (!select) return;
  select.addEventListener('change', (event) => {
    const value = event.target.value;
    applyLanguage(value);
  });
}

function setYear() {
  const node = document.getElementById('current-year');
  if (node) {
    node.textContent = String(new Date().getFullYear());
  }
}

function init() {
  setYear();
  handleNavigation();
  initLanguageToggle();
  const initialLanguage = getInitialLanguage();
  applyLanguage(initialLanguage);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
