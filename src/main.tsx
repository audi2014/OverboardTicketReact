import 'assets/css/index.css';

import { App } from 'App';
import initPlugins from 'lib/react-app-plugin';
import { ReactAppPluginDom } from 'lib/react-app-plugin-dom';
import { ReactAppPluginReactI18next } from 'lib/react-app-plugin-react-i18next';
import { ReactAppPluginRedux } from 'lib/react-app-plugin-redux';
import { ReactAppPluginPreloadedState } from 'lib/react-app-plugin-redux-preloaded';
import { ReactAppPluginSuspense } from 'lib/react-app-plugin-suspense';

import * as integrationI18next from './integration/i18next';
// import * as integrationI18next from './integration/i18next-locize';
import * as integrationRedux from './integration/redux/store';

export const { Wrapper, context, container, eventBuss, observable } = initPlugins([
  new ReactAppPluginDom({ elementId: 'root', App, loader: 'loader', strictMode: true }),
  new ReactAppPluginSuspense(),
  new ReactAppPluginReactI18next(integrationI18next.i18nInstance),
  new ReactAppPluginPreloadedState({
    getStateBeforeSave: async () => container.get(ReactAppPluginRedux).store?.getState(),
  }),
  new ReactAppPluginRedux({
    createStore: integrationRedux.createStore,
    PreloadedStateProvider: ReactAppPluginPreloadedState,
  }),
]);
