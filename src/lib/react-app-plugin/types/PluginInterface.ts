import React from 'react';

import { EventBussInterface } from './EventBussInterface';
import { ObservableInterface } from './ObservableInterface';
import { PluginContainerInterface } from './PluginContainerInterface';
import { WrapperComponentType } from './WrapperHocType';

export type ReactComponentWrapperType = React.ComponentType<React.PropsWithChildren>;

export type PluginEventsType = {
  didInitAll: PluginContainerInterface;
  willInit: PluginContainerInterface;
  didInit: PluginContainerInterface;
};
export type ComponentEventsType = {
  componentDidMount: void;
  componentWillUnmount: void;
};

export type ContextValueType = {
  container: PluginContainerInterface;
  eventBuss: EventBussInterface<PluginEventsType & ComponentEventsType>;
  observable: {
    [key in keyof PluginEventsType]: ObservableInterface<PluginContainerInterface>;
  };
};

export type ReactContextType = React.Context<ContextValueType>;

export type PluginInitParamsType = ContextValueType & {
  context: ReactContextType;
  Wrapper: WrapperComponentType;
};

export interface PluginInterface {
  readonly version: string;
  readonly requireBeforeInit?: string[];
  init(params: PluginInitParamsType): Promise<{
    Wrapper?: ReactComponentWrapperType;
  } | void>;
}
