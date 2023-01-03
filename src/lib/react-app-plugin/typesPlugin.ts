import React from 'react';

import { AsyncTask, SyncTask } from './typesUtils';

export type AppInjections = {
  wrappers: React.ComponentType<React.PropsWithChildren>[];
  onInit: SyncTask[];
  onDidMountSync: SyncTask[];
  onDidMountAsyncRace: AsyncTask[];
  onDidMountAsyncSequence: AsyncTask[];
  onWillUnmount: SyncTask[];
};

export type PluginMeta = {
  name: string;
  version: string;
};

export type PluginInstance<EXPORTS> = PluginMeta & {
  injections: AppInjections;
  exports: EXPORTS | null;
};

export type InstanceBuilder<EXPORTS> = (options: {
  plugins: Record<string, PluginInstance<unknown>>;
}) => Omit<PluginInstance<EXPORTS>, 'name' | 'version'>;

export type PluginModule<EXPORTS> = PluginMeta & {
  requireBeforeBuild: string[];
  build: InstanceBuilder<EXPORTS>;
};

export type Plugin<CONFIG, EXPORTS> = (config: CONFIG) => PluginModule<EXPORTS>;

export type Registry = {
  plugins: Record<string, PluginInstance<unknown>>;
  injections: AppInjections;
};

export type Resolver = (plugins: PluginModule<unknown>[]) => Registry;
