import { ObservableInterface } from 'lib/react-app-plugin/types/ObservableInterface';

import { ControllerInterface } from './ControllerInterface';
import { SerializerInterface } from './SerializerInterface';
import { StorageInterface } from './StorageInterface';

export type ExternalStateType = { [key: string]: unknown };
export type PreloadedStateType = { [key: string]: unknown };

export type ConfigType = {
  readonly key: string;
  readonly blacklist?: string[];
  readonly whitelist?: string[];
};

export type PluginFieldsType = {
  config: ConfigType;
  getStateBeforeSave: () => Promise<ExternalStateType>;
  storage: StorageInterface;
  serializer: SerializerInterface;
  controller: ControllerInterface;
  loaded: ObservableInterface<PreloadedStateType | undefined>;
};

export type ConstructorParamsType = Partial<PluginFieldsType> &
  Pick<PluginFieldsType, 'getStateBeforeSave'>;
