import React from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { counterSlice } from './counterSlice';

export const Counter = () => {
  // The `state` arg is correctly typed as `RootState` already
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(counterSlice.actions.increment())}>+{count}</button>
  );
};
