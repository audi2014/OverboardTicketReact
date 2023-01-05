import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages = ['en', 'uk'];
export const I18NextExample = () => {
  const { t, i18n } = useTranslation([
    'common',
    'validation',
    'i18NextExample',
    // 'glossary is required for interpolationPlural nesting https://www.i18next.com/translation-function/nesting#basic
    'glossary',
  ]);
  const [count, setCount] = useState(0);

  const addRender = () => {
    if (count >= 10) {
      alert(t('toManyRenders', { ns: 'validation' }));
      return setCount(-10);
    }
    setCount((count) => count + 1);
  };

  return (
    <fieldset>
      <h3>{I18NextExample.name}</h3>
      <a href={'https://www.i18next.com/translation-function/interpolation'}>
        https://www.i18next.com/translation-function/interpolation
      </a>
      <br />
      <h6>{t('formattingDate', { date: new Date(0), ns: 'common' })}</h6>
      <button onClick={addRender}>
        {t('interpolationPlural', { count, ns: 'i18NextExample' })}
      </button>
      <br />
      {languages.map((lng) => (
        <button
          key={lng}
          onClick={() => i18n.changeLanguage(lng)}
          style={{ color: lng === i18n.language ? 'red' : undefined }}
        >
          {lng.toUpperCase()}
        </button>
      ))}
      <br />
      <pre>
        <code>{JSON.stringify(languages, null, 2)}</code>
      </pre>
    </fieldset>
  );
};
