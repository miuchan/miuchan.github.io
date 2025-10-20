const researchEntries = [
  {
    id: 'computational-singularity-proof',
    title: 'Proof of the 470-Year Upper Bound on the Computational Singularity',
    description:
      'A mathematical treatment that combines historical throughput data with physical limits to constrain the duration of the computational singularity.',
    source: 'computational-singularity-proof.md'
  },
  {
    id: 'pinduoduo-distributed-automata-dynamics-center',
    title: '拼多多分布式自动机动力系统研究中心',
    description:
      '分布式自动机驱动的供应链、物流、金融与产业带协同研究框架。',
    source: 'pinduoduo-distributed-automata-dynamics-center.md'
  },
  {
    id: 'tomoko-yuko-thermal-dual-resonance-lab',
    title: '朋子和友子的热对偶共振实验室',
    description: '热流与声波耦合的可逆热管理策略。',
    source: 'tomoko-yuko-thermal-dual-resonance-lab.md'
  },
  {
    id: 'v-d-thermal-dual-ssb-lab',
    title: 'v 子与 d 子的热对偶自发对称破缺计划',
    description: '探索热对偶约束下的量子场谱系与噪声触发机制。',
    source: 'v-d-thermal-dual-ssb-lab.md'
  },
  {
    id: 'micro-incentive-bridge-lab',
    title: '微观激励桥实验室',
    description: '跨社区公共项目的激励设计与资金路由协议。',
    source: 'micro-incentive-bridge-lab.md'
  },
  {
    id: 'whole-home-wireless-charging-lab',
    title: '全屋智能无线充电实验舱',
    description: '多房间谐振线圈阵列与随行供电网络设计。',
    source: 'whole-home-wireless-charging-lab.md'
  },
  {
    id: 'chtholly-hououin-temporal-synchrony-lab',
    title: '珂朵莉·凤凰院凶真时间同调实验室',
    description: '跨时间线的体验安全协议与共鸣写作工具链。',
    source: 'chtholly-hououin-temporal-synchrony-lab.md'
  },
  {
    id: 'grandfather-paradox-worldline-pruning',
    title: '祖父悖论与世界线修改的剪枝策略',
    description: '在祖父悖论场景下，通过剪枝策略维护时间旅行的因果一致性。',
    source: 'grandfather-paradox-worldline-pruning.md'
  },
  {
    id: 'originlab-origin-suite-analysis',
    title: 'OriginLab Origin/OriginPro 产品评估',
    description: '科研与工程领域的数据分析与绘图软件评估。',
    source: 'originlab-origin-suite-analysis.md'
  },
  {
    id: 'earth-online-iteration-2025',
    title: 'Earth Online 自治航道蓝图',
    description: '2025 年行星实验迭代与自治协作航道总结。',
    source: 'earth-online-iteration-2025.md'
  }
];

const params = new URLSearchParams(window.location.search);
const requestedId = params.get('doc');
const activeEntry = researchEntries.find((entry) => entry.id === requestedId) || researchEntries[0];

const titleElement = document.getElementById('document-title');
const abstractElement = document.getElementById('document-abstract');
const contentElement = document.getElementById('document-content');
const sidebarListElement = document.getElementById('document-sidebar-list');
const metaDescription = document.querySelector('meta[name="description"]');

document.title = `${activeEntry.title} · Earth Online 研究文稿`;
titleElement.textContent = activeEntry.title;

if (metaDescription) {
  metaDescription.setAttribute('content', `${activeEntry.title} · ${activeEntry.description}`);
}

researchEntries.forEach((entry) => {
  const item = document.createElement('li');
  item.className = 'document-sidebar__item';

  const link = document.createElement('a');
  link.href = `research.html?doc=${entry.id}`;
  link.className = 'document-sidebar__link';
  const isActive = entry.id === activeEntry.id;
  link.setAttribute('data-active', isActive ? 'true' : 'false');
  if (isActive) {
    link.setAttribute('aria-current', 'page');
  }
  link.textContent = entry.title;

  const description = document.createElement('p');
  description.className = 'document-sidebar__description';
  description.textContent = entry.description;

  item.appendChild(link);
  item.appendChild(description);
  sidebarListElement.appendChild(item);
});

if (abstractElement) {
  abstractElement.innerHTML = '';
  const label = document.createElement('p');
  label.className = 'document-abstract__label';
  label.textContent = 'Research Overview';

  const description = document.createElement('p');
  description.className = 'document-abstract__description';
  description.textContent = activeEntry.description;

  abstractElement.appendChild(label);
  abstractElement.appendChild(description);
}

const convertMathNotation = (input) => {
  let formatted = input;
  formatted = formatted.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 / $2');
  formatted = formatted.replace(/\\times/g, '×');
  formatted = formatted.replace(/\\approx/g, '≈');
  formatted = formatted.replace(/\\log_\{([^}]+)\}\(([^)]+)\)/g, 'log<sub>$1</sub>($2)');
  formatted = formatted.replace(/\\log_\{([^}]+)\}/g, 'log<sub>$1</sub>');
  formatted = formatted.replace(/\\log/g, 'log');
  formatted = formatted.replace(/\\left|\\right/g, '');
  formatted = formatted.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
  formatted = formatted.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
  formatted = formatted.replace(/\\/g, '');
  return formatted;
};

const replaceInlineMath = (element) => {
  if (!element) return;
  element.innerHTML = element.innerHTML.replace(/\\\((.+?)\\\)/g, (_, expr) => {
    return `<span class="math-inline">${convertMathNotation(expr)}</span>`;
  });
};

const applyMathFormatting = (root) => {
  const paragraphs = Array.from(root.querySelectorAll('p'));
  for (let i = 0; i < paragraphs.length; i += 1) {
    const paragraph = paragraphs[i];
    if (!paragraph || !paragraph.isConnected) continue;
    const text = paragraph.textContent.trim();

    if (text === '\\[') {
      const equationParts = [];
      let j = i + 1;
      while (j < paragraphs.length && paragraphs[j] && paragraphs[j].textContent.trim() !== '\\]') {
        equationParts.push(paragraphs[j].textContent.trim());
        j += 1;
      }

      if (j < paragraphs.length) {
        const equation = document.createElement('div');
        equation.className = 'equation';
        equation.innerHTML = convertMathNotation(equationParts.join(' '));
        paragraph.replaceWith(equation);
        for (let k = i + 1; k <= j; k += 1) {
          if (paragraphs[k]) {
            paragraphs[k].remove();
          }
        }
      }
    } else {
      replaceInlineMath(paragraph);
    }
  }

  root.querySelectorAll('li').forEach(replaceInlineMath);
};

const fallbackMessage = document.createElement('p');
fallbackMessage.className = 'document-status';
fallbackMessage.textContent = '正在加载研究论文…';
contentElement.appendChild(fallbackMessage);

const loadDocument = async () => {
  try {
    const response = await fetch(activeEntry.source);

    if (!response.ok) {
      throw new Error(`无法加载文稿：${response.status}`);
    }

    const markdown = await response.text();
    const html = marked.parse(markdown, { breaks: true, gfm: true });
    contentElement.innerHTML = html;
    applyMathFormatting(contentElement);

    const firstHeading = contentElement.querySelector('h1');
    if (firstHeading) {
      firstHeading.remove();
    }

    contentElement.querySelectorAll('table').forEach((table) => {
      table.classList.add('document-table');
    });
  } catch (error) {
    contentElement.innerHTML = '';
    const errorMessage = document.createElement('div');
    errorMessage.className = 'document-status document-status--error';
    errorMessage.textContent = '抱歉，研究论文暂时无法加载。请稍后重试。';
    contentElement.appendChild(errorMessage);
    console.error(error);
  }
};

loadDocument();
