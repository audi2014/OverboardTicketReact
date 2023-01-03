import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ConfigureStoreOptions } from '@reduxjs/toolkit/src/configureStore';
import { counterSlice } from 'integration/redux/features/counter/counterSlice';

export const allReducers = combineReducers({
  [counterSlice.name]: counterSlice.reducer,
});
const options: ConfigureStoreOptions = {
  reducer: allReducers,
  // preloadedState: {
  //   [counterSlice.name]: { foo: 'bar' },
  // },
};

export const store = configureStore(options);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
