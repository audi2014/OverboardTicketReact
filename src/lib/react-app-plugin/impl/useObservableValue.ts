import React from 'react';

import { ObservableInterface } from '../types/ObservableInterface';

export const useObservableValue = <V>(l: ObservableInterface<V>['listener']): V => {
  const [state, setState] = React.useState<V>(l.getValue());
  React.useEffect(() => {
    return l.on((v) => setState(v as V));
  }, [l]);
  return state;
};
