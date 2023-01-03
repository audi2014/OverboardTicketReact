import React from 'react';

import { EventBussInterface } from './EventBussInterface';
import { ObservableInterface } from './ObservableInterface';
import { PluginContainerInterface } from './PluginContainerInterface';
import { WrapperComponentType } from './WrapperHocType';

export type ReactComponentWrapperType = React.ComponentType<React.PropsWithChildren>;

export type PluginEventsType = {
  didInitAll: { wrappers: ReactComponentWrapperType[] } | void;
  willInit: { pending: PluginInterface; all: PluginInterface[] } | void;
};
export type ComponentEventsType = {
  componentDidMount: void;
  componentWillUnmount: void;
};

export type ContextValueType = {
  container: PluginContainerInterface;
  eventBuss: EventBussInterface<PluginEventsType & ComponentEventsType>;
  didInit: ObservableInterface<PluginEventsType, 'didInitAll'>;
  willInitPlugin: ObservableInterface<PluginEventsType, 'willInit'>;
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
