import { CancelablePromise } from 'cancelable-promise';
import Async from 'lib/react-async-concurrent';
import { RenderComponentType } from 'lib/react-async-concurrent/component.types';
import { ConfigPropsType } from 'lib/react-async-concurrent/index.types';
import React, { Fragment, useCallback, useState } from 'react';

/// TESTS -----------------
const delay = <T,>(v: T, ms = 1000) => {
  return new CancelablePromise<T>((resolve, reject, onCancel) => {
    console.log(`delay v=${v} ms=${ms} started...`);
    onCancel(() => {
      console.log(`delay v=${v} ms=${ms} Canceled`);
    });
    setTimeout(() => {
      resolve(v);
    }, ms);
  });
};

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
      {resultElement && state.children}
    </>
  );
};

const AsyncTest: React.ComponentType<{
  initialValues?: {
    ms?: number;
    result?: number;
    children?: number;
  } & Partial<ConfigPropsType>;
}> = ({
  //
  initialValues,
}) => {
  const [ms, setMs] = useState(initialValues?.ms ?? 1000);
  const [children, setChildren] = useState(initialValues?.children ?? 0);
  const [wait, setWait] = useState(initialValues?.wait ?? true);
  const [blockNext, setBlockNext] = useState(initialValues?.blockNext ?? true);
  const [blockChildren, setBlockChildren] = useState(
    initialValues?.blockChildren ?? true,
  );

  const [result, setResult] = useState(initialValues?.result ?? 0);
  const task = useCallback(() => delay(result, ms), [result, ms]);

  const childrenElements = new Array(children).fill(null).map((_, index) => (
    <AsyncTest
      key={index}
      initialValues={{
        ms,
        result: result + 1 + index,
        wait,
        blockNext,
        blockChildren,
      }}
    />
  ));
  return (
    <fieldset>
      <p>
        <span>
          <input
            style={{ width: 60 }}
            title={'ms'}
            type={'number'}
            min={0}
            step={500}
            value={ms}
            onChange={(e) => setMs(+e.target.value)}
          />
          {' ms; '}
        </span>
        <span>
          <input
            style={{ width: 40 }}
            type={'number'}
            min={0}
            step={1}
            value={children}
            onChange={(e) => setChildren(+e.target.value)}
          />
          {' children; '}
        </span>
        <span>
          <input
            type={'checkbox'}
            checked={wait}
            onChange={(e) => setWait(e.target.checked)}
          />
          {' wait; '}
        </span>
        <span>
          <input
            type={'checkbox'}
            checked={blockNext}
            onChange={(e) => setBlockNext(e.target.checked)}
          />
          {' blockNext; '}
        </span>
        <span>
          <input
            type={'checkbox'}
            checked={blockChildren}
            onChange={(e) => setBlockChildren(e.target.checked)}
          />
          {' blockChildren; '}
        </span>
      </p>
      <p>
        <input
          type={'number'}
          value={result}
          onChange={(e) => setResult(+e.target.value)}
        />{' '}
        calculate
      </p>
      <Async
        promiseFn={task}
        wait={wait}
        blockNext={blockNext}
        blockChildren={blockChildren}
        Render={RenderComponent}
      >
        {childrenElements}
      </Async>
    </fieldset>
  );
};

export const ReactAsyncConcurrentDemo = () => (
  <>
    <AsyncTest initialValues={{ children: 2 }} />
  </>
);
