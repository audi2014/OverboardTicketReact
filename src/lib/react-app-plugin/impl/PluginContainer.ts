import React from 'react';

import {
  InitParams,
  InstanceGetterType,
  PluginContainerInterface,
  TypeOrTokenType,
} from '../types/PluginContainerInterface';
import { PluginInterface } from '../types/PluginInterface';

export type MapItemType = { plugin: PluginInterface; isInitialized: boolean };

export class PluginContainer implements PluginContainerInterface {
  protected readonly _map: Record<string, MapItemType> = {};
  protected readonly _wrappers: React.ComponentType[] = [];
  protected _isInitialized = false;

  protected getPluginName = (p: PluginInterface) =>
    p?.constructor?.name || (p as unknown as string);

  protected getUnsafe = <TInput = unknown>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    typeOrToken: TypeOrTokenType<TInput> | Function,
  ) => {
    return this._map[typeOrToken.name] || this._map[typeOrToken as unknown as string];
  };

  async init({ plugins, ...pluginInitParams }: InitParams) {
    const {
      observable: { willInit, didInit, didInitAll },
    } = pluginInitParams;
    for (const plugin of plugins) {
      const name = this.getPluginName(plugin);
      if (this._map[name]) throw new Error(`Plugin with name ${name} already registered`);
      this._map[this.getPluginName(plugin)] = {
        plugin,
        isInitialized: false,
      };
    }
    for (const plugin of plugins) {
      await willInit.publisher.update(this);
      const result = await plugin.init(pluginInitParams);
      this._map[this.getPluginName(plugin)].isInitialized = true;
      if (result?.Wrapper) {
        this._wrappers.push(result.Wrapper);
      }
      await didInit.publisher.update(this);
    }
    await didInitAll.publisher.update(this);
    this._isInitialized = true;
  }

  get: InstanceGetterType = (typeOrToken) => {
    const item = this.getUnsafe(typeOrToken);
    if (!item) throw new Error(`Plugin ${typeOrToken?.name ?? typeOrToken} no found`);
    else if (!item.isInitialized)
      throw new Error(`Plugin ${typeOrToken?.name ?? typeOrToken} is not initialized`);
    return item.plugin as never;
  };

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  get wrappers(): React.ComponentType<React.PropsWithChildren>[] {
    return this._wrappers;
  }
}
