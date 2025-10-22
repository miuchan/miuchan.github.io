import { researchEntries } from './research-data.js';

const LANGUAGE_FALLBACK = 'en';
const SUPPORTED_LANGUAGES = ['en', 'zh'];

const textDictionary = {
  en: {
    documentTitle: 'Earth Online Research Library',
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
      eyebrow: 'Research library',
      title: 'Earth Online Research Library',
      description: 'Mathematical arguments, protocol design, and experience blueprints from Earth Online’s lab network.',
      hint: 'Entries span both English and Chinese editions.',
      stat(count) {
        return `${count} manuscripts`;
      }
    },
    sidebar: {
      title: 'Research index',
      description: 'Choose a manuscript to load its abstract and full text. Use the language toggle to switch editions.'
    },
    toolbar: { language: 'Language' },
    status: {
      loading: 'Loading manuscript…',
      error: 'Unable to load the document. Please try again later.'
    },
    abstract: { label: 'Research overview' },
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
    documentTitle: 'Earth Online 研究文库',
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
      eyebrow: '研究文库',
      title: 'Earth Online 研究文库',
      description: '来自 Earth Online 实验网络的数学证明、协议设计与体验蓝图。',
      hint: '文稿覆盖中文与英文两个版本。',
      stat(count) {
        return `${count} 篇文稿`;
      }
    },
    sidebar: {
      title: '研究索引',
      description: '选择一篇文稿查看摘要与全文，并通过语言切换按钮在不同版本间跳转。'
    },
    toolbar: { language: '语言' },
    status: {
      loading: '正在加载文稿…',
      error: '暂时无法加载文稿，请稍后重试。'
    },
    abstract: { label: '研究摘要' },
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

const params = new URLSearchParams(window.location.search);
const requestedId = params.get('doc');
const requestedLang = params.get('lang');

const initialEntry = researchEntries.find((entry) => entry.id === requestedId) || researchEntries[0];
const initialLanguage = SUPPORTED_LANGUAGES.includes(requestedLang)
  ? requestedLang
  : (navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : LANGUAGE_FALLBACK);

const state = {
  language: initialLanguage,
  entryId: initialEntry?.id || null
};

const sidebarListElement = document.getElementById('document-sidebar-list');
const abstractElement = document.getElementById('document-abstract');
const contentElement = document.getElementById('document-content');
const statusElement = document.getElementById('document-status');
const titleElement = document.getElementById('document-title');
const entryCountElement = document.getElementById('entry-count');
const languageSelect = document.getElementById('language-select');
const metaDescription = document.querySelector('meta[name="description"]');

function getDictionary(lang) {
  return textDictionary[lang] || textDictionary[LANGUAGE_FALLBACK];
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

function getLocalizedEntry(entry, lang) {
  if (!entry) return null;
  const dictionary = entry.translations || {};
  const fallback = dictionary[LANGUAGE_FALLBACK] || {};
  const localized = dictionary[lang] || fallback;
  const sources = entry.sources || {};
  return {
    id: entry.id,
    title: localized.title || fallback.title || entry.id,
    description: localized.description || fallback.description || '',
    source: sources[lang] || sources[LANGUAGE_FALLBACK] || null,
    sources
  };
}

function getLocalizedEntries(lang) {
  return researchEntries.map((entry) => getLocalizedEntry(entry, lang)).filter(Boolean);
}

function renderEntryCount(lang) {
  if (!entryCountElement) return;
  const dictionary = getDictionary(lang);
  const total = researchEntries.length;
  if (typeof dictionary.hero.stat === 'function') {
    entryCountElement.textContent = dictionary.hero.stat(total);
  } else {
    entryCountElement.textContent = `${total}`;
  }
}

function renderSidebar(lang) {
  if (!sidebarListElement) return;
  sidebarListElement.innerHTML = '';
  const entries = getLocalizedEntries(lang);
  entries.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'research-sidebar__item';

    const link = document.createElement('a');
    link.className = 'research-sidebar__link';
    link.href = `research.html?doc=${entry.id}&lang=${lang}`;
    link.textContent = entry.title;
    if (entry.id === state.entryId) {
      link.setAttribute('data-active', 'true');
      link.setAttribute('aria-current', 'page');
    }
    link.addEventListener('click', (event) => {
      event.preventDefault();
      setEntry(entry.id);
    });

    const description = document.createElement('p');
    description.className = 'research-sidebar__description';
    description.textContent = entry.description;

    item.append(link, description);
    sidebarListElement.appendChild(item);
  });
}

function renderAbstract(lang, entry) {
  if (!abstractElement) return;
  abstractElement.innerHTML = '';
  if (!entry) return;
  const dictionary = getDictionary(lang);
  const label = document.createElement('h2');
  label.textContent = dictionary.abstract.label;
  const description = document.createElement('p');
  description.textContent = entry.description;
  abstractElement.append(label, description);
}

function convertMathNotation(input) {
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
}

function replaceInlineMath(element) {
  if (!element) return;
  element.innerHTML = element.innerHTML.replace(/\\\((.+?)\\\)/g, (_, expr) => {
    return `<span class="math-inline">${convertMathNotation(expr)}</span>`;
  });
}

function applyMathFormatting(root) {
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
}

async function renderDocument(lang, entry) {
  if (!contentElement || !statusElement) return;
  if (!entry) {
    const dictionary = getDictionary(lang);
    statusElement.textContent = dictionary.status.error;
    const message = document.createElement('p');
    message.className = 'document-status';
    message.textContent = dictionary.status.error;
    contentElement.innerHTML = '';
    contentElement.appendChild(message);
    return;
  }

  const dictionary = getDictionary(lang);
  statusElement.textContent = dictionary.status.loading;
  const placeholder = document.createElement('p');
  placeholder.className = 'document-status';
  placeholder.textContent = dictionary.status.loading;
  contentElement.innerHTML = '';
  contentElement.appendChild(placeholder);

  const sourcesToTry = [];
  if (entry.source) {
    sourcesToTry.push(entry.source);
  }
  const fallbackSource = entry.sources?.[LANGUAGE_FALLBACK];
  if (fallbackSource && fallbackSource !== entry.source) {
    sourcesToTry.push(fallbackSource);
  }

  let markdown = null;
  for (let i = 0; i < sourcesToTry.length; i += 1) {
    const source = sourcesToTry[i];
    try {
      const response = await fetch(source);
      if (response.ok) {
        markdown = await response.text();
        break;
      }
    } catch (error) {
      // ignore and try fallback
    }
  }

  if (!markdown) {
    statusElement.textContent = dictionary.status.error;
    const errorMessage = document.createElement('p');
    errorMessage.className = 'document-status';
    errorMessage.textContent = dictionary.status.error;
    contentElement.innerHTML = '';
    contentElement.appendChild(errorMessage);
    return;
  }

  const html = window.marked.parse(markdown, { breaks: true, gfm: true });
  contentElement.innerHTML = html;
  applyMathFormatting(contentElement);
  const firstHeading = contentElement.querySelector('h1');
  if (firstHeading) {
    firstHeading.remove();
  }
  statusElement.textContent = '';
}

function updateMeta(entry, lang) {
  const dictionary = getDictionary(lang);
  if (metaDescription) {
    const description = entry?.description || dictionary.hero.description;
    const title = entry?.title || dictionary.documentTitle;
    metaDescription.setAttribute('content', `${title}${description ? ` · ${description}` : ''}`);
  }
  const baseTitle = dictionary.documentTitle || getDictionary(LANGUAGE_FALLBACK).documentTitle;
  if (baseTitle) {
    document.title = entry?.title ? `${entry.title} · ${baseTitle}` : baseTitle;
  }
  if (titleElement) {
    titleElement.textContent = entry?.title || dictionary.hero.title;
  }
}

function updateHistory() {
  const url = new URL(window.location.href);
  if (state.entryId) {
    url.searchParams.set('doc', state.entryId);
  } else {
    url.searchParams.delete('doc');
  }
  url.searchParams.set('lang', state.language);
  window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}`);
}

function setEntry(entryId) {
  state.entryId = entryId;
  updateHistory();
  renderSidebar(state.language);
  const baseEntry = researchEntries.find((entry) => entry.id === state.entryId) || researchEntries[0];
  const localized = getLocalizedEntry(baseEntry, state.language);
  renderAbstract(state.language, localized);
  updateMeta(localized, state.language);
  renderDocument(state.language, localized);
}

function applyLanguage(lang) {
  const resolved = SUPPORTED_LANGUAGES.includes(lang) ? lang : LANGUAGE_FALLBACK;
  state.language = resolved;
  window.localStorage.setItem('earth-online-language', resolved);
  applyStaticText(resolved);
  renderEntryCount(resolved);
  if (languageSelect) {
    languageSelect.value = resolved;
  }
  const baseEntry = researchEntries.find((entry) => entry.id === state.entryId) || researchEntries[0];
  const localized = getLocalizedEntry(baseEntry, resolved);
  renderSidebar(resolved);
  renderAbstract(resolved, localized);
  updateMeta(localized, resolved);
  renderDocument(resolved, localized);
  updateHistory();
}

function handleLanguageToggle() {
  if (!languageSelect) return;
  languageSelect.addEventListener('change', (event) => {
    applyLanguage(event.target.value);
  });
}

function handleNavigation() {
  const nav = document.getElementById('primary-nav');
  const toggle = document.getElementById('nav-toggle');
  if (!nav || !toggle) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', String(!isOpen));
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
  nav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      nav.setAttribute('data-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
    });
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
  handleLanguageToggle();
  const storedLanguage = window.localStorage.getItem('earth-online-language');
  if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    state.language = storedLanguage;
  }
  applyLanguage(state.language);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
