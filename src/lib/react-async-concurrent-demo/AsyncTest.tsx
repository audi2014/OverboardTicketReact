import Async from 'lib/react-async-concurrent';
import { ConfigPropsType } from 'lib/react-async-concurrent/index.types';
import { RenderComponent } from 'lib/react-async-concurrent-demo/RenderComponent';
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
export const AsyncTest: AsyncTestComponent = ({ initialValues, children }) => {
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
                {new Array(chCount).fill(null).map((_, index) => (
                  <AsyncTest
                    key={index}
                    initialValues={{
                      count: count * 10 + index,
                      chCount: 0,
                      ms,
                      awaited,
                      asyncStart,
                      asyncChildren,
                      alwaysShowChildren,
                    }}
                  />
                ))}
                {children}
              </>
            ) : null}
          </>
        )}
      </Async>
    </fieldset>
  );
};
