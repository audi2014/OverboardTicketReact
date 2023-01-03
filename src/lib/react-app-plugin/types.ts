import { AppInjections, InstanceBuilder, Plugin, PluginModule } from './typesPlugin';

export type TypesBasePlugin<CONFIG, EXPORTS> = {
  Config: CONFIG;
  Exports: EXPORTS;
  Plugin: Plugin<CONFIG, EXPORTS>;
  PluginModule: PluginModule<EXPORTS>;
  InstanceBuilder: InstanceBuilder<EXPORTS>;
  AppInjections: AppInjections;
};
