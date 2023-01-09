import Async from 'lib/react-async-concurrent';
import { RenderComponentType } from 'lib/react-async-concurrent/component.types';
import { ConfigPropsType } from 'lib/react-async-concurrent/index.types';
import React, { PropsWithChildren, useCallback, useState } from 'react';

import { delay } from './delay';

type AsyncTestComponent = React.ComponentType<
  PropsWithChildren<{
    initialValues?: {
      ms?: number;
      result?: number;
      chCount?: number;
    } & Partial<ConfigPropsType>;
  }>
>;

export type MakeChildrenElements = (data: {
  result: number;
  chCount: number;
  ms: number;
  wait: boolean;
  blockNext: boolean;
  blockChildren: boolean;
}) => JSX.Element[];

type MakeAsyncTestComponent = (props: {
  Render: RenderComponentType<number>;
  makeChildrenElements: MakeChildrenElements;
}) => AsyncTestComponent;

export const makeAsyncTest: MakeAsyncTestComponent = (config) => {
  const AsyncTest: AsyncTestComponent = ({ initialValues, children }) => {
    const [ms, setMs] = useState(initialValues?.ms ?? 1000);
    const [chCount, setChCount] = useState(initialValues?.chCount ?? 0);
    const [wait, setWait] = useState(initialValues?.wait ?? true);
    const [blockNext, setBlockNext] = useState(initialValues?.blockNext ?? true);
    const [blockChildren, setBlockChildren] = useState(
      initialValues?.blockChildren ?? true,
    );

    const [result, setResult] = useState(initialValues?.result ?? 0);
    const task = useCallback(() => delay(result, ms), [result, ms]);

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
              value={chCount}
              onChange={(e) => setChCount(+e.target.value)}
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
          Render={config.Render}
        >
          {config.makeChildrenElements({
            result,
            chCount,
            ms,
            wait,
            blockNext,
            blockChildren,
          })}
          {children}
        </Async>
      </fieldset>
    );
  };
  return AsyncTest;
};
