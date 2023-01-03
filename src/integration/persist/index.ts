import { AnyAction, createAction } from '@reduxjs/toolkit';
import { RootState, store } from 'integration/redux/store';
import { ConstructorParamsType } from 'lib/react-app-plugin-persist/types';

const getRootState = () => store.getState();

const setRootStateAction = createAction<Partial<RootState>>('@@root/setRootState');
export const rootReducer = <S>(state: S, action: AnyAction) => {
  switch (action.type) {
    case setRootStateAction.type:
      return {
        ...state,
        ...action.payload,
      };
  }
  return state;
};

export const persistParams: ConstructorParamsType = {
  config: {
    key: 'ReactAppPluginPersist',
  },
  stateController: {
    getState: getRootState,
    setState: async (state) => {
      store.dispatch(setRootStateAction(state));
    },
  },
};
