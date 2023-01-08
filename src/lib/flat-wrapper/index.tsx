import React, {
  ComponentType,
  createContext,
  LazyExoticComponent,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export const FlatWrapper: ComponentType<PropsWithChildren> = ({ children }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const i = setInterval(() => {
      setCount((v) => v + 1);
    }, 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <fieldset>
      {count}
      <>{children}</>
    </fieldset>
  );
};

type ContextPromiseResult = {
  isCanceled: boolean;
};
type ContextPromise = Promise<ContextPromiseResult>;
type ContextPromiseCancel = (v: typeof Cancel | PromiseLike<typeof Cancel>) => void;

const context = createContext<{
  promise: ContextPromise;
}>({
  promise: Promise.resolve({
    isCanceled: false,
  }),
});

const Cancel = Symbol('AsyncGuard Cancel');

const AsyncGuard = <TaskResult,>({
  task,
  children,
  onPending,
  onProgress,
  onError,
}: {
  task: () => Promise<TaskResult>;
  children: ((v: TaskResult) => ReactElement)[] | ((v: TaskResult) => ReactElement);
  onPending?: () => ReactElement;
  onProgress?: () => ReactElement;
  onError?: (error: unknown) => ReactElement;
} & (
  | {
      children: (v: TaskResult) => ReactElement;
    }
  | {
      children: ((v: TaskResult) => ReactElement)[];
    }
)) => {
  const ctx = useContext(context);
  const contextPromiseCancelRef = useRef<ContextPromiseCancel>();
  const [state, setState] = useState<
    | {
        error: unknown;
      }
    | {
        result: TaskResult;
      }
    | 'pending'
    | 'progress'
  >('pending');

  useEffect(() => {
    setState('pending');
    ctx.promise = ctx.promise
      .then((r) => {
        setState('progress');
        return new Promise<TaskResult | typeof Cancel>((resolve) => {
          contextPromiseCancelRef.current = resolve;
          task().then(resolve);
        });
      })
      .then((success) => {
        if (success === Cancel) {
          return { isCanceled: true };
        }
        setState({ result: success });
        return { isCanceled: false };
      })
      .catch((error) => {
        setState({ error });
        return { isCanceled: false };
      });

    return () => {
      if (contextPromiseCancelRef.current) {
        setState('pending');
        contextPromiseCancelRef.current(Cancel);
      }
    };
  }, [ctx, task]);

  if (state === 'progress') {
    return (onProgress && onProgress()) || null;
  }
  if (state === 'pending') {
    return (onPending && onPending()) || null;
  }
  if ('result' in state) {
    const array = Array.isArray(children) ? children : [children];
    return (
      <>
        {array.map((e, key) => (
          <React.Fragment key={key}>{e(state.result)}</React.Fragment>
        ))}
      </>
    );
  }
  if ('error' in state) {
    if (onError) return onError(state.error);
    throw state.error;
  }

  return null;
};

/// TESTS -----------------
const delay = <T,>(v?: T, ms = 1000) => new Promise((r) => setTimeout(() => r(v), ms));

const Test: React.ComponentType<{
  ms: number;
  parentCount: number;
  children?: ((v: number) => JSX.Element)[];
}> = ({ ms, parentCount, children = [] }) => {
  const [count, setCount] = useState(parentCount);
  const task = useCallback(
    () =>
      delay(count, ms).then(() => {
        console.log(`task.done: count: ${count} ms: ${ms}`);
        return count;
      }),
    [count, ms],
  );
  return (
    <fieldset>
      <button onClick={() => setCount((v) => v + 1)}>{count}</button>
      <AsyncGuard
        task={task}
        onError={(error) => <p>{String(error)}</p>}
        onPending={() => <p style={{ color: 'gray' }}>Pending...</p>}
        onProgress={() => <p style={{ color: 'blue' }}>Progress...</p>}
      >
        {[
          //
          (r) => <p style={{ color: 'red' }}>Result: {r}</p>,
          (r) => (
            <>
              {children.map((ch, key) => (
                <React.Fragment key={key}>{ch(r * 10)}</React.Fragment>
              ))}
            </>
          ),
        ]}
      </AsyncGuard>
    </fieldset>
  );
};

const ms1 = 1000;
const ms2 = 2000;

export const test = (
  <FlatWrapper>
    <Test parentCount={1} ms={ms1}>
      {[
        //
        (prev) => <Test parentCount={prev + 1} ms={ms2}></Test>,
        (prev) => <Test parentCount={prev + 2} ms={ms2}></Test>,
        (prev) => <Test parentCount={prev + 3} ms={ms2}></Test>,
      ]}
    </Test>
    {/*<Test parentCount={1} ms={ms1}>*/}
    {/*  {[*/}
    {/*    //*/}
    {/*    (prev) => <Test parentCount={prev + 1} ms={ms2} />,*/}
    {/*    (prev) => <Test parentCount={prev + 2} ms={ms2} />,*/}
    {/*    (prev) => <Test parentCount={prev + 3} ms={ms2} />,*/}
    {/*  ]}*/}
    {/*</Test>*/}
  </FlatWrapper>
);
