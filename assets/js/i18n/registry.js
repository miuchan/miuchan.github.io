import {
  LANGUAGE_DEFINITIONS,
  LANGUAGE_FALLBACK,
  determinePreferredLanguage
} from './languages.js';

function cloneDeep(value) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function applyDefinitionMetadata(dictionary, definition, fallbackLabel, fallbackToggleLabel) {
  if (!dictionary.meta) {
    dictionary.meta = {};
  }
  dictionary.meta.htmlLang = definition.htmlLang;
  dictionary.meta.direction = definition.direction || dictionary.meta.direction || 'ltr';
  dictionary.meta.toggleText = definition.label;
  dictionary.meta.toggleLabel = dictionary.meta.toggleLabel || fallbackToggleLabel;

  if (!dictionary.language) {
    dictionary.language = {};
  }
  dictionary.language.toggleLabel = dictionary.language.toggleLabel || dictionary.meta.toggleLabel || fallbackToggleLabel;
  dictionary.language.selectorLabel = dictionary.language.selectorLabel || dictionary.language.toggleLabel;
  dictionary.language.fallbackTag = dictionary.language.fallbackTag || fallbackLabel;
}

export function resolveTranslation(dictionary, keyPath, fallbackDictionary) {
  if (!dictionary || !keyPath) return undefined;
  const keys = keyPath.split('.');
  const traverse = (source) =>
    keys.reduce((acc, key) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
        return acc[key];
      }
      return undefined;
    }, source);

  const primary = traverse(dictionary);
  if (primary !== undefined) {
    return primary;
  }

  if (!fallbackDictionary || fallbackDictionary === dictionary) {
    return undefined;
  }

  return traverse(fallbackDictionary);
}

export function createTranslationRegistry(baseTranslations, {
  localizedLanguageCodes = Object.keys(baseTranslations || {}),
  fallback = LANGUAGE_FALLBACK
} = {}) {
  if (!baseTranslations || typeof baseTranslations !== 'object') {
    throw new Error('createTranslationRegistry: baseTranslations must be an object.');
  }

  if (!baseTranslations[fallback]) {
    throw new Error(`createTranslationRegistry: missing fallback dictionary for "${fallback}".`);
  }

  const localizedSet = new Set(localizedLanguageCodes);
  const dictionaries = {};

  const fallbackDictionary = cloneDeep(baseTranslations[fallback]);
  const fallbackLabel =
    fallbackDictionary?.language?.fallbackTag ||
    fallbackDictionary?.meta?.fallbackTag ||
    'English content';
  const fallbackToggleLabel =
    fallbackDictionary?.language?.selectorLabel ||
    fallbackDictionary?.language?.toggleLabel ||
    fallbackDictionary?.meta?.toggleLabel ||
    'Select language';

  const normaliseDictionary = (code, dictionary) => {
    const clone = cloneDeep(dictionary);
    clone.__languageCode = code;
    clone.__isFallback = !localizedSet.has(code);
    if (!clone.meta) {
      clone.meta = {};
    }
    clone.meta.toggleLabel = clone.meta.toggleLabel || clone?.language?.selectorLabel || fallbackToggleLabel;
    if (!clone.language) {
      clone.language = {};
    }
    clone.language.toggleLabel = clone.language.toggleLabel || clone.meta.toggleLabel || fallbackToggleLabel;
    clone.language.selectorLabel = clone.language.selectorLabel || clone.language.toggleLabel;
    clone.language.fallbackTag = clone.language.fallbackTag || fallbackLabel;
    return clone;
  };

  Object.entries(baseTranslations).forEach(([code, dictionary]) => {
    dictionaries[code] = normaliseDictionary(code, dictionary);
  });

  LANGUAGE_DEFINITIONS.forEach((definition) => {
    const existing = dictionaries[definition.code];
    if (existing) {
      applyDefinitionMetadata(existing, definition, fallbackLabel, fallbackToggleLabel);
      return;
    }

    const clone = cloneDeep(fallbackDictionary);
    clone.__languageCode = definition.code;
    clone.__isFallback = true;
    applyDefinitionMetadata(clone, definition, fallbackLabel, fallbackToggleLabel);
    dictionaries[definition.code] = clone;
  });

  return {
    fallback,
    dictionaries,
    definitions: LANGUAGE_DEFINITIONS,
    get(lang) {
      return dictionaries[lang] || dictionaries[fallback];
    },
    has(lang) {
      return Boolean(dictionaries[lang]);
    },
    resolve(lang, keyPath) {
      return resolveTranslation(this.get(lang), keyPath, dictionaries[fallback]);
    },
    isFallback(lang) {
      const dictionary = dictionaries[lang];
      return !dictionary || dictionary.__isFallback === true;
    },
    determineLanguage() {
      return determinePreferredLanguage({
        hasLanguage: (code) => Boolean(dictionaries[code]),
        fallback
      });
    }
  };
}

export function applyDocumentLanguage(dictionary) {
  if (!dictionary) return;
  const htmlLang = dictionary?.meta?.htmlLang || dictionary?.meta?.lang || 'en';
  const direction = dictionary?.meta?.direction || 'ltr';
  document.documentElement.lang = htmlLang;
  document.documentElement.dir = direction;
  document.documentElement.setAttribute('data-language', dictionary.__languageCode || htmlLang);
}

export function populateLanguageSelect(selectElement, registry, activeLanguage) {
  if (!selectElement || !registry) return;
  selectElement.innerHTML = '';
  const activeDictionary = registry.get(activeLanguage);
  const fallbackDictionary = registry.get(registry.fallback);
  const fallbackTag =
    resolveTranslation(activeDictionary, 'language.fallbackTag', fallbackDictionary) ||
    resolveTranslation(fallbackDictionary, 'language.fallbackTag') ||
    'English content';

  registry.definitions.forEach((definition) => {
    const option = document.createElement('option');
    option.value = definition.code;
    const dictionary = registry.get(definition.code);
    const fallback = registry.isFallback(definition.code);
    option.textContent = fallback ? `${definition.label} · ${fallbackTag}` : definition.label;
    option.dataset.fallback = String(fallback);
    option.dir = definition.direction || 'ltr';
    selectElement.appendChild(option);
  });

  const selected = registry.has(activeLanguage) ? activeLanguage : registry.fallback;
  selectElement.value = selected;

  const labelText =
    resolveTranslation(activeDictionary, 'language.selectorLabel', fallbackDictionary) ||
    resolveTranslation(activeDictionary, 'language.toggleLabel', fallbackDictionary) ||
    resolveTranslation(fallbackDictionary, 'language.selectorLabel') ||
    resolveTranslation(fallbackDictionary, 'language.toggleLabel') ||
    'Select language';

  selectElement.setAttribute('aria-label', labelText);
  selectElement.setAttribute('title', labelText);
}
