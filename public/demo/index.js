const treeContainer = document.getElementById('demoTree');
const statusEl = document.getElementById('demoStatus');
const searchInput = document.getElementById('treeSearch');
const metaEl = document.getElementById('demoMeta');

let treeData = [];
let totalDemoCount = 0;

async function fetchDemoTree() {
  const response = await fetch('demo-tree.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load demo tree: ${response.status}`);
  }
  return response.json();
}

function countDemos(node) {
  const childrenCount = Array.isArray(node.children)
    ? node.children.reduce((total, child) => total + countDemos(child), 0)
    : 0;
  return (node.path ? 1 : 0) + childrenCount;
}

function createStrong(value) {
  const strong = document.createElement('strong');
  strong.textContent = value;
  return strong;
}

function setStatus(enText, zhText) {
  statusEl.innerHTML = '';
  const en = document.createElement('span');
  en.setAttribute('lang', 'en');
  en.textContent = enText;
  const zh = document.createElement('span');
  zh.setAttribute('lang', 'zh');
  zh.textContent = zhText;
  statusEl.append(en, zh);
}

function createEmptyMessage(query) {
  const empty = document.createElement('p');
  empty.className = 'tree-empty';
  const en = document.createElement('span');
  en.setAttribute('lang', 'en');
  en.textContent = query
    ? `No demos match “${query}”.`
    : 'No demos were found in the demo archive.';
  const zh = document.createElement('span');
  zh.setAttribute('lang', 'zh');
  zh.textContent = query
    ? `没有与 “${query}” 匹配的演示。`
    : '目录中没有可用的演示。';
  empty.append(en, zh);
  return empty;
}

function createLabel(node, basePath) {
  const hasLink = Boolean(node.path);
  const element = document.createElement(hasLink ? 'a' : 'span');
  element.className = 'tree-item';
  if (hasLink) {
    element.href = node.path;
    element.target = '_blank';
    element.rel = 'noopener';
    element.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  const title = document.createElement('span');
  title.className = 'tree-item__title';
  title.textContent = node.label;
  element.appendChild(title);

  const meta = document.createElement('span');
  meta.className = 'tree-item__meta';
  meta.textContent = hasLink ? node.path : `${basePath}${node.name}/`;
  element.title = meta.textContent;
  element.appendChild(meta);

  return element;
}

function renderNode(node, basePath, queryActive) {
  const li = document.createElement('li');
  li.className = 'tree-node';
  if (node.match) {
    li.classList.add('tree-node--match');
  }

  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const container = hasChildren ? document.createElement('details') : document.createElement('div');
  container.className = hasChildren ? 'tree-branch' : 'tree-leaf';
  if (hasChildren && (!basePath || queryActive)) {
    container.open = true;
  }

  const header = hasChildren ? document.createElement('summary') : container;
  header.classList.add('tree-header');
  header.appendChild(createLabel(node, basePath));

  if (hasChildren) {
    const count = countDemos(node);
    const countEn = document.createElement('span');
    countEn.className = 'tree-count';
    countEn.setAttribute('lang', 'en');
    countEn.textContent = `${count} demo${count === 1 ? '' : 's'}`;
    header.appendChild(countEn);

    const countZh = document.createElement('span');
    countZh.className = 'tree-count';
    countZh.setAttribute('lang', 'zh');
    countZh.textContent = `${count} 个演示`;
    header.appendChild(countZh);
  }

  if (hasChildren) {
    container.appendChild(header);
    const childList = document.createElement('ul');
    childList.className = 'tree';
    node.children.forEach((child) => {
      childList.appendChild(renderNode(child, `${basePath}${node.name}/`, queryActive));
    });
    container.appendChild(childList);
  }

  li.appendChild(container);
  return li;
}

function renderTree(nodes, query) {
  treeContainer.innerHTML = '';
  if (!nodes.length) {
    treeContainer.appendChild(createEmptyMessage(query));
    return;
  }

  const list = document.createElement('ul');
  list.className = 'tree tree--root';
  nodes.forEach((node) => {
    list.appendChild(renderNode(node, '', Boolean(query)));
  });
  treeContainer.appendChild(list);
}

function filterNode(node, query) {
  const lowerQuery = query.toLowerCase();
  const matches =
    node.label.toLowerCase().includes(lowerQuery) ||
    node.name.toLowerCase().includes(lowerQuery) ||
    (node.path && node.path.toLowerCase().includes(lowerQuery));

  const filteredChildren = Array.isArray(node.children)
    ? node.children
        .map((child) => filterNode(child, query))
        .filter((child) => child !== null)
    : [];

  if (matches || filteredChildren.length) {
    return {
      ...node,
      children: filteredChildren,
      match: matches
    };
  }

  return null;
}

function filterTree(nodes, query) {
  if (!query) {
    return nodes;
  }
  return nodes
    .map((node) => filterNode(node, query))
    .filter((node) => node !== null);
}

function updateStatus(query, visibleNodes) {
  const visibleCount = visibleNodes.reduce((total, node) => total + countDemos(node), 0);
  if (!query) {
    setStatus(`Showing all ${visibleCount} demos.`, `显示全部 ${visibleCount} 个演示。`);
    return;
  }

  if (visibleCount) {
    setStatus(
      `Showing ${visibleCount} demos matching “${query}”.`,
      `找到 ${visibleCount} 个与 “${query}” 匹配的演示。`
    );
  } else {
    setStatus(`No demos match “${query}”.`, `没有与 “${query}” 匹配的演示。`);
  }
}

function updateMeta(nodes) {
  const directoryCount = nodes.length;
  metaEl.innerHTML = '';

  const en = document.createElement('span');
  en.setAttribute('lang', 'en');
  en.append('Tracking ', createStrong(totalDemoCount), ' demos across ', createStrong(directoryCount), ' top-level directories.');

  const zh = document.createElement('span');
  zh.setAttribute('lang', 'zh');
  zh.append('当前记录 ', createStrong(totalDemoCount), ' 个演示，分布在 ', createStrong(directoryCount), ' 个顶层目录。');

  metaEl.append(en, zh);
}

async function initialise() {
  try {
    setStatus('Loading demo directory…', '正在加载演示目录…');
    const data = await fetchDemoTree();
    treeData = data;
    totalDemoCount = treeData.reduce((total, node) => total + countDemos(node), 0);
    updateMeta(treeData);
    renderTree(treeData, '');
    updateStatus('', treeData);
    treeContainer.hidden = false;
  } catch (error) {
    console.error(error);
    setStatus('Failed to load the demo directory.', '演示目录加载失败。');
    return;
  }

  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.trim();
    const filtered = filterTree(treeData, query);
    renderTree(filtered, query);
    updateStatus(query, filtered);
  });
}

initialise();
