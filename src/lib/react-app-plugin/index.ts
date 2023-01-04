import React from 'react';

import { EventBuss } from './impl/EventBuss';
import { Observable } from './impl/Observable';
import { PluginContainer } from './impl/PluginContainer';
import { wrapperHoc } from './impl/wrapperHoc';
import {
  ContextValueType,
  PluginInitParamsType,
  PluginInterface,
  ReactContextType,
} from './types/PluginInterface';
import { WrapperComponentType } from './types/WrapperHocType';

export type InitPluginsType = (plugins: PluginInterface[]) => PluginInitParamsType;

export const initPlugins: InitPluginsType = (plugins) => {
  const container: ContextValueType['container'] = new PluginContainer();
  const eventBuss: ContextValueType['eventBuss'] = new EventBuss();

  const observable: ContextValueType['observable'] = {
    willInit: new Observable(container, 'willInit', eventBuss),
    didInit: new Observable(container, 'didInit', eventBuss),
    didInitAll: new Observable(container, 'didInitAll', eventBuss),
  };

  const contextValue: ContextValueType = {
    container,
    eventBuss,
    observable,
  };
  const context: ReactContextType = React.createContext(contextValue);
  const Wrapper: WrapperComponentType = wrapperHoc(contextValue, context);
  const pluginInitParams: PluginInitParamsType = {
    ...contextValue,
    context,
    Wrapper,
  };

  (async () => {
    await container.init({ plugins, ...pluginInitParams });
  })().catch(console.error);

  return pluginInitParams;
};

export default initPlugins;
