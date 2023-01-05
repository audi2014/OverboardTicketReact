import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { CreateStoreParamsType } from 'lib/react-app-plugin-redux';

import { counterSlice } from './features/example/counterSlice';

export const createStore = async ({ preloadedState }: CreateStoreParamsType) => {
  return configureStore({
    reducer: combineReducers({
      [counterSlice.name]: counterSlice.reducer,
    }),
    preloadedState: preloadedState,
  });
};

export type StoreType = Awaited<ReturnType<typeof createStore>>;
export type RootState = ReturnType<StoreType['getState']>;
export type AppDispatch = StoreType['dispatch'];
