import { LANGUAGE_FALLBACK, setStoredLanguage } from './i18n/languages.js';
import {
  applyDocumentLanguage,
  createTranslationRegistry,
  resolveTranslation
} from './i18n/registry.js';
import { enhanceLanguageToggle } from './i18n/toggle.js';
import { researchEntries } from './research-data.js';

const baseTranslations = {
  en: {
    documentTitle: 'Earth Online Research Library',
    meta: {
      htmlLang: 'en',
      direction: 'ltr',
      toggleLabel: 'Select language'
    },
    language: {
      toggleLabel: 'Select language',
      selectorLabel: 'Select language',
      fallbackTag: 'English content'
    },
    header: {
      back: '← Return to Earth Online',
      backAria: 'Return to the Earth Online homepage',
      eyebrow: 'Research Library'
    },
    sidebar: {
      ariaLabel: 'Research index',
      title: 'Research Index',
      description: 'Browse all research papers and lab blueprints, or explore other assets in the experience decks.'
    },
    status: {
      loading: 'Loading research manuscript…',
      error: 'Unable to load the document. Please try again later.'
    },
    abstract: {
      label: 'Research Overview'
    }
  },
  zh: {
    documentTitle: 'Earth Online 研究文稿',
    meta: {
      htmlLang: 'zh-CN',
      direction: 'ltr',
      toggleLabel: '选择语言'
    },
    language: {
      toggleLabel: '选择语言',
      selectorLabel: '选择语言',
      fallbackTag: '英文内容'
    },
    header: {
      back: '← 返回 Earth Online',
      backAria: '返回 Earth Online 首页',
      eyebrow: '研究文稿库'
    },
    sidebar: {
      ariaLabel: '研究论文索引',
      title: '研究索引',
      description: '浏览所有研究论文与实验室蓝图，或前往体验簇探索其他资产。'
    },
    status: {
      loading: '正在加载研究文稿…',
      error: '暂时无法加载文稿，请稍后再试。'
    },
    abstract: {
      label: '研究摘要'
    }
  }
};

const translationRegistry = createTranslationRegistry(baseTranslations, {
  localizedLanguageCodes: ['en', 'zh']
});

const params = new URLSearchParams(window.location.search);
const requestedId = params.get('doc');
const requestedLang = params.get('lang');

const initialEntry = researchEntries.find((entry) => entry.id === requestedId) || researchEntries[0];
const initialLanguage = translationRegistry.has(requestedLang)
  ? requestedLang
  : translationRegistry.determineLanguage();

const state = {
  language: initialLanguage,
  entryId: initialEntry?.id || null
};

const titleElement = document.getElementById('document-title');
const abstractElement = document.getElementById('document-abstract');
const contentElement = document.getElementById('document-content');
const sidebarListElement = document.getElementById('document-sidebar-list');
const metaDescription = document.querySelector('meta[name="description"]');
const statusElement = document.createElement('p');
statusElement.className = 'document-status';

let languageToggleBinding = null;

function getLocalizedEntry(entry, lang) {
  if (!entry) return null;
  const dictionary = entry.translations || {};
  const fallbackTranslation = dictionary[LANGUAGE_FALLBACK] || {};
  const localized = dictionary[lang] || fallbackTranslation;
  const sources = entry.sources || {};
  return {
    id: entry.id,
    source: sources[lang] || sources[LANGUAGE_FALLBACK],
    title: localized.title || fallbackTranslation.title || entry.id,
    description: localized.description || fallbackTranslation.description || '',
    sources
  };
}

function getLocalizedEntries(lang) {
  return researchEntries
    .map((entry) => getLocalizedEntry(entry, lang))
    .filter(Boolean);
}

function updateStaticContent(lang) {
  const dictionary = translationRegistry.get(lang);
  const fallbackDictionary = translationRegistry.get(LANGUAGE_FALLBACK);

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    const value = resolveTranslation(dictionary, key, fallbackDictionary);
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
      const value = resolveTranslation(dictionary, key, fallbackDictionary);
      if (typeof value === 'string') {
        element.setAttribute(attr, value);
      }
    });
  });
}

function updateMeta(lang) {
  const translation = translationRegistry.get(lang);
  const fallbackTranslation = translationRegistry.get(LANGUAGE_FALLBACK);
  applyDocumentLanguage(translation);
  const title = translation.documentTitle || fallbackTranslation.documentTitle || document.title;
  document.title = title;
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

function renderSidebar(lang, activeId) {
  if (!sidebarListElement) return;
  sidebarListElement.innerHTML = '';
  const entries = getLocalizedEntries(lang);
  entries.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'document-sidebar__item';

    const link = document.createElement('a');
    link.href = `research.html?doc=${entry.id}&lang=${lang}`;
    link.className = 'document-sidebar__link';
    const isActive = entry.id === activeId;
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
}

function renderAbstract(lang, entry) {
  if (!abstractElement) return;
  abstractElement.innerHTML = '';
  const dictionary = translationRegistry.get(lang);
  const fallbackDictionary = translationRegistry.get(LANGUAGE_FALLBACK);
  const labelText =
    resolveTranslation(dictionary, 'abstract.label', fallbackDictionary) ||
    resolveTranslation(fallbackDictionary, 'abstract.label') ||
    'Research Overview';

  const label = document.createElement('p');
  label.className = 'document-abstract__label';
  label.textContent = labelText;

  const description = document.createElement('p');
  description.className = 'document-abstract__description';
  description.textContent = entry?.description || '';

  abstractElement.appendChild(label);
  abstractElement.appendChild(description);
}

function showStatus(lang, key) {
  const dictionary = translationRegistry.get(lang);
  const fallbackDictionary = translationRegistry.get(LANGUAGE_FALLBACK);
  const message =
    resolveTranslation(dictionary, `status.${key}`, fallbackDictionary) ||
    resolveTranslation(fallbackDictionary, `status.${key}`) ||
    '';
  contentElement.innerHTML = '';
  statusElement.textContent = message;
  contentElement.appendChild(statusElement);
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
  if (!entry) {
    showStatus(lang, 'error');
    return;
  }

  showStatus(lang, 'loading');

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
      // ignore fetch errors, try fallback
    }
  }

  if (!markdown) {
    showStatus(lang, 'error');
    return;
  }

  const html = window.marked.parse(markdown, { breaks: true, gfm: true });
  contentElement.innerHTML = html;
  applyMathFormatting(contentElement);

  const firstHeading = contentElement.querySelector('h1');
  if (firstHeading) {
    firstHeading.remove();
  }

  contentElement.querySelectorAll('table').forEach((table) => {
    table.classList.add('document-table');
    table.setAttribute('role', 'table');
  });
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

function applyLanguage(lang) {
  const resolved = translationRegistry.has(lang) ? lang : LANGUAGE_FALLBACK;
  state.language = resolved;
  setStoredLanguage(resolved);

  updateStaticContent(resolved);
  updateMeta(resolved);
  updateLanguageSelector(resolved);

  const baseEntry = researchEntries.find((entry) => entry.id === state.entryId) || researchEntries[0];
  const localizedEntry = getLocalizedEntry(baseEntry, resolved);

  if (titleElement) {
    titleElement.textContent = localizedEntry?.title || '';
  }
  if (metaDescription) {
    const descriptionText = localizedEntry?.description || '';
    const pageTitle = localizedEntry?.title || '';
    metaDescription.setAttribute('content', `${pageTitle}${descriptionText ? ` · ${descriptionText}` : ''}`);
  }

  renderSidebar(resolved, localizedEntry?.id || null);
  renderAbstract(resolved, localizedEntry);
  renderDocument(resolved, localizedEntry);
  updateHistory();
}

applyLanguage(state.language);
