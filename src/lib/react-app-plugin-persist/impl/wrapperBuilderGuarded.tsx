import { useObservableValue } from 'lib/react-app-plugin/impl/useObservableValue';
import React, { PropsWithChildren } from 'react';

import { WrapperBuilderType } from '../types/WrapperBuilderType';

export const wrapperBuilderGuarded: WrapperBuilderType = (params, plugin) => {
  const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
    const isStarted = useObservableValue(plugin.isStarted.listener, 'isStarted');
    return (
      <>
        <h1>ReactAppPluginReduxPersistWrapper: isStarted = {isStarted ? '+' : '-'}</h1>
        {children}
      </>
    );
  };
  return Wrapper;
};
