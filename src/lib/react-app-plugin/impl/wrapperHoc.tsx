import React from 'react';

import { WrapperComponentType, WrapperHocType } from '../types/WrapperHocType';
import { useObservableValue } from './useObservableValue';

export const wrapperHoc: WrapperHocType = ({ eventBuss, observable }) => {
  const WrapperComponent: WrapperComponentType = ({ App, Loader, children }) => {
    const didInitValue = useObservableValue(observable.didInitAll.listener);

    React.useEffect(() => {
      eventBuss.publisher.emit('componentDidMount', undefined).catch(console.error);
      return () => {
        eventBuss.publisher.emit('componentWillUnmount', undefined).catch(console.error);
      };
    }, []);
    if (didInitValue.isInitialized) {
      const root = App ? <App>{children}</App> : <>{children}</>;
      return didInitValue.wrappers
        .reverse()
        .map((C) => {
          C.displayName = `${WrapperComponent.name}(${C.displayName || C.name})`;
          return C;
        })
        .reduce<React.ReactElement>(
          (prev, Component) => <Component>{prev}</Component>,
          root,
        );
    }

    if (Loader) {
      return <Loader />;
    }

    return null;
  };
  WrapperComponent.displayName = WrapperComponent.name;
  return WrapperComponent;
};
