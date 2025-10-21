export const STORAGE_KEY = 'earth-online-language';

export const LANGUAGE_FALLBACK = 'en';

export const LANGUAGE_DEFINITIONS = [
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

export const SUPPORTED_LANGUAGE_CODES = new Set(
  LANGUAGE_DEFINITIONS.map((definition) => definition.code)
);

export function normaliseLanguageCode(code) {
  if (!code) return '';
  return String(code).toLowerCase();
}

export function getStoredLanguage(storageKey = STORAGE_KEY) {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? normaliseLanguageCode(stored) : '';
  } catch (error) {
    return '';
  }
}

export function setStoredLanguage(code, storageKey = STORAGE_KEY) {
  try {
    if (!code) {
      localStorage.removeItem(storageKey);
      return;
    }
    localStorage.setItem(storageKey, normaliseLanguageCode(code));
  } catch (error) {
    // Ignore storage errors to keep the UI resilient in strict privacy contexts.
  }
}

export function determinePreferredLanguage({
  hasLanguage = (code) => SUPPORTED_LANGUAGE_CODES.has(code),
  storageKey = STORAGE_KEY,
  fallback = LANGUAGE_FALLBACK
} = {}) {
  const stored = getStoredLanguage(storageKey);
  if (stored && hasLanguage(stored)) {
    return stored;
  }

  const browser = normaliseLanguageCode(navigator.language || navigator.userLanguage || fallback);
  if (browser && hasLanguage(browser)) {
    return browser;
  }

  const exactMatch = LANGUAGE_DEFINITIONS.find((definition) => browser === definition.code);
  if (exactMatch && hasLanguage(exactMatch.code)) {
    return exactMatch.code;
  }

  const regionalMatch = LANGUAGE_DEFINITIONS.find((definition) =>
    browser.startsWith(`${definition.code}-`) && hasLanguage(definition.code)
  );
  if (regionalMatch) {
    return regionalMatch.code;
  }

  const [primary] = browser.split('-');
  if (hasLanguage(primary)) {
    return primary;
  }

  return fallback;
}
