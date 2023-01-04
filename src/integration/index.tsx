import 'assets/css/index.css';
import 'assets/css/App.css';

import { initPlugins } from 'lib/react-app-plugin';
// import { ReactAppPluginPersist } from 'lib/react-app-plugin-persist';
import { ReactAppPluginReactI18next } from 'lib/react-app-plugin-react-i18next';
import { ReactAppPluginRedux } from 'lib/react-app-plugin-redux';
import { ReactAppPluginSuspense } from 'lib/react-app-plugin-suspense';

import * as integrationI18next from './i18next';
// import { persistParams } from './persist';
import * as integrationRedux from './redux/store';

export const { Wrapper: AppIntegrationWrapper, context } = initPlugins([
  new ReactAppPluginSuspense(),
  new ReactAppPluginReactI18next(integrationI18next.i18n),
  new ReactAppPluginRedux({
    createStore: integrationRedux.createStore,
    preloadedStateProvider: {
      getPreloadedState: async () => {
        return new Promise((r) => {
          setTimeout(() => {
            r({
              counter: {
                value: 20,
              },
            });
          }, 2000);
        });
      },
    },
  }),
  // new ReactAppPluginPersist(persistParams),
]);
