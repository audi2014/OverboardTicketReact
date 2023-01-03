import React from 'react';

import { EventBuss } from './impl/EventBuss';
import { Observable } from './impl/Observable';
import { PluginContainer } from './impl/PluginContainer';
import { wrapperHoc } from './impl/wrapperHoc';
import { EventBussInterface } from './types/EventBussInterface';
import { ObservableInterface } from './types/ObservableInterface';
import { PluginContainerInterface } from './types/PluginContainerInterface';
import {
  ComponentEventsType,
  ContextValueType,
  PluginEventsType,
  PluginInitParamsType,
  PluginInterface,
  ReactContextType,
} from './types/PluginInterface';
import { WrapperComponentType } from './types/WrapperHocType';

export type InitPluginsType = (plugins: PluginInterface[]) => PluginInitParamsType;

export const initPlugins: InitPluginsType = (plugins) => {
  const container: PluginContainerInterface = new PluginContainer();
  const eventBuss: EventBussInterface<PluginEventsType & ComponentEventsType> =
    new EventBuss();
  const didInit: ObservableInterface<PluginEventsType, 'didInitAll'> = new Observable(
    undefined,
    'didInitAll',
    eventBuss,
  );
  const willInitPlugin: ObservableInterface<PluginEventsType, 'willInit'> =
    new Observable(undefined, 'willInit', eventBuss);

  const contextValue: ContextValueType = {
    container,
    eventBuss,
    didInit,
    willInitPlugin,
  };
  const context: ReactContextType = React.createContext(contextValue);
  const Wrapper: WrapperComponentType = wrapperHoc(contextValue, context);
  const pluginInitParams: PluginInitParamsType = {
    ...contextValue,
    context,
    Wrapper,
  };

  (async () => {
    container.init(plugins);
    const wrappers: React.ComponentType[] = [];
    for (const p of plugins) {
      await willInitPlugin.publisher.setValue({ pending: p, all: plugins });
      const result = await p.init(pluginInitParams);
      if (result?.Wrapper) {
        wrappers.push(result.Wrapper);
      }
    }
    await willInitPlugin.publisher.setValue(undefined);
    await didInit.publisher.setValue({ wrappers });
  })().catch(console.error);

  return pluginInitParams;
};

export default initPlugins;
