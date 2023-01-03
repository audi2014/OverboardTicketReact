import 'assets/css/index.css';
import 'assets/css/App.css';

// import { persistParams } from 'integration/persist';
// import { store } from 'integration/redux/store';
import { initPlugins } from 'lib/react-app-plugin';
// import { ReactAppPluginPersist } from 'lib/react-app-plugin-persist';
import { ReactAppPluginReactI18next } from 'lib/react-app-plugin-react-i18next';
// import { ReactAppPluginRedux } from 'lib/react-app-plugin-redux';
import { ReactAppPluginSuspense } from 'lib/react-app-plugin-suspense';

import { i18n } from './i18next';

export const { Wrapper: AppIntegrationWrapper, context } = initPlugins([
  new ReactAppPluginSuspense(),
  new ReactAppPluginReactI18next(i18n),
  // new ReactAppPluginRedux(store),
  // new ReactAppPluginPersist(persistParams),
]);
