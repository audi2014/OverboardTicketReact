import React from 'react';

import { PluginModule, Resolver } from './typesPlugin';
import { Logger } from './typesUtils';

export type PluginWrapperBuilderOptions = {
  plugins: PluginModule<unknown>[];
  resolver: Resolver;
  logger: Logger;
};

export type PluginWrapperBuilder = (
  options: Partial<PluginWrapperBuilderOptions>,
) => React.FC<React.PropsWithChildren>;
