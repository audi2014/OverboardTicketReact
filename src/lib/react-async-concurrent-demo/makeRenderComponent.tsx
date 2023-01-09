import { RenderComponentType } from 'lib/react-async-concurrent/component.types';
import React from 'react';

type MakeRenderComponent = (props: {
  alwaysShowChildren: boolean;
}) => RenderComponentType<number>;

export const makeRenderComponent: MakeRenderComponent = (props) => {
  const RenderComponent: RenderComponentType<number> = (state) => {
    const result = state.status === 'result' ? state.result : state.lastResult;
    const resultElement = Number.isFinite(result) ? (
      <p style={{ color: 'green' }}>Result: {result}</p>
    ) : null;

    const errorElement =
      state.status === 'error' ? (
        <p style={{ color: 'red' }}>{String(state.error)}</p>
      ) : null;

    const progressElement =
      state.status === 'progress' ? <p style={{ color: 'blue' }}>Progress...</p> : null;
    const pendingElement =
      state.status === 'pending' ? <p style={{ color: 'gray' }}>Pending...</p> : null;

    return (
      <>
        {pendingElement}
        {progressElement}
        {errorElement}
        {resultElement}
        {props.alwaysShowChildren
          ? resultElement && state.children
          : state.status === 'result'
          ? state.children
          : null}
      </>
    );
  };
  return RenderComponent;
};