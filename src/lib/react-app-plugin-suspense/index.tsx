import { TypesBasePlugin } from 'lib/react-app-plugin/types';
import React from 'react';

export type PluginTypes = TypesBasePlugin<
  {
    Fallback?: React.ComponentType;
  } | void,
  void
>;

const DefaultFallback = () => <>Loading...</>;
export const ReactAppPluginSuspense: PluginTypes['Plugin'] = ({
  Fallback = DefaultFallback,
} = {}): PluginTypes['PluginModule'] => {
  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <React.Suspense fallback={<Fallback />}>{children}</React.Suspense>
  );
  const build: PluginTypes['InstanceBuilder'] = () => {
    const injections: PluginTypes['AppInjections'] = {
      onDidMountAsyncRace: [],
      onDidMountAsyncSequence: [],
      onDidMountSync: [],
      onInit: [],
      onWillUnmount: [],
      wrappers: [Wrapper],
    };
    return {
      exports: undefined,
      injections,
    };
  };

  return {
    name: 'react-app-plugin-suspense',
    version: '0.0.0',
    requireBeforeBuild: [],
    build,
  };
};
