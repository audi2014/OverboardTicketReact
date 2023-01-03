import { ObservableInterface } from 'lib/react-app-plugin/types/ObservableInterface';

import {
  PersistControllerConfigType,
  PersistControllerInterface,
} from './PersistControllerInterface';
import { SerializerInterface } from './SerializerInterface';
import { StateControllerInterface } from './StateControllerInterface';
import { StorageInterface } from './StorageInterface';
import { WrapperBuilderType } from './WrapperBuilderType';

export type PersistPluginType = {
  config: PersistControllerConfigType;
  stateController: StateControllerInterface;
  storage: StorageInterface;
  serializer: SerializerInterface;
  persistController: PersistControllerInterface;
  wrapperBuilder: WrapperBuilderType;
  isStarted: ObservableInterface<
    {
      isStarted: boolean;
    },
    'isStarted'
  >;
};

export type ConstructorParamsType<> = Pick<
  PersistPluginType,
  'config' | 'stateController'
> &
  Partial<PersistPluginType>;
