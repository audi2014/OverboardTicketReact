import { Counter } from 'integration/redux/features/counter/Counter';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import reactLogo from './assets/react.svg';

let renders = 0;

export const App = () => {
  const { t, i18n } = useTranslation('translation');
  const [count, setCount] = useState(0);

  return (
    <div className='App'>
      <h1>Renders: {renders++}</h1>
      <Counter />
      <div>
        <a href='https://vitejs.dev' target='_blank' rel='noreferrer'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
        <a href='https://reactjs.org' target='_blank' rel='noreferrer'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button
          onClick={() =>
            /** https://www.i18next.com/translation-function/interpolation */
            setCount((count) => count + 1)
          }
        >
          {t('count is {count}', { count })}
        </button>
        <img src={t('base64Src')} className='logo' alt={'Vite logo'} />
        <button onClick={() => i18n.changeLanguage('en')}>{t('en')}</button>
        <button onClick={() => i18n.changeLanguage('ua')}>{t('ua')}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </div>
  );
};
