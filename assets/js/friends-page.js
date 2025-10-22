import { getFriendContent } from './friends-data.js';

const LANGUAGE_FALLBACK = 'en';
const SUPPORTED_LANGUAGES = ['en', 'zh'];

const textDictionary = {
  en: {
    documentTitle: 'Alliance Harbor · Earth Online',
    brand: { name: 'Earth Online' },
    nav: {
      mission: 'Mission',
      labs: 'Labs',
      research: 'Research',
      signals: 'Signals',
      alliances: 'Alliances',
      contact: 'Contact',
      blog: 'Blog',
      home: 'Return home'
    },
    hero: {
      eyebrow: 'Alliance harbor',
      title: 'A network of independent labs building the future together',
      description:
        'Earth Online collaborates with studios, researchers, and community builders across the world. Together we design new rituals, prototype AI-driven tooling, and activate learning constellations.',
      primaryCta: 'Browse the alliance directory',
      secondaryCta: 'Start a partnership',
      hint: 'Each partner brings a first-person perspective on experience design.',
      stat(count) {
        return `${count} partners in orbit`;
      }
    },
    featured: {
      eyebrow: 'Featured orbit',
      title: 'Season spotlight',
      description: 'Each season we highlight one partner whose work expands the boundaries of Earth Online’s practice.',
      badge: 'Featured partner'
    },
    clusters: {
      eyebrow: 'Alliance clusters',
      title: 'Constellations of collaboration',
      description:
        'Partners are organized by the missions they co-develop with us—from creation workflows to data storytelling and open knowledge networks.'
    },
    directory: {
      eyebrow: 'Alliance directory',
      title: 'All partners',
      description: 'Explore every collaborator in the network. Visit their universes and start a conversation.',
      visit: 'Visit site'
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
    documentTitle: '联盟星港 · Earth Online',
    brand: { name: 'Earth Online' },
    nav: {
      mission: '使命',
      labs: '实验室',
      research: '研究',
      signals: '信号',
      alliances: '联盟',
      contact: '联络',
      blog: '博客',
      home: '返回首页'
    },
    hero: {
      eyebrow: '联盟星港',
      title: '独立实验室组成的共创网络',
      description: 'Earth Online 与全球的工作室、研究者与社区构建者合作，共同设计仪式、原型 AI 驱动工具，并激活学习星群。',
      primaryCta: '浏览联盟目录',
      secondaryCta: '发起合作',
      hint: '每位伙伴都带来体验设计的一线视角。',
      stat(count) {
        return `${count} 个伙伴节点`;
      }
    },
    featured: {
      eyebrow: '星港焦点',
      title: '本季关注',
      description: '每个季度我们都会选出一位最能代表 Earth Online 精神的伙伴。',
      badge: '精选伙伴'
    },
    clusters: {
      eyebrow: '联盟星群',
      title: '协作星座',
      description: '我们按照共同建设的任务来组织伙伴：从创作工作流到数据叙事与开放知识网络。'
    },
    directory: {
      eyebrow: '联盟目录',
      title: '全部伙伴',
      description: '探索所有协作者，访问他们的宇宙并开启对话。',
      visit: '访问站点'
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
  return textDictionary[lang] || textDictionary[LANGUAGE_FALLBACK];
}

function applyStaticText(lang) {
  const dictionary = getDictionary(lang);
  document.documentElement.lang = lang;
  const fallback = getDictionary(LANGUAGE_FALLBACK);
  const docTitle = dictionary.documentTitle || fallback.documentTitle;
  if (docTitle) {
    document.title = docTitle;
  }
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

function renderFeatured(lang) {
  const container = document.getElementById('featured-card');
  if (!container) return;
  const content = getFriendContent(lang);
  const featured = content.friendNetwork?.featured?.friend;
  container.innerHTML = '';
  if (!featured) return;

  const badge = document.createElement('span');
  badge.className = 'featured-card__badge';
  badge.textContent = getDictionary(lang).featured.badge;

  const title = document.createElement('h3');
  title.className = 'featured-card__title';
  const link = document.createElement('a');
  link.href = featured.url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = featured.name;
  title.appendChild(link);

  const description = document.createElement('p');
  description.className = 'featured-card__description';
  description.textContent = featured.description || '';

  const elements = [badge, title, description];
  if (featured.note) {
    const note = document.createElement('p');
    note.className = 'featured-card__note';
    note.textContent = featured.note;
    elements.push(note);
  }

  const tags = document.createElement('div');
  tags.className = 'card__meta';
  (featured.tags || []).slice(0, 4).forEach((tag) => {
    const badgeTag = document.createElement('span');
    badgeTag.className = 'tag';
    badgeTag.textContent = tag;
    tags.appendChild(badgeTag);
  });
  elements.push(tags);
  container.append(...elements);
}

function renderClusters(lang) {
  const grid = document.getElementById('cluster-grid');
  if (!grid) return;
  const content = getFriendContent(lang);
  grid.innerHTML = '';

  content.friendNetwork?.clusters?.forEach((cluster) => {
    const card = document.createElement('article');
    card.className = 'cluster-card';

    const title = document.createElement('h3');
    title.textContent = cluster.title;

    const summary = document.createElement('p');
    summary.textContent = cluster.summary;

    const list = document.createElement('div');
    list.className = 'cluster-card__friends';
    cluster.friends.forEach((friend) => {
      const item = document.createElement('div');
      item.className = 'cluster-card__friend';

      const link = document.createElement('a');
      link.href = friend.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = friend.name;

      const description = document.createElement('p');
      description.textContent = friend.description;

      item.append(link, description);
      list.appendChild(item);
    });

    card.append(title, summary, list);
    grid.appendChild(card);
  });
}

function renderDirectory(lang) {
  const grid = document.getElementById('directory-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const content = getFriendContent(lang);
  const allFriends = content.featuredAlliances;
  const visitLabel = getDictionary(lang).directory.visit;

  allFriends.forEach((friend) => {
    const card = document.createElement('article');
    card.className = 'alliance-card';

    const title = document.createElement('h3');
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
    (friend.tags || []).slice(0, 3).forEach((tag) => {
      const badge = document.createElement('span');
      badge.className = 'tag';
      badge.textContent = tag;
      meta.appendChild(badge);
    });

    const action = document.createElement('a');
    action.href = friend.url;
    action.target = '_blank';
    action.rel = 'noopener';
    action.className = 'inline-link';
    action.textContent = visitLabel;

    card.append(title, description, meta, action);
    grid.appendChild(card);
  });
}

function updateAllianceCount(lang) {
  const node = document.getElementById('ally-count');
  if (!node) return;
  const content = getFriendContent(lang);
  const dictionary = getDictionary(lang);
  if (typeof dictionary.hero.stat === 'function') {
    node.textContent = dictionary.hero.stat(content.featuredAlliances.length);
  } else {
    node.textContent = `${content.featuredAlliances.length}`;
  }
}

function updateLanguageSelect(lang) {
  const select = document.getElementById('language-select');
  if (!select) return;
  select.value = lang;
}

function applyLanguage(lang) {
  const nextLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : LANGUAGE_FALLBACK;
  applyStaticText(nextLang);
  renderFeatured(nextLang);
  renderClusters(nextLang);
  renderDirectory(nextLang);
  updateAllianceCount(nextLang);
  updateLanguageSelect(nextLang);
  window.localStorage.setItem('earth-online-language', nextLang);
}

function getInitialLanguage() {
  const stored = window.localStorage.getItem('earth-online-language');
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    return stored;
  }
  const browser = navigator.language?.toLowerCase() || LANGUAGE_FALLBACK;
  if (browser.startsWith('zh')) return 'zh';
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
}

function initLanguageToggle() {
  const select = document.getElementById('language-select');
  if (!select) return;
  select.addEventListener('change', (event) => {
    applyLanguage(event.target.value);
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
