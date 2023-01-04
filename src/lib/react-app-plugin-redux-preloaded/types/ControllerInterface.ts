import { PluginFieldsType, PreloadedStateType } from './index';

export type ControllerInitParams = Pick<
  PluginFieldsType,
  'config' | 'storage' | 'serializer' | 'getStateBeforeSave'
>;

export interface ControllerInterface {
  init(context: ControllerInitParams): Promise<void>;

  start(): Promise<void>;

  stop(): Promise<void>;

  save(): Promise<void>;

  load(): Promise<PreloadedStateType | undefined>;
}
