import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { counterSlice } from 'integration/redux/features/counter/counterSlice';
import { CreateStoreParamsType } from 'lib/react-app-plugin-redux';

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
