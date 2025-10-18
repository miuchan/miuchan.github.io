const allianceEntries = {
  tcdw: {
    url: 'https://www.tcdw.net/',
    translations: {
      zh: {
        name: '吐槽大王部落格',
        description: '正在学习接受不完美的世界！',
        note:
          'TCDW 在独立写作与设计实验之间穿梭，把对知识网络的观察整理成开放档案，与 Earth Online 的体验方法论彼此呼应。',
        tags: ['独立创作', '写作实验', '知识网络']
      },
      en: {
        name: 'TCDW Blog',
        description: 'Learning to embrace an imperfect world!',
        note:
          'TCDW moves between independent writing and design experiments, turning observations on knowledge networks into open archives that resonate with Earth Online’s experience methodology.',
        tags: ['Independent Creation', 'Writing Experiments', 'Knowledge Networks']
      }
    }
  },
  inkAndSwitch: {
    url: 'https://www.inkandswitch.com/',
    translations: {
      zh: {
        name: 'Ink & Switch · 独立研究实验室',
        description:
          'Ink & Switch 专注于创造者工具与知识工作流的未来界面，通过跨学科原型验证人机协作的新范式。',
        note:
          '他们将研究报告、原型与设计理念全部公开，帮助我们在构建 Earth Online 的工具链时保持前沿灵感。',
        tags: ['研究工具', '独立实验', '开源原型']
      },
      en: {
        name: 'Ink & Switch · Independent Research Lab',
        description:
          'Ink & Switch researches future interfaces for creative tools and knowledge workflows, prototyping new paradigms of human-AI collaboration.',
        note:
          'Their openly published research reports, prototypes, and design principles keep us inspired while we build the Earth Online toolchain.',
        tags: ['Research Tools', 'Independent Lab', 'Open Prototypes']
      }
    }
  },
  hyperlinkAcademy: {
    url: 'https://hyperlink.academy/',
    translations: {
      zh: {
        name: 'Hyperlink Academy · 网络学习社',
        description:
          'Hyperlink Academy 致力于构建协作式的学习空间，鼓励小组以项目驱动方式共创知识资产。',
        note:
          '他们对学习体验的编排方法帮助我们在 Earth Online 内设计多主体的成长旅程。',
        tags: ['协作学习', '学习设计', '社区运营']
      },
      en: {
        name: 'Hyperlink Academy · Networked Learning Collective',
        description:
          'Hyperlink Academy builds collaborative learning spaces where cohorts co-create knowledge assets through project-driven work.',
        note:
          'Their approach to orchestrating learning experiences guides how we design multi-actor growth journeys inside Earth Online.',
        tags: ['Collaborative Learning', 'Learning Design', 'Community Operations']
      }
    }
  },
  flomo: {
    url: 'https://flomoapp.com/',
    translations: {
      zh: {
        name: 'flomo · 流动笔记社区',
        description:
          'flomo 聚焦轻量且高频的卡片笔记，让创作者快速捕捉灵感并通过标签结构化整理。',
        note:
          '他们的社群常态化分享工作流，为我们设计知识采集与整理协议提供了实战参考。',
        tags: ['个人知识', '卡片笔记', '工作流']
      },
      en: {
        name: 'flomo · Flow-based Notes Community',
        description:
          'flomo champions lightweight, high-frequency card notes so creators can capture ideas quickly and organize them through tags.',
        note:
          'Their community’s workflow sharing gives us practical references for designing knowledge gathering and curation protocols.',
        tags: ['Personal Knowledge', 'Card Notes', 'Workflow']
      }
    }
  },
  sansanChannel: {
    url: 'https://t.me/sansanshuo',
    translations: {
      zh: {
        name: '三三说 · Telegram 频道',
        description: '在 Telegram 中记录生活观察与体验叙事实验。',
        note:
          '三三通过「三三说」持续发布对日常与技术交织场景的灵感笔记，为 Earth Online 提供了来自社区实践的一手案例。',
        tags: ['生活叙事', '社区观察', 'Telegram']
      },
      en: {
        name: 'Sansan Says · Telegram Channel',
        description: 'A Telegram channel chronicling life observations and narrative experiments.',
        note:
          'Through “Sansan Says”, Sansan shares ongoing notes on the interplay between daily life and technology, giving Earth Online first-hand cases from community practice.',
        tags: ['Life Narratives', 'Community Insights', 'Telegram']
      }
    }
  },
  arena: {
    url: 'https://www.are.na/',
    translations: {
      zh: {
        name: 'Are.na · 共创知识航道',
        description:
          'Are.na 是一个为研究者与创作者打造的知识积木网络，支持以图块、链接与文本拼接跨学科的灵感路径。',
        note:
          '他们开放式的组织方式，让我们在策展体验资产时可以直接嵌套来自全球伙伴的语义地图。',
        tags: ['知识网络', '协作策展', '语义图谱']
      },
      en: {
        name: 'Are.na · Shared Knowledge Channel',
        description:
          'Are.na is a knowledge block network for researchers and creators, stitching images, links, and text into interdisciplinary inspiration trails.',
        note:
          'Its open organizational model lets us embed semantic maps from global partners directly into our experience asset curation.',
        tags: ['Knowledge Networks', 'Collaborative Curation', 'Semantic Graphs']
      }
    }
  },
  memos: {
    url: 'https://usememos.com/',
    translations: {
      zh: {
        name: 'memos · 开源碎片记录',
        description:
          'memos 是一款开源的碎片记录系统，支持自托管、API 扩展与多平台同步，帮助团队构建知识中枢。',
        note:
          '他们的开源生态让我们能快速对接实验室内部的知识栈，建立高度可定制的记忆体。',
        tags: ['开源', '自托管', '知识栈']
      },
      en: {
        name: 'memos · Open Source Micro-journaling',
        description:
          'memos is an open-source capture system with self-hosting, API extensions, and multi-platform sync to power team knowledge hubs.',
        note:
          'Its open ecosystem lets us connect the lab’s internal knowledge stack quickly and build a highly customizable memory core.',
        tags: ['Open Source', 'Self-hosting', 'Knowledge Stack']
      }
    }
  },
  thePudding: {
    url: 'https://pudding.cool/',
    translations: {
      zh: {
        name: 'The Pudding · 数据叙事实验室',
        description:
          'The Pudding 通过互动可视化讲述社会与文化议题，以数据故事呈现复杂系统的结构与情感。',
        note:
          '他们的长文互动体验为 Earth Online 的叙事界面提供了大量灵感与交互模式。',
        tags: ['数据叙事', '信息设计', '交互长文']
      },
      en: {
        name: 'The Pudding · Data Narrative Studio',
        description:
          'The Pudding crafts interactive visual essays about social and cultural topics, translating complex systems into emotive data stories.',
        note:
          'Their long-form interactive pieces inspire many of Earth Online’s narrative interfaces and interaction patterns.',
        tags: ['Data Storytelling', 'Information Design', 'Interactive Essays']
      }
    }
  }
};

const networkCopy = {
  zh: {
    featured: {
      badge: '星港焦点',
      title: '独立观察与体验叙事的第一视角',
      summary:
        '每一季我们都会精选一位最能代表 Earth Online 精神的伙伴，邀请朋友们优先拜访他们的宇宙。'
    },
    clusters: [
      {
        title: '创作与学习实验室',
        summary: '这些伙伴帮助我们搭建创作者的工作流、社群学习与体验原型。',
        friends: ['inkAndSwitch', 'hyperlinkAcademy', 'flomo', 'sansanChannel']
      },
      {
        title: '知识网络与数字花园',
        summary: '我们与这些平台共建开放式知识航道，让灵感得以跨语境流动。',
        friends: ['arena', 'memos']
      },
      {
        title: '数据叙事与互动体验',
        summary: '这些团队在复杂议题中打造具象化的叙事体验，为我们的设计推演提供灵感。',
        friends: ['thePudding']
      }
    ]
  },
  en: {
    featured: {
      badge: 'Featured Orbit',
      title: 'First-person perspectives on independent narratives',
      summary:
        'Each season we spotlight a partner who best embodies the spirit of Earth Online and invite visitors to explore their universe first.'
    },
    clusters: [
      {
        title: 'Creation & Learning Labs',
        summary: 'These partners help us build creator workflows, community learning, and experience prototypes.',
        friends: ['inkAndSwitch', 'hyperlinkAcademy', 'flomo', 'sansanChannel']
      },
      {
        title: 'Knowledge Networks & Digital Gardens',
        summary: 'Together we construct open knowledge channels so inspiration can flow across contexts.',
        friends: ['arena', 'memos']
      },
      {
        title: 'Data Narratives & Interactive Stories',
        summary: 'These teams craft tangible narratives for complex topics, inspiring our design explorations.',
        friends: ['thePudding']
      }
    ]
  }
};

function localizeAlliance(id, lang) {
  const entry = allianceEntries[id];
  if (!entry) return null;
  const fallback = entry.translations.zh;
  const localized = entry.translations[lang] || fallback;
  return {
    name: localized.name,
    url: entry.url,
    description: localized.description,
    note: localized.note,
    tags: localized.tags
  };
}

function buildFriendContent(lang = 'zh') {
  const content = networkCopy[lang] || networkCopy.zh;
  const featuredFriend = localizeAlliance('tcdw', lang);
  return {
    featuredAlliances: [
      'tcdw',
      'inkAndSwitch',
      'hyperlinkAcademy',
      'flomo',
      'sansanChannel',
      'arena',
      'memos',
      'thePudding'
    ]
      .map((id) => localizeAlliance(id, lang))
      .filter(Boolean),
    friendNetwork: {
      featured: {
        badge: content.featured.badge,
        title: content.featured.title,
        summary: content.featured.summary,
        friend: featuredFriend
      },
      clusters: content.clusters.map((cluster) => ({
        title: cluster.title,
        summary: cluster.summary,
        friends: cluster.friends
          .map((id) => localizeAlliance(id, lang))
          .filter(Boolean)
      }))
    }
  };
}

export const friendContent = {
  zh: buildFriendContent('zh'),
  en: buildFriendContent('en')
};

export function getFriendContent(lang = 'zh') {
  return friendContent[lang] || friendContent.zh;
}
