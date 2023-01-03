import { SerializerInterface } from './SerializerInterface';
import { StateControllerInterface } from './StateControllerInterface';
import { StorageInterface } from './StorageInterface';

export type PersistControllerConfigType = {
  readonly key: string;
  readonly blacklist?: string[];
  readonly whitelist?: string[];
};

export type PersistControllerInitParams = {
  config: PersistControllerConfigType;
  storage: StorageInterface;
  serializer: SerializerInterface;
  stateController: StateControllerInterface;
};

export interface PersistControllerInterface {
  init(context: PersistControllerInitParams): Promise<void>;

  start(): Promise<void>;

  stop(): Promise<void>;

  save(): Promise<void>;

  load(): Promise<void>;
}
