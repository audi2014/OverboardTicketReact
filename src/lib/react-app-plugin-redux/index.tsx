import { TypesBasePlugin } from 'lib/react-app-plugin/types';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';

export type PluginTypes = TypesBasePlugin<
  {
    store: Store;
  },
  {
    store: Store;
  }
>;

export const ReactAppPluginRedux: PluginTypes['Plugin'] = (
  config,
): PluginTypes['PluginModule'] => {
  const build: PluginTypes['InstanceBuilder'] = () => {
    const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
      return <Provider store={config.store}>{children}</Provider>;
    };
    const injections: PluginTypes['AppInjections'] = {
      onDidMountAsyncRace: [],
      onDidMountAsyncSequence: [],
      onDidMountSync: [],
      onInit: [],
      onWillUnmount: [],
      wrappers: [Wrapper],
    };
    return {
      exports: config,
      injections,
    };
  };

  return {
    name: 'react-app-plugin-redux',
    version: '0.0.0',
    requireBeforeBuild: [],
    build,
  };
};
