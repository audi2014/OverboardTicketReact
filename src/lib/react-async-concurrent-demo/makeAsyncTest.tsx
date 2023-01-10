import Async from 'lib/react-async-concurrent';
import { RenderAnyType } from 'lib/react-async-concurrent/component.types';
import { ConfigPropsType } from 'lib/react-async-concurrent/index.types';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { delay } from './delay';

type FormProps = {
  alwaysShowChildren: boolean;
  count: number;
  chCount: number;
  ms: number;
} & ConfigPropsType;

type AsyncTestComponent = React.ComponentType<
  PropsWithChildren<{
    initialValues?: Partial<FormProps>;
  }>
>;

export type MakeChildrenElements = (data: FormProps) => JSX.Element[];

type MakeAsyncTestComponent = (props: {
  makeChildrenElements: MakeChildrenElements | null;
}) => AsyncTestComponent;

export const RenderComponent: RenderAnyType<number> = (state) => {
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
    </>
  );
};

export const makeAsyncTest: MakeAsyncTestComponent = (config) => {
  const AsyncTest: AsyncTestComponent = ({ initialValues, children }) => {
    const [count, setCount] = useState(initialValues?.count ?? 0);
    useEffect(() => {
      setCount(initialValues?.count ?? 0);
    }, [initialValues?.count]);

    const [ms, setMs] = useState(initialValues?.ms ?? 1000);
    const [chCount, setChCount] = useState(initialValues?.chCount ?? 0);
    const [alwaysShowChildren, setAlwaysShowChildren] = useState(
      initialValues?.alwaysShowChildren ?? false,
    );
    const [asyncStart, setAsyncStart] = useState(initialValues?.asyncStart ?? false);
    const [asyncChildren, setAsyncChildren] = useState(
      initialValues?.asyncChildren ?? false,
    );
    const [awaited, setAwaited] = useState(initialValues?.awaited ?? true);

    const task = useCallback(() => delay(count * 10, ms), [count, ms]);

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
          {config.makeChildrenElements ? (
            <span>
              <input
                style={{ width: 40 }}
                type={'number'}
                min={0}
                step={1}
                value={chCount}
                onChange={(e) => setChCount(+e.target.value)}
              />
              {' children; '}
            </span>
          ) : null}
          <span>
            <input
              type={'checkbox'}
              checked={alwaysShowChildren}
              onChange={(e) => setAlwaysShowChildren(e.target.checked)}
            />
            {' alwaysShowChildren; '}
          </span>
          <br />
          <span>
            <input
              type={'checkbox'}
              checked={asyncStart}
              onChange={(e) => setAsyncStart(e.target.checked)}
            />
            {' asyncStart; '}
          </span>
          <span>
            <input
              type={'checkbox'}
              checked={asyncChildren}
              onChange={(e) => setAsyncChildren(e.target.checked)}
            />
            {' asyncChildren; '}
          </span>
          <span>
            <input
              type={'checkbox'}
              checked={awaited}
              onChange={(e) => setAwaited(e.target.checked)}
            />
            {' awaited; '}
          </span>
        </p>
        <p>
          <input
            type={'number'}
            value={count}
            onChange={(e) => setCount(+e.target.value)}
          />{' '}
          calculate
        </p>
        <Async
          promiseFn={task}
          asyncStart={asyncStart}
          asyncChildren={asyncChildren}
          awaited={awaited}
        >
          {(taskState) => (
            <>
              <RenderComponent {...taskState} />
              {alwaysShowChildren || taskState.status === 'result' ? (
                <>
                  {config.makeChildrenElements &&
                    config.makeChildrenElements({
                      count,
                      chCount,
                      ms,
                      asyncStart,
                      asyncChildren,
                      awaited,
                      alwaysShowChildren,
                    })}
                  {children}
                </>
              ) : null}
            </>
          )}
        </Async>
      </fieldset>
    );
  };
  return AsyncTest;
};
