import React from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { counterSlice } from './counterSlice';

export const ReduxExample = () => {
  // The `state` arg is correctly typed as `RootState` already
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <fieldset>
      <h3>ReduxExample</h3>
      <button onClick={() => dispatch(counterSlice.actions.increment())}>+{count}</button>
    </fieldset>
  );
};
