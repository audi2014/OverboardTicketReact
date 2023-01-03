import {
  InstanceGetterType,
  PluginContainerInterface,
} from '../types/PluginContainerInterface';
import { PluginInterface } from '../types/PluginInterface';

const getName = (p: PluginInterface) => p?.constructor?.name || (p as unknown as string);

export class PluginContainer implements PluginContainerInterface {
  protected readonly map: Record<string, PluginInterface> = {};
  init(array: PluginInterface[]) {
    for (const p of array) {
      const name = getName(p);
      if (this.map[name]) throw new Error(`Plugin with name ${name} already registered`);
      this.map[getName(p)] = p;
    }
  }

  get: InstanceGetterType = (typeOrToken, strict) => {
    const p = this.map[typeOrToken.name] || this.map[typeOrToken as unknown as string];
    if (!p && strict)
      throw new Error(`Plugin ${typeOrToken?.name ?? typeOrToken} no found`);
    return p as never;
  };
}
