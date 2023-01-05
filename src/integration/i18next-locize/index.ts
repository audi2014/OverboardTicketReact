import { createInstance } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { locizePlugin } from 'locize';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import LastUsed from 'locize-lastused';
import { initReactI18next } from 'react-i18next';

const isDebug = import.meta.env.MODE === 'development';
const defaultLanguage = import.meta.env.VITE_I18NEXT_DEFAULT_LNG;
export const i18nInstance = createInstance();

const saveMissing = false;
const locizeOptions = {
  projectId: import.meta.env.VITE_LOCIZE_PROJECTID,
  // The API key should only be used in development, not in production. You should not expose your apps API key to production!!!
  apiKey: import.meta.env.VITE_LOCIZE_APIKEY,
  referenceLng: import.meta.env.VITE_LOCIZE_REFLNG,
  version: import.meta.env.VITE_LOCIZE_VERSION,
};

if (isDebug) {
  // locize-lastused
  // sets a timestamp of last access on every translation segment on locize
  // -> safely remove the ones not being touched for weeks/months
  // https://github.com/locize/locize-lastused
  i18nInstance.use(LastUsed);
}

export const i18nInitialization = i18nInstance
  // i18next-locize-backend
  // loads translations from your project, saves new keys to it (saveMissing: true)
  // https://github.com/locize/i18next-locize-backend
  .use(Backend)
  // locize-editor
  // InContext Editor of locize
  .use(locizePlugin)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  .init({
    defaultNS: 'common',
    debug: isDebug,
    fallbackLng: defaultLanguage,
    saveMissing, // you should not use saveMissing in production
    // keySeparator: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: locizeOptions,
    locizeLastUsed: locizeOptions,
  });
