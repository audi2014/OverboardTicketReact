import 'assets/css/index.css';
import 'assets/css/App.css';

import { initPlugins } from 'lib/react-app-plugin';
import { ReactAppPluginReactI18next } from 'lib/react-app-plugin-react-i18next';
import { ReactAppPluginRedux } from 'lib/react-app-plugin-redux';
import { ReactAppPluginReduxPreloaded } from 'lib/react-app-plugin-redux-preloaded';
import { ReactAppPluginSuspense } from 'lib/react-app-plugin-suspense';

import * as integrationI18next from './i18next';
import * as integrationRedux from './redux/store';

export const {
  Wrapper: AppIntegrationWrapper,
  context,
  container,
} = initPlugins([
  new ReactAppPluginSuspense(),
  new ReactAppPluginReactI18next(integrationI18next.i18n),
  new ReactAppPluginReduxPreloaded({
    getStateBeforeSave: async () => container.get(ReactAppPluginRedux).store?.getState(),
  }),
  new ReactAppPluginRedux({
    createStore: integrationRedux.createStore,
    PreloadedStateProvider: ReactAppPluginReduxPreloaded,
  }),
]);
