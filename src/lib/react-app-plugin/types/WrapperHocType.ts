import React from 'react';

import { ContextValueType, ReactContextType } from './PluginInterface';

export type WrapperPropsType = {
  Loader?: React.ComponentType;
  loader?: React.ReactNode;
  App?: React.ComponentType<React.PropsWithChildren>;
};

export type WrapperComponentType = React.ComponentType<
  React.PropsWithChildren<WrapperPropsType>
>;

export type WrapperHocType = (
  pluginRoot: ContextValueType,
  context: ReactContextType,
) => WrapperComponentType;
