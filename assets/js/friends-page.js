import { getFriendContent } from './friends-data.js';

const STORAGE_KEY = 'earth-online-language';

const translations = {
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
      selectorLabel: '选择语言'
    },
    brand: {
      subtitle: '体验实验室 · Planetary Experience Lab',
      ariaLabel: 'Earth Online 实验室标识'
    },
    nav: {
      home: '主页',
      labs: '实验矩阵',
      alliances: '友链星港',
      contact: '联络站',
      ariaLabel: '主导航'
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
      selectorLabel: 'Select language'
    },
    brand: {
      subtitle: 'Planetary Experience Lab',
      ariaLabel: 'Earth Online lab mark'
    },
    nav: {
      home: 'Home',
      labs: 'Lab Matrix',
      alliances: 'Alliance Harbor',
      contact: 'Contact',
      ariaLabel: 'Primary navigation'
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

const LANGUAGE_DEFINITIONS = [
  { code: 'en', label: 'English', htmlLang: 'en', direction: 'ltr' },
  { code: 'zh', label: '中文', htmlLang: 'zh-CN', direction: 'ltr' },
  { code: 'es', label: 'Español', htmlLang: 'es', direction: 'ltr' },
  { code: 'fr', label: 'Français', htmlLang: 'fr', direction: 'ltr' },
  { code: 'de', label: 'Deutsch', htmlLang: 'de', direction: 'ltr' },
  { code: 'ja', label: '日本語', htmlLang: 'ja', direction: 'ltr' },
  { code: 'pt', label: 'Português', htmlLang: 'pt', direction: 'ltr' },
  { code: 'ru', label: 'Русский', htmlLang: 'ru', direction: 'ltr' },
  { code: 'hi', label: 'हिन्दी', htmlLang: 'hi', direction: 'ltr' },
  { code: 'ar', label: 'العربية', htmlLang: 'ar', direction: 'rtl' }
];

const LANGUAGE_FALLBACK = 'en';

const SUPPORTED_LANGUAGE_CODES = new Set(
  LANGUAGE_DEFINITIONS.map((definition) => definition.code)
);

LANGUAGE_DEFINITIONS.forEach((definition) => {
  if (definition.code === 'en' || definition.code === 'zh') {
    const existing = translations[definition.code];
    if (existing) {
      existing.meta.htmlLang = definition.htmlLang;
      existing.meta.direction = definition.direction || existing.meta.direction || 'ltr';
      existing.meta.toggleText = definition.label;
      if (existing.language) {
        existing.language.selectorLabel =
          existing.language.selectorLabel || existing.language.toggleLabel || existing.meta.toggleLabel;
      } else {
        existing.language = {
          toggleLabel: existing.meta.toggleLabel,
          selectorLabel: existing.meta.toggleLabel
        };
      }
    }
    return;
  }

  const clone = JSON.parse(JSON.stringify(translations.en));
  clone.meta.htmlLang = definition.htmlLang;
  clone.meta.direction = definition.direction || 'ltr';
  clone.meta.toggleText = definition.label;
  clone.meta.toggleLabel = translations.en.language?.selectorLabel || 'Select language';
  clone.language = clone.language || {};
  clone.language.toggleLabel = clone.meta.toggleLabel;
  clone.language.selectorLabel = translations.en.language?.selectorLabel || 'Select language';
  translations[definition.code] = clone;
});

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
    // ignore storage issues
  }
  const browser = (navigator.language || LANGUAGE_FALLBACK).toLowerCase();
  const exact = LANGUAGE_DEFINITIONS.find((definition) => browser === definition.code);
  if (exact) return exact.code;

  const matched = LANGUAGE_DEFINITIONS.find((definition) => browser.startsWith(`${definition.code}-`));
  if (matched) return matched.code;

  const primary = browser.split('-')[0];
  if (SUPPORTED_LANGUAGE_CODES.has(primary)) {
    return primary;
  }

  return LANGUAGE_FALLBACK;
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
  const visitLabel = translations[lang].buttons.visit;

  if (featured) {
    fragment.appendChild(createFeaturedSection(featured, visitLabel));
  }

  (clusters || []).forEach((cluster) => {
    fragment.appendChild(createClusterSection(cluster, visitLabel));
  });

  grid.appendChild(fragment);
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

function updateMeta(lang) {
  const meta = translations[lang].meta;
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.direction || 'ltr';
  document.title = translations[lang].documentTitle;
}

function updateLanguageSelector(lang) {
  const select = document.getElementById('friends-language-toggle');
  if (!select) return;

  select.innerHTML = '';
  LANGUAGE_DEFINITIONS.forEach((definition) => {
    const option = document.createElement('option');
    option.value = definition.code;
    option.textContent = definition.label;
    select.appendChild(option);
  });

  const selected = SUPPORTED_LANGUAGE_CODES.has(lang) ? lang : LANGUAGE_FALLBACK;
  select.value = selected;

  const translation = translations[selected];
  const labelText =
    translation?.language?.selectorLabel ||
    translation?.language?.toggleLabel ||
    translation?.meta?.toggleLabel ||
    'Select language';

  select.setAttribute('aria-label', labelText);
  select.setAttribute('title', labelText);
}

function applyLanguage(lang) {
  state.language = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    // ignore storage failures
  }

  updateMeta(lang);
  updateStaticText(lang);
  updateLanguageSelector(lang);
  renderFriendNetwork(lang);
}

function initialize() {
  applyLanguage(state.language);

  const toggle = document.getElementById('friends-language-toggle');
  if (toggle) {
    toggle.addEventListener('change', (event) => {
      const nextLang = event.target?.value;
      const resolved = SUPPORTED_LANGUAGE_CODES.has(nextLang) ? nextLang : LANGUAGE_FALLBACK;
      if (translations[resolved]) {
        applyLanguage(resolved);
      }
    });
  }
}

initialize();
