import { PluginMeta, PluginModule, Registry, Resolver } from './typesPlugin';

const formatModule = (module: PluginMeta) => `${module.name}@${module.version}`;

const validateModuleForRegistry = (
  plugins: Registry['plugins'],
  module: PluginModule<unknown>,
) => {
  const moduleName = formatModule(module);
  if (plugins[module.name]) {
    const duplicate = plugins[module.name];
    const duplicateName = formatModule(duplicate);
    throw new Error(`Module ${moduleName} already registered as ${duplicateName}`);
  }
  if (module.requireBeforeBuild?.length) {
    for (const requireKey of module.requireBeforeBuild) {
      if (!plugins[requireKey]) {
        throw new Error(
          `Plugin ${moduleName} requireBeforeInit ${requireKey}. Plugin ${requireKey} is not registered`,
        );
      }
    }
  }
};

const processPluginModule = (
  module: PluginModule<unknown>,
  { plugins, injections }: Registry,
) => {
  const moduleName = formatModule(module);
  validateModuleForRegistry(plugins, module);
  const plugin = {
    ...module.build({ plugins }),
    name: module.name,
    version: module.version,
  };
  plugins[module.name] = plugin;

  const {
    wrappers = [],
    onInit = [],
    onDidMountSync = [],
    onDidMountAsyncRace = [],
    onDidMountAsyncSequence = [],
    onWillUnmount = [],
  } = plugin.injections;

  for (const w of wrappers) {
    if (typeof w !== 'symbol') {
      w.displayName = `Wrapper-${moduleName}-${w.displayName || w.name}`;
    }
  }
  injections.wrappers.push(...wrappers);
  injections.onInit.push(...onInit);
  injections.onDidMountSync.push(...onDidMountSync);
  injections.onDidMountAsyncRace.push(...onDidMountAsyncRace);
  injections.onDidMountAsyncSequence.push(...onDidMountAsyncSequence);
  injections.onWillUnmount.push(...onWillUnmount);
};

export const defaultResolver: Resolver = (modules) => {
  const registry: Registry = {
    injections: {
      wrappers: [],
      onInit: [],
      onDidMountSync: [],
      onDidMountAsyncRace: [],
      onDidMountAsyncSequence: [],
      onWillUnmount: [],
    },
    plugins: {},
  };
  for (const m of modules) {
    processPluginModule(m, registry);
  }
  return registry;
};
