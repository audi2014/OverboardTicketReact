import { createInstance } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const isDebug = import.meta.env.MODE === 'development';
const defaultLanguage = import.meta.env.VITE_I18NEXT_DEFAULT_LNG;
export const i18nInstance = createInstance();

export const i18nInitialization = i18nInstance
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS: 'common',
    fallbackLng: defaultLanguage,
    debug: isDebug,
    interpolation: {
      escapeValue: false,
    },
  });
