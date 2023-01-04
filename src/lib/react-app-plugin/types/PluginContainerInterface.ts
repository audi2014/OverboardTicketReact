import React from 'react';

import { PluginInitParamsType, PluginInterface } from './PluginInterface';

export interface TypeOrTokenType<T = unknown> extends Function {
  new (...args: unknown[]): T;
}

export type InstanceGetterType = <TInput = unknown, TResult = TInput>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  typeOrToken: TypeOrTokenType<TInput> | Function,
) => TResult;

export type InitParams = PluginInitParamsType & {
  plugins: PluginInterface[];
};

export interface PluginContainerInterface {
  init(params: InitParams): Promise<void>;
  get: InstanceGetterType;
  get wrappers(): React.ComponentType<React.PropsWithChildren>[];
  get isInitialized(): boolean;
}
