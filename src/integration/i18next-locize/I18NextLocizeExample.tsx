import { i18n } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type LocalizeLanguage = {
  isReferenceLanguage: boolean;
  name: string;
  nativeName: string;
  translated: Record<string, number>;
};
type LocalizeGetLanguagesResponse = Record<string, LocalizeLanguage>;

export const useBackendLanguages = (i18n: i18n) => {
  const [response, setResponse] = useState<LocalizeGetLanguagesResponse>();
  useEffect(() => {
    if (!i18n?.services?.backendConnector?.backend?.getLanguages) return;
    i18n.services.backendConnector.backend.getLanguages(
      (err: Error, response: LocalizeGetLanguagesResponse) => {
        if (err) {
          console.log(err);
          return;
        }
        setResponse(response);
      },
    );
  }, [i18n]);
  return response;
};

export const I18NextLocizeExample = () => {
  const { t, i18n } = useTranslation('common');
  const languages = useBackendLanguages(i18n);

  return (
    <fieldset>
      <h3>{I18NextLocizeExample.name}</h3>
      <br />
      {!languages ? <h1>{t('loading')}</h1> : null}
      {Object.entries(languages ?? {}).map(([lng, data]) => (
        <button
          key={lng}
          onClick={() => i18n.changeLanguage(lng)}
          style={{ color: lng === i18n.language ? 'red' : undefined }}
        >
          {data.nativeName.toUpperCase()}
        </button>
      ))}
      <br />
      <pre>
        <code>{JSON.stringify(languages, null, 2)}</code>
      </pre>
    </fieldset>
  );
};
