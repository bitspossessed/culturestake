export const DEFAULT_LOCALE = 'en';
export const LOCALES = ['en'];

const locales = LOCALES.reduce((acc, locale) => {
  acc[locale] = require(`~/common/locales/${locale}.json`);
  return acc;
}, {});

export default locales;
