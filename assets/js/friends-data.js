const tcdw = {
  name: '吐槽大王部落格',
  url: 'https://www.tcdw.net/',
  description: '正在学习接受不完美的世界！',
  note:
    'TCDW 在独立写作与设计实验之间穿梭，把对知识网络的观察整理成开放档案，与 Earth Online 的体验方法论彼此呼应。',
  tags: ['独立创作', '写作实验', '知识网络']
};

const inkAndSwitch = {
  name: 'Ink & Switch · 独立研究实验室',
  url: 'https://www.inkandswitch.com/',
  description:
    'Ink & Switch 专注于创造者工具与知识工作流的未来界面，通过跨学科原型验证人机协作的新范式。',
  note:
    '他们将研究报告、原型与设计理念全部公开，帮助我们在构建 Earth Online 的工具链时保持前沿灵感。',
  tags: ['研究工具', '独立实验', '开源原型']
};

const hyperlinkAcademy = {
  name: 'Hyperlink Academy · 网络学习社',
  url: 'https://hyperlink.academy/',
  description:
    'Hyperlink Academy 致力于构建协作式的学习空间，鼓励小组以项目驱动方式共创知识资产。',
  note:
    '他们对学习体验的编排方法帮助我们在 Earth Online 内设计多主体的成长旅程。',
  tags: ['协作学习', '学习设计', '社区运营']
};

const flomo = {
  name: 'flomo · 流动笔记社区',
  url: 'https://flomoapp.com/',
  description:
    'flomo 聚焦轻量且高频的卡片笔记，让创作者快速捕捉灵感并通过标签结构化整理。',
  note:
    '他们的社群常态化分享工作流，为我们设计知识采集与整理协议提供了实战参考。',
  tags: ['个人知识', '卡片笔记', '工作流']
};

const sansanChannel = {
  name: '三三说 · Telegram 频道',
  url: 'https://t.me/sansanshuo',
  description: '在 Telegram 中记录生活观察与体验叙事实验。',
  note:
    '三三通过「三三说」持续发布对日常与技术交织场景的灵感笔记，为 Earth Online 提供了来自社区实践的一手案例。',
  tags: ['生活叙事', '社区观察', 'Telegram']
};

const arena = {
  name: 'Are.na · 共创知识航道',
  url: 'https://www.are.na/',
  description:
    'Are.na 是一个为研究者与创作者打造的知识积木网络，支持以图块、链接与文本拼接跨学科的灵感路径。',
  note:
    '他们开放式的组织方式，让我们在策展体验资产时可以直接嵌套来自全球伙伴的语义地图。',
  tags: ['知识网络', '协作策展', '语义图谱']
};

const memos = {
  name: 'memos · 开源碎片记录',
  url: 'https://usememos.com/',
  description:
    'memos 是一款开源的碎片记录系统，支持自托管、API 扩展与多平台同步，帮助团队构建知识中枢。',
  note:
    '他们的开源生态让我们能快速对接实验室内部的知识栈，建立高度可定制的记忆体。',
  tags: ['开源', '自托管', '知识栈']
};

const thePudding = {
  name: 'The Pudding · 数据叙事实验室',
  url: 'https://pudding.cool/',
  description:
    'The Pudding 通过互动可视化讲述社会与文化议题，以数据故事呈现复杂系统的结构与情感。',
  note:
    '他们的长文互动体验为 Earth Online 的叙事界面提供了大量灵感与交互模式。',
  tags: ['数据叙事', '信息设计', '交互长文']
};

export const featuredAlliances = [
  tcdw,
  inkAndSwitch,
  hyperlinkAcademy,
  flomo,
  sansanChannel,
  arena,
  memos,
  thePudding
];

const clusters = [
  {
    title: '创作与学习实验室',
    summary: '这些伙伴帮助我们搭建创作者的工作流、社群学习与体验原型。',
    friends: [inkAndSwitch, hyperlinkAcademy, flomo, sansanChannel]
  },
  {
    title: '知识网络与数字花园',
    summary: '我们与这些平台共建开放式知识航道，让灵感得以跨语境流动。',
    friends: [arena, memos]
  },
  {
    title: '数据叙事与互动体验',
    summary: '这些团队在复杂议题中打造具象化的叙事体验，为我们的设计推演提供灵感。',
    friends: [thePudding]
  }
];

export const friendNetwork = {
  featured: {
    badge: '星港焦点',
    title: '独立观察与体验叙事的第一视角',
    summary:
      '每一季我们都会精选一位最能代表 Earth Online 精神的伙伴，邀请朋友们优先拜访他们的宇宙。',
    friend: tcdw
  },
  clusters
};
