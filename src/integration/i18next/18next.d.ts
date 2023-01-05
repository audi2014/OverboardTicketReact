import 'i18next';

import * as common from '../../../public/locales/en/common.json';
import * as glossary from '../../../public/locales/en/glossary.json';
import * as i18NextExample from '../../../public/locales/en/i18NextExample.json';
import * as validation from '../../../public/locales/en/validation.json';

// https://react.i18next.com/latest/typescript
declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: 'common';
    resources: {
      common: typeof common;
      glossary: typeof glossary;
      validation: typeof validation;
      i18NextExample: typeof i18NextExample;
    };
  }
}
