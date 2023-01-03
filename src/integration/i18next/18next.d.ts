import 'i18next';

import * as translation from '../../../public/locales/en/translation.json';

// https://react.i18next.com/latest/typescript
declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: 'translation';
    resources: {
      translation: typeof translation;
    };
  }
}
