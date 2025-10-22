import { getFriendContent } from './friends-data.js';
import { LANGUAGE_DEFINITIONS, LANGUAGE_FALLBACK, setStoredLanguage } from './i18n/languages.js';
import {
  applyDocumentLanguage,
  createTranslationRegistry,
  resolveTranslation
} from './i18n/registry.js';
import { enhanceLanguageToggle } from './i18n/toggle.js';

const baseTranslations = {
  zh: {
    documentTitle: '友链星港 · Earth Online 体验实验室',
    meta: {
      htmlLang: 'zh-CN',
      direction: 'ltr',
      toggleText: '中文',
      toggleLabel: '选择语言',
      navAria: '主导航',
      brandAria: 'Earth Online 实验室标识',
      actionsAria: '友链操作',
      networkAria: '友链列表'
    },
    language: {
      toggleLabel: '选择语言',
      selectorLabel: '选择语言',
      fallbackTag: '英文内容'
    },
    brand: {
      subtitle: '体验实验室 · Planetary Experience Lab',
      ariaLabel: 'Earth Online 实验室标识'
    },
    primaryNav: {
      ariaLabel: '主导航',
      blog: '博客',
      papers: '论文',
      labs: '实验室',
      friends: '友链'
    },
    hero: {
      eyebrow: 'Alliance Network',
      title: '友链星港',
      lead:
        'Earth Online 的伙伴网络不断扩张。我们在这里记录每一位与我们共同探索体验与知识边界的朋友，方便你快速建立链接并开启合作。',
      primaryCta: '申请交换友链',
      secondaryCta: '返回主站',
      actionsAria: '友链操作'
    },
    buttons: {
      visit: '访问主页'
    },
    network: {
      ariaLabel: '友链列表'
    },
    footer: {
      credit: '© 2024 Earth Online Experience Lab · Powered by Aman Sharma',
      note: '欢迎 fork、引用或将实验室成果嵌入你的宇宙级项目。'
    }
  },
  en: {
    documentTitle: 'Alliance Harbor · Earth Online Experience Lab',
    meta: {
      htmlLang: 'en',
      direction: 'ltr',
      toggleText: 'English',
      toggleLabel: 'Select language',
      navAria: 'Primary navigation',
      brandAria: 'Earth Online lab mark',
      actionsAria: 'Alliance actions',
      networkAria: 'Alliance directory'
    },
    language: {
      toggleLabel: 'Select language',
      selectorLabel: 'Select language',
      fallbackTag: 'English content'
    },
    brand: {
      subtitle: 'Planetary Experience Lab',
      ariaLabel: 'Earth Online lab mark'
    },
    primaryNav: {
      ariaLabel: 'Primary navigation',
      blog: 'Blog',
      papers: 'Research',
      labs: 'Labs',
      friends: 'Friends'
    },
    hero: {
      eyebrow: 'Alliance Network',
      title: 'Alliance Harbor',
      lead:
        'Earth Online’s partner network keeps expanding. Discover collaborators exploring the boundaries of experience and knowledge, and open a new line together.',
      primaryCta: 'Request a link exchange',
      secondaryCta: 'Return to main site',
      actionsAria: 'Alliance actions'
    },
    buttons: {
      visit: 'Visit site'
    },
    network: {
      ariaLabel: 'Alliance directory'
    },
    footer: {
      credit: '© 2024 Earth Online Experience Lab · Powered by Aman Sharma',
      note: 'Feel free to fork, cite, or embed these experiments into your interstellar project.'
    }
  }
};

const translationRegistry = createTranslationRegistry(baseTranslations, {
  localizedLanguageCodes: ['en', 'zh']
});

const translations = translationRegistry.dictionaries;
let languageToggleBinding = null;

function getTranslation(lang) {
  return translationRegistry.get(lang);
}

function getLocalizedValue(lang, keyPath) {
  return translationRegistry.resolve(lang, keyPath);
}

function isFallbackLanguage(lang) {
  return translationRegistry.isFallback(lang);
}

function determineLanguage() {
  return translationRegistry.determineLanguage();
}

const state = {
  language: determineLanguage()
};

const createTagList = (tags = []) =>
  tags
    .map((tag) => `<li>${tag}</li>`)
    .join('');

function createFriendCard(friend, visitLabel, { variant = 'standard' } = {}) {
  const card = document.createElement('article');
  const description = friend.description || friend.slogan || '';
  const note = friend.note ? `<p class="alliance-card__note">${friend.note}</p>` : '';
  const tags = createTagList(friend.tags || []);

  const classes = ['alliance-card', 'alliance-card--detailed'];
  if (variant === 'featured') {
    classes.push('alliance-card--featured');
  }
  card.className = classes.join(' ');

  card.innerHTML = `
    <h3>${friend.name}</h3>
    ${description ? `<p>${description}</p>` : ''}
    ${note}
    ${tags ? `<ul>${tags}</ul>` : ''}
    <a href="${friend.url}" target="_blank" rel="noopener noreferrer">
      ${visitLabel}
      <span aria-hidden="true">↗</span>
    </a>
  `;

  return card;
}

function createFeaturedSection(featured, visitLabel) {
  const section = document.createElement('section');
  section.className = 'friend-featured';

  const layout = document.createElement('div');
  layout.className = 'friend-featured__layout';

  const meta = document.createElement('div');
  meta.className = 'friend-featured__meta';

  if (featured.badge) {
    const badge = document.createElement('p');
    badge.className = 'friend-featured__badge';
    badge.textContent = featured.badge;
    meta.appendChild(badge);
  }

  const title = document.createElement('h2');
  title.className = 'friend-featured__title';
  title.textContent = featured.title;
  meta.appendChild(title);

  if (featured.summary) {
    const summary = document.createElement('p');
    summary.className = 'friend-featured__summary';
    summary.textContent = featured.summary;
    meta.appendChild(summary);
  }

  layout.appendChild(meta);
  layout.appendChild(createFriendCard(featured.friend, visitLabel, { variant: 'featured' }));

  section.appendChild(layout);
  return section;
}

function createClusterSection(cluster, visitLabel) {
  const section = document.createElement('section');
  section.className = 'friend-cluster';

  const header = document.createElement('header');
  header.className = 'friend-cluster__header';

  const title = document.createElement('h2');
  title.className = 'friend-cluster__title';
  title.textContent = cluster.title;
  header.appendChild(title);

  if (cluster.summary) {
    const summary = document.createElement('p');
    summary.className = 'friend-cluster__summary';
    summary.textContent = cluster.summary;
    header.appendChild(summary);
  }

  const grid = document.createElement('div');
  grid.className = 'friend-cluster__grid alliance-grid';

  (cluster.friends || []).forEach((friend) => {
    grid.appendChild(createFriendCard(friend, visitLabel));
  });

  section.appendChild(header);
  section.appendChild(grid);

  return section;
}

function renderFriendNetwork(lang) {
  const grid = document.getElementById('friend-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  const { featured, clusters } = getFriendContent(lang).friendNetwork;
  const visitLabel =
    getLocalizedValue(lang, 'buttons.visit') ||
    getLocalizedValue(LANGUAGE_FALLBACK, 'buttons.visit') ||
    'Visit site';

  if (featured) {
    fragment.appendChild(createFeaturedSection(featured, visitLabel));
  }

  (clusters || []).forEach((cluster) => {
    fragment.appendChild(createClusterSection(cluster, visitLabel));
  });

  grid.appendChild(fragment);
}

function updateStaticText(lang) {
  const dictionary = getTranslation(lang);
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    const value = resolveTranslation(dictionary, key, translations[LANGUAGE_FALLBACK]);
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
      const value = resolveTranslation(dictionary, key, translations[LANGUAGE_FALLBACK]);
      if (typeof value === 'string') {
        element.setAttribute(attr, value);
      }
    });
  });
}

function updateMeta(lang) {
  const translation = getTranslation(lang);
  const fallbackTranslation = getTranslation(LANGUAGE_FALLBACK);
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

function applyLanguage(lang) {
  state.language = lang;
  setStoredLanguage(lang);

  updateMeta(lang);
  updateStaticText(lang);
  updateLanguageSelector(lang);
  renderFriendNetwork(lang);
}

function initialize() {
  applyLanguage(state.language);
}

initialize();
