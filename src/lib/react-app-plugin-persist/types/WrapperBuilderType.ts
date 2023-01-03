import {
  PluginInitParamsType,
  ReactComponentWrapperType,
} from 'lib/react-app-plugin/types/PluginInterface';

import { PersistPluginType } from './index';

export type WrapperBuilderType = (
  params: PluginInitParamsType,
  plugin: PersistPluginType,
) => ReactComponentWrapperType;
