import { LANGUAGE_FALLBACK, SUPPORTED_LANGUAGE_CODES } from './languages.js';
import { populateLanguageSelect } from './registry.js';

const noopBinding = {
  update() {},
  destroy() {}
};

export function enhanceLanguageToggle(selectElement, registry, { onChange } = {}) {
  if (!selectElement || !registry) {
    return noopBinding;
  }

  const fallback = registry?.fallback || LANGUAGE_FALLBACK;

  const handleChange = (event) => {
    const nextValue = event.target?.value;
    const proposed = SUPPORTED_LANGUAGE_CODES.has(nextValue) ? nextValue : fallback;
    const resolved = registry.has(proposed) ? proposed : fallback;
    if (typeof onChange === 'function') {
      onChange(resolved);
    }
  };

  selectElement.addEventListener('change', handleChange);

  const binding = {
    update(activeLanguage) {
      const lang = registry.has(activeLanguage) ? activeLanguage : fallback;
      populateLanguageSelect(selectElement, registry, lang);

      const dictionary = registry.get(lang);
      const direction = dictionary?.meta?.direction || 'ltr';
      const htmlLang = dictionary?.meta?.htmlLang || dictionary?.meta?.lang || lang;

      selectElement.setAttribute('dir', direction);
      selectElement.setAttribute('lang', htmlLang);
      selectElement.dataset.language = lang;
    },
    destroy() {
      selectElement.removeEventListener('change', handleChange);
    }
  };

  return binding;
}

