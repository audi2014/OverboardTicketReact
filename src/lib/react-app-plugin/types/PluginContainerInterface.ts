import { PluginInterface } from './PluginInterface';

export interface TypeOrTokenType<T = unknown> extends Function {
  new (...args: unknown[]): T;
}

export type InstanceGetterType = <TInput = unknown, TResult = TInput>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  typeOrToken: TypeOrTokenType<TInput> | Function,
  strict: boolean,
) => TResult;

export interface PluginContainerInterface {
  init(array: PluginInterface[]): void;
  get: InstanceGetterType;
}
