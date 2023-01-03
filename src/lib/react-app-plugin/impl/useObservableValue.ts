import React from 'react';

import { ObservableInterface } from '../types/ObservableInterface';

export const useObservableValue = <
  EventData extends { [key: string]: unknown },
  E extends keyof EventData = keyof EventData,
  V extends EventData[E] = EventData[E],
>(
  l: ObservableInterface<EventData, E, V>['listener'],
  e: E,
): V => {
  const [state, setState] = React.useState<V>(l.getValue());
  React.useEffect(() => {
    return l.on(e, (v) => setState(v as V));
  }, [e, l]);
  return state;
};
