import { createInstance } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { ReactI18nextInContextEditor } from 'lib/react-i18next-in-context-editor/client';
import { initReactI18next } from 'react-i18next';

const isDebug = import.meta.env.MODE === 'development';
const defaultLanguage = import.meta.env.VITE_I18NEXT_DEFAULT_LNG;
export const i18nInstance = createInstance();

// https://react.i18next.com/latest/using-with-hooks#configure-i18next

export const i18nInitialization = i18nInstance
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  .use(new ReactI18nextInContextEditor({ i18n: i18nInstance }))
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    defaultNS: 'common',
    fallbackLng: defaultLanguage,
    debug: isDebug,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    postProcess: [ReactI18nextInContextEditor.getName()],
  });
